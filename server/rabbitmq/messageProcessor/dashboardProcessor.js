import Finance from "../../models/Finance.js";


export const updateFinance = async (payload) => {
  try {
      const { pendingCashAdvanceSettlements, pendingTravelExpenseSettlements, pendingReimbursementSettlements } = payload;

      if (Array.isArray(pendingCashAdvanceSettlements) && pendingCashAdvanceSettlements.length > 0) {
          await fullUpdateCashBatchJob(pendingCashAdvanceSettlements);
      }

      if (Array.isArray(pendingTravelExpenseSettlements) && pendingTravelExpenseSettlements.length > 0) {
          await fullUpdateExpense(pendingTravelExpenseSettlements);
      }

      if (Array.isArray(pendingReimbursementSettlements) && pendingReimbursementSettlements.length > 0) {
          await fullUpdateReimbursement(pendingReimbursementSettlements);
      }

      return { success: true, error: null };
  } catch (error) {
      console.error('Failed to update Finance: using synchronous queue', error);
      return { success: false, error: error.message };
  }
};


export const fullUpdateReimbursement = async (settlements) => {
  console.log("reimbursement array one..... ", JSON.stringify(settlements))
try{
   const updateAll = settlements.map(async(reimbursement) => {
     const {reimbursementSchema} = reimbursement
     const {tenantId, expenseHeaderId,} = reimbursementSchema

     const reimbursementReport = await Finance.findOneAndUpdate({
      tenantId,
      'reimbursementSchema.actionedUpon':false,
      'reimbursementSchema.expenseHeaderId':expenseHeaderId
     },
     {
      $set:{
        reimbursementSchema:reimbursementSchema,
      }
      },
      {
        upsert:true, new:true
      }
     )

     return { success:true, error: null}
   })
   const results = await Promise.all(updateAll)
   const isSuccess = results.every(result => result.success)
   if(isSuccess){
    return {success:true, error: null}
   } else{
    return { success:false, error: error}
   }
} catch (error){
  return {success:false, error:error.message}
}
}


export const fullUpdateCashBatchJob = async (payloadArray) => {
  try {
    const updatePromises = payloadArray.map(async (payload) => {
      const { travelRequestData, cashAdvancesData } = payload;
      const { tenantId, travelRequestId } = travelRequestData;

      // Check if the tenantId is present
      if (!tenantId) {
        console.error('TenantId is missing');
        return { success: false, error: 'TenantId is missing' };
      }

      const updated = await Finance.updateOne(
        { 
          "tenantId": tenantId,
          "travelRequestId": travelRequestId,
          "cashAdvanceSchema.cashAdvancesData.actionedUpon":false,
        },
        { 
          $set:{
          "travelRequestSchema.isCashAdvanceTaken": true,
          "cashAdvanceSchema.travelRequestData": travelRequestData,
          "cashAdvanceSchema.cashAdvancesData": cashAdvancesData,
          }
        },
        { upsert: true, new: true }
      );
      console.log('Saved to Finance: using async queue', updated);
      return { success: true, error: null };
    });

    // Wait for all updates to complete
    const results = await Promise.all(updatePromises);
    const isSuccess = results.every(result => result.success);
    if(isSuccess){
      return { success: true, error: null}
    } else {
      return {success: false, error: null}}
  } catch (error) {
    console.error('Failed to update Finance: using rabbitmq m2m', error);
    return { success: false, error: error };
  }
}

export const fullUpdateExpense = async (payloadArray) => {
  try{
  const updatePromises = payloadArray.map(async(expenseReport) =>{
    const { 
      tenantId,
      tripId,
      travelRequestData,
    } = expenseReport;

    if(!tenantId){
      console.log("trying to update expense in finance", expenseReport);
      return { success: false, error:'TenantId is missing'}
    }
    const {travelRequestId} = travelRequestData
    console.log("expenseReport for travelExpenseData", expenseReport )

    const updated = await Finance.findOneAndUpdate(
      { 
        tenantId,
        travelRequestId,
        'tripSchema.travelExpenseData.actionedUpon':false,
        },
      {
       $set:{
        tripSchema :expenseReport
      }
      },
      { upsert: true, new: true }
    );

    console.log('Saved to Finance: TravelExpenseData updated successfully', updated);
    return { success: true, error: null}
  })

  const results = await Promise.all(updatePromises)
  const isSuccess = results.every(result => result.success)
  if(isSuccess){
    return { success: true, error: null}
  } else {
    return {success: false, error: error}
  }
 } catch (error) {
    console.error('Failed to update Finance: TravelExpenseData updation failed', error);
    return { success: false, error: error}
  }
}







