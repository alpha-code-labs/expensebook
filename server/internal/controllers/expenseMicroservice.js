import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from a .env file
dotenv.config();


export async function upcomingTripCancelledToExpense(cancelHeaderLevel) {
  const expenseBaseUrl = process.env.EXPENSE_BASE_URL; 
  const extendedUrl = '/cancel/header'; 

  const currentExpenseUrl = `${expenseBaseUrl}${extendedUrl}`;

 // const expenseUpdates = [];
  
//   const updateExpenseData = {
//     tenantId: updatedTrip.tenantId,
//     tenantName: updatedTrip.tenantName,
//     companyName: updatedTrip.companyName,
//     tripStatus: updatedTrip.tripStatus,
//     tripStartDate: updatedTrip.tripStartDate,
//     tripCompletionDate: updatedTrip.tripCompletionDate,
//     itinerary: updatedTrip.itinerary,
//   };

  console.log('This is what I sent to the expense:', cancelHeaderLevel);
  // expenseUpdates.push(cancelHeaderLevel);

  try {
    const response = await axios.post(currentExpenseUrl, cancelHeaderLevel);

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

// Itinerary Line item/ items cancelled in trip and sent to expense 
export async function TripLineItemCancelledToExpense(cancelItineraryLineItem){
  const expenseBaseUrl = process.env.EXPENSE_BASE_URL; 
  const extendedUrl = '/cancel/lineitem'; 

  const currentExpenseUrl = `${expenseBaseUrl}${extendedUrl}`;

  try {
    const response = await axios.post(currentExpenseUrl, cancelItineraryLineItem);

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


// Recovery done at header level
export const recoveryAtHeaderLevelToExpense = async (headerLevelRecoveryDone) =>{
  try{
    const expenseBaseUrl = process.env.EXPENSE_BASE_URL;
    const extendedUrl = '/recovery/header';

    const currentExpenseUrl = `${expenseBaseUrl}${extendedUrl}`;

    const response = await axios.post(currentExpenseUrl, headerLevelRecoveryDone);
    
    if (response.status >= 200 && response.status < 300) {
      console.log('Travel updated successfully in travel Microservice');
      // You can log or handle a successful response here
    } else {
      // Handle unexpected response status
      console.error('Unexpected response status:', response.status);
      console.error('Response Data:', response.data);
      // Handle the error appropriately
    }
  } catch (error) {
    console.error('Error updating travel in travel Microservice:', error);

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


export const recoveryAtLineItemLevelToExpense = async (lineItemStatusUpdate) => {

  try{
    const expenseBaseUrl = process.env.EXPENSE_BASE_URL;
    const extendedUrl = '/recovery/lineitem';

    const currentExpenseUrl = `${expenseBaseUrl}${extendedUrl}`;

    const response = await axios.post(currentExpenseUrl, lineItemStatusUpdate);
    
    if (response.status >= 200 && response.status < 300) {
      console.log('Travel updated successfully in travel Microservice');
      // You can log or handle a successful response here
    } else {
      // Handle unexpected response status
      console.error('Unexpected response status:', response.status);
      console.error('Response Data:', response.data);
      // Handle the error appropriately
    }
  } catch (error) {
    console.error('Error updating travel in travel Microservice:', error);

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

