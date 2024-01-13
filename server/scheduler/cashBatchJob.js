import cron from 'node-cron';
import { config } from 'dotenv';
import Trip  from '../models/tripSchema.js';

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
      'cashAdvanceData.cashAdvanceStatus': 'paid',
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


const handleErrorResponse = (errorMessage, status = 500) => {
  console.error(errorMessage);
  return { status, data: { success: false, message: errorMessage } };
};

// cash Approved to next state
export const cashAdvanceApprovedToNextState = async (trips) => {
  try {
    const tripPromises = trips.map(async (trip) => {
      const { travelRequestId, cashAdvanceIds, cashAdvanceStatus } = trip;
      
      const updateResult = await Trip.updateMany(
        {
          travelRequestId: travelRequestId,
          'cashAdvancesData.cashAdvanceId': { $in: cashAdvanceIds }
        },
        {
          $set: {
            'cashAdvancesData.$[elem].CashAdvanceStatus': cashAdvanceStatus
          }
        },
        {
          arrayFilters: [{ 'elem.cashAdvanceId': { $in: cashAdvanceIds } }]
        }
      );

      return updateResult;
    });

    const results = await Promise.allSettled(tripPromises);

    const insertedTrips = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value);

    console.log('Successfully updated trips:', insertedTrips.length);

    const failedTrips = results.filter((result) => result.status === 'rejected');
    if (failedTrips.length > 0) {
      console.error('Failed to update trips:', failedTrips);
    }

    return { success: true, message: 'Trips updated successfully' };
  } catch (error) {
    return handleErrorResponse('Failed to update trips', 500);
  }
};


export const triggerBatchJob = async (trips) => {
  try {
    const travelBaseUrl = process.env.TRAVEL_BASE_URL;
    const extendedUrl = '/cash';
    const currentTravelUrl = `${travelBaseUrl}${extendedUrl}`;

    const response = await axios.post(currentTravelUrl, trips);

    if (response.status >= 200 && response.status < 300) {
      console.log('Travel updated successfully in travel Microservice');
      const result = await cashAdvanceApprovedToNextState(trips);
      if (result.success) {
        return { status: 200, data: { success: true, message: 'Trips updated successfully' } };
      } else {
        return handleErrorResponse('Failed to update trips', 500);
      }
    } else {
      return handleErrorResponse('Unexpected response', response.status);
    }
  } catch (error) {
    return handleErrorResponse('Failed to update travel in Microservice');
  }
};


// cash Awaiting pending settlemet
export const cashAdvanceStatusToAwaitingPendingSeetlemet = async (trips) => {
  try {
    const tripPromises = trips.map(async (trip) => {
      const { travelRequestId, cashAdvanceIds, cashAdvanceStatus } = trip;
      
      const updateResult = await Trip.updateMany(
        {
          travelRequestId: travelRequestId,
          'cashAdvancesData.cashAdvanceId': { $in: cashAdvanceIds }
        },
        {
          $set: {
            'cashAdvancesData.$[elem].CashAdvanceStatus': cashAdvanceStatus
          }
        },
        {
          arrayFilters: [{ 'elem.cashAdvanceId': { $in: cashAdvanceIds } }]
        }
      );

      return updateResult;
    });

    const results = await Promise.allSettled(tripPromises);

    const insertedTrips = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value);

    console.log('Successfully updated trips:', insertedTrips.length);

    const failedTrips = results.filter((result) => result.status === 'rejected');
    if (failedTrips.length > 0) {
      console.error('Failed to update trips:', failedTrips);
    }

    return { success: true, message: 'Trips updated successfully' };
  } catch (error) {
    return handleErrorResponse('Failed to update trips', 500);
  }
};


export const triggerBatchJobAps = async (trips) => {
  try {
    const travelBaseUrl = process.env.TRAVEL_BASE_URL;
    const extendedUrl = '/awaiting-pending-settlement';
    const currentTravelUrl = `${travelBaseUrl}${extendedUrl}`;

    const response = await axios.post(currentTravelUrl, trips);

    if (response.status >= 200 && response.status < 300) {
      console.log('Travel updated successfully in travel Microservice');
      const result = await cashAdvanceStatusToAwaitingPendingSeetlemet(trips);
      if (result.success) {
        return { status: 200, data: { success: true, message: 'Trips updated successfully' } };
      } else {
        return handleErrorResponse('Failed to update trips', 500);
      }
    } else {
      return handleErrorResponse('Unexpected response', response.status);
    }
  } catch (error) {
    return handleErrorResponse('Failed to update travel in Microservice');
  }
};

//





