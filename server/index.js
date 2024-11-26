import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import overview from './routes/overviewRoutes.js';
import { handleErrors } from './errorHandler/errorHandler.js';
import { startConsumer } from './rabbitmq/consumer.js';
import { mainRouter} from './routes/mainFrontendRoutes.js';
import {consumeFromDashboardQueue } from './rabbitmq/dashboardConsumer.js';
import { scheduleToFinanceBatchJob } from './schedulars/finance.js';
import cookieParser from 'cookie-parser';
import { scheduleToNotificationBatchJob } from './schedulars/notifications.js';
import { closeMongoDBConnection, connectToMongoDB } from './db/db.js';
import { closeRabbitMQConnection, getRabbitMQConnection } from './rabbitmq/connection.js';

const environment = process.env.NODE_ENV == 'production' ? '.env.prod' : '.env';
dotenv.config({path:environment});


const allowedOrigins = JSON.parse(process.env.ALLOWED_ORIGINS);
const jwtSecret = process.env.JWT_SECRET
console.log({allowedOrigins})
console.log(`Running in ${environment} environment`);
const port = process.env.PORT || 8088;

const app = express();

let server;
let shutdownInProgress = false;

const shutdown = async (reason) => {
  try {
      if (shutdownInProgress) {
          console.log('Shutdown already in progress...');
          return;
      }

      shutdownInProgress = true;
      console.log(`Shutdown initiated: ${reason}`);

      const cleanupTasks = [];

      if (typeof closeRabbitMQConnection === 'function') {
          cleanupTasks.push(
              closeRabbitMQConnection()
                  .then(() => console.log('RabbitMQ connection closed'))
                  .catch(err => console.error('RabbitMQ cleanup error:', err))
          );
      }

      cleanupTasks.push(
          closeMongoDBConnection()
              .then(() => console.log('MongoDB connection closed'))
              .catch(err => console.error('MongoDB cleanup error:', err))
      );

      if (server) {
          cleanupTasks.push(
              new Promise((resolve) => {
                  server.close(() => {
                      console.log('Server connections closed');
                      resolve();
                  });
              })
          );
      }

      const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Shutdown timeout')), 10000)
      );

      await Promise.race([
          Promise.allSettled(cleanupTasks),
          timeoutPromise
      ]);

      console.log('Cleanup completed');
      process.exit(0);
  } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
  }
};


// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) {
//       return callback(new Error('CORS policy violation: Origin not allowed'), false); 
//     }
//     return callback(null, true);
//   },
//   credentials: true
// }

const corsOptions = {
  origin: true,
  credentials: true 
}

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));


//Routes
app.use('/api/dashboard/overview', overview ); 
app.use('/api/fe/dashboard', mainRouter);
app.get('/ping', (req,res) => { return res.status(200).json({message:'Dashboard microservice is live'})})
app.use((req,res,next) =>{
  res.status(404).json({success:false, message:"Wrong route. Please check the URL."})
})
app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).json({ message: 'Internal Server Error' });
});


app.use((err, req, res, next) => {
  handleErrors(err, req, res, next);
});


// // BatchJobs
scheduleToFinanceBatchJob()
scheduleToNotificationBatchJob()

const initializeServer = async () => {
  try {
      await Promise.all([
        connectToMongoDB(),
        getRabbitMQConnection(),
        consumeFromDashboardQueue(),
        startConsumer('dashboard')
      ])

      server = app.listen(port, () => {
          console.log(`Server is running on port ${port}`);
      });

      server.on('error', (error) => {
          console.error('Server error:', error);
          shutdown('Server error').catch(console.error);
      });

  } catch (error) {
      console.error('Initialization error:', error);
      shutdown('Initialization failure').catch(console.error);
  }
};

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  shutdown('Unhandled Rejection').catch(console.error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  shutdown('Uncaught Exception').catch(console.error);
});

process.on('SIGTERM', () => shutdown('SIGTERM').catch(console.error));
process.on('SIGINT', () => shutdown('SIGINT').catch(console.error));

// Start the server
initializeServer().catch(console.error);






































































































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


