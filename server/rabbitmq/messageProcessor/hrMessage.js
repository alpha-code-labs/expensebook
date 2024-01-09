import HRCompany from "../../models/hrCompanySchema.js";

export const updateHRMaster = async (payload) => {
      try {
      const updated = await HRCompany.findOneAndUpdate(
        { 'tenantId': payload.tenantId},
        {
         payload,
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

