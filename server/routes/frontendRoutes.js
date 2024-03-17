import express from "express";
import multer from "multer";
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
  updateTravelBookings,
  getBookingsInitialData,
  validateTripPurpose,
} from "../controllers/frontendTravelRequestController.js";
import { handleFileUpload, uploadMiddleware } from "../services/ocr.js";


const storage = multer.memoryStorage(); // Use memory storage for storing file buffers
const upload = multer({ storage: storage });


const router = express.Router();


router.get("/initial-data/:tenantId/:employeeId/:travelType", getOnboardingAndProfileData);
router.get("/travel-requests/:travelRequestId", getTravelRequest);
router.get("/travel-requests/:travelRequestId/status", getTravelRequestStatus);
router.patch("/travel-requests/:travelRequestId", updateTravelRequest);
router.patch("/travel-requests/:travelRequestId/status", updateTravelRequestStatus);
router.patch("/travel-requests/:travelRequestId/cancel", cancelTravelRequest);
router.post("/travel-request", createTravelRequest);
router.post("/validate-policy/:tenantId", validateTripPurpose);
router.get("/user-travel-requests/:employeeId", getTravelRequests);
router.get("/travel-requests/modify/:travelRequestId", getTravelRequest);
router.patch("/travel-requests/:travelRequestId/bookings", updateTravelBookings)
router.get('/bookings-initial-data/:tenantId/:employeeId/:travelType', getBookingsInitialData)

//bill upload
router.post("/upload-bill/:travelRequestId", uploadMiddleware, handleFileUpload )

export default router;

