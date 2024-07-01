import cron from 'node-cron'
import dotenv from 'dotenv'
import Dashboard from '../models/dashboardSchema.js';
import { sendToOtherMicroservice } from '../rabbitmq/publisher.js';

dotenv.config();


const getSettlements = async () => {
  return await Dashboard.find({
    $or: [
      {
        // 'cashAdvanceSchema.cashAdvancesData.isSentToFinance': false,
        'cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus': {
          $in: ['pending settlement', 'Paid and Cancelled'],
        },
      },
      {
        // 'tripSchema.travelExpenseData.isSentToFinance': false,
        'tripSchema.travelExpenseData.expenseHeaderStatus': {
          $in: ['pending settlement', 'Paid'],
        },
      },
      {
        // 'reimbursementSchema.isSentToFinance': false,
        'reimbursementSchema.expenseHeaderStatus': {
          $in: ['pending settlement'],
        },
      },
    ],
  });
};


// export const financeBatchjob = async () => {
//     try {
//         const settlements = await getSettlements()

//         let result;
//         result = {success:true,message: 'All are settled.'}
//         if (!settlements || settlements.length === 0) {
//             return result
//         }
//        let pendingCashAdvanceSettlements = []
//        let pendingTravelExpenseSettlements = []
//        let pendingReimbursementSettlements = []

// if(settlements){
//     console.log("finance doc's ", settlements)
//     pendingCashAdvanceSettlements = settlements.filter(doc => {
//         return doc?.cashAdvanceSchema?.cashAdvancesData.some(
//             data =>
//                 data.cashAdvanceStatus === 'pending settlement' ||
//                 data.cashAdvanceStatus === 'Paid and Cancelled'
//         );
//     });

//     pendingTravelExpenseSettlements = settlements.filter(doc => {
//         return doc?.tripSchema?.travelExpenseData.some(
//             data =>
//                 data.expenseHeaderStatus === 'pending settlement' ||
//                 data.expenseHeaderStatus === 'Paid'
//         );
//     });

//     pendingReimbursementSettlements = settlements.filter(doc => {
//         return doc?.reimbursementSchema.some(
//             data =>
//                 data.expenseHeaderStatus === 'pending settlement' 
//         );
//     });

//     const payload= result
//     const action = 'full-update'
//     const destination = 'finance'
//     const comments = 'all finance settlements sent from dashboard microservice to finance microservice'
//     await sendToOtherMicroservice(payload, action, destination, comments, source='dashboard', onlineVsBatch='batch')
//     await processSettlements(pendingCashAdvanceSettlements, pendingTravelExpenseSettlements, pendingReimbursementSettlements);
//     console.log("finance ", result)
//     return result ={ pendingCashAdvanceSettlements,pendingTravelExpenseSettlements, pendingReimbursementSettlements}
   
// } else{
//     return result ={}
// }} catch (error) {
//         console.error("Error in fetching employee Dashboard:", error);
//         throw new Error('Error in fetching employee Dashboard');
//     }
// };
export const financeBatchjob = async () => {
    try {
        const settlements = await getSettlements();

        let result;
        result = { success: true, message: 'All are settled.' };
        if (!settlements || settlements.length === 0) {
            return result;
        }

        let pendingCashAdvanceSettlements = [];
        let pendingTravelExpenseSettlements = [];
        let pendingReimbursementSettlements = [];

        if (settlements) {
            pendingCashAdvanceSettlements = settlements
            .filter(doc => {
                return doc?.cashAdvanceSchema?.cashAdvancesData.some(
                    data =>
                        data.cashAdvanceStatus === 'pending settlement' ||
                        data.cashAdvanceStatus === 'Paid and Cancelled'
                );
            })
            .map(doc => doc.cashAdvanceSchema);


            pendingTravelExpenseSettlements = settlements
            .filter(doc => {
                return doc?.tripSchema?.travelExpenseData.some(
                    data =>
                        data.expenseHeaderStatus === 'pending settlement' ||
                        data.expenseHeaderStatus === 'Paid'
                );
            })
            .map(doc => doc.tripSchema);

            pendingReimbursementSettlements = settlements.filter(doc => {
                // Directly access the expenseHeaderStatus in reimbursementSchema
                return doc?.reimbursementSchema?.expenseHeaderStatus === 'pending settlement';
            });

            result = {pendingCashAdvanceSettlements, pendingTravelExpenseSettlements, pendingReimbursementSettlements}
            const payload = result;
            const action = 'full-update';
            const destination = 'finance';
            const comments = 'all finance settlements sent from dashboard microservice to finance microservice';
            await sendToOtherMicroservice(payload, action, destination, comments, 'dashboard', 'batch');
            console.log("finance ", result);
            result = { pendingCashAdvanceSettlements, pendingTravelExpenseSettlements, pendingReimbursementSettlements };
            return result;
        } else {
            return {};
        }
    } catch (error) {
        console.error("Error in fetching employee Dashboard:", error);
        throw new Error('Error in fetching employee Dashboard');
    }
};




export const scheduleToFinanceBatchJob = () => {
    const schedule = process.env.SCHEDULE_TIME??'* * * * *';
    cron.schedule(schedule, async () => {
      console.log('Running Finance batchjob...');
      try {
        await financeBatchjob();
        console.log('Finance batchjob completed successfully.');
      } catch (error) {
        console.error('Error running Finance batchjob :', error);
      }
    });
    console.log('scheduled Send to Finance batchjob ')
}




