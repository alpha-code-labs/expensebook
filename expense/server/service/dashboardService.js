import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the Dashboard microservice URL from environment variables
const dashboardMicroserviceURL = process.env.DASHBOARD_API_URL;

// Dashboard Service in Expense Microservice
const dashboardService = {
  handleDashboardAPICalls: async (tripNumber) => {
    try {
      // Construct the URL to handle specific Dashboard API calls in the Expense microservice
      const specificDashboardURL = `${dashboardMicroserviceURL}/specificEndpoint`;

      // Make an asynchronous API call to handle the Dashboard request
      await axios.post(specificDashboardURL, { tripNumber });

      // Return a success message or appropriate response
      return { success: true, message: 'Dashboard API call handled successfully' };
    } catch (error) {
      // Handle errors
      console.error('Error handling Dashboard API call:', error);
      return { success: false, error: 'Failed to handle Dashboard API call' };
    }
  },
};

// Export the Dashboard service in Expense microservice
export default dashboardService;
