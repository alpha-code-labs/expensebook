import dashboard from "../../models/dashboardSchema.js";
import { earliestDate } from "../../utils/date.js";

const updateCashToDashboardSync = async (message,correlationId) => {
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
      // console.log('Saved to dashboard: using synchrnous queue', updated);
  
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

const fullUpdateCash = async (payload) => {
  // console.log('full update cashAdvanceSchema', payload)
  const{ travelRequestData, cashAdvancesData} = payload
  const { tenantId, travelRequestId,itinerary } = travelRequestData;
  const tripStartDate = await earliestDate(itinerary)

// console.log("fullUpdateCash --tenantId,travelRequestId", tenantId, travelRequestId)
  // Check if the tenantId is present
  if (!tenantId) {
    console.error('TenantId is missing');
    return { success: false, error: 'TenantId is missing' };
  }

  try {
    const updated = await dashboard.updateOne(
      { 
        tenantId,
        travelRequestId,
      },
      {
        "travelRequestSchema": travelRequestData,
        "travelStartDate":tripStartDate,
        "cashAdvanceSchema.travelRequestData": travelRequestData,
        "cashAdvanceSchema.cashAdvancesData": cashAdvancesData,
      },
      { upsert: true, new: true }
    );
    // console.log('Saved to dashboard: Full Update cash---', updated);
    return { success: true, error: null };
  } catch (error) {
    console.error('Failed to update dashboard: using rabbitmq m2m', error);
    return { success: false, error: error };
  }
}

const fullUpdateCashBatchJob = async (payloadArray) => {
  try {
    const updatePromises = payloadArray.map(async (payload) => {
      const { travelRequestData, cashAdvancesData } = payload;
      const { tenantId, travelRequestId, itinerary } = travelRequestData;
      const tripStartDate = await earliestDate(itinerary)

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
          "travelStartDate": tripStartDate,
          "cashAdvanceSchema.travelRequestData": travelRequestData,
          "cashAdvanceSchema.cashAdvancesData": cashAdvancesData,
        },
        { upsert: true, new: true }
      );

      if (updated.matchedCount > 0 || updated.upsertedCount > 0) {
        console.log("Saved to dashboard: using async queue", updated); 
        return { success: true, error: null }; 
      } else {
      console.log("Failed to save reimbursement expense in dashboard."); 
      return { success: false, error: "Failed to save reimbursement expense in dashboard." };
      }
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


const cashStatusUpdatePaid = async (payloadArray) => {
  try {
    // Initialize an array to keep track of results
    const results = [];

    // Iterate over each object in the payload array
    for (const payload of payloadArray) {
      const { travelRequestData, cashAdvancesData } = payload;
      const { travelRequestId } = travelRequestData;

      // Initialize update object
      const update = {
        'cashAdvancesData': cashAdvancesData,
      };

      // Check if the status is 'booked'
      const isBooked = travelRequestData?.travelRequestStatus === 'booked';

      if (isBooked) {
        update['tripSchema.cashAdvancesData'] = cashAdvancesData;
      }

      // Perform the update operation
      const updateCashStatus = await dashboard.findOneAndUpdate(
        { 'travelRequestData.travelRequestId': travelRequestId },
        { $set: update },
        { new: true }
      );

      // Check if update was successful
      if (!updateCashStatus) {
        console.log(`Failed to update cash status for ${travelRequestId}`);
        results.push({
          travelRequestId,
          success: false,
          message: 'Failed to update cash status'
        });
      } else {
        console.log(`Successfully updated cash status for ${travelRequestId}`);
        results.push({
          travelRequestId,
          success: true,
          message: 'Cash status updated successfully'
        });
      }
    }

    // Log the results of the batch update
    console.log("Update results:", JSON.stringify(results, '', 2));

    return { success: true, error: null, results };

  } catch (error) {
    console.log("Error occurred:", error);
    return { success: false, error: error.message, results };
  }
};


const onceCash = async (payload) => {
  // console.log('full update cashAdvanceSchema', payload)
  const{ travelRequestData, cashAdvancesData} = payload
  const { tenantId, travelRequestId } = travelRequestData;
// console.log("fullUpdateCash --tenantId,travelRequestId", tenantId, travelRequestId)
  // Check if the tenantId is present
  if (!tenantId) {
    console.error('TenantId is missing');
    return { success: false, error: 'TenantId is missing' };
  }

  try {
    const updated = await dashboard.updateOne(
      { 
        tenantId,
        travelRequestId,
      },
      {
        "tripSchema.travelRequestData": travelRequestData,
        "cashAdvanceSchema.travelRequestData": travelRequestData,
        "cashAdvanceSchema.cashAdvancesData": cashAdvancesData,
      },
      { upsert: true, new: true }
    );

    if (updated.matchedCount > 0 || updated.upsertedCount > 0) {
      console.log("Saved to dashboard: using async queue", updated); 
      return { success: true, error: null }; 
    } else { 
      console.log("Failed to save reimbursement expense in dashboard."); 
      return { success: false, error: "Failed to save reimbursement expense in dashboard." 
      };
    }
  } catch (error) {
    console.error('Failed to update dashboard: using rabbitmq m2m', error);
    return { success: false, error: error };
  }
}

export {
  updateCashToDashboardSync,
  fullUpdateCash,
  fullUpdateCashBatchJob,
  cashStatusUpdatePaid,
  onceCash,
  

}