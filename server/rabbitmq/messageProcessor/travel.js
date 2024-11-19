import dashboard from "../../models/dashboardSchema.js";
import { earliestDate } from "../../utils/date.js";


const fullUpdateTravel = async (payload) => {
  console.log("trying to update travel", payload);
  const { tenantId, travelRequestId, itinerary } = payload;
  const tripStartDate = await earliestDate(itinerary)

  // Check if the tenantId is present
  if (!tenantId) {
    console.error('TenantId is missing');
    return { success: false, error: 'TenantId is missing' };
  }

  try {
    const updated = await dashboard.findOneAndUpdate(
      { 
        "tenantId": tenantId,
        "travelRequestSchema.tenantId": tenantId, 
        "travelRequestSchema.travelRequestId": travelRequestId,
      },
      {
        "tenantId": tenantId,
        "travelStartDate":tripStartDate,
        "travelRequestId": travelRequestId, 
        "travelRequestSchema": payload,
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


const fullUpdateTravelBatchJob = async (payloadArray) => {
  try {
    console.log("batchjob travel", payloadArray)
    const updatePromises = payloadArray.map(async (payload) => {
      const { tenantId, travelRequestId, itinerary } = payload;
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
          "travelRequestSchema": payload,
          "travelStartDate": tripStartDate
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

export{
  fullUpdateTravelBatchJob,
  fullUpdateTravel
}
