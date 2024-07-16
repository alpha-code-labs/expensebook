import Joi from "joi";
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
    
      console.log("approvedDoc", JSON.stringify(approvedDoc, ' ', 2))
    const employee = cashApprovalDoc.cashAdvanceSchema.travelRequestData.createdBy.name;
    
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
    
       const approvedDoc = await cashApprovalDoc.save();
    
       console.log("approvedDoc", JSON.stringify(approvedDoc, ' ', 2))
    const employee = cashApprovalDoc.travelRequestSchema.createdBy.name;
    
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


  const approveSchema = Joi.object({
    tenantId:Joi.string().required(),
    empId:Joi.string().required(),
  })
  
  const bodySchema = Joi.object({
    travelRequestIds:Joi.array().required()
  })

  export const approveAllTravelWithCash = async (req, res) => {
    try {
      const {error : paramsError, value: paramsValue} = approveSchema.validate(req.params)
      if(paramsError){
        return res.status(400).json({error: paramsError.details[0].message})
      }
  
      const { error:bodyError , value: bodyValue} = bodySchema.validate(req.body)
      if(bodyError){
        return res.status(400).json({error: bodyError.details[0].message})
      }

      const { tenantId, empId,} = paramsValue
      const { travelRequestIds } = bodyValue;
      
      console.log("approveAllTravelWithCash",tenantId, empId, travelRequestIds)
      
      const cashApprovalDocs = await dashboard.find({
        tenantId,
        'travelRequestId': { $in: travelRequestIds },
        'travelRequestSchema.travelRequestStatus': 'pending approval',
        'travelRequestSchema.approvers': {
          $elemMatch: {
            'empId': empId,
            'status': 'pending approval'
          }
        }
      });

      if (cashApprovalDocs?.length === 0) {
        throw new Error('Travel requests not found.');
      }

      const allTravelRequests = []
      const allTravelRequestsWithCash=[]

      const approvedDocs = await Promise.all(cashApprovalDocs.map(async (cashApprovalDoc) => {
        const { travelRequestSchema={} } = cashApprovalDoc;
  
      const isCashAdvanceTaken = travelRequestSchema.isCashAdvanceTaken

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

         allTravelRequestsWithCash.push(cashApprovalDoc)
       } else {

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

        allTravelRequests.push(cashApprovalDoc)

      }
        return await cashApprovalDoc.save();
      }));

      const travelRequestIdsForTravel = allTravelRequests.map(doc => doc.travelRequestId)
      const travelRequestIdsForCash = allTravelRequestsWithCash.map(doc => doc.travelRequestIds) 

      console.log("total approved",approvedDocs.length)
      const payloadToTravel = {
        tenantId: allTravelRequests[0].travelRequestSchema.tenantId,
        travelRequestIds: travelRequestIdsForTravel,
        travelRequestStatus: 'approved',
        approvers: allTravelRequests[0].travelRequestSchema.approvers,
        rejectionReason: allTravelRequests[0].travelRequestSchema?.rejectionReason,
      };

      const payloadToCash = {
        tenantId: allTravelRequestsWithCash[0].travelRequestSchema.tenantId,
        travelRequestIds: travelRequestIdsForCash,
        travelRequestStatus: 'approved',
        approvers: allTravelRequestsWithCash[0].travelRequestSchema.approvers,
        rejectionReason: allTravelRequestsWithCash[0].travelRequestSchema?.rejectionReason,
      };

      if(allTravelRequests?.length > 0){
        console.log("allTravelRequests", payloadToTravel)
        // sendToOtherMicroservice(payload, action, destination, comments, source='dashboard', onlineVsBatch='online')
      } else if (allTravelRequestsWithCash?.length > 0){
        console.log("payloadToCash", payloadToCash)
        // sendToOtherMicroservice(payload, action, destination, comments, source='dashboard', onlineVsBatch='online')
      }


      if (allTravelRequests?.length > 0 ||allTravelRequestsWithCash?.length > 0) {
        return res.status(200).json({ message: `Travel requests are approved` });
      } else {
        throw new Error('One or more microservices failed to process the request.');
      }
  
    } catch (error) {
      console.error('An error occurred while updating approval:', error.message);
      return res.status(500).json({ error: 'Failed to update approval.', errorMessage: error.message });
    }
  }
  
  const raisedLaterReqSchema = Joi.object({
    tenantId: Joi.string().required(),
    empId:Joi.string().required(),
    travelRequestId: Joi.string().required(),
    cashAdvanceId:Joi.string().required(),
  })
  
  // travel with cash advance -- Approve cash advance / approve cashAdvance raised later
  export const travelWithCashApproveCashAdvance = async (req, res) => {
  
    const {error, value} = raisedLaterReqSchema.validate(req.params)
  
    if(error){
      return res.status(400).json({error: error.details[0].message})
    }
  
    const { tenantId, empId, travelRequestId, cashAdvanceId } = value;
  
    console.log("cash advance approve params ......", req.params);
  
    try {
      const cashApprovalDoc = await Approval.findOne({
        'travelRequestData.tenantId': tenantId,
        'travelRequestData.travelRequestId': travelRequestId,
        'travelRequestData.isCashAdvanceTaken': true,
        $or: [
          {
            'travelRequestData.approvers': {
              $elemMatch: {
                'empId': empId,
                'status': 'approved'
              }
            }
          },
          {
            'travelRequestData.approvers': {
              $elemMatch: {
                'empId': empId
              }
            },
            'travelRequestData.travelRequestStatus': { $in: ['approved', 'booked'] },
          }
        ]
      }).exec();
  
      if (!cashApprovalDoc) {
        return res.status(404).json({ error: 'Travel request not found.' });
      }
  
      const { cashAdvancesData } = cashApprovalDoc;
      const cashAdvanceFound = cashAdvancesData.find(cashAdvance => cashAdvance.cashAdvanceId.toString() == cashAdvanceId);
  
      console.log("valid cash advanceId", cashAdvanceFound);
  
      if (cashAdvanceFound) {
        cashAdvanceFound.approvers.forEach(approver => {
          if (approver.empId === empId && approver.status === 'pending approval') {
            approver.status = 'approved';
          }
        });
  
        const allApproved = cashAdvanceFound.approvers.every(approver => approver.status == 'approved');
  
        if (allApproved) {
          cashAdvanceFound.cashAdvanceStatus = 'approved';
        }
  
        // Save the updated cashApprovalDoc document
        const cashApproved = await cashApprovalDoc.save();
  
        const employee = cashAdvanceFound.createdBy.name;
        // console.log("after approved ..", cashApproved);
  
        const payload = {
          tenantId,
          travelRequestId: cashApprovalDoc.travelRequestData.travelRequestId,
          cashAdvanceId: cashAdvanceId,
          cashAdvanceStatus: cashAdvanceFound?.cashAdvanceStatus,
          approvers: cashAdvanceFound?.approvers,
          rejectionReason: cashAdvanceFound?.rejectionReason,
        };
  
        // console.log("is payload updated save()....", payload);
  
            // Send updated travel to the dashboard synchronously
     const dashboardResponse = await sendToDashboardMicroservice(payload, 'approve-reject-ca',  'To update cashAdvanceStatus to approved in cash microservice', 'approval', 'online', true)
  
        // send Approved cashAdvance to Cash microservice
      await   sendToOtherMicroservice(payload, 'approve-reject-ca', 'cash', 'To update cashAdvanceStatus to approved in cash microservice');
  
        if (dashboardResponse.success) {
          return res.status(200).json({ message: `Cash Advance Approved for ${employee}` });
        } else {
          throw new Error('One or more microservices failed to process the request.');
        }
      }
    } catch (error) {
      console.error('An error occurred while updating approval:', error.message);
      return res.status(500).json({ error: 'Failed to update approval.', error: error.message });
    }
  };

  // travel with cash advance -- Reject cash advance / reject cash Advance raised later
  export const travelWithCashRejectCashAdvance = async (req, res) => {
    const { error: errorParams, value: valueParams} = raisedLaterReqSchema.validate(req.params)
  if(errorParams){
    return res.status(400).json({error: errorParams.details[0].message})
  }
    const { error: errorBody, value: valueBody} = rejectSchema.validate(req.body)
  
    if(errorBody){
      return res.status(400).json({ error: errorBody.details[0].message})
    }
  
    const { tenantId, empId, travelRequestId, cashAdvanceId } = valueParams;
    const {  rejectionReason } = valueBody; 
  
    console.log(" req.params;",  req.params , "rejectionReason", rejectionReason)
  
    try {
      const cashApprovalDoc = await Approval.findOne({
        'travelRequestData.tenantId': tenantId,
        'travelRequestData.travelRequestId': travelRequestId,
        'travelRequestData.isCashAdvanceTaken': true,
        $or: [
          {
            'travelRequestData.approvers': {
              $elemMatch: {
                'empId': empId,
                'status': 'approved'
              }
            }
          },
          {
            'travelRequestData.approvers': {
              $elemMatch: {
                'empId': empId
              }
            },
            'travelRequestData.travelRequestStatus': { $in: ['approved', 'booked'] },
          }
        ]
      }).exec();
  
      if (!cashApprovalDoc) {
        throw new Error('Travel request not found.');
      }
  
      const { cashAdvancesData } = cashApprovalDoc;
  
      const cashAdvanceFound = cashAdvancesData.find(cashAdvance => cashAdvance.cashAdvanceId.toString() == cashAdvanceId);
  
      console.log("valid cash advanceId", cashAdvanceFound);
  
      if (cashAdvanceFound) {
        cashAdvanceFound.approvers.forEach(approver => {
          if (approver.empId === empId && approver.status === 'pending approval') {
            approver.status = 'rejected';
            cashAdvanceFound.cashAdvanceStatus = 'rejected'; 
            cashAdvanceFound.cashAdvanceRejectionReason = rejectionReason; 
          }
        });
    
        // Save the updated cashApprovalDoc document
       const getApproval = await cashApprovalDoc.save();
  
       console.log("what will be returned -------", getApproval)
  
       if(!getApproval){
        return res.status(404).json({ message: 'error occurred while rejecting cash Advance'})
       } else{
        const employee = cashAdvanceFound.createdBy.name;
        console.log("cashAdvanceFound -----", cashAdvanceFound)
    
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
      await sendToOtherMicroservice(payload, 'approve-reject-ca', 'cash', 'To update cashAdvanceStatus to rejected in cash microservice')
      // Send updated travel to the dashboard synchronously
     const dashboardResponse = await sendToDashboardMicroservice(payload, 'approve-reject-ca',  'To update cashAdvanceStatus to rejected in cash microservice')
  
      if (dashboardResponse.success) {
        console.log('Successfully updated cashAdvanceStatus',dashboardResponse)
        return res.status(200).json({ message: `Cash Advance rejected for ${employee}` });
      } else {
        throw new Error('One or more microservices failed to process the request.');
      }    }
       }
    } catch (error) {
      console.error('An error occurred while updating approval:', error.message);
      return res.status(500).json({ error: 'Failed to update approval.', error: error.message });
    }
  };




