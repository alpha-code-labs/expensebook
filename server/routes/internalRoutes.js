import express from "express";
import {
  updateTravelRequest,
  updateTravelRequestStatus,
  getTravelRequest,
  getTravelRequestStatus,
  getTravelRequests,
  updateOnboardingContainer,
  updateCashAdvanceFlag,
} from "../controllers/internalTravelRequestController.js";

const router = express.Router();

router.get("/travel-requests/", getTravelRequests);
router.get("/travel-requests/:travelRequestId", getTravelRequest);
router.get("/travel-requests/:travelRequestId/status", getTravelRequestStatus);
router.post("/travel-requests/:travelRequestId", updateTravelRequest);
router.patch("/travel-requests/:travelRequestId/status", updateTravelRequestStatus);
router.patch("/travel-requests/:travelRequestId/cash-advance-flag", updateCashAdvanceFlag);
router.post("/onboarding", updateOnboardingContainer)
export default router;
