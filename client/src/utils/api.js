import axios from 'axios'

const ONBOARDING_API_URL = 'http://localhost:8001/api'

const retry =  3
const retryDelay = 3000

const errorMessages = {
  '404': 'Resource Not Found',
  '400': 'Can not fetch data at the moment',
  '500': 'Internal Server Error',
  'request': 'Network Error',
  'else': 'Something went wrong. Please try after sometime'
}

async function getTenantOrgHeaders_API(data){
    try{
      const {tenantId} = data
      const res = await axios.get(`${ONBOARDING_API_URL}/tenant/${tenantId}/org-headers`)
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

async function postTenantTravelExpenseAllocation_API(data){
try{
    const {tenantId, allocationHeaders} = data
    const res = await axios.post(`${ONBOARDING_API_URL}/tenant/${tenantId}/travel-expense-allocation`, {allocationHeaders})
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

async function postTenantCompanyInfo_API(data){
    try{
        const {tenantId, companyInfo} = data
        const res = await axios.post(`${ONBOARDING_API_URL}/tenant/${tenantId}/company-info`, {companyInfo})
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

async function postTenantHRData_API(data){
    try{
        const {tenantId, hrData} = data
        const res = await axios.post(`${ONBOARDING_API_URL}/tenant/${tenantId}/upload-hr-data`, {hrData})
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

async function updateFormState_API(data){
  try{
      const {tenantId, state} = data
      const res = await axios.post(`${ONBOARDING_API_URL}/tenant/${tenantId}/state`, {state})
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

async function updateTravelCategoriesAllocation_API(data){
  try{
      const {tenantId, allocationHeaders} = data
      const res = await axios.post(`${ONBOARDING_API_URL}/tenant/${tenantId}/travel-categories-expense-allocation`, {allocationHeaders})
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

async function updateNonTravelAllocation_API(data){
  try{
      const {tenantId, allocationHeaders} = data
      const res = await axios.post(`${ONBOARDING_API_URL}/tenant/${tenantId}/non-travel-expense-allocation`, {allocationHeaders})
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

async function updateNonTravelPolicies_API(data){
  try{
      const {tenantId, policies} = data
      const res = await axios.post(`${ONBOARDING_API_URL}/tenant/${tenantId}/policies/non-travel`, {policies})
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

async function updateTravelPolicies_API(data){
  try{
      const {tenantId, policies} = data
      const res = await axios.post(`${ONBOARDING_API_URL}/tenant/${tenantId}/policies/travel`, {policies})
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
    getTenantOrgHeaders_API, 
    postTenantTravelExpenseAllocation_API, 
    postTenantHRData_API,
    updateFormState_API,
    updateTravelPolicies_API,
    updateNonTravelAllocation_API,
    updateNonTravelPolicies_API,
    updateTravelCategoriesAllocation_API,
    postTenantCompanyInfo_API}