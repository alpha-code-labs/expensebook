// import amqp from 'amqplib';
// import { generateUniqueIdentifier } from '../utils/uuid.js';
// import { Approval } from '../models/approvalSchema.js';

// const rabbitMQUrl = 'amqp://localhost:5672';

// let channel
// // Establishing connection to rabbitmq
// const connectToRabbitMQ = async () => {
//   try {
//     console.log('Connecting to RabbitMQ...');
//     const connection = await amqp.connect(rabbitMQUrl);
//      channel = await connection.createConfirmChannel();
//     console.log('Connected to RabbitMQ.');
//     return channel;
//   } catch (error) {
//     console.error('Error connecting to RabbitMQ:', error);
//     throw error;
//   }
// };

// // sending travelApprovalDoc to dashboard ---- travelApprovalDoc, needConfirmation, data all are synchrnous in operation
// export const sendApprovalToDashboardQueue = async (travelApprovalDoc, needConfirmation, data) => {
//   try {
//     console.log('Sending message to RabbitMQ...');

//     const channel = await connectToRabbitMQ();

//     const exchangeName = 'amqp.dashboard';

//     const queue = 'sync';

//     console.log(`Asserting exchange: ${exchangeName}`);
//     await channel.assertExchange(exchangeName, 'headers', { durable: true });

//     console.log(`Asserting queue: ${queue}`);
//     await channel.assertQueue(queue, { durable: true });

//     console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
//     await channel.bindQueue(queue, exchangeName);

//     const isneedConfirmation = true;
//     // message headers
//     const messageHeaders = {
//       type: 'new',
//       source: 'approval',
//       data: data,
//       needConfirmation: isneedConfirmation,
//     };

//     const messageToSend = {
//       headers: messageHeaders,
//       payload: travelApprovalDoc,
//     };

//     console.log('Publishing message to RabbitMQ:', messageToSend);

//     try {
//       let result;
    
//       if (needConfirmation) {
//         const correlationId = generateUniqueIdentifier();
    
//         result = await new Promise((resolve) => {
//           // Listen for response
//           channel.consume(queue, (msg) => {
//             if (msg.properties.correlationId === correlationId) {
//               resolve(JSON.parse(msg.content.toString()));
//             }
//           }, { noAck: true });
    
//           // Publishing message to RabbitMQ with correlationId
//           channel.publish(exchangeName, '', Buffer.from(JSON.stringify(messageToSend)), {
//             persistent: true,
//             correlationId: correlationId,
//           });
//         });
//       } 
//       console.log('Message sent to RabbitMQ:', messageToSend);
    
//       // Wait for response if needConfirmation is true
//       if (needConfirmation) {
//         if (result === true) {
//           console.log('Dashboard updated successfully');
//         } else {
//           console.error('Internal server error. Try again later.');
    
//           // Extract approval document
//           const extractedApprovalDoc = await extractApproval(approvalDoc.approvalId);
    
//           // Send a new message with the extracted data
//           const extractedMessageHeaders = {
//             type: 'new',
//             source: 'approval',
//             data: data,
//             needConfirmation: needConfirmation,
//           };
    
//           const extractedMessageToSend = {
//             headers: extractedMessageHeaders,
//             payload: extractedApprovalDoc,
//           };
    
//           // Publish extracted approval document to the same queue with needConfirmation
//           channel.publish(exchangeName, '', Buffer.from(JSON.stringify(extractedMessageToSend)), {
//             persistent: true,
//           });
//         }
//       }
    
//       return needConfirmation ? result : true;
//     } catch (error) {
//       console.error('Error sending message to RabbitMQ:', error);
//       throw error;
//     } finally {
//       // Close the channel after a short delay
//       setTimeout(async () => {
//         await channel.close();
//         console.log('Channel closed.');
//       }, 5000);
//     }
//   } catch (error) {
//     // Handle errors with consistent error handling
//     console.error('Error sending transit travelApprovalDocs to the dashboard microservice:', error);
//     return false;
//   }
// };

// // extarct travelApprovalDoc and send again
// const extractApproval = async (approvalId) => {
//   try {
//     const travelApprovalDoc = await Approval.findOne({ approvalId }); 
//     if (!travelApprovalDoc) {
//       throw new Error('travelApprovalDoc not found');
//     }
//     return travelApprovalDoc;
//   } catch (error) {
//     console.error('Error while extracting travelApprovalDoc:', error.message);
//     throw error; 
//   }
// };




// Example JSON structure
const itinerary = {
    section1: [
        { itineraryId: 1, approvers: ['Alice', 'Bob'] },
        { itineraryId: 2, approvers: ['Charlie', 'David'] },
    ],
    section2: [
        { itineraryId: 3, approvers: ['Eve', 'Frank'] },
        { itineraryId: 4, approvers: ['Grace', 'Harry'] },
    ],
    section3: [
        { itineraryId: 5, approvers: ['Ivy', 'Jack'] },
        { itineraryId: 6, approvers: ['Kim', 'Leo'] },
    ],
};

// Step 1: Object.values(itinerary)
const step1Result = Object.values(itinerary);
// Result:
// [
//     [
//         { itineraryId: 1, approvers: ['Alice', 'Bob'] },
//         { itineraryId: 2, approvers: ['Charlie', 'David'] },
//     ],
//     [
//         { itineraryId: 3, approvers: ['Eve', 'Frank'] },
//         { itineraryId: 4, approvers: ['Grace', 'Harry'] },
//     ],
//     [
//         { itineraryId: 5, approvers: ['Ivy', 'Jack'] },
//         { itineraryId: 6, approvers: ['Kim', 'Leo'] },
//     ],
// ]

// Step 2: .flatMap(value => Array.isArray(value) ? value : [])
const step2Result = step1Result.flatMap(value => Array.isArray(value) ? value : []);
// Result:
// [
//     { itineraryId: 1, approvers: ['Alice', 'Bob'] },
//     { itineraryId: 2, approvers: ['Charlie', 'David'] },
//     { itineraryId: 3, approvers: ['Eve', 'Frank'] },
//     { itineraryId: 4, approvers: ['Grace', 'Harry'] },
//     { itineraryId: 5, approvers: ['Ivy', 'Jack'] },
//     { itineraryId: 6, approvers: ['Kim', 'Leo'] },
// ]

// Step 3: .find(obj => obj.itineraryId === itineraryId)?.approvers
const itineraryId = 4; // Example itineraryId
const foundApprovers = step2Result.find(obj => obj.itineraryId === itineraryId)?.approvers;
// Result: ['Grace', 'Harry']
