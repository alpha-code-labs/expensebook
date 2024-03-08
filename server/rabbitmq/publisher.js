import amqp from 'amqplib';
import { generateUniqueIdentifier } from '../utils/uuid.js';
import dotenv from 'dotenv'
import { extractApproval } from './messageProcessor/approvalMessage.js';

dotenv.config()

const rabbitMQUrl = process.env.rabbitMQUrl ;

   const connectToRabbitMQ = async () => {
    try {
      console.log('Connecting to RabbitMQ...');
      const connection = await amqp.connect(rabbitMQUrl);
      const channel = await connection.createConfirmChannel();
      console.log('Connected to RabbitMQ.');
      return channel;
    } catch (error) {
          console.log('Error connecting to RabbitMQ:', error);
      throw error;
    }
   };


   export const sendToDashboardQueue = async (payload, needConfirmation, onlineVsBatch) => {
    try {
      console.log('Sending message to RabbitMQ...');
  
  
      const channel = await connectToRabbitMQ();
      const exchangeName = 'amqp.dashboard';
      const queue = needConfirmation ? 'sync' : 'async';
  
      console.log(`Asserting exchange: ${exchangeName}`);
      await channel.assertExchange(exchangeName, 'direct', { durable: true });
  
      console.log(`Asserting queue: ${queue}`);
      await channel.assertQueue(queue, { durable: true });
  
  
      console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
      await channel.bindQueue(queue, exchangeName);
  
  
      // Set different headers based on needConfirmation
      const messageHeaders = {
        type: 'new',
        source: 'approval',
        onlineVsBatch: onlineVsBatch,
        needConfirmation: needConfirmation,
      };
  
  
      const messageToSend = {
        headers: messageHeaders, 
        payload
     };
  
  
      console.log('Publishing message to RabbitMQ:', messageToSend);
  
      try {
        let result;
        if (needConfirmation) {
          const correlationId = generateUniqueIdentifier();
  
          // Implement request-response pattern for synchronous confirmation
          result = await new Promise((resolve) => {
            // Listen for response
            channel.consume(queue, (msg) => {
              if (msg.properties.correlationId === correlationId) {
                resolve(JSON.parse(msg.content.toString()));
              }
            }, { noAck: true });
  
  
            // Publishing message to RabbitMQ with correlationId
            channel.publish(exchangeName, '', Buffer.from(JSON.stringify(messageToSend)), {
              persistent: true,
              correlationId: correlationId,
            });
          });
        } else {
          // Publish directly for asynchronous processing
          channel.publish(exchangeName, '', Buffer.from(JSON.stringify(messageToSend)), {
            persistent: true,
          });
        }
  
  
        console.log('Message sent to RabbitMQ:', messageToSend);
  
  
        // Wait for response if needConfirmation is true
        if (needConfirmation && result === false) {
          const extractedCashData = await extractApproval(payload.travelRequestData.tenantId,payload.travelRequestData.travelRequestId);
  
          const extractedMessageHeaders = {
            type: 'new',
            source: 'approval',
            onlineVsBatch: onlineVsBatch,
            needConfirmation: needConfirmation,
          };
  
  
          const extractedMessageToSend = {
            headers: extractedMessageHeaders,
            payload: {...extractedCashData},
          };
  
  
          // Publish extractedCashData to the same queue with needConfirmation
          channel.publish(exchangeName, '', Buffer.from(JSON.stringify(extractedMessageToSend)), {
            persistent: true,
          });
        }
  
  
        return needConfirmation ? result : true;
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
      console.log('Error sending cash data to the dashboard microservice:', error);
      return false;
    }
  };

export async function sendToOtherMicroservice(payload, action, destination, comments, source='approval', onlineVsBatch='online'){
    try {
        console.log('Sending message to RabbitMQ...');
    
        const channel = await connectToRabbitMQ();
        const exchangeName = 'amqp.dashboard';
        const queue = `q.${destination}`
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
        console.log(Error` cash advance data to ${destination} microservice:`, error);
        return false;
      }
}