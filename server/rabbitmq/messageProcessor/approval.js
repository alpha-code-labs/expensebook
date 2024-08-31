import Trip from "../../models/tripSchema.js";



async function getExpenseReport(tenantId,empId,tripId,expenseHeaderId){
    try{
      const expenseReport = await Trip.findOne({
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
       throw new Error(error)
     } 
  
     return expenseReport
    } catch (error){
      throw new Error( error)
    }
}

  function updateExpenseLineStatus(expenseLines, approve = [], reject = [], empId) {

    return expenseLines.map(expenseLine => {
      const expenseLineIdStr = expenseLine.expenseLineId.toString();

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
               expenseReportFound.expenseHeaderStatus = 'approved'
              } else if(approver && isPendingApproval && isRejected ){
               approver.status = 'rejected'
               expenseReportFound.expenseHeaderStatus = 'rejected';
               expenseReportFound.rejectionReason = rejectionReason
              }
       
              // Save the updated approvalDocument document
              const expenseApproved = await approvalDocument.save();
            
              console.log("expenseApproved", expenseApproved.length)
            console.log('Saved to Trip: TravelExpenseData updated successfully');
            return { success: true, error: null };
        }
 
    }} catch (error) {
        console.error('Failed to update Trip: TravelExpenseData update failed', error);
        return { success: false, error: error };
    }
};



export async function approveRejectCashRaisedLater(payload) {
    try {
        console.log("payload", payload);

        const results = await Promise.all(payload.map(handleRequest));

        return { success: true, results };
    } catch (e) {
        return { success: false, error: e.message || e };
    }
}

async function handleRequest(request) {
    const { travelRequestId, cashAdvances } = request;

    const cashAdvance = await Trip.findOne({ 'travelRequestData.travelRequestId': travelRequestId });
    if (!cashAdvance) {
        return { travelRequestId, success: false, error: 'Travel Request not found' };
    }

    // Update cash advances
    const updatedCashAdvancesData = updateCashAdvances(cashAdvance.cashAdvancesData, cashAdvances);

    // Save the updates
    cashAdvance.cashAdvancesData = updatedCashAdvancesData;
    await cashAdvance.save();

    console.log("cashAdvance", cashAdvance);
    return { travelRequestId, success: true, error: null };
}

function updateCashAdvances(existingCashAdvances, newCashAdvances) {
    return existingCashAdvances.map(existingCa => {
        const matchingCa = newCashAdvances.find(ca => ca.cashAdvanceId === existingCa.cashAdvanceId.toString());
        if (matchingCa) {
            return {
                ...existingCa,
                cashAdvanceStatus: matchingCa.cashAdvanceStatus,
                cashAdvanceRejectionReason: matchingCa.cashAdvanceRejectionReason,
                approvers: matchingCa.approvers,
            };
        }
        return existingCa; 
    });
}