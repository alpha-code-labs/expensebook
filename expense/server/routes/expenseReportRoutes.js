import express from 'express';
import { totalAdvanceForTransitTrip,fetchExpenseReportDetails, getDefaultCurrency, policyOnGroupsAndApprovalForAEmp, currencyConverter, getRejectedExpenses, cancelExpenseLinesOrReport, getTravelExpenseReport } from '../controllers/expenseReport.js';

const expenseReport = express.Router();

//1)Expense report details
expenseReport.get('/fetchExpenseReportDetails/:tenantId/:travelRequestId/:empId', (req, res) => {
    fetchExpenseReportDetails(req, res); // Pass the 'req' and 'res' objects received from Express
  });
  
//2)get default currency
expenseReport.get('/default_currency/:tenantId/:tenantName', getDefaultCurrency);

//3)calculate total cash advance for transit trips
expenseReport.get('/paid_cash/:travelRequestId/:empId', totalAdvanceForTransitTrip);

//4)
expenseReport.get('/policy/:tenantId/:empId', policyOnGroupsAndApprovalForAEmp);

//5) currency converter
expenseReport.get('/currency_converter/:tenantId/:currencyName/:amount', currencyConverter);

//6) get rejected travel and non travel expense reports
expenseReport.get('/getRejectedExpenses/:tenantId/:empId/:expenseHeaderID', getRejectedExpenses);

//7) CANCEL at expense line item LEVEL OR HEADER level FOR TRAVEl AND NON-TRAVEL expenseS
expenseReport.patch('/cancelExpenseLinesOrReport/:tenantId/:empId/:expenseHeaderID', cancelExpenseLinesOrReport);

//8) Get travel expense reports BY expenseHeaderID
expenseReport.get('/getTravelExpenseReport/:tenantId/:empId/:expenseHeaderID', getTravelExpenseReport );


export default expenseReport;






