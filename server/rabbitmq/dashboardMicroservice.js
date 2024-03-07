import amqp from 'amqplib';
import { generateUniqueIdentifier } from '../utils/uuid.js';
import Trip from '../models/tripSchema.js';
import pino from 'pino';
import pinoPretty from 'pino-pretty';

// Create a Pino logger with pretty formatting
const logger = pino({
  prettifier: pinoPretty,
});

// const rabbitMQUrl = 'amqp://localhost:5672';
const rabbitMQUrl = process.env.rabbitMQUrl

let channel
export const connectToRabbitMQ = async () => {
  try {
    console.log('Connecting to RabbitMQ...');
    const connection = await amqp.connect(rabbitMQUrl);
     channel = await connection.createConfirmChannel();
    console.log('Connected to RabbitMQ.');
    return channel;
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    throw error;
  }
};

// export const sendTripsToDashboardQueue = async (payload, action, comments, source = 'trip', onlineVsBatch = 'batch', needConfirmation = true) => {
//  try {
//     const connection = await amqp.connect(process.env.rabbitMQUrl);
//     const channel = await connection.createConfirmChannel();
//     const exchangeName = 'amqp.dashboard';
//     const queue = 'sync';
//     const correlationId = generateUniqueIdentifier(); // Assuming this function is defined elsewhere
//     const replyQueue = await channel.assertQueue('', { exclusive: true });

//     console.log(`Asserting exchange: ${exchangeName}`);
//     await channel.assertExchange(exchangeName, 'direct', { durable: true });

//     console.log(`Asserting queue: ${queue}`);
//     await channel.assertQueue(queue, { durable: true });

//     console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
//     await channel.bindQueue(queue, exchangeName, '');

//     const messageHeaders = {
//       type: 'new',
//       source,
//       onlineVsBatch,
//       action,
//       comments,
//       needConfirmation: 'true',
//       correlationId,
//     };

//     const messageToSend = {
//       headers: messageHeaders,
//       payload,
//     };

//     return new Promise((resolve, reject) => {
//       channel.consume(replyQueue.queue, (msg) => {
//         if (msg.properties.correlationId === correlationId) {
//           const response = JSON.parse(msg.content.toString());
//           console.log('Received response:', response);
//           resolve(response.success); // Resolve the promise with the success status
//           channel.ack(msg); // Acknowledge the message
//           channel.close(); // Close the channel
//           connection.close(); // Close the connection
//         }
//       }, { noAck: false }); // Important: Set noAck to false to allow acknowledgement of the message

//       channel.sendToQueue(queue, Buffer.from(JSON.stringify(messageToSend)), {
//         replyTo: replyQueue.queue,
//         correlationId,
//       });
//     });
//  } catch (error) {
//     console.error('Error sending transit trips to the dashboard microservice:', error);
//     return false;
//  }
// };
export const sendTripsToDashboardQueue = async (payload, action, comments, source = 'trip', onlineVsBatch = 'batch', needConfirmation = true) => {
  try {
     console.log('Connecting to RabbitMQ...');
     const connection = await amqp.connect(process.env.rabbitMQUrl);
     console.log('Connected to RabbitMQ.');
 
     console.log('Creating confirm channel...');
     const channel = await connection.createConfirmChannel();
     console.log('Confirm channel created.');
 
     const exchangeName = 'amqp.dashboard';
     const queue = 'sync';
     const correlationId = generateUniqueIdentifier(); // Assuming this function is defined elsewhere
     const replyQueue = await channel.assertQueue('', { exclusive: true });
 
     console.log(`Asserting exchange: ${exchangeName}`);
     await channel.assertExchange(exchangeName, 'direct', { durable: true });
 
     console.log(`Asserting queue: ${queue}`);
     await channel.assertQueue(queue, { durable: true });
 
     console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
     await channel.bindQueue(queue, exchangeName, '');
 
     const messageHeaders = {
       type: 'new',
       source,
       onlineVsBatch,
       action,
       comments,
       needConfirmation: 'true',
       correlationId,
     };
 
     const messageToSend = {
       headers: messageHeaders,
       payload,
     };
 
     console.log('Sending message to queue...');
     return new Promise((resolve, reject) => {
       channel.consume(replyQueue.queue, (msg) => {
         if (msg.properties.correlationId === correlationId) {
           const response = JSON.parse(msg.content.toString());
           console.log('Received response:', response);
 
           // Check if the response is a confirmation message
           if (response.headers && response.headers.type === 'confirmation') {
             // Assuming the success status is directly under payload.success
             const success = response.payload.success;
             console.log(`Confirmation received with success status: ${success}`);
             resolve(success); // Resolve the promise with the success status
           } else {
             console.error('Unexpected response format.');
             reject(new Error('Unexpected response format.'));
           }
 
           channel.ack(msg); // Acknowledge the message
           console.log('Message acknowledged.');
           channel.close(); // Close the channel
           console.log('Channel closed.');
           connection.close(); // Close the connection
           console.log('Connection closed.');
         }
       }, { noAck: false }); // Important: Set noAck to false to allow acknowledgement of the message
 
       channel.sendToQueue(queue, Buffer.from(JSON.stringify(messageToSend)), {
         replyTo: replyQueue.queue,
         correlationId,
       });
       console.log('Message sent to queue.');
     });
  } catch (error) {
     console.error('Error sending transit trips to the dashboard microservice:', error);
     return false;
  }
 };
 
 


 
