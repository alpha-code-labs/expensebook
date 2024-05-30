import express from 'express';
import { getReimbursementExpenseReport } from '../controllers/reimbursement.js';

export const reimbursementRoutes = express.Router();

reimbursementRoutes.post('/filter/:tenantId/:empId', getReimbursementExpenseReport)


