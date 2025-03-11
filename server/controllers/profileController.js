import Joi from "joi";
import HRMaster from "../models/hrMasterSchema.js";
import { sendToOtherMicroservice } from "../rabbitmq/publisher.js";
import e from "express";

export const employeeSchema = Joi.object({
  tenantId: Joi.string().required(),
  empId: Joi.string().required(),
});

// To get employee preferences for a profile
export const getProfile = async (req, res) => {
  try {
    const { error, value } = employeeSchema.validate(req.params);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { tenantId, empId } = value;

    // Get employee preferences using the service function
    const hrData = await HRMaster.findOne({
      tenantId,
      "employees.employeeDetails.employeeId": empId,
    });

    const profile = hrData.employees
      .filter((employee) => employee?.employeeDetails?.employeeId === empId)
      .map((employee) => ({
        travelPreferences: employee?.travelPreferences ?? "",
        imageUrl: employee?.imageUrl ?? "",
        employeeName: employee?.employeeDetails?.employeeName ?? "",
        emailId: employee?.employeeDetails?.emailId ?? "",
        department: employee?.employeeDetails?.department ?? "",
        location: employee?.employeeDetails?.geographicalLocation ?? "",
      }))[0];

    const {
      travelPreferences,
      imageUrl,
      employeeName,
      emailId,
      department,
      location,
    } = profile;

    console.log("profile", JSON.stringify(profile, "", 2));
    // Send a standardized success response with the retrieved preferences
    res.status(200).json({
      success: true,
      ...travelPreferences,
      imageUrl,
      employeeName,
      location,
      emailId,
      department,
    });
  } catch (error) {
    // Handle errors in a standardized way
    console.error("Error getting employee preferences:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//save employee preference
export const saveProfile = async (req, res) => {
  try {
    const { error, value } = employeeSchema.validate(req.params);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { tenantId, empId } = value;

    const hrData = await HRMaster.findOne({
      tenantId: tenantId,
      "employees.employeeDetails.employeeId": empId,
    });

    if (!hrData) {
      return res.status(404).json({ error: "Employee not found." });
    }

    const profile = hrData.employees.find(
      (employee) => employee?.employeeDetails?.employeeId === empId
    );

    const { imageUrl } = req.body;

    const fieldsToSave = [
      "busPreference",
      "dietaryAllergy",
      "emergencyContact",
      "flightPreference",
      "hotelPreference",
      "trainPreference",
      // "travelSettlement", removed 
      // "nonTravelSettlement", removed
    ];

    fieldsToSave.forEach((field) => {
      if (req.body[field]) {
        profile.travelPreferences[field] = req.body[field];
      }
    });

    if (imageUrl) profile.imageUrl = imageUrl;

    await hrData.save();

    const payload = {
      tenantId,
      empId,
      imageUrl: profile.imageUrl,
      travelPreferences: profile.travelPreferences,
    };

    const action = "profile-update";
    const comments = "travel preference updated by employee in dashboard";
    //   sendToOtherMicroservice(payload, action, 'travel', comments, source='dashboard', onlineVsBatch='online')
    //   sendToOtherMicroservice(payload, action, 'cash', comments, source='dashboard', onlineVsBatch='online')
    //   sendToOtherMicroservice(payload, action, 'approval', comments, source='dashboard', onlineVsBatch='online')
    //   sendToOtherMicroservice(payload, action, 'trip', comments, source='dashboard', onlineVsBatch='online')
    //   sendToOtherMicroservice(payload, action, 'expense', comments, source='dashboard', onlineVsBatch='online')
    sendToOtherMicroservice(
      payload,
      action,
      "finance",
      comments,
      "dashboard",
      "online"
    );

    // Send a standardized success response
    res.status(200).json({
      success: true,
      message: "Employee preferences saved successfully.",
    });
  } catch (error) {
    // Handle errors in a standardized way
    console.error("Error saving employee preferences:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
