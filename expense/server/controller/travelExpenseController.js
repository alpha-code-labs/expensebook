import mongoose from "mongoose";
import HRMaster from "../models/hrCompanySchema.js";
import Expense from "../models/tripSchema.js";
import { calculateHaversineDistance } from "../utils/haversine.js";
import { sendToOtherMicroservice } from "../rabbitmq/publisher.js";
import { sendToDashboardMicroservice } from "../rabbitmq/dashboardMicroservice.js";
import Joi from "joi";

// Function to generate the incremental expense header number
export const getExpenseHeaderNumber = async (tenantName) => {
  let nextIncrementalValue = 0;
  const max = await Expense.aggregate([
    {
      $unwind: "$travelExpenseData",
    },
    {
      $group: {
        _id: null,
        maxExpenseHeaderNumber: {
          $max: "$travelExpenseData.expenseHeaderNumber",
        },
      },
    },
  ]);

  const getMax = max[0] ? max[0].maxExpenseHeaderNumber : null;
  console.log("getMax:", getMax, typeof getMax);

  if (getMax) {
    const tenantPrefix = "ER" + tenantName.slice(0, 3).toUpperCase();
    if (getMax.startsWith(tenantPrefix)) {
      const numericPart = getMax.slice(tenantPrefix.length);
      const numericValue = parseInt(numericPart, 10);
      if (!isNaN(numericValue)) {
        nextIncrementalValue = numericValue + 1;
      }
    }
  }
  const generateIncrementalNumber = (tenantName, incrementalValue) => {
    const formattedTenant = tenantName.toUpperCase().slice(0, 3);
    return `ER${formattedTenant}${incrementalValue
      .toString()
      .padStart(6, "0")}`;
  };

  const expenseHeaderNumber = generateIncrementalNumber(
    tenantName,
    nextIncrementalValue
  );
  console.log("Generated expenseHeaderNumber:", expenseHeaderNumber);

  return expenseHeaderNumber;
};

// to get expense report related company details
const getExpenseRelatedHrData = async (tenantId, empId) => {
  try {
    const companyDetails = await HRMaster.findOne({ tenantId });

    if (!companyDetails) {
      throw new Error(
        "Company details not found, please check the req details"
      );
    }

    const employee = companyDetails.employees.find(
      (e) => e.employeeDetails.employeeId.toString() === empId.toString()
    );

    if (!employee) {
      throw new Error("Employee not found");
    }

    const { employeeDetails, group } = employee;
    const {
      employeeName,
      employeeId,
      department,
      designation,
      grade,
      project,
    } = employeeDetails;

    const {
      flags: { POLICY_SETUP_FLAG = {} } = {},
      companyDetails: { defaultCurrency } = {},
      travelAllocationFlags = {},
      travelAllocations = {},
      travelExpenseCategories = [],
      expenseSettlementOptions = {},
    } = companyDetails;

    const getTravelExpenseCategories = travelExpenseCategories.reduce(
      (acc, obj) => {
        const [key] = Object.keys(obj);
        acc[key] = obj[key];
        return acc;
      },
      {}
    );

    const result = {
      POLICY_SETUP_FLAG,
      defaultCurrency,
      travelAllocationFlags,
      travelExpenseCategories: getTravelExpenseCategories,
      travelAllocations,
      expenseSettlementOptions,
      employeeDetails: {
        employeeName,
        employeeId,
        department,
        designation,
        grade,
        project,
        group,
      },
    };

    return travelAllocationFlags?.level3 ? result : result;
  } catch (error) {
    console.error("Error in getExpenseRelatedHrData:", error);
    throw error;
  }
};

const currencySchema = Joi.object({
  currencyName: Joi.string().required().messages({
    "string.empty": "Currency name is required.",
    "any.required": "Currency name is required.",
  }),
  totalAmount: Joi.string().required().messages({
    "string.empty": "Total amount must be a string.",
    "any.required": "Total amount is required.",
  }),
  personalAmount: Joi.string().optional().allow(""),
  nonPersonalAmount: Joi.string().optional().allow(""),
});

export const currencyConverter = async (req, res) => {
  try {
    const { tenantId } = req.params;
    console.log("params", req.params);
    const { error, value } = currencySchema.validate(req.body);

    if (error) return res.status(400).json(error);

    const { currencyName, totalAmount, personalAmount, nonPersonalAmount } =
      value;
    console.log(
      "value",
      "currencyName",
      currencyName,
      "totalAmount",
      totalAmount,
      "personalAmount",
      personalAmount,
      "nonPersonalAmount",
      nonPersonalAmount
    );
    if (!currencyName || !totalAmount) {
      return res
        .status(400)
        .json({ message: "Currency name, total amount are required" });
    }
    const hrDocument = await HRMaster.findOne({ tenantId });

    if (!hrDocument) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const { multiCurrencyTable } = hrDocument;
    const { defaultCurrency, exchangeValue } = multiCurrencyTable;
    const currencyNameInUpperCase = currencyName?.toUpperCase();
    const foundDefaultCurrency =
      defaultCurrency?.shortName?.toUpperCase() === currencyNameInUpperCase;
    const foundCurrency = exchangeValue.find(
      (currency) =>
        currency.currency.shortName.toUpperCase() === currencyNameInUpperCase
    );

    const currencyConverterData = {
      currencyFlag: false,
      message: "Currency not available for conversion",
    };
    if (!foundCurrency) {
      return res.status(200).json({ success: false, currencyConverterData });
    }

    if (foundDefaultCurrency && !nonPersonalAmount && !personalAmount) {
      const currencyConverterData = {
        currencyFlag: true,
        companyName: hrDocument?.companyDetails?.companyName || "Company",
        defaultCurrency: defaultCurrency.shortName,
        convertedCurrency: currencyName.toUpperCase(),
        message:
          "This is your company default currency, no need to do conversion",
        originalAmount: totalAmount,
        originalPersonalAmount: personalAmount,
        originalNonPersonalAmount: nonPersonalAmount,
        originalCurrencyName: currencyName,
      };
      return res.status(200).json({ success: true, currencyConverterData });
    } else if (nonPersonalAmount && personalAmount) {
      // const foundCurrency = exchangeValue.find(currency => currency?.currency?.shortName?.toUpperCase() === currencyNameInUpperCase);

      // if (!foundCurrency) {
      //     return res.status(202).json({ success: false, currencyFlag: false, message: 'Currency not available for conversion' });
      // }

      const conversionPrice = foundCurrency.value;
      const convertedTotalAmount = totalAmount * conversionPrice;

      let personalAmountInDefaultCurrency, convertedBookableTotalAmount;

      if (personalAmount !== undefined && nonPersonalAmount !== undefined) {
        personalAmountInDefaultCurrency = personalAmount * conversionPrice;
        convertedBookableTotalAmount = nonPersonalAmount * conversionPrice;
      }

      const currencyConverterData = {
        currencyFlag: true,
        companyName: hrDocument?.companyDetails?.companyName || "Dummy Company",
        defaultCurrencyName: defaultCurrency.shortName,
        conversionRate: conversionPrice,
        convertedCurrencyName: currencyName,
        convertedTotalAmount: convertedTotalAmount,
        convertedPersonalAmount: personalAmountInDefaultCurrency,
        convertedBookableTotalAmount: convertedBookableTotalAmount,
      };
      return res.status(200).json({ success: true, currencyConverterData });
    } else if (totalAmount && currencyName) {
      const foundCurrency = exchangeValue.find(
        (currency) =>
          currency.currency.shortName.toUpperCase() === currencyNameInUpperCase
      );

      if (!foundCurrency) {
        return res.status(202).json({
          success: false,
          currencyFlag: false,
          message: "Currency not available for conversion",
        });
      }

      const conversionPrice = foundCurrency.value;
      const convertedTotalAmount = totalAmount * conversionPrice;

      const currencyConverterData = {
        currencyFlag: true,
        companyName: hrDocument?.companyDetails?.companyName || "Dummy Company",
        defaultCurrencyName: defaultCurrency.shortName,
        convertedCurrencyName: currencyName,
        conversionRate: conversionPrice,
        convertedTotalAmount: convertedTotalAmount,
      };
      return res.status(200).json({ success: true, currencyConverterData });
    } else {
      const currencyConverterData = {
        success: false,
        message: "Invalid request",
      };
      return res.status(400).json({ success: false, currencyConverterData });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//Calculate total cash advance
export const calculateTotalCashAdvances = async (cashAdvanceData) => {
  const totalCashAdvances = { totalPaid: [], totalUnpaid: [] };

  const updateTotal = (totalsArray, currency, amount) => {
    let existingTotal = totalsArray.find((item) => item.currency === currency);

    if (!existingTotal) {
      existingTotal = { currency, amount: 0 };
      totalsArray.push(existingTotal);
    }

    existingTotal.amount += amount || 0;
  };

  for (const { amountDetails, cashAdvanceStatus } of cashAdvanceData) {
    if (Array.isArray(amountDetails) && amountDetails.length > 0) {
      for (const { amount, currency } of amountDetails) {
        if (cashAdvanceStatus === "paid") {
          updateTotal(totalCashAdvances.totalPaid, currency, amount);
        } else {
          updateTotal(totalCashAdvances.totalUnpaid, currency, amount);
        }
      }
    } else {
      throw new Error("Cash advance not taken");
    }
  }
  console.log("totalCashAdvances .... for expense report", totalCashAdvances);
  return totalCashAdvances;
};

// All Expense Reports
const allExpenseReports = async (expenseReport) => {
  try {

    const {
      tenantId,
      tenantName,
      companyName,
      travelRequestData,
      travelExpenseData,
    } = expenseReport;

    const { travelRequestId, travelRequestNumber, approvers } =
      travelRequestData;

    let { travelType, createdBy, travelAllocationHeaders } = travelRequestData;
    const { travelAllocationFlags } = travelExpenseData[0];
    const approverNames = approvers.map(({ empId, name }) => ({ empId, name }));
    const validPaidStatuses = [
      "approved",
      "rejected",
      "paid",
      "pending settlement",
      "paid",
      "paid and distributed",
    ];
    const validStatuses = ["draft", "pending approval"];
    let flagToOpen;

    if (Array.isArray(travelExpenseData)) {
      const areAllExpenseReportsPaid = travelExpenseData.every((report) =>
        validPaidStatuses.includes(report.expenseHeaderStatus)
      );
      const areAllExpenseReportsValid = travelExpenseData
        .filter(
          (report) => !validPaidStatuses.includes(report.expenseHeaderStatus)
        )
        .every((report) => validStatuses.includes(report.expenseHeaderStatus));

      if (areAllExpenseReportsPaid) {
        //There is no expense report that is in draft or pending approval status.. so create a new one
        const expenseHeaderNumber = await getExpenseHeaderNumber(tenantName);
        let newExpenseHeaderId = new mongoose.Types.ObjectId();
        flagToOpen = newExpenseHeaderId;
        // console.log(
        //   "flagToOpen-- newExpenseHeaderId",
        //   newExpenseHeaderId,
        //   "new expenseHeaderNumber---",
        //   expenseHeaderNumber
        // );

        const newTravelExpenseData = {
          tenantId,
          tenantName,
          companyName,
          travelRequestId,
          travelRequestNumber,
          expenseHeaderNumber,
          expenseHeaderId: newExpenseHeaderId,
          expenseHeaderType: "travel",
          travelAllocationFlags,
          approvers: approverNames,
          travelType: travelType,
        };

        expenseReport.travelExpenseData.push(newTravelExpenseData);
        await expenseReport.save();
      } else if (areAllExpenseReportsValid) {
        const matchingExpenseReport = travelExpenseData.find((item) =>
          validStatuses.includes(item.expenseHeaderStatus)
        );

        if (matchingExpenseReport) {
          flagToOpen = matchingExpenseReport.expenseHeaderId;
        }
      }
    } else {
      throw new Error("No expense reports found");
    }
    // console.log("Returning from Array:", { expenseReport, flagToOpen });
    return {
      entireExpenseReport: expenseReport,
      createdBy,
      travelAllocationHeaders,
      flagToOpen,
    };
  } catch (error) {
    console.error("An error occurred in allExpenseReports:", error.message);
    throw new Error(
      "An error occurred while processing expense reports. Check logs for details."
    );
  }
};

const employeeSchema = Joi.object({
  tenantId: Joi.string().required(),
  empId: Joi.string().required(),
  tripId: Joi.string().required(),
});

// Create a new Expense Report
export const BookExpense = async (req, res) => {
  try {
    console.log("BookExpense called");
    const { error, value } = employeeSchema.validate(req.params);
    if (error) return res.status(404).json(error.details[0].message);

    const { tenantId, empId, tripId } = value;
    console.log("Params:", "tenantId", tenantId, empId, "tripId", tripId);

    const expenseReport = await Expense.findOne({
      tenantId,
      tripId,
      $or: [
        { "travelRequestData.createdBy.empId": empId },
        { "travelRequestData.createdFor.empId": empId },
      ],
    });

    if (!expenseReport) {
      return res.status(404).json({ message: "expenseReport not found" });
    }

    // Getting additional details from HRMaster
    let getHRData;
    try {
      getHRData = await getExpenseRelatedHrData(tenantId, empId);
      // const travelAllocationFlags = {}
      // getHRData = {travelAllocationFlags};
    } catch (error) {
      console.error("Error in getExpenseRelatedHrData:", error);
      return res.status(500).json({ message: "Server Error" });
    }

    const {
      defaultCurrency,
      travelAllocationFlags,
      expenseAllocation,
      expenseAllocation_accountLine,
      expenseCategoryNames,
      expenseSettlementOptions,
      employeeDetails,
    } = getHRData;

    const {
      tripNumber,
      tenantName,
      companyName,
      travelRequestData: {
        travelRequestId,
        travelRequestNumber,
        tripPurpose,
        approvers,
        travelAllocationHeaders,
      },
    } = expenseReport;
    let {
      travelRequestData: { travelType, createdBy },
    } = expenseReport;

    let expenseHeaderNumber =
      expenseReport?.travelExpenseData?.[0]?.expenseHeaderNumber;

    const approversNames = approvers.map(({ empId, name }) => ({
      empId,
      name,
    }));

    console.log("expenseReport found ??? ", expenseReport?.travelExpenseData?.length??null);
    console.log("expenseHeaderNumber found ??? ", expenseHeaderNumber);

    //if expenseHeaderNumber is available i.e expense report is created before
    if (expenseHeaderNumber) {
      const allExpenseReportsList = await allExpenseReports(expenseReport);
      let { entireExpenseReport, flagToOpen } = allExpenseReportsList;
      const { expenseAmountStatus, travelExpenseData } = entireExpenseReport;

      return res.status(200).json({
        success: true,
        tripId,
        tripNumber,
        tripPurpose,
        createdBy,
        newExpenseReport: false,
        flagToOpen: flagToOpen ? flagToOpen : undefined,
        travelAllocationHeaders,
        expenseAmountStatus,
        travelExpenseData,
        companyDetails: getHRData,
      });
    } 
    //if no expenseHeaderNumber i.e no expense report is created
    else {
      const getNumber = await getExpenseHeaderNumber(tenantName);
      //expenseReport.travelExpenseData.expenseHeaderNumber = getNumber;
      const expenseHeaderNumber = getNumber;
      const isCashAdvanceTaken =
        expenseReport.travelRequestData?.isCashAdvanceTaken;
      const alreadyBookedExpenseLines =
        expenseReport.travelRequestData?.itinerary;

      const currentTotalExpenseAmount = Object.values(alreadyBookedExpenseLines)
        .map((array) =>
          array.reduce(
            (total, obj) =>
              total +
                parseFloat(obj.bookingDetails?.billDetails?.totalAmount) || 0,
            0
          )
        )
        .reduce((total, totalAmountForKey) => total + totalAmountForKey, 0);

      const currentTotalAlreadyBookedExpense = currentTotalExpenseAmount;
      expenseReport.expenseAmountStatus.totalAlreadyBookedExpenseAmount =
        currentTotalAlreadyBookedExpense;
      expenseReport.expenseAmountStatus.totalExpenseAmount =
        currentTotalExpenseAmount;

      const newExpenseHeaderId = new mongoose.Types.ObjectId();
      const newTravelExpenseData = {
        tenantId,
        tenantName,
        companyName,
        travelRequestId,
        travelRequestNumber,
        expenseHeaderNumber,
        expenseHeaderId: newExpenseHeaderId,
        expenseHeaderType: "travel",
        travelAllocationFlags,
        alreadyBookedExpenseLines: alreadyBookedExpenseLines,
        approvers: approversNames,
        travelType: travelType,
      };

      expenseReport?.travelExpenseData?.push(newTravelExpenseData);

      await expenseReport.save();
      const { expenseAmountStatus, travelExpenseData } = expenseReport;

      return res.status(200).json({
        success: true,
        tripId,
        tripNumber,
        tripPurpose,
        createdBy,
        newExpenseReport: true,
        expenseHeaderNumber,
        travelAllocationHeaders,
        expenseHeaderId: newExpenseHeaderId,
        flagToOpen: newExpenseHeaderId,
        expenseAmountStatus,
        travelExpenseData,
        isCashAdvanceTaken: isCashAdvanceTaken,
        companyDetails: getHRData,
      });
    }
  } catch (error) {
    // Handling generic errors and returning a standardized response
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// travel Policy Validation
// export const travelPolicyValidation = async (tenantId, empId, travelType, categoryName, totalAmount, travelClass) => {
export const travelPolicyValidation = async (
  tenantId,
  empId,
  travelType,
  categoryName,
  totalAmount
) => {
  try {
    console.log("Starting travel policy validation...", totalAmount);

    // Find the matching document in HRCompany based on tenantId and relevant employee data
    const companyDetails = await HRMaster.findOne(
      { tenantId },
      {
        employees: { $elemMatch: { "employeeDetails.employeeId": empId } },
        policies: 1,
      }
    );

    if (!companyDetails) {
      console.log("Company details not found.");
      return { success: false, message: "Company details not found" };
    }

    const { employees, policies } = companyDetails;

    if (!employees || employees.length === 0) {
      console.log("Employee not found.");
      return { success: false, message: "Employee not found" };
    }

    const employee = employees[0];

    // Get the groups associated with the employee
    const employeeGroups = employee.group;

    if (!employeeGroups?.length) {
      console.log("No groups associated with the employee.");
      return {
        success: false,
        message: "No groups associated with the employee",
      };
    }

    // Check each group's policies
    const groupResults = employeeGroups.map((group) => {
      console.log(`Checking policies for group: ${group}`);

      const groupPolicies = policies.travelPolicies[0][group];

      if (!groupPolicies) {
        console.log(`Group policies not found for group: ${group}`);
        return { success: false, message: "Group policies not found" };
      }

      // travel class need to be tested as
      // const getPolicyTest = groupPolicies[travelType]?.[categoryName]?.class?.[travelClass];
      // console.log("policyDetails test ...", getPolicyTest);

      const getLimitAllowed = groupPolicies[travelType]?.[categoryName]?.limit;
      console.log("limit", getLimitAllowed);
      const limitAmount = getLimitAllowed?.amount;
      const currencyName = getLimitAllowed?.currency.shortName;
      let violationMessage = getLimitAllowed?.violationMessage;

      // Convert totalAmount from string to number
      const totalAmountNumber = Number(totalAmount);

      console.log("totalAmountNumber", totalAmountNumber);

      // Convert limitAmount from string to number
      const limitAmountNumber = Number(limitAmount);
      console.log("limitAmountNumber", limitAmountNumber);

      // Compare totalAmountNumber and limitAmountNumber
      const totalAmountAllowed =
        !limitAmountNumber || totalAmountNumber <= limitAmountNumber;

      console.log("what i got here", totalAmountAllowed);
      if (totalAmountAllowed) {
        console.log("Total amount is under limit:", totalAmountAllowed);
        if (!violationMessage || violationMessage.length === 0) {
          violationMessage = "Total amount is under the policy limit";
        }
        return {
          success: true,
          greenFlag: totalAmountAllowed,
          currencyName,
          amountAllowed: limitAmountNumber,
          violationMessage,
        };
      } else {
        console.log(
          "Total amount is beyond policy limit for group:",
          violationMessage
        );
        if (!violationMessage || violationMessage.length === 0) {
          violationMessage = "Total amount is beyond policy limit";
        }
        return {
          success: true,
          greenFlag: totalAmountAllowed,
          currencyName,
          amountAllowed: limitAmountNumber,
          violationMessage,
        };
      }
    });

    // Return the groupResults array
    return groupResults;
  } catch (error) {
    console.error("Error during travel policy validation:", error);
    return { success: false, message: "Internal Server Error" };
  }
};

export const extractTotalAmount = (expenseLine, fixedFields) => {
  const keyFound = Object.entries(expenseLine).find(([key]) =>
    fixedFields.some(
      (name) => name.trim().toUpperCase() === key.trim().toUpperCase()
    )
  );

  if (!keyFound) {
    throw new Error("Total amount is not found from bill");
  }

  return Number(keyFound[1]);
};

//On save expense Line
export const onSaveExpenseLine = async (req, res) => {
  try {
    const { tenantId, tripId, empId, expenseHeaderId } = req.params;
    console.log("req.params on save", req.params);
    let {
      travelType,
      isCashAdvanceTaken,
      expenseAmountStatus,
      defaultCurrency,
      expenseLine,
      allocations,
      approvers,
    } = req.body;
    console.log("req.body for save line", req.body);

    let {
      isPersonalExpense,
      isMultiCurrency,
      "Category Name": categoryName,
      Class: travelClass,
    } = expenseLine;

    const isApproval = approvers?.length;
    isApproval &&
      approvers.forEach((approver) => (approver.status = "pending approval"));

    console.log("approvers in on save line item", approvers);

    const isLineUpdate = expenseLine?.expenseLineId;
    // Validate required fields
    const requiredFields = [
      "expenseAmountStatus",
      "expenseLine",
      "travelType",
      "allocations",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(404).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }
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

    // Extract total amount
    let totalAmount = extractTotalAmount(expenseLine, fixedFields);

    // Convert amounts to numbers
    let { totalExpenseAmount, totalPersonalExpenseAmount, totalRemainingCash } =
      expenseAmountStatus;
    const totalAmountField = Number(totalAmount);

    console.log("expenseLine ........", expenseLine);
    console.log(
      "its available ",
      categoryName,
      "travelType",
      travelType,
      "totalAmount",
      totalAmount
    );

    const policyValidation = await travelPolicyValidation(
      tenantId,
      empId,
      travelType,
      categoryName,
      totalAmount
    );

    //policy violation added to expense Line
    expenseLine.policyValidation = policyValidation;

    console.log(
      "policyValidation results for line item ........",
      policyValidation
    );
    // Handle personal expenses and multicurrency
    if (isPersonalExpense) {
      console.log("is personal expense", isPersonalExpense);
      const real = expenseLine?.personalExpenseAmount || 0;
      const personalExpenseAmount = +expenseLine?.personalExpenseAmount || 0;
      console.log(
        "personalExpenseAmount",
        typeof personalExpenseAmount,
        personalExpenseAmount
      );
      console.log("personalExpenseAmount real", typeof real, real);

      if (!isMultiCurrency) {
        // Logic for non-multicurrency personal expenses
        if (personalExpenseAmount > totalAmountField) {
          return res.status(400).json({
            message: "Personal expense amount cannot exceed total amount",
          });
        }

        const nonPersonalExpenseAmount =
          totalAmountField - personalExpenseAmount;
        totalExpenseAmount += nonPersonalExpenseAmount;
        totalPersonalExpenseAmount += personalExpenseAmount;
        totalRemainingCash -= nonPersonalExpenseAmount;
      } else {
        // Logic for multicurrency personal expenses
        console.log(
          " personal expense and multicurrency",
          isPersonalExpense,
          isMultiCurrency
        );
        const {
          convertedTotalAmount,
          convertedPersonalAmount,
          convertedBookableTotalAmount,
        } = expenseLine?.convertedAmountDetails || {};

        if (convertedBookableTotalAmount) {
          console.log(
            "convertedBookableTotalAmount in expenseLine",
            convertedBookableTotalAmount
          );
          totalExpenseAmount += convertedBookableTotalAmount;
          totalPersonalExpenseAmount += convertedPersonalAmount;
          totalRemainingCash -= convertedBookableTotalAmount;
        } else {
          return res.status(400).json({
            message: "Invalid converted bookable total amount",
          });
        }
      }
    } else if (isMultiCurrency) {
      // Logic for multicurrency non-personal expenses
      const convertedTotalAmount =
        expenseLine?.convertedAmountDetails?.convertedTotalAmount;

      if (!convertedTotalAmount) {
        return res.status(404).json({
          success: false,
          message: "Conversion total amount is missing",
        });
      }

      totalExpenseAmount += convertedTotalAmount;
      totalRemainingCash -= convertedTotalAmount;
    } else {
      // Logic for non-personal, non-multicurrency expenses
      totalRemainingCash -= totalAmountField;
      totalExpenseAmount += totalAmountField;
    }

    const filter = {
      tenantId,
      tripId,
      $or: [
        { "travelRequestData.createdBy.empId": empId },
        { "travelRequestData.createdFor.empId": empId },
      ],
      "travelExpenseData.expenseHeaderId": expenseHeaderId,
    };

    let update = {
      $set: {
        "expenseAmountStatus.totalPersonalExpenseAmount":
          totalPersonalExpenseAmount,
        "expenseAmountStatus.totalExpenseAmount": totalExpenseAmount,
        "expenseAmountStatus.totalRemainingCash": totalRemainingCash,
        "travelExpenseData.$.allocations": allocations,
        "travelExpenseData.$.travelType": travelType,
        "travelExpenseData.$.defaultCurrency": defaultCurrency,
      },
    };

    const options = { new: true };

    if (isLineUpdate) {
      console.log("edit expense Line", isLineUpdate);
      // If expenseLineId is present, find and update matching expenseLine
      expenseLine.lineItemStatus = isApproval ? "pending approval" : "save";
      expenseLine.approvers = isApproval ? approvers : [];

      let updateAddOn = {
        $set: {
          "travelExpenseData.$[header].expenseLines.$[elem]": expenseLine,
        },
      };
      let totalUpdate = { ...update, ...updateAddOn };
      const arrayFilters = [
        { "header.expenseHeaderId": expenseHeaderId },
        { "elem.expenseLineId": expenseLine.expenseLineId },
      ];
      const updatedExpenseReport = await Expense.findOneAndUpdate(
        filter,
        totalUpdate,
        { arrayFilters, ...options }
      );

      if (!updatedExpenseReport) {
        return res.status(404).json({ message: "Expense report not found" });
      } else {
        const { travelExpenseData, expenseAmountStatus } = updatedExpenseReport;
        console.log("expenseLine edited...........", travelExpenseData);

        const payload = { getExpenseReport: updatedExpenseReport };
        const action = "full-update";
        const comments = "on Save expense line";

        await Promise.all([
          sendToOtherMicroservice(payload, action, "dashboard", comments),
          sendToOtherMicroservice(payload, action, "trip", comments),
          sendToOtherMicroservice(payload, action, "reporting", comments),
        ]);

        return res.status(200).json({
          success: true,
          message: "The expense line has been recorded.",
          travelExpenseData,
          expenseAmountStatus,
        });
      }
    } else {
      console.log("adding a new expense Line");
      // If expenseLineId is not present, push the new expenseLine to the array
      // expenseLine.alreadySaved = true;
      // expenseLine.lineItemStatus = 'save';

      if (!expenseLine.hasOwnProperty("expenseLineId")) {
        console.log("checking hasOwnProperty");
        const expenseLineId = new mongoose.Types.ObjectId();
        expenseLine.expenseLineId = expenseLineId;
        expenseLine.lineItemStatus = isApproval ? "pending approval" : "save";
        expenseLine.approvers = isApproval ? approvers : [];

        console.log("added expense Line", expenseLine);
        let updateAddOn = {
          $push: {
            "travelExpenseData.$.expenseLines": expenseLine,
          },
        };
        const totalUpdate = { ...update, ...updateAddOn };
        const updatedExpenseReport = await Expense.findOneAndUpdate(
          filter,
          totalUpdate,
          options
        );

        if (!updatedExpenseReport) {
          console.log("error .... here");
          return res.status(404).json({ message: "Expense report not found" });
        } else {
          const { travelExpenseData, expenseAmountStatus } =
            updatedExpenseReport;
          console.log("expenseLine saved ...........", expenseLine);

          const payload = { getExpenseReport: updatedExpenseReport };
          const action = "full-update";
          const comments = "on Save expense line";

          await Promise.all([
            sendToOtherMicroservice(payload, action, "dashboard", comments),
            sendToOtherMicroservice(payload, action, "trip", comments),
            sendToOtherMicroservice(payload, action, "reporting", comments),
          ]);

          return res.status(200).json({
            success: true,
            message: "The expense line has been recorded.",
            expenseLineId,
            expenseLine,
            expenseAmountStatus,
          });
        }
      }
    }
  } catch (error) {
    console.error(
      "An error occurred while saving the expense line items:",
      error
    );
    return res.status(500).json({
      error: "An error occurred while saving the expense line items.",
    });
  }
};

// on edit expense Line
export const onEditExpenseLine = async (req, res) => {
  try {
    const { tenantId, tripId, empId, expenseHeaderId } = req.params;
    console.log("req.params on edit expense", req.params);
    let {
      travelType,
      expenseAmountStatus,
      expenseLine,
      expenseLineEdited,
      allocations,
    } = req.body;
    console.log("req.body for edit expense", req.body);

    const fixedFields = [
      "Total Amount",
      "Premium Amount",
      "Total Cost",
      "License Cost",
      "Subscription Cost",
      "Total Fare",
      "Premium Cost",
      "Cost",
      "Tip Amount",
    ];

    // Extract total amount
    let totalAmount = extractTotalAmount(expenseLine, fixedFields);
    let totalAmountEdited = extractTotalAmount(expenseLineEdited, fixedFields);
    console.log(
      "totalAmount new-- ",
      totalAmount,
      "totalAmountEdited old",
      totalAmountEdited
    );
    const isLineUpdate =
      expenseLine?.expenseLineId.toString() ===
      expenseLineEdited?.expenseLineId.toString();
    const totalAmountOld = Number(totalAmountEdited);
    const totalAmountNew = Number(totalAmount);

    if (!isLineUpdate) {
      res.status(404).json({ error: "Invalid request sent" });
    }

    let {
      isPersonalExpense,
      isMultiCurrency,
      "Category Name": categoryName,
      Class: travelClass,
    } = expenseLine;

    let { totalExpenseAmount, totalPersonalExpenseAmount, totalRemainingCash } =
      expenseAmountStatus;

    const policyValidation = await travelPolicyValidation(
      tenantId,
      empId,
      travelType,
      categoryName,
      totalAmountNew,
      travelClass
    );
    //policy violation added to expense Line
    expenseLineEdited.policyValidation = policyValidation;

    // // personal expenses and multicurrency
    // if (isPersonalExpense) {
    //   console.log("is personal expense", isPersonalExpense)
    //   const personalExpenseAmount = expenseLine?.personalExpenseAmount || 0;

    //   if (!isMultiCurrency) {
    //     // Logic for non-multicurrency personal expenses
    //     if (personalExpenseAmount > totalAmountOld) {
    //       return res.status(400).json({
    //         message: "Personal expense amount cannot exceed total amount"
    //       });
    //     }

    //     const nonPersonalExpenseAmount = totalAmountOld - personalExpenseAmount;
    //     totalExpenseAmount -= nonPersonalExpenseAmount;
    //     totalPersonalExpenseAmount -= personalExpenseAmount;
    //     totalRemainingCash += nonPersonalExpenseAmount;
    //   } else {
    //     // Logic for multicurrency personal expenses
    //     console.log(" personal expense and multicurrency", isPersonalExpense, isMultiCurrency)
    //     const {
    //       convertedTotalAmount,
    //       convertedPersonalAmount,
    //       convertedBookableTotalAmount
    //     } = expenseLine?.convertedAmountDetails || {};

    //     if (convertedBookableTotalAmount) {
    //       console.log("convertedBookableTotalAmount in expenseLine", convertedBookableTotalAmount)
    //       totalExpenseAmount -= convertedBookableTotalAmount;
    //       totalPersonalExpenseAmount -= convertedPersonalAmount;
    //       totalRemainingCash += convertedBookableTotalAmount ;
    //     } else {
    //       return res.status(400).json({
    //         message: "Invalid converted bookable total amount"
    //       });
    //     }
    //   }
    // } else if (isMultiCurrency) {
    //   // Logic for multicurrency non-personal expenses
    //   const convertedTotalAmount = expenseLine?.convertedAmountDetails?.convertedTotalAmount;

    //   if (!convertedTotalAmount) {
    //     return res.status(404).json({
    //       success: false,
    //       message: "Conversion total amount is missing"
    //     });
    //   }

    //   totalExpenseAmount -= convertedTotalAmount;
    //   totalRemainingCash += convertedTotalAmount;
    // } else {
    //   // Logic for non-personal, non-multicurrency expenses
    //   totalRemainingCash += totalAmountOld;
    //   totalExpenseAmount -= totalAmountOld;
    // }

    // if (isPersonalExpense) {
    //   // console.log("is personal expense", isPersonalExpense)
    //   const personalExpenseAmount = expenseLine?.personalExpenseAmount || 0;

    //   if (!isMultiCurrency) {
    //     // Logic for non-multicurrency personal expenses
    //     if (personalExpenseAmount > totalAmountNew) {
    //       return res.status(400).json({
    //         message: "Personal expense amount cannot exceed total amount"
    //       });
    //     }

    //     const nonPersonalExpenseAmount = totalAmountNew - personalExpenseAmount;
    //     totalExpenseAmount += nonPersonalExpenseAmount;
    //     totalPersonalExpenseAmount += personalExpenseAmount;
    //     totalRemainingCash -= nonPersonalExpenseAmount;
    //   } else {
    //     // Logic for multicurrency personal expenses
    //     console.log(" personal expense and multicurrency", isPersonalExpense, isMultiCurrency)
    //     const {
    //       convertedTotalAmount,
    //       convertedPersonalAmount,
    //       convertedBookableTotalAmount
    //     } = expenseLine?.convertedAmountDetails || {};

    //     if (convertedBookableTotalAmount) {
    //       console.log("convertedBookableTotalAmount in expenseLineEdited", convertedBookableTotalAmount)
    //       totalExpenseAmount += convertedBookableTotalAmount;
    //       totalPersonalExpenseAmount += convertedPersonalAmount;
    //       totalRemainingCash -= convertedBookableTotalAmount ;
    //     } else {
    //       return res.status(400).json({
    //         message: "Invalid converted bookable total amount"
    //       });
    //     }
    //   }
    // } else if (isMultiCurrency) {
    //   // Logic for multicurrency non-personal expenses
    //   const convertedTotalAmount = expenseLine?.convertedAmountDetails?.convertedTotalAmount;

    //   if (!convertedTotalAmount) {
    //     return res.status(404).json({
    //       success: false,
    //       message: "Conversion total amount is missing"
    //     });
    //   }

    //   totalExpenseAmount += convertedTotalAmount;
    //   totalRemainingCash -= convertedTotalAmount;
    // } else {
    //   // Logic for non-personal, non-multicurrency expenses
    //   totalRemainingCash -= totalAmountNew;
    //   totalExpenseAmount += totalAmountNew;
    //   console.log("totalRemainingCash new line", totalRemainingCash, "totalAmountNew", totalAmountNew)
    //   console.log("totalExpenseAmount new line", totalExpenseAmount)
    // }

    const personalExpenseAmountOld =
      expenseLineEdited?.personalExpenseAmount || 0;
    const personalExpenseAmountNew = expenseLine?.personalExpenseAmount || 0;

    if (isPersonalExpense) {
      console.log("is personal expense", isPersonalExpense);

      if (!isMultiCurrency) {
        // Logic for non-multicurrency personal expenses
        if (personalExpenseAmountOld > totalAmountOld) {
          return res.status(400).json({
            message: "Personal expense amount cannot exceed total amount",
          });
        }

        const nonPersonalExpenseAmount =
          totalAmountOld - personalExpenseAmountOld;
        totalExpenseAmount -= nonPersonalExpenseAmount;
        totalPersonalExpenseAmount -= personalExpenseAmountOld;
        totalRemainingCash += nonPersonalExpenseAmount;
      } else {
        // Logic for multicurrency personal expenses
        console.log(
          "personal expense and multicurrency",
          isPersonalExpense,
          isMultiCurrency
        );
        const {
          convertedTotalAmount,
          convertedPersonalAmount,
          convertedBookableTotalAmount,
        } = expenseLineEdited?.convertedAmountDetails || {};

        if (convertedBookableTotalAmount) {
          console.log(
            "convertedBookableTotalAmount in expenseLine",
            convertedBookableTotalAmount
          );
          totalExpenseAmount -= convertedBookableTotalAmount;
          totalPersonalExpenseAmount -= convertedPersonalAmount;
          totalRemainingCash += convertedBookableTotalAmount;
        } else {
          return res.status(400).json({
            message: "Invalid converted bookable total amount",
          });
        }
      }
    } else if (isMultiCurrency) {
      // Logic for multicurrency non-personal expenses
      const convertedTotalAmount =
        expenseLineEdited?.convertedAmountDetails?.convertedTotalAmount;

      if (!convertedTotalAmount) {
        return res.status(404).json({
          success: false,
          message: "Conversion total amount is missing",
        });
      }

      totalExpenseAmount -= convertedTotalAmount;
      totalRemainingCash += convertedTotalAmount;
    } else {
      // Logic for non-personal, non-multicurrency expenses
      totalRemainingCash += totalAmountOld;
      totalExpenseAmount -= totalAmountOld;
    }

    if (isPersonalExpense) {
      // Logic for updating with new amounts
      if (!isMultiCurrency) {
        // Non-multicurrency personal expenses
        if (personalExpenseAmountNew > totalAmountNew) {
          return res.status(400).json({
            message: "Personal expense amount cannot exceed total amount",
          });
        }

        const nonPersonalExpenseAmount =
          totalAmountNew - personalExpenseAmountNew;
        totalExpenseAmount += nonPersonalExpenseAmount;
        totalPersonalExpenseAmount += personalExpenseAmountNew;
        totalRemainingCash -= nonPersonalExpenseAmount;
      } else {
        // Multicurrency personal expenses
        console.log(
          "personal expense and multicurrency",
          isPersonalExpense,
          isMultiCurrency
        );
        const {
          convertedTotalAmount,
          convertedPersonalAmount,
          convertedBookableTotalAmount,
        } = expenseLine?.convertedAmountDetails || {};

        if (convertedBookableTotalAmount) {
          console.log(
            "convertedBookableTotalAmount in expenseLineEdited",
            convertedBookableTotalAmount
          );
          totalExpenseAmount += convertedBookableTotalAmount;
          totalPersonalExpenseAmount += convertedPersonalAmount;
          totalRemainingCash -= convertedBookableTotalAmount;
        } else {
          return res.status(400).json({
            message: "Invalid converted bookable total amount",
          });
        }
      }
    } else if (isMultiCurrency) {
      // Logic for multicurrency non-personal expenses
      const convertedTotalAmount =
        expenseLine?.convertedAmountDetails?.convertedTotalAmount;

      if (!convertedTotalAmount) {
        return res.status(404).json({
          success: false,
          message: "Conversion total amount is missing",
        });
      }

      totalExpenseAmount += convertedTotalAmount;
      totalRemainingCash -= convertedTotalAmount;
    } else {
      // Logic for non-personal, non-multicurrency expenses
      totalRemainingCash -= totalAmountNew;
      totalExpenseAmount += totalAmountNew;

      console.log(
        "totalRemainingCash new line",
        totalRemainingCash,
        "totalAmountNew",
        totalAmountNew
      );
      console.log("totalExpenseAmount new line", totalExpenseAmount);
    }

    const removeAtLineItem = await Expense.findOneAndUpdate(
      {
        tenantId,
        tripId,
        $or: [
          { "travelRequestData.createdBy.empId": empId },
          { "travelRequestData.createdFor.empId": empId },
        ],
        travelExpenseData: {
          $elemMatch: {
            expenseHeaderId: expenseHeaderId,
          },
        },
      },
      {
        $set: {
          "expenseAmountStatus.totalExpenseAmount": totalExpenseAmount,
          "expenseAmountStatus.totalPersonalExpenseAmount":
            totalPersonalExpenseAmount,
          "expenseAmountStatus.totalRemainingCash": totalRemainingCash,
        },
      },
      { new: true }
    );

    if (!removeAtLineItem) {
      res.status(404).json({ error: "Failed to edit expense" });
    } else {
      const headerIndex = removeAtLineItem.travelExpenseData.findIndex(
        (header) =>
          header.expenseHeaderId.toString() === expenseHeaderId.toString()
      );

      if (headerIndex !== -1) {
        removeAtLineItem.travelExpenseData[headerIndex].allocations =
          allocations;
        removeAtLineItem.travelExpenseData[headerIndex].travelType = travelType;

        const elemIndex = removeAtLineItem.travelExpenseData[
          headerIndex
        ].expenseLines.findIndex(
          (line) =>
            line.expenseLineId.toString() ===
            expenseLineEdited.expenseLineId.toString()
        );
        if (elemIndex !== -1) {
          removeAtLineItem.travelExpenseData[headerIndex].expenseLines[
            elemIndex
          ] = expenseLine;
        }
      } else {
        console.log("expense report not found.");
        return res
          .status(404)
          .json({ message: "Document not found- Error Occured" });
      }

      const updatedExpenseReport = await removeAtLineItem.save();

      if (!updatedExpenseReport) {
        res.status(404).json({ error: "Failed to update expense report" });
      }
      const { travelExpenseData, expenseAmountStatus: getUpdatedStatus } =
        updatedExpenseReport;

      const payload = { getExpenseReport: updatedExpenseReport };
      const action = "full-update";
      const comments = "on Save expense line";

      await Promise.all([
        sendToOtherMicroservice(payload, action, "dashboard", comments),
        sendToOtherMicroservice(payload, action, "trip", comments),
        sendToOtherMicroservice(payload, action, "reporting", comments),
      ]);

      return res.status(200).json({
        message: "The expense line has been updated.",
        travelExpenseData,
        expenseAmountStatus: getUpdatedStatus,
      });
    }
  } catch (error) {
    console.error(
      "An error occurred while saving the expense line items:",
      error
    );
    return res.status(500).json({
      error: "An error occurred while saving the expense line items.",
    });
  }
};

//policy validator
export const policyValidationHr = async (
  tenantId,
  empId,
  categoryName,
  travelType,
  travelClass,
  totalAmount,
  res
) => {
  try {
    const isPersonalVehicle = categoryName === "personalVehicle";
    const isCarRentals = categoryName === "carRentals";

    if (isPersonalVehicle || isCarRentals) {
      const travelDistance = await calculateKilometers(
        expenseLine.from_lat,
        expenseLine.from_long,
        expenseLine.to_lat,
        expenseLine.to_long
      );

      if (travelDistance) {
        const policyValidation = await policyValidationForVehicle(
          tenantId,
          empId,
          travelDistance,
          categoryName
        );

        return {
          success: true,
          message:
            "Successfully processed travelDistance and policy validation.",
          data: { policyValidation },
        };
      } else {
        throw new Error("Travel distance must be a valid value.");
      }
    } else {
      const policyValidationForAll = await travelPolicyValidation(
        tenantId,
        empId,
        travelType,
        travelClass,
        categoryName,
        totalAmount,
        res
      );

      return {
        success: true,
        message: "Successfully processed travelDistance and policy validation.",
        data: policyValidationForAll,
      };
    }
  } catch (error) {
    console.error(
      "Error processing travelDistance and policy validation:",
      error
    );
    throw new Error({
      success: false,
      message: "Error processing travelDistance and policy validation.",
      error: error.message,
    });
  }
};

export const getModifyExpenseReport = async (req, res) => {
  try {
    const { tenantId, empId, expenseHeaderId } = req.params;

    // Check if required parameters are provided
    if (!tenantId || !empId || !expenseHeaderId) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters",
      });
    }

    const expense = await Expense.findOne({
      tenantId,
      $or: [
        { "travelRequestData.createdBy.empId": empId },
        { "travelRequestData.createdFor.empId": empId },
      ],
      travelExpenseData: {
        $elemMatch: { expenseHeaderId: expenseHeaderId },
      },
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Travel expense Report not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      message: "Travel expense Report retrieved successfully",
      expense,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to retrieve Travel expense Report" });
  }
};

export const onSaveAsDraftExpenseReport = async (req, res) => {
  const { tenantId, empId, tripId, expenseHeaderId } = req.params;
  const { expenseLines } = req.body;
  console.log("onSaveAsDraftExpenseHeader", req.params);
  const updatedExpenseLines = expenseLines.map((line) => ({
    ...line,
    lineItemStatus: "draft",
  }));

  try {
    const draftExpenseReport = await Expense.findOneAndUpdate(
      {
        tenantId: tenantId,
        tripId: tripId,
        $or: [
          { "travelRequestData.createdBy.empId": empId },
          { "travelRequestData.createdFor.empId": empId },
        ],
        travelExpenseData: {
          $elemMatch: {
            expenseHeaderId: expenseHeaderId,
            expenseHeaderStatus: { $in: ["draft"] },
          },
        },
      },
      {
        $set: {
          "travelExpenseData.$.expenseHeaderStatus": "draft",
          "travelExpenseData.$.expenseLines": updatedExpenseLines,
        },
      },
      { new: true }
    );

    if (!draftExpenseReport) {
      return res.status(404).json({ message: "Expense report not found" });
    } else {
      // send it to trip
      // await onSaveAsDraftExpenseHeaderToTrip(draftExpenseReport);

      const payload = { getExpenseReport: draftExpenseReport };
      const action = "full-update";
      const comments = "expense report saved as Draft";

      await Promise.all([
        sendToOtherMicroservice(payload, action, "dashboard", comments),
        sendToOtherMicroservice(payload, action, "trip", comments),
        sendToOtherMicroservice(payload, action, "reporting", comments),
      ]);

      // Process the updated expenseReport if needed
      return res
        .status(200)
        .json({ message: "The expense report has been saved as a draft." });
    }
  } catch (error) {
    console.error("An error occurred while saving the expense header:", error);
    return res.status(500).json({
      error:
        "An error occurred while status updated as draft at the expense header.",
    });
  }
};

const getExpenseHeaderStatus = (travelExpenseData) => {
  try {
    const {
      approvers = [],
      alreadyBookedExpenseLines,
      expenseLines = [],
    } = travelExpenseData || [];

    if (approvers.length > 0) {
      return "pending approval";
    }

    if (
      alreadyBookedExpenseLines?.formState?.length > 0 &&
      expenseLines.length === 0
    ) {
      return "paid";
    }

    return "pending settlement"; // finance admin
  } catch (error) {
    console.error("Error determining expense header status:", error);
    throw error;
  }
};

export const onSubmitExpenseHeader = async (req, res) => {
  const { tenantId, empId, tripId, expenseHeaderId } = req.params;
  const { approvers = [], expenseSettlement } = req.body;

  try {
    const filter = {
      tenantId,
      tripId,
      $or: [
        { "travelRequestData.createdBy.empId": empId },
        { "travelRequestData.createdFor.empId": empId },
      ],
      travelExpenseData: {
        $elemMatch: {
          expenseHeaderId,
          expenseHeaderStatus: {
            $in: [
              "draft",
              "pending approval",
              "approved",
              "pending settlement",
            ],
          },
        },
      },
    };

    const update = {
      $set: {
        "travelExpenseData.$.expenseSettlement": expenseSettlement, // to be removed and added from finance.
        "travelExpenseData.$.expenseSubmissionDate": new Date(),
        ...(approvers.length > 0 && {
          "travelExpenseData.$.approvers": approvers.map((a) => ({
            ...a,
            status: "pending approval",
          })),
        }),
      },
    };

    const expenseReport = await Expense.findOneAndUpdate(filter, update, {
      new: true,
    });

    if (!expenseReport) {
      return res.status(404).json({ message: "Expense report not found" });
    }

    const expenseDataIndex = expenseReport.travelExpenseData.findIndex(
      (data) => data.expenseHeaderId.toString() === expenseHeaderId
    );

    if (expenseDataIndex === -1) {
      return res
        .status(404)
        .json({ message: "Expense header not found in the report" });
    }

    const updatedExpenseData =
      expenseReport.travelExpenseData[expenseDataIndex];
    updatedExpenseData.expenseHeaderStatus =
      getExpenseHeaderStatus(updatedExpenseData);

    await expenseReport.save();

    const payload = { getExpenseReport: expenseReport };
    const action = "full-update";
    const comments = "expense report submitted";

    await Promise.all([
      ...(approvers.length > 0
        ? [sendToOtherMicroservice(payload, action, "approval", comments)]
        : []),
      sendToOtherMicroservice(payload, action, "dashboard", comments),
      sendToOtherMicroservice(payload, action, "trip", comments),
      sendToOtherMicroservice(payload, action, "reporting", comments),
    ]);

    return res
      .status(200)
      .json({ message: "The expense report has been submitted" });
  } catch (error) {
    console.error(
      "An error occurred while updating the expense header:",
      error
    );
    return res
      .status(500)
      .json({ error: "An error occurred while updating the expense header." });
  }
};

function parseNumber(value) {
  const parsed = parseFloat(value);
  if (isNaN(parsed)) {
    throw new Error(`Invalid number format: "${parsed}".`);
  }
  return parsed;
}

export const cancelAtHeaderLevelForAReport = async (req, res) => {
  try {
    const { tenantId, tripId, empId, expenseHeaderId } = req.params;
    const { expenseAmountStatus, travelExpenseReport } = req.body;
    console.log("req.body on header level cancel", req.body);
    let totalExpenseAmount;
    let totalPersonalExpenseAmount;
    let totalRemainingCash;
    let totalCashAmount;
    let totalAlreadyBookedExpenseAmount;

    if (expenseAmountStatus) {
      totalExpenseAmount = parseNumber(expenseAmountStatus.totalExpenseAmount);
      totalPersonalExpenseAmount = parseNumber(
        expenseAmountStatus.totalPersonalExpenseAmount
      );
      totalRemainingCash = parseNumber(expenseAmountStatus.totalRemainingCash);
      totalCashAmount = parseNumber(expenseAmountStatus.totalCashAmount);
      totalAlreadyBookedExpenseAmount = parseNumber(
        expenseAmountStatus.totalAlreadyBookedExpenseAmount
      );
    }

    // const hasAlreadyBookedExpense = travelExpenseReport && travelExpenseReport.alreadyBookedExpenseLines && Array.isArray(travelExpenseReport.alreadyBookedExpenseLines) && travelExpenseReport.alreadyBookedExpenseLines.length > 0;
    const hasAlreadyBookedExpense = !!(
      travelExpenseReport?.alreadyBookedExpenseLines &&
      Object.values(travelExpenseReport.alreadyBookedExpenseLines)
        .filter(Array.isArray)
        .some((arr) => arr.length > 0)
    );

    const isMatchingExpenseHeaderId =
      travelExpenseReport &&
      travelExpenseReport.expenseHeaderId === expenseHeaderId;
    const { expenseLines, approvers = [] } = travelExpenseReport;

    const isApproval = approvers?.length > 0;

    console.log(
      "hasAlreadyBookedExpense , isMatchingExpenseHeaderId",
      hasAlreadyBookedExpense,
      isMatchingExpenseHeaderId
    );
    if (hasAlreadyBookedExpense && isMatchingExpenseHeaderId) {
      const getExpenseReport = await Expense.findOneAndUpdate(
        {
          tenantId: tenantId,
          tripId: tripId,
          $or: [
            { "travelRequestData.createdBy.empId": empId },
            { "travelRequestData.createdFor.empId": empId },
          ],
          travelExpenseData: {
            $elemMatch: {
              expenseHeaderId: expenseHeaderId,
            },
          },
        },
        {
          $pull: { travelExpenseData: { expenseHeaderId: expenseHeaderId } },
          // $unset: { 'expenseAmountStatus': 1 },
          $set: {
            "expenseAmountStatus.totalExpenseAmount":
              totalAlreadyBookedExpenseAmount,
            "expenseAmountStatus.totalPersonalExpenseAmount": 0,
            "expenseAmountStatus.totalRemainingCash": totalCashAmount,
          },
        },
        { returnDocument: "after" }
      );

      if (getExpenseReport) {
        const payload = { getExpenseReport };
        const action = "full-update";
        const comments = "All expenseReports are deleted";

        await Promise.all([
          sendToOtherMicroservice(payload, action, "dashboard", comments),
          sendToOtherMicroservice(payload, action, "trip", comments),
          sendToOtherMicroservice(payload, action, "reporting", comments),
        ]);

        if (isApproval) {
          await sendToOtherMicroservice(payload, action, "approval", comments);
        }

        // Process the updated expenseReport if needed
        return res.status(200).json({
          success: true,
          message: "The expense report has been deleted.",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Your expense report deletion failed",
        });
      }
    } else {
      // Iterate through expense lines to update totals and remove object
      expenseLines.forEach((expenseLine) => {
        let {
          isPersonalExpense,
          isMultiCurrency,
          "Category Name": categoryName,
          Class: travelClass,
        } = expenseLine;
        // Extract total amount
        const fixedFields = [
          "Total Amount",
          "Date",
          "Tax Amount",
          "Tip Amount",
          "Premium Amount",
          "Cost",
          "Total Cost",
          "License Cost",
          "Subscription Cost",
          "Total Fare",
          "Premium Cost",
        ];

        let totalAmount = extractTotalAmount(expenseLine, fixedFields);

        if (isPersonalExpense) {
          if (isMultiCurrency) {
            const { convertedPersonalAmount } =
              expenseLine.convertedAmountDetails;
            const convertedPersonalAmountNo = parseNumber(
              convertedPersonalAmount
            );
            totalPersonalExpenseAmount -= convertedPersonalAmountNo;
            totalRemainingCash += totalAmount - convertedPersonalAmountNo;
          } else {
            const personalExpenseAmountNo = parseNumber(
              expenseLine.personalExpenseAmount
            );
            totalPersonalExpenseAmount -= personalExpenseAmountNo;
            totalRemainingCash += totalAmount - personalExpenseAmountNo;
          }
        } else {
          if (isMultiCurrency) {
            totalExpenseAmount -= totalAmount;
            totalRemainingCash += totalAmount;
          } else {
            totalExpenseAmount -= totalAmount;
            totalRemainingCash += totalAmount;
          }
        }
      });

      // Perform MongoDB update operation
      const updatedExpenseReport = await Expense.findOneAndUpdate(
        {
          tenantId,
          tripId,
          $or: [
            { "travelRequestData.createdBy.empId": empId },
            { "travelRequestData.createdFor.empId": empId },
          ],
          travelExpenseData: {
            $elemMatch: { expenseHeaderId },
          },
        },
        {
          $set: {
            "expenseAmountStatus.totalExpenseAmount": totalExpenseAmount,
            "expenseAmountStatus.totalPersonalExpenseAmount":
              totalPersonalExpenseAmount,
            "expenseAmountStatus.totalRemainingCash": totalRemainingCash,
          },
          $pull: { travelExpenseData: { expenseHeaderId: expenseHeaderId } },
        },
        { returnDocument: "after" }
      );

      if (updatedExpenseReport) {
        const payload = { getExpenseReport: updatedExpenseReport };
        const action = "full-update";
        const comments = "expense report cancelled at headerLevel";

        await Promise.all([
          sendToOtherMicroservice(payload, action, "dashboard", comments),
          sendToOtherMicroservice(payload, action, "trip", comments),
          sendToOtherMicroservice(payload, action, "reporting", comments),
        ]);

        await sendToDashboardMicroservice(payload, action, comments);
        if (isApproval) {
          await sendToOtherMicroservice(payload, action, "approval", comments);
        }

        // Process the updated expenseReport if needed
        return res.status(200).json({
          success: true,
          message: "The expense report has been deleted.",
        });
      } else {
        return res.status(404).json({ message: "Error occured" });
      }
    }
  } catch (error) {
    console.error("Error canceling at header level:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//cancel at line
export const cancelAtLine = async (req, res) => {
  try {
    const { tenantId, empId, tripId, expenseHeaderId } = req.params;
    console.log(" params for cancel line item", req.params);
    const { expenseAmountStatus, expenseLine } = req.body;
    console.log("req.body for cancel line", req.body);
    const { expenseLineId, isPersonalExpense, isMultiCurrency } = expenseLine;
    console.log(
      " expenseLine for cancel line item",
      expenseLineId,
      isPersonalExpense,
      isMultiCurrency
    );

    const fixedFields = [
      "Total Amount",
      "Date",
      "Tax Amount",
      "Tip Amount",
      "Premium Amount",
      "Cost",
      "Total Cost",
      "License Cost",
      "Subscription Cost",
      "Total Fare",
      "Premium Cost",
    ];

    let totalAmount = extractTotalAmount(expenseLine, fixedFields);

    console.log("totalAmount -- ", totalAmount);

    // Convert amounts to numbers
    let { totalExpenseAmount, totalPersonalExpenseAmount, totalRemainingCash } =
      expenseAmountStatus;
    const totalAmountField = Number(totalAmount);

    // Handle personal expenses and multicurrency
    if (isPersonalExpense) {
      console.log("is personal expense", isPersonalExpense);
      const personalExpenseAmount = expenseLine?.personalExpenseAmount || 0;

      if (!isMultiCurrency) {
        // Logic for non-multicurrency personal expenses
        if (personalExpenseAmount > totalAmountField) {
          return res.status(400).json({
            message: "Personal expense amount cannot exceed total amount",
          });
        }

        const nonPersonalExpenseAmount =
          totalAmountField - personalExpenseAmount;
        totalExpenseAmount -= nonPersonalExpenseAmount;
        totalPersonalExpenseAmount -= personalExpenseAmount;
        totalRemainingCash += nonPersonalExpenseAmount;
      } else {
        // Logic for multicurrency personal expenses
        console.log(
          " personal expense and multicurrency",
          isPersonalExpense,
          isMultiCurrency
        );
        const {
          convertedTotalAmount,
          convertedPersonalAmount,
          convertedBookableTotalAmount,
        } = expenseLine?.convertedAmountDetails || {};

        if (convertedBookableTotalAmount) {
          console.log(
            "convertedBookableTotalAmount in expenseLine",
            convertedBookableTotalAmount
          );
          totalExpenseAmount -= convertedBookableTotalAmount;
          totalPersonalExpenseAmount -= convertedPersonalAmount;
          totalRemainingCash += convertedBookableTotalAmount;
        } else {
          return res.status(400).json({
            message: "Invalid converted bookable total amount",
          });
        }
      }
    } else if (isMultiCurrency) {
      // Logic for multicurrency non-personal expenses
      const convertedTotalAmount =
        expenseLine?.convertedAmountDetails?.convertedTotalAmount;

      if (!convertedTotalAmount) {
        return res.status(404).json({
          success: false,
          message: "Conversion total amount is missing",
        });
      }

      totalExpenseAmount -= convertedTotalAmount;
      totalRemainingCash += convertedTotalAmount;
    } else {
      // Logic for non-personal, non-multicurrency expenses
      totalRemainingCash += totalAmountField;
      totalExpenseAmount -= totalAmountField;
    }

    // Replace totalRemainingCash in MongoDB and delete the expense line completely
    const cancelExpenseAtLineItem = await Expense.findOneAndUpdate(
      {
        tenantId,
        tripId: tripId,
        $or: [
          { "travelRequestData.createdBy.empId": empId },
          { "travelRequestData.createdFor.empId": empId },
        ],
        travelExpenseData: {
          $elemMatch: {
            expenseHeaderId: expenseHeaderId,
          },
        },
      },
      {
        $set: {
          "expenseAmountStatus.totalExpenseAmount": totalExpenseAmount,
          "expenseAmountStatus.totalPersonalExpenseAmount":
            totalPersonalExpenseAmount,
          "expenseAmountStatus.totalRemainingCash": totalRemainingCash,
        },
        $pull: {
          "travelExpenseData.$.expenseLines": { expenseLineId: expenseLineId },
        },
      },
      { new: true }
    );

    if (!cancelExpenseAtLineItem) {
      return res
        .status(404)
        .json({ success: false, message: "Internal server error" });
    } else {
      if (cancelExpenseAtLineItem) {
        const { travelExpenseData, expenseAmountStatus } =
          cancelExpenseAtLineItem;
        const payload = { getExpenseReport: cancelExpenseAtLineItem };
        const action = "full-update";
        const comments = "Expense line is deleted from expenseReport";

        await sendToDashboardMicroservice(payload, action, comments);
        await Promise.all([
          sendToOtherMicroservice(payload, action, "dashboard", comments),
          sendToOtherMicroservice(payload, action, "trip", comments),
          sendToOtherMicroservice(payload, action, "reporting", comments),
        ]);

        // Process the updated expenseReport if needed
        return res.status(200).json({
          success: true,
          travelExpenseData,
          expenseAmountStatus,
          message: "The expense line has been deleted.",
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Your expense deletion failed" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel expense at line item level.",
    });
  }
};

// rejection reasons
export const getRejectionReasons = async (req, res) => {
  try {
    const { tenantId, empId, tripId, expenseHeaderId } = req.params;
    console.log("Received request params for getRejectionReasons:", req.params);

    const expenseReport = await Expense.findOne({
      tenantId,
      tripId,
      $or: [
        { "travelRequestData.createdBy.empId": empId },
        { "travelRequestData.createdFor.empId": empId },
      ],
      travelExpenseData: {
        $elemMatch: {
          expenseHeaderId: expenseHeaderId,
          expenseHeaderStatus: { $in: ["rejected"] },
        },
      },
    });

    console.log("Retrieved expense report:", expenseReport);

    if (!expenseReport) {
      console.log("Expense report not found");
      return res.status(404).json({
        success: false,
        message: "Expense Report not found for the given IDs",
      });
    }

    console.log("expenseReport", expenseReport);

    const { tripNumber } = expenseReport;
    const { expenseHeaderNumber, rejectionReason } =
      expenseReport.travelExpenseData[0];
    console.log("Retrieved rejection reason:", rejectionReason);

    return res.status(200).json({
      success: true,
      tripNumber,
      expenseHeaderId,
      expenseHeaderNumber,
      flagToOpen: expenseHeaderId,
      rejectionReason,
    });
  } catch (error) {
    console.error("Error occurred:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve rejected TravelExpenseReport",
    });
  }
};

// testing
const getGroupDetails = async (tenantId, empId, getGroups) => {
  try {
    let matchedEmployees;
    const employeeDocument = await HRCompany.findOne({
      tenantId,
      "employees.employeeDetails.employeeId": empId,
    });

    if (!employeeDocument) {
      console.warn(
        `Employee not found for tenantId: ${tenantId}, empId: ${empId}`
      );
      return {
        success: false,
        message: "Invalid credentials. Please check your employee ID.",
      };
    }

    const { groups } = employeeDocument;
    const getAllGroups = groups.map((group) => group.groupName);
    const getEmployee = employeeDocument?.employees.find(
      (e) => e.employeeDetails.employeeId.toString() === empId.toString()
    );

    if (getGroups) {
      const upperCaseGroups = getGroups.map((group) =>
        group.replace(/\s+/g, "").toUpperCase()
      );

      matchedEmployees = employeeDocument?.employees
        .filter((employee) =>
          employee.group.some((empGroup) =>
            upperCaseGroups.includes(empGroup.replace(/\s+/g, "").toUpperCase())
          )
        )
        .map((employee) => ({
          empId: employee.employeeDetails.employeeId,
          empName: employee.employeeDetails.employeeName,
        }));
      if (!matchedEmployees?.length) {
        console.log("No employee found in the group");
        throw new Error(`No employee found for the group:- ${getGroups}`);
      }
    }

    const { employeeDetails: getEmployeeDetails, group } = getEmployee;
    const {
      employeeName,
      employeeId,
      department,
      designation,
      grade,
      project,
    } = getEmployeeDetails;
    console.log("employee name man", employeeName, employeeId);
    const employeeDetails = {
      employeeName,
      employeeId,
      department,
      designation,
      grade,
      project,
    };
    return {
      employeeDocument,
      employeeDetails,
      group,
      getAllGroups,
      matchedEmployees,
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getTripDetails = async (req, res) => {
  const { tenantId, empId, tripId } = req.params;
  try {
    const tripDetails = await Expense.findOne({
      tenantId: tenantId,
      tripId: tripId,
      $or: [
        { "travelRequestData.createdBy.empId": empId },
        { "travelRequestData.createdFor.empId": empId },
      ],
    });

    if (tripDetails) {
      res
        .status(200)
        .json({ message: "tripDetails fetched successfully", tripDetails });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

//Policy validation for personal fuel or cab rentals we use km calculation
export const calculateKilometers = async (
  from_lat,
  from_long,
  to_lat,
  to_long,
  res
) => {
  try {
    const fromLat = parseFloat(from_lat);
    const fromLong = parseFloat(from_long);
    const toLat = parseFloat(to_lat);
    const toLong = parseFloat(to_long);

    if (isNaN(fromLat) || isNaN(fromLong) || isNaN(toLat) || isNaN(toLong)) {
      console.log("Invalid latitude or longitude values");
      return res
        ?.status(400)
        .json({ message: "Invalid latitude or longitude values" });
    }

    try {
      const distanceInKilometers = await calculateHaversineDistance(
        fromLat,
        fromLong,
        toLat,
        toLong
      );
      if (res && res.status && res.status === 200) {
        console.log("Response object:", res);
        return res.json({ distanceInKilometers });
      } else {
        console.log("Invalid response status:", res?.status); // Log the status for debugging
        return res?.status(500).json({ error: "Internal server error" });
      }
    } catch (error) {
      console.error(error);
      return res
        ?.status(404)
        .json({ error: "Error fetching details of travel policy" });
    }
  } catch (error) {
    console.error(error);
    return res?.status(500).json({ message: "Internal server error" });
  }
};

// policy for personal vehicle or cab rentals
export const policyValidationForVehicle = async (
  tenantId,
  empId,
  travelDistance,
  categoryName
) => {
  try {
    console.log(
      "policyValidationForVehicle",
      tenantId,
      empId,
      travelDistance,
      categoryName
    );

    // Find company details based on tenantId and empId
    const companyDetails = await HRMaster.findOne({ tenantId, empId });

    if (!companyDetails) {
      return res.status(404).json({
        message: "Company details not found, please check the req details",
      });
    }

    const { employees } = companyDetails;
    const employee = employees.find(
      (emp) => emp.employeeDetails.employeeId === empId
    );

    if (!employee) {
      throw new Error("Employee not found");
    }

    // Get the groups associated with the employee
    const employeeGroups = employee.group;

    // Initialize a response object
    const response = {
      greenFlag: "No violation",
      yellowFlag: [],
    };

    // Flag to track if at least one group has limit.amount <= totalAmount
    let hasAllowedLimit = false;

    // Loop through each group
    for (const group of employeeGroups) {
      // Access policies for the group from companyDetails
      const groupPolicies = companyDetails.policies.travelPolicies[0][group];

      if (!groupPolicies) {
        return res.status(404).json({ message: "Group policies not found" });
      }

      // Determine the specific policy based on categoryName
      const specificPolicy =
        categoryName === "personal vehicle"
          ? groupPolicies.personalVehicle
          : groupPolicies.cabRentals;

      //get totalLimit, perKmLimit, and travelDistance
      const totalLimit = specificPolicy.limit.amount;
      const perKmLimit = specificPolicy.perKmLimit.amount;

      // Calculate the cost for the given travel distance
      const cost =
        Math.min(travelDistance, totalLimit / perKmLimit) * perKmLimit;

      // Check for violation
      if (travelDistance > totalLimit / perKmLimit) {
        // Create a yellowFlag object with the violation message
        const yellowFlag = {
          violationMessage: `Travel distance exceeds the specified limit for ${categoryName}. Violation message sent.`,
        };
        specificPolicy.yellowFlag = yellowFlag;
        response.yellowFlag.push(specificPolicy);
        hasAllowedLimit = true; // Set the flag to true if there is a violation
      }
    }

    if (hasAllowedLimit) {
      return response;
    } else {
      return response;
    }
  } catch (error) {
    console.error(error);
    throw new Error({ message: "Internal server error", error: error.message });
  }
};
