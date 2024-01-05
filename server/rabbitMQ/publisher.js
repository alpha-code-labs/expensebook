import amqp from 'amqplib';
import { generateUniqueIdentifier } from '../utils/uuid.js';
import TravelRequest from '../models/travelRequest.js';



const rabbitMQUrl = 'amqp://ajay318:ajay318@localhost:5672';


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


export const sendToDashboardQueue = async (payload, needConfirmation, onlineVsBatch) => {
  try {
    console.log('Sending message to RabbitMQ...');


    const channel = await connectToRabbitMQ();
    const exchangeName = 'amqp.dashboard';
    const queue = needConfirmation ? 'sync' : 'async';

    console.log(`Asserting exchange: ${exchangeName}`);
    await channel.assertExchange(exchangeName, 'headers', { durable: true });

    console.log(`Asserting queue: ${queue}`);
    await channel.assertQueue(queue, { durable: true });


    console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
    await channel.bindQueue(queue, exchangeName);


    // Set different headers based on needConfirmation
    const messageHeaders = {
      type: 'new',
      source: 'travel',
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
        const extractedTravelRequest = await extractTravelRequest(payload.travelRequestId);


        const extractedMessageHeaders = {
          type: 'new',
          source: 'travel',
          onlineVsBatch: onlineVsBatch,
          needConfirmation: needConfirmation,
        };


        const extractedMessageToSend = {
          headers: extractedMessageHeaders,
          payload: {...extractedTravelRequest},
        };


        // Publish extractedTravelRequest to the same queue with needConfirmation
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
    console.log('Error sending travel request to the dashboard microservice:', error);
    return false;
  }
};


// extarct travel request and send again
const extractTravelRequest = async (travelRequestId) => {
  try {
    const travelRequest = await TravelRequest.findOne({ travelRequestId });
    if (!travelRequest) {
      throw new Error('TravelRequest not found');
    }
    return travelRequest;
  } catch (error) {
    console.log('Error while extracting travelRequest:', error.message);
    throw error;
  }
};


export async function sendToOtherMicroservice(payload, comments, destination, source='travel'){
    try {
        console.log('Sending message to RabbitMQ...');
    
    
        const channel = await connectToRabbitMQ();
        const exchangeName = 'amqp.dashboard';
        const queue = 'async_microservice_to_microservice';
    
        console.log(`Asserting exchange: ${exchangeName}`);
        await channel.assertExchange(exchangeName, 'headers', { durable: true });
    
        console.log(`Asserting queue: ${queue}`);
        await channel.assertQueue(queue, { durable: true });
    
    
        console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
        await channel.bindQueue(queue, exchangeName);
    
    
        // Set different headers based on needConfirmation
        const messageHeaders = {
          destination,
          source,
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
            channel.publish(exchangeName, '', Buffer.from(JSON.stringify(messageToSend)), {
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
        console.log('Error sending travel request to the dashboard microservice:', error);
        return false;
      }
}


