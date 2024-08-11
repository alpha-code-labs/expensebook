import axios from 'axios';

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


//----------------------------------------------------------------------------------------




const REPORTING_BACKEND_API_URL = import.meta.env.VITE_BACKEND_REPORT_API_URL

export const getReportDataAPI = async (tenantId,empId) => {
  const url = `${REPORTING_BACKEND_API_URL}/api/fe/reporting/rol/${tenantId}/${empId}`;

  try {
    const response = await axiosRetry(axios.get, url);
    return response.data

  } catch (error) {
    handleRequestError(error);
    const errorObject = {
      status: error.response?.status || null,
      message: error.message || 'Unknown error',
    };
    return { error: errorObject };
  }
};