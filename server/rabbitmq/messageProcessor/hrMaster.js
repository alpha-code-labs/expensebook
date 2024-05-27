import hrmaster from "../../models/hrCompanySchema.js";


export const updateHRMaster = async (payload) => {
      try {
        console.log("hr data", payload)
      const updated = await hrmaster.findOneAndUpdate(
        { 'tenantId': payload.tenantId},
        {
         ...payload,
        },
        { upsert: true, new: true }
      );
      console.log('Saved to dashboard: successfully', updated);
      return { success: true, error: null}
    } catch (error) {
      console.error('Failed to update dashboard: using synchronous queue', error);
      return { success: false, error: error}
    }
}





