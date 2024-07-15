import { employeeSchema } from "../controllersRoleBased/roleBasedController.js";
import dashboard from "../models/dashboardSchema.js";

const status = {
    PENDING_APPROVAL:'pending approval'
}

async function findPendingTravelRequests(tenantId,empId,travelRequestId){
    try{
 const travelRequest = await dashboard.findOne({
    tenantId,
    travelRequestId,
    'travelRequestSchema.travelRequestStatus': status.PENDING_APPROVAL,
    'travelRequestSchema.approvers':{
        $elemMatch:{
            empId:empId,
            status:status.PENDING_APPROVAL
        }
    }
 })
 return travelRequest
    } catch(error){
        console.log("Error while finding pending travel request",error)
        throw error
    }

}

// approve travel Request with/without cash advance
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
        const { cashAdvancesData } = cashApprovalDoc;
    
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
    
       console.log("approvedDoc", JSON.stringify(approvedDoc, ' ', 2))
    const employee = travelRequestData.createdBy.name;
    
   const payload = {
      tenantId: cashApprovalDoc.cashAdvanceSchema.travelRequestData.tenantId,
      travelRequestId: cashApprovalDoc.cashAdvanceSchema.travelRequestData.travelRequestId,
      travelRequestStatus: cashApprovalDoc.cashAdvanceSchema.travelRequestData.travelRequestStatus,
      approvers: cashApprovalDoc.cashAdvanceSchema.travelRequestData.approvers,
      rejectionReason: cashApprovalDoc.cashAdvanceSchema.travelRequestData?.rejectionReason,
    };
    
    console.log("payload",payload)
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
    
        //cash
        const { cashAdvancesData } = cashApprovalDoc;
    
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
    
       console.log("approvedDoc", JSON.stringify(approvedDoc, ' ', 2))
    const employee = travelRequestSchema.createdBy.name;
    
    payload = {
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
    return res.status(200).json({ message: `Travel request is approved for ${employee}` });
  } else {
    throw new Error('One or more microservices failed to process the request.');
  }

    } catch (error) {
      console.error('An error occurred while updating approval:', error.message);
      return res.status(500).json({ error: 'Failed to update approval.', errorMessage: error.message });
    }
};


const rejectSchema = Joi.object({
    rejectionReason:Joi.string().required()
  })


// reject travel request with/without cash advance
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
          const itineraryApproved = Object.values(itinerary).flatMap(Object.values);
    
        itineraryApproved.forEach(booking => {  
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
          const itineraryApproved = Object.values(itinerary).flatMap(Object.values);
    
        itineraryApproved.forEach(booking => {  
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
      return res.status(500).json({ error: 'Failed to update approval.', errorMessage: error.message });
    }
  };

