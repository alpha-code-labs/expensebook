import express from 'express';
import { createOrUpdateApproval, getTravelRequestByField } from "../controllers/approvalController.js";
import { fetchTravelRequestData } from '../services/travelService.js';
import { fetchCashAdvanceData } from '../services/cashService.js';

const router = express.Router();

// Route to fetch pending travel requests
router.get('/travelRequests', fetchTravelRequestData);

// Route to fetch cash advances
router.get('/cashAdvances', fetchCashAdvanceData);

//Save travel requests and cash advances in Approval
router.post('/save', createOrUpdateApproval);

//GET travel requests by tripPurpose / createdBy / createdFor for approver
router.get("/:empId", getTravelRequestByField);

export default router;


