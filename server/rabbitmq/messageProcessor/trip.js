import reporting from '../../models/reportingSchema.js';
import pino from 'pino';
import pinoPretty from 'pino-pretty';
import { getTravelRequestStatus} from './status.js';

const logger = pino({
  prettifier: pinoPretty
});

/**
 * Function to update or create trip documents based on payload.
 * @param {Array} payload - Array of objects containing tenantId and tripId.
 * @returns {Promise} - Promise representing the update operation.
 */
export const updateTrip = async (payload) => {
  try {
    console.log("trip creation process", payload);
    if (!Array.isArray(payload)) {
      throw new Error('Invalid input. Payload must be an array.');
    }

    const promises = payload.map(async (item) => {
     
      console.log("each trip ...... ", item);
   const { tenantId, travelRequestData: { travelRequestId } } = item;

      
      console.log( "database query","tenantId", tenantId )
      // Use $set to replace the entire tripSchema object with the new item
      const updatedTrip = await reporting.findOneAndUpdate(
        { tenantId, travelRequestId,  },
        { $set: {travelRequestId, ...item } },
        { upsert: true, new: true }
      );
      
      // If the update is successful, return a success message
      if (updatedTrip) {
        return { success: true, message: 'Trip updated successfully' };
      } else {
        throw new Error('Failed to update trip');
      }
    });

    const results = await Promise.all(promises);

    console.log("what i get i results",results);
    // Return the results array containing success messages
    return results;
  } catch (error) {
    // Handle errors
    logger.error({ error: error.message }, 'Error occurred in updateTrip function');
    // Instead of re-throwing the error, return an object with error details
    return { error: 'Error occurred', message: error.message };
  }
};


export const updateTripStatus = async (payload) => {
  console.log("Payload received for status update - trip :", payload);
  
  if (!Array.isArray(payload)) {
      throw new Error('Invalid input. Payload must be an array.');
  }
  
  let successCount = 0;
  let failureCount = 0;
  
  const results = await Promise.all(payload.map(async ({ tripId, tripStatus }) => {
      try {
        console.log(`Attempting to update trip with ID: ${tripId} to status: ${tripStatus}`);
        const updatedTrip = await reporting.findOneAndUpdate(
          { tripId },
          { $set: { 'tripStatus': tripStatus } },
          { new: true }
        );
  
        if (updatedTrip) {
          successCount++;
          console.log(`Trip ${tripId} updated successfully`);
          return { success: true, message: `Trip ${tripId} updated successfully` };
        } else {
          throw new Error(`Failed to update trip ${tripId}`);
        }
      } catch (error) {
        failureCount++;
        console.log(`Error occurred while updating trip ${tripId}: ${error.message}`);
        return { success: false, message: `Error occurred while updating trip ${tripId}: ${error.message}` };
      }
  }));
  
  console.log(`Update summary: Successfully updated ${successCount} trips. Failed to update ${failureCount} trips.`);
  
  return {
      success: successCount === payload.length,
      message: `Successfully updated ${successCount} trips. Failed to update ${failureCount} trips.`
  };
};

// Process transit trip message (received from - trip microservice, received -All transit trips (batch job))
//Trip microservice --All trip updates --- asynchronous rabbitmq route --- 
export const processTransitTrip = async (message) => {
  // const failedUpdates = [];
  // const successMessage = {
  //   message: 'Successfully updated reporting database',
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
      notificationSentToReportingFlag,
      travelRequestData,
      cashAdvancesData,
    } = trip;

    try {
    const updated = await reporting.findOneAndUpdate(
      { tripId },
      {
        $set: {
          'tenantId': tenantId ?? undefined,
          'tenantName': tenantName ?? undefined,
          'companyName': companyName ?? undefined,
          'tripId': tripId ?? undefined,
          'tripNumber': tripNumber ?? undefined,
          'tripPurpose': tripPurpose ?? undefined,
          'tripStatus': tripStatus ?? undefined,
          'tripStartDate': tripStartDate ?? undefined,
          'tripCompletionDate': tripCompletionDate ?? undefined,
          'isSentToExpense': isSentToExpense ?? undefined,
          'notificationSentToReportingFlag': notificationSentToReportingFlag ?? undefined,
          'travelRequestData': travelRequestData ?? undefined,
          'cashAdvancesData': cashAdvancesData ?? undefined,
        },
      },
      { upsert: true, new: true }
    );
    console.log('Saved to reporting:', updated);

  } catch (error) {
    console.error('Failed to update reporting:', error);

    // Collect failed updates
    failedUpdates.push(trip);
    console.error('Failed to update reporting:', error);

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
//     console.log(' reporting update failed and is sent to rabbitmq sent as confirmation:', failedUpdates,correlationId);
//   } catch (error) {
//     console.error('Failed to send failed updates confirmation:', error);
//     // Handle error while sending confirmation
//   }
// }
}

