/**
 * Picks up all the actionables that the Finance Role has to perform.
 *
 * @description
 * Finance Role Actionables:
 * 1. All Cash advances with status as pending settlement.
 * 2. All Cash advances with status as Paid and Cancelled.
 * 3. All Expense Header Reports with status as pending Settlement (Full Trip).
 * 4. All non-travel expense header reports with status pending Settlement.
 * 5. All expense header reports having status Paid.
 */

import dashboard from "../models/dashboardSchema.js";
import REIMBURSEMENT from "../models/reimbursementSchema.js";

const countSettlements = async (tenantId) => {
  const statusFilters = {
    cashAdvance: ["pending settlement", "Paid and Cancelled"],
    travelExpense: ["pending settlement", "Paid"],
    reimbursement: ["pending settlement"],
  };

  const filter = {
    tenantId,
    $or: [
      {
        "cashAdvanceSchema.cashAdvancesData": {
          $elemMatch: {
            cashAdvanceStatus: { $in: statusFilters.cashAdvance },
          },
        },
      },
      {
        "tripSchema.travelExpenseData": {
          $elemMatch: {
            expenseHeaderStatus: { $in: statusFilters.travelExpense },
          },
        },
      },
    ],
  };

  // Get the counts of documents
  const [dashboardCount, reimbursementCount] = await Promise.all([
    dashboard.countDocuments(filter),
    REIMBURSEMENT.countDocuments({
      tenantId,
      expenseHeaderStatus: { $in: statusFilters.reimbursement },
    }),
  ]);

  const totalCount = dashboardCount + reimbursementCount;

  return {
    dashboardCount,
    reimbursementCount,
    totalCount,
  };
};

export const financeLayout = async (tenantId) => {
  try {
    const { totalCount } = await countSettlements(tenantId);
    // console.log("count finance", totalCount);
    return totalCount;
  } catch (error) {
    console.error("Error in fetching employee Dashboard:", error);
    throw new Error("Error in fetching employee Dashboard");
  }
};

// to-do - (empId in params -to be added)Finance employee must be verified using hrCompanyStructure
// export const financeLayout = async (tenantId, empId) => {
//     try {
//         const settlements = await Dashboard.find({
//             'travelRequestSchema.tenantId':tenantId,
//             'cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus': { $in: ['pending settlement', 'Paid and Cancelled'] },
//             'tripSchema.travelExpenseData.expenseHeaderStatus':{$in: ['pending settlement', 'Paid']},
//             'reimbursementSchema.expenseHeaderStatus':{$in: ['pending settlement']},
//         });

//         let result;
//         result = {message: 'All are settled.'}
//         if (!settlements || settlements.length === 0) {
//             return result
//         }

//        const pendingCashAdvanceSettlements = []
//        const pendingTravelExpenseSettlements = []
//        const pendingNonTravelExpenseSettlements = []

// if(settlements){
//     pendingCashAdvanceSettlements = settlements.filter(doc => {
//         return doc.cashAdvanceSchema.cashAdvancesData.some(
//             data =>
//                 data.cashAdvanceStatus === 'pending settlement' ||
//                 data.cashAdvanceStatus === 'Paid and Cancelled'
//         );
//     });

//     pendingTravelExpenseSettlements = settlements.filter(doc => {
//         return doc.tripSchema.travelExpenseData.some(
//             data =>
//                 data.expenseHeaderStatus === 'pending settlement' ||
//                 data.expenseHeaderStatus === 'Paid'
//         );
//     });

//     pendingNonTravelExpenseSettlements = settlements.filter(doc => {
//         return doc.reimbursementSchema.some(
//             data =>
//                 data.expenseHeaderStatus === 'pending settlement'
//         );
//     });

//     // await processSettlements(pendingCashAdvanceSettlements, pendingTravelExpenseSettlements, pendingNonTravelExpenseSettlements);

//     return result ={ pendingCashAdvanceSettlements,pendingTravelExpenseSettlements, pendingNonTravelExpenseSettlements}
//     // return res.status(200).json({
//     //     message: 'Settlements processed successfully.',
//     // });

// } else{
//     return result ={}
// }} catch (error) {
//         console.error("Error in fetching employee Dashboard:", error);
//         throw new Error('Error in fetching employee Dashboard');
//     }
// };
