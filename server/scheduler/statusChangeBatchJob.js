import cron from 'node-cron';
import Trip from '../models/tripSchema.js';
import { sendTransitTripsToDashboard } from '../rabbitmq/dashboardMicroservice.js';

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



// Schedule the cron job to run every day at midnight

export const statusChangeBatchJob = async () => {
  try {
    const todayDate = new Date();

    // Define the condition to find upcoming trips
    const condition = {
      tripStatus: 'upcoming',
      tripStartDate: { $lte: todayDate },
    };

    // Fetch upcoming trips without modifying the database
    const tripsToUpdate = await Trip.find(condition);
     
    console.log('Fetched documents for status update :', condition)

     // Check if there are no upcoming trips to update
     if (tripsToUpdate.length === 0) {
      return {
        statusCode: 404,
        message: 'No upcoming trips found for status change.',
      };
    }


    // Update the tripStatus in memory without saving to the database
    const updatedTripsInMemory = tripsToUpdate.map(trip => {
      trip.tripStatus = 'transit';
      return trip;
    });


    // Trigger sending transit trips to the dashboard microservice
    const sendResult = await sendTransitTripsToDashboard(updatedTripsInMemory);

    // Only update the database if sending to the dashboard microservice was successful
    if (sendResult) {
      // Update documents in the Trip collection using $set and updateMany
      const updateResult = await Trip.updateMany(
        condition,
        {
          $set: {
            tripStatus: 'transit',
          },
        }
      );

      // Log the result
      console.log(`Updated ${updateResult.nModified} documents in the database.`);
    } else {
      console.error('Sending transit trips to the dashboard microservice was not successful.');
    }

    // Return the updated trips
    return updatedTripsInMemory;
  } catch (error) {
    // Handle errors with consistent error handling
    console.error('Error in statusChangeBatchJob:', error);
    throw error;
  }
};




cron.schedule('0 0 * * *', async () => {
  console.log('Running trip transit batch job ...');
  try {
    const result = await statusChangeBatchJob();
    // Handle the result if needed
    console.log('Batch job completed successfully.');
  } catch (error) {
    console.error('Error running batch job:', error);
  }
});



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
cron.schedule('*/20 * * * * *', () => {
  console.log('Running trip transit batch job ...');
  statusChangeBatchJob();
});

// Function to trigger the batch job on demand
const triggerBatchJob = () => {
  console.log('Triggering batch job on demand...');
  statusChangeBatchJob();
};

export { triggerBatchJob };
