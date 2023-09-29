// import amqp from 'amqplib';

// // RabbitMQ connection URL
// const rabbitMQUrl = 'amqp://localhost'; // Update with your RabbitMQ server URL

// // Function to send a notification to the dashboard using RabbitMQ
// export async function sendNotificationToDashboard(trip) {
//   try {
//     const connection = await amqp.connect(rabbitMQUrl);
//     const channel = await connection.createChannel();

//     const exchange = 'dashboard-exchange'; // Update with your exchange name
//     const routingKey = 'dashboard.trip.updated'; // Update with your routing key

//     const message = JSON.stringify({ tripId: trip._id, status: trip.tripStatus });

//     await channel.assertExchange(exchange, 'topic', { durable: true });
//     await channel.publish(exchange, routingKey, Buffer.from(message));

//     console.log('Notification sent to dashboard:', message);

//     await channel.close();
//     await connection.close();
//   } catch (error) {
//     console.error('Error sending notification to dashboard:', error);
//   }
// }

// // Function to send a notification to the employee using RabbitMQ
// export async function sendNotificationToEmployee(trip) {
//   try {
//     const connection = await amqp.connect(rabbitMQUrl);
//     const channel = await connection.createChannel();

//     const exchange = 'employee-exchange'; // Update with your exchange name
//     const routingKey = 'employee.trip.reminder'; // Update with your routing key

//     const message = JSON.stringify({ tripId: trip._id });

//     await channel.assertExchange(exchange, 'topic', { durable: true });
//     await channel.publish(exchange, routingKey, Buffer.from(message));

//     console.log('Notification sent to employee:', message);

//     await channel.close();
//     await connection.close();
//   } catch (error) {
//     console.error('Error sending notification to employee:', error);
//   }
// }
