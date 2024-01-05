import express from 'express';
import CashAdvance from '../models/cashSchema.js';
import {createCashAdvance, getCashAdvances, getCashAdvance, updateCashAdvance, getInitialData_cash, validateCashAdvancePolicy, cancelCashAdvance} from '../controllers/cashAdvanceController.js';
import { cancelTravelRequest, getTravelRequest, updateTravelRequest } from '../controllers/travelRequestController.js';
import { getOnboardingAndProfileData } from '../controllers/travelRequestController.js';

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

router.get("/initial-data/:tenantId/:employeeId", getOnboardingAndProfileData);

router.get("/initial-data-cash/:tenantId/:employeeId", getInitialData_cash)

//policy validation
router.post("/validate-cash-policy/:tenantId", validateCashAdvancePolicy)

export default router;