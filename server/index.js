import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import nodeCron from 'node-cron';
import dotenv from 'dotenv';
import { startBatchJob } from './scheduler/scheduleBatchJob.js';
import tripRoutes from './routes/tripRoutes.js';
import batchJobRoutes from './routes/batchJobRoutes.js';
import modifyTripRoutes  from './routes/modifyTripRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { config } from './config.js';

// Load environment variables using dotenv
dotenv.config();

const environment = process.env.NODE_ENV || 'development';
const databaseURI = config[environment].mongoURI; // Corrected variable name from mongoURI to mongoURI
const castStrings = config[environment].castStrings;
console.log(`Running in ${environment} environment`);
console.log(`Database URI: ${config[environment].mongoURI}`);

const mongoURI = process.env.MONGODB_URI;

const app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());

app.use('/trips', tripRoutes);
app.use('/api', batchJobRoutes);
app.use('/trips/modify', modifyTripRoutes);
app.use('/dash',dashboardRoutes);

// Start the batch job
startBatchJob();

const mongodb = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('You are Connected to Mongodb');
  } catch (error) {
    console.error('Error connecting to Mongodb:', error);
  }
};

mongodb();

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
