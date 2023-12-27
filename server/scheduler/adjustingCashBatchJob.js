// import cron from 'node-cron';
// import { config } from 'dotenv';
// import { Trip } from '../models/tripSchema.js';
// import { sendNotificationToDashboard } from '../rabbitmq/rabbitmqNotifications.js';

// // Load environment variables from .env file
// config();

// // Get the schedule time from the environment variable
// const scheduleTime = process.env.SCHEDULE_TIME;

// // Schedule the cash batch job to run daily at the specified time
// const adjustingCashBatchJob = cron.schedule(scheduleTime, async () => {
//   try {
//     await runAdjustingCashBatchJob();
//     console.log('Adjusting Cash batch job completed successfully.');
//   } catch (error) {
//     console.error('Adjusting Cash batch job error:', error);
//   }
// });

// export async function runAdjustingCashBatchJob() {
//   try {
//     // Define the filter to find trips with specific criteria
//     const filter = {
//       'tripStatus': 'transit',
//       'notificationSentToDashboardFlag': true,
//       'cashAdvanceData.cashAdvanceStatus': 'paid',
//     };

//     // Find all documents matching the filter
//     const matchingDocuments = await Trip.find(filter);

//     // Iterate through matching documents
//     for (const document of matchingDocuments) {
//       // Calculate the total remaining cash advance amount
//       let remainingCashAdvance = 0;

//       // Iterate through user trips
//       for (const user of document.users) {
//         for (const trip of user.trips) {
//           // Check if the trip has expenses
//           if (trip.expenses && trip.expenses.length > 0) {
//             // Filter out expenses made by business travel/admin profile
//             const nonBusinessExpenses = trip.expenses.filter((expense) => {
//               // Replace 'businessAdminProfile' with the actual profile name
//               return expense.profile !== 'businessAdminProfile';
//             });

//             // Calculate the total remaining expense amount
//             const totalExpenseAmount = nonBusinessExpenses.reduce(
//               (total, expense) => total + expense.amount,
//               0
//             );

//             // Deduct the total expense amount from the cash advance
//             trip.cashAdvance -= totalExpenseAmount;

//             // Update the remaining cash advance for this trip
//             remainingCashAdvance += trip.cashAdvance;

//             // Update the notificationSentToDashboardFlag to false
//             trip.notificationSentToDashboardFlag = false;
//           }
//         }
//       }

//       // Update the document with the new remaining cash advance
//       await Trip.updateOne(
//         { _id: document._id },
//         {
//           $set: {
//             'notificationSentToDashboardFlag': false,
//           },
//           $inc: {
//             'cashAdvanceData.amountDetails.amount': -remainingCashAdvance,
//           },
//         }
//       );
//     }

//     console.log('Adjusting Cash batch job completed successfully.');
//   } catch (error) {
//     console.error('Error in Adjusting cash batch job:', error);
//   }
// }

// // Start the cash batch job immediately (useful for testing)
// runAdjustingCashBatchJob();

// // Controller to trigger the batch job on demand
// export const triggerAdjustingCashBatchJob = async (req, res) => {
//   try {
//     await runAdjustingCashBatchJob();
//     res.status(200).json({ message: 'Adjusting Cash batch job triggered on demand.' });
//   } catch (error) {
//     console.error('Error triggering cash batch job:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// export default adjustingCashBatchJob;
