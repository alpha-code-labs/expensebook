import dashboard from "../../models/dashboardSchema.js";
import { earliestDate } from "../../utils/date.js";
import { setNotification } from "./travel.js";

const cashNotification = async (payload) => {
  const { travelRequestData, cashAdvancesData } = payload;
  const {
    tenantId,
    travelRequestId,
    tripName,
    travelRequestDate,
    travelRequestStatus,
    approvers,
  } = travelRequestData;

  const dataForNotification = {
    tenantId,
    createdBy,
    travelRequestId,
    approvers,
    tripName,
    travelRequestDate,
    travelRequestStatus,
    isCashAdvanceTaken,
    cashAdvance: cashAdvancesData,
  };

  // to add notifications for approver
  await setNotification(dataForNotification);
};

const updateCashToDashboardSync = async (message, correlationId) => {
  const failedUpdates = [];
  const successMessage = {
    message: "Successfully updated dashboard database",
    correlationId: correlationId,
  };
  for (const cashApprovalDoc of message.cashApprovalDoc) {
    const { cashAdvanceId } = cashApprovalDoc;

    try {
      const updated = await dashboard.findOneAndUpdate(
        { "cashAdvanceSchema.cashAdvanceId": cashAdvanceId },
        {
          $set: {
            cashAdvanceSchema: cashApprovalDoc,
            "cashAdvanceSchema.sendForNotification ": false, // always set 'sendForNotification' it as false when dashboard is updated
          },
        },
        { upsert: true, new: true }
      );
      // console.log('Saved to dashboard: using synchrnous queue', updated);
    } catch (error) {
      console.error(
        "Failed to update dashboard: using synchronous queue",
        error
      );

      // Collect failed updates
      failedUpdates.push(trip);
    }
  }

  // Send success message if updates were successful
  if (failedUpdates.length === 0) {
    try {
      // Send the success message and correlationId to another service or queue for further processing
      await sendSuccessConfirmationToTripMicroservice(
        successMessage,
        correlationId
      );
      console.log(
        "Success confirmation sent, using synchrnous queue:",
        successMessage
      );
    } catch (error) {
      console.error(
        "Failed to send success confirmation,using synchrnous queue:",
        error
      );
      // Handle error while sending confirmation
    }
  }

  // Send failed updates as confirmation message
  if (failedUpdates.length > 0) {
    try {
      // Send the failed updates to another service or queue for further processing
      await sendFailedConfirmationToTripMicroservice(
        failedUpdates,
        correlationId
      );
      console.log(
        " dashboard update failed and is sent to rabbitmq sent as confirmation,using synchrnous queue:",
        failedUpdates,
        correlationId
      );
    } catch (error) {
      console.error(
        "Failed to send failed updates confirmation,using synchrnous queue:",
        error
      );
    }
  }
};

// const fullUpdateCash = async (payload) => {
//   try {
//     const{ travelRequestData, cashAdvancesData} = payload
//     const {tenantId, travelRequestId,itinerary} = travelRequestData;
//     const tripStartDate = await earliestDate(itinerary)

//     if (!tenantId) {
//       console.error('TenantId is missing');
//       return { success: false, error: 'TenantId is missing' };
//     }

//     await cashNotification(payload)

//     const updated = await dashboard.updateOne(
//       {
//         tenantId,
//         travelRequestId,
//       },
//       {
//         "travelRequestSchema": travelRequestData,
//         "travelStartDate":tripStartDate,
//         "cashAdvanceSchema.travelRequestData": travelRequestData,
//         "cashAdvanceSchema.cashAdvancesData": cashAdvancesData,
//       },
//       { upsert: true, new: true }
//     );
//     // console.log('Saved to dashboard: Full Update cash---', updated);
//     return { success: true, error: null };
//   } catch (error) {
//     console.error('Failed to update dashboard: using rabbitmq m2m', error);
//     return { success: false, error: error };
//   }
// }
const fullUpdateCash = async (payload) => {
  try {
    if (!payload || typeof payload !== "object") {
      console.error("Payload is invalid or missing");
      return { success: false, error: "Invalid payload" };
    }

    const { travelRequestData, cashAdvancesData } = payload;

    // Validate travelRequestData
    if (!travelRequestData || typeof travelRequestData !== "object") {
      console.error("travelRequestData is missing or invalid");
      return { success: false, error: "Invalid travelRequestData" };
    }

    const { tenantId, travelRequestId, itinerary } = travelRequestData;

    if (!tenantId) {
      console.error("TenantId is missing in travelRequestData");
      return { success: false, error: "TenantId is required" };
    }

    if (!Array.isArray(itinerary) || itinerary.length === 0) {
      console.error("Itinerary is missing or invalid in travelRequestData");
      return { success: false, error: "Itinerary is required" };
    }

    // Calculate trip start date
    let tripStartDate;
    try {
      tripStartDate = await earliestDate(itinerary);
      if (!tripStartDate) {
        throw new Error("Unable to calculate trip start date");
      }
    } catch (dateError) {
      console.error("Failed to calculate trip start date:", dateError);
      return { success: false, error: "Trip start date calculation failed" };
    }

    // Send notification
    try {
      await cashNotification(payload);
    } catch (notificationError) {
      console.error("Failed to send cash notification:", notificationError);
      return { success: false, error: "Notification sending failed" };
    }

    try {
      const updateResult = await dashboard.updateOne(
        {
          tenantId,
          travelRequestId,
        },
        {
          travelRequestSchema: travelRequestData,
          travelStartDate: tripStartDate,
          "cashAdvanceSchema.travelRequestData": travelRequestData,
          "cashAdvanceSchema.cashAdvancesData": cashAdvancesData,
        },
        { upsert: true, new: true }
      );

      const { matchedCount, modifiedCount, upsertedCount } = updateResult;

      console.info("Dashboard update result:", updateResult);

      return {
        success: true,
        error: null,
        matchedCount,
        modifiedCount,
        upsertedCount,
        message: upsertedCount
          ? "Document was inserted as new"
          : matchedCount
          ? "Document was updated"
          : "No changes were made",
      };
    } catch (updateError) {
      console.error("Failed to update dashboard:", updateError);
      return { success: false, error: "Dashboard update failed" };
    }
  } catch (error) {
    console.error("Unexpected error in fullUpdateCash:", error);
    return { success: false, error: error.message || "Unknown error" };
  }
};

const fullUpdateCashBatchJob = async (payloadArray) => {
  try {
    const updatePromises = payloadArray.map(async (payload) => {
      const { travelRequestData, cashAdvancesData } = payload;
      const { tenantId, travelRequestId, itinerary } = travelRequestData;

      const tripStartDate = await earliestDate(itinerary);

      if (!tenantId) {
        console.error("TenantId is missing for payload:", payload);
        return { success: false, error: "TenantId is missing" };
      }

      const updated = await dashboard.updateOne(
        {
          tenantId,
          travelRequestId,
        },
        {
          $set: {
            travelRequestSchema: travelRequestData,
            travelStartDate: tripStartDate,
            "cashAdvanceSchema.travelRequestData": travelRequestData,
            "cashAdvanceSchema.cashAdvancesData": cashAdvancesData,
          },
        },
        { upsert: true }
      );

      if (updated.matchedCount > 0 || updated.upsertedCount > 0) {
        console.log("Successfully updated dashboard record:", updated);
        return { success: true, error: null };
      } else {
        console.error("No record updated or inserted for:", payload);
        return {
          success: false,
          error: "No record matched or upserted for the dashboard.",
        };
      }
    });

    const results = await Promise.all(updatePromises);

    const isSuccess = results.every((result) => result.success);
    if (isSuccess) {
      return { success: true, error: null };
    } else {
      const errors = results
        .filter((result) => !result.success)
        .map((result) => result.error);
      return { success: false, error: errors };
    }
  } catch (error) {
    console.error("Failed to update dashboard via RabbitMQ m2m:", error);
    return { success: false, error: error.message || error };
  }
};

const cashStatusUpdatePaid = async (payloadArray) => {
  try {
    const results = [];

    for (const payload of payloadArray) {
      const { travelRequestData, cashAdvancesData } = payload;
      const { travelRequestId } = travelRequestData;

      // Initialize update object
      const update = {
        cashAdvancesData: cashAdvancesData,
      };

      // Check if the status is 'booked'
      const isBooked = travelRequestData?.travelRequestStatus === "booked";

      if (isBooked) {
        update["tripSchema.cashAdvancesData"] = cashAdvancesData;
      }

      // Perform the update operation
      const updateCashStatus = await dashboard.findOneAndUpdate(
        { "travelRequestData.travelRequestId": travelRequestId },
        { $set: update },
        { new: true }
      );

      // Check if update was successful
      if (!updateCashStatus) {
        console.log(`Failed to update cash status for ${travelRequestId}`);
        results.push({
          travelRequestId,
          success: false,
          message: "Failed to update cash status",
        });
      } else {
        console.log(`Successfully updated cash status for ${travelRequestId}`);
        results.push({
          travelRequestId,
          success: true,
          message: "Cash status updated successfully",
        });
      }
    }

    // Log the results of the batch update
    console.log("Update results:", JSON.stringify(results, "", 2));

    return { success: true, error: null, results };
  } catch (error) {
    console.log("Error occurred:", error);
    return { success: false, error: error.message, results };
  }
};

const onceCash = async (payload) => {
  // console.log('full update cashAdvanceSchema', payload)
  const { travelRequestData, cashAdvancesData } = payload;
  const { tenantId, travelRequestId } = travelRequestData;
  // console.log("fullUpdateCash --tenantId,travelRequestId", tenantId, travelRequestId)
  // Check if the tenantId is present
  if (!tenantId) {
    console.error("TenantId is missing");
    return { success: false, error: "TenantId is missing" };
  }

  try {
    const updated = await dashboard.updateOne(
      {
        tenantId,
        travelRequestId,
      },
      {
        "tripSchema.travelRequestData": travelRequestData,
        "cashAdvanceSchema.travelRequestData": travelRequestData,
        "cashAdvanceSchema.cashAdvancesData": cashAdvancesData,
      },
      { upsert: true, new: true }
    );

    if (updated.matchedCount > 0 || updated.upsertedCount > 0) {
      // console.log("Saved to dashboard: using async queue", updated);
      return { success: true, error: null };
    } else {
      console.log("Failed to save reimbursement expense in dashboard.");
      return {
        success: false,
        error: "Failed to save reimbursement expense in dashboard.",
      };
    }
  } catch (error) {
    console.error("Failed to update dashboard: using rabbitmq m2m", error);
    return { success: false, error: error };
  }
};

export {
  updateCashToDashboardSync,
  fullUpdateCash,
  fullUpdateCashBatchJob,
  cashStatusUpdatePaid,
  onceCash,
};
