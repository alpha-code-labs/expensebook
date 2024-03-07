import axios from 'axios';
import Trip from '../models/tripSchema.js';
// import { extractAndCompareData } from '../scheduler/extractAndCompareData.js';
// import { fetchAndProcessTravelRequests, fetchAndProcessCashAdvances, } from '../scheduler/extractAndCompareData.js';
//  import { fetchAndProcessTravelRequests} from '../scheduler/extractAndCompareData.js';

import dotenv from 'dotenv';

// Load environment variables from a .env file
dotenv.config();

// Function to create a new Trip instance
function createNewTrip(data) {
  return new Trip({
    tenantId: data.tenantId,
    tenantName: data.tenantName,
    companyName: data.companyName,
    userId: data.userId,
    tripPurpose: data.tripPurpose,
    tripStatus: 'upcoming',
    tripStartDate: data.tripStartDate,
    tripCompletionDate: data.tripCompletionDate,
    notificationSentToDashboardFlag: data.notificationSentToDashboardFlag,
    travelRequestData: data.travelRequestData,
    cashAdvancesData: data.cashAdvanceData,
  });
}

// // Function to update Expense microservice
// async function updateExpense(tripData) {
//   const expenseApiUrl = process.env.EXPENSE_API_URL;
//   try {
//     // Pass all variables from the trip data to updateExpenseData
//     const updateExpenseData = {
//       tenantId: tripData.tenantId,
//       tenantName: tripData.tenantName,
//       companyName: tripData.companyName,
//       userId: tripData.userId,
//       tripPurpose: tripData.tripPurpose,
//       tripStatus: 'upcoming',
//       tripStartDate: tripData.tripStartDate,
//       tripCompletionDate: tripData.tripCompletionDate,
//       notificationSentToDashboardFlag: tripData.notificationSentToDashboardFlag,
//       travelRequestData: tripData.travelRequestData,
//       cashAdvanceData: tripData.cashAdvanceData,
//     };

//     const response = await axios.post(expenseApiUrl, updateExpenseData);

// Function to update Expense microservice
async function updateExpense(tripDataArray) {
  const expenseApiUrl = process.env.EXPENSE_API_URL;
  const expenseUpdates = []; // Accumulate expense updates

  // Transform tripDataArray object into an array of updateExpenseData objects
  const updateExpenseData = {
    tenantId: tripDataArray.tenantId,
    tenantName: tripDataArray.tenantName,
    companyName: tripDataArray.companyName,
    userId: tripDataArray.userId,
    tripPurpose: tripDataArray.tripPurpose,
    tripStatus: 'upcoming',
    tripStartDate: tripDataArray.tripStartDate,
    tripCompletionDate: tripDataArray.tripCompletionDate,
    notificationSentToDashboardFlag: tripDataArray.notificationSentToDashboardFlag,
    travelRequestData: tripDataArray.travelRequestData,
    cashAdvanceData: tripDataArray.cashAdvanceData,
  };

  expenseUpdates.push(updateExpenseData); // Push the updates to the expenseUpdates array

  try {
    const response = await axios.post(expenseApiUrl, expenseUpdates); // Make a POST request to send the accumulated updates

    if (response.status >= 200 && response.status < 300) {
      console.log('Expense updated successfully');
      // You can log or handle a successful response here
    } else {
      // Handle unexpected response status
      console.error('Unexpected response status:', response.status);
      console.error('Response Data:', response.data);
      // Handle the error appropriately
    }
  } catch (error) {
    console.error('Error updating Expense:', error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Handle Axios error with a response
        console.error('Response Status:', error.response.status);
        console.error('Response Data:', error.response.data);
        // Handle the error appropriately
      } else if (error.request) {
        console.error('No response received from the server');
        // Handle the error appropriately
      } else {
        console.error('Axios error without a request');
        // Handle the error appropriately
      }
    } else {
      console.error('Non-Axios exception:', error.message);
      // Handle the error appropriately
    }
  }
}


export const oldCreateTrip = async () => {
  try {
    const { uniqueTravelRequests, travelRequestMap } = await fetchAndProcessTravelRequests();
    const { cashAdvances } = await cashAdvances();

    const newTrips = [];
    const updateExpensePromises = [];

    for (const travelRequestId of uniqueTravelRequests) {
      const travelRequestData = travelRequestMap.get(travelRequestId);
      const cashAdvanceData = cashAdvances.get(travelRequestId);

      const existingTrip = await Trip.findOne({
        'travelRequestData.tenantId': travelRequestData.tenantId,
        'travelRequestData.travelRequestId': travelRequestId,
      });

      if (existingTrip) {
        existingTrip.tripPurpose = travelRequestData.tripPurpose;
        existingTrip.tripStartDate = travelRequestData.earliestDateTime;
        existingTrip.tripCompletionDate = travelRequestData.travelCompletionDate;
        existingTrip.travelRequestData = travelRequestData;
        existingTrip.cashAdvancesData = cashAdvanceData;

        // Check and update isSentToExpense for existing trips
        if (existingTrip.isSentToExpense === true) {
          const updatePromise = updateExpense(existingTrip);
          await updatePromise.then(() => {
            console.log('Expense updated successfully');
          }).catch((error) => {
            console.error('Error updating expense:', error);
          });

          updateExpensePromises.push(updatePromise);
        }

      } else {
        const newTripData = {
          tenantId: travelRequestData.tenantId,
          tenantName: travelRequestData.tenantName,
          companyName: travelRequestData.companyName,
          userId: travelRequestData.createdFor ? travelRequestData.createdFor : travelRequestData.createdBy,
          tripPurpose: travelRequestData.tripPurpose,
          tripStartDate: travelRequestData.earliestDateTime,
          tripCompletionDate: travelRequestData.travelCompletionDate,
          travelRequestData: travelRequestData,
          cashAdvancesData: cashAdvanceData,
        };

        const newTrip = createNewTrip(newTripData);
        newTrips.push(newTrip);

        // Send a copy to expense for new trip creation
        const updatePromise = updateExpense(newTripData);
        await updatePromise.then(() => {
          console.log('Expense updated successfully');
          newTripData.isSentToExpense = true;
        }).catch((error) => {
          console.error('Error updating expense:', error);
        });

        updateExpensePromises.push(updatePromise);
      }
    }

    if (newTrips.length === 0) {
      console.log('No trips to create.');
      return;
    }

    await Promise.all(updateExpensePromises);

    const savedTrips = await Trip.insertMany(newTrips);
    console.log('Trips created or updated successfully:', savedTrips);
  } catch (error) {
        console.error('Error creating or updating trips:', error);
        // Handle specific error types with informative error messages
        if (error instanceof SyntaxError) {
          console.error('Invalid request syntax:', error.message);
        } else if (error.name === 'ValidationError') {
          console.error('Data validation failed:', error.details);
        } else if (error.name === 'MongoError' && error.code === 11000) {
          console.error('Duplicate data detected.');
        } else if (error.message === 'No upcoming trips to create') {
          console.error('No upcoming trips to create.');
        } else {
          console.error('An internal server error occurred:', error.message);
        }
      }
};
    

// export const createTrip = async () => {
//   try {
//     const { uniqueTravelRequests, travelRequestMap, } = await fetchAndProcessTravelRequests();
//     const { cashAdvancesMap } = await fetchAndProcessCashAdvances();
  
//     const newTrips = [];
//     const updateExpensePromises = [];

//     for (const travelRequestId of uniqueTravelRequests) {
//       const travelRequestData = travelRequestMap.get(travelRequestId);
//       const cashAdvanceData = cashAdvancesMap.get(travelRequestId);

//       // Check if a Trip with the same tenantId and travelRequestId exists
//       const existingTrip = await Trip.findOne({
//         'travelRequestData.tenantId': travelRequestData.tenantId,
//         'travelRequestData.travelRequestId': travelRequestId,
//       });

//       console.log('Travel Request Data:', travelRequestData); // Log travel request data
//        console.log('Cash Advance Data:', cashAdvanceData); // Log cash advance data
//       if (existingTrip && !existingTrip.isSentToExpense) {
//         // Update the existing Trip
//         existingTrip.tripPurpose = travelRequestData.tripPurpose;
//         existingTrip.tripStartDate = travelRequestData.earliestDateTime; // Updated tripStartDate
//         existingTrip.tripCompletionDate = travelRequestData.travelCompletionDate;
//         existingTrip.travelRequestData = travelRequestData;
//         existingTrip.cashAdvanceData = cashAdvanceData;

//          // Check and update isSentToExpense if it exists in the input
//         if (isSentToExpense !== undefined) {
//         existingTrip.isSentToExpense = isSentToExpense;
//         }

//         const updatePromise = updateExpense(existingTrip);

//          // Wait for the updateExpense to complete
//          await updatePromise.then(() => {
//           console.log('Expense updated successfully');
//           // Update isSentToExpense to true after successful updateExpense
//           existingTrip.isSentToExpense = true;
//       }).catch((error) => {
//           // Handle error if updateExpense fails
//           console.error('Error updating expense:', error);
//       });

//       updateExpensePromises.push(updatePromise);
      
//         // Push the updateExpense promise into the array
//         // updateExpensePromises.push(updateExpense(existingTrip));
//         console.log('Existing Trip Found:', existingTrip);

//   } else {
//         // Create a new Trip
//         const newTripData = {
//           tenantId: travelRequestData.tenantId,
//           tenantName: travelRequestData.tenantName,
//           companyName: travelRequestData.companyName,
//           userId: travelRequestData.createdFor ? travelRequestData.createdFor:travelRequestData.createdBy,
//          // If 'createdFor' exists in 'travelRequestData', 'userId' will be assigned 'createdFor', otherwise, it will be 'createdBy'.
//           tripPurpose: travelRequestData.tripPurpose,
//           tripStartDate: travelRequestData.earliestDateTime, // Updated tripStartDate
//           tripCompletionDate: travelRequestData.travelCompletionDate,
//           travelRequestData: travelRequestData,
//           cashAdvanceData: cashAdvanceData,
//         };
//         console.log('Creating New Trip...');

//          // Create the new trip
//          const newTrip = createNewTrip(newTripData);
//          newTrips.push(newTrip);
 
//          // Send a copy to expense for new trip creation
//          const updatePromise = updateExpense(newTripData);
 
//          // Wait for the updateExpense to complete
//          await updatePromise.then(() => {
//              console.log('Expense updated successfully');
//              // Update isSentToExpense to true after successful updateExpense
//              newTripData.isSentToExpense = true;
//          }).catch((error) => {
//              // Handle error if updateExpense fails
//              console.error('Error updating expense:', error);
//          });
 
//          updateExpensePromises.push(updatePromise);
//      }
//  }
//     //     const newTrip = createNewTrip(newTripData);
//     //     newTrips.push(newTrip);

//     //     // Push the updateExpense promise into the array
//     //     updateExpensePromises.push(updateExpense(newTripData));
//     //   }
//     // }

//     if (newTrips.length === 0) {
//       // Handle the case when no trips are created
//       console.log('No trips to create.');
//       return;
//     }

//     // Wait for all updateExpense calls to complete
//     await Promise.all(updateExpensePromises);

//     // Insert the new trips into the database
//     const savedTrips = await Trip.insertMany(newTrips);
//     console.log('Trips created or updated successfully:', savedTrips);
//   } catch (error) {
//     console.error('Error creating or updating trips:', error);
//     // Handle specific error types with informative error messages
//     if (error instanceof SyntaxError) {
//       console.error('Invalid request syntax:', error.message);
//     } else if (error.name === 'ValidationError') {
//       console.error('Data validation failed:', error.details);
//     } else if (error.name === 'MongoError' && error.code === 11000) {
//       console.error('Duplicate data detected.');
//     } else if (error.message === 'No upcoming trips to create') {
//       console.error('No upcoming trips to create.');
//     } else {
//       console.error('An internal server error occurred:', error.message);
//     }
//   }
// };


// let userId; 
// if (travelRequestData.createdFor) {
//   userId = travelRequestData.createdFor;
// } else {
//   userId = travelRequestData.createdBy;
// }

// export const createTrip = async () => {
//   try {
//     // Fetch and process data
//     // const processedData = await extractAndCompareData();
//     // console.log(processedData);
//      // Fetch and process data
//      const { uniqueTravelRequests, travelRequestMap, travelRequestsData } = await fetchAndProcessTravelRequests();
//      const { cashAdvancesMap , cashAdvancesData} = await fetchAndProcessCashAdvances();
//      console.log(travelRequestsData);
//     const newTrips = [];
//     const updateExpensePromises = [];

//     for (const travelRequestId of processedData.uniqueTravelRequests) {
//       const travelRequestData = processedData.travelRequestMap.get(travelRequestId);
//       const cashAdvanceData = processedData.cashAdvancesMap.get(travelRequestId);

//       // Check if a Trip with the same tenantId and travelRequestId exists
//       const existingTrip = await Trip.findOne({
//         'travelRequestData.tenantId': travelRequestData.tenantId,
//         'travelRequestData.travelRequestId': travelRequestId,
//       });

//       if (existingTrip) {
//         // Update the existing Trip
//         existingTrip.tripPurpose = travelRequestData.tripPurpose;
//         // existingTrip.tripStartDate = travelRequestData.travelBookingDate;
//         existingTrip.tripStartDate = travelRequestData.earliestDateTime;
//         existingTrip.tripCompletionDate = travelRequestData.travelCompletionDate;
//         existingTrip.travelRequestData = travelRequestData;
//         existingTrip.cashAdvanceData = cashAdvanceData;

//         // Push the updateExpense promise into the array
//         updateExpensePromises.push(updateExpense(existingTrip));
//       } else {
//         // Create a new Trip
//         const newTripData = {
//           tenantId: travelRequestData.tenantId,
//           tenantName: travelRequestData.tenantName,
//           companyName: travelRequestData.companyName,
//           userId: travelRequestData.createdBy,
//           tripPurpose: travelRequestData.tripPurpose,
//           tripStartDate: travelRequestData.earliestDateTime, //Earliest travel line item 
//           tripCompletionDate: travelRequestData.travelCompletionDate,
//           travelRequestData: travelRequestData,
//           cashAdvanceData: cashAdvanceData,
//         };

//         const newTrip = createNewTrip(newTripData);
//         newTrips.push(newTrip);

//         // Push the updateExpense promise into the array
//         updateExpensePromises.push(updateExpense(newTripData));
//       }
//     }

//     if (newTrips.length === 0) {
//       // Handle the case when no trips are created
//       console.log('No trips to create.');
//       return;
//     }

//     // Wait for all updateExpense calls to complete
//     await Promise.all(updateExpensePromises);

//     // Insert the new trips into the database
//     const savedTrips = await Trip.insertMany(newTrips);
//     console.log('Trips created or updated successfully:', savedTrips);
//   } catch (error) {
//     console.error('Error creating or updating trips:', error);
//     // Handle specific error types with informative error messages
//     if (error instanceof SyntaxError) {
//       console.error('Invalid request syntax:', error.message);
//     } else if (error.name === 'ValidationError') {
//       console.error('Data validation failed:', error.details);
//     } else if (error.name === 'MongoError' && error.code === 11000) {
//       console.error('Duplicate data detected.');
//     } else if (error.message === 'No upcoming trips to create') {
//       console.error('No upcoming trips to create.');
//     } else {
//       console.error('An internal server error occurred:', error.message);
//     }
//   }
// };






// import axios from 'axios';
// import { Trip } from '../models/tripSchema.js';
// import { extractAndCompareData } from '../scheduler/extractAndCompareData.js';
// import dotenv from 'dotenv'; 

// // Load environment variables from a .env file
// dotenv.config();

// // Constants for HTTP status codes
// const HTTP_STATUS = {
//   NO_CONTENT: 204,
//   CREATED: 201,
//   BAD_REQUEST: 400,
//   VALIDATION_ERROR: 422,
//   CONFLICT: 409,
//   NOT_FOUND: 404,
//   INTERNAL_ERROR: 500,
// };

