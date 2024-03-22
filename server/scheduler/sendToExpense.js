import cron from 'node-cron';
import Trip from '../models/tripSchema.js';
import { sendToOtherMicroservice } from '../rabbitmq/publisher.js';


// export const updateSentToExpenseFlag = async (tenantId, tripId, isSentToExpense) => {
//   try {
//     const updateResult = await Trip.updateOne(
//       {
//         tenantId: tenantId,
//         tripId: tripId,
//         isSentToExpense: false,
//       },
//       {
//         $set: {
//           isSentToExpense: isSentToExpense,
//         },
//       }
//     );

//     if (updateResult.nModified > 0) {
//       console.log(`Updated isSentToExpense flag for tenantId: ${tenantId}, tripId: ${tripId}`);
//     } else {
//       console.log(`No matching document found for update: tenantId: ${tenantId}, tripId: ${tripId}`);
//     }

//     return updateResult;
//   } catch (error) {
//     console.error('Error in updateSentToExpenseFlag:', error);
//     throw error;
//   }
// };

// // Define a function to handle the expense processing
// export const expenseBatchJob = async () => {
//     try {
//       const tripsToProcess = await Trip.find({ sentToExpense: false });
//       console.log('Fetched trips for expense processing:', tripsToProcess);
  
//       if (tripsToProcess.length === 0) {
//         return {
//           statusCode: 204, // No Content
//           message: 'No trips found for expense processing.',
//         };
//       }
  
//       const tripPromises = tripsToProcess.map(async (trip) => {
//         const sendToExpense = await sendToOtherMicroservice(trip, 'full-update', 'expense', 'batchjob to update expense with trip details', source = 'trip', onlineVsBatch = 'batch');
  
//         if (sendToExpense) {
//           const updateResult = await updateSentToExpenseFlag(trip.tenantId, trip.tripId, true);
  
//           if (updateResult.success) {
//             return { statusCode: 200, message: 'Trips sent to expense microservice successfully', trip };
//           } else {
//             return { statusCode: 500, message: 'Error occurred in updating sentToExpense flag' };
//           }
//         } else {
//           return { statusCode: 500, message: 'Error occurred in sending trips to expense microservice' };
//         }
//       });
  
//       const results = await Promise.all(tripPromises);
  
//       // Check the results and determine the overall status code
//       const overallStatusCode = results.every(result => result.statusCode === 200) ? 200 : 500;
  
//       console.log('Expense batch job completed successfully.');
  
//       res.status(overallStatusCode).json({ message: 'Expense batch job completed successfully', results });
//     } catch (error) {
//       console.error('Error in expenseBatchJob:', error);
//       res.status(500).json({ message: 'Error occurred in sending trips to expense microservice' });
//     }
//   };
  
    
// Define a function to handle the expense processing
// export const expenseBatchJob = async (req,res) => {
//     try {
//       const tripsToProcess = await Trip.find({ isSentToExpense: false });
//       console.log('Fetched trips for expense processing:', tripsToProcess);
  
//       if (tripsToProcess.length === 0) {
//         return {
//           statusCode: 204, // No Content
//           message: 'No trips found for expense processing.',
//         };
//       }
  
//       const tripsToUpdate = [];
//       const tripPromises = tripsToProcess.map(async (trip) => {
//         const sendToExpense = await sendToOtherMicroservice(trip, 'full-update', 'expense', 'batchjob to update expense with trip details','trip', 'batch');
  
//         if (sendToExpense) {
//           tripsToUpdate.push(trip);
//           return { statusCode: 200, message: 'Trips sent to expense microservice successfully', trip };
//         } else {
//           return { statusCode: 500, message: 'Error occurred in sending trips to expense microservice' };
//         }
//       });
  
//       const results = await Promise.all(tripPromises);
  
//       // Check if all trips were sent successfully before updating the flag
//       const allTripsSentSuccessfully = results.every(result => result.statusCode === 200);
  
//       if (allTripsSentSuccessfully) {
//         // Perform bulk update
//         await updateSentToExpenseFlag(tripsToUpdate);
//       }
  
//       // Determine the overall status code
//       const overallStatusCode = allTripsSentSuccessfully ? 200 : 500;
  
//       console.log('Expense batch job completed successfully.');
  
//       res.status(overallStatusCode).json({ message: 'Expense batch job completed successfully', results });
//     } catch (error) {
//       console.error('Error in expenseBatchJob:', error);
//       res.status(500).json({ message: 'Error occurred in sending trips to expense microservice' });
//     }
// };

