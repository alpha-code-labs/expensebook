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
      console.log("nonTravelApproval ---payload", JSON.stringify(payload, null, 2));
  
      const { tenantId, expenseHeaderId, reimbursementSchema, empId } = payload;
  
      // Update the reimbursement report
      const report = await Approval.findOneAndUpdate(
        {
          tenantId,
          expenseHeaderId,
          approvers: {
            $elemMatch: { empId: empId },
          },
        },
        { ...reimbursementSchema },
        { new: true }
      );
  
      if (report) {
        console.log("Updated report:", JSON.stringify(report, null, 2));
        return { success: true, error: null };
      } else {
        throw new Error('Non-travel expense report not found');
      }
    } catch (error) {
      console.error('Error in nonTravelApproval:', error.message);
      return { success: false, error: error.message };
    }
};


export async function approveRejectCashRaisedLater(payload) {
    try {
        const results = [];
        console.log("payload",payload)

        for (const request of payload) {
            const {
                travelRequestId,
                cashAdvances
            } = request;

            // Find the cash advance based on the travel request ID
            const cashAdvance = await Approval.findOne({ 'travelRequestData.travelRequestId': travelRequestId });
            if (!cashAdvance) {
                results.push({ travelRequestId, success: false, error: 'Travel Request not found' });
                continue;
            }

            // Update cash advances
            cashAdvances.forEach(ca => {
                cashAdvance.cashAdvancesData.forEach(existingCa => {
                    if (existingCa.cashAdvanceId.toString() === ca.cashAdvanceId) {
                        existingCa.cashAdvanceStatus = ca.cashAdvanceStatus;
                        existingCa.cashAdvanceRejectionReason = ca.cashAdvanceRejectionReason;
                        existingCa.approvers = ca.approvers;
                    }
                });
            });

            // Save the updates
            await cashAdvance.save();
            console.log("cashAdvance",cashAdvance)
            results.push({ travelRequestId, success: true, error: null });
        }

        return {success: true, error: null};
    } catch (e) {
        return { success: false, error: e };
    }
}

//Travel Expense Report Approval
export function updateExpenseLineStatus(expenseLines, approve = [], reject = [], empId) {

    return expenseLines.map(expenseLine => {
      const expenseLineIdStr = ( expenseLine.expenseLineId ?? expenseLine.lineItemId)?.toString()
  
      if (expenseLineIdStr === undefined) {
        throw new Error("Both expenseLineId and lineItemId are undefined or null while updating -updateExpenseLineStatus");
      }
  
      if (approve.includes(expenseLineIdStr)) {
        expenseLine.approvers.forEach(approver => {
          if (approver.empId === empId && approver.status === 'pending approval') {
            console.log(`Approver ${approver.empId} status changing from pending approval to approved`);
            approver.status = 'approved';
          }
        });
  
        const isAllApproved = expenseLine.approvers.every(approver => approver.status === 'approved');
        const lineItemStatus = isAllApproved ? 'approved' : 'pending approval';
  
        return { ...expenseLine, lineItemStatus };
      } else if (reject.includes(expenseLineIdStr)) {
        expenseLine.approvers.forEach(approver => {
          if (approver.empId === empId && approver.status === 'pending approval') {
            console.log(`Approver ${approver.empId} status changing from pending approval to rejected`);
            approver.status = 'rejected';
          }
        });
        const isRejected = expenseLine.approvers.some(approver => approver.status === 'rejected');
        const lineItemStatus = isRejected ? 'rejected' : 'pending approval';
        return { ...expenseLine, lineItemStatus };
      }
      return expenseLine;
    });
}

async function getExpenseReport(tenantId,empId,tripId,expenseHeaderId){
    try{
      const expenseReport = await Approval.findOne({
        tenantId,
        tripId,
        'travelExpenseData':{
         $elemMatch:{
           'expenseHeaderId':expenseHeaderId,
           'approvers':{
             $elemMatch:{
               'empId':empId,
             }
           }
         }
        },
     }).exec();
  
     if(!expenseReport){
       throw new Error('expense Report not Found')
     } 
  
     return expenseReport
    } catch (error){
      throw new Error( error)
    }
}


export const expenseReportApproval = async (payload) => {
    const { tenantId,tripId, expenseHeaderId, approve, empId,
        reject,  rejectionReason,} = payload;

    console.log("Payload for travelExpenseData - expense report approval", payload);

    try {
        const approvalDocument = await getExpenseReport(tenantId,empId,tripId,expenseHeaderId)

        if(approvalDocument){
            const { travelExpenseData} = approvalDocument
            const expenseReportFound = travelExpenseData.find(expense => expense.expenseHeaderId.toString() == expenseHeaderId);
       
           //  console.log("valid expenseReport", expenseReportFound);
            if (expenseReportFound) {
            const {expenseLines = []} =expenseReportFound
       
             const updatedExpenseLines = updateExpenseLineStatus(expenseLines, approve, reject,empId)
       
             // console.log("updatedExpenseLines", JSON.stringify(updatedExpenseLines,'',2))
             expenseReportFound.expenseLines = updatedExpenseLines
             const isPendingApproval = expenseReportFound.expenseHeaderStatus === 'pending approval'
       
             // console.log("isPendingApproval", isPendingApproval)
              const approver = expenseReportFound.approvers.find(approver =>
               approver.empId === empId && approver.status === 'pending approval'
              )
       
             //  console.log("approver", isPendingApproval)
       
              const isAllApproved = expenseReportFound.expenseLines.every(line => line.lineItemStatus === 'approved')
              const isRejected = expenseReportFound.expenseLines.some(line => line.lineItemStatus === 'rejected')
       
             //  console.log("isAllApproved, isRejected", isAllApproved, isRejected)
       
              if(approver && isAllApproved && isPendingApproval ){
               approver.status = 'approved'
               expenseReportFound.expenseHeaderStatus = 'pending settlement'
              } else if(approver && isPendingApproval && isRejected ){
               approver.status = 'rejected'
               expenseReportFound.expenseHeaderStatus = 'rejected';
               expenseReportFound.rejectionReason = rejectionReason
              }
              // Save the updated approvalDocument document
              const expenseApproved = await approvalDocument.save();

            console.log('Saved to Expense: TravelExpenseData updated successfully');
            return { success: true, error: null };
        }
 
    }} catch (error) {
        console.error('Failed to update Expense: TravelExpenseData update failed', error);
        return { success: false, error: error };
    }
};