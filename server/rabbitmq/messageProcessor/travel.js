import reporting from "../../models/reportingSchema.js";



export const fullUpdateTravel = async (payload) => {
  console.log("trying to update travel", payload);
  const { tenantId, travelRequestId } = payload;

  // Check if the tenantId is present
  if (!tenantId) {
    console.error('TenantId is missing');
    return { success: false, error: 'TenantId is missing' };
  }

  try {
    const updated = await reporting.findOneAndUpdate(
      { 
        "tenantId": tenantId,
        travelRequestId,
      },
      {
        "tenantId": tenantId,
        "travelRequestId": travelRequestId, 
        "travelRequestData": payload,
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


export const fullUpdateTravelBatchJob = async (payloadArray) => {
  try {
    console.log("batchjob travel", payloadArray)
    const updatePromises = payloadArray.map(async (payload) => {
      const { tenantId, travelRequestId } = payload;

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
          "travelRequestData": payload,
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


