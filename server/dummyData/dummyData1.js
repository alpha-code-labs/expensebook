// import cron from 'node-cron';
// import Trip from '../models/tripSchema.js';

// //To update status from upcoming to transit on the day of travel.
// //important!! - A batch job is run to update status from upcoming to transit on the day of travel and 
// //they are carried out independently in trip and expense microservices . 
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

//     // Logging the result
//     console.log(`Updated ${result.nModified} documents.`);
//   } catch (error) {
//     console.error('Error updating documents:', error);
//   }
// };

// // Schedule the cron job to run every day at midnight 0 0 * * * (for every 20 seconds use */20 * * * * *)
// cron.schedule('0 0 * * *', () => {
//   console.log('Running trip transit batch job ...');
//   statusChangeBatchJob();
// });

// // Function to trigger the batch job on demand
// const triggerBatchJob = () => {
//   console.log('Triggering batch job on demand...');
//   statusChangeBatchJob();
// };

// export { triggerBatchJob };
