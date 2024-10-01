import cron from 'node-cron';
import  Trip  from '../models/tripSchema.js';
// import { sendNotificationToDashboard, sendNotificationToEmployee } from './notificationService.js';
import { calculateDateDifferenceInDays } from '../utils/dateUtils.js';
import { sendToDashboardMicroservice } from '../rabbitmq/dashboardMicroservice.js';
import dotenv from 'dotenv'
import { sendToOtherMicroservice } from '../rabbitmq/publisher.js';

dotenv.config();

// Define the schedule time for the batch job (e.g., daily at midnight)
const scheduleTime = process.env.SCHEDULE_TIME??'* * * * *';

//send all 3 (standalone travel , travel from cash and cash from cash) arrays to dashboard- to update the status 
const updateTransitTrips = async (transitTrips) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Initialize arrays for completed travel requests
    const listOfCompletedTravelRequestsWithCashAdvances = [];
    const listOfCompletedCashAdvances = [];
    const listOfCompletedStandaloneTravelRequests = [];

    // Process each transit trip to categorize completed trips
    transitTrips.forEach(trip => {
      if (!trip.travelRequestData) return; // Skip if travelRequestData is missing

      const travelRequestId = trip.travelRequestData.travelRequestId;

      // Check if the trip was completed yesterday
      if (trip.tripCompletionDate.toDateString() === yesterday.toDateString() && trip.tripStatus === 'completed') {
        if (trip.isCashAdvanceTaken) {
          listOfCompletedTravelRequestsWithCashAdvances.push(travelRequestId);
          const cashAdvanceIds = trip.cashAdvancesData?.map(advance => advance.cashAdvanceId) || [];
          listOfCompletedCashAdvances.push(...cashAdvanceIds);
        } else {
          listOfCompletedStandaloneTravelRequests.push(travelRequestId);
        }
      }
    });

    // Prepare to update closed travel requests
    const todayDate = new Date();
    const listOfClosedTravelRequests = [];
    const listOfClosedCashAdvances = [];
    const listOfClosedStandAloneTravelRequests = [];

    for (const trip of transitTrips) {
      const { tripCompletionDate, tripStatus, travelRequestData } = trip;

      // Validate required fields
      if (!tripCompletionDate || !travelRequestData) continue;

      // Check if the trip is past its completion date
      if (todayDate > tripCompletionDate) {
        await processTripStatus(trip,todayDate)

        // Closed Travel Requests with Cash Advances Taken
        if (
          tripStatus === 'completed' &&
          travelRequestData.isCashAdvanceTaken
        ) {
          listOfClosedTravelRequests.push(travelRequestData.travelRequestId);
        }

        // Closed Travel Requests with Cash Advances Taken (for closed status)
        if (
          tripStatus === 'closed' &&
          tripCompletionDate <= new Date(todayDate.setDate(todayDate.getDate() - 89)) &&
          travelRequestData.isCashAdvanceTaken
        ) {
          listOfClosedTravelRequests.push(travelRequestData.travelRequestId);
          const cashAdvanceIds = trip.cashAdvancesData?.map(advance => advance.cashAdvanceId) || [];
          listOfClosedCashAdvances.push(...cashAdvanceIds);
        }

        // Closed Standalone Travel Requests
        if (
          tripStatus === 'completed' &&
          tripCompletionDate <= new Date(todayDate.setDate(todayDate.getDate() - 89)) &&
          !travelRequestData.isCashAdvanceTaken
        ) {
          listOfClosedStandAloneTravelRequests.push(travelRequestData.travelRequestId);
        }
      }
    }

    // Log results for debugging
    console.log('listOfClosedTravelRequests:', listOfClosedTravelRequests);
    console.log('listOfClosedCashAdvances:', listOfClosedCashAdvances);
    console.log('listOfClosedStandAloneTravelRequests:', listOfClosedStandAloneTravelRequests);
    console.log({listOfCompletedStandaloneTravelRequests});
    console.log({listOfCompletedCashAdvances});
    console.log({listOfCompletedTravelRequestsWithCashAdvances});

    return { 
      listOfCompletedTravelRequestsWithCashAdvances,
      listOfCompletedCashAdvances,
      listOfCompletedStandaloneTravelRequests,
      listOfClosedStandAloneTravelRequests,
      listOfClosedTravelRequests, 
      listOfClosedCashAdvances 
    };
  } catch (error) {
    console.error("Error updating transit trips:", error);
    throw new Error("Failed to update transit trips.");
  }
};


