import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export async function dashboardToCashMicroservice(addLegToTrip) {
  const cashBaseUrl = process.env.CASH_BASE_URL; // Change the variable name
  const extendedUrl = '/addleg'; 

  const currentCashUrl = `${cashBaseUrl}${extendedUrl}`; // Change the variable name

  const cashUpdates = []; // Change the variable name
  
  const updateCashData = {
    tenantId: addLegToTrip.tenantId,
    tenantName: addLegToTrip.tenantName,
    companyName: addLegToTrip.companyName,
    tripPurpose: addLegToTrip.embeddedTrip.tripPurpose,
    tripStatus: addLegToTrip.embeddedTrip.tripStatus,
    tripStartDate: addLegToTrip.embeddedTrip.tripStartDate,
    tripCompletionDate: addLegToTrip.embeddedTrip.tripCompletionDate,
    itinerary: addLegToTrip.itinerary,
  };

  console.log('This is what I sent to the cash:', updateCashData); // Change the log message
  cashUpdates.push(updateCashData);

  try {
    const response = await axios.post(currentCashUrl, cashUpdates); // Change the variable name

    if (response.status >= 200 && response.status < 300) {
      console.log('Cash updated successfully in cash Microservice'); // Change the log message
      // You can log or handle a successful response here
    } else {
      // Handle unexpected response status
      console.error('Unexpected response status:', response.status);
      console.error('Response Data:', response.data);
      // Handle the error appropriately
    }
  } catch (error) {
    console.error('Error updating cash in cash Microservice:', error); // Change the log message

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
