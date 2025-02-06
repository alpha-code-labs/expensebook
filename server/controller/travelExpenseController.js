import Joi from "joi";
import Finance from "../models/Finance.js";
import { financeSchema, sendUpdate } from "./cashAdvanceController.js";
import HRMaster from "../models/hrMaster.js";

// WORKING -to send data of expense settlement options for finance, removed
export const getSettlementOptions = async (tenantId, empIds,settlementType ) => {
  try {
    console.log("getSettlementOptions", tenantId, empIds);

    const hrData = await HRMaster.find({
      tenantId: tenantId.toString(),
      "employees.employeeDetails.employeeId": { $in: empIds },
    });

    if (!hrData || hrData.length === 0) {
      console.log("No employees found with the provided employee IDs.");
      return empIds.reduce((acc, empId) => {
        acc[empId] = {};
        return acc;
      }, {});
    }

    const formattedSettlements = empIds.reduce((acc, empId) => {
      const employee = hrData
        .flatMap((doc) => doc.employees)
        .find((employee) => employee.employeeDetails.employeeId === empId);
      const travelSettlement = employee ? employee.travelPreferences[settlementType] : {};
      acc[empId] = travelSettlement;
      return acc;
    }, {});
    

    return formattedSettlements;
  } catch (error) {
    console.error("Error fetching travel settlements:", error);
    throw error;
  }
};

export const getTravelExpenseData = async (tenantId, empId) => {
  try {
    const status = {
      PENDING_SETTLEMENT: "pending settlement",
    };

    const expenseReportsToSettle = await Finance.find({
      tenantId,
      "tripSchema.travelExpenseData": {
        $elemMatch: {
          actionedUpon: false,
          expenseHeaderStatus: status.PENDING_SETTLEMENT,
          // $or:[
          //   {'paidFlag':false, 'expenseHeaderStatus': status.PENDING_SETTLEMENT },
          //   {'recoveredFlag':false, 'expenseHeaderStatus': status.PENDING_SETTLEMENT}
          // ]
        },
      },
    });

    if (!expenseReportsToSettle) {
      return { success: true, message: `All are settled` };
    } else {
      const travelExpense = expenseReportsToSettle.flatMap((report) => {
        if (
          !report?.tripSchema ||
          !report?.tripSchema?.travelExpenseData?.length > 1
        ) {
          return [];
        }
        const { travelRequestId, tripName } =
          report?.tripSchema?.travelRequestData;
        const { expenseAmountStatus, createdBy } = report.tripSchema;

        const travelExpenseData = report.tripSchema.travelExpenseData
          .filter(
            (expense) =>
              expense.expenseHeaderStatus === status.PENDING_SETTLEMENT
          )
          .map(
            ({
              expenseHeaderId,
              expenseHeaderNumber,
              actionedUpon,
              settlementBy,
              defaultCurrency,
              expenseHeaderStatus,
            }) => ({
              expenseHeaderStatus,
              expenseAmountStatus,
              expenseHeaderId,
              expenseHeaderNumber,
              defaultCurrency,
              settlementBy,
              actionedUpon,
            })
          );

        return {
          tripName,
          travelRequestId,
          expenseAmountStatus,
          createdBy,
          travelExpenseData,
        };
      });

      // Removed - to send expense Settlement options along with expense to settle
      // const getEmpIds = travelExpense.map((e) => {
      //   return e.createdBy.empId;
      // });

      // let settlementOptions
      // if (getEmpIds?.length) {
      //   settlementOptions = await getSettlementOptions(
      //     tenantId,
      //     getEmpIds,
      //     "travelSettlement"
      //   );
      //   console.log({ settlementOptions });
      // }

      // travelExpense.forEach(expense => {
      //   const empId = expense.createdBy.empId;

      //   if (settlementOptions[empId]) {
      //     expense.travelSettlement = settlementOptions[empId].paymentMethod;
      //   }
      // });

      return travelExpense;
    }
  } catch (error) {
    throw new Error({
      error: "Error in fetching travel expense reports:",
      error,
    });
  }
};

const cashSchema = Joi.object({
  tenantId: Joi.string().required(),
  travelRequestId: Joi.string().required(),
  expenseHeaderId: Joi.string().required(),
});

