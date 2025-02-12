import Joi from "joi";
import { financeSchema, sendUpdate } from "./cashAdvanceController.js";
import REIMBURSEMENT from "../models/reimbursement.js";

export const extractCategoryAndTotalAmount = (expenseLines) => {
  const fixedFields = [
    "Total Amount",
    "Total Fare",
    "Premium Amount",
    "Total Cost",
    "License Cost",
    "Subscription Cost",
    "Premium Cost",
    "Cost",
    "Tip Amount",
  ];

  const results = [];
  let expenseTotalAmount = 0;

  expenseLines.forEach((expenseLine) => {
    if (expenseLine.lineItemStatus === "approved") {
      const categoryName = expenseLine["Category Name"] || "";
      const keyFound = Object.entries(expenseLine).find(([key]) =>
        fixedFields.some(
          (name) => name.trim().toUpperCase() === key.trim().toUpperCase()
        )
      );
      const totalAmount = keyFound ? Number(keyFound[1]) || 0 : 0;
      expenseTotalAmount += totalAmount;
      results.push({ categoryName, totalAmount });
    }
  });

  return { results, expenseTotalAmount };
};

export const getReimbursement = async (tenantId, empId) => {
  try {
    // const {tenantId}= req.params
    console.log("tenantId", tenantId);

    const status = {
      PENDING_SETTLEMENT: "pending settlement",
    };

    const getNonTravelExpenseReports = await REIMBURSEMENT.find({
      tenantId,
      actionedUpon: false,
    });

    if (!getNonTravelExpenseReports) {
      return { success: true, message: `All are settled` };
    } else {
      // console.log("non travel", getNonTravelExpenseReports )
      const nonTravelExpense = getNonTravelExpenseReports.map((report) => {
        // console.log("reports expense", JSON.stringify(report, null, 2));

        const {
          expenseHeaderId,
          expenseHeaderNumber,
          actionedUpon,
          settlementBy,
          expenseHeaderStatus,
          expenseLines,
          defaultCurrency,
          createdBy,
          expenseAmountStatus,
        } = report;

        const { expenseTotalAmount, results } =
          extractCategoryAndTotalAmount(expenseLines);
        // console.log("expenseTotalAmount - result",expenseTotalAmount, "results", results)
        // const {totalExpenseAmount} =expenseAmountStatus
        return {
          expenseHeaderId,
          expenseHeaderNumber,
          expenseHeaderStatus,
          expenseTotalAmount: expenseTotalAmount,
          expenseLines: results,
          createdBy,
          defaultCurrency,
          settlementBy,
          actionedUpon,
        };
      });

      // console.log("nonTravelExpense", JSON.stringify(nonTravelExpense, null, 2));
      return nonTravelExpense;
    }
  } catch (error) {
    throw new Error({
      error: "Error in  fetching non travel expense reports",
      error,
    });
  }
};

const nonTravelSchema = Joi.object({
  expenseHeaderId: Joi.string().required(),
  tenantId: Joi.string().required(),
});

//Expense Header Reports with status as pending Settlement updated to paid(Non Travel Expense Reports).
// export const paidNonTravelExpenseReports = async (req, res, next) => {
//   try {
//     // Validate request parameters and body
//     const [params, body] = await Promise.all([
//       nonTravelSchema.validateAsync(req.params),
//       financeSchema.validateAsync(req.body),
//     ]);

//     const { tenantId, expenseHeaderId } = params;
//     const { getFinance, settlementDetails } = body;

//     let setSettlementDetails;

//     if (Array.isArray(settlementDetails) && settlementDetails.length > 0) {
//       setSettlementDetails = settlementDetails.map((details) => ({
//         ...details,
//         status: "paid",
//       }));
//     }

//     const { name, empId } = getFinance;
//     console.log("Received Parameters:", { tenantId, expenseHeaderId });
//     console.log("Received Body Data: non travel", { getFinance });

//     const status = {
//       APPROVED: "approved",
//       PENDING_SETTLEMENT: "pending settlement",
//       PAID: "paid",
//     };

//     const filter = {
//       tenantId: tenantId,
//       expenseHeaderId: expenseHeaderId,
//       expenseHeaderStatus: status.PENDING_SETTLEMENT,
//       actionedUpon: false,
//     };

//     // Use findOneAndUpdate to find and update in one operation
//     const updateResult = await REIMBURSEMENT.findOne(filter);

//     if (!updateResult) {
//       return res
//         .status(404)
//         .json({ message: "No matching document found for update" });
//     }

//     const { expenseLines, settlementBy, expenseHeaderStatus } = updateResult;

//     const updatedExpenseLines = expenseLines.map((line) => {
//       const isPendingSettlement = line.lineItemStatus == status.APPROVED;
//       if (isPendingSettlement) {
//         return {
//           ...line,
//           lineItemStatus: status.PAID,
//           settlementBy: { name, empId },
//           expenseSettledDate: new Date(),
//         };
//       }
//       return line;
//     });

//     console.log(
//       "updatedExpenseLines",
//       JSON.stringify(updatedExpenseLines, "", 2)
//     );

//     updateResult.expenseLines = updatedExpenseLines;
//     updateResult.settlementBy = { name, empId };
//     updateResult.expenseHeaderStatus = status.PAID;
//     updateResult.actionedUpon = true;
//     updateResult.expenseSettledDate = new Date();
//     updateResult.settlementDetails = updateResult.settlementDetails || [];
//     updateResult.settlementDetails.push(...setSettlementDetails);

//     const report = await updateResult.save();

//     console.log("Update successful:", report);

//     const payload = {
//       tenantId,
//       expenseHeaderId,
//       settlementBy: getFinance,
//       expenseHeaderStatus: status.PAID,
//       expenseSettledDate: new Date(),
//       settlementDetails: setSettlementDetails,
//     };

//     const options = {
//       action: "non-travel-paid",
//       comments: "status update to paid for non travel expense report ",
//       includeNonTravel: true,
//     };

//     await sendUpdate(payload, options);
//     return res
//       .status(200)
//       .json({
//         message: "Non-travel expense has been successfully settled.",
//         result: updateResult,
//       });
//   } catch (error) {
//     console.error(
//       "Error updating non travel expense report status:",
//       error.message
//     );
//     next(error);
//     // Optionally return a 500 error response
//     return res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };


const nonTravelSettlementSchema = Joi.object({
  getFinance: Joi.object({
    name: Joi.string().required(), 
    empId: Joi.string().required()
  }).required(),
  selections: Joi.array().items(
    Joi.object({
      tenantId : Joi.string().required(),
      expenseHeaderId: Joi.string().required(),
      settlementDetails: Joi.array().items(
        Joi.object({
          url: Joi.string().optional(),
          comment: Joi.string().optional(),
          status: Joi.string().valid("paid", "recovered").optional()
        })
      ).min(1)
    })
  ).min(1)
});


export const paidNonTravelExpenseReports = async (req, res, next) => {
  try {
    // Validate request parameters and body
    const body = await nonTravelSettlementSchema.validateAsync(req.body);
    

    const { tenantId, expenseHeaderId } = params;
    const { getFinance, selections} = body;

    const { name, empId } = getFinance;
    console.log("Received Parameters:", { tenantId, expenseHeaderId });
    console.log("Received Body Data: non travel", { getFinance });

    const status = {
      APPROVED: "approved",
      PENDING_SETTLEMENT: "pending settlement",
      PAID: "paid",
    };



    let updatedExpenseReports=[];
    let successCount = 0;

    for(const selection of selections){
      let setSettlementDetails;
      setSettlementDetails = selection.settlementDetails.map((details) => ({
        ...details,
        status: "paid",
      }));

      const filter = {
        tenantId: selection.tenantId,
        expenseHeaderId: selection.expenseHeaderId,
        expenseHeaderStatus: status.PENDING_SETTLEMENT,
        actionedUpon: false,
      };

      // Use findOneAndUpdate to find and update in one operation
      const updateResult = await REIMBURSEMENT.findOne(filter);

      if (updateResult) {
        updatedExpenseReports.push(updateResult);

        const { expenseLines, settlementBy, expenseHeaderStatus } = updateResult;

        const updatedExpenseLines = expenseLines.map((line) => {
          const isPendingSettlement = line.lineItemStatus == status.APPROVED;
          if (isPendingSettlement) {
            return {
              ...line,
              lineItemStatus: status.PAID,
              settlementBy: { name, empId },
              expenseSettledDate: new Date(),
            };
          }
          return line;
        });
    
        console.log(
          "updatedExpenseLines",
          JSON.stringify(updatedExpenseLines, "", 2)
        );
    
        updateResult.expenseLines = updatedExpenseLines;
        updateResult.settlementBy = { name, empId };
        updateResult.expenseHeaderStatus = status.PAID;
        updateResult.actionedUpon = true;
        updateResult.expenseSettledDate = new Date();
        updateResult.settlementDetails = updateResult.settlementDetails || [];
        updateResult.settlementDetails.push(...setSettlementDetails);
    
        const report = await updateResult.save();
    
        console.log("Update successful:", report);

        //send update to rabbitmq
        const payload = {
          tenantId:selection.tenantId,
          expenseHeaderId:selection.expenseHeaderId,
          settlementBy: getFinance,
          expenseHeaderStatus: status.PAID,
          expenseSettledDate: new Date(),
          settlementDetails: setSettlementDetails,
        };
    
        const options = {
          action: "non-travel-paid",
          comments: "status update to paid for non travel expense report ",
          includeNonTravel: true,
        };
    
        await sendUpdate(payload, options);
      }
    }

    if(updatedExpenseReports.length == 0){
      return res
          .status(404)
          .json({ message: "No matching document found or update failed" });
    }

    if(updatedExpenseReports.length == selections.length){
      return res.status(200).json({
        message: "All non-travel expenses have been successfully settled.",
        result: updatedExpenseReports,
      });
    }

    if(updatedExpenseReports.length < selections.length){
      return res.status(200).json({
        message: "Some non-travel expenses have been successfully settled.",
        result: updatedExpenseReports,
      });
    }
 
   
  } catch (error) {
    console.error(
      "Error updating non travel expense report status:",
      error.message
    );
    next(error);
    // Optionally return a 500 error response
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

