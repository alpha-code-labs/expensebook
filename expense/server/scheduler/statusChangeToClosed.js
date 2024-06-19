import cron from 'node-cron';
// import { sendNotificationToDashboard, sendNotificationToEmployee } from './notificationService.js';
import { calculateDateDifferenceInDays } from './dateUtils.js';
import Expense from '../models/travelExpenseSchema.js';

// Define the schedule time for the batch job (e.g., daily at midnight)
const scheduleTime = '*/30 * * * * *';


const updateTransitTrips = async (transitTripData) => {
  const todayDate = new Date();

  const ListOfClosedtravelRequests = [];
  const ListOfClosedcashAdvances = [];
  const ListOfClosedStandAlonetravelRequests = [];

  for (const tripData of transitTripData) {
    const lastLineItemDate = getLastLineItemDate(tripData.travelRequestData.itinerary);

    if (todayDate > lastLineItemDate) {
      await processCompletionIfApplicable(tripData, todayDate, lastLineItemDate);

      await processClosureIfApplicable(tripData);

      //Closed Travel Requests with Cash Advances Taken
      if (
        tripData.tripStatus === 'closed' &&
        tripData.tripCompletionDate <= new Date(todayDate.setDate(todayDate.getDate() - 89)) &&
        tripData.isCashAdvanceTaken
      ) {
        ListOfClosedtravelRequests.push(tripData.travelRequestId);

        // Iterate over each cash advance and push its ID to the list
        tripData.cashAdvancesData.forEach(advance => ListOfClosedcashAdvances.push(advance.cashAdvanceId));
      }

      // Closed Standalone Travel Requests
      if (
        tripData.tripStatus === 'completed' &&
        tripData.tripCompletionDate <= new Date(todayDate.setDate(todayDate.getDate() - 89)) &&
        !tripData.isCashAdvanceTaken
      ) {
        ListOfClosedStandAlonetravelRequests.push(tripData.travelRequestId);
      }
    }
  }

  // Further operations with the lists if needed
  console.log('ListOfClosedtravelRequests:', ListOfClosedtravelRequests);
  console.log('ListOfClosedcashAdvances:', ListOfClosedcashAdvances);
  console.log('ListOfClosedStandAlonetravelRequests:', ListOfClosedStandAlonetravelRequests);
};

const processCompletionIfApplicable = async (tripData, todayDate, lastLineItemDate) => {
  const dateDifference = calculateDateDifferenceInDays(lastLineItemDate, todayDate);

  if (dateDifference > 1) {
    await updateDocumentsForCompletion(tripData);

    // Additional data processing for completion, if needed
    tripData.tripStatus = 'completed';
    await saveDataInExpenseContainer(tripData);

    // Check if expenses have been submitted
    if (!expensesSubmitted) {
      await sendNotificationToEmployee(tripData);
    }
  }
};


// Function to update documents in the Trip collection for completion
const updateDocumentsForCompletion = async (tripData) => {
  const updateConditions = {
    _id: tripData._id,
    'tripStatus': 'transit',
    'tripStartDate': { $lte: new Date() },
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

  await Expense.updateMany(
    updateConditions,
    {
      $set: {
        'tripStatus': 'completed',
        'travelRequestData.travelRequestStatus': 'completed',
      },
    }
  );
};


// Function to process close the trip, if trip last line item is more than 90 days
const processClosureIfApplicable = async (tripData) => {
  if (tripData.tripStatus === 'completed' && calculateDateDifferenceInDays(tripData.travelRequestData.itinerary.date, new Date()) > 90) {
    await updateDocumentsForClosure(trip);

    // Additional data processing for closure, if needed
    trip.status = 'closed';
    await saveDataInExpenseContainer(trip);
  }
};

// Function to update documents in the Trip collection for closure
const updateDocumentsForClosure = async (trip) => {
  await Expense.updateMany(
    {
      'tripId': tripId,
      'tripStatus': 'completed',
    },
    {
      $set: {
        'tripStatus': 'closed',
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

  const completedTrips = await Expense.find({
    'tripCompletionDate': yesterday,
    'tripStatus ': 'completed',
    'travelRequestData.isCashAdvanceTaken': true,
  });

  const listOfCompletedTravelRequests = completedTrips.map(trip => trip.travelRequestData.travelRequestId);

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

  const completedStandaloneTrips = await Expense.find({
    'tripCompletionDate': yesterday,
    'tripStatus': 'completed',
    'travelRequestData.isCashAdvanceTaken': false,
  });

  const listOfCompletedStandaloneTravelRequests = completedStandaloneTrips.map(trip => trip.travelRequestId);

  return { listOfCompletedStandaloneTravelRequests };
};

// Define the batch job
const transitBatchJob = cron.schedule(scheduleTime, async () => {
  try {
    // Find all trips with status "transit"
    const transitTrips = await Expense.find({ tripStatus: 'transit' });

    // Update transit trips
    await updateTransitTrips(transitTrips);

    // Collect completed travel requests with cash advances taken
    const {
      listOfCompletedTravelRequests,
      listOfCompletedCashAdvances,
    } = await getCompletedTravelRequestsWithCashAdvances();

    // Collect completed standalone travel requests
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

