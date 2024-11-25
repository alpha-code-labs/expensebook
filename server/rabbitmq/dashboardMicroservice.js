import amqp from 'amqplib';
import { generateUniqueIdentifier } from '../utils/uuid.js';
import Trip from '../models/tripSchema.js';
import pino from 'pino';
import pinoPretty from 'pino-pretty';

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


export const sendToDashboardMicroservice = async (payload, action, comments, source = 'trip', onlineVsBatch = 'batch', needConfirmation = true) => {
  try {
     console.log('Connecting to RabbitMQ...');
     const connection = await amqp.connect(process.env.rabbitMQUrl);
     console.log('Connected to RabbitMQ.');
 
     console.log('Creating confirm channel...');
     const channel = await connection.createConfirmChannel();
     console.log('Confirm channel created.');
 
     const exchangeName = 'amqp.dashboard';
     const queue = 'sync';
     const correlationId = generateUniqueIdentifier(); 
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

           if (response.headers && response.headers.type === 'confirmation') {
             const success = response.payload.success;
             console.log(`Confirmation received with success status: ${success}`);
             resolve(success); 
           } else {
             console.error('Unexpected response format.');
             reject(new Error('Unexpected response format.'));
           }
 
           channel.ack(msg); 
           console.log('Message acknowledged.');
           channel.close(); 
           console.log('Channel closed.');
           connection.close(); 
           console.log('Connection closed.');
         }
       }, { noAck: false }); 
 
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
