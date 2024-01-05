import axios from "axios";
import dotenv from 'dotenv';

// Load environment variables from a .env file
dotenv.config()

export const sendTravelApprovedToTravelMicroservice = async (tenantId, empId, travelRequestId, updatedApprovers) => {
  try {
    const travelBaseUrl = process.env.TRAVEL_BASE_URL;
    const extendedUrl = '/ts-approved';

    const currentTravelUrl = `${travelBaseUrl}${extendedUrl}`;

    // Find the index of the matched empId in the updatedApprovers array
    const matchedIndex = updatedApprovers.findIndex((approver) => approver.empId === empId);

    if (matchedIndex !== -1) {
      updatedApprovers[matchedIndex].status = 'approved';
    }

    // Prepare the data to be sent to the Travel Microservice
    const formattedData = {
      tenantId,
      travelRequestId,
      approvers: updatedApprovers,
    };

    const response = await axios.post(currentTravelUrl, formattedData, { retry: 5, retryInterval: 3000 });

    handleResponse(response);
  } catch (error) {
    handleSendError(error);
  }
};

const handleResponse = (response) => {
  if (response.status >= 200 && response.status < 300) {
    // Log or handle a successful response here
  } else {
    handleUnexpectedResponseStatus(response);
  }
};

const handleUnexpectedResponseStatus = (response) => {
  console.error('Unexpected response status:', response.status);
  console.error('Response Data:', response.data);
  // Handle the error appropriately
};

const handleSendError = (error) => {
  logger.error('Error sending changes to Travel Microservice: standalone travel request - status-approved failed', error.message);
  if (axios.isAxiosError(error)) {
    handleAxiosError(error);
  } else {
    console.error('Non-Axios exception:', error.message);
    // Handle the error appropriately
  }
};

const handleAxiosError = (error) => {
  if (error.response) {
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
};


   // Make an API call to the Travel Microservice with the formatted data
export const approveAddALegToTravel = async (changesMade) => {
 const travelBaseUrl = process.env.TRIP_BASE_URL ;
 const extendedUrl = 'approve/addleg';

 const currentTravelUrl = `${travelBaseUrl}${extendedUrl}`;
 
//  const tripUpdates = []; 

//  const updateTripData = {
//      tenantId: addLegToTrip.tenantId,
//      tenantName: addLegToTrip.tenantName,
//      companyName: addLegToTrip.companyName,
//      tripStatus: addLegToTrip.tripStatus,
//      tripStartDate: addLegToTrip.tripStartDate,
//      tripCompletionDate: addLegToTrip.tripCompletionDate,
//      itinerary: addLegToTrip.itinerary,
//    };
   
 console.log('this is what i sent to travel:',changesMade)
//  tripUpdates.push(updateTripData); // Push the updates to the tripUpdates array
  
 try {
   const response = await axios.post(currentTravelUrl, changesMade); // Make a POST request to send the accumulated updates

   if (response.status >= 200 && response.status < 300) {
     // console.log('Trip updated successfully in Trip Microservice');
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

// reject add a leg
export const rejectAddALegToTravel = async (changesMade) => {
    const travelBaseUrl = process.env.TRIP_BASE_URL ;
    const extendedUrl = 'reject/addleg';
   
    const currentTravelUrl = `${travelBaseUrl}${extendedUrl}`;
      
    console.log('this is what i sent to travel:',changesMade)
   //  tripUpdates.push(updateTripData); // Push the updates to the tripUpdates array
     
    try {
      const response = await axios.post(currentTravelUrl, changesMade); // Make a POST request to send the accumulated updates
   
      if (response.status >= 200 && response.status < 300) {
        // console.log('Trip updated successfully in Trip Microservice');
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


