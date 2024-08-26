import mongoose from "mongoose";
import HRCompany from "../models/hrCompanySchema.js";
import Reimbursement from "../models/reimbursementSchema.js";
import { sendToOtherMicroservice } from "../rabbitmq/publisher.js";

/**
 * Generates an incremental number for a given tenant ID and incremental value.
 * 
 * @param {string} tenantId - The ID of the tenant.
 * @param {number} incrementalValue - The incremental value used to generate the number.
 * @returns {string} - The generated incremental number.
 */


const formatTenant = (companyName) => {
  return companyName.toUpperCase(); 
};

// to generate and add expense report number
const generateIncrementalNumber = (companyName, incrementalValue) => {
  if (typeof companyName !== 'string' || typeof incrementalValue !== 'number') {
    throw new Error('Invalid input parameters');
  }
  console.log("companyName",companyName, "incrementalValue", incrementalValue)
  const formattedTenant = formatTenant(companyName).substring(0, 2);
  const paddedIncrementalValue = (incrementalValue !== null && incrementalValue !== undefined && incrementalValue !== 0) ?
    (incrementalValue + 1).toString().padStart(6, '0') :
    '000001';

  return `RE${formattedTenant}${paddedIncrementalValue}`;
}


/**
 * Retrieves expense categories for a given employee ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with the employee's name, company name, default currency, and reimbursement expense categories.
 */
export const getExpenseCategoriesForEmpId = async (req, res) => {
  try {
    const { tenantId, empId } = req.params;

    const employeeDocument = await HRCompany.findOne({
      tenantId,
      'employees.employeeDetails.employeeId': empId
    });

    if (!employeeDocument) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found for the given IDs',
      });
    }

    const { employeeName, employeeId } = employeeDocument?.employees[0]?.employeeDetails;

    if (!employeeId) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found for the provided ID',
      });
    }

    const {
      companyDetails: { defaultCurrency } = {},
      companyName,
      reimbursementExpenseCategories,
    } = employeeDocument || {};

    const reimbursementExpenseCategory = Array.isArray(reimbursementExpenseCategories)
      ? reimbursementExpenseCategories.map(category => category?.categoryName)
      : [];

    return res.status(200).json({
      success: true,
      defaultCurrency,
      employeeName,
      companyName,
      reimbursementExpenseCategory,
    });
  } catch (error) {
    console.error('Error finding expense categories:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message || error,
      groups: [],
      expenseCategories: [],
    });
  }
};