const processTripStatus = async (trip, todayDate) => {
  const { tripCompletionDate, tripId } = trip;

  // Validate required fields
  if (!tripCompletionDate) return;

  const dateDifference = calculateDateDifferenceInDays(tripCompletionDate, todayDate);

  const status = {
    TRANSIT: 'transit',
    COMPLETED: 'completed',
    CLOSED: 'closed'
  };

  // Check if tripStatus is 'transit' and dateDifference is 1 or 0 days
  if (trip.tripStatus === status.TRANSIT && dateDifference <= 1) {
    const updateConditions = {
      tripId,
      tripStatus: status.TRANSIT,
      tripStartDate: { $lte: new Date() },
    };

    await Trip.updateMany(
      updateConditions,
      {
        $set: {
          tripStatus: status.COMPLETED,
          travelRequestStatus: status.COMPLETED,
        },
      }
    );

    // Update local trip status
    trip.tripStatus = status.COMPLETED;
    console.log(`Trip ${tripId} status updated to completed.`);
  }

  // Check if tripStatus is 'completed' and dateDifference is 89 days
  if (trip.tripStatus === status.COMPLETED && dateDifference === 89) {
    await Trip.updateMany(
      {
        tripId,
        tripStatus: status.COMPLETED,
      },
      {
        $set: {
          tripStatus: status.CLOSED,
          travelRequestStatus: status.CLOSED,
        },
      }
    );

    // Update local trip status
    trip.tripStatus = status.CLOSED;
    console.log(`Trip ${tripId} status updated to closed.`);
  }
};


// Function to get the last line item date from travelRequestData
const getLastLineItemDate = (itinerary) => {
  if (Array.isArray(itinerary)) {
    const lastFlight = getLastBookingDate(itinerary, 'flights');
    const lastTrain = getLastBookingDate(itinerary, 'trains');
    const lastBus = getLastBookingDate(itinerary, 'buses');
    const lastHotel = getLastBookingDate(itinerary, 'hotels');
    const lastCab = getLastBookingDate(itinerary, 'cabs');

    // Find the latest date among all types of bookings
    const latestDate = new Date(Math.max(lastFlight, lastTrain,lastBus, lastHotel, lastCab));

    return latestDate;
  }

  return null; // Handle the case when the structure is unexpected
};

// Function to get the last booking date for a specific type
const getLastBookingDate = (itinerary, bookingType) => {
  const bookings = itinerary.map(booking => booking[bookingType]).filter(Boolean);

  if (Array.isArray(bookings)) {
    const lastBooking = bookings[bookings.length - 1];
    
    // Check if the booking has a valid date and is not cancelled
    if (lastBooking && lastBooking.bkd_date && !lastBooking.isCancelled) {
      return new Date(lastBooking.bkd_date);
    }
  }

  return new Date(0); // Return a default date if no valid booking is found
};

// const getCompletedTravelRequests = async () => {
//   try{
//     const yesterday = new Date();
//     yesterday.setDate(yesterday.getDate() - 1);
//     yesterday.setHours(0, 0, 0, 0); 
  
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
  
//     console.info({ yesterday });

//     const filter = {
//       tripCompletionDate: {
//         $gte: yesterday, 
//         $lt: today 
//       },
//       tripStatus: 'completed',
//       isCompleted:{nin:['true']}
//     }
  
//     const completedTrips = await Trip.find(filter);
  
  
//     console.log("whats from db",completedTrips?.length)
//     // Initialize arrays for completed travel requests
//     const listOfCompletedTravelRequestsWithCashAdvances = [];
//     const listOfCompletedCashAdvances = [];
//     const listOfCompletedStandaloneTravelRequests = [];
  
//     // Process each completed trip
//     completedTrips.forEach(trip => {
//       const travelRequestId = trip.travelRequestData.travelRequestId;
  
//       // Check if cash advance was taken
//       if (trip.isCashAdvanceTaken) {
//         listOfCompletedTravelRequestsWithCashAdvances.push(travelRequestId);
//         const cashAdvanceIds = trip.cashAdvancesData.map(advance => advance.cashAdvanceId);
//         listOfCompletedCashAdvances.push(...cashAdvanceIds);
//       } else {
//         listOfCompletedStandaloneTravelRequests.push(travelRequestId);
//       }
//     });
  
