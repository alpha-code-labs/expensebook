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
import { sendToDashboardQueue, sendToOtherMicroservice } from "../rabbitMQ/publisher.js";

const getOnboardingAndProfileData = async (req, res) => {
  try {
    const { tenantId, employeeId, travelType } = req.params;

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
    const travelRequestNumber = createTravelRequestId(companyName, count+1) 
    //fileds which will not be received in request
    const travelRequestDate = new Date().toISOString();
  
    const newTravelRequest = new TravelRequest({
      tenantId,
      tenantName,
      companyName,
      travelRequestId,
      travelRequestNumber,
      tripPurpose,
      travelRequestStatus,
      travelRequestState,
      createdBy,
      createdFor,
      teamMembers,
      travelAllocationHeaders,
      itinerary,
      tripType,
      travelDocuments,
      bookings,
      approvers,
      assignedTo: null,
      bookedBy: null,
      recoveredBy: null,
      preferences,
      travelViolations,
      travelRequestDate,
      travelBookingDate:undefined,
      travelCompletionDate:undefined,
      travelRequestRejectionReason:null,
      isCancelled:false,
      cancellationDate:undefined,
      cancellationReason:undefined,
      sentToTrip:false,
      isCashAdvanceTaken:false,
      isAddALeg:false,
    });

    //update Travel Request container with newly created travel request
    const savedNewTravelRequest = await newTravelRequest.save();

     //send data to rabbitmq
     await sendToOtherMicroservice(savedNewTravelRequest, 'To update newly created travel request in dashboard', 'dashboard')

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

const validateTripPurpose = async (req, res)=>{
  try{
    const {tenantId} = req.params
    const {groups, type, value } = req.body

    console.log(groups, type, value, tenantId)
    //get tenant flags and policies
    if(!groups || !type || !Array.isArray(groups) || !value || type=='' || type=='null' || type=='undefined' || value == 'null' || value=='undefined' || value=='' ){
      return res.status(400).json({message: 'Bad Request. Missing values or invalid parameters/parameter type were present in request'})
    }

    if(groups.length == 0) return res.status(200).json({allowed:null, violationMessage:null, message: 'groups not present to check policy'})

    const tenant = await HRMaster.findOne({tenantId}, {flags:1, policies: 1})

    if(!tenant){
      return res.status(404).json({allowed:null, violationMessage:null, message: 'Can not fetch tenant details at the moment' })
    }

    if(!tenant.flags.POLICY_SETUP_FLAG){
      return res.status(200).json({allowed:true, violationMessage:null, message: 'Policy not setup'})
    }

    //policies exists check for allowed trip purposes for the given groups
    const policies = tenant.policies.travelPolicies??[]

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

    let allowed = false;
    let violationMessage = `Your company policies do not allow you to travel for ${value} purposes`;
    groups.forEach(group=>{
      const res =  getPolicy(group, 'Allowed Trip Purpose', type)
      console.log(res)
      if(res.class[value].allowed == true){
        allowed = true;
        violationMessage = null;
        return
      }
    })

    return res.status(200).json({allowed, violationMessage})


  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Internal Server Error'})
  }
}

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
        const items = ['flights', 'trains', 'buses', 'cabs', 'hotels', 'carRentals', 'personalVehicles']
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
      await sendToOtherMicroservice(result, 'To update entire travelRequestData in dashboard microservice', 'dashbaord')
      

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
          sendToOtherMicroservice(result, 'To update entire travelRequestData in approval microservice', 'approval')
          return res.status(200).json({message: `Travel Request Sent for booking`})
      }
      //send res
      else{
        return res.status(200).json({message: `Travel Request Sent for booking`});
      }      
    }

    if(submitted){
      //update all itinerary items to appropriate state
      console.log('itinerary is present')
        const items = ['flights', 'trains', 'buses', 'cabs', 'hotels', 'carRentals', 'personalVehicles']
        items.forEach(item=>{
          travelRequestData.itinerary[item].forEach(subItem=>{
              subItem.status = needApproval? 'pending approval' : 'pending booking'
          })
        })

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
        await sendToOtherMicroservice(result, 'To update entire travelRequestData in dashbaord microservice', 'dashboard')

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
          sendToOtherMicroservice(result, 'To update entire travelRequestData in approval microservice', 'approval')
          return res.status(200).json({message: `Travel Request Sent for approval`})
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

        // console.log(travelRequestData, 'after saving')

        if(!result){
          return res.status(400).json({
            message:'Can not update database please try again',
          });  
        }

 
        //send data to rabbitmq
        await sendToOtherMicroservice(result, 'To update entire travelRequestData in dashboard microservice', 'dashboard')

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
    const travelRequest = await TravelRequest.findOne({travelRequestId})
    if(!travelRequest) return res.status(404).json({message: 'Can not find requested resource'})

    //notify cancellatin to approval ms if tr status is still penidng approval
    const sendToApproval = travelRequest?.approvers?.length>0 && travelRequest?.travelRequestStatus == 'pending approval'

    console.log(travelRequest.approvers, travelRequest.travelRequestStatus)

    //update all itinerary item status to cancelled
    const items = ['flights', 'trains', 'buses', 'cabs', 'hotels', 'personalVehicles']
    items.forEach(item=>{
      travelRequest.itinerary[item].forEach(subItem=>{
        subItem.status = 'cancelled'
      })
    })
  
    //update  status to cancelled
    travelRequest.travelRequestStatus = 'cancelled'
    travelRequest.cancellationDate = new Date().toISOString();
    travelRequest.isCancelled = true;

    const sentToDashboard = await sendToDashboardQueue(travelRequest, 'To cancel the travel request in dashboard', 'full-update', 'online')

    if(!sentToDashboard) {
      return res.status(400).json({message: 'Can not perform requested operation at the moment'})
    }

    //update data in database
    await travelRequest.save()

    if(sendToApproval){
        const payload = {tenantId:travelRequest.tenantId, travelRequestId: travelRequest.travelRequestId, travelRequestStatus:'cancelled'}
        sendToOtherMicroservice(payload, 'To update status of travel request to cancelled', 'approval', 'travel', 'online', 'status-update')
        res.status(200).json({message: `Travel Request cancelled`,});
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
      console.log('booking request submitted by user')
      //change all individual line statuses to booked, change main status to booked
      const message = {message: 'Booking Values not uploaded correctly'}

      const itineraryTypes = ['flights', 'cabs', 'carRentals', 'hotels', 'trains', 'buses'] 

      

      for (const itemType of itineraryTypes) {
        for (const item of itinerary[itemType]) {
          if (itemType === 'flights' || itemType === 'trains' || itemType === 'buses') {
            if (item.bkd_from == null || item.bkd_from == 'undefined') {
              return res.status(400).json(message);
            }
            if (item.bkd_to == null || item.bkd_to == 'undefined') {
              return res.status(400).json(message);
            }
          }
      
          if (itemType === 'cabs' || itemType === 'carRentals') {
            if (item.bkd_pickupAddress == null || item.bkd_pickupAddress == 'undefined') {
              return res.status(400).json(message);
            }
            if (item.bkd_dropAddress == null || item.bkd_dropAddress == 'undefined') {
              return res.status(400).json(message);
            }
          }
      
          if (itemType === 'hotels') {
            if (item.bkd_location == null || item.bkd_location == 'undefined') {
              return res.status(400).json(message);
            }
          }
        }
      }
      
      // Continue with the rest of your code if needed
      

      //everything looks fine change status of each itinerary item to booked 
      itineraryTypes.forEach(itemType=>{
        itinerary[itemType].forEach(item=>{
          if(item.status == 'pending booking'){
            item.status = 'booked'
          }
        })
      })

      //change main travelRequest status to booked
      travelRequest.travelRequestStatus = 'booked'
      travelRequest.itinerary = itinerary

      //change sent to trip flas as no
      travelRequest.sentToTrip = false;

      console.log('Updated everything')

      //send data to rabbitmq.. 
      // const sentToDashboard = await sendToDashboardQueue(travelRequest, 'to update travel request contents after booking', 'full-update','online')
      // if(!sentToDashboard) {
      //   return res.status(400).json({message: 'Can not perform requested operation at the moment'})
      // }

      console.log('Saving Request')
      await travelRequest.save()

      console.log('Sending response')
  
      return res.status(200).json({message: 'Travel Request marked as Booked'})
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

    let policies = tenantData.policies.travelPolicies??[]
    console.log(policies)
    // if(Object.keys(policies).length> 0){
    //   policies = Object.keys(policies).map(key=> policies[key])
    // }

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
    
    const dummyGroups =  employeeGroups //['Engineers', 'All']
    const checkPolicies = ['Flight', 'Train', 'Cab Rental', 'Cab', 'Hotel']
    let allowed = {}
    //for now fetch data for group 'Engineers'
    const maxAllowedLimit = null
    async function extractor(checkPolicies, groups, travelType){
      try{
        checkPolicies.forEach(item=>{
          const groupPolicies = []
            groups.forEach(group=>{
                groupPolicies.push(getPolicy(group, item, travelType))
            })

            console.log(groupPolicies)
            
            let _class = {}
            let _limit = 0
            
            Object.keys(groupPolicies[0]?.class??[]).forEach(cl=>{
                _class = {..._class, [cl]:false}
            })
            
            groupPolicies.forEach(pl=>{
                Object.keys(pl?.class??[]).forEach(cl=>{
                    if(pl.class[cl].allowed) _class[cl] = true
                })
                if(Number(pl?.limit?.amount)>_limit) _limit = Number(pl.limit.amount) 
            })

            allowed = {...allowed, [item]: {class:_class, limit:_limit}}
      })
      }catch(e){
        console.log(e)
      }
    }
    
    extractor(checkPolicies, dummyGroups, 'international')

    const travelClassOptions={
      'flight':Object.keys(policies[0][Object.keys(policies[0])[0]][travelType]?.['Flight']?.class??['Economy', 'Premium Economy', 'Business', 'First']),
      'train': Object.keys(policies[0][Object.keys(policies[0])[0]][travelType]?.['Train']?.class??['First AC', 'Second AC', 'Third AC', 'Chair Car', 'Sleeper']),
      'bus': ['Sleeper', 'Semi-Sleeper', 'Regular'],
      'cab': Object.keys(policies[0][Object.keys(policies[0])[0]][travelType]?.['Cab']??['Regular', 'Executive'])
    }
    const hotelClassOptions = Object.keys(policies[0][Object.keys(policies[0])[0]][travelType]?.['Hotel']?.class??['Motel', '3 Star', '4 Star', '5 Star'])
    const cabClassOptions = Object.keys(policies[0][Object.keys(policies[0])[0]][travelType]?.['Cab Rental']?.class??['Regular', 'Executive'])
    let minDaysBeforeBooking = 9999
    const allowInternationalSubmissionWithViolations = policies[0]?.[dummyGroups[0]]?.['international']?.['Allow International Travel Submission/booking with violations']?.permission?.allowed??true
    
    dummyGroups.forEach(group=>{
      policies.forEach(groupPolicy=>{
        if(groupPolicy[group]!=null && groupPolicy[group]!=undefined){
            const result = groupPolicy[group]?.[travelType]?.['Minimum Days to Book Before Travel']?.dayLimit?.days??999 
            if(result<minDaysBeforeBooking) minDaysBeforeBooking = result 
        }
      })
    })

    if(minDaysBeforeBooking == 9999) minDaysBeforeBooking=0

    return res.status(200).json({policies:allowed, minDaysBeforeBooking, allowInternationalSubmissionWithViolations, travelClassOptions, hotelClassOptions, cabClassOptions})

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
  getBookingsInitialData,
  validateTripPurpose,
};
