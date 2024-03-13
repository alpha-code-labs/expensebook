import Trip from "../../models/tripSchema.js";


export const fullUpdateExpense = async (payload) => {
    console.log("travel expense report submitted", payload)
    const { getExpenseReport: { tenantId, tripId, travelRequestData, expenseAmountStatus, travelExpenseData } } = payload;
    const {travelRequestId} = travelRequestData
   
    try {
       const updated = await Trip.findOneAndUpdate(
         { tenantId, tripId, 'travelRequestData.travelRequestId': travelRequestId },
         { $set: {travelRequestData, expenseAmountStatus,travelExpenseData } },
         { upsert: true, new: true }
       );
   
       console.log('Saved to Trip: TravelExpenseData updated successfully', updated);
       return { success: true, error: null };
    } catch (error) {
       console.error('Failed to update Trip: TravelExpenseData updation failed', error);
       return { success: false, error };
    }
   };


   export const fullUpdateExpenseold = async (payload) => {
    console.log("travel expense report submitted", payload)
    const { _doc: { tenantId, tripId, travelRequestData, expenseAmountStatus, travelExpenseData } } = payload;
    const {travelRequestId} = travelRequestData
   
    try {
       const updated = await Trip.findOneAndUpdate(
         { tenantId, tripId, 'travelRequestData.travelRequestId': travelRequestId },
         { $set: {travelRequestData, expenseAmountStatus,travelExpenseData } },
         { upsert: true, new: true }
       );
   
       console.log('Saved to Trip: TravelExpenseData updated successfully', updated);
       return { success: true, error: null };
    } catch (error) {
       console.error('Failed to update Trip: TravelExpenseData updation failed', error);
       return { success: false, error };
    }
   };
   