import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const connectToRabbitMQ = async () => {
  const rabbitMQUrl = process.env.rabbitMQUrl;
  try {
    console.log("Connecting to RabbitMQ...");
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createConfirmChannel();
    console.log("Connected to RabbitMQ.");
    return channel;
  } catch (error) {
    console.log("Error connecting to RabbitMQ:", error);
    throw error;
  }
};

export async function sendToOtherMicroservice(
  payload,
  action,
  destination,
  comments,
  source = "dashboard",
  onlineVsBatch = "online"
) {
  try {
    // console.log('Sending message to RabbitMQ...');

    const channel = await connectToRabbitMQ();
    const exchangeName = "amqp.dashboard";
    const queue = `q.${destination}`;
    const routingKey = `rk.${destination}`;

    // console.log(`Asserting exchange: ${exchangeName}`);
    await channel.assertExchange(exchangeName, "direct", { durable: true });

    // console.log(`Asserting queue: ${queue}`);
    await channel.assertQueue(queue, { durable: true });

    // console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
    await channel.bindQueue(queue, exchangeName, routingKey);

    // Set different headers based on needConfirmation
    const messageHeaders = {
      destination,
      source,
      action,
      onlineVsBatch: onlineVsBatch,
      comments,
    };

    const messageToSend = {
      headers: messageHeaders,
      payload,
    };

    // console.log('Publishing message to RabbitMQ:', messageToSend);

    try {
      // Publish for asynchronous processing
      channel.publish(
        exchangeName,
        routingKey,
        Buffer.from(JSON.stringify(messageToSend)),
        {
          persistent: true,
        }
      );

      // console.log('Message sent to RabbitMQ:', messageToSend);
    } catch (error) {
      console.log("Error sending message to RabbitMQ:", error);
      throw error;
    } finally {
      // Close the channel after a short delay
      setTimeout(async () => {
        await channel.close();
        console.log("Channel closed.");
      }, 5000);
    }
  } catch (error) {
    // Handle errors with consistent error handling
    console.log(
      Error` cash advance data to ${destination} microservice:`,
      error
    );
    return false;
  }
}
