import express from 'express';
import { TravelexpenseHeaderStatusApproved, TravelexpenseHeaderStatusRejected, getExpenseDetails, saveDataInApprovalContainer, viewTravelExpenseDetails } from '../controllers/travelExpenseApproval.js';

const router = express.Router();

//route for updating/Creating, travel/non-travel expense data in the approval container
router.post('/saveDataInApprovalContainer', saveDataInApprovalContainer);

//travelExpenseDetails
router.get('/list/:empId', getExpenseDetails);

router.get('/details/:tenantId/:empId/:expenseHeaderId', viewTravelExpenseDetails);

//To approve travel expense
router.patch('/approve/tenantId/:empId/:expenseHeaderId',TravelexpenseHeaderStatusApproved);

//To reject travel expense
router.patch('/reject/:empId/:expenseHeaderId', TravelexpenseHeaderStatusRejected);

// Export the router
export default router;