//     return {
//       listOfCompletedTravelRequestsWithCashAdvances,
//       listOfCompletedCashAdvances,
//       listOfCompletedStandaloneTravelRequests,
//       completedTrips
//     };
//   } catch(e){
//     throw e
//   }
//   }


// Define the batch job
// const transitToCompleteBatchJob = ()=>{ 
//   cron.schedule(scheduleTime, async () => {
//   try {
//     // Find all trips with status "transit"
//     const transitTrips = await Trip.find({ tripStatus: 'transit' });

//     // Update transit trips
//     const { listOfClosedStandAloneTravelRequests , listOfClosedTravelRequests , listOfClosedCashAdvances  } = await updateTransitTrips(transitTrips);

//     //RabbitMq 
//     const destinationDash = 'dashboard'

//     if(listOfClosedStandAloneTravelRequests.length > 0){
//       const payload = {listOfClosedStandAloneTravelRequests}
//       const action = 'status-completed-closed'
//       const destination = 'travel'
//      const source='trip'
//       const comments = 'Status change of transit Trips to CLOSED, travel request status change to CLOSED'
//       const onlineVsBatch = 'batch'

//       try {
//         const promises = [ sendToOtherMicroservice(payload, action, 'travel', comments, source, onlineVsBatch),
//           sendToOtherMicroservice(payload,action, 'dashboard',comments, source,onlineVsBatch),
//           sendToOtherMicroservice(payload,action, 'reporting',comments, source,onlineVsBatch)]

//         const [travelResult, dashboardResult, reportingResult] = await Promise.all(promises);
//       } catch (error) {
//         // Handle errors here
//         console.error('One or more microservice calls failed:', error);
//       }
      
//     } else if(listOfClosedTravelRequests.length > 0 || listOfClosedCashAdvances.length > 0){
//       const payload = {listOfClosedTravelRequests, listOfClosedCashAdvances }
//       const action = 'status-completed-closed'
//       const destination = 'cash'
//       const source='trip'
//       const comments = 'Status change of transit Trips to CLOSED, travel request status change to CLOSED and cashAdvance status is changed to CLOSED'
//       const onlineVsBatch = 'batch'

//       try {
//         const promises = [ sendToOtherMicroservice(payload, action, 'cash', comments, source, onlineVsBatch),
//           sendToOtherMicroservice(payload,action, 'dashboard',comments, source,onlineVsBatch),
//           sendToOtherMicroservice(payload,action, 'reporting',comments, source,onlineVsBatch)]

//         const [travelResult, dashboardResult, reportingResult] = await Promise.all(promises);
//       } catch (error) {
//         // Handle errors here
//         console.error('One or more microservice calls failed:', error);
//       }
//     }

//   // Collect completed standalone travel requests
//   const { listOfCompletedStandaloneTravelRequests } = await getCompletedStandaloneTravelRequests();

//     // Collect completed travel requests with cash advances taken
//     const {
//       listOfCompletedTravelRequests,
//       listOfCompletedCashAdvances,
//     } = await getCompletedTravelRequestsWithCashAdvances();


//     if(listOfCompletedStandaloneTravelRequests.length > 0){
//       const payload = {listOfCompletedStandaloneTravelRequests}
//       const action = 'status-completed-closed'
//       const destination = 'travel'
//       const source='trip'
//       const comments = 'Status change of transit Trips to COMPLETED, travel request status change to COMPLETED'
//       const onlineVsBatch = 'batch'
//       await sendToOtherMicroservice(payload, action, destination, comments, source, onlineVsBatch)
//       await sendToOtherMicroservice(payload, action, destinationDash, comments, source, onlineVsBatch)
//     }
//     else if(listOfCompletedTravelRequests.length > 0 || listOfCompletedCashAdvances.length > 0){
//       const payload = {listOfCompletedTravelRequests, listOfCompletedCashAdvances }
//       const action = 'status-completed-closed'
//       const destination = 'cash'
//       const source='trip'
//       const comments = 'Status change of transit Trips to COMPLETED, travel request status change to COMPLETED and cashAdvance status is changed to COMPLETED'
//       const onlineVsBatch = 'batch'
//       await sendToOtherMicroservice(payload, action, destination, comments, source, onlineVsBatch)
//       await sendToOtherMicroservice(payload, action, destinationDash, comments, source, onlineVsBatch)
//     }

//     console.log('Status change Transit to complete batch job completed successfully.');
//   } catch (error) {
//     console.error('Status change Transit to complete batch job error:', error);
//   }
// });
// }
// Helper function to handle database operations
const getCompletedTravelRequests = async () => {
  try {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  console.info({ yesterday });
  
  const filter = {
    tripCompletionDate: {
      $gte: yesterday, 
      $lt: today 
    },
    tripStatus: 'completed',
    isCompleted: { $ne: true }
  };
  
  const completedTrips = await Trip.find(filter);
  
  console.log("whats from db", completedTrips?.length);
  
  // Initialize arrays for completed travel requests
  const listOfCompletedTravelRequestsWithCashAdvances = [];
  const listOfCompletedCashAdvances = [];
  const listOfCompletedStandaloneTravelRequests = [];
  
  // Process each completed trip
  completedTrips.forEach(trip => {
    const travelRequestId = trip.travelRequestData?.travelRequestId;
  
    // Check if cash advance was taken
    if (trip.travelRequestData?.isCashAdvanceTaken) {
      listOfCompletedTravelRequestsWithCashAdvances.push(travelRequestId);
      const cashAdvanceIds = trip.cashAdvancesData.map(advance => advance.cashAdvanceId);
      listOfCompletedCashAdvances.push(...cashAdvanceIds);
    } else {
      listOfCompletedStandaloneTravelRequests.push(travelRequestId);
    }
  });
  
  return {
    listOfCompletedTravelRequestsWithCashAdvances,
    listOfCompletedCashAdvances,
    listOfCompletedStandaloneTravelRequests,
    completedTrips
  };
  } catch (error) {
  console.error('Error fetching completed trips:', error);
  throw error;
  }
  };

const transitToCompleteBatchJob = () => {
  cron.schedule(scheduleTime, async () => {
    try {
    // Function to send payload to multiple microservices
    const sendToMicroservices = async (payload, action, comments, source) => {
      const destinations = ['travel', 'dashboard', 'reporting', 'cash'];
      const promises = destinations.map(destination => 
        sendToOtherMicroservice(payload, action, destination, comments, source, 'batch')
      );
      
      try {
        await Promise.all(promises);
      } catch (error) {
        console.error('One or more microservice calls failed:', error);
      }
    };
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      // Find all trips with status "transit"
      const transitTrips = await Trip.find({ tripStatus: 'transit'});

      // Update transit trips
      const { 
        listOfClosedStandAloneTravelRequests, 
        listOfClosedTravelRequests, 
        listOfClosedCashAdvances,
      } = await updateTransitTrips(transitTrips);


      const { listOfCompletedTravelRequestsWithCashAdvances,
        listOfCompletedCashAdvances,
        listOfCompletedStandaloneTravelRequests,
        completedTrips } = await getCompletedTravelRequests();
      
      
      console.log("here", listOfCompletedTravelRequestsWithCashAdvances,
      listOfCompletedCashAdvances,
      listOfCompletedStandaloneTravelRequests);
      
      // Helper function to extract tripId from travel request data
      const extractTripId = (travelRequestId) => {
      return completedTrips.find(trip => trip.travelRequestData?.travelRequestId === travelRequestId)?.tripId;
      };
      
      // Helper function to update trip status in database
      const updateTripStatus = async (tripId, isCompleted) => {
        console.log("tripId", tripId , "isCompleted", isCompleted)
      const result = await Trip.findOneAndUpdate({tripId:tripId}, { isCompleted:isCompleted }, { new: true });
      console.info("result", result)
      return result;
      };
      
      // Handle completed requests
      if (listOfCompletedStandaloneTravelRequests?.length > 0) {
      await sendToMicroservices(
      { listOfCompletedStandaloneTravelRequests },
      'status-completed-closed',
      'Status change of transit Trips to COMPLETED, travel request status change to COMPLETED',
      'trip'
      );
      
      await Promise.all(
      listOfCompletedStandaloneTravelRequests.map(async (travelRequestId) => {
        const tripId = extractTripId(travelRequestId);
        if (tripId) {
          await updateTripStatus(tripId, true);
        }
      })
      );
      } else if (listOfCompletedTravelRequestsWithCashAdvances?.length > 0 || listOfCompletedCashAdvances?.length > 0) {
      await sendToMicroservices(
      { listOfCompletedTravelRequestsWithCashAdvances, listOfCompletedCashAdvances },
      'status-completed-closed',
      'Status change of transit Trips to COMPLETED, travel request status change to COMPLETED and cashAdvance status is changed to COMPLETED',
      'trip'
      );
      
      await Promise.all(
      [...listOfCompletedTravelRequestsWithCashAdvances, ...listOfCompletedCashAdvances].map(async (item) => {
        const tripId = extractTripId(item);
        if (tripId) {
          await updateTripStatus(tripId, true);
        }
      })
      );
      }

      // Handle closed requests
      if (listOfClosedStandAloneTravelRequests?.length > 0) {
        await sendToMicroservices(
          { listOfClosedStandAloneTravelRequests },
          'status-completed-closed',
          'Status change of transit Trips to CLOSED, travel request status change to CLOSED',
          'trip'
        );

        await Promise.all(
          listOfClosedStandAloneTravelRequests.map(async (travelRequestId) => {
            const tripId = extractTripId(travelRequestId);
            if (tripId) {
              await updateTripStatus(tripId, true);
            }
          })
          );
      } else if (listOfClosedTravelRequests?.length > 0 || listOfClosedCashAdvances?.length > 0) {
        await sendToMicroservices(
          { listOfClosedTravelRequests, listOfClosedCashAdvances },
          'status-completed-closed',
          'Status change of transit Trips to CLOSED, travel request status change to CLOSED and cashAdvance status is changed to CLOSED',
          'trip'
        );

        await Promise.all(
          [...listOfClosedTravelRequests, ...listOfClosedCashAdvances].map(async (item) => {
            const tripId = extractTripId(item);
            if (tripId) {
              await updateTripStatus(tripId, true);
            }
          })
          );
      }

      console.log('Status change Transit to complete batch job completed successfully.');
    } catch (error) {
      console.error('Status change Transit to complete batch job error:', error);
    }
  });
};






