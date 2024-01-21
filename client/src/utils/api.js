import axios from "axios";
import policies from '../../src/assets/policies.json'
import CancelTravelRequest from "../pages/CancelTravelRequest";
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
    const {travelRequest, submitted} = data
    const res = await axios.patch(`${TRAVEL_API_URL}/travel-requests/${travelRequest.travelRequestId}`, {travelRequest:TR_backendTransformer(travelRequest), submitted}, {retry, retryDelay})

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

async function updateRawTravelRequest_API(data){
  try{
    const {travelRequest, submitted} = data
    const res = await axios.patch(`${TRAVEL_API_URL}/travel-requests/${travelRequest.travelRequestId}`, {travelRequest, submitted}, {retry, retryDelay})

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

async function getOnboardingData_API(data){
  try{
    const {tenantId, EMPLOYEE_ID, travelType} = data
    const res = await axios.get(`${TRAVEL_API_URL}/initial-data/${tenantId}/${EMPLOYEE_ID}/${travelType}`)
    if(res.status >=200 && res.status<300){
      return {data:{onboardingData: res.data}}
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

async function cancelTravelRequest_API(data){
  try{
    const {travelRequestId} = data
    const res = await axios.patch(`${TRAVEL_API_URL}/travel-requests/${travelRequestId}/cancel`, {travelRequestStatus:'cancelled'})
    if(res.status >=200 && res.status<300){
      return {data:{message: res.data}, err:null}
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

async function getRawTravelRequest_API(data){
  try{
    const {travelRequestId} = data
    const res = await axios.get(`${TRAVEL_API_URL}/travel-requests/${travelRequestId}`)
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

async function updateTravelBookings_API(data){
  try{
    const {itinerary, travelRequestId, submitted} = data
    const res = await axios.patch(`${TRAVEL_API_URL}/travel-requests/${travelRequestId}/bookings`, {itinerary, submitted}, {retry, retryDelay})

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

async function getTravelBookingOnboardingData_API(data){
  try{
    const {tenantId, employeeId, travelType} = data
    const res = await axios.get(`${TRAVEL_API_URL}/bookings-initial-data/${tenantId}/${employeeId}/${travelType}`)
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



export { 
  getTravelRequest_API,
  getRawTravelRequest_API,
  postTravelRequest_API, 
  updateTravelRequest_API,
  updateRawTravelRequest_API,
  updateTravelBookings_API, 
  policyValidation_API, 
  getOnboardingData_API,
  getTravelBookingOnboardingData_API, 
  cancelTravelRequest_API};
