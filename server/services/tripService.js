import Trip from '../models/tripSchema.js';
import Approval from '../models/otherMsSchema.js';

const fetchOldData = async (container, id) => {
  try {
    return await container.findById(id);
  } catch (error) {
    throw new Error(`Error fetching old data from ${container.modelName}: ${error.message}`);
  }
};

const saveData = async (container, data) => {
  try {
    const newData = new container(data);
    await newData.save();
  } catch (error) {
    throw new Error(`Error saving data in ${container.modelName}: ${error.message}`);
  }
};

const updateContainer = async (container, modifiedData, saveOldData = false) => {
  try {
    let mentions = [];

    if (saveOldData) {
      const oldData = await fetchOldData(container, modifiedData._id);
      await saveData(container, oldData);
      mentions.push(`Old data: ${JSON.stringify(oldData)}`);
      mentions.push(`Modified data: ${JSON.stringify(modifiedData)}`);
    }

    // Implement logic to update the container with the modified data
    // You'll need to adapt this part based on your specific data storage mechanism

    return { mentions };
  } catch (error) {
    throw new Error(`Error updating ${container.modelName}: ${error.message}`);
  }
};

export const updateTravelRequestContainer = async (modifiedData, saveOldData = false) => {
  return updateContainer(TravelRequest, modifiedData, saveOldData);
};

export const updateApprovalContainer = async (modifiedData, saveOldData = false) => {
  return updateContainer(Approval, modifiedData, saveOldData);
};

export const saveTripData = async (modifiedTripData, saveOldData = false) => {
  try {
    const modifiedTrip = new Trip(modifiedTripData);
    await modifiedTrip.save();

    if (saveOldData) {
      const oldData = await fetchOldData(Trip, modifiedTripData._id);
      await saveData(Trip, oldData);
    }

    return modifiedTrip;
  } catch (error) {
    throw new Error(`Error saving trip data: ${error.message}`);
  }
};
