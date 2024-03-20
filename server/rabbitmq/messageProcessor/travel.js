import dashboard from "../../models/dashboardSchema.js";

// export const fullUpdateTravel = async (payload) => {
//   console.log("trying to update travel", payload)
//     const { tenantId, travelRequestId } = payload;
//     console.log("...............................",tenantId, travelRequestId  )
//       try {
//       const updated = await dashboard.findOneAndUpdate(
//         { tenantId,
//           travelRequestId,
//         },
//         {
//          "tenantId": tenantId,
//          "travelRequestSchema": payload,
//         },
//         { upsert: true, new: true }
//       );
//       console.log('Saved to dashboard: using async queue', updated);
//       return { success: true, error: null}
//     } catch (error) {
//       console.error('Failed to update dashboard: using rabbitmq m2m', error);
//       return { success: false, error: error}
//     }
// }



export const fullUpdateTravel = async (payload) => {
  console.log("trying to update travel", payload);
  const { tenantId, travelRequestId } = payload;

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



