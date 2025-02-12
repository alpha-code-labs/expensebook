import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {config} from './config.js';
import frontendRoutes from './routes/frontendRoutes.js'
import startConsumer from './rabbitMQ/consumer.js';

import { batchJob, batchJobApprovedToNextCash } from './scheduler/approvedToNextStateStatusChange.js';
import { batchJobApprovedToNextTravel } from './scheduler/travel_approvedToNextState.js';
import { batchJobCreateTrip } from './scheduler/createTrip.js';

dotenv.config();
const app = express();

const MONGO_URI = process.env.NODE_ENV == 'production' ? process.env.COSMOS_URI : process.env.MONGO_URI;
const PORT = process.env.PORT;

app.use(express.json())
app.use(cors())

app.use('/cash-advance/api', frontendRoutes) //cashAdvanceRoutes
app.use("/test", (req, res) => {
  res.send("Hello World");
})

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
await startConsumer('cash')

batchJobApprovedToNextTravel();
batchJobApprovedToNextCash();
batchJobCreateTrip();