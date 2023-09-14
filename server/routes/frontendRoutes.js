import express from "express";
import {
  getOnboardingAndProfileData,
  createTravelRequest,
  updateTravelRequest,
  updateTravelRequestStatus,
  getTravelRequest,
  getTravelRequestStatus,
} from "../controllers/frontendTravelRequestController.js";

const router = express.Router();

router.get("/initial-data", getOnboardingAndProfileData);
router.get("/travelRequests/:travelRequestId", getTravelRequest);
router.put("/travelRequests/:travelRequestId", updateTravelRequest);
router.post("/travelRequests/create", createTravelRequest);
router.get("/travelRequests/status/:travelRequestId", getTravelRequestStatus);
router.put(
  "/travelRequests/status/:travelRequestId",
  updateTravelRequestStatus
);

export default router;
