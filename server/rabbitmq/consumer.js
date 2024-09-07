import amqp from 'amqplib';
import { updateHRMaster } from './messageProcessor/hrMaster.js';
import { fullUpdateTravel, fullUpdateTravelBatchJob } from './messageProcessor/travel.js';
import dotenv from 'dotenv';
import { fullUpdateExpense, settleExpenseReport } from './messageProcessor/travelExpenseProcessor.js';
import { addLeg, updateTrip, updateTripStatus, updateTripToCompleteOrClosed } from './messageProcessor/trip.js';
import { cashStatusUpdatePaid, fullUpdateCash, fullUpdateCashBatchJob } from './messageProcessor/cash.js';
import { deleteReimbursement, updateReimbursement } from './messageProcessor/reimbursement.js';
import {  settleOrRecoverCashAdvance } from './messageProcessor/finance.js';
import { settleNonTravelExpenseReport } from './messageProcessor/nonTravelExpenseProcessor.js';

dotenv.config();
export async function startConsumer(receiver) {
  const rabbitMQUrl = process.env.rabbitMQUrl;
  let retryCount = 0;

  const connectToRabbitMQ = async () => {
    try {
      console.log("Connecting to RabbitMQ...");
      const connection = await amqp.connect(rabbitMQUrl);
      const channel = await connection.createChannel();
      console.log("Connected to RabbitMQ.");
      // Add error event listener to the connection
      connection.on("error", handleConnectionError);
      return channel; // Return the created channel
    } catch (error) {
      retryCount++;
      if (retryCount === 1) {
        console.error("Error connecting to RabbitMQ:", error);
      }
      if (retryCount === 3) {
        console.error("Failed after 3 times trying");
      } else {
        // Retry connection after 1 minute for the first two attempts, then after 3 minutes
        const retryDelay = retryCount <= 2 ? 1 : 3;
        console.log(`Retrying in ${retryDelay} minute(s)...`);
        setTimeout(connectToRabbitMQ, retryDelay * 60 * 1000);
      }
      return null; // Return null if connection fails
    }
  };

  const handleConnectionError = (err) => {
    console.error("RabbitMQ connection error:", err);
    // Retry connection after 3 minutes if the first attempt fails
    retryCount++;
    if (retryCount === 3) {
      console.error("Failed after 3 times trying");
    } else {
      const retryDelay = retryCount <= 2 ? 1 : 3;
      console.log(`Retrying in ${retryDelay} minute(s)...`);
      setTimeout(connectToRabbitMQ, retryDelay * 60 * 1000);
    }
  };

  const handleMessageAcknowledgment = (channel, msg, res) => {
    try{
      if (res.success) {
        channel.ack(msg);
        console.log('Message acknowledged successfully');
      } else {
        // channel.nack(msg, false, true);
        console.log('Error processing message, requeuing');
      }
    } catch(error){
      console.error('Error handling message acknowledgment:', error);
    }
  };
  
  // Start initial connection attempt
  const channel = await connectToRabbitMQ();
  if (!channel) {
    console.error("Failed to establish connection to RabbitMQ.");
    return; // Exit function if connection failed
  }
 
 const exchangeName = 'amqp.dashboard';
 const queue = `q.${receiver}`;
 const routingKey = `rk.${receiver}`;
 
 console.log(`Asserting exchange: ${exchangeName}`);
 await channel.assertExchange(exchangeName, 'direct', { durable: true });
 console.log(`Asserting queue: ${queue}`);
 await channel.assertQueue(queue, { durable: true });
 console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
 await channel.bindQueue(queue, exchangeName, routingKey);
 console.log('listening for messages. To exit press CTRL+C');
 
   // Listen for response
   channel.consume(queue, async (msg) => {
       if (msg && msg.content) {

     const content = JSON.parse(msg.content.toString());

     console.log(`coming from ${content.headers?.source} meant for ${content.headers?.destination}`)
     //console.log('payload', content?.payload)
     console.log('payload', content?.payload)
     console.log('action', content?.headers?.action)
     const payload = content?.payload
     const source = content?.headers?.source
     const action = content?.headers?.action
  
      if(content.headers.destination == 'dashboard'){

        switch (source) {
          case 'onboarding':
          case 'system-config':
            console.log('trying to update HR Master')
            const res = await updateHRMaster(payload)
            handleMessageAcknowledgment(channel, msg, res);
            break;
        
            case 'trip':
            switch (action) {
              case 'trip-creation':
                console.log('Trying to update trip Data ...............', payload);
                if(Array.isArray(payload)){
                  const results = await updateTrip(payload);
                  console.log("results is iterable bbb", results)
                  for (const res of results) {
                    if (res.success) {
                      // Acknowledge message
                      channel.ack(msg);
                      console.log('Message processed successfully');
                    } else {
                      // Implement retry mechanism or handle error
                      console.log('Update failed with error:', res.error);
                    }
                  }
                } else{
                  console.error(Error,"Payload is not an array");
                }
              break;
            
              case 'status-completed-closed':
                if(payload){
                  const result = await updateTripToCompleteOrClosed(payload)
                  console.log("results after trip status updated to completed or closed  ", results)
                  if(result.success) {
                      channel.ack(msg);
                      console.log('Message processed successfully');
                    } else {
                      // Implement retry mechanism or handle error
                      console.log('Update failed with error:', res.error);
                    }
                  }
                else{
                  console.error(Error,"Payload is not an array");
                }
                break;

              case 'add-leg':
                if(payload){
                  "i am in add a leg"
                  const response = await addLeg(payload)
                  handleMessageAcknowledgment(channel, msg, response);
                  }
                else{
                  console.error(Error,"Payload is not an array");
                }

              default:
                  console.warn(`Unknown action '${action}' for source ${source}`);
              break;
            }
            break;

          case 'travel':
            switch (action) {
              case 'full-update':
                console.log('trying to update Travel')
                const res1 = await fullUpdateTravel(payload)
                handleMessageAcknowledgment(channel, msg, res1);
                break;
              
              case 'full-update-batchjob':
                console.log('trying to update Travel BatchJob - Booking')
                const res2 = await fullUpdateTravelBatchJob(payload)
                handleMessageAcknowledgment(channel, msg, res2);
                break;
            
              default:
                console.warn(`Unknown action '${action}' for source ${source}`);
                break;
            }
            break;

          case 'cash':
            switch (action) {
              case 'full-update':
                console.log('trying to update CashAdvanceSchema')
              const res3 = await fullUpdateCash(payload)
              handleMessageAcknowledgment(channel, msg, res3);
                break;
            
              case 'full-update-batchjob':
                console.log('trying to update CashAdvanceSchema')
                const res4 = await fullUpdateCashBatchJob(payload)
                handleMessageAcknowledgment(channel, msg, res4);
                break;
              
              case 'status-update-batch-job':
                console.log('trying to update CashAdvanceSchema')
                const res5 = await cashStatusUpdatePaid(payload)
                handleMessageAcknowledgment(channel, msg, res5);
                break;
              

                default:
                  console.warn(`Unknown action '${action}' for source ${source}`);
                  break;
            }
            break;
          
          case 'expense':
            switch (key) {
              case 'full-update':
                console.log('trying to update travelExpense Data', payload)
                const res6 = await fullUpdateExpense(payload)
                handleMessageAcknowledgment(channel, msg, res6);
                break;
            
                default:
                console.warn(`Unknown action '${action}' for source ${source}`);
                break;
            }
            break;

          case 'reimbursement':
            switch (action) {
              case 'full-update':
                console.log('Trying to update reimbursement Data');
                const res7 = await updateReimbursement(payload);
                handleMessageAcknowledgment(channel, msg, res7);
                break;
            
              case 'delete':
                console.log('Trying to update reimbursement Data');
                const res8 = await deleteReimbursement(payload);
                handleMessageAcknowledgment(channel, msg, res8);
                break;


                default:
                console.warn(`Unknown action '${action}' for source ${source}`);
                break;
            }
            break;

          case 'finance':
            switch (action) {
              case 'settle-ca':
                console.log('settle-ca', payload);
                const res9 = await settleOrRecoverCashAdvance(payload);
                console.log("result for settle ca", res9)
                handleMessageAcknowledgment(channel, msg, res9);
                break;
              
              case 'expense-paid':
                console.log(" expense header status paid")
              const res10 = await settleExpenseReport(payload);
              handleMessageAcknowledgment(channel, msg, res10);
              break;

              case 'non-travel-paid':
                console.log(" expense header status paid - 'non-travel-paid'")
                const res11 = await settleNonTravelExpenseReport(payload);
                handleMessageAcknowledgment(channel, msg, res11);
            
                case 'recover-ca':
                  const res12 = await settleOrRecoverCashAdvance(payload)
                  console.log("result for recoverCashAdvance ", res12)
                  handleMessageAcknowledgment(channel, msg, res12);
                  break;


                default:
                  console.warn(`Unknown action '${action}' for source ${source}`);
                  break;
            }
            break;


          default:
            console.warn(`Unknown source ${source} for action ${action}`)
            break;
        }
      }
    }}, { noAck: false });
}




























