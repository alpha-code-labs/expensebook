import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
const app = express()

const MONGO_URI = process.env.MONGO_URI
const PORT = process.env.PORT

async function connectToMongoDB() {
    try {
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');
      app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    } catch (error) {
      console.error(`${error} did not connect`);
    }
  }
  
  // Call the async function to connect to MongoDB
  connectToMongoDB();

