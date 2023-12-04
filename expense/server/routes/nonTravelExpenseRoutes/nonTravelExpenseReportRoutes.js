import express from 'express';
import {  currencyConverter, deleteExpenseLineItem, deleteNonTravelExpenseReport, draftNonTravelExpenseLine, getExpenseCategoriesGroupsForEmpId, getFormDetailsForExpenseCategory, getNonTravelExpenses, nonTravelPolicyValidation, saveNonTravelExpenseLine, submitNonTravelExpenseLine } from '../../controllers/nonTravelExpenseReport.js';

const nonTravelExpenseReport = express.Router();


// 1)Get expense categories for non travel expense booking
nonTravelExpenseReport.get('/expense_categories/:tenantId/:empId', getExpenseCategoriesGroupsForEmpId);

//2) get form details for a expense category selected and groupName too(group name comes only if selected )
nonTravelExpenseReport.get('/form/:tenantId/:empId',getFormDetailsForExpenseCategory);

//3)Non travel policy validation for no groups, with groups and no policy setup for a employee
nonTravelExpenseReport.get('/policy_validation/:tenantId/:empId',nonTravelPolicyValidation);

//4) currencyConverter
nonTravelExpenseReport.get('/currencyConverter/:tenantId/:currencyName/:amount',currencyConverter);

//5) status-save NonTravelExpenseLine 
nonTravelExpenseReport.post('/saveNonTravelExpenseLine/:tenantId/:empId', saveNonTravelExpenseLine);

//6) status-draft NonTravelExpenseLine 
nonTravelExpenseReport.post('/draftNonTravelExpenseLine/:tenantId/:empId', draftNonTravelExpenseLine );

//7) expenseStatus-pending settlement . expenseLineStatus-save NonTravelExpenseLine 
nonTravelExpenseReport.post('/submitNonTravelExpenseLine/:tenantId/:empId', submitNonTravelExpenseLine );

// 8)getNonTravelExpenses by expenseHeaderId
nonTravelExpenseReport.get('/getNonTravelExpenses/:tenantId/:empId/:expenseHeaderId', getNonTravelExpenses );

// 9) Expense line is deleted from expense report
nonTravelExpenseReport.delete('/deleteLineItem/:tenantId/:empId/:expenseHeaderId/:_id', deleteExpenseLineItem );

// 10) Delete non -travel expense report
nonTravelExpenseReport.delete('/deleteNonTravelExpenseReport/:tenantId/:empId/:expenseHeaderId', deleteNonTravelExpenseReport );


export default nonTravelExpenseReport;


