// Imports
import { triggerBatchJob } from '../scheduler/statusChangeBatchJob.js';
// import { runAdjustingCashBatchJob } from '../scheduler/adjustingCashBatchJob.js';


export const triggerBatchJobNow = async (req, res) => {
  try {
    // Call trigger function
    await triggerBatchJob();

    // Log success
    console.log('Batch job triggered successfully!');

    // Success response
    res.status(200).json({
      message: 'Batch job completed successfully!',
    });
  } catch (error) {
    // Log error
    console.error('Error triggering batch job:', error);

    // Error response
    res.status(500).json({
      error: 'Error triggering batch job',
    });
  }
};



// // Controller to trigger the batch job on demand
// export const triggerAdjustingCashBatchJob = async (req, res) => {
//   try {
//     await runAdjustingCashBatchJob();
//     res.status(200).json({ message: 'Adjusting Cash batch job triggered on demand.' });
//   } catch (error) {
//     console.error('Error triggering cash batch job:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };


