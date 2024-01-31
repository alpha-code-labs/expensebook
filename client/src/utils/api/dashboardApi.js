import axios from "axios";
import { axiosRetry,handleRequestError } from "../apiHandler";



const BASE_URL_URL= `http://192.168.176.73:8082/`


export const getPreferenceDataApi = async (tenantId) => {
    const url = `http://localhost:9001/api/preference`;
  
    try {
      const response = await axiosRetry(axios.get, url);
      return { data: response.data, error: null };
    } catch (error) {
      handleRequestError(error);
      const errorObject = {
        status: error.response?.status || null,
        message: error.message || 'Unknown error',
      };
  
      return { data: null, error: errorObject };
    }
  };