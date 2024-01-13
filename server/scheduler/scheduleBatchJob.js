import axios from 'axios';
import Trip from '../models/tripSchema.js';

const handleErrorResponse = (errorMessage, status = 500) => {
  console.error(errorMessage);
  return { status, data: { success: false, message: errorMessage } };
};

const upcomingTripsBatchJob = async (trips) => {
  try {
    const tripPromises = trips.map(async (trip) => {
      const { travelRequestData, cashAdvanceData } = trip;
      const { tenantId } = travelRequestData;

      // Create a Trip instance with extracted data
      return Trip.create({
        tenantId,
        travelRequestData,
        cashAdvancesData: cashAdvanceData ?? [],
      });
    });

    const results = await Promise.allSettled(tripPromises);

    const insertedTrips = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value);

    await sendBatchjobTripsToDashboard(insertedTrips)

    console.log('Successfully inserted trips into Trip model:', insertedTrips.length);

    const failedTrips = results.filter((result) => result.status === 'rejected');
    if (failedTrips.length > 0) {
      console.error('Failed to insert trips into Trip model:', failedTrips);
    }

    return { success: true, message: 'Trips updated successfully' };
  } catch (error) {
    return handleErrorResponse('Failed to update trips', 500);
  }
};

export const triggerBatchJob = async (trips) => {
  try {
    const travelBaseUrl = process.env.TRAVEL_BASE_URL;
    const extendedUrl = '/booked';
    const currentTravelUrl = `${travelBaseUrl}${extendedUrl}`;

    const response = await axios.post(currentTravelUrl, trips);

    if (response.status >= 200 && response.status < 300) {
      console.log('Travel updated successfully in travel Microservice');
      const result = await upcomingTripsBatchJob(trips);
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


//batchjob



