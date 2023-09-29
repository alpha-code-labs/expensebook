import { Trip } from '../models/tripSchema.js';

// Define a function to extract specific trip details by _id for 'upcoming' trips
const tripDetailsForUpcoming = async (tripId) => {
  try {
    // Use the Mongoose model for 'Trip' to find the trip by _id
    const trip = await Trip.findById(tripId);

    if (!trip) {
      throw new Error('Trip not found or not upcoming.');
    }

    // Check if the trip status is 'upcoming'
    if (trip.tripStatus !== 'upcoming') {
      throw new Error('Trip is not upcoming.');
    }

    // Extract trip details
    const tripDetails = {
      TripStartDate: trip.tripStartDate,
      TripEndDate: trip.tripCompletionDate,
      departureCity: trip.embeddedTravelRequest.itinerary.departureCity,
      arrivalCity: trip.embeddedTravelRequest.itinerary.arrivalCity,
    };

    return tripDetails;
  } catch (error) {
    throw error; 
  }
};

// Get single trip status and additional details for 'upcoming' trip by _id
export const upcomingTripById = async (req, res) => {
  try {
    const tripId = req.params.tripId; // Extract tripId from URL parameters
     console.log(tripId)
    // Extract trip details by _id for 'upcoming' trip
    const tripDetails = await tripDetailsForUpcoming(tripId);
    console.log(tripId)
    // Return trip details with success message
    return res.status(200).json({
      message: 'Trip details for upcoming trip.',
      ...tripDetails,
    });
  } catch (error) {
    console.error('Error fetching trip status:', error);

    // Handle specific error types and provide meaningful responses
    if (error.message === 'Trip not found or not upcoming.') {
      return res.status(404).json({ error: 'Trip not found or not upcoming.' });
    } else if (error.message === 'Trip is not upcoming.') {
      return res.status(400).json({ error: 'The specified trip is not upcoming.' });
    }

    // For unhandled errors, provide a generic error response
    res.status(500).json({ error: 'Internal Server Error' });
  }
};









// Define a function to extract specific trip details by _id for 'transit' trips
const tripDetailsForTransit = async (tripId) => {
  try {
    // Use the Mongoose model for 'Trip' to find the trip by _id
    const trip = await Trip.findById(tripId);

    if (!trip) {
      throw new Error('Trip not found.');
    }

    // Check if the trip status is 'transit'
    if (trip.tripStatus !== 'transit') {
      throw new Error('Trip is not in transit.');
    }

    // Extract trip details
    const tripDetails = {
      TripStartDate: trip.tripStartDate,
      TripEndDate: trip.tripCompletionDate,
      departureCity: trip.embeddedTravelRequest.itinerary.departureCity,
      arrivalCity: trip.embeddedTravelRequest.itinerary.arrivalCity,
    };
    
    return tripDetails;
  } catch (error) {
    throw error; // Propagate any errors
  }
};

// Get single trip status and additional details for 'transit' trip by _id
export const transitTripById = async (req, res) => {
  try {
    const tripId = req.body.tripId; // Extract tripId from req.body

    // Extract trip details by _id for 'transit' trip
    const tripDetails = await tripDetailsForTransit(tripId);

    // Return trip details with success message
    return res.status(200).json({
      message: 'Trip details for transit trip.',
      ...tripDetails,
    });
  } catch (error) {
    console.error('Error fetching trip status:', error);

    // Handle specific error types and provide meaningful responses
    if (error.message === 'Trip not found.') {
      return res.status(404).json({ message: 'Trip not found.' });
    } else if (error.message === 'Trip is not in transit.') {
      return res.status(400).json({ message: 'The specified trip is not in transit.' });
    }

    // For unhandled errors, provide a generic error response
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
