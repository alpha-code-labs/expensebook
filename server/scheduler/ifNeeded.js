

//important!! - A batchjob is run to update status from upcoming to transit on the day of travel and they are carried out independently in trip and expense microservices . 
//If needed to update status in trip and expense container at the same time.


// import { Trip } from '../models/tripSchema.js';
// import axios from 'axios';
// import dotenv from 'dotenv'; 
// dotenv.config(); 

// // Function to update statuses in both trip and expense microservices
// export const updateStatus = async () => {
//   try {
//     const todayDate = new Date();

//     // Update documents in the Trip collection
//     const tripResult = await Trip.updateMany(
//       {
//         tripStatus: 'upcoming',
//         tripStartDate: { $lte: todayDate },
//       },
//       {
//         $set: { tripStatus: 'transit' },
//       }
//     );

//     // Notify the Expense microservice to update the status
//     const expenseApiEndpoint = process.env.EXPENSE_API_STATUS_TRANSIT;

//     // Update documents in the Expense collection
//     const expenseResult = await Expense.updateMany(
//       {
//         expenseStatus: 'upcoming',
//         expenseDate: { $lte: todayDate },
//       },
//       {
//         $set: { expenseStatus: 'transit' },
//       }
//     );

//     // Log the results
//     console.log(`Updated ${tripResult.nModified} trips.`);
//     console.log(`Updated ${expenseResult.nModified} expenses.`);

//     // Make an HTTP POST request to the expense microservice
//     const axiosResponse = await axios.post(expenseApiEndpoint, {
//       // Include any necessary data to identify and update expenses in the expense microservice.
//     });

//     // Log the response from the expense microservice
//     console.log(`Expense microservice response: ${axiosResponse.data}`);
//   } catch (error) {
//     console.error('Error updating documents:', error);
//   }
// };
