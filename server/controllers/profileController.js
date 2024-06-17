import HRMaster from "../models/hrMasterSchema.js";
import { sendToOtherMicroservice } from "../rabbitmq/publisher.js";


// To get employee preferences
export const getEmployeePreferencesController = async (req, res) => {
    try {
      // Input validation
      const { tenantId, empId } = req.params;
  
      // Check if required fields are present
      if (!tenantId || !empId) {
        return res.status(400).json({ error: 'Missing required fields in the request parameters' });
      }
  
      // Get employee preferences using the service function
      const preferences = await HRMaster.findOne(tenantId, empId);
  
      // Send a standardized success response with the retrieved preferences
      res.status(200).json({ success: true, preferences });
    } catch (error) {
      // Handle errors in a standardized way
      console.error('Error getting employee preferences:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
};
  

//save employee preference 
export const saveEmployeePreferencesController = async (req, res) => {
    try {
      const { tenantId, empId } = req.params;
  
      if (!tenantId || !empId) {
        return res.status(400).json({ error: 'Missing required fields in the request parameters.' });
      }
  
      const employee = await HRMaster.findOne({
        'tenantId': tenantId,
        'employeeDetails.employeeId': empId,
      });
  
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found.' });
      }
  
      const { busPreference, dietaryAllergy, emergencyContact, flightPreference, hotelPreference, trainPreference } = req.body;
  
      if (busPreference) employee.travelPreferences.busPreference = busPreference;
      if (dietaryAllergy) employee.travelPreferences.dietaryAllergy = dietaryAllergy;
      if (emergencyContact) employee.travelPreferences.emergencyContact = emergencyContact;
      if (flightPreference) employee.travelPreferences.flightPreference = flightPreference;
      if (hotelPreference) employee.travelPreferences.hotelPreference = hotelPreference;
      if (trainPreference) employee.travelPreferences.trainPreference = trainPreference;
  
      await employee.save();

      const payload = employee.travelPreferences;
      const action = 'profile-update';
      const comments = 'travel preference updated by employee in dashboard'
      sendToOtherMicroservice(payload, action, 'travel', comments, source='dashboard', onlineVsBatch='online')
      sendToOtherMicroservice(payload, action, 'cash', comments, source='dashboard', onlineVsBatch='online')
      sendToOtherMicroservice(payload, action, 'approval', comments, source='dashboard', onlineVsBatch='online')
      sendToOtherMicroservice(payload, action, 'trip', comments, source='dashboard', onlineVsBatch='online')
      sendToOtherMicroservice(payload, action, 'expense', comments, source='dashboard', onlineVsBatch='online')
      sendToOtherMicroservice(payload, action, 'finance', comments, source='dashboard', onlineVsBatch='online')

      // Send a standardized success response
      res.status(200).json({ success: true, message: 'Employee preferences saved successfully.' });
    } catch (error) {
      // Handle errors in a standardized way
      console.error('Error saving employee preferences:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
};
  
  




