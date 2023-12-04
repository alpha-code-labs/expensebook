import Expense from '../models/expenseSchema.js';

// Function to update Expense or create a new one if it doesn't exist
export const updateExpense = async (req, res) => {
  try {
    // Fetch the expense update data from the request body
    const updateExpenseDataArray = req.body;

    // Validate the data here
    if (!Array.isArray(updateExpenseDataArray)) {
      return res.status(400).json({ error: 'Bad Request', message: 'Invalid data format.' });
    }

    // Array to store successfully updated expenses
    const updatedExpenses = [];

    // Array to store failed updates
    const failedUpdates = [];

    // Iterate through each updateExpenseData in the array
    for (const updateExpenseData of updateExpenseDataArray) {
      // Ensure that tenantId and travelRequestId are present and non-null
      if (!updateExpenseData.tenantId || !updateExpenseData.embeddedTravelRequest || !updateExpenseData.embeddedTravelRequest.travelRequestId) {
        failedUpdates.push({ error: 'Bad Request', message: 'Invalid or missing data fields.', data: updateExpenseData });
        continue; // Skip to the next update if data is invalid
      }

      // Create or update the embeddedTrip data inside the Expense document
      const filter = {
        tenantId: updateExpenseData.tenantId,
        travelRequestId: updateExpenseData.embeddedTravelRequest.travelRequestId,
      };

      // Set the data to be updated
      const update = {
        $set: {
          'tenantId':updateExpenseData.tenantId,
          'tenantName': updateExpenseData.tenantName,
          'companyName': updateExpenseData.companyName,
          'travelRequestId':updateExpenseData.embeddedTravelRequest.travelRequestId,
          'expenseHeaderID':updateExpenseData.embeddedTravelRequest.travelRequestId,
          'alreadyBookedExpenseLines':updateExpenseData.embeddedTravelRequest.bookings,
          'embeddedTrip.tenantId': updateExpenseData.tenantId,
          'embeddedTrip.tenantName': updateExpenseData.tenantName,
          'embeddedTrip.companyName': updateExpenseData.companyName,
          'embeddedTrip.userId': updateExpenseData.userId,
          'embeddedTrip.tripPurpose': updateExpenseData.tripPurpose,
          'embeddedTrip.tripStatus': updateExpenseData.tripStatus,
          'embeddedTrip.tripStartDate': updateExpenseData.tripStartDate,
          'embeddedTrip.tripCompletionDate': updateExpenseData.tripCompletionDate,
          'embeddedTrip.notificationSentToDashboardFlag': updateExpenseData.notificationSentToDashboardFlag,
          'embeddedTrip.embeddedTravelRequest': updateExpenseData.embeddedTravelRequest,
          'embeddedTrip.embeddedCashAdvance': updateExpenseData.embeddedCashAdvance,
        },
      };

      // Use the upsert option to create a new document if it doesn't exist
      const options = { upsert: true, new: true };

      try {
        // Perform the update
        const updatedExpense = await Expense.findOneAndUpdate(filter, update, options);
        updatedExpenses.push(updatedExpense);
      } catch (error) {
        failedUpdates.push({ error: 'Update Failed', message: error.message, data: updateExpenseData });
      }
    }

    return res.status(200).json({ updatedExpenses, failedUpdates });
  } catch (error) {
    console.error('Error updating Expense:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: 'An internal server error occurred.' });
  }
};


//GET embedded trip from expense 
export const getEmbeddedTripDetails = async (req, res) => {
  try {
    const { tenantId, empId, expenseHeaderID} = req.params;

    // Fetch the Expense by tenantId, empId, and _id
    const expense = await Expense.findOne({
      'tenantId': tenantId,
      'createdBy.empId': empId,
      'expenseHeaderID': expenseHeaderID ,
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Access the embedded Trip using expense.embeddedTrip
    const embeddedTrip = expense.embeddedTrip; // Modify 'embeddedTrip' to match your field name

    return res.status(200).json({ trip: embeddedTrip });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};



// import Expense from '../models/expenseSchema.js';

// // Function to update Expense or create a new one if it doesn't exist
// const updateExpense = async (req, res) => {
//   try {
//     // Fetch the expense update data from the request body
//     const updateExpenseData = req.body;
//        // Debugging: Log the received data
//     // console.log('Received updateExpenseData:', updateExpenseData);
//     // Validate the data here
//     if (!updateExpenseData || typeof updateExpenseData !== 'object') {
//       return res.status(400).json({ error: 'Bad Request', message: 'Invalid data format.' });
//     }

//     // Ensure that tenantId and travelRequestId are present and non-null
//     if (!updateExpenseData.tenantId || !updateExpenseData.embeddedTravelRequest || !updateExpenseData.embeddedTravelRequest.travelRequestId) {
//       return res.status(400).json({ error: 'Bad Request', message: 'Invalid or missing data fields.' });
//     }
      
//     // Create or update the embeddedTrip data inside the Expense document
//     const filter = {
//       tenantId: updateExpenseData.tenantId,
//       travelRequestId: updateExpenseData.embeddedTravelRequest.travelRequestId,
//     };

//     // Set the data to be updated
//     const update = {
//       $set: {
//         'embeddedTrip.tenantId': updateExpenseData.tenantId,
//         'embeddedTrip.tenantName': updateExpenseData.tenantName,
//         'embeddedTrip.companyName': updateExpenseData.companyName,
//         'embeddedTrip.userId': updateExpenseData.userId,
//         'embeddedTrip.tripPurpose': updateExpenseData.tripPurpose,
//         'embeddedTrip.tripStatus': updateExpenseData.tripStatus,
//         'embeddedTrip.tripStartDate': updateExpenseData.tripStartDate,
//         'embeddedTrip.tripCompletionDate': updateExpenseData.tripCompletionDate,
//         'embeddedTrip.notificationSentToDashboardFlag': updateExpenseData.notificationSentToDashboardFlag,
//         'embeddedTrip.embeddedTravelRequest': updateExpenseData.embeddedTravelRequest,
//         'embeddedTrip.embeddedCashAdvance': updateExpenseData.embeddedCashAdvance,
//       },
//     };
//      // Debugging: Log the filter and update objects
//     // console.log('Filter:', filter);
//     // console.log('Update:', update);
//     // Use the upsert option to create a new document if it doesn't exist
//     const options = { upsert: true, new: true };
      
//     // Perform the update
//     const updatedExpense = await Expense.findOneAndUpdate(filter, update, options);

//     return res.status(200).json(updatedExpense);
//   } catch (error) {
//     console.error('Error updating Expense:', error);
//     return res.status(500).json({ error: 'Internal Server Error', message: 'An internal server error occurred.' });
//   }
// };

// export { updateExpense };





// import modContainer from "../models/onboardingSchema.js";
// import dummyData from "../dummyData/mod.js";

// export const insertDummyData = async (data) => {
//   try {
//     // Check if tenantId and companyName exist in the database
//     const existingData = await modContainer.findOne({
//       'companyDetails.companyName': data.companyDetails.companyName,
//       'tenantId': data.tenantId,
//     });

//     if (existingData) {
//       // If data with the same tenantId and companyName exists, update the existing document
//       await modContainer.findOneAndUpdate(
//         {
//           'companyDetails.companyName': data.companyDetails.companyName,
//           'tenantId': data.tenantId
//         },
//         data
//       );
//       console.log("Existing document updated successfully.");
//     } else {
//       // If data doesn't exist, create a new document
//       await modContainer.create(data);
//       console.log("New document created and inserted successfully.");
//     }
//   } catch (error) {
//     console.error("Error inserting/updating dummy data:", error);
//   }
// };

// // Call the insertDummyData function with your imported dummy data
// insertDummyData(dummyData);
