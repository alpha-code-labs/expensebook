// import Expense from '../models/expenseSchema.js';

// const calculateTotalCashAmount = expense => {
//   let totalCashAmount = 0;
//   const cashAdvances = expense.embeddedTrip.embeddedCashAdvance.cashAdvances || [];

//   cashAdvances.forEach(cashAdvance => {
//     const amountDetails = cashAdvance.amountDetails || [];
//     amountDetails.forEach(details => {
//       totalCashAmount += details.amount || 0;
//     });
//   });

//   return totalCashAmount;
// };

// const calculateTotalExpenseAmount = expense => {
//   let totalExpenseAmount = 0;
//   const expenseLines = expense.expenseLines || [];

//   expenseLines.forEach(line => {
//     totalExpenseAmount += line.transactionData.totalAmount || 0;
//     if (line.isPersonalExpense === true) {
//       totalExpenseAmount -= line.personalExpenseAmount || 0;
//     }
//   });

//   return totalExpenseAmount;
// };

// const calculateRemainingCash = (totalCashAmount, totalExpenseAmount) => {
//   return totalCashAmount - totalExpenseAmount;
// };

// const updateExpenseWithAmountStatus = async (expense, totalCashAmount, totalExpenseAmount, remainingCash) => {
//     try {
//       if (!expense || !expense.embeddedTrip || !expense.embeddedTrip.userId) {
//         throw new Error('Invalid expense structure: Unable to access necessary properties.');
//       }
  
//       expense.expenseAmountStatus = {
//         totalCashAmount,
//         totalExpenseAmount,
//         remainingCash,
//       };
  
//       // Ensure that the necessary nested properties exist before setting 'createdBy'
//       if (expense.embeddedTrip.userId.empId) {
//         expense.createdBy = {
//           empId: expense.embeddedTrip.userId.empId,
//           name: expense.embeddedTrip.userId.name, 
//         };
//       } else {
//         throw new Error('Missing empId within embeddedTrip.userId.');
//       }
  
//       const savedExpense = await expense.save();
  
//       console.log('Expense updated successfully:', savedExpense);
  
//       return savedExpense;
//     } catch (error) {
//       console.error('Error occurred while updating expense:', error);
//       throw new Error('An error occurred while updating expense with expense amount status.');
//     }
//   };
  
  
  
// const onSaveLineItem = async (req, res) => {
//     try {
//       const { tenantId, expenseHeaderID, empId } = req.params;
//       const { lineItemDataArray } = req.body;

//       const expense = await Expense.findOne({
//         'tenantId': tenantId,
//         'expenseHeaderID': expenseHeaderID,
//         'embeddedTrip.userId.empId': empId,
//     });
  
//       if (!expense) {
//         console.log('Expense not found for the provided criteria.');
//         return res.status(404).json({ error: 'Expense not found for the provided criteria.' });
//       }
  
//       lineItemDataArray.forEach((lineItemData) => {
//         const existingExpenseLineIndex = expense.expenseLines.findIndex(
//           (expenseLine) =>
//             expenseLine.transactionData.billNumber === lineItemData.billNumber &&
//             expenseLine.transactionData.totalAmount === lineItemData.totalAmount
//         );
  
//         if (existingExpenseLineIndex !== -1) {
//           // Update existing expense line
//           expense.expenseLines[existingExpenseLineIndex] = {
//             transactionData: {
//               businessPurpose: lineItemData.businessPurpose || '',
//               vendorName: lineItemData.vendorName || '',
//               billNumber: lineItemData.billNumber || '',
//               billDate: lineItemData.billDate || '',
//               grossAmount: lineItemData.grossAmount || 0,
//               taxes: lineItemData.taxes || 0,
//               totalAmount: lineItemData.totalAmount || 0,
//               description: lineItemData.description || '',
//             },
//             expenseType: lineItemData.expenseType || '',
//             billRejectionReason: lineItemData.billRejectionReason || '',
//             isPersonalExpense: lineItemData.isPersonalExpense || false,
//             modeOfPayment: lineItemData.modeOfPayment || '',
//             billImageUrl: lineItemData.billImageUrl || '',
//           };
//         } else {
//           // Create new expense line
//           const newExpenseLine = {
//             transactionData: {
//               businessPurpose: lineItemData.businessPurpose || '',
//               vendorName: lineItemData.vendorName || '',
//               billNumber: lineItemData.billNumber || '',
//               billDate: lineItemData.billDate || '',
//               grossAmount: lineItemData.grossAmount || 0,
//               taxes: lineItemData.taxes || 0,
//               totalAmount: lineItemData.totalAmount || 0,
//               description: lineItemData.description || '',
//             },
//             expenseType: lineItemData.expenseType || '',
//             billRejectionReason: lineItemData.billRejectionReason || '',
//             isPersonalExpense: lineItemData.isPersonalExpense || false,
//             modeOfPayment: lineItemData.modeOfPayment || '',
//             billImageUrl: lineItemData.billImageUrl || '',
//           };
//           expense.expenseLines.push(newExpenseLine);
//         }
//       });
  
//       const totalCashAmount = calculateTotalCashAmount(expense);
//       const totalExpenseAmount = calculateTotalExpenseAmount(expense);
//       const remainingCash = calculateRemainingCash(totalCashAmount, totalExpenseAmount);
  
//       const updatedExpense = await updateExpenseWithAmountStatus(expense, totalCashAmount, totalExpenseAmount, remainingCash);
//       console.log('Expense line items saved successfully.');
//       return res.status(200).json({ message: 'Expense line items saved successfully.', updatedExpense });
//     } catch (error) {
//         console.error('An error occurred while saving the expense line items:', error);
//       return res.status(500).json({ error: 'An error occurred while saving the expense line items.' });
//     }
//   };
  
  

// export default onSaveLineItem;

