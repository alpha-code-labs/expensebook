import { getExpenseReport, updateExpenseLineStatus } from "../../controllers/approval.js";
import dashboard from "../../models/dashboardSchema.js";


const travelStandAloneApproval = async(payload) =>{
   try{
    const {tenantId, travelRequestId, approvers,travelRequestStatus, rejectionReason} = payload || {};

    // console.log("Payload for travelStandAloneApproval", payload);
    const travelStandAlone = await dashboard.updateOne({
        tenantId,
        travelRequestId},
        {
         $set:{
            'travelRequestSchema.travelRequestStatus': travelRequestStatus,
             'travelRequestSchema.approvers': approvers,
             'travelRequestSchema.rejectionReason': rejectionReason,
            }
        }, 
    )

    //  console.log("update on travel request", travelStandAlone)
    if(travelStandAlone.modifiedCount == 0){
        return {success: false, message:"failed to update travel "}
    }else{
    //    console.log("Updated tr...",travelStandAlone)
        return {success: true, message:"travel Approval was updated successfully"}
    }
} catch (error){
    return {success: false, message:"failed to update travel ", error}
}
}

const travelWithCashTravelApproval = async(payload) =>{
    try{
     const {tenantId, travelRequestId, approvers,travelRequestStatus, rejectionReason} = payload || {};
 
     console.log("Payload for travelWithCash   Travel  approval", payload);
     const travelWithCashTravel = await dashboard.updateOne({
         tenantId,
         travelRequestId},
         {
          $set:{
             'cashAdvanceSchema.travelRequestData.travelRequestStatus': travelRequestStatus,
              'cashAdvanceSchema.travelRequestData.approvers': approvers,
              'cashAdvanceSchema.travelRequestData.rejectionReason': rejectionReason,
             }
         }, 
     )
      console.log("after db update ", travelWithCashTravel)
     if(travelWithCashTravel.modifiedCount == 0){
         return {success: false, message:"failed to update travel "}
     }else{
        console.log("Updated travelWithCashTravel...",travelWithCashTravel)
         return {success: true, message:"travelWithCash Travel Approval was updated successfully"}
     }
 } catch (error){
     return {success: false, message:"failed to update travelWithCashTravel ", error}
 }
}

const travelWithCashApproval = async(payload) =>{
    try{
     const {tenantId, travelRequestId, cashAdvanceId, approvers,cashAdvanceStatus, rejectionReason} = payload || {};
 
     console.log("Payload for travelwithcash approval", payload);
     const travelStandAlone = await dashboard.updateOne({
         tenantId,
         travelRequestId,
         'cashAdvanceSchema.cashAdvancesData':{
             $elemMatch:{cashAdvanceId}}
        },
         {
          $set:{
              'cashAdvanceSchema.cashAdvancesData.$.cashAdvanceStatus': cashAdvanceStatus,
              'cashAdvanceSchema.cashAdvancesData.$.approvers': approvers,
              'cashAdvanceSchema.cashAdvancesData.$.rejectionReason': rejectionReason,
             }
         }, 
     )
      console.log("update on travel request", travelStandAlone)
     if(travelStandAlone.modifiedCount == 0){
         return {success: false, message:"failed to update travel "}
     }else{
        console.log("Updated tr...",travelStandAlone)
         return {success: true, message:"travel Approval was updated successfully"}
     }
 } catch (error){
     return {success: false, message:"failed to update travel ", error}
 }
}

//Approve or reject travel expense report at header level or line item level
const expenseReportApproval = async (payload) => {
    try {
      const { tenantId,tripId, expenseHeaderId, empId ,approve, reject, rejectionReason} = payload
      const approvalDocument = await getExpenseReport(tenantId,empId,tripId,expenseHeaderId)
  
       if (!approvalDocument) {
         throw new Error('No matching approval document found for updating travel expenses status.');
       }
       const { travelExpenseData} = approvalDocument.tripSchema
       const expenseReportFound = travelExpenseData.find(expense => expense.expenseHeaderId.toString() == expenseHeaderId);

       if (expenseReportFound) {
       const {expenseLines = []} =expenseReportFound
  
        const updatedExpenseLines = updateExpenseLineStatus(expenseLines, approve, reject,empId)

        expenseReportFound.expenseLines = updatedExpenseLines
        const isPendingApproval = expenseReportFound.expenseHeaderStatus === 'pending approval'

         const approver = expenseReportFound.approvers.find(approver =>
          approver.empId === empId && approver.status === 'pending approval'
         )
  
         const isAllApproved = expenseReportFound.expenseLines.every(line => line.lineItemStatus === 'approved')
         const isRejected = expenseReportFound.expenseLines.some(line => line.lineItemStatus === 'rejected')
    
         if(approver && isAllApproved && isPendingApproval ){
          approver.status = 'approved'
          expenseReportFound.expenseHeaderStatus = 'approved'
         } else if(approver && isPendingApproval && isRejected ){
          approver.status = 'rejected'
          expenseReportFound.expenseHeaderStatus = 'rejected';
          expenseReportFound.rejectionReason = rejectionReason
         }
  
         // Save the updated approvalDocument document
         const expenseApproved = await approvalDocument.save();
  
         if(!expenseApproved){
           throw new Error(`error occurred while updating expense report `)
         }
  
         console.log('Saved to dashboard: TravelExpenseData updated successfully');
         return { success: true, error: null };
    }} catch (error) {
       console.error('An error occurred while updating Travel Expense status:', error.message);
       return { success: false, error: error.message };
    }
};




export{
    travelStandAloneApproval,
    travelWithCashTravelApproval,
    travelWithCashApproval,
    expenseReportApproval
}
