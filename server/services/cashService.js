import axios from "axios";

const CASH_MICROSERVICE_URL = "";

export async function createCashAdvance(travelRequest) {
  try {
    axios
      .post(`${CASH_MICROSERVICE_URL}/create-cash-advance`, travelRequest)
      .then((response) => {
        if (response.error) {
          console.error(response.error);
        } else {
          return  response.data ;
        }
      })
      .catch((e) => {
        console.error(e.toJSON);
      });
  } catch (e) {
    throw e;
  }
}

export {createCashAdvance}