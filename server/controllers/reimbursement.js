import reporting from "../models/reportingSchema.js";
import hrmaster from '../models/hrCompanySchema.js';

/**
 * Retrieves expense categories for a given employee ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with the employee's name, company name, default currency, and reimbursement expense categories.
 */
export const getExpenseCategoriesForEmpId = async (req, res) => {
    try {
      const { tenantId, empId } = req.params;
  
      const employeeDocument = await hrmaster.findOne({
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
  
      const expenseReport = await reporting.findOne({
        tenantId,
        expenseHeaderId,
        'createdBy.empId': empId,
      });
  
      if (!expenseReport) {
        return res.status(404).json({
          success: false,
          message: 'reimbursement report not found for the given IDs.',
        });
      }
  
      const { name } = expenseReport.createdBy;
  
      return res.status(200).json({
        success: true,
        expenseReport,
        message: `reimbursement report is retrieved for ${name}.`,
      });
    } catch (error) {
      console.error(error);
  
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve reimbursement report.',
      });
    }
  };
  