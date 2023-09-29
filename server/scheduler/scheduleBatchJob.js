import cron from 'node-cron';
import { createTrip } from '../controllers/tripController.js';
import { extractAndCompareData } from './extractAndCompareData.js'; 

export const startBatchJob = () => {
  // Schedule the cron job to run daily at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('Batch job started at the predefined time.');

      // Call the function to extract and compare data
      const processedData = await extractAndCompareData();

      // Now you can use processedData to perform further operations, such as creating trips
      createTrip(processedData);
      console.log('Batch job completed successfully.');
    } catch (error) {
      console.error('Batch job encountered an error:', error);
      // Handle the error gracefully, e.g., send notifications or log details
    }
  });
};




// import cron from 'node-cron';
// import { fetchTravelRequestData } from '../services/travelService.js';
// import { fetchCashAdvanceDataWithBookedTravel } from '../services/cashService.js';
// import { extractAndCompareData } from './extractAndCompareData.js';

// export const startBatchJob = () => {
//   // Schedule the cron job to run daily at midnight
//   cron.schedule('0 0 * * *', async () => {
//     try {
//       console.log('Batch job started at the predefined time.');

//       // Data Extraction
//       const cashAdvanceData = await fetchCashAdvanceDataWithBookedTravel();
//       const travelRequestData = await fetchTravelRequestData();

//       // Call the function to extract and compare data
//       await extractAndCompareData(cashAdvanceData, travelRequestData);

//       // Data Transfer to Trip Microservice
//       await saveDataToTripContainer();

//       console.log('Batch job completed successfully.');
//     } catch (error) {
//       console.error('Batch job encountered an error:', error);
//       // Handle the error gracefully, e.g., send notifications or log details
//     }
//   });
// };
