import cron from 'node-cron';
import Expense from '../models/travelExpenseSchema.js';

//To update status from upcoming to transit on the day of travel.
//important!! - A batch job is run to update status from upcoming to transit on the day of travel and 
//they are carried out independently in trip and expense microservices. 
export const StatusChangeToTransitBatchJob = async () => {
  try {
    const todayDate = new Date();

    // Update documents in the Expense collection
    const result = await Expense.updateMany(
      {
        'tripStatus': 'upcoming',
        'tripStartDate': { $lte: todayDate },
      },
      {
        $set: {
            'tripStatus': 'transit',
        }
      }
    );

    // Logging the result
    console.log(`Updated status to 'transit' batch job successfully. ${result.nModified} documents.`);
  } catch (error) {
    console.error('Error occurred during status change from upcoming to transit batchjob:', error);
  }
};

// Schedule the cron job to run every day at midnight('0 0 * * *) or [use -(for every 20 seconds */20 * * * * *)]
cron.schedule('0 0 * * *', () => {
  console.log('Running expense status change to transit batch job...');
  StatusChangeToTransitBatchJob();
});

export const scheduleTripTransitBatchJob = () => {
  const schedule = process.env.SCHEDULE_TIME; // Runs every 20 seconds
 
  cron.schedule(schedule, async () => {
     console.log('Running trip transit batch job ...');
     await StatusChangeToTransitBatchJob();
  });
 
  console.log(`Scheduled trip transit batch job to run every 20 seconds.`);
 };

// Function to trigger the batch job on demand 
const triggerTransitBatchJob = () => {
  console.log('Triggering expense status change to transit batch job.. batch job on demand...');
  StatusChangeToTransitBatchJob();
};

export { triggerTransitBatchJob };
