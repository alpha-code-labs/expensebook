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
  console.log("array of transit trips to update status", transitTrips)
  const todayDate = new Date();

  const listOfClosedTravelRequests = [];
  const listOfClosedCashAdvances = [];
  const listOfClosedStandAloneTravelRequests = [];

  for (const trip of transitTrips) {
    const {tripCompletionDate } = trip

    if (todayDate > tripCompletionDate) {
      await processCompletionIfApplicable(trip, todayDate, tripCompletionDate);
      await processClosureIfApplicable(trip);
      
      if (
        trip.tripStatus === 'completed' &&
        trip.tripCompletionDate <= new Date(todayDate.setDate(todayDate.getDate() - 1)) &&
        trip?.travelRequestData?.isCashAdvanceTaken
      ) {
        listOfClosedTravelRequests.push(trip.travelRequestId);

      //Closed Travel Requests with Cash Advances Taken
      if (
        trip.tripStatus === 'closed' &&
        trip.tripCompletionDate <= new Date(todayDate.setDate(todayDate.getDate() - 89)) &&
        trip?.travelRequestData?.isCashAdvanceTaken
      ) {
        listOfClosedTravelRequests.push(trip.travelRequestId);

        // Iterate over each cash advance and push its ID to the list
        trip.cashAdvancesData.forEach(advance => listOfClosedCashAdvances.push(advance.cashAdvanceId));
      }

      // Closed Standalone Travel Requests
      if (
        trip.tripStatus === 'completed' &&
        trip.tripCompletionDate <= new Date(todayDate.setDate(todayDate.getDate() - 89)) &&
        !trip.travelRequestData?.isCashAdvanceTaken
      ) {
        listOfClosedStandAloneTravelRequests.push(trip.travelRequestId);
      }
    }
  }

  // Further operations with the lists if needed
  console.log('listOfClosedTravelRequests:', listOfClosedTravelRequests);
  console.log('listOfClosedCashAdvances:', listOfClosedCashAdvances);
  console.log('listOfClosedStandAloneTravelRequests:', listOfClosedStandAloneTravelRequests);
}

return { 
  listOfClosedStandAloneTravelRequests ,
  listOfClosedTravelRequests , 
  listOfClosedCashAdvances 
}
};

const processCompletionIfApplicable = async (trip, todayDate, tripCompletionDate) => {
  const dateDifference = calculateDateDifferenceInDays(tripCompletionDate, todayDate);

  const {tripId} = trip

  const status = {
    TRANSIT:'transit',
    COMPLETED:'completed'
  }

  if (dateDifference > 1) {
    await updateDocumentsForCompletion(trip);

    // Additional data processing for completion
    trip.tripStatus = 'completed';

    const tripCompleted = await Trip.updateOne({
      tripId,
      'trip.tripStatus':status.TRANSIT
    },
  {
    'trip.tripStatus': status.COMPLETED
  })

  if(!tripCompleted){
    throw new Error(`Error Occurred - batch job -status change from transit to completed - ${tripId} tripId no found `)
  } else {
    console.log(`Trip ${tripId} status updated to completed successfully`)
  }

    // Check if expenses have been submitted
    // if (!trip.expensesSubmitted) {
    //   await sendNotificationToEmployee(trip);
    // }
  }
};


// Function to update documents in the Trip collection for completion
const updateDocumentsForCompletion = async (trip) => {
  const {tripId} = trip

  const status = {
    TRANSIT: 'transit',
    COMPLETED:'completed'
  }

  const updateConditions = {
    tripId,
    tripStatus: status.TRANSIT,
    tripStartDate: { $lte: new Date() },
  };

  // // Iterate over each transportation type within the itinerary
  // const transportationTypes = ['flights', 'buses', 'trains', 'hotels', 'cabs'];
  // const transportationQuery = [];

  // transportationTypes.forEach(type => {
  //   const query = {
  //     [`itinerary.${type}.status`]: { $ne: ['cancelled','paid and cancelled'] }, 
  //   };
  //   query[`itinerary.${type}.cancellationDate`] = { $exists: false }; // If cancellationDate exists, it was cancelled

  //   transportationQuery.push(query);
  // });

  // // Combine the transportation queries using $or operator
  // updateConditions.$and = transportationQuery.map(query => ({ $or: [query] }));

  await Trip.updateMany(
    updateConditions,
    {
      $set: {
        tripStatus: status.COMPLETED,
        travelRequestStatus: status.COMPLETED,
      },
    }
  );

  // //RabbitMq - sending to dashboard 
  // const action = 'status-completed'
  // const comments = 'Status update for TRIPS from TRANSIT to COMPLETED'
  // const data = 'batch';
  // const needConfirmation = false;
  //  // Send updated trip to the dashboard synchronously
  // await sendToDashboardMicroservice(trip,action, comments, data,needConfirmation );
};


