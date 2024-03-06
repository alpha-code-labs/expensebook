import amqp from 'amqplib';
import { fullUpdateTravel } from './messageProcessor/travel.js';
import dotenv from 'dotenv';

dotenv.config();

export const consumeFromDashboardQueue = async () => {
  console.log("sync", consumeFromDashboardQueue)
  const rabbitMQUrl = process.env.rabbitMQUrl;

  try {
    console.log('Consuming messages from RabbitMQ...');

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

    const channel = await connectToRabbitMQ();
    const queueName = 'sync';

    console.log(`Asserting queue: ${queueName}`);
    await channel.assertQueue(queueName, { durable: true });

    console.log(`Consuming messages from queue: ${queueName}`);
    channel.consume(queueName, async (msg) => {
      try {
        if (msg !== null && msg.content) {
          const content = JSON.parse(msg.content.toString());

          console.log(`coming from ${content.headers?.source}`);
          const payload = content?.payload;
          const source = content.headers.source;
          const isNeedConfirmation = content.headers.needConfirmation;

          if (isNeedConfirmation) {
            // Update dashboard and send confirmation
            const success = await updateDashboard(payload);

            if (success) {
              // Send confirmation
              const confirmationMessage = {
                headers: {
                  type: 'confirmation',
                  correlationId: msg.properties.correlationId,
                },
                payload: { confirmation: true },
              };
              channel.publish('', queueName, Buffer.from(JSON.stringify(confirmationMessage)), {
                persistent: true,
              });

              // Acknowledge the message after successful processing
              channel.ack(msg);
            }
          }
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });
  } catch (error) {
    console.log('Error consuming messages from RabbitMQ:', error);
    throw error;
  }
};

// export const consumeFromDashboardQueue = async () => {
//   const rabbitMQUrl = process.env.rabbitMQUrl;
//     try {
//       console.log('Consuming messages from RabbitMQ...');  
//       const connectToRabbitMQ = async () => {
//        try {
//          console.log('Connecting to RabbitMQ...');
//          const connection = await amqp.connect(rabbitMQUrl);
//           const channel = await connection.createConfirmChannel();
//          console.log('Connected to RabbitMQ.');
//          return channel;
//        } catch (error) {
//          console.log('Error connecting to RabbitMQ:', error);
//          return error;
//        }
//      };
  
//       const channel = await connectToRabbitMQ();
//       const exchangeName = 'amqp.dashboard';
//       const queues = ['sync'];
  
//       console.log(`Asserting exchange: ${exchangeName}`);
//       await channel.assertExchange(exchangeName, 'direct', { durable: true });
  
//       // Assert and bind queues
//       for (const queue of queues) {
//         console.log(`Asserting queue: ${queue}`);
//         await channel.assertQueue(queue, { durable: true });
//         console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
//         await channel.bindQueue(queue, exchangeName);
//       }
  
//       // Consume messages from each queue
//       for (const queue of queues) {
//         channel.consume(queue, async (msg) => {
//           if (msg !== null & msg && msg.content) {
//             const content = JSON.parse(msg.content.toString());
            
//         console.log(`coming from ${content.headers?.source}`)
//         const payload = content?.payload
//         const source = content.headers.source
//         const isNeedConfirmation = content.headers.needConfirmation
  
//             try {
//               if (isNeedConfirmation) {
//                 // Update dashboard and send confirmation
//                 const success = await updateDashboard(payload);
//                 if (success) {
//                   // Send confirmation
//                   const confirmationMessage = {
//                     headers: {
//                       type: 'confirmation',
//                       correlationId: msg.properties.correlationId,
//                     },
//                     payload: { confirmation: true },
//                   };
//                   channel.publish(exchangeName, '', Buffer.from(JSON.stringify(confirmationMessage)), {
//                     persistent: true,
//                   });
  
//                   // Acknowledge the message after successful processing
//                   channel.ack(msg);
//                 }
//               }
//             } catch (error) {
//               console.error('Error processing message:', error);
//             }
//           }
//         });
//       }
//     } catch (error) {
//       console.log('Error consuming messages from RabbitMQ:', error);
//       throw error;
//     }
//   };
  
  // Function to update dashboard
const updateDashboard = async (payload) => {
    return true; // Return true for successful update, false otherwise
};
  


