import express from 'express';
import { triggerBatchJobController } from '../controllers/triggerBatchJob.js';

const router = express.Router();

// Endpoint to trigger the batch job
router.post('/batchjob/transit', triggerBatchJobController);

export default router;
