import {policies} from '../dummyData/cashAdvancePolicy.js' 


export default async function policyValidation(type, groups, amount){
    //  console.log(policies)
    try{
        let notAllowed = false
        let policyPresent = false
        let maxPolicyAmount = 0
        
        groups.forEach(group=>{
            const policyAmount = policies['policies'][type][group]['cash advance'].amount

            if(policyAmount != undefined && policyAmount!=null){
                policyPresent = true
                maxPolicyAmount = policyAmount

                if(Number(policyAmount) >= amount){
                    notAllowed = false
                    return {allowed: true, violationMessage:null}
                }
                else{
                    notAllowed = true
                }
            }
        })

        //in case there are no policies to verify
        if(!policyPresent){
            return {allowed: null, violationMessage: null}
        }

        
        if(!notAllowed){
            return {allowed: true, violationMessage: null}
        }

        if(notAllowed){
            return {allowed:false, violationMessage: `Cash Advance exceeds maximum allowed limit of ${maxPolicyAmount}`}
        }

        

        

    }catch(error){
        throw(error)
    }
}