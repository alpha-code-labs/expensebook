import axios from 'axios';


const DASHBOARD_BACKEND_API_URL = import.meta.env.VITE_DASHBOARD_BACKEND_API_URL;
const SETTLEMENT_BACKEND_API_URL = import.meta.env.VITE_SETTLEMENT_BACKEND_API_URL;
const APPROVAL_BACKEND_API_URL = import.meta.env.VITE_APPROVAL_BACKEND_API_URL;

const retry = 2;
const retryDelay = 3000;

const errorMessages = {
  '404': 'Something went wrong. Please try again later',
  '400': 'Something went wrong. Please try again later',
  '500': 'Something went wrong. Please try again later',
  'request': 'Something went wrong. Please try again later',
  'else': 'Something went wrong. Please try again later'
  // '404': 'Something went wrong. Please try again later',
  // '400': 'Cannot fetch data at the moment',
  // '500': 'Internal Server Error',
  // 'request': 'Network Error',
  // 'else': 'Something went wrong. Please try again later'
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



export const getEmployeeData_API = async (tenantId,empId) => {
  const url = `${DASHBOARD_BACKEND_API_URL}/api/fe/dashboard/role/${tenantId}/${empId}`;

  try {
    const response = await axiosRetry(axios.get, url,{
      withCredentials: true // Ensure the cookie (authToken) is sent
    });
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
export const updateNotificationReadFlagApi = async ({params,payload}) => {
  const {tenantId,empId} = params
  
  const url = `${DASHBOARD_BACKEND_API_URL}/api/fe/dashboard/bell/${tenantId}/${empId}/read`;
  
  try {
    const response = await axiosRetry(axios.patch, url, payload );
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
  const url = `${DASHBOARD_BACKEND_API_URL}/api/fe/dashboard/travel-admin/${tenantId}/${travelRequestId}`;

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

export const getTravelPreference_API = async ({ tenantId, empId }) => {
  console.log("getTravelPreference_API", tenantId, empId);

  // Ensure tenantId and empId are not undefined or null
  if (!tenantId || !empId) {
    throw new Error('Both tenantId and empId must be provided.');
  }

  const url = `${DASHBOARD_BACKEND_API_URL}/api/fe/dashboard/profile/${tenantId}/${empId}`;

  try {
    const response = await axiosRetry(() => axios.get(url));
    return response.data;
  } catch (error) {
    handleRequestError(error);
    const errorObject = {
      status: error.response?.status || null,
      message: error.message || 'Unknown error',
    };

    return { data: null, error: errorObject };
  }
};


export const postTravelPreference_API = async (tenantId, empId, formData) => {
  console.log("API tenantId:", tenantId);
  console.log("API data:", formData);
  console.log("API empId:", empId);

  if (!tenantId || !empId ||!formData) {
    throw new Error('Both tenantId,empId and formData must be provided.');
  }

  const url = `${DASHBOARD_BACKEND_API_URL}/api/fe/dashboard/profile/${tenantId}/${empId}`;

  try {
    const response = await axiosRetry(axios.post,url, formData);
    return response.data;
  } catch (error) {
    handleRequestError(error);
    const errorObject = {
      status: error.response?.status || null,
      message: error.message || 'Unknown error',
    };
    console.log('Post Error:', errorObject);
    return { error: errorObject };
  }
};


export const approveTravelRequestApi = async(data)=>{
  const {tenantId, empId, travelRequests} = data

  // let url
  //  if(isCashAdvanceTaken){
  //    url = `${APPROVAL_BACKEND_API_URL}/api/fe/approvals/tr-ca/approve-tr/${tenantId}/${empId}/${travelRequestId}`
  // }else{
  //   url = `${APPROVAL_BACKEND_API_URL}/api/fe/approvals/tr-ca/approve-tr-standalone/${tenantId}/${empId}/${travelRequestId}`
  // }
  let url = `${DASHBOARD_BACKEND_API_URL}/api/fe/dashboard/approval/${tenantId}/${empId}/approve`
  
    try{
       const response = await axiosRetry(axios.patch,url,{travelRequests})
       return(response.data.message)
  
  
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

//reject for travelRequest
  export const rejectTravelRequestApi = async(data)=>{
    const {tenantId, empId, travelRequests,rejectionReason} = data
  
    let url = `${DASHBOARD_BACKEND_API_URL}/api/fe/dashboard/approval/${tenantId}/${empId}/reject`
    
      try{
         const response = await axiosRetry(axios.patch,url,{travelRequests,rejectionReason})
         return(response.data.message)
    
    
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

    //recover paid and cancelled trips
  export const travelAdminRecoverTripApi = async(data)=>{
    const {tenantId, empId, tripId,itineraryIds,recoverAmount} = data
  
    let url = `${DASHBOARD_BACKEND_API_URL}/api/fe/dashboard/bookings/${tenantId}/${empId}/${tripId}`
    
      try{
         const response = await axiosRetry(axios.patch,url,{itineraryIds,recoverAmount})
         return(response.data.message)
    
    
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

    export const approveTravelExpenseApi=async(params,payload)=>{
      const {tenantId,empId,tripId,expenseHeaderId} = params

      const url = `${DASHBOARD_BACKEND_API_URL}/api/fe/dashboard/approval/${tenantId}/${empId}/${tripId}/${expenseHeaderId}`
      try{
        const response = await axiosRetry(axios.patch,url,payload)
        return(response.data.message)
   
   
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
    
    //for expense rejection
    
    export const rejectTravelExpenseApi=async(params,payload)=>{
      const {tenantId,empId,tripId,expenseHeaderId} = params
      const url = `${APPROVAL_BACKEND_API_URL}/api/fe/approvals/expense/${tenantId}/${empId}/${tripId}/${expenseHeaderId}/reject`
      try{
        const response = await axiosRetry(axios.patch,url,payload)
        return(response.data.message)
   
   
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

  export const nonTravelExpenseApprovalActionApi = async(params,payload)=>{
      const {tenantId,empId,expenseHeaderId} = params
    
      let url = `${DASHBOARD_BACKEND_API_URL}/api/fe/dashboard/approval/${tenantId}/${empId}/${expenseHeaderId}`
      
        try{
           const response = await axiosRetry(axios.patch,url,payload)
           return(response.data.message)
      
      
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

//finance microservice api

  export const settleCashAdvanceApi = async(data)=>{
        const {tenantId, empId,travelRequestId, cashAdvanceId,  action,payload} = data
        
        let url
        console.log(action)
        
          if (action === "settleCashAdvance" ) { 
             url = `${SETTLEMENT_BACKEND_API_URL}/api/fe/finance/cash/paid/${tenantId}/${travelRequestId}/${cashAdvanceId}`
          }
          else { 
             url = `${SETTLEMENT_BACKEND_API_URL}/api/fe/finance/cash/recovery/${tenantId}/${travelRequestId}/${cashAdvanceId}`
          }
          
        
        console.log('url from api.js',url)
          try{
             const response = await axiosRetry(axios.patch,url,payload)
             return(response.data.message)
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

  export const settleExpenseApi = async(data)=>{
        const {tenantId, empId,travelRequestId, expenseHeaderId, action, payload} = data
        let url
     
        if(action === "settleTravelExpense" ){
           url = `${SETTLEMENT_BACKEND_API_URL}/api/fe/finance/expense/paid/${tenantId}/${travelRequestId}/${expenseHeaderId}`
        }else{
          url = `${SETTLEMENT_BACKEND_API_URL}/api/fe/finance/nontravel/paid/${tenantId}/${expenseHeaderId}`
        }
        
          try{
             const response = await axiosRetry(axios.patch,url,payload)
             return(response.data.message)
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

//finance microservice api end




















export const submitLeg = async (tenantId, tripId, empId, legDetails) => {
  const url = `${DASHBOARD_BACKEND_API_URL}/api/dashboard/overview/addleg/${tenantId}/${tripId}/${empId}`;
  
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

