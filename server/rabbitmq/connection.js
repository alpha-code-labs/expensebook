import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

let connection = null;

export const getRabbitMQConnection = async () => {
  if (!connection) {
    // console.log("Creating RabbitMQ connection...");
    const rabbitMQUrl = process.env.rabbitMQUrl;
    connection = await amqp.connect(rabbitMQUrl);
    // console.log("RabbitMQ connection established.");
  }
  return connection;
};

export const closeRabbitMQConnection = async () => {
  if (connection) {
    console.log("Closing RabbitMQ connection...");
    await connection.close();
    connection = null;
    console.log("RabbitMQ connection closed.");
  }
};
