import { cashAdvancesData } from '../dummyData/dummyData.js';

export const fetchCashAdvanceData = async () => {
  try {
    // Filter cash advances with a status of 'pending approval'
    const filteredCashAdvances = cashAdvancesData.reduce((filtered, item) => {
      const cashAdvancesArray = item.cashAdvanceStatus || []; // Access the array of cash advances

      // Filter cash advances within the array
      const filteredAdvances = cashAdvancesArray.filter((advance) => {
        return advance.cashAdvanceStatus === 'pending approval';
      });

      if (filteredAdvances.length > 0) {
        // If there are pending advances, add the main details to the result
        filtered.push({
          cashAdvancesData: filteredAdvances, // Attach filtered advances
        });
      }

      return filtered;
    }, []);

    console.log(filteredCashAdvances);
    return filteredCashAdvances;
  } catch (error) {
    console.error('An error occurred while fetching cash advance data:', error.message);
    throw error;
  }
};



// import { cashAdvances } from '../dummyData/dummyData.js';

// export const fetchCashAdvanceData = async (req, res) => { // Make the function asynchronous
//   try {
//     // Use the dummy cash advance data instead of making an HTTP request
//     const fetchedCashAdvances = cashAdvances;

//     // Filter cash advances with a status of 'pending approval'
//     const filteredCashAdvances = fetchedCashAdvances.filter((cashAdvance) => {
//       return cashAdvance.travelRequestStatus === 'pending approval';
//     });

//     // Display a success message if data is fetched successfully
//     console.log('Success: Cash advances with status "pending approval" fetched.');
//     console.log(filteredCashAdvances);

//     // Send a success response with the filtered cash advances
//     res.status(200).json(filteredCashAdvances);
//   } catch (error) {
//     // Handle network errors or other exceptions
//     console.error(`An error occurred while fetching cash advance data: ${error.message}`);
//     // Send an error response
//     res.status(500).json({ error: 'An error occurred while fetching cash advance data.' });
//   }
// };


// import { cashAdvances } from '../dummyData/dummyData.js';
// import { travelRequests } from '../dummyData/dummyData.js';

// export const fetchCashAdvanceData = async (approverUserId) => {
//   try {
//     // Use the dummy cash advance data instead of making an HTTP request
//     const fetchedCashAdvances = cashAdvances;

//     // Filter cash advances with corresponding "pending approval" travel requests
//     const filteredCashAdvances = fetchedCashAdvances.filter((cashAdvance) => {
//       // Check if this cash advance is related to a "pending approval" travel request
//       if (cashAdvance.travelRequestStatus === 'pending approval') {
//         // Check if the approverUserId is among the approvers of the corresponding travel request
//         const relatedTravelRequestId = cashAdvance.travelRequestId; // Adjust this based on your data structure
//         const relatedTravelRequest = travelRequests.find((request) => request.travelRequestId === relatedTravelRequestId);
        
//         if (relatedTravelRequest && relatedTravelRequest.approvers.includes(approverUserId)) {
//           return true; // Include this cash advance in the filtered list
//         }
//       }
//       return false; // Exclude this cash advance
//     });

//     // Display a success message if data is fetched successfully
//     console.log(`Success: Cash advances that need approval from user ${approverUserId} fetched.`);
//     console.log(filteredCashAdvances)
//     // Return the array of filtered cash advances
//     return filteredCashAdvances;
//   } catch (error) {
//     // Handle network errors or other exceptions
//     console.error(`An error occurred while fetching cash advance data: ${error.message}`);
//     throw error;
//   }
// };






//With json server
// import axios from 'axios';

// const CASH_MICROSERVICE_URL = 'https://hr-and-company.onrender.com/cashAdvance';

// export const fetchCashAdvanceDataWithpending approvalTravel = async () => {
//   try {
//     let fetchCashAdvanceDataWithpending approvalTravel = [];

//     let page = 1; // Starting page number
//     const pageSize = 50; // Adjust the page size as needed

//     while (true) {
//       console.log(`Fetching page ${page} of cash advances with "pending approval" status...`);
//       const response = await axios.get(`${CASH_MICROSERVICE_URL}`, {
//         params: {
//           status: 'approved',
//           page, // Include the page number in the request
//           pageSize, // Include the page size in the request
//         },
//       });

//       if (response.status === 200 && response.data && response.data.length > 0) {
//         // Filter cash advances with corresponding "pending approval" travel requests
//         const filteredCashAdvances = response.data.filter((cashAdvance) => {
//           // You may need to adjust the condition depending on your data structure
//           return cashAdvance.travelRequest && cashAdvance.travelRequest.status === 'pending approval';
//         });

//         // Append the filtered data to the results array
//         fetchCashAdvanceDataWithpending approvalTravel = fetchCashAdvanceDataWithpending approvalTravel.concat(filteredCashAdvances);

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
//     console.log('Success: All "pending approval" status cash advances with corresponding travel requests fetched successfully.');
//     return {
//       success: true,
//       error: null,
//       data: fetchCashAdvanceDataWithpending approvalTravel,
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
