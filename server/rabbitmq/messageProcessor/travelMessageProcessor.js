import mongoose from "mongoose";
import Trip from "../../models/tripSchema.js";
import { sendToOtherMicroservice } from "../publisher.js";
import { generateIncrementalNumber } from "./cashAdvanceProcessor.js";

// const createTrip = async (travelRequest) => {
//   const {travelRequestData , cashAdvancesData } = travelRequest;
//   const {tenantId, tenantName, travelRequestId} = travelRequestData
//   const itinerary = travelRequestData?.itinerary ?? {};
//   let earliestDateTime = null;
//   let lastDateTime = null;

//   for (const key in itinerary) {
//     if (Object.prototype.hasOwnProperty.call(itinerary, key)) {
//       const bookings = itinerary[key];

//       for (const booking of bookings) {
//         const bookingDateTime = new Date(booking.bkd_date);

//         // Find earliest date and time
//         if (!earliestDateTime || bookingDateTime < earliestDateTime) {
//           earliestDateTime = bookingDateTime;
//         }

//         // Find latest date and time
//         if (!lastDateTime || bookingDateTime > lastDateTime) {
//           lastDateTime = bookingDateTime;
//         }
//       }
//     }
//   }

//   return {
//     tenantId,
//     tenantName,
//     travelRequestId,
//     tripStartDate: earliestDateTime,
//     tripCompletionDate: lastDateTime,
//     travelRequestData,
//     cashAdvancesData
//   };
// };


// const createTrip = async (travelRequest) => {
//   // const { travelRequestData, cashAdvancesData } = travelRequest;
//   // const { tenantId, tenantName, travelRequestId } = travelRequestData;

//   const { tenantId, tenantName, travelRequestId, createdBy } = travelRequest;

//   const itinerary = travelRequest?.itinerary ?? {};

//   // Extract all booking dates
//   const bookingDates = Object.values(itinerary).flatMap(bookings => bookings.map(booking => new Date(booking.bkd_date)));

//   // Find earliest and latest date and time
//   const earliestDateTime = new Date(Math.min(...bookingDates));
//   const lastDateTime = new Date(Math.max(...bookingDates));

//   return {
//     tenantId,
//     tenantName,
//     travelRequestId,
//     tripStartDate: earliestDateTime,
//     tripCompletionDate: lastDateTime,
//     tripStatus:'upcoming',
//     createdBy:createdBy,
//     travelRequestData: travelRequest,
//   };
// };

const createTrip = async (travelRequest) => {
  const { tenantId, tenantName, travelRequestId, createdBy } = travelRequest;

  const itinerary = travelRequest?.itinerary ?? {};

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
    travelRequest,
  };
};

