import Trip from '../models/tripSchema.js';
import { sendToDashboardMicroservice } from '../rabbitmq/dashboardMicroservice.js';
import { sendToOtherMicroservice } from '../rabbitmq/publisher.js';
import { filterFutureFlights } from '../utils/dateUtils.js';
import { employeeSchema } from './modifyTrips.js';

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
        // tripStatus: { $in: ['transit', 'upcoming', 'completed' , 'closed', 'paid and cancelled' },
        $or: [
            { 'travelRequestData.createdBy.empId': empId },
            { 'travelRequestData.createdFor.empId': empId },
        ],
    });
};

// extracting Entire Trip Details 
const mapTripDetails = (trips) => {
    return  trips.map((trip) => ({
        tripId:trip.tripId,
        travelRequestId:trip.travelRequestData?.travelRequestId,
        TripPurpose: trip.tripPurpose,
        TripStartDate: trip.tripStartDate,
        TripEndDate: trip.tripCompletionDate,
        TripStatus: trip.tripStatus,
        approvers: trip.travelRequestData?.approvers,
        itinerary: trip.travelRequestData?.itinerary,
        // flights: mapFlights(trip.travelRequestData?.itinerary?.flights)|| [],
        // hotels: mapHotels(trip.travelRequestData?.itinerary?.hotels)|| [],
        // buses: mapBuses(trip.travelRequestData?.itinerary?.buses)|| [],
        // trains: mapTrains(trip.travelRequestData?.itinerary?.trains) || [],
        // cabs: mapCabs(trip.travelRequestData?.itinerary?.cabs) || [],
        // cashAdvances: trip.cashAdvancesData?.map(mapCashAdvance) || [],
        cashAdvances: trip.cashAdvancesData?.length > 1 ? trip.cashAdvancesData.map(mapCashAdvance) : [],
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
    const {error, value} = employeeSchema.validate(req.params)

    if(error) return res.status(400).json(error.details[0].message)

    const { tenantId, tripId, empId } = value;

    if (!(empId) || !(tenantId) || !(tripId)) {
      return res.status(400).json({ error: 'Invalid input parameters.' });
    }

    // const tripDetails = await extractTripDetails(tenantId, tripId, empId);
    const getTrip = await Trip.findOne({
      tenantId,
      tripId,
      tripStatus: { $in: ['transit', 'upcoming'] },
      $or: [
          { 'travelRequestData.createdBy.empId': empId },
          { 'travelRequestData.createdFor.empId': empId },
      ],
  });

  if(getTrip){
    const upcomingItinerary = {}
    const tripStatus = getTrip.tripStatus
     const isTransit = getTrip?.tripStatus == 'transit'
    const {itinerary={}}=getTrip?.travelRequestData
  
    let tripDetails = {
      tripId:getTrip.tripId,
      travelRequestId:getTrip.travelRequestData?.travelRequestId,
      travelAllocationHeaders:getTrip?.travelRequestData?.travelAllocationHeaders,
      travelType:getTrip?.travelRequestData?.travelType,
      createdBy:getTrip?.travelRequestData?.createdBy,
      TripPurpose: getTrip?.tripPurpose ?? '',
      tripName: getTrip?.tripName ?? '',
      TripStartDate: getTrip.tripStartDate,
      TripEndDate: getTrip.tripCompletionDate,
      TripStatus: getTrip.tripStatus,
      approvers: getTrip.travelRequestData?.approvers,
      itinerary: isTransit ? upcomingItinerary: getTrip.travelRequestData?.itinerary,
    }

    if(tripStatus == 'transit'){
      const {itinerary={}}=getTrip?.travelRequestData
  
      const flights = itinerary?.flights
      const buses = itinerary?.buses
      const trains = itinerary?.trains
      const cabs = itinerary?.cabs
      const hotels = itinerary?.hotels
      const carRentals = itinerary?.carRentals
      const personalVehicles = itinerary?.personalVehicles
  
    console.log(flights)
    const futureFlights = filterFutureFlights(flights);
    upcomingItinerary.flights = futureFlights
  
    const futureBuses = filterFutureFlights(buses)
    upcomingItinerary.buses = futureBuses

    const futureTrains = filterFutureFlights(trains)
    upcomingItinerary.trains= futureTrains

    const newHotels = filterFutureFlights(hotels)
    upcomingItinerary.hotels= newHotels

    upcomingItinerary.cabs=filterFutureFlights(cabs)
    upcomingItinerary.carRentals=filterFutureFlights(carRentals)
    upcomingItinerary.personalVehicles=filterFutureFlights(personalVehicles)

    console.log("upcomingItinerary", upcomingItinerary)
    }

    return res.status(200).json({
      success:true,
      message:'trip details for the employee',
      trip:tripDetails
    })
  } else {
    return res.status(404).json({success:false, error:"Incorrect data"})
  }

  } catch (error) {
    console.error('Error fetching transit trips:', error);
    return res.status(500).json({ error: 'Internal Server Error', error });
  }
};


// 2) cancel at header level - for upcoming/completed trips only --( header level cancel is allowed to upcoming and completed trips , not allowed for transit trips) 
// Line item cancel
export const cancelTripAtHeaderLevel = async (req, res) => {
  try {
    const { tenantId, tripId, empId } = req.params;

    // Input validation
    if (!empId || !tenantId || !tripId) {
      return res.status(400).json({ error: 'Invalid input parameters.' });
    }

    // const tripId_ObjectId = new mongoose.Types.ObjectId(tripId);

    // Find the trip asynchronously
    const trip = await Trip.findOne({
      tenantId,
      tripId,
      // tripId: tripId_ObjectId,
      $or: [
        { 'tripStatus': 'upcoming' },
        { 'tripStatus': 'completed' },
        {
          $or: [
            { 'travelRequestData.createdBy.empId': empId },
            { 'travelRequestData.createdFor.empId': empId },
          ],
        },
      ],
    });

    // Check if trip exists
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
     const { travelRequestData} = trip
     const {isCashAdvanceTaken} = travelRequestData
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
    trip.tripStatus = 'paid and cancelled';

    // Update travel status
    trip.travelRequestData.travelRequestStatus = trip.travelRequestData.travelRequestStatus === 'booked' ? 'paid and cancelled' : 'cancelled';

    // Save the updated trip asynchronously
   const tripCancelled = await trip.save();

   if(!tripCancelled){
    return res.status(500).json({ error: 'Internal Server Error - Trip cancellation failed', error });
   } else {
    const travel = {
      travelRequestData:trip?.travelRequestData ?? {},
    }

    const cash = {
      travelRequestData: trip?.travelRequestData ?? {},
      cashAdvancesData: trip?.cashAdvancesData ?? [],
    }

    // To expense microservice
    await sendToOtherMicroservice(cash, 'full-update', 'expense', 'to update travelRequestStatus and cashAdvances status in epense microservice- after cancellation of entire trip')

    if(isCashAdvanceTaken){
    //send to cash microservices
    console.log("rabbitmq cash", cash)
    await sendToDashboardMicroservice(cash, 'full-update-cash', 'trip cancelled at header level - update "cashSchema" in dashboard', 'trip', 'batch', 'true');
    await  sendToOtherMicroservice(cash, 'full-update', 'cash', 'to update travelRequestStatus and cashAdvances status in cash microservice- after cancellation of entire trip')
    } else {
    //send to travel microservices
    console.log("rabbitmq travel", travel)
    await sendToDashboardMicroservice(travel, 'full-update-travel', 'trip cancelled at header level - update "travelRequestSchema" in dashboard', 'trip', 'batch', 'true');
    await  sendToOtherMicroservice(travel, 'full-update', 'travel', 'to update entire travel request in Travel microservice- after cancellation of entire trip ')
    }

    return res.status(200).json({ message: 'Trip cancelled successfully.', data: trip });
   }
   
  } catch (error) {
    console.error(error);
    const errorMessage = error.message || 'Internal server error.';
    return res.status(500).json({ error: errorMessage });
  }
};



// 3) Itinerary line item (Already booked line item) cancelled,  then update status from 'booked' to 'paid and cancelled'
//Line item cancellation is allowed for trips with = upcoming, transit status only
// const updateStatus = (item) => {
//   return item.status === 'booked' ? 'paid and cancelled' : 'cancelled';
// };

// // Update status fields conditionally
// export const itineraryLineItem = async (tripDetails, itineraryIds) => {
//   try {
//     const updateItemStatus = (items) => {
//       items.forEach(item => {
//         const itemId = item.itineraryId.toString();
//         if (itineraryIds.includes(itemId)) {
//           item.status = updateStatus(item);
//         }
//       });
//     };
  
//     updateItemStatus(tripDetails.travelRequestData.itinerary.flights || []);
//     updateItemStatus(tripDetails.travelRequestData.itinerary.hotels || []);
//     updateItemStatus(tripDetails.travelRequestData.itinerary.cabs || []);
//     updateItemStatus(tripDetails.travelRequestData.itinerary.buses || []);
  
//     await tripDetails.save();
  
//     return tripDetails;
//   } catch (error) {
//     console.error(error);
//     throw new Error(error);
//   }
// };
const updateStatus = (item, action) => {
  const validActions = {
    booked: () => {
      if (item.status !== 'booked') {
        throw new Error(`Cannot update status to 'paid and cancelled' because current status is '${item.status}'`);
      }
      return 'paid and cancelled';
    },
    cancelled: () => 'cancelled'
  };

  if (validActions[action]) {
    return validActions[action]();
  }

  throw new Error(`Invalid action: ${action}`);
};

// Update status fields conditionally
export const itineraryLineItem = async (tripDetails, itineraryIds, action) => {
  try {
    const updateItemStatus = (items) => {
      items.forEach(item => {
        if (itineraryIds.includes(item.itineraryId.toString())) {
          item.status = updateStatus(item, action);
        }
      });
    };

    // Update status for all types of itinerary items
    ['flights', 'hotels', 'cabs', 'buses'].forEach(type => {
      updateItemStatus(tripDetails.travelRequestData.itinerary[type] || []);
    });

    await tripDetails.save();

    return tripDetails;
  } catch (error) {
    console.error('Error updating itinerary status:', error.message);
    throw error;
  }
};




  // Line item cancel
  export const cancelTripAtLineItemLevel = async (req, res) => {
    try {
      const { tenantId, tripId, empId } = req.params;
      const { itineraryIds } = req.body;

      console.log("params", req.params)
      console.log(" itinerary ids", req.body)
       // Input validation
       if (!tenantId || !tripId || !empId || !itineraryIds || !Array.isArray(itineraryIds)) {
        return res.status(400).json({ error: 'Invalid input parameters.' });
      }
  
      const tripDetails = await Trip.findOne({
        tenantId,
        tripId, 
        $or: [
            { 'travelRequestData.createdBy.empId': empId },
            { 'travelRequestData.createdFor.empId': empId },
          ],
      });
  
      if(!tripDetails) {
        return res.status(404).json({error: 'Trip not found'});
      } else {
        const trip = await itineraryLineItem(tripDetails, itineraryIds);

        const travel = {
          travelRequestData:trip.travelRequestData ?? {},
        }
  
        const cash = {
          travelRequestData:trip?.travelRequestData ?? {},
          cashAdvancesData: trip?.cashAdvancesData ?? [],
        }
         const isCashAdvanceTaken = trip?.travelRequestData?.isCashAdvanceTaken;
      
         if (isCashAdvanceTaken) {
             console.log('Is cash advance taken:', isCashAdvanceTaken);
        //send to cash microservice
        await sendToOtherMicroservice(cash, 'full-update', 'cash', 'to update entire travel and cashAdvances data in cash microservice- after cancellation of trip at itinerary level')
        await sendToDashboardMicroservice(cash, 'full-update-cash', 'trip cancelled at line level - update "cashSchema" in dashboard', 'trip', 'batch', 'true');
         } else {
        //send to other microservices
        await sendToOtherMicroservice(travel, 'full-update', 'travel', 'to update entire travel request in Travel microservice- after cancellation of trip at itinerary level')
        await sendToDashboardMicroservice(travel, 'full-update-travel', 'trip cancelled at line item level - update "travelRequestSchema" in dashboard', 'trip', 'batch', 'true');
         }
  
        // send to expense microservice
         await sendToOtherMicroservice(cash, 'full-update', 'expense', 'to update entire travel and cashAdvances data in expense microservice- after cancellation of trip at itinerary level')
  
         return res.status(200).json({ message: 'Trip updated successfully', data: trip });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({error: 'Internal Server Error'});
    }
  }








