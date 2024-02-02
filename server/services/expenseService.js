import Trip from '../models/tripSchema.js';

// Function to find trips to process
export const findTripsToProcess = async () => {
  return await Trip.find({ sentToExpense: false });
};

// Function to send data to Expense
export const sendToExpense = async (trip) => {
  // Implement your actual logic to send data to Expense
};

// Function to update the isSentToExpense flag
export const updateSentToExpenseFlag = async (tenantId, tripId, isSentToExpense) => {
  try {
    const updateResult = await Trip.updateOne(
      {
        tenantId: tenantId,
        tripId: tripId,
        isSentToExpense: false,
      },
      {
        $set: {
          isSentToExpense: isSentToExpense,
        },
      }
    );

    if (updateResult.nModified > 0) {
      console.log(`Updated isSentToExpense flag for tenantId: ${tenantId}, tripId: ${tripId}`);
    } else {
      console.log(`No matching document found for update: tenantId: ${tenantId}, tripId: ${tripId}`);
    }

    return updateResult;
  } catch (error) {
    console.error('Error in updateSentToExpenseFlag:', error);
    throw error;
  }
};
