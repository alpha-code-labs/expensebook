import mongoose from 'mongoose';
import Dashboard from '../models/dashboardSchema.js';
import {dashboardToTripMicroservice} from '../internal/controllers/toTripMicroservice.js';
import {dashboardToExpenseMicroservice} from '../internal/controllers/toExpenseMicroservice.js';
import { dashboardToApprovalMicroservice } from '../internal/controllers/toApprovalMicroservice.js';
import { dashboardToCashMicroservice } from '../internal/controllers/toCashMicroservice.js';
import { dashboardToTravelMicroservice } from '../internal/controllers/toTravelMicroservice.js';
import { sendToOtherMicroservice } from '../rabbitmq/publisher.js';
   

/// Validate flight details
const validateFlightDetails = (flightDetails) => {
  return flightDetails && flightDetails.from && flightDetails.to && flightDetails.date && flightDetails.time;
};

// Update line item status based on approvers (approval setup is done while raising travel request)
const updateLineItemStatus = (approvers) => {
  const currentLineItemStatus = approvers && approvers.length > 0 ? 'pending approval' : 'pending booking';
  console.log(`Current line item status: ${currentLineItemStatus}`);
  return currentLineItemStatus;
};

// Save updated dashboard document
const saveInDashboard = async (dashboardDoc) => {
  try {
    return await dashboardDoc.save();
  } catch (error) {
    // Log the error for monitoring purposes
    console.error('Error saving dashboard:', error);
    throw new Error('Internal Server Error');
  }
};


// Helper function to generate specific error responses based on the failed operation
const handleMicroserviceError = (res, errorMessage) => {
  const errorMap = {
    dashboardToTripMicroservice: 'Failed to send data to Trip Microservice',
    dashboardToExpenseMicroservice: 'Failed to send data to Expense Microservice',
    dashboardToApprovalMicroservice: 'Failed to send data to Approval Microservice',
    dashboardToCashMicroservice: 'Failed to send data to Cash Microservice',
    dashboardToTravelMicroservice: 'Failed to send data to Travel Microservice',
  };

  const specificError = Object.entries(errorMap).find(([key]) => errorMessage.includes(key));

  if (specificError) {
    const [, message] = specificError;
    return res.status(500).json({ error: message });
  }

  return res.status(500).json({ error: 'Internal Server Error' });
};

// 1) Add a flight/flights to exiting trip
export const addFlight = async (req, res) => {
  try {
    // Extract parameters from request
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
    const trip = await Dashboard.findOne({
      tenantId,
      tripStatus: { $in: ['transit', 'upcoming'] },
      tripId,
      $or: [
        { 'createdBy.empId': empId},
        { 'createdFor.empId': empId},
      ],
    })

    // Check if trip exists
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or not in transit' });
    }

    if (trip) {
      // Extract necessary data directly from the trip document
    const { itinerary, approvers } = trip;
    const { flights } = itinerary || { flights: [] };

    // Add new flights to the existing flights array
    flightDetails.forEach((newFlight) => {
      const newFlightDetails = {
        itineraryId: new mongoose.Types.ObjectId(),
        ...newFlight,
        status: updateLineItemStatus(approvers), // Using helper function for determining status
       approvers: approvers.map((approver) => ({ empId: approver.empId, name: approver.name })),
      };

      flights.push(newFlightDetails);
    });

    // Update the flights array and tripStatus in the database
    itinerary.flights = flights;
    const updatedTrip = await trip.save()

    //Send data to microservices
    await dashboardToTripMicroservice(updatedTrip);
    await dashboardToExpenseMicroservice(updatedTrip);

    // Check if there are approvers and send to approval microservice accordingly
    if (updatedTrip.approvers && updatedTrip.approvers.length > 0) {
      console.log("Approvers found for this trip:", updatedTrip.approvers);
      await dashboardToApprovalMicroservice(updatedTrip);
    }

    // Check if cash advance is taken and send to the appropriate microservice
    if (updatedTrip.isCashAdvanceTaken) {
      console.log('Is cash advance taken:', updatedTrip.isCashAdvanceTaken);
      await dashboardToCashMicroservice(updatedTrip);
    } else {
      await dashboardToTravelMicroservice(updatedTrip);
    }

    // Respond with success message and the updated trip
    return res.status(200).json({ success: true, message: 'Flights added successfully', trip: updatedTrip });
  
    } 
  } catch (error) {
    // Log the error for monitoring purposes
    console.error(error);
    // Use the helper function to handle error responses based on the failed operation
    return handleMicroserviceError(res, error.message);
  }
};

