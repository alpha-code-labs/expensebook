import Finance from "../../models/Finance.js";
import REIMBURSEMENT from "../../models/reimbursement.js";


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


// export const fullUpdateReimbursement = async (settlements) => {
//   console.log("reimbursement array one..... ", JSON.stringify(settlements))
// try{
//    const updateAll = settlements.map(async(reimbursement) => {
//      const {tenantId, expenseHeaderId} = reimbursement

//      const reimbursementReport = await REIMBURSEMENT.findOneAndUpdate({
//       tenantId,
//       'actionedUpon':false,
//       'expenseHeaderId':expenseHeaderId
//      },
//      {
//       $set:{
//         ...reimbursement,
//       }
//       },
//       {
//         upsert:true, new:true
//       }
//      )

//      console.log("reimbursementReport updated in finance db",reimbursementReport?.length)
//      return { success:true, error: null}
//    })
//    const results = await Promise.all(updateAll)
//    const isSuccess = results.every(result => result.success)
//    if(isSuccess){
//     return {success:true, error: null}
//    } else{
//     return { success:false, error: error}
//    }
// } catch (error){
//   return {success:false, error:error.message}
// }
// }

export const fullUpdateReimbursement = async (settlements) => {
  console.log("Reimbursement array: ", JSON.stringify(settlements));

  try {
    const updateAll = settlements.map(async (reimbursement) => {
      const { tenantId, expenseHeaderId } = reimbursement;

      // Prepare the filter and replacement document
      const filter = { tenantId, expenseHeaderId };
      const replacement = { ...reimbursement };

      // Ensure _id is not included in replacement
      delete replacement._id;

      const reimbursementReport = await REIMBURSEMENT.findOneAndReplace(
        filter,
        replacement,
        {
          upsert: true, // Create a new document if no match is found
          returnDocument: 'after', // Return the document after the replacement
        }
      );

      return { success: true, reimbursement: reimbursementReport };
    });

    const results = await Promise.all(updateAll);
    const isSuccess = results.every(result => result.success);

    if (isSuccess) {
      return { success: true, data: results.map(result => result.reimbursement) };
    } else {
      return { success: false, error: "Some updates failed." };
    }
  } catch (error) {
    console.error("Error updating reimbursements:", error);
    return { success: false, error: error.message };
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
        },
        { 
          $set:{
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
    console.error('Failed to update Finance: Failed to update TravelExpenseData failed', error);
    return { success: false, error: error}
  }
}







