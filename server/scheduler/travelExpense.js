import Trip from "../models/tripSchema.js";

// travel expense approved to next state
export const travelExpenseApprovedToNextState = async (trips) => {
    try {
      const tripPromises = trips.map(async (trip) => {
        const { tripId, expenseHeaderIds, expenseHeaderStatus } = trip;
        
        const updateResult = await Trip.updateMany(
          {
            tripId: tripId,
            'travelExpenseData.expenseHeaderId': { $in: expenseHeaderIds }
          },
          {
            $set: {
              'travelExpenseData.$[elem].expenseHeaderStatus': expenseHeaderStatus
            }
          },
          {
            arrayFilters: [{ 'elem.expenseHeaderId': { $in: expenseHeaderIds } }]
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
      const extendedUrl = '/approved';
      const currentTravelUrl = `${travelBaseUrl}${extendedUrl}`;
  
      const response = await axios.post(currentTravelUrl, trips);
  
      if (response.status >= 200 && response.status < 300) {
        console.log('Travel updated successfully in travel Microservice');
        const result = await travelExpenseApprovedToNextState(trips);
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
export const travelExpenseA = async (trips) => {
    try {
      const tripPromises = trips.map(async (trip) => {
        const { tripId, expenseHeaderIds, expenseHeaderStatus } = trip;
        
        const updateResult = await Trip.updateMany(
          {
            tripId: tripId,
            'travelExpenseData.expenseHeaderId': { $in: expenseHeaderIds }
          },
          {
            $set: {
              'travelExpenseData.$[elem].expenseHeaderStatus': expenseHeaderStatus
            }
          },
          {
            arrayFilters: [{ 'elem.expenseHeaderId': { $in: expenseHeaderIds } }]
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
      const extendedUrl = '/approved';
      const currentTravelUrl = `${travelBaseUrl}${extendedUrl}`;
  
      const response = await axios.post(currentTravelUrl, trips);
  
      if (response.status >= 200 && response.status < 300) {
        console.log('Travel updated successfully in travel Microservice');
        const result = await travelExpenseApprovedToNextState(trips);
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