// 2) group limit, policies, expense header number
export const getHighestLimitGroupPolicy = async (req, res) => {
    try {
      const { tenantId, empId, expenseCategory } = req.params;
       let{expenseHeaderId} = req.body;
       let expenseHeaderNumber;

       console.log("expenseHeaderId from req.body",expenseHeaderId)

      if (!expenseCategory || !empId || !tenantId) {
        return res.status(404).json({ message: 'error params are missing' });
      }

      const employeeDocument = await HRCompany.findOne({
        tenantId,
        'employees.employeeDetails.employeeId': empId,
      });

      // Return error response if employee document is not found
      if (!employeeDocument) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found for the given IDs',
        });
      }

      // Extract relevant information from the employee document
      const { companyDetails: { companyName }, employees: [employee], policies: { nonTravelPolicies } } = employeeDocument;
      const groups = employee.group || [];

      // Initializing variables to find the group with the highest limit
      let highestGroup = {
        limit: -Infinity,
        group: null,
      };

      // Function to find the group policy with the highest limit
      const getHighestLimitGroupPolicy = (nonTravelPolicies, groups, expenseCategory) => {
        // Iterating through each group
        groups.forEach(groupName => {
          const groupPolicy = nonTravelPolicies.find(policy => Object.keys(policy)[0] == groupName);
          if (groupPolicy) {
            const currentLimit = +groupPolicy[groupName]?.[expenseCategory]?.limit?.amount;
            if (currentLimit > highestGroup.limit) {
              highestGroup = {
                limit: currentLimit,
                group: groupName,
              };
            }
          } else {
            console.error(`No policy found for group: ${groupName}`);
          }
        });
        // Result: highestGroup represents the group with the highest limit
        return highestGroup;
      };

      // Find the highest limit group policy
      let { limit: highestLimit, group: groupName } = getHighestLimitGroupPolicy(nonTravelPolicies, groups, expenseCategory) || {};

      // Extract additional information from the employee document
      const { reimbursementExpenseCategories = [], companyDetails = {}, reimbursementAllocations = [], multiCurrencyTable = [] } = employeeDocument;
      const employeeName = employee.employeeDetails.employeeName;
      const currencyTable = multiCurrencyTable?.exchangeValue.map(item => item.currency)
      const selectedExpenseCategory = reimbursementExpenseCategories?.find(category => 
        category.categoryName.toLowerCase() === expenseCategory.toLowerCase()
      );
      
      const selectedReimbusmentAllocations = reimbursementAllocations?.find(allocation => allocation.categoryName == expenseCategory)
      let newExpenseAllocation;
      let newExpenseAllocation_accountLine;
      if (selectedReimbusmentAllocations) {
        ({ expenseAllocation: newExpenseAllocation, expenseAllocation_accountLine: newExpenseAllocation_accountLine } = selectedReimbusmentAllocations);
      }

      // Return error response if expense category is not found
      if (!selectedExpenseCategory) {
        return res.status(404).json({
          success: false,
          message: 'Expense category not found for the employee',
        });
      }

      // Extract additional information from the selected expense category
      const { categoryName, fields,  expenseAllocation } = selectedExpenseCategory;
      const { defaultCurrency = '' } = companyDetails;

      // Find the updated expense header
      const updatedExpense = await Reimbursement.findOne(
        {
          tenantId,
          'createdBy.empId': empId,
          expenseHeaderStatus: { $in: [null, 'draft'] },
        },
      );

      if (updatedExpense) {
        console.log('Updated expense', updatedExpense);
        ({ expenseHeaderNumber, expenseHeaderId } = updatedExpense);
      }
    
      if(!expenseHeaderId){
        console.log("expenseHeaderId from req body",expenseHeaderId)
        const maxIncrementalValue = await Reimbursement.findOne({ tenantId, 'createdBy.empId':empId })
        .sort({ expenseHeaderNumber: -1 })
        .limit(1)
        .select('expenseHeaderNumber');
    
    let nextIncrementalValue = 0;
    
    if (maxIncrementalValue && maxIncrementalValue.expenseHeaderNumber) {
        const numericPart = maxIncrementalValue.expenseHeaderNumber.match(/\d+$/);
        if (numericPart) {
            nextIncrementalValue = parseInt(numericPart[0], 10) + 1;
        }
    }

      expenseHeaderNumber = generateIncrementalNumber(companyName, nextIncrementalValue);

      // Create a new expense headerId
      expenseHeaderId = new mongoose.Types.ObjectId()
      }

      const message = `${employeeName} is part of ${groupName}. Highest limit found: ${highestLimit}`;
      const group = { limit: highestLimit, group: groupName, message };

      // Return the response with the extracted information
      return res.status(200).json({
        success: true,
        tenantId,
        expenseHeaderId,
        expenseHeaderNumber,
        companyName,
        createdBy: {
          empId,
          name: employeeName,
        },
        defaultCurrency: defaultCurrency || '',
        currencyTable: currencyTable || '',
        newExpenseAllocation,
        newExpenseAllocation_accountLine,
        group,
        ...selectedExpenseCategory
      }); 
    } catch (error) {
      console.error('Error fetching highest limit group policy:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message || 'Something went wrong',
      });
    }
};



// export const getHighestLimitGroupPolicy = async (req, res) => {
//   try {
//       const { tenantId, empId, expenseCategory } = req.params;
//       let { expenseHeaderId } = req.body;

//       console.log("expenseHeaderId", expenseHeaderId);

//       if (!expenseCategory || !empId || !tenantId) {
//           return res.status(404).json({ message: 'Required params are missing' });
//       }

//       const employeeDocument = await HRCompany.findOne({
//           tenantId,
//           'employees.employeeDetails.employeeId': empId,
//       });

//       if (!employeeDocument) {
//           return res.status(404).json({
//               success: false,
//               message: 'Employee not found for the given IDs',
//           });
//       }

//       const { companyDetails: { companyName }, employees: [employee], policies: { nonTravelPolicies } } = employeeDocument;
//       const groups = employee.group || [];

//       let highestGroup = { limit: -Infinity, group: null };

//       const getHighestLimitGroupPolicy = (nonTravelPolicies, groups, expenseCategory) => {
//           groups.forEach(groupName => {
//               const groupPolicy = nonTravelPolicies.find(policy => Object.keys(policy)[0] == groupName);
//               if (groupPolicy) {
//                   const currentLimit = +groupPolicy[groupName]?.[expenseCategory]?.limit?.amount;
//                   if (currentLimit > highestGroup.limit) {
//                       highestGroup = { limit: currentLimit, group: groupName };
//                   }
//               } else {
//                   console.error(`No policy found for group: ${groupName}`);
//               }
//           });
//           return highestGroup;
//       };

//       let { limit: highestLimit, group: groupName } = getHighestLimitGroupPolicy(nonTravelPolicies, groups, expenseCategory) || {};

//       const { reimbursementExpenseCategories = [], companyDetails = {}, reimbursementAllocations = [], multiCurrencyTable = [] } = employeeDocument;
//       const employeeName = employee.employeeDetails.employeeName;
//       const currencyTable = multiCurrencyTable?.exchangeValue.map(item => item.currency);
//       const selectedExpenseCategory = reimbursementExpenseCategories?.find(category => category.categoryName == expenseCategory);
//       const selectedReimbursementAllocations = reimbursementAllocations?.find(allocation => allocation.categoryName == expenseCategory);
//       let newExpenseAllocation, newExpenseAllocation_accountLine;
//       if (selectedReimbursementAllocations) {
//           ({ expenseAllocation: newExpenseAllocation, expenseAllocation_accountLine: newExpenseAllocation_accountLine } = selectedReimbursementAllocations);
//       }

//       if (!selectedExpenseCategory) {
//           return res.status(404).json({
//               success: false,
//               message: 'Expense category not found for the employee',
//           });
//       }

//       const { categoryName, fields, expenseAllocation } = selectedExpenseCategory;
//       const { defaultCurrency = '' } = companyDetails;
//       let expenseHeaderNumber;

//       if (expenseHeaderId == null || expenseHeaderId == undefined) {
//           const maxIncrementalValue = await Reimbursement.findOne({ tenantId }, 'expenseReimbursementSchema?.expenseHeaderNumber')
//               .sort({ 'expenseReimbursementSchema?.expenseHeaderNumber': -1 })
//               .limit(1);

//           console.log("maxIncrementalValue from db", maxIncrementalValue);

//           const nextIncrementalValue = (maxIncrementalValue ? parseInt(maxIncrementalValue.expenseReimbursementSchema?.expenseHeaderNumber.substring(6), 10) : 0);
//           expenseHeaderNumber = generateIncrementalNumber(companyName, nextIncrementalValue);

//           expenseHeaderId = new mongoose.Types.ObjectId();

//           const updatedExpense = await Reimbursement.findOneAndUpdate(
//               {
//                   tenantId,
//                   'createdBy.empId': empId,
//                   expenseHeaderStatus: { $in: ['null', 'draft'] },
//               },
//               {
//                   expenseHeaderId: expenseHeaderId,
//                   expenseHeaderNumber: expenseHeaderNumber
//               },
//               { new: true, upsert: true },
//           );

//           if (updatedExpense) {
//               ({ expenseHeaderNumber, expenseHeaderId } = updatedExpense);
//           }

//           console.log("updatedExpense", updatedExpense);

//           const message = `${employeeName} is part of ${groupName}. Highest limit found: ${highestLimit}`;
//           const group = { limit: highestLimit, group: groupName, message };

//           return res.status(200).json({
//               success: true,
//               tenantId,
//               expenseHeaderId,
//               expenseHeaderNumber,
//               companyName,
//               createdBy: { empId, name: employeeName },
//               defaultCurrency: defaultCurrency || '',
//               currencyTable: currencyTable || '',
//               newExpenseAllocation,
//               newExpenseAllocation_accountLine,
//               group,
//               categoryName,
//               fields,
//           });
//       }
//   } catch (error) {
//       console.error('Error fetching highest limit group policy:', error);
//       return res.status(500).json({
//           success: false,
//           message: 'Internal Server Error',
//           error: error.message || 'Something went wrong',
//       });
//   }
// };

