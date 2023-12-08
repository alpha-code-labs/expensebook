import axios from 'axios';

const BASE_URL = 'http://localhost:8080/';

const retry = 3;
const retryDelay = 3000;

const errorMessages = {
  '404': 'Resource Not Found',
  '400': 'Cannot fetch data at the moment',
  '500': 'Internal Server Error',
  'request': 'Network Error',
  'else': 'Something went wrong. Please try again later'
};

const handleRequestError = (e) => {
  if (e.response) {
    // Response received from the server
    const status = e.response.status;
    if (status === 400 || status === 404 || status === 500) {
      throw new Error(errorMessages[status]);
    }
  } else if (e.request) {
    // Request was sent, but no response received
    throw new Error(errorMessages.request);
  } else {
    // Something else went wrong
    throw new Error(errorMessages.else);
  }
};

const axiosRetry = async (requestFunction, ...args) => {
  for (let i = 0; i < retry; i++) {
    try {
      return await requestFunction(...args);
    } catch (error) {
      if (i === retry - 1) {
        // Last attempt, throw the error
        throw error;
      }

      // Wait for the specified delay before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
};


export const tripFetchApi = async (tripId, tenantId, empId) => {
  const url = `${BASE_URL}/api/get/${tenantId}/${empId}/${tripId}`;

  try {
    const response = await axiosRetry(axios.get, url);
    return { data: response.data, error: null };
  } catch (error) {
    const errorObject = {
      status: error.response ? error.response.status : null,
      message: error.message,
    };

    return { data: null, error: errorObject };
  }
};



export const tripCancellationApi = async (tenantId, empId, tripId, itineraryId) => {
  const baseURL = `${BASE_URL}/api/${tenantId}/${empId}/${tripId}`;
  const url = itineraryId ? `${baseURL}/cancel/${itineraryId}` : `${baseURL}/cancel`;

  try {
    const requestData = itineraryId ? {} : { itineraryId }; // Send itineraryId only if it's present

    return await axiosRetry(axios.post, url, requestData);
  } catch (error) {
    handleRequestError(error);
    throw new Error(`Error canceling trip: ${error.message}`);
  }
};


export const tripRecovery = async (tenantId, empId, tripId, itineraryId) => {
  const baseURL = `${BASE_URL}/api/${tenantId}/${empId}/${tripId}`;
  const url = itineraryId ? `${baseURL}/recover/${itineraryId}` : `${baseURL}/recover`;

  try {
    const requestData = itineraryId ? {} : { itineraryId }; // Send itineraryId only if it's present

    return await axiosRetry(axios.post, url, requestData);
  } catch (error) {
    handleRequestError(error);
    throw new Error(`Error canceling trip: ${error.message}`);
  }
};