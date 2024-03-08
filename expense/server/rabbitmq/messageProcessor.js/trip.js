import Expense from "../../models/travelExpenseSchema.js"


  
// trip cancelled at header line or line item level is updated using this route
export const tripCancellationUpdate = async (payload) => {
    try {
      const { travelRequestData, cashAdvancesData } = payload;
  
      const updated = await Expense.updateOne(
        {
          'tenantId': payload.travelRequestData.tenantId,
          'travelRequestData.travelRequestId': payload.travelRequestData.travelRequestId,
        },
        {
          $set: {
            'travelRequestData': travelRequestData,
            'cashAdvancesData': cashAdvancesData
          }
        }
      );
  
      if (updated.nModified > 0) {
        return { success: true, message: 'Document updated successfully' };
      } else {
        return { success: false, message: 'No matching document found for update' };
      }
    } catch (error) {
      console.log('Error updating document:', error);
      return { success: false, message: 'Error updating document', error: error.message };
    }
  };





