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

async function getTenantTravelExpenseAllocations_API(data){
  try{
    const {tenantId} = data
    const res = await axios.get(`${ONBOARDING_API_URL}/tenant/${tenantId}/travel-expense-allocation`)
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


  async function getTenantTravelCategoriesExpenseAllocation_API(data){
    try{
      const {tenantId} = data
      const res = await axios.get(`${ONBOARDING_API_URL}/tenant/${tenantId}/travel-categories-expense-allocation`)
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

  async function getTenantNonTravelExpenseAllocations_API(data){
    try{
      const {tenantId} = data
      const res = await axios.get(`${ONBOARDING_API_URL}/tenant/${tenantId}/non-travel-expense-allocation`)
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

  async function postTenantTravelAllocation_API(data){
      try{
          const {tenantId, allocationHeaders} = data
          const res = await axios.post(`${ONBOARDING_API_URL}/tenant/${tenantId}/travel-allocation`, {allocationHeaders})
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

async function getTenantNonTravelPolicies_API(data){
    try{
      const {tenantId} = data
      const res = await axios.get(`${ONBOARDING_API_URL}/tenant/${tenantId}/policies/non-travel`)
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

async function getTenantTravelPolicies_API(data){
    try{
      const {tenantId} = data
      const res = await axios.get(`${ONBOARDING_API_URL}/tenant/${tenantId}/policies/travel`)
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

async function getTenantGroupingLabels_API(data){
    try{
      const {tenantId} = data
      const res = await axios.get(`${ONBOARDING_API_URL}/tenant/${tenantId}/grouping-labels`)
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

  async function getTenantGroupHeaders_API(data){
    try{
      const {tenantId} = data
      const res = await axios.get(`${ONBOARDING_API_URL}/tenant/${tenantId}/group-headers`)
      if(res.status >=200 && res.status<300){
        return {data:res.data, err:null}
      }
    }catch(e){ 
      return handleError(e)
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

  async function getTenantEmployees_API(data){
    try{
      const {tenantId} = data
      const res = await axios.get(`${ONBOARDING_API_URL}/tenant/${tenantId}/employees`)
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

  async function getTenantAccountLines_API(data){
    try{
      const {tenantId} = data
      const res = await axios.get(`${ONBOARDING_API_URL}/tenant/${tenantId}/account-lines`)
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

  async function updateTenantAccountLines_API(data){
    try{
        const {tenantId, accountLines} = data
        const res = await axios.post(`${ONBOARDING_API_URL}/tenant/${tenantId}/account-lines`, {accountLines})
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

  async function getTenantMulticurrencyTable_API(data){
    try{
      const {tenantId} = data
      const res = await axios.get(`${ONBOARDING_API_URL}/tenant/${tenantId}/multicurrency`)
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

  async function postTenantMulticurrencyTable_API(data){
    try{
        const {tenantId, multiCurrencyTable} = data
        const res = await axios.post(`${ONBOARDING_API_URL}/tenant/${tenantId}/multicurrency`, {multiCurrencyTable})
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
  
  async function getTenantSystemRelatedRoles_API(data){
    try{
      const {tenantId} = data
      const res = await axios.get(`${ONBOARDING_API_URL}/tenant/${tenantId}/system-related-roles`)
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

  async function updateTenantSystemRelatedRoles_API(data){
    try{
        const {tenantId, systemRelatedRoles} = data
        const res = await axios.post(`${ONBOARDING_API_URL}/tenant/${tenantId}/system-related-roles`, {systemRelatedRoles})
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

  async function getTenantAdvanceSettlementOptions_API(data){
    try{
      const {tenantId} = data
      const res = await axios.get(`${ONBOARDING_API_URL}/tenant/${tenantId}/advance-settlement-options`)
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

  async function updateTenantAdvanceSettlementOptions_API(data){
    try{
        const {tenantId, advanceSettlementOptions} = data
        const res = await axios.post(`${ONBOARDING_API_URL}/tenant/${tenantId}/advance-settlement-options`, {advanceSettlementOptions})
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

  async function getTenantExpenseSettlementOptions_API(data){
    try{
      const {tenantId} = data
      const res = await axios.get(`${ONBOARDING_API_URL}/tenant/${tenantId}/expense-settlement-options`)
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

  async function updateTenantExpenseSettlementOptions_API(data){
    try{
        const {tenantId, expenseSettlementOptions} = data
        const res = await axios.post(`${ONBOARDING_API_URL}/tenant/${tenantId}/expense-settlement-options`, {expenseSettlementOptions})
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

async function updateTenantHrMaster_API(data){
    try{
        const {tenantId, hrMaster} = data
        const res = await axios.post(`${ONBOARDING_API_URL}/tenant/${tenantId}/update-hr-master`, {hrData:hrMaster})
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

  

  export {
    getTenantDefaultCurrency_API,
    getTenantGroupHeaders_API,
    postReimbursementCategories_API,
    getTenantReimbursementAllocations_API,
    postTenantReimbursementAllocations_API,
    getTravelCategories_API,
    postTravelCategories_API,
    getTravelAllocationFlags_API,
    postTravelAllocationFlags_API,
    getTenantCompanyInfo_API,
    getTenantOrgHeaders_API, 
    postTenantTravelAllocations_API,
    postTenantTravelExpenseAllocation_API,
    getTenantNonTravelExpenseAllocations_API, 
    postTenantHRData_API,
    updateFormState_API,
    getTenantTravelPolicies_API,
    updateTravelPolicies_API,
    getTenantNonTravelPolicies_API,
    updateNonTravelAllocation_API,
    updateNonTravelPolicies_API,
    updateTravelCategoriesAllocation_API,
    getTenantTravelAllocations_API,
    postTenantTravelAllocation_API,
    getTenantTravelExpenseAllocations_API,
    getTenantTravelCategoriesExpenseAllocation_API,
    getTenantGroupingLabels_API,
    updateTenantGroups_API,
    getTenantGroups_API,
    getTenantEmployees_API,
    getTenantAccountLines_API,
    updateTenantAccountLines_API,
    getTenantMulticurrencyTable_API,
    postTenantMulticurrencyTable_API, 
    getTenantSystemRelatedRoles_API,
    updateTenantSystemRelatedRoles_API,
    getTenantAdvanceSettlementOptions_API,
    updateTenantAdvanceSettlementOptions_API,
    getTenantExpenseSettlementOptions_API,
    updateTenantExpenseSettlementOptions_API,
    updateTenantHrMaster_API,
    postTenantCompanyInfo_API}