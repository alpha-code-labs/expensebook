import reporting from "../../models/reportingSchema.js";

export const updateCashToReportingSync = async (message,correlationId) => {
    const failedUpdates = [];
    const successMessage = {
      message: 'Successfully updated reporting database',
      correlationId: correlationId,
    };
    for (const cashApprovalDoc of message.cashApprovalDoc) {
      const {
       cashAdvanceId
      } = cashApprovalDoc;

      try {
      const updated = await reporting.findOneAndUpdate(
        { 'cashAdvancesData.cashAdvanceId': cashAdvanceId },
        {
          $set: {
            'cashAdvancesData':cashApprovalDoc,
            'cashAdvancesData.sendForNotification ': false,  // always set 'sendForNotification' it as false when reporting is updated 
          },
        },
        { upsert: true, new: true }
      );
      console.log('Saved to reporting: using synchronous queue', updated);
  
    } catch (error) {
      console.error('Failed to update reporting: using synchronous queue', error);
  
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
      console.log(' reporting update failed and is sent to rabbitmq sent as confirmation,using synchrnous queue:', failedUpdates,correlationId);
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
    const updated = await reporting.updateOne(
      { 
        tenantId,
        travelRequestId,
      },
      {
        "travelRequestData": travelRequestData,
        "cashAdvancesData": cashAdvancesData,
      },
      { upsert: true, new: true }
    );
    console.log('Saved to reporting: Full Update cash---', updated);
    return { success: true, error: null };
  } catch (error) {
    console.error('Failed to update reporting: using rabbitmq m2m', error);
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

      const updated = await reporting.updateOne(
        { 
          "tenantId": tenantId,
          "travelRequestId": travelRequestId,
        },
        {
          "travelRequestData": travelRequestData,
          "cashAdvancesData": cashAdvancesData,
        },
        { upsert: true, new: true }
      );
      console.log('Saved to reporting: using async queue', updated);
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
    console.error('Failed to update reporting: using rabbitmq m2m', error);
    return { success: false, error: error };
  }
}


export const cashStatusUpdatePaid = async (payloadArray) => {
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

      // Perform the update operation
      const updateCashStatus = await reporting.findOneAndUpdate(
        { 'travelRequestId': travelRequestId },
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



export const onceCash = async (payload) => {
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
    const updated = await reporting.updateOne(
      { 
        tenantId,
        travelRequestId,
      },
      {
        "travelRequestData": travelRequestData,
        "cashAdvancesData": cashAdvancesData,
      },
      { upsert: true, new: true }
    );
    console.log('Saved to reporting: Full Update cash---', updated);
    return { success: true, error: null };
  } catch (error) {
    console.error('Failed to update reporting: using rabbit mq m2m', error);
    return { success: false, error: error };
  }
}

// cash status- cancel cash
export const updateCashStatus = async (payload) => {
  try {
    const updated = await reporting.findOneAndUpdate(
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


