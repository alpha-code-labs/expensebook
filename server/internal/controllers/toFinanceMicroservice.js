import axios from 'axios';
import dotenv from 'dotenv';

//Load environment variables from .env file
dotenv.config();

export const processSettlements = async (pendingCashAdvanceSettlements, pendingTravelExpenseSettlements, pendingNonTravelExpenseSettlements) => {
    const financeBaseUrl = process.env.FINANCE_BASE_URL;
    const extendedUrl = '/settlements'; 

    const currentFinanceUrl = `${financeBaseUrl}${extendedUrl}`;
    try {
        const response = await axios.post(currentFinanceUrl,pendingCashAdvanceSettlements, pendingTravelExpenseSettlements,pendingNonTravelExpenseSettlements );
    
        if (response.status >= 200 && response.status < 300) {
          console.log('finance updated successfully in finance Microservice');
          // You can log or handle a successful response here
        } else {
          // Handle unexpected response status
          console.error('Unexpected response status:', response.status);
          console.error('Response Data:', response.data);
          // Handle the error appropriately
        }
      } catch (error) {
        console.error('Error updating finance in finance Microservice:', error);
    
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