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
        embeddedTrip: {
          tripId: travelRequestId,
          ...tripDummyData 
        }
      });

      const savedData = await newData.save();
      console.log('Saved new data:', savedData);
      return res.status(200).json({ message: 'New data saved to embedded trip successfully.' });
    } else {
      existingData.embeddedTrip = {
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
