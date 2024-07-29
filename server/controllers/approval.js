import Joi from "joi";
import { employeeSchema } from "../controllersRoleBased/roleBasedController.js";
import dashboard from "../models/dashboardSchema.js";
import { sendToOtherMicroservice } from "../rabbitmq/publisher.js";
// import { errorMonitor } from "node-cron/src/scheduled-task.js";

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
    travelRequests:Joi.array().required()
  })

  // const bodySchema = Joi.object({
  //   travelRequestIds:Joi.array().required()
  // })

  const raisedLaterReqSchema = Joi.object({
    tenantId: Joi.string().required(),
    empId:Joi.string().required(),
    travelRequestId: Joi.string().required(),
    cashAdvanceId:Joi.string().required(),
  })

export async function approveAll(req,res){
    try{  
      const {error : paramsError, value: paramsValue} = approveSchema.validate(req.params)
      if(paramsError){
        return res.status(400).json({error: paramsError.details[0].message})
      }
  
      const { error:bodyError , value: bodyValue} = bodySchema.validate(req.body)
      if(bodyError){
        return res.status(400).json({error: bodyError.details[0].message})
      }

      const { tenantId, empId,} = paramsValue
      const { travelRequests } = bodyValue;

      const travelRequestIds = bodyValue.map(obj => obj.travelRequestId);

      console.log("approveAllTravelWithCash",tenantId, empId, travelRequestIds)
      const reports= await Promise.all([
        approveAllTravelWithCash(tenantId, empId, travelRequests),
        approveCashAdvance(tenantId,empId,travelRequests)
      ])  

      console.log("approveAll promise", reports)
    }catch(error){
     console.error('error', error)
    }
}

export async function rejectAll(req,res){
  try{
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
    
  } catch(error){
    console.error('error', error)
  }
}
async function  getAllTravelWithCash(tenantId,empId,travelRequestIds){
    try{
       const getReports = await dashboard.find({
        tenantId,
        'travelRequestId':{$in:travelRequestIds},
        'travelRequestSchema.travelRequestStatus':'pending approval',
        'travelRequestSchema.approvers':{
          $elemMatch:{
            empId,
            status:'pending approval'
          }
        }
       })

       return getReports
    } catch(error){
      return res.status(404).json('not found')
    }
  }

export const approveAllTravelWithCash = async (tenantId, empId, travelRequests) => {
    try {
      const travelRequestIds = travelRequests.map(obj => obj.travelRequestId);

      console.log("approveAllTravelWithCash",tenantId, empId, travelRequestIds)
      
      const cashApprovalDocs = await getAllTravelWithCash(tenantId,empId, travelRequestIds)

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
        }

        

      );
  
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

