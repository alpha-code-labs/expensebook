import TravelRequest from "../models/travelRequest.js";
import createTravelRequestId from "../utils/createTravelRequestId.js";
import {
  fetchOnboardingData,
  fetchGroupAndPoliciesData,
} from "../services/onboardingService.js";
import { fetchProfileData } from "../services/dashboardService.js";
import policyValidation from "../utils/policyValidation.js";
import HRMaster from "../models/hrMaster.js";
import mongoose from "mongoose";
import { sendToDashboardQueue } from "../rabbitMQ/publisher.js";

const getOnboardingAndProfileData = async (req, res) => {
  try {
    const { tenantId, employeeId } = req.params;

    if (!tenantId || !employeeId) {
      return res.status(400).json({ message: "Bad request" });
    }
    const onboardingData = await fetchOnboardingData(tenantId, employeeId);
    //const profileData = await fetchProfileData(tenantId, employeeId);

    res.status(200).json(onboardingData /** , profileData */);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createTravelRequest = async (req, res) => {
  try {

    const requiredFields = [
      "tenantId",
      "tenantName",
      "companyName",
      "travelRequestStatus", 
      "travelRequestState", 
      "createdBy",
      "createdFor",
      "teamMembers",
      "travelAllocationHeaders",
      "itinerary",
      "travelDocuments",
      "approvers", 
      "preferences",
      "travelViolations",
      "tripType",
      "isCancelled",
      "cancellationReason", 
      "cancellationDate", 
      "sentToTrip",
    ];

    const missing = []
    const present = []
    requiredFields.forEach(field=> 
      {
        if(!field in req.body){
          missing.push(field)
         }

         if(field in req.body){
          present.push(field)
         }
  })
    // Check if all required fields are present in the request body
    const fieldsPresent = requiredFields.every((field) => field in req.body);

    if (!fieldsPresent) {
      return res
        .status(400)
        .json({ message: "Bad request. Missing required fields", missingFields: missing, presentFields: present });
    }

    const {
      tenantId,
      tenantName,
      companyName,
      tripPurpose,
      createdBy,
      createdFor,
      teamMembers,
      travelRequestStatus,
      travelRequestState,
      travelAllocationHeaders,
      itinerary,
      tripType,
      travelDocuments,
      bookings,
      approvers,
      preferences,
      travelViolations,
      travelBookingDate,
      travelCompletionDate,
      travelRequestRejectionReason,
      isCancelled,
      cancellationDate,
      cancellationReason,
      sentToTrip,
      isCashAdvanceTaken,
    } = req.body;

    if (
      tenantId == "" ||
      createdBy == "" ||
      tripPurpose == "" ||
      travelRequestStatus == "" ||
      travelRequestState == ""
    ) {
      return res.status(400).json({ message: "Required fileds are missing values" });
    }

    //to do: validate tenantId, employeeId, some other as well
    const count = await TravelRequest.countDocuments({tenantId});
    const travelRequestId = new mongoose.Types.ObjectId()
    const travelRequestNumber = createTravelRequestId(companyName, count) 
    //fileds which will not be received in request
    const travelRequestDate = Date.now();
    const newTravelRequest = new TravelRequest({
      tenantId,
      travelRequestId,
      travelRequestNumber,
      travelRequestDate,
      tenantName,
      companyName,
      tripPurpose,
      createdBy,
      createdFor,
      teamMembers,
      travelRequestStatus,
      travelRequestState,
      travelAllocationHeaders,
      itinerary,
      tripType,
      travelDocuments,
      bookings,
      approvers,
      preferences,
      travelViolations,
      travelBookingDate,
      travelCompletionDate,
      travelRequestRejectionReason,
      isCancelled,
      cancellationDate,
      cancellationReason,
      sentToTrip,
      isCashAdvanceTaken,
    });

    //update Travel Request container with newly created travel request
    await newTravelRequest.save();

     //send data to rabbitmq
     await sendToDashboardQueue({...newTravelRequest}, false, 'online')

    return res.status(201).json({ message: "Travel Request Created", travelRequestId});
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal sever error" });
  }
};

const getTravelRequest = async (req, res) => {
  try {
    const { travelRequestId } = req.params;
    if (!travelRequestId) {
      return res
        .status(400)
        .json({ message: "missing travel request identifier" });
    }
    const travelRequest = await TravelRequest.findOne(
      { travelRequestId },
      { travelAndNonTravelPolicies: 0 }
    );

    if (!travelRequest) {
      return res.status(404).json({ message: "not found" });
    }

    return res.status(200).json(travelRequest);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const validateTravelPolicy = async (req, res) => {
  try {
    const {tenantId} = req.params
    const { type, groups, policy, value } = req.body;
    console.log(tenantId, type, groups, policy, value)
    //input validation needed
    if(!type || !groups || !policy || !value || !tenantId){
      return res.status(400).json({message: 'Bad request missing values'})
    }

    const validation = await policyValidation(type.toLowerCase(), groups?.map(group=>group.toLowerCase()), policy.toLowerCase(), value.toLowerCase());
    console.log(validation)
    return res.status(200).json({...validation});
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getTravelRequestStatus = async (req, res) => {
  try {
    const { travelRequestId } = req.params;
    const travelRequestStatus = await TravelRequest.findOne(
      { travelRequestId },
      { travelRequestStatus: 1 }
    );

    if (!travelRequestStatus) {
      return res.status(404).json({ message: "Record not found" });
    }

    return res.status(200).json(travelRequestStatus);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateTravelRequestStatus = async (req, res) => {
  try {
    const { travelRequestId } = req.params;
    let { travelRequestStatus } = req.body;

    //check if received status is valid
    travelRequestStatus.toLowerCase();
    const status = [
      "draft",
      "approved",
      "rejected",
      "booked",
      "cancelled",
      "completed",
      "pending booking"
    ];

    if (!status.includes(travelRequestStatus.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status" });
    }

    //everything is okay attempt updating status
    const result = await TravelRequest.findOneAndUpdate(
      { travelRequestId },
      {$set: {travelRequestStatus} }
    );

    if (!result) {
      return res.status(404).json({ message: "Record not found" });
    }

    return res.status(200).json({
      message: `Status updated to ${travelRequestStatus}`,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// const updateTravelRequest = async (req, res) => {
//   try {
//     const requiredFields = [
//       "tripPurpose",
//       "travelRequestDate",
//       "createdFor",
//       "teamMembers",
//       "travelRequestStatus",
//       "travelRequestState",
//       "travelAllocationHeaders",
//       "itinerary",
//       "tripType",
//       "travelDocuments",
//       "approvers",
//       "preferences",
//       "travelViolations",
//       "travelBookingDate",
//       "travelCompletionDate",
//       "travelRequestRejectionReason",
//       "isCancelled",
//       "cancellationDate",
//       "cancellationReason",
//       "sentToTrip",
//       "isCashAdvanceTaken",
//       "submitted",
//     ];

//     // Check if one of the required fields are present in the request body
//     const fieldsPresent = requiredFields.some((field) => field in req.body);

//     if (!fieldsPresent) {
//       return res.status(400).json({ message: "You haven't provided any valid fields to update" });
//     }

//     const {
//       tenantId,
//       travelRequestStatus,
//       travelRequestState,
//     } = req.body;

//     if(!tenantId || tenantId==null || tenantId == "") {
//       return res.status(400).json({ message: "tenant Id is missing" });
//     }

//     //validate tenant Id

//     //other validation methods are also needed,

//     const expectedFields = [
//       "tripPurpose",
//       "travelRequestDate",
//       "createdFor",
//       "teamMembers",
//       "travelRequestStatus",
//       "travelRequestState",
//       "travelAllocationHeaders",
//       "itinerary",
//       "tripType",
//       "travelDocuments",
//       "approvers",
//       "preferences",
//       "travelViolations",
//       "travelBookingDate",
//       "travelCompletionDate",
//       "travelRequestRejectionReason",
//       "isCancelled",
//       "cancellationDate",
//       "cancellationReason",
//       "sentToTrip",
//       "isCashAdvanceTaken",
//     ];
    
//     // Initialize an array to store the updated fields that are present in the request
//     const present = [];
    
//     // Check which fields are present in the request
//     for (const field of expectedFields) {
//       if (req.body.hasOwnProperty(field)) {
//         present.push(field);
//       }
//     }
    
//     const updatedFields = {};
//     present.forEach((field) => {updatedFields[field] = req.body[field]});
//     console.log(updatedFields);

//     const { travelRequestId } = req.params;
//     //validate travelRequestId
//     const travelRequestExists = await TravelRequest.findOne({travelRequestId}, {travelRequestId:1, approvers:1, travelRequestStatus:1})

//     if(!travelRequestExists){
//       return res.status(404).json({message: 'Travel Request not found'})
//     }

//     const lastStatus = travelRequestExists.travelRequestStatus
//     const lastApprovers = travelRequestExists.approvers


//     //case travelRequest status is draft
//     if(travelRequestStatus == 'draft'){
//       if(req.body?.submitted == null || req.body?.submitted == undefined){ 
//         return res.status(400).json({ message: "Field or value for field is missing: 'submitted' " })
//       }
      
//       //check for approvers
//       if(req.body.hasOwnProperty("approvers") && req.body.approvers.length>0){
//         // might need to 
//         //check with t&e how many approvers should be there
//         //and wether he is selecting correct approvers

//         //update status of each itinerary item to pending approval
//         let itemAdded = false
//         let status = ''
//         if(updatedFields.hasOwnProperty('itinerary')){
//           const items = ['flights', 'trains', 'buses', 'cabs', 'hotels']

//           items.forEach(item=>{
//             updatedFields.itinerary[item].forEach(subItem=>{
//               if((subItem.date??false) && subItem.status == 'draft'){
//                 subItem.status = req.body.submitted? 'pending approval' : 'draft'
//                 itemAdded = true
//               }
//             })
//           })
//         }

//         //update data in backend with status 'pending approval'
//         await TravelRequest.findOneAndUpdate({travelRequestId}, {$set: {...updatedFields, travelRequestStatus: req.body.submitted? 'pending approval' : 'draft'}});
//         res.status(200).json({message: 'Travel Request submitted for approval'})
//         // send data to approval microservice
//       }

//       else{
//         //update data in backend with status 'pending booking'
//         //update status of each itinerary item to pending booking
//         if(updatedFields.hasOwnProperty('itinerary')){

//           const items = ['flights', 'trains', 'buses', 'cabs', 'hotels']
//           let itemAdded = false

//           items.forEach(item=>{
//             updatedFields.itinerary[item].forEach(subItem=>{
//               if((subItem.date??false) && subItem.status == 'draft'){
//                 subItem.status = req.body.submitted? 'pending booking' : 'draft'
//                 itemAdded = true
//               }
//             })
//           })
//         }
//         await TravelRequest.findOneAndUpdate({travelRequestId}, {$set: {...updatedFields, travelRequestStatus: req.body.submitted? 'pending approval' : 'draft'}});
//         res.status(200).json({message: 'Travel Request submitted for booking'})
//         // send data to approval microservice
//       } 

//     }

//     //travel request status is pending booking
//     else if(travelRequestStatus == 'pending booking'){
//       //check if any new itinerary item is added. if so treat it as a draft status request
//       //and send for approval if required
//       let itemAdded = false
//       let status = ''

//       if(updatedFields.hasOwnProperty('itinerary')){

//         const items = ['flights', 'trains', 'buses', 'cabs', 'hotels']

//         items.forEach(item=>{
//           updatedFields.itinerary[item].forEach(subItem=>{
//             if((subItem.date??false) && subItem.status == 'draft'){
//               subItem.status = lastApprovers.length>0? 'pending approval' : 'pending booking'
//               itemAdded = true
//             }
//           })
//         })
//       }

//       if(updatedFields.hasOwnProperty('approvers')){
//         if(updatedFields.approvers.length>0){
//           if(JSON.stringify(lastApprovers) != JSON.stringify(updatedFields.approvers)){
//             status = 'pending approval'
//           }

//           if(itemAdded) status = 'pending approval'

//           else status = 'pending booking'
//         }
//         else status = 'pending booking'
//       }
//       else status = 'pending booking'

//       console.log(status, 'status -pending booking route line-470')

//       await TravelRequest.findOneAndUpdate({travelRequestId}, {$set: {...updatedFields, travelRequestStatus:status}});
//       res.status(200).json({message: 'Travel Request submitted for booking'})

//       if(status == 'pending approval'){
//         // send data to approval microservice
//       }
      
//     }

//     //travel request status is pending approval
//     else if(travelRequestStatus == 'pending approval'){
//       //check if any new itinerary item is added. if so treat it as a draft status request
//       //and send for approval if required
//       let itemAdded = false
//       let status = ''

//       if(updatedFields.hasOwnProperty('itinerary')){

//           const items = ['flights', 'trains', 'buses', 'cabs', 'hotels']

//           items.forEach(item=>{
//             updatedFields.itinerary[item].forEach(subItem=>{
//               if((subItem.date??false) && subItem.status == 'draft'){
//                 subItem.status = lastApprovers.length>0? 'pending approval' : 'pending booking'
//                 itemAdded = true
//               }
//             })
//           })
//       }

//       if(updatedFields.hasOwnProperty('approvers')){
//         if(updatedFields.approvers.length>0){
//           if(JSON.stringify(lastApprovers) != JSON.stringify(updatedFields.approvers)){
//             status = 'pending approval'
//           }

//           if(itemAdded) status = 'pending approval'

//           else status = 'pending booking'
//         }
//       }
//       else status = 'pending booking'

//       await TravelRequest.findOneAndUpdate({travelRequestId}, {$set: {...updatedFields, travelRequestStatus:status}});
//       res.status(200).json({message: 'Travel Request submitted for booking'})

//       if(status == 'pending approval'){
//         // send data to approval microservice
//       }
      
//     }

//     //travel request status is cancelled
//     else if(travelRequestStatus == 'cancelled'){
//       return res.status(400).json({message: 'This Travel Request has been cancelled. Please raise a fresh Travel Request'})
//     }

//     else if(travelRequestStatus == 'booked'){
//       return res.status(400).json({message: 'Travel Request is already booked. Please go to trip modification if you want to modify this trip'})
//     }

//     else if(travelRequestStatus == 'rejected'){
//       {
//         if(!req.body?.submitted??true){ 
//           return res.status(400).json({ message: "Field or value for field is missing: 'submitted' " })
//         }
  
//         //check for approvers
//         if(req.body.hasOwnProperty("approvers") && req.body.approvers.length>0){
//           // might need to 
//           //check with t&e how many approvers should be there
//           //and wether he is selecting correct approvers
  
//           //update status of each itinerary item to pending approval
//           if(updatedFields.hasOwnProperty('itinerary')){

//               const items = ['flights', 'trains', 'buses', 'cabs', 'hotels']
//               items.forEach(item=>{
//                 updatedFields.itinerary[item].forEach(subItem=>{
//                   if(subItem.date??false) cab.status = 'pending approval'
//                 })
//               })
//           }
  
//           //update data in backend with status 'pending approval'
//           await TravelRequest.findOneAndUpdate({travelRequestId}, {$set: {...updatedFields, travelRequestStatus:'pending approval'}});
//           res.status(200).json({message: 'Travel Request submitted for approval'})
//           // send data to approval microservice
//         }
  
//         else{
//           //update data in backend with status 'pending booking'
//           //update status of each itinerary item to pending booking
//           if(updatedFields.hasOwnProperty('itinerary')){
//             updatedFields.itinerary.forEach(item=>{
//               if(item?.departure?.date??false) item.departure.status = 'pending booking'
//               if(item?.return?.date??false) item.return.status = 'pending booking'
//               if(item?.boardingTransfer?.date??false) item.boardingTransfer.status = 'pending booking'
//               if(item?.hotelTransfer?.date??false) item.hotelTransfer.status = 'pending booking'
//               item.cabs.forEach(cab=>{
//                 if(cab.date??false) cab.status = 'pending booking'
//               })
//               item.hotels.forEach(hotel=>{
//                 if(hotel.checkIn??false) hotel.status = 'pending booking'
//               })
//             }) 
//           }
//           await TravelRequest.findOneAndUpdate({travelRequestId}, {$set: {...updatedFields, travelRequestStatus:'pending booking'}});
//           res.status(200).json({message: 'Travel Request submitted for booking'})
//           // send data to approval microservice
//         } 
  
//       }
//     }

//     else {
//       return res.status(400).json({message: 'Unrecognized status'})
//     }

//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };


const updateTravelRequest = async (req, res) =>{
  try{
    const {travelRequestId} = req.params
    const {travelRequest, submitted} = req.body

    console.log(submitted)

    let sendToApproval = false
    let needApproval = false
    let lastTravelRequestStatus = null
    //find TR
    const travelRequestData = await TravelRequest.findOne({travelRequestId})
    if(!travelRequestData) return res.status(404).json({message: 'Can not find the requested resource'})
    
    lastTravelRequestStatus = travelRequestData.travelRequestStatus 
    //update travel request
    Object.keys(travelRequest).map(key=>travelRequestData[key] = travelRequest[key])

    travelRequestData.travelRequestDate = Date.now()
    if(travelRequestData.approvers.length > 0){
      sendToApproval = true
      needApproval = true
    }

    //travel request record is present go ahead
    if(!submitted){
      //save everything in draft state

      //update all itinerary items to draft
      if(travelRequestData.hasOwnProperty('itinerary')){
        const items = ['flights', 'trains', 'buses', 'cabs', 'hotels']
        items.forEach(item=>{
          travelRequestData.itinerary[item].forEach(subItem=>{
            subItem.status = 'draft'
          })
        })
      }

      //update travel request status to draft
      travelRequestData.travelRequestStatus = 'draft'


      //save the structre
      const result = await travelRequestData.save()

      if(!result){
        return res.status(400).json({
          message:'Can not update database please try again',
        });  
      }

      //send data to rabbitmq
      await sendToDashboardQueue(travelRequestData, false, 'online')
      

      if(sendToApproval && lastTravelRequestStatus!='draft'){
          //replicate data in approval microservice
          // const approval_res = axios.post(APPROVAL_ENDPOINT, result)
          // if(approval_res.status(200)){
          //   return res.status(200).json({message: `Travel Request Sent for booking`});
          // }
          // else{
          //   return res.status(400).json({message: 'Unable to replicate data in approval microservice'})
          // }
          //just for now
          return res.status(200).json({message: `Travel Request Sent for booking`})
      }
      //send res
      else{
        return res.status(200).json({message: `Travel Request Sent for booking`});
      }      
    }

    if(submitted){
      //update all itinerary items to appropriate state
      if(travelRequestData.hasOwnProperty('itinerary')){
        const items = ['flights', 'trains', 'buses', 'cabs', 'hotels']
        items.forEach(item=>{
          travelRequestData.itinerary[item].forEach(subItem=>{
            if((subItem.date??false)){
              subItem.status = needApproval? 'pending approval' : 'pending booking'
            }
          })
        })
      }

      if(needApproval){
        //update travel request to pending approval
        travelRequestData.travelRequestStatus = 'pending approval'
    
        const result = await travelRequestData.save()

        if(!result){
          return res.status(400).json({
            message:'Can not update database please try again',
          });  
        }

        //send data to rabbitmq
        await sendToDashboardQueue(travelRequestData, false, 'online')

        if(sendToApproval){
          //replicate data in approval microservice
          // const approval_res = axios.post(APPROVAL_ENDPOINT, result)
          // if(approval_res.status(200)){
          //   return res.status(200).json({message: `Travel Request Sent for booking`});
          // }
          // else{
          //   return res.status(400).json({message: 'Unable to replicate data in approval microservice'})
          // }

          //just for now
          return res.status(200).json({message: `Travel Request Sent for booking`})
        }

        //send res
        else{
          return res.status(200).json({message: `Travel Request Sent for approval`});
        }
      }

      else{
        //update travel request to pending booking 
        travelRequestData.travelRequestStatus = 'pending booking'
        const result = await travelRequestData.save()

        if(!result){
          return res.status(400).json({
            message:'Can not update database please try again',
          });  
        }

 
        //send data to rabbitmq
        await sendToDashboardQueue(travelRequestData, false, 'online')

        if(sendToApproval){
          //replicate data in approval microservice
          // const approval_res = axios.post(APPROVAL_ENDPOINT, result)
          // if(approval_res.status(200)){
          //   return res.status(200).json({message: `Travel Request Sent for booking`});
          // }
          // else{
          //   return res.status(400).json({message: 'Unable to replicate data in approval microservice'})
          // }

          //just for now
          return res.status(200).json({message: `Travel Request Sent for booking`})
        }

        //send res
        else{
          return res.status(200).json({message: `Travel Request Sent for booking`});
        }
      }
    }

    else{
      return res.status(400).json({message: 'Something went wrong ):' })
    }
  }catch(e){
    console.log(e)
    res.status(500).json({message:'Internal server error'})
  }
}

const getTravelRequests = async (req, res) => {
  const {employeeId} = req.params;

  if(!employeeId) {
    return res.status(400).json({message: "Bad request"});
  }

  try {
    const travelRequests = await TravelRequest.find({"createdBy.empId": employeeId}, {travelRequestId: 1, travelRequestStatus: 1, travelRequestState: 1, travelRequestDate: 1, travelRequestRejectionReason: 1, travelBookingDate: 1, travelCompletionDate: 1, _id: 0});
    return res.status(200).json({travelRequests});
  } catch (e) {
    console.error(e);
    return res.status(500).json({message: "Internal server error"});
  }
}

const cancelTravelRequest = async (req, res)=>{
  try {
    const { travelRequestId } = req.params;

    //find TR
    const travelRequest = await TravelRequest.find({travelRequestId})
    if(!travelRequest) return res.status(404).json({message: 'Can not find requested resource'})

    const sendToApproval = travelRequest.approvers.length>0 && travelRequest.status != 'draft'

    //update all itinerary item statu to cancelled
    if(travelRequest.hasOwnProperty('itinerary')){
      const items = ['flights', 'trains', 'buses', 'cabs', 'hotels']
      items.forEach(item=>{
        travelRequest.itinerary[item].forEach(subItem=>{
          subItem.status = 'cancelled'
        })
      })
    }

    //update  status to cancelled
    travelRequest.travelRequestStatus = 'cancelled'

    //update data in database
    travelRequest.save()

    await sendToDashboardQueue(travelRequest, true, 'online')

    if(sendToApproval){
      //replicate data in approval microservice
        // const approval_res = axios.post(APPROVAL_ENDPOINT, result)
        // if(approval_res.status(200)){
        //   return res.status(200).json({message: `Travel Request Sent for booking`});
        // }
        // else{
        //   return res.status(400).json({message: 'Unable to replicate data in approval microservice'})
        // }

        //just for now
        res.status(200).json({
          message: `Travel Request cancelled`,
        });
    }else return res.status(200).json({message: 'Travel Request Cancelled'})

  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const updateTravelBookings = async (req, res)=>{
  try{
    const { travelRequestId } = req.params;
    let { itinerary, submitted } = req.body;

    if(!req.body.hasOwnProperty('submitted') || !req.body.hasOwnProperty('itinerary') ){
      return res.status(400).json({message: 'missing required fields'})
    } 
    //further checks

    //find tr
    const travelRequest = await TravelRequest.findOne({travelRequestId})
    if(!travelRequest) return res.status(404).json({message: 'Requested resource not found'})

    if(submitted){
      //change all individual line statuses to booked, change main status to booked

      //send data to rabbitmq.. 
      await sendToDashboardQueue(travelRequest, true, 'online')
    }
    if(!submitted){
      //simply save the provided itinerary in request
      travelRequest.itinerary = itinerary
      await travelRequest.save()
      return res.status(200).json({message: 'Itinerary updated'})
    }

  }catch(e){
    console.log(e)
    return res.status(500).json({message:'Internal Server Error'})
  }
}

const getBookingsInitialData = async (req, res)=>{
  try{
    const {tenantId, employeeId, travelType} = req.params
    
    if(!tenantId || !employeeId || !travelType) return res.status(400).json({message: 'Request missing required fields'})
    //get tenant data, 

    /*--------------------------------------------
     |  later on optimize to get only relevan data |
      --------------------------------------------*/

    const tenantData = await HRMaster.findOne({tenantId})
    if(!tenantData) return res.status(404).json({message:'Can not find tenant'})
    //get employee details
    const employeeData = tenantData.employees.find(employee=>employee.employeeDetails.employeeId == employeeId)
    const employeeGroups = employeeData?.group
    console.log(employeeGroups, 'employee groups')

    const policies = tenantData.policies

    const getPolicy = (group, policy, travelType)=>{
      let result = null
      policies.forEach(groupPolicy=>{
        if(groupPolicy[group]!=null && groupPolicy[group]!=undefined){
            result = groupPolicy[group][travelType][policy] 
            return
        }
      })

      return result
    }
    
    const dummyGroups = ['Engineers', 'All']
    const checkPolicies = ['Flights', 'Trains', 'Car Rentals', 'Hotels']
    let allowed = {}
    //for now fetch data for group 'Engineers'
    const maxAllowedLimit = null
    async function extractor(checkPolicies, groups, travelType){
      checkPolicies.forEach(item=>{
          const groupPolicies = []
            groups.forEach(group=>{
                groupPolicies.push(getPolicy(group, item, travelType))
            })
            
            let _class = {}
            let _limit = 0
            
            Object.keys(groupPolicies[0].class).forEach(cl=>{
                _class = {..._class, [cl]:false}
            })
            
            groupPolicies.forEach(pl=>{
                Object.keys(pl.class).forEach(cl=>{
                    if(pl.class[cl].allowed) _class[cl] = true
                })
                if(Number(pl.limit.amount)>_limit) _limit = Number(pl.limit.amount) 
            })
            allowed = {...allowed, [item]: {class:_class, limit:_limit}}
      })
    }
    
    extractor(checkPolicies, dummyGroups, 'international')
    const travelClassOptions={
      'flight':Object.keys(policies[0][Object.keys(policies[0])[0]][travelType]['Flights'].class),
      'train': Object.keys(policies[0][Object.keys(policies[0])[0]][travelType]['Trains'].class),
      'bus': ['Sleeper', 'Semi-Sleeper', 'Regular'],
      'cab': Object.keys(policies[0][Object.keys(policies[0])[0]][travelType]['Car Rentals'].class)
    }
    const hotelClassOptions = Object.keys(policies[0][Object.keys(policies[0])[0]][travelType]['Hotels'].class)
    const cabClassOptions = Object.keys(policies[0][Object.keys(policies[0])[0]][travelType]['Car Rentals'].class)

    return res.status(200).json({policies:allowed, travelClassOptions, hotelClassOptions, cabClassOptions})

  }catch(e){
    console.log(e)
    res.status(500).json({message:'internal server error'})
  }
}

export {
  getOnboardingAndProfileData,
  createTravelRequest,
  getTravelRequest,
  getTravelRequests,
  validateTravelPolicy,
  getTravelRequestStatus,
  updateTravelRequest,
  updateTravelRequestStatus,
  cancelTravelRequest,
  updateTravelBookings,
  getBookingsInitialData
};