// Export the batch job for use in other modules
export {transitToCompleteBatchJob};
// const updateTransitTrips = async (transitTrips) => {
//   const todayDate = new Date();

//   for (const trip of transitTrips) {
//     const lastLineItemDate = getLastLineItemDate(trip.travelRequestData);

//     if (todayDate > lastLineItemDate) {
//       // Asynchronous RabbitMQ call to update briefcase icon for individual users
//       await sendNotificationToDashboard(trip);

//       const dateDifference = calculateDateDifferenceInDays(lastLineItemDate, todayDate);

//       if (dateDifference > 1) {
//         // Update documents in the Trip collection
//         await Trip.updateMany(
//           {
//             // _id: trip._id,
//             tripStatus: 'transit',
//             tripStartDate: { $lte: todayDate },
//             'travelRequestData.itinerary.lineItems.isCancelled': { $ne: true },
//           },
//           {
//             $set: {
//               tripStatus: 'completed',
//               'travelRequestData.travelRequestStatus': 'completed',
//               'cashAdvanceData.travelRequestData.travelRequestStatus': 'completed',
//             },
//           }
//         );

//         // Additional data processing, if needed
//         trip.status = 'completed';
//         await saveDataInTripContainer(trip);

//         // Check if expenses have been submitted
//         if (!trip.expensesSubmitted) {
//           // Asynchronous RabbitMQ call to remind the employee to submit expenses
//           await sendNotificationToEmployee(trip);
//         }
//       }
//     }
//   }
// };

// Function to update documents in the Trip collection










// const updateTransitTrips = async (transitTrips) => {
//   const todayDate = new Date();

//   for (const trip of transitTrips) {
//     const lastLineItemDate = getLastLineItemDate(trip.travelRequestData.itinerary);

//     if (todayDate > lastLineItemDate) {
//       await processCompletionIfApplicable(trip, todayDate, lastLineItemDate);

//       await processClosureIfApplicable(trip);
//     }
//   }
// };



// Define the batch job
// const transitBatchJob = cron.schedule(scheduleTime, async () => {
//   try {
//     // Find all trips with status "transit"
//     const transitTrips = await Trip.find({ tripStatus: 'transit' });

//     // Update transit trips
//     await updateTransitTrips(transitTrips);

//     console.log('Status change Transit to complete batch job completed successfully.');
//   } catch (error) {
//     console.error('Status change Transit to complete batch job error:', error);
//   }
// });

// // Start the batch job immediately (useful for testing)
// transitBatchJob.start();

// // Export the batch job for use in other modules
// export default transitBatchJob;