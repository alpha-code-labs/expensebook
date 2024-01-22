import axios from "axios";
import { axiosRetry,handleRequestError } from "../apiHandler";


export const tripItineraryCancellationApi = async ( tripId, data) => {
 
    const url = `${BASE_URL}/cancel-itinerary/${tripId}`;
    try {
      
      await axiosRetry(axios.patch, url, data);
      return {error:null};
  
    } catch (error) {
      handleRequestError(error);
    const errorObject = {
      status: error.response?.status || null,
      message: error.message || 'Unknown error',
    };
    console.log('itinerary ids Error : ',errorObject);
    return {  error: errorObject };
    }
  };

