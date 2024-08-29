import cron from 'node-cron';
import Expense from '../models/tripSchema.js';
// import { sendToTripMicroservice } from '../internalControllers/controllers/tripMicroservice.js';
// import { sendToApprovalMicroservice } from '../internalControllers/controllers/approvalMicroservice.js';

// Function to log modified count
const logModifiedCount = (count) => {
  if (count !== undefined) {
    console.log(`Updated ${count} document(s).`);
  } else {
    console.log('No documents matched the criteria for modification.');
  }
};

// Function to update status for travel expense report from Approved to Next State
const approvedToNextStateBatchJob = async () => {
  try {
    const expensesToUpdate = await Expense.find({
      'expenseHeaderStatus': 'approved',
      'expenseHeaderType': 'travel',
      $or: [
        { 'alreadyBookedExpenseLines': { $exists: true, $ne: {} }, 'expenseLines': { $exists: true, $not: { $size: 0 } } },
        { 'alreadyBookedExpenseLines': { $exists: true, $ne: {} }, 'expenseLines': { $exists: false } }
      ]
    });

    let countModified = 0;

    for (const expense of expensesToUpdate) {
      let newExpenseHeaderStatus = 'pending settlement';

      if (
        (expense.alreadyBookedExpenseLines && expense.expenseLines && !expense.expenseLines.length) ||
        (expense.alreadyBookedExpenseLines && !expense.expenseLines)
      ) {
        newExpenseHeaderStatus = 'paid';
      }

      if (expense.expenseHeaderStatus !== newExpenseHeaderStatus) {
        // Update status in SendForApprovalAndTripWithPS first
        await SendForApprovalAndTripWithPS(expense);
        // Then save the changes in the Expense model
        expense.expenseHeaderStatus = newExpenseHeaderStatus;
        await expense.save();
        countModified++;
      }
    }

    console.log(`Updated status for ${countModified} expense(s) successfully.`);
  } catch (error) {
    console.error('Error occurred during status change batch job:approved To Next State BatchJob', error);
  }
};

const SendForApprovalAndTripWithPS = async (expense) => {
  try {
    if (
      expense.expenseHeaderStatus === 'approved' &&
      expense.expenseHeaderType === 'travel' &&
      ((expense.alreadyBookedExpenseLines && expense.expenseLines && !expense.expenseLines.length) ||
        (expense.alreadyBookedExpenseLines && !expense.expenseLines))
    ) {
      // status is updated and send for approval and trip microservice
      expense.expenseHeaderStatus = 'pending settlement';
      await sendToTripMicroservice([expense]); // send it to trip microservice
      await sendToApprovalMicroservice([expense]);
    }
  } catch (error) {
    console.error('Error occurred during status update and sending for APPROVAL AND TRIP microservice:SendForApprovalAndTripWithPS', error);
  }
};

// Schedule the cron job to run every day at midnight('0 0 * * *) or [use -(for every 20 seconds */20 * * * * *)]
cron.schedule('0 0 * * *', async () => {
  console.log('Running approved To Next State BatchJob for travel expense report...');
  await approvedToNextStateBatchJob();
});


// testing batchjob
const triggerApprovedToNextStateBatchJob = () => {
  console.log('Triggering expenseHeaderStatus change batch job on demand...');
  approvedToNextStateBatchJob();
};

export { triggerApprovedToNextStateBatchJob };



//2)//important!! - THiS BatCHJoB sHoULD aLWays rUN aFter 'approvedToNextStateBatchJob', 
//2) AS THIs BAtchJob GetS  all trAVEl exPenSE REporTS With sTAtUS 'pending settlement' send DOCumENTS for APPRoVALS MICRosErvICE.



// 2) Function to process and send documents for approval & TRip MicROsERVice with 'pending settlement' status for 'travel'
// const SendForApprovalAndTripWithPS = async () => {
//   try {
//     const expensesToUpdate = await Expense.find({
//       'expenseHeaderStatus': 'pending settlement',
//       'expenseHeaderType': 'travel',
//     });

//     const documentsToSendForApprovalAndTripWithPS = expensesToUpdate.filter(
//       (expense) => expense.approvers && expense.approvers.length > 0
//     );

//     if (documentsToSendForApprovalAndTripWithPS.length > 0) {
//       await sendToTripMicroservice(documentsToSendForApprovalAndTripWithPS);
//       await sendToApprovalMicroservice(documentsToSendForApprovalAndTripWithPS);
//     } else {
//       console.log('No eligible documents for "pending settlement" status and "travel" type for SendForApprovalAndTripWithPS ');
//     }
//   } catch (error) {
//     console.error('Error occurred during status update and sending for APPROVAL AND TRIP microservice:SendForApprovalAndTripWithPS', error);
//     // Implement error handling, retries, or logging as required
//   }
// };

