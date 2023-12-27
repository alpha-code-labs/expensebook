import { fetchTravelRequestData } from '../services/travelService.js';
import { fetchCashAdvanceDataWithBookedTravel } from '../services/cashService.js';

// export const fetchAndProcessTravelRequests = async () => {
//   try {
//     const travelRequestsData = await fetchTravelRequestData();

//     if (!Array.isArray(travelRequestsData)) {
//       throw new Error('Travel requests data is not an array');
//     }

//     const uniqueTravelRequests = new Set(travelRequestsData.map(request => request.travelRequestId));
//     const travelRequestMap = new Map(travelRequestsData.map(request => [request.travelRequestId, request]));

//     // Extracting bookings for each travel request
//     for (const request of travelRequestsData) {
//       const { bookings } = request; // 'bookings' is a property within each travel request
//       const earliestDateTime = findEarliestAndLastDateTime(bookings);

//       // Save earliestDateTime within each travel request
//       request.earliestDateTime = earliestDateTime;
//     }
    
//     //  console.log(travelRequestMap);
//     //   console.log(travelRequestsData);
//     return {
//       uniqueTravelRequests: [...uniqueTravelRequests],
//       travelRequestMap,
//       travelRequestsData, // Return updated travelRequestsData
//     };
//   } catch (error) {
//     console.error('An error occurred in fetchAndProcessTravelRequests:', error.message);
//     throw error;
//   }
// };

// export const fetchAndProcessTravelRequests = async () => {
//   try {
//     const travelRequestsData = await fetchTravelRequestData();

//     console.log('Travel Requests Data:', travelRequestsData);

//     if (!Array.isArray(travelRequestsData)) {
//       throw new Error('Travel requests data is not an array');
//     }

//     const uniqueTravelRequests = new Set(travelRequestsData.map(request => request.travelRequestId));
//     const travelRequestMap = new Map(travelRequestsData.map(request => [request.travelRequestId, request]));

//     console.log('Unique Travel Requests:', uniqueTravelRequests);
//     console.log('Travel Request Map:', travelRequestMap);

//     // Function to find earliest and last date time for each travel request
//     const findEarliestAndLastDateTimeForRequest = (bookings) => {
//       const { earliestDateTime, lastDateTime } = findEarliestAndLastDateTime(bookings);
//       return { earliestDateTime, lastDateTime };
//     };

//     // Extracting bookings for each travel request and finding earliest and last date time
//     for (const request of travelRequestsData) {
//       const { bookings } = request; // 'bookings' is a property within each travel request
//       console.log('Request Bookings:', bookings);
//       const { earliestDateTime, lastDateTime } = findEarliestAndLastDateTimeForRequest(bookings);

//       console.log('Earliest Date-Time:', earliestDateTime);
//       console.log('Last Date-Time:', lastDateTime);

//       // Save earliestDateTime within each travel request
//       request.earliestDateTime = earliestDateTime;
//       request.lastDateTime = lastDateTime;
//     }

//     console.log('Updated Travel Requests Data:', travelRequestsData);

//     return {
//       uniqueTravelRequests: [...uniqueTravelRequests],
//       travelRequestMap,
//       travelRequestsData, // Return updated travelRequestsData
//     };
//   } catch (error) {
//     console.error('An error occurred in fetchAndProcessTravelRequests:', error.message);
//     throw error;
//   }
// };

export const fetchAndProcessTravelRequests = async () => {
  try {
    const travelRequestsData = await fetchTravelRequestData();

    console.log('Travel Requests Data:', travelRequestsData);

    if (!Array.isArray(travelRequestsData)) {
      throw new Error('Travel requests data is not an array');
    }

    const uniqueTravelRequests = new Set(travelRequestsData.map(request => request.travelRequestId));
    const travelRequestMap = new Map(travelRequestsData.map(request => [request.travelRequestId, request]));

    console.log('Unique Travel Requests:', uniqueTravelRequests);
    console.log('Travel Request Map:', travelRequestMap);

    // Function to find earliest and last date time for each travel request
    const findEarliestAndLastDateTimeForRequest = (bookings) => {
      // Simulated logic from findEarliestAndLastDateTime removed

      // Example:
      const earliestDateTime = "2023-12-01T08:00:00.000Z";
      const lastDateTime = "2023-12-10T18:00:00.000Z";
      return { earliestDateTime, lastDateTime };
    };

    // Extracting bookings for each travel request and finding earliest and last date time
    for (const request of travelRequestsData) {
      const { bookings } = request; // 'bookings' is a property within each travel request
      console.log('Request Bookings:', bookings);
      const { earliestDateTime, lastDateTime } = findEarliestAndLastDateTimeForRequest(bookings);

      console.log('Earliest Date-Time:', earliestDateTime);
      console.log('Last Date-Time:', lastDateTime);

      // Save earliestDateTime within each travel request
      request.earliestDateTime = earliestDateTime;
      request.lastDateTime = lastDateTime;
    }

    console.log('Updated Travel Requests Data:', travelRequestsData);

    return {
      uniqueTravelRequests: [...uniqueTravelRequests],
      travelRequestMap,
      travelRequestsData, // Return updated travelRequestsData
    };
  } catch (error) {
    console.error('An error occurred in fetchAndProcessTravelRequests:', error.message);
    throw error;
  }
};

