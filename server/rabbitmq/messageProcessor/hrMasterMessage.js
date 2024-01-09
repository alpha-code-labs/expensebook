import HRMaster from "../../models/hrMasterSchema.js";

export const updateHRMaster = async (payload) => {
      try {
      const updated = await HRMaster.findOneAndUpdate(
        { 'tenantId': payload.tenantId},
        {
         payload,
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