//3) currency converter for non travel expense 
export const reimbursementCurrencyConverter = async (req, res) => {
  try {
    const { tenantId, amount, currencyName } = req.params;
    console.log("params", req.params)
    const hrDocument = await HRCompany.findOne({ tenantId});

    if (!hrDocument) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
     
    const {multiCurrencyTable} = hrDocument;
    const { defaultCurrency, exchangeValue} = multiCurrencyTable;
     console.log("found", defaultCurrency)
    const foundDefaultCurrency = defaultCurrency?.shortName.toUpperCase() === currencyName.toUpperCase();
    console.log("found 2", foundDefaultCurrency)

    if (foundDefaultCurrency) {
      const currencyConverterData = {
        currencyFlag: true,
        companyName: hrDocument?.companyDetails?.companyName || 'Company',
        defaultCurrency: defaultCurrency.shortName,
        convertedCurrency: currencyName.toUpperCase(),
        convertedAmount: amount,
        message: 'This is your company default currency',
      };
      return res.status(200).json({ success: true,
        currencyConverterData });
    }

    const foundCurrency = exchangeValue.find(currency => currency?.currency?.shortName.toUpperCase() === currencyName.toUpperCase());

    if (!foundCurrency) {
      const currencyConverterData= {
        currencyFlag: false,
        message: 'This currency is not available in your multiCurrency table.Before submitting this bill, talk to your company admin to update the multiCurrency value in the table' 
      }
      return res.status(200).json({ 
        success: false,
        currencyConverterData
      });
    }

    const conversionPrice = foundCurrency.value;
    const convertedAmount = amount * conversionPrice;
    console.log("converted currency",convertedAmount )
    const currencyConverterData = {
      currencyFlag: true,
      companyName: hrDocument?.companyDetails?.companyName ?? 'Company Name',
      defaultCurrency: defaultCurrency?.shortName,
      convertedCurrency: currencyName,
      convertedAmount,
    };

    return res.status(200).json({success: true,        
      currencyConverterData });
  } catch (error) {
    return res.status(500).json({ success: false,
      message: 'Internal server error' });
  }
};


