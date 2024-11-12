import Expense from "../../models/tripSchema.js"

// trip cancelled at header line or line item level is updated using this route
const tripFullUpdate = async (payload) => {
  console.log("full update from trip", payload)
    try {
      const { travelRequestData, cashAdvancesData } = payload;
  
      const updated = await Expense.updateOne(
        {
          'tenantId': payload.travelRequestData.tenantId,
          'travelRequestData.travelRequestId': payload.travelRequestData.travelRequestId,
        },
        {
          $set: {
            'travelRequestData': travelRequestData,
            'cashAdvancesData': cashAdvancesData
          }
        }
      );
  
      if (updated.nModified > 0) {
        return { success: true, message: 'Document updated successfully' };
      } else {
        return { success: false, message: 'No matching document found for update' };
      }
    } catch (error) {
      console.log('Error updating document:', error);
      return { success: false, message: 'Error updating document', error: error.message };
    }
  };


const tripArrayFullUpdate = async (payload) => {
  console.log("Full update from trip", payload);
  try {
    // Iterate over each object in the payload array asynchronously
    const updatePromises = payload.map(async (item) => {
      const { tenantId, tripId , tripNumber, tripStartDate, tripCompletionDate, tripStatus, createdBy, tenantName, travelRequestData, cashAdvancesData } = item;
      const {travelRequestId} = travelRequestData

      // Update the database for each item in the payload
      const updated = await Expense.findOneAndUpdate(
        {
          'tenantId': tenantId,
          'travelRequestData.travelRequestId':travelRequestId,
        },
        {
          $set: {
            "tenantId": tenantId,
            "tenantName":tenantName,
            "tripId": tripId,
            "tripNumber": tripNumber,
            "tripStartDate": tripStartDate,
            "tripCompletionDate":tripCompletionDate,
            "tripStatus": tripStatus,
            "createdBy": createdBy,
            'travelRequestData': travelRequestData,
            'cashAdvancesData': cashAdvancesData,
          }
        },
        { upsert: true, new: true } // Create new document if not found, return updated document
      );

      // Return the result of the update operation
      return updated;
    });

    // Await all update promises to complete
    const results = await Promise.all(updatePromises);

    // Check if all updates were successful
    const success = results.every(result => result);

    if (success) {
      return { success: true, message: 'All documents updated successfully' };
    } else {
      return { success: false, message: 'Error updating documents' };
    }
  } catch (error) {
    console.log('Error updating documents:', error);
    return { success: false, message: 'Error updating documents', error: error.message };
  }
};


//Add a leg - flights,cabs,trains,buses, hotels,public transportation
const addALegToTravelRequestData = async (payload) => {
  const { tenantId, travelRequestId, isAddALeg, itineraryType, itineraryDetails: itinerary } = payload;

  const processArray = async (currentArray, targetArray) => {
      let newAlreadyBookedAmount = 0;

      itinerary.forEach(item => {
          const foundItemIndex = currentArray.findIndex(entry => entry.bookingDetails.billDetails.totalAmount === item.bookingDetails.billDetails.totalAmount);

          if (foundItemIndex !== -1) {
              const foundItem = currentArray.splice(foundItemIndex, 1)[0];
              targetArray.push(foundItem);

              newAlreadyBookedAmount += foundItem.bookingDetails.billDetails.totalAmount;
          }
      });

      try {
          const expenseReport = await Expense.findOneAndUpdate(
              { 'tenantId': tenantId, 'travelRequestData.travelRequestId': travelRequestId },
              {
                  $set: {
                      'travelRequestData.isAddALeg': isAddALeg
                  },
                  $push: { [`travelRequestData.itinerary.${itineraryType}`]: { $each: targetArray } },
                  $inc: {
                      'expenseAmountStatus.totalAlreadyBookedExpenseAmount': newAlreadyBookedAmount,
                      'expenseAmountStatus.totalExpenseAmount': newAlreadyBookedAmount
                  }
              },
              { new: true }
          );

          if (!expenseReport) {
              return {
                  success: false,
                  message: 'Expense report not found'
              };
          }

          return {
              success: true,
              message: 'Expense report updated successfully',
              expenseReport
          };
      } catch (err) {
          return {
              success: false,
              message: err.message 
          };
      }
  };

  // Call the processArray function with the correct target array based on the itinerary type
  try {
      const targetArray = req.body.travelRequestData.itinerary[itineraryType] || [];
      const result = await processArray(targetArray, targetArray);
      return result;
  } catch (error) {
      return {
          success: false,
          message: 'Failed to add leg: ' + error.message
      };
  }
};

