import express from 'express';
import { TravelExpenseStatusApproved, TravelExpenseStatusRejected, getExpenseDetails, saveDataInApprovalContainer, viewTravelExpenseDetails } from '../controllers/travelExpenseApproval.js';

const router = express.Router();

//route for updating/Creating, travel/non-travel expense data in the approval container
router.post('/saveDataInApprovalContainer', saveDataInApprovalContainer);

//travelExpenseDetails
router.get('/list/:empId', getExpenseDetails);

router.get('/:expenseHeaderType/:expenseHeaderID/:empId', viewTravelExpenseDetails);

//To approve travel expense
router.put('/approve/:expenseHeaderID/:empId',TravelExpenseStatusApproved);

//To reject travel expense
router.put('/reject/:expenseHeaderID/:empId', TravelExpenseStatusRejected);

// Export the router
export default router;
