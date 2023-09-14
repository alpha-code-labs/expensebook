import express from "express";
import {
  updateTravelRequest,
  updateTravelRequestStatus,
  getTravelRequest,
  getTravelRequestStatus,
  getTravelRequests
} from "../controllers/internalTravelRequestController.js";

const router = express.Router();

router.get("/travelRequests/", getTravelRequests);
router.put("/travelRequests/:travelRequestId", updateTravelRequest);
router.get("/travelRequests/:travelRequestId", getTravelRequest);
router.get("/travelRequests/status/:travelRequestId", getTravelRequestStatus);
router.put("/travelRequests/status/:travelRequestId", updateTravelRequestStatus);

export default router;
