import express from "express";
import {
  updateTravelRequest,
  updateTravelRequestStatus,
  getTravelRequest,
  getTravelRequestStatus,
  getTravelRequests
} from "../controllers/internalTravelRequestController.js";

const router = express.Router();

router.get("/travel-requests/", getTravelRequests);
router.get("/travel-requests/:travelRequestId", getTravelRequest);
router.get("/travel-requests/:travelRequestId/status", getTravelRequestStatus);
router.put("/travel-requests/:travelRequestId", updateTravelRequest);
router.put("/travel-requests/:travelRequestId/status", updateTravelRequestStatus);

export default router;
