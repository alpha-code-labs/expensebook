import HRMaster from "../../models/hrCompanySchema.js";

export const updateHRMaster = async (payload) => {
  console.log("hr master ...............", payload)
      try {
      const updated = await HRMaster.findOneAndReplace(
        { 'tenantId': payload.tenantId},
        {
        ...payload,
        },
        { upsert: true, new: true }
      );
      console.log('Saved to HrMaster: using async queue', updated);
      return { success: true, error: null}
    } catch (error) {
      console.error('Failed to update HrMaster: using synchronous queue', error);
      return { success: false, error: error}
    }
}

