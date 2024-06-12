import axios from 'axios';

//import these id from params and pas here
const BASE_API_URL = `http://localhost:9001/api`;
const retry = 2;
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
    throw new Error(errorMessages[e.response?.status] || errorMessages.request || errorMessages.else);
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



export const getEmployeeData_API = async (tenantId,empId) => {
  const url = `http://localhost:9001/api/${tenantId}/${empId}`;

  try {
    const response = await axiosRetry(axios.get, url);
    return { data: response.data, error: null };
  } catch (error) {
    handleRequestError(error);
    const errorObject = {
      status: error.response?.status || null,
      message: error.message || 'Unknown error',
    };

    return { data: null, error: errorObject };
  }
};





export const getPreferenceDataApi = async () => {
  const url = `http://localhost:9001/api/preference`;

  try {
    const response = await axiosRetry(axios.get, url);
    return { data: response.data, error: null };
  } catch (error) {
    const errorMessage = handleRequestError(error);  // Get the error message from handleRequestError
    const errorObject = {
      status: error.response?.status || null,
      message: errorMessage || 'Unknown error', // Use the error message obtained from handleRequestError
    };
      console.log(errorObject)
    return { data: null, error: errorObject };
  }
};


export const postTravelPreference_API = async (data) => {
  const { tenantId, empId, formData } = data;
  const url = `http://localhost:9001/api/${tenantId}/${empId}`;

  try {
    const response = await axiosRetry(axios.post, url, formData);
    return { error: null, message: response.data.message }; // Assuming the response contains a message
  } catch (error) {
    const errorMessage = handleRequestError(error);
    const errorObject = {
      status: error.response?.status || null,
      message: errorMessage || 'Unknown error',
    };
    console.log('Post Error: ', errorObject);
    return { error: errorObject};
  }
};



export const getManagerData_API = async (tenantId,empId) => {
  const url = `http://localhost:9001/api/${tenantId}/${empId}`;

  try {
    const response = await axiosRetry(axios.get, url);
    return { data: response.data, error: null };
  } catch (error) {
    handleRequestError(error);
    const errorObject = {
      status: error.response?.status || null,
      message: error.message || 'Unknown error',
    };

    return { data: null, error: errorObject };
  }
};





export const getTravelAdminData_API = async (tenantId,empId) => {
  const url = `http://localhost:9001/api/${tenantId}/${empId}`;

  try {
    const response = await axiosRetry(axios.get, url);
    return { data: response.data, error: null };
  } catch (error) {
    handleRequestError(error);
    const errorObject = {
      status: error.response?.status || null,
      message: error.message || 'Unknown error',
    };

    return { data: null, error: errorObject };
  }
};






















export const submitLeg = async (tenantId, tripId, empId, legDetails) => {
  const url = `${BASE_API_URL}/api/dashboard/overview/addleg/${tenantId}/${tripId}/${empId}`;
  
  try {
    const response = await axios.post(url, legDetails);

    return response.data;
  } catch (error) {
    console.error('Error submitting leg:', error.message);
    throw error;
  }
};

