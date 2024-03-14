import amqp from 'amqplib';
import { generateUniqueIdentifier } from '../utils/uuid.js';
import HRCompany from '../model/hr_company_structure.js';
import dotenv from 'dotenv'

dotenv.config()

//const rabbitMQUrl = 'amqp://ajay318:ajay318@localhost:5672';
const rabbitMQUrl = process.env.RBMQ_URL;

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
    await channel.assertExchange(exchangeName, 'direct', { durable: true });

    console.log(`Asserting queue: ${queue}`);
    await channel.assertQueue(queue, { durable: true });


    console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
    await channel.bindQueue(queue, exchangeName, `dashboard_${queue}`);


    // Set different headers based on needConfirmation
    const messageHeaders = {
      type: 'new',
      source: 'onboarding',
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
        result = await new Promise((resolve, reject) => {
          // Listen for response
          let sentMessage = 
          channel.consume(queue, (msg) => {
            const content = JSON.parse(msg.content.toString())
           
            if (content.headers.type == 'new' && msg.properties.correlationId === correlationId) {
                sentMessage = msg
            }

            if (content.headers.type == 'response' && msg.properties.correlationId === correlationId) {
                console.log('consumed sync q message')
                resolve(JSON.parse(msg.content.toString()));
                channel.ack(msg)
            }

            setTimeout(()=>{
                channel.ack(sentMessage)

                const content = JSON.parse(sentMessage.content.toString())

                const extractedMessageToSend = {
                  headers: content.headers,
                  payload: content.payload,
                };
        
                // Publish extractedTravelRequest to the same queue with needConfirmation
                channel.publish(exchangeName, `dashboard_${queue}`, Buffer.from(JSON.stringify(extractedMessageToSend)), {
                  persistent: true,
                  correlationId: generateUniqueIdentifier()
                });
                reject('consumer unresponsive')
              }, 5000)

          });

          // Publishing message to RabbitMQ with correlationId
          console.log('publishing to dashboard_sync q with correlation id:', correlationId)
          channel.publish(exchangeName, `dashboard_${queue}`, Buffer.from(JSON.stringify(messageToSend)), {
            persistent: true,
            correlationId: correlationId,
          });
        });

      } else {
        // Publish directly for asynchronous processing
        channel.publish(exchangeName, `dashboard_${queue}`, Buffer.from(JSON.stringify(messageToSend)), {
          persistent: true,
        });
      }


      console.log('Message sent to RabbitMQ:', messageToSend);



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
const extractHRCompany = async (tenantId) => {
  try {
    const hrCompany = await HRCompany.findOne({ tenantId });
    if (!hrCompany) {
      throw new Error('Can find requested tenant info');
    }
    return hrCompany;
  } catch (error) {
    console.log('Error while extracting tenant info:', error.message);
    throw error;
  }
};

export async function sendToOtherMicroservice(payload, comments, destination, source='onboarding', onlineVsBatch, action='full-update'){
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
    
        // Set headers
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
            channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(messageToSend) ), {
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
        console.log(`Error sending hr master info to the ${destination} microservice:`, error);
        return false;
      }
}

