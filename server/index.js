import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// import { startBatchJob } from './scheduler/scheduleBatchJob.js';
import batchJobRoutes from './routes/batchJobRoutes.js';
import { config } from './config.js';
// import { applyTenantFilter } from './middleware/tripMiddleware.js';
import mainInternalRoutes from './internal/routes/mainInternalRoutes.js';
import oldTripRoutes from './routes/tripsRoutes.js';
// import startConsumer from './rabbitmq/consumer.js';
import tripRoutes from './routes/tripRoutes.js';
import { processTravelRequests } from './rabbitmq/messageProcessor/travelMessageProcessor.js';


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
app.use(express.json());
app.use(cors());
// app.use('/api/:tenantId/*', applyTenantFilter); // Global Middleware for all /api/:tenantId/* routes


//Routes 
app.use('/api/trips/fe', tripRoutes);
app.use('/api/internal', mainInternalRoutes);
app.use('/api/trips', oldTripRoutes); 
app.use('/api', batchJobRoutes);
// app.use('/api/:tenantId/trips/cancel', applyTenantFilter, cancelTripRoutes);


// // Start the batch job
// startBatchJob();

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

// startConsumer('trip');
// const trip = await Trip.findOne({tripId:'658d602bcb8a8aefaacab9ae'})
// const res = await sendTripsToDashboardQueue(trip, 'online', true)

export const exampleTripArray = [
  {
      travelRequestData: {
      tenantId: 'Tenant1',
      tenantName: 'Corp1',
      travelRequestId: '658d5fc21244646bcd76ae66',
      itinerary: {
        key1: [
          { bkd_date: '2024-02-15T10:00:00.000Z' },
          { bkd_date: '2024-02-15T12:00:00.000Z' },
        ],
        key2: [
          { bkd_date: '2024-02-15T08:00:00.000Z' },
          { bkd_date: '2024-02-15T14:00:00.000Z' },
        ],
      },
    },
  },
  {
    travelRequestData: {
      tenantId: 'Tenant2',
    tenantName: 'Corp2',
      travelRequestId: '658d5fc21244646bcd76ae13',
      itinerary: {
        key1: [
          { bkd_date: '2024-02-16T09:00:00.000Z' },
          { bkd_date: '2024-02-16T11:00:00.000Z' },
        ],
        key2: [
          { bkd_date: '2024-02-16T07:00:00.000Z' },
          { bkd_date: '2024-02-16T15:00:00.000Z' },
        ],
      },
    },
  },
  {
    travelRequestData: {
      tenantId: 'Tenant3',
      tenantName: 'Corp3',
      travelRequestId: '658d5fc21244646bcd76ae82',
      itinerary: {
        key1: [
          { bkd_date: '2024-02-17T13:00:00.000Z' },
          { bkd_date: '2024-02-17T15:00:00.000Z' },
        ],
        key2: [
          { bkd_date: '2024-02-17T11:00:00.000Z' },
          { bkd_date: '2024-02-17T17:00:00.000Z' },
        ],
      },
    },
  },
];

// Usage of the "After" version
try {
  const resultDataAfter = await processTravelRequests(exampleTripArray);
  console.log('After: Processing completed. Result:', resultDataAfter);
} catch (error) {
  console.error('After: Error processing travel requests:', error);
}

processTravelRequests(exampleTripArray)