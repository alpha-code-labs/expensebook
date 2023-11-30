import axios from "axios";
import policies from '../../src/assets/policies.json'


const TRAVEL_API_URL = import.meta.env.VITE_TRAVEL_API_URL


async function postTravelRequest_API(data){
    let travelRequestId = null

    await axios.post(`${TRAVEL_API_URL}/travel-request`, data).
    then((res) => { console.log(res); travelRequestId = res.data.travelRequestId }).
    catch((err) => { console.log(err) });

    return travelRequestId;
}

async function updateTravelRequest_API(data){
    let response = null

    await axios.patch(`${TRAVEL_API_URL}/travel-requests/${data.travelRequestId}`, data).
    then((res) => { console.log(res); response = res.data }).
    catch((err) => { console.log(err) });

    return response;
}


async function policyValidation_API(data){
  const {type, group, policy, value} = data;
  let response = null

  await axios.get(`${TRAVEL_API_URL}/validate-policy/${type}/${group}/${policy}/${value}`).
  then((res) => { console.log(res); response = res.data }).
  catch((err) => { console.log(err) });

  return response;
}

export { postTravelRequest_API, updateTravelRequest_API, policyValidation_API};


