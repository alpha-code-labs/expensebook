import { fetchCashAdvanceDataWithBookedTravel } from '../services/cashService.js'; 

async function fetchAndDisplayCashAdvances() {
    try {
      const result = await fetchCashAdvanceDataWithBookedTravel();
  
      if (result.success) {
        // Display or work with the fetched data
        console.log('Fetched Cash Advances:', result.data);
      } else {
        console.error('Error:', result.error);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
  
  // Call the function to fetch and display cash advances
  fetchAndDisplayCashAdvances();
  