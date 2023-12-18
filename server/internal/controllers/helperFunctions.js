



// -- fOR NOW Not using helper functions--











import axios from 'axios';

//All of the below are response helper functions for internal api calls (microservice to microservice api calls).
export function handleUnexpectedResponseStatus(response, res) {
  console.error('Unexpected response status:', response.status);
  console.error('Response Data:', response.data);
  res.status(response.status).json({
    success: false,
    error: 'Unexpected response status from Approval Microservice',
    data: response.data,
  });
}

export function handleAxiosError(error, res) {
  console.error('Error adding leg in Approval Microservice:', error);

  if (axios.isAxiosError(error)) {
    handleAxiosErrorResponse(error, res);
  } else {
    handleNonAxiosError(error, res);
  }
}

export function handleAxiosErrorResponse(error, res) {
  if (error.response) {
    console.error('Response Status:', error.response.status);
    console.error('Response Data:', error.response.data);
    res.status(error.response.status).json({ success: false, error: 'Error in Approval Microservice', data: error.response.data });
  } else if (error.request) {
    console.error('No response received from the Approval Microservice');
    res.status(500).json({ success: false, error: 'No response received from the Approval Microservice' });
  } else {
    console.error('Axios error occurred without a request');
    res.status(500).json({ success: false, error: 'Axios error occurred without a request' });
  }
}

export function handleNonAxiosError(error, res) {
  console.error('Non-Axios exception occurred:', error.message);
  res.status(500).json({ success: false, error: 'Non-Axios exception occurred', message: error.message });
}
