import dashboard from '../models/dashboardSchema.js';
import { tripDummyData } from '../dummydata/tripDummyData.js';

export const saveToEmbeddedTrip = async (req, res) => {
  try {
    const { tenantId, tenantName, companyName, travelRequestId } = req.params;
    console.log("Received tripData:", req.params);

    const existingData = await dashboard.findOne({ 'tenantId': tenantId, 'tenantName': tenantName });
    
    if (!existingData) {
      const newData = new dashboard({
        tenantId,
        tenantName,
        companyName: companyName,
        tripId: travelRequestId,
          ...tripDummyData 
      });

      const savedData = await newData.save();
      console.log('Saved new data:', savedData);
      return res.status(200).json({ message: 'New data saved to embedded trip successfully.' });
    } else {
      existingData = {
        tripId: travelRequestId,
        ...tripDummyData // Assuming tripDummyData contains all the necessary fields
      };
      const updatedData = await existingData.save();
      console.log('Updated existing data:', updatedData);
      return res.status(200).json({ message: 'Existing data updated in embedded trip successfully.' });
    }
  } catch (error) {
    console.error('Error saving trip data to dashboard:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//the flattenedData variable is immediately assigned the result of the self-invoking function,
// which performs the flattening operation on originalData. 
//This way, the flattening process happens automatically when the script is run, and 
//you can access the flattened data through the flattenedData variable.
// Example data with nested structure
const originalData = {
  id: 1,
  name: "John Doe",
  travel: {
    destination: "Paris",
    duration: 7,
    expenses: {
      transportation: 500,
      accommodation: 800,
    },
  },
  otherField: "so",
};

// Modified function to automatically flatten data
const flattenedData = (() => {
  const flattenedData = {};

  const flattenObject = (obj, prefix = "") => {
    for (const key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        flattenObject(obj[key], `${prefix}${key}_`);
      } else {
        flattenedData[`${prefix}${key}`] = obj[key];
      }
    }
  };

  flattenObject(originalData);

  return flattenedData;
})();

// Output the original and flattened data
console.log("Original Data:", originalData);
console.log("\nFlattened Data:", flattenedData);


import Dashboard from '../models/dashboardSchema.js';

/**
 * Controller to save received message in the Dashboard container
 * @param {object} message - The received message to be saved
 */
export async function saveToDashboard(message) {
  try {
    const { updatedTripsInMemory } = message;

    if (!updatedTripsInMemory || !Array.isArray(updatedTripsInMemory)) {
      throw new Error('Invalid message structure. Missing or invalid "updatedTripsInMemory" field.');
    }

    // Log the updatedTripsInMemory
    console.log('Received updatedTripsInMemory:', updatedTripsInMemory);

    // Iterate through each updated trip and save it to the Dashboard container
    for (const updatedTrip of updatedTripsInMemory) {
      // Assuming 'tripId' is a field in the Dashboard schema
      const { _id, tenantId, tripPurpose, tripStatus, tripStartDate, tripCompletionDate, tripNumber } = updatedTrip;

      const dashboardInstance = new Dashboard({
        tripId: _id, 
        tenantId,
        tripPurpose,
        tripStatus,
        tripStartDate,
        tripCompletionDate,
        tripNumber,
      });

      // Save the instance to the database
      const savedDashboard = await dashboardInstance.save();

      console.log('Saved to Dashboard:', savedDashboard);
    }
  } catch (error) {
    console.error('Error saving to Dashboard:', error);
    throw error;
  }
}
