import cron from 'node-cron';
import Expense from '../models/expenseSchema.js';

//FOR Reporting and Analytics/Performance Measurement/Logging and Error Handling 
const logModifiedCount = (count) => {
    if (count !== undefined) {
      console.log(`Updated ${count} document(s).`);
    } else {
      console.log('No documents matched the criteria for modification.');
    }
  };

//1) To update status for travel expense report from Approved to Next State
//1) important!! - AFTER THIs BatCHJoB send DOCumENTS for APPRoVALS RUNS.
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
          expense.expenseHeaderStatus = newExpenseHeaderStatus;
          await expense.save();
          countModified++;
        }
      }
  
    //   console.log(`Updated status for ${countModified} expense(s) successfully.`);
    } catch (error) {
      console.error('Error occurred during status change batch job:approved To Next State BatchJob', error);
    }
  };

// Schedule the cron job to run every day at midnight('0 0 * * *) or [use -(for every 20 seconds */20 * * * * *)]
  cron.schedule('0 0 * * *', () => {
    console.log('Running approved To Next State BatchJob for travel expense report...');
    approvedToNextStateBatchJob();
  });


const triggerApprovedToNextStateBatchJob = () => {
  console.log('Triggering expenseHeaderStatus change batch job on demand...');
  approvedToNextStateBatchJob();
};

export { triggerApprovedToNextStateBatchJob };




//2)//important!! - THiS BatCHJoB sHoULD aLWays rUN aFter 'approvedToNextStateBatchJob', 
//2) AS THIs BAtchJob GetS  all trAVEl exPenSE REporTS With sTAtUS 'pending settlement' send DOCumENTS for APPRoVALS MICRosErvICE.


// 2) This controller extracts documents with status as 'pending settlement' and sends them for approval
import axios from 'axios';

// Function to send documents to 'trip' microservice
const sendToTripMicroservice = async (documents) => {
  try {
    await axios.post('URL_to_trip_microservice', documents);
    console.log(`Sent ${documents.length} document(s) to 'trip' microservice.`);
  } catch (error) {
    console.error('Error occurred while sending documents to "trip" microservice:', error);
    // Implement retry logic or other error handling as needed
  }
};

// Function to send documents to approval microservice
const sendToApprovalMicroservice = async (documents) => {
  try {
    await axios.post('URL_to_approval_microservice', documents);
    console.log(`Updated and sent ${documents.length} document(s) for approval.`);
  } catch (error) {
    console.error('Error occurred while sending documents for approval:', error);
    // Implement retry logic or other error handling as needed
  }
};

// 2) Function to process and send documents for approval & TRip MicROsERVice with 'pending settlement' status for 'travel'
const SendForApprovalAndTripWithPS = async () => {
  try {
    const expensesToUpdate = await Expense.find({
      'expenseHeaderStatus': 'pending settlement',
      'expenseHeaderType': 'travel',
    });

    const documentsToSendForApprovalAndTripWithPS = expensesToUpdate.filter(
      (expense) => expense.approvers && expense.approvers.length > 0
    );

    if (documentsToSendForApprovalAndTripWithPS.length > 0) {
      await sendToTripMicroservice(documentsToSendForApprovalAndTripWithPS);
      await sendToApprovalMicroservice(documentsToSendForApprovalAndTripWithPS);
    } else {
      console.log('No eligible documents for "pending settlement" status and "travel" type for SendForApprovalAndTripWithPS ');
    }
  } catch (error) {
    console.error('Error occurred during status update and sending for APPROVAL AND TRIP microservice:SendForApprovalAndTripWithPS', error);
    // Implement error handling, retries, or logging as required
  }
};

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