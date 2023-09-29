import { travelRequests } from '../dummyData/dummyData.js'; 
import axios from 'axios';

export const fetchTravelRequestData = async () => {
  try {
    // Use the dummy data instead of making an HTTP request
    const fetchedTravelRequests = travelRequests;

    // Filter travel requests with a status of 'booked'
    const bookedTravelRequests = fetchedTravelRequests.filter((travelRequest) => {
      return travelRequest.travelRequestStatus === 'booked';
    });

    // Display a success message if data is fetched successfully
    console.log('Success: Dummy travel request data with "booked" status fetched.');
    
    // Return an array of booked travel requests
    return bookedTravelRequests;
  } catch (error) {
    // Handle network errors or other exceptions
    console.error('An error occurred while fetching travel request data:', error.message);
    throw error;
  }
};

  





































// import axios from 'axios';

// const TRAVEL_MICROSERVICE_URL = 'https://hr-and-company.onrender.com/travelRequest';

// export const fetchTravelRequestData = async () => {
//   try {
//     let fetchedTravelRequests = []; // Updated variable name

//     let page = 1; // Starting page number
//     const pageSize = 50; // Adjust the page size as needed

//     while (true) {
//       const response = await axios.get(`${TRAVEL_MICROSERVICE_URL}`, {
//         params: {
//           status: 'booked',
//           page, // Include the page number in the request
//           pageSize, // Include the page size in the request
//         },
//       });

//       if (response.status === 200 && response.data && Array.isArray(response.data)) {
//         // Append the fetched data to the results array
//         fetchedTravelRequests = fetchedTravelRequests.concat(response.data); // Updated variable name

//         // Check if there might be more pages
//         if (response.data.length < pageSize) {
//           break; // Exit the loop if there are no more pages
//         }

//         // Increment the page number for the next request
//         page++;
//       } else {
//         // Handle non-success HTTP status codes, empty responses, or non-array data
//         return {
//           success: false,
//           error: `Failed to fetch travel request data. Status code: ${response.status}`,
//           data: null,
//         };
//       }
//     }

//     // Display a success message if data is fetched successfully
//     console.log('Success: All "Booked" status data fetched successfully.');
//     return {
//       success: true,
//       error: null,
//       data: fetchedTravelRequests, // Updated variable name
//     };
//   } catch (error) {
//     // Handle network errors or other exceptions
//     return {
//       success: false,
//       error: `An error occurred while fetching travel request data: ${error.message}`,
//       data: null,
//     };
//   }
// };
