import Trip from '../models/tripSchema.js';

// Define a function to extract trip details for all trips related to a user by userId
export const tripDetailsForUser = async (userId) => {
  try {
    // Validate the userId to ensure it's not empty and is in a valid format
    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid user ID.');
    }

    // Use the Mongoose model for 'Trip' to find trips by userId and tripStatus 'upcoming'
    const trips = await Trip.find({ userId, tripStatus: 'upcoming' });

    if (!trips || trips.length === 0) {
      throw new Error('No upcoming trips found for this user.');
    }

    // Extract trip details for all upcoming trips
    const tripDetails = trips.map((trip) => ({
      TripPurpose: trip.tripPurpose,
      TripStartDate: trip.tripStartDate,
      TripEndDate: trip.tripCompletionDate,
      departureCity: trip.travelRequestData?.itinerary?.departureCity || 'N/A',
      arrivalCity: trip.travelRequestData?.itinerary?.arrivalCity || 'N/A',
    }));

    return tripDetails;
  } catch (error) {
    throw error;
  }
};

// Get trip status and additional details for all 'upcoming' trips for a user by userId
export const upcomingTripsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract userId from URL parameters

    // Validate the userId to ensure it's not empty and is in a valid format
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid user ID.' });
    }

    // Extract trip details for all upcoming trips related to the user
    const tripDetails = await tripDetailsForUser(userId);

    // Return trip details with success message
    return res.status(200).json({
      message: 'Upcoming trip details for the user.',
      trips: tripDetails,
    });
  } catch (error) {
    console.error('Error fetching upcoming trips:', error);

    // Handle specific error types and provide meaningful responses
    if (error.message === 'Invalid user ID.') {
      return res.status(400).json({ error: 'Invalid user ID.' });
    } else if (error.message === 'No upcoming trips found for this user.') {
      return res.status(404).json({ error: 'No upcoming trips found for this user.' });
    }

    // For unhandled errors, provide a generic error response
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Define a function to extract trip details for all transit trips related to a user by userId
export const transitTripsForUser = async (userId) => {
  try {
    // Validate the userId to ensure it's not empty and is in a valid format
    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid user ID.');
    }

    // Use the Mongoose model for 'Trip' to find trips by userId and tripStatus 'transit'
    const trips = await Trip.find({ userId, tripStatus: 'transit' });

    if (!trips || trips.length === 0) {
      throw new Error('No transit trips found for this user.');
    }

    // Extract trip details for all transit trips
    const tripDetails = trips.map((trip) => ({
      TripPurpose: trip.tripPurpose,
      TripStartDate: trip.tripStartDate,
      TripEndDate: trip.tripCompletionDate,
      departureCity: trip.travelRequestData?.itinerary?.departureCity || 'N/A',
      arrivalCity: trip.travelRequestData?.itinerary?.arrivalCity || 'N/A',
    }));

    return tripDetails;
  } catch (error) {
    throw error;
  }
};

// Get trip status and additional details for all 'transit' trips for a user by userId
export const transitTripsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract userId from URL parameters

    // Validate the userId to ensure it's not empty and is in a valid format
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid user ID.' });
    }

    // Extract trip details for all transit trips related to the user
    const tripDetails = await transitTripsForUser(userId);

    // Return trip details with success message
    return res.status(200).json({
      message: 'Transit trip details for the user.',
      trips: tripDetails,
    });
  } catch (error) {
    console.error('Error fetching transit trips:', error);

    // Handle specific error types and provide meaningful responses
    if (error.message === 'Invalid user ID.') {
      return res.status(400).json({ error: 'Invalid user ID.' });
    } else if (error.message === 'No transit trips found for this user.') {
      return res.status(404).json({ error: 'No transit trips found for this user.' });
    }

    // For unhandled errors, provide a generic error response
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Define a function to extract trip details for all trips related to a user by userId
export const allTripsForUser = async (userId) => {
  try {
    // Validate the userId to ensure it's not empty and is in a valid format
    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid user ID.');
    }

    // Use the Mongoose model for 'Trip' to find all trips by userId and sort by tripStartDate
    const trips = await Trip.find({ userId }).sort({ tripStartDate: 1 });

    if (!trips || trips.length === 0) {
      throw new Error('No trips found for this user.');
    }

    // Extract trip details for all trips
    const tripDetails = trips.map((trip) => ({
      TripPurpose: trip.tripPurpose,
      TripStartDate: trip.tripStartDate,
      TripEndDate: trip.tripCompletionDate,
      departureCity: trip.travelRequestData?.itinerary?.departureCity || 'N/A',
      arrivalCity: trip.travelRequestData?.itinerary?.arrivalCity || 'N/A',
      tripStatus: trip.tripStatus,
    }));

    return tripDetails;
  } catch (error) {
    throw error;
  }
};

// Get trip status and additional details for all trips for a user by userId
export const allTripsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract userId from URL parameters

    // Validate the userId to ensure it's not empty and is in a valid format
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid user ID.' });
    }

    // Extract trip details for all trips related to the user
    const tripDetails = await allTripsForUser(userId);

    // Return trip details with success message
    return res.status(200).json({
      message: 'All trip details for the user.',
      trips: tripDetails,
    });
  } catch (error) {
    console.error('Error fetching all trips:', error);

    // Handle specific error types and provide meaningful responses
    if (error.message === 'Invalid user ID.') {
      return res.status(400).json({ error: 'Invalid user ID.' });
    } else if (error.message === 'No trips found for this user.') {
      return res.status(404).json({ error: 'No trips found for this user.' });
    }

    // For unhandled errors, provide a generic error response
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



 

