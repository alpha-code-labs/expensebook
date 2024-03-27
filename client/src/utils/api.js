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


///for reject reaction
// {
//   rejectionReason:"from the dropdown"
// }
// http://localhost:5173/expense/65ddbe4f905e5ef67d8ab969/1004/65ddbfb4905e5ef67d8ab96b/65f1e394ab65e75d82029e9e
///get travel all data
export const DASHBOARD_URL = 'http://192.168.1.10:5174'
const BASE_URL = 'http://192.168.1.11:8085';
// const BASE_URL = 'http://192.168.29.56:8085';



export const getTravelDataforApprovalApi= async (tenantId,empId,travelRequestId)=>{
    const url = `${BASE_URL}/api/fe/approvals/tr-ca/tr-details/${tenantId}/${empId}/${travelRequestId}`
  try{
    const response = await axiosRetry(axios.get,url);
    return {data: response.data , error : null}
    
  }catch(error){
    const errorMessage = handleRequestError(error);  
    const errorObject = {
      status: error.response?.status || null,
      message: errorMessage || 'Unknown error', 
    };
      console.log(errorObject)
    return { data: null, error: errorObject };
  }
}



///approval for travelRequest

export const approveTravelRequestApi = async(tenantId,empId,travelRequestId,isCashAdvanceTaken)=>{
let url
 if(isCashAdvanceTaken){
   url = `${BASE_URL}/api/fe/approvals/tr-ca/approve-tr/${tenantId}/${empId}/${travelRequestId}`
}else{
  url = `${BASE_URL}/api/fe/approvals/tr-ca/approve-tr-standalone/${tenantId}/${empId}/${travelRequestId}`
}

  try{
     const response = await axiosRetry(axios.patch,url)
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

///reject for travelRequest

export const rejectTravelRequestApi = async(tenantId,empId,travelRequestId,isCashAdvanceTaken,rejectionReason)=>{
let url
 if(isCashAdvanceTaken){
   url = `${BASE_URL}/api/fe/approvals/tr-ca/reject-tr/${tenantId}/${empId}/${travelRequestId}`
}else{
  url = `${BASE_URL}/api/fe/approvals/tr-ca/reject-tr-standalone/${tenantId}/${empId}/${travelRequestId}`
}

  try{
    const response= await axiosRetry(axios.patch,url,{rejectionReason})

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


///approve cashadvance api

export const approveCashAdvanceApi=async( tenantId ,empId,travelRequestId,cashAdvanceId)=>{

  let url 
  console.log('from cashadvance url',tenantId, empId,travelRequestId, cashAdvanceId)
 
    //if both are in pending approval
    url = `${BASE_URL}/api/fe/approvals/tr-ca/approve-ca/${tenantId}/${empId}/${travelRequestId}/${cashAdvanceId}`
  

  try{
    const response =  await axiosRetry(axios.patch,url)
    
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

///reject cash advance

export const rejectCashAdvanceApi=async( tenantId ,empId,travelRequestId,cashAdvanceId,rejectionReason)=>{

  let url 

    url = `${BASE_URL}/api/fe/approvals/tr-ca/reject-ca/${tenantId}/${empId}/${travelRequestId}/${cashAdvanceId}`
  

  try{
    const response =  await axiosRetry(axios.patch,url,rejectionReason);
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


//for lineitem approval

export const approveLineItemApi=async(tenantId,empId,tripId,itineraryId)=>{
  const url = `${BASE_URL}/api/approve/line-item/${tenantId}/${empId}/${tripId}/${itineraryId}`
  try{
    
    const response =await axiosRetry(axios.patch, url)
    return(response.data.message)
    
  }
  catch(error){
    handleRequestError(error);
    const errorObject = {
      status: error.response?.status || null,
      message: error.message || 'Unknown error',
    };
    console.log('Post Error : ',errorObject);
    return {  error: errorObject };
  }
  
}

//for lineitem rejection
export const rejectLineItemApi=async(tenantId,empId,tripId,itineraryId,rejectionReason)=>{
  const url = `${BASE_URL}/api/approve/line-item/${tenantId}/${empId}/${tripId}/${itineraryId}`
  try{
    const response = await axiosRetry(axios.patch, url,rejectionReason)
    return(response.data.message)
    
  }
  catch(error){
    handleRequestError(error);
    const errorObject = {
      status: error.response?.status || null,
      message: error.message || 'Unknown error',
    };
    console.log('Post Error : ',errorObject);
    return {  error: errorObject };
  }
  
}


///for expense approval



///get travel expense data for approval

export const getTravelExpenseDataApi= async (tenantId,empId,tripId,expenseHeaderId)=>{
  const url = `${BASE_URL}/api/fe/approvals/expense/${tenantId}/${empId}/${tripId}/${expenseHeaderId}`
  try{
    const response = await axiosRetry(axios.get,url);
    return response.data
  }catch(error){
    const errorMessage = handleRequestError(error);  // Get the error message from handleRequestError
    const errorObject = {
      status: error.response?.status || null,
      message: errorMessage || 'Unknown error', // Use the error message obtained from handleRequestError
    };
      console.log(errorObject)
    return { data: null, error: errorObject };
  }
}


export const approveTravelExpense=async(tenantId,empId,tripId,expenseHeaderId)=>{
  const url = `${BASE_URL}/api/fe/approvals/expense/${tenantId}/${empId}/${tripId}/${expenseHeaderId}/approve`
  try{
    const response= await axiosRetry(axios.patch, url)
    return response?.data?.message
    
  }
  catch(error){
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
export const rejectTravelExpense=async(tenantId,empId,tripId,expenseHeaderId,rejectionReason)=>{
  const url = `${BASE_URL}/api/fe/approvals/expense/${tenantId}/${empId}/${tripId}/${expenseHeaderId}/reject`
  try{
    const response= await axiosRetry(axios.patch, url,rejectionReason)
    return(response.data.message)
    
  }
  catch(error){
    handleRequestError(error);
    const errorObject = {
      status: error.response?.status || null,
      message: error.message || 'Unknown error',
    };
    console.log('Post Error : ',errorObject);
    return {  error: errorObject };
  }
  
}







// export const tripRecovery = async (tenantId, empId, tripId, itineraryId) => {
//   const baseURL = `${BASE_URL}/api/${tenantId}/${empId}/${tripId}`;
//   const url = itineraryId ? `${baseURL}/recover/${itineraryId}` : `${baseURL}/recover`;

//   try {
//     const requestData = itineraryId ? {} : { itineraryId }; // Send itineraryId only if it's present

//     return await axiosRetry(axios.post, url, requestData);
//   } catch (error) {
//     handleRequestError(error);
//     throw new Error(`Error canceling trip: ${error.message}`);
//   }
// };