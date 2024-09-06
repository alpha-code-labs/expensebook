import { updateExpenseLineStatus } from "../../controllers/travelExpenseApproval.js";
import { Approval } from "../../models/approvalSchema.js";

// 1- Update Reimbursement
export const updateReimbursement = async (payload) => {
    try {
        console.log("update updateReimbursement", payload)
        const { reimbursementReport } = payload;
        const { tenantId,expenseHeaderId, createdBy } = reimbursementReport;
        const { empId } = createdBy;
        console.log("updateReimbursement ....", payload);

        const reimbursement = await Approval.findOneAndUpdate(
            { tenantId,
            'reimbursementSchema.tenantId': tenantId,
            'reimbursementSchema.createdBy.empId': empId , 
            'reimbursementSchema.expenseHeaderId': expenseHeaderId
           },
            { $set: { reimbursementSchema: reimbursementReport } },
            { upsert: true, new: true }
        );

        console.log("Reimbursement update result:", reimbursement);

        if (reimbursement) {
            console.log("Success: Reimbursement updated successfully.");
            return { success: true, error: null };
        } else {
            console.log("Failed: Unable to save reimbursement expense in dashboard.");
            return { success: false, error: "Failed to save reimbursement expense in dashboard." };
        }
    } catch (error) {
        console.error('Failed to update dashboard: using synchronous queue', error);
        return { success: false, error: error.message };
    }
};

async function getNonTravelExpenseReport(tenantId, empId, expenseHeaderId) {
    try {
      const report = await Approval.findOne({
        tenantId,
        'reimbursementSchema.expenseHeaderId':expenseHeaderId,
        'reimbursementSchema.approvers': {
              $elemMatch: {
                'empId': empId,
                status:'pending approval'
              }
            }
      });
  
      if (report) {
        console.log("Retrieved report:", report);
        return report;
      } else {
        throw new Error("Report not found for the specified criteria."); 
      }
    } catch (error) {
      console.error("Error occurred while fetching the report:", error); 
      throw new Error(`Failed to retrieve the non-travel expense report: ${error.message}`); 
    }
}

//2-Non travel Expense report approval/rejection
export const nonTravelReportApproval = async (payload) => {
    try {
       const { tenantId, expenseHeaderId, empId, approve, reject, rejectionReason } = payload;
  
       const approvalDocument = await getNonTravelExpenseReport(tenantId,empId,expenseHeaderId)
   
       console.log("approvalDocument",approvalDocument)
       if (!approvalDocument) {
        throw new Error('No matching approval document found for updating expenses status.');
       }
  
        const { reimbursementSchema} = approvalDocument
        const { createdBy:{name = ''} = {}} = reimbursementSchema
   
        const {expenseLines = []} =reimbursementSchema
  
      //  console.log("valid expenseReport", expenseReportFound);
  
        const updatedExpenseLines = updateExpenseLineStatus(expenseLines, approve, reject,empId)
  
        // console.log("updatedExpenseLines", JSON.stringify(updatedExpenseLines,'',2))
        reimbursementSchema.expenseLines = updatedExpenseLines
        const isPendingApproval = reimbursementSchema.expenseHeaderStatus === 'pending approval'
  
        // console.log("isPendingApproval", isPendingApproval)
         const approver = reimbursementSchema.approvers.find(approver =>
          approver.empId === empId && approver.status === 'pending approval'
         )
  
        //  console.log("approver", isPendingApproval)
  
         const isAllApproved = reimbursementSchema.expenseLines.every(line => line.lineItemStatus === 'approved')
         const isRejected = reimbursementSchema.expenseLines.some(line => line.lineItemStatus === 'rejected')
  
        //  console.log("isAllApproved, isRejected", isAllApproved, isRejected)
  
         if(approver && isAllApproved && isPendingApproval ){
          approver.status = 'approved'
          reimbursementSchema.expenseHeaderStatus = 'pending settlement'
         } else if(approver && isPendingApproval && isRejected ){
          approver.status = 'rejected'
          reimbursementSchema.expenseHeaderStatus = 'rejected';
          reimbursementSchema.rejectionReason = rejectionReason
         }
  
         // Save the updated approvalDocument document
         const expenseApproved = await approvalDocument.save();
  
         if(!expenseApproved){
           return res.status(404).json({message:`error occurred while updating expense report `})
         }
  
         return { success: true, error: null };
  
    } catch (error) {
        console.error('Failed to update Expense: TravelExpenseData update failed', error);
        return { success: false, error: error };
    }
};

export const deleteReimbursement = async (payload) => {
    try {
        console.log("delete", payload)
        // const { reimbursementReport } = payload;
        const { tenantId,empId, expenseHeaderId } = payload;

        console.log("deleteReimbursement....", payload);
    const deleteReimbursementReport = await Approval.findOneAndDelete({ 
        'reimbursementSchema.tenantId': tenantId, 
        'reimbursementSchema.createdBy.empId': empId, 
        'reimbursementSchema.expenseHeaderId': expenseHeaderId
     })

        if(!deleteReimbursementReport){
            return {success: false, error: "Failed to delete reimbursement expense in dashboard."}
        } else{
            return {success: true, message: "Successfully deleted"}
        }
} catch (error){
    return {success: false, error: error}
}
}