// Trip microservice ---All trip updates -- synchronous rabbitmq route
export const updateTripToreportingSync = async (message,correlationId) => {
  const failedUpdates = [];
  const successMessage = {
    message: 'Successfully updated reporting database',
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
      notificationSentToReportingFlag,
      travelRequestData,
      cashAdvancesData,
    } = trip;

    try {
    const updated = await reporting.findOneAndUpdate(
      { tenantId,'tripId': tripId },
      {
        $set: {
          'tenantId': tenantId ?? undefined,
          'tenantName': tenantName ?? undefined,
          'companyName': companyName ?? undefined,
          'tripId': tripId ?? undefined,
          'tripNumber': tripNumber ?? undefined,
          'tripPurpose': tripPurpose ?? undefined,
          'tripStatus': tripStatus ?? undefined,
          'tripStartDate': tripStartDate ?? undefined,
          'tripCompletionDate': tripCompletionDate ?? undefined,
          'isSentToExpense': isSentToExpense ?? undefined,
          'notificationSentToReportingFlag': notificationSentToReportingFlag ?? undefined,
          'travelRequestData': travelRequestData ?? undefined,
          'cashAdvancesData': cashAdvancesData ?? undefined,
          'sendForNotification': false,  // always set 'sendForNotification' it as false when reporting is updated 
          'travelRequestData.sendForNotification': false, 
          'cashAdvancesData.sendForNotification': false, 
        },
      },
      { upsert: true, new: true }
    );
    console.log('Saved to reporting: using synchrnous queue', updated);

  } catch (error) {
    console.error('Failed to update reporting: using synchronous queue', error);

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
    console.log(' reporting update failed and is sent to rabbitmq sent as confirmation,using synchrnous queue:', failedUpdates,correlationId);
  } catch (error) {
    console.error('Failed to send failed updates confirmation,using synchrnous queue:', error);
  }
}
}


export const updateTripToCompleteOrClosed = async (payload) => {
  const {
    listOfCompletedStandaloneTravelRequests = [],
    listOfClosedStandAloneTravelRequests = [], 
    listOfCompletedTravelRequests = [],
    listOfClosedTravelRequests = [],
  } = payload;

  const promises = [];

  if (listOfCompletedStandaloneTravelRequests.length > 0) {
    promises.push(updateTravelRequests(listOfCompletedStandaloneTravelRequests, 'travelRequestSchema.travelRequestStatus', getTravelRequestStatus.COMPLETED));
  }

  if (listOfClosedStandAloneTravelRequests.length > 0) {
    promises.push(updateTravelRequests(listOfClosedStandAloneTravelRequests, 'travelRequestSchema.travelRequestStatus', getTravelRequestStatus.CLOSED));
  }

  if (listOfCompletedTravelRequests.length > 0) {
    promises.push(updateCashAdvanceRequests(listOfCompletedTravelRequests, 'cashAdvanceSchema.travelRequestData.travelRequestStatus', getTravelRequestStatus.COMPLETED));
  }

  if (listOfClosedTravelRequests.length > 0) {
    promises.push(updateCashAdvanceRequests(listOfClosedTravelRequests, 'cashAdvanceSchema.travelRequestData.travelRequestStatus', getTravelRequestStatus.CLOSED));
  }

  try {
    const results = await Promise.all(promises);

    // Check if all updates were successful
    results.forEach(result => {
      if (!result.success) {
        throw new Error(result.error || 'Unknown error');
      }
    });

    return { success: true, error: null };
  } catch (error) {
    console.error('Error occurred during updates:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
};

async function updateTravelRequests(travelRequestIds, updateField, updateValue) {
  try {
    const updateTravel = await reporting.updateMany({
      'travelRequestSchema.travelRequestId': { $in: travelRequestIds }
    }, {
      $set: {
        [updateField]: updateValue
      }
    });

    if (updateTravel.modifiedCount !== travelRequestIds.length) {
      console.log('Failed to update travel requests:', updateTravel);
      return { success: false, error: 'Failed to update travel requests to desired status' };
    } else {
      console.log('Successfully updated travel requests');
      return { success: true, error: null };
    }
  } catch (error) {
    console.error('Error updating travel requests:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}

async function updateCashAdvanceRequests(travelRequestIds, updateField, updateValue) {
  try {
    const updateTravel = await reporting.updateMany({
      'cashAdvanceSchema.travelRequestData.travelRequestId': { $in: travelRequestIds }
    }, {
      $set: {
        [updateField]: updateValue
      }
    });

    if (updateTravel.modifiedCount !== travelRequestIds.length) {
      console.log('Failed to update cash advance requests:', updateTravel);
      return { success: false, error: 'Failed to update cash advance requests to desired status' };
    } else {
      console.log('Successfully updated cash advance requests');
      return { success: true, error: null };
    }
  } catch (error) {
    console.error('Error updating cash advance requests:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}


export async function addALeg(payload) {
  try {
      const { travelRequestId, tenantId, itineraryType, itineraryDetails } = payload;

      if (typeof travelRequestId !== 'string' || !Array.isArray(itineraryDetails) || typeof itineraryType !== 'string') {
          throw new Error('Invalid input');
      }

      const travelRequest = await reporting.findOne({travelRequestId }); 
      if (!travelRequest) {
          return { success: false, error: 'Travel Request not found' };
      }

      if (!travelRequest.itinerary[itineraryType]) {
          return { success: false, error: 'Invalid itinerary type' };
      }

      travelRequest.itinerary[itineraryType] = [
          ...travelRequest.itinerary[itineraryType], 
          ...itineraryDetails
      ];

      travelRequest.isAddALeg = true;

      await travelRequest.save();

      return { success: true, error: null };
  } catch (error) {
      console.error('Error adding a leg:', error.message);
      return { success: false, error: error.message };
  }
}

export const addLeg = async (payload) => {
  try {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid payload format.');
    }

    // const { travelRequestData } = paylo

    // console.log("travelRequestData",travelRequestData)
    // if (!travelRequestData || typeof travelRequestData !== 'object') {
    //   throw new Error('Invalid travelRequestData.');
    // }

    const { travelRequestId } = payload;

    console.log("payload - add leg", payload)
    if (!travelRequestId) {
      throw new Error('Travel Request ID is required.');
    }

    const travelRequest = await reporting.findOneAndUpdate(
      { travelRequestId },
      { $set: { "travelRequestData": payload } },
    );

    if (!travelRequest) {
      return { success: false, error: 'Travel Request not found' };
    }

    return { success: true, message: 'Travel Request updated successfully' };

  } catch (err) {
    console.error('Error adding leg:', err.message);
    return { success: false, error: err.message };
  }
};







