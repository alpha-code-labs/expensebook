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
    const { tenantId, employeeId } = req.body;

    if (!tenantId || !employeeId) {
      return res.status(400).json({ message: "Bad request" });
    }
    const onboardingData = await fetchOnboardingData(tenantId, employeeId);
    const profileData = await fetchProfileData(tenantId, employeeId);

    res.status(200).json({ data: { onboardingData, profileData } });
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const createTravelRequest = async (req, res) => {
  try {
    const requiredFields = [
      "tenantId",
      "travelRequestStatus",
      "travelRequestState",
      "createdBy",
      "createdFor",
      "travelAllocationHeaders",
      "itinerary",
      "travelDocuments",
      "approvers",
      "preferences",
      "travelViolations",
    ];

    console.log(req.body);

    // Check if all required fields are present in the request body
    const fieldsPresent = requiredFields.every((field) => field in req.body);

    if (!fieldsPresent) {
      return res
        .status(400)
        .json({ message: "Required headers are not present" });
    }

    const {
      tenantId,
      createdBy,
      createdFor,
      travelRequestStatus,
      travelRequestState,
      travelAllocationHeaders,
      itinerary,
      travelDocuments,
      approvers,
      preferences,
      travelViolations,
    } = req.body;

    if (
      tenantId == "" ||
      createdBy == "" ||
      createdFor == "" ||
      travelRequestStatus == "" ||
      travelRequestState == ""
    ) {
      return res.status(400).json({ message: "Required fileds are missing" });
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
      return res.status(400).json({ message: "Invalid status" });
    }

    //validate state
    const state = ["0", "1", "2", "3", "4", "5"];

    if (!state.includes(travelRequestState)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    //to do: validate tenantId, employeeId, some other as well

    const travelRequestId = createTravelRequestId(tenantId, createdBy);

    //fileds which will not be received in request
    const travelRequestDate = Date.now();
    const travelBookingDate = null;
    const travelCompletionDate = null;
    const travelRequestRejectionReason = null;
    const travelAndNonTravelPolicies = await fetchGroupAndPoliciesData(
      tenantId,
      createdBy
    );
    console.log(
      `tr-Id ${travelRequestId}`,
      `tr-policies: ${travelAndNonTravelPolicies}`
    );

    const newTravelRequest = new TravelRequest({
      tenantId,
      travelRequestId,
      travelRequestStatus,
      travelRequestState,
      createdBy,
      createdFor,
      travelAllocationHeaders,
      itinerary,
      travelDocuments,
      approvers,
      preferences,
      travelViolations,
      travelRequestDate,
      travelBookingDate,
      travelCompletionDate,
      travelRequestRejectionReason,
      travelAndNonTravelPolicies,
    });

    //update Travel Request container with newly created travel request
    await newTravelRequest.save();
    return res.status(201).json({ message: "Travel Request Created" });
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
    const { group, policy, value } = req.body;
    //input validation needed

    const validation = await policyValidation(group, policy, value);
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
      { travelRequestStatus }
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
      return res.status(400).json({ message: "Required fields are missing." });
    }

    //other validation methods are also needed,

    const { travelRequestId } = req.params;
    await TravelRequest.findOneAndUpdate(travelRequestId, req.body);
    return res
      .status(200)
      .json({ message: "Travel Request updated successfully" });
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

export {
  getOnboardingAndProfileData,
  createTravelRequest,
  getTravelRequest,
  validateTravelPolicy,
  getTravelRequestStatus,
  updateTravelRequest,
  updateTravelRequestStatus,
  handoverToCash,
};
