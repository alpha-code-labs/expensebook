// Import necessary modules
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the Expense API URL from environment variables
const expenseAPIURL = process.env.EXPENSE_API_URL;

// Expense Service in Expense Microservice
const expenseService = {
  createExpense: async (expenseData) => {
    try {
      const createExpenseURL = `${expenseAPIURL}/createExpense`;

      // Make an asynchronous API call to create an expense
      const response = await axios.post(createExpenseURL, expenseData);

      // Return the response from the API call
      return response.data;
    } catch (error) {
      // Handle errors
      console.error('Error creating expense:', error);
      throw new Error('Failed to create expense');
    }
  },

  // Similarly, define methods for other CRUD operations like read, update, and delete
  // readExpense, updateExpense, deleteExpense, etc.
};

// Export the Expense service in Expense microservice
export default expenseService;
