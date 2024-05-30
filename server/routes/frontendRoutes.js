import express from 'express';
import CashAdvance from '../models/cashSchema.js';
import {
  createCashAdvance, 
  getCashAdvances, 
  getCashAdvance, 
  updateCashAdvance, 
  getInitialData_cash, 
  validateCashAdvancePolicy,
  cancelCashAdvance} from '../controllers/cashAdvanceController.js';
import { 
    cancelTravelRequest, 
    getTravelRequest, 
    updateTravelBookings,
    getBookingsInitialData,
    validateTravelPolicy,
    updateTravelRequest } from '../controllers/travelRequestController.js';
import { getOnboardingAndProfileData } from '../controllers/travelRequestController.js';
import { uploadMiddleware, handleFileUpload} from '../services/ocr.js';

const router = express.Router();

//post cash advance along with corresponding travel request route
router.get('/ping', async (req, res)=>{
  return res.status(200).json('Alive and gigging! in Gurugram weather :)')
})

//get/post ca
router.post('/cash-advances/:travelRequestId',createCashAdvance);
router.post('/cash-advances/:travelRequestId/:cashAdvanceId', updateCashAdvance)

router.get('/cash-advances/:travelRequestId', getCashAdvances);
router.get('/cash-advances/:travelRequestId/:cashAdvanceId', getCashAdvance);

//cancel ca
router.post('/cash-advances/:travelRequestId/:cashAdvanceId/cancel', cancelCashAdvance)

//get/post tr
router.patch('/travel-requests/:travelRequestId', updateTravelRequest)
router.get('/travel-requests/:travelRequestId', getTravelRequest)

//cancel
router.patch('/travel-requests/:travelRequestId/cancel', cancelTravelRequest)

router.get("/initial-data/:tenantId/:employeeId/:travelType", getOnboardingAndProfileData);

router.get("/initial-data-cash/:tenantId/:employeeId/:travelType", getInitialData_cash)

//policy validation
router.post("/validate-cash-policy/:tenantId", validateCashAdvancePolicy)
router.post("/validate-travel-policy/:tenantId", validateTravelPolicy)

//bookings
router.patch("/travel-requests/:travelRequestId/bookings", updateTravelBookings)
router.get('/bookings-initial-data/:tenantId/:employeeId/:travelType', getBookingsInitialData)
router.post("/upload-bill/:travelRequestId", uploadMiddleware, handleFileUpload )

export default router;