import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from a .env file
dotenv.config();

export async function upcomingTripCancelledToTravel(cancelHeaderLevel) {
  const travelBaseUrl = process.env.TRAVEL_BASE_URL; 
  const extendedUrl = '/cancel/header'; 

  const currentTravelUrl = `${travelBaseUrl}${extendedUrl}`;

//   const travelUpdates = [];
  
//   const cancelHeaderLevel = {
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
    const response = await axios.post(currentTravelUrl, cancelHeaderLevel);

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

export const tripLineItemCancelledToTravelService = async (cancelItineraryLineItem) => {
   try {
    const travelBaseUrl = process.env.TRAVEL_BASE_URL;
    const extendedUrl = '/cancel/lineitem';
    const currentTravelUrl = `${travelBaseUrl}${extendedUrl}`;

    const response = await axios.post(currentTravelUrl,cancelItineraryLineItem);

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

export const recoveryAtHeaderLevelToTravel = async (headerLevelRecoveryDone) => {
    try{
        const travelBaseUrl = process.env.TRAVEL_BASE_URL;
        const extendedUrl = '/recovery/header';

        const currentTravelUrl = `${travelBaseUrl}${extendedUrl}`;

        const response = await axios.post(currentTravelUrl,headerLevelRecoveryDone);
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


// recovery at line item level
export const recoveryAtLineItemLevelToTravel = async (lineItemStatusUpdate) => {
    try{
        const travelBaseUrl = process.env.TRAVEL_BASE_URL;
        const extendedUrl = '/recovery/lineitem';

        const currentTravelUrl = `${travelBaseUrl}${extendedUrl}`;

        const response = await axios.post(currentTravelUrl,lineItemStatusUpdate);
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