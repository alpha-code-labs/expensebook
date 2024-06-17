import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dummy from './routes/dummyRoute.js';
import overview from './routes/overviewRoutes.js';
import { handleErrors } from './errorHandler/errorHandler.js';
import amqp from 'amqplib';
import { startConsumer } from './rabbitmq/consumer.js';
import { mainRouter} from './routes/mainFrontendRoutes.js';
import { consumeFromDashboardQueue } from './rabbitmq/dashboardConsumer.js';
// import dashboard from "../models/dashboardSchema.js";

dotenv.config();

const environment = process.env.NODE_ENV || 'development';
console.log(`Running in ${environment} environment`);
const rabbitMQUrl = process.env.rabbitMQUrl;


const mongoURI = process.env.mongoURI;

const app = express();

app.use(express.json());
app.use(cors());

//Routes
app.use('/api/dummydata', dummy); // dummy data for testing
app.use('/api/dashboard/overview', overview ); // dashboard overview screen
app.use('/api/fe/dashboard', mainRouter);

app.get('/ping', (req,res) => { return res.status(200).json({message:'Dashboard microservice is live'})})

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

connectToMongoDB();

// let channel;

// export const connectToRabbitMQ = async () => {
//   try {
//     console.log('Connecting to RabbitMQ...');
//     const connection = await amqp.connect(rabbitMQUrl);
//     channel = await connection.createConfirmChannel();
//     console.log('Connected to RabbitMQ...channel;');
//     return channel; 
//   } catch (error) {
//     console.error('Error connecting to RabbitMQ:', error);
//     return error;
//   }
// };
// const res = await dashboard.updateOne({'travelRequestId':'65f999fc8ce974b02b0e14fb'},{$set:{'travelRequestSchema.assignedTo.empId': null, 'travelRequestSchema.assignedTo.name': null}})
// if(res.success){
//   console.log("success", success , res)
// }
// connectToRabbit();

// const mongodb = async () => {
//     try {
//       const client = new MongoClient(mongoURI);
      
//       await client.connect();
      
//       console.log('Connected to MongoDB');
  
//     } catch (error) {
//       console.error('Error connecting to MongoDB:', error);
//     }
//   };

// mongodb();

app.use((err, req, res, next) => {
  handleErrors(err, req, res, next);
});

const port = process.env.PORT || 8088;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// start consuming messages..
 startConsumer('dashboard');

// consumeFromDashboardQueue();
 consumeFromDashboardQueue();

//-----------------------------------------------------------------------------------------------------
// const consumeAsyncMessages = async (channel, callback) => {
//   try {
//     console.log('Receiving messages from RabbitMQ...');

//     const exchangeName = 'amqp.dashboard';
//     const queue = 'async';

//     await channel.assertExchange(exchangeName, 'headers', { durable: true });
//     await channel.assertQueue(queue, { durable: true });
//     await channel.bindQueue(queue, exchangeName);

//     const noAckOption = queue === 'async' ? false : true; // Set noAck based on the queue type

//     channel.consume(queue, async (message) => {
//       if (message !== null) {
//         const content = JSON.parse(message.content.toString());

//         try {
//           // Check if message type is 'new'
//           if (content.type === 'new') {
//             // Perform the necessary processing on the received message
//             const result = await callback(content);

//             // Acknowledge the message for async queue
//             if (noAckOption) {
//               channel.ack(message);
//             }

//             if (!noAckOption && content.headers && content.headers.needConfirmation) {
//               // If needConfirmation is true for sync queue, send success/failure response
//               const correlationId = message.properties.correlationId;

//               const responseHeaders = {
//                 type: 'response',
//                 source: 'dashboard',
//                 data: result,
//                 success: result,
//               };

//               const responseMessage = {
//                 headers: responseHeaders,
//                 payload: null,
//               };

