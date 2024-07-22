import mongoose from 'mongoose';
import { sendToOtherMicroservice } from '../rabbitmq/publisher.js';
import Trip from '../models/tripSchema.js';
import Joi from 'joi';


// Update line item status based on approvers (approval setup is done while raising travel request)
// IMPORTANT- Status will always be 'pending booking'. 
const updateLineItemStatus = (approvers) => {
  const currentLineItemStatus = approvers && approvers.length > 0 ? 'pending booking' : 'pending booking';
  console.log(`Current line item status: ${currentLineItemStatus}`);
  return currentLineItemStatus;
};


async function getTrip(tenantId,empId,tripId){
    try{
      
        const getTripDetails =  await Trip.findOne({
            tenantId,
            "tripStatus": { $in: ['transit', 'upcoming'] },
            "tripId": tripId,
            $or: [
              { 'travelRequestData.createdBy.empId': empId},
              { 'travelRequestData.createdFor.empId': empId},
            ],
          });

          if(getTripDetails){
            return getTripDetails
          }
    } catch (error){
        console.log(error)
    }
}

export const addALeg = async (tenantId, empId, tripId, itinerary) => {
    try {
     
      if (!itinerary || typeof itinerary !== 'object') {
        throw new Error ({ error: 'Itinerary object is required in the request body.' });
      }

      const trip = await getTrip(tenantId,empId,tripId)

      if (!trip) {
        return ({ error: 'Trip not found or not in transit' });
      }
  
      const itineraryItems = [
        { key: 'flights', handler: addFlight },
        { key: 'hotels', handler: addHotel },
        { key: 'cabs', handler: addCab },
        { key: 'trains', handler: addTrain },
        { key: 'buses', handler: addBus },
      ];
  
      const promises = itineraryItems
        .filter(item => Array.isArray(itinerary[item.key]) && itinerary[item.key].length > 0)
        .map(item => item.handler(tenantId, empId, tripId, itinerary[item.key], trip));
  
      if (promises.length === 0) {
        return res.status(400).json({ error: 'No valid itinerary items provided.' });
      }
  
     const modifyTrip = await Promise.all(promises);
      return({ success:true, message: 'All itinerary items processed successfully.',modifyTrip });
    } catch (error) {
      console.error(error);
      throw error({ error: 'An error occurred while processing itinerary items.' });
    }
  };

// 1) Add a flight/flights to exiting trip
export async function addFlight( tenantId, tripId, empId, flights, trip){
  try {
      let payload = [];
      let itineraryDetails;

      let { travelRequestId, isCashAdvanceTaken, itinerary, approvers, isAddALeg } = trip.travelRequestData;
      const { flights } = itinerary || { flights: [] };
    
      let isAddALegFlag = true;
      trip.travelRequestData.isAddALeg = isAddALegFlag;
    
      payload.push({ travelRequestId });
    
      flights.forEach((newFlight) => {
         itineraryDetails = {
          itineraryId: new mongoose.Types.ObjectId(),
          formId: new mongoose.Types.ObjectId().toString(),
          ...initializeFields(), // Initialize all fields to null
          ...newFlight,
          status: updateLineItemStatus(approvers),
          approvers: approvers.map((approver) => ({ empId: approver.empId, name: approver.name, status: "pending approval" })),
        };
        console.log("flight",itineraryDetails)
    
        flights.push(itineraryDetails);
        payload.push(itineraryDetails);
      });

      trip.travelRequestData.itinerary.flights = flights;
       console.log("the payload ....", itineraryDetails)
      const updatedTrip = await trip.save();
      
      if (!updatedTrip) {
        return res.status(500).json({ error: 'Failed to save trip' });
      } else {

        console.log("the itinerary ..........", itineraryDetails)
        const flightsArray = updatedTrip.travelRequestData.itinerary.flights;
        const flightsAdded = flightsArray.length > 0 ? flightsArray[flightsArray.length-1] : 0;

        console.log("retrieving from flights array", flightsAdded)

        const dataToSend = {
          tenantId,
          travelRequestId,
          itineraryDetails: flightsAdded,
          itineraryType: 'flights',
          isAddALeg: true, // Include isAddALeg as true in dataToSend
        };
        
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
      }

      return ({ success: true, message: 'flights added successfully', trip: updatedTrip });
  } catch (error) {
    return ({success:false , message: "Failed to add flights ", error})
  }
}


// 2) Add a bus/buses to exiting trip
export async function addBus( tenantId, tripId, empId, buses, trip){
  try {
      let payload = [];
      let { travelRequestId, isCashAdvanceTaken, itinerary, approvers, isAddALeg } = trip.travelRequestData;
      const { buses } = itinerary || { buses: [] };
    
      let isAddALegFlag = true;
      trip.tripSchema.travelRequestData.isAddALeg = isAddALegFlag;
    
      payload.push({ travelRequestId });

      // add formId before sending to travel/cash
      busDetails.forEach((newBus) => {
        const itineraryDetails = {
          itineraryId: new mongoose.Types.ObjectId(),
          formId: new mongoose.Types.ObjectId().toString(),
          ...initializeFields(), // Initialize all fields to null
          ...newBus,
          status: updateLineItemStatus(approvers),
          approvers: approvers.map((approver) => ({ empId: approver.empId, name: approver.name, status: "pending approval" })),
        };
        console.log("bus",itineraryDetails)
    
        buses.push(itineraryDetails);
        payload.push(itineraryDetails);
      });

      trip.tripSchema.travelRequestData.itinerary.buses = buses;

      const updatedTrip = await trip.save();
      
      if (!updatedTrip) {
        return res.status(500).json({ error: 'Failed to save trip' });
      } else {
        console.log("after saving hotel", updatedTrip.tripSchema.travelRequestData.itinerary.buses.length-1)
        const busesArray = updatedTrip.tripSchema.travelRequestData.itinerary.buses;
        const busesAdded = busesArray.length > 0 ? busesArray[busesArray.length-1] : 0;

        const dataToSend = {
          tenantId,
          travelRequestId,
          itineraryDetails: busesAdded,
          itineraryType: 'buses',
          isAddALeg: true, // Include isAddALeg as true in dataToSend
        };
        
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
        
      }

      return ({ success: true, message: 'Buses added successfully', trip: updatedTrip });

  } catch (error) {
    return ({success:false , message: "Failed to add Buses ", error})
  }
}

// 3) Add a train/trains details via dashboard
export async function addTrain( tenantId, tripId, empId, trains, trip){
  try {
        let payload = [];
      let { travelRequestId, isCashAdvanceTaken, itinerary, approvers, isAddALeg } = trip.tripSchema.travelRequestData;
      const { trains } = itinerary || { trains: [] };
    
      let isAddALegFlag = true;
      trip.tripSchema.travelRequestData.isAddALeg = isAddALegFlag;
    
      payload.push({ travelRequestId });

      // add formId before sending to travel/cash
      trainDetails.forEach((newTrain) => {
        const itineraryDetails = {
          itineraryId: new mongoose.Types.ObjectId(),
          formId: new mongoose.Types.ObjectId().toString(),
          ...initializeFields(), // Initialize all fields to null
          ...newTrain,
          status: updateLineItemStatus(approvers),
          approvers: approvers.map((approver) => ({ empId: approver.empId, name: approver.name, status: "pending approval" })),
        };
        console.log("Train",itineraryDetails)
    
        trains.push(itineraryDetails);
        payload.push(itineraryDetails);
      });

      trip.tripSchema.travelRequestData.itinerary.trains = trains;

      const updatedTrip = await trip.save();
      
      if (!updatedTrip) {
        return res.status(500).json({ error: 'Failed to save trip' });
      } else {
        console.log("after saving Train", updatedTrip.tripSchema.travelRequestData.itinerary.trains.length-1)
        const trainsArray = updatedTrip.tripSchema.travelRequestData.itinerary.trains;
        const trainsAdded = trainsArray.length > 0 ? trainsArray[trainsArray.length-1] : 0;

        const dataToSend = {
          tenantId,
          travelRequestId,
          itineraryDetails: trainsAdded,
          itineraryType: 'trains',
          isAddALeg: true, // Include isAddALeg as true in dataToSend
        };
        
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
        
      }

      return ({ success: true, message: 'train added successfully', trip: updatedTrip });

  } catch (error) {
    return ({success:false , message: "Failed to add trains ", error})
  }
}


// 4) add cabs to existing trip via dashboard- overview
export async function addCab(tenantId, tripId, empId, cabs, trip){
  try {
      let payload = [];
      let { travelRequestId, isCashAdvanceTaken, itinerary, approvers, isAddALeg } = trip.tripSchema.travelRequestData;
      const { cabs } = itinerary || { cabs: [] };
    
      let isAddALegFlag = true;
      trip.tripSchema.travelRequestData.isAddALeg = isAddALegFlag;
    
      payload.push({ travelRequestId });

      // add formId before sending to travel/cash
      cabDetails.forEach((newCab) => {
        const itineraryDetails = {
          itineraryId: new mongoose.Types.ObjectId(),
          formId: new mongoose.Types.ObjectId().toString(),
          ...initializeCabFields(), // Initialize all fields to null
          ...newCab,
          status: updateLineItemStatus(approvers),
          approvers: approvers.map((approver) => ({ empId: approver.empId, name: approver.name, status: "pending approval" })),
        };
        console.log("cabs",itineraryDetails)
    
        cabs.push(itineraryDetails);
        payload.push(itineraryDetails);
      });

      trip.tripSchema.travelRequestData.itinerary.cabs = cabs;

      const updatedTrip = await trip.save();
      
      if (!updatedTrip) {
        return res.status(500).json({ error: 'Failed to save trip' });
      } else {
        console.log("after saving hotel", updatedTrip.tripSchema.travelRequestData.itinerary.cabs.length-1)
        const cabsArray = updatedTrip.tripSchema.travelRequestData.itinerary.cabs;
        const cabsAdded = cabsArray.length > 0 ? cabsArray[cabsArray.length-1] : 0;

        const dataToSend = {
          tenantId,
          travelRequestId,
          itineraryDetails: cabsAdded,
          itineraryType: 'cabs',
          isAddALeg: true, // Include isAddALeg as true in dataToSend
        };

        
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
        
      }

      return ({ success: true, message: 'cabs added successfully', trip: updatedTrip });

  } catch (error) {
    return ({success:false , message: "Failed to add cabs ", error})
  }
}

// Validate hotel details
const validateHotelDetails = (hotelDetails) => {
  return hotelDetails && hotelDetails.hotelName && hotelDetails.checkIn && hotelDetails.checkOut;
};


// 5) Add hotel details via dashboard
export async function addHotel(tenantId, tripId, empId, hotels, trip){
  try {
     let payload = [];
      let { travelRequestId, isCashAdvanceTaken, itinerary, approvers, isAddALeg } = trip.tripSchema.travelRequestData;
      const { hotels } = itinerary || { hotels: [] };
    
      let isAddALegFlag = true;
      trip.tripSchema.travelRequestData.isAddALeg = isAddALegFlag;
    
      payload.push({ travelRequestId });

      // add formId before sending to travel/cash
      hotelDetails.forEach((newHotel) => {
        const itineraryDetails = {
          itineraryId: new mongoose.Types.ObjectId(),
          formId: new mongoose.Types.ObjectId().toString(),
          ...initializeHotelFields(), // Initialize all fields to null
          ...newHotel,
          status: updateLineItemStatus(approvers),
          approvers: approvers.map((approver) => ({ empId: approver.empId, name: approver.name, status: "pending approval" })),
        };
        console.log("hotel",itineraryDetails)
    
        hotels.push(itineraryDetails);
        payload.push(itineraryDetails);
      });

      trip.tripSchema.travelRequestData.itinerary.hotels = hotels;

      const updatedTrip = await trip.save();
      
      if (!updatedTrip) {
        return res.status(500).json({ error: 'Failed to save trip' });
      } else {
        console.log("after saving hotel", updatedTrip.tripSchema.travelRequestData.itinerary.hotels.length-1)
        const hotelsArray = updatedTrip.tripSchema.travelRequestData.itinerary.hotels;
        const hotelAdded = hotelsArray.length > 0 ? hotelsArray[hotelsArray.length-1] : 0;

        const dataToSend = {
          tenantId,
          travelRequestId,
          itineraryDetails: hotelAdded,
          itineraryType: 'hotels',
          isAddALeg: true, // Include isAddALeg as true in dataToSend
        };

        console.log("data to send", dataToSend.hotel)
        
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
        
      }

      return ({ success: true, message: 'Hotels added successfully', trip: updatedTrip });

  } catch (error) {
    return ({success:false , message: "Failed to add Hotel ", error})
  }
}

