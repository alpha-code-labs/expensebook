import HRMaster from "../../models/hrCompanySchema.js"
import REIMBURSEMENT from "../../models/reimbursementSchema.js"
import reporting from "../../models/reportingSchema.js"



const travelStandAloneApproval = async(payload) =>{
  try{
   const {tenantId, travelRequestId, approvers,travelRequestStatus, rejectionReason} = payload || {};

   // console.log("Payload for travelStandAloneApproval", payload);
   const travelStandAlone = await reporting.updateOne({
       tenantId,
       travelRequestId
      },{
        $set:{
           'travelRequestData.travelRequestStatus': travelRequestStatus,
            'travelRequestData.approvers': approvers,
            'travelRequestData.rejectionReason': rejectionReason,
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
   const travelWithCashTravel = await reporting.updateOne({
       tenantId,
       travelRequestId
      },{
        $set:{
           'travelRequestData.travelRequestStatus': travelRequestStatus,
            'travelRequestData.approvers': approvers,
            'travelRequestData.rejectionReason': rejectionReason,
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

// 1)travel preference
async function updatePreferences(payload){
    try{
        const {tenantId, employeeId, travelPreferences} = payload
        
        const tenant = HRMaster.findOne({tenantId})
        if(!tenant) return {success: false, error: 'Tenant not found'}
        let employeeData = tenant.employees.filter(emp=> emp.employeeId == employeeId)
  
        if(employeeData.length > 0){
            employeeData = employeeData[0]
            employeeData.travelPreferences = travelPreferences
            tenant.save()
            return {success:true, error:null}
  
        }
  
        return {success:false, error: 'Employee not found'}
  
    }catch(e){
        return {success:false, error:e}
    }
  }

async function approveRejectRequests(payload) {
    try {
        const results = [];
        console.log("payload",payload)

        for (const request of payload) {
            const {
                travelRequestId,
                travelRequestStatus,
                rejectionReason,
                approvers,
                cashAdvances
            } = request;

            // Find the cash advance based on the travel request ID
            const cashAdvance = await reporting.findOne({ 'travelRequestData.travelRequestId': travelRequestId });
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

//2) Approve reject cash raised later
async function approveRejectCashRaisedLater(payload) {
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

    const cashAdvance = await reporting.findOne({ 'tripSchema.travelRequestData.travelRequestId': travelRequestId });
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

// 3) expense Report Approval
async function getExpenseReport(tenantId,empId,tripId,expenseHeaderId){
    try{
      const expenseReport = await reporting.findOne({
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
       throw new Error('expense report not found')
     } 
  
    return expenseReport
    } catch (error){
    throw error
    }
}

function updateExpenseLineStatus(expenseLines, approve = [], reject = [], empId) {

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

const expenseReportApproval = async (payload) => {
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

// 4) reimbursement approval
async function getNonTravelExpenseReport(tenantId, empId, expenseHeaderId) {
    try {
      const report = await REIMBURSEMENT.findOne({
        tenantId,
        expenseHeaderId,
        'approvers': {
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


const nonTravelReportApproval = async (payload) => {
    try {
       const { tenantId, expenseHeaderId, empId, approve, reject, rejectionReason } = payload;
  
       const approvalDocument = await getNonTravelExpenseReport(tenantId,empId,expenseHeaderId)
   
       console.log("approvalDocument",approvalDocument)
       if (!approvalDocument) {
        throw new Error('No matching approval document found for updating expenses status.');
       }
  
        const {expenseLines = []} =approvalDocument
  
      //  console.log("valid expenseReport", expenseReportFound);
  
        const updatedExpenseLines = updateExpenseLineStatus(expenseLines, approve, reject,empId)
  
        // console.log("updatedExpenseLines", JSON.stringify(updatedExpenseLines,'',2))
        approvalDocument.expenseLines = updatedExpenseLines
        const isPendingApproval = approvalDocument.expenseHeaderStatus === 'pending approval'
  
        // console.log("isPendingApproval", isPendingApproval)
         const approver = approvalDocument.approvers.find(approver =>
          approver.empId === empId && approver.status === 'pending approval'
         )
  
        //  console.log("approver", isPendingApproval)
  
         const isAllApproved = approvalDocument.expenseLines.every(line => line.lineItemStatus === 'approved')
         const isRejected = approvalDocument.expenseLines.some(line => line.lineItemStatus === 'rejected')
  
        //  console.log("isAllApproved, isRejected", isAllApproved, isRejected)
  
         if(approver && isAllApproved && isPendingApproval ){
          const setApprover = approvalDocument.approvers.map(approver =>{
            if(approver.empId === empId && approver.status === 'pending approval'){
              return { ...approver, status: 'approved' }
            }
          })
          approvalDocument.approvers = setApprover
          approvalDocument.expenseHeaderStatus = 'pending settlement'
         } else if(approver && isPendingApproval && isRejected ){
          const setApprover = approvalDocument.approvers.map(approver =>{
            if(approver.empId === empId && approver.status === 'pending approval'){
              return { ...approver, status: 'rejected' }
            }
          })
          approvalDocument.approvers = setApprover
          approvalDocument.expenseHeaderStatus = 'rejected';
          approvalDocument.rejectionReason = rejectionReason
         }
  
         // Save the updated approvalDocument document
         const expenseApproved = await approvalDocument.save();
  
         if(!expenseApproved){
           return res.status(404).json({message:`error occurred while updating expense report `})
         }
  
         return { success: true, error: null };
  
    } catch (error) {
        console.error('Failed to update Expense: Non TravelExpenseData update failed', error);
        return { success: false, error: error.message };
    }
};


export { 
        travelStandAloneApproval,
        travelWithCashTravelApproval,
        updatePreferences, 
        approveRejectRequests,
        approveRejectCashRaisedLater, 
        expenseReportApproval,
        updateExpenseLineStatus,
        nonTravelReportApproval
    }