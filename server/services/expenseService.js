// Import necessary modules
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

// Get the base Expense API URL from environment variables
const expense_API_BASE_URL = process.env.EXPENSE_API_BASE_URL;

// Trip Service in Trip Microservice for Expense Microservice interactions
const tripExpenseService = {
  getExpenseAPIBaseURL: () => {
    return expense_API_BASE_URL;
  },

  // Function to handle API calls to the Expense Microservice for CRUD operations
  performExpenseAPICall: async (endpoint, method, data) => {
    try {
      const url = `${expense_API_BASE_URL}/${endpoint}`;

      // Validate if the Expense Microservice URL is available
      if (!expense_API_BASE_URL) {
        throw new Error('Expense Microservice URL is not defined');
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
      logger.error(`Error performing Expense API call: ${error.message}`);
      throw new Error('Failed to perform Expense API call');
    }
  },
};

// Export the Trip service in Trip Microservice for Expense Microservice interactions
export default tripExpenseService;
