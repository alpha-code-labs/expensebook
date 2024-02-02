import axios from 'axios';
//import these id from params and pas here

const BASE_URL = `http://192.168.29.56:8089/api/fe/travel`;
const retry = 3;
const retryDelay = 3000;



const errorMessages = {
  '404': 'Resource Not Found',
  '400': 'Cannot fetch data at the moment',
  '500': 'Internal Server Error',
  'request': 'Network Error from backend',
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

//verfied by backend
///first tiem get travel header id
//for Book expense 
//


export const getTravelExpenseApi = async (tenantId,empId,tripId) => {
  // const url = `travel/book-expense/:${tenantId}/:${empId}/:${tripId}`;
  const url = `${BASE_URL}/${tenantId}/${empId}/${tripId}/book-expense`;

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


export const ocrScanApi = async (data) => {
 
  const url = `${BASE_URL}/ocr-scan`;
  try {
    const response = await axiosRetry(axios.post, url,data);
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

///non travel handler
export const nonTravelOcrApi = async (data) => {
 
  const url = `${BASE_URL}/ocr-scan`;
  try {
    const response = await axiosRetry(axios.post, url,data);
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

//verfied by backend
//when user will get for modify

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


export const getTravelExpenseForModifyApi= async(tenantId,empId,tripId,expenseHeaderId)=>{
  const url = `${BASE_URL}/:${tripId}/:${expenseHeaderId}/modify`
  
  try {
    const response = await axiosRetry(axios.get, url);
    return { data: response.data, error: null };

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

//verfied by backend
//save lineItems {} only saving form object 
//whole got company data and and 
export const postExpenseLineItems = async(tripId,expenseHeaderId,data)=>{

  // const url = 'http://localhost:3000/lineItem'

  // this is the real api route
  const url = `${BASE_URL}/:${tripId}/:${expenseHeaderId}/save-line`
  try{
     await axiosRetry(axios.post,url,data)
     return {error:null};
    

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





//verfied by backend
//onDraft send expense lines array
///for submit or save as draft
export const submitOrSaveAsDraftApi = async(
  action,
  tripId,
  expenseHeaderId,
  headerReport)=>{
let url;
    if(action==="submit"){
      //  url = `http://localhost:3000/expense/submit/${tenantId}/${empId}/${tripId}/${expenseHeaderId}`
       url = `${BASE_URL}/:${tripId}/:${expenseHeaderId}/submit`
    }else{
     url = `${BASE_URL}/:${tripId}/:${expenseHeaderId}/draft`
    }
  

  try{
    return await axiosRetry(axios.patch,url,headerReport)

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








//verfied by backend

///check in require data

export const postMultiCurrencyForTravelExpenseApi = async(data)=>{

  // const url =   `http://localhost:3000/api/postmulticurrency/travel api Api/${tenantId}`

  const url = `${BASE_URL}/currency-convertor`

  try{
    const response = await axiosRetry(axios.post,url,data)
     return{data: response.data,error:null};
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


//verified by backend
//// dashboard to rejection page for travel expense rejection reason data 
//get the data
// {
//   tripNumber:"",
//   expenseHeaderNumber:"",
//   rejectionReason:""
// }

export const  getRejectionDataForTravelExpenseApi=async(tripId,expenseHeaderId)=>{
  const url = `${BASE_URL}/:${tripId}/:${expenseHeaderId}/clear-rejected`


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

}




//cancel travel expense 
// on cancel travel header send whole report of expense 
//entire report has to send to backend
//travel expense report data
// {travelExpenseData:[]} this str has to send

export const cancelTravelExpenseHeaderApi = async(tripId,expenseHeaderId,data)=>{

  const url = `${BASE_URL}/:${tripId}/:${expenseHeaderId}/cancel-report`
  
  try{
    await axiosRetry(axios.post,url,data)
    return {error:null};
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

// verified by backend
////cancel  travel expense  array of lineItemId
///here i have to send whole object of lineitem in array [{LI1}] for deduct expense and cashadvance
// expenseLines:[]

export const cancelTravelExpenseLineItemApi = async(tripId ,expenseHeaderId,data)=>{

  const url = `${BASE_URL}/:${tripId}/:${expenseHeaderId}/cancel-line`
  
  try{
    await axiosRetry(axios.post,url,data)
    return {error:null};
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



export const travelPolicyViolationApi = async(data)=>{

  // const url =   `http://localhost:3000/api/policyViolation/reimbursement api Api/${tenantId}`

  const url = `${BASE_URL}/currency-convertor`

  try{

    const response = await axiosRetry(axios.post,url,data)
    return{data: response.data,error:null};

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





///------------------------------non travel expense------------------------------------------------------------------------

const nontravelbase = `http://192.168.1.10:8089/api/fe/non-travel`

export const postMultiCurrencyForNonTravelExpenseApi = async(tenantId,data)=>{

  const url =   `http://localhost:3000/api/postmulticurrency/non-travel/${tenantId}`

  try{
    const response = await axiosRetry(axios.post,url,data)
     return{data: response.data,error:null};
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


///get non-travel-expense category and group if available

export const getNonTravelExpenseMiscellaneousDataApi=async(tenantId,empId)=>{

  const url =`${nontravelbase}/${tenantId}/${empId}/expensecategorie`
  try {
    const response = await axiosRetry(axios.get, url);
    return { data: response.data, error: null };

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

//for get form value behalf of selected category

export const getCategoryFormElementApi=async(tenantId,empId,data)=>{
  const url = `http://localhost:3000/category-form-value/${tenantId}/${empId}`
  try{
    const response = await axiosRetry( axios.post, url,data);
    return {data: response.data , error:null};

  }catch(error){
    const errorObject={
      status:error.response?.status || null,
      message: error.message || 'Unknown error'
    };
    console.log('Post Error : ', errorObject);
    return {error: errorObject}
  }
}

///save line item details for non travel expense 
//on save whole object of expense lines
export const postNonTravelExpenseLineItems = async(tenantId,empId,data)=>{

  // this is the real api route
  const url = `http://localhost:3000/api/trip/:${tenantId}/:${empId}`
  
  try{
     await axiosRetry(axios.post,url,data)
     return {error:null};
    

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


export const saveAsDraftNonTravelExpense = async(tenantId,empId,data)=>{

  const url = `http://localhost:3000/api/nontravelsaveasdraft/:${tenantId}/:${empId}`
  
  try{
     await axiosRetry(axios.post,url,data)
     return {error:null};
    

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


export const submitNonTravelExpenseApi = async(tenantId,empId,data)=>{

  const url = `http://localhost:3000/api/nontravel-submit/:${tenantId}/:${empId}`
  
  try{
     await axiosRetry(axios.post,url,data)
     return {error:null};
     

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


////cancel non travel expense 

export const cancelNonTravelExpenseHeaderApi = async(tenantId,empId,expenseHeaderId)=>{

  const url = `http://localhost:3000/api/nontravel-cancel/:${tenantId}/:${empId}/:${expenseHeaderId}`
  
  try{
    await axiosRetry(axios.patch,url)
    return {error:null};
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


////cancel non travel expense  array of lineItemId

export const cancelNonTravelExpenseLineItemApi = async(tenantId,empId,expenseHeaderId,data)=>{

  const url = `http://localhost:3000/api/nontravel-cancel/:${tenantId}/:${empId}/:${expenseHeaderId}`
  
  try{
    await axiosRetry(axios.post,url,data)
    return {error:null};
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



////  get policy violation for reimbursement on click

export const reimbursementPolicyViolationApi = async(data)=>{

  // const url =   `http://localhost:3000/api/policyViolation/reimbursement api Api/${tenantId}`

  const url = `${BASE_URL}/currency-convertor`

  try{

    const response = await axiosRetry(axios.post,url,data)
    return{data: response.data,error:null};

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



