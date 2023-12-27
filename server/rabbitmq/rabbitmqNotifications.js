import amqp from 'amqplib';

// RabbitMQ connection URL
const rabbitMQUrl = 'amqp://guest:guest@localhost:5672/';


export function sendNotificationToEmployee(trip) {
  amqp.connect(rabbitMQUrl)
    .then(async (connection) => {
      try {
        const channel = await connection.createChannel();

        const exchange = 'employee-exchange';
        const routingKey = 'employee.trip.reminder';

        const message = JSON.stringify({ notification: 'Approval sent from trip microservice', trip });

        await channel.assertExchange(exchange, 'topic', { durable: true });

        // Use a Promise to wait for the publish to complete
        return new Promise((resolve, reject) => {
          channel.publish(exchange, routingKey, Buffer.from(message), {}, (err, ok) => {
            if (err) {
              reject(err);
            } else {
              console.log('Notification sent to employee:', message);
              resolve();
            }
          });
        });
      } finally {
        // Close the channel and connection after publishing
        await channel.close();
        await connection.close();
      }
    })
    .catch((error) => {
      console.error('Error sending notification to employee:', error);
    });
}

// Example usage
const tripDetails = { /* your trip details */ };
sendNotificationToEmployee(tripDetails);




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

// Function to send a notification to the employee using RabbitMQ
