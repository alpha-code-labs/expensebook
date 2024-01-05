import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"
import pino from 'pino'

const logger = pino({})

logger.info('Hello World')


//later to be done using cron
//statusUpdateBatchJob();

dotenv.config();
const app = express();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;

app.get('/ping', async (req, res)=>{
    res.json(200).json({message: 'It\'s Chilling in here'})
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
