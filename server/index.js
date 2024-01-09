import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { startBatchJob } from './scheduler/scheduleBatchJob.js';
import batchJobRoutes from './routes/batchJobRoutes.js';
import { config } from './config.js';
// import { applyTenantFilter } from './middleware/tripMiddleware.js';
import mainInternalRoutes from './internal/routes/mainInternalRoutes.js';
import mainFrontendRoutes from './routes/mainFrontendRoutes.js';
import oldTripRoutes from './routes/tripsRoutes.js';
import startConsumer from './rabbitmq/consumer.js';

// Load environment variables using dotenv
dotenv.config();

const environment = process.env.NODE_ENV || 'development';
const databaseURI = config[environment].MONGODB_URI; 
const castStrings = config[environment].castStrings;
console.log(`Running in ${environment} environment`);
console.log(`Database URI: ${config[environment].MONGODB_URI}`);

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());
// app.use('/api/:tenantId/*', applyTenantFilter); // Global Middleware for all /api/:tenantId/* routes

//Routes 
app.use('/api/trips/fe', mainFrontendRoutes);
app.use('/api/internal', mainInternalRoutes);



app.use('/api/trips', oldTripRoutes); 
app.use('/api', batchJobRoutes);
// app.use('/api/:tenantId/trips/cancel', applyTenantFilter, cancelTripRoutes);



// Start the batch job
startBatchJob();

const mongodb = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('You are Connected to Mongodb');
  } catch (error) {
    console.error('Error connecting to Mongodb:', error);
  }
};

mongodb();

const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

startConsumer('trip');
// const trip = await Trip.findOne({tripId:'658d602bcb8a8aefaacab9ae'})
// const res = await sendTripsToDashboardQueue(trip, 'online', true)