const sendTripsToDashboardQueueT = async (payload, action, comments, onlineVsBatch, needConfirmation) => {
  return new Promise((resolve, reject) => {
    connectToRabbitMQ(async (channel) => {
      const exchangeName = 'amqp.dashboard';
      const queue = 'sync';
      const correlationId = generateUniqueIdentifier();

      try {
        // Assert exchange and queue
        await channel.assertExchange(exchangeName, 'direct', { durable: true });
        await channel.assertQueue(queue, { durable: true });
        await channel.bindQueue(queue, exchangeName, 'Dashboard');

        // Construct message headers
        const messageHeaders = {
          type: 'new',
          source: 'trip',
          onlineVsBatch,
          action,
          comments,
          needConfirmation: true,
        };

        // Construct message to send
        const messageToSend = {
          headers: messageHeaders,
          payload,
        };

        // Listen for response
        channel.consume(queue, (msg) => {
          if (msg.properties.correlationId === correlationId) {
            resolve(JSON.parse(msg.content.toString()));
            channel.ack(msg);
            channel.close();
          }
        }, { noAck: false });

        // Publish message to RabbitMQ with correlationId
        await new Promise((resolve, reject) => {
          channel.publish(exchangeName, '', Buffer.from(JSON.stringify(messageToSend)), {
            persistent: true,
            correlationId,
            replyTo: queue,
          }, (err, ok) => {
            if (err !== null) {
              reject(err);
            } else {
              resolve(ok);
            }
          });
        });
        
      } catch (error) {
        // Log the error using Pino with structured logging
        logger.error({
          timestamp: new Date().toISOString(),
          error: {
            message: error.message,
            stack: error.stack,
          },
          correlationId,
          payload,
          action,
          comments,
          onlineVsBatch,
          needConfirmation,
        }, 'Error in sendTripsToDashboardQueue');
        // Reject the promise with the error
        reject(error);
      }
    });
  });
};




// extarct trip and send again
const extractTrip = async (tripId) => {
  try {
    const trip = await Trip.findOne({ tripId }); 
    if (!trip) {
      throw new Error('Trip not found');
    }
    return trip;
  } catch (error) {
    console.error('Error while extracting trip:', error.message);
    throw error; 
  }
};





















































































































//---------------------------------------------------------------------------------------

// send to Synchronous queue --  cancel trip at header level
export const sendTripsToDashboardSyncQoueue = (trip) => {
  try {
    console.log('Sending message to RabbitMQ...sync');

    const channel = connectToRabbitMQ(); //sync

    const exchangeName = 'amqp.dashboard';
    const queue = 'sync';

    console.log(`Asserting exchange: ${exchangeName}`);
    channel.assertExchange(exchangeName, 'headers', { durable: true });

    console.log(`Asserting queue: ${queue}`);
    channel.assertQueue(queue, { durable: true });

    console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
    channel.bindQueue(queue, exchangeName);

    const messageHeaders = {
      type: 'new',
      source: 'trip',
      data:'online'
    };

    const message = {
      headers: messageHeaders,
      trip,
    };

    console.log('Publishing message to RabbitMQ:', message);

    try {
      // Publishing message to RabbitMQ
      const uniqueIdentifier = generateUniqueIdentifier(); //sync

      channel.publish(exchangeName, '', Buffer.from(JSON.stringify(message)), {
        persistent: true,
        correlationId: uniqueIdentifier,
      });

      console.log('Message sent to RabbitMQ:', message);
    } catch (error) {
      console.error('Error sending message to RabbitMQ:', error);
      throw error;
    } finally {
      // Close the channel after a short delay (adjust the delay)
      setTimeout(() => {
        channel.close();

        console.log('Channel closed.');
      }, 5000);
    }

    return true; // Return true on successful message sending to RabbitMQ
} catch (error) {
  console.error('Error sending transit trips to the dashboard microservice:', error);
  return false;
} finally {
  setTimeout(() => {
    if (channel) {
      channel.close();
      console.log('Channel closed.');
    }
  }, 5000);
}
};

