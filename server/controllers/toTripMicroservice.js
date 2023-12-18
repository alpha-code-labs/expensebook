import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from a .env file
dotenv.config();

export async function dashboardToTripMicroservice(addLegToTrip) {
    const tripBaseUrl = process.env.TRIP_BASE_URL ;
    const extendedUrl = '/addleg';

    const currentTripUrl = `${tripBaseUrl}${extendedUrl}`;
    
    const tripUpdates = []; 
  
    const updateTripData = {
        tenantId: addLegToTrip.tenantId,
        tenantName: addLegToTrip.tenantName,
        companyName: addLegToTrip.companyName,
        userId: {
          empId: addLegToTrip.embeddedTrip.userId.empId,
          name: addLegToTrip.embeddedTrip.userId.name,
        },
        tripPurpose: addLegToTrip.embeddedTrip.tripPurpose,
        tripStatus: addLegToTrip.embeddedTrip.tripStatus,
        tripStartDate: addLegToTrip.embeddedTrip.tripStartDate,
        tripCompletionDate: addLegToTrip.embeddedTrip.tripCompletionDate,
        notificationSentToDashboardFlag: addLegToTrip.embeddedTrip.notificationSentToDashboardFlag,
        embeddedTravelRequest: addLegToTrip.embeddedTrip.embeddedTravelRequest,
        embeddedCashAdvance: addLegToTrip.embeddedTrip.embeddedCashAdvance,
      };
      
     console.log('this is what i sent to trip:',updateTripData)
    tripUpdates.push(updateTripData); // Push the updates to the tripUpdates array
     
    try {
      const response = await axios.post(currentTripUrl, tripUpdates); // Make a POST request to send the accumulated updates
  
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
  

//   async function sendToTripMicroservice(tripDataArray) {
//     const tripApiUrl = process.env.TRIP_API_URL;
//     const tripUpdates = []; // Accumulate trip updates
  
//     const updateTripData = {
//       tenantId: tripDataArray.tenantId,
//       tenantName: tripDataArray.tenantName,
//       companyName: tripDataArray.companyName,
//       userId: tripDataArray.userId,
//       tripPurpose: tripDataArray.tripPurpose,
//       tripStatus: 'upcoming',
//       tripStartDate: tripDataArray.tripStartDate,
//       tripCompletionDate: tripDataArray.tripCompletionDate,
//       notificationSentToDashboardFlag: tripDataArray.notificationSentToDashboardFlag,
//       embeddedTravelRequest: tripDataArray.embeddedTravelRequest,
//       embeddedCashAdvance: tripDataArray.embeddedCashAdvance,
//     };
  
//     tripUpdates.push(updateTripData); // Push the updates to the tripUpdates array
  
//     try {
//       const response = await axios.post(tripApiUrl, tripUpdates); // Make a POST request to send the accumulated updates
  
//       if (response.status >= 200 && response.status < 300) {
//         console.log('Trip updated successfully');
//         // You can log or handle a successful response here
//       } else {
//         // Handle unexpected response status
//         console.error('Unexpected response status:', response.status);
//         console.error('Response Data:', response.data);
//         // Handle the error appropriately
//       }
//     } catch (error) {
//       console.error('Error updating Trip:', error);
  
//       if (axios.isAxiosError(error)) {
//         if (error.response) {
//           // Handle Axios error with a response
//           console.error('Response Status:', error.response.status);
//           console.error('Response Data:', error.response.data);
//           // Handle the error appropriately
//         } else if (error.request) {
//           console.error('No response received from the server');
//           // Handle the error appropriately
//         } else {
//           console.error('Axios error without a request');
//           // Handle the error appropriately
//         }
//       } else {
//         console.error('Non-Axios exception:', error.message);
//         // Handle the error appropriately
//       }
//     }
//   }
  