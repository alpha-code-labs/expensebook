import Expense from "../../models/travelExpenseSchema.js"



// trip cancelled at header line or line item level is updated using this route
export const tripFullUpdate = async (payload) => {
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

// export const tripFullUpdate = async (payload) => {
//     console.log("full update from trip", payload);
//     try {
//       const { travelRequestData, cashAdvancesData } = payload;
  
//       const updated = await Expense.findOneAndUpdate(
//         {
//           'tenantId': payload.travelRequestData.tenantId,
//           'travelRequestData.travelRequestId': payload.travelRequestData.travelRequestId,
//         },
//         {
//           $set: {
//             'travelRequestData': travelRequestData,
//             'cashAdvancesData': cashAdvancesData
//           }
//         },
//         { upsert: true, new: true } // Create new document if not found, return updated document
//       );
  
//       if (updated) {
//         return { success: true, message: 'Document updated successfully' };
//       } else {
//         return { success: false, message: 'Error updating document' };
//       }
//     } catch (error) {
//       console.log('Error updating document:', error);
//       return { success: false, message: 'Error updating document', error: error.message };
//     }
//   };
  
export const tripArrayFullUpdate = async (payload) => {
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
export const addALegToTravelRequestData = async (payload) => {
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
export const deleteALegFromTravelRequestData = async (payload) => {
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



