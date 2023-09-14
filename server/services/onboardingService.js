import axios from "axios"

const ONBOARDING_MICROSERVICE_URL = ''
const DASHBOARD_MICROSERVICE_URL = ''


export async function fetchOnboardingData(tenantId, employeeId /* for whom travel request is created*/ ){
    
    try{
        axios.get(ONBOARDING_MICROSERVICE_URL).then((response)=>{
            if(response.error){
                console.error(response.error)
            }
            else{
               return {onboardingData: response.data} 
            }
        }).catch(e => {
            console.error(e.toJSON);
        } )

    } catch(e){

        throw e
    }
}


export async function fetchGroupAndPoliciesData(tenantId, employeeId){
    
    try{
        axios.get(DASHBOARD_MICROSERVICE_URL).then((response)=>{
            if(response.error){
                console.error(response.error)
            }
            else{
               return {profileData: response.data} 
            }
        }).catch(e => {
            console.error(e.toJSON);
        } )
    } catch(e){

        throw e
    }
}