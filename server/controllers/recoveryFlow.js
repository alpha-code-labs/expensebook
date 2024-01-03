import Trip from "../models/tripSchema.js";
import { recoveryAtHeaderLevelToCash, recoveryAtLineItemLevelToCash } from "../internal/controllers/cashMicroservice.js";
import { recoveryAtHeaderLevelToExpense, recoveryAtLineItemLevelToExpense } from "../internal/controllers/expenseMicroservice.js";
import { recoveryAtHeaderLevelToTravel, recoveryAtLineItemLevelToTravel } from "../internal/controllers/travelMicroservice.js";
import { sendTripsToDashboardQueue } from "../rabbitmq/dashboardMicroservice.js";

//Trip Microservice -Travel recovery flow for paid and cancelled Trips
// 1) get trip details -- for Recovery
// !!Important - empId is part of hr database as tarvel admin,
// then show him travel related recovery and cash related recovery to finance guy
// validating trip

const getTrips = async (tenantId, tripId, empId) => {
  return await Trip.find({
      tenantId,
      tripId,
      tripStatus:'paid and cancelled',
      $or: [
          { 'travelRequestData.createdBy.empId': empId },
          { 'travelRequestData.createdFor.empId': empId },
      ],
  });
};

export const extractTripDetails = async (tenantId, tripId, empId) => {
    try {
        validateInputParameters(empId, tenantId, tripId);

        const trips = await getTrips(tenantId, tripId, empId);

        if (!trips || trips.length === 0) {
            throw new Error('No transit trips found for this user.');
        }

        const tripDetails = mapTripDetails(trips);

        return tripDetails;
    } catch (error) {
        throw error;
    }
};

// validating params
const validateInputParameters = (empId, tenantId, tripId) => {
    if (!empId || !tenantId || !tripId) {
        throw new Error('Invalid input parameters.');
    }
};

// extracting Entire Trip Details 
const mapTripDetails = (trips) => {
    return trips.map((trip) => ({
        tripId:trip.tripId,
        travelRequestId:trip.travelRequestData?.travelRequestId,
        TripPurpose: trip.tripPurpose,
        TripStartDate: trip.tripStartDate,
        TripEndDate: trip.tripCompletionDate,
        approvers: trip.travelRequestData?.approvers,
        itinerary: trip.travelRequestData?.itinerary,
        // flights: mapFlights(trip.travelRequestData?.itinerary?.flights)|| [],
        // hotels: mapHotels(trip.travelRequestData?.itinerary?.hotels)|| [],
        // buses: mapBuses(trip.travelRequestData?.itinerary?.buses)|| [],
        // trains: mapTrains(trip.travelRequestData?.itinerary?.trains) || [],
        // cabs: mapCabs(trip.travelRequestData?.itinerary?.cabs) || [],
        cashAdvances: trip.cashAdvancesData?.map(mapCashAdvance) || [],
    }));
};

// extracting flights details
const mapFlights = (flightsArray) => {
    return flightsArray.map((flight) => ({
        itineraryId: flight.itineraryId,
        bkd_from: flight.bkd_from,
        bkd_to: flight.bkd_to,
        bkd_date: flight.bkd_date,
        bkd_time: flight.bkd_time,
        bkd_travelClass: flight.bkd_travelClass,
        bkd_violations: flight.bkd_violations,
        bkd_isReturnTravel:flight.bkd_isReturnTravel,
        recoveryDate: flight.recoveryDate,
        recoveryReason: flight.recoveryReason,
        status: flight.status,
    }));
};

// extracting trains details
const mapTrains = (trainsArray) => {
    return trainsArray.map((train) => ({
        itineraryId: train.itineraryId,
        bkd_from: train.bkd_from,
        bkd_to: train.bkd_to,
        bkd_date: train.bkd_date,
        bkd_time: train.bkd_time,
        bkd_travelClass: train.bkd_travelClass,
        bkd_isReturnTravel: train.bkd_isReturnTravel,
        recoveryDate: train.recoveryDate,
        recoveryReason: train.recoveryReason,
        status: train.status,
    }));
};

