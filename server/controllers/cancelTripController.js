import { tripLineItemCancelledToCashService } from '../internal/controllers/cashMicroservice.js';
import { TripLineItemCancelledToExpense } from '../internal/controllers/expenseMicroservice.js';
import { tripLineItemCancelledToTravelService } from '../internal/controllers/travelMicroservice.js';
import Trip from '../models/tripSchema.js';

// 1) get trip details -- for cancellation 
// Trip cancellation 
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

// validating trip
const getTrips = async (tenantId, tripId, empId) => {
    return await Trip.find({
        tenantId,
        tripId,
        tripStatus: { $in: ['transit', 'upcoming', 'completed'] },
        $or: [
            { 'travelRequestData.createdBy.empId': empId },
            { 'travelRequestData.createdFor.empId': empId },
        ],
    });
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
        // itinerary: trip.travelRequestData?.itinerary,
        flights: mapFlights(trip.travelRequestData?.itinerary?.flights)|| [],
        hotels: mapHotels(trip.travelRequestData?.itinerary?.hotels)|| [],
        buses: mapBuses(trip.travelRequestData?.itinerary?.buses)|| [],
        trains: mapTrains(trip.travelRequestData?.itinerary?.trains) || [],
        cabs: mapCabs(trip.travelRequestData?.itinerary?.cabs) || [],
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
        cancellationDate: flight.cancellationDate,
        cancellationReason: flight.cancellationReason,
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
        cancellationDate: train.cancellationDate,
        cancellationReason: train.cancellationReason,
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
        cancellationDate: hotel.cancellationDate,
        cancellationReason: hotel.cancellationReason,
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
        cancellationDate: buses.cancellationDate,
        cancellationReason: buses.cancellationReason,
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
        cancellationDate: cab.cancellationDate,
        cancellationReason: cab.cancellationReason,
        status: cab.status,
    }));
};

  
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


// 1) get trip details for tripStatus - transit, upcoming or completed.
export const getTripDetails = async (req, res) => {
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


// 2) cancel at header level - for upcoming/completed trips only --( header level cancel is allowed to upcoming and completed trips , not allowed for transit trips) 
export const cancelTripAtHeaderLevel = async (req, res) => {
    try {
      const { tenantId, tripId, empId } = req.params;
  
      // Input validation
      if (!empId || !tenantId || !tripId) {
        return res.status(400).json({ error: 'Invalid input parameters.' });
      }
  
      // Find the trip
      const trip = await Trip.findOne({
        tenantId,
        tripId,
        $or: [
          { 'tripStatus':'upcoming'  },
          { 'tripStatus': 'completed'},
          {$or: [
            { 'travelRequestData.createdBy.empId': empId },
            { 'travelRequestData.createdFor.empId': empId },
        ],}
      ],
      });
  

      
      // Check if trip exists
      if (!trip) {
        return res.status(404).json({ error: 'Trip not found' });
      }
  
      const updateStatus = (item) => {
        return item.status === 'booked' ? 'paid and cancelled' : 'cancelled';
      };
  
      // Updating status for all itinerary types
      const updateItineraryType = (itineraryType) => {
        trip.travelRequestData.itinerary[itineraryType].forEach((item) => {
          item.status = updateStatus(item);
        });
      };
  
      // Update status for each itinerary type
      updateItineraryType('flights');
      updateItineraryType('hotels');
      updateItineraryType('cabs');
      updateItineraryType('buses');
      updateItineraryType('trains');
  
      // Apply the same logic for cash advance
      if (trip.travelRequestData.isCashAdvanceTaken) {
        trip.cashAdvancesData.forEach((cashAdvance) => {
          cashAdvance.cashAdvanceStatus = updateStatus(cashAdvance);
        });
      }
  
      // Update trip status (upcoming/completed)
      trip.tripStatus = 'paid and cancelled' ;

     // Update travel status
      trip.travelRequestData.travelRequestStatus = trip.travelRequestData.travelRequestStatus === 'booked' ? 'paid and cancelled' : 'cancelled';
  
      // Save the updated trip
      await trip.save();

      //Send changes to expense microservice asynchronously
       await upcomingTripCancelledToExpense(trip);

      // Check if cash advance is taken and send to the appropriate microservice
          if (trip.travelRequestData.isCashAdvanceTaken) {
       console.log('Is cash advance taken:', trip.travelRequestData.isCashAdvanceTaken);
           await upcomingTripCancelledToCash(trip);
        } else {
      await upcomingTripCancelledToTravel(trip);
         }
  
return res.status(200).json({ message: 'Trip cancelled successfully.', data: trip });
} catch (error) {
    console.error(error);
    const errorMessage = error.message || 'Internal server error.';
    return res.status(500).json({ error: errorMessage });
}
};
  

// 3) Itinerary line item (Already booked line item) cancelled,  then update status from 'booked' to 'paid and cancelled'
//Line item cancellation is allowed for trips with = upcoming, transit status only
  const updateStatus = (item) => {
    return item.status === 'booked' ? 'paid and cancelled' : 'cancelled';
  };

  // Update status fields conditionally
  const itineraryLineItem = async (trip, itineraryIds) => {
    const updateItemStatus = (items) => {
      items.forEach(item => {
        if (itineraryIds.includes(item.itineraryId.toString())) {   // .toString() is very important to make the code work.
          item.status = updateStatus(item);
        }
      });
    };
  
    updateItemStatus(trip.travelRequestData.itinerary.flights);
    updateItemStatus(trip.travelRequestData.itinerary.hotels);
    updateItemStatus(trip.travelRequestData.itinerary.cabs);
    updateItemStatus(trip.travelRequestData.itinerary.buses);
  
    await trip.save();
  
    return trip;
  };

  
  // Line item cancel
  export const cancelTripAtLineItemLevel = async (req, res) => {
  
    try {
  
      const { tenantId, tripId, empId } = req.params;
      const { itineraryIds } = req.body;
      
       // Input validation
       if (!tenantId || !tripId || !empId || !itineraryIds || !Array.isArray(itineraryIds)) {
        return res.status(400).json({ error: 'Invalid input parameters.' });
      }
  
      const trip = await Trip.findOne({
        tenantId,
        tripId, 
        $or: [
            { 'travelRequestData.createdBy.empId': empId },
            { 'travelRequestData.createdFor.empId': empId },
          ],
      });
  
      if(!trip) {
        return res.status(404).json({error: 'Trip not found'});
      }
  
      const lineItemStatusUpdate = await itineraryLineItem(trip, itineraryIds);


       // Send changes to expense microservice asynchronously
       await TripLineItemCancelledToExpense(lineItemStatusUpdate);

       if (trip.travelRequestData.isCashAdvanceTaken) {
           console.log('Is cash advance taken:', trip.travelRequestData.isCashAdvanceTaken);
           await tripLineItemCancelledToCashService(lineItemStatusUpdate);
       } else {
           await tripLineItemCancelledToTravelService(lineItemStatusUpdate);
       }
  
       return res.status(200).json({ message: 'Trip updated successfully', data: lineItemStatusUpdate });
  
    } catch (error) {
      
      console.error(error);
      return res.status(500).json({error: 'Internal Server Error'});
    }
  }

  
  

  
