import Joi from "joi";
import { employeeSchema } from "../controllersRoleBased/roleBasedController.js";
import dashboard from "../models/dashboardSchema.js";
import { sendToOtherMicroservice } from "../rabbitmq/publisher.js";

const status = {
  PENDING_APPROVAL:'pending approval'
}

// const updateCashAdvanceStatus = async (cashApprovalDocs, cashAdvanceIds, empId, getAction,rejectionReason) => {
//   const validActions = {
//     "approved":"approved",
//     "rejected":"rejected"
//   }
//   const getStatus = validActions[getAction]
//   if(getStatus === undefined) {
//   throw new Error('getAction is needed and must be approved or rejected')
//   }

//   const updateApproverStatus = (approvers, empId) =>
//     approvers.map(approver => 
//       approver.empId === empId && approver.status === 'pending approval'
//         ? { ...approver, status: getStatus }
//         : approver
//     );

//   const isAllApproved = approvers =>
//     approvers.every(approver => approver.status === 'approved');

//   const isRejected = approvers => 
//     approvers.some(approver => approver.status === 'rejected')

//   const updateCashAdvancesData = (cashAdvancesData, cashAdvanceIds, empId) =>
//     cashAdvancesData.map(cashAdvance => {
//       if (cashAdvanceIds.includes(cashAdvance?.cashAdvanceId.toString())) {
//         const updatedApprovers = updateApproverStatus(cashAdvance.approvers, empId);
//         let cashAdvanceStatus = isAllApproved(updatedApprovers) ? 'approved' : cashAdvance.cashAdvanceStatus;
//         cashAdvanceStatus = isRejected(updatedApprovers) ? 'rejected': cashAdvance.cashAdvanceStatus;
//         rejectionReason = (cashAdvanceStatus === 'rejected') ? rejectionReason : ''
//         return { ...cashAdvance, approvers: updatedApprovers, cashAdvanceStatus,rejectionReason };
//       }
//       return cashAdvance;
//     });

//   const updateDocs = async cashApprovalDocs => {
//     for (const cashApprovalDoc of cashApprovalDocs) {
//       cashApprovalDoc.cashAdvancesData = updateCashAdvancesData(
//         cashApprovalDoc.cashAdvancesData,
//         cashAdvanceIds,
//         empId,
//       );
//       try {
//         await cashApprovalDoc.save();
//         console.log(`Successfully updated cashApprovalDoc: ${cashApprovalDoc._id}`);
//       } catch (error) {
//         console.error(`Error updating cashApprovalDoc: ${cashApprovalDoc._id}`, error);
//       }
//     }
//   };

//   await updateDocs(cashApprovalDocs);
// };
const updateCashAdvanceStatus = async (cashApprovalDocs, cashAdvanceIds, empId, getAction,rejectionReason) => {
  console.group("updateCashAdvanceStatus")
  console.log("cashApprovalDocs, cashAdvanceIds, empId, getAction,rejectionReason",cashApprovalDocs, cashAdvanceIds, empId, getAction,rejectionReason)
  const validActions = {
    "approved":"approved",
    "rejected":"rejected"
  }
  const getStatus = validActions[getAction]
  if(getStatus === undefined) {
  throw new Error('getAction is needed and must be approved or rejected')
  }

  const updateApproverStatus = (approvers, empId) =>
    approvers.map(approver => 
      approver.empId === empId && approver.status === 'pending approval'
        ? { ...approver, status: getStatus }
        : approver
    );
    console.groupCollapsed('Detailed Information');
    console.log("one",updateApproverStatus)

  const isAllApproved = approvers =>
    approvers.every(approver => approver.status === 'approved');

  const isRejected = approvers => 
    approvers.some(approver => approver.status === 'rejected')

    const updateCashAdvancesData = (cashAdvancesData, cashAdvanceIds, empId) =>
      cashAdvancesData.map(cashAdvance => {
        if (cashAdvanceIds.includes(cashAdvance?.cashAdvanceId.toString())) {
          const updatedApprovers = updateApproverStatus(cashAdvance.approvers, empId);
          let cashAdvanceStatus = isRejected(updatedApprovers) ? 'rejected' : 
                                  (isAllApproved(updatedApprovers) ? 'approved' : cashAdvance.cashAdvanceStatus);
          rejectionReason = (cashAdvanceStatus === 'rejected') ? rejectionReason : '';
          return { ...cashAdvance, approvers: updatedApprovers, cashAdvanceStatus, rejectionReason };
        }
        return cashAdvance;
      });

    console.log("updateCashAdvancesData hero",updateCashAdvancesData)

  const updateDocs = async cashApprovalDocs => {
    for (const cashApprovalDoc of cashApprovalDocs) {
      console.log("cashDocument", cashApprovalDoc.cashAdvanceSchema.cashAdvancesData)
      cashApprovalDoc.cashAdvanceSchema.cashAdvancesData = updateCashAdvancesData(
        cashApprovalDoc.cashAdvanceSchema.cashAdvancesData,
        cashAdvanceIds,
        empId,
      );
      try {
      await cashApprovalDoc.save();
      } catch (error) {
        console.error(`Error updating cashApprovalDoc: ${cashApprovalDoc._id}`, error);
      }
    }
  };

  console.log("updateDocs",updateDocs)
  console.groupEnd()
  console.log('cash status updated ');
console.groupEnd()
 await updateDocs(cashApprovalDocs);

};


