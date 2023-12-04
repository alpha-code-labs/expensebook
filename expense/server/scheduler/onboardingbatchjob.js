// import cron from 'node-cron';
// import { saveOrUpdateOnboardingData } from '../service/onboardingService.js'; 
// import { onboardingDummyData } from '../dummyData/onboardingDd.js'; 

// // Function to handle the batch job logic
// const saveOnboardingData = async () => {
//   try {
//     const { tenantId, tenantName, companyName } = onboardingDummyData;

//     // Trigger the function to save or update onboarding data
//     const result = await saveOrUpdateOnboardingData(tenantId, tenantName, companyName, onboardingDummyData);
//     console.log('Batch job executed:', result);
//   } catch (error) {
//     console.error('An error occurred in the batch job:', error.message);
//   }
// };

// // Define the schedule for running the job every 20 seconds
// cron.schedule('*/20 * * * * *', async () => {
//   console.log('Running save onboarding data via batch job...');
//   await saveOnboardingData();
// });

// console.log('Batch job scheduled to run every 20 seconds.');
