import TravelRequest from "../models/travelRequest.js";
import createTravelRequestId from "../utils/createTravelRequestId.js";
import {
  fetchOnboardingData,
  fetchGroupAndPoliciesData,
} from "../services/onboardingService.js";
import { fetchProfileData } from "../services/dashboardService.js";
import policyValidation from "../utils/policyValidation.js";
import { createCashAdvance } from "../services/cashService.js";

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
    ];

    // Check if all required fields are present in the request body
    const fieldsPresent = requiredFields.every((field) => field in req.body);

    if (!fieldsPresent) {
      return res
        .status(400)
        .json({ message: "Bad request. Missing required fields" });
    }

    const {
      tenantId,
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
      approvers,
      preferences,
      travelViolations,
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

    //validate status
    const status = [
      "draft",
      "approved",
      "rejected",
      "booked",
      "canceled",
      "completed",
    ];

    if (!status.includes(travelRequestStatus)) {
      return res.status(400).json({ message: "Invalid status ", travelRequestStatus });
    }

    //validate state
    const state = ["section 0", "section 1", "section 2", "section 3", "section 4", "section 5"];

    if (!state.includes(travelRequestState)) {
      return res.status(400).json({ message: "Invalid state ", travelRequestState });
    }

    //to do: validate tenantId, employeeId, some other as well

    const travelRequestId = createTravelRequestId(tenantId, createdBy.empId);

    //fileds which will not be received in request
    const travelRequestDate = Date.now();
    const travelBookingDate = null;
    const travelCompletionDate = null;
    const travelRequestRejectionReason = null;
    const newTravelRequest = new TravelRequest({
      tenantId,
      travelRequestId,
      travelRequestStatus,
      travelRequestState,
      tripPurpose,
      createdBy,
      createdFor,
      teamMembers,
      travelAllocationHeaders,
      itinerary,
      tripType,
      travelDocuments,
      approvers,
      preferences,
      travelViolations,
      travelRequestDate,
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
    return res.status(200).json(validation);
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
      "canceled",
      "completed",
    ];

    if (!status.includes(travelRequestStatus.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status" });
    }

    //everything is okay attempt updating status
    const result = await TravelRequest.findOneAndUpdate(
      { travelRequestId },
      {$set: travelRequestStatus }
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
      "travelRequestStatus",
      "travelRequestState",
      "createdFor",
      "tripPurpose",
      "travelAllocationHeaders",
      "itinerary",
      "travelDocuments",
      "approvers",
      "preferences",
      "teamMembers",
      "travelViolations",
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


    //validate status
    const status = [
      'draft', 
    'pending approval', 
    'approved', 
    'rejected', 
    'pending booking', 
    'booked',
    'transit', 
    'canceled',  
    ];

    if (travelRequestStatus && travelRequestStatus !="" && !status.includes(travelRequestStatus)) {
      return res.status(400).json({ message: "Invalid status ", travelRequestStatus });
    }

    //validate state
    const state = ["section 0", "section 1", "section 2", "section 3", "section 4", "section 5"];
    
    if (travelRequestState && travelRequestState !="" && !state.includes(travelRequestState)) {
      return res.status(400).json({ message: "Invalid state ", travelRequestState });
    }

    //other validation methods are also needed,

    const expectedFields = [
      "createdFor",
      "teamMembers",
      "tripPurpose",
      "travelRequestStatus",
      "travelRequestState",
      "travelAllocationHeaders",
      "itinerary",
      "travelDocuments",
      "approvers",
      "preferences",
      "travelViolations",
      "isModified",
      "isCancelled",
      "cancellationDate",
      "cancellationReason",
      "sentToTrip",
      "isCashAdvanceTaken"
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
    const travelRequestExists = await TravelRequest.findOne({travelRequestId}, {travelRequestId})
    if(!travelRequestExists || travelRequestExists.length==0){
      return res.status(404).json({message: 'Travel Request not found'})
    }

    //check if cash advance is taken
    if(req.body.hasOwnProperty('isCashAdvanceTaken')){
      if(req.body.isCashAdvanceTaken){
        //send data to cash microservice

      }
    }
    
    await TravelRequest.findOneAndUpdate({travelRequestId}, {$set: updatedFields});

    //check for approvers
    if(travelRequestStatus==='pending approval'){
      if(req.body.hasOwnProperty(approvers)){
        if(req.body.approvers.length>0 && r){
          // might need to 
          //check with t&e how many approvers should be there
          //and wether he is selecting correct approvers
  
          // send data to approval microservice

          return res.status(200).json({message: 'Travel Request submitted for approval'})
        }
      }
    }

    if(travelRequestStatus==='pending booking'){
      return res.status(200).json({message: 'Travel Request submitted for booking'})
    }

    return res.status(200).json({ message: "Travel Request updated" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const handoverToCash = async (req, res) => {
  try {
    const { travelRequestId } = req.params;
    const travelRequest = await TravelRequest.findOne({ travelRequestId });

    if (!travelRequest) {
      return res.status(404).json({ message: "Record not found" });
    }

    const cashAdvanceId = await createCashAdvance(travelRequest);

    res.status(200).json({ cashAdvanceId });
  } catch (e) {
    console.error(e);
    return res.status(200).json({ message: "Internal server error" });
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

export {
  getOnboardingAndProfileData,
  createTravelRequest,
  getTravelRequest,
  getTravelRequests,
  validateTravelPolicy,
  getTravelRequestStatus,
  updateTravelRequest,
  updateTravelRequestStatus,
  handoverToCash,
};