const approveSchema = Joi.object({
    tenantId:Joi.string().required(),
    empId:Joi.string().required(),
})


const bodySchema = Joi.object({
  travelRequests: Joi.array().items(
      Joi.object({
          travelRequestId: Joi.string().required(),
          cashAdvanceData: Joi.array().items(
              Joi.object({
                  cashAdvanceId: Joi.string()
              })
          ).optional() 
      })
  ).required()
});

const rejBodySchema = Joi.object({
    travelRequests:Joi.array().required(),
    rejectionReason:Joi.string().required()
})

const raisedLaterReqSchema = Joi.object({
    tenantId: Joi.string().required(),
    empId:Joi.string().required(),
    travelRequestId: Joi.string().required(),
    cashAdvanceId:Joi.string().required(),
})

async function getReportsForApproval(tenantId, empId, travelRequestIds) {
  try {
      console.log("I am here", tenantId, empId, travelRequestIds);

      const getTravelRequestStatus = { $in: ['pending approval', 'approved','pending booking', 'booked'] }
      // Query the database for reports
      const getReports = await dashboard.find({
          tenantId,
          'travelRequestId': { $in: travelRequestIds },
          $or: [
              {
                  'travelRequestSchema.travelRequestStatus': getTravelRequestStatus,
                  'travelRequestSchema.isCashAdvanceTaken': false,
                  'travelRequestSchema.approvers': {
                      $elemMatch: {
                          empId,
                          status: 'pending approval'
                      }
                  }
              },
              {
                  'cashAdvanceSchema.travelRequestData.travelRequestStatus': getTravelRequestStatus,
                  'cashAdvanceSchema.travelRequestData.isCashAdvanceTaken': true,
                  'cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus': { $in: ['pending approval', 'draft'] },
                  'cashAdvanceSchema.cashAdvancesData.approvers': {
                      $elemMatch: { empId, status: 'pending approval' }
                  }
              }
          ]
      });

      if (getReports?.length) {
          console.log("Hero", getReports);

          // Filter reports for travel requests
          const travelReports = getReports?.filter(report =>
              report?.travelRequestSchema && 
              report?.travelRequestSchema?.travelRequestStatus === 'pending approval' &&
              report?.travelRequestSchema?.approvers.some(approver =>
                  approver.empId === empId && approver.status === 'pending approval'
              )
          );

          // console.log("Travel Reports", travelReports);

          // Filter reports for cash raised later
          const cashReports = getReports?.filter(report =>
              report?.cashAdvanceSchema &&
              ['approved', 'booked','pending booking'].includes(report?.cashAdvanceSchema?.travelRequestData?.travelRequestStatus) &&
              report?.cashAdvanceSchema?.travelRequestData.isCashAdvanceTaken === true &&
              report?.cashAdvanceSchema.cashAdvancesData.some(advance =>
                advance.cashAdvanceStatus.includes('pending approval') &&
                advance.approvers.some(approver => 
                  approver.empId === empId && approver.status === 'pending approval'
                )
              )
          );

          console.log("Travel Reports", travelReports);
          console.log("Cash Reports", cashReports);

          return [travelReports, cashReports];
      }
    return [[], []];

  } catch (error) {
      throw new Error('Documents Not found for approval ...');
  }
}


export async function approveAll(req,res){
    try{  
      const [paramsValue, bodyValue] = await Promise.all([
        approveSchema.validateAsync(req.params),
        bodySchema.validateAsync(req.body)
      ])

      const { tenantId, empId,} = paramsValue
      const { travelRequests } = bodyValue;
      const travelRequestIds = travelRequests.map(obj => obj.travelRequestId);

    //   const { payloadCash, payloadTravel } = travelRequests.reduce((acc, travelRequest) => {
    //     if (travelRequest?.cashAdvances?.length > 0) {
    //         acc.payloadCash.push(travelRequest);
    //     } else {
    //         acc.payloadTravel.push(travelRequest);
    //     }
    //     return acc;
    // }, { payloadCash: [], payloadTravel: [] });

      const [travelReports, cashReports] = await getReportsForApproval(tenantId,empId, travelRequestIds)

     console.log("travelReports, cashReports", travelReports)
     if(!travelReports.length && !cashReports.length){
      return res.status(404).json({error: 'Documents Not found for approval'})
     } 

    const approvalDocs = []

    if(travelReports.length ){
      console.log("its travel ms")
      approvalDocs.push(approveAllTravelWithCash(tenantId, empId,travelReports))
    }
    if(cashReports.length){
      console.log("cash ms")
      approvalDocs.push(approveCashAdvance(tenantId,empId,cashReports))
    }

    if(!approvalDocs?.length){
      return res.status(400).json({ success:true , message: "Failed to approve: No approval documents found.!!"})   
    }

      console.log("approveAllTravelWithCash",tenantId, empId, travelRequestIds)
      const reports= await Promise.all(approvalDocs)  

      if(reports){
        console.log("approveAll promise", reports)
        return res.status(200).json({ success:true , message: "Approved Successfully !!", reports: reports.flat()})   
      } 
      }catch(error){
     console.error('error', error.message)
     if(error.isJoi){
       return res.status(400).json({ error: error.details[0].message})
     }
     return res.status(500).json({ success: false, error: error.message})
    }
}

