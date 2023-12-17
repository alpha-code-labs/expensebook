import express from "express";
import {
  getOnboardingAndProfileData,
  createTravelRequest,
  updateTravelRequest,
  updateTravelRequestStatus,
  getTravelRequest,
  getTravelRequestStatus,
  validateTravelPolicy,
  getTravelRequests,
  cancelTravelRequest,
} from "../controllers/frontendTravelRequestController.js";

const router = express.Router();


router.get("/initial-data/:tenantId/:employeeId", getOnboardingAndProfileData);
router.get("/travel-requests/:travelRequestId", getTravelRequest);
router.get("/travel-requests/:travelRequestId/status", getTravelRequestStatus);
router.patch("/travel-requests/:travelRequestId", updateTravelRequest);
router.patch("/travel-requests/:travelRequestId/status", updateTravelRequestStatus);
router.patch("/travel-requests/:travelRequestId/cancel", cancelTravelRequest);
router.post("/travel-request", createTravelRequest);
router.post("/validate-policy/:tenantId", validateTravelPolicy);
router.get("/user-travel-requests/:employeeId", getTravelRequests);
router.get("/travel-requests/modify/:travelRequestId", getTravelRequest);


export default router;

