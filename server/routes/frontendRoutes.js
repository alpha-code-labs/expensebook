import express from "express";
import {
  getOnboardingAndProfileData,
  createTravelRequest,
  updateTravelRequest,
  updateTravelRequestStatus,
  getTravelRequest,
  getTravelRequestStatus,
  handoverToCash,
  validateTravelPolicy,
  getTravelRequests
} from "../controllers/frontendTravelRequestController.js";

const router = express.Router();


router.get("/initial-data/:tenantId/:employeeId", getOnboardingAndProfileData);
router.get("/travel-requests/:travelRequestId", getTravelRequest);
router.get("/travel-requests/:travelRequestId/status", getTravelRequestStatus);
router.patch("/travel-requests/:travelRequestId", updateTravelRequest);
router.patch("/travel-requests/:travelRequestId/status", updateTravelRequestStatus);
router.get("/travel-requests/:travelRequestId/handover", handoverToCash );
router.post("/travel-request", createTravelRequest);
router.get("/validate-policy/:type/:group/:policy/:value", validateTravelPolicy);
router.get("/user-travel-requests/:employeeId", getTravelRequests);

export default router;
