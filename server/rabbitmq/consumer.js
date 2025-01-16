import { updateHRMaster } from './messageProcessor/hrMaster.js';
import { fullUpdateTravel, fullUpdateTravelBatchJob } from './messageProcessor/travel.js';
import dotenv from 'dotenv';
import { fullUpdateExpense } from './messageProcessor/travelExpenseProcessor.js';
import { addLeg, updateTrip, updateTripStatus, updateTripToCompleteOrClosed } from './messageProcessor/trip.js';
import { cashStatusUpdatePaid, fullUpdateCash, fullUpdateCashBatchJob, onceCash } from './messageProcessor/cash.js';
import { deleteReimbursement, updateReimbursement } from './messageProcessor/reimbursement.js';
import {  settleExpenseReport, settleNonTravelExpenseReport, settleOrRecoverCashAdvance } from './messageProcessor/finance.js';
import { getRabbitMQConnection } from './connection.js';

dotenv.config();


export async function startConsumer(receiver) {
  try {
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

    const connection = await getRabbitMQConnection();
    const channel = await connection.createChannel();
    
  if (!channel) {
    console.error("Failed to establish connection to RabbitMQ.");
    return; // Exit function if connection failed
  }
 
 const exchangeName = 'amqp.dashboard';
 const queue = `q.${receiver}`;
 const routingKey = `rk.${receiver}`;
 
//  console.log(`Asserting exchange: ${exchangeName}`);
 await channel.assertExchange(exchangeName, 'direct', { durable: true });
//  console.log(`Asserting queue: ${queue}`);
 await channel.assertQueue(queue, { durable: true });
//  console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
 await channel.bindQueue(queue, exchangeName, routingKey);
//  console.log('listening for messages. To exit press CTRL+C');
 
   channel.consume(queue, async (msg) => {
       if (msg && msg.content) {

     const content = JSON.parse(msg.content.toString());

    console.log(`coming from ${content.headers?.source} meant for ${content.headers?.destination}`)
     //console.log('payload', content?.payload)
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
               // console.log('trying to update CashAdvanceSchema')
              const res3 = await fullUpdateCash(payload)
              handleMessageAcknowledgment(channel, msg, res3);
                break;
            
              case 'full-update-batch-job':
               // console.log('trying to update CashAdvanceSchema')
                const res4 = await fullUpdateCashBatchJob(payload)
                handleMessageAcknowledgment(channel, msg, res4);
                break;
              
              case 'status-update-batch-job':
               // console.log('trying to update CashAdvanceSchema')
                const res5 = await cashStatusUpdatePaid(payload)
                handleMessageAcknowledgment(channel, msg, res5);
                break;

              case 'onceCash':
                 // console.log('trying to update CashAdvanceSchema')
                  const res51 = await onceCash(payload)
                  handleMessageAcknowledgment(channel, msg, res51);
                  break;

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
              case 'recover-ca':
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
  } catch (e) {
    console.error("Failed to establish RabbitMQ connection:", e.message);
      throw e;
  }
}



























// export async function startConsumer(receiver) {
//   try {
//     const rabbitMQUrl = process.env.rabbitMQUrl;
//     const MAX_RETRIES = 5;
//     const INITIAL_RETRY_DELAY = 5000; // 5 seconds
    
//     class RabbitMQConnectionError extends Error {
//       constructor(message) {
//         super(message);
//         this.name = 'RabbitMQConnectionError';
//       }
//     }
    
//     // const connectToRabbitMQ = async () => {
//     //   let retryCount = 0;
//     //   let channel = null;
    
//     //   const attemptConnection = async () => {
//     //     try {
//     //       console.log("Connecting to RabbitMQ...");
//     //       const connection = await amqp.connect(rabbitMQUrl);
//     //       channel = await connection.createChannel();
//     //       console.log("Connected to RabbitMQ.");
    
//     //       connection.on("error", (error) => {
//     //         console.error("RabbitMQ connection error:", error);
//     //         throw new RabbitMQConnectionError("Connection error occurred");
//     //       });
    
//     //       connection.on("close", () => {
//     //         console.warn("RabbitMQ connection closed. Attempting to reconnect...");
//     //         setTimeout(attemptConnection, calculateRetryDelay(retryCount));
//     //       });
    
//     //       return channel;
//     //     } catch (error) {
//     //       console.error("Error connecting to RabbitMQ:", error);
          
//     //       if (retryCount >= MAX_RETRIES) {
//     //         throw new RabbitMQConnectionError(`Failed to connect to RabbitMQ after ${MAX_RETRIES} attempts`);
//     //       }
    
//     //       retryCount++;
//     //       const delay = calculateRetryDelay(retryCount);
//     //       console.log(`Retrying in ${delay / 1000} seconds... (Attempt ${retryCount} of ${MAX_RETRIES})`);
//     //       await new Promise(resolve => setTimeout(resolve, delay));
//     //       return attemptConnection();
//     //     }
//     //   };
    
//     //   const calculateRetryDelay = (attempt) => {
//     //     return Math.min(INITIAL_RETRY_DELAY * Math.pow(2, attempt), 60000); // Max delay of 1 minute
//     //   };
    
//     //   return attemptConnection();
//     // };
  
//     const handleMessageAcknowledgment = (channel, msg, res) => {
//       try{
//         if (res.success) {
//           channel.ack(msg);
//           console.log('Message acknowledged successfully');
//         } else {
//           //  channel.nack(msg, false, true);
//           console.log('Error processing message, requeuing');
//         }
//       } catch(error){
//         console.error('Error handling message acknowledgment:', error);
//       }
//     };

//     const connection = await getRabbitMQConnection();
//     const channel = await connection.createChannel();
//     // const channel = await connectToRabbitMQ();
//     console.log("RabbitMQ connection established.");
    
//   if (!channel) {
//     console.error("Failed to establish connection to RabbitMQ.");
//     return; // Exit function if connection failed
//   }
 
//  const exchangeName = 'amqp.dashboard';
//  const queue = `q.${receiver}`;
//  const routingKey = `rk.${receiver}`;
 
//  console.log(`Asserting exchange: ${exchangeName}`);
//  await channel.assertExchange(exchangeName, 'direct', { durable: true });
//  console.log(`Asserting queue: ${queue}`);
//  await channel.assertQueue(queue, { durable: true });
//  console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
//  await channel.bindQueue(queue, exchangeName, routingKey);
//  console.log('listening for messages. To exit press CTRL+C');
 
//    // Listen for response
//    channel.consume(queue, async (msg) => {
//        if (msg && msg.content) {

//      const content = JSON.parse(msg.content.toString());

//      console.log(`coming from ${content.headers?.source} meant for ${content.headers?.destination}`)
//      //console.log('payload', content?.payload)
//      console.log('payload', content?.payload)
//      console.log('action', content?.headers?.action)
//      const payload = content?.payload
//      const source = content?.headers?.source
//      const action = content?.headers?.action
  
//       if(content.headers.destination == 'dashboard'){

//         switch (source) {
//           case 'onboarding':
//           case 'system-config':
//             console.log('trying to update HR Master')
//             const res = await updateHRMaster(payload)
//             handleMessageAcknowledgment(channel, msg, res);
//             break;
        
//           case 'trip':
//             switch (action) {
//               case 'trip-creation':
//                 console.log('Trying to update trip Data ...............', payload);
//                 if(Array.isArray(payload)){
//                   const results = await updateTrip(payload);
//                   console.log("results is iterable bbb", results)
//                   for (const res of results) {
//                     if (res.success) {
//                       // Acknowledge message
//                       channel.ack(msg);
//                       console.log('Message processed successfully');
//                     } else {
//                       // Implement retry mechanism or handle error
//                       console.log('Update failed with error:', res.error);
//                     }
//                   }
//                 } else{
//                   console.error(Error,"Payload is not an array");
//                 }
//               break;
            
//               case 'status-completed-closed':
//                 if(payload){
//                   const result = await updateTripToCompleteOrClosed(payload)
//                   console.log("results after trip status updated to completed or closed  ", result)
//                   if(result.success) {
//                       channel.ack(msg);
//                       console.log('Message processed successfully');
//                     } else {
//                       // Implement retry mechanism or handle error
//                       console.log('Update failed with error:', result.error);
//                     }
//                   }
//                 else{
//                   console.error(Error,"Payload is not an array");
//                 }
//                 break;

//               case 'add-leg':
//                 if(payload){
//                   "i am in add a leg"
//                   const response = await addLeg(payload)
//                   handleMessageAcknowledgment(channel, msg, response);
//                   }
//                 else{
//                   console.error(Error,"Payload is not an array");
//                 }

//               default:
//                   console.warn(`Unknown action '${action}' for source ${source}`);
//               break;
//             }
//             break;

//           case 'travel':
//             switch (action) {
//               case 'full-update':
//                 console.log('trying to update Travel')
//                 const res1 = await fullUpdateTravel(payload)
//                 handleMessageAcknowledgment(channel, msg, res1);
//                 break;
              
//               case 'full-update-batchjob':
//                 console.log('trying to update Travel BatchJob - Booking')
//                 const res2 = await fullUpdateTravelBatchJob(payload)
//                 handleMessageAcknowledgment(channel, msg, res2);
//                 break;
            
//               default:
//                 console.warn(`Unknown action '${action}' for source ${source}`);
//                 break;
//             }
//             break;

//           case 'cash':
//             switch (action) {
//               case 'full-update':
//                 console.log('trying to update CashAdvanceSchema')
//               const res3 = await fullUpdateCash(payload)
//               handleMessageAcknowledgment(channel, msg, res3);
//                 break;
            
//               case 'full-update-batch-job':
//                 console.log('trying to update CashAdvanceSchema')
//                 const res4 = await fullUpdateCashBatchJob(payload)
//                 handleMessageAcknowledgment(channel, msg, res4);
//                 break;
              
//               case 'status-update-batch-job':
//                 console.log('trying to update CashAdvanceSchema')
//                 const res5 = await cashStatusUpdatePaid(payload)
//                 handleMessageAcknowledgment(channel, msg, res5);
//                 break;

//               case 'onceCash':
//                   console.log('trying to update CashAdvanceSchema')
//                   const res51 = await onceCash(payload)
//                   handleMessageAcknowledgment(channel, msg, res51);
//                   break;

//                 default:
//                   console.warn(`Unknown action '${action}' for source ${source}`);
//                   break;
//             }
//             break;
          
//           case 'expense':
//             switch (action) {
//               case 'full-update':
//                 console.log('trying to update travelExpense Data', payload)
//                 const res6 = await fullUpdateExpense(payload)
//                 handleMessageAcknowledgment(channel, msg, res6);
//                 break;
            
//                 default:
//                 console.warn(`Unknown action '${action}' for source ${source}`);
//                 break;
//             }
//             break;

//           case 'reimbursement':
//             switch (action) {
//               case 'full-update':
//                 console.log('Trying to update reimbursement Data');
//                 const res7 = await updateReimbursement(payload);
//                 handleMessageAcknowledgment(channel, msg, res7);
//                 break;
            
//               case 'delete':
//                 console.log('Trying to update reimbursement Data');
//                 const res8 = await deleteReimbursement(payload);
//                 handleMessageAcknowledgment(channel, msg, res8);
//                 break;


//                 default:
//                 console.warn(`Unknown action '${action}' for source ${source}`);
//                 break;
//             }
//             break;

//           case 'finance':
//             switch (action) {
//               case 'settle-ca':
//               case 'recover-ca':
//                 console.log('settle-ca', payload);
//                 const res9 = await settleOrRecoverCashAdvance(payload);
//                 console.log("result for settle ca", res9)
//                 handleMessageAcknowledgment(channel, msg, res9);
//                 break;
              
//               case 'expense-paid':
//               console.log(" expense header status paid")
//               const res10 = await settleExpenseReport(payload);
//               handleMessageAcknowledgment(channel, msg, res10);
//               break;

//               case 'non-travel-paid':
//                 console.log(" expense header status paid - 'non-travel-paid'")
//                 const res11 = await settleNonTravelExpenseReport(payload);
//                 handleMessageAcknowledgment(channel, msg, res11);
//                 break;

//                 default:
//                   console.warn(`Unknown action '${action}' for source ${source}`);
//                   break;
//             }
//             break;

//           default:
//             console.warn(`Unknown source ${source} for action ${action}`)
//             break;
//         }
//       }
//     }}, { noAck: false });
//   } catch (error) {
//     console.error("Failed to establish RabbitMQ connection:", error.message);
//       throw error;
//   }
// }
