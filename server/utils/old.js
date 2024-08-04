//  //  approvalDocs.push(approveCashAdvance(tenantId,empId,cashReports))
//  approvalDocs.push(rejectCashAdvance(tenantId,empId,travelRequestIds,cashApprovalDocs,rejectionReason))
// }


export const rejectCashAdvance = async (tenantId, empId, cashApprovalDocs,rejectionReason) => {

    console.log( "rejectCashAdvance--rejectionReason", rejectionReason)
  
    try {
      if (!cashApprovalDocs?.length) {
        throw new Error('Travel request not found.');
      }
  
      const cashAdvanceIds = cashApprovalDocs.flatMap(request =>
        request.cashAdvanceData.map(cashAdvance => cashAdvance.cashAdvanceId)
      );
  
      const getApproval = await updateCashAdvanceStatus(cashApprovalDocs, cashAdvanceIds, empId);
  
       console.log("what will be returned -------", getApproval)
  
       if(!getApproval){
        return res.status(404).json({ message: 'error occurred while rejecting cash Advance'})
       } else{
    
        const payload = {
          tenantId,
          travelRequestId: cashApprovalDoc.travelRequestData.travelRequestId,
          cashAdvanceId: cashAdvanceId,
          cashAdvanceStatus: cashAdvanceFound?.cashAdvanceStatus,
          approvers: cashAdvanceFound?.approvers,
          cashAdvanceRejectionReason:cashAdvanceFound?.cashAdvanceRejectionReason,
        }
  
        console.log("payload updated?", payload)
    
        // send Rejected cash advance to Cash microservice
        const promises = [
         sendToOtherMicroservice(payload, 'approve-reject-ca', 'cash', 'To update cashAdvanceStatus to rejected in cash microservice'),
         sendToOtherMicroservice(payload, 'approve-reject-ca', 'approval', 'To update cashAdvanceStatus to rejected in cash microservice'),
        ]
        await Promise.all(promises)
  
      // Send updated travel to the dashboard synchronously
    //  const dashboardResponse = await sendToDashboardMicroservice(payload, 'approve-reject-ca',  'To update cashAdvanceStatus to rejected in cash microservice')
  
      if (dashboardResponse.success) {
        console.log('Successfully updated cashAdvanceStatus',dashboardResponse)
        return res.status(200).json({ message: `Cash Advance rejected for ${employee}` });
      } else {
        throw new Error('One or more microservices failed to process the request.');
      }    }
       
    } catch (error) {
      console.error('An error occurred while updating approval:', error.message);
      return res.status(500).json({ error: 'Failed to update approval.', error: error.message });
    }
};