// // Function to create a new Trip instance
// function createNewTrip(data) {
//   return new Trip({
//     tenantId: data.tenantId,
//     userId: data.userId,
//     tripPurpose: data.tripPurpose,
//     tripStatus: 'upcoming',
//     tripStartDate: data.tripStartDate,
//     tripCompletionDate: data.tripCompletionDate,
//     notificationSentToDashboardFlag: data.notificationSentToDashboardFlag,
//     travelRequestData: data.travelRequestData,
//     cashAdvanceData: data.cashAdvanceData,
//   });
// }

// // Function to update Expense microservice
// async function updateExpense(tripData) {
//   const expenseApiUrl = process.env.EXPENSE_API_URL;
//   try {
//     // Pass all variables from the trip data to updateExpenseData
//     const updateExpenseData = {
//       tenantId: tripData.tenantId,
//       userId: tripData.userId,
//       tripPurpose: tripData.tripPurpose,
//       tripStatus: 'upcoming',
//       tripStartDate: tripData.tripStartDate,
//       tripCompletionDate: tripData.tripCompletionDate,
//       notificationSentToDashboardFlag: tripData.notificationSentToDashboardFlag,
//       travelRequestData: tripData.travelRequestData,
//       cashAdvanceData: tripData.cashAdvanceData,
//     };

//     const response = await axios.post(expenseApiUrl, updateExpenseData);

//     if (response.status >= 200 && response.status < 300) {
//       console.log('Expense updated successfully');
//       // You can log or handle a successful response here
//     } else {
//       // Handle unexpected response status
//       console.error('Unexpected response status:', response.status);
//       console.error('Response Data:', response.data);
//       // Handle the error appropriately
//     }
//   } catch (error) {
//     console.error('Error updating Expense:', error);

//     if (axios.isAxiosError(error)) {
//       if (error.response) {
//         // Handle Axios error with a response
//         console.error('Response Status:', error.response.status);
//         console.error('Response Data:', error.response.data);
//         // Handle the error appropriately
//       } else if (error.request) {
//         console.error('No response received from the server');
//         // Handle the error appropriately
//       } else {
//         console.error('Axios error without a request');
//         // Handle the error appropriately
//       }
//     } else {
//       console.error('Non-Axios exception:', error.message);
//       // Handle the error appropriately
//     }
//   }
// }

// export const createTrip = async (processedData) => {
//   try {
//     // Fetch and process data
//     const newTrips = [];
//     const updateExpensePromises = [];

//     for (const travelRequestId of processedData.uniqueTravelRequests) {
//       const travelRequestData = processedData.travelRequestMap.get(travelRequestId);
//       const cashAdvanceData = processedData.cashAdvancesMap.get(travelRequestId);
//       const newTripData = {
//         tenantId: travelRequestData.tenantId,
//         userId: travelRequestData.createdBy,
//         tripPurpose: travelRequestData.tripPurpose,
//         tripStartDate: travelRequestData.travelBookingDate,
//         tripCompletionDate: travelRequestData.travelCompletionDate,
//         travelRequestData: travelRequestData,
//         cashAdvanceData: cashAdvanceData,
//       };
//       const newTrip = createNewTrip(newTripData);
//       newTrips.push(newTrip);

//       // Push the updateExpense promise into the array
//       updateExpensePromises.push(updateExpense(newTripData));
//     }

//     if (newTrips.length === 0) {
//       // Handle the case when no trips are created
//       console.log('No trips to create.');
//       return;
//     }

//     // Wait for all updateExpense calls to complete
//     await Promise.all(updateExpensePromises);

//     // Insert the new trips into the database
//     const savedTrips = await Trip.insertMany(newTrips);
//     console.log('Trips created successfully:', savedTrips);
//   } catch (error) {
//     console.error('Error creating trips:', error);
//     // Handle specific error types with informative error messages
//     if (error instanceof SyntaxError) {
//       console.error('Invalid request syntax:', error.message);
//     } else if (error.name === 'ValidationError') {
//       console.error('Data validation failed:', error.details);
//     } else if (error.name === 'MongoError' && error.code === 11000) {
//       console.error('Duplicate data detected.');
//     } else if (error.message === 'No upcoming trips to create') {
//       console.error('No upcoming trips to create.');
//     } else {
//       console.error('An internal server error occurred:', error.message);
//     }
//   }
// };














