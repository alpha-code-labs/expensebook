import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import tripRoutes from './routes/tripRoutes.js';
import { mainRouter } from './routes/mainFrontendRoutes.js';
import { handleErrors } from './errorHandler/errorHandler.js';

dotenv.config();
const app = express();

const environment = process.env.NODE_ENV || 'development';
console.log(`Running in ${environment} environment`);
const rabbitMQUrl = process.env.rabbitMQUrl;
const mongoURI = process.env.MONGODB_URI;

const corsOptions = {
    origin: '*',
}

app.use(express.json());
app.use(cors(corsOptions));

//Routes
app.use('/api', tripRoutes);
app.use('/api/fe/reporting', mainRouter);
app.get('/test', (req,res) => { return res.status(200).json({message:'Reporting microservice is live'})})

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

connectToMongoDB();

app.use((err, req, res, next) => {
  handleErrors(err, req, res, next);
});

const port = process.env.PORT || 8098;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// start consuming messages..
// startConsumer('reporting');


