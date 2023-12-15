import TravelRequest from "../models/travelRequest.js";
import createTravelRequestId from "../utils/createTravelRequestId.js";
import {
  fetchOnboardingData,
  fetchGroupAndPoliciesData,
} from "../services/onboardingService.js";
import { fetchProfileData } from "../services/dashboardService.js";
import policyValidation from "../utils/policyValidation.js";
import { createCashAdvance } from "../services/cashService.js";
import mongoose from "mongoose";
import HRMaster from "../models/hrMaster.js";

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

    console.log(req.body);

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

    const travelRequestId = createTravelRequestId(tenantId, createdFor?.empId??createdBy.empId)
    //fileds which will not be received in request
    const travelRequestDate = Date.now();
    const newTravelRequest = new TravelRequest({
      tenantId,
      travelRequestId,
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
    const { type, groups, policy, value } = req.params;
    //input validation needed
    console.log(type, groups, policy, value)

    const validation = await policyValidation(type.toLowerCase(), groups.map(group=>group.toLowerCase()), policy.toLowerCase(), value.toLowerCase());
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

const updateTravelRequest = async (req, res) => {
  try {
    const requiredFields = [
      "tripPurpose",
      "travelRequestDate",
      "createdFor",
      "teamMembers",
      "travelRequestStatus",
      "travelRequestState",
      "travelAllocationHeaders",
      "itinerary",
      "tripType",
      "travelDocuments",
      "approvers",
      "preferences",
      "travelViolations",
      "travelBookingDate",
      "travelCompletionDate",
      "travelRequestRejectionReason",
      "isCancelled",
      "cancellationDate",
      "cancellationReason",
      "sentToTrip",
      "isCashAdvanceTaken",
      "submitted",
    ];

    // Check if one of the required fields are present in the request body
    const fieldsPresent = requiredFields.some((field) => field in req.body);

    if (!fieldsPresent) {
      return res.status(400).json({ message: "You haven't provided any valid fields to update" });
    }

    const {
      tenantId,
      travelRequestStatus,
      travelRequestState,
    } = req.body;

    if(!tenantId || tenantId==null || tenantId == "") {
      return res.status(400).json({ message: "tenant Id is missing" });
    }

    //validate tenant Id

    //other validation methods are also needed,

    const expectedFields = [
      "tripPurpose",
      "travelRequestDate",
      "createdFor",
      "teamMembers",
      "travelRequestStatus",
      "travelRequestState",
      "travelAllocationHeaders",
      "itinerary",
      "tripType",
      "travelDocuments",
      "approvers",
      "preferences",
      "travelViolations",
      "travelBookingDate",
      "travelCompletionDate",
      "travelRequestRejectionReason",
      "isCancelled",
      "cancellationDate",
      "cancellationReason",
      "sentToTrip",
      "isCashAdvanceTaken",
    ];
    
    // Initialize an array to store the updated fields that are present in the request
    const present = [];
    
    // Check which fields are present in the request
    for (const field of expectedFields) {
      if (req.body.hasOwnProperty(field)) {
        present.push(field);
      }
    }
    
    const updatedFields = {};
    present.forEach((field) => {updatedFields[field] = req.body[field]});
    console.log(updatedFields);

    const { travelRequestId } = req.params;
    //validate travelRequestId
    const travelRequestExists = await TravelRequest.findOne({travelRequestId}, {travelRequestId:1, approvers:1, travelRequestStatus:1})

    if(!travelRequestExists){
      return res.status(404).json({message: 'Travel Request not found'})
    }

    const lastStatus = travelRequestExists.travelRequestStatus
    const lastApprovers = travelRequestExists.approvers


    //case travelRequest status is draft
    if(travelRequestStatus == 'draft'){
      if(!req.body?.submitted??true){ 
        return res.status(400).json({ message: "Field or value for field is missing: 'submitted' " })
      }

      //check for approvers
      if(req.body.hasOwnProperty("approvers") && req.body.approvers.length>0){
        // might need to 
        //check with t&e how many approvers should be there
        //and wether he is selecting correct approvers

        //update status of each itinerary item to pending approval
        if(updatedFields.hasOwnProperty('itinerary')){
            updatedFields.itinerary.forEach(item=>{
              if(item?.departure?.date??false) item.departure.status = 'pending approval'
              if(item?.return?.date??false) item.return.status = 'pending approval'
              if(item?.boardingTransfer?.date??false) item.boardingTransfer.status = 'pending approval'
              if(item?.hotelTransfer?.date??false) item.hotelTransfer.status = 'pending approval'
              item.cabs.forEach(cab=>{
                if(cab.date??false) cab.status = 'pending approval'
              })
              item.hotels.forEach(hotel=>{
                if(hotel.checkIn??false) hotel.status = 'pending approval'
              })
            }) 
        }

        //update data in backend with status 'pending approval'
        await TravelRequest.findOneAndUpdate({travelRequestId}, {$set: {...updatedFields, travelRequestStatus:'pending approval'}});
        res.status(200).json({message: 'Travel Request submitted for approval'})
        // send data to approval microservice
      }

      else{
        //update data in backend with status 'pending booking'
        //update status of each itinerary item to pending booking
        if(updatedFields.hasOwnProperty('itinerary')){
            updatedFields.itinerary.flights.forEach(flight=>{
              if(flight.date??false) flight.status = 'pending booking'
            })
            updatedFields.itinerary.trains.forEach(train=>{
              if(train.date??false) train.status = 'pending booking'
            })
            updatedFields.itinerary.buses.forEach(bus=>{
              if(bus.date??false) bus.status = 'pending booking'
            })
            updatedFields.itinerary.cabs.forEach(cab=>{
              if((cab.date??false) || (cab.type!='regular')) cab.status = 'pending booking'
            })
            updatedFields.itinerary.hotels.forEach(hotel=>{
              if(hotel.checkIn??false) hotel.status = 'pending booking'
            }) 
        }
        await TravelRequest.findOneAndUpdate({travelRequestId}, {$set: {...updatedFields, travelRequestStatus:'pending booking'}});
        res.status(200).json({message: 'Travel Request submitted for booking'})
        // send data to approval microservice
      } 

    }

    //travel request status is pending booking
    else if(travelRequestStatus == 'pending booking'){
      //check if any new itinerary item is added. if so treat it as a draft status request
      //and send for approval if required
      let itemAdded = false
      let status = ''

      if(updatedFields.hasOwnProperty('itinerary')){
          updatedFields.itinerary.flights.forEach(flight=>{
            if((flight.date??false) && flight.status == 'draft'){
              flight.status = lastApprovers.length>0? 'pending approval' : 'pending booking'
              itemAdded = true
            }
          })
          updatedFields.itinerary.trains.forEach(train=>{
            if((train.date??false) && train.status == 'draft'){
              train.status = lastApprovers.length>0? 'pending approval' : 'pending booking'
              itemAdded = true
            }
          })
          updatedFields.itinerary.buses.forEach(bus=>{
            if((bus.date??false) && bus.status == 'draft'){
              bus.status = lastApprovers.length>0? 'pending approval' : 'pending booking'
              itemAdded = true
            }
          })
          updatedFields.itinerary.cabs.forEach(cab=>{
            if(((cab.date??false) || (cab.type!='regular')) && cab.status == 'draft'){
              cab.status = lastApprovers.length>0? 'pending approval' : 'pending booking'
              itemAdded = true
            }
          })
          updatedFields.itinerary.hotels.forEach(hotel=>{
            if((hotel.checkIn??false) && hotel.status == 'draft'){
              hotel.status = lastApprovers.length>0? 'pending approval' : 'pending booking'
              itemAdded = true
            }
          })
      }

      if(updatedFields.hasOwnProperty('approvers')){
        if(updatedFields.approvers.length>0){
          if(JSON.stringify(lastApprovers) != JSON.stringify(updatedFields.approvers)){
            status = 'pending approval'
          }

          if(itemAdded) status = 'pending approval'

          else status = 'pending booking'
        }
        else status = 'pending booking'
      }
      else status = 'pending booking'

      console.log(status, 'status -pending booking route line-470')

      await TravelRequest.findOneAndUpdate({travelRequestId}, {$set: {...updatedFields, travelRequestStatus:status}});
      res.status(200).json({message: 'Travel Request submitted for booking'})

      if(status == 'pending approval'){
        // send data to approval microservice
      }
      
    }

    //travel request status is pending approval
    else if(travelRequestStatus == 'pending approval'){
      //check if any new itinerary item is added. if so treat it as a draft status request
      //and send for approval if required
      let itemAdded = false
      let status = ''

      if(updatedFields.hasOwnProperty('itinerary')){
        updatedFields.itinerary.forEach(item=>{
          if((item?.departure?.date??false) && (item?.departure?.status == 'draft') ){
            item.departure.status = lastApprovers.length>0? 'pending approval' : 'pending booking'
            itemAdded = true
          }
          if((item?.return?.date??false) && (item?.return?.status == 'draft')) {
            item.return.status = lastApprovers.length>0? 'pending approval' : 'pending booking'
            itemAdded = true
          }
          if((item?.boardingTransfer?.date??false) && (item?.boardingTransfer?.status == 'draft')){
            item.boardingTransfer.status = lastApprovers.length>0? 'pending approval' : 'pending booking'
            itemAdded = true
          }
          if((item?.hotelTransfer?.date??false) && (item?.hotelTransfer?.status == 'draft')){
            item.hotelTransfer.status = lastApprovers.length>0? 'pending approval' : 'pending booking'
            itemAdded = true
          }
          item.cabs.forEach(cab=>{
            if((cab.date??false) && cab.status == draft){
              cab.status = lastApprovers.length>0? 'pending approval' : 'pending booking'
              itemAdded = true
            }
          })
          item.hotels.forEach(hotel=>{
            if((hotel.checkIn??false) && hotel.status == 'draft'){
              hotel.status = lastApprovers.length>0? 'pending approval' : 'pending booking'
              itemAdded = true
            }
          })
        }) 


      }

      if(updatedFields.hasOwnProperty('approvers')){
        if(updatedFields.approvers.length>0){
          if(JSON.stringify(lastApprovers) != JSON.stringify(updatedFields.approvers)){
            status = 'pending approval'
          }

          if(itemAdded) status = 'pending approval'

          else status = 'pending booking'
        }
      }
      else status = 'pending booking'

      await TravelRequest.findOneAndUpdate({travelRequestId}, {$set: {...updatedFields, travelRequestStatus:status}});
      res.status(200).json({message: 'Travel Request submitted for booking'})

      if(status == 'pending approval'){
        // send data to approval microservice
      }
      
    }

    //travel request status is cancelled
    else if(travelRequestStatus == 'cancelled'){
      return res.status(400).json({message: 'This Travel Request has been cancelled. Please raise a fresh Travel Request'})
    }

    else if(travelRequestStatus == 'booked'){
      return res.status(400).json({message: 'Travel Request is already booked. Please go to trip modification if you want to modify this trip'})
    }

    else if(travelRequestStatus == 'rejected'){
      {
        if(!req.body?.submitted??true){ 
          return res.status(400).json({ message: "Field or value for field is missing: 'submitted' " })
        }
  
        //check for approvers
        if(req.body.hasOwnProperty("approvers") && req.body.approvers.length>0){
          // might need to 
          //check with t&e how many approvers should be there
          //and wether he is selecting correct approvers
  
          //update status of each itinerary item to pending approval
          if(updatedFields.hasOwnProperty('itinerary')){
              updatedFields.itinerary.forEach(item=>{
                if(item?.departure?.date??false) item.departure.status = 'pending approval'
                if(item?.return?.date??false) item.return.status = 'pending approval'
                if(item?.boardingTransfer?.date??false) item.boardingTransfer.status = 'pending approval'
                if(item?.hotelTransfer?.date??false) item.hotelTransfer.status = 'pending approval'
                item.cabs.forEach(cab=>{
                  if(cab.date??false) cab.status = 'pending approval'
                })
                item.hotels.forEach(hotel=>{
                  if(hotel.checkIn??false) hote.status = 'pending approval'
                })
              }) 
          }
  
          //update data in backend with status 'pending approval'
          await TravelRequest.findOneAndUpdate({travelRequestId}, {$set: {...updatedFields, travelRequestStatus:'pending approval'}});
          res.status(200).json({message: 'Travel Request submitted for approval'})
          // send data to approval microservice
        }
  
        else{
          //update data in backend with status 'pending booking'
          //update status of each itinerary item to pending booking
          if(updatedFields.hasOwnProperty('itinerary')){
            updatedFields.itinerary.forEach(item=>{
              if(item?.departure?.date??false) item.departure.status = 'pending booking'
              if(item?.return?.date??false) item.return.status = 'pending booking'
              if(item?.boardingTransfer?.date??false) item.boardingTransfer.status = 'pending booking'
              if(item?.hotelTransfer?.date??false) item.hotelTransfer.status = 'pending booking'
              item.cabs.forEach(cab=>{
                if(cab.date??false) cab.status = 'pending booking'
              })
              item.hotels.forEach(hotel=>{
                if(hotel.checkIn??false) hotel.status = 'pending booking'
              })
            }) 
          }
          await TravelRequest.findOneAndUpdate({travelRequestId}, {$set: {...updatedFields, travelRequestStatus:'pending booking'}});
          res.status(200).json({message: 'Travel Request submitted for booking'})
          // send data to approval microservice
        } 
  
      }
    }

    else {
      return res.status(400).json({message: 'Unrecognized status'})
    }

  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

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
    let { travelRequestStatus } = req.body;

    //check if received status is valid
    travelRequestStatus.toLowerCase();

    //everything is okay attempt updating status
    const result = await TravelRequest.findOneAndUpdate(
      { travelRequestId },
      {$set: {travelRequestStatus} },
    );

    if (!result) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json({
      message: `Status updated to ${travelRequestStatus}`,
    });

    if(result.travelRequestStatus == 'pending approval'){
      //send data to be saved in approval container

    }

  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const getTravelPolicies = async (req, res)=>{
  try{ 
    const {tenantId, travelType, groups} = req.params()
    const travelPolicies = HRMaster.findOne({tenantId}, {policies})

  }catch(e){
    console.log(e)
    return res.status(500).json({message:'Internal server error'})
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
};