// Cron job to run SendForApprovalAndTripWithPS every day at midnight
cron.schedule('0 0 * * *', () => {
  console.log('Running SendForApprovalAndTripWithPS for travel expense report...');
  SendForApprovalAndTripWithPS();
});

export { SendForApprovalAndTripWithPS };





// Schedule the cron job to run every day at midnight('0 0 * * *) or [use -(for every 20 seconds */20 * * * * *)]
// const scheduleBatchJob = () => {
//     cron.schedule('*/2 * * * * *', () => {
//       console.log('Running expense status change batch job for travel expense report...');
//       approvedToNextStateBatchJob();
//     });
//   };





// import cron from 'node-cron';
// import axios from 'axios';
// import Expense from '../models/expenseSchema.js';
// import { sendToTripMicroservice } from './tripMicroservice.js'; // Replace './tripMicroservice.js' with the actual path
// import { sendToApprovalMicroservice } from './approvalMicroservice.js'; // Replace './approvalMicroservice.js' with the actual path

// // Function to log modified count
// const logModifiedCount = (count) => {
//   if (count !== undefined) {
//     console.log(`Updated ${count} document(s).`);
//   } else {
//     console.log('No documents matched the criteria for modification.');
//   }
// };

// // Function to update status for travel expense report from Approved to Next State
// const updateStatusForTravelExpense = async (expense) => {
//   let newExpenseHeaderStatus = 'pending settlement';

//   if (
//     (expense.alreadyBookedExpenseLines && expense.expenseLines && !expense.expenseLines.length) ||
//     (expense.alreadyBookedExpenseLines && !expense.expenseLines)
//   ) {
//     newExpenseHeaderStatus = 'paid';
//   }

//   if (expense.expenseHeaderStatus !== newExpenseHeaderStatus) {
//     expense.expenseHeaderStatus = newExpenseHeaderStatus;
//     await expense.save();
//     return true; // Return true if modified
//   }

//   return false; // Return false if not modified
// };

// // Retry logic for async functions
// const retry = async (fn, maxRetries = 3) => {
//   for (let i = 0; i < maxRetries; i++) {
//     try {
//       return await fn();
//     } catch (error) {
//       console.error(`Error occurred. Retrying... (Attempt ${i + 1}/${maxRetries})`);
//     }
//   }
//   throw new Error('Max retries reached. Unable to complete operation.');
// };

// // Function to update status and send for approval and trip
// const updateStatusAndSendForApprovalAndTrip = async (expensesToUpdate) => {
//   let countModified = 0;

//   for (const expense of expensesToUpdate) {
//     const modified = await retry(async () => await updateStatusForTravelExpense(expense));
//     if (modified) {
//       countModified++;
//     }
//   }

//   console.log(`Updated status for ${countModified} expense(s) successfully.`);

//   const eligibleDocuments = expensesToUpdate.filter(
//     (expense) => expense.approvers && expense.approvers.length > 0
//   );

//   if (eligibleDocuments.length > 0) {
//     await retry(async () => await sendToTripMicroservice(eligibleDocuments));
//     await retry(async () => await sendToApprovalMicroservice(eligibleDocuments));
//   } else {
//     console.log('No eligible documents for "pending settlement" status and "travel" type for SendForApprovalAndTripWithPS');
//   }
// };

// // Cron job to run every day at midnight('0 0 * * *) or [use -(for every 20 seconds */20 * * * * *)]
// cron.schedule('0 0 * * *', async () => {
//   console.log('Running approved To Next State BatchJob for travel expense report...');
  
//   try {
//     const expensesToUpdate = await Expense.find({
//       'expenseHeaderStatus': 'approved',
//       'expenseHeaderType': 'travel',
//       $or: [
//         { 'alreadyBookedExpenseLines': { $exists: true, $ne: {} }, 'expenseLines': { $exists: true, $not: { $size: 0 } } },
//         { 'alreadyBookedExpenseLines': { $exists: true, $ne: {} }, 'expenseLines': { $exists: false } }
//       ]
//     });

//     await updateStatusAndSendForApprovalAndTrip(expensesToUpdate);
//   } catch (error) {
//     console.error('Error occurred during status change batch job:approved To Next State BatchJob', error);
//   }
// });