// Function to process close the trip, if trip last line item is more than 90 days
const processClosureIfApplicable = async (trip) => {

  if (trip.tripStatus === 'completed' && calculateDateDifferenceInDays(trip.tripCompletionDate, new Date()) > 90) {
    await updateDocumentsForClosure(trip);

    // Additional data processing for closure, if needed
    trip.tripStatus = 'closed';

  
  //   //RabbitMq - sending to dashboard 
  //   const data = 'batch';
  //   const needConfirmation = false;
  //   // Send updated trip to the dashboard synchronously
  //  await sendToDashboardMicroservice(trip, data,needConfirmation );
  }
};

// Function to update documents in the Trip collection for closure
const updateDocumentsForClosure = async (trip) => {
  const {tripId} = trip
  const status = {
    COMPLETED: 'completed',
    CLOSED: 'closed',
  }
  await Trip.updateMany(
    {
      tripId: tripId,
      tripStatus: status.COMPLETED,
    },
    {
      $set: {
        tripStatus: status.CLOSED,
        'travelRequestStatus': status.CLOSED,
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

  const completedStandaloneTrips = await Trip.find({
    tripCompletionDate: yesterday,
    tripStatus: 'completed',
    'isCashAdvanceTaken': false,
  });

  const listOfCompletedStandaloneTravelRequests = completedStandaloneTrips.map(trip => trip.travelRequestData.travelRequestId);

  return { listOfCompletedStandaloneTravelRequests };
};

// Define the batch job
const transitToCompleteBatchJob = ()=>{ 
  cron.schedule(scheduleTime, async () => {
  try {
    // Find all trips with status "transit"
    const transitTrips = await Trip.find({ tripStatus: 'transit' });

    // Update transit trips
    const { listOfClosedStandAloneTravelRequests , listOfClosedTravelRequests , listOfClosedCashAdvances  } = await updateTransitTrips(transitTrips);

    //RabbitMq 
    const destinationDash = 'dashboard'

    if(listOfClosedStandAloneTravelRequests.length > 0){
      const payload = {listOfClosedStandAloneTravelRequests}
      const action = 'status-completed-closed'
      const destination = 'travel'
      const comments = 'Status change of transit Trips to CLOSED, travel request status change to CLOSED'
      const onlineVsBatch = 'batch'
      await sendToOtherMicroservice(payload, action, destination, comments, source='trip', onlineVsBatch)
      await sendToOtherMicroservice(payload,action, destinationDash,comments, source= 'trip',onlineVsBatch)
    } else if(listOfClosedTravelRequests.length > 0 || listOfClosedCashAdvances.length > 0){
      const payload = {listOfClosedTravelRequests, listOfClosedCashAdvances }
      const action = 'status-completed-closed'
      const destination = 'cash'
      const comments = 'Status change of transit Trips to CLOSED, travel request status change to CLOSED and cashAdvance status is changed to CLOSED'
      const onlineVsBatch = 'batch'
      await sendToOtherMicroservice(payload, action, destination, comments, source='trip', onlineVsBatch)
      await sendToOtherMicroservice(payload, action, destinationDash, comments, source='trip', onlineVsBatch)
    }

  // Collect completed standalone travel requests
  const { listOfCompletedStandaloneTravelRequests } = await getCompletedStandaloneTravelRequests();

    // Collect completed travel requests with cash advances taken
    const {
      listOfCompletedTravelRequests,
      listOfCompletedCashAdvances,
    } = await getCompletedTravelRequestsWithCashAdvances();


    if(listOfCompletedStandaloneTravelRequests.length > 0){
      const payload = {listOfCompletedStandaloneTravelRequests}
      const action = 'status-completed-closed'
      const destination = 'travel'
      const comments = 'Status change of transit Trips to COMPLETED, travel request status change to COMPLETED'
      const onlineVsBatch = 'batch'
      await sendToOtherMicroservice(payload, action, destination, comments, source='trip', onlineVsBatch)
      await sendToOtherMicroservice(payload, action, destinationDash, comments, source='trip', onlineVsBatch)
    }
    else if(listOfCompletedTravelRequests.length > 0 || listOfCompletedCashAdvances.length > 0){
      const payload = {listOfCompletedTravelRequests, listOfCompletedCashAdvances }
      const action = 'status-completed-closed'
      const destination = 'cash'
      const comments = 'Status change of transit Trips to COMPLETED, travel request status change to COMPLETED and cashAdvance status is changed to COMPLETED'
      const onlineVsBatch = 'batch'
      await sendToOtherMicroservice(payload, action, destination, comments, source='trip', onlineVsBatch)
      await sendToOtherMicroservice(payload, action, destinationDash, comments, source='trip', onlineVsBatch)
    }

    console.log('Status change Transit to complete batch job completed successfully.');
  } catch (error) {
    console.error('Status change Transit to complete batch job error:', error);
  }
});
}


// Export the batch job for use in other modules
export {transitToCompleteBatchJob};





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