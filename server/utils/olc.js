import amqp from 'amqplib';

const rabbitMQUrl = 'amqp://localhost:5672';

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();
    return channel; 
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    throw error;
  }
};

const processMessage = async (msg) => {
  try {
    const message = JSON.parse(msg.content.toString());

    // Process message payload
    console.log('Received message:', message);

    // Send ack/nack based on needConfirmation
    if (message.headers.needConfirmation) {
      // Send ack
      console.log('Sending ack for message:', message);
      channel.sendToQueue(msg.properties.replyTo, 
        Buffer.from(JSON.stringify(true)),
        { correlationId: msg.properties.correlationId });
    } else {
      // Just ack, no response needed
      channel.ack(msg);
    }

  } catch (error) {
    console.error('Error processing message:', error);
  }
};

const subscribeToQueue = async (queue) => {
  try {
    const channel = await connectToRabbitMQ();

    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, processMessage);

    console.log(`Subscribed to queue: ${queue}`);
  } catch (error) {
    console.error('Error subscribing to queue:', error);
  }
};

subscribeToQueue('sync'); 
subscribeToQueue('async');