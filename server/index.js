import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import internalRoutes from './routes/internalRoutes.js'
import frontendRoutes from './routes/frontendRoutes.js'
import cors from "cors"
import { statusUpdateBatchJob } from "./scheduler/updateStatus.js";
import cron from 'node-cron'


statusUpdateBatchJob();

dotenv.config();
const app = express();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;

app.use(express.json())
app.use(cors())
app.use("/travel/internal/api", internalRoutes);
app.use("/travel/api", frontendRoutes);



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

connectToMongoDB();
