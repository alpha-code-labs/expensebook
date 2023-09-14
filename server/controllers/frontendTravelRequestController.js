import TravelRequest from "../models/travelRequest.js";
import createTravelRequestId from "../utils/createTravelRequestId.js";
import {
  fetchOnboardingData,
  fetchGroupAndPoliciesData,
} from "../services/onboardingService.js";
import { fetchProfileData } from "../services/dashboardService.js";
import policyValidation from "../utils/policyValidation.js";

const getOnboardingAndProfileData = async (req, res) => {
  try {
    const { tenantId, employeeId } = req.body;
    const onboardingData = await fetchOnboardingData(tenantId, employeeId);
    const profileData = await fetchProfileData(tenantId, employeeId);

    res.status(200).json({ data: { onboardingData, profileData } });
  } catch (e) {}
};

const createTravelRequest = async (req, res) => {
  try {
    const requiredFields = [
      "tenantId",
      "travelRequestId",
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
      "travelRequestDate",
      "travelBookingDate",
      "travelCompletionDate",
      "travelRequestRejectionReason",
      "travelAndNonTravelPolicies",
    ];

    // Check if all required fields are present in the request body
    const fieldsPresent = requiredFields.every((field) => req.body[field]);

    if (!fieldsPresent) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    //other validation methods are also needed,

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
    const travelRequestId = createTravelRequestId(tenantId, createdBy);

    //fileds which will not be received in request
    const travelRequestDate = Date.now();
    const travelBookingDate = null;
    const travelCompletionDate = null;
    const travelRequestRejectionReason = null;
    const travelAndNonTravelPolicies =
      await fetchGroupAndPoliciesData(tenantId);

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
    const { travelRequestId } = req.body;
    const travelRequest = TravelRequest.findOne({ travelRequestId });

    if (!travelRequest) {
      return res.status(404).json({ message: "not found" });
    }

    const { travelAndNonTravelPolicies, ...travelRequestData } = travelRequest;

    return res.status(200).json({ travelRequest: travelRequestData });
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
      { travelRequestStatus }
    );

    if (!travelRequestStatus) {
      return res.status(404).json({ message: "Document not found" });
    }

    return res.status(200).json(travelRequestStatus);
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateTravelRequestStatus = async (req, res) => {
  try {
    const { travelRequestId } = req.params;
    const { travelRequestStatus } = req.body;
    await TravelRequest.findOneAndUpdate(
      { travelRequestId },
      { travelRequestStatus }
    );

    if (!travelRequestStatus) {
      return res.status(404).json({ message: "Document not found" });
    }

    return res.status(200).json(travelRequestStatus);
  } catch (e) {
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
    const fieldsPresent = requiredFields.every((field) => req.body[field]);

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

export {
  getOnboardingAndProfileData,
  createTravelRequest,
  getTravelRequest,
  validateTravelPolicy,
  getTravelRequestStatus,
  updateTravelRequest,
  updateTravelRequestStatus,
};
