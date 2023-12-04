import axios from 'axios';
import dotenv from 'dotenv';
import pino from 'pino';
import pinoPretty from 'pino-pretty';

// Create a logger instance using pino with pretty printing
const logger = pino({
  prettifier: pinoPretty,
});

// Load environment variables
dotenv.config();

// Get the base Trip API URL from environment variables
const trip_API_URL = process.env.TRIP_API_URL;

// Expense Service in Expense Microservice for Trip Microservice interactions
export const tripService = {
  getTripAPIBaseURL: () => {
    return trip_API_URL;
  },

  // Function to handle API calls to the Trip Microservice for CRUD operations
  performTripAPICall: async (endpoint, method, data) => {
    try {
      const url = `${trip_API_URL}/${endpoint}`;

      // Validate if the Trip Microservice URL is available
      if (!trip_API_URL) {
        throw new Error('Trip Microservice URL is not defined');
      }

      // Make an API call based on method (GET, POST, PUT, DELETE)
      let response;
      switch (method) {
        case 'GET':
          response = await axios.get(url);
          break;
        case 'POST':
          response = await axios.post(url, data);
          break;
        case 'PUT':
          response = await axios.put(url, data);
          break;
        case 'DELETE':
          response = await axios.delete(url);
          break;
        default:
          throw new Error('Invalid HTTP method');
      }

      // Return the response from the API call
      return response.data;
    } catch (error) {
      // Handle errors
      logger.error(`Error performing Trip API call: ${error.message}`);
      throw new Error('Failed to perform Trip API call');
    }
  },
};

// New function to update Trip Microservice with modified data
updateTripMicroservice: async (expenseData) => {
  try {
    const endpoint = 'update'; 
    const method = 'PUT'; 

    // Make a call to the Trip Microservice endpoint to update data
    await tripService.performTripAPICall(endpoint, method, expenseData);

    console.log('Updated Trip Microservice with modified data successfully.');
  } catch (error) {
    console.error('Error updating Trip Microservice:', error);
    // Handle errors or implement further logic as needed
  }
},
};


// import axios from 'axios';
// import dotenv from 'dotenv';

// // Load environment variables
// dotenv.config();

// // Get the Trip Microservice URL from environment variables
// const tripMicroserviceURL = process.env.TRIP_MICROSERVICE_URL;

// // Expense Service in Expense Microservice
// const tripService = {
//   updateEmbeddedExpenseInTrip: async (tripId, updatedExpenseData) => {
//     try {
//       const updateExpenseURL = `${tripMicroserviceURL}/updateExpenseInTrip/${tripId}`;

//       // Make an asynchronous API call to update embedded expense in Trip microservice
//       const response = await axios.put(updateExpenseURL, updatedExpenseData);

//       // Return the response from the API call
//       return response.data;
//     } catch (error) {
//       // Handle errors
//       console.error('Error updating embedded expense in Trip:', error);
//       throw new Error('Failed to update embedded expense in Trip');
//     }
//   },
// };

// // Export the Expense service in Expense microservice
// export default tripService;
