// Import necessary modules
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the Approval API URL from environment variables
const approval_api_url = process.env.APPROVAL_API_URL;

// Approval Service in Approval Microservice
const approvalService = {
  createApproval: async (approvalData) => {
    try {
      const createApprovalURL = `${approval_api_url}/createApproval`;

      // Make an asynchronous API call to create an Approval
      const response = await axios.post(createApprovalURL, approvalData);

      // Return the response from the API call
      return response.data;
    } catch (error) {
      // Handle errors
      console.error('Error creating Approval:', error);
      throw new Error('Failed to create Approval');
    }
  },

  // Similarly, define methods for other CRUD operations like read, update, and delete
  // read Approval, updateApproval, deleteApproval, etc.
};

// Export the Approval service in Approval microservice
export default approvalService;
