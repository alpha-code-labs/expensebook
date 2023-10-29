// import { expense } from '../dummyData/expenseDummyData.js';

// export const fetchExpenseData = async () => {
//   try {
//     // Filter cash advances with a status of 'pending approval'
//     const filteredExpenses = expense.filter((expense) => {
//       return expense.expenseStatus === 'pending approval';
//     });

//     return filteredExpenses;
//   } catch (error) {
//     console.error('An error occurred while fetching cash advance data:', error.message);
//     throw error;
//   }
// };



import { expense } from '../dummyData/expenseDummyData.js';

export const fetchExpenseData = async () => {
  try {

    // Filter travel requests with a status of 'pending approval'
    const filteredExpense = expense.filter((item) => {
      return item.expenseStatus === 'pending approval';
    });
  
      return filteredExpense;
  } catch (error) {
    console.error('An error occurred while fetching expense data:', error.message);
    throw error;
  }
};
