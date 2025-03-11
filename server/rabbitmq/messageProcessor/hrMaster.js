import HRMaster from "../../models/hrMasterSchema.js";

const updateHRMaster = async (payload) => {
      try {
        console.log("hr data", payload)
      const updated = await HRMaster.findOneAndUpdate(
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

export {
  updateHRMaster
}