export const fetchAndProcessCashAdvances = async () => {
  try {
    const cashAdvancesData = await fetchCashAdvanceDataWithBookedTravel();

    if (!Array.isArray(cashAdvancesData)) {
      throw new Error('Cash advances data is not an array');
    }

    // const uniqueCashAdvances = new Set(cashAdvancesData.map(advance => advance.travelRequestId));
    // const cashAdvanceMap = new Map(cashAdvancesData.map(advance => [advance.travelRequestId, advance]));

    // for (const advance of cashAdvancesData) {
    //   const itinerary = advance.travelRequestData?.itinerary ?? {};

    //   let earliestDateTime = null;

    //   for (const key in itinerary) {
    //     if (Object.prototype.hasOwnProperty.call(itinerary, key)) {
    //       const bookings = itinerary[key];

    //       for (const booking of bookings) {
    //         const bookingDateTime = new Date(booking.bkd_date);

    //         if (!earliestDateTime || bookingDateTime < earliestDateTime) {
    //           earliestDateTime = bookingDateTime;
    //         } else if (bookingDateTime.getTime() === earliestDateTime.getTime()) {
    //           const currentBookingTime = bookingDateTime.getTime();
    //           const earliestBookingTime = earliestDateTime.getTime();

    //           if (currentBookingTime < earliestBookingTime) {
    //             earliestDateTime = bookingDateTime;
    //           }
    //         }
    //       }
    //     }
    //   }

    //   advance.earliestDateTime = earliestDateTime;
    // }

    // const uniqueTravelRequests = new Set(cashAdvancesData.map(advance => advance.travelRequestId));
    // const travelRequestMap = new Map(cashAdvancesData.map(advance => [advance.travelRequestId, advance]));

    return {
      uniqueCashAdvances: [...uniqueCashAdvances],
      cashAdvancesMap: cashAdvanceMap,
      cashAdvancesData,
      uniqueTravelRequests: [...uniqueTravelRequests],
      travelRequestMap,
      travelRequestsData: cashAdvancesData,
    };
  } catch (error) {
    console.error('An error occurred in fetchAndProcessCashAdvances:', error.message);
    throw error;
  }
};


// export const fetchAndProcessCashAdvances = async () => {
//   try {
//     const cashAdvancesData = await fetchCashAdvanceDataWithBookedTravel();

//     if (!Array.isArray(cashAdvancesData)) {
//       throw new Error('Cash advances data is not an array');
//     }

//     const uniqueCashAdvances = new Set(cashAdvancesData.map(advance => advance.travelRequestId));
//     const cashAdvanceMap = new Map(cashAdvancesData.map(advance => [advance.travelRequestId, advance]));

//     for (const advance of cashAdvancesData) {
//       const itinerary = advance.travelRequestData?.itinerary ?? {};
//       let earliestDateTime = null;

//       for (const booking of itinerary) {
//         const bookingDateTime = new Date(booking.date);

//         if (!earliestDateTime || bookingDateTime < earliestDateTime) {
//           earliestDateTime = bookingDateTime;
//         } else if (bookingDateTime.getTime() === earliestDateTime.getTime()) {
//           const currentBookingTime = bookingDateTime.getTime();
//           const earliestBookingTime = earliestDateTime.getTime();

//           if (currentBookingTime < earliestBookingTime) {
//             earliestDateTime = bookingDateTime;
//           }
//         }
//       }

//       advance.earliestDateTime = earliestDateTime;
//     }

//     // Processing and returning cashAdvancesData similar to travelRequestsData
//     const uniqueTravelRequests = new Set(cashAdvancesData.map(advance => advance.travelRequestId));
//     const travelRequestMap = new Map(cashAdvancesData.map(advance => [advance.travelRequestId, advance]));

