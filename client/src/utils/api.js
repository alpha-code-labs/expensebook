import axios from 'axios';

const FINANCE_BACKEND_API_URL = import.meta.env.VITE_FINANCE_BACKEND_API_URL;

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

// http://192.168.0.194:8088/api/fe/dashboard/role/65c5c3bef21cc9ab3038e21f/1002


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
  const url = `${FINANCE_BACKEND_API_URL}/api/fe/finance/role/${tenantId}/${empId}`;

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
const LOGINBASEURL = import.meta.env.VITE_LOGIN_LOGOUT_BACKEND_URL

export const getEmployeeRoles_API = async (tenantId,empId) => {
  const url = `${LOGINBASEURL}/api/internal/${tenantId}/${empId}/roles`;

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


export const assignBusinessAdmin_API = async (tenantId,travelRequestId,data) => {
  const url = `${FINANCE_BACKEND_API_URL}/api/fe/finance/cash/recovery/${tenantId}/${travelRequestId}/${cashAdvanceId}`;

  try {
    const response = await axiosRetry(axios.patch, url,data );
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


export const assignTravelExpenseSettlement_API = async (tenantId,travelRequestId,expenseHeaderId,data) => {
  const url = `${FINANCE_BACKEND_API_URL}/api/fe/finance/expense/paid/${tenantId}/${travelRequestId}/${expenseHeaderId}`;

  try {
    const response = await axiosRetry(axios.put, url,data );
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

export const assignNonTravelExpenseSettlement_API = async (tenantId,expenseHeaderId,data) => {
  const url = `${FINANCE_BACKEND_API_URL}/api/fe/finance/nontravel/paid/${tenantId}/${expenseHeaderId}`;

  try {
    const response = await axiosRetry(axios.put, url,data );
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

export const assignCashRecovery_API = async (tenantId,travelRequestId,cashAdvanceId,data) => {
  const url = `${FINANCE_BACKEND_API_URL}/api/fe/finance/cash/recovery/${tenantId}/${travelRequestId}/${cashAdvanceId}`;

  try {
    const response = await axiosRetry(axios.put, url,data );
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

export const assignCashSettle_API = async (tenantId,travelRequestId,cashAdvanceId,data) => {
  const url = `${FINANCE_BACKEND_API_URL}/api/fe/finance/cash/paid/${tenantId}/${travelRequestId}/${cashAdvanceId}`;

  try {
    const response = await axiosRetry(axios.put, url,data );
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


export const getTravelPreference_API = async (tenantId,empId) => {
  const url = `${FINANCE_BACKEND_API_URL}/api/fe/dashboard/role/${tenantId}/${empId}`;

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


export const postTravelPreference_API = async(tenantId,empId,data)=>{

  const url = `${FINANCE_BACKEND_API_URL}/api/${tenantId}/${empId}`;

  // this is the real api route
  
  try{

    const response= await axiosRetry(axios.update,url,data)
     return response.data
     
  }catch(error){
    handleRequestError(error);
    const errorObject = {
      status: error.response?.status || null,
      message: error.message || 'Unknown error',
    };
    console.log('Post Error : ',errorObject);
    return {  error: errorObject };


  }

}

//Entries 
export const getTravelExpenseDataEntries_API = async (tenantId,empId,data) => {
  const url = `${FINANCE_BACKEND_API_URL}/api/fe/finance/expense/filter/${tenantId}/${empId}`;

  try {
    const response = await axiosRetry(axios.post, url,data );
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

export const getNonTravelExpenseDataEntries_API = async (tenantId,empId,data) => {
  const url = `${FINANCE_BACKEND_API_URL}/api/fe/finance/nontravel/filter/${tenantId}/${empId}`;

  try {
    const response = await axiosRetry(axios.post, url,data );
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


















export const submitLeg = async (tenantId, tripId, empId, legDetails) => {
  const url = `${FINANCE_BACKEND_API_URL}/api/dashboard/overview/addleg/${tenantId}/${tripId}/${empId}`;
  
  try {
    const response = await axios.post(url, legDetails);

    return response.data;
  } catch (error) {
    console.error('Error submitting leg:', error.message);
    throw error;
  }
};
























// import axios from 'axios';
// const CASH_ADVANCE_SERVER_URL ='http://localhost:8080/cash-advance/api'
// const travelRequestId = 'tenant123_emp000079_tr_001'


// async function createCashAdvanceAPI(data) {
//   await axios.post(`${CASH_ADVANCE_SERVER_URL}/create-cash-advance/${travelRequestId}`, data);
// }

// async function getTravelRequestDetails(data){
  
//   let response = null
//   await axios.get(`${CASH_ADVANCE_SERVER_URL}/get-travel-request/${travelRequestId}`).
//   then((res) => { console.log(res); response = res.data }).
//   catch((error) => { console.log(error) });

//   return response;
// }


// // apiService.js

// const submitLeg = async (tenantId, tripId, empId, action, legDetails) => {
//   const url = `/api/dashboard/overview/addleg/${tenantId}/${tripId}/${empId}`;
  
//   try {
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         action,
//         legDetails,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to submit leg');
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error submitting leg:', error.message);
//     throw error;
//   }
// };

// export default submitLeg;


// export {getTravelRequestDetails , createCashAdvanceAPI}

