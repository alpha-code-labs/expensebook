import axios from "axios";
import dotenv from 'dotenv';

// Load environment variables from a .env file
dotenv.config()

export const approveAddALegToTrip = async (changesMade) => {
 const tripBaseUrl = process.env.TRIP_BASE_URL ;
 const extendedUrl = 'approve/addleg';

 const currentTripUrl = `${tripBaseUrl}${extendedUrl}`;
 
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
   
 console.log('this is what i sent to trip:',changesMade)
//  tripUpdates.push(updateTripData); // Push the updates to the tripUpdates array
  
 try {
   const response = await axios.post(currentTripUrl, changesMade); // Make a POST request to send the accumulated updates

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

export const rejectAddALegToTrip = async (changesMade) => {
    const tripBaseUrl = process.env.TRIP_BASE_URL ;
    const extendedUrl = 'reject/addleg';
   
    const currentTripUrl = `${tripBaseUrl}${extendedUrl}`;
    
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
      
    console.log('this is what i sent to trip:',changesMade)
   //  tripUpdates.push(updateTripData); // Push the updates to the tripUpdates array
     
    try {
      const response = await axios.post(currentTripUrl, changesMade); // Make a POST request to send the accumulated updates
   
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


