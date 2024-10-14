import dashboard from "../../models/dashboardSchema.js";


const processTravelExpense = async (message,correlationId) => {
    const failedUpdates = [];
    const successMessage = {
      message: 'Successfully updated dashboard database-travel expense data',
      correlationId: correlationId,
    };
    for (const payload of message.payload) {
      const {
       tripId
      } = payload;

      try {
      const updated = await dashboard.findOneAndUpdate(
        { 'travelExpenseData.tripId': tripId },
        {
          $set: {
            'travelExpenseData':payload,
            'travelExpenseData.sendForNotification ': false,  // always set 'sendForNotification' it as false when dashboard is updated 
          },
        },
        { upsert: true, new: true }
      );
      console.log('Saved to dashboard: using synchronous queue', updated);
  
    } catch (error) {
      console.error('Failed to update dashboard: using synchronous queue', error);
  
      // Collect failed updates
      failedUpdates.push(trip);
    }
  }
  
   // Send success message if updates were successful
   if (failedUpdates.length === 0) {
    try {
      // Send the success message and correlationId to another service or queue for further processing
      await sendSuccessConfirmationToTripMicroservice(successMessage, correlationId);
      console.log('Success confirmation sent, using synchrnous queue:', successMessage);
    } catch (error) {
      console.error('Failed to send success confirmation,using synchrnous queue:', error);
      // Handle error while sending confirmation
    }
  }
  
  // Send failed updates as confirmation message
  if (failedUpdates.length > 0) {
    try {
      // Send the failed updates to another service or queue for further processing
      await sendFailedConfirmationToTripMicroservice(failedUpdates,correlationId );
      console.log(' dashboard update failed and is sent to rabbitmq sent as confirmation,using synchrnous queue:', failedUpdates,correlationId);
    } catch (error) {
      console.error('Failed to send failed updates confirmation,using synchrnous queue:', error);
    }
  }
}

const fullUpdateExpense = async (payload) => {
  const {getExpenseReport} = payload
  const { 
    tenantId,
    tripId,
    travelRequestData,
  } = getExpenseReport;
  
    const {travelRequestId} = travelRequestData
    console.log("payload for travelExpenseData", payload )


    try {
    const updated = await dashboard.findOneAndUpdate(
      { tenantId,'tripSchema.tenantId': tenantId , 'tripSchema.travelRequestData.travelRequestId':travelRequestId, 'tripSchema.tripId': tripId },
      {
       $set:{tripSchema :getExpenseReport}
      },
      { upsert: true, new: true }
    );
    console.log('Saved to dashboard: TravelExpenseData updated successfully', updated);
    return { success: true, error: null}
  } catch (error) {
    console.error('Failed to update dashboard: TravelExpenseData updation failed', error);
    return { success: false, error: error}
  }
}

export{
  processTravelExpense,
  fullUpdateExpense
}


