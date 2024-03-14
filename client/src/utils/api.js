import axios from 'axios'

const ONBOARDING_API_URL = import.meta.env.VITE_PROXY_URL

const retry =  3
const retryDelay = 3000

const errorMessages = {
  '404': 'Resource Not Found',
  '400': 'Can not fetch data at the moment',
  '500': 'Internal Server Error',
  'request': 'Network Error',
  'else': 'Something went wrong. Please try after sometime'
}

function handleError(e){
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

async function getTenantOrgHeaders_API(data){
    try{
      const {tenantId} = data
      const res = await axios.get(`${ONBOARDING_API_URL}/tenant/${tenantId}/org-headers`)
      if(res.status >=200 && res.status<300){
        return {data:res.data, err:null}
      }
    }catch(e){
      return handleError(e)
    }
  }

  async function postTenantOrgHeaders_API(data){
    try{  
      const {tenantId, orgHeaders} = data
      const res = await axios.post(`${ONBOARDING_API_URL}/tenant/${tenantId}/org-headers`, {orgHeaders})
      if(res.status >= 200 && res.status<300){
        return {data:res.data, err:null}
      }
    }catch(e){
      return handleError(e)
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

async function getTenantCompanyInfo_API(data){
  try{
    const {tenantId} = data
    const res = await axios.get(`${ONBOARDING_API_URL}/tenant/${tenantId}/company-info`)
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




async function getTenantGroups_API(data){
  try{
    const {tenantId} = data
    const res = await axios.get(`${ONBOARDING_API_URL}/tenant/${tenantId}/groups`)
    if(res.status >=200 && res.status<300){
    return {data:res.data, err:null}
    }
}catch(e){
   return handleError(e)
}
}


async function updateTenantGroups_API(data){
  try{
      const {tenantId, groups} = data
      const res = await axios.post(`${ONBOARDING_API_URL}/tenant/${tenantId}/groups`, {groups})
      if(res.status >=200 && res.status<300){
      return {data:res.data, err:null}
      }
  }catch(e){
      return handleError(e)
  }
}


async function getTenantGroupingLabels_API(data){
  try{
    const {tenantId} = data
    const res = await axios.get(`${ONBOARDING_API_URL}/tenant/${tenantId}/grouping-labels`)
    if(res.status >=200 && res.status<300){
    return {data:res.data, err:null}
    }
  }catch(e){
    return handleError(e)
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

async function getTenantTravelAllocations_API(data){
  try{
    const {tenantId} = data
    const res = await axios.get(`${ONBOARDING_API_URL}/tenant/${tenantId}/travel-allocations`)
    if(res.status >=200 && res.status<300){
      return {data:res.data, err:null}
    }
  }catch(e){
    return handleError(e)
  }
}

async function postTenantTravelAllocations_API(data){
  try{
    const {tenantId, travelAllocations} = data
    const res = await axios.post(`${ONBOARDING_API_URL}/tenant/${tenantId}/travel-allocations`, {travelAllocations})
    if(res.status >=200 && res.status<300){
      return {data:res.data, err:null}
    }
  }catch(e){
    return handleError(e)
  }
}

async function getTenantReimbursementAllocations_API(data){
  try{
    const {tenantId} = data
    const res = await axios.get(`${ONBOARDING_API_URL}/tenant/${tenantId}/reimbursement-allocations`)
    if(res.status >=200 && res.status<300){
      return {data:res.data, err:null}
    }
  }catch(e){
    return handleError(e)
  }
}

async function postTenantReimbursementAllocations_API(data){
  try{
    const {tenantId, reimbursementAllocations} = data
    const res = await axios.post(`${ONBOARDING_API_URL}/tenant/${tenantId}/reimbursement-allocations`, {reimbursementAllocations})
    if(res.status >=200 && res.status<300){
      return {data:res.data, err:null}
    }
  }catch(e){
    return handleError(e)
  }
}

async function getTravelAllocationFlags_API(data){
  try{
    const {tenantId} = data
    const res = await axios.get(`${ONBOARDING_API_URL}/tenant/${tenantId}/travel-allocation-flags`)
    if(res.status >=200 && res.status<300){
      return {data:res.data, err:null}
    }
  }catch(e){
    return handleError(e)
  }
}

async function postTravelAllocationFlags_API(data){
  try{
    const {tenantId, travelAllocationFlags} = data
    const res = await axios.post(`${ONBOARDING_API_URL}/tenant/${tenantId}/travel-allocation-flags`, {travelAllocationFlags})
    if(res.status >=200 && res.status<300){
      return {data:res.data, err:null}
    }
  }catch(e){
    return handleError(e)
  }
}

async function postReimbursementCategories_API(data){
  try{
    const {tenantId, reimbursementExpenseCategories} = data
    const res = await axios.post(`${ONBOARDING_API_URL}/tenant/${tenantId}/reimbursement-expense-categories`, {reimbursementExpenseCategories})
    if(res.status >=200 && res.status<300){
      return {data:res.data, err:null}
    }
  }catch(e){
    return handleError(e)
  }
}

async function getReimbursementCategories_API(data){
  try{
    const {tenantId} = data
    const res = await axios.get(`${ONBOARDING_API_URL}/tenant/${tenantId}/reimbursement-expense-categories`)
    if(res.status >=200 && res.status<300){
      return {data:res.data, err:null}
    }
  }catch(e){
    return handleError(e)
  }
}

async function postTravelCategories_API(data){
  try{
    const {tenantId, travelExpenseCategories} = data
    const res = await axios.post(`${ONBOARDING_API_URL}/tenant/${tenantId}/travel-expense-categories`, {travelExpenseCategories})
    if(res.status >=200 && res.status<300){
      return {data:res.data, err:null}
    }
  }catch(e){
    return handleError(e)
  }
}

async function getTravelCategories_API(data){
  try{
    const {tenantId} = data
    const res = await axios.get(`${ONBOARDING_API_URL}/tenant/${tenantId}/travel-expense-categories`)
    if(res.status >=200 && res.status<300){
      return {data:res.data, err:null}
    }
  }catch(e){
    return handleError(e)
  }
}

async function getTenantDefaultCurrency_API(data){
  try{
    const {tenantId} = data
    const res = await axios.get(`${ONBOARDING_API_URL}/tenant/${tenantId}/default-currency`)
    if(res.status >=200 && res.status<300){
      return {data:res.data, err:null}
    }
  }catch(e){
    return handleError(e)
  }
}

async function getTenantMulticurrencyTable_API(data){
  try{
    const {tenantId} = data
    const res = await axios.get(`${ONBOARDING_API_URL}/tenant/${tenantId}/multicurrency`)
    if(res.status >=200 && res.status<300){
      return {data:res.data, err:null}
    }
  }catch(e){
    return handleError(e)
  }
}

async function postTenantMulticurrencyTable_API(data){
  try{
    const {tenantId, multiCurrencyTable} = data
    const res = await axios.post(`${ONBOARDING_API_URL}/tenant/${tenantId}/multicurrency`, {multiCurrencyTable})
    if(res.status >=200 && res.status<300){
      return {data:res.data, err:null}
    }
  }catch(e){
    return handleError(e)
  }
}

async function onboardingCompleted_API(data){
  try{
    const {tenantId} = data
    const res = await axios.post(`${ONBOARDING_API_URL}/tenant/${tenantId}/onboarding-completed`)
    if(res.status >=200 && res.status<300){
      return {data:res.data, err:null}
    }
  }catch(e){
    return handleError(e)
  }
}

async function updateEmployeeDetails_API(data){
  try{
    const {tenantId, orgHeaders, employeeDetails, addedHeaders} = data
    const res = await axios.post(`${ONBOARDING_API_URL}/tenant/${tenantId}/employeeDetails`, {orgHeaders, employeeDetails, addedHeaders})
    if(res.status >=200 && res.status<300){
      return {data:res.data, err:null}
    }
  }catch(e){
    return handleError(e)
  }
}

async function getEmployeeDetails_API(data){
  try{
    const {tenantId} = data
    const res = await axios.get(`${ONBOARDING_API_URL}/tenant/${tenantId}/employees`)
    return {data:res.data, err:null}
  }catch(e){
    return handleError(e)
  }
}

  export {
    getTenantGroups_API,
    updateTenantGroups_API,
    getTenantGroupingLabels_API,
    postTenantOrgHeaders_API,
    updateEmployeeDetails_API,
    getEmployeeDetails_API,
    getTenantOrgHeaders_API, 
    postTenantTravelExpenseAllocation_API, 
    postTenantHRData_API,
    updateFormState_API,
    updateTravelPolicies_API,
    updateNonTravelAllocation_API,
    updateNonTravelPolicies_API,
    updateTravelCategoriesAllocation_API,
    getTenantTravelAllocations_API,
    postTenantTravelAllocations_API,
    getTenantReimbursementAllocations_API,
    postTenantReimbursementAllocations_API,
    getTravelAllocationFlags_API,
    postTravelAllocationFlags_API,
    postReimbursementCategories_API,
    getReimbursementCategories_API,
    postTravelCategories_API,
    getTravelCategories_API,
    onboardingCompleted_API,
    getTenantCompanyInfo_API,
    getTenantDefaultCurrency_API,
    getTenantMulticurrencyTable_API,
    postTenantMulticurrencyTable_API,
    postTenantCompanyInfo_API}