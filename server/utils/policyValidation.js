import policies from '../dummyData/travelPolicy.json' assert { type: "json" }


export default async function policyValidation(type, groups, policy, value){
    //  console.log(policies)

    console.log(type, groups, policy, value)
    let notAllowed = false

    groups.forEach(group=>{
        if(policies['policies'][type][group][policy][value] != undefined){
            if(policies['policies'][type][group][policy][value].allowed == true){
                return {allowed: true, violationMessage:null}
            }
            else{
                notAllowed = true
            }
        }
    })
    
    //in case there are no policies to verify
    if(!notAllowed){
        return {allowed: null, violationMessage: null}
    }
}