export const updateSentToExpenseFlag = async (tripsToUpdate) => {
  console.log("tripsToUpdate ......", tripsToUpdate);

  try {
    const updateResult = await Trip.updateMany(
      {
        _id: { $in: tripsToUpdate.map(trip => trip._id) },
        isSentToExpense: {$in:[false, null , undefined]},
      },
      {
        $set: {
          isSentToExpense: true,
        },
      }
    );

    if (updateResult.nModified > 0) {
      console.log(`Updated isSentToExpense flag for ${updateResult.nModified} trips`);
    } else {
      console.log('No matching documents found for bulk update');
    }
    

    return updateResult;
  } catch (error) {
    console.error('Error in updateSentToExpenseFlag:', error);
    throw error;
  }
};

export const expenseBatchJob = async () => {
  try {
    console.log('You are Connected to Mongodb');
    const tripsToProcess = await Trip.find({
     isSentToExpense:{$in:[true , undefined]} });
    console.log('Fetched trips for expense processing:', tripsToProcess);

    if (tripsToProcess.length === 0) {
      console.log('No trips found for expense processing.');
      return { success: true, message: 'No trips found for expense processing.' };
    }

    // Send all trips to the expense microservice as a batch
    console.log('Sending trips to expense microservice...');
    const onlineVsBatch = 'batch';
    const sendToExpenseBatch = await sendToOtherMicroservice(tripsToProcess, 'full-update-array', 'expense', 'batchjob to update expense with trip details', 'trip', onlineVsBatch);
    console.log('Trips sent to expense microservice:', sendToExpenseBatch);

    return { success: true, message: 'Expense batch job completed successfully' };

    // Check if all trips were sent successfully
    // if (sendToExpenseBatch) {
    //   // Perform bulk update only if there are trips to update
    //   if (tripsToProcess.length > 0) {
    //     console.log(`Updating isSentToExpense flag for ${tripsToProcess.length} trips...`);
    //     await updateSentToExpenseFlag(tripsToProcess);
    //     console.log(`Updated isSentToExpense flag for ${tripsToProcess.length} trips`);
    //   } else {
    //     console.log('No trips require update');
    //   }

    //   console.log('Expense batch job completed successfully.');
    //   return { success: true, message: 'Expense batch job completed successfully' };
    // } else {
    //   console.error('Error sending trips to expense microservice: Send to expense failed');
    //   return { success: false, message: 'Error occurred in sending trips to expense microservice' };
    // }
  } catch (error) {
    console.error('Error in expenseBatchJob:', error);
    return { success: false, message: 'Error occurred in expense batch job.' };
  }
};

// export const expenseBatchJob = async (req, res) => {
//   try {
//     const tripsToProcess = await Trip.find({ isSentToExpense: false });
//     console.log('Fetched trips for expense processing:', tripsToProcess);

//     if (tripsToProcess.length === 0) {
//       console.log('No trips found for expense processing.');
//       return res.status(204).json({ message: 'No trips found for expense processing.' });
//     }

//     // Send all trips to the expense microservice as a batch
//     console.log('Sending trips to expense microservice...');
//     const onlineVsBatch = 'batch'
//                                     // sendToOtherMicroservice(payload, action, destination, comments, source='trip', onlineVsBatch)
//     const sendToExpenseBatch = await sendToOtherMicroservice(tripsToProcess, 'full-update', 'expense', 'batchjob to update expense with trip details', 'trip', onlineVsBatch);
//     console.log('Trips sent to expense microservice:', sendToExpenseBatch);

//     // Check if all trips were sent successfully
//     if (sendToExpenseBatch) {
//       // Perform bulk update only if there are trips to update
//       if (tripsToProcess.length > 0) {
//         console.log(`Updating isSentToExpense flag for ${tripsToProcess.length} trips...`);
//         await updateSentToExpenseFlag(tripsToProcess);
//         console.log(`Updated isSentToExpense flag for ${tripsToProcess.length} trips`);
//       } else {
//         console.log('No trips require update');
//       }

//       console.log('Expense batch job completed successfully.');
//       return res.status(200).json({ message: 'Expense batch job completed successfully' });
//     } else {
//       console.error('Error sending trips to expense microservice: Send to expense failed');
//       return res.status(500).json({ message: 'Error occurred in sending trips to expense microservice' });
//     }
//   } catch (error) {
//     console.error('Error in expenseBatchJob:', error);
//     return res.status(500).json({ message: 'Error occurred in expense batch job.' });
//   }
// };


export const scheduleToExpenseBatchJob = () => {
const schedule = process.env.SCHEDULE_TIME;
cron.schedule(schedule, async () => {
  console.log('Running expense batch job ...');
  try {
    await expenseBatchJob();
    console.log('Expense batch job completed successfully.');
  } catch (error) {
    console.error('Error running expense batch job:', error);
  }
});
console.log('scheduled Send to expense batchjob')
}








