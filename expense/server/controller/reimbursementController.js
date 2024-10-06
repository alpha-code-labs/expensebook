import mongoose from "mongoose";
import HRCompany from "../models/hrCompanySchema.js";
import Reimbursement from "../models/reimbursementSchema.js";
import { sendToOtherMicroservice } from "../rabbitmq/publisher.js";
import Joi from "joi";
import { extractTotalAmount } from "./travelExpenseController.js";


const sendToMicroservices = async (payload, action, comments, source, onlineVsBatch, isApproval) => {
  const services = ['dashboard', 'reporting'];
  if (isApproval) {
      services.unshift('approval');
  }

  for (const service of services) {
      try {
          await sendToOtherMicroservice(payload, action, service, comments, source, onlineVsBatch);
      } catch (error) {
          console.error(`Error sending to ${service}:`, error);
          // logging or retrying need to be added
      }
  }
};



const getReimbursementReport = async (tenantId, empId, expenseHeaderId) => {
  try {

    if (!expenseHeaderId || !empId || !tenantId) {
      throw new Error(' Required parameters are missing - expenseHeaderId , empId,tenantId' )
    }

    const expenseReport = await Reimbursement.findOne({
      tenantId,
      expenseHeaderId,
      'createdBy.empId': empId,
    });

    if (!expenseReport) {
      throw new Error('Expense report not found for the given IDs.');
    }

    return expenseReport
  } catch (error) {
    console.error("error finding expense categories",error);
    throw error
  }
};

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

const nonTravelSchema = Joi.object({
  expenseHeaderId: Joi.string().required(),
  tenantId: Joi.string().required(),
  empId:Joi.string().required()
})

// to generate and add expense report number
const generateIncrementalNumber = (companyName, incrementalValue) => {
  console.log("generateIncrementalNumber - ", companyName, typeof companyName , "incrementalValue", incrementalValue , typeof incrementalValue)
  if (typeof companyName !== 'string' || typeof incrementalValue !== 'number') {
    throw new Error('Invalid input parameters');
  }
  console.log("companyName",companyName, "incrementalValue", incrementalValue)
  const formattedTenant = formatTenant(companyName).substring(0, 2);
  const paddedIncrementalValue = (incrementalValue !== null && incrementalValue !== undefined && incrementalValue !== 0) ?
    (incrementalValue).toString().padStart(6, '0') :
    '000001';

  return `RE${formattedTenant}${paddedIncrementalValue}`;
}

const createReimbursementReport = async(tenantId,empId,companyName,employeeName,defaultCurrency) => {
  try{

    console.log("createReimbursementReport", "tenantId,empId,companyName", tenantId,empId,companyName)
    let expenseHeaderStatus
    let expenseHeaderNumber
    let expenseHeaderId
    let approvers

    const getExpenseHeaderStatus = [
      'new',
      null
    ];

    // Find the updated expense header
    const updatedExpense = await Reimbursement.findOne(
      {
        tenantId,
        'createdBy.empId': empId,
        expenseHeaderStatus: { $in: getExpenseHeaderStatus },
      },
    );

    if (updatedExpense) {
      // console.log('Updated expense', updatedExpense);
      ({ expenseHeaderNumber, expenseHeaderId, approvers=[],expenseHeaderStatus  } = updatedExpense);
      return updatedExpense
    }
  
    if(!expenseHeaderId){
      console.log("expenseHeaderId from req body",expenseHeaderId)
      const maxIncrementalValue = await Reimbursement.findOne({ tenantId})
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

    expenseHeaderStatus = 'new'

    const newExpense = {
      tenantId,
      companyName,
      tenantName:companyName,
      expenseHeaderId,
      expenseHeaderNumber,
      expenseHeaderStatus,
      createdBy: {
        empId,
        name: employeeName,
      },
      defaultCurrency,
      approvers : []
    }
    const expenseReport = await Reimbursement.create(newExpense)
    return expenseReport
  }

     // Return the response with the extracted information
    return res.status(200).json({
      success: true,
      tenantId,
      expenseHeaderId,
      expenseHeaderNumber,
      expenseHeaderStatus,
      companyName,
      createdBy: {
        empId,
        name: employeeName,
      },
      approvers:updatedExpense ? approvers : [],
      defaultCurrency: defaultCurrency || '',
      currencyTable: currencyTable || '',
    }); 
  } catch(error){
    console.log(error);
    throw error
  }
}

