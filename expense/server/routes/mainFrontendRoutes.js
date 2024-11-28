import express from 'express';
import { travelExpenseRoutes } from './expenseRoutes.js';
import { travelExpenseReport } from './travelExpenseRoutes.js';
import { reimbursementRoutes } from './reimbursementRoutes.js';
// import { handleFileUpload, uploadMiddleware } from '../ocr/azure.js';
import { onSaveAsDraftExpenseHeader } from '../controller/expenseController.js';
import { handleFileUpload, uploadMiddleware } from '../ocr/openAI.js';
// import { uploadMiddleware, handleFileUpload } from "./controllers/fileUploadController.js";

export const mainFrontendRoutes = express.Router();

//Travel expense Routes
mainFrontendRoutes.use( '/travel', travelExpenseReport)

//Non travel expense routes
mainFrontendRoutes.use( '/non-travel', reimbursementRoutes);

// mainFrontendRoutes.post('/upload/:tenantId/:travelType/:category', uploadMiddleware, handleFileUpload); // azure 

mainFrontendRoutes.post('/upload/:tenantId/:travelType/:category', uploadMiddleware, handleFileUpload); //azure and openai


mainFrontendRoutes.post('/travel/:tenantId/:empId/:tripId/:expenseHeaderId/draft', onSaveAsDraftExpenseHeader);

// mainFrontendRoutes.post("/upload-bill/:tenantId/:travelType/:category", uploadMiddleware, handleFileUpload);

export default mainFrontendRoutes;
