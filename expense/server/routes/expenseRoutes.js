import express from 'express';
import {  cancelAtHeaderLevelForAReport, cancelAtLine, getClearRejectedReport, getModifyExpenseReport, getRejectedReport, getRejectionReasons, getTravelExpenseReport, onSaveAsDraftExpenseHeader, onSubmitExpenseHeader,} from '../controller/expenseController.js';

export const travelExpenseRoutes = express.Router();

//modify expense report 
travelExpenseRoutes.get('/:expenseHeaderId/modify', getModifyExpenseReport);

// get clear rejected travel expense reports ---- 
travelExpenseRoutes.get('/:expenseHeaderId/clear-rejected', getClearRejectedReport)

//on Draft 
travelExpenseRoutes.post('/:expenseHeaderId/draft', onSaveAsDraftExpenseHeader);

//on submit
travelExpenseRoutes.post('/:expenseHeaderId/submit', onSubmitExpenseHeader);

// cancel at header level
travelExpenseRoutes.post('/:expenseHeaderId/cancel-report', cancelAtHeaderLevelForAReport);

// cancel at line item
travelExpenseRoutes.post('/:expenseHeaderId/cancel-line', cancelAtLine);

//get expense report -- modify and this is same----
travelExpenseRoutes.get('/:tenantId/:tripId/:expenseHeaderId/expense-report', getTravelExpenseReport);

// get rejected expense report
travelExpenseRoutes.get('/rejected/:tenantId/:tripId/:expenseHeaderId', getRejectedReport);

// get rejection reason ---/clear-rejected
travelExpenseRoutes.get('/rejectionReason/:tenantId/:tripId/:expenseHeaderId', getRejectionReasons);






