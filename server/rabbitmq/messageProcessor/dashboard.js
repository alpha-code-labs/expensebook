import { Approval } from "../../models/approvalSchema.js";


export async function approveRejectRequests(payload) {
    try {
        const results = [];

        for (const request of payload) {
            const {
                travelRequestId,
                travelRequestStatus,
                rejectionReason,
                approvers,
                cashAdvances
            } = request;

            // Find the cash advance based on the travel request ID
            const cashAdvance = await Approval.findOne({ 'travelRequestData.travelRequestId': travelRequestId });
            if (!cashAdvance) {
                results.push({ travelRequestId, success: false, error: 'Travel Request not found' });
                continue;
            }

            // Update travel request details
            cashAdvance.travelRequestData.travelRequestStatus = travelRequestStatus;
            cashAdvance.travelRequestData.rejectionReason = rejectionReason;
            cashAdvance.travelRequestData.approvers = approvers;

            // Update itinerary items if pending approval
            Object.keys(cashAdvance.travelRequestData.itinerary).forEach(key => {
                cashAdvance.travelRequestData.itinerary[key].forEach(item => {
                    if (item.status === 'pending approval') {
                        item.status = travelRequestStatus;
                        item.approvers = approvers;
                    }
                });
            });

            // Update cash advances
            cashAdvances.forEach(ca => {
                cashAdvance.cashAdvancesData.forEach(existingCa => {
                    if (existingCa.cashAdvanceId === ca.cashAdvanceId) {
                        existingCa.cashAdvanceStatus = ca.cashAdvanceStatus;
                        existingCa.cashAdvanceRejectionReason = ca.cashAdvanceRejectionReason;
                        existingCa.approvers = ca.approvers;
                    }
                });
            });

            // Save the updates
            await cashAdvance.save();
            results.push({ travelRequestId, success: true, error: null });
        }

        return {success: true, error: null};
    } catch (e) {
        return { success: false, error: e };
    }
}

export const approveRejectTravelRequests = async(payload) => {
  try {
      const results = [];

      for (const request of payload) {
          const { travelRequestId, travelRequestStatus, rejectionReason, approvers } = request;
          
          const travelRequest = await Approval.findOne({ travelRequestId });
          if (!travelRequest) {
              results.push({ travelRequestId, success: false, error: 'Travel Request not found' });
              continue;
          }

          travelRequest.travelRequestData.travelRequestStatus = travelRequestStatus;
          travelRequest.travelRequestData.rejectionReason = rejectionReason ?? null;
          travelRequest.travelRequestData.approvers = approvers;

          Object.keys(travelRequest.travelRequestData.itinerary).forEach(key => {
              travelRequest.travelRequestData.itinerary[key].forEach(item => {
                  if (item.status === 'pending approval') {
                      item.status = travelRequestStatus;
                      item.approvers = approvers;
                  }
              });
          });

          const result = await travelRequest.save();
          results.push({ travelRequestId, success: true, error: null });
      }

      return {success:true, error:null};
  } catch (e) {
      return { success: false, error: e };
  }
}

export const nonTravelApproval = async (payload) => {
    try {
        console.log("nonTravelApproval ---payload",JSON.stringify(payload,'',2))
      const {
        tenantId,
        expenseHeaderId,
        reimbursementSchema,
        empId, 
      } = payload;
  
      // Update the reimbursement report
      const report = await Approval.findOneAndUpdate(
        {
          tenantId,
          expenseHeaderId,
          approvers: {
            $elemMatch: {
              empId: empId, 
            },
          },
        },
        { ...reimbursementSchema },
        { new: true } 
      );

      if (report) {
        console.log("report", JSON.stringify(report,'',2))
        return { success: true , error: null }; 
      } else {
        return { success: false, error: error.message};
      }
    } catch (error) {
      console.error('Error in nonTravelApproval:', error); 
      return { success: false, message: error.message }; 
    }
};
