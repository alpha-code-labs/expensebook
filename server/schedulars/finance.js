import cron from "node-cron";
import dotenv from "dotenv";
import Dashboard from "../models/dashboardSchema.js";
import { sendToOtherMicroservice } from "../rabbitmq/publisher.js";
import REIMBURSEMENT from "../models/reimbursementSchema.js";

dotenv.config();

const updateSentToFinanceStatus = async (
  settlementsFilter,
  reimbursementFilter
) => {
  try {
    const documents = await Dashboard.find(settlementsFilter);

    const bulkOps = documents.map((doc) => {
      const update = { $set: {} };
      const arrayFilters = [];
      const arrayFilterNames = {}; // To keep track of array filter names

      // Helper function to get a unique array filter name
      const getUniqueArrayFilterName = (baseName) => {
        let filterName = baseName;
        let index = 1;
        while (arrayFilterNames[filterName]) {
          filterName = `${baseName}_${index++}`;
        }
        arrayFilterNames[filterName] = true;
        return filterName;
      };

      // Check if we need to update an array field
      if (doc?.cashAdvanceSchema?.cashAdvancesData) {
        const filterName = getUniqueArrayFilterName("cashAdvancesDataElem");
        update.$set[
          `cashAdvanceSchema.cashAdvancesData.$[${filterName}].actionedUpon`
        ] = true;
        arrayFilters.push({ [`${filterName}.actionedUpon`]: false });
      }
      if (doc?.tripSchema?.travelExpenseData) {
        const filterName = getUniqueArrayFilterName("travelExpenseDataElem");
        update.$set[
          `tripSchema.travelExpenseData.$[${filterName}].actionedUpon`
        ] = true;
        arrayFilters.push({ [`${filterName}.actionedUpon`]: false });
      }
      // For non-array fields, no arrayFilters are needed
      if (doc?.reimbursementSchema) {
        update.$set["reimbursementSchema.actionedUpon"] = true;
      }

      return {
        updateOne: {
          filter: { _id: doc._id },
          update,
          arrayFilters: arrayFilters.length > 0 ? arrayFilters : undefined,
        },
      };
    });

    const result = await Dashboard.bulkWrite(bulkOps);

    const documents2 = await REIMBURSEMENT.find(reimbursementFilter);

    const bulkOps2 = documents2
      .map((doc) => {
        if (!doc) return null; // Skip if the document is not found

        // Create the update object
        const update = {
          $set: {
            actionedUpon: true,
          },
        };

        return {
          updateOne: {
            filter: { _id: doc._id },
            update,
            arrayFilters: [], // Assuming no array filters are needed
          },
        };
      })
      .filter(Boolean); 

    // Perform bulk write operation
    const result2 = await REIMBURSEMENT.bulkWrite(bulkOps2);

    // console.log('Modified documents:', result.modifiedCount , result2.modifiedCount);
  } catch (error) {
    console.error("Error updating documents:", error);
  }
};

const getSettlements = async () => {
  const statusFilters = {
    cashAdvance: ["pending settlement", "Paid and Cancelled"],
    travelExpense: ["pending settlement", "Paid"],
    reimbursement: ["pending settlement"],
  };

  const filter = {
    $or: [
      {
        "cashAdvanceSchema.cashAdvancesData": {
          $elemMatch: {
            actionedUpon: false,
            cashAdvanceStatus: { $in: statusFilters.cashAdvance },
          },
        },
      },
      {
        "tripSchema.travelExpenseData": {
          $elemMatch: {
            actionedUpon: false,
            expenseHeaderStatus: { $in: statusFilters.travelExpense },
          },
        },
      },
    ],
  };

  const [dashboardDocs, reimbursementDocs] = await Promise.all([
    Dashboard.find(filter),
    REIMBURSEMENT.find({
      actionedUpon: false,
      expenseHeaderStatus: { $in: statusFilters.reimbursement },
    }),
  ]);

  return { dashboardDocs, reimbursementDocs };
};

const processPendingSettlements = (dashboardDocs, reimbursementDocs) => {
  const pendingSettlements = {
    pendingCashAdvanceSettlements: [],
    pendingTravelExpenseSettlements: [],
    pendingReimbursementSettlements: [],
  };

  dashboardDocs.forEach((doc) => {
    if (
      doc.cashAdvanceSchema?.cashAdvancesData.some((data) =>
        ["pending settlement", "Paid and Cancelled"].includes(
          data.cashAdvanceStatus
        )
      )
    ) {
      pendingSettlements.pendingCashAdvanceSettlements.push(
        doc.cashAdvanceSchema
      );
    }
    if (
      doc.tripSchema?.travelExpenseData.some((data) =>
        ["pending settlement", "Paid"].includes(data.expenseHeaderStatus)
      )
    ) {
      pendingSettlements.pendingTravelExpenseSettlements.push(doc.tripSchema);
    }
  });

  // console.log("reimbursementDocs finance", reimbursementDocs)
  reimbursementDocs.forEach((doc) => {
    if (doc.expenseHeaderStatus === "pending settlement") {
      pendingSettlements.pendingReimbursementSettlements.push(doc);
    }
  });

  return pendingSettlements;
};

const financeBatchJob = async () => {
  try {
    const { dashboardDocs, reimbursementDocs } = await getSettlements();
    const pendingSettlements = processPendingSettlements(
      dashboardDocs,
      reimbursementDocs
    );

    if (Object.values(pendingSettlements).every((arr) => arr.length === 0)) {
      return { success: true, message: "All are settled." };
    }

    const payload = pendingSettlements;
    await sendToOtherMicroservice(
      payload,
      "full-update",
      "finance",
      "All finance settlements sent from dashboard microservice to finance microservice",
      "dashboard",
      "batch"
    );

    console.log("Settlements sent to finance:", payload);
    await updateSentToFinanceStatus(
      {
        $or: [
          { "cashAdvanceSchema.cashAdvancesData.actionedUpon": false },
          { "tripSchema.travelExpenseData.actionedUpon": false },
        ],
      },
      {
        actionedUpon: false,
      }
    );

    return pendingSettlements;
  } catch (error) {
    console.error("Error in finance batch job:", error);
    throw new Error("Error in finance batch job");
  }
};

const scheduleToFinanceBatchJob = () => {
  const schedule = process.env.SCHEDULE_TIME ?? "*/5 * * * * *";

  const runFinanceBatchJob = async () => {
    try {
      await financeBatchJob();
    } catch (error) {
      console.error("Error running Finance batchJob:", error);
      return { success: false, error: error.message };
    }
  };

  try {
    cron.schedule(schedule, runFinanceBatchJob);
  } catch (error) {
    console.error("Error in scheduling Finance batchJob:", error);
    return { success: false, error: error.message };
  }
};

export { getSettlements, financeBatchJob, scheduleToFinanceBatchJob };
