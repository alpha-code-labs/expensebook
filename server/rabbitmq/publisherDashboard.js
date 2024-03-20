import amqp from 'amqplib';
import { generateUniqueIdentifier } from '../utils/uuid.js';
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

export const sendToDashboardMicroservice = async (payload, action, comments, source = 'approval', onlineVsBatch = 'online', needConfirmation = true) => {
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