import cron from 'node-cron'
import dotenv from 'dotenv'
import Dashboard from '../models/dashboardSchema.js';
import { sendToOtherMicroservice } from '../rabbitmq/publisher.js';

dotenv.config();


const updateSentToFinanceStatus = async (settlementsFilter) => {
  try {
    const documents = await Dashboard.find(settlementsFilter);

    const bulkOps = documents.map((doc) => {
      const update = { $set: {} };
      const arrayFilters = [];
      const arrayFilterNames = {}; // To keep track of array filter names

      // Helper function to get a unique array filter name
      const getUniqueArrayFilterName = (baseName) => {
        let filterName = baseName;
        let index = 1;
        while (arrayFilterNames[filterName]) {
          filterName = `${baseName}_${index++}`;
        }
        arrayFilterNames[filterName] = true;
        return filterName;
      };

      // Check if we need to update an array field
      if (doc?.cashAdvanceSchema?.cashAdvancesData) {
        const filterName = getUniqueArrayFilterName('cashAdvancesDataElem');
        update.$set[`cashAdvanceSchema.cashAdvancesData.$[${filterName}].actionedUpon`] = true;
        arrayFilters.push({ [`${filterName}.actionedUpon`]: false });
      }
      if (doc?.tripSchema?.travelExpenseData) {
        const filterName = getUniqueArrayFilterName('travelExpenseDataElem');
        update.$set[`tripSchema.travelExpenseData.$[${filterName}].actionedUpon`] = true;
        arrayFilters.push({ [`${filterName}.actionedUpon`]: false });
      }
      // For non-array fields, no arrayFilters are needed
      if (doc?.reimbursementSchema) {
        update.$set['reimbursementSchema.actionedUpon'] = true;
      }

      return {
        updateOne: {
          filter: { _id: doc._id },
          update,
          arrayFilters: arrayFilters.length > 0 ? arrayFilters : undefined,
        },
      };
    });

    const result = await Dashboard.bulkWrite(bulkOps);
    console.log('Modified documents:', result.modifiedCount);
  } catch (error) {
    console.error('Error updating documents:', error);
  }
};

const getSettlements = async () => {
  const cashAdvanceStatus = ['pending settlement', 'Paid and Cancelled'];
  const travelExpenseStatus = ['pending settlement', 'Paid'];
  const reimbursementStatus = ['pending settlement'];

  const settlementsFilter = {
      $or: [
          {
              'cashAdvanceSchema.cashAdvancesData.actionedUpon': false,
              'cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus': {
                  $in: cashAdvanceStatus,
              },
          },
          {
              'tripSchema.travelExpenseData.actionedUpon': false,
              'tripSchema.travelExpenseData.expenseHeaderStatus': {
                  $in: travelExpenseStatus,
              },
          },
          {
              'reimbursementSchema.actionedUpon': false,
              'reimbursementSchema.expenseHeaderStatus': {
                  $in: reimbursementStatus,
              },
          },
      ],
  };

  return await Dashboard.find(settlementsFilter);
};


const financeBatchJob = async () => {
    try {
      // const settlementsFilter = {
      //   $or: [
      //     {
      //       'cashAdvanceSchema.cashAdvancesData.actionedUpon': false,
      //       'cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus': {
      //         $in: ['pending settlement', 'Paid and Cancelled'],
      //       },
      //     },
      //     {
      //       'tripSchema.travelExpenseData.actionedUpon': false,
      //       'tripSchema.travelExpenseData.expenseHeaderStatus': {
      //         $in: ['pending settlement', 'Paid'],
      //       },
      //     },
      //     {
      //       'reimbursementSchema.actionedUpon': false,
      //       'reimbursementSchema.expenseHeaderStatus': {
      //         $in: ['pending settlement'],
      //       },
      //     },
      //   ],
      // }
      const settlements = await getSettlements();

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


const scheduleToFinanceBatchJob = () => {
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


export {
  getSettlements,
  financeBatchJob,
  scheduleToFinanceBatchJob

}