const updateOrCreateTrip = async (trip) => {
  const { tenantId, tenantName, travelRequestId, tripId,tripNumber, tripStartDate, tripCompletionDate, tripStatus, createdBy, travelRequest } = trip;
  const { isCashAdvanceTaken } = travelRequest;

  try {
    let updateFields = {
      travelRequestId,
      tripId,
      tripNumber,
      tripStartDate,
      tripCompletionDate,
      tripStatus,
      createdBy,
      travelRequest,
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

    console.log('Trip updated/created successfully: from travel ms', updatedTrip);
    return updatedTrip; 
  } catch (error) {
    console.error('Error updating/creating trip: from travel ms', error);
    throw error;
  }
};


export const processTravelRequests = async (tripArray) => {
  console.log("from travel", tripArray);
  if (tripArray.length === 0) {
    return {success: true, error: null};
  }

  try {
    const resultData = await Promise.all(tripArray.map(async (travelRequest) => {
      try {
        const trip = await createTrip(travelRequest);
        return trip;
      } catch (error) {
        console.error('Error creating trip:', error);
        throw error;
      }
    }));

    // Process each trip in parallel
    const tripPromises = resultData.map(async (trip) => {
      try {
        const tripsAdded = await updateOrCreateTrip(trip);
        return tripsAdded; // Return the result of updateOrCreateTrip
      } catch (error) {
        console.error('Error updating/creating trip:', error);
        throw error;
      }
    });

    // Wait for all trip promises to resolve
    const tripsAdded = await Promise.all(tripPromises);

  
    // Filter out null or undefined results
    const validTripsAdded = tripsAdded.filter(trip => trip);
    console.log("validTripsAdded for dashboard", validTripsAdded)
    // Send valid trips to dashboard
    await sendToOtherMicroservice(validTripsAdded, 'trip-creation', 'dashboard', 'Trip creation successful and sent to dashboard', 'trip', 'online');
    return {success: true};
    
  } catch (error) {
    console.error('Error processing trips:', error);
    return {succes: false, error}
    throw error;
  }
};






// import Trip from "../../models/tripSchema.js";
// import { sendToOtherMicroservice } from "../publisher.js";

// // const createTrip = async (travelRequest) => {
// //   const {travelRequestData , cashAdvancesData } = travelRequest;
// //   const {tenantId, tenantName, travelRequestId} = travelRequestData
// //   const itinerary = travelRequestData?.itinerary ?? {};
// //   let earliestDateTime = null;
// //   let lastDateTime = null;

// //   for (const key in itinerary) {
// //     if (Object.prototype.hasOwnProperty.call(itinerary, key)) {
// //       const bookings = itinerary[key];

// //       for (const booking of bookings) {
// //         const bookingDateTime = new Date(booking.bkd_date);

// //         // Find earliest date and time
// //         if (!earliestDateTime || bookingDateTime < earliestDateTime) {
// //           earliestDateTime = bookingDateTime;
// //         }

// //         // Find latest date and time
// //         if (!lastDateTime || bookingDateTime > lastDateTime) {
// //           lastDateTime = bookingDateTime;
// //         }
// //       }
// //     }
// //   }

// //   return {
// //     tenantId,
// //     tenantName,
// //     travelRequestId,
// //     tripStartDate: earliestDateTime,
// //     tripCompletionDate: lastDateTime,
// //     travelRequestData,
// //     cashAdvancesData
// //   };
// // };


// const createTrip = async (travelRequest) => {
//   // const { travelRequestData, cashAdvancesData } = travelRequest;
//   // const { tenantId, tenantName, travelRequestId } = travelRequestData;

//   const { tenantId, tenantName, travelRequestId, createdBy } = travelRequest;

//   const itinerary = travelRequest?.itinerary ?? {};

//   // Extract all booking dates
//   const bookingDates = Object.values(itinerary).flatMap(bookings => bookings.map(booking => new Date(booking.bkd_date)));

//   // Find earliest and latest date and time
//   const earliestDateTime = new Date(Math.min(...bookingDates));
//   const lastDateTime = new Date(Math.max(...bookingDates));

//   return {
//     tenantId,
//     tenantName,
//     travelRequestId,
//     tripStartDate: earliestDateTime,
//     tripCompletionDate: lastDateTime,
//     tripStatus:'upcoming',
//     createdBy:createdBy,
//     travelRequestData: travelRequest,
//   };
// };

// const updateOrCreateTrip = async (trip) => {
//   const { tenantId, tenantName, travelRequestId, tripStartDate, tripCompletionDate, travelRequestData } = trip;
//   const { isCashAdvanceTaken } = travelRequestData;

//   try {
//     let updateFields = {
//       tripStartDate,
//       tripCompletionDate,
//       travelRequestData,
//     };

//     // Conditionally update the cashAdvancesData field based on isCashAdvanceTaken
//     if (isCashAdvanceTaken) {
//       updateFields.cashAdvancesData = cashAdvancesData;
//     } else {
//       updateFields.cashAdvancesData = [];
//     }

//     const updatedTrip = await Trip.findOneAndUpdate(
//       {
//         tenantId,
//         tenantName,
//         "travelRequestData.travelRequestId": travelRequestId,
//       },
//       updateFields,
//       {
//         upsert: true,
//         new: true,
//       }
//     );

//     console.log('Trip updated/created successfully:', updatedTrip);
//     return updatedTrip; 
//   } catch (error) {
//     console.error('Error updating/creating trip:', error);
//     throw error;
//   }
// };


// export const processTravelRequests = async (tripArray) => {
//   console.log("from travel", tripArray);
//   if (tripArray.length === 0) {
//     return {success: true, error: null};
//   }

//   try {
//     const resultData = await Promise.all(tripArray.map(async (travelRequest) => {
//       try {
//         const trip = await createTrip(travelRequest);
//         return trip;
//       } catch (error) {
//         console.error('Error creating trip:', error);
//         throw error;
//       }
//     }));

//     // Process each trip in parallel
//     const tripPromises = resultData.map(async (trip) => {
//       try {
//         const tripsAdded = await updateOrCreateTrip(trip);
//         return tripsAdded; // Return the result of updateOrCreateTrip
//       } catch (error) {
//         console.error('Error updating/creating trip:', error);
//         throw error;
//       }
//     });

//     // Wait for all trip promises to resolve
//     const tripsAdded = await Promise.all(tripPromises);

  
//     // Filter out null or undefined results
//     const validTripsAdded = tripsAdded.filter(trip => trip);
//     console.log("validTripsAdded for dashboard", validTripsAdded)
//     // Send valid trips to dashboard
//     await sendToOtherMicroservice(validTripsAdded, 'trip-creation', 'dashboard', 'Trip creation successful and sent to dashboard', 'trip', 'online');
//     return {success: true};
    
//   } catch (error) {
//     console.error('Error processing trips:', error);
//     return {succes: false, error}
//     throw error;
//   }
// };






