import { triggerTransitBatchJob } from '../scheduler/statusUpdateToTransit.js'; 
import {triggerApprovedToNextStateBatchJob} from '../scheduler/approvedToNextState.js'

// Controller function to trigger the batch job
export const triggerBatchJobController = async (req, res) => {
  try {
    // Trigger the batch job
    await triggerTransitBatchJob();
    
    // Respond with a success message
    return res.status(200).json({ message: 'Batch job triggered successfully.' });
  } catch (error) {
    // Handle any errors that might occur
    console.error('Error triggering batch job:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};


//2)
// Controller function to trigger the batch job
export const triggerApprovedToNextStateBatchJobController = async (req, res) => {
  try {
    // Trigger the batch job
    await triggerApprovedToNextStateBatchJob();
    
    // Respond with a success message
    return res.status(200).json({ message: 'trigger Approved To NextState Batch job triggered successfully.' });
  } catch (error) {
    // Handle any errors that might occur
    console.error('Error triggering batch job:triggerApprovedToNextStateBatchJob failed', error);
    return res.status(500).json({ error: 'Internal server error.- triggerApprovedToNextStateBatchJob failed' });
  }
};



