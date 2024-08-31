import cron from 'node-cron'
import dotenv from 'dotenv'
import Dashboard from '../models/dashboardSchema.js';
import { sendToOtherMicroservice } from '../rabbitmq/publisher.js';

dotenv.config();


const getSettlements = async (settlementsFilter) => {
  return await Dashboard.find(settlementsFilter);
};

// const updateSentToFinanceStatus = async (settlementsFilter) => {
//   return await Dashboard.updateMany(settlementsFilter,{
//     $set: {
//       'cashAdvanceSchema?.cashAdvancesData?.$.actionedUpon':false,
//       'tripSchema?.travelExpenseData?.$.actionedUpon':false,
//       'reimbursementSchema?.actionedUpon':false,
//     }
//   })
// }
const updateSentToFinanceStatus = async (settlementsFilter) => {
  const documents = await Dashboard.find(settlementsFilter);

  const bulkOps = documents.map((doc) => {
    const update = { $set: {} };

    if (doc?.cashAdvanceSchema?.cashAdvancesData) {
      update.$set['cashAdvanceSchema.cashAdvancesData.$[elem].actionedUpon'] = true;
    }
    if (doc?.tripSchema?.travelExpenseData) {
      update.$set['tripSchema.travelExpenseData.$[elem].actionedUpon'] = true;
    }
    if (doc?.reimbursementSchema) {
      update.$set['reimbursementSchema.actionedUpon'] = true;
    }

    return {
      updateOne: {
        filter: { _id: doc._id },
        update,
        arrayFilters: [{ 'elem.actionedUpon': false }],
      },
    };
  });

  const result = await Dashboard.bulkWrite(bulkOps);
  console.log('Modified documents:', result.modifiedCount);
};



export const financeBatchJob = async () => {
    try {
      const settlementsFilter = {
        $or: [
          {
            'cashAdvanceSchema.cashAdvancesData.actionedUpon': false,
            'cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus': {
              $in: ['pending settlement', 'Paid and Cancelled'],
            },
          },
          {
            'tripSchema.travelExpenseData.actionedUpon': false,
            'tripSchema.travelExpenseData.expenseHeaderStatus': {
              $in: ['pending settlement', 'Paid'],
            },
          },
          {
            'reimbursementSchema.actionedUpon': false,
            'reimbursementSchema.expenseHeaderStatus': {
              $in: ['pending settlement'],
            },
          },
        ],
      }
        const settlements = await getSettlements(settlementsFilter);

        console.log("settlements",settlements.length)
        let result;
        result = { success: true, message: 'All are settled.' };
        if (!settlements || settlements.length === 0) {
            return result;
        }

        let pendingCashAdvanceSettlements = [];
        let pendingTravelExpenseSettlements = [];
        let pendingReimbursementSettlements = [];

        if (settlements?.length > 0) {
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
            await updateSentToFinanceStatus(settlementsFilter)
            result = { pendingCashAdvanceSettlements, pendingTravelExpenseSettlements, pendingReimbursementSettlements };
            return result;
        } 
          return {};
      
    } catch (error) {
        console.error("Error in fetching employee Dashboard:", error);
        throw new Error('Error in fetching employee Dashboard');
    }
};


export const scheduleToFinanceBatchJob = () => {
    const schedule = process.env.SCHEDULE_TIME??'* * * * *';
    cron.schedule(schedule, async () => {
      console.log('Running Finance batchJob...');
      try {
        await financeBatchJob();
        console.log('Finance batchJob completed successfully.');
      } catch (error) {
        console.error('Error running Finance batchJob :', error);
      }
    });
    console.log('scheduled Send to Finance batchJob ')
}




