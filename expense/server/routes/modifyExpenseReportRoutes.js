import express from 'express';
import {onDeleteLineItem, onDraftLineItem, onSaveLineItem, submitTravelExpenseReport} from '../controllers/modifyExpenseReport.js';

const modifyExpenseRouter = express.Router();


// 1)On save line item the cash advance gets updated
modifyExpenseRouter.post('/line_item/:tenantId/:empId/:expenseHeaderID', onSaveLineItem);

// 2) On Draft line item the cash advance gets updated
modifyExpenseRouter.post('/line_item/:tenantId/:empId/:expenseHeaderID', onDraftLineItem);

// 3) Submit expense report
modifyExpenseRouter.post('/submitTravelExpenseReport/:tenantId/:empId/:expenseHeaderID', submitTravelExpenseReport);

// 4) onDeleteLineItem for travel expense report , update cash advance (if taken)
modifyExpenseRouter.delete('/onDeleteLineItem/:tenantId/:empId/:expenseHeaderID/:_id', onDeleteLineItem);


export default modifyExpenseRouter





