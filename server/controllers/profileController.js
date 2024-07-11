import Joi from "joi";
import HRMaster from "../models/hrMasterSchema.js";
import { sendToOtherMicroservice } from "../rabbitmq/publisher.js";


const preferenceSchema = Joi.object({
    tenantId: Joi.string().required(),
    empId:Joi.string().required()
});

// To get employee preferences for a profile
export const getProfile = async (req, res) => {
    try {

    const {error , value } = preferenceSchema.validate(req.params)

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { tenantId, empId} = value;

      // Get employee preferences using the service function
    const hrData = await HRMaster.findOne({
        tenantId, 
        'employees.employeeDetails.employeeId':empId
    });

    const profile = hrData.employees
    .filter(employee => employee?.employeeDetails?.employeeId === empId)    
    .map(employee => ({
    travelPreferences: employee?.travelPreferences ?? '',
    imageUrl:employee?.imageUrl ?? '',
    employeeName: employee?.employeeDetails?.employeeName ?? '',
    emailId: employee?.employeeDetails?.emailId ?? '',
    department : employee?.employeeDetails?.department ?? '',
    location: employee?.employeeDetails?.geographicalLocation ?? '',
    }))[0]

    const { travelPreferences , imageUrl, employeeName, emailId, department , location} = profile
    const {flightPreference, busPreference,trainPreference, hotelPreference, emergencyContact, dietaryAllergy, } = travelPreferences

      // Send a standardized success response with the retrieved preferences
    res.status(200).json({ success: true, flightPreference, busPreference,trainPreference, hotelPreference, emergencyContact, dietaryAllergy, imageUrl,employeeName, location ,emailId,department });
    } catch (error) {
      // Handle errors in a standardized way
    console.error('Error getting employee preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
    }
};


//save employee preference 
export const saveProfile = async (req, res) => {
    try {
    
 const { error, value} = preferenceSchema.validate(req.params)

    if (error) {
        return res.status(400).json({ error: error.details[0].message
        });
    }

    const { tenantId, empId } = value

    const hrData = await HRMaster.findOne({
        'tenantId': tenantId,
        'employees.employeeDetails.employeeId': empId,
    });

    if (!hrData) {
        return res.status(404).json({ error: 'Employee not found.' });
    }

    const profile = hrData.employees
    .find(employee => employee?.employeeDetails?.employeeId === empId)    


    const { busPreference, dietaryAllergy, emergencyContact, flightPreference, hotelPreference, trainPreference , imageUrl } = req.body;

      if (busPreference) profile.travelPreferences.busPreference = busPreference;
      if (dietaryAllergy) profile.travelPreferences.dietaryAllergy = dietaryAllergy;
      if (emergencyContact) profile.travelPreferences.emergencyContact = emergencyContact;
      if (flightPreference) profile.travelPreferences.flightPreference = flightPreference;
      if (hotelPreference) profile.travelPreferences.hotelPreference = hotelPreference;
      if (trainPreference) profile.travelPreferences.trainPreference = trainPreference;
      if (imageUrl) profile.imageUrl = imageUrl;
  
    await hrData.save();

    //   const payload = employee.travelPreferences;
    //   const action = 'profile-update';
    //   const comments = 'travel preference updated by employee in dashboard'
    //   sendToOtherMicroservice(payload, action, 'travel', comments, source='dashboard', onlineVsBatch='online')
    //   sendToOtherMicroservice(payload, action, 'cash', comments, source='dashboard', onlineVsBatch='online')
    //   sendToOtherMicroservice(payload, action, 'approval', comments, source='dashboard', onlineVsBatch='online')
    //   sendToOtherMicroservice(payload, action, 'trip', comments, source='dashboard', onlineVsBatch='online')
    //   sendToOtherMicroservice(payload, action, 'expense', comments, source='dashboard', onlineVsBatch='online')
    //   sendToOtherMicroservice(payload, action, 'finance', comments, source='dashboard', onlineVsBatch='online')

      // Send a standardized success response
      res.status(200).json({ success: true, message: 'Employee preferences saved successfully.' });
    } catch (error) {
      // Handle errors in a standardized way
      console.error('Error saving employee preferences:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
};





