import express from 'express';
import { approveCashRaisedLater, getPendingCashAdvances, getPendingCashAdvancesForEmployee, rejectCashAdvanceRaisedLater } from '../controllers/cashAdvance.js';

const router = express.Router();

//Standalone cash advance with travel request approved status.
//Approval Flow for Travel Requests with cash advance - Raised Separately
router.get('/raised-later/:tenantId/:empId', getPendingCashAdvances);

// get details of cash advance raised later for a single travel request
router.get( '/details/:tenantId/:travelRequestId/:empId', getPendingCashAdvancesForEmployee);

// approve cash advance raised later
router.patch( '/approve/:tenantId/:travelRequestId/:empId', approveCashRaisedLater);

// reject cash advance raised later
router.patch( '/reject/:tenantId/:travelRequestId/:empId', rejectCashAdvanceRaisedLater);


export default router;