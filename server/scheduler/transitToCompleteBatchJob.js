import cron from 'node-cron';
import { Trip } from '../models/tripSchema.js';
import { sendNotificationToDashboard, sendNotificationToEmployee } from './notificationService.js';
import { calculateDateDifferenceInDays } from './dateUtils.js';

// Define the schedule time for the batch job (e.g., daily at midnight)
const scheduleTime = '0 0 * * *';


const updateTransitTrips = async (transitTrips) => {
  const todayDate = new Date();

  const ListOfClosedtravelRequests = [];
  const ListOfClosedcashAdvances = [];
  const ListOfClosedStandAlonetravelRequests = [];

  for (const trip of transitTrips) {
    const lastLineItemDate = getLastLineItemDate(trip.travelRequestData.itinerary);

    if (todayDate > lastLineItemDate) {
      await processCompletionIfApplicable(trip, todayDate, lastLineItemDate);

      await processClosureIfApplicable(trip);

      //Closed Travel Requests with Cash Advances Taken
      if (
        trip.tripStatus === 'closed' &&
        trip.tripCompletionDate <= new Date(todayDate.setDate(todayDate.getDate() - 89)) &&
        trip.isCashAdvanceTaken
      ) {
        ListOfClosedtravelRequests.push(trip.travelRequestId);

        // Iterate over each cash advance and push its ID to the list
        trip.cashAdvancesData.forEach(advance => ListOfClosedcashAdvances.push(advance.cashAdvanceId));
      }

      // Closed Standalone Travel Requests
      if (
        trip.tripStatus === 'completed' &&
        trip.tripCompletionDate <= new Date(todayDate.setDate(todayDate.getDate() - 89)) &&
        !trip.isCashAdvanceTaken
      ) {
        ListOfClosedStandAlonetravelRequests.push(trip.travelRequestId);
      }
    }
  }

  // Further operations with the lists if needed
  console.log('ListOfClosedtravelRequests:', ListOfClosedtravelRequests);
  console.log('ListOfClosedcashAdvances:', ListOfClosedcashAdvances);
  console.log('ListOfClosedStandAlonetravelRequests:', ListOfClosedStandAlonetravelRequests);
};

const processCompletionIfApplicable = async (trip, todayDate, lastLineItemDate) => {
  const dateDifference = calculateDateDifferenceInDays(lastLineItemDate, todayDate);

  if (dateDifference > 1) {
    await updateDocumentsForCompletion(trip);

    // Additional data processing for completion, if needed
    trip.tripStatus = 'completed';
    await saveDataInTripContainer(trip);

    // Check if expenses have been submitted
    if (!trip.expensesSubmitted) {
      await sendNotificationToEmployee(trip);
    }
  }
};


// Function to update documents in the Trip collection for completion
const updateDocumentsForCompletion = async (trip) => {
  const updateConditions = {
    _id: trip._id,
    tripStatus: 'transit',
    tripStartDate: { $lte: new Date() },
  };

  // Iterate over each transportation type within the itinerary
  const transportationTypes = ['flights', 'buses', 'trains', 'hotels', 'cabs'];
  const transportationQuery = [];

  transportationTypes.forEach(type => {
    const query = {
      [`itinerary.${type}.status`]: { $ne: 'cancelled' }, // Assuming status field indicates cancellation
    };
    query[`itinerary.${type}.cancellationDate`] = { $exists: false }; // If cancellationDate exists, it was cancelled

    transportationQuery.push(query);
  });

  // Combine the transportation queries using $or operator
  updateConditions.$and = transportationQuery.map(query => ({ $or: [query] }));

  await Trip.updateMany(
    updateConditions,
    {
      $set: {
        tripStatus: 'completed',
        travelRequestStatus: 'completed',
      },
    }
  );
};


// Function to process close the trip, if trip last line item is more than 90 days
const processClosureIfApplicable = async (trip) => {
  if (trip.status === 'completed' && calculateDateDifferenceInDays(trip.lastLineItem.date, new Date()) > 90) {
    await updateDocumentsForClosure(trip);

    // Additional data processing for closure, if needed
    trip.status = 'closed';
    await saveDataInTripContainer(trip);
  }
};

// Function to update documents in the Trip collection for closure
const updateDocumentsForClosure = async (trip) => {
  await Trip.updateMany(
    {
      _id: trip._id,
      tripStatus: 'completed',
    },
    {
      $set: {
        tripStatus: 'closed',
        'travelRequestStatus': 'closed',
      },
    }
  );
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

// Function to get completed travel requests with cash advances taken
const getCompletedTravelRequestsWithCashAdvances = async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const completedTrips = await Trip.find({
    tripCompletionDate: yesterday,
    tripStatus: 'completed',
    isCashAdvanceTaken: true,
  });

  const listOfCompletedTravelRequests = completedTrips.map(trip => trip.travelRequestId);

  // Extracting cashAdvanceId from each object in the CashAdvances array
  const listOfCompletedCashAdvances = completedTrips.reduce((cashAdvancesData, trip) => {
    const cashAdvanceIds = trip.cashAdvancesData.map(advance => advance.cashAdvanceId);
    return [...cashAdvancesData, ...cashAdvanceIds];
  }, []);

  return { listOfCompletedTravelRequests, listOfCompletedCashAdvances };
};


// Function to get completed standalone travel requests
const getCompletedStandaloneTravelRequests = async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const completedStandaloneTrips = await Trip.find({
    tripCompletionDate: yesterday,
    tripStatus: 'completed',
    'isCashAdvanceTaken': false,
  });

  const listOfCompletedStandaloneTravelRequests = completedStandaloneTrips.map(trip => trip.travelRequestId);

  return { listOfCompletedStandaloneTravelRequests };
};

// Define the batch job
const transitBatchJob = cron.schedule(scheduleTime, async () => {
  try {
    // Find all trips with status "transit"
    const transitTrips = await Trip.find({ tripStatus: 'transit' });

    // Update transit trips
    await updateTransitTrips(transitTrips);

    // Logic 1: Collect completed travel requests with cash advances taken
    const {
      listOfCompletedTravelRequests,
      listOfCompletedCashAdvances,
    } = await getCompletedTravelRequestsWithCashAdvances();

    // Logic 2: Collect completed standalone travel requests
    const { listOfCompletedStandaloneTravelRequests } = await getCompletedStandaloneTravelRequests();

    console.log('Status change Transit to complete batch job completed successfully.');
  } catch (error) {
    console.error('Status change Transit to complete batch job error:', error);
  }
});

// Start the batch job immediately (useful for testing)
transitBatchJob.start();

// Export the batch job for use in other modules
export default transitBatchJob;









// Function to update documents in the Trip collection
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