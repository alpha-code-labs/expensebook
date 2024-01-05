import { sendFailedConfirmationToTripMicroservice, sendSuccessConfirmationToTripMicroservice } from '../../index.js';
import dashboard from '../../models/dashboardSchema.js';


// Process transit trip message (received from - trip microservice, received -All transit trips (batchjob))
//Trip microservice --All trip updates --- asynchronous rabbitmq route --- 
export const processTransitTrip = async (message) => {
  // const failedUpdates = [];
  // const successMessage = {
  //   message: 'Successfully updated dashboard database',
  //   correlationId: correlationId,
  // };
  for (const trip of message.updatedTripsInMemory) {
    const {
      tenantId,
      tenantName,
      companyName,
      tripId,
      tripNumber,
      tripPurpose,
      tripStatus,
      tripStartDate,
      tripCompletionDate,
      isSentToExpense,
      notificationSentToDashboardFlag,
      travelRequestData,
      cashAdvancesData,
    } = trip;

    try {
    const updated = await dashboard.findOneAndUpdate(
      { 'tripSchema.tripId': tripId },
      {
        $set: {
          'tripSchema.tenantId': tenantId ?? undefined,
          'tripSchema.tenantName': tenantName ?? undefined,
          'tripSchema.companyName': companyName ?? undefined,
          'tripSchema.tripId': tripId ?? undefined,
          'tripSchema.tripNumber': tripNumber ?? undefined,
          'tripSchema.tripPurpose': tripPurpose ?? undefined,
          'tripSchema.tripStatus': tripStatus ?? undefined,
          'tripSchema.tripStartDate': tripStartDate ?? undefined,
          'tripSchema.tripCompletionDate': tripCompletionDate ?? undefined,
          'tripSchema.isSentToExpense': isSentToExpense ?? undefined,
          'tripSchema.notificationSentToDashboardFlag': notificationSentToDashboardFlag ?? undefined,
          'tripSchema.travelRequestData': travelRequestData ?? undefined,
          'tripSchema.cashAdvancesData': cashAdvancesData ?? undefined,
        },
      },
      { upsert: true, new: true }
    );
    console.log('Saved to dashboard:', updated);

  } catch (error) {
    console.error('Failed to update dashboard:', error);

    // Collect failed updates
    failedUpdates.push(trip);
    console.error('Failed to update dashboard:', error);

  }
}
//  // Send success message if updates were successful
//  if (failedUpdates.length === 0) {
//   try {
//     // Send the success message and correlationId to another service or queue for further processing
//     await sendSuccessConfirmationToTripMicroservice(successMessage, correlationId);
//     console.log('Success confirmation sent:', successMessage);
//   } catch (error) {
//     console.error('Failed to send success confirmation:', error);
//     // Handle error while sending confirmation
//   }
// }

// // Send failed updates as confirmation message
// if (failedUpdates.length > 0) {
//   try {
//     // Send the failed updates to another service or queue for further processing
//     await sendFailedConfirmationToTripMicroservice(failedUpdates,correlationId );
//     console.log(' dashboard update failed and is sent to rabbitmq sent as confirmation:', failedUpdates,correlationId);
//   } catch (error) {
//     console.error('Failed to send failed updates confirmation:', error);
//     // Handle error while sending confirmation
//   }
// }
}

// Trip microservice ---All trip updates -- synchronous rabbitmq route
export const updateTripToDashboardSync = async (message,correlationId) => {
  const failedUpdates = [];
  const successMessage = {
    message: 'Successfully updated dashboard database',
    correlationId: correlationId,
  };
  for (const trip of message.trip) {
    const {
      tenantId,
      tenantName,
      companyName,
      tripId,
      tripNumber,
      tripPurpose,
      tripStatus,
      tripStartDate,
      tripCompletionDate,
      isSentToExpense,
      notificationSentToDashboardFlag,
      travelRequestData,
      cashAdvancesData,
    } = trip;

    try {
    const updated = await dashboard.findOneAndUpdate(
      { 'tripSchema.tripId': tripId },
      {
        $set: {
          'tripSchema.tenantId': tenantId ?? undefined,
          'tripSchema.tenantName': tenantName ?? undefined,
          'tripSchema.companyName': companyName ?? undefined,
          'tripSchema.tripId': tripId ?? undefined,
          'tripSchema.tripNumber': tripNumber ?? undefined,
          'tripSchema.tripPurpose': tripPurpose ?? undefined,
          'tripSchema.tripStatus': tripStatus ?? undefined,
          'tripSchema.tripStartDate': tripStartDate ?? undefined,
          'tripSchema.tripCompletionDate': tripCompletionDate ?? undefined,
          'tripSchema.isSentToExpense': isSentToExpense ?? undefined,
          'tripSchema.notificationSentToDashboardFlag': notificationSentToDashboardFlag ?? undefined,
          'tripSchema.travelRequestData': travelRequestData ?? undefined,
          'tripSchema.cashAdvancesData': cashAdvancesData ?? undefined,
          'tripSchema.sendForNotification': false,  // always set 'sendForNotification' it as false when dashboard is updated 
          'tripSchema.travelRequestData.sendForNotification': false, 
          'tripSchema.cashAdvancesData.sendForNotification': false, 
        },
      },
      { upsert: true, new: true }
    );
    console.log('Saved to dashboard: using synchrnous queue', updated);

  } catch (error) {
    console.error('Failed to update dashboard: using synchronous queue', error);

    // Collect failed updates
    failedUpdates.push(trip);
  }
}

 // Send success message if updates were successful
 if (failedUpdates.length === 0) {
  try {
    // Send the success message and correlationId to another service or queue for further processing
    await sendSuccessConfirmationToTripMicroservice(successMessage, correlationId);
    console.log('Success confirmation sent, using synchrnous queue:', successMessage);
  } catch (error) {
    console.error('Failed to send success confirmation,using synchrnous queue:', error);
    // Handle error while sending confirmation
  }
}

// Send failed updates as confirmation message
if (failedUpdates.length > 0) {
  try {
    // Send the failed updates to another service or queue for further processing
    await sendFailedConfirmationToTripMicroservice(failedUpdates,correlationId );
    console.log(' dashboard update failed and is sent to rabbitmq sent as confirmation,using synchrnous queue:', failedUpdates,correlationId);
  } catch (error) {
    console.error('Failed to send failed updates confirmation,using synchrnous queue:', error);
  }
}
}













// export const processTransitTrip = async (message) => {

//   try {

//     console.log('Received message from RabbitMQ:', message);

//     for(const trip of message.updatedTripsInMemory) {
      
//       const { tripId, tripStatus } = trip; 

//       const updated = await Dashboard.findOneAndUpdate(
//         { tripId },
//         {
//           $set: {
//             tripStatus  
//           }
//         }, 
//         { upsert: true, new: true }
//       );

//       console.log('Saved to dashboard:', updated);

//     }

//   } catch (error) {
//     console.error('Error saving to dashboard:', error);
//   }

// };

// // Dashboard schema
// const dashboardSchema = new mongoose.Schema({
//   tripId: String, 
//   tripStatus: String
//   // other fields  
// });

// const Dashboard = mongoose.model('Dashboard', dashboardSchema);