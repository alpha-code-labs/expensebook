import dashboard from "../../models/dashboardSchema.js";
import {
  createOrUpdateManagerNotification,
  createUrlData,
  getPendingCashAdvances,
  getTripStatus,
} from "../../schedulars/notifications.js";
import { earliestDate } from "../../utils/date.js";

export const setNotification = async (payload) => {
  try {
    const {
      tenantId,
      createdBy,
      travelRequestId,
      approvers = [],
      tripName = "Trip",
      travelRequestDate,
      travelRequestStatus,
      isCashAdvanceTaken,
      cashAdvance = [],
    } = payload;

    const dateValue =
      typeof travelRequestDate === "string"
        ? Number(travelRequestDate)
        : travelRequestDate;

    if (isNaN(dateValue)) {
      throw new Error("Invalid travelRequestDate format");
    }

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid travelRequestDate format");
    }

    const formattedDate = date.toDateString();
    const status = getTripStatus(travelRequestDate); 
    const employeeId = createdBy.empId;
    const isPA = travelRequestStatus === "pending approval";
    const hasPendingCashAdvance = cashAdvance?.some(
      (advance) => advance.cashAdvanceStatus === "pending approval"
    );

    let messageText = `Urgent! Please approve the trip "${tripName}", scheduled to start on ${formattedDate}.`;
    if (hasPendingCashAdvance) {
      messageText += " This trip includes cash advance.";
    }

    let getUrlData = createUrlData(
      "pendingApproval",
      "tenantId",
      tenantId,
      "approvers",
      approvers,
      "travelRequestId",
      travelRequestId
    );
    if (!isPA) {
      const result = getPendingCashAdvances(cashAdvance);
      if (result.length > 0) {
        console.log("Pending Cash Advances:", result);
      }

      getUrlData = createUrlData(
        "pendingApproval",
        "tenantId",
        tenantId,
        "empId",
        employeeId,
        "travelRequestId",
        travelRequestId,
        "cashAdvanceData",
        result
      );
    }

    console.log(
      "pending approval",
      tenantId,
      travelRequestId,
      approvers,
      messageText,
      status,
      getUrlData
    );
    return await createOrUpdateManagerNotification({
      tenantId,
      travelRequestId,
      approvers,
      messageText,
      status,
      getUrlData,
    });
  } catch (error) {
    console.error("Error setting notification:", error);
    // throw error;
  }
};

const fullUpdateTravel = async (payload) => {
  // console.log("trying to update travel", payload);
  const { tenantId, travelRequestId, itinerary, travelRequestStatus } = payload;
  const tripStartDate = await earliestDate(itinerary);

  if (!tenantId) {
    console.error("TenantId is missing");
    return { success: false, error: "TenantId is missing" };
  }

  //set notifications
  await setNotification(payload);

  try {
    const updated = await dashboard.findOneAndUpdate(
      {
        tenantId: tenantId,
        "travelRequestSchema.tenantId": tenantId,
        "travelRequestSchema.travelRequestId": travelRequestId,
      },
      {
        tenantId: tenantId,
        travelStartDate: tripStartDate,
        travelRequestId: travelRequestId,
        travelRequestSchema: payload,
      },
      { upsert: true, new: true }
    );
    // console.log('Saved to dashboard: using async queue', updated);
    return { success: true, error: null };
  } catch (error) {
    console.error("Failed to update dashboard: using rabbitmq m2m", error);
    return { success: false, error: error };
  }
};

const fullUpdateTravelBatchJob = async (payloadArray) => {
  try {
    // console.log("batchjob travel", payloadArray)
    const updatePromises = payloadArray.map(async (payload) => {
      const { tenantId, travelRequestId, itinerary } = payload;
      const tripStartDate = await earliestDate(itinerary);

      // Check if the tenantId is present
      if (!tenantId) {
        console.error("TenantId is missing");
        return { success: false, error: "TenantId is missing" };
      }

      const updated = await dashboard.updateOne(
        {
          tenantId: tenantId,
          travelRequestId: travelRequestId,
        },
        {
          travelRequestSchema: payload,
          travelStartDate: tripStartDate,
        },
        { upsert: true, new: true }
      );
      // console.log('Saved to dashboard: using async queue', updated);
      return { success: true, error: null };
    });

    // Wait for all updates to complete
    const results = await Promise.all(updatePromises);
    const isSuccess = results.every((result) => result.success);
    if (isSuccess) {
      return { success: true, error: null };
    } else {
      return { success: true, error: null };
    }
  } catch (error) {
    console.error("Failed to update dashboard: using rabbitmq m2m", error);
    return { success: false, error: error };
  }
};

export { fullUpdateTravelBatchJob, fullUpdateTravel };