const getPolicy = (group, policy, travelType, policies)=>{
  let result = null
  policies.forEach(groupPolicy=>{
    if(groupPolicy[group]!=null && groupPolicy[group]!=undefined){
        result = groupPolicy[group][travelType][policy] 
        return
    }
  })
  return result
}


const getApproversFromOnboarding = (employeeDocument,empId) => {
  try{
    const travelType='international'
    let approvalFlow = null
    let APPROVAL_FLAG = false
  
    const flags = employeeDocument.flags
    const isPolicy = flags.POLICY_SETUP_FLAG
    const tenantPolicies = employeeDocument?.policies.travelPolicies??[]
    const employeeData = employeeDocument.employees.find(emp => emp.employeeDetails.employeeId.toString() === empId.toString());
    const employeeRoles = employeeData.employeeRoles
    const employeeGroups = employeeData.group
    const MANAGER_FLAG = employeeRoles.employeeManager
    const listOfManagers = employeeDocument.employees.filter(employee=>employee.employeeRoles.employeeManager).map(emp=> ({...emp.employeeDetails, imageUrl:emp?.imageUrl??getRandomAvatarUrl()}));
    
    if(isPolicy){
      employeeGroups.forEach(group=>{
        const res = getPolicy(group, 'Approval Flow', travelType, tenantPolicies)
        console.log(res, 'Approval flow...')
  
        if(res.approval.approvers){
          if(approvalFlow == null){
            approvalFlow = res.approval.approvers
            if(res.approval.approvers.length>0){
              APPROVAL_FLAG = true
            }
            else APPROVAL_FLAG = false
          }
  
          else if(approvalFlow.length > res.approval.approvers.length){
              approvalFlow = res.approval.approvers
              if(res.approval.approvers.length>0){
                APPROVAL_FLAG = true
              }
              else APPROVAL_FLAG = false
          }
        }
  
      })
    }
  
    return {
      APPROVAL_FLAG,
      approvalFlow,
      MANAGER_FLAG,
      listOfManagers
    }
  } catch(error){
    console.error('Error finding approvers from onboarding:', error);
    throw new Error(error.message)
  }
}

const employeeSchema = Joi.object({
  empId: Joi.string().required(),
  tenantId: Joi.string().required(),
  expenseHeaderId: Joi.string().optional(),
})


/**
 * Retrieves expense categories for a given employee ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with the employee's name, company name, default currency, and reimbursement expense categories.
 */