//old code
// if(source == 'onboarding' || source == 'system-config'){
//   console.log('trying to update HR Master')
//   const res = await updateHRMaster(payload)
//   handleMessageAcknowledgment(channel, msg, res);

//   } else if (source == 'travel'){
//     if(action == 'full-update'){
//     console.log('trying to update Travel')
//     const res = await fullUpdateTravel(payload)
//     handleMessageAcknowledgment(channel, msg, res);
//     }
//     if(action=='full-update-batchjob'){
//     console.log('trying to update Travel BatchJob - Booking')
//      const res = await fullUpdateTravelBatchJob(payload)
//      handleMessageAcknowledgment(channel, msg, res);
//     }
//   } else if (source == 'cash'){ 
//     if(action == 'full-update'){
//       console.log('trying to update CashAdvanceSchema')
//       const res = await fullUpdateCash(payload)
//       handleMessageAcknowledgment(channel, msg, res);
//     }
//     if(action == 'full-update-batchjob'){
//       console.log('trying to update CashAdvanceSchema')
//       const res = await fullUpdateCashBatchJob(payload)
//       handleMessageAcknowledgment(channel, msg, res);
//     }
//     if(action == 'status-update-batch-job'){
//       console.log('trying to update CashAdvanceSchema')
//       const res = await cashStatusUpdatePaid(payload)
//       handleMessageAcknowledgment(channel, msg, res);
//     }
//   } else if (source == 'expense'){
//     if(action == 'full-update'){
//     console.log('trying to update travelExpense Data', payload)
//     const res = await fullUpdateExpense(payload)
//     handleMessageAcknowledgment(channel, msg, res);
//   }
//   } else if (source == 'reimbursement'){
//     if (action == 'full-update') {
//       console.log('Trying to update reimbursement Data');
//         const res = await updateReimbursement(payload);
//         handleMessageAcknowledgment(channel, msg, res);
//         } 
//     if( action == 'delete'){    
//       console.log('Trying to update reimbursement Data');
//       const res = await deleteReimbursement(payload);
//       handleMessageAcknowledgment(channel, msg, res);
//     }

