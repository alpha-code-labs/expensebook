import express from 'express';
import { triggerBatchJobNow } from '../controllers/batchJobController.js'; 
// import { triggerAdjustingCashBatchJob } from '../controllers/batchJobController.js';

const router = express.Router();

// Define the API route to trigger the batch job
router.post('/runBatchJob', triggerBatchJobNow);

// //Adjusting cash batch job trip icon/dashboard
// router.post('/trigger-cash-batch-job', triggerAdjustingCashBatchJob);

export default router;