const initializeHotelFields = () => ({
  location: null,
  locationPreference: null,
  class: null,
  checkIn: null,
  checkOut: null,
  checkInTime: null,
  checkOutTime: null,
  violations: {
    class: null,
    amount: null,
  },
  bkd_location: null,
  bkd_locationPreference: null,
  bkd_class: null,
  bkd_checkIn: null,
  bkd_checkOut: null,
  bkd_checkInTime: null,
  bkd_checkOutTime: null,
  bkd_violations: {
    class: null,
    amount: null,
  },
  modified: null,
  cancellationDate: null,
  cancellationReason: null,
  rejectionReason: null,
  status: {
    type: null,
  },
  approvers: [{
    empId: null,
    name: null,
    status: "pending approval", 
  }],
  bookingDetails: {
    docURL: null,
    docType: null,
    billDetails: {
      vendorName: null,
      totalAmount: null,
      taxAmount: null,
    },
  },
});

const initializeCabFields = () => ({
  itineraryId: new mongoose.Types.ObjectId(),
  formId: new mongoose.Types.ObjectId().toString(),
  date: null,
  class: null,
  preferredTime: null,
  pickupAddress: null,
  dropAddress: null,
  isReturnTravel: null,
  violations: {
    class: null,
    amount: null,
  },
  bkd_date: null,
  bkd_class: null,
  bkd_preferredTime: null,
  bkd_pickupAddress: null,
  bkd_dropAddress: null,
  bkd_isReturnTravel: null,
  bkd_violations: {
    class: null,
    amount: null,
  },
  modified: null,
  cancellationDate: null,
  cancellationReason: null,
  rejectionReason: null,
  status: null,
  approvers: [{
    empId: null,
    name: null,
    status: "pending approval", 
  }],
  bookingDetails: {
    docURL: null,
    docType: null,
    billDetails: {
      vendorName: null,
      totalAmount: null,
      taxAmount: null,
    },
  },
  type: null,
});


const initializeFields = () => ({
  itineraryId: new mongoose.Types.ObjectId(),
  formId: new mongoose.Types.ObjectId().toString(),
  from: null,
  to: null,
  date: null,
  time: null,
  travelClass: null,
  isReturnTravel: null,
  violations: {
    class: null,
    amount: null,
  },
  bkd_from: null,
  bkd_to: null,
  bkd_date: null,
  bkd_time: null,
  bkd_travelClass: null,
  bkd_isReturnTravel: null,
  bkd_violations: {
    class: null,
    amount: null,
  },
  modified: null,
  cancellationDate: null,
  cancellationReason: null,
  rejectionReason: null,
  status: null,
  approvers: [{
    empId: null,
    name: null,
    status: "pending approval", 
  }],
  bookingDetails: {
    docURL: null,
    docType: null,
    billDetails: {
      vendorName: null,
      totalAmount: null,
      taxAmount: null,
    },
  },
});