export const rejectAllTravelWithCash = async (req, res) => {
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
      
      console.log("rejectAllTravelWithCash",tenantId, empId, travelRequestIds)
      
      const cashApprovalDocs = await getAllTravelWithCash(tenantId,empId,travelRequestIds)

      if (cashApprovalDocs?.length === 0) {
        throw new Error('Travel requests not found.');
      }

      const allTravelRequests = []
      const allTravelRequestsWithCash=[]

      const approvedDocs = await Promise.all(cashApprovalDocs.map(async (cashApprovalDoc) => {
        const { travelRequestSchema={} } = cashApprovalDoc;
  
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


         allTravelRequestsWithCash.push(cashApprovalDoc)
       } else {

        const { travelRequestSchema = {} } = cashApprovalDoc;
        const { itinerary ={} , approvers = [] } = travelRequestSchema;
    
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
        console.log("bulk reject - allTravelRequests ", payloadToTravel)
        // sendToOtherMicroservice(payload, action, destination, comments, source='dashboard', onlineVsBatch='online')
      } else if (allTravelRequestsWithCash?.length > 0){
        console.log("bulk reject - payloadToCash", payloadToCash)
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
          tenantId,
          travelRequestId,
          'cashAdvanceSchema.travelRequestData.travelRequestStatus': { $in: ['approved', 'booked'] },
          'cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus': { $in: ['pending approval'] },
          'cashAdvanceSchema.cashAdvancesData.approvers':{
              $elemMatch :{'empId': empId,'status': 'pending approval',}
             }

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

      // await   sendToOtherMicroservice(payload, 'approve-reject-ca', 'cash', 'To update cashAdvanceStatus to approved in cash microservice');
        if (payload) {
          console.log("payload",payload)
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
        const promises = [
         sendToOtherMicroservice(payload, 'approve-reject-ca', 'cash', 'To update cashAdvanceStatus to rejected in cash microservice'),
         sendToOtherMicroservice(payload, 'approve-reject-ca', 'approval', 'To update cashAdvanceStatus to rejected in cash microservice'),
        ]
        await Promise.all(promises)
x
      // Send updated travel to the dashboard synchronously
    //  const dashboardResponse = await sendToDashboardMicroservice(payload, 'approve-reject-ca',  'To update cashAdvanceStatus to rejected in cash microservice')
  
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

  const updateCashAdvanceStatus = async (cashApprovalDocs, cashAdvanceIds, empId) => {
    const updateApproverStatus = (approvers, empId) =>
      approvers.map(approver => 
        approver.empId === empId && approver.status === 'pending approval'
          ? { ...approver, status: 'approved' }
          : approver
      );
  
    const isAllApproved = approvers =>
      approvers.every(approver => approver.status === 'approved');
  
    const updateCashAdvancesData = (cashAdvancesData, cashAdvanceIds, empId) =>
      cashAdvancesData.map(cashAdvance => {
        if (cashAdvanceIds.includes(cashAdvance.cashAdvanceId.toString())) {
          const updatedApprovers = updateApproverStatus(cashAdvance.approvers, empId);
          const cashAdvanceStatus = isAllApproved(updatedApprovers) ? 'approved' : cashAdvance.cashAdvanceStatus;
          return { ...cashAdvance, approvers: updatedApprovers, cashAdvanceStatus };
        }
        return cashAdvance;
      });
  
    const updateDocs = async cashApprovalDocs => {
      for (const cashApprovalDoc of cashApprovalDocs) {
        cashApprovalDoc.cashAdvancesData = updateCashAdvancesData(
          cashApprovalDoc.cashAdvancesData,
          cashAdvanceIds,
          empId
        );
        try {
          await cashApprovalDoc.save();
          console.log(`Successfully updated cashApprovalDoc: ${cashApprovalDoc._id}`);
        } catch (error) {
          console.error(`Error updating cashApprovalDoc: ${cashApprovalDoc._id}`, error);
        }
      }
    };
  
    await updateDocs(cashApprovalDocs);
  };

  const rejectCashStatusUpdate = async (cashApprovalDocs, cashAdvanceIds, empId, rejectionReason) => {
    const updateStatusToRejected = (approvers, empId) =>
      approvers.map(approver => 
        approver.empId === empId && approver.status === 'pending approval'
          ? { ...approver, status: 'rejected' }
          : approver
      );
  
    const isRejected = approvers =>
      approvers.some(approver => approver.status === 'rejected');
  
    const updateCashAdvancesData = (cashAdvancesData, cashAdvanceIds, empId, rejectionReason) =>
      cashAdvancesData.map(cashAdvance => {
        if (cashAdvanceIds.includes(cashAdvance.cashAdvanceId.toString())) {
          const updatedApprovers = updateStatusToRejected(cashAdvance.approvers, empId);
          const cashAdvanceStatus = isRejected(updatedApprovers) ? 'rejected' : cashAdvance.cashAdvanceStatus;
          const reason = cashAdvance.rejectionReason = rejectionReason; 

          return { ...cashAdvance, approvers: updatedApprovers, cashAdvanceStatus , rejectionReason:reason };
        }
        return cashAdvance;
      });
  
    const updateDocs = async cashApprovalDocs => {
      for (const cashApprovalDoc of cashApprovalDocs) {
        cashApprovalDoc.cashAdvancesData = updateCashAdvancesData(
          cashApprovalDoc.cashAdvancesData,
          cashAdvanceIds,
          empId
        );
        try {
          await cashApprovalDoc.save();
          console.log(`Successfully updated cashApprovalDoc: ${cashApprovalDoc._id}`);
        } catch (error) {
          console.error(`Error updating cashApprovalDoc: ${cashApprovalDoc._id}`, error);
        }
      }
    };
  
    await updateDocs(cashApprovalDocs);
  };

async function getReportsCashRaisedLater(tenantId,empId,travelRequestIds){
  try{
      const cashApprovalDocs = await dashboard.find({
        tenantId,
        travelRequestId: { $in: travelRequestIds },
        'cashAdvanceSchema.travelRequestData.travelRequestStatus': { $in: ['approved', 'booked'] },
        'cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus': { $in: ['pending approval'] },
        'cashAdvanceSchema.cashAdvancesData.approvers': {
          $elemMatch: { 'empId': empId, 'status': 'pending approval' }
        }
      }).exec();
  
      if (!cashApprovalDocs || cashApprovalDocs.length === 0) {
        return { status: 404, json: { error: 'Travel request not found.' } };
      }
      return cashApprovalDocs
  } catch(error){
    console.log("Error in getReportsCashRaisedLater", error)
  }
}

  // travel with cash advance -- approve cashAdvance raised later
export const approveCashAdvance = async (tenantId, empId, travelRequests) => {
    console.log("Starting cash advance approval process...");
  
    const travelRequestIds = travelRequests.map(request => request.travelRequestId);
  
    try {
      const cashApprovalDocs = await getReportsCashRaisedLater(tenantId,empId,travelRequestIds)
  
      // Extract travelRequestIds from cashApprovalDocs
      const allTravelRequestIds = cashApprovalDocs.map(doc => doc.travelRequestId.toString());
  
      // Filter travelRequests to get only those that match the travelRequestIds
      const matchedTravelRequests = travelRequests.filter(request =>
        allTravelRequestIds.includes(request.travelRequestId.toString())
      );
  
      const cashAdvanceIds = matchedTravelRequests.flatMap(request =>
        request.cashAdvanceData.map(cashAdvance => cashAdvance.cashAdvanceId)
      );
  
      const getReports = await updateCashAdvanceStatus(cashApprovalDocs, cashAdvanceIds, empId);
      
      // Construct the payload
      const payload = {
        tenantId,
        getReports,
      };
  
      console.log("Payload successfully for cash raised later:", payload);
      return { status: 200, json: payload };
    } catch (error) {
      console.error('An error occurred while updating approval:', error.message);
      return { status: 500, json: { error: 'Failed to update approval.', details: error.message } };
    }
};


export const rejectCashAdvance = async (tenantId, empId, travelRequests,rejectionReason) => {
//   const { error: errorParams, value: valueParams} = raisedLaterReqSchema.validate(req.params)
// if(errorParams){
//   return res.status(400).json({error: errorParams.details[0].message})
// }
//   const { error: errorBody, value: valueBody} = rejectSchema.validate(req.body)

//   if(errorBody){
//     return res.status(400).json({ error: errorBody.details[0].message})
//   }

//   const { tenantId, empId, travelRequestId, cashAdvanceId } = valueParams;
//   const {  rejectionReason } = valueBody; 

 const  travelRequestIds = travelRequests?.map(request => request.travelRequestId)

  console.log(" req.params;", travelRequests ,"travelRequestIds",travelRequestIds, "rejectionReason", rejectionReason)

  try {
    const cashApprovalDocs = await getReportsCashRaisedLater(tenantId,empId,travelRequestIds)
    if (!cashApprovalDocs) {
      throw new Error('Travel request not found.');
    }

    // Extract travelRequestIds from cashApprovalDocs
    const allTravelRequestIds = cashApprovalDocs.map(doc => doc.travelRequestId.toString());
  
    // Filter travelRequests to get only those that match the travelRequestIds
    const matchedTravelRequests = travelRequests.filter(request =>
      allTravelRequestIds.includes(request.travelRequestId.toString())
    );

    const cashAdvanceIds = matchedTravelRequests.flatMap(request =>
      request.cashAdvanceData.map(cashAdvance => cashAdvance.cashAdvanceId)
    );

    const getReports = await updateCashAdvanceStatus(cashApprovalDocs, cashAdvanceIds, empId);

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
      const promises = [
       sendToOtherMicroservice(payload, 'approve-reject-ca', 'cash', 'To update cashAdvanceStatus to rejected in cash microservice'),
       sendToOtherMicroservice(payload, 'approve-reject-ca', 'approval', 'To update cashAdvanceStatus to rejected in cash microservice'),
      ]
      await Promise.all(promises)
x
    // Send updated travel to the dashboard synchronously
  //  const dashboardResponse = await sendToDashboardMicroservice(payload, 'approve-reject-ca',  'To update cashAdvanceStatus to rejected in cash microservice')

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


const expenseSchema = Joi.object({
  tenantId:Joi.string().required(),
  empId: Joi.string().required(),
  expenseHeaderId: Joi.string().required(),
  tripId: Joi.string().required()
})

async function getExpenseReport(tenantId,empId,tripId,expenseHeaderId){
  try{
    const expenseReport = await dashboard.findOne({
      'tripSchema.tenantId':tenantId,
      'tripSchema.tripId':tripId,
      'tripSchema.travelExpenseData':{
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
     throw new error(error)
   } 

   return expenseReport
  } catch (error){
    throw new error( error)
  }
}

// travel expense reports
export const approveExpenseReports = async (req, res) => {
  try {
    const { error, value} = expenseSchema.validate(req.params)
    if(error){
      return res.status(400).json({error: error.details[0].message})
    }
    const { tenantId,tripId, expenseHeaderId, empId } = value;

    console.log("expense report - params -- approve", req.params);

    const approvalDocument = await getExpenseReport(tenantId,empId,tripId,expenseHeaderId)

     if (!approvalDocument) {
       return res.status(404).json({ message: 'No matching approval document found for updating travel expenses status.' });
     }

     const { travelExpenseData} = approvalDocument.tripSchema
     const expenseReportFound = travelExpenseData.find(expense => expense.expenseHeaderId.toString() == expenseHeaderId);

     console.log("valid expenseReport", expenseReportFound);

     if (expenseReportFound) {
      const {expenseLines=[]} = expenseReportFound
      expenseLines.forEach(line => {
        if(line.lineItemStatus === 'pending approval'){
          line.lineItemStatus === 'approved'
        } 
      })

      expenseReportFound.approvers.forEach(approver => {
        if (approver.empId === empId && approver.status === 'pending approval') {
          approver.status = 'approved';
        }
      });

      const allApproved = expenseReportFound.approvers.every(approver => approver.status == 'approved');

      if (allApproved) {
       expenseReportFound.expenseHeaderStatus = 'approved';
      }

       // Save the updated approvalDocument document
       const expenseApproved = await approvalDocument.save();

       if(!expenseApproved){
         return res.status(404).json({message:`error occurred while updating expense report for ${name}`})
       }

     const { name } = expenseApproved.tripSchema.travelRequestData.createdBy;

     const { travelExpenseData } = expenseApproved.tripSchema;
     const matchedExpense = travelExpenseData.find(expense => expense.expenseHeaderId.toString() === expenseHeaderId);
     console.log("expense report approvers", matchedExpense)
     // Create the payload object
     const payload = {
       tenantId,
       expenseHeaderId,
       expenseHeaderStatus: 'approved',
       expenseRejectionReason: matchedExpense ? matchedExpense.expenseRejectionReason : '',
       approvers: matchedExpense ? matchedExpense.approvers : null,
     };

     console.log("payload for approve", payload);
     const action = 'expense-approval';
     const comments = 'expense report approved'
     // Assuming sendToOtherMicroservice and sendToDashboardMicroservice are defined elsewhere
    //  await sendToDashboardMicroservice(payload, action, comments,'approval', 'online', true);
    // const promises = [
    //   sendToOtherMicroservice(payload, action, 'trip', comments,  source='dashboard', onlineVsBatch='online'),
    //   sendToOtherMicroservice(payload, action, 'expense', comments,  source='dashboard', onlineVsBatch='online'),
    //   sendToOtherMicroservice(payload, action, 'approval', comments,  source='dashboard', onlineVsBatch='online'),
    // ]
    // await Promise.all(promises)

     return res.status(200).json({ message: `expense Report approved for ${name}` });
  }} catch (error) {
     console.error('An error occurred while updating Travel Expense status:', error.message);
     res.status(500).json({ error: 'An error occurred while updating Travel Expense status.' });
  }
};


export const rejectExpenseReports = async (req, res) => {
  try {
    const { error: errorParams, value: valueParams} = expenseSchema.validate(req.params)

    if(errorParams){
      return res.status(400).json({error: `Invalid Parameters ${errorParams.details[0].message}`})
    }
     const { tenantId, empId, expenseHeaderId,tripId, } = valueParams;

     console.log("expense report - params -- approve", req.params);

     const {error: errorBody, value : valueBody} = rejectSchema.validate(req.body)

     if(errorBody){
      return res.status(400).json({error: errorBody.details[0].message})
     }
     const { rejectionReason } = valueBody;

     const approvalDocument = await getExpenseReport(tenantId,empId,tripId,expenseHeaderId)

     if (!approvalDocument) {
       return res.status(404).json({ message: 'No matching approval document found for updating travel expenses status.' });
     }
 
     const { travelExpenseData} = approvalDocument.tripSchema
     const expenseReportFound = travelExpenseData.find(expense => expense.expenseHeaderId.toString() == expenseHeaderId);
 
     console.log("valid expenseReport", expenseReportFound);

     if (expenseReportFound) {
      const { expenseLines=[]} = expenseReportFound

      expenseLines.forEach(line => {
        if(line.lineItemStatus === 'pending approval'){
          line.lineItemStatus === 'rejected'
        }
      })

       expenseReportFound.approvers.forEach(approver => {
         if (approver.empId === empId && approver.status === 'pending approval') {
           approver.status = 'rejected';
         }
       });

       expenseReportFound.rejectionReason = rejectionReason
       expenseReportFound.expenseHeaderStatus = 'rejected';

       // Save the updated approvalDocument document
       const expenseApproved = await approvalDocument.save();

       if(!expenseApproved){
         return res.status(404).json({message:`error occurred while updating expense report for ${name}`})
       }

     const { name } = expenseApproved.tripSchema.travelRequestData.createdBy;

     const { travelExpenseData } = expenseApproved.tripSchema;
     const matchedExpense = travelExpenseData.find(expense => expense.expenseHeaderId.toString() === expenseHeaderId);
     console.log("expense report approvers", matchedExpense)
     // Create the payload object
     const payload = {
       tenantId,
       expenseHeaderId,
       expenseHeaderStatus: 'rejected',
       expenseRejectionReason: matchedExpense ? matchedExpense.expenseRejectionReason : '',
       approvers: matchedExpense ? matchedExpense.approvers : null,
     };

     console.log("payload for reject expense reports", payload);
     const action = 'expense-approval';
     const comments = 'expense report rejected at header level'
     // Assuming sendToOtherMicroservice and sendToDashboardMicroservice are defined elsewhere
    //  await sendToDashboardMicroservice(payload, action, comments,'approval', 'online', true);

    // const promises = [
    //   sendToOtherMicroservice(payload, action, 'trip', comments,  source='dashboard', onlineVsBatch='online'),
    //   sendToOtherMicroservice(payload, action, 'expense', comments,  source='dashboard', onlineVsBatch='online'),
    //   sendToOtherMicroservice(payload, action, 'approval', comments,  source='dashboard', onlineVsBatch='online'),
    // ]
    // await Promise.all(promises)
 
     return res.status(200).json({ message: `expense Report rejected for ${name}` });
  }} catch (error) {
     console.error('An error occurred while updating Travel Expense status:', error.message);
     res.status(500).json({ error: 'An error occurred while updating Travel Expense status.' });
  }
};


function updateExpenseLineStatus(expenseLines, approve = [], reject=[]) {
  return expenseLines.map(expenseLine => {
    if (approve.includes(expenseLine.expenseLineId)) {
      return { ...expenseLine, lineItemStatus: 'approved' };
    } else if (reject.includes(expenseLine.expenseLineId)) {
      return { ...expenseLine, lineItemStatus: 'rejected' };
    } else {
      return expenseLine;
    }
  });
}

const approveLineSchema = Joi.object({
  approve: Joi.array().items(Joi.string()).default([]),
  reject: Joi.array().items(Joi.string()).default([]),
});

const rejectLineSchema = Joi.object({
  approve: Joi.array().items(Joi.string()).default([]),
  reject: Joi.array().items(Joi.string()).default([]),
  rejectionReason: Joi.string().required()
});

export const approveExpenseLines = async (req, res) => {
  try {
    const { error, value} = expenseSchema.validate(req.params)
    if(error){
      return res.status(400).json({error: error.details[0].message})
    }
    const { tenantId,tripId, expenseHeaderId, empId } = value;

    const { approve, reject } = await approveLineSchema.validateAsync(req.body);

    console.log("expense report - params -- approve", req.params);

    const approvalDocument = await getExpenseReport(tenantId,empId,tripId,expenseHeaderId)

     if (!approvalDocument) {
       return res.status(404).json({ message: 'No matching approval document found for updating travel expenses status.' });
     }

     const { travelExpenseData} = approvalDocument.tripSchema
     const expenseReportFound = travelExpenseData.find(expense => expense.expenseHeaderId.toString() == expenseHeaderId);

     console.log("valid expenseReport", expenseReportFound);

     if (expenseReportFound) {
     const {expenseLines = []} =expenseReportFound

      const updatedExpenseLines = updateExpenseLineStatus(expenseLines, approve, reject)

      expenseReportFound.expenseLines = updatedExpenseLines
      const expenseLinesApproved = updatedExpenseLines.some(line => line.lineItemStatus === 'approved')
      const isPendingApproval = updatedExpenseLines.some(line => line.lineItemStatus === 'pending approval')
      const isRejected = updatedExpenseLines.some(line => line.lineItemStatus === 'rejected')


       const approver = expenseReportFound.approvers.find(approver =>
        approver.empId === empId && approver.status === 'pending approval'
       )

       if(approver && expenseLinesApproved && !isPendingApproval && !isRejected){
        approver.status = 'approved'
       } else if(approver && expenseLinesApproved && !isPendingApproval && isRejected ){
        approver.status = 'rejected'
       }

       const allApproved = expenseReportFound.approvers.every(approver => approver.status == 'approved');
 
       if (allApproved && expenseLinesApproved && !isPendingApproval)  {
        expenseReportFound.expenseHeaderStatus = 'approved';
       } else if (!allApproved && !isPendingApproval && isRejected){
        expenseReportFound.expenseHeaderStatus = 'rejected';
       }

       // Save the updated approvalDocument document
       const expenseApproved = await approvalDocument.save();

       if(!expenseApproved){
         return res.status(404).json({message:`error occurred while updating expense report for ${name}`})
       }

     const { name } = expenseApproved.tripSchema.travelRequestData.createdBy;

     const { travelExpenseData } = expenseApproved.tripSchema;
     const matchedExpense = travelExpenseData.find(expense => expense.expenseHeaderId.toString() === expenseHeaderId);
     console.log("expense report approvers", matchedExpense)
     // Create the payload object
     const payload = {
       tenantId,
       expenseHeaderId,
       expenseHeaderStatus: 'approved',
       expenseReport: matchedExpense 
     };

     console.log("payload for approve", payload);
     const action = 'expense-approval';
     const comments = 'expense report approved'
     // Assuming sendToOtherMicroservice and sendToDashboardMicroservice are defined elsewhere
    //  await sendToDashboardMicroservice(payload, action, comments,'approval', 'online', true);
    // const promises = [
    //   sendToOtherMicroservice(payload, action, 'trip', comments,  source='dashboard', onlineVsBatch='online'),
    //   sendToOtherMicroservice(payload, action, 'expense', comments,  source='dashboard', onlineVsBatch='online'),
    //   sendToOtherMicroservice(payload, action, 'approval', comments,  source='dashboard', onlineVsBatch='online'),
    // ]
    // await Promise.all(promises)

     return res.status(200).json({ message: `expense Report approved for ${name}` });
  }} catch (error) {
     console.error('An error occurred while updating Travel Expense status:', error.message);
     res.status(500).json({ error: 'An error occurred while updating Travel Expense status.' });
  }
};

export const rejectExpenseLines = async (req, res) => {
  try {
    const { error, value} = expenseSchema.validate(req.params)
    if(error){
      return res.status(400).json({error: error.details[0].message})
    }
    const { tenantId,tripId, expenseHeaderId, empId } = value;

    const { approve, reject, rejectionReason } =  rejectLineSchema.validate(req.body);

    console.log("expense report - params -- approve", req.params);

    const approvalDocument = await getExpenseReport(tenantId,empId,tripId,expenseHeaderId)

     if (!approvalDocument) {
       return res.status(404).json({ message: 'No matching approval document found for updating travel expenses status.' });
     }

     const { travelExpenseData} = approvalDocument.tripSchema
     const expenseReportFound = travelExpenseData.find(expense => expense.expenseHeaderId.toString() == expenseHeaderId);

     console.log("valid expenseReport", expenseReportFound);

     if (expenseReportFound) {
     const {expenseLines = []} =expenseReportFound

      const updatedExpenseLines = updateExpenseLineStatus(expenseLines, approve, reject)

      expenseReportFound.expenseLines = updatedExpenseLines
      const isRejected = updatedExpenseLines.some(line => line.lineItemStatus === 'rejected')
      const isPendingApproval = updatedExpenseLines.some(line => line.lineItemStatus === 'pending approval')

       const approver = expenseReportFound.approvers.find(approver =>
        approver.empId === empId && approver.status === 'pending approval'
       )

       if(approver && isRejected && !isPendingApproval){
        approver.status = 'rejected';
        expenseReportFound.expenseHeaderStatus = 'rejected';
        expenseReportFound.rejectionReason = rejectionReason
       }

       // Save the updated approvalDocument document
       const expenseApproved = await approvalDocument.save();

       if(!expenseApproved){
         return res.status(404).json({message:`error occurred while updating expense report for ${name}`})
       }

     const { name } = expenseApproved.tripSchema.travelRequestData.createdBy;

     const { travelExpenseData } = expenseApproved.tripSchema;
     const matchedExpense = travelExpenseData.find(expense => expense.expenseHeaderId.toString() === expenseHeaderId);
     console.log("expense report approvers", matchedExpense)
     // Create the payload object
     const payload = {
       tenantId,
       expenseHeaderId,
       expenseHeaderStatus: 'rejected',
       expenseReport:matchedExpense
     };

     console.log("payload for approve", payload);
     const action = 'expense-approval';
     const comments = 'expense report approved'
     // Assuming sendToOtherMicroservice and sendToDashboardMicroservice are defined elsewhere
    //  await sendToDashboardMicroservice(payload, action, comments,'approval', 'online', true);
    // const promises = [
    //   sendToOtherMicroservice(payload, action, 'trip', comments,  source='dashboard', onlineVsBatch='online'),
    //   sendToOtherMicroservice(payload, action, 'expense', comments,  source='dashboard', onlineVsBatch='online'),
    //   sendToOtherMicroservice(payload, action, 'approval', comments,  source='dashboard', onlineVsBatch='online'),
    // ]
    // await Promise.all(promises)

     return res.status(200).json({ message: `expense Report approved for ${name}` });
  }} catch (error) {
     console.error('An error occurred while updating Travel Expense status:', error.message);
     res.status(500).json({ error: 'An error occurred while updating Travel Expense status.' });
  }
};


const otherExpenseSchema = Joi.object({
  tenantId:Joi.string().required(),
  empId: Joi.string().required(),
  expenseHeaderId: Joi.string().required(),
})

async function getNonTravelExpenseReport(tenantId,empId,expenseHeaderId){
try{
  const report = await dashboard.findOne({
    'reimbursementSchema.tenantId':tenantId,
    'reimbursementSchema':{
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

 if(report){
  return report
 } else{
  throw new error(error)
 }
} catch(error){
  throw new error(error)
}
}

// non travel expense reports
export const approveNonTravelExpenseReports = async (req, res) => {
  try {
    const { error, value} = otherExpenseSchema.validate(req.params)
    if(error){
      return res.status(400).json({error: error.details[0].message})
    }

     const { tenantId, expenseHeaderId, empId } = value;
     console.log("expense report - params -- approve", req.params);


     const approvalDocument = await getNonTravelExpenseReport(tenantId,empId,expenseHeaderId)
 
     if (!approvalDocument) {
       return res.status(404).json({ message: 'No matching approval document found for updating travel expenses status.' });
     }
 
     const { reimbursementSchema={}} = approvalDocument

     const { createdBy:{name = ''} = {}} = reimbursementSchema
 
     console.log("valid expenseReport", expenseReportFound);

     reimbursementSchema.approvers.forEach(approver => {
         if (approver.empId === empId && approver.status === 'pending approval') {
           approver.status = 'approved';
         }
       });
 
       const allApproved = approvers.every(approver => approver.status == 'approved');
 
       if (allApproved) {
        expenseHeaderStatus = 'approved';
       }
 
       // Save the updated approvalDocument document
       const expenseApproved = await approvalDocument.save();

       if(!expenseApproved){
         return res.status(404).json({message:`error occurred while updating expense report for ${name}`})
       } else {

        const { name } = expenseApproved?.reimbursementSchema?.createdBy;

        const { reimbursementSchema } = expenseApproved;

        console.log("expense report approvers", matchedExpense)
        // Create the payload object
        const payload = {
          tenantId,
          expenseHeaderId,
          expenseHeaderStatus: 'approved',
          rejectionReason: reimbursementSchema?.rejectionReason ||'',
          approvers: reimbursementSchema?.approvers,
        };

     console.log("payload for approve", payload);
     const action = 'partial-update';
     const comments = 'Non Travel expense report approved at header level'

     // Assuming sendToOtherMicroservice and sendToDashboardMicroservice are defined elsewhere
// const promises = [
//    sendToOtherMicroservice(payload, action, 'expense', comments, source='dashboard', onlineVsBatch='online'),
//    sendToOtherMicroservice(payload, action, 'approval', comments, source='dashboard', onlineVsBatch='online'),
// ]
//   await Promise.all(promises)
     return res.status(200).json({ message: `expense Report approved for ${name}` });
      }
    } catch (error) {
    console.error('An error occurred while updating Travel Expense status:', error.message);
    res.status(500).json({ error: 'An error occurred while updating Travel Expense status.' });
  }
};

export const rejectNonTravelExpenseReports = async (req, res) => {
  try {
    const { error: errorParams, value: valueParams} = otherExpenseSchema.validate(req.params)

    if(errorParams){
      return res.status(400).json({error: `Invalid Parameters ${errorParams.details[0].message}`})
    }
     const { tenantId, expenseHeaderId, empId } = valueParams;

     console.log("expense report - params -- approve", req.params);

     const {error: errorBody, value : valueBody} = rejectSchema.validate(req.body)

     if(errorBody){
      return res.status(400).json({error: errorBody.details[0].message})
     }
     const { rejectionReason } = valueBody;

     const approvalDocument = await getNonTravelExpenseReport(tenantId,empId,expenseHeaderId)
 
     if (!approvalDocument) {
       return res.status(404).json({ message: 'No matching approval document found for updating travel expenses status.' });
     }
 
     const { reimbursementSchema} = approvalDocument
  
     reimbursementSchema.approvers.forEach(approver => {
         if (approver.empId === empId && approver.status === 'pending approval') {
           approver.status = 'rejected';
         }
       });

       reimbursementSchema.rejectionReason = rejectionReason
       reimbursementSchema.expenseHeaderStatus = 'rejected';

       // Save the updated approvalDocument document
       const expenseApproved = await approvalDocument.save();

       if(!expenseApproved){
         return res.status(404).json({message:`error occurred while updating expense report for ${name}`})
       } else {
        const { name } = expenseApproved?.reimbursementSchema?.createdBy;

        const { reimbursementSchema } = expenseApproved;

        console.log("expense report approvers", matchedExpense)
        // Create the payload object
        const payload = {
          tenantId,
          expenseHeaderId,
          expenseHeaderStatus: 'rejected',
          rejectionReason: reimbursementSchema?.rejectionReason ||'',
          approvers: reimbursementSchema?.approvers,
        };
    
        console.log("payload for rejected non travel report", payload);
        const action = 'partial-update';
        const comments = 'non travel expense report rejected at header level'
        // Assuming sendToOtherMicroservice and sendToDashboardMicroservice are defined elsewhere
    //  const promises = [
    //    sendToOtherMicroservice(payload, action, 'expense', comments,  source='dashboard', onlineVsBatch='online'),
    //    sendToOtherMicroservice(payload, action, 'approval', comments,  source='dashboard', onlineVsBatch='online'),
    //  ]
    
    //  await Promise.all(promises);
       //  await sendToDashboardMicroservice(payload, action, comments,'approval', 'online', true);
    return res.status(200).json({ message: `expense Report rejected for ${name}` });

       }

     } catch (error) {
     console.error('An error occurred while updating Travel Expense status:', error.message);
     res.status(500).json({ error: 'An error occurred while updating Travel Expense status.' });
  }
};

//approve nte line items
export const approveNonTravelExpenseLines = async (req, res) => {
  try {
    const { error, value} = otherExpenseSchema.validate(req.params)
    if(error){
      return res.status(400).json({error: error.details[0].message})
    }

     const { tenantId, expenseHeaderId, empId } = value;
     console.log("expense report - params -- approve", req.params);
     
     const {error: errorBody, value: valueBody} = approveLineSchema.validate(req.body)
     if(errorBody){
      return res.status(400).json({error: error.details[0].message})
     }

     const { approve, reject} = valueBody

     const approvalDocument = await getNonTravelExpenseReport(tenantId,empId,expenseHeaderId)
 
     if (!approvalDocument) {
       return res.status(404).json({ message: 'No matching approval document found for updating travel expenses status.' });
     }
 
     const { reimbursementSchema={}} = approvalDocument

     const { createdBy:{name = ''} = {}} = reimbursementSchema
 
     console.log("valid expenseReport", reimbursementSchema);

     const {expenseLines = []} =reimbursementSchema

     const updatedExpenseLines = updateExpenseLineStatus(expenseLines, approve, reject)

     reimbursementSchema.expenseLines = updatedExpenseLines
     const expenseLinesApproved = updatedExpenseLines.some(line => line.lineItemStatus === 'approved')
     const isPendingApproval = updatedExpenseLines.some(line => line.lineItemStatus === 'pending approval')
     const isRejected = updatedExpenseLines.some(line => line.lineItemStatus === 'rejected')


      const approver = reimbursementSchema.approvers.find(approver =>
       approver.empId === empId && approver.status === 'pending approval'
      )

      if(approver && expenseLinesApproved && !isPendingApproval && !isRejected){
       approver.status = 'approved'
      } else if(approver && expenseLinesApproved && !isPendingApproval && isRejected ){
       approver.status = 'rejected'
      }

      const allApproved = reimbursementSchema.approvers.every(approver => approver.status == 'approved');

      if (allApproved && expenseLinesApproved && !isPendingApproval)  {
       reimbursementSchema.expenseHeaderStatus = 'approved';
      } else if (!allApproved && !isPendingApproval && isRejected){
       reimbursementSchema.expenseHeaderStatus = 'rejected';
      }

      // Save the updated approvalDocument document
       const expenseApproved = await approvalDocument.save();

       if(!expenseApproved){
         return res.status(404).json({message:`error occurred while updating expense report for ${name}`})
       } else {

        const { name } = expenseApproved?.reimbursementSchema?.createdBy;

        const { reimbursementSchema } = expenseApproved;

        console.log("expense report approvers", matchedExpense)
        // Create the payload object
        const payload = {
          tenantId,
          expenseHeaderId,
          expenseHeaderStatus: 'rejected',
          reimbursementSchema: reimbursementSchema
        };

     console.log("payload for approve", payload);
     const action = 'full-update';
     const comments = 'Non Travel expense report approved for line items'

     // Assuming sendToOtherMicroservice and sendToDashboardMicroservice are defined elsewhere
// const promises = [
//    sendToOtherMicroservice(payload, action, 'expense', comments, source='dashboard', onlineVsBatch='online'),
//    sendToOtherMicroservice(payload, action, 'approval', comments, source='dashboard', onlineVsBatch='online'),
// ]
//   await Promise.all(promises)
     return res.status(200).json({ message: `expense Report approved for ${name}` });
      }
    } catch (error) {
    console.error('An error occurred while updating Travel Expense status:', error.message);
    res.status(500).json({ error: 'An error occurred while updating Travel Expense status.' });
  }
};

//reject nte line items
export const rejectNonTravelExpenseLines = async (req, res) => {
  try {
    const { error: errorParams, value: valueParams} = otherExpenseSchema.validate(req.params)

    if(errorParams){
      return res.status(400).json({error: `Invalid Parameters ${errorParams.details[0].message}`})
    }
     const { tenantId, expenseHeaderId, empId } = valueParams;

     console.log("expense report - params -- approve", req.params);

     const {error: errorBody, value : valueBody} = rejectLineSchema.validate(req.body)

     if(errorBody){
      return res.status(400).json({error: errorBody.details[0].message})
     }
     const {  approve, reject, rejectionReason } = valueBody;

     const approvalDocument = await getNonTravelExpenseReport(tenantId,empId,expenseHeaderId)
 
     if (!approvalDocument) {
       return res.status(404).json({ message: 'No matching approval document found for updating travel expenses status.' });
     }
 
     const { reimbursementSchema} = approvalDocument
  
     const {expenseLines = []} =reimbursementSchema

      const updatedExpenseLines = updateExpenseLineStatus(expenseLines, approve, reject)

      reimbursementSchema.expenseLines = updatedExpenseLines
      const isRejected = updatedExpenseLines.some(line => line.lineItemStatus === 'rejected')
      const isPendingApproval = updatedExpenseLines.some(line => line.lineItemStatus === 'pending approval')

       const approver = reimbursementSchema.approvers.find(approver =>
        approver.empId === empId && approver.status === 'pending approval'
       )

       if(approver && isRejected && !isPendingApproval){
        approver.status = 'rejected';
        reimbursementSchema.expenseHeaderStatus = 'rejected';
        reimbursementSchema.rejectionReason = rejectionReason
       }

       // Save the updated approvalDocument document
      const expenseApproved = await approvalDocument.save();

       if(!expenseApproved){
         return res.status(404).json({message:`error occurred while updating expense report for ${name}`})
       } else {
        const { name } = expenseApproved?.reimbursementSchema?.createdBy;

        const { reimbursementSchema } = expenseApproved;

        console.log("expense report approvers", matchedExpense)
        // Create the payload object
        const payload = {
          tenantId,
          expenseHeaderId,
          expenseHeaderStatus: 'rejected',
          reimbursement:reimbursementSchema
        };
    
        console.log("payload for approve", payload);
        const action = 'full-update';
        const comments = 'non travel expense report rejected at line item level'
        // Assuming sendToOtherMicroservice and sendToDashboardMicroservice are defined elsewhere
    //  const promises = [
    //    sendToOtherMicroservice(payload, action, 'expense', comments,  source='dashboard', onlineVsBatch='online'),
    //    sendToOtherMicroservice(payload, action, 'approval', comments,  source='dashboard', onlineVsBatch='online'),
    //  ]
    //  await Promise.all(promises);
       //  await sendToDashboardMicroservice(payload, action, comments,'approval', 'online', true);
    return res.status(200).json({ message: `expense Report rejected for ${name}` });

      }
     } catch (error) {
     console.error('An error occurred while updating Travel Expense status:', error.message);
     res.status(500).json({ error: 'An error occurred while updating Travel Expense status.' });
  }
};
