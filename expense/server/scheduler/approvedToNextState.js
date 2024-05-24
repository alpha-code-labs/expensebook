import cron from 'node-cron';
import Expense from '../models/travelExpenseSchema.js';


//1) To update status for travel expense report from Approved to Next State
const approvedToNextStateBatchJob = async () => {
    console.log("hi")
    try {
        const expensesToUpdate = await Expense.find({
            'travelExpenseData': {
              $elemMatch: {
                'expenseHeaderStatus': 'approved'
              }
            },
          });
          
          
  
      if(expensesToUpdate?.length == 0){
        console.log(" no documents for approved")
       return {success: true, message: 'Batch job run successfully. Currently no documents found'}
      } else {
        console.log(" the documents for approved",expensesToUpdate )
        let countModified = 0;

        const success = await Promise.all(expensesToUpdate.map(async (expense) => {
            let expenseHeaderStatus = 'pending settlement';
          
            const firstExpenseData = expense.travelExpenseData[0];

            // Check if the expenseHeaderStatus is not already 'paid'
            if (firstExpenseData?.alreadyBookedExpenseLines &&
                (!firstExpenseData.expenseLines || !firstExpenseData.expenseLines.length)) {
                    console.log("The is 1st condition");
              firstExpenseData.expenseHeaderStatus = 'paid';
              await expense.save();
              countModified++;
            }
            
            
          
            const approvedExpenseData = expense.travelExpenseData.find(data => data.expenseHeaderStatus == 'approved');
            if (approvedExpenseData) {
                console.log("this 2nd condition")
              approvedExpenseData.expenseHeaderStatus = expenseHeaderStatus;
              await expense.save();
              countModified++;
            }
          }));
          
          if(success){
           console.log(`Updated status for ${countModified} expense(s) successfully.`);
           return {success: true, message : `Updated status for ${countModified} expense(s) successfully.` }
          } else {
            return { success: false , message : `Updated status for ${countModified} expense(s)`}
          }
   
        
      }
     
    } catch (error) {
      console.error('Error occurred during status change batch job: approved To Next State BatchJob', error);
    }
};
  
  

// Schedule the cron job to run every day at midnight('0 0 * * *) or [use -(for every 20 seconds */20 * * * * *)]
export const runApproveToNextState = async () =>{
    cron.schedule('*/30 * * * * *', () => {
        console.log('Running approved To Next State BatchJob for travel expense report...');
        approvedToNextStateBatchJob();
      });    
}





//2)//important!! - THiS BatCHJoB sHoULD aLWays rUN aFter 'approvedToNextStateBatchJob', 
//2) AS THIs BAtchJob GetS  all trAVEl exPenSE REporTS With sTAtUS 'pending settlement' send DOCumENTS for APPRoVALS MICRosErvICE.
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
cron.schedule('*/30 * * * * *', () => {
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