import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// import { config } from './config.js';
// import { applyTenantFilter } from './middleware/tripMiddleware.js';
import {startConsumer} from './rabbitmq/consumer.js';
import tripRoutes from './routes/tripRoutes.js';
import { processTravelRequests } from './rabbitmq/messageProcessor/travelMessageProcessor.js';
import { scheduleTripTransitBatchJob } from './scheduler/statusChangeBatchJob.js';
import Trip from './models/tripSchema.js';
import { sendToOtherMicroservice } from './rabbitmq/publisher.js';
import { scheduleToExpenseBatchJob } from './scheduler/sendToExpense.js';
import{transitToCompleteBatchJob} from './scheduler/transitToCompleteBatchJob.js'

// Load environment variables using dotenv
dotenv.config();

const environment = process.env.NODE_ENV || 'development';
console.log(`Running in ${environment} environment`);

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

// middleware
app.use(express.json());
app.use(cors());
// app.use('/api/:tenantId/*', applyTenantFilter); // Global Middleware for all /api/:tenantId/* routes

//Routes 
app.use('/api/fe/trips', tripRoutes);
app.get('/get', (req,res) => res.status(200).json("hi from trips"))
// app.use('/api/:tenantId/trips/cancel', applyTenantFilter, cancelTripRoutes);


// Start the batch job
scheduleToExpenseBatchJob()
scheduleTripTransitBatchJob()
transitToCompleteBatchJob()



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
// const trip = await Trip.updateOne({tripId:'65df0d66aceac59a438079ad'})
// console.log("trip ...", trip)
// const res = await sendToOtherMicroservice(trip, 'trip-creation', 'dashboard', 'Trip creation successful and sent to dashboard', 'trip', 'online');

const exampleTripArray = [
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
// try {
//   const resultDataAfter = await processTravelRequests(exampleTripArray);
//   console.log('After: Processing completed. Result:', resultDataAfter);
// } catch (error) {
//   console.error('After: Error processing travel requests:', error);
// }

// processTravelRequests(exampleTripArray)


