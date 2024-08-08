import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import { handleErrors } from './errorHandler/errorHandler.js';
import { startConsumer } from "./rabbitmq/consumer.js";
import router from "./routes/mainFrontendRouter.js";

dotenv.config()
const app = express();

const MONGO_URI = process.env.NODE_ENV == 'production' ? process.env.COSMOSDB_URI : process.env.MONGODB_URI;

const port = process.env.PORT || 8009;
console.log(`mongoURI - ${MONGO_URI} `);
app.use(express.json());
app.use(cors());

app.use("/api/fe/finance", router)
app.use((req,res,next) =>{
  res.status(404).json({success:false, message:"Wrong route. Please check the URL."})
})
app.use((err, req, res, next) => {
    handleErrors(err, req, res, next);
  });

const connectToMongoDB = async () => {
try{
  await mongoose.connect(MONGO_URI);
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} catch(error){
    console.error('error connecting to mongodb', error)
}
};

connectToMongoDB()

// start consuming messages..
startConsumer('finance');





