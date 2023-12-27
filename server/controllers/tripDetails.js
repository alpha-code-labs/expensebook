import Trip from "../models/tripSchema.js";

//get Trip Details for a tripId
const getTripDetails = async (trip, res) => {
  try {
    // Extract flights details
    const flightDetails = trip.travelRequestData.itinerary.flights;

    // Filter out cancelled flightss
    const validFlights = flightDetails.filter((flights) => !flights.isCancelled);

    // Extract relevant information from valid flightss
    const allFlights = validFlights.map((flights) => {
      const { bkd_from, bkd_to, bkd_date, bkd_time, status } = flights;
      return {
        bkd_from,
        bkd_to,
        bkd_date,
        bkd_time,
        status,
      };
    });

    // Common trip details
    const tripDetails = {
      TripStartDate: trip.tripStartDate,
      TripEndDate: trip.tripCompletionDate,
      flights: allFlights,
      arrivalCity: trip.travelRequestData.itinerary.arrivalCity ,
    };

    res.status(200).json({ data: tripDetails, message: 'Trip Details retrieved successfully' });
  } catch (error) {
    console.error('An error occurred:', error.message);
    res.status(500).json({ error: 'Internal server error: getTripDetails' });
  }
};

// Define a function to extract specific trip details by tripId for 'upcoming' trips
const tripDetailsForUpcoming =  async (req, res) => {
  try {
    const { tripId, tenantId, userId } = req.params;

    if (!tripId || !tenantId || !userId) {
      return res.status(400).json({ error: 'Invalid input, please provide valid tripId, tenantId, userId' });
    }

    // Use the Mongoose model for 'Trip' to find the trip by _id
    const trip = await Trip.findOne({
      'tenantId': tenantId,
      'userId': userId,
      'tripId': tripId,
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found !!' });
    }

    // Check if the trip status is 'upcoming'
    if (trip.tripStatus !== 'upcoming') {
      return res.status(400).json({ error: 'Trip is not upcoming' });
    }

    // Call common function to get trip details
    await getTripDetails(trip, res);
  } catch (error) {
    console.error('An error occurred:', error.message);
    res.status(500).json({ error: 'Internal server error: getTripDetailsForUpcomingTrip' });
  }
};

// Define a function to extract specific trip details by tripId for 'transit' trips
export const tripDetailsForTransitTrip = async (req, res) => {
  try {
    const { tripId, tenantId, userId } = req.params;

    if (!tripId || !tenantId || !userId) {
      return res.status(400).json({ error: 'Invalid input, please provide valid tripId, tenantId, userId' });
    }

    // Use the Mongoose model for 'Trip' to find the trip by _id
    const trip = await trip.findOne({
      'tenantId': tenantId,
      'userId': userId,
      'tripId': tripId,
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found !!' });
    }

    // Check if the trip status is 'transit'
    if (trip.tripStatus !== 'transit') {
      return res.status(400).json({ error: 'Trip is not in transit' });
    }

    // Call common function to get trip details
    await getTripDetails(trip, res);
  } catch (error) {
    console.error('An error occurred:', error.message);
    res.status(500).json({ error: 'Internal server error: getTripDetailsForTransitTrip' });
  }
};

// Get single trip status and additional details for 'transit' trip by tripId
export const transitTripById = async (req, res) => {
  try {
    const tripId = req.body.tripId; 

    // Extract trip details by _id for 'transit' trip
    const tripDetails =  tripDetailsForTransitTrip(tripId);

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


