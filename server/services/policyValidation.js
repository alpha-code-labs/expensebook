// import {policies} from '../dummyData/cashAdvancePolicy.js' 
import HRMaster from '../models/hrMaster.js'


export default async function policyValidation(tenantId, employeeId, travelType, amount){
    //  console.log(policies)
    try{
        // let notAllowed = false
        // let policyPresent = false
        // let maxPolicyAmount = 0
        
        // groups.forEach(group=>{
        //     const policyAmount = policies['policies'][type][group]['cash advance'].amount

        //     if(policyAmount != undefined && policyAmount!=null){
        //         policyPresent = true
        //         maxPolicyAmount = policyAmount

        //         if(Number(policyAmount) >= amount){
        //             notAllowed = false
        //             return {allowed: true, violationMessage:null}
        //         }
        //         else{
        //             notAllowed = true
        //         }
        //     }
        // })

        // //in case there are no policies to verify
        // if(!policyPresent){
        //     return {allowed: null, violationMessage: null}
        // }

        
        // if(!notAllowed){
        //     return {allowed: true, violationMessage: null}
        // }

        // if(notAllowed){
        //     return {allowed:false, violationMessage: `Cash Advance exceeds maximum allowed limit of ${maxPolicyAmount}`}
        // }


        console.log(tenantId, employeeId)
        let tenantData = await HRMaster.findOne({tenantId}, {employees:1, flags:1, policies:1})

        //console.log(tenantData)

        if(!tenantData) throw new Error('Tenant do not exists or can not fetch tenant details at the moment')
        
        if(!tenantData.flags.POLICY_SETUP_FLAG) return {allowed:true, violationMessage: null}

        let employeeData = tenantData.employees.filter(emp=>emp.employeeDetails.employeeId === employeeId)
        if(employeeData.length===0) throw new Error('can not fetch tenant details for given employeeId at the moment')
        employeeData = employeeData[0]

        const groups = employeeData.group
        const policies = tenantData?.policies.travelPolicies??false
        
        let notAllowed = false
        let policyPresent = false
        let maxPolicyAmount = 0

        const getPolicy = (group, policy, travelType)=>{
            let result = 0
            policies.forEach(groupPolicy=>{
              if(groupPolicy[group]!=null && groupPolicy[group]!=undefined){
                  result = groupPolicy[group]?.[travelType]?.[policy] 
                  return 
              }
            })
      
            return result
          }

        const groupPolicies = []
        groups.forEach(group=>{
            groupPolicies.push(getPolicy(group, 'Advance Payment', travelType))
        })
        
        let _limit = 0
       
        groupPolicies.forEach(pl=>{
            if(Number(pl.limit.amount)>_limit) _limit = Number(pl.limit.amount) 
        })

        console.log(groupPolicies, _limit)

        //if _limit is 0 than limits are not set.. so raise no exception
        if(_limit == 0) return {allowed:true, message:null}

        if(amount>_limit) return {allowed:false, violationMessage: `Cash Advance exceeds maximum allowed limit of ${_limit}`} 
        else return {allowed:true, message:null}
        

    }catch(error){
        throw(error)
    }
}