const getExpenseCategoriesForEmpId = async (req, res) => {
  try {
    const { error, value } = employeeSchema.validate({ ...req.params, ...req.query });

    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const { tenantId, empId, expenseHeaderId } = value;

    // console.log("non travel expense booking",  tenantId, empId )
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

const employee = employeeDocument?.employees.find(emp => emp.employeeDetails.employeeId.toString() === empId.toString());

const { employeeName, employeeId } = employee?.employeeDetails || {};

    console.log("employeeName, employeeId", employeeName, employeeId)
    if (!employeeId) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found for the provided ID',
      });
    }

    const {
      companyDetails: { defaultCurrency, companyName} = {},
      reimbursementExpenseCategories,
      travelAllocationFlags,
      expenseSettlementOptions
    } = employeeDocument || {};

    const reimbursementExpenseCategory = Array.isArray(reimbursementExpenseCategories)
      ? reimbursementExpenseCategories.map(category => category?.categoryName)
      : [];

      const getApprovers = getApproversFromOnboarding(employeeDocument,empId)
      console.log("before","tenantId,empId,companyName, defaultCurrency", tenantId,empId,companyName, defaultCurrency )

      let getReport
      if(!expenseHeaderId){
        getReport = await createReimbursementReport(tenantId,empId,companyName,employeeName,defaultCurrency)
        if(!getReport){
          return res.status(404).json({success: false, message: 'report creation or retrial failed', error:error.message})
        }
      } else {
        getReport = await getReimbursementReport(tenantId,empId,expenseHeaderId)
        if(!getReport){
          return res.status(404).json({success: false, message: 'report retrial failed', error:error.message})
        }
      }
    

    return res.status(200).json({
      success: true,
      defaultCurrency,
      employeeName,
      companyName,
      reimbursementExpenseCategory,
      travelAllocationFlags,
      getApprovers,
      expenseSettlementOptions,  
      expenseReport:getReport
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



const expenseCatSchema = Joi.object({
  expenseCategory: Joi.string().required(),
  tenantId: Joi.string().required(),
  empId: Joi.string().required(),
})

// 2) group limit, policies, expense header number
const getHighestLimitGroupPolicy = async (req, res) => {
    try {
      const {error, value} = expenseCatSchema.validate(req.params)
      if (error) {
        return res.status(400).json({success: false, message: error.details[0].message})
      }
      const { tenantId, empId, expenseCategory } = value;

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
      const { companyDetails: { companyName }, employees: [employee], policies: { nonTravelPolicies },travelAllocationFlags, expenseSettlementOptions } = employeeDocument;
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
      
      const selectedReimbursementAllocations = reimbursementAllocations?.find(allocation => allocation.categoryName == expenseCategory)
      let newExpenseAllocation;
      let newExpenseAllocation_accountLine;
      if (selectedReimbursementAllocations) {
        ({ expenseAllocation: newExpenseAllocation, expenseAllocation_accountLine: newExpenseAllocation_accountLine } = selectedReimbursementAllocations);
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

      const getApprovers = getApproversFromOnboarding(employeeDocument,empId)

      const message = `${employeeName} is part of ${groupName}. Highest limit found: ${highestLimit}`;
      const group = { limit: highestLimit, group: groupName, message };


      // Return the response with the extracted information
      return res.status(200).json({
        success: true,
        getApprovers,
        levels:travelAllocationFlags,
        defaultCurrency: defaultCurrency || '',
        currencyTable: currencyTable || '',
        newExpenseAllocation,
        newExpenseAllocation_accountLine,
        expenseSettlementOptions,  
        group,
        ...selectedExpenseCategory,
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

const currencySchema = Joi.object({
  tenantId:Joi.string().required(),
  amount:Joi.string().required,
  currencyName:Joi.string().required,
})


//3) currency converter for non travel expense 
const reimbursementCurrencyConverter = async (req, res) => {
  try {
    const {error, value} = currencySchema.validate(req.params)
    if (error) return res.status(400).json({success: false, message: error.details[0].message})

    const { tenantId, amount, currencyName } = value;
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

const saveSchema = Joi.object({
  lineItem:Joi.object().required(),
})

const validateRequest = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    throw new Error(error.message);
  }
  return value;
};

const extractCategoryAndTotalAmount = async (expenseLines, onSave) => {
  const fixedFields = [
      'Total Amount', 
      'Total Fare', 
      'Premium Amount', 
      'Total Cost', 
      'License Cost', 
      'Subscription Cost',  
      'Premium Cost',
      'Cost', 
      'Tip Amount',
  ];

  const results = [];
  let totalExpenseAmount = 0; 

  let getStatus = onSave ?? 
  expenseLines.forEach(expenseLine => {
      if (expenseLine.lineItemStatus === 'approved') {
          const categoryName = expenseLine['Category Name'] || ''; 
          const keyFound = Object.entries(expenseLine).find(([key]) =>
              fixedFields.some(name => name.trim().toUpperCase() === key.trim().toUpperCase())
          );
          const totalAmount = keyFound ? Number(keyFound[1]) || 0 : 0; 
          totalExpenseAmount += totalAmount; 
          results.push({ categoryName, totalAmount });
      }
  });

  return { results, totalExpenseAmount };
};

// 4) save line item 
const saveReimbursementExpenseLine = async (req, res) => {
    try {
      const params = validateRequest(nonTravelSchema, req.params);
      const body = validateRequest(saveSchema, req.body);
  
      const { tenantId, empId, expenseHeaderId } = params;
      const {lineItem  } = body;
  
      //  console.log("req body", req.body)
      //  console.log("lineItem ......", lineItem)
      console.log("Type of 'Booking Reference No':", typeof lineItem['Booking Reference No']);
    
      const fixedFields = ['Total Amount', 'Total Fare', 'Premium Amount', 'Total Cost', 'License Cost', 'Subscription Cost',  'Premium Cost','Cost', 'Tip Amount', ]

      // Extract total amount
      let totalAmount = extractTotalAmount(lineItem, fixedFields);

      if(!totalAmount){
        throw new Error(`totalAmount Not found: ${totalAmount}, `, "totalAmount type on save",typeof totalAmount)
      } 

      console.log("totalAmount", totalAmount)

      const expenseLineId = new mongoose.Types.ObjectId().toString();

      const expenseLineData ={
      ...lineItem,
      lineItemId:expenseLineId,
      lineItemStatus:'save'
      }

      const getReport = await Reimbursement.findOne({ tenantId, expenseHeaderId });

      if(!getReport){
        return res.status(404).json({success: false, error:'document not found' })
      }

      let {expenseAmountStatus:{totalRemainingCash,totalExpenseAmount},createdBy,expenseHeaderStatus} = getReport
      const {name} = createdBy

      console.log("expenseAmountStatus - on save nte", JSON.stringify(getReport.expenseAmountStatus,'',2))

      
      const totalAmountField = +totalAmount;
      const newTotalRemainingCash = +totalRemainingCash - totalAmountField
      const newTotalExpenseAmount =  +totalExpenseAmount +totalAmountField;

      // console.log("totalExpenseAmount kaboom",totalExpenseAmount, typeof totalExpenseAmount , typeof newTotalRemainingCash)
      // console.log("totalRemainingCash kaboom2",totalRemainingCash, typeof totalRemainingCash, typeof totalRemainingCash)

      getReport.expenseAmountStatus.totalExpenseAmount = newTotalExpenseAmount
      getReport.expenseAmountStatus.totalRemainingCash = newTotalRemainingCash
      if(expenseLineData) getReport.expenseLines.push(expenseLineData)
      getReport.expenseHeaderStatus = (expenseHeaderStatus === 'pending settlement') ? 'draft' : getReport.expenseHeaderStatus;
      const newExpense = await getReport.save()
      // const newExpense = await Reimbursement.findOneAndUpdate(filter, update, options);
      if(newExpense){
        console.log("newExpense", JSON.stringify(newExpense,'',2))
        const {expenseAmountStatus, expenseLines} = newExpense
        const savedLineItemId = expenseLines[expenseLines.length - 1];
  
        const lastLineItemId = savedLineItemId.lineItemId
  
        console.log("saved Itinerary ID:", lastLineItemId);
    
        console.log("expenseAmountStatus - on save expense Line", expenseAmountStatus)
        return res.status(200).json({
          success: true,
          message: `expense line saved successfully by ${name} `,
          expenseHeaderStatus,
          expenseAmountStatus,
          expenseLines
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to process non_Travel expense LINE' , error:error.message});
    }
};


/**
 * Edits a specific expense line item in a reimbursement document.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object.
 */
const editReimbursementExpenseLine = async (req, res) => {
  try {
    const { tenantId, empId, expenseHeaderId, lineItemId } = req.params;

    // Check if any of the required parameters are missing
    if (!expenseHeaderId || !empId || !tenantId) {
      return res.status(404).json({ message: 'Error params are missing' });
    }

    const { prevLineItem , lineItem } = req.body;

    if (!prevLineItem || !lineItem ) {
      return res.status(404).json({ message: 'Error in lineItem,prevLineItem' });
    }

    // console.log("prevLineItem KABOOM ", JSON.stringify(prevLineItem,'',2) ,"lineItem KAKOOM" ,lineItem)

   const fixedFields = ['Total Amount', 'Total Fare', 'Premium Amount', 'Total Cost', 'License Cost', 'Subscription Cost',  'Premium Cost','Cost', 'Tip Amount', ]

    // Extract total amount
    let prevTotalAmount = extractTotalAmount(prevLineItem, fixedFields);

    if(!prevTotalAmount){
      throw new Error(`prevTotalAmount Not found: ${prevTotalAmount}, `, "prevTotalAmount type on save",typeof prevTotalAmount)
    }  

    let currentTotalAmount = extractTotalAmount(lineItem, fixedFields)
    if(!currentTotalAmount){
      throw new Error(`currentTotalAmount Not found: ${currentTotalAmount}, `, "currentTotalAmount type on save",typeof currentTotalAmount)
    } 

    // console.log("prevTotalAmount", prevTotalAmount , "currentTotalAmount", currentTotalAmount)

    const getReport = await Reimbursement.findOne({ tenantId, expenseHeaderId, 'expenseLines.lineItemId': lineItemId });
    if (!getReport) {
      return res.status(404).json({ message: 'Expense not found' , success:false});
    }

    let {expenseAmountStatus:{totalRemainingCash,totalExpenseAmount}} = getReport
    console.log("expenseAmountStatus - on save nte", JSON.stringify(getReport.expenseAmountStatus,'',2))
    
    const prevTotalAmountField = +prevTotalAmount;
    const currentTotalAmountField = +currentTotalAmount;
    const newTotalAmount = prevTotalAmountField - currentTotalAmount
    console.log("prevTotalAmountField", prevTotalAmountField, "currentTotalAmountField", currentTotalAmountField)

    let newTotalRemainingCash
    let newTotalExpenseAmount 

    switch (true) {
    case (newTotalAmount > 0):
        newTotalRemainingCash = +totalRemainingCash + newTotalAmount;
        newTotalExpenseAmount = +totalExpenseAmount - newTotalAmount;
        break;
    case (newTotalAmount < 0):
        newTotalRemainingCash = +totalRemainingCash - Math.abs(newTotalAmount);
        newTotalExpenseAmount = +totalExpenseAmount + Math.abs(newTotalAmount);
        break;
    default:
        newTotalRemainingCash = +totalRemainingCash;
        newTotalExpenseAmount = +totalExpenseAmount;
        break;
    }

console.log('New Total Remaining Cash:', newTotalRemainingCash);
console.log('New Total Expense Amount:', newTotalExpenseAmount);


    getReport.expenseAmountStatus.totalExpenseAmount = newTotalExpenseAmount
    getReport.expenseAmountStatus.totalRemainingCash = newTotalRemainingCash
    if(lineItem){
    getReport.expenseLines = getReport.expenseLines.map(line => {
        if(line.lineItemId.toString() === lineItemId.toString()){
        return{
          ...line,
          ...lineItem
        } 
        }
        return line
      })
    } 
    const updatedExpense = await getReport.save()

    const { name } = updatedExpense.createdBy;
    const { expenseLines,approvers , expenseAmountStatus} = updatedExpense;
    const isApproval = approvers?.length > 0

    // Find the updated line
    const savedLineItem = expenseLines.find(line => line.lineItemId.toString() === lineItemId);

    const payload = { reimbursementReport : updatedExpense };
    const source = 'reimbursement';
    const onlineVsBatch = 'online';
    const action = 'full-update';
    const comments = 'expense report edited';

  await sendToMicroservices(payload, action, comments, source, onlineVsBatch, isApproval);

    return res.status(200).json({
      success: true,
      message: `Expense line saved successfully by ${name}`,
      expenseAmountStatus,
      updatedLine: savedLineItem,
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

const draftExpense = Joi.object({
  approvers: Joi.array().items(
    Joi.object({
      empId: Joi.string().optional(),
      name: Joi.string().optional(),
      status: Joi.string().optional(),
      imageUrl: Joi.string().optional(),
      _id: Joi.string().optional()
    })
  ).default([]),
  expenseSettlement: Joi.string().allow('').default('')
})

const draftReimbursementExpenseLine = async (req, res) => {
  try {
    const params = validateRequest(nonTravelSchema,req.params)
    const body = validateRequest(draftExpense, req.body)

    const { tenantId, empId, expenseHeaderId } = params;
    const { approvers=[] , expenseSettlement=''} = body;
    const status ={
      PENDING_SETTLEMENT :'pending settlement',
      PENDING_APPROVAL:'pending approval',
      DRAFT: 'draft'
    }

    console.log("approvers", approvers)
    const isApproval = approvers?.length > 0

   const getStatus = status.DRAFT

    const report = await Reimbursement.findOne({
    tenantId, expenseHeaderId, 'createdBy.empId': empId
  });

    if (!report) {
      return res.status(404).json({ message: 'Expense Report not found or unauthorized.' });
    }

    report.expenseLines.map(lineItem => ({
    ...lineItem,
    lineItemStatus: getStatus,
    approvers: approvers ?? []
    }))

    report.expenseHeaderStatus = getStatus
    report.approvers = approvers ?? []
    report.expenseSettlement = expenseSettlement ?? null
    const updatedExpense = await report.save()

      const { name } = updatedExpense.createdBy ?? { name: 'user' };
      const payload = { reimbursementReport : updatedExpense };
      const source = 'reimbursement';
      const onlineVsBatch = 'online';
      const action = 'full-update';
      const comments = 'expense report saved as Draft';
  
    if(isApproval){
      await  sendToOtherMicroservice(payload, action, 'approval', comments, source, onlineVsBatch) 
    }     
    await  sendToOtherMicroservice(payload, action, 'dashboard', comments, source, onlineVsBatch)   

    const response = {
      success: true,
      message: `${name}, your expense report is saved as draft.`
    };

    return res.status(200).json(response);
    } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error Occurred' });
  }
};

/**
 * Handles the submission of an expense report.
 * Updates the status of the expense report to "pending settlement" and returns a success message if the update is successful.
 * @param {object} req - The request object containing the parameters `tenantId`, `empId`, and `expenseHeaderId`.
 * @param {object} res - The response object used to send the response back to the client.
 * @returns {object} - If the update is successful, a response object with a success message is returned. If the update fails or the expense report is not found or unauthorized, an error message is returned.
 */

const submitExpense = Joi.object({
  approvers: Joi.array().items(
    Joi.object({
      empId: Joi.string().optional(),
      name: Joi.string().optional(),
      status: Joi.string().optional(),
      imageUrl: Joi.string().optional(),
      _id: Joi.string().optional()
    })
  ).optional(),
  expenseSettlement: Joi.string().optional()
})

const submitReimbursementExpenseReport = async (req, res) => {
  try {
    const params = validateRequest(nonTravelSchema,req.params)
    const body = validateRequest(submitExpense, req.body)

    const { tenantId, empId, expenseHeaderId } = params;
    const { approvers , expenseSettlement} = body;

    console.log("on submit reim", approvers, "expenseSettlement" , expenseSettlement )
    const status ={
      PENDING_SETTLEMENT :'pending settlement',
      PENDING_APPROVAL:'pending approval'
    }

    console.log("approvers", approvers)
    const isApproval = approvers?.length > 0
    approvers?.forEach(approver => {
      if(isApproval) approver.status = status.PENDING_APPROVAL
    })

  const getStatus =  isApproval ? status.PENDING_APPROVAL :  status.PENDING_SETTLEMENT

    const report = await Reimbursement.findOne({
    tenantId, expenseHeaderId, 'createdBy.empId': empId
  });

    if (!report) {
      return res.status(404).json({ message: 'Expense Report not found or unauthorized.' });
    }

    const {expenseLines} = report
    console.log("did i get", JSON.stringify(expenseLines,'',2))
    const {totalExpenseAmount,results} = await extractCategoryAndTotalAmount(expenseLines);
    console.log("totalExpenseAmount - result",JSON.stringify(totalExpenseAmount,'',2), "results", results)

    console.log("the report 0", JSON.stringify(expenseLines, '',2))
    report.expenseLines = expenseLines.map(lineItem => ({
      ...lineItem,
      lineItemStatus:getStatus,
      approvers:approvers
    }))

    totalExpenseAmount && (report.expenseAmountStatus.totalExpenseAmount = totalExpenseAmount)
    approvers && (report.approvers = approvers)
    report.expenseHeaderStatus = getStatus ? getStatus : report.expenseHeaderStatus
    report.expenseSettlementOptions = expenseSettlement ? expenseSettlement: report.expenseSettlementOptions
    report.expenseSubmissionDate = new Date()

    const updatedExpense = await report.save()

      const { name } = updatedExpense.createdBy ?? { name: 'user' };
      const payload = { reimbursementReport : updatedExpense };
      const source = 'reimbursement';
      const onlineVsBatch = 'online';
      const action = 'full-update';
      const comments = 'expense report submitted';

    await sendToMicroservices(payload, action, comments, source, onlineVsBatch, isApproval);

    console.log("sending reim payload - dashboard")

    const response = {
      success: true,
      message: `${name}, your expense report is submitted.`
    };

    return res.status(200).json(response);
    } catch (error) {
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
const getReimbursementExpenseReport = async (req, res) => {
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

const cancelReimbursementReport = async (req, res) => {
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

    const { approvers, createdBy} = expenseReport
    const { name } = createdBy;

    const isApproval = approvers?.length > 0
    const payload = {  tenantId, empId, expenseHeaderId };
    const source = 'reimbursement';
    const onlineVsBatch = 'online';
    const action = 'delete';
    const comments = 'reimbursement expense report deleted'; 

    await sendToMicroservices(payload, action, comments, source, onlineVsBatch, isApproval);

    return res.status(200).json({ success: true, message: `Expense report deleted successfully ${name}` });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const lineItemSchema = Joi.object({
  lineItemIds: Joi.array()
    .items(Joi.string().messages({
      'string.base': 'lineItemIds must be strings',
      'string.empty': 'lineItemIds cannot be empty'
    }))
    .required()
    .messages({
      'array.base': 'lineItemIds must be an array',
      'array.empty': 'lineItemIds cannot be empty',
      'any.required': 'lineItemIds is a required field'
    })
});
/**
 * Cancels non-travel expense lines in an expense report.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object.
 */
const cancelReimbursementReportLine = async (req, res) => {
  try {
    const { tenantId, empId, expenseHeaderId } = req.params;

    const { error , value} = lineItemSchema.validate(req.body);
    if (error) return res.status(400).json({success: false, message: error.details[0].message})

    const { lineItemIds } = value;
    console.log("params cancelNonTravelReportLine", req.params);
    console.log("lineItemIds cancelNonTravelReportLine", lineItemIds)

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

    const { createdBy , approvers , expenseAmountStatus:{totalExpenseAmount,totalRemainingCash}} = expenseReport;
    const { name } = createdBy;


    const fixedFields = ['Total Amount', 'Total Fare', 'Premium Amount', 'Total Cost', 'License Cost', 'Subscription Cost',  'Premium Cost','Cost', 'Tip Amount', ]
    let totalAmount
    let newTotalExpenseAmount
    let newTotalRemainingCash


    const isApproval = approvers?.length > 0

    lineItemIds.forEach((expenseLineId) => {
      const indexToRemove = expenseReport.expenseLines.findIndex(
        (line) => line.lineItemId.toString() === expenseLineId.toString()
      );
      if (indexToRemove !== -1) {
      const lineToRemove = expenseReport.expenseLines[indexToRemove]
       // Extract total amount
      totalAmount = extractTotalAmount(lineToRemove, fixedFields);

      console.log("totalAmount type", typeof totalAmount , totalAmount)
      if(!totalAmount){
        throw new Error(`totalAmount Not found: ${totalAmount}, `, "totalAmount type on save",typeof totalAmount)
      }  

      newTotalExpenseAmount = +totalExpenseAmount - +totalAmount
      newTotalRemainingCash = +totalRemainingCash + +totalAmount
      console.log("totalExpenseAmount kaboom",totalExpenseAmount, typeof totalExpenseAmount , typeof newTotalRemainingCash)
      console.log("totalRemainingCash kaboom2",totalRemainingCash, typeof totalRemainingCash, typeof totalRemainingCash)

      // Update expense report
      expenseReport.expenseAmountStatus.totalExpenseAmount = newTotalExpenseAmount
      expenseReport.expenseAmountStatus.totalRemainingCash =  newTotalRemainingCash 
      // Remove the line item from the expense report
        expenseReport.expenseLines.splice(indexToRemove, 1);
      }
    });

   const updatedReport =  await expenseReport.save();

    const { expenseAmountStatus} = updatedReport 
  
  const payload = { reimbursementReport: updatedReport };
  const source = 'reimbursement';
  const onlineVsBatch = 'online';
  const action = 'full-update';
  const comments = 'reimbursement expense line deleted';
  
  await sendToMicroservices(payload, action, comments, source, onlineVsBatch, isApproval);

    return res.status(200).json({
      success: true,
      message: `Expense lines deleted successfully by ${name}`,
      expenseAmountStatus
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};




export {
  getReimbursementReport,
  getExpenseCategoriesForEmpId,
  getHighestLimitGroupPolicy,
  reimbursementCurrencyConverter,
  extractCategoryAndTotalAmount,
  saveReimbursementExpenseLine,
  editReimbursementExpenseLine,
  draftReimbursementExpenseLine,
  submitReimbursementExpenseReport,
  getReimbursementExpenseReport,
  cancelReimbursementReport,
  cancelReimbursementReportLine,
}









