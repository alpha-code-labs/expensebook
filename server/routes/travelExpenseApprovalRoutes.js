import express from 'express';
import { TravelexpenseHeaderStatusApproved, TravelexpenseHeaderStatusRejected, getExpenseDetails, saveDataInApprovalContainer, viewTravelExpenseDetails } from '../controllers/travelExpenseApproval.js';

const router = express.Router();

//route for updating/Creating, travel/non-travel expense data in the approval container
router.post('/saveDataInApprovalContainer', saveDataInApprovalContainer);

//travelExpenseDetails
router.get('/list/:empId', getExpenseDetails);

router.get('/:tenantId/:empId/:tripId/:expenseHeaderId', viewTravelExpenseDetails);

//To approve travel expense
router.patch('/:tenantId/:empId/:tripId/:expenseHeaderId/approve',TravelexpenseHeaderStatusApproved);

//To reject travel expense
router.patch('/:tenantId/:empId/:tripId/:expenseHeaderId/reject', TravelexpenseHeaderStatusRejected);

// Export the router
export default router;
