import axios from "axios";
import policies from '../../src/assets/policies.json'


const server_url = 'http://localhost:8001/travel/api'

async function postTravelRequest_API(data){
    let travelRequestId = null

    await axios.post(`${server_url}/travel-request`, data).
    then((res) => { console.log(res); travelRequestId = res.data.travelRequestId }).
    catch((err) => { console.log(err) });

    return travelRequestId;
}

async function updateTravelRequest_API(data){
    let response = null

    await axios.patch(`${server_url}/travel-requests/${data.travelRequestId}`, data).
    then((res) => { console.log(res); response = res.data }).
    catch((err) => { console.log(err) });

    return response;
}


async function policyValidation_API(data){
  const {type, group, policy, value} = data;
  let response = null

  await axios.get(`${server_url}/validate-policy/${type}/${group}/${policy}/${value}`).
  then((res) => { console.log(res); response = res.data }).
  catch((err) => { console.log(err) });

  return response;
}


function validateTravelPolicy(type, group, policy, value){

//  console.log(policies)
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


export { postTravelRequest_API, updateTravelRequest_API, policyValidation_API };