// 4) save line item 
export const saveReimbursementExpenseLine = async (req, res) => {
    try {
      const { tenantId, empId, expenseHeaderId } = req.params;
       console.log("params", req.params)
       
      if (!expenseHeaderId || ! empId || !tenantId) {
        return res.status(404).json({ message: 'error params are missing' });
      }

      const {
        employeeName,
        companyName,
        createdBy,
        expenseHeaderNumber,
        defaultCurrency,
        lineItem,
      } = req.body;
  
       console.log("req body", req.body)
       console.log("lineItem ......", lineItem)
       console.log("Type of 'Booking Reference No':", typeof lineItem['Booking Reference No']);

      if (!expenseHeaderNumber ) {
        return res.status(404).json({ message: 'error expenseHeaderNumber is missing' });
      }

       const {name} = createdBy
      const expenseLineId = new mongoose.Types.ObjectId().toString();
      // Output the generated ObjectId and its type
     console.log('Generated ObjectId:', expenseLineId);
     console.log('Type of expenseLineId:', typeof expenseLineId);

      const expenseLineData ={
      ...lineItem,
      lineItemId:expenseLineId,
      lineItemStatus:'save',
      }

      const filter = { tenantId, expenseHeaderId };
      const update = {
          $set: {
              tenantId,
              tenantName: companyName ?? '',
              companyName: companyName ?? '',
              expenseHeaderId,
              expenseHeaderNumber,
              createdBy,
              expenseHeaderType: 'reimbursement',
              defaultCurrency,
          },
          $push: {
            expenseLines: [expenseLineData],
          }
      };
      
      const options = {
          upsert: true,
          new: true, 
      };
      
      const newExpense = await Reimbursement.findOneAndUpdate(filter, update, options);
      
      await newExpense.save();

      const { expenseLines} = newExpense
      const savedLineItemId = expenseLines[expenseLines.length - 1];

      const lastLineItemId = savedLineItemId.lineItemId

      console.log("saved Itinerary ID:", lastLineItemId);
  
      return res.status(200).json({
        success: true,
        message: `expense line saved successfully by ${name}`,
        lineItemId:lastLineItemId,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to process non_Travel expense LINE' });
    }
};


/**
 * Edits a specific expense line item in a reimbursement document.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object.
 */
export const editReimbursementExpenseLine = async (req, res) => {
  try {
    const { tenantId, empId, expenseHeaderId, lineItemId } = req.params;

    // Check if any of the required parameters are missing
    if (!expenseHeaderId || !empId || !tenantId) {
      return res.status(404).json({ message: 'Error params are missing' });
    }

    const { lineItem } = req.body;

    const filter = { tenantId, expenseHeaderId, 'expenseLines.lineItemId': lineItemId };
    const update = { $set: { 'expenseLines.$': lineItem } };
    const options = { upsert: true, new: true };

    const updatedExpense = await Reimbursement.findOneAndUpdate(filter, update, options);

    // Handle the case when no match is found
    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    const { name } = updatedExpense.createdBy;
    const { expenseLines } = updatedExpense;

    // Find the updated line
    const savedLineItem = expenseLines.find(line => line.lineItemId.toString() === lineItemId);
    

    return res.status(200).json({
      success: true,
      message: `Expense line saved successfully by ${name}`,
      editedLine: savedLineItem,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to process the request' });
  }
};



/**
 * Updates the status of an expense report to "draft" and sends a success message and the updated expense report as a response.
 * @param {object} req - The request object containing parameters.
 * @param {object} res - The response object.
 * @returns {object} - The response object with a success message and the updated expense document if successful.
 * @throws {object} - The response object with an error message if expenseHeaderId is missing or the expense document is not found or unauthorized.
 */

export const draftReimbursementExpenseLine = async (req, res) => {
  try {
    const { tenantId, empId, expenseHeaderId } = req.params;

    if (!expenseHeaderId) {
      return res.status(404).json({ message: 'error expenseHeaderId is missing' });
    }

    const EXPENSE_HEADER_STATUS_D = 'draft';

    const updatedExpense = await Reimbursement.findOneAndUpdate(
      { tenantId, expenseHeaderId, 'createdBy.empId': empId },
      { $set: { expenseHeaderStatus: EXPENSE_HEADER_STATUS_D } },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Reimbursement document not found or unauthorized' });
    } else{

    const { name } = updatedExpense.createdBy;
    const payload = { reimbursementReport:updatedExpense };
    console.log("payload", payload)
    const needConfirmation = false;
    const source = 'reimbursement';
    const onlineVsBatch = 'online';
    const action = 'full-update';
    const comments = 'expense report submitted';

   await  sendToOtherMicroservice(payload, action, 'dashboard', comments, source, onlineVsBatch)
   
     // Process the updated expenseReport if needed
     return res.status(200).json({
      success: true,
      message: `Expense report status has been updated to draft by ${name}`,
      updatedExpense,
    }); 
  } }catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to process non_Travel expense LINE' });
  }
};
   
/**
 * Handles the submission of an expense report.
 * Updates the status of the expense report to "pending settlement" and returns a success message if the update is successful.
 * @param {object} req - The request object containing the parameters `tenantId`, `empId`, and `expenseHeaderId`.
 * @param {object} res - The response object used to send the response back to the client.
 * @returns {object} - If the update is successful, a response object with a success message is returned. If the update fails or the expense report is not found or unauthorized, an error message is returned.
 */

export const submitReimbursementExpenseReport = async (req, res) => {
  try {
    const { tenantId, empId, expenseHeaderId } = req.params;

    if (!expenseHeaderId || !empId || !tenantId) {
      return res.status(400).json({ message: 'Error: Required parameters are missing.' });
    }

    const EXPENSE_HEADER_STATUS_PS = 'pending settlement';

    const updatedExpense = await Reimbursement.findOneAndUpdate(
      { tenantId, expenseHeaderId, 'createdBy.empId': empId },
      { $set: { expenseHeaderStatus: EXPENSE_HEADER_STATUS_PS } },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense Report not found or unauthorized.' });
    } else{

      const { name } = updatedExpense.createdBy ?? { name: 'user' };
      const payload = { reimbursementReport : updatedExpense };
      const needConfirmation = false;
      const source = 'reimbursement';
      const onlineVsBatch = 'online';
      const action = 'full-update';
      const comments = 'expense report submitted';
  
     await  sendToOtherMicroservice(payload, action, 'dashboard', comments, source, onlineVsBatch)     

    const response = {
      success: true,
      message: `${name}, your expense report is submitted.`
    };

    return res.status(200).json(response);
    } } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to submit expense report.' });
  }
};


/**
 * Retrieves an expense report based on the provided parameters.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object.
 */
export const getReimbursementExpenseReport = async (req, res) => {
  try {
    const { tenantId, empId, expenseHeaderId } = req.params;

    if (!expenseHeaderId || !empId || !tenantId) {
      return res.status(404).json({ message: 'Error: Required parameters are missing.' });
    }

    const expenseReport = await Reimbursement.findOne({
      tenantId,
      expenseHeaderId,
      'createdBy.empId': empId,
    });

    if (!expenseReport) {
      return res.status(404).json({
        success: false,
        message: 'Expense report not found for the given IDs.',
      });
    }

    const { name } = expenseReport.createdBy;

    return res.status(200).json({
      success: true,
      expenseReport,
      message: `Expense report is retrieved for ${name}.`,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve non_Travel expense LINE.',
    });
  }
};


/**
 * Cancels a reimbursement report.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object.
 */

export const cancelReimbursementReport = async (req, res) => {
  try {
    const { tenantId, empId, expenseHeaderId } = req.params;

    if (!tenantId || !empId || !expenseHeaderId) {
      const missingParams = [];
      if (!tenantId) missingParams.push('tenantId');
      if (!empId) missingParams.push('empId');
      if (!expenseHeaderId) missingParams.push('expenseHeaderId');
      return res.status(404).json({ message: `Missing params: ${missingParams.join(',')}` });
    }

    const expenseReport = await Reimbursement.findOneAndDelete({
      tenantId,'createdBy.empId': empId,expenseHeaderId,
    });

    if (!expenseReport) {
      console.log('expense report deleted', !expenseReport)
      return res.status(404).json({ success: false, message: 'Expense report not found' });
    }

    console.log('expense report failed to delete', expenseReport)

    const { name } = expenseReport.createdBy;
    const payload = {  tenantId, empId, expenseHeaderId };
    const needConfirmation = false;
    const source = 'reimbursement';
    const onlineVsBatch = 'online';

    // await sendTravelExpenseToDashboardQueue(payload, needConfirmation, onlineVsBatch, source);
         const action = 'delete';
         const comments = 'reimbursment expense report deleted';

   await  sendToOtherMicroservice(payload, action, 'dashboard', comments, source, onlineVsBatch)
    return res.status(200).json({ success: true, message: `Expense report deleted successfully ${name}` });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Cancels non-travel expense lines in an expense report.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object.
 */
export const cancelReimbursementReportLine = async (req, res) => {
  try {
    const { tenantId, empId, expenseHeaderId } = req.params;
    const { lineItemIds } = req.body;

    console.log("params cancelNonTravelReportLine", req.params);
    console.log("lineItemIds cancelNonTravelReportLine", lineItemIds);

    const expenseReport = await Reimbursement.findOne({
      tenantId,
      'createdBy.empId': empId,
      expenseHeaderId,
    });

    if (!expenseReport) {
      return res.status(404).json({
        success: false,
        message: 'Expense report not found',
      });
    }

    const { createdBy } = expenseReport;
    const { name } = createdBy;

    lineItemIds.forEach((expenseLineId) => {
      const indexToRemove = expenseReport.expenseLines.findIndex(
        (line) => line.lineItemId.toString() === expenseLineId.toString()
      );
      if (indexToRemove !== -1) {
        expenseReport.expenseLines.splice(indexToRemove, 1);
      }
    });

    await expenseReport.save();

    const payload = { reimbursementReport: expenseReport };
    const needConfirmation = false;
    const source = 'reimbursement';
    const onlineVsBatch = 'online';
         const action = 'full-update';
         const comments = 'reimbursement expense line deleted';

   await  sendToOtherMicroservice(payload, action, 'dashboard', comments, source, onlineVsBatch)
    return res.status(200).json({
      success: true,
      message: `Expense lines deleted successfully by ${name}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};