// approve travel Request with/without cash advance
export const approveAllTravelWithCash = async (tenantId, empId, travelReports) => {
  try {
    console.log("approveAllTravelWithCash",tenantId, empId, )
    const allTravelRequests = []
    const allTravelRequestsWithCash=[]

    const approvedDocs = await Promise.all(travelReports.map(async (travelReport) => {
      const { travelRequestSchema={} } = travelReport;
      console.log("travelRequestSchema - 1", travelRequestSchema)
     const {travelRequestStatus='',isCashAdvanceTaken=false, approvers} = travelRequestSchema
     const isApproval = travelRequestStatus == 'pending approval'
    if(isCashAdvanceTaken && isApproval){
      const { travelRequestData } = travelReport?.cashAdvanceSchema;
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

      travelReport.cashAdvanceSchema.travelRequestData.approvers = updatedApprovers;
      const allApproved = updatedApprovers.every(approver => approver.status === 'approved');
      if (allApproved) {
        travelReport.cashAdvanceSchema.travelRequestData.travelRequestStatus = 'approved';
      }

      //cash
      const { cashAdvancesData } = travelReport.cashAdvanceSchema;

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

       allTravelRequestsWithCash.push(travelReport)
     } else if (isApproval){

      const { itinerary, approvers } = travelRequestSchema;
      console.log("travelRequestSchema - 2", itinerary, approvers)

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

      travelReport.travelRequestSchema.approvers = updatedApprovers;
      const allApproved = updatedApprovers.every(approver => approver.status === 'approved');
      if (allApproved) {
        travelReport.travelRequestSchema.travelRequestStatus = 'approved';
      }

      allTravelRequests.push(travelReport)

    }
    await travelReport.save();
    }));

    console.log("allTravelRequests", allTravelRequests)
    const payloadToTravel = allTravelRequests.map(doc => ({
     tenantId:doc.tenantId,
     travelRequestId: doc.travelRequestId ?doc.travelRequestId.toString() : null,
     approvers:doc.travelRequestSchema.approvers,
     travelRequestStatus:doc.travelRequestSchema.travelRequestStatus,
     rejectionReason:doc.travelRequestSchema.rejectionReason || null,
    }))

    const payloadToCash = allTravelRequestsWithCash.map(doc => {
      const tenantId = doc.tenantId
      const travelRequestId = doc.travelRequestId ? doc.travelRequestId.toString() : null
      const approvers = doc.cashAdvanceSchema.travelRequestData.approvers
      const travelRequestStatus = doc.cashAdvanceSchema.travelRequestData.travelRequestStatus
      const rejectionReason = doc.cashAdvanceSchema.travelRequestData.rejectionReason || ''
      const cashAdvances = doc.cashAdvanceSchema.cashAdvancesData.map(cash => {
        const cashAdvanceId = cash.cashAdvanceId ? cash.cashAdvanceId.toString() : ''
        const cashAdvanceStatus = cash.cashAdvanceStatus
        const amountDetails = cash.amountDetails
        const approvers = cash.approvers
        const cashAdvanceRejectionReason = cash.cashAdvanceRejectionReason

        return {cashAdvanceId,cashAdvanceStatus,amountDetails,approvers,cashAdvanceRejectionReason}
      })

    return{tenantId, travelRequestId, approvers, travelRequestStatus, rejectionReason , cashAdvances}
    }) 


    console.log("total approved",approvedDocs.length)

    console.log("payloadToTravel", payloadToTravel, "payloadToCash", payloadToCash)

    if(allTravelRequests?.length > 0){
      console.log("allTravelRequests", payloadToTravel)
      sendToOtherMicroservice(payloadToTravel,  'approve-reject-tr', 'travel', 'approve travelRequests', 'dashboard', 'online')
      sendToOtherMicroservice(payloadToTravel,  'approve-reject-tr', 'approval', 'approve travelRequests', 'dashboard', 'online')

    } else if (allTravelRequestsWithCash?.length > 0){
      console.log("payloadToCash", payloadToCash)
      sendToOtherMicroservice(payloadToCash,  'approve-reject-ca', 'cash', 'approve travelRequests with cash','dashboard','online')
      sendToOtherMicroservice(payloadToCash,  'approve-reject-ca', 'approval', 'approve travelRequests with cash','dashboard','online')
    }

    if (allTravelRequests?.length > 0 ||allTravelRequestsWithCash?.length > 0) {
      return ({ success:true, message: `Travel requests are approved` });
    }
  } 
   catch (error) {
    console.error('An error occurred while updating approval:', error.message);
    throw new Error({ error: 'Failed to update approval.', error });
  }
}

