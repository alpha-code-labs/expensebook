import amqp from 'amqplib';
import { generateUniqueIdentifier } from '../utils/uuid.js';

// const rabbitMQUrl = 'amqp://localhost:5672';

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

// send to asynchronous queue -- batchjobs
const sendTransitTripsToDashboard = async (updatedTripsInMemory) => {
  try {
    console.log('Sending message to RabbitMQ...');

    const channel = await connectToRabbitMQ();

    const exchangeName = 'amqp.dashboard';
    const queue = 'async';

    console.log(`Asserting exchange: ${exchangeName}`);
    await channel.assertExchange(exchangeName, 'headers', { durable: true });

    console.log(`Asserting queue: ${queue}`);
    await channel.assertQueue(queue, { durable: true });

    console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
    await channel.bindQueue(queue, exchangeName);

    const messageHeaders = {
      type: 'new',
      source: 'trip',
    };

    const message = {
      headers: messageHeaders,
      updatedTripsInMemory,
    };

    console.log('Publishing message to RabbitMQ:', message);

    try {
      // Publishing message to RabbitMQ
      const uniqueIdentifier = generateUniqueIdentifier();
    
      await channel.publish(exchangeName, '', Buffer.from(JSON.stringify(message)), {
        persistent: true,
        correlationId: uniqueIdentifier,
      });

      console.log('Message sent to RabbitMQ:', message);
    } catch (error) {
      console.error('Error sending message to RabbitMQ:', error);
      throw error;
    } finally {
      // Close the channel after a short delay (adjust the delay based on your requirements)
      setTimeout(async () => {
        await channel.close();
        console.log('Channel closed.');
      }, 5000); // Adjust the delay (e.g., 5000ms) based on your requirements
    }

    return true; // Return true on successful message sending to rabbitmq
  } catch (error) {
    // Handle errors with consistent error handling
    console.error('Error sending transit trips to the dashboard microservice:', error);
    return false;
  }
};


//---------------------------------------------------------------------------------------

// send to Synchronous queue --  cancel trip at header level
 const sendTripsToDashboardSyncQueue = (trip) => {
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
      source: 'trip',
      data:'online'
    };

    const message = {
      headers: messageHeaders,
      trip,
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
  console.error('Error sending transit trips to the dashboard microservice:', error);
  return false;
} finally {
  // Close the channel after a short delay
  setTimeout(() => {
    if (channel) {
      channel.close();
      console.log('Channel closed.');
    }
  }, 5000);
}
};

// Function to consume messages from the sync queue
const consumeMessagesSync = async (channel) => {
  const exchangeName = 'amqp.dashboard';
  const queue = 'sync';

  try {
    console.log(`Asserting exchange: ${exchangeName}`);
    await channel.assertExchange(exchangeName, 'headers', { durable: true });

    console.log(`Asserting queue: ${queue}`);
    await channel.assertQueue(queue, { durable: true });

    console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
    await channel.bindQueue(queue, exchangeName);

    channel.consume(queue, (msg) => {
      if (msg.content) {
        const message = JSON.parse(msg.content.toString());

        // Process message
        console.log(`Received message with correlation ID ${msg.properties.correlationId}:`, message);

        // Check if the message is a confirmation with type: 'confirmation' and source: 'trip'
        if (
          message.headers &&
          message.headers.type === 'confirmation' &&
          message.headers.source === 'trip'
        ) {
          // Acknowledge the message
          channel.ack(msg);

          // Process the confirmation message
          console.log(`Received confirmation message with correlation ID ${msg.properties.correlationId}:`, message);

          // Show success or failure message to the user
          if (message.success) {
            console.log('Success!'); 
            //  discard the message if it's successful
          } else {
            console.error('Failure! Please try again.'); 
            // i think try again should be added here
          }
        } else {
          channel.ack(msg);
        }
      }
    });
  } catch (error) {
    console.error('Error in consumeMessagesSync:', error);
  }
};

// usage:
// const channel = await connectToRabbitMQ();
// consumeMessagesSync(channel);

// Connect and start consuming messages from the sync queue
consumeMessagesSync(channel);

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
//       updatedTripsInMemory,
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
//     console.error('Error sending transit trips to the dashboard microservice:', error);
//     return false;
//   }
// }





