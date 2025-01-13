import amqp from 'amqplib';
import { generateUniqueIdentifier } from '../utils/uuid.js';
import Expense from '../models/tripSchema.js';

const rabbitMQUrl = process.env.rabbitMQUrl


let channel
const connectToRabbitMQ = async () => {
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

export const sendToDashboardMicroservice = async (payload, action, comments, source = 'expense', onlineVsBatch = 'batch', needConfirmation = true) => {
  try {
     console.log('Connecting to RabbitMQ...');
     const connection = await amqp.connect(rabbitMQUrl);
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

export const sendTravelExpenseToDashboardQueue = async (payload, needConfirmation, onlineVsBatch, source) => {
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
      source,
      onlineVsBatch,
      needConfirmation,
    };

    const messageToSend = {
      headers: messageHeaders, payload
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
        const extractedFromTravelExpenseData = await extractTravelExpenseReport(payload.tripId, payload.expenseHeaderId);


        const extractedMessageHeaders = {
          type: 'new',
          source,
          onlineVsBatch: onlineVsBatch,
          needConfirmation: needConfirmation,
        };

        const extractedMessageToSend = {
          headers: extractedMessageHeaders,
          payload: extractedFromTravelExpenseData,
        };


        // Publish extractedTrip to the same queue with needConfirmation
        channel.publish(exchangeName, '', Buffer.from(JSON.stringify(extractedMessageToSend)), {
          persistent: true,
        });
      }


      return needConfirmation ? result : true;
    } catch (error) {
      console.error('Error sending message to RabbitMQ:', error);
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
    console.error('Error sending travel expense to the dashboard microservice:', error);
    return false;
  }
};


// extarct travel expense and send again
const extractTravelExpenseReport = async (tripId, expenseHeaderId) => {
    try {
      const travelExpenseReport = await Expense.findOne({ tripId, expenseHeaderId });
      if (!travelExpenseReport) {
        throw new Error(`Travel expense not found for trip ID ${tripId} and expense header ID ${expenseHeaderId}`);
        // throw new Error(`TRAVEL_EXPENSE_NOT_FOUND: ${tripId} - ${expenseHeaderId}`);
      }
      return travelExpenseReport;
    } catch (error) {
      console.error('Error while extracting travel expense:', error.message);
      throw error;
    }
};
  
  