// travel with cash advance -- approve cashAdvance raised later
export const approveCashAdvance = async (tenantId, empId,cashReports) => {
  console.log("Starting cash advance approval process...");
  try {

    // const cashAdvanceIds = cashReports.flatMap(request =>
    //   request.cashAdvanceData.map(cashAdvance => cashAdvance.cashAdvanceId)
    // );
    const travelRequestIds = cashReports.map(report => report.cashAdvanceSchema.travelRequestData.travelRequestId.toString())


    const cashAdvanceIds = cashReports.flatMap(report =>
      report.cashAdvanceSchema?.cashAdvancesData.map(cashAdvance => cashAdvance.cashAdvanceId) || []
    );

    console.log(cashReports);
console.log(cashAdvanceIds); 


    await updateCashAdvanceStatus(cashReports, cashAdvanceIds, empId,"approved");

    const getApproval = await dashboard.find({ travelRequestId: { $in: travelRequestIds } });   
    console.log("what will be returned -------", getApproval)

    console.log("getApproval", getApproval)
    const payload = getApproval.map(doc =>
      ({
        tenantId:doc.tenantId,
        travelRequestId:doc.travelRequestId,
        travelRequestStatus:doc.cashAdvanceSchema.travelRequestData.travelRequestStatus,
        rejectionReason:doc?.cashAdvanceSchema.travelRequestData.rejectionReason || null,
        cashAdvances:doc?.cashAdvanceSchema.cashAdvancesData.map(cash =>({
          cashAdvanceId: cash?.cashAdvanceId,
          cashAdvanceStatus: cash?.cashAdvanceStatus,
          approvers:cash.approvers,
          rejectionReason:null,
        }))
      })
      )

      const isBooked = payload.filter(trip => trip.travelRequestStatus === 'booked')

          if(isBooked && isBooked.length){
            await sendToOtherMicroservice(isBooked,'approve-reject-ca-later','trip', 'To update cashAdvanceStatus to approved -cash advance raised later')
            await sendToOtherMicroservice(isBooked,'approve-reject-ca-later','expense', 'To update cashAdvanceStatus to approved -cash advance raised later')
          }

    // send Rejected cash advance to Cash microservice
    const promises = [
      sendToOtherMicroservice(payload, 'approve-reject-ca-later', 'cash', 'To update cashAdvanceStatus to rejected in cash microservice'),
      sendToOtherMicroservice(payload, 'approve-reject-ca-later', 'approval', 'To update cashAdvanceStatus to rejected in cash microservice'),
     ]
    await Promise.all(promises)

   // Send updated travel to the dashboard synchronously
 //  const dashboardResponse = await sendToDashboardMicroservice(payload, 'approve-reject-ca',  'To update cashAdvanceStatus to rejected in cash microservice')


  return ({ message: `Cash Advance approved` });

 } catch (error) {
   console.error('An error occurred while updating approval:', error.message);
   throw new Error({ error: 'Failed to update approval.', error: error.message });
 }
};

const rejectSchema = Joi.object({
  rejectionReason:Joi.string().required()
})



export async function rejectAll(req,res){
try{
  const {error : paramsError, value: paramsValue} = approveSchema.validate(req.params)
  if(paramsError){
    return res.status(400).json({error: paramsError.details[0].message})
  }

  const { error:bodyError , value: bodyValue} = rejBodySchema.validate(req.body)
  if(bodyError){
    return res.status(400).json({error: bodyError.details[0].message})
  }

  const { tenantId, empId,} = paramsValue
  const {travelRequests,rejectionReason } = bodyValue; 

      const travelRequestIds = travelRequests.map(item => item.travelRequestId)
      // const travelAndCashIds = travelRequests.filter(item => item?.cashAdvanceData && item?.cashAdvanceData.length > 0)
      const [travelReports, cashReports] = await getReportsForApproval(tenantId,empId, travelRequestIds)

      if(!travelReports.length && !cashReports.length){
      return res.status(404).json({error: 'Documents Not found for approval'})
      } 

    const approvalDocs = []

    if(travelReports.length){
      console.log("just travel")
      approvalDocs.push(rejectAllTravelWithCash(tenantId, empId,travelReports,rejectionReason))

    }
    if(cashReports.length){
      console.log("just cash")
      approvalDocs.push(rejectCashAdvance(tenantId,empId,cashReports,rejectionReason))
    }

      console.log("reject all",tenantId, empId, travelRequestIds)
      const reports= await Promise.all(approvalDocs)  

      if(reports){
        console.log("reject all promise", reports)
        return res.status(200).json({ success:true , message: "reject Successfully !!", reports: reports.flat()})   
      } 
      }catch(error){
      console.error('error', error.message)
      if(error.isJoi){
        return res.status(400).json({ error: error.details[0].message})
      }
      return res.status(500).json({ success: false, error: error.message})
    }
}

