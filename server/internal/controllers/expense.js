import Trip  from '../models/tripSchema.js';
import { tripExpenseService } from '../services/expenseService.js';

const updateTripWithExpense = async (req, res) => {
  try {
    const { tripId, userId } = req.params;
    const trip = await findTrip({ tripId, userId });

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    await updateEmbeddedExpense(trip);

    return res.status(200).json({ success: true, message: getUpdateMessage(trip) });
  } catch (error) {
    return handleError(error, res);
  }
};

const findTrip = async ({ tripId, userId }) => {
  // Validation and Sanitization
  if (!tripId || !userId) {
    throw new Error('Invalid tripId or userId');
  }

  return await Trip.findOne({ tripId, userId });
};

const updateEmbeddedExpense = async (trip) => {
  try {
    if (!Object.keys(trip.embeddedExpense).length) {
      const updatedExpenseData = await tripExpenseService.performExpenseAPICall('getExpenseData', 'GET', null);
      trip.embeddedExpense = updatedExpenseData;
    } else {
      const updatedExpenseData = await tripExpenseService.performExpenseAPICall('getExpenseData', 'GET', null);
      trip.embeddedExpense = {
        ...trip.embeddedExpense,
        ...updatedExpenseData,
      };
    }
    await trip.save();
  } catch (error) {
    throw new Error('Failed to update embeddedExpense');
  }
};

const getUpdateMessage = (trip) => {
  return !Object.keys(trip.embeddedExpense).length
    ? 'Trip updated with Expense lines data'
    : 'Trip embeddedExpense updated';
};

const handleError = (error, res) => {
  console.error('Error updating Trip with Expense lines data:', error);
  return res.status(500).json({ success: false, error: 'Failed to update Trip with Expense data' });
};

export default updateTripWithExpense;


