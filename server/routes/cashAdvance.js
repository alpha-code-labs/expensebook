import express from 'express';
import { getPendingCashAdvances } from '../controllers/cashAdvance.js';

const router = express.Router();

//Standalone cash advance with travel request approved status.
router.get('/standalone/:empId', getPendingCashAdvances);

export default router;