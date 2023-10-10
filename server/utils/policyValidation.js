import policies from '../test_data/travelPolicy.json' assert { type: "json" }


export default async function policyValidation(type, group, policy, value){
    //  console.log(policies)

    console.log(type, group, policy, value)

    if(policies['policies'][type][group][policy][value] != undefined){
        if(policies['policies'][type][group][policy][value].allowed == true){
            return {allowed: true, violationMessage:null}
        }
        else{
            return {allowed: false, violationMessage: policies['policies'][type][group][policy][value].violationMessage}
        }
    }

    else{
        return {allowed: null, violationMessage: null}
    }
}