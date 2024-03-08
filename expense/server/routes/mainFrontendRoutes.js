import express from 'express';
import { travelExpenseRoutes } from './expenseRoutes.js';
import { travelExpenseReport } from './travelExpenseRoutes.js';
import { reimbursementRoutes } from './reimbursementRoutes.js';
import { handleFileUpload, uploadMiddleware } from '../ocr/azure.js';
import { onSaveAsDraftExpenseHeader } from '../controller/expenseController.js';

export const mainFrontendRoutes = express.Router();

//Travel expense Routes
mainFrontendRoutes.use( '/travel', travelExpenseReport)

//Non travel expense routes
mainFrontendRoutes.use( '/non-travel', reimbursementRoutes);




mainFrontendRoutes.post('/api/upload', uploadMiddleware, handleFileUpload);


mainFrontendRoutes.post('/travel/:tenantId/:empId/:tripId/:expenseHeaderId/draft', onSaveAsDraftExpenseHeader);



