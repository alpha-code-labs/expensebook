import mongoose from "mongoose";
import Trip from "../../models/tripSchema.js";
import { sendToOtherMicroservice } from "../publisher.js";

const formatTenantId = (tenantId) => {
  return tenantId.toUpperCase(); 
};

const generateIncrementalNumber = (tenantId, incrementalValue) => {
  try {
  if (typeof tenantId !== 'string' || typeof incrementalValue !== 'number') {
      throw new Error('Invalid input parameters');
  }
  const formattedTenant = formatTenantId(tenantId);
  // return `ER${formattedTenant}${incrementalValue.toString().padStart(6, '0')}`;
  const paddedIncrementalValue = incrementalValue !== null && incrementalValue !== undefined ? incrementalValue.toString().padStart(6, '0') : '';
  return `TRIP${formattedTenant}${paddedIncrementalValue}`;
} catch (error) {
  console.error(error);
  throw new Error('An error occurred while generating the incremental number.');
}
}

const createTrip = async (travelRequest) => {
    const { travelRequestData, cashAdvancesData } = travelRequest;
    const { tenantId, tenantName, travelRequestId, createdBy } = travelRequestData;
  
    const itinerary = travelRequestData?.itinerary ?? {};
  
    // Extract all booking dates
    const bookingDates = Object.values(itinerary).flatMap(bookings => bookings.map(booking => new Date(booking.bkd_date)));
  
    // Find earliest and latest date and time
    const earliestDateTime = new Date(Math.min(...bookingDates));
    const lastDateTime = new Date(Math.max(...bookingDates));
    const tripId = new mongoose.Types.ObjectId();

    let tripNumber;
    const maxIncrementalValue = await Trip.findOne({}, 'tripNumber')
    .sort({ 'tripNumber': -1 })
    .limit(1);

  let nextIncrementalValue = 0;

  if ( maxIncrementalValue && maxIncrementalValue.tripNumber) {
    nextIncrementalValue = parseInt(maxIncrementalValue.tripNumber.substring(9), 10) + 1;
  }

    tripNumber = generateIncrementalNumber(tenantId, nextIncrementalValue);
  
    return {
      tenantId,
      tenantName,
      travelRequestId,
      tripId,
      tripNumber,
      tripStartDate: earliestDateTime,
      tripCompletionDate: lastDateTime,
      tripStatus:'upcoming',
      createdBy:createdBy,
      travelRequestData,
      cashAdvancesData
    };
  };
  
  
  const updateOrCreateTrip = async (trip) => {
    const { tenantId, tenantName, travelRequestId, tripId,tripNumber, tripStartDate, tripCompletionDate, tripStatus, createdBy, travelRequestData, cashAdvancesData } = trip;
    const { isCashAdvanceTaken } = travelRequestData;
  
    try {
      let updateFields = {
        travelRequestId,
        tripId,
        tripNumber,
        tripStartDate,
        tripCompletionDate,
        travelRequestData,
        tripStatus,
        createdBy,
      };
  
      // Conditionally update the cashAdvancesData field based on isCashAdvanceTaken
      if (isCashAdvanceTaken) {
        updateFields.cashAdvancesData = cashAdvancesData;
      } else {
        updateFields.cashAdvancesData = [];
      }
  
      const updatedTrip = await Trip.findOneAndUpdate(
        {
          tenantId,
          tenantName,
          "travelRequestData.travelRequestId": travelRequestId,
        },
        updateFields,
        {
          upsert: true,
          new: true,
        }
      );
  
      console.log('Trip updated/created successfully:', updatedTrip);
 
      return updatedTrip;
    } catch (error) {
      console.error('Error updating/creating trip:', error);
      throw error;
    }
  };
  
  
  export const processTravelRequestsWithCash = async (tripArray) => {

    try{
      console.log("from travel", tripArray)
      if (tripArray.length === 0) {
        return {success:true};
      }
    
      const resultData = await Promise.all(tripArray.map(async (travelRequest) => {
        try {
          const trip = await createTrip(travelRequest);
          return trip;
        } catch (error) {
          console.error('Error creating trip:', error);
          throw error;
        }
      }));
    
     const tripsCreated = await Promise.all(resultData.map(async (trip) => {
        try {
          return await updateOrCreateTrip(trip);
        } catch (error) {
          console.error('Error updating/creating trip:', error);
          throw error
        }
      }
      
  
      ));
    
      console.log(tripsCreated, 'created trips....')
      //send to dashboard all newly added trips.
      // payload, action, destination, comments,
        await sendToOtherMicroservice(tripsCreated, 'trip-creation', 'dashboard', 'Trip creation successful and sent to dashboard', 'trip', 'online');
        return {success: true, error: null}; 
    
  
    }catch(e){
      return {success:false, error: e};
    }
  };