//delete add a leg
const deleteALegFromTravelRequestData = async (payload) => {
  const { tenantId, travelRequestId, isAddALeg, itineraryType, itineraryDetails: itinerary } = payload;

  const processArray = async (currentArray, targetArray) => {
      let newAlreadyBookedAmount = 0;

      itinerary.forEach(item => {
          const foundItemIndex = currentArray.findIndex(entry => entry.bookingDetails.billDetails.totalAmount === item.bookingDetails.billDetails.totalAmount);

          if (foundItemIndex !== -1) {
              const foundItem = currentArray.splice(foundItemIndex, 1)[0];
              targetArray.push(foundItem);

              newAlreadyBookedAmount += foundItem.bookingDetails.billDetails.totalAmount;
          }
      });

      try {
          const expenseReport = await Expense.findOneAndUpdate(
              { 'tenantId': tenantId, 'travelRequestData.travelRequestId': travelRequestId },
              {
                  $set: {
                      'travelRequestData.isAddALeg': isAddALeg
                  },
                  $push: { [`travelRequestData.itinerary.${itineraryType}`]: { $each: targetArray } },
                  $inc: {
                      'expenseAmountStatus.totalAlreadyBookedExpenseAmount': -newAlreadyBookedAmount,
                      'expenseAmountStatus.totalExpenseAmount': -newAlreadyBookedAmount
                  }
              },
              { new: true }
          );

          if (!expenseReport) {
              return {
                  success: false,
                  message: 'Expense report not found'
              };
          }

          return {
              success: true,
              message: 'Expense report updated successfully',
              expenseReport
          };
      } catch (err) {
          return {
              success: false,
              message: err.message 
          };
      }
  };

  // Call the processArray function with the correct target array based on the itinerary type
  try {
      const targetArray = req.body.travelRequestData.itinerary[itineraryType] || [];
      const result = await processArray(targetArray, targetArray);
      return result;
  } catch (error) {
      return {
          success: false,
          message: 'Failed to add leg: ' + error.message
      };
  }
};

// update trip to completed or closed
const updateTripToCompleteOrClosed = async (payload) => {
  const {
    listOfCompletedStandaloneTravelRequests = [],
    listOfClosedStandAloneTravelRequests = [],
    listOfCompletedTravelRequests = [],
    listOfClosedTravelRequests = []
  } = payload;

  // Consolidated configuration for updates
  const updateConfigs = [
    {
      lists: [listOfCompletedStandaloneTravelRequests, listOfCompletedTravelRequests],
      updateData: {
        'travelRequestData.travelRequestStatus': 'completed',
        'tripStatus': 'completed'
      }
    },
    {
      lists: [listOfClosedStandAloneTravelRequests, listOfClosedTravelRequests],
      updateData: {
        'travelRequestData.travelRequestStatus': 'closed',
        'tripStatus': 'closed'
      }
    }
  ];

  // Create an array of update promises
  const promises = updateConfigs.flatMap(({ lists, updateData }) =>
    lists.filter(list => list.length > 0)
        .map(list => updateRequests(list, updateData))
  );

  // Early return if there are no requests to update
  if (promises.length === 0) {
    return { success: true, message: 'No requests to update.' };
  }

  try {
    const results = await Promise.all(promises);

    // Collect errors from the results
    const errors = results
      .map((result, index) => result.success ? null : `Request ${index + 1}: ${result.error || 'Unknown error'}`)
      .filter(Boolean);

    if (errors.length > 0) {
      throw new Error(`Update failed for some requests: ${errors.join('; ')}`);
    }

    return { success: true, error: null };
    
  } catch (error) {
    console.error('Error during updates:', error);
    return { success: false, error: error.message || 'An unknown error occurred during the update process.' };
  }
};

const updateRequests = async (requestIds, updateFields) => {
  try {
    console.log(`Processing requests:`, requestIds);

    const currentDocs = await Expense.find({
      travelRequestId: { $in: requestIds }
    }).toArray();

    if (currentDocs.length === 0) {
      return {
        success: false,
        error: 'No requests found with the provided IDs',
      };
    }

    // Filter out requests that do not need updating
    const needsUpdate = requestIds.filter(requestId => {
      const doc = currentDocs.find(d => d.travelRequestId === requestId);
      if (!doc) return false;

      const { travelRequestStatus: currentMainStatus } = doc.travelRequestData || {};
      const currentTripStatus = doc.tripStatus;

      return (
        currentMainStatus !== updateFields['travelRequestData.travelRequestStatus'] ||
        currentTripStatus !== updateFields.tripStatus
      );
    });

    if (needsUpdate.length === 0) {
      console.log('All documents are already in the desired state.');
      return {
        success: true,
        message: 'All documents are already in the desired state.',
      };
    }

    const updateResult = await Expense.updateMany(
      { travelRequestId: { $in: needsUpdate } },
      { $set: updateFields }
    );

    console.log('Update result:', updateResult);

    if (updateResult.modifiedCount !== needsUpdate.length) {
      return {
        success: false,
        error: 'Failed to update some requests to the desired status',
        attempted: needsUpdate.length,
        modified: updateResult.modifiedCount,
      };
    }

    return {
      success: true,
      updated: needsUpdate.length,
      skipped: requestIds.length - needsUpdate.length,
    };
  } catch (error) {
    console.error('Error updating requests:', error);
    return {
      success: false,
      error: error.message || 'Unknown error',
    };
  }
};





export {
  tripFullUpdate,
  tripArrayFullUpdate,
  addALegToTravelRequestData,
  deleteALegFromTravelRequestData,
  updateTripToCompleteOrClosed
}
