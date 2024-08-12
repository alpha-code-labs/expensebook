import axios from 'axios';


const financeBaseUrl = import.meta.env.VITE_FINANCE_BACKEND_API_URL;

const retry = 2;
const retryDelay = 3000;

const errorMessages = {
  '404': 'Resource Not Found',
  '400': 'Cannot fetch data at the moment',
  '500': 'Internal Server Error',
  'request': 'Network Error',
  'else': 'Something went wrong. Please try again later'
};

const handleRequestError = (e) =>{
  if (e.response) {
    const status = e.response.status;
    if (status === 400 || status === 404 || status === 500) {
      throw new Error(errorMessages[status]);
    }
  } else if (e.request) {
    throw new Error(errorMessages.request);
  } else {
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



export const getFinanceData_API = async (tenantId,empId) => {
  
  const url = `${financeBaseUrl}/api/fe/finance/role/${tenantId}/${empId}`;

  try {
    const response = await axiosRetry(axios.get, url);
    return response.data
  } catch (error) {
    handleRequestError(error);
    const errorObject = {
      status: error.response?.status || null,
      message: error.message || 'Unknown error',
    };

    return { data: null, error: errorObject };
  }
};


export const getAccountEntriesData_API = async ({tenantId,empId,data}) => {
  
  const url = `${financeBaseUrl}/api/fe/finance/expense/${tenantId}/${empId}`;

  try {
    const response = await axiosRetry(axios.post, url,data);
    return response.data
  } catch (error) {
    handleRequestError(error);
    const errorObject = {
      status: error.response?.status || null,
      message: error.message || 'Unknown error',
    };

    return { data: null, error: errorObject };
  }
};

