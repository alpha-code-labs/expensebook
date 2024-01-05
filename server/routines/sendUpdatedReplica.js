import axios from 'axios'

const ms_endpoints = {
    travel_ms:'http://localhost:8001/api/travel/hr-data',
    cash_ms:'http://localhost:8002/api/cash/hr-data',
    approval_ms:'http://localhost:8003/api/approval/hr-data',
    finance_ms:'http://localhost:8004/api/finance/hr-data',
    dashboard_ms:'http://localhost:8005/api/dashboard/hr-data',
    loginLogout_ms:'http://localhost:8006/api/login/hr-data',
    onboarding_ms:'http://localhost:8007/api/onboarding/hr-data',
    expense:'http://localhost:8001/api/expense/hr-data',

}

export default async function sendUpdatedReplica(data){
    try{
        //using circuit-breaker pattern

        const keys = Object.keys(ms_endpoints)
        
        keys.forEach(async (key)=>{
            try{
                const res = await axios.post(ms_endpoints[key], data)
                if(!success(res.status)){
                    //handle failure
                    //break the circuit
                    throw new Error(`Could not update ${key}`)
                }
            }catch(e){
                throw(e)
            }
        })

        return 1

    }catch(e){
        return 0
    }
}

function success(x){
    if(x<300 && x>199) return true
    return false
}
