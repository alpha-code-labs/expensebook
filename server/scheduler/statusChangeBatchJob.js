import cron from 'node-cron';
import { Trip } from '../models/tripSchema.js';

// Function to update documents based on your criteria
export const statusChangeBatchJob = async () => {
  try {
    const todayDate = new Date();

    // Update documents in the Trip collection
    const result = await Trip.updateMany(
      {
        tripStatus: 'upcoming',
        tripStartDate: { $lte: todayDate },
      },
      {
        $set: { tripStatus: 'transit' },
      }
    );

    // Logging the result
    console.log(`Updated ${result.nModified} documents.`);
  } catch (error) {
    console.error('Error updating documents:', error);
  }
};

// Schedule the cron job to run every day at midnight
cron.schedule('0 0 * * *', () => {
  console.log('Running batch job...');
  statusChangeBatchJob();
});

// Function to trigger the batch job on demand
const triggerBatchJob = () => {
  console.log('Triggering batch job on demand...');
  statusChangeBatchJob();
};

export { triggerBatchJob };
