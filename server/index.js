import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from 'dotenv';
// import { applyTenantFilter } from './middleware/tripMiddleware.js';
import {startConsumer} from './rabbitmq/consumer.js';
import tripRoutes from './routes/tripRoutes.js';
import { processTravelRequests } from './rabbitmq/messageProcessor/travelMessageProcessor.js';
import { scheduleTripTransitBatchJob } from './scheduler/statusChangeBatchJob.js';
import Trip from './models/tripSchema.js';
import { sendToOtherMicroservice } from './rabbitmq/publisher.js';
import { scheduleToExpenseBatchJob } from './scheduler/sendToExpense.js';
import{transitToCompleteBatchJob} from './scheduler/transitToCompleteBatchJob.js'
import { filterFutureFlights, filterFutureHotels } from './utils/dateUtils.js';
import pino from 'pino';
import PinoPretty from 'pino-pretty';
import { lastDate } from './utils/date.js';
import { closeRabbitMQConnection, getRabbitMQConnection } from './rabbitmq/connection.js';
import { closeMongoDBConnection, connectToMongoDB } from './db/db.js';

// Load environment variables using dotenv
config();

const environment = process.env.NODE_ENV || 'development';
console.log(`Running in ${environment} environment`);

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
const port = process.env.PORT || 8081;

let server;
let shutdownInProgress = false;

const shutdown = async (reason) => {
  try {
      if (shutdownInProgress) {
          console.log('Shutdown already in progress...');
          return;
      }

      shutdownInProgress = true;
      console.log(`Shutdown initiated: ${reason}`);

      const cleanupTasks = [];

      if (typeof closeRabbitMQConnection === 'function') {
          cleanupTasks.push(
              closeRabbitMQConnection()
                  .then(() => console.log('RabbitMQ connection closed'))
                  .catch(err => console.error('RabbitMQ cleanup error:', err))
          );
      }

      cleanupTasks.push(
          closeMongoDBConnection()
              .then(() => console.log('MongoDB connection closed'))
              .catch(err => console.error('MongoDB cleanup error:', err))
      );

      if (server) {
          cleanupTasks.push(
              new Promise((resolve) => {
                  server.close(() => {
                      console.log('Server connections closed');
                      resolve();
                  });
              })
          );
      }

      const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Shutdown timeout')), 10000)
      );

      await Promise.race([
          Promise.allSettled(cleanupTasks),
          timeoutPromise
      ]);

      console.log('Cleanup completed');
      process.exit(0);
  } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
  }
};


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




const initializeServer = async () => {
  try {
      await Promise.all([
        connectToMongoDB(),
        getRabbitMQConnection(),
        startConsumer('trip')
      ])

      server = app.listen(port, () => {
          console.log(`Server is running on port ${port}`);
      });

      server.on('error', (error) => {
          console.error('Server error:', error);
          shutdown('Server error').catch(console.error);
      });

  } catch (error) {
      console.error('Initialization error:', error);
      shutdown('Initialization failure').catch(console.error);
  }
};

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  shutdown('Unhandled Rejection').catch(console.error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  shutdown('Uncaught Exception').catch(console.error);
});

process.on('SIGTERM', () => shutdown('SIGTERM').catch(console.error));
process.on('SIGINT', () => shutdown('SIGINT').catch(console.error));

// Start the server
initializeServer().catch(console.error);



// const tripp = '66b0b254b565699533846bfa'
// const trip = await Trip.findOne({"tripId":tripp})
// const { itinerary} = trip.travelRequestData
// console.log("itinerary", itinerary)
// const hello = itinerary.flights
// console.log("hello",hello,null,2)
// const getFlights = filterFutureFlights(itinerary.flights)
// console.log("getFlights",getFlights)
// const tripY = '66a87ecc38c376aa6a5a57cf'
// const trip = await Trip.findOne({"tripId":tripY})
// if(trip){
//   const { itinerary} = trip.travelRequestData
//   const getTripCompletionDate = await lastDate(itinerary)
//   console.log("trip Completion Date",getTripCompletionDate)
// } else {
//   console.log("Trip not found")
// }

// const res = await sendTripsToDashboardQueue(trip, 'online', true)
// const trip = await Trip.updateOne({tripId:'65df0d66aceac59a438079ad'})
// console.log("trip ...", trip)
// const res = await sendToOtherMicroservice(trip, 'trip-creation', 'dashboard', 'Trip creation successful and sent to dashboard', 'trip', 'online');