//     // Returning the processed data structure for both travel requests and cash advances
//     return {
//       uniqueCashAdvances: [...uniqueCashAdvances],
//       cashAdvancesMap: cashAdvanceMap,
//       cashAdvancesData,
//       uniqueTravelRequests: [...uniqueTravelRequests],
//       travelRequestMap,
//       travelRequestsData: cashAdvancesData, // Assuming cashAdvancesData contains travel requests
//     };
//   } catch (error) {
//     console.error('An error occurred in fetchAndProcessCashAdvances:', error.message);
//     throw error;
//   }
// };


// const getDateTime = (booking) => {
//   const { bkd_date, bkd_time, isCancelled } = booking;

//   if (!isCancelled) {
//     if (bkd_date && bkd_time) {
//       return { date: bkd_date, time: bkd_time };
//     } else if (bkd_date) {
//       return { date: bkd_date, time: null };
//     }
//   }

//   return null;
// };


// To get the earliest and last itinerary item's date and time for a trip.
// To get the earliest and last itinerary item's date and time for a trip.
// export const findEarliestAndLastDateTime = (itinerary) => {
//   try {
//       if (
//         !(
//           itinerary &&
//           typeof itinerary === 'object' &&
//           Object.values(itinerary).some(category =>
//             Array.isArray(category) && category.some(booking => booking && booking.bkd_date && booking.bkd_time)
//           )
//         )
//       ) {
//         console.error('Invalid itinerary object:', itinerary);
//         throw new Error(
//           'Invalid itinerary object - At least one array must have at least one object with both "bkd_date" and "bkd_time" properties'
//         );
//       }
//     // if (!(itinerary && typeof itinerary === 'object' && Object.values(itinerary).some(category => Array.isArray(category) && category.some(booking => booking && booking.bkd_date && booking.bkd_time)))) {
//     //   throw new Error('Invalid itinerary object - At least one array must have at least one object with both "bkd_date" and "bkd_time" properties');
//     // }

//     const processCategory = (category) => {
//       if (!category || !Array.isArray(category)) {
//         return {}; // Skip processing if category is missing or not an array
//       }

//       const bookings = category.map(getDateTime).filter(Boolean);

//       if (bookings.length === 0) {
//         return {}; // Return empty object if there are no valid bookings in the category
//       }

//       return bookings.reduce((result, current) => {
//         const { earliestDateTime, lastDateTime } = result;

//         if (!earliestDateTime || isDateTimeBefore(current, earliestDateTime)) {
//           result.earliestDateTime = current;
//         }

//         if (!lastDateTime || isDateTimeBefore(lastDateTime, current)) {
//           result.lastDateTime = current;
//         }

//         return result;
//       }, {});
//     };

//     const getDateTime = ({ bkd_date, bkd_time, isCancelled }) => {
//       if (!isCancelled && bkd_date && bkd_time) {
//         return { date: bkd_date, time: bkd_time };
//       }

//       return null;
//     };

//     const isDateTimeBefore = (dateTime1, dateTime2) => {
//       return dateTime1.date < dateTime2.date ||
//         (dateTime1.date === dateTime2.date && dateTime1.time < dateTime2.time);
//     };

//     const { earliestDateTime, lastDateTime } = Object.values(itinerary).reduce((result, category) => {
//       const categoryResult = processCategory(category);
//       return {
//         earliestDateTime: categoryResult.earliestDateTime || result.earliestDateTime,
//         lastDateTime: categoryResult.lastDateTime || result.lastDateTime,
//       };
//     }, {});

//     if (!earliestDateTime && !lastDateTime) {
//       throw new Error('Invalid itinerary object - No valid date-time information found');
//     }

//     console.log('Earliest Date Time:', earliestDateTime);
//     console.log('Last Date Time:', lastDateTime);

//     return {
//       earliestDateTime: earliestDateTime || null,
//       lastDateTime: lastDateTime || null,
//     };
//   } catch (error) {
//     console.error('An error occurred in findEarliestAndLastDateTime:', error.message);
//     throw error;
//   }
// };



















// export const findEarliestAndLastDateTime = (itinerary) => {
//   try {
//     const getDateTime = (booking) => {
//       const { bkd_date, bkd_time, isCancelled } = booking;

//       if (!isCancelled) {
//         if (bkd_date && bkd_time) {
//           return { date: bkd_date, time: bkd_time };
//         } else if (bkd_date) {
//           return { date: bkd_date, time: null };
//         }
//       }

//       return null;
//     };

//     const processCategory = (category) => {
//       const bookings = Object.values(category); // Extract values (bookings) from the category object
//       return bookings.reduce((result, current) => {
//         const currentDateTime = getDateTime(current);

//         if (!currentDateTime) {
//           return result;
//         }

//         const { earliestDateTime, lastDateTime } = result;

