import express from 'express';
import { filterTravelExpenses } from '../controllers/tripController.js';

const travelExpensesRouter = express.Router()

travelExpensesRouter.post('/filter/:tenantId/:empId', filterTravelExpenses)

export {travelExpensesRouter}