import policies from '../test_data/travelPolicy.json' assert { type: "json" }


export default async function policyValidation(type, groups, policy, value){
    //  console.log(policies)
    try{
        
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

        if(notAllowed){
            return {allowed:false, violationMessage: policies['policies'][type][groups[0]][policy][value].violationMessage }
        }
        
        //in case there are no policies to verify
        if(!notAllowed){
            return {allowed: null, violationMessage: null}
        }


    }catch(error){
        throw(error)
    }
}