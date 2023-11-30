import axios from 'axios';
const CASH_ADVANCE_SERVER_URL ='http://localhost:8080/cash-advance/api'
const travelRequestId = 'tenant123_emp000079_tr_001'


async function createCashAdvanceAPI(data) {
  await axios.post(`${CASH_ADVANCE_SERVER_URL}/create-cash-advance/${travelRequestId}`, data);
}

async function getTravelRequestDetails(data){
  
  let response = null
  await axios.get(`${CASH_ADVANCE_SERVER_URL}/get-travel-request/${travelRequestId}`).
  then((res) => { console.log(res); response = res.data }).
  catch((error) => { console.log(error) });

  return response;
}

export {getTravelRequestDetails , createCashAdvanceAPI}

