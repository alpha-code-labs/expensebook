import cron from 'node-cron';
import { Trip } from '../models/tripSchema.js';
import { sendNotificationToDashboard, sendNotificationToEmployee } from './notificationService.js';
import { calculateDateDifferenceInDays } from './dateUtils.js';

// Define the schedule time for the batch job (e.g., daily at midnight)
const scheduleTime = '0 0 * * *';

// Schedule the batch job
const transitBatchJob = cron.schedule(scheduleTime, async () => {
  try {
    // Find all trips with status "transit"
    const transitTrips = await Trip.find({ tripStatus: 'transit' });

    for (const trip of transitTrips) {
      // Get the date of the last line item of the trip
      const lastLineItemDate = trip.lineItems[trip.lineItems.length - 1].date;

      // Check if the system date is greater than the date of the last line item
      const systemDate = new Date();
      if (systemDate > lastLineItemDate) {
        // Asynchronous RabbitMQ call to update briefcase icon for individual users
        await sendNotificationToDashboard(trip);

        // Calculate the difference in days
        const dateDifference = calculateDateDifferenceInDays(lastLineItemDate, systemDate);

        if (dateDifference > 3) {
          // Send data to be saved in Trip Container
          // Fire and Forget, status will be "Completed"
          await saveDataInTripContainer(trip);

          // Check if expenses have been submitted
          if (!trip.expensesSubmitted) {
            // Asynchronous RabbitMQ call to remind the employee to submit expenses
            await sendNotificationToEmployee(trip);
          }
        }
      }
    }

    console.log('Status change Transit to complete batch job completed successfully.');
  } catch (error) {
    console.error('status change Transit to complete batch job error:', error);
  }
});

// Start the batch job immediately (useful for testing)
transitBatchJob.start();

// Export the batch job for use in other modules
export default transitBatchJob;