//  Validate bus details
const validateBusDetails = (busDetails) => {
  return busDetails && busDetails.from && busDetails.to && busDetails.date && busDetails.time;
};

// 2) Add a bus/buses to exiting trip
export const addBus = async (req, res) => {
  try {
    // Extract parameters from request
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
    const trip = await Dashboard.findOne({
      tenantId,
      tripStatus: { $in: ['transit', 'upcoming'] },
      tripId,
      $or: [
        { 'createdBy.empId': empId},
        { 'createdFor.empId': empId},
      ],
    })

    // Check if trip exists
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or not in transit' });
    }

    if(trip){
    // Extract necessary data directly from the trip document
    const { itinerary, approvers } = trip;
    const { buses } = itinerary || { buses: [] };

    // Add new buses to the existing buses array
    busDetails.forEach((newBus) => {
      const newBusDetails = {
        itineraryId: new mongoose.Types.ObjectId(),
        ...newBus,
        status: updateLineItemStatus(approvers), // Use helper function for determining status
        approvers: approvers.map((approver) => ({ empId: approver.empId, name: approver.name })),
      };

      buses.push(newBusDetails);
    });

    // Update the buses array and tripStatus in the database
    itinerary.buses = buses;
    const updatedTrip = await saveInDashboard(trip);

    // Send data to microservices
    await dashboardToTripMicroservice(updatedTrip);
    await dashboardToExpenseMicroservice(updatedTrip);

    // Check if there are approvers and send to approval microservice accordingly
    if (updatedTrip.approvers && updatedTrip.approvers.length > 0) {
      console.log("Approvers found for this trip:", updatedTrip.approvers);
      await dashboardToApprovalMicroservice(updatedTrip);
    }

    // Check if cash advance is taken and send to the appropriate microservice
    if (updatedTrip.isCashAdvanceTaken) {
      console.log('Is cash advance taken:', updatedTrip.isCashAdvanceTaken);
      await dashboardToCashMicroservice(updatedTrip);
    } else {
      await dashboardToTravelMicroservice(updatedTrip);
    }

    // Respond with success message and the updated trip
    return res.status(200).json({ success: true, message: 'Buses added successfully', trip: updatedTrip });
    }

  } catch (error) {
    // Log the error for monitoring purposes
    console.error(error);
    // Use the helper function to handle error responses based on the failed operation
    return handleMicroserviceError(res, error.message);
  }
};


// Validate train details
const validateTrainDetails = (trainDetails) => {
  return trainDetails && trainDetails.from && trainDetails.to && trainDetails.date && trainDetails.time;
};

// 3) Add a train/trains details via dashboard
export const addTrain = async (req, res) => {
  try {
    // Extract parameters from request
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
    const trip = await Dashboard.findOne({
      tenantId,
      tripStatus: { $in: ['transit', 'upcoming'] },
      tripId,
      $or: [
        { 'createdBy.empId': empId},
        { 'createdFor.empId': empId},
      ],
    })

    // Check if trip exists
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or not in transit' });
    }

    if(trip){
          // Extract necessary data directly from the trip document
    const { itinerary, approvers } = trip;
    const { trains } = itinerary || { trains: [] };

    // Add new trains to the existing trains array
    trainDetails.forEach((newTrain) => {
      const newTrainDetails = {
        itineraryId: new mongoose.Types.ObjectId(),
        ...newTrain,
        status: updateLineItemStatus(approvers), // Use helper function for determining status
        approvers: approvers.map((approver) => ({ empId: approver.empId, name: approver.name })),
      };

      trains.push(newTrainDetails);
    });

    // Update the trains array and tripStatus in the database
    itinerary.trains = trains;
    const updatedTrip = await trip.save()

    // Send data to microservices
    await dashboardToTripMicroservice(updatedTrip);
    await dashboardToExpenseMicroservice(updatedTrip);

    // Check if there are approvers and send to approval microservice accordingly
    if (updatedTrip.approvers && updatedTrip.approvers.length > 0) {
      console.log("Approvers found for this trip:", updatedTrip.approvers);
      await dashboardToApprovalMicroservice(updatedTrip);
    }

    // Check if cash advance is taken and send to the appropriate microservice
    if (updatedTrip.isCashAdvanceTaken) {
      console.log('Is cash advance taken:', updatedTrip.isCashAdvanceTaken);
      await dashboardToCashMicroservice(updatedTrip);
    } else {
      await dashboardToTravelMicroservice(updatedTrip);
    }

    // Respond with success message and the updated trip
    return res.status(200).json({ success: true, message: 'Trains added successfully', trip: updatedTrip });
    }


  } catch (error) {
    // Log the error for monitoring purposes
    console.error(error);
    // Use the helper function to handle error responses based on the failed operation
    return handleMicroserviceError(res, error.message);
  }
};