//   } else if (source == 'trip'){
//     if (action == 'trip-creation') {
//       console.log('Trying to update trip Data ...............', payload);
//       if(Array.isArray(payload)){
//         const results = await updateTrip(payload);
//         console.log("results is iterable bbb", results)
//         for (const res of results) {
//           if (res.success) {
//             // Acknowledge message
//             channel.ack(msg);
//             console.log('Message processed successfully');
//           } else {
//             // Implement retry mechanism or handle error
//             console.log('Update failed with error:', res.error);
//           }
//         }
//       } else{
//         console.error(Error,"Payload is not an array");
//       }
//     }
//     if(action == 'status-completed-closed'){
//       if(payload){
//         const result = await updateTripToCompleteOrClosed(payload)
//         console.log("results after trip status updated to completed or closed  ", results)
//         if(result.success) {
//             channel.ack(msg);
//             console.log('Message processed successfully');
//           } else {
//             // Implement retry mechanism or handle error
//             console.log('Update failed with error:', res.error);
//           }
//         }
//       else{
//         console.error(Error,"Payload is not an array");
//       }
//     }
//     if(action == 'add-leg'){
//       if(payload){
//         "i am in add a leg"
//         const res = await addLeg(payload)
//         handleMessageAcknowledgment(channel, msg, res);
//         }
//       else{
//         console.error(Error,"Payload is not an array");
//       }
//     }
//   } else if (source == 'finance'){
//     if (action == 'settle-ca' ) {
//         console.log('settle-ca', payload);
//         const res = await settleOrRecoverCashAdvance(payload);
//         console.log("result for settle ca", res)
//         handleMessageAcknowledgment(channel, msg, res);
//     }
//     if(action == 'expense-paid') {
//       console.log(" expense header status paid")
//       const res = await settleExpenseReport(payload);
//       handleMessageAcknowledgment(channel, msg, res);
//   }
//   if(action ==  'non-travel-paid') {
//     console.log(" expense header status paid - 'non-travel-paid'")
//     const res = await settleNonTravelExpenseReport(payload);
//     handleMessageAcknowledgment(channel, msg, res);
//   }
//   if(action == 'recover-ca'){
//         const res = await settleOrRecoverCashAdvance(payload)
//         console.log("result for recoverCashAdvance ", res)
//         handleMessageAcknowledgment(channel, msg, res);
//   }
//   } 

