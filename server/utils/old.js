// import amqp from 'amqplib';
// import { processTransitTrip } from './messageProcessor.js';

// const rabbitMQUrl = 'amqp://localhost:5672';

// let channel;

// const connectToRabbitMQ = async () => {
//   try {
//     console.log('Connecting to RabbitMQ...');
//     const connection = await amqp.connect(rabbitMQUrl);
//     channel = await connection.createConfirmChannel();
//     console.log('Connected to RabbitMQ.');
//     return channel;
//   } catch (error) {
//     console.error('Error connecting to RabbitMQ:', error);
//     throw error;
//   }
// };

// const consumeMessages = async (callback) => {
//   try {
//     console.log('Receiving messages from RabbitMQ...');

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

//     console.log('Waiting for messages. To exit press CTRL+C');

//     channel.consume(queue, async (message) => {
//       if (message !== null) {
//         const content = JSON.parse(message.content.toString());
//         console.log('Received message from RabbitMQ:', content);

//         // Perform the necessary processing on the received message
//         await callback(content);

//         // Acknowledge the message
//         channel.ack(message);
//       }
//     }, { noAck: false }); // Set noAck to false to manually acknowledge messages
//   } catch (error) {
//     console.error('Error receiving messages from RabbitMQ:', error);
//     throw error;
//   }
// };

// const saveToDashboard = async (message) => {
//   try {
//     // Logic to save the received message to the dashboard
//     await processTransitTrip(message);
//   } catch (error) {
//     console.error('Error saving to the dashboard:', error);
//     throw error;
//   }
// };

// // Handle graceful shutdown
// process.on('SIGINT', async () => {
//   console.log('Received SIGINT. Gracefully shutting down Consumer Microservice.');

//   // Close the channel and connection
//   if (channel) {
//     await channel.close();
//   }

//   process.exit(0);
// });

// const startConsumerMicroservice = async () => {
//   try {
//     // Check RabbitMQ connection
//     const rabbitMQConnection = await connectToRabbitMQ();
//     if (rabbitMQConnection) {
//       console.log('Connected to RabbitMQ in Consumer Microservice');
      
//       // Start consuming messages continuously
//       await consumeMessages(saveToDashboard);
//     } else {
//       console.error('Failed to connect to RabbitMQ in Consumer Microservice');
//     }
//   } catch (error) {
//     console.error('Error starting Consumer Microservice:', error);
//   }
// };

// // Start the consumer microservice
// startConsumerMicroservice();


// -------------------------------------------------------------------------------------------
const getEmployeeTravelData = async ({ tenantId, empId }) => {
    const travelStandAlone = await getStandAloneTravel(tenantId, empId);
    const travelWithCash = await getCashTravel(tenantId, empId);
  
    return {
      travelStandAlone,
      travelWithCash
    };
  };
  
  // Centralized error handling middleware
  const handleErrors = (err, req, res, next) => {
    console.error('Error handling middleware:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  };
  
  // Async wrapper to catch errors and pass them to next
  const asyncMiddleware = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
  
  // Usage of asyncMiddleware to catch errors in getEmployeeTravelData
  app.get('/employee-travel-data', asyncMiddleware(async (req, res, next) => {
    const data = await getEmployeeTravelData(req.params);
    res.json(data);
  }));
  