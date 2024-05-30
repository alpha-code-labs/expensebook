import amqp from 'amqplib';
import { generateUniqueIdentifier } from '../utils/uuid.js';
import CashAdvance from '../models/cashSchema.js';
import dotenv from 'dotenv'

dotenv.config()


const rabbitMQUrl = process.env.NODE_ENV == 'production' ? process.env.RBMQ_PROD_URL : process.env.RBMQ_URL;

let channel
const connectToRabbitMQ = async () => {
  try {
    console.log('Connecting to RabbitMQ...');
    const connection = await amqp.connect(rabbitMQUrl);
     channel = await connection.createConfirmChannel();
    console.log('Connected to RabbitMQ.');
    return channel;
  } catch (error) {
    console.log('Error connecting to RabbitMQ:', error);
    throw error;
  }
};

export const sendToDashboardQueue = async (payload,  comments, action, onlineVsBatch = 'batch', source = 'cash') => {
  try {
     console.log('Connecting to RabbitMQ...');
     const connection = await amqp.connect(rabbitMQUrl);
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
     console.error('Error sending travel request to the dashboard microservice:', error);
     return false;
  }
 };

// extarct cash data and send again
const extractCashData = async (travelRequestId) => {
  try {
    const cashAdvance = await CashAdvance.findOne({ 'travelRequestData.travelRequestId': travelRequestId});
    if (!cashAdvance) {
      throw new Error('CashAdvance not found');
    }
    return cashAdvance;
  } catch (error) {
    console.log('Error while extracting cashAdvance:', error.message);
    throw error;
  }
};

export async function sendToOtherMicroservice(payload, action='full-update', destination, comments, source='cash', onlineVsBatch='online'){
  try {
      console.log('Sending message to RabbitMQ...');
  
      const channel = await connectToRabbitMQ();
      const exchangeName = 'amqp.dashboard';
      const queue = `q.${destination}`;
      const routingKey = `rk.${destination}`
  
      console.log(`Asserting exchange: ${exchangeName}`);
      await channel.assertExchange(exchangeName, 'direct', { durable: true });
  
      console.log(`Asserting queue: ${queue}`);
      await channel.assertQueue(queue, { durable: true });
  
      console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
      await channel.bindQueue(queue, exchangeName, routingKey);
  
      // Set different headers based on needConfirmation
      const messageHeaders = {
        destination,
        source,
        action,
        onlineVsBatch: onlineVsBatch,
        comments,
      };
  
      const messageToSend = {
        headers: messageHeaders, 
        payload
       };
  
      console.log('Publishing message to RabbitMQ:', messageToSend);
  
      try {
        
          // Publish for asynchronous processing
          channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(messageToSend)), {
            persistent: true,
          });
        
        console.log('Message sent to RabbitMQ:', messageToSend);

      } catch (error) {
        console.log('Error sending message to RabbitMQ:', error);
        throw error;
      } finally {
        // Close the channel after a short delay
        setTimeout(async () => {
          await channel.close();
          console.log('Channel closed.');
        }, 5000);
      }
    } catch (error) {
      // Handle errors with consistent error handling
      console.log(`Error cash advance data to ${destination} microservice:`, error);
      return false;
    }
}

