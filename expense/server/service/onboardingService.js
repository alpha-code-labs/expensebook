// import HRCompany from '../models/hrCompanySchema.js';
// import { onboardingDummyData } from '../dummyData/onboardingDd.js';

// export const saveOrUpdateOnboardingData = async (tenantId, tenantName, companyName, onboardingData) => {
//   try {
//     const existingData = await HRCompany.findOne({
//       tenantId,
//       tenantName,
//       CompanyName: companyName,
//       embeddedOnboardingData: { $exists: true },
//     });

//     if (!existingData) {
//       const newHRCompanyData = new HRCompany({
//         tenantId,
//         tenantName,
//         CompanyName: companyName,
//         embeddedOnboardingData: onboardingData,
//       });
//       await newHRCompanyData.save();
      
//       return 'Onboarding data saved successfully.';
//     } else {
//       existingData.embeddedOnboardingData = onboardingData;
//       await existingData.save();

//       return 'Onboarding data updated successfully.';
//     }
//   } catch (error) {
//     console.error('An error occurred while saving or updating onboarding data:', error.message);
//     throw error;
//   }
// };

// export const retrieveOnboardingData = async () => {
//   try {
//     const existingData = await HRCompany.findOne({ embeddedOnboardingData: { $exists: true } });

//     if (existingData) {
//       return existingData.embeddedOnboardingData;
//     } else {
//       return 'No embedded onboarding data found in the HRCompany collection.';
//     }
//   } catch (error) {
//     console.error('An error occurred while retrieving onboarding data:', error.message);
//     throw error;
//   }
// };

// // Example usage
// saveOrUpdateOnboardingData(); // Save or update onboarding data
// retrieveOnboardingData(); // Retrieve onboarding data
