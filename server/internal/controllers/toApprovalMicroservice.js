import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from a .env file
dotenv.config();

export async function dashboardToApprovalMicroservice(addLegToTrip) {
  const approvalBaseUrl = process.env.APPROVAL_BASE_URL; 
  const extendedUrl = '/addleg'; 

  const currentApprovalUrl = `${approvalBaseUrl}${extendedUrl}`;

  const approvalUpdates = [];
  
  const updateApprovalData = {
    tenantId: addLegToTrip.tenantId,
    tenantName: addLegToTrip.tenantName,
    companyName: addLegToTrip.companyName,
    tripPurpose: addLegToTrip.tripPurpose,
    tripStatus: addLegToTrip.tripStatus,
    tripStartDate: addLegToTrip.tripStartDate,
    tripCompletionDate: addLegToTrip.tripCompletionDate,
    itinerary: addLegToTrip.itinerary,
  };

  console.log('This is what I sent to the approval:', updateApprovalData);
  approvalUpdates.push(updateApprovalData);

  try {
    const response = await axios.post(currentApprovalUrl, approvalUpdates);

    if (response.status >= 200 && response.status < 300) {
      console.log('approval updated successfully in approval Microservice');
      // You can log or handle a successful response here
    } else {
      // Handle unexpected response status
      console.error('Unexpected response status:', response.status);
      console.error('Response Data:', response.data);
      // Handle the error appropriately
    }
  } catch (error) {
    console.error('Error updating approval in approval Microservice:', error);

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
