import axios from "axios";
import { axiosRetry,handleRequestError } from "../apiHandler";

///for reject reaction
// {
//   rejectionReason:"from the dropdown"
// }

///get travel all data


const BASE_URL = 'http://localhost:8080/';
export const getTravelDataforApprovalApi= async (tenantId,empId,travelRequestId)=>{
    const url = `${BASE_URL}/api/get/tr-standalone/${tenantId}/${empId}/${travelRequestId}`
    try{
      const response = await axiosRetry(axios.get,url);
      return {data: response.data , error : null}
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

  
  ///approval for travelRequest
  export const approveTravelRequestApi = async(tenantId,empId,travelRequestId,isCashAdvanceTaken)=>{
  let url
   if(isCashAdvanceTaken){
     url = `${BASE_URL}/api/approve/tr-with-ca/${tenantId}/${empId}/${travelRequestId}`
  }else{
    url = `${BASE_URL}/api/approve/tr-standalone/${tenantId}/${empId}/${travelRequestId}`
  }


    try{
       await axiosRetry(axios.patch,url)
  
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
     url = `${BASE_URL}/api/reject/tr-with-ca/${tenantId}/${empId}/${travelRequestId}`
  }else{
    url = `${BASE_URL}/api/reject/tr-standalone/${tenantId}/${empId}/${travelRequestId}`
  }
  
    try{
       await axiosRetry(axios.patch,url,rejectionReason)
  
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
  
  export const approveCashAdvanceApi=async(travelRequestStatus, tenantId ,empId,travelRequestId)=>{
  
    let url 
    if(travelRequestStatus==="pending approval" ){
      //if both are in pending approval
      url = `${BASE_URL}/api/approve/tr-ca/${tenantId}/${empId}/${travelRequestId}`
    }else{
      //if cashadvance is in pending approval
      url = `${BASE_URL}/api/approve/ca/${tenantId}/${empId}/${travelRequestId}`
    }

    try{
      return await axiosRetry(axios.patch,url)
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
  
  export const rejectCashAdvanceApi=async(travelRequestStatus, tenantId ,empId,travelRequestId,rejectionReason)=>{
  
    let url 
    if(travelRequestStatus==="pending approval" ){
      //if both are in pending approval
      url = `${BASE_URL}/api/reject/tr-ca/${tenantId}/${empId}/${travelRequestId}`
    }else{
      //if cashadvance is in pending approval
      url = `${BASE_URL}/api/reject/ca/${tenantId}/${empId}/${travelRequestId}`
    }
  
    try{
      return await axiosRetry(axios.patch,url,rejectionReason)
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
  
  export const approveLineItemApi=async(tenantId,empId,travelRequestId,itineraryId)=>{
    const url = `${BASE_URL}/api/approve/line-item/${tenantId}/${empId}/${travelRequestId}/${itineraryId}`
    try{
      
      await axiosRetry(axios.patch, url)
      return{error:null};
      
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
  export const rejectLineItemApi=async(tenantId,empId,travelRequestId,itineraryId,rejectionReason)=>{
    const url = `${BASE_URL}/api/approve/line-item/${tenantId}/${empId}/${travelRequestId}/${itineraryId}`
    try{
      return await axiosRetry(axios.patch, url,rejectionReason)
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
  
///get travel expense data for approval

  export const getTravelExpenseDataApi= async (tenantId,empId,tripId,expenseHeaderId)=>{
    const url = `${BASE_URL}/api/get/tr-standalone/${tenantId}/${empId}/${tripId}/${expenseHeaderId}`
    try{
      const response = await axiosRetry(axios.get,url);
      return {data: response.data , error : null}
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
  
  ///for expense approval
  
  export const approveTravelExpense=async(tenantId,empId,expenseHeaderId)=>{
    const url = `${BASE_URL}/api/approve/tr-expense/${tenantId}/${empId}/${expenseHeaderId}`
    try{
      return await axiosRetry(axios.patch, url)
      
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
  export const rejectTravelExpense=async(tenantId,empId,expenseHeaderId,rejectionReason)=>{
    const url = `${BASE_URL}/api/reject/tr-expense/${tenantId}/${empId}/${expenseHeaderId}`
    try{
      return await axiosRetry(axios.patch, url,rejectionReason)
      
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
  
  
  
  
  
  
  