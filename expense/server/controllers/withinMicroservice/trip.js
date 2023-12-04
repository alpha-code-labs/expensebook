import { tripService } from '../service/tripService.js';
import Expense from '../models/expenseSchema.js';

const sendExpenseLinesToTrip = async (req, res) => {
  try {
    // Fetch expense lines from Expense Microservice
    const expenseLines = await fetchExpenseLines();

    // Send expense lines to Trip Microservice
    await tripService.sendExpenseLinesToTrip(expenseLines);

    return res.status(200).json({ success: true, message: 'Expense lines sent to Trip Microservice' });
  } catch (error) {
    console.error('Error sending expense lines to Trip Microservice:', error);
    return res.status(500).json({ success: false, error: 'Failed to send expense lines to Trip Microservice' });
  }
};

const fetchExpenseLines = async () => {
  // Fetch expense lines from the Expense Microservice
  // Implement the logic to retrieve expense lines from the Expense Microservice
  // For example:
  // const expenseLines = await Expense.find({});

  // For demonstration purposes, returning mock data
  const expenseLines = [
    { id: 1, description: 'Expense 1', amount: 100 },
    { id: 2, description: 'Expense 2', amount: 150 },
    // ... more expense lines
  ];

  return expenseLines;
};

export default sendExpenseLinesToTrip;
