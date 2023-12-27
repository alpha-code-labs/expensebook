import { cashAdvances } from '../dummyData/dummyData.js';

export const fetchCashAdvanceDataWithBookedTravel = async () => {
  try {
    // Use the dummy cash advance data instead of making an HTTP request
    const filteredCashAdvances = cashAdvances;

    // Display a success message if data is fetched successfully
    console.log('Success: Dummy cash advances fetched.');

    // Return the array of filtered cash advances
    return filteredCashAdvances;
  } catch (error) {
    // Handle network errors or other exceptions
    console.error(`An error occurred while fetching cash advance data: ${error.message}`);
    throw error;
  }
};


// export const fetchCashAdvanceDataWithBookedTravel = async () => {
//   try {
//     // Use the dummy cash advance data instead of making an HTTP request
//     const fetchedCashAdvances = cashAdvances;

//     // Filter cash advances with corresponding "Booked" travel requests
//     const filteredCashAdvances = fetchedCashAdvances.filter((cashAdvance) => {
//       // You may need to adjust the condition depending on your data structure
//       return cashAdvance.travelRequestId === 'booked';
//     });

//     // Display a success message if data is fetched successfully
//     console.log('Success: Dummy cash advances with corresponding "Booked" travel requests fetched.');

//     // Return the array of filtered cash advances
//     return filteredCashAdvances;
//   } catch (error) {
//     // Handle network errors or other exceptions
//     console.error(`An error occurred while fetching cash advance data: ${error.message}`);
//     throw error;
//   }
// };








// import axios from 'axios';

// const CASH_MICROSERVICE_URL = 'https://hr-and-company.onrender.com/cashAdvance';

// export const fetchCashAdvanceDataWithBookedTravel = async () => {
//   try {
//     let fetchCashAdvanceDataWithBookedTravel = [];

//     let page = 1; // Starting page number
//     const pageSize = 50; // Adjust the page size as needed

//     while (true) {
//       console.log(`Fetching page ${page} of cash advances with "booked" status...`);
//       const response = await axios.get(`${CASH_MICROSERVICE_URL}`, {
//         params: {
//           status: 'approved',
//           page, // Include the page number in the request
//           pageSize, // Include the page size in the request
//         },
//       });

//       if (response.status === 200 && response.data && response.data.length > 0) {
//         // Filter cash advances with corresponding "Booked" travel requests
//         const filteredCashAdvances = response.data.filter((cashAdvance) => {
//           // You may need to adjust the condition depending on your data structure
//           return cashAdvance.travelRequest && cashAdvance.travelRequest.status === 'booked';
//         });

//         // Append the filtered data to the results array
//         fetchCashAdvanceDataWithBookedTravel = fetchCashAdvanceDataWithBookedTravel.concat(filteredCashAdvances);

//         // Check if there might be more pages
//         if (response.data.length < pageSize) {
//           break; // Exit the loop if there are no more pages
//         }

//         // Increment the page number for the next request
//         page++;
//       } else {
//         // Handle non-success HTTP status codes or empty responses
//         console.error(`Failed to fetch cash advance data. Status code: ${response.status}`);
//         return {
//           success: false,
//           error: `Failed to fetch cash advance data. Status code: ${response.status}`,
//           data: null,
//         };
//       }
//     }

//     // Display a success message if data is fetched successfully
//     console.log('Success: All "Booked" status cash advances with corresponding travel requests fetched successfully.');
//     return {
//       success: true,
//       error: null,
//       data: fetchCashAdvanceDataWithBookedTravel,
//     };
//   } catch (error) {
//     // Handle network errors or other exceptions
//     console.error(`An error occurred while fetching cash advance data: ${error.message}`);
//     return {
//       success: false,
//       error: `An error occurred while fetching cash advance data: ${error.message}`,
//       data: null,
//     };
//   }
// };
