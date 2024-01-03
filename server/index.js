import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { startBatchJob } from './scheduler/scheduleBatchJob.js';
import tripRoutes from './routes/tripRoutes.js';
import batchJobRoutes from './routes/batchJobRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { config } from './config.js';
// import { applyTenantFilter } from './middleware/tripMiddleware.js';
import mainInternalRoutes from './internal/routes/mainInternalRoutes.js';
import cancelTripRouter from './routes/cancelTripRoutes.js';
import mainFrontendRoutes from './routes/mainFrontendRoutes.js';

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
app.use('/api/trips', mainFrontendRoutes);
app.use('/api/internal', mainInternalRoutes);



app.use('/api/trips', tripRoutes); 
app.use('/api', batchJobRoutes);
// app.use('/api/:tenantId/trips/cancel', applyTenantFilter, cancelTripRoutes);
app.use('/api/dash',  dashboardRoutes);
app.use('/api/trips/cancel',  cancelTripRouter);



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
