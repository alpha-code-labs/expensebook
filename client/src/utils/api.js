import axios from 'axios'

const Login_API_URL = 'http://localhost:8011/api'

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

async function postSignupData_API(data){
    try{
        const {formData} = data
        const res = await axios.post(`${Login_API_URL}/tenant-signup`, formData , {retry, retryDelay})
  
        if(res.status >= 200 && res.status<300){
            return {data: {data: res.data}, err:null}
        }
  
    }catch(e){
      handleError(e)
    }
}