// extracting hotel details
const mapHotels = (hotelsArray) => {
    return hotelsArray.map((hotel) => ({
        itineraryId: hotel.itineraryId,
        bkd_location: hotel.bkd_location,
        bkd_class: hotel.bkd_class,
        bkd_checkIn: hotel.bkd_checkIn,
        bkd_checkOut: hotel.bkd_checkOut,
        bkd_violations: hotel.bkd_violations,
        recoveryDate: hotel.recoveryDate,
        recoveryReason: hotel.recoveryReason,
        status: hotel.status,
    }));
};

// extracting buse details 
const mapBuses = (busesArray) => {
    return busesArray.map((buses) => ({
        itineraryId: buses.itineraryId,
        bkd_from: buses.bkd_from,
        bkd_to: buses.bkd_to,
        bkd_date: buses.bkd_date,
        bkd_time: buses.bkd_time,
        bkd_isReturnTravel: buses.bkd_isReturnTravel,
        recoveryDate: buses.recoveryDate,
        recoveryReason: buses.recoveryReason,
        status: buses.status,
    }));
};

// extracting buse details 
const mapCabs = (cabsArray) => {
    return cabsArray.map((cab) => ({
        itineraryId: cab.itineraryId,
        bkd_date: cab.bkd_date,
        bkd_class: cab.bkd_class,
        bkd_preferredTime: cab.bkd_preferredTime,
        bkd_pickupAddress: cab.bkd_pickupAddress,
        bkd_dropAddress: cab.bkd_dropAddress,
        bkd_violations: cab.bkd_violations,
        recoveryDate: cab.recoveryDate,
        recoveryReason: cab.recoveryReason,
        status: cab.status,
    }));
};

// extracting cash advance details for "Trip Microservice -Travel recovery flow for paid and cancelled Trips"
const mapCashAdvance = (cashAdvance) => {
    return {
        travelRequestId: cashAdvance.travelRequestId || '',
        cashAdvanceId: cashAdvance.cashAdvanceId || '',
        createdBy: {
            empId: cashAdvance.createdBy.empId || '',
            name: cashAdvance.createdBy.name || '',
        },
        cashAdvanceStatus: cashAdvance.cashAdvanceStatus || 'draft',
        amountDetails: cashAdvance.amountDetails.map((amountDetail) => ({
            amount: amountDetail.amount || 0,
            currency: amountDetail.currency || '',
            mode: amountDetail.mode || '',
        })),
        approvers: cashAdvance.approvers.map((approver) => ({
            empId: approver.empId || '',
            name: approver.name || '',
            status: approver.status || '',
        })),
        cashAdvanceRequestDate: cashAdvance.cashAdvanceRequestDate || null,
        cashAdvanceApprovalDate: cashAdvance.cashAdvanceApprovalDate || null,
        cashAdvanceSettlementDate: cashAdvance.cashAdvanceSettlementDate || null,
        cashAdvanceViolations: cashAdvance.cashAdvanceViolations || [],
        cashAdvanceRejectionReason: cashAdvance.cashAdvanceRejectionReason || '',
    };
};

//get trip details for tripStatus - transit, upcoming or completed .
export const getTripDetailsForRecovery = async (req, res) => {
  try {
    const { tenantId, tripId, empId } = req.params;

    if (!(empId) || !(tenantId) || !(tripId)) {
      return res.status(400).json({ error: 'Invalid input parameters.' });
    }

    const tripDetails = await extractTripDetails(tenantId, tripId, empId);

    return res.status(200).json({
      message: 'trip details for the employee.',
      trip: tripDetails,
    });
  } catch (error) {
    console.error('Error fetching transit trips:', error);

    if (error.message === 'Invalid input parameters.') {
      return res.status(400).json({ error: 'Invalid input parameters.' });
    } else if (error.message === 'No transit trips found for this user.') {
      return res.status(404).json({ error: 'No transit trips found for this user.' });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// get trip with 'paid and cancelled' status
export const getPaidAndCancelledTrip = async (req, res) => {
    try {
      const { tenantId, tripId } = req.params;
  
      // Input validation
      if (!tenantId || !tripId) {
        return res.status(400).json({ error: 'Invalid input parameters' });
      }
  
      // Retrieve trip with status 'paid and cancelled' from the database
      const getTrip = await Trip.findOne({
        tenantId,
        tripId,
        'tripStatus': 'paid and cancelled',
      });
  
      // Check if the trip was found
      if (!getTrip) {
        console.log('No "paid and cancelled" trip found for retrieval.');
        return res.status(404).json({ error: 'No "paid and cancelled" trip found for retrieval.' });
      }
  
      // Send success response
      return res.status(200).json({
        message: 'Trip with status "Paid and cancelled" retrieved successfully',
        getTrip,
      });
    } catch (error) {
      console.error('Error retrieving "paid and cancelled" trip:', error);
      // Standardized error response
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
//--------------------------------------------------------------------------------------------------
// Trip Microservice - Travel recovery flow for paid and cancelled Trips
const hrData = [
  { empId: 'empf001', name: 'financeAdmin' },
  { empId: 'empt001', name: 'travelAdmin' },
];

// Function to find a verified travel admin
export const travelAdmin = async (empId) => {
  try {
    const verifiedEmployee = hrData.find((employee) => employee.empId === empId);

    if (verifiedEmployee) {
      console.log(`${empId} is a verified Travel Admin.`);
      return { empId: verifiedEmployee.empId, name: verifiedEmployee.name };
    } else {
      console.log(`${empId} is not a verified Travel Admin.`);
      return null;
    }
  } catch (error) {
    console.error('Error in travelAdmin:', error);
    throw error;
  }
};

// Function to update status based on conditions
const updateStatus = (newStatus, verifiedTravelAdmin) => ({
  $set: {
    'travelRequestData.itinerary.flights.$[].status': newStatus === 'recovered' ? 'recovered' : 'cancelled',
    'travelRequestData.itinerary.trains.$[].status': newStatus === 'recovered' ? 'recovered' : 'cancelled',
    'travelRequestData.itinerary.buses.$[].status': newStatus === 'recovered' ? 'recovered' : 'cancelled',
    'travelRequestData.itinerary.cabs.$[].status': newStatus === 'recovered' ? 'recovered' : 'cancelled',
    'travelRequestData.itinerary.hotels.$[].status': newStatus === 'recovered' ? 'recovered' : 'cancelled',
    'tripStatus': newStatus === 'recovered' ? 'recovered' : 'cancelled',
    'travelRequestData.travelRequestStatus': newStatus === 'recovered' ? 'recovered' : 'cancelled',
    'travelRequestData.recoveredBy': {
      empId: verifiedTravelAdmin.empId,
      name: verifiedTravelAdmin.name,
    },
  },
});

// 2) Controller function for header level recovery
export const recoveryAtHeaderLevel = async (req, res) => {
  try {
    const { tenantId, tripId, empId } = req.params;

    // Verify if the employee is a travel admin
    const verifiedTravelAdmin = await travelAdmin(empId);

    if (!verifiedTravelAdmin) {
      console.log(`Access denied. ${empId} is not a verified Travel Admin.`);
      return res.status(403).json({
        message: `Access denied. ${empId} is not a verified Travel Admin.`,
      });
    }

    // Update status for 'recovered' with conditional logic //updateOne to findOneAndUpdate
    const trip = await Trip.findOneAndUpdate(
      {
        tenantId,
        tripId,
        $or: [
          { 'travelRequestData.itinerary.flights.status': 'paid and cancelled' },
          { 'travelRequestData.itinerary.hotels.status': 'paid and cancelled' },
          { 'travelRequestData.itinerary.cabs.status': 'paid and cancelled' },
          { 'travelRequestData.itinerary.buses.status': 'paid and cancelled' },
          { 'travelRequestData.itinerary.trains.status': 'paid and cancelled' },
        ],
      },
      updateStatus('recovered', verifiedTravelAdmin),
      { new: true } // To return the updated document
    ).exec();

    // Check if the trip object is null
    if (!trip) {
      console.log(`Trip with tenantId ${tenantId} and tripId ${tripId} not found.`);
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Save the modified document
    await trip.save();

    const data = 'online';
    const needConfirmation = false;

    // Send updated trip to the dashboard asynchronously
    await sendTripsToDashboardQueue(trip, data, needConfirmation);

    console.log('Header level recovery successful.');
    res.status(200).json({ message: 'Header level recovery successful', trip });
  } catch (error) {
    // Handle the error using standardized response structures
    console.error('Error in header level recovery:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
  
// ---------------------------------------------------------------------------------------

// 3) Define updateRecoverStatus function
const updateRecoverStatus = (item) => {
  return item.status === 'paid and cancelled' ? 'recovered' : 'cancelled';
};

// Update status fields conditionally
const itineraryLineItem = async (trip, itineraryIds) => {
  const updateItemStatus = (items) => {
    items.forEach(item => {
      if (itineraryIds.includes(item.itineraryId.toString())) {
        item.status = updateRecoverStatus(item);
      }
    });
  };

  updateItemStatus(trip.travelRequestData.itinerary.flights);
  updateItemStatus(trip.travelRequestData.itinerary.hotels);
  updateItemStatus(trip.travelRequestData.itinerary.cabs);
  updateItemStatus(trip.travelRequestData.itinerary.buses);

  await trip.save();  // Move $set and save operation inside itineraryLineItem function

  return trip;
};

// Recover done for Line item  
export const recoveryAtLineItemLevel = async (req, res) => {
  try {
    const { tenantId, tripId, empId } = req.params;
    const { itineraryIds } = req.body;

    // Input validation
    if (!tenantId || !tripId || !empId || !itineraryIds || !Array.isArray(itineraryIds)) {
      return res.status(400).json({ error: 'Invalid input parameters.' });
    }

    // Verify if the employee is a travel admin
    const verifiedTravelAdmin = await travelAdmin(empId);

    if (!verifiedTravelAdmin) {
      console.log(`Access denied. ${empId} is not a verified Travel Admin.`);
      return res.status(403).json({
        message: `Access denied. ${empId} is not a verified Travel Admin.`,
      });
    }

    const trip = await Trip.findOneAndUpdate(
      {
        tenantId,
        tripId,
        tripStatus: { $in: ['upcoming', 'transit', 'completed'] },
        $or: [
          { 'travelRequestData.itinerary.flights.status': 'paid and cancelled' },
          { 'travelRequestData.itinerary.hotels.status': 'paid and cancelled' },
          { 'travelRequestData.itinerary.cabs.status': 'paid and cancelled' },
          { 'travelRequestData.itinerary.buses.status': 'paid and cancelled' },
          { 'travelRequestData.itinerary.trains.status': 'paid and cancelled' },
        ],
      },
      {
        $set: {
          'travelRequestData.recoveredBy': {
            empId: verifiedTravelAdmin.empId,
            name: verifiedTravelAdmin.name,
          },
        },
      },
      { new: true } // To return the updated document
    ).exec();


     // Check if the trip was found
     if (!trip) {
      console.log('No upcoming trip found for recovery.'); 
      return res.status(404).json({ error: 'No upcoming trip found for recovery.' });
    }

    const lineItemStatusUpdate = await itineraryLineItem(trip, itineraryIds);
   
    // Save the updated trip
    await trip.save();

    const data = 'online';
    const needConfirmation = false;

    // Send updated trip to the dashboard asynchronously
    await sendTripsToDashboardQueue(trip, data, needConfirmation);

    // Send changes to expense microservice asynchronously
    await recoveryAtLineItemLevelToExpense(lineItemStatusUpdate);

    // Check if cash advance was taken
    if (trip.travelRequestData.isCashAdvanceTaken) {
      console.log('Is cash advance taken:', trip.travelRequestData.isCashAdvanceTaken);
      await recoveryAtLineItemLevelToCash(lineItemStatusUpdate);
    } else {
      await recoveryAtLineItemLevelToTravel(lineItemStatusUpdate);
    }

    // Send success response
    return res.status(200).json({
      message: 'Trip recovery at line item level successful.',
      lineItemStatusUpdate,
      trip,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



       