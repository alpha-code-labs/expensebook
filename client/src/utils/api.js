import axios from "axios";
import policies from '../../src/assets/policies.json'
import { TR_backendTransformer, TR_frontendTransformer } from "./transformers";

const TRAVEL_API_URL = import.meta.env.VITE_TRAVEL_API_URL
const retry =  3
const retryDelay = 3000

const errorMessages = {
  '404': 'Resource Not Found',
  '400': 'Can not fetch data at the moment',
  '500': 'Internal Server Error',
  'request': 'Network Error',
  'else': 'Something went wrong. Please try after sometime'
}

async function postTravelRequest_API(data){
  try{
    const res = await axios.post(`${TRAVEL_API_URL}/travel-request`, TR_backendTransformer(data), {retry, retryDelay})

    if(res.status >= 200 && res.status<300){
      return {data: {travelRequestId: res.data.travelRequestId}, err:null}
    }

  }catch(e){
    if(e.response){
      //respose received from server
      if(e.response.status == 400){
        return {data: null, err:errorMessages[400]}
      }
      if(e.response.status == 404){
        return {data: null, err:errorMessages[404]}
      }
      if(e.response.status == 500){
        return {data: null, err:errorMessages[500]}
      }
    }

    if(e.request){
      //request was sent but no response
      return {data: null, err:errorMessages.request}
    }

    else{
      return {data: null, err:errorMessages.else}      
    }
  }
}

async function updateTravelRequest_API(data){
  try{
    const res = await axios.patch(`${TRAVEL_API_URL}/travel-requests/${data.travelRequest.travelRequestId}`, {travelRequest: TR_backendTransformer(data.travelRequest), submitted:data.submitted}, {retry, retryDelay})

    if(res.status >= 200 && res.status<300){
      return {data: {response: res.data}, err:null}
    }

  }catch(e){
    if(e.response){
      //respose received from server
      if(e.response.status == 400){
        return {data: null, err:errorMessages[400]}
      }
      if(e.response.status == 404){
        return {data: null, err:errorMessages[404]}
      }
      if(e.response.status == 500){
        return {data: null, err:errorMessages[500]}
      }
    }

    if(e.request){
      //request was sent but no response
      return {data: null, err:errorMessages.request}
    }

    else{
      return {data: null, err:errorMessages.else}      
    }
  }
}

async function getTravelRequest_API(data){
  try{
    const {travelRequestId} = data
    const res = await axios.get(`${TRAVEL_API_URL}/travel-requests/${travelRequestId}`)
    if(res.status >=200 && res.status<300){
      return {data:TR_frontendTransformer(res.data), err:null}
    }
  }catch(e){
    if(e.response){
      //respose received from server
      if(e.response.status == 400){
        return {data: null, err:errorMessages[400]}
      }
      if(e.response.status == 404){
        return {data: null, err:errorMessages[404]}
      }
      if(e.response.status == 500){
        return {data: null, err:errorMessages[500]}
      }
    }

    if(e.request){
      //request was sent but no response
      return {data: null, err:errorMessages.request}
    }

    else{
      return {data: null, err:errorMessages.else}      
    }
  } 
}

async function cashPolicyValidation_API(data){
  try{
    const {type, tenantId, amount, groups} = data;
    const res = await axios.post(`${TRAVEL_API_URL}/validate-cash-policy/${tenantId}`, {type, amount, groups})
    
    if(res.status >= 200 && res.status<300){
      return {data: {response: res.data}, err:null}
    }

  }catch(e){
    if(e.response){
      //respose received from server
      if(e.response.status == 400){
        return {data: null, err:errorMessages[400]}
      }
      if(e.response.status == 404){
        return {data: null, err:errorMessages[404]}
      }
      if(e.response.status == 500){
        return {data: null, err:errorMessages[500]}
      }
    }

    if(e.request){
      //request was sent but no response
      return {data: null, err:errorMessages.request}
    }

    else{
      return {data: null, err:errorMessages.else}      
    }
  }
}

async function policyValidation_API(data){
  try{
    const {type, groups, policy, value, tenantId} = data;
    const res = await axios.post(`${TRAVEL_API_URL}/validate-policy/${tenantId}/`, {type, groups, policy, value}, {retry, retryDelay})

    if(res.status >= 200 && res.status<300){
      return {data: {response: res.data}, err:null}
    }

  }catch(e){
    if(e.response){
      //respose received from server
      if(e.response.status == 400){
        return {data: null, err:errorMessages[400]}
      }
      if(e.response.status == 404){
        return {data: null, err:errorMessages[404]}
      }
      if(e.response.status == 500){
        return {data: null, err:errorMessages[500]}
      }
    }

    if(e.request){
      //request was sent but no response
      return {data: null, err:errorMessages.request}
    }

    else{
      return {data: null, err:errorMessages.else}      
    }
  }
}


//for cash advance

async function getCashAdvance_API(data){
  try{
    const {travelRequestId, cashAdvanceId} = data
    const res = await axios.get(`${TRAVEL_API_URL}/cash-advances/${travelRequestId}/${cashAdvanceId}`)
    if(res.status >=200 && res.status<300){
      return {data:res.data, err:null}
    }
  }catch(e){
    if(e.response){
      //respose received from server
      if(e.response.status == 400){
        return {data: null, err:errorMessages[400]}
      }
      if(e.response.status == 404){
        return {data: null, err:errorMessages[404]}
      }
      if(e.response.status == 500){
        return {data: null, err:errorMessages[500]}
      }
    }

    if(e.request){
      //request was sent but no response
      return {data: null, err:errorMessages.request}
    }

    else{
      return {data: null, err:errorMessages.else}      
    }
  } 
}

async function cancelCashAdvance_API(data){
  try{
    const {travelRequestId, cashAdvanceId} = data;
    const res = await axios.post(`${TRAVEL_API_URL}/cash-advances/${travelRequestId}/${cashAdvanceId}/cancel`)
    
    if(res.status >= 200 && res.status<300){
      return {data:res.data, err:null}
    }

  }catch(e){
    if(e.response){
      //respose received from server
      if(e.response.status == 400){
        return {data: null, err:errorMessages[400]}
      }
      if(e.response.status == 404){
        return {data: null, err:errorMessages[404]}
      }
      if(e.response.status == 500){
        return {data: null, err:errorMessages[500]}
      }
    }

    if(e.request){
      //request was sent but no response
      return {data: null, err:errorMessages.request}
    }

    else{
      return {data: null, err:errorMessages.else}      
    }
  }  
}

export { postTravelRequest_API, 
  updateTravelRequest_API, 
  cashPolicyValidation_API, 
  policyValidation_API, 
  getTravelRequest_API, 
  cancelCashAdvance_API, 
  getCashAdvance_API};


