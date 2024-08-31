import express from 'express';
import {  getExpenseDetails, saveDataInApprovalContainer, travelExpenseApproval, TravelExpenseHeaderStatusApproved, TravelExpenseHeaderStatusRejected, viewTravelExpenseDetails } from '../controllers/travelExpenseApproval.js';

const router = express.Router();

//route for updating/Creating, travel/non-travel expense data in the approval container
router.post('/saveDataInApprovalContainer', saveDataInApprovalContainer);

//travelExpenseDetails
router.get('/list/:empId', getExpenseDetails);

router.get('/:tenantId/:empId/:tripId/:expenseHeaderId', viewTravelExpenseDetails);

//Approve or reject travel expense report
router.patch('/:tenantId/:empId/:tripId/:expenseHeaderId', travelExpenseApproval)

// //To approve travel expense -- old
// router.patch('/:tenantId/:empId/:tripId/:expenseHeaderId/approve',TravelExpenseHeaderStatusApproved); 

// //To reject travel expense -- old
// router.patch('/:tenantId/:empId/:tripId/:expenseHeaderId/reject', TravelExpenseHeaderStatusRejected);

// Export the router
export default router;





