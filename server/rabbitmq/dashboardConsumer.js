import amqp from 'amqplib';
import { fullUpdateTravel } from './messageProcessor/travel.js';
import dotenv from 'dotenv';
import { updateTripStatus } from './messageProcessor/trip.js';
import { expenseReportApproval, travelStandAloneApproval } from './messageProcessor/approval.js';

dotenv.config();

// export const consumeFromDashboardQueue = async () => {
//   console.log("sync - consumeFromDashboardQueue", consumeFromDashboardQueue)
//   const rabbitMQUrl = process.env.rabbitMQUrl;

//   try {
//     console.log('Consuming messages from RabbitMQ...consumeFromDashboardQueue');

//     const connectToRabbitMQ = async () => {
//       try {
//         console.log('Connecting to RabbitMQ...');
//         const connection = await amqp.connect(rabbitMQUrl);
//         const channel = await connection.createConfirmChannel();
//         console.log('Connected to RabbitMQ.');
//         return channel;
//       } catch (error) {
//         console.log('Error connecting to RabbitMQ:', error);
//         throw error;
//       }
//     };

//     const channel = await connectToRabbitMQ();
//     const queueName = 'sync';

//     console.log(`Asserting queue: ${queueName}`);
//     await channel.assertQueue(queueName, { durable: true });

//     console.log(`Consuming messages from queue: ${queueName}`);
//     channel.consume(queueName, async (msg) => {
//       try {
//         if (msg !== null && msg.content) {
//           const content = JSON.parse(msg.content.toString());

//           console.log(`coming from ${content.headers?.source}`);
//           const payload = content?.payload;
//           const source = content.headers.source;
//           const isNeedConfirmation = content.headers.needConfirmation;

//           if (isNeedConfirmation) {
//             // Update dashboard and send confirmation
//             if(source == 'travel'){
//               const success = await updateDashboard(payload);

//               if (success) {
//                 // Send confirmation
//                 const confirmationMessage = {
//                   headers: {
//                     type: 'confirmation',
//                     correlationId: msg.properties.correlationId,
//                   },
//                   payload: { confirmation: true },
//                 };
//                 channel.publish('', queueName, Buffer.from(JSON.stringify(confirmationMessage)), {
//                   persistent: true,
//                 });
  
//                 // Acknowledge the message after successful processing
//                 channel.ack(msg);
//               } else{
//                 console.log("Error processing confirmation message", msg);
//               }
//             } else if(source == 'trip'){
//               if(action == 'status-update'){
//                 const success = await updateTripStatus(payload);
//                 if(!success){
//                   console.log("trip Status updated via batchJob", success)
//                   const confirmationMessage={
//                     headers:{
//                       type: 'confirmation',
//                       correlationId: msg.properties.correlationId,
//                     },
//                     payload:{confirmation: true},
//                   };
//                   channel.publish('', queueName, Buffer.from(JSON.stringify(confirmationMessage)), {
//                     persistent: true,
//                   });
//                 // Acknowledge the message after successful processing
//                 channel.ack(msg);
//                 } else{
//                   console.log("Acknowledge message failed from trip ", msg);
//                 }
//               }
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error processing message:', error);
//       }
//     });
//   } catch (error) {
//     console.log('Error consuming messages from RabbitMQ:', error);
//     throw error;
//   }
// };

   
export const consumeFromDashboardQueue = async () => {
  console.log("sync - consumeFromDashboardQueue");
  const rabbitMQUrl = process.env.rabbitMQUrl;
 
  try {
     console.log('Connecting to RabbitMQ...');
     const connection = await amqp.connect(rabbitMQUrl);
     const channel = await connection.createConfirmChannel();
     console.log('Connected to RabbitMQ.');
     const exchangeName = 'amqp.dashboard';
     const queue = 'sync';
 
     console.log(`Asserting exchange: ${exchangeName}`);
     await channel.assertExchange(exchangeName, 'direct', { durable: true });
 
     console.log(`Asserting queue: ${queue}`);
     await channel.assertQueue(queue, { durable: true });
 
     console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
     await channel.bindQueue(queue, exchangeName, '');
 
     channel.consume(queue, async (msg) => {
       if (msg !== null && msg.content) {
         try {
           const content = JSON.parse(msg.content.toString());
           const headers = content.headers;
           const payload = content.payload;
           const source = headers.source;
           const isNeedConfirmation = headers.needConfirmation;
           let action = headers.action;
 
           // Process only messages with type 'new'
           if (headers.type === 'new') {
             console.log("Processing message of type 'new'");
             console.log("Headers:", headers, "Source:", source, "Need Confirmation:", isNeedConfirmation);

             // Determine the confirmation status based on the success of the database update
             let success = false;
             if (isNeedConfirmation) {
               if (source === 'travel') {
                 success = await updateDashboard(payload);
               } else if (source === 'trip'){ 
                if(headers.action === 'status-update') {
                 success = await updateTripStatus(payload);
               } if (headers.action === 'full-update'){
                 success = await fullUpdateTrip(payload);
               }
               } else if (source === 'approval'){
               if(action ='expense-approval'){
              console.log("approve expense report")
                success = await expenseReportApproval(payload)
              }
              if(action== 'travel'){
                success = await travelStandAloneApproval(payload)
              }
              }
              }

             // Prepare confirmation message
             const confirmationMessage = {
               headers: {
                 type: 'confirmation',
                 correlationId: msg.properties.correlationId,
                 needConfirmation: isNeedConfirmation,
               },
               payload: { success },
             };
 
             // Send confirmation back to the replyTo queue
             channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(confirmationMessage)), {
               correlationId: msg.properties.correlationId,
             });
 
             // Acknowledge the message after sending the confirmation
             channel.ack(msg);
           }
         } catch (error) {
           console.error('Error processing message:', error);
           // Reject the message if there's an error
           if (msg) channel.reject(msg, true);
         }
       }
     }, { noAck: false });
  } catch (error) {
     console.log('Error consuming messages from RabbitMQ:', error);
     throw error;
  }
 };


   
  const updateDashboard = async (payload) => {
    return true; // Return true for successful update, false otherwise
};
  


