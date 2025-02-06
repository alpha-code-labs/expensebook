import HRMaster from "../../models/hrMaster.js";

export const updateHRMaster = async (payload) => {
  try {
    console.log("hr data", payload);
    const updated = await HRMaster.findOneAndUpdate(
      { tenantId: payload.tenantId },
      {
        ...payload,
      },
      { upsert: true, new: true }
    );
    console.log("Saved to dashboard: successfully", updated);
    return { success: true, error: null };
  } catch (error) {
    console.error("Failed to update dashboard: using synchronous queue", error);
    return { success: false, error: error };
  }
};


export const saveProfile = async (payload) => {
  try {
    const { tenantId, empId, imageUrl, travelPreferences } = payload;

    console.log({ payload });
    const hrData = await HRMaster.findOne({
      tenantId,
      "employees.employeeDetails.employeeId": empId,
    });

    if (!hrData) {
      return { success: false, error: "Employee not found." };
    }

    const profile = hrData.employees.find(
      (employee) => employee?.employeeDetails?.employeeId === empId
    );

    const fieldsToSave = [
      "busPreference",
      "dietaryAllergy",
      "emergencyContact",
      "flightPreference",
      "hotelPreference",
      "trainPreference",
      // "travelSettlement",
      // "nonTravelSettlement", // removed
    ];

    fieldsToSave.forEach((field) => {
      if (travelPreferences[field] && Object.keys(travelPreferences[field]).length) {
        profile.travelPreferences[field] = travelPreferences[field];
      }
    });

    if (imageUrl) profile.imageUrl = imageUrl;

    await hrData.save();

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Error saving employee preferences:", error);
    return { success: false, error: error.message };
  }
};