export const paidExpenseReports = async (req, res, next) => {
  try {
    // Validate request parameters and body
    const [params, body] = await Promise.all([
      cashSchema.validateAsync(req.params),
      financeSchema.validateAsync(req.body),
    ]);

    const { tenantId, travelRequestId, expenseHeaderId } = params;
    const { getFinance, settlementDetails } = body;

    let setSettlementDetails;

    if (Array.isArray(settlementDetails) && settlementDetails.length > 0) {
      setSettlementDetails = settlementDetails.map((details) => ({
        ...details,
        status: "paid",
      }));
    }

    const status = {
      PENDING_SETTLEMENT: "pending settlement",
      PAID: "paid",
      APPROVED: "approved",
    };

    const newStatus = {
      PAID: "paid",
    };

    const filter = {
      tenantId,
      travelRequestId,
      "tripSchema.travelExpenseData": {
        $elemMatch: {
          expenseHeaderId,
          expenseHeaderStatus: status.PENDING_SETTLEMENT,
          actionedUpon: false,
        },
      },
    };

    const update = {
      $set: {
        "tripSchema.travelExpenseData.$[elem].settlementBy": getFinance,
        "tripSchema.travelExpenseData.$[elem].actionedUpon": true,
        "tripSchema.travelExpenseData.$[elem].expenseHeaderStatus":
          newStatus.PAID,
        "tripSchema.travelExpenseData.$[elem].settlementDate": new Date(), // Renaming this to paidDate is required
        "tripSchema.travelExpenseData.$[elem].expenseLines.$[lineItem].lineItemStatus":
          newStatus.PAID,
      },
      $push: {
        "tripSchema.travelExpenseData.$[elem].settlementDetails":
          setSettlementDetails,
      },
    };

    const arrayFilters = [
      { "elem.expenseHeaderId": expenseHeaderId },
      { "lineItem.lineItemStatus": status.APPROVED },
    ];

    const updatedExpenseReport = await Finance.findOneAndUpdate(
      filter,
      update,
      {
        arrayFilters,
        new: true,
        runValidators: true,
      }
    );

    if (!updatedExpenseReport) {
      return res
        .status(404)
        .json({ message: "No matching document found or update failed" });
    }

    const payload = {
      tenantId,
      travelRequestId,
      expenseHeaderId,
      settlementBy: getFinance,
      expenseHeaderStatus: newStatus.PAID,
      settlementDate: new Date(),
      settlementDetails: setSettlementDetails,
    };

    const options = {
      action: "expense-paid",
      comments: "travelExpenseReport status is updated to paid",
      includeTrip: true,
      includeExpense: true,
    };

    console.log("Update successful:", updatedExpenseReport);
    await sendUpdate(payload, options);
    return res.status(200).json({
      message: "Travel expense has been successfully settled.",
      result: updatedExpenseReport,
    });
  } catch (error) {
    console.error("Error updating expense report status:", error.message);
    next(error);
  }
};

export const getAllPaidForEntries = async (req, res, next) => {
  try {
    const { tenantId, empId } = req.params;

    const status = {
      PAID: "paid",
    };

    const expenseReportsToSettle = await Finance.find({
      tenantId,
      "tripSchema.travelExpenseData": {
        $elemMatch: {
          actionedUpon: false,
          expenseHeaderStatus: status.PAID,
          // $or:[
          //   {'paidFlag':false, 'expenseHeaderStatus': status.PENDING_SETTLEMENT },
          //   {'recoveredFlag':false, 'expenseHeaderStatus': status.PENDING_SETTLEMENT}
          // ]
        },
      },
    });

    if (!expenseReportsToSettle) {
      return { success: true, message: `All are settled` };
    } else {
      const travelExpense = expenseReportsToSettle.flatMap((report) => {
        // console.log("reports expense", report)
        if (
          !report?.tripSchema ||
          !report?.tripSchema?.travelExpenseData?.length > 1
        ) {
          return [];
        }
        const { travelRequestId, travelRequestNumber, tripName } =
          report?.tripSchema?.travelRequestData;
        const { expenseAmountStatus, createdBy } = report?.tripSchema;

        const getTravelExpenseData = report.tripSchema.travelExpenseData
          .filter(
            (expense) =>
              expense.expenseHeaderStatus === status.PENDING_SETTLEMENT
          )
          .map(
            ({
              expenseHeaderId,
              expenseHeaderNumber,
              actionedUpon,
              settlementBy,
              expenseHeaderStatus,
              settlementDetails,
            }) => ({
              expenseHeaderStatus,
              expenseAmountStatus,
              travelRequestId,
              expenseHeaderId,
              expenseHeaderNumber,
              settlementBy,
              actionedUpon,
              settlementDetails,
            })
          );

        return {
          travelRequestId,
          tripName,
          travelRequestNumber,
          expenseAmountStatus,
          createdBy,
          travelExpenseData: getTravelExpenseData,
        };
      });

      console.log("travelExpense", travelExpense);
      return travelExpense;
    }
  } catch (error) {
    next(error);
    return res.status(500).json({
      error: "Error in fetching travel expense reports:",
      error: error.message,
    });
  }
};
