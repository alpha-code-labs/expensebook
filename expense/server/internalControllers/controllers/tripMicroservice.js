import axios from "axios";
import dotenv from 'dotenv';


dotenv.config();

// on save line item, send the expense save line item to trip 
export const onSaveLineItemToTrip = async (updatedExpenseReport) => {
    try{
    const tripBaseUrl = process.env.TRIP_BASE_URL;
    const extendedUrl = '/expensereport/saveline';

    const currentUrl = `${tripBaseUrl}${extendedUrl}`;

    const response = await axios.post(currentUrl, expense, totalCashAmount, totalExpenseAmount, remainingCash);

    if (response.status >= 200 && response.status < 300) {
    console.log('Trip updated successfully in Trip Microservice');
        // You can log or handle a successful response here
      } else {
        // Handle unexpected response status
        console.error('Unexpected response status:', response.status);
        console.error('Response Data:', response.data);
        // Handle the error appropriately
      }
    } catch (error) {
      console.error('Error updating Trip in Trip Microservice:', error);
   
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

export const onSaveAsDraftExpenseHeaderToTrip = async (draftExpenseReport) => {
    try{
    const tripBaseUrl = process.env.TRIP_BASE_URL;
    const extendedUrl = '/expensereport/saveline';

    const currentUrl = `${tripBaseUrl}${extendedUrl}`;

    const response = await axios.post(currentUrl, expense, totalCashAmount, totalExpenseAmount, remainingCash);

    if (response.status >= 200 && response.status < 300) {
    console.log('Trip updated successfully in Trip Microservice');
        // You can log or handle a successful response here
      } else {
        // Handle unexpected response status
        console.error('Unexpected response status:', response.status);
        console.error('Response Data:', response.data);
        // Handle the error appropriately
      }
    } catch (error) {
      console.error('Error updating Trip in Trip Microservice:', error);
   
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