import mongoose from 'mongoose';
import Dashboard from '../models/dashboardSchema.js';
import {dashboardToTripMicroservice} from './toTripMicroservice.js';
   

// Validate flight details
const validateFlightDetails = (flightDetails) => {
  return flightDetails && flightDetails.from && flightDetails.to && flightDetails.date && flightDetails.time;
};

// Update trip status based on approvers (approval setup is done while raising travel request)
const updateTripStatus = (approvers) => {
  return approvers && approvers.length > 0 ? 'pending approval' : 'pending booking';
};

// Retrieve Trip document by tripId, tenantId, and userId from dashboard ms
const getTripByTripId = async (tripId, tenantId, empId) => {
  try {
    const validTripStatus = ['transit', 'upcoming'];
    const trip = await Dashboard.findOne({
      'embeddedTrip.embeddedTravelRequest.tenantId': tenantId,
      'embeddedTrip.userId.empId': empId,
      'embeddedTrip.tripId': tripId,
      'embeddedTrip.tripStatus': { $in: validTripStatus },
    });

    if (trip) {
      return trip;
    } else {
      const currentStatus = await Dashboard.findOne({
        'embeddedTrip.embeddedTravelRequest.tenantId': tenantId,
        'embeddedTrip.tripId': tripId,
        'embeddedTrip.userId.empId': empId,
      }, { tripStatus: 1 });

      if (currentStatus) {
        const { tripStatus } = currentStatus;
        throw new Error(`Cannot add a leg as the status is ${tripStatus}`);
      } else {
        throw new Error('Trip not found');
      }
    }
  } catch (error) {
    // Log the error for monitoring purposes
    console.error('Error retrieving trip to dashboard:', error);
    throw new Error('Internal Server Error: getDashboardByTripId');
  }
};

// addLegToTrip is Saved in embeddedTrip 
const saveInDashboard = async (dashboardDoc) => {
  try {
    return await dashboardDoc.save();
  } catch (error) {
    // Log the error for monitoring purposes
    console.error('Error saving dashboard:', error);
    throw new Error('Internal Server Error');
  }
};