//               // Send response to RabbitMQ
//               publish(channel, exchangeName, '', JSON.stringify(responseMessage), {
//                 persistent: true,
//                 correlationId: correlationId,
//               });
//             }
//           } else {
//             // Message type is not 'new', do not process and acknowledge
//             console.log('Ignoring message with type other than "new".');
            
//             // Acknowledge the message for both async and sync queues
//             if (noAckOption) {
//               channel.ack(message);
//             }
//           }
//         } catch (error) {
//           console.error('Error processing and acknowledging message:', error);
//           handleProcessingError(channel, exchangeName, message.properties.correlationId);
//         }
//       }
//     }, { noAck: noAckOption }); // Set noAck based on the queue type
//   } catch (error) {
//     console.error('Error receiving messages from RabbitMQ:', error);
//     throw error;
//   }
// };

// const consumeSyncMessages = async (channel) => {
//   try {
//     console.log('Receiving messages from RabbitMQ...Sync queue');

//     await consumeMessagesFromQueue(channel, 'sync', async (message) => {
//       const content = JSON.parse(message.content.toString());

//       // Check if message type is 'new'
//       if (content.type === 'new') {
//         // Process the message for sync queue (if needed)
//         console.log('Processing message for sync queue:', content);
//       } else {
//         // Message type is not 'new', do not process and acknowledge
//         console.log('Ignoring message with type other than "new".');
//         channel.ack(message);
//       }
//     });
//   } catch (error) {
//     console.error('Error receiving messages from RabbitMQ:', error);
//     throw error;
//   }
// };

// const consumeMessagesFromQueue = async (channel, queueName, callback) => {
//   const exchangeName = 'amqp.dashboard';
//   const noAckOption = queueName === 'async' ? false : true;

//   await channel.assertExchange(exchangeName, 'headers', { durable: true });
//   await channel.assertQueue(queueName, { durable: true });
//   await channel.bindQueue(queueName, exchangeName);

//   channel.consume(queueName, async (message) => {
//     if (message !== null) {
//       try {
//         const content = JSON.parse(message.content.toString());

//         // Check if message type is 'new'
//         if (content.type === 'new') {
//           await processNewMessage(content, channel, message, callback);
//         } else {
//           // Message type is not 'new', do not process and acknowledge
//           console.log('Ignoring message with type other than "new".');
//           acknowledgeMessage(channel, message);
//         }
//       } catch (error) {
//         console.error('Error processing and acknowledging message:', error);
//       }
//     }
//   }, { noAck: noAckOption });
// };

// const processNewMessage = async (content, channel, message, callback) => {
//   // Perform the necessary processing on the received message
//   const result = await callback(content);

//   // Acknowledge the message
//   acknowledgeMessage(channel, message);

//   if (content.headers && content.headers.needConfirmation) {
//     // If needConfirmation is true, send success/failure response
//     const correlationId = message.properties.correlationId;

//     const responseHeaders = {
//       type: 'response',
//       source: 'dashboard',
//       onlineVsBatch: onlineVsBatch, 
//       success: result,
//     };

//     const responseMessage = {
//       headers: responseHeaders,
//       payload: trip.tripId, // sending tripId as response
//     };

//     // Send response to RabbitMQ
//     publish(channel, 'amqp.dashboard', '', JSON.stringify(responseMessage), {
//       persistent: true,
//       correlationId: correlationId,
//     });
//   }
// };

// // const saveAsyncToDashboard = async (message) => {
// //   try {
// //     const { header } = message;

// //     // Check the type and source in the header
// //     switch (true) {
// //       case header.type === 'new' && header.source === 'trip':
// //         await processTransitTrip(message);
// //         break;

// //       case header.type === 'new' && header.source === 'travelRequest':
// //         await processTravelRequest(message);
// //         break;

// //       case header.type === 'new' && header.source === 'approval':
// //         await processApproval(message);
// //         break;

// //       case header.type === 'new' && header.source === 'travel-expense':
// //         await processTravelExpense(message);
// //         break;

// //         case header.type === 'new' && header.source === 'onboarding':
// //           await processOnboardingData(message);
// //           break;

