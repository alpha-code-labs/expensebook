import amqp from 'amqplib';
// import { fullUpdateTravel } from './messageProcessor/travel.js';
import dotenv from 'dotenv';
import { updateTrip, updateTripToCompleteOrClosed } from './messageProcessor/trip.js';
import { deleteReimbursement, updateReimbursement } from './messageProcessor/reimbursement.js';
import { fullUpdateExpense } from './messageProcessor/travelExpenseProcessor.js';
import { approveRejectCashRaisedLater, expenseReportApproval, nonTravelReportApproval } from './messageProcessor/dashboard.js';
import { settleNonTravelExpenseReport } from './messageProcessor/finance.js';
// import { fullUpdateExpense } from './messageProcessor/travelExpenseProcessor.js';
// import { updateTrip } from './messageProcessor/trip.js';
// import { fullUpdateCash, fullUpdateCashBatchJob } from './messageProcessor/cash.js';


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

  const handleMessageAcknowledgment = (channel,msg,res) => {
   try{
    if(res.success){
      channel.ack(msg)
      console.info('Message acknowledged Successfully')
    } else {
    // channel.noAck(msg, false, true)
    console.error('Error Processing message, requeuing')
    }

   } catch(error){
     console.error('error in ack of rabbitmq msg', error)
   }
  }
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
     const payload = content?.payload
     const source = content?.headers?.source
     const action = content?.headers?.action
     const isReporting = content?.headers?.destination == 'reporting'

      if(isReporting){

      switch(source){
        case 'onboarding':
        case 'system-config':
          const res = await update(payload)
          console.log(res)
          handleMessageAcknowledgment(channel,msg,res)  
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
                    console.log("results after trip status updated to completed or closed  ", result)
                    if(result.success) {
                        channel.ack(msg);
                        console.log('Message processed successfully');
                      } else {
                        // Implement retry mechanism or handle error
                        console.log('Update failed with error:', result.error);
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

        case 'expense':
        switch (action) {
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
    
        case 'dashboard':
          switch(action){
            case 'profile-update':
              const res7 = await updatePreferences(payload);
              console.log(res7)
              handleMessageAcknowledgment(channel, msg, res7);
              break;
            
            case 'approve-reject-ca-later':
              const res8 = await approveRejectCashRaisedLater(payload);
              console.log(res8)
              handleMessageAcknowledgment(channel, msg, res8);
              break;

            case 'expense-approval':
              const res9 = await expenseReportApproval(payload);
              console.log(res9)
              handleMessageAcknowledgment(channel, msg, res9);
              break;

            case 'nte-full-update':
              const res10 = await nonTravelReportApproval(payload);
              console.log(res10)
              handleMessageAcknowledgment(channel, msg, res10);
              break;

            default:
              console.warn(`Unknown action '${action}' for source ${source}`);
              break;
          }
          break;

          case 'finance':
            switch(action){
              case 'settle-ca':
              case 'recover-ca':
                console.log("settle-ca or recover-ca ")
                // channel.ack(msg)
               const res3 = await settleOrRecoverCashAdvance(payload);
                handleMessageAcknowledgment(channel, msg, res3);
                break;

              case 'expense-paid':
                console.log(" expense header status paid")
                const res4 = await settleExpenseReport(payload);
                handleMessageAcknowledgment(channel, msg, res4);
                break;
  
              case 'settle-expense-Paid-and-distributed':
                console.log(" expense header status paid and distributed")
               const res5 = await settleExpenseReportPaidAndDistributed(payload);
                handleMessageAcknowledgment(channel, msg, res5);
                break;
              
              case 'non-travel-paid':
                console.log(" expense header status paid - 'non-travel-paid'")
                const res6 = await settleNonTravelExpenseReport(payload);
                handleMessageAcknowledgment(channel, msg, res6);
                break;

              
              default:
                console.warn(`unknown action ${action} for source ${source}`)
                break;
            }
            break;

        default:
              console.log(`no action ${action} defined for source ${source}`)
        break;
        }

          //  else if (source == 'travel'){
          //   console.log('trying to update Travel')
          //   const res = await fullUpdateTravel(payload)
          //   console.log(res)
          //   if(res.success){
          //     //acknowledge message
          //     channel.ack(msg)
          //     console.log('message processed successfully')
          //   }
          //   else{
          //     //implement retry mechanism
          //     console.log('update failed with error code', res.error)
          //   }
          // } else if (source == 'cash'){
          //   if(action == 'full-update'){
          //     console.log('trying to update CashAdvanceSchema')
          //     const res = await fullUpdateCash(payload)
          //     console.log(res)
          //     if(res.success){
          //       //acknowledge message
          //       channel.ack(msg)
          //       console.log('message processed successfully')
          //     }
          //     else{
          //       //implement retry mechanism
          //       console.log('update failed with error code', res.error)
          //     }
          //   }
          //   if(action == 'full-update-batchjob'){
          //     console.log('trying to update CashAdvanceSchema')
          //     const res = await fullUpdateCashBatchJob(payload)
          //     console.log( " what i return",res)
          //     if(res.success){
          //       //acknowledge message
          //       channel.ack(msg)
          //       console.log('message processed successfully')
          //     }
          //     else{
          //       //implement retry mechanism
          //       console.log('update failed with error code', res.error)
          //     }
          //   }
          // } else if (source == 'expense'){
          //   if(action == 'full-update'){
          //   console.log('trying to update travelExpense Data')
          //   const res = await fullUpdateExpense(payload)
          //   console.log(res)
          //   if(res.success){
          //     //acknowledge message
          //     channel.ack(msg)
          //     console.log('message processed successfully')
          //   }
          //   else{
          //     //implement retry mechanism
          //     console.log('update failed with error code', res.error)
          //   }
          // }
          // } else if (source == 'reimbursement'){
          //   if (action == 'full-update') {
          //     console.log('Trying to update reimbursement Data');
          //       const results = await updateReimbursement(payload);
          //         if (results.success) {
          //           // Acknowledge message
          //           channel.ack(msg);
          //           console.log('Message processed successfully');
          //         } else {
          //           // Implement retry mechanism or handle error
          //           console.log('Update failed with error:', results.error);
          //         }
          //       } 
          //   if( action == 'delete'){    
          //     console.log('Trying to update reimbursement Data');
          //     const results = await deleteReimbursement(payload);
          //       if (results.success) {
          //         // Acknowledge message
          //         channel.ack(msg);
          //         console.log('Message processed successfully');
          //       } else {
          //         // Implement retry mechanism or handle error
          //         console.log('Update failed with error:', results.error);
          //       }

          //   }
          // } else if (source == 'trip'){
          //   if (action == 'trip-creation') {
          //     console.log('Trying to update trip Data ...............');
          //     if(Array.isArray(payload)){
          //       const results = await updateTrip(payload);
          //       console.log("results is iterable bbb", results)
          //       for (const res of results) {
          //         if (res.success) {
          //           // Acknowledge message
          //           channel.ack(msg);
          //           console.log('Message processed successfully');
          //         } else {
          //           // Implement retry mechanism or handle error
          //           console.log('Update failed with error:', res.error);
          //         }
          //       }
          //     } else{
          //       console.error(Error,"Payload is not an array");
          //     }

          //   }
          // } 
      }
    }}, { noAck: false });
}





