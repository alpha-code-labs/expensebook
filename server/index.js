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


dotenv.config();
const app = express();

const MONGO_URI = process.env.NODE_ENV == 'production' ? process.env.COSMOS_URI : process.env.MONGO_URI;

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