// //       default:
// //         console.warn('Unhandled message type or source:', header.type, header.source);
// //     }

// //     return true; 
// //   } catch (error) {
// //     console.error('Error saving to the dashboard:', error);
// //     return false;
// //   }
// // };


// // Handle graceful shutdown
// process.on('SIGINT', async () => {
//   console.log('Received SIGINT. Gracefully shutting down Consumer Microservice.');

//   // Close the channel and connection
//   if (channel) {
//     await channel.close();
//   }

//   process.exit(0);
// });

// const startAsyncConsumerMicroservice = async () => {
//   try {
//     // Check RabbitMQ connection
//     const channel = await connectToRabbitMQ();
//     if (channel) {
//       // Start consuming messages continuously
//       await consumeAsyncMessages(channel, saveAsyncToDashboard);
//     } else {
//       console.error('Failed to connect to RabbitMQ in Consumer Microservice');
//     }
//   } catch (error) {
//     console.error('Error starting Consumer Microservice:', error);
//   }
// };

// // Start to listen Async consumer queue - from Trip microservice
// startAsyncConsumerMicroservice();


//-------------- approval Microservice ----

// const consumesyncMessagesFromApproval = async (channel, callback) => {
//   try {
//     console.log('Receiving messages from RabbitMQ...');

//     await consumeMessagesFromQueueApproval(channel, 'sync', async (message) => {
//       const content = JSON.parse(message.content.toString());

//       // Check if message type is 'new'
//       if (content.type === 'new') {
//         await processNewMessage(content, channel, message, callback);
//       } else {
//         // Message type is not 'new', do not process and acknowledge
//         console.log('Ignoring message with type other than "new".');
//         acknowledgeMessage(channel, message);
//       }
//     });
//   } catch (error) {
//     console.error('Error receiving messages from RabbitMQ:', error);
//     throw error;
//   }
// };

// const consumeMessagesFromQueueApproval = async (channel, callback) => {
//   const exchangeName = 'amqp.dashboard';
//   const queueName = 'sync';

//   await channel.assertExchange(exchangeName, 'headers', { durable: true });
//   await channel.assertQueue(queueName, { durable: true });
//   await channel.bindQueue(queueName, exchangeName);

//   channel.consume(queueName, async (message) => {
//     if (message !== null) {
//       try {
//         const content = JSON.parse(message.content.toString());

//         // Check if message type is 'new'
//         if (content.type === 'new') {
//           await processNewMessageApproval(content, channel, message, callback);
//         } else {
//           // Message type is not 'new', do not process and acknowledge
//           console.log('Ignoring message with type other than "new".');
//           acknowledgeMessageForApproval(channel, message);
//         }
//       } catch (error) {
//         console.error('Error processing and acknowledging message:', error);
//       }
//     }
//   }, { noAck: false });
// };

// const processNewMessageApproval = async (content, channel, message, callback) => {
//   // Perform the necessary processing on the received message
//   const result = await callback(content);

//   // Acknowledge the message
//   acknowledgeMessageForApproval(channel, message);

//   if (content.headers && content.headers.needConfirmation) {
//     // If needConfirmation is true, send success/failure response
//     const correlationId = message.properties.correlationId;

//     const responseHeaders = {
//       type: 'response',
//       source: 'approval',
//       onlineVsBatch: 'online', 
//       success: result,
//     };

//     const responseMessage = {
//       headers: responseHeaders,
//       payload: tripApprovalDoc.appovalId, //...
//     };

//     // Send response to RabbitMQ
//     publish(channel, 'amqp.dashboard', '', JSON.stringify(responseMessage), {
//       persistent: true,
//       correlationId: correlationId,
//     });
//   }
// };

// const acknowledgeMessageForApproval = (channel, message) => {
//   // Acknowledge the message
//   channel.ack(message);
// };


// const savesyncToDashboardApproval = async (message,correlationId) => {
//   try {
//     const { header } = message;

//     if (header.type === 'new' && header.source === 'approval') {
//       await updateTripToDashboardSync(message,correlationId);
//     } else if (header.type === 'new' && header.source === 'approval') {
//       await updateTravelToDashboardSync(message,correlationId);
//     } else (header.type === 'new' && header.source === 'approval');{
//       await updateCashToDashboardSync(message,correlationId);
//     }

//     return true; // Return true if processing is successful
//   } catch (error) {
//     console.error('Error saving to the dashboard:', error);
//     return false; // Return false if processing fails
//   }
// };

// Handle graceful shutdown
// process.on('SIGINT', async () => {
//   console.log('Received SIGINT. Gracefully shutting down Consumer Microservice.');

//   // Close the channel and connection
//   if (channel) {
//     await channel.close();
//   }

//   process.exit(0);
// });

// const startsyncConsumerMicroserviceApproval = async () => {
//   try {
//     // Check RabbitMQ connection
//     const channel = await connectToRabbitMQ();
//     if (channel) {
//       // Start consuming messages continuously
//       await consumesyncMessagesFromApproval(channel, savesyncToDashboardApproval);
//     } else {
//       console.error('Failed to connect to RabbitMQ in Consumer Microservice');
//     }
//   } catch (error) {
//     console.error('Error starting Consumer Microservice:', error);
//   }
// };

// // Start to listen Async consumer queue - from Trip microservice
// startsyncConsumerMicroserviceApproval();












































































































































// // 1 ) consume --- rabbitmq -- synchronous call
// import { processTransitTrip, updateTripToDashboardSync,  } from './rabbitmq/messageProcessor.js';

// // Consume messages from sync queue with retry mechanism
// const consumeMessagesSyncWithRetry = async(channel) => {
//   const exchangeName = 'amqp.dashboard';
//   const queue = 'sync';

//    await channel.assertExchange(exchangeName, 'headers', { durable: true });
//    await channel.assertQueue(queue, { durable: true });
//    await channel.bindQueue(queue, exchangeName);

//   channel.consume(queue, async (msg) => {
//     if (msg.content) {
//       const message = JSON.parse(msg.content.toString());

//       // Process message
//       console.log('Received message:', message);

//       try {
//         const updateSuccess = await saveToDashboardWithRetry(message);

//         if (updateSuccess) {
//           // Acknowledge if success
//           channel.ack(msg);

//           // Send confirmation with specified headers
//           const confirmationHeaders = {
//             type: 'confirmation',
//             source: 'trip',
//           };

//           const confirmation = {
//             headers: confirmationHeaders,
//             success: true,
//           };

//           channel.publish(
//             exchangeName,
//             '',
//             Buffer.from(JSON.stringify(confirmation)),
//             {
//               persistent: true,
//               correlationId: msg.properties.correlationId,
//               headers: confirmationHeaders,
//             }
//           );
//         } else {
//           // Retry for 5 seconds and then send a failure message to the producer
//           setTimeout(async () => {
//             const failureHeaders = {
//               type: 'confirmation',
//               source: 'trip',
//             };

//             const failureMessage = {
//               headers: failureHeaders,
//               success: false,
//               error: 'Max retries reached. Update failed.',
//             };

//             // Send failure message to the producer with specified headers
//             channel.publish(
//               exchangeName,
//               '',
//               Buffer.from(JSON.stringify(failureMessage)),
//               {
//                 persistent: true,
//                 correlationId: msg.properties.correlationId,
//                 headers: failureHeaders,
//               }
//             );

//             // Reject the message after sending the failure message
//             channel.reject(msg, false);
//           }, 5000);
//         }
//       } catch (error) {
//         // Retry for 5 seconds and then reject
//         console.error('Error processing message:', error);
//         setTimeout(() => {
//           channel.reject(msg, false);
//         }, 5000);
//       }
//     }
//   });
// };

// // Modify saveToDashboardSync function to include retry mechanism
// const saveToDashboardWithRetry = async (message) => {
//   let retryCount = 0;
//   const maxRetries = 5;