//         if (!earliestDateTime || currentDateTime.date < earliestDateTime.date) {
//           result.earliestDateTime = currentDateTime;
//         } else if (currentDateTime.date === earliestDateTime.date) {
//           if (!earliestDateTime.time || currentDateTime.time < earliestDateTime.time) {
//             result.earliestDateTime = currentDateTime;
//           }
//         }

//         if (!lastDateTime || currentDateTime.date > lastDateTime.date) {
//           result.lastDateTime = currentDateTime;
//         } else if (currentDateTime.date === lastDateTime.date) {
//           if (!lastDateTime.time || currentDateTime.time > lastDateTime.time) {
//             result.lastDateTime = currentDateTime;
//           }
//         }

//         return result;
//       }, {});
//     };

//     //In JavaScript, the reduce function uses the accumulator (result in this case) to accumulate values over each iteration. 
//     //While the code doesn't explicitly reference result after the reduce function completes,
//     // it is essential for keeping track of the accumulated values during the reduction process.
//     //Even though the final result is not explicitly used outside the reduce block, it plays a crucial role within the reduce context to accumulate and update values as the iterations progress. The final result is implicitly returned from the reduce function and used in the subsequent steps of the code.
//     const { earliestDateTime, lastDateTime } = itinerary.reduce((result, category) => {
//       return processCategory(category);
//     }, {});

//     return {
//       earliestDateTime: earliestDateTime ? earliestDateTime : null,
//       lastDateTime: lastDateTime ? lastDateTime : null,
//     };
//   } catch (error) {
//     console.error('An error occurred in findEarliestAndLastDateTime:', error.message);
//     throw error;
//   }
// };



// export const fetchAndProcessCashAdvances = async () => {
//   try {
//     const cashAdvancesData = await fetchCashAdvanceDataWithBookedTravel();

//     if (!Array.isArray(cashAdvancesData)) {
//       throw new Error('Cash advances data is not an array');
//     }

//     const uniqueCashAdvances = new Set(cashAdvancesData.map(advance => advance.travelRequestId));
//     const cashAdvanceMap = new Map(cashAdvancesData.map(advance => [advance.travelRequestId, advance]));

//       console.log(cashAdvanceMap);
//     return {
//       uniqueCashAdvances: [...uniqueCashAdvances],
//       cashAdvanceMap,
//       cashAdvancesData, // Here Return updated cashAdvancesData
//     };
//   } catch (error) {
//     console.error('An error occurred in fetchAndProcessCashAdvances:', error.message);
//     throw error;
//   }
// };

// export const findEarliestDateTime = (bookings) => {
//   try {
//     const earliestDateTime = bookings.reduce((earliest, current) => {
//       const currentDateTime = new Date(current.date);
//       const earliestDateTime = new Date(earliest.date);

//       if (currentDateTime < earliestDateTime) {
//         return current;
//       } else if (currentDateTime.getTime() === earliestDateTime.getTime()) {
//         const currentTime = new Date(current.date).getTime();
//         const earliestTime = new Date(earliest.date).getTime();
//         return currentTime < earliestTime ? current : earliest;
//       } else {
//         return earliest;
//       }
//     });

//     return earliestDateTime.date;
//   } catch (error) {
//     console.error('An error occurred in findEarliestDateTime:', error.message);
//     throw error;
//   }
// };


// import { fetchTravelRequestData } from '../services/travelService.js';
// import { fetchCashAdvanceDataWithBookedTravel } from '../services/cashService.js';

// export const extractAndCompareData = async () => {
//   try {
//     const travelRequestsData = await fetchTravelRequestData();
//     const cashAdvancesData = await fetchCashAdvanceDataWithBookedTravel();
    
//     // Check if the fetched data is an array
//     if (!Array.isArray(travelRequestsData)) {
//       throw new Error('Travel requests data is not an array');
//     }

//     if (!Array.isArray(cashAdvancesData)) {
//       throw new Error('Cash advances data is not an array');
//     }
    
//     const uniqueTravelRequests = new Set(travelRequestsData.map(request => request.travelRequestId));
//     const uniqueCashAdvances = new Set(cashAdvancesData.map(advance => advance.travelRequestId));
    
//     const travelRequestMap = new Map(travelRequestsData.map(request => [request.travelRequestId, request]));
//     const cashAdvanceMap = new Map(cashAdvancesData.map(advance => [advance.travelRequestId, advance]));

//     return {
//       uniqueTravelRequests: [...uniqueTravelRequests],
//       uniqueCashAdvances: [...uniqueCashAdvances],
//       travelRequestMap,
//       cashAdvanceMap,
//     };
//   } catch (error) {
//     console.error('An error occurred in extractAndCompareData:', error.message);
//     throw error;
//   }
// };