// reject travel request with/without cash advance
export const rejectAllTravelWithCash = async (tenantId, empId,travelReports,rejectionReason) => {
  try {
    console.log("rejectAllTravelWithCash",tenantId, empId,rejectionReason )
    
    if (travelReports?.length === 0) {
      throw new Error('Travel requests not found.');
    }

    const allTravelRequests = []
    const allTravelRequestsWithCash=[]

    const approvedDocs = await Promise.all(travelReports.map(async (cashApprovalDoc) => {
      const { travelRequestSchema={} } = cashApprovalDoc;

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


      allTravelRequestsWithCash.push(cashApprovalDoc)
    } else {

      const { travelRequestSchema = {} } = cashApprovalDoc;
      const { itinerary ={} , approvers = [] } = travelRequestSchema;
  
      if (typeof itinerary === 'object') {
        const itineraryRejected = Object.values(itinerary).flatMap(Object.values);
  
      itineraryRejected.forEach(booking => {  
        booking.approvers.forEach(approver => {
          if(approver.empId === empId && approver.status == 'pending approval' && booking.status == 'pending approval'){
          approver.status = 'rejected'
          booking.rejectionReason = rejectionReason
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
    await cashApprovalDoc.save();
    }));

    const payloadToTravel = allTravelRequests.map(doc => ({
      tenantId:doc.tenantId,
      travelRequestId: doc.travelRequestId ?doc.travelRequestId.toString() : null,
      approvers:doc.travelRequestSchema.approvers,
      travelRequestStatus:doc.travelRequestSchema.travelRequestStatus,
      rejectionReason:doc.travelRequestSchema.rejectionReason || null,
     }))

     const payloadToCash = allTravelRequestsWithCash.map(doc => {
       const tenantId = doc.tenantId
       const travelRequestId = doc.travelRequestId ? doc.travelRequestId.toString() : null
       const approvers = doc.cashAdvanceSchema.travelRequestData.approvers
       const travelRequestStatus = doc.cashAdvanceSchema.travelRequestData.travelRequestStatus
       const rejectionReason = doc.cashAdvanceSchema.travelRequestData.rejectionReason || ''
       const cashAdvances = doc.cashAdvanceSchema.cashAdvancesData.map(cash => {
         const cashAdvanceId = cash.cashAdvanceId ? cash.cashAdvanceId.toString() : ''
         const cashAdvanceStatus = cash.cashAdvanceStatus
         const amountDetails = cash.amountDetails
         const approvers = cash.approvers
         const cashAdvanceRejectionReason = cash.cashAdvanceRejectionReason

         return {cashAdvanceId,cashAdvanceStatus,amountDetails,approvers,cashAdvanceRejectionReason}
       })

     return{tenantId, travelRequestId, approvers, travelRequestStatus, rejectionReason , cashAdvances}
    }) 

    console.log("total approved",approvedDocs.length)

    console.log("payloadToTravel", payloadToTravel, "payloadToCash", payloadToCash)

    if(allTravelRequests?.length > 0){
      console.log("allTravelRequests", payloadToTravel)
      sendToOtherMicroservice(payloadToTravel,  'approve-reject-tr', 'travel', 'reject travelRequests', 'dashboard', 'online')
      sendToOtherMicroservice(payloadToTravel,  'approve-reject-tr', 'approval', 'reject travelRequests', 'dashboard', 'online')

    } else if (allTravelRequestsWithCash?.length > 0){
      console.log("payloadToCash", payloadToCash)
      sendToOtherMicroservice(payloadToCash,  'approve-reject-ca', 'cash', 'reject travelRequests with cash', 'dashboard', 'online')
      sendToOtherMicroservice(payloadToCash,  'approve-reject-ca', 'approval', 'reject travelRequests with cash', 'dashboard', 'online')
    }

     if (allTravelRequests?.length > 0 ||allTravelRequestsWithCash?.length > 0) {
       return ({ success:true, message: `Rejection successful !!` });
     }
   } 
    catch (error) {
     console.error('An error occurred while updating approval:', error.message);
     throw new Error({ error: 'Failed to update approval.', error });
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
      const cashApprovalDoc = await dashboard.findOne({
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
  
      // if (!cashApprovalDocs || cashApprovalDocs.length === 0) {
      //   return { status: 404, json: { error: 'Travel request not found.' } };
      // }
      return cashApprovalDocs
  } catch(error){
    console.log("Error in getReportsCashRaisedLater", error)
  }
}


// travel with cash advance -- reject cashAdvance raised later
export const rejectCashAdvance = async (tenantId, empId, cashApprovalDocs,rejectionReason) => {

      console.log( "rejectCashAdvance--rejectionReason", rejectionReason)
    
      try {
        if (!cashApprovalDocs?.length) {
          throw new Error('Travel request not found.');
        }

        const travelRequestIds = cashApprovalDocs.map(report => report.cashAdvanceSchema.travelRequestData.travelRequestId.toString())

    
        const cashAdvanceIds = cashApprovalDocs.flatMap(request =>
          request.cashAdvanceData.map(cashAdvance => cashAdvance.cashAdvanceId)
        );


    await updateCashAdvanceStatus(cashApprovalDocs, cashAdvanceIds, empId,"rejected",rejectionReason);

    const getApproval = await dashboard.find({ travelRequestId: { $in: travelRequestIds } });   
      console.log("what will be returned -------", getApproval)
    
      if(!getApproval){
        return res.status(404).json({ message: 'error occurred while rejecting cash Advance'})
      } else{
          console.log("payload updated?", payload)
          const payload = getApproval.map(doc =>
          ({
            tenantId:doc.tenantId,
            travelRequestId:doc.travelRequestId,
            travelRequestStatus:doc.cashAdvanceSchema.travelRequestData.travelRequestStatus,
            rejectionReason:doc?.cashAdvanceSchema.travelRequestData.rejectionReason || null,
            cashAdvances:doc.cashAdvanceSchema.cashAdvancesData.map(cash =>({
              cashAdvanceId: cash?.cashAdvanceId,
              cashAdvanceStatus: cash?.cashAdvanceStatus,
              approvers:cash?.approvers,
              rejectionReason:rejectionReason
            }))
          })
          )

          const isBooked = payload.filter(trip => trip.travelRequestStatus === 'booked')

          if(isBooked && isBooked.length){
            await sendToOtherMicroservice(isBooked,'approve-reject-ca-later','trip', 'To update cashAdvanceStatus to approved -cash advance raised later')
            await sendToOtherMicroservice(isBooked,'approve-reject-ca-later','expense', 'To update cashAdvanceStatus to approved -cash advance raised later')
          }

          // send Rejected cash advance to Cash microservice
          const promises = [
           sendToOtherMicroservice(payload, 'approve-reject-ca-later', 'cash', 'To update cashAdvanceStatus to rejected in cash microservice'),
           sendToOtherMicroservice(payload, 'approve-reject-ca-later', 'approval', 'To update cashAdvanceStatus to rejected in cash microservice'),
          ]
        await Promise.all(promises)
    
        // Send updated travel to the dashboard synchronously
      //  const dashboardResponse = await sendToDashboardMicroservice(payload, 'approve-reject-ca',  'To update cashAdvanceStatus to rejected in cash microservice')
      return ({ success:true, message: `Cash Advance rejected` });

      }} catch (error) {
        console.error('An error occurred while updating approval:', error.message);
        return res.status(500).json({ error: 'Failed to update approval.', error: error.message });
      }
};












// travel expense report
const expenseParamsSchema = Joi.object({
  tenantId:Joi.string().required(),
  empId: Joi.string().required(),
  expenseHeaderId: Joi.string().required(),
  tripId: Joi.string().required()
})

const expenseBodySchema = Joi.object({
  approve: Joi.array().items(Joi.string()).default([]),
  reject: Joi.array().items(Joi.string()).default([]),
  rejectionReason: Joi.string()
    .when('reject', {
      is: Joi.array().length(0),
      then: Joi.allow(''),  
      otherwise: Joi.required()  
    })
    .messages({
      'any.required': 'Rejection reason is required when there are rejected items.',
      'any.unknown': 'Rejection reason is not allowed when there are no rejected items.' 
    })
});

function validateRequest(schema,data){
  try{
    if (!schema || !data){
      throw new Error("validate Request schema / data is missing")
    }
   const { error,value} = schema.validate(data,{abortEarly:false})
   if(error) throw new Error(error.message || error.details[0].message)
    return value
  }catch(error){
    throw error
  }
}


export async function getExpenseReport(tenantId,empId,tripId,expenseHeaderId){
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
     throw new Error(error)
   } 

   return expenseReport
  } catch (error){
    throw new Error( error)
  }
}

export function updateExpenseLineStatus(expenseLines, approve = [], reject = [], empId) {

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

//Approve or reject travel expense report at header level or line item level
export const travelExpenseApproval = async (req, res) => {
  try {
    const params = validateRequest(expenseParamsSchema,req.params)
    const body = validateRequest(expenseBodySchema,req.body);

    const { tenantId,tripId, expenseHeaderId, empId } = params;
    const {approve, reject, rejectionReason} = body

    console.log("expense report - params -- approve. reject", req.params);

    const approvalDocument = await getExpenseReport(tenantId,empId,tripId,expenseHeaderId)

     if (!approvalDocument) {
       return res.status(404).json({ message: 'No matching approval document found for updating travel expenses status.' });
     }

     const { travelExpenseData} = approvalDocument.tripSchema
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

       if(!expenseApproved){
         return res.status(404).json({message:`error occurred while updating expense report `})
       }

     const { name } = expenseApproved.tripSchema.travelRequestData.createdBy;

     const { travelExpenseData } = expenseApproved.tripSchema;
     const matchedExpense = travelExpenseData.find(expense => expense.expenseHeaderId.toString() === expenseHeaderId);
     const { expenseHeaderStatus, approvers} = matchedExpense
     console.log("expense report approvers", matchedExpense)
     // Create the payload object
     const payload = {
       tenantId,
       tripId,
       expenseHeaderId,
       empId,
       expenseHeaderStatus: expenseHeaderStatus,
       approvers,
       approve, 
       reject, 
       rejectionReason,
     };

     console.log("payload for approve", payload);
     const action = 'expense-approval';
     const comments = 'expense report approved'
    //  await sendToDashboardMicroservice(payload, action, comments,'approval', 'online', true);
    const promises = [
      sendToOtherMicroservice(payload, action, 'trip', comments),
      sendToOtherMicroservice(payload, action, 'expense', comments),
      sendToOtherMicroservice(payload, action, 'approval', comments),
    ]
    await Promise.all(promises)

     return res.status(200).json({ message: `expense Report ${expenseHeaderStatus} for ${name}` });
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

async function getNonTravelExpenseReport(tenantId, empId, expenseHeaderId) {
  try {
    const report = await dashboard.findOne({
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


// function updateNonTravelExpenseLineStatus(expenseLines, approve = [], reject = []) {
//   try {
//     // Log the initial state of the inputs
//     console.log("Updating expense lines:", { expenseLines, approve, reject });

//     const updatedExpenseLines = expenseLines.map(expenseLine => {
//       // Convert ObjectId to string for comparison
//       const lineItemIdStr = expenseLine.lineItemId.toString();

//       if (approve.includes(lineItemIdStr)) {
//         return { ...expenseLine, lineItemStatus: 'approved' };
//       } else if (reject.includes(lineItemIdStr)) {
//         return { ...expenseLine, lineItemStatus: 'rejected' };
//       } else {
//         return expenseLine; // No change for this line
//       }
//     });

//     // Log the updated expense lines
//     console.log("Updated expense lines:", updatedExpenseLines);
//     return updatedExpenseLines;

//   } catch (error) {
//     // Log the error message
//     console.error("Error updating expense lines:", error.message);
//     throw new Error("Failed to update expense lines."); // Rethrow or handle the error as needed
//   }
// }


// non travel expense reports approve or reject


export const nonTravelReportApproval = async (req, res) => {
  try {
    const { error: errorParams, value: valueParams} = otherExpenseSchema.validate(req.params)

    if(errorParams){
      return res.status(400).json({error: `Invalid Parameters ${errorParams.details[0].message}`})
    }
     const { tenantId, expenseHeaderId, empId } = valueParams;

     console.log("expense report - params -- approve", req.params);

     const {error: errorBody, value : valueBody} = expenseValidSchema.validate(req.body)

     if(errorBody){
      return res.status(400).json({error: errorBody.details[0].message})
     }
     const {  approve, reject, rejectionReason } = valueBody;

     const approvalDocument = await getNonTravelExpenseReport(tenantId,empId,expenseHeaderId)
 
     console.log("approvalDocument",approvalDocument)
     if (!approvalDocument) {
       return res.status(404).json({ message: 'No matching approval document found for updating travel expenses status.' });
     }

     const { reimbursementSchema} = approvalDocument
     const { createdBy:{name = ''} = {}} = reimbursementSchema

     const {expenseLines = []} =reimbursementSchema

      const updatedExpenseLines = updateExpenseLineStatus(expenseLines, approve, reject,empId)

      console.log("updatedExpenseLines",updatedExpenseLines)
      reimbursementSchema.expenseLines = updatedExpenseLines
      const expenseLinesApproved = updatedExpenseLines.some(line => line.lineItemStatus === 'approved')
      const isRejected = updatedExpenseLines.some(line => line.lineItemStatus === 'rejected')
      const isPendingApproval = updatedExpenseLines.some(line => line.lineItemStatus === 'pending approval')

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

       if(approver && isRejected && !isPendingApproval){
        approver.status = 'rejected';
        reimbursementSchema.expenseHeaderStatus = 'rejected';
        reimbursementSchema.rejectionReason = rejectionReason
       }

       // Save the updated approvalDocument document
      const expenseApproved = await approvalDocument.save();

      console.log("expenseApproved",expenseApproved)
      if(!expenseApproved){
        return res.status(404).json({message:`error occurred while updating expense report for ${name}`})
      } else {
        const { name } = expenseApproved?.reimbursementSchema?.createdBy;

        const { reimbursementSchema } = expenseApproved;
        const { expenseHeaderStatus} = reimbursementSchema

        // Create the payload object
        const payload = {
          tenantId,
          expenseHeaderId,
          expenseHeaderStatus: expenseHeaderStatus,
          reimbursement:reimbursementSchema,
          approve, 
          reject, 
          rejectionReason
        };
    
        console.log("payload for reimbursement", JSON.stringify(payload, '',2));
        const action = 'nte-full-update';
        const comments = 'non travel expense report approval from dashboard'
        const source='dashboard'
        const onlineVsBatch='online'
        // sendToOtherMicroservice and sendToDashboardMicroservice 
    const promises = [
      sendToOtherMicroservice(payload, action, 'expense', comments,  source, onlineVsBatch),
      sendToOtherMicroservice(payload, action, 'approval', comments,  source, onlineVsBatch),
    ]
    
    await Promise.all(promises);
      return res.status(200).json({ message: `expense Report ${expenseHeaderStatus} for ${name}` });
      }
    } catch (error) {
    console.error('An error occurred while updating Travel Expense status:', error.message);
    res.status(500).json({ error: 'An error occurred while updating Travel Expense status.' });
  }
};









































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
          line.lineItemStatus = 'approved'
          
          line.approvers.forEach(approver => {
            if(approver.empId === empId && approver.status === 'pending approval'){
                approver.status = 'approved'
            }
          })
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


    //  await sendToDashboardMicroservice(payload, action, comments,'approval', 'online', true);
    const promises = [
      sendToOtherMicroservice(payload, action, 'trip', comments),
      sendToOtherMicroservice(payload, action, 'expense', comments),
      sendToOtherMicroservice(payload, action, 'approval', comments),
    ]
    await Promise.all(promises)

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

          line.approvers.forEach(approver => {
            if(approver.status === 'pending approval' ){
              approver.status = 'rejected'  
            }
          })
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
    //  await sendToDashboardMicroservice(payload, action, comments,'approval', 'online', true);

    const promises = [
      sendToOtherMicroservice(payload, action, 'trip', comments, ),
      sendToOtherMicroservice(payload, action, 'expense', comments, ),
      sendToOtherMicroservice(payload, action, 'approval', comments, ),
    ]
    await Promise.all(promises)
 
     return res.status(200).json({ message: `expense Report rejected for ${name}` });
  }} catch (error) {
     console.error('An error occurred while updating Travel Expense status:', error.message);
     res.status(500).json({ error: 'An error occurred while updating Travel Expense status.' });
  }
};









































function oldupdateExpenseLineStatus(expenseLines, approve = [], reject = [], empId) {
  return expenseLines.map(expenseLine => {
    const expenseLineIdStr = expenseLine.expenseLineId.toString();

    if (approve.includes(expenseLineIdStr)) {
      expenseLine.approvers.forEach(approver => {
        if (approver.empId === empId && approver.status === 'pending approval') {
          approver.status = 'approved';
        }
      });

      const isAllApproved = expenseLine.approvers.every(approver => approver.status === 'approved');
      const lineItemStatus = isAllApproved ? 'approved' : 'pending approval';
      return { ...expenseLine, lineItemStatus };

    } else if (reject.includes(expenseLineIdStr)) {
      expenseLine.approvers.forEach(approver => {
        if (approver.empId === empId && approver.status === 'pending approval') {
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
const approveLineSchema = Joi.object({
  approve: Joi.array().items(Joi.string()).default([]),
  reject: Joi.array().items(Joi.string()).default([]),
});

const rejectLineSchema = Joi.object({
  approve: Joi.array().items(Joi.string()).default([]),
  reject: Joi.array().items(Joi.string()).default([]),
  rejectionReason: Joi.string()
  .custom((value,helpers) =>{
    const {reject} = helpers.state.ancestors[0];
    if(reject.length>0 && !value){
      return helpers.error('any.required')
    }
    return value
  })
  .messages({
    'any.required': 'rejection reason is required',
  })
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

      const updatedExpenseLines = updateExpenseLineStatus(expenseLines, approve, reject,empId)

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
    const promises = [
      sendToOtherMicroservice(payload, action, 'trip', comments,  source='dashboard', onlineVsBatch='online'),
      sendToOtherMicroservice(payload, action, 'expense', comments,  source='dashboard', onlineVsBatch='online'),
      sendToOtherMicroservice(payload, action, 'approval', comments,  source='dashboard', onlineVsBatch='online'),
    ]
    await Promise.all(promises)

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

      const updatedExpenseLines = updateExpenseLineStatus(expenseLines, approve, reject,empId)

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
    //  await sendToDashboardMicroservice(payload, action, comments,'approval', 'online', true);
    const promises = [
      sendToOtherMicroservice(payload, action, 'trip', comments, ),
      sendToOtherMicroservice(payload, action, 'expense', comments, ),
      sendToOtherMicroservice(payload, action, 'approval', comments, ),
    ]
    await Promise.all(promises)

     return res.status(200).json({ message: `expense Report approved for ${name}` });
  }} catch (error) {
     console.error('An error occurred while updating Travel Expense status:', error.message);
     res.status(500).json({ error: 'An error occurred while updating Travel Expense status.' });
  }
};

