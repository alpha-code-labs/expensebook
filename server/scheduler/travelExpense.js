import cron from 'node-cron';
import Trip from '../models/tripSchema.js';


//Approved to next state.
const approvedToNextStateBatchJob = async () => {
    console.log("hi")
    try {
        const expensesToUpdate = await Trip.find({
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
    cron.schedule('*/20 * * * * *', () => {
        console.log('Running approved To Next State BatchJob for travel expense report...');
        approvedToNextStateBatchJob();
      });    
}

