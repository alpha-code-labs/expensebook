import { Approval } from "../../models/approvalSchema.js";

export const extractApproval = async (tenantId, travelRequestId) => {
    // const { tenantId, travelRequestId } = payload;
      try {
      const updated = await Approval.findOne(
        {
          "travelRequestData.tenantId": tenantId,
          "travelRequestData.travelRequestId": travelRequestId,
        });
      console.log(' extarct from approval ', updated);
      return { success: true, error: null}
    } catch (error) {
      console.error('Failed t0 extarct from approval ', error);
      return { success: false, error: error}
    }
}
