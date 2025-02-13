import dashboard from '../../models/dashboardSchema.js';
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
      const updatedTrip = await dashboard.findOneAndUpdate(
        { tenantId, travelRequestId,  },
        { $set: { tripSchema: item } },
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

    console.log("waht i get i results",results);
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
  // console.log("Payload received for status update - trip :", payload);
  
  if (!Array.isArray(payload)) {
      throw new Error('Invalid input. Payload must be an array.');
  }
  
  let successCount = 0;
  let failureCount = 0;
  
  const results = await Promise.all(payload.map(async ({ tripId, tripStatus }) => {
      try {
        console.log(`Attempting to update trip with ID: ${tripId} to status: ${tripStatus}`);
        const updatedTrip = await dashboard.findOneAndUpdate(
          { 'tripSchema.tripId': tripId },
          { $set: { 'tripSchema.tripStatus': tripStatus } },
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
const processTransitTrip = async (message) => {
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
    // console.log('Saved to dashboard:', updated);

  } catch (error) {
    console.error('Failed to update dashboard:', error);

    // Collect failed updates
    failedUpdates.push(trip);
    console.error('Failed to update dashboard:', error);

  }
}
}

// Trip microservice ---All trip updates -- synchronous rabbitmq route
const updateTripToDashboardSync = async (message,correlationId) => {
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
      { tenantId,'tripSchema.tripId': tripId },
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
    // console.log('Saved to dashboard: using synchronous queue', updated);

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
    // console.log('Success confirmation sent, using synchronous queue:', successMessage);
  } catch (error) {
    console.error('Failed to send success confirmation,using synchronous queue:', error);
    // Handle error while sending confirmation
  }
}

// Send failed updates as confirmation message
if (failedUpdates.length > 0) {
  try {
    // Send the failed updates to another service or queue for further processing
    await sendFailedConfirmationToTripMicroservice(failedUpdates,correlationId );
    // console.log(' dashboard update failed and is sent to rabbitmq sent as confirmation,using synchronous queue:', failedUpdates,correlationId);
  } catch (error) {
    console.error('Failed to send failed updates confirmation,using synchronous queue:', error);
  }
}
}

// update trip to completed or closed
const updateTripToCompleteOrClosed = async (payload) => {
  const {
    listOfCompletedStandaloneTravelRequests = [],
    listOfClosedStandAloneTravelRequests = [], 
    listOfCompletedTravelRequests = [],
    listOfClosedTravelRequests = [],
  } = payload;

  const promises = [];

  if (listOfCompletedStandaloneTravelRequests.length > 0) {
    promises.push(
      updateRequests(
        listOfCompletedStandaloneTravelRequests,
        {
          'travelRequestSchema.travelRequestStatus': 'completed',
          'tripSchema.travelRequestData.travelRequestStatus': 'completed',
          'tripSchema.tripStatus': 'completed'
        },
        'travel'
      )
    );
  }
  

  if (listOfClosedStandAloneTravelRequests.length > 0) {
    promises.push(updateRequests(listOfClosedStandAloneTravelRequests, {
        'travelRequestSchema.travelRequestStatus': 'closed',
        'tripSchema.travelRequestData.travelRequestStatus': 'closed',
        'tripSchema.tripStatus': 'closed'
      },
      'travel'
    ));
  }

  if (listOfCompletedTravelRequests.length > 0) {
    promises.push(updateRequests(listOfCompletedTravelRequests, {
      'cashAdvanceSchema.travelRequestData.travelRequestStatus': 'completed',
      'tripSchema.travelRequestData.travelRequestStatus': 'completed',
      'tripSchema.tripStatus': 'completed'
    },
    'cashAdvance'
    ));
  }


  if (listOfClosedTravelRequests.length > 0) {
    promises.push(updateRequests(listOfClosedTravelRequests, 
      {
        'cashAdvanceSchema.travelRequestData.travelRequestStatus': 'closed',
        'tripSchema.travelRequestData.travelRequestStatus': 'closed',
        'tripSchema.tripStatus': 'closed'
      },
      'cashAdvance'
      ));
  }

  try {
    const results = await Promise.all(promises);
    // console.log('get all promises', promises)

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

async function updateRequests(requestIds, updateFields, requestType = 'travel') {
  try {
    // console.log(`Processing ${requestType} requests:`, typeof requestIds, requestIds);

    const currentDocs = await dashboard.find({
      'travelRequestId': { $in: requestIds }
    }).toArray();

    if (!currentDocs.length) {
      return { 
        success: false, 
        error: 'No requests found with the provided IDs',
        type: requestType
      };
    }

    const getStatusFields = (doc) => {
      if (requestType === 'travel') {
        return {
          currentMainStatus: doc.travelRequestSchema?.travelRequestStatus,
          targetMainStatus: updateFields['travelRequestSchema.travelRequestStatus'],
          currentTripRequestStatus: doc.tripSchema?.travelRequestData?.travelRequestStatus,
          targetTripRequestStatus: updateFields['tripSchema.travelRequestData.travelRequestStatus'],
          currentTripStatus: doc.tripSchema?.tripStatus,
          targetTripStatus: updateFields['tripSchema.tripStatus']
        };
      } else { 
        return {
          currentMainStatus: doc.cashAdvanceSchema?.travelRequestData?.travelRequestStatus,
          targetMainStatus: updateFields['cashAdvanceSchema.travelRequestData.travelRequestStatus'],
          currentTripRequestStatus: doc.tripSchema?.travelRequestData?.travelRequestStatus,
          targetTripRequestStatus: updateFields['tripSchema.travelRequestData.travelRequestStatus'],
          currentTripStatus: doc.tripSchema?.tripStatus,
          targetTripStatus: updateFields['tripSchema.tripStatus']
        };
      }
    };

    // Filter out IDs that don't need updates
    const needsUpdate = requestIds.filter(requestId => {
      const doc = currentDocs.find(d => d.travelRequestId === requestId);
      if (!doc) return false;

      const statusFields = getStatusFields(doc);
      
      // Check To see , if any of the fields need updating
      const needsStatusUpdate = 
        statusFields.currentMainStatus !== statusFields.targetMainStatus ||
        statusFields.currentTripRequestStatus !== statusFields.targetTripRequestStatus ||
        statusFields.currentTripStatus !== statusFields.targetTripStatus;

      if (needsStatusUpdate) {
        console.log(`Status update needed for ${requestId}:`, 
          {
          current: {
            mainStatus: statusFields.currentMainStatus,
            tripRequestStatus: statusFields.currentTripRequestStatus,
            tripStatus: statusFields.currentTripStatus
          },
          target: {
            mainStatus: statusFields.targetMainStatus,
            tripRequestStatus: statusFields.targetTripRequestStatus,
            tripStatus: statusFields.targetTripStatus
          }
        });
      }

      return needsStatusUpdate;
    });

    // If no documents need updates, return success
    if (needsUpdate.length === 0) {
      console.log(`All ${requestType} documents already in desired state`);
      return { 
        success: true, 
        error: null,
        message: `All ${requestType} documents already in desired state`,
        type: requestType
      };
    }

    // Proceed with update only for documents that need it
    const updateResult = await dashboard.updateMany(
      {
        'travelRequestId': { $in: needsUpdate }
      },
      {
        $set: updateFields
      }
    );

    console.log(`${requestType} update result:`, updateResult);

    // Check if all required updates were successful
    if (updateResult.modifiedCount !== needsUpdate.length) {
      console.log(`Failed to update some ${requestType} requests:`, updateResult);
      return { 
        success: false, 
        error: `Failed to update ${requestType} requests to desired status`,
        attempted: needsUpdate.length,
        modified: updateResult.modifiedCount,
        type: requestType
      };
    } else {
      console.log(`Successfully updated ${requestType} requests`);
      return { 
        success: true, 
        error: null,
        updated: needsUpdate.length,
        skipped: requestIds.length - needsUpdate.length,
        type: requestType
      };
    }
  } catch (error) {
    console.error(`Error updating ${requestType} requests:`, error);
    return { 
      success: false, 
      error: error.message || 'Unknown error',
      type: requestType
    };
  }
}

// add a leg
async function addALeg(payload) {
  try {
      const { travelRequestId, tenantId, itineraryType, itineraryDetails } = payload;

      if (typeof travelRequestId !== 'string' || !Array.isArray(itineraryDetails) || typeof itineraryType !== 'string') {
          throw new Error('Invalid input');
      }

      const travelRequest = await dashboard.findOne({travelRequestId }); 
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

    const travelRequest = await dashboard.findOneAndUpdate(
      { travelRequestId },
      { $set: { "tripSchema.travelRequestData": payload } },
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



export{
  updateTrip,
  updateTripStatus,
  processTransitTrip,
  updateTripToDashboardSync,
  updateTripToCompleteOrClosed,
  addALeg,
  addLeg
}