// import { Trip } from '../models/tripSchema.js';
// import { extractAndCompareData } from '../scheduler/extractAndCompareData.js';

// export const createTrip = async (req, res) => {
//   try {
//     // Fetch and process data
//     const processedData = await extractAndCompareData();

//     // Create an array to hold the new Trip instances
//     const newTrips = [];

//     // Iterate through unique travel requests
//     for (const travelRequestId of processedData.uniqueTravelRequests) {
//       const travelRequestData = processedData.travelRequestMap.get(travelRequestId);
//       const cashAdvanceData = processedData.cashAdvancesMap.get(travelRequestId);

//       // Create a new Trip instance
//       const newTrip = new Trip({
//         tenantId: travelRequestData.tenantId,
//         userId: travelRequestData.createdBy,
//         tripPurpose: travelRequestData.tripPurpose,
//         tripStatus: 'upcoming',
//         tripStartDate: travelRequestData.travelBookingDate,
//         tripCompletionDate: travelRequestData.travelCompletionDate,
//         notificationSentToDashboardFlag: false,
//         travelRequestData: travelRequestData,
//         cashAdvanceData: cashAdvanceData,
//       });

//       newTrips.push(newTrip);
//     }

//     if (newTrips.length === 0) {
//       // No new trips to create, return an appropriate response
//       return res.status(204).send(); // 204 No Content
//     }

//     // Save all new trips to MongoDB
//     const savedTrips = await Trip.insertMany(newTrips);

//     // Return a success response with the created trips
//     return res.status(201).json(savedTrips);
//   } catch (error) {
//     console.error('Error creating trips:', error);

//     // Handle specific error types and provide meaningful responses
//     if (error instanceof SyntaxError) {
//       return res.status(400).json({ error: 'Bad Request', code: 'BAD_REQUEST', message: 'Invalid request syntax.' });
//     } else if (error.name === 'ValidationError') {
//       return res.status(422).json({ error: 'Validation Error', code: 'VALIDATION_ERROR', message: 'Data validation failed.', details: error.details });
//     } else if (error.name === 'MongoError' && error.code === 11000) {
//       return res.status(409).json({ error: 'Conflict', code: 'CONFLICT', message: 'Duplicate data detected.' });
//     } else if (error.message === 'No upcoming trips to create') {
//       return res.status(404).json({ error: 'Not Found', code: 'NOT_FOUND', message: 'No upcoming trips to create.' });
//     }

//     // For unhandled errors, provide a generic error response
//     return res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_SERVER_ERROR', message: 'An internal server error occurred.' });
//   }
// };
import { travelRequests, cashAdvances } from '../dummyData/dummyData.js';

export const dummyDataTrip = async (req, res) => {
  try {
    const { tenantId, travelRequestId } = req.params;

    // Find the trip based on tenantId and travelRequestId
    let tripInstance = await Trip.findOne({
      'travelRequestData.tenantId': tenantId,
      'travelRequestData.travelRequestId': travelRequestId,
    });

    if (tripInstance) {
      // Update existing trip
      tripInstance.travelRequestData = travelRequests;
      tripInstance.cashAdvancesData = cashAdvances;
    } else {
      // Create a new trip
      tripInstance = new Trip({
        tenantId: tenantId,
        tripId:travelRequestId,
        travelRequestData: travelRequests, 
        cashAdvancesData: cashAdvances,
        tripCompletionDate: new Date(),
        tripStartDate: new Date(),
        tripStatus: 'upcoming',
        companyName: 'BambooHr',
        tenantName: 'BambooHr',
      });
    }

    // Save the trip to the database
    await tripInstance.save();

    // Send meaningful success response
    res.status(201).json({ message: 'Trip created or updated successfully.' });
  } catch (error) {
    // Consistent error handling
    console.error('An error occurred:', error.message);
    res.status(500).json({ error: 'Internal server error: createTrip' });
  }
};
