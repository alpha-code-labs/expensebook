import amqp from 'amqplib';
import { generateUniqueIdentifier } from '../utils/uuid.js';
import CashAdvance from '../models/cashSchema.js';



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
      source: 'cash',
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
        const extractedCashData = await extractCashData(payload.travelRequestData.travelRequestId);


        const extractedMessageHeaders = {
          type: 'new',
          source: 'cash',
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
