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
      const { travelRequestData, cashAdvancesData } = item;

      // Update the database for each item in the payload
      const updated = await Expense.findOneAndUpdate(
        {
          'tenantId': item.travelRequestData.tenantId,
          'travelRequestData.travelRequestId': item.travelRequestData.travelRequestId,
        },
        {
          $set: {
            'travelRequestData': travelRequestData,
            'cashAdvancesData': cashAdvancesData
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




