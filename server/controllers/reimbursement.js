import Joi from 'joi';
import { getMonthRange, getQuarterRange, getWeekRange, getYear } from "../helpers/dateHelpers.js";
import HRCompany from "../models/hrCompanySchema.js";
import REIMBURSEMENT, { expenseHeaderStatusEnums } from "../models/reimbursementSchema.js";


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

      const getEmployee = employeeDocument?.employees.find(e => e.employeeDetails.employeeId.toString() === empId.toString())
      const { employeeName, employeeId , department, designation,grade,project} = getEmployee.employeeDetails
      console.log("employee name man", employeeName, employeeId )
  
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
        department, 
        designation,
        grade,
        project,
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

const dataSchema = Joi.object({
    tenantId: Joi.string().required(),
    empId: Joi.string().required(),
    filterBy: Joi.string().valid('date', 'week', 'month', 'quarter', 'year'),
    date: Joi.date().when('filterBy', {
      is: Joi.exist(),
      then: Joi.required(),
    }),
    fromDate: Joi.date(),
    toDate: Joi.date().when('fromDate', {
      is: Joi.exist(),
      then: Joi.required(),
    }),
    empNames:Joi.array().items(Joi.object()).optional(),
    expenseHeaderStatus: Joi.array().items(Joi.string().valid(...expenseHeaderStatusEnums)).optional(),
    expenseSubmissionDate: Joi.date(), // validation
  }).with('fromDate', 'toDate').without('filterBy', [ 'fromDate', 'toDate']);


//to filter reimbursement expense reports based on 'date', 'week', 'month', 'quarter', 'year' and date.
export const getReimbursementExpenseReport = async (req, res) => {
  try {
    const { error, value } = dataSchema.validate({
      ...req.params,
      ...req.body,
    });

    if (error) {
      return res.status(400).json({ message: error.details[0].message , reports:[],
    success: false });
    }

    const { tenantId, empId, filterBy, date, fromDate, toDate , empNames, expenseSubmissionDate ,expenseHeaderStatus } = value;

    let filterCriteria = {
      tenantId,
    };

    const empIds = empNames ? empNames.map(e => e.empId) : [];

    if(!empNames?.length){
      return res.status(404).json({success:false, message:'no employees selected for filtering'})
      }

      if(empIds){
        filterCriteria['createdBy.empId'] = { $in: empIds }
      } else {
        filterCriteria['createdBy.empId'] = empId
      }

    if(expenseHeaderStatus?.length){
      filterCriteria.expenseHeaderStatus = {$in: expenseHeaderStatus}
    }

    if (filterBy && ( date ) && !fromDate && !toDate) {
      if(date){
      const parsedDate = new Date(date);

      switch (filterBy) {
        case 'date':
          filterCriteria['expenseSubmissionDate'] = {
            $gte: parsedDate,
            $lt: new Date(parsedDate.setDate(parsedDate.getDate() + 1)),
          };
          break;

        case 'week':
          const { startOfWeek, endOfWeek } = getWeekRange(parsedDate);
          filterCriteria['expenseSubmissionDate'] = {
            $gte: startOfWeek,
            $lt: new Date(endOfWeek.setDate(endOfWeek.getDate() + 1)),
          };
          break;

        case 'month':
          const { startOfMonth, endOfMonth } = getMonthRange(parsedDate);
          filterCriteria['expenseSubmissionDate'] = {
            $gte: startOfMonth,
            $lt: new Date(endOfMonth.setDate(endOfMonth.getDate() + 1)),
          };
          break;

        case 'quarter':
          const { startOfQuarter, endOfQuarter } = getQuarterRange(parsedDate);
          filterCriteria['expenseSubmissionDate'] = {
            $gte: startOfQuarter,
            $lt: new Date(endOfQuarter.setDate(endOfQuarter.getDate() + 1)),
          };
          break;

        case 'year':
          const { startOfYear, endOfYear } = getYear(parsedDate);
          filterCriteria['expenseSubmissionDate'] = {
            $gte: startOfYear,
            $lt: new Date(endOfYear.setDate(endOfYear.getDate() + 1)),
          };
          break;

        default:
          break;
      }
    }
  }  else if (fromDate && toDate) {
    filterCriteria['expenseSubmissionDate'] = {
      $gte: new Date(fromDate),
      $lte: new Date(toDate),
    };
  }

  if(expenseSubmissionDate){
    filterCriteria['expenseSubmissionDate']= expenseSubmissionDate;
  }
  const expenseReports = await REIMBURSEMENT.find(filterCriteria);

  if (expenseReports.length === 0) {
    return res.status(204).json({
      success: true,
      reports:[],
      message: 'No reimbursement reports found for the specified filter',
    });
  }

  return res.status(200).json({
    success: true,
    reports: expenseReports,
    message: `Reimbursement reports retrieved for the specified date range.`,
  });
} catch (error) {
console.error(error);
return res.status(500).json({
  success: false,
  message: 'Failed to retrieve reimbursement reports.',
});
}
};







