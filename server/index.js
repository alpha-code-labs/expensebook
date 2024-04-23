import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import internalRoutes from "./routes/internalRoutes.js";
import frontendRoutes from "./routes/frontendRoutes.js";
import cors from "cors";
import { statusUpdateBatchJob } from "./scheduler/updateStatus.js";
import {createTripBatchJob} from "./scheduler/createTrip.js"
import amqp from "amqplib";
import cron from "node-cron";
import { sendToDashboardQueue } from "./rabbitMQ/publisher.js";
import updateHRMaster from "./rabbitMQ/messageProcessor/onboarding.js";
import pino from "pino";
import startConsumer from "./rabbitMQ/consumer.js";


const logger = pino({});

logger.info("Hello World");

//later to be done using cron
//statusUpdateBatchJob();

dotenv.config();
const app = express();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use("/travel/internal/api", internalRoutes);
app.use("/travel/api", frontendRoutes);

app.get("/test", (req, res)=>{
  res.status(200).json({message: 'Server running smoothly'})
})

app.post("/test/rabbitmq", async (req, res) => {
  const result = await sendToDashboardQueue({ message: "Hello from Travel" });
  console.log(result);
});

async function startProducer() {
  try {
    const connection = await amqp.connect(
      "amqp://ajay318:ajay@318@localhost:15672"
    );
    console.log("this ran");
    const channel = await connection.createChannel();

    const exchangeName = "approvals";
    const queueName = "travelApprovals";

    // Ensure the exchange exists
    await channel.assertExchange(exchangeName, "direct", { durable: true });

    // Ensure the queue exists
    await channel.assertQueue(queueName, { durable: true });

    // Bind the queue to the exchange with the routing key
    await channel.bindQueue(queueName, exchangeName);

    const msg = { message: "Hello from travel" };
    channel.publish(exchangeName, "", Buffer.from(JSON.stringify(msg)));

    console.log(`Waiting for messages on queue: ${msg} published`);
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error setting up publisher:", error);
  }
}

async function receiveTravelApprovedMessage() {
  try {
    const connection = await amqp.connect(
      "amqp://ajay:Ajay@1234@192.168.1.4:5672"
    );
    console.log("this ran");
    const channel = await connection.createChannel();

    const exchangeName = "approvals";
    const queueName = "travelApprovals";

    // Ensure the exchange exists
    await channel.assertExchange(exchangeName, "direct", { durable: true });

    // Ensure the queue exists
    await channel.assertQueue(queueName, { durable: true });

    // Bind the queue to the exchange with the specified routing key
    // await channel.bindQueue(queueName, exchangeName, '');

    console.log(
      `[*] Waiting for messages from ${exchangeName} . To exit press CTRL+C`
    );

    // Set up the consumer to handle messages
    channel.consume(queueName, (msg) => {
      if (msg !== null) {
        const message = JSON.parse(msg.content.toString());
        console.log(`Received message:`, message);

        // Acknowledge the message
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error receiving message from RabbitMQ:", error.message);
  }
}

async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  } catch (error) {
    console.error(`${error} did not connect`);
  }
}


await connectToMongoDB();
startConsumer('travel')

statusUpdateBatchJob()
createTripBatchJob()


