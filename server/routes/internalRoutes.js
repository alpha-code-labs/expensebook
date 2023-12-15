import express from "express";
import {
  updateTravelRequest,
  updateTravelRequestStatus,
  getTravelRequest,
  getTravelRequestStatus,
  getTravelRequests,
  updateOnboardingContainer,
} from "../controllers/internalTravelRequestController.js";

const router = express.Router();

router.get("/travel-requests/", getTravelRequests);
router.get("/travel-requests/:travelRequestId", getTravelRequest);
router.get("/travel-requests/:travelRequestId/status", getTravelRequestStatus);
router.post("/travel-requests/:travelRequestId", updateTravelRequest);
router.put("/travel-requests/:travelRequestId/status", updateTravelRequestStatus);
router.post("/onboarding", updateOnboardingContainer)
export default router;
