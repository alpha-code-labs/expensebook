import axios from 'axios';

const LOGIN_BACKEND_API_URL = import.meta.env.VITE_LOGIN_LOGOUT_BACKEND_API_URL
const CITYLIST_BACKEND_API_URL = import.meta.env.VITE_CITYLIST_API
const retry = 3;
const retryDelay = 3000;


const errorMessages = {
  '404': 'Something went wrong. Please try again later',
  '400': 'Something went wrong. Please try again later',
  // '500': 'Internal Server Error',
  'request': 'Something went wrong. Please try again later',
  'else': 'Something went wrong. Please try again later'
  
  // '404': 'Resource Not Found',
  // '400': 'Cannot fetch data at the moment',
  // // '500': 'Internal Server Error',
  // 'request': 'Network Error',
  // 'else': 'Something went wrong. Please try again later'
};

const handleRequestError = (e) => {
  if (e.response) {
    // Response received from the server
    const status = e.response.status;
    if (status === 400 || status === 404) {
      throw new Error(errorMessages[status]);
    } else if (status === 500) {
      // Handle 500 errors and get the message from the backend
      const errorMessage = e.response.data.message || errorMessages[status];
      throw new Error(errorMessage);
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




//okay
export const getCompanyList_API = async () => {
  const url = `${LOGIN_BACKEND_API_URL}/api/companyNames`;

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









export const postLogin_API = async (data) => {
  const url = `${LOGIN_BACKEND_API_URL}/api/login`;

  try {
    const response = await axiosRetry(axios.post, url, data,{withCredentials:true});
    
    // Check if the response contains the authentication token
    const authToken = response.data?.data;
    
    if (authToken) {
      // Include the authentication token in the header for subsequent requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    }

    return { data: response.data, error: null };
  } catch (error) {
    if (error.response?.status === 401) {
      const backendErrorMessage = error.response.data.message || 'Internal Server Error';
     // console.log('Backend Error: ', backendErrorMessage);
      return { error: { status: 401, message: backendErrorMessage } };
    }
    // For other errors, use the general error handling
    const errorObject = handleRequestError(error);
    return { error: errorObject };
  }
};


export const postForgotPassword_API = async(data)=>{

  // const url = `${LOGIN_BACKEND_API_URL}/api/set-password`
  const url = `${LOGIN_BACKEND_API_URL}/api/forgot-password`

  try {
    const response = await axiosRetry(axios.post,url,data);
    return {data:response.data, error:null}
   
  }catch(error){
    // Handle 500 errors separately
    if (error.response?.status === 500) {
      const backendErrorMessage = error.response.data.message || 'Internal he Server Error';
      
      return { error: { status: 500, message: backendErrorMessage } };
    }
    if (error.response?.status === 403) {
      const backendErrorMessage = error.response.data.message || 'Internal he Server Error';
      
      return { error: { status: 500, message: backendErrorMessage } };
    }
    // For other errors, use the general error handling
    const errorObject = handleRequestError(error);
    return { error: errorObject };
  }

}

export const postSignupData_API = async(data)=>{

  const url = `${LOGIN_BACKEND_API_URL}/api/signup`
  try{
    const {formData} = data
     const response = await axiosRetry(axios.post,url,formData)
     if(response.status >= 200 && response.status<300){
                  return {data: response.data, error:null}
              }

  }catch (error) {
    // Handle 500 errors separately
    if (error.response?.status > 200) {
      const backendErrorMessage = error.response.data.message || 'Internal he Server Error';
      //console.log('Backend Error: ', backendErrorMessage);
      return { error: { status: 500, message: backendErrorMessage } };
    }
    // For other errors, use the general error handling
    const errorObject = handleRequestError(error);
    return { error: errorObject };
  }

}


///employee otp validation
export const postOtpValidation_API = async(data)=>{

  const url = `${LOGIN_BACKEND_API_URL}/api/verify`
  try{
     const res = await axiosRetry(axios.post,url,data)
     if(res.status >= 200 && res.status<300){
                  return {data: res.data, error:null}
              }
    
  }catch (error) {
      // Handle 500 errors separately
      if (error.response?.status === 400) {
        const backendErrorMessage = error.response.data.message || 'Internal he Server Error';
       // console.log('Backend Error: ', backendErrorMessage);
        return { error: { status: 400, message: backendErrorMessage } };
      }
      // For other errors, use the general error handling
      const errorObject = handleRequestError(error);
      return { error: errorObject };
    }
}


///employee update-password
///employee set-password
export const postSetPassword_API = async(data)=>{

  const url = `${LOGIN_BACKEND_API_URL}/api/set-password`
  try {
    const response = await axiosRetry(axios.post,url,data);
    return {data:response.data, error:null}
   
    
  }catch (error) {
    // Handle 500 errors separately
    if (error.response?.status === 400) {
      const backendErrorMessage = error.response.data.message || 'Internal Server Error';
      //console.log('Backend Error: ', backendErrorMessage);
      return { error: { status: 400, message: backendErrorMessage } };
    }
    if (error.response?.status === 401) {
      const backendErrorMessage = error.response.data.message || 'Internal Server Error';
      //console.log('Backend Error: ', backendErrorMessage);
      return { error: { status: 401, message: backendErrorMessage } };
    }
    // For other errors, use the general error handling
    const errorObject = handleRequestError(error);
    return { error: errorObject };
  }

}





///city list

export const getCityList_API = async(data)=>{

  const url = `${CITYLIST_BACKEND_API_URL}`
  try{

     const response = await axiosRetry(axios.post,url,data)
     if(response.status >= 200 && response.status<300){
                  return {data: response.data, error:null}
              }
  }catch (error) {
    // Handle 500 errors separately
    if (error.response?.status > 200) {
      const backendErrorMessage = error.response.data.message || 'Internal he Server Error';
     // console.log('Backend Error: ', backendErrorMessage);
      return { error: { status: 500, message: backendErrorMessage } };
    }
    // For other errors, use the general error handling
    const errorObject = handleRequestError(error);
    return { error: errorObject };
  }
}








