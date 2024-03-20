import Trip from "../../models/tripSchema.js";


export const fullUpdateExpense = async (payload) => {
   console.log("Travel expense report submitted", payload);

   try {
       const { getExpenseReport: { tenantId, tripId, travelRequestData, expenseAmountStatus, travelExpenseData } } = payload;
       const { travelRequestId } = travelRequestData;

       // Attempt to update the document
       const updatedTrip = await Trip.findOneAndUpdate(
           { tripId },
           { $set: { tenantId, travelRequestData, expenseAmountStatus, travelExpenseData } },
           { upsert: true, new: true }
       );

       if (updatedTrip) {
           // Document was updated
           console.log('Trip updated successfully', updatedTrip);
           return { success: true, error: null };
       } else {
           // Document was not updated (possibly because it didn't exist)
           console.log('New Trip created successfully');
           return { success: true, error: null };
       }
   } catch (error) {
       console.error('Failed to update/create Trip: ', error);
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
}};



   