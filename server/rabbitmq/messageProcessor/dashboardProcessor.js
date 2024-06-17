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
  for (const settlement of settlements) {
      const { tenantId, reimbursementSchema, } = settlement;
      const { tenantName,
        companyName,
        expenseHeaderId,
        expenseHeaderNumber,
        expenseHeaderType,
        expensePurpose,
        createdBy,
        expenseHeaderStatus,
        travelAllocationFlags,
        settlementFlag,
        actionedUpon,
        expenseLines,
        expenseViolations,
        expenseCancelledReason,
        expenseSubmissionDate} = reimbursementSchema
      const { empId } = createdBy;
      console.log("reimbursement array i get ..... ", JSON.stringify(settlement))
      const reimbursementReport = {
          tenantId,
          tenantName,
          companyName,
          expenseHeaderId,
          expenseHeaderNumber,
          expenseHeaderType,
          expensePurpose,
          createdBy,
          expenseHeaderStatus,
          travelAllocationFlags,
          settlementFlag,
          actionedUpon,
          expenseLines,
          expenseViolations,
          expenseCancelledReason,
          expenseSubmissionDate,
      };

      try {
          const reimbursement = await Finance.findOneAndUpdate(
              { tenantId, 'reimbursementSchema.tenantId': tenantId, 'reimbursementSchema.actionedUpon': false, 'reimbursementSchema.expenseHeaderId': expenseHeaderId },
              { $set: { reimbursementSchema:reimbursementReport } },
              { upsert: true, new: true }
          );

          console.log("Reimbursement update result:", reimbursement);

          if (reimbursement) {
              console.log("Success: Reimbursement updated successfully.");
              return { success: true , error: null}
            } else {
              console.log("Failed: Unable to save reimbursement expense in Finance.");
               return { success: false , error: error}
            }
      } catch (error) {
          console.error('Failed to update settlement:', error);
      }
  }
};

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
          "cashAdvanceSchema.actionedUpon":false,
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
        'tripSchema.tenantId': tenantId , 
        'tripSchema.travelRequestData.travelRequestId':travelRequestId,
        'tripSchema.tripId': tripId,
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
    return {success: false, error: null}
  }
 } catch (error) {
    console.error('Failed to update Finance: TravelExpenseData updation failed', error);
    return { success: false, error: error}
  }
}



