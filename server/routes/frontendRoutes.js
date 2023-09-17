import express from "express";
import {
  getOnboardingAndProfileData,
  createTravelRequest,
  updateTravelRequest,
  updateTravelRequestStatus,
  getTravelRequest,
  getTravelRequestStatus,
  handoverToCash
} from "../controllers/frontendTravelRequestController.js";

const router = express.Router();


router.get("/initial-data", getOnboardingAndProfileData);
router.get("/travel-requests/:travelRequestId", getTravelRequest);
router.get("/travel-requests/:travelRequestId/status", getTravelRequestStatus);
router.put("/travel-requests/:travelRequestId", updateTravelRequest);
router.put("/travel-requests/:travelRequestId/status", updateTravelRequestStatus);
router.get("/travel-requests/:travelRequestId/handover", handoverToCash );
router.post("/travel-request", createTravelRequest);

export default router;
