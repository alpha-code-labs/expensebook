// import { travelRequestData } from '../dummyData/dummyData.js';

// export const fetchTravelRequestData = async () => {
//   try {
//     // Ensure travelRequestData is an object
//     if (typeof travelRequestData !== 'object' || Array.isArray(travelRequestData)) {
//       console.error('Error: travelRequestData is not a single object.');
//       return null; // or handle it accordingly based on your use case
//     }

//     // Check the condition directly on the single object
//     if (travelRequestData.travelRequestStatus === 'pending approval') {
//       console.log(travelRequestData);
//       return [travelRequestData]; // return an array with the matching object
//     } else {
//       console.log('No travel request with status "pending approval" found.');
//       return [];
//     }
//   } catch (error) {
//     console.error('An error occurred while fetching travel request data:', error.message);
//     throw error;
//   }
// };




// import { travelRequests } from '../dummyData/dummyData.js';

// export const fetchTravelRequestData = async (req, res) => { 
//   try {
//     // Use the dummy data instead of making an HTTP request
//     const fetchedTravelRequests = travelRequests;

//     // Filter travel requests with a status of 'pending approval'
//     const filteredTravelRequests = fetchedTravelRequests.filter((travelRequest) => {
//       return travelRequest.travelRequestStatus === 'pending approval';
//     });

//     // Display a success message if data is fetched successfully
//     console.log('Success: Travel requests with status "pending approval" fetched.');
//     console.log(filteredTravelRequests);

//     // Send a success response with the filtered travel requests
//     res.status(200).json(filteredTravelRequests);
//   } catch (error) {
//     // Handle network errors or other exceptions
//     console.error('An error occurred while fetching travel request data:', error.message);
//     // Send an error response
//     res.status(500).json({ error: 'An error occurred while fetching travel request data.' });
//   }
// };







// import { travelRequests } from '../dummyData/dummyData.js';

// export const fetchTravelRequestData = async (approverUserId) => {
//   try {
//     // Use the dummy data instead of making an HTTP request
//     const fetchedTravelRequests = travelRequests;

//     // Filter travel requests with a status of 'pending approval' and whose approvers include the given user
//     const filteredTravelRequests = fetchedTravelRequests.filter((travelRequest) => {
//       return (
//         travelRequest.travelRequestStatus === 'pending approval' &&
//         travelRequest.approvers.includes(approverUserId)
//       );
//     });

//     // Display a success message if data is fetched successfully
//     console.log(`Success: Pending approval travel requests for user ${approverUserId} fetched.`);
//     console.log(filteredTravelRequests)
//     // Return an array of pending approval travel requests for the specific user
//     return filteredTravelRequests;
//   } catch (error) {
//     // Handle network errors or other exceptions
//     console.error('An error occurred while fetching travel request data:', error.message);
//     throw error;
//   }
// };




















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
//           status: 'pending approval',
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
//     console.log('Success: All "pending approval" status data fetched successfully.');
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

import { travelRequestData, cashAdvancesData } from '../dummyData/dummyData.js';

export const fetchTravelRequestData = async () => {
  try {
    // Ensure travelRequestData is an object
    if (typeof travelRequestData !== 'object' || Array.isArray(travelRequestData)) {
      console.error('Error: travelRequestData is not a single object.');
      return null; // or handle it accordingly based on your use case
    }

    // Check the condition directly on the single object
    if (travelRequestData.travelRequestStatus === 'pending approval') {
      // Find the matching cash advance data based on travelRequestId
      const matchingCashAdvance = cashAdvancesData.find(
        (cashAdvance) => cashAdvance.travelRequestId === travelRequestData.travelRequestId
      );

      // If a matching cash advance is found, combine the data
      if (matchingCashAdvance) {
        const combinedData = {
          ...travelRequestData,
          cashAdvancesData: matchingCashAdvance,
        };
        console.log(combinedData);
        return [combinedData]; 
      } else {
        console.log('No matching cash advance found for the travel request.');
        return [travelRequestData]; // return an array with the travel request data only
      }
    } else {
      console.log('No travel request with status "pending approval" found.');
      return [];
    }
  } catch (error) {
    console.error('An error occurred while fetching travel request data:', error.message);
    throw error;
  }
};
