import express from 'express';
import { BookExpenseReport, currencyConverter, getTripDetails, onSaveExpenseLine,onEditExpenseLine, cancelAtLine, onSaveAsDraftExpenseHeader, onSubmitExpenseHeader, cancelAtHeaderLevelForAReport, getRejectionReasons} from '../controller/travelExpenseController.js';

export const travelExpenseReport = express.Router();


travelExpenseReport.get('/:tenantId/:empId/:tripId/book-expense', BookExpenseReport );

travelExpenseReport.post('/:tenantId/:empId/:tripId/:expenseHeaderId/save', onSaveExpenseLine);

travelExpenseReport.post('/:tenantId/:empId/:tripId/:expenseHeaderId/edit', onEditExpenseLine);

travelExpenseReport.get('/:tenantId/:empId/:tripId', getTripDetails);

travelExpenseReport.post('/:tenantId/currency-converter', currencyConverter);

travelExpenseReport.patch('/:tenantId/:empId/:tripId/:expenseHeaderId/cancel-line', cancelAtLine);

travelExpenseReport.patch('/:tenantId/:empId/:tripId/:expenseHeaderId/cancel', cancelAtHeaderLevelForAReport);

travelExpenseReport.patch('/:tenantId/:empId/:tripId/:expenseHeaderId/draft', onSaveAsDraftExpenseHeader);

travelExpenseReport.patch('/:tenantId/:empId/:tripId/:expenseHeaderId/submit', onSubmitExpenseHeader);

travelExpenseReport.get('/:tenantId/:empId/:tripId/:expenseHeaderId/rejected', getRejectionReasons);


