import { fetchTravelRequestData  } from '../services/travelService.js'; 

async function fetchAndTravelRequestData () {
    try {
      const result = await fetchTravelRequestData ();
  
      if (result.success) {
        // Display or work with the fetched data
        console.log('Fetched Travel Requests:', result.data);
      } else {
        console.error('Error:', result.error);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
  
  // Call the function to fetch and display cash advances
  fetchAndTravelRequestData();
  