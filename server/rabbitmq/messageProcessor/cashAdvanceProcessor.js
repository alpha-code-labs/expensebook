import mongoose from "mongoose";
import Trip from "../../models/tripSchema.js";
import { sendToOtherMicroservice } from "../publisher.js";



export const formatTenantId = (tenantName) => {
  return tenantName.toUpperCase(); 
};

// to generate and add expense report number
export const generateIncrementalNumber = (tenantName, incrementalValue) => {
  try {
  if (typeof tenantName !== 'string' || typeof incrementalValue !== 'number') {
      throw new Error('Invalid input parameters');
  }
  const formattedTenant = formatTenantId(tenantName).substring(0,2);
  console.log("formattedTenant .................................", formattedTenant)
  // return `ER${formattedTenant}${incrementalValue.toString().padStart(6, '0')}`;
  // const paddedIncrementalValue = incrementalValue !== null && incrementalValue !== undefined ? incrementalValue.toString().padStart(6, '0') : '';
  const paddedIncrementalValue = (incrementalValue !== null && incrementalValue !== undefined && incrementalValue !== 0) ?
    (parseInt(incrementalValue, 10) + 1).toString().padStart(6, '0') :
    '000001';

  // const paddedIncrementalValue = (incrementalValue !== null && incrementalValue !== undefined && incrementalValue !== 0) ? incrementalValue.toString().padStart(6, '0') : '000001';
  console.log("paddedIncrementalValue.............", paddedIncrementalValue)
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
    // const bookingDates = Object.values(itinerary)
    // .flatMap(bookings => {
    //   bookings.map(booking => new Date(booking.bkd_date??bkd_checkIn??))
    // } );

    const bookingDates = [];

    Object.keys(itinerary)
    .filter(key=> itinerary[key].length > 0)
    .forEach(key=>{
      itinerary[key].forEach(item=>{
        console.log(item)
        if(item.status == 'booked'){
          if(key == 'hotels'){
            bookingDates.push(new Date(item.bkd_checkIn));
            bookingDates.push(new Date(item.bkd_checkOut));
          }
          else{
            bookingDates.push(new Date(item.bkd_date));
          }
        }
      })
    })
    console.log('booking dates...', bookingDates, )

//     const bookingDatesTest = Object.values(itinerary)
//   .flatMap(bookings => bookings.filter(item => item.status === 'booked')
//     .flatMap(item => key === 'hotels' ? [new Date(item.bkd_checkIn), new Date(item.bkd_checkOut)] : [new Date(item.bkd_date)]));

// console.log("bookingDatesTest",bookingDatesTest);
  
    // Find earliest and latest date and time
    const earliestDateTime = new Date(Math.min(...bookingDates));
    const lastDateTime = new Date(Math.max(...bookingDates));
    const tripId = new mongoose.Types.ObjectId();

    let tripNumber;
    const maxIncrementalValue = await Trip.findOne({tenantId}, 'tripNumber')
    .sort({ 'tripNumber': -1 })
    .limit(1);

    console.log("maxIncrementalValue ......", maxIncrementalValue)

  let nextIncrementalValue = 0;

  // if ( maxIncrementalValue && maxIncrementalValue.tripNumber) {
  //   nextIncrementalValue = parseInt(maxIncrementalValue.tripNumber.substring(3), 10) + 1;
  // }

  if (maxIncrementalValue && maxIncrementalValue.tripNumber) {
    const numericPart = parseInt(maxIncrementalValue.tripNumber.substring(6));
    if (!isNaN(numericPart)) {
        nextIncrementalValue = numericPart + 1;
    } else {
        console.error('Numeric part of tripNumber is NaN');
    }
}


    tripNumber = generateIncrementalNumber(tenantName, nextIncrementalValue);
    console.log("tripNumber .......", tripNumber)
  
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

