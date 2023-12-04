// import Expense from '../models/expenseSchema.js';
// import HRCompany from '../models/hrCompanySchema.js';

// class ExpenseController {
//   constructor(expenseModel, hrCompanyModel) {
//     this.Expense = expenseModel;
//     this.HRCompany = hrCompanyModel;
//   }

//   async fetchExpenseDetails(travelRequestId, userId, tenantId) {
//     try {
//       if (!travelRequestId || !userId || !tenantId) {
//         throw new Error('Invalid input parameters.');
//       }

//       // Asynchronously fetch data from the Expense collection
//       const expenseDetailsPromise = this.getExpenseDetails(travelRequestId, userId);

//       // Asynchronously fetch data from the HRCompany collection
//       const HRCompanyPromise = this.getHRCompanyDetails(expenseDetailsPromise, tenantId);

//       // Await both promises simultaneously using Promise.allSettled for error handling
//       const [expenseDetails, HRCompany] = await Promise.allSettled([
//         expenseDetailsPromise,
//         HRCompanyPromise,
//       ]);

//       // Check if any promises failed
//       if (expenseDetails.status === 'rejected' || HRCompany.status === 'rejected') {
//         throw new Error('Failed to fetch data.');
//       }

//       // Extract resolved values from Promise results
//       const embeddedTripData = expenseDetails.value?.embeddedTrip || {};
//       const isCashAdvanceTaken = this.getCashAdvanceFlag(embeddedTripData);
//       const totalCashAdvances = this.getTotalCashAdvances(embeddedTripData);
//       const approverNames = this.getApproversNames(embeddedTripData?.embeddedTravelRequest?.approvers);
//       const alreadyBookedExpenseLines = embeddedTripData?.embeddedTravelRequest?.bookings || [];

//       const tenantDetails = this.extractTenantDetails(HRCompany.value);
//       const expenseCategories = this.getExpenseCategories(HRCompany.value);
//       const defaultCurrency = this.getDefaultCurrency(tenantDetails?.multiCurrency);

//       return {
//         expenseDetails,
//         embeddedTripData,
//         tenantDetails,
//         defaultCurrency,
//         isCashAdvanceTaken,
//         totalCashAdvances,
//         expenseCategories,
//         approverNames,
//         alreadyBookedExpenseLines,
//       };
//     } catch (error) {
//       throw new Error(`An error occurred while fetching data in fetchExpenseDetails: ${error.message}`);
//     }
//   }
  
//   getExpenseDetails(travelRequestId, userId) {
//     try {
//       return this.Expense.findOne({
//         travelRequestId,
//         'embeddedTrip.userId': userId,
//       });
//     } catch (error) {
//       throw new Error(`Fetching expense details failed in getExpenseDetails: ${error.message}`);
//     }
//   }
  

//   filterByTenant(HRCompany, tenantId) {
//     try {
//       return HRCompany.filter(onboarding => onboarding.tenantId === tenantId);
//     } catch (error) {
//       throw new Error(`Filtering by tenant failed in filterByTenant: ${error.message}`);
//     }
//   }
  
//   extractTenantDetails(HRCompany) {
//     try {
//       if (HRCompany.length === 0) {
//         throw new Error('Tenant data is empty.');
//       }
//       return {
//         GROUPING_FLAG: HRCompany[0].GROUPING_FLAG,
//         ORG_HEADERS_FLAG: HRCompany[0].ORG_HEADERS_FLAG,
//         multiCurrency: HRCompany[0].multiCurrencyTable || [],
//       };
//     } catch (error) {
//       throw new Error(`Extracting tenant details failed in extractTenantDetails: ${error.message}`);
//     }
//   }
  
  

//   getDefaultCurrency(multiCurrency) {
//     try {
//       let currencies = multiCurrency?.map(currency => currency.value) || [];
//       if (currencies.length > 1) {
//         return currencies;
//       }
//       return currencies[0] || null;
//     } catch (error) {
//       throw new Error(`Getting default currency failed in getDefaultCurrency: ${error.message}`);
//     }
//   }
  
  
//   getCashAdvanceFlag(embeddedTripData) {
//     try {
//       return embeddedTripData.embeddedTravelRequest?.isCashAdvanceTaken || false;
//     } catch (error) {
//       throw new Error(`Fetching cash advance flag failed in getCashAdvanceFlag: ${error.message}`);
//     }
//   }  
  

//   getTotalCashAdvances(embeddedTripData) {
//     try {
//       let totalCashAdvances = {
//         totalPaid: 0,
//         totalUnpaid: 0,
//       };
//       const cashAdvances = embeddedTripData?.embeddedCashAdvance || [];
//       cashAdvances.forEach(cashAdvance => {
//         if (cashAdvance.cashAdvanceStatus === 'paid') {
//           totalCashAdvances.totalPaid += cashAdvance.amount || 0;
//         } else {
//           totalCashAdvances.totalUnpaid += cashAdvance.amount || 0;
//         }
//       });
//       return totalCashAdvances;
//     } catch (error) {
//       throw new Error(`Fetching total cash advances failed in getTotalCashAdvances: ${error.message}`);
//     }
//   }
  
  
//   getExpenseCategories(HRCompany) {
//     try {
//       let expenseCategories = [];
//       HRCompany.forEach(onboardingData => {
//         if (onboardingData.expenseCategories) {
//           expenseCategories = [...expenseCategories, ...onboardingData.expenseCategories];
//         }
//       });
//       return expenseCategories;
//     } catch (error) {
//       throw new Error(`Fetching expense categories failed in getExpenseCategories: ${error.message}`);
//     }
//   }
  
//   getApproversNames(approvers) {
//     try {
//       const approverNames = approvers?.map(approver => approver.name) || [];
//       return approverNames.length > 0 ? approverNames : ['No approver names found'];
//     } catch (error) {
//       throw new Error(`Fetching approver names failed in getApproversNames: ${error.message}`);
//     }
//   }
   
// }

// export default ExpenseController


// //get Default currency
// const getDefaultCurrency = async (req, res) => {
//   try {
//     const { tenantId, tenantName } = req.params;

//     // Find the matching document in HRCompany based on tenantId and tenantName
//     const companyDetails = await HRCompany.findOne({ tenantId, tenantName });

//     if (!companyDetails) {
//       return res.status(404).json({ message: 'Company details not found' });
//     }

//     // Extract and send the defaultCurrency
//     const defaultCurrency = companyDetails.companyDetails.defaultCurrency;

//     res.status(200).json({ defaultCurrency });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export { getDefaultCurrency };


