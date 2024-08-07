import axios from 'axios';


const TRIP_BACKEND_API_URL = import.meta.env.VITE_TRIP_API_URL

const retry = 1;
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

/**
 * The `tripFetchApi` function is an asynchronous function that fetches trip data from an API using the
 * provided tripId, tenantId, and empId.
/**/



export const logoutApi = async (authToken) => {
  try {
    const response = await axiosRetry(axios.post ,'/logout', {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });
    const data = response.data;
    return { data: data,message:data.message, error: null };

  } catch (error) {
    handleRequestError(error);
    const errorObject = {
      status: error.response?.status || null,
      message: error.message || 'Unknown error',
    };
    return { data: null, error: errorObject };
  }
};


export const getTripDataApi= async (tenantId, empId, tripId) => {
  const url = `${TRIP_BACKEND_API_URL}/api/fe/trips/${tenantId}/${empId}/${tripId}/details`;
  try {
    const response = await axiosRetry(axios.get,url);
    return response
  } catch (error) {
    handleRequestError(error);
    throw new Error(`Error canceling trip: ${error.message}`);
  }
};
/**
 * The `tripCancellationApi` function is an asynchronous function that cancels a trip by making a POST
 * request to a specific API endpoint.
 */

//header level

export const tripCancellationApi = async (tenantId, empId, tripId) => {

  const url = `${TRIP_BACKEND_API_URL}/api/fe/trips/${tenantId}/${empId}/${tripId}/cancel`;
  
  try {

    const response= await axiosRetry(axios.patch, url);

    return response.data
  } catch (error) {
    handleRequestError(error);
    throw new Error(`Error canceling trip: ${error.message}`);
  }
};

///for cancelling itinerary data is itinerary array[]
export const tripItineraryCancellationApi = async ( tenantId, empId,tripId, data) => {
 
  const url = `${TRIP_BACKEND_API_URL}/api/fe/trips/${tenantId}/${empId}/${tripId}/cancel-line`;
  try {
    
    const response = await axiosRetry(axios.patch, url, data);
    return response.data

  } catch (error) {
    handleRequestError(error);
  const errorObject = {
    status: error.response?.status || null,
    message: error.message || 'Unknown error',
  };
  console.log('itinerary ids Error : ',errorObject);
  return {  error: errorObject };
  }
};

//-----------------------------------------trip recovery---------------------------------------------
//header
export const tripRecoveryApi = async (tenantId,empId,tripId) => {
   const url= `${TRIP_BACKEND_API_URL}/api/fe/trips/${tenantId}/${empId}/${tripId}/recover`;
 
  try {
    const response = await axiosRetry(axios.patch, url,);
    return response.data;
  } catch (error) {
    handleRequestError(error);
    throw new Error(`Error canceling trip: ${error.message}`);
  }
};



export const tripLineItemsRecoveryApi = async ( tenantId,empId,tripId,itineraryIds ) => {
 
  const url = `${TRIP_BACKEND_API_URL}/api/fe/trips/${tenantId}/${empId}/${tripId}/recover-line`;
  try {
    
    const response = await axiosRetry(axios.patch, url, itineraryIds);
    return response.data;

  } catch (error) {
    handleRequestError(error);
  const errorObject = {
    status: error.response?.status || null,
    message: error.message || 'Unknown error',
  };
  console.log('itinerary ids Error : ',errorObject);
  return {  error: errorObject };
  }
};