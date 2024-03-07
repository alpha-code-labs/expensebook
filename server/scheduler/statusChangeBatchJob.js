import cron from 'node-cron';
import Trip from '../models/tripSchema.js';
import {  sendTripsToDashboardQueue } from '../rabbitmq/dashboardMicroservice.js';
import dotenv from 'dotenv';

dotenv.config();

// Define the

// Schedule the cron job to run every day at midnight
export const statusChangeBatchJob = async () => {
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
      const needConfirmation = false;
      console.log("updatedTrips before rabbitMq", updatedTrips);
  
      // Send updatedTrips to RabbitMQ
      const sendResult = await sendTripsToDashboardQueue(updatedTrips, action, 'Batchjob trip status change from upcoming to transit', 'trip', 'batch', needConfirmation);
  
      if (sendResult) {
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
 
 
// export const statusChangeBatchJob = async () => {
//   try {
//       const todayDate = new Date();
//       const condition = {
//         tripStatus: 'upcoming',
//         tripStartDate: { $lte: todayDate },
//       };
  
//       const tripsToUpdate = await Trip.find(condition);
//       console.log('Fetched documents for status update:', condition);
  
//       if (tripsToUpdate?.length === 0) {
//        console.log("there are no In-transit trips to update")
//         return {
//           statusCode: 404,
//           message: 'No upcoming trips found for status change.',
//         };
//       }
  
//       // Update the database directly for all fetched trips
//       const updateResult = await Trip.updateMany(condition, { $set: { tripStatus: 'transit' } });
//       console.log(`Updated ${updateResult.nModified} documents in the database.`);
  
//       // Prepare the updated trips for sending to RabbitMQ
//       const updatedTrips = tripsToUpdate.map(trip => ({ ...trip, tripStatus: 'transit' }));
  
//       const action = 'status-update';
//       const needConfirmation = false;
//       console.log("updatedTrips before rabbitMq", updatedTrips)
//      // sendTripsToDashboardQueue(payload, action, comments, onlineVsBatch, needConfirmation)
//       const sendResult = await sendTripsToDashboardQueue(updatedTrips, action, 'Batchjob trip status change from upcoming to transit', 'batch', needConfirmation);
  
//       if (sendResult) {
//         console.log(`Sent ${updatedTrips.length} updated trips to the dashboard queue.`);
//         return updatedTrips;
//       } else {
//         console.error('Sending transit trips to the dashboard microservice was not successful.');
//         return { error: 'Failed to update trip status in the database.' };
//       }
//   } catch (error) {
//       console.error('Error in statusChangeBatchJob:', error);
//       return { error: 'An error occurred during the batch job.' };
//   }
//  };
 
// export const statusChangeBatchJob = async () => {
//   try {
//      const todayDate = new Date();
//      const condition = {
//        tripStatus: 'upcoming',
//        tripStartDate: { $lte: todayDate },
//      };
 
//      const tripsToUpdate = await Trip.find(condition);
//      console.log('Fetched documents for status update:', condition);
 
//      if (tripsToUpdate?.length === 0) {
//       console.log("there are no In-transit trips to update")
//        return {
//          statusCode: 404,
//          message: 'No upcoming trips found for status change.',
//        };
//      }
 
//      const updatedTrips = tripsToUpdate.map(trip => ({ ...trip, tripStatus: 'transit' }));
 
//      const action = 'status-update';
//      const needConfirmation = false;
//      console.log("updatedTrips before rabbitMq", updatedTrips)
//     //  sendTripsToDashboardQueue(payload,  action, comments, onlineVsBatch, needConfirmation)
//      const sendResult = await sendTripsToDashboardQueue(updatedTrips, action, 'Batchjob trip status change from upcoming to transit', 'batch', needConfirmation);
 
//      if (sendResult) {
//        const updateResult = await Trip.updateMany(condition, { $set: { tripStatus: 'transit' } });
//        console.log(`UpdatedTrips after rabbitMq ${updateResult.nModified} documents in the database.`);
//        return updatedTrips;
//      } else {
//        console.error('Sending transit trips to the dashboard microservice was not successful.');
//        return { error: 'Failed to update trip status in the database.' };
//      }
//   } catch (error) {
//      console.error('Error in statusChangeBatchJob:', error);
//      return { error: 'An error occurred during the batch job.' };
//   }
//  };
 

export const scheduleTripTransitBatchJob = () => {
 const schedule = process.env.SCHEDULE_TIME; // Runs every 20 seconds

 cron.schedule(schedule, async () => {
    console.log('Running trip transit batch job ...');
    await statusChangeBatchJob();
 });

 console.log(`Scheduled trip transit batch job to run every 20 seconds.`);
};


// Function to trigger the batch job on demand
const triggerBatchJob = () => {
  console.log('Triggering batch job on demand...');
  statusChangeBatchJob();
};

export { triggerBatchJob };


// export const statusChangeBatchJob = async () => {
//   try {
//     const todayDate = new Date();

//     // Define the condition to find upcoming trips
//     const condition = {
//       tripStatus: 'upcoming',
//       tripStartDate: { $lte: todayDate },
//     };

//     // Fetch upcoming trips without modifying the database
//     const tripsToUpdate = await Trip.find(condition);

//     // Update the tripStatus in memory without saving to the database
//     const updatedTripsInMemory = tripsToUpdate.map(trip => {
//       trip.tripStatus = 'transit';
//       return trip;
//     });

//     // Trigger sending transit trips to the dashboard microservice
//     const sendResult = await sendTransitTripsToDashboard(updatedTripsInMemory);

//     // Only update the database if sending to the dashboard microservice was successful
//     if (sendResult === 'Success') {
//       // Update documents in the Trip collection using $set and updateMany
//       const updateResult = await Trip.updateMany(
//         condition,
//         {
//           $set: {
//             tripStatus: 'transit',
//           },
//         }
//       );

//       // Log the result
//       console.log(`Updated ${updateResult.nModified} documents in the database.`);
//     } else {
//       console.error('Sending transit trips to the dashboard microservice was not successful.');
//     }

//     // Return the updated trips
//     return updatedTripsInMemory;
//   } catch (error) {
//     // Handle errors with consistent error handling
//     throw error;
//   }
// };



//To update status from upcoming to transit on the day of travel.
//important!! - A batch job is run to update status from upcoming to transit on the day of travel and 
//they are carried out independently in trip and expense microservices . 
// export const statusChangeBatchJob = async () => {
//   try {
//     const todayDate = new Date();

//     // Update documents in the Trip collection
//     const result = await Trip.updateMany(
//       {
//         tripStatus: 'upcoming',
//         tripStartDate: { $lte: todayDate },
//       },
//       {
//         $set: {
//           tripStatus: 'transit',
//           'travelRequestData.travelRequestStatus': 'transit',
//           'cashAdvanceData.travelRequestData.travelRequestStatus': 'transit',
//         }
//       }
//     );
     
//     await sendTransitTripsToDashboardMicroservice(result)
//     // Logging the result
//     console.log(`Updated ${result.nModified} documents.`);
//   } catch (error) {
//     console.error('Error updating documents:', error);
//   }
// };

// Schedule the cron job to run every day at midnight 0 0 * * * (for every 20 seconds use */20 * * * * *)
