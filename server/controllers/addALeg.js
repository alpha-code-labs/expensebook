import mongoose from 'mongoose';
import { sendToOtherMicroservice } from '../rabbitmq/publisher.js';
import Trip from '../models/tripSchema.js';
import Joi from 'joi';


// Update line item status based on approvers (approval setup is done while raising travel request)
// IMPORTANT- Status will always be 'pending booking'. 
const updateLineItemStatus = (tripStatus) => {
const isTransit = Boolean(tripStatus === 'transit')
  const currentLineItemStatus = isTransit ? 'pending booking' : 'pending approval';
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

export const addALeg = async (trip, newItinerary,allocations) => {
    try {
        console.log("addALeg","trip",trip, newItinerary, "newItinerary","allocations",allocations  )
       const sendNote = 'this is ongoing trip and not approved'
      if (!newItinerary || typeof newItinerary !== 'object') {
        throw new Error ('Itinerary object is required in the request body.' );
      }

      if (!trip) {
        throw new Error('Trip not found or not in transit');
      }

      const { tripStatus} = trip

      if(allocations?.length){
        trip.travelRequestData.travelAllocationHeaders = allocations
      }

      const statusMap = {
        'upcoming': 'pending approval',
        'transit': 'approved'
      }

      const newApproverStatus = statusMap[tripStatus] ? statusMap[tripStatus] : ''
      const note = newApproverStatus==='approved' ? sendNote : ''
      const addNote = {
        "note": note,
      }

      console.log("newApproverStatus", newApproverStatus, "note", note)

      const itineraryItems = [
        { key: 'newFlights', handler: addFlight },
        { key: 'newHotels', handler: addHotel },
        { key: 'newCabs', handler: addCab },
        { key: 'newTrains', handler: addTrain },
        { key: 'newBuses', handler: addBus },
        { key: 'newCarRentals', handler: addCarRentals},
        { key: 'newPersonalVehicles', handler: addPersonalVehicles}
      ];

      const promises = itineraryItems
        .filter(item => Array.isArray(newItinerary[item.key]) && newItinerary[item.key].length > 0)
        .map(item => item.handler( trip,newItinerary[item.key],newApproverStatus,addNote));
  
      if (promises.length === 0) {
        throw new Error( 'No valid itinerary items provided.');
      }

     const modifyTrip = await Promise.all(promises);
      return({ success:true, message: 'All itinerary items processed successfully.',modifyTrip });
    } catch (error) {
      console.error(error);
      throw new error('An error occurred while processing itinerary items.', error);
    }
};

// 1) Add a flight/flights to exiting trip
export async function addFlight(trip, newFlights, newApproverStatus,addNote){
try {
  console.group('flight added')
      let payload = [];
      let itineraryDetails;

      const { tripStatus} = trip
      let {tenantId, travelRequestId, isCashAdvanceTaken, itinerary, approvers, isAddALeg } = trip.travelRequestData;
      const { flights } = itinerary || { flights: [] };


      let isAddALegFlag = true;
      trip.travelRequestData.isAddALeg = isAddALegFlag;

      payload.push({ travelRequestId });
    
      newFlights.forEach((newFlight) => {
         itineraryDetails = {
          ...initializeFields(),
          ...addNote,
          ...newFlight,
          formId: new mongoose.Types.ObjectId().toString(),
          itineraryId: new mongoose.Types.ObjectId(),
          status: updateLineItemStatus(tripStatus),
          approvers: approvers?.map((approver) => ({ empId: approver.empId, name: approver.name, status: newApproverStatus })),
        };
        console.log("added flight",itineraryDetails)
    
        flights.push(itineraryDetails);
        payload.push(itineraryDetails);
      });

      trip.travelRequestData.itinerary.flights = flights;
       console.log("the payload ....", itineraryDetails)
       console.groupCollapsed()
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
        
        console.log("dataToSend",dataToSend)
        // if (approvers && approvers?.length > 0 && !isTransit) {
        //   console.log("Approvers found for this trip:", approvers);
        //   await sendToOtherMicroservice(dataToSend, 'add-leg', 'approval', 'to update itinerary added to travelRequestData for trips');
        //   await sendToOtherMicroservice(dataToSend, 'add-leg', 'dashboard', 'to update itinerary added to travelRequestData for trips');
        // }
        
        // if (isCashAdvanceTaken) {
        //   console.log('Is cash advance taken:', isCashAdvanceTaken);
        //   await sendToOtherMicroservice(dataToSend, 'add-leg', 'cash', 'to update itinerary added to travelRequestData for trips');
        // } else {
        //   await sendToOtherMicroservice(dataToSend, 'add-leg', 'travel', 'to update itinerary added to travelRequestData for trips');
        // } 
    }

    return ({ success: true, message: 'flights added successfully', dataToSend });
} catch (error) {
    return ({success:false , message: "Failed to add flights ", error:error.message})
}
}


// 2) Add a bus/buses to exiting trip
export async function addBus( trip,newBuses,newApproverStatus,addNote){
  try {
      let payload = [];
      let {tenantId, travelRequestId, isCashAdvanceTaken, itinerary, approvers, isAddALeg } = trip.travelRequestData;
      const { buses } = itinerary || { buses: [] };
    
      let isAddALegFlag = true;
      trip.travelRequestData.isAddALeg = isAddALegFlag;
    
      payload.push({ travelRequestId });

      // add formId before sending to travel/cash
      newBuses.forEach((newBus) => {
        const itineraryDetails = {
          ...initializeFields(), 
          ...addNote,
          ...newBus,
          itineraryId: new mongoose.Types.ObjectId(),
          formId: new mongoose.Types.ObjectId().toString(),
          status: updateLineItemStatus(approvers),
          approvers: approvers.map((approver) => ({ empId: approver.empId, name: approver.name, status: newApproverStatus })),
        };
        console.log("bus",itineraryDetails)
    
        buses.push(itineraryDetails);
        payload.push(itineraryDetails);
      });

      trip.travelRequestData.itinerary.buses = buses;

      const updatedTrip = await trip.save();
      
      if (!updatedTrip) {
        return res.status(500).json({ error: 'Failed to save trip' });
      } else {
        console.log("after saving hotel", updatedTrip.travelRequestData.itinerary.buses.length-1)
        const busesArray = updatedTrip.travelRequestData.itinerary.buses;
        const busesAdded = busesArray.length > 0 ? busesArray[busesArray.length-1] : 0;

        const dataToSend = {
          tenantId,
          travelRequestId,
          itineraryDetails: busesAdded,
          itineraryType: 'buses',
          isAddALeg: true, // Include isAddALeg as true in dataToSend
        };
        
        console.log("dataToSend",dataToSend)
        // if (approvers && approvers?.length > 0) {
        //   console.log("Approvers found for this trip:", approvers);
        //   await sendToOtherMicroservice(dataToSend, 'add-leg', 'approval', 'to update itinerary added to travelRequestData for trips');
        // }
        
        // if (isCashAdvanceTaken) {
        //   console.log('Is cash advance taken:', isCashAdvanceTaken);
        //   await sendToOtherMicroservice(dataToSend, 'add-leg', 'cash', 'to update itinerary added to travelRequestData for trips');
        // } else {
        //   await sendToOtherMicroservice(dataToSend, 'add-leg', 'travel', 'to update itinerary added to travelRequestData for trips');
        // }
      }

      return ({ success: true, message: 'Buses added successfully', trip: updatedTrip });

  } catch (error) {
    return ({success:false , message: "Failed to add Buses ", error})
  }
}

// 3) Add a train/trains details via dashboard
export async function addTrain( trip,newTrains,newApproverStatus,addNote){
  try {
        let payload = [];
      let {tenantId, travelRequestId, isCashAdvanceTaken, itinerary, approvers, isAddALeg } = trip.travelRequestData;
      const { trains } = itinerary || { trains: [] };
    
      let isAddALegFlag = true;
      trip.travelRequestData.isAddALeg = isAddALegFlag;
    
      payload.push({ travelRequestId });

      // add formId before sending to travel/cash
      newTrains.forEach((newTrain) => {
        const itineraryDetails = {
          ...initializeFields(), 
          ...addNote,
          ...newTrain,
          itineraryId: new mongoose.Types.ObjectId(),
          formId: new mongoose.Types.ObjectId().toString(),
          status: updateLineItemStatus(approvers),
          approvers: approvers.map((approver) => ({ empId: approver.empId, name: approver.name, status: newApproverStatus })),
        };
        console.log("Train",itineraryDetails)
    
        trains.push(itineraryDetails);
        payload.push(itineraryDetails);
      });

      trip.travelRequestData.itinerary.trains = trains;

      const updatedTrip = await trip.save();
      
      if (!updatedTrip) {
        return res.status(500).json({ error: 'Failed to save trip' });
      } else {
        console.log("after saving Train", updatedTrip.travelRequestData.itinerary.trains.length-1)
        const trainsArray = updatedTrip.travelRequestData.itinerary.trains;
        const trainsAdded = trainsArray.length > 0 ? trainsArray[trainsArray.length-1] : 0;

        const dataToSend = {
          tenantId,
          travelRequestId,
          itineraryDetails: trainsAdded,
          itineraryType: 'trains',
          isAddALeg: true, // Include isAddALeg as true in dataToSend
        };
        
        // if (approvers && approvers?.length > 0) {
        //   console.log("Approvers found for this trip:", approvers);
        //   await sendToOtherMicroservice(dataToSend, 'add-leg', 'approval', 'to update itinerary added to travelRequestData for trips');
        // }
        
        // if (isCashAdvanceTaken) {
        //   console.log('Is cash advance taken:', isCashAdvanceTaken);
        //   await sendToOtherMicroservice(dataToSend, 'add-leg', 'cash', 'to update itinerary added to travelRequestData for trips');
        // } else {
        //   await sendToOtherMicroservice(dataToSend, 'add-leg', 'travel', 'to update itinerary added to travelRequestData for trips');
        // }
        
      }

      return ({ success: true, message: 'train added successfully', trip: updatedTrip });

  } catch (error) {
    return ({success:false , message: "Failed to add trains ", error})
  }
}


// 4) add cabs to existing trip via dashboard- overview
export async function addCab(trip,newCabs,newApproverStatus,addNote){
  try {
      let payload = [];
      const {tripStatus} = trip
      let {tenantId, travelRequestId, isCashAdvanceTaken, itinerary, approvers, isAddALeg } = trip.travelRequestData;
      const { cabs } = itinerary || { cabs: [] };
    
      let isAddALegFlag = true;
      trip.travelRequestData.isAddALeg = isAddALegFlag;
    
      payload.push({ travelRequestId });

      // add formId before sending to travel/cash
      newCabs.forEach((newCab) => {
        const itineraryDetails = {
          ...initializeCabFields(), 
          ...addNote,
          ...newCab,
          itineraryId: new mongoose.Types.ObjectId(),
          formId: new mongoose.Types.ObjectId().toString(),
          status: updateLineItemStatus(tripStatus),
          approvers: approvers.map((approver) => ({ empId: approver.empId, name: approver.name, status: newApproverStatus })),
        };
        console.log("cabs added itineraryDetails",itineraryDetails)
    
        cabs.push(itineraryDetails);
        payload.push(itineraryDetails);
      });

      trip.travelRequestData.itinerary.cabs = cabs;
        console.log("cabs sokka", cabs)
      const updatedTrip = await trip.save();
      console.log("isUpdatedTrip aang",updatedTrip)
      
      if (!updatedTrip) {
        console.log('Failed to save trip' ,updatedTrip)
        return res.status(500).json({ error: 'Failed to save trip' });
      } else {
        console.log("after saving cabs", updatedTrip.travelRequestData.itinerary.cabs.length-1)
        const cabsArray = updatedTrip.travelRequestData.itinerary.cabs;
        const cabsAdded = cabsArray.length > 0 ? cabsArray[cabsArray.length-1] : 0;

        const dataToSend = {
          tenantId,
          travelRequestId,
          itineraryDetails: cabsAdded,
          itineraryType: 'cabs',
          isAddALeg: true, // Include isAddALeg as true in dataToSend
        };

         console.log("dataToSend",dataToSend)
        // if (approvers && approvers?.length > 0) {
        //   console.log("Approvers found for this trip:", approvers);
        //   await sendToOtherMicroservice(dataToSend, 'add-leg', 'approval', 'to update itinerary added to travelRequestData for trips');
        // }
        
        // if (isCashAdvanceTaken) {
        //   console.log('Is cash advance taken:', isCashAdvanceTaken);
        //   await sendToOtherMicroservice(dataToSend, 'add-leg', 'cash', 'to update itinerary added to travelRequestData for trips');
        // } else {
        //   await sendToOtherMicroservice(dataToSend, 'add-leg', 'travel', 'to update itinerary added to travelRequestData for trips');
        // }
        
      }

      return ({ success: true, message: 'cabs added successfully', trip: updatedTrip });

  } catch (error) {
    console.log(JSON.stringify(error, '', 2))
    return ({success:false , message: "Failed to add cabs ", error})
  }
}


export async function addCarRentals(trip,newCarRentals,newApproverStatus,addNote){
    try {
        let payload = [];
        const {tripStatus} = trip
        let { travelRequestId, isCashAdvanceTaken, itinerary, approvers, isAddALeg } = trip.travelRequestData;
        const {tenantId, carRentals } = itinerary || { carRentals: [] };
      
        let isAddALegFlag = true;
        trip.travelRequestData.isAddALeg = isAddALegFlag;

        payload.push({ travelRequestId });

        // add formId before sending to travel/cash
        newCarRentals.forEach((newCarRental) => {
          const itineraryDetails = {
            ...initializeCabFields(), 
            ...addNote,
            ...newCarRental,
            itineraryId: new mongoose.Types.ObjectId(),
            formId: new mongoose.Types.ObjectId().toString(),
            status: updateLineItemStatus(tripStatus),
            approvers: approvers.map((approver) => ({ empId: approver.empId, name: approver.name, status: newApproverStatus })),
          };
          console.log("newCarRental",itineraryDetails)
      
          carRentals.push(itineraryDetails);
          payload.push(itineraryDetails);
        });
  
        trip.travelRequestData.itinerary.carRentals = carRentals;
  
        const updatedTrip = await trip.save();
        
        if (!updatedTrip) {
          return res.status(500).json({ error: 'Failed to save trip' });
        } else {
          console.log("after saving newCarRental", updatedTrip.travelRequestData.itinerary.carRentals.length-1)
          const carRentalsArray = updatedTrip.travelRequestData.itinerary.carRentals;
          const carRentalsAdded = carRentalsArray.length > 0 ? carRentalsArray[carRentalsArray.length-1] : 0;
  
          const dataToSend = {
            tenantId,
            travelRequestId,
            itineraryDetails: carRentalsAdded,
            itineraryType: 'carRentals',
            isAddALeg: true, // Include isAddALeg as true in dataToSend
          };
  
          
        //   if (approvers && approvers?.length > 0) {
        //     console.log("Approvers found for this trip:", approvers);
        //     await sendToOtherMicroservice(dataToSend, 'add-leg', 'approval', 'to update itinerary added to travelRequestData for trips');
        //   }
          
        //   if (isCashAdvanceTaken) {
        //     console.log('Is cash advance taken:', isCashAdvanceTaken);
        //     await sendToOtherMicroservice(dataToSend, 'add-leg', 'cash', 'to update itinerary added to travelRequestData for trips');
        //   } else {
        //     await sendToOtherMicroservice(dataToSend, 'add-leg', 'travel', 'to update itinerary added to travelRequestData for trips');
        //   }
          
        }
  
        return ({ success: true, message: 'cabs added successfully', trip: updatedTrip });
  
    } catch (error) {
      return ({success:false , message: "Failed to add cabs ", error})
    }
}


// 5) Add hotel details via dashboard
export async function addHotel( trip,newHotels,newApproverStatus){
  try {
     let payload = [];
      const {tripStatus} = trip
      let {tenantId, travelRequestId, isCashAdvanceTaken, itinerary, approvers, isAddALeg } = trip.travelRequestData;
      const { hotels } = itinerary || { hotels: [] };
      let isAddALegFlag = true;
      trip.travelRequestData.isAddALeg = isAddALegFlag;
    
      payload.push({ travelRequestId });

      // add formId before sending to travel/cash
      newHotels.forEach((newHotel) => {
        const itineraryDetails = {
          ...initializeHotelFields(), // Initialize all fields to null
          ...addNote,
          ...newHotel,
          itineraryId: new mongoose.Types.ObjectId(),
          formId: new mongoose.Types.ObjectId().toString(),
          status: updateLineItemStatus(tripStatus),
          approvers: approvers.map((approver) => ({ empId: approver.empId, name: approver.name, status: newApproverStatus })),
        };
        console.log("hotel",itineraryDetails)
    
        hotels.push(itineraryDetails);
        payload.push(itineraryDetails);
      });

      trip.travelRequestData.itinerary.hotels = hotels;

      const updatedTrip = await trip.save();
      if (!updatedTrip) {
        return res.status(500).json({ error: 'Failed to save trip' });
      } else {
        console.log("after saving hotel", updatedTrip.travelRequestData.itinerary.hotels.length-1)
        const hotelsArray = updatedTrip.travelRequestData.itinerary.hotels;
        const hotelAdded = hotelsArray.length > 0 ? hotelsArray[hotelsArray.length-1] : 0;

        const dataToSend = {
          tenantId,
          travelRequestId,
          itineraryDetails: hotelAdded,
          itineraryType: 'hotels',
          isAddALeg: true, // Include isAddALeg as true in dataToSend
        };

        console.log("data to send", dataToSend.hotel)
        
        // if (approvers && approvers?.length > 0) {
        //   console.log("Approvers found for this trip:", approvers);
        //   await sendToOtherMicroservice(dataToSend, 'add-leg', 'approval', 'to update itinerary added to travelRequestData for trips');
        // }
        
        // if (isCashAdvanceTaken) {
        //   console.log('Is cash advance taken:', isCashAdvanceTaken);
        //   await sendToOtherMicroservice(dataToSend, 'add-leg', 'cash', 'to update itinerary added to travelRequestData for trips');
        // } else {
        //   await sendToOtherMicroservice(dataToSend, 'add-leg', 'travel', 'to update itinerary added to travelRequestData for trips');
        // }
    }

    return ({ success: true, message: 'Hotels added successfully', trip: updatedTrip });

} catch (error) {
    return ({success:false , message: "Failed to add Hotel ", error})
}
}

export async function addPersonalVehicles(trip, newPersonalVehicle, newApproverStatus){
    try{

        let payload = [];
        const {tripStatus} = trip
        let {tenantId, travelRequestId, isCashAdvanceTaken, itinerary, approvers, isAddALeg } = trip.travelRequestData;
        const { personalVehicles } = itinerary || { personalVehicles: [] };
        let isAddALegFlag = true;
        trip.travelRequestData.isAddALeg = isAddALegFlag;

        payload.push({ travelRequestId });

        // add formId before sending to travel/cash
        newPersonalVehicle.forEach((vehicle) => {
        const itineraryDetails = {
            ...initializeVehicle(), 
            ...addNote,
            ...vehicle,
            itineraryId: new mongoose.Types.ObjectId(),
            formId: new mongoose.Types.ObjectId().toString(),
            status: updateLineItemStatus(tripStatus),
            approvers: approvers.map((approver) => ({ empId: approver.empId, name: approver.name, status: newApproverStatus })),
        };
        console.log("new personalVehicles",itineraryDetails)

        personalVehicles.push(itineraryDetails);
        payload.push(itineraryDetails);
        });

        trip.travelRequestData.itinerary.personalVehicles = personalVehicles;

        const updatedTrip = await trip.save();
        if (!updatedTrip) {
          return res.status(500).json({ error: 'Failed to save trip' });
        } else {
          console.log("after saving vehiclesAdded", updatedTrip.travelRequestData.itinerary.personalVehicles.length-1)
          const personalVehiclesArray = updatedTrip.travelRequestData.itinerary.personalVehicles;
          const vehiclesAdded = personalVehiclesArray.length > 0 ? personalVehiclesArray[personalVehiclesArray.length-1] : 0;

        const dataToSend = {
            tenantId,
            travelRequestId,
            itineraryDetails: vehiclesAdded,
            itineraryType: 'vehiclesAdded',
            isAddALeg: true, // Include isAddALeg as true in dataToSend
        };

        console.log("data to send", dataToSend.vehiclesAdded)
        
        //   if (approvers && approvers?.length > 0) {
        //     console.log("Approvers found for this trip:", approvers);
        //     await sendToOtherMicroservice(dataToSend, 'add-leg', 'approval', 'to update itinerary added to travelRequestData for trips');
        //   }
          
        //   if (isCashAdvanceTaken) {
        //     console.log('Is cash advance taken:', isCashAdvanceTaken);
        //     await sendToOtherMicroservice(dataToSend, 'add-leg', 'cash', 'to update itinerary added to travelRequestData for trips');
        //   } else {
        //     await sendToOtherMicroservice(dataToSend, 'add-leg', 'travel', 'to update itinerary added to travelRequestData for trips');
        //   }
        // }
        }

        return ({ success: true, message: 'vehiclesAdded added successfully', trip: updatedTrip });  

    } catch(error){
        return ({success:false , message: "Failed to add Personal Vehicle ", error})
    }
}

const initializeHotelFields = () => ({
  itineraryId: new mongoose.Types.ObjectId(),
  formId: new mongoose.Types.ObjectId().toString(),
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
  note:null,
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
  note:null,
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
  note:null,
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

const initializeVehicle = () => ({
        itineraryId: new mongoose.Types.ObjectId(),
        formId: new mongoose.Types.ObjectId().toString(),
        sequence: null,
        date: null,
        time: null,
        from: null,
        to: null,
        modified: null,
        cancellationDate: null,
        cancellationReason: null,
        rejectionReason: null,
        note: null,
        status: null,
        bookingDetails: {
          docURL: null,
          docType: null,
          billDetails: {
            vendorName: null,
            taxAmount: null,
            totalAmount: null,
          },
        },
        approvers: [
          {
            empId: null,
            name: null,
            status: null,
          },
        ],
        type: null,
})