// 1) Add a flight/flights to exiting trip
export const addFlight = async (req, res) => {
  try {
    const { tenantId, tripId, empId } = req.params;
    const { flightDetails } = req.body;

    // Input validation
    if (!tripId || !tenantId || !empId) {
      return res.status(400).json({ error: 'Invalid input, please provide valid tripId, tenantId, empId' });
    }

    // Validate flight details
    if (!flightDetails || !Array.isArray(flightDetails) || flightDetails.length === 0) {
      return res.status(400).json({ error: 'Invalid flight details, please provide an array of flight details' });
    }

    // Retrieve dashboard document
    const trip = await getTripByTripId(tripId, tenantId, empId);

    // Check if trip exists
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or not in transit' });
    }

    const { embeddedTrip } = trip;

    // Check if the dashboard structure is valid
    const { flights } = embeddedTrip.embeddedTravelRequest.itinerary || { flights: [] };

    // Iterate through each flight in the flightDetails array and add them to flights
    flightDetails.forEach((newFlight) => {
      const newFlightDetails = {
        itineraryId: new mongoose.Types.ObjectId(),
        formId: String(),
        ...newFlight,
        status: updateTripStatus(embeddedTrip.embeddedTravelRequest.approvers),
      };

      flights.push(newFlightDetails);
    });

    // Update tripStatus based on the latest flight added
    trip.tripStatus = flights.length > 0 ? flights[flights.length - 1].status : trip.tripStatus;

    // Update the flights array and tripStatus in the database
    const addLegToTrip = await Dashboard.findOneAndUpdate(
      {
        'embeddedTrip.embeddedTravelRequest.tenantId': tenantId,
        'embeddedTrip.userId.empId': empId,
        'embeddedTrip.tripId': tripId,
      },
      { $set: { 'embeddedTrip.embeddedTravelRequest.itinerary.flights': flights, tripStatus: trip.tripStatus } },
      { new: true }
    );

    // Save the updated dashboard
    await saveInDashboard(addLegToTrip);
    console.log('this is what i saved in dashboard:', addLegToTrip);
    // Send addLegToTrip data to the trip microservice from the dashboard
     await dashboardToTripMicroservice(addLegToTrip);

    // Respond with success message and the updated trip
    return res.status(200).json({ success: true, message: 'Flights added successfully', trip: addLegToTrip });
  } catch (error) {
    // Log the error for monitoring purposes
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

//  Validate bus details
const validateBusDetails = (busDetails) => {
  return busDetails && busDetails.from && busDetails.to && busDetails.date && busDetails.time;
};

// 2) Add a bus/buses to exiting trip
export const addBus = async (req, res) => {
  try {
    const { tenantId, tripId, empId } = req.params;
    const { busDetails } = req.body;

    // Input validation
    if (!tripId || !tenantId || !empId) {
      return res.status(400).json({ error: 'Invalid input, please provide valid tripId, tenantId, empId' });
    }

    // Validate bus details
    if (!busDetails || !Array.isArray(busDetails) || busDetails.length === 0) {
      return res.status(400).json({ error: 'Invalid bus details, please provide an array of bus details' });
    }

    // Retrieve dashboard document
    const trip = await getTripByTripId(tripId, tenantId, empId);

    // Check if trip exists
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or not in transit' });
    }

    const { embeddedTrip } = trip;

    // Check if the dashboard structure is valid
    const { buses } = embeddedTrip.embeddedTravelRequest.itinerary || { buses: [] };

    // Iterate through each bus in the busDetails array and add them to buses
    busDetails.forEach((newBus) => {
      const newBusDetails = {
        itineraryId: new mongoose.Types.ObjectId(),
        formId: String(),
        ...newBus,
        status: updateTripStatus(embeddedTrip.embeddedTravelRequest.approvers),
      };

      buses.push(newBusDetails);
    });

    // Update tripStatus based on the latest bus added
    trip.tripStatus = buses.length > 0 ? buses[buses.length - 1].status : trip.tripStatus;

    // Update the buses array and tripStatus in the database
    const addLegToTrip = await Dashboard.findOneAndUpdate(
      {
        'embeddedTrip.embeddedTravelRequest.tenantId': tenantId,
        'embeddedTrip.userId.empId': empId,
        'embeddedTrip.tripId': tripId,
      },
      { $set: { 'embeddedTrip.embeddedTravelRequest.itinerary.buses': buses, tripStatus: trip.tripStatus } },
      { new: true }
    );

    // Save the updated dashboard
    await saveInDashboard(addLegToTrip);

    // Respond with success message and the updated trip
    return res.status(200).json({ success: true, message: 'Buses added successfully', trip: addLegToTrip });
  } catch (error) {
    // Log the error for monitoring purposes
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Validate train details
const validateTrainDetails = (trainDetails) => {
  return trainDetails && trainDetails.from && trainDetails.to && trainDetails.date && trainDetails.time;
};

// 3) Add a train/trains details via dashboard
export const addTrain = async (req, res) => {
  try {
    const { tenantId, tripId, empId } = req.params;
    const { trainDetails } = req.body;

    // Input validation
    if (!tripId || !tenantId || !empId) {
      return res.status(400).json({ error: 'Invalid input, please provide valid tripId, tenantId, empId' });
    }

    // Validate train details
    if (!trainDetails || !Array.isArray(trainDetails) || trainDetails.length === 0) {
      return res.status(400).json({ error: 'Invalid train details, please provide an array of train details' });
    }

    // Retrieve dashboard document
    const trip = await getTripByTripId(tripId, tenantId, empId);

    // Check if trip exists
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or not in transit' });
    }

    const { embeddedTrip } = trip;

    // Check if the dashboard structure is valid
    const { trains } = embeddedTrip.embeddedTravelRequest.itinerary || { trains: [] };

    // Iterate through each train in the trainDetails array and add them to trains
    trainDetails.forEach((newTrain) => {
      const newTrainDetails = {
        itineraryId: new mongoose.Types.ObjectId(),
        formId: String(),
        ...newTrain,
        status: updateTripStatus(embeddedTrip.embeddedTravelRequest.approvers),
      };

      trains.push(newTrainDetails);
    });

    // Update tripStatus based on the latest train added
    trip.tripStatus = trains.length > 0 ? trains[trains.length - 1].status : trip.tripStatus;

    // Update the trains array and tripStatus in the database
    const addLegToTrip = await Dashboard.findOneAndUpdate(
      {
        'embeddedTrip.embeddedTravelRequest.tenantId': tenantId,
        'embeddedTrip.userId.empId': empId,
        'embeddedTrip.tripId': tripId,
      },
      { $set: { 'embeddedTrip.embeddedTravelRequest.itinerary.trains': trains, tripStatus: trip.tripStatus } },
      { new: true }
    );

    // Save the updated dashboard
    await saveInDashboard(addLegToTrip);

    // Respond with success message and the updated trip
    return res.status(200).json({ success: true, message: 'Trains added successfully', trip: addLegToTrip });
  } catch (error) {
    // Log the error for monitoring purposes
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Validate cab details
const validateCabDetails = (cabDetails) => {
  return cabDetails && cabDetails.from && cabDetails.to && cabDetails.date && cabDetails.time;
};

// 4) add cabs to existing trip via dashboard- overview
export const addCab = async (req, res) => {
  try {
    const { tenantId, tripId, empId } = req.params;
    const { cabDetails } = req.body;

    // Input validation
    if (!tripId || !tenantId || !empId) {
      return res.status(400).json({ error: 'Invalid input, please provide valid tripId, tenantId, empId' });
    }

    // Validate cab details
    if (!cabDetails || !Array.isArray(cabDetails) || cabDetails.length === 0) {
      return res.status(400).json({ error: 'Invalid cab details, please provide an array of cab details' });
    }

    // Retrieve dashboard document
    const trip = await getTripByTripId(tripId, tenantId, empId);

    // Check if trip exists
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or not in transit' });
    }

    const { embeddedTrip } = trip;

    // Check if the dashboard structure is valid
    const { cabs } = embeddedTrip.embeddedTravelRequest.itinerary || { cabs: [] };

    // Iterate through each cab in the cabDetails array and add them to cabs
    cabDetails.forEach((newCab) => {
      const newCabDetails = {
        itineraryId: new mongoose.Types.ObjectId(),
        formId: String(),
        ...newCab,
        status: updateTripStatus(embeddedTrip.embeddedTravelRequest.approvers),
      };

      cabs.push(newCabDetails);
    });

    // Update tripStatus based on the latest cab added
    trip.tripStatus = cabs.length > 0 ? cabs[cabs.length - 1].status : trip.tripStatus;

    // Update the cabs array and tripStatus in the database
    const addLegToTrip = await Dashboard.findOneAndUpdate(
      {
        'embeddedTrip.embeddedTravelRequest.tenantId': tenantId,
        'embeddedTrip.userId.empId': empId,
        'embeddedTrip.tripId': tripId,
      },
      { $set: { 'embeddedTrip.embeddedTravelRequest.itinerary.cabs': cabs, tripStatus: trip.tripStatus } },
      { new: true }
    );

    // Save the updated dashboard
    await saveInDashboard(addLegToTrip);

    // Respond with success message and the updated trip
    return res.status(200).json({ success: true, message: 'Cabs added successfully', trip: addLegToTrip });
  } catch (error) {
    // Log the error for monitoring purposes
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Validate hotel details
const validateHotelDetails = (hotelDetails) => {
  return hotelDetails && hotelDetails.hotelName && hotelDetails.checkIn && hotelDetails.checkOut;
};


// 5) Add hotel details via dashboard
export const addHotel = async (req, res) => {
  try {
    const { tenantId, tripId, empId } = req.params;
    const { hotelDetails } = req.body;

    // Input validation
    if (!tripId || !tenantId || !empId) {
      return res.status(400).json({ error: 'Invalid input, please provide valid tripId, tenantId, empId' });
    }

    // Validate hotel details
    if (!hotelDetails || !Array.isArray(hotelDetails) || hotelDetails.length === 0) {
      return res.status(400).json({ error: 'Invalid hotel details, please provide an array of hotel details' });
    }

    // Retrieve dashboard document
    const trip = await getTripByTripId(tripId, tenantId, empId);

    // Check if trip exists
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or not in transit' });
    }

    const { embeddedTrip } = trip;

    // Check if the dashboard structure is valid
    const { hotels } = embeddedTrip.embeddedTravelRequest.itinerary || { hotels: [] };

    // Iterate through each hotel in the hotelDetails array and add them to hotels
    hotelDetails.forEach((newHotel) => {
      const newHotelDetails = {
        bookingId: new mongoose.Types.ObjectId(),
        ...newHotel,
        status: updateTripStatus(embeddedTrip.embeddedTravelRequest.approvers),
      };

      hotels.push(newHotelDetails);
    });

    // Update tripStatus based on the latest hotel added
    trip.tripStatus = hotels.length > 0 ? hotels[hotels.length - 1].status : trip.tripStatus;

    // Update the hotels array and tripStatus in the database
    const addLegToTrip = await Dashboard.findOneAndUpdate(
      {
        'embeddedTrip.embeddedTravelRequest.tenantId': tenantId,
        'embeddedTrip.userId.empId': empId,
        'embeddedTrip.tripId': tripId,
      },
      { $set: { 'embeddedTrip.embeddedTravelRequest.itinerary.hotels': hotels, tripStatus: trip.tripStatus } },
      { new: true }
    );

    // Save the updated dashboard
    await saveInDashboard(addLegToTrip);

    // Respond with success message and the updated trip
    return res.status(200).json({ success: true, message: 'Hotels added successfully', trip: addLegToTrip });
  } catch (error) {
    // Log the error for monitoring purposes
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};









// export const addFlight = async (req, res) => {
//   try {
//     const { tenantId, tripId, empId } = req.params;
//     const { flightDetails } = req.body;

//     // Input validation
//     if (!tripId || !tenantId || !empId) {
//       return res.status(400).json({ error: 'Invalid input, please provide valid tripId, tenantId, empId' });
//     }

//     // Validate flight details
//     if (!validateFlightDetails(flightDetails)) {
//       return res.status(400).json({ error: 'Invalid flight details, please provide all required fields' });
//     }

//     // Retrieve dashboard document
//     const trip = await getTripByTripId(tripId, tenantId, empId);

//     // Check if trip exists
//     if (!trip) {
//       return res.status(404).json({ error: 'Trip not found or not in transit' });
//     }

//     const { embeddedTrip } = trip;

//     // Check if the dashboard structure is valid
//     if (!embeddedTrip || !embeddedTrip.embeddedTravelRequest || !embeddedTrip.embeddedTravelRequest.itinerary) {
//       throw new Error('Invalid dashboard structure. Unable to find itinerary.');
//     }

//     const { flights } = embeddedTrip.embeddedTravelRequest.itinerary;

//     if (!flights) {
//       throw new Error('Invalid dashboard structure. Unable to find flights array.');
//     }

//     // Create new flight details
//     const newFlightDetails = {
//       itineraryId: new mongoose.Types.ObjectId(), // use new prefix - to create a new ObjectId
//       formId: String(),
//       ...flightDetails,
//       status: updateTripStatus(embeddedTrip.embeddedTravelRequest.approvers),
//     };

//     // Add new flight details to the flights array
//     flights.push(newFlightDetails);

//     // Update tripStatus based on approvers
//     trip.tripStatus = newFlightDetails.status;

//     // Save the changes back to the database
//     const addLegToTrip = await Dashboard.findOneAndUpdate(
//       {
//         'embeddedTrip.embeddedTravelRequest.tenantId': tenantId,
//         'embeddedTrip.userId.empId': empId,
//         'embeddedTrip.tripId': tripId,
//       },
//       { $set: { 'embeddedTrip.embeddedTravelRequest.itinerary.flights': flights, 'tripStatus': newFlightDetails.status } },
//       { new: true } // To return the updated document after update
//     );

//     // Save the updated dashboard
//     await saveInDashboard(addLegToTrip);

//     // Respond with success message and the updated trip
//     return res.status(200).json({ success: true, message: 'Flight added successfully', trip: addLegToTrip });
//   } catch (error) {
//     // Log the error for monitoring purposes
//     console.error(error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
