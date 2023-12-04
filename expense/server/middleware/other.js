// import Expense from '../models/expenseSchema.js';

// class ExpenseController {
//   constructor(expenseModel) {
//     this.Expense = expenseModel;
//   }

//   fetchExpenseDetails = async (travelRequestId, userId, tenantId) => {
//     try {
//       if (!travelRequestId || !userId || !tenantId) {
//         throw new Error('Invalid input parameters.');
//       }

//       const expenseDetails = await this.getExpenseDetails(travelRequestId, userId);
//       const embeddedTripData = expenseDetails?.embeddedTrip || {};
//       const embeddedOnboardingData = await this.filterByTenant(expenseDetails?.embeddedOnboardingSchema || [], tenantId);

//       const tenantDetails = this.extractTenantDetails(embeddedOnboardingData);
//       const defaultCurrency = await this.getDefaultCurrency(tenantDetails?.multiCurrency);

//       const isCashAdvanceTaken = this.getCashAdvanceFlag(embeddedTripData);
//       const totalCashAdvances = this.getTotalCashAdvances(embeddedTripData);
//       const expenseCategories = await this.getExpenseCategories(embeddedOnboardingData);
//       const approverNames = await this.getApproversNames(embeddedTripData?.embeddedTravelRequest?.approvers);
//       const alreadyBookedExpenseLines = embeddedTripData?.embeddedTravelRequest?.bookings || [];

//       return {
//         expenseDetails,
//         embeddedTripData,
//         tenantDetails: {
//           ...tenantDetails,
//           defaultCurrency,
//         },
//         isCashAdvanceTaken,
//         totalCashAdvances,
//         expenseCategories,
//         approverNames,
//         alreadyBookedExpenseLines,
//       };
//     } catch (error) {
//       throw new Error(`An error occurred while fetching data: ${error.message}`);
//     }
//   };

//   getExpenseDetails = async (travelRequestId, userId) => {
//     try {
//       return await this.Expense.findOne({
//         travelRequestId,
//         'embeddedTrip.userId': userId,
//       });
//     } catch (error) {
//       throw new Error('Fetching expense details failed.');
//     }
//   };

//   filterByTenant = async (embeddedOnboardingSchema, tenantId) => {
//     try {
//       return embeddedOnboardingSchema.filter(onboarding => onboarding.tenantId === tenantId);
//     } catch (error) {
//       throw new Error('Filtering by tenant failed.');
//     }
//   };

//   extractTenantDetails = async embeddedOnboardingData => {
//     try {
//       if (embeddedOnboardingData.length === 0) {
//         throw new Error('Tenant data is empty.');
//       }
//       return {
//         GROUPING_FLAG: embeddedOnboardingData[0].GROUPING_FLAG,
//         ORG_HEADERS_FLAG: embeddedOnboardingData[0].ORG_HEADERS_FLAG,
//         multiCurrency: embeddedOnboardingData[0].multiCurrencyTable || [],
//       };
//     } catch (error) {
//       throw new Error(`Extracting tenant details failed: ${error.message}`);
//     }
//   };

//   getDefaultCurrency = async multiCurrency => {
//     try {
//       let currencies = multiCurrency?.map(currency => currency.value) || [];
//       if (currencies.length > 1) {
//         return currencies;
//       }
//       return currencies[0] || null;
//     } catch (error) {
//       throw new Error('Getting default currency failed.');
//     }
//   };

//   getCashAdvanceFlag = async embeddedTripData => {
//     try {
//       return embeddedTripData.embeddedTravelRequest?.isCashAdvanceTaken || false;
//     } catch (error) {
//       throw new Error('Fetching cash advance flag failed.');
//     }
//   };

//   getTotalCashAdvances = async embeddedTripData => {
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
//       throw new Error('Fetching total cash advances failed.');
//     }
//   };

//   getExpenseCategories = async embeddedOnboardingData => {
//     try {
//       let expenseCategories = [];
//       embeddedOnboardingData.forEach(onboardingData => {
//         if (onboardingData.expenseCategories) {
//           expenseCategories = [...expenseCategories, ...onboardingData.expenseCategories];
//         }
//       });
//       return expenseCategories;
//     } catch (error) {
//       throw new Error('Fetching expense categories failed.');
//     }
//   };

//   getApproversNames = async approvers => {
//     try {
//       const approverNames = approvers?.map(approver => approver.name) || [];
//       return approverNames.length > 0 ? approverNames : ['No approver names found'];
//     } catch (error) {
//       throw new Error('Fetching approver names failed.');
//     }
//   };
// }

// export default new ExpenseController(Expense);
