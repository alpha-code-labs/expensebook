import amqp from 'amqplib';

const rabbitMQUrl = 'amqp://localhost:5672';

const connectToRabbitMQ = async () => {
  try {
    console.log('Connecting to RabbitMQ...');
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createConfirmChannel();
    console.log('Connected to RabbitMQ.');
    return channel;
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    throw error;
  }
};

export const sendTransitTripsToDashboard = async (updatedTripsInMemory) => {
  try {
    console.log('Sending message to RabbitMQ...');

    const channel = await connectToRabbitMQ();

    const exchangeName = 'dashboard';
    const routingKey = 'transitBatchjob';
    const queue = 'tripbatchjob';

    console.log(`Asserting exchange: ${exchangeName}`);
    await channel.assertExchange(exchangeName, 'direct', { durable: true });

    console.log(`Asserting queue: ${queue}`);
    await channel.assertQueue(queue, { durable: true });

    console.log(`Binding queue ${queue} to exchange ${exchangeName} with routing key ${routingKey}`);
    await channel.bindQueue(queue, exchangeName, routingKey);

    const message = {
      updatedTripsInMemory,
    };

    console.log('Publishing message to RabbitMQ:', message);

    try {
      // Publishing message to RabbitMQ
      await channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(message)), { persistent: true });

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
