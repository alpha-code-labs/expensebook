import axios from 'axios';
import Expense from '../models/travelExpenseSchema.js';

const handleErrorResponse = (errorMessage, status = 500) => {
  console.error(errorMessage);
  return { status, data: { success: false, message: errorMessage } };
};

// cash Approved to next state
const cashAdvanceApprovedToNextState = async (trips) => {
  try {
    const tripPromises = trips.map(async (trip) => {
      const { travelRequestId, cashAdvanceIds, cashAdvanceStatus } = trip;
      
      const updateResult = await Expense.updateMany(
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
    const extendedUrl = '/booked';
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
      
      const updateResult = await Expense.updateMany(
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
