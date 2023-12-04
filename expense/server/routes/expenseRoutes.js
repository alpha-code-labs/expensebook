import express from 'express';
import { getEmbeddedTripDetails, updateExpense } from '../controllers/expense.js';


const expenseRouter = express.Router();

// expenseRouter.post('/savemod', insertDummyData );

// Define a route to receive updates from the Trip microservice
expenseRouter.post('/updateFromTrip', updateExpense);

//get embedded trip details
// Define the route to get the embedded Trip from Expense
expenseRouter.get('/trip/:tenantId/:empId/:expenseHeaderID', getEmbeddedTripDetails);

export default expenseRouter;
