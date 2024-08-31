//  //  approvalDocs.push(approveCashAdvance(tenantId,empId,cashReports))
//  approvalDocs.push(rejectCashAdvance(tenantId,empId,travelRequestIds,cashApprovalDocs,rejectionReason))
// }

export const approveTravelWithCash = async (req, res) => {
  try {

    const {error, value} = employeeSchema.validate(req.params)

    if(error){
      return res.status(400).json({error:error.details[0].message})
    }

    const { tenantId, empId, travelRequestId } = value;
    
    console.log("approveTravelWithCash",tenantId, empId, travelRequestId , )

    const cashApprovalDoc = await findPendingTravelRequests(tenantId,empId,travelRequestId)

    if (!cashApprovalDoc) {
      throw new Error('Travel request not found.');
    }

    const isCashAdvanceTaken = cashApprovalDoc?.travelRequestSchema?.isCashAdvanceTaken


    if(isCashAdvanceTaken){

      const { travelRequestData } = cashApprovalDoc.cashAdvanceSchema;
      const { itinerary, approvers } = travelRequestData;

      if (!itinerary || typeof itinerary !== 'object' || Object.keys(itinerary)?.length === 0) {
        throw new Error('Travel Request doesn\'t have anything in the itinerary to approve');
      }

      Object.values(itinerary).flatMap(Object.values).forEach(booking => {
        booking.approvers.forEach(approver => {
          if (approver.empId === empId && approver.status === 'pending approval' && booking.status === 'pending approval') {
            approver.status = 'approved';
          }
        });

        const isPendingApproval = booking.status === 'pending approval';
        const allApproversApproved = booking.approvers.every(approver => approver.status === 'approved');
        if (allApproversApproved && isPendingApproval) {
          booking.status = 'approved';
        }
      });

      const updatedApprovers = approvers.map(approver => ({
        ...approver,
        status: approver.empId === empId ? 'approved' : approver.status
      }));

      cashApprovalDoc.cashAdvanceSchema.travelRequestData.approvers = updatedApprovers;
      const allApproved = updatedApprovers.every(approver => approver.status === 'approved');
      if (allApproved) {
        cashApprovalDoc.cashAdvanceSchema.travelRequestData.travelRequestStatus = 'approved';
      }

      //cash
      const { cashAdvancesData } = cashApprovalDoc.cashAdvanceSchema;
  
      console.log("cashAdvancesData", JSON.stringify(cashAdvancesData, '', 2))
  
      if(cashAdvancesData?.length > 0){
        cashAdvancesData.forEach(cashAdvance => {
    
            cashAdvance.approvers.forEach(approver => {
              if (approver.empId === empId && approver.status === 'pending approval') {
                approver.status = 'approved';
              }
            });
      
            const allApproved = cashAdvance.approvers.every(approver => approver.status == 'approved');
      
            if (allApproved) {
              cashAdvance.cashAdvanceStatus = 'approved';
            }
        })}
  
  
    const approvedDoc = await cashApprovalDoc.save();
  
    // console.log("approveTravelWithCash", JSON.stringify(approvedDoc, ' ', 2))
  const employee = cashApprovalDoc.cashAdvanceSchema.travelRequestData.createdBy.name;
  
 const payload = {
    tenantId: cashApprovalDoc.cashAdvanceSchema.travelRequestData.tenantId,
    travelRequestId: cashApprovalDoc.cashAdvanceSchema.travelRequestData.travelRequestId,
    travelRequestStatus: cashApprovalDoc.cashAdvanceSchema.travelRequestData.travelRequestStatus,
    approvers: cashApprovalDoc.cashAdvanceSchema.travelRequestData.approvers,
    rejectionReason: cashApprovalDoc.cashAdvanceSchema.travelRequestData?.rejectionReason,
  };
  
  console.log(" approveTravelWithCash -payload",payload)
    } else {
      const { travelRequestSchema } = cashApprovalDoc;
      const { itinerary, approvers } = travelRequestSchema;
  
      if (!itinerary || typeof itinerary !== 'object' || Object.keys(itinerary)?.length === 0) {
        throw new Error('Travel Request doesn\'t have anything in the itinerary to approve');
      }
  
      Object.values(itinerary).flatMap(Object.values).forEach(booking => {
        booking.approvers.forEach(approver => {
          if (approver.empId === empId && approver.status === 'pending approval' && booking.status === 'pending approval') {
            approver.status = 'approved';
          }
        });
  
        const isPendingApproval = booking.status === 'pending approval';
        const allApproversApproved = booking.approvers.every(approver => approver.status === 'approved');
        if (allApproversApproved && isPendingApproval) {
          booking.status = 'approved';
        }
      });
  
      const updatedApprovers = approvers.map(approver => ({
        ...approver,
        status: approver.empId === empId ? 'approved' : approver.status
      }));
  
      cashApprovalDoc.travelRequestSchema.approvers = updatedApprovers;
      const allApproved = updatedApprovers.every(approver => approver.status === 'approved');
      if (allApproved) {
        cashApprovalDoc.travelRequestSchema.travelRequestStatus = 'approved';
      }
  
     const approvedDoc = await cashApprovalDoc.save();
  
     console.log("approveTravelWithCash", JSON.stringify(approvedDoc, ' ', 2))
  const employee = cashApprovalDoc.travelRequestSchema.createdBy.name;
  
  payload = {
    tenantId: cashApprovalDoc.travelRequestSchema.tenantId,
    travelRequestId: cashApprovalDoc.travelRequestSchema.travelRequestId,
    travelRequestStatus: cashApprovalDoc.travelRequestSchema.travelRequestStatus,
    approvers: cashApprovalDoc.travelRequestSchema.approvers,
    rejectionReason: cashApprovalDoc.travelRequestSchema?.rejectionReason,
  };
  
  console.log("approveTravelWithCash payload",payload)
  }


// // Await both microservice calls simultaneously
// const dashboardResponse = await sendToDashboardMicroservice(payload, 'approve-reject-tr-ca', 'To update travelRequestStatus to approved in cash microservice', 'approval', 'online', true);
//   await sendToOtherMicroservice(payload, 'approve-reject-tr', 'cash', 'To update travelRequestStatus to approved in cash microservice', 'online')
const dashboardResponse ={
success:true
}

if (dashboardResponse.success) {
  return res.status(200).json({ message: `Travel request is approved for ${employee}` });
} else {
  throw new Error('One or more microservices failed to process the request.');
}

  } catch (error) {
    console.error('An error occurred while updating approval:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const rejectTravelWithCash = async (req, res) => {
  try {

    const {error: errorParams, value: valueParams} = employeeSchema.validate(req.params)

    if(errorParams){
      return res.status(400).json({error: errorParams.details[0].message})
    }
    const {error: errorBody, value: valueBody} = rejectSchema.validate(req.body)

    if(errorBody){
      return res.status(400).json({ error: errorBody.details[0].message})
    }

    const { tenantId, empId, travelRequestId } = valueParams;
    const { rejectionReason} = valueBody
    
  console.log("approveTravelWithCash",tenantId, empId, travelRequestId , )

  const cashApprovalDoc = await findPendingTravelRequests(tenantId,empId,travelRequestId)

    if (!cashApprovalDoc) {
      throw new Error('Travel request not found.');
    }

   const {travelRequestSchema} = cashApprovalDoc

   const isCashAdvanceTaken = travelRequestSchema.isCashAdvanceTaken
   if(isCashAdvanceTaken){

      const { travelRequestData, cashAdvancesData } = cashApprovalDoc.cashAdvanceSchema;
      const { itinerary, approvers } = travelRequestData;
  
      if (typeof itinerary === 'object') {
        const itineraryRejected = Object.values(itinerary).flatMap(Object.values);
  
      itineraryRejected.forEach(booking => {  
        booking.approvers.forEach(approver => {
          if(approver.empId === req.params.empId && approver.status == 'pending approval' && booking.status == 'pending approval'){
          approver.status = 'rejected'
          }
        })
        
        const isPendingApproval = booking.status == 'pending approval'
        if (isPendingApproval){
          booking.status = 'rejected'
        }})
       } else {
      throw new Error("Travel Request doesn't have anything in itinerary to approve");
       }
  
      console.log(approvers , );
      const updatedApprovers = approvers.map((approver) => {
      if (approver.empId === empId) {
          return {
            ...approver,
            status: 'rejected',
          };
        }
        return approver;
      });

      // Update the cashApprovalDoc document with the approvers array and rejection reason
      cashApprovalDoc.cashAdvanceSchema.travelRequestData.approvers = updatedApprovers;
      cashApprovalDoc.cashAdvanceSchema.travelRequestData.rejectionReason = rejectionReason;
  
      // Update the status within the cashApprovalDoc document
      cashApprovalDoc.cashAdvanceSchema.travelRequestData.travelRequestStatus = 'rejected';
  
      if(cashAdvancesData?.length > 0){
      cashApprovalDoc?.cashAdvanceSchema.cashAdvancesData?.forEach(cashAdvance => {
          cashAdvance.approvers = cashAdvance.approvers.map(approver => {
          if (approver.empId === empId && approver.status === 'pending approval') {
              return { ...approver, status: 'rejected' };
          }
          return approver;
          });
      
          // Check if cashAdvanceStatus is 'pending approval', update to 'rejected'
          if (cashAdvance?.cashAdvanceStatus === 'pending approval') {
          cashAdvance.cashAdvanceStatus = 'rejected';
          }
      });
      }
  
      const approvedDoc = await cashApprovalDoc.save();

  console.log("approvedDoc", JSON.stringify(approvedDoc, ' ', 2))
const employee = travelRequestSchema.createdBy.name;

const payload = {
  tenantId: cashApprovalDoc.travelRequestSchema.tenantId,
  travelRequestId: cashApprovalDoc.travelRequestSchema.travelRequestId,
  travelRequestStatus: cashApprovalDoc.travelRequestSchema.travelRequestStatus,
  approvers: cashApprovalDoc.travelRequestSchema.approvers,
  rejectionReason: cashApprovalDoc.travelRequestSchema?.rejectionReason,
};

console.log("payload",payload)

  } else {
      const { travelRequestSchema } = cashApprovalDoc;
      const { itinerary, approvers } = travelRequestSchema;
  
      if (typeof itinerary === 'object') {
        const itineraryRejected = Object.values(itinerary).flatMap(Object.values);
  
      itineraryRejected.forEach(booking => {  
        booking.approvers.forEach(approver => {
          if(approver.empId === req.params.empId && approver.status == 'pending approval' && booking.status == 'pending approval'){
          approver.status = 'rejected'
          }
        })
        
        const isPendingApproval = booking.status == 'pending approval'
        if (isPendingApproval){
          booking.status = 'rejected'
        }})
    } else {
      throw new Error("Travel Request doesn't have anything in itinerary to approve");
    }
  
      console.log(approvers , );
      const updatedApprovers = approvers.map((approver) => {
        if (approver.empId === empId) {
          return {
            ...approver,
            status: 'rejected',
          };
        }
        return approver;
      });
  
      // Update the cashApprovalDoc document with the approvers array and rejection reason
      cashApprovalDoc.travelRequestSchema.approvers = updatedApprovers;
      cashApprovalDoc.travelRequestSchema.rejectionReason = rejectionReason;
  
      // Update the status within the cashApprovalDoc document
      cashApprovalDoc.travelRequestSchema.travelRequestStatus = 'rejected';

      const approvedDoc = await cashApprovalDoc.save();

  console.log("approvedDoc", JSON.stringify(approvedDoc, ' ', 2))
const employee = travelRequestSchema.createdBy.name;

const payload = {
  tenantId: cashApprovalDoc.travelRequestSchema.tenantId,
  travelRequestId: cashApprovalDoc.travelRequestSchema.travelRequestId,
  travelRequestStatus: cashApprovalDoc.travelRequestSchema.travelRequestStatus,
  approvers: cashApprovalDoc.travelRequestSchema.approvers,
  rejectionReason: cashApprovalDoc.travelRequestSchema?.rejectionReason,
};

console.log("payload",payload)
  
  }

// // Await both microservice calls simultaneously
// const dashboardResponse = await sendToDashboardMicroservice(payload, 'approve-reject-tr-ca', 'To update travelRequestStatus to approved in cash microservice', 'approval', 'online', true);
//   await sendToOtherMicroservice(payload, 'approve-reject-tr', 'cash', 'To update travelRequestStatus to approved in cash microservice', 'online')
const dashboardResponse ={
success:true
}

if (dashboardResponse.success) {
  return res.status(200).json({ message: `Travel request is rejected for ${employee}` });
} else {
  throw new Error('One or more microservices failed to process the request.', error);
}

  } catch (error) {
    console.error('An error occurred while updating approval:', error.message);
    return res.status(500).json({ success:false, error: error.message });
  }
};

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