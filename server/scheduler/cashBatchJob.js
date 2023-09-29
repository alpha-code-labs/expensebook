import cron from 'node-cron';
import { config } from 'dotenv';
import { Trip } from '../models/tripSchema.js';

// Load environment variables from .env file
config();

// Get the schedule time from the environment variable
const scheduleTime = process.env.SCHEDULE_TIME;

// Schedule the cash batch job to run daily at the specified time
const cashBatchJob = cron.schedule(scheduleTime, async () => {
  try {
    await runCashBatchJob();
    console.log('Cash batch job completed successfully.');
  } catch (error) {
    console.error('Cash batch job error:', error);
  }
});

export async function runCashBatchJob() {
  try {
    const filter = {
      'tripStatus': 'transit',
      'notificationSentToDashboardFlag': true,
      'embeddedCashAdvance.cashAdvanceStatus': 'paid',
    };

    const update = {
      $set: {
        'notificationSentToDashboardFlag': false, // Update the flag RabbitMq
      },
    };

    // Find all documents matching the filter
    const matchingDocuments = await Trip.find(filter);

    // Create an array of bulkWrite promises to update each document
    const bulkWritePromises = matchingDocuments.map((document) =>
      Trip.updateOne(
        { _id: document._id },
        update
      )
    );

    // Use Promise.all to update all matching documents concurrently
    const bulkWriteResults = await Promise.all(bulkWritePromises);

    // Calculate the total number of documents updated
    const totalUpdatedCount = bulkWriteResults.reduce(
      (accumulator, result) => accumulator + (result.nModified || 0),
      0
    );

    console.log('Number of documents updated:', totalUpdatedCount);
    console.log('Cash batch job completed successfully.');
  } catch (error) {
    console.error('Error in cash batch job:', error);
  }
}

// Start the cash batch job immediately (useful for testing)
runCashBatchJob();

export default cashBatchJob;
