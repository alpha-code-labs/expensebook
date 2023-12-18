import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from a .env file
dotenv.config();

export async function dashboardToExpenseMicroservice(addLegToTrip) {
  const expenseBaseUrl = process.env.EXPENSE_BASE_URL; 
  const extendedUrl = '/addleg'; 

  const currentExpenseUrl = `${expenseBaseUrl}${extendedUrl}`;

  const expenseUpdates = [];
  
  const updateExpenseData = {
    tenantId: addLegToTrip.tenantId,
    tenantName: addLegToTrip.tenantName,
    companyName: addLegToTrip.companyName,
    tripStatus: addLegToTrip.tripStatus,
    tripStartDate: addLegToTrip.tripStartDate,
    tripCompletionDate: addLegToTrip.tripCompletionDate,
    itinerary: addLegToTrip.itinerary,
  };

  console.log('This is what I sent to the expense:', updateExpenseData);
  expenseUpdates.push(updateExpenseData);

  try {
    const response = await axios.post(currentExpenseUrl, expenseUpdates);

    if (response.status >= 200 && response.status < 300) {
      // console.log('Expense updated successfully in Expense Microservice');
      // You can log or handle a successful response here
    } else {
      // Handle unexpected response status
      console.error('Unexpected response status:', response.status);
      console.error('Response Data:', response.data);
      // Handle the error appropriately
    }
  } catch (error) {
    console.error('Error updating Expense in Expense Microservice:', error);

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
