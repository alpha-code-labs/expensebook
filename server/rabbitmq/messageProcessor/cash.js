import dashboard from "../../models/dashboardSchema.js";

export const updateCashToDashboardSync = async (message,correlationId) => {
    const failedUpdates = [];
    const successMessage = {
      message: 'Successfully updated dashboard database',
      correlationId: correlationId,
    };
    for (const cashApprovalDoc of message.cashApprovalDoc) {
      const {
       cashAdvanceId
      } = cashApprovalDoc;

      try {
      const updated = await dashboard.findOneAndUpdate(
        { 'cashAdvanceSchema.cashAdvanceId': cashAdvanceId },
        {
          $set: {
            'cashAdvanceSchema':cashApprovalDoc,
            'cashAdvanceSchema.sendForNotification ': false,  // always set 'sendForNotification' it as false when dashboard is updated 
          },
        },
        { upsert: true, new: true }
      );
      console.log('Saved to dashboard: using synchrnous queue', updated);
  
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

export const fullUpdateCash = async (payload) => {
  console.log('full update cashAdvanceSchema', payload)
  const{ travelRequestData, cashAdvancesData} = payload
  const { tenantId, travelRequestId } = travelRequestData;
console.log("fullUpdateCash --tenantId,travelRequestId", tenantId, travelRequestId)
  // Check if the tenantId is present
  if (!tenantId) {
    console.error('TenantId is missing');
    return { success: false, error: 'TenantId is missing' };
  }

  try {
    const updated = await dashboard.updateOne(
      { 
        "tenantId": tenantId,
        "travelRequestId": travelRequestId,
      },
      {
        "travelRequestSchema": travelRequestData,
        "cashAdvanceSchema.travelRequestData": travelRequestData,
        "cashAdvanceSchema.cashAdvancesData": cashAdvancesData,
      },
      { upsert: true, new: true }
    );
    console.log('Saved to dashboard: using async queue', updated);
    return { success: true, error: null };
  } catch (error) {
    console.error('Failed to update dashboard: using rabbitmq m2m', error);
    return { success: false, error: error };
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

      const updated = await dashboard.updateOne(
        { 
          "tenantId": tenantId,
          "travelRequestId": travelRequestId,
        },
        {
          "travelRequestSchema": travelRequestData,
          "cashAdvanceSchema.travelRequestData": travelRequestData,
          "cashAdvanceSchema.cashAdvancesData": cashAdvancesData,
        },
        { upsert: true, new: true }
      );
      console.log('Saved to dashboard: using async queue', updated);
      return { success: true, error: null };
    });

    // Wait for all updates to complete
    const results = await Promise.all(updatePromises);
    const isSuccess = results.every(result => result.success);
    if(isSuccess){
      return { success: true, error: null}
    } else {
      return {success: true, error: null}}
  } catch (error) {
    console.error('Failed to update dashboard: using rabbitmq m2m', error);
    return { success: false, error: error };
  }
}