// // Function to consume messages from the sync queue
// const consumeMessagesSync = async (channel) => {
//   const exchangeName = 'amqp.dashboard';
//   const queue = 'sync';

//   try {
//     console.log(`Asserting exchange: ${exchangeName}`);
//     await channel.assertExchange(exchangeName, 'headers', { durable: true });

//     console.log(`Asserting queue: ${queue}`);
//     await channel.assertQueue(queue, { durable: true });

//     console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
//     await channel.bindQueue(queue, exchangeName);

//     channel.consume(queue, (msg) => {
//       if (msg.content) {
//         const message = JSON.parse(msg.content.toString());

//         // Process message
//         console.log(`Received message with correlation ID ${msg.properties.correlationId}:`, message);

//         // Check if the message is a confirmation with type: 'confirmation' and source: 'trip'
//         if (
//           message.headers &&
//           message.headers.type === 'confirmation' &&
//           message.headers.source === 'trip'
//         ) {
//           // Acknowledge the message
//           channel.ack(msg);

//           // Process the confirmation message
//           console.log(`Received confirmation message with correlation ID ${msg.properties.correlationId}:`, message);

//           // Show success or failure message to the user
//           if (message.success) {
//             console.log('Success!'); 
//             //  discard the message if it's successful
//           } else {
//             console.error('Failure! Please try again.'); 
//             // i think try again should be added here
//           }
//         } else {
//           channel.ack(msg);
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Error in consumeMessagesSync:', error);
//   }
// };

// Eusage:
// const channel = await connectToRabbitMQ();
// consumeMessagesSync(channel);

// Connect and start consuming messages from the sync queue
// consumeMessagesSync(channel);

// import amqp from 'amqplib';

// const rabbitMQUrl = 'amqp://localhost:5672';

// async function connectToRabbitMQ() {
//   try {
//     console.log('Connecting to RabbitMQ...');
//     const connection = await amqp.connect(rabbitMQUrl);
//     const channel = await connection.createConfirmChannel();
//     console.log('Connected to RabbitMQ.');
//     return channel;
//   } catch (error) {
//     console.error('Error connecting to RabbitMQ:', error);
//     throw error;
//   }
// }

// export async function sendTransitTripsToDashboard(updatedTripsInMemory) {
//   try {
//     console.log('Sending message to RabbitMQ...');

//     const channel = await connectToRabbitMQ();

//     const exchangeName = 'dashboard';
//     const routingKey = 'transitBatchjob';
//     const queue = 'tripbatchjob';

//     console.log(`Asserting exchange: ${exchangeName}`);
//     await channel.assertExchange(exchangeName, 'direct', { durable: true });

//     console.log(`Asserting queue: ${queue}`);
//     await channel.assertQueue(queue, { durable: true });

//     console.log(`Binding queue ${queue} to exchange ${exchangeName} with routing key ${routingKey}`);
//     await channel.bindQueue(queue, exchangeName, routingKey);

//     const message = {
//       updatedTripsInMemory,
//     };

//     console.log('Publishing message to RabbitMQ:', message);

//     try {
//       // Publishing message to RabbitMQ
//       await channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(message)), { persistent: true });

//       console.log('Message sent to RabbitMQ:', message);
//     } catch (error) {
//       console.error('Error sending message to RabbitMQ:', error);
//       throw error;
//     } finally {
//       // Close the channel after a short delay (adjust the delay based on your requirements)
//       setTimeout(async () => {
//         await channel.close();
//         console.log('Channel closed.');
//       }, 5000); // Adjust the delay (e.g., 5000ms) based on your requirements
//     }

//     return true; // Return true on successful message sending
//   } catch (error) {
//     // Handle errors with consistent error handling
//     console.error('Error sending transit trips to the dashboard microservice:', error);
//     return false;
//   }
// }
