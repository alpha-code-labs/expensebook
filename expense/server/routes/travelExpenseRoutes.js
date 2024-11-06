import express from 'express';
import { BookExpense, currencyConverter, getTripDetails, onSaveExpenseLine,onEditExpenseLine, cancelAtLine, onSaveAsDraftExpenseReport, onSubmitExpenseHeader, cancelAtHeaderLevelForAReport, getRejectionReasons} from '../controller/travelExpenseController.js';
import { editBodySchema, editParamsSchema, validateRequest } from '../validations/travelExpense.js';

export const travelExpenseReport = express.Router();


travelExpenseReport.get('/:tenantId/:empId/:tripId/book-expense', BookExpense );

travelExpenseReport.post('/:tenantId/:empId/:tripId/:expenseHeaderId/save', onSaveExpenseLine);

travelExpenseReport.post('/:tenantId/:empId/:tripId/:expenseHeaderId/edit', validateRequest(editParamsSchema,editBodySchema), onEditExpenseLine);

travelExpenseReport.get('/:tenantId/:empId/:tripId', getTripDetails);

travelExpenseReport.post('/:tenantId/currency-converter', currencyConverter);

travelExpenseReport.patch('/:tenantId/:empId/:tripId/:expenseHeaderId/cancel-line', cancelAtLine);

travelExpenseReport.patch('/:tenantId/:empId/:tripId/:expenseHeaderId/cancel', cancelAtHeaderLevelForAReport);

travelExpenseReport.patch('/:tenantId/:empId/:tripId/:expenseHeaderId/draft', onSaveAsDraftExpenseReport);

travelExpenseReport.patch('/:tenantId/:empId/:tripId/:expenseHeaderId/submit', onSubmitExpenseHeader);

travelExpenseReport.get('/:tenantId/:empId/:tripId/:expenseHeaderId/rejected', getRejectionReasons);


