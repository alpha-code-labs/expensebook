import amqp from 'amqplib';
import { generateUniqueIdentifier } from '../utils/uuid.js';
import { Approval } from '../models/approvalSchema.js';



let channel
// Establishing connection to rabbitmq
const connectToRabbitMQ = async () => {
  const rabbitMQUrl = process.env.rabbitMQUrl ;

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


// 1--sending travelApprovalDoc to dashboard ---- travelApprovalDoc, needConfirmation, all are synchrnous in operation
export const sendTripApprovalToDashboardQueue = async (tripApprovalDoc) => {
  try {
    console.log('Sending message to RabbitMQ...');

    const channel = await connectToRabbitMQ();

    const exchangeName = 'amqp.dashboard';

    const queue = 'sync';

    console.log(`Asserting exchange: ${exchangeName}`);
    await channel.assertExchange(exchangeName, 'headers', { durable: true });

    console.log(`Asserting queue: ${queue}`);
    await channel.assertQueue(queue, { durable: true });

    console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
    await channel.bindQueue(queue, exchangeName);

    const isneedConfirmation = true;
    // message headers
    const messageHeaders = {
      type: 'new',
      source: 'approval',
      onlineVsBatch: 'online',
      needConfirmation: isneedConfirmation,
    };

    const messageToSend = {
      headers: messageHeaders,
      payload: tripApprovalDoc,
    };

    console.log('Publishing message to RabbitMQ:', messageToSend);

    try {
      let result;
    
      if (needConfirmation) {
        const correlationId = generateUniqueIdentifier();
    
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
      } 
      console.log('Message sent to RabbitMQ:', messageToSend);
    
      // Wait for response if needConfirmation is true
      if (needConfirmation) {
        if (result === true) {
          console.log('Dashboard updated successfully');
        } else {
          console.error('Internal server error. Try again later.');
    
          // Extract approval document
          const extractedApprovalDoc = await extractTripApproval(tripApprovalDoc.approvalId);
    
          // Send a new message with the extracted onlineVsBatch
          const extractedMessageHeaders = {
            type: 'new',
            source: 'approval',
            onlineVsBatch: 'online',
            needConfirmation: needConfirmation,
          };
    
          const extractedMessageToSend = {
            headers: extractedMessageHeaders,
            payload: extractedApprovalDoc,
          };
    
          // Publish extracted approval document to the same queue with needConfirmation
          channel.publish(exchangeName, '', Buffer.from(JSON.stringify(extractedMessageToSend)), {
            persistent: true,
          });
        }
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
    console.error('Error sending transit travelApprovalDocs to the dashboard microservice:', error);
    return false;
  }
};

// extarct travelApprovalDoc and send again
const extractTripApproval = async (approvalId) => {
  try {
    const tripApprovalDoc = await Approval.findOne({ approvalId }); 
    if (!tripApprovalDoc) {
      throw new Error('tripApprovalDoc not found');
    }
    return tripApprovalDoc;
  } catch (error) {
    console.error('Error while extracting tripApprovalDoc:', error.message);
    throw error; 
  }
};

// 2---
export const sendTravelApprovalToDashboardQueue = async (travelApprovalDoc) => {
  try {
    console.log('Sending message to RabbitMQ...');

    const channel = await connectToRabbitMQ();

    const exchangeName = 'amqp.dashboard';

    const queue = 'sync';

    console.log(`Asserting exchange: ${exchangeName}`);
    await channel.assertExchange(exchangeName, 'headers', { durable: true });

    console.log(`Asserting queue: ${queue}`);
    await channel.assertQueue(queue, { durable: true });

    console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
    await channel.bindQueue(queue, exchangeName);

    const isneedConfirmation = true;
    // message headers
    const messageHeaders = {
      type: 'new',
      source: 'approval',
      onlineVsBatch: 'online',
      needConfirmation: isneedConfirmation,
    };

    const messageToSend = {
      headers: messageHeaders,
      payload: travelApprovalDoc,
    };

    console.log('Publishing message to RabbitMQ:', messageToSend);

    try {
      let result;
    
      if (needConfirmation) {
        const correlationId = generateUniqueIdentifier();
    
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
      } 
      console.log('Message sent to RabbitMQ:', messageToSend);
    
      // Wait for response if needConfirmation is true
      if (needConfirmation) {
        if (result === true) {
          console.log('Dashboard updated successfully');
        } else {
          console.error('Internal server error. Try again later.');
    
          // Extract approval document
          const extractedApprovalDoc = await extractTravelApproval(travelApprovalDoc.approvalId);
    
          // Send a new message with the extracted onlineVsBatch
          const extractedMessageHeaders = {
            type: 'new',
            source: 'approval',
            onlineVsBatch: 'online',
            needConfirmation: needConfirmation,
          };
    
          const extractedMessageToSend = {
            headers: extractedMessageHeaders,
            payload: extractedApprovalDoc,
          };
    
          // Publish extracted approval document to the same queue with needConfirmation
          channel.publish(exchangeName, '', Buffer.from(JSON.stringify(extractedMessageToSend)), {
            persistent: true,
          });
        }
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
    console.error('Error sending transit travelApprovalDocs to the dashboard microservice:', error);
    return false;
  }
};

// extarct travelApprovalDoc and send again
const extractTravelApproval = async (approvalId) => {
  try {
    const travelApprovalDoc = await Approval.findOne({ approvalId }); 
    if (!travelApprovalDoc) {
      throw new Error('travelApprovalDoc not found');
    }
    return travelApprovalDoc;
  } catch (error) {
    console.error('Error while extracting travelApprovalDoc:', error.message);
    throw error; 
  }
};

// 3-
export const sendCashApprovalToDashboardQueue = async (cashApprovalDoc) => {
  try {
    console.log('Sending message to RabbitMQ...');

    const channel = await connectToRabbitMQ();

    const exchangeName = 'amqp.dashboard';

    const queue = 'sync';

    console.log(`Asserting exchange: ${exchangeName}`);
    await channel.assertExchange(exchangeName, 'headers', { durable: true });

    console.log(`Asserting queue: ${queue}`);
    await channel.assertQueue(queue, { durable: true });

    console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
    await channel.bindQueue(queue, exchangeName);

    const isneedConfirmation = true;
    // message headers
    const messageHeaders = {
      type: 'new',
      source: 'approval',
      onlineVsBatch: 'online',
      needConfirmation: isneedConfirmation,
    };

    const messageToSend = {
      headers: messageHeaders,
      payload: cashApprovalDoc,
    };

    console.log('Publishing message to RabbitMQ:', messageToSend);

    try {
      let result;
    
      if (needConfirmation) {
        const correlationId = generateUniqueIdentifier();
    
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
      } 
      console.log('Message sent to RabbitMQ:', messageToSend);
    
      // Wait for response if needConfirmation is true
      if (needConfirmation) {
        if (result === true) {
          console.log('Dashboard updated successfully');
        } else {
          console.error('Internal server error. Try again later.');
    
          // Extract approval document
          const extractedApprovalDoc = await extractCashApproval(cashApprovalDoc.approvalId);
    
          // Send a new message with the extracted onlineVsBatch
          const extractedMessageHeaders = {
            type: 'new',
            source: 'approval',
            onlineVsBatch: 'online',
            needConfirmation: needConfirmation,
          };
    
          const extractedMessageToSend = {
            headers: extractedMessageHeaders,
            payload: extractedApprovalDoc,
          };
    
          // Publish extracted approval document to the same queue with needConfirmation
          channel.publish(exchangeName, '', Buffer.from(JSON.stringify(extractedMessageToSend)), {
            persistent: true,
          });
        }
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
    console.error('Error sending transit cashApprovalDocs to the dashboard microservice:', error);
    return false;
  }
};

// extarct cashApprovalDoc and send again
const extractCashApproval = async (approvalId) => {
  try {
    const cashApprovalDoc = await Approval.findOne({ approvalId }); 
    if (!cashApprovalDoc) {
      throw new Error('cashApprovalDoc not found');
    }
    return cashApprovalDoc;
  } catch (error) {
    console.error('Error while extracting cashApprovalDoc:', error.message);
    throw error; 
  }
};










// // 1-To update in travelSchema in Dashboard
// export const sendTravelApproval = async (travelApprovalDoc, needConfirmation ) => {
//   return sendApproval(travelApprovalDoc, 'travel', needConfirmation);
// }

// //1- To update in cashSchema in Dashboard
// export const sendCashApproval = async (cashApprovalDoc, needConfirmation ) => {
//   return sendApproval(cashApprovalDoc, 'cash', needConfirmation ); 
// }

// // 1-To update in tripSchema in Dashboard
// export const sendTripApproval = async (cashApprovalDoc, needConfirmation ) => {
//   return sendApproval(cashApprovalDoc, 'trip', needConfirmation );
// }

// // 2 - Extract the payload 
// const extractPayload = async (approvalId, schemaType) => {
//   switch(schemaType) {
//     case 'travel': 
//       return extractTravelApproval(approvalId);
//     case 'cash':
//       return extractCashApproval(approvalId);
//     case 'trip':
//       return extractTripApproval(approvalId);
//   }
// }







































































































//---------------------------------------------------------------------------------------

// send to Synchronous queue --  cancel travelApprovalDoc at header level
export const sendapprovalToDashboardSyncQoueue = (travelApprovalDoc) => {
  try {
    console.log('Sending message to RabbitMQ...sync');

    const channel = connectToRabbitMQ(); //sync

    const exchangeName = 'amqp.dashboard';
    const queue = 'sync';

    console.log(`Asserting exchange: ${exchangeName}`);
    channel.assertExchange(exchangeName, 'headers', { durable: true });

    console.log(`Asserting queue: ${queue}`);
    channel.assertQueue(queue, { durable: true });

    console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
    channel.bindQueue(queue, exchangeName);

    const messageHeaders = {
      type: 'new',
      source: 'approval',
      onlineVsBatch:'online'
    };

    const message = {
      headers: messageHeaders,
      travelApprovalDoc,
    };

    console.log('Publishing message to RabbitMQ:', message);

    try {
      // Publishing message to RabbitMQ
      const uniqueIdentifier = generateUniqueIdentifier(); //sync

      channel.publish(exchangeName, '', Buffer.from(JSON.stringify(message)), {
        persistent: true,
        correlationId: uniqueIdentifier,
      });

      console.log('Message sent to RabbitMQ:', message);
    } catch (error) {
      console.error('Error sending message to RabbitMQ:', error);
      throw error;
    } finally {
      // Close the channel after a short delay (adjust the delay)
      setTimeout(() => {
        channel.close();

        console.log('Channel closed.');
      }, 5000);
    }

    return true; // Return true on successful message sending to RabbitMQ
} catch (error) {
  console.error('Error sending transit travelApprovalDocs to the dashboard microservice:', error);
  return false;
} finally {
  setTimeout(() => {
    if (channel) {
      channel.close();
      console.log('Channel closed.');
    }
  }, 5000);
}
};

// // Function to consume messages from the sync queue
// const consumeMessagesSync = async (channel) => {
//   const exchangeName = 'amqp.dashboard';
//   const queue = 'sync';

//   try {
//     console.log(`Asserting exchange: ${exchangeName}`);
//     await channel.assertExchange(exchangeName, 'headers', { durable: true });

//     console.log(`Asserting queue: ${queue}`);
//     await channel.assertQueue(queue, { durable: true });

//     console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
//     await channel.bindQueue(queue, exchangeName);

//     channel.consume(queue, (msg) => {
//       if (msg.content) {
//         const message = JSON.parse(msg.content.toString());

//         // Process message
//         console.log(`Received message with correlation ID ${msg.properties.correlationId}:`, message);

//         // Check if the message is a confirmation with type: 'confirmation' and source: 'approval'
//         if (
//           message.headers &&
//           message.headers.type === 'confirmation' &&
//           message.headers.source === 'approval'
//         ) {
//           // Acknowledge the message
//           channel.ack(msg);

//           // Process the confirmation message
//           console.log(`Received confirmation message with correlation ID ${msg.properties.correlationId}:`, message);

//           // Show success or failure message to the user
//           if (message.success) {
//             console.log('Success!'); 
//             //  discard the message if it's successful
//           } else {
//             console.error('Failure! Please try again.'); 
//             // i think try again should be added here
//           }
//         } else {
//           channel.ack(msg);
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Error in consumeMessagesSync:', error);
//   }
// };

// Eusage:
// const channel = await connectToRabbitMQ();
// consumeMessagesSync(channel);

// Connect and start consuming messages from the sync queue
// consumeMessagesSync(channel);

// import amqp from 'amqplib';

// const rabbitMQUrl = 'amqp://localhost:5672';

// async function connectToRabbitMQ() {
//   try {
//     console.log('Connecting to RabbitMQ...');
//     const connection = await amqp.connect(rabbitMQUrl);
//     const channel = await connection.createConfirmChannel();
//     console.log('Connected to RabbitMQ.');
//     return channel;
//   } catch (error) {
//     console.error('Error connecting to RabbitMQ:', error);
//     throw error;
//   }
// }

// export async function sendTransitTripsToDashboard(updatedTripsInMemory) {
//   try {
//     console.log('Sending message to RabbitMQ...');

//     const channel = await connectToRabbitMQ();

//     const exchangeName = 'dashboard';
//     const routingKey = 'transitBatchjob';
//     const queue = 'tripbatchjob';

//     console.log(`Asserting exchange: ${exchangeName}`);
//     await channel.assertExchange(exchangeName, 'direct', { durable: true });

//     console.log(`Asserting queue: ${queue}`);
//     await channel.assertQueue(queue, { durable: true });

//     console.log(`Binding queue ${queue} to exchange ${exchangeName} with routing key ${routingKey}`);
//     await channel.bindQueue(queue, exchangeName, routingKey);

//     const message = {
//       updatedapprovalsInMemory,
//     };

//     console.log('Publishing message to RabbitMQ:', message);

//     try {
//       // Publishing message to RabbitMQ
//       await channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(message)), { persistent: true });

//       console.log('Message sent to RabbitMQ:', message);
//     } catch (error) {
//       console.error('Error sending message to RabbitMQ:', error);
//       throw error;
//     } finally {
//       // Close the channel after a short delay (adjust the delay based on your requirements)
//       setTimeout(async () => {
//         await channel.close();
//         console.log('Channel closed.');
//       }, 5000); // Adjust the delay (e.g., 5000ms) based on your requirements
//     }

//     return true; // Return true on successful message sending
//   } catch (error) {
//     // Handle errors with consistent error handling
//     console.error('Error sending transit approval to the dashboard microservice:', error);
//     return false;
//   }
// }
