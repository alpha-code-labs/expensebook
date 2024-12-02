import dashboard from "../models/dashboardSchema.js";
import { sendToOtherMicroservice } from "../rabbitmq/publisher.js";

export const assignedToTravelAdmin = async (req, res) => {
  try {
    const { tenantId, travelRequestId } = req.params;
    const { isCashAdvanceTaken, assignedTo } = req.body;
    console.log("params", req.params, "req.body", req.body);

    if (isCashAdvanceTaken == undefined || isCashAdvanceTaken == null) {
      throw new Error("missing fields - isCashAdvanceTaken");
    }

    let updateField;
    if (isCashAdvanceTaken) {
      updateField = "cashAdvanceSchema.travelRequestData.assignedTo";
    } else {
      updateField = "travelRequestSchema.assignedTo";
    }

    console.log("field to be updated", updateField);

    // Retrieve the existing document
    const existingDocument = await dashboard.findOne({
      tenantId,
      travelRequestId,
    });

    console.log(JSON.stringify(existingDocument), "existing document");

    // Check if the existing value of assignedTo is the same as the new one
    if (
      existingDocument &&
      existingDocument[updateField] &&
      JSON.stringify(existingDocument[updateField]) ===
        JSON.stringify(assignedTo)
    ) {
      return res
        .status(200)
        .json({ success: true, message: "Already assigned" });
    }

    // If not the same, perform the update
    const assignTravelAdmin = await dashboard.updateOne(
      { tenantId, travelRequestId },
      { $set: { [updateField]: assignedTo } }
    );

    console.log("Update result:", assignTravelAdmin);

    // Check if the update was successful
    if (assignTravelAdmin.modifiedCount > 0) {
      const message = isCashAdvanceTaken
        ? "Cash advance admin assigned successfully"
        : "Travel admin assigned successfully";
      const action = "update-booking-admin";
      const payload = {
        tenantId,
        travelRequestId,
        isCashAdvanceTaken,
        assignedTo,
      };

      if (isCashAdvanceTaken) {
        console.log("to cash assigned to");
        await sendToOtherMicroservice(
          payload,
          action,
          "cash",
          " to assign travel admin for ticket booking"
        );
      } else {
        console.log("to travel assigned to");

        await sendToOtherMicroservice(
          payload,
          action,
          "travel",
          "to assign travel admin for ticket booking"
        );
      }
      return res.status(200).json({ success: true, message });
    } else {
      // If no documents were modified, handle as a failure
      throw new Error("Failed to update assigned admin");
    }
  } catch (error) {
    console.error("Error assigning travel admin:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to assign travel admin",
      });
  }
};