// Validate cab details
const validateCabDetails = (cabDetails) => {
  return cabDetails && cabDetails.from && cabDetails.to && cabDetails.date && cabDetails.time;
};

// 4) add cabs to existing trip via dashboard- overview
export const addCab = async (req, res) => {
  try {
    // Extract parameters from request
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
    const trip = await Dashboard.findOne({
      tenantId,
      tripStatus: { $in: ['transit', 'upcoming'] },
      tripId,
      $or: [
        { 'createdBy.empId': empId},
        { 'createdFor.empId': empId},
      ],
    })

    // Check if trip exists
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or not in transit' });
    }

    if(trip){
          // Extract necessary data directly from the trip document
    const { itinerary, approvers } = trip;
    const { cabs } = itinerary || { cabs: [] }; // Replace 'trains' with 'cabs'

    // Add new cabs to the existing cabs array
    cabDetails.forEach((newCab) => {
      const newCabDetails = {
        itineraryId: new mongoose.Types.ObjectId(),
        ...newCab,
        status: updateLineItemStatus(approvers), // Use helper function for determining status
        approvers: approvers.map((approver) => ({ empId: approver.empId, name: approver.name })),
      };

      cabs.push(newCabDetails); // Replace 'flights' with 'cabs'
    });

    // Update the cabs array and tripStatus
    itinerary.cabs = cabs; 
    const updatedTrip = await trip.save()

    // Send data to microservices
    await dashboardToTripMicroservice(updatedTrip);
    await dashboardToExpenseMicroservice(updatedTrip);

    // Check if there are approvers and send to approval microservice accordingly
    if (updatedTrip.approvers && updatedTrip.approvers.length > 0) {
      console.log("Approvers found for this trip:", updatedTrip.approvers);
      await dashboardToApprovalMicroservice(updatedTrip);
    }

    // Check if cash advance is taken and send to the appropriate microservice
    if (updatedTrip.isCashAdvanceTaken) {
      console.log('Is cash advance taken:', updatedTrip.isCashAdvanceTaken);
      await dashboardToCashMicroservice(updatedTrip);
    } else {
      await dashboardToTravelMicroservice(updatedTrip);
    }

    // Respond with success message and the updated trip
    return res.status(200).json({ success: true, message: 'Cabs added successfully', trip: updatedTrip });
    }


  } catch (error) {
    // Log the error for monitoring purposes
    console.error(error);
    // Use the helper function to handle error responses based on the failed operation
    return handleMicroserviceError(res, error.message);
  }
};


// Validate hotel details
const validateHotelDetails = (hotelDetails) => {
  return hotelDetails && hotelDetails.hotelName && hotelDetails.checkIn && hotelDetails.checkOut;
};


