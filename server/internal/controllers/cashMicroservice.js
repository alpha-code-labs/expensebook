import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from a .env file
dotenv.config();

export async function upcomingTripCancelledToCash(cancelHeaderLevel) {
  const cashBaseUrl = process.env.CASH_BASE_URL; 
  const extendedUrl = '/cancel/header'; 

  const currentCashUrl = `${cashBaseUrl}${extendedUrl}`;

//   const travelUpdates = [];
  
//   const updateTravelData = {
//     tenantId: cancelHeaderLevel.tenantId,
//     tenantName: cancelHeaderLevel.tenantName,
//     companyName: cancelHeaderLevel.companyName,
//     tripStatus: cancelHeaderLevel.tripStatus,
//     tripStartDate: cancelHeaderLevel.tripStartDate,
//     itinerary: cancelHeaderLevel.itinerary,
//   };

  console.log('This is what I sent to the travel microservice:', cancelHeaderLevel);
//   travelUpdates.push(cancelHeaderLevel);

  try {
    const response = await axios.post(currentCashUrl, cancelHeaderLevel);

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


export async function tripLineItemCancelledToCashService(cancelItineraryLineItem){
    const cashBaseUrl = process.env.CASH_BASE_URL;
    const extendedUrl = '/cancel/lineitem';

   const currentCashUrl = `${cashBaseUrl}${extendedUrl}`;

   try{
     const response = await axios.post(currentCashUrl,cancelItineraryLineItem);

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

// recovery done at header level
export const recoveryAtHeaderLevelToCash = async (headerLevelRecoveryDone) => {
    try{
        const cashBaseUrl = process.env.CASH_BASE_URL;
        const extendedUrl = '/recovery/header';

        const currentCashUrl = `${cashBaseUrl}${extendedUrl}`;

        const response = await axios.post(currentCashUrl, headerLevelRecoveryDone);
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

//Recovery at line item level
export const recoveryAtLineItemLevelToCash = async (lineItemStatusUpdate) => {
  try{
    const cashBaseUrl = process.env.CASH_BASE_URL;
    const extendedUrl = '/recovery/lineitem';

    const currentCashUrl = `${cashBaseUrl}${extendedUrl}`;

    const response = await axios.post(currentCashUrl, lineItemStatusUpdate);
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
