import amqp from 'amqplib';
import { processTransitTrip } from './messageProcessor.js';

const rabbitMQUrl = 'amqp://localhost:5672';

let channel;

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

const consumeMessages = async (channel, callback) => {
  try {
    console.log('Receiving messages from RabbitMQ...');

    const exchangeName = 'amqp.dashboard';
    const queue = 'non-sync';

    console.log(`Asserting exchange: ${exchangeName}`);
    await channel.assertExchange(exchangeName, 'headers', { durable: true });

    console.log(`Asserting queue: ${queue}`);
    await channel.assertQueue(queue, { durable: true });

    console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
    await channel.bindQueue(queue, exchangeName);

    console.log('Waiting for messages. To exit press CTRL+C');

    channel.consume(queue, async (message) => {
      if (message !== null) {
        const content = JSON.parse(message.content.toString());
        console.log('Received message from RabbitMQ:', content);

        // Perform the necessary processing on the received message
        await callback(content);

        // Acknowledge the message
        channel.ack(message);
      }
    }, { noAck: false }); // Set noAck to false to manually acknowledge messages
  } catch (error) {
    console.error('Error receiving messages from RabbitMQ:', error);
    throw error;
  }
};

const saveToDashboard = async (message) => {
  try {
    // Logic to save the received message to the dashboard
    await processTransitTrip(message);
  } catch (error) {
    console.error('Error saving to the dashboard:', error);
    throw error;
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT. Gracefully shutting down Consumer Microservice.');

  // Close the channel and connection
  if (channel) {
    await channel.close();
  }

  process.exit(0);
});

const startConsumerMicroservice = async () => {
  try {
    // Check RabbitMQ connection
    const channel = await connectToRabbitMQ();
    if (channel) {
      console.log('Connected to RabbitMQ in Consumer Microservice');

      // Start consuming messages continuously
      await consumeMessages(channel, saveToDashboard);
    } else {
      console.error('Failed to connect to RabbitMQ in Consumer Microservice');
    }
  } catch (error) {
    console.error('Error starting Consumer Microservice:', error);
  }
};

// Start the consumer microservice
// startConsumerMicroservice();