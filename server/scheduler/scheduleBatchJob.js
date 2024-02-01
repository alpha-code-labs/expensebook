import axios from 'axios';
import Trip from '../models/tripSchema.js';


const handleErrorResponse = (errorMessage, status = 500) => {
  console.error(errorMessage);
  return { status, data: { success: false, message: errorMessage } };
};


const upcomingTripsBatchJob = async (trips) => {
  try {
    const tripPromises = trips.map(async (trip) => {
      const { travelRequestData, cashAdvancesData = [] } = trip;
      const { tenantId } = travelRequestData;

      try {
        // Create a Trip instance with extracted data
        return await Trip.create({
          tenantId,
          travelRequestData,
          cashAdvancesData,
        });
      } catch (error) {
        console.error('Failed to insert trip into Trip model:', error);
        throw error;
      }
    });

    const results = await Promise.all(tripPromises);

    const insertedTrips = results.filter((result) => result instanceof Error === false);

    const failedTrips = results.filter((result) => result instanceof Error);
    failedTrips.forEach((error) => {
      console.error('Failed to insert trip into Trip model:', error);
    });

    try {
      await sendBatchjobTripsToDashboard(insertedTrips);
    } catch (error) {
      console.error('Failed to send trips to dashboard:', error);
    }

    console.log('Successfully inserted trips into Trip model:', insertedTrips.length);

    if (failedTrips.length > 0) {
      throw new Error('Failed to insert trips into Trip model');
    }

    return { success: true, message: 'Trips updated successfully' };
  } catch (error) {
    throw new Error('Failed to update trips');
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