//   while (retryCount < maxRetries) {
//     try {
//       // Logic to save the received message to the dashboard
//       await updateTripToDashboardSync(message);
//       return true; // Return true if the update is successful
//     } catch (error) {
//       console.error(`Error saving to the dashboard (Retry ${retryCount + 1}/${maxRetries}):`, error);
//       retryCount++;
//       await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
//     }
//   }

//   return false; // Return false if max retries are reached without success
// };

// // Connect and start consuming with retry mechanism
// consumeMessagesSyncWithRetry(channel);

// //old


// const consumeMessagesSync = (channel, callback) => {
//   try {
//     console.log('Receiving messages from RabbitMQ...synq queue');
//     const exchangeName = 'amqp.dashboard'; 
//     const queue = 'sync';

//     console.log(`Asserting exchange: ${exchangeName}`);
//     channel.assertExchange(exchangeName, 'headers', { durable: true });
    
//     console.log(`Asserting queue: ${queue}`); 
//     channel.assertQueue(queue, { durable: true });

//     console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
//     channel.bindQueue(queue, exchangeName);

//     console.log('Waiting for messages. To exit press CTRL+C');

//     channel.consume(queue, (message) => {
//       if (message !== null) {
//         const content = JSON.parse(message.content.toString());
//         console.log('Received message from RabbitMQ:', content);
        
//         // Perform the necessary processing on the received message
//         callback(content);

//         // Acknowledge the message
//         channel.ack(message);
//       }
//     }, { noAck: false });

//   } catch (error) {
//     console.error('Error receiving messages from RabbitMQ:', error);
//     throw error;
//   }
// };

// const saveToDashboardSync = (message) => {
//   try {
//     // Logic to save the received message to the dashboard
//     updateTripToDashboardSync(message); 
//   } catch (error) {
//     console.error('Error saving to the dashboard:', error);
//     throw error;
//   }
// };

// // Handle graceful shutdown
// process.on('SIGINT', () => {
//   console.log('Received SIGINT. Gracefully shutting down Consumer Microservice.');
  
//   // Close the channel and connection
//   if (channel) {
//     channel.close();
//   }

//   process.exit(0);
// });

// const startSyncConsumerMicroservice = () => {
//   try {
//     // Check RabbitMQ connection
//     const channel = connectToRabbitMQ();

//     if (channel) {
//       console.log('Connected to RabbitMQ in Consumer Microservice... sync queue');

//       // Start consuming messages continuously
//       consumeMessagesSync(channel, saveToDashboardSync);

//     } else {
//       console.error('Failed to connect to RabbitMQ in Consumer Microservice');
//     }
    
//   } catch (error) {
//     console.error('Error starting Consumer Microservice:', error);
//   }
// };

// // Start the consumer microservice
// startSyncConsumerMicroservice();

// // publisher -- synchronous call
// export const sendFailedConfirmationToTripMicroservice = (correlationId, confirmationMessage) => {
//   try {
//     console.log('Sending failed updates confirmation message to RabbitMQ...');
    
//     const channel = connectToRabbitMQ();

//     const exchangeName = 'amqp.dashboard';

//     console.log(`Asserting exchange: ${exchangeName}`);
//     channel.assertExchange(exchangeName, 'headers', { durable: true });

//     const messageHeaders = { type: 'confirmation' };

//     const message = {
//       headers: {
//         ...messageHeaders,
//         correlationId  
//       },
//       confirmationMessage
//     };

//     console.log('Publishing confirmation message to RabbitMQ:', message);

//     try {
//       // Publish confirmation message to RabbitMQ  
//       channel.publish(exchangeName, '', Buffer.from(JSON.stringify(message)), { persistent: true });

//       console.log('Confirmation message sent to RabbitMQ:', message);

//     } catch (error) {
//       console.error('Error sending confirmation message to RabbitMQ:', error);
//       throw error;

