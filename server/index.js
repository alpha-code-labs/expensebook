import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
// import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dummy from './routes/dummyRoute.js';
import overview from './routes/overviewRoutes.js';

dotenv.config();

const environment = process.env.NODE_ENV || 'development';
console.log(`Running in ${environment} environment`);

const mongoURI = process.env.mongoURI;

const app = express();

app.use(bodyParser.json());
app.use(cors());

//Routes
app.use('/api/dummydata', dummy); // dummy data for testing
app.use('/api/dashboard/overview', overview ); // dashboard overview screen
app.get('/ping', (req,res) => { return res.status(200).json({message:'(:(:(:(:(:(:(:(:'})})

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

connectToMongoDB();

// const mongodb = async () => {
//     try {
//       const client = new MongoClient(mongoURI);
      
//       await client.connect();
      
//       console.log('Connected to MongoDB');
  
//     } catch (error) {
//       console.error('Error connecting to MongoDB:', error);
//     }
//   };

// mongodb();

app.use((err, req, res, next) => {
  handleErrors(err, req, res, next);
});

const port = process.env.PORT || 8088;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
