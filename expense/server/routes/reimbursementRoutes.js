import express from 'express';
import { cancelReimbursementReport, draftReimbursementExpenseLine, editReimbursementExpenseLine, getExpenseCategoriesForEmpId, getHighestLimitGroupPolicy,  getReimbursementExpenseReport,  reimbursementCurrencyConverter, saveReimbursementExpenseLine,  submitReimbursementExpenseReport } from '../controller/reimbursementController.js';

export const reimbursementRoutes = express.Router();

//get expense categories
reimbursementRoutes.get( '/:tenantId/:empId/expensecategories', getExpenseCategoriesForEmpId);

//get expense category values and policy limit
reimbursementRoutes.get( '/:tenantId/:empId/:expenseCategory/policy', getHighestLimitGroupPolicy);

// non travel currency converter
reimbursementRoutes.get('/currency/:tenantId/:amount/:currencyName', reimbursementCurrencyConverter);

// on save line item
reimbursementRoutes.post('/:tenantId/:empId/:expenseHeaderId/save', saveReimbursementExpenseLine);

// on edit line item
reimbursementRoutes.patch('/:tenantId/:empId/:expenseHeaderId/:lineItemId/edit', editReimbursementExpenseLine);

// on draft line item
reimbursementRoutes.post('/:tenantId/:empId/:expenseHeaderId/draft', draftReimbursementExpenseLine);

//on submit non travel expense report
reimbursementRoutes.post('/:tenantId/:empId/:expenseHeaderId/submit', submitReimbursementExpenseReport);

// get non travel expense report
reimbursementRoutes.get('/:tenantId/:empId/:expenseHeaderId/report', getReimbursementExpenseReport);

// delete non travel expense report at headerlevel
reimbursementRoutes.patch('/:tenantId/:empId/:expenseHeaderId/delete', cancelReimbursementReport);

// delete non travel expense report at linelevel
reimbursementRoutes.patch('/:tenantId/:empId/:expenseHeaderId/delete-line', cancelReimbursementReport);