//     } finally {
//       // Close channel after delay  
//       setTimeout(() => {
//         channel.close();
//         console.log('Channel closed.');
//       }, 5000);
//     }

//     return true;

//   } catch (error) {
//     console.error('Error sending confirmation message:', error);
//     return false;
//   }
// };

// export const sendSuccessConfirmationToTripMicroservice = (correlationId, successMessage) => {

//   try {
//     console.log('Sending success confirmation message to RabbitMQ...');

//     const channel = connectToRabbitMQ();

//     const exchangeName = 'amqp.dashboard';

//     console.log(`Asserting exchange: ${exchangeName}`);
//     channel.assertExchange(exchangeName, 'headers', { durable: true });

//     const messageHeaders = { type: 'confirmation' };

//     const message = {
//       headers: {
//         ...messageHeaders,
//         correlationId
//       },
//       successMessage
//     };

//     console.log('Publishing confirmation message to RabbitMQ:', message);

//     try {
//       // Publish confirmation message to RabbitMQ
//       channel.publish(exchangeName, '', Buffer.from(JSON.stringify(message)), { persistent: true });

//       console.log('Confirmation message sent to RabbitMQ:', message);

//     } catch (error) {
//       console.error('Error sending confirmation message to RabbitMQ:', error);
//       throw error;

//     } finally {
//       // Close channel after delay
//       setTimeout(() => {
//         channel.close();
//         console.log('Channel closed.');  
//       }, 5000);
//     }

//     return true;

//   } catch (error) {
//     console.error('Error sending confirmation message:', error);
//     return false;
//   }
// };

//----------------------------------------

// // Asynchronous api call -- batch job
// const consumeAsyncMessages = async (channel, callback) => { 
//   try {
//    console.log('Receiving messages from RabbitMQ...Asynchronous queue');

//     const exchangeName = 'amqp.dashboard';
//     const queue = 'async';

//     // console.log(`Asserting exchange: ${exchangeName}`);
//     await channel.assertExchange(exchangeName, 'headers', { durable: true });

//     // console.log(`Asserting queue: ${queue}`);
//     await channel.assertQueue(queue, { durable: true });

//     // console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
//     await channel.bindQueue(queue, exchangeName);

//     // console.log('Waiting for messages. To exit press CTRL+C');

//     channel.consume(queue, async (message) => {
//       if (message !== null) {
//         const content = JSON.parse(message.content.toString());
//         // console.log('Received message from Asynchronous queue RabbitMQ:', content);

//         // Perform the necessary processing on the received message
//         await callback(content);

//         // Acknowledge the message
//         channel.ack(message);
//       }
//     }, { noAck: false }); // Set noAck to false to manually acknowledge messages
//   } catch (error) {
//     console.error('Error receiving messages from RabbitMQ:', error);
//     throw error;
//   }
// };

// const saveAsyncToDashboard = async (message) => {
//   try {
//     // Logic to save the received message to the dashboard
//     await processTransitTrip(message);
//   } catch (error) {
//     // console.error('Error saving to the dashboard:', error);
//     throw error;
//   }
// };

// // Handle graceful shutdown
// process.on('SIGINT', async () => {
//   console.log('Received SIGINT. Gracefully shutting down Consumer Microservice.');

//   // Close the channel and connection
//   if (channel) {
//     await channel.close();
//   }

//   process.exit(0);
// });

// const startAsyncConsumerMicroservice = async () => {
//   try {
//     // Check RabbitMQ connection
//     const channel = await connectToRabbitMQ();
//     if (channel) {
//       // console.log('Connected to RabbitMQ in Consumer Microservice');

//       // Start consuming messages continuously
//       await consumeAsyncMessages(channel, saveAsyncToDashboard);
//     } else {
//       // console.error('Failed to connect to RabbitMQ in Consumer Microservice');
//     }
//   } catch (error) {
//     console.error('Error starting Consumer Microservice:', error);
//   }
// };

// // Start to listen Async consumer queue - from Trip microservice
// startAsyncConsumerMicroservice();


