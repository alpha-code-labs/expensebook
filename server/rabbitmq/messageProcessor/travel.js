import dashboard from "../../models/dashboardSchema.js";

export const fullUpdateTravel = async (payload) => {
    const { tenantId, travelRequestId } = payload;
      try {
      const updated = await dashboard.findOneAndUpdate(
        { "travelRequestSchema.tenantId": tenantId, 
         "travelRequestSchema.travelRequestId": travelRequestId,
        },
        {
         "travelRequestSchema": payload,
        },
        { upsert: true, new: true }
      );
      console.log('Saved to dashboard: using async queue', updated);
      return { success: true, error: null}
    } catch (error) {
      console.error('Failed to update dashboard: using synchronous queue', error);
      return { success: false, error: error}
    }
}