// 5) Add hotel details via dashboard
export const addHotels = async (req, res) => {
  try {
    const { tenantId, tripId, empId } = req.params;
    const { hotelDetails } = req.body;

    if (!tripId || !tenantId || !empId) {
      return res.status(400).json({ error: 'Invalid input, please provide valid tripId, tenantId, empId' });
    }

    if (!hotelDetails || !Array.isArray(hotelDetails) || hotelDetails.length === 0) {
      return res.status(400).json({ error: 'Invalid hotel details, please provide an array of hotel details' });
    }

    const filter = {
      tenantId,
      tripStatus: { $in: ['transit', 'upcoming'] },
      tripId,
      $or: [
        { 'createdBy.empId': empId },
        { 'createdFor.empId': empId },
      ],
    };

    const update = {
      $set: {
        'tripSchema.travelRequestData.isAddALeg': true,
      },
      $push: {
        'tripSchema.travelRequestData.itinerary.hotels': { $each: hotelDetails.map((newHotel) => ({
          itineraryId: new mongoose.Types.ObjectId(),
          ...newHotel,
          status: updateLineItemStatus(newHotel.approvers),
          approvers: newHotel.approvers.map((approver) => ({ empId: approver.empId, name: approver.name })),
        }))},
      },
    };

    const options = { new: true }; // To return the updated document

    const updatedTrip = await Dashboard.findOneAndUpdate(filter, update, options);

    if (updatedTrip) {
      const { tripSchema } = updatedTrip;
      const { travelRequestData } = tripSchema;

      const { approvers = [], travelRequestId, isCashAdvanceTaken } = travelRequestData;

      const dataToSend = {
        tenantId,
        travelRequestId,
        isCashAdvanceTaken: isCashAdvanceTaken || false,
        isAddALeg: true,
        newHotelDetails: hotelDetails,
      };

      await sendToOtherMicroservice(dataToSend, 'isAddALeg', 'trip', 'to update itinerary added to travelRequestData for trips');
      await sendToOtherMicroservice(dataToSend, 'isAddALeg', 'expense', 'to update itinerary added to travelRequestData for trips');

      if (approvers.length > 0) {
        console.log("Approvers found for this trip:", approvers);
        await sendToOtherMicroservice(dataToSend, 'isAddALeg', 'approval', 'to update itinerary added to travelRequestData for trips');
      }

      if (isCashAdvanceTaken) {
        console.log('Is cash advance taken:', isCashAdvanceTaken);
        await sendToOtherMicroservice(dataToSend, 'isAddALeg', 'cash', 'to update itinerary added to travelRequestData for trips');
      } else {
        await sendToOtherMicroservice(dataToSend, 'isAddALeg', 'travel', 'to update itinerary added to travelRequestData for trips');
      }

      return res.status(200).json({ success: true, message: 'Hotels added successfully' });
    }

    return res.status(404).json({ error: 'Trip not found or not in transit' });
  } catch (error) {
    console.error(error);
    return handleMicroserviceError(res, error.message);
  }
};

// method 2
export const addHotel = async (req, res) => {
  try {
    const { tenantId, tripId, empId } = req.params;
    const { hotelDetails } = req.body;

    if (!tripId || !tenantId || !empId) {
      return res.status(400).json({ error: 'Invalid input, please provide valid tripId, tenantId, empId' });
    }

    if (!hotelDetails || !Array.isArray(hotelDetails) || hotelDetails.length === 0) {
      return res.status(400).json({ error: 'Invalid hotel details, please provide an array of hotel details' });
    }

    const trip = await Dashboard.findOne({
      tenantId,
      tripStatus: { $in: ['transit', 'upcoming'] },
      tripId,
      $or: [
        { 'createdBy.empId': empId},
        { 'createdFor.empId': empId},
      ],
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or not in transit' });
    }

    if (trip) {
      const { itinerary, approvers } = trip.tripSchema.travelRequestData;
      const { hotels } = itinerary || { hotels: [] };

      const payload = [];
      const { travelRequestId, isCashAdvanceTaken } = trip.tripSchema.travelRequestData;
      const isAddALeg = true; // Update isAddALeg to true

      payload.push({ travelRequestId });

      //add formId before sending to travel/cash
      hotelDetails.forEach((newHotel) => {
        const itineraryDetails = {
          itineraryId: new mongoose.Types.ObjectId(),
          ...newHotel,
          status: updateLineItemStatus(approvers),
          approvers: approvers.map((approver) => ({ empId: approver.empId, name: approver.name })),
        };

        hotels.push(itineraryDetails);
        payload.push(itineraryDetails);
      });

      itinerary.hotels = hotels;
      const updatedTrip = await trip.save();

      const dataToSend = {
        tenantId,
        ...payload,
        itineraryType: 'hotels',
        itineraryDetails: payload.slice(2),
        isAddALeg: true, // Include isAddALeg as true in dataToSend
      };

      await sendToOtherMicroservice(dataToSend);

      if (approvers && approvers?.length > 0) {
        console.log("Approvers found for this trip:", approvers);
        await sendToOtherMicroservice(dataToSend, 'add-leg', 'approval', 'to update itinerary added to travelRequestData for trips');
      }

      if (isCashAdvanceTaken) {
        console.log('Is cash advance taken:', isCashAdvanceTaken);
        await sendToOtherMicroservice(dataToSend, 'add-leg', 'cash', 'to update itinerary added to travelRequestData for trips');
      } else {
        await sendToOtherMicroservice(dataToSend, 'add-leg', 'travel', 'to update itinerary added to travelRequestData for trips');
      }

      return res.status(200).json({ success: true, message: 'Hotels added successfully', trip: updatedTrip });
    }
  } catch (error) {
    console.error(error);
    return handleMicroserviceError(res, error.message);
  }
};





