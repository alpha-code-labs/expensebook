import { Trip } from '../models/tripSchema.js';

// Function to filter out restricted fields
const filterRestrictedFields = (data) => {
  const restrictedFields = ['tripStatus', 'travelRequestStatus', 'cashAdvanceStatus'];
  const filteredData = {};

  for (const key in data) {
    if (!restrictedFields.includes(key)) {
      filteredData[key] = data[key];
    }
  }

  return filteredData;
};

// Function to handle updating trip details
export const updateTripDetails = async (tripId, updatedData) => {
  try {
    // Validate tripId (ensure it's a valid identifier)
    if (!tripId || typeof tripId !== 'string') {
      throw new Error('Invalid tripId.');
    }

    

    // Filter the updatedData to exclude restricted fields
    const filteredUpdatedData = filterRestrictedFields(updatedData);

    // Find the trip by ID and update it with filtered data
    const updatedTrip = await Trip.findOneAndUpdate(
      { 'users.trips._id': tripId },
      { $set: filteredUpdatedData },
      { new: true }
    );

    if (!updatedTrip) {
      throw new Error('Trip not found.');
    }

    return updatedTrip;
  } catch (error) {
    console.error('Error updating trip details:', error);
    throw error;
  }
};

// Function to handle POST request for modifying trip details
export const modifyTripDetails = async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const updatedData = req.body; // Data sent from the frontend with modifications

    const updatedTrip = await updateTripDetails(tripId, updatedData);

    res.status(200).json({ message: 'Trip details updated successfully.', updatedTrip });
  } catch (error) {
    console.error('Error modifying trip details:', error);

    // Provide a more informative error message to the client
    let errorMessage = 'Internal Server Error';
    if (error.message === 'Invalid tripId.') {
      errorMessage = 'Invalid tripId provided.';
    } else if (error.message === 'Trip not found.') {
      errorMessage = 'Trip not found.';
    }

    res.status(500).json({ error: errorMessage });
  }
};


//Save trip after modification from frontend side
export const saveTrip = async (req, res) => {
  try {
    const { firstDateOfTravel, tripData } = req.body;

    if (!firstDateOfTravel || !tripData) {
      return handleError(res, 400, 'Missing required fields.');
    }

    const currentDate = new Date();
    const travelDate = new Date(firstDateOfTravel);
    const timeDifference = travelDate - currentDate;
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if (daysDifference < 10) {
      return res.status(200).json({ message: 'Please contact your admin/travel person for adjustments.' });
    }

    // Assuming Trip.create is an asynchronous database operation
    const createdTrip = await Trip.create(tripData);

    if (createdTrip) {
      return res.status(200).json({ message: 'Trip saved successfully.' });
    }

    return handleError(res, 500, 'Failed to save trip data.');
  } catch (error) {
    return handleError(res, 500, 'An error occurred while processing the request.');
  }
};
 

//Check for policy and validations after trip is modified from frontend
export const processTrip = async (req, res) => {
  try {
    const { firstDateOfTravel, travelPolicyFlag, approvalFlowFlag, cashAdvanceFlag, tripData } = req.body;

    // Check for missing required fields
    if (!firstDateOfTravel || !travelPolicyFlag || !approvalFlowFlag || !cashAdvanceFlag || !tripData) {
      return handleError(res, 400, 'Missing required fields.');
    }

    // Calculate days until travel
    const currentDate = new Date();
    const travelDate = new Date(firstDateOfTravel);
    const daysUntilTravel = Math.ceil((travelDate - currentDate) / (1000 * 3600 * 24));

    if (daysUntilTravel < 10) {
      if (travelPolicyFlag !== 'Y' && approvalFlowFlag === 'Y') {
        if (cashAdvanceFlag === 'N') {
          // Make API call to Approval collection with full data
          // Code for API call here
          return res.status(200).json({ message: 'Trip processed successfully.' });
        } else if (cashAdvanceFlag === 'Y') {
          // Make API calls to Travel microservice and Cash Advance microservice with full data
          // Code for API calls here
          return res.status(200).json({ message: 'Trip processed successfully.' });
        }
      }
    } else {
      if (!approvalFlowFlag || cashAdvanceFlag === 'N') {
        // Make API call to Travel microservice with full data
        // Code for API call here
        return res.status(200).json({ message: 'Trip processed successfully.' });
      } else if (cashAdvanceFlag === 'Y') {
        // Make API calls to Travel microservice and Cash Advance microservice
        // Code for API calls here
        return res.status(200).json({ message: 'Trip processed successfully.' });
      }
    }

    return handleError(res, 400, 'Invalid request parameters.');
  } catch (error) {
    return handleError(res, 500, 'An error occurred while processing the request.');
  }
};

// Helper function for handling errors and sending a response
function handleError(res, status, message) {
  console.error(message);
  return res.status(status).json({ error: message });
}
