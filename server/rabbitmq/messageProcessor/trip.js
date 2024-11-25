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
const updateTrip = async (payload) => {
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


const updateTripStatus = async (payload) => {
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
//Trip microservice --All trip updates --- asynchronous rabbit mq route --- 
const processTransitTrip = async (message) => {
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

// Trip microservice ---All trip updates -- synchronous rabbit mq route
const updateTripToreportingSync = async (message,correlationId) => {
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


// const updateTripToCompleteOrClosed = async (payload) => {
//   try {
//     const requestGroups = [
//       {
//         requests: [
//           ...(payload.listOfCompletedStandaloneTravelRequests || []),
//           ...(payload.listOfCompletedTravelRequests || [])
//         ],
//         status: 'completed'
//       },
//       {
//         requests: [
//           ...(payload.listOfClosedStandAloneTravelRequests || []),
//           ...(payload.listOfClosedTravelRequests || [])
//         ],
//         status: 'closed'
//       }
//     ];

//     const updatePromises = requestGroups
//       .filter(group => group.requests.length > 0)
//       .map(group => updateRequests(
//         group.requests,
//         {
//           'travelRequestData.travelRequestStatus': group.status,
//           'tripStatus': group.status
//         }
//       ));

//     const results = await Promise.all(updatePromises);
    
//     const hasErrors = results.some(result => !result.success);
//     if (hasErrors) {
//       throw new Error(results.find(r => !r.success)?.error || 'Update failed');
//     }

//     return { success: true, error: null };
//   } catch (error) {
//     console.error('Error occurred during updates:', error);
//     return { success: false, error: error.message || 'Unknown error' };
//   }
// };

// async function updateRequests(requestIds, updateFields) {
//   try {
//     console.log(`Processing requests:`, typeof requestIds, requestIds);

//     // Ensure reporting.find() is correctly awaited
//     const currentDocs = reporting.find({
//       travelRequestId: { $in: requestIds }
//     }).lean();

//     if (!currentDocs.length) {
//       return { 
//         success: false, 
//         error: 'No requests found with the provided IDs',
//       };
//     }

//     const getStatusFields = (doc) => ({
//       currentTripRequestStatus: doc.travelRequestData?.travelRequestStatus,
//       targetTripRequestStatus: updateFields['travelRequestData.travelRequestStatus'],
//       currentTripStatus: doc?.tripStatus,
//       targetTripStatus: updateFields['tripStatus'],
//     });

//     const needsUpdate = requestIds.filter(requestId => {
//       const doc = currentDocs.find(d => d.travelRequestId === requestId);
//       if (!doc) return false;

//       const statusFields = getStatusFields(doc);

//       const needsStatusUpdate = 
//         statusFields.currentTripRequestStatus !== statusFields.targetTripRequestStatus ||
//         statusFields.currentTripStatus !== statusFields.targetTripStatus;

//       if (needsStatusUpdate) {
//         console.log(`Status update needed for ${requestId}:`, {
//           current: {
//             tripRequestStatus: statusFields.currentTripRequestStatus,
//             tripStatus: statusFields.currentTripStatus,
//           },
//           target: {
//             tripRequestStatus: statusFields.targetTripRequestStatus,
//             tripStatus: statusFields.targetTripStatus,
//           }
//         });
//       }

//       return needsStatusUpdate;
//     });

//     if (needsUpdate.length === 0) {
//       console.log(`All documents already in desired state`);
//       return { 
//         success: true, 
//         error: null,
//         message: `All documents already in desired state`,
//       };
//     }

//     const updateResult = await reporting.updateMany(
//       { travelRequestId: { $in: needsUpdate } },
//       { $set: updateFields }
//     );

//     console.log(`Update result:`, updateResult);

//     if (updateResult.modifiedCount !== needsUpdate.length) {
//       console.log(`Failed to update some requests:`, updateResult);
//       return { 
//         success: false, 
//         error: `Failed to update requests to desired status`,
//         attempted: needsUpdate.length,
//         modified: updateResult.modifiedCount,
//       };
//     } else {
//       console.log(`Successfully updated requests`);
//       return { 
//         success: true, 
//         error: null,
//         updated: needsUpdate.length,
//         skipped: requestIds.length - needsUpdate.length,
//       };
//     }
//   } catch (error) {
//     console.error(`Error updating requests:`, error);
//     return { 
//       success: false, 
//       error: error.message || 'Unknown error',
//     };
//   }
// }



// add a leg


/**
 * Main function to update trip statuses to 'completed' or 'closed'
 * @param {Object} payload - Payload containing list of request IDs
 * @returns {Object} Result of the update operation
 */
const updateTripToCompleteOrClosed = async (payload) => {
  try {
    // Define request groups and statuses
    const requestGroups = [
      {
        requests: [
          ...(payload.listOfCompletedStandaloneTravelRequests || []),
          ...(payload.listOfCompletedTravelRequests || [])
        ],
        status: 'completed'
      },
      {
        requests: [
          ...(payload.listOfClosedStandAloneTravelRequests || []),
          ...(payload.listOfClosedTravelRequests || [])
        ],
        status: 'closed'
      }
    ];

    // Process updates for each group
    const updatePromises = requestGroups
      .filter(group => group.requests.length > 0)
      .map(group => updateRequests(group.requests, {
        'travelRequestData.travelRequestStatus': group.status,
        tripStatus: group.status,
      }));

    const results = await Promise.all(updatePromises);

    // Check for errors in results
    const hasErrors = results.some(result => !result.success);
    if (hasErrors) {
      const failedResult = results.find(r => !r.success);
      throw new Error(failedResult?.error || 'One or more updates failed.');
    }

    return { success: true, message: 'Trips updated successfully.', results };
  } catch (error) {
    console.error('Error occurred during trip updates:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
};

/**
 * Function to update specific requests in the reporting collection
 * @param {Array} requestIds - List of request IDs to update
 * @param {Object} updateFields - Fields to update in the documents
 * @returns {Object} Update operation result
 */
async function updateRequests(requestIds, updateFields) {
  try {
    console.log('Processing requests:', requestIds);

    // Fetch current documents
    const currentDocs = await reporting.find({ travelRequestId: { $in: requestIds } }).lean();
    if (!currentDocs.length) {
      return { success: false, error: 'No matching documents found for the provided IDs.' };
    }

    // Identify documents needing updates
    const needsUpdate = currentDocs.filter(doc => {
      return (
        doc.travelRequestData?.travelRequestStatus !== updateFields['travelRequestData.travelRequestStatus'] ||
        doc.tripStatus !== updateFields.tripStatus
      );
    });

    if (!needsUpdate.length) {
      return { success: true, message: 'All documents are already in the desired state.' };
    }

    // Perform the update
    const updateResult = await reporting.updateMany(
      { travelRequestId: { $in: needsUpdate.map(doc => doc.travelRequestId) } },
      { $set: updateFields }
    );

    if (updateResult.modifiedCount !== needsUpdate.length) {
      return {
        success: false,
        error: 'Some documents failed to update.',
        modified: updateResult.modifiedCount,
        attempted: needsUpdate.length,
      };
    }

    return {
      success: true,
      message: 'Documents updated successfully.',
      updatedCount: updateResult.modifiedCount,
    };
  } catch (error) {
    console.error('Error updating requests:', error);
    return { success: false, error: error.message || 'Unknown error during update.' };
  }
}

async function addALeg(payload) {
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

const addLeg = async (payload) => {
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



export {
  updateTrip,
  updateTripStatus,
  processTransitTrip,
  updateTripToreportingSync,
  updateTripToCompleteOrClosed,
  addALeg,
  addLeg

}



