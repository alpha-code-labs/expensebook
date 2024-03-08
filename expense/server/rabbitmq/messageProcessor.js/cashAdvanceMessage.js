import Expense from "../../models/travelExpenseSchema.js";

//priority cash update-
/**
 * 
 * important - set 'isCashAdvanceTaken': true , in travelRequestData , when updating cashAdvanceData
 */
export const partialCashUpdate = async (payload) => {
    try {
    const updated = await Expense.updateOne(
      { 'tenantId': payload.tenantId,
        'travelRequestData.travelRequestId':payload.cashAdvancesData.travelRequestId},
      {
        $set: {
          'travelRequestData.isCashAdvanceTaken':true ,
          'cashAdvancesData':payload?.cashAdvancesData ?? [],
          }  
      },
      { upsert: true, new: true }
    );
    console.log(' cashAdvanceData updated in trip microservice: using async queue', updated);
    return { success: true, error: null}
  } catch (error) {
    console.error('travelRequestData -update in trip microservice: using async queue', error);
    return { success: false, error: error}
  }
  }


  // cash status cancelled - 
export const updateCashStatus = async (payload) => {
    try {
      const updated = await Approval.findOneAndUpdate(
        { 'tenantId': payload.tenantId, 'cashAdvanceData.travelRequestId': payload.travelRequestId },
        {
          $set: {
            'cashAdvanceData.$[elem].cashAdvancesData.$[inner].cashAdvanceStatus': payload.travelRequestStatus,
          },
        },
        { 
          arrayFilters: [
            { 'elem.travelRequestId': payload.travelRequestId },
            { 'inner.cashAdvanceId': payload.cashAdvanceId }
          ],
          upsert: true,
          new: true
        }
      );
  
      console.log('Travel request status updated in approval microservice:', updated);
      return { success: true, error: null };
    } catch (error) {
      console.error('Failed to update travel request status in approval microservice:', error);
      return { success: false, error: error };
    }
};