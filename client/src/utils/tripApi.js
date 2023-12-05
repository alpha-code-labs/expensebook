import axios from 'axios';

const BASE_URL = 'your_backend_api_url';

export const fetchTripById = async (tripId ,tenantId,empId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/${tenantId}/${empId}/${tripId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching trip data: ${error.message}`);
  }
};

export const cancelTrip = async (tripId ,tenantId,empId) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/${tenantId}/${empId}/${tripId}/cancel`);
    return response.data;
  } catch (error) {
    throw new Error(`Error canceling trip: ${error.message}`);
  }
};
