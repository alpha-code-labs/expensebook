import Trip from "../../models/tripSchema.js";
import { sendToOtherMicroservice } from "../publisher.js";

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


const createTrip = async (travelRequest) => {
  // const { travelRequestData, cashAdvancesData } = travelRequest;
  // const { tenantId, tenantName, travelRequestId } = travelRequestData;

  const { tenantId, tenantName, travelRequestId, createdBy } = travelRequest;

  const itinerary = travelRequest?.itinerary ?? {};

  // Extract all booking dates
  const bookingDates = Object.values(itinerary).flatMap(bookings => bookings.map(booking => new Date(booking.bkd_date)));

  // Find earliest and latest date and time
  const earliestDateTime = new Date(Math.min(...bookingDates));
  const lastDateTime = new Date(Math.max(...bookingDates));

  return {
    tenantId,
    tenantName,
    travelRequestId,
    tripStartDate: earliestDateTime,
    tripCompletionDate: lastDateTime,
    tripStatus:'upcoming',
    createdBy:createdBy,
    travelRequestData: travelRequest,
  };
};

const updateOrCreateTrip = async (trip) => {
  const { tenantId, tenantName, travelRequestId, tripStartDate, tripCompletionDate, travelRequestData } = trip;
  const { isCashAdvanceTaken } = travelRequestData;

  try {
    let updateFields = {
      tripStartDate,
      tripCompletionDate,
      travelRequestData,
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
    const isSent = await sendToOtherMicroservice(validTripsAdded, 'trip-creation', 'dashboard', 'Trip creation successful and sent to dashboard', 'trip', 'online');
 if(isSent){
  return {success: true};
 }
  } catch (error) {
    console.error('Error processing trips:', error);
    throw error;
  }
};






