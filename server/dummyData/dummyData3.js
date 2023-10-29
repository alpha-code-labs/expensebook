// import { fetchExpenseData } from '../services/expense.js';
// import { Approval } from '../models/approvalSchema.js';

// // Define a function to save data in the approval container with fetched expense data
// export const saveDataInApprovalContainer = async (req, res) => {
//   try {
//     // Fetch expense data
//     const expenseData = await fetchExpenseData();

//     for (const newExpenseData of expenseData) {
//       // Check if an approval record with the same travelRequestId or tripID and expenseHeaderType already exists
//       const existingApproval = await Approval.findOne({
//         $or: [
//           { 'embeddedTravelRequest.travelRequestId': newExpenseData.tripID },
//           {
//             'embeddedExpenseContainerSchema.expenseHeaders': {
//               $elemMatch: {
//                 tripID: newExpenseData.expenseHeaders.tripID,
//                 expenseHeaderType: newExpenseData.expenseHeaders.expenseHeaderType,
//               },
//             },
//           },
//         ],
//       });

//       if (existingApproval) {
//         // Find the specific expenseHeader within the existing document based on tripID
//         const existingExpenseHeader = existingApproval.embeddedExpenseContainerSchema.expenseHeaders.find(
//           (header) => header.tripID === newExpenseData.tripID
//         );

//         if (existingExpenseHeader) {
//           // Check if the existing expenseHeaderType matches the new one
//           if (existingExpenseHeader.expenseHeaders.expenseHeaderType === newExpenseData.expenseHeaders.expenseHeaderType) {
//             // Check if there are any expenseLines
//             if (existingExpenseHeader.expenseLines) {
//               // Find the first expenseLine with the same billNumber
//               const existingBill = existingExpenseHeader.expenseLines.find(
//                 (line) => line.transactionData.billNumber === newExpenseData.expenseLines[0].transactionData.billNumber
//               );

//               if (existingBill) {
//                 // Update the existing bill with new data
//                 existingBill.transactionData = newExpenseData.expenseLines[0].transactionData;
//                 console.log('Bill is updated.');
//               } else {
//                 // If billNumber is different, add the new expenseLine
//                 existingExpenseHeader.expenseLines.push(newExpenseData.expenseLines[0]);
//               }
//             } else {
//               // If no existing expenseLines, add the new one
//               existingExpenseHeader.expenseLines = [newExpenseData.expenseLines[0]];
//             }
//           }
//         } else {
//           // If expenseHeaderType is different, create a new expenseHeader
//           existingApproval.embeddedExpenseContainerSchema.expenseHeaders.push(newExpenseData.expenseHeaders);
//         }
//       } else {
//         // If no existing document, create a new one
//         const newApproval = new Approval({
//           embeddedExpenseContainerSchema: newExpenseData,
//         });

//         // Save the new approval document
//         await newApproval.save();
//       }
//     }

//     console.log('Success: Expense data saved or updated in the approval container.');
//     res.status(200).json({ message: 'Success: Expense data saved or updated in the approval container.' });
//   } catch (error) {
//     console.error('An error occurred while saving expense data:', error.message);
//     res.status(500).json({ error: 'An error occurred while saving data.' });
//   }
// };
