import axios from 'axios';
const tenantId='tenantId'
const empId='empId'

export const DASHBOARD_URL= `http://192.168.176.73:8082/${tenantId}/${empId}`
const BASE_URL = `http://192.168.176.73:8082/api/trips/fe/${tenantId}/${empId}/`
//http://192.168.1.5:8082/api/trips/cancel/details/TNTABG/TRIPABG000002/empL001

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

export {axiosRetry,handleRequestError}