import cron from 'node-cron';
import Trip from '../models/tripSchema.js';
import {  sendToDashboardMicroservice } from '../rabbitmq/dashboardMicroservice.js';
import dotenv from 'dotenv';

dotenv.config();

// Schedule the cron job to run every day at midnight
const statusChangeBatchJob = async () => {
  try {
      const todayDate = new Date();
      const condition = {
        tripStatus: 'upcoming',
        tripStartDate: { $lte: todayDate },
      };
  
      const tripsToUpdate = await Trip.find(condition);
      console.log('Fetched documents for status update:', condition);
  
      if (tripsToUpdate?.length === 0) {
        console.log("There are no upcoming trips to update")
        return {
          statusCode: 404,
          message: 'No upcoming trips found for status change.',
        };
      }
  
      // Prepare the updated trips for sending to RabbitMQ
      // Extract only the _doc object from each trip
      const updatedTrips = tripsToUpdate.map(trip => ({
        ...trip._doc,
        tripStatus: 'transit'
      }));
      
      const action = 'status-update';
      let needConfirmation = false;
      console.log("updatedTrips before rabbitMq", updatedTrips);
  
      // Send updatedTrips to RabbitMQ
      const sendResult = await sendToDashboardMicroservice(updatedTrips, action, 'Batch job trip status change from upcoming to transit', 'trip', 'batch', needConfirmation);
  
      if (sendResult) {
        console.log('Updated trips sent to RabbitMQ successfully:', sendResult);
        // Update the database only if the message was successfully sent to RabbitMQ
        const updateResult = await Trip.updateMany(condition, { $set: { tripStatus: 'transit' } });
        console.log(`Updated ${updateResult.nModified} documents in the database.`);
        return updatedTrips;
      } else {
        console.error('Sending transit trips to the dashboard microservice was not successful.');
        return { error: 'Failed to update trip status in the database.' };
      }
  } catch (error) {
      console.error('Error in statusChangeBatchJob:', error);
      return { error: 'An error occurred during the batch job.' };
  }
};

const scheduleTripTransitBatchJob = () => {
 const schedule = process.env.SCHEDULE_TIME??'* * * * *'; // Runs every 20 seconds

 cron.schedule(schedule, async () => {
    console.log('Running trip transit batch job ...');
    await statusChangeBatchJob();
 });

 console.log(`Scheduled trip transit batch job to run every 20 seconds.`);
};



export { 
  scheduleTripTransitBatchJob 
};

