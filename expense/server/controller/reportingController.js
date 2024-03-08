import HRMaster from "../models/hrCompanySchema.js";
import Expense from "../models/travelExpenseSchema.js";

export const employeeRole = async (req, res) => {
  try {
    const { tenantId, empId } = req.params;

    // Find the employee document in the HRMaster collection
    const employeeDocument = await HRMaster.findOne({
      tenantId,
      'employees.employeeDetails.employeeId': empId,
    });

    if (!employeeDocument) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found for the given IDs',
      });
    }

    // Find the employee in the employees array
    const employee = employeeDocument.employees.find(emp => emp.employeeDetails.employeeId === empId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found in the employees array',
      });
    }

    // Retrieve the l1ManagerName from the employeeDetails
    const l1ManagerName = employee.employeeDetails.l1Manager;

    return res.status(200).json({
      success: true,
      l1ManagerName: l1ManagerName,
    });
  } catch (error) {
    console.error('Error fetching employee role:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


export const employeeReport = async (req, res) => {
  try {
    // Destructuring the parameters from the request object
    const { tenantId, empId, period } = req.params;

    // Calculating the start date of the period based on the provided period
    const tripEndDate = new Date();
    const startMonth = tripEndDate.getMonth() - (parseInt(period) - 1); 
    tripEndDate.setMonth(startMonth);
    tripEndDate.setDate(1); // Set the date to the 1st day of the month

    // Retrieving the expense reports based on specified conditions
    const expenseReports = await Expense.find({
      tenantId,
      tripEndDate: { $gte: tripEndDate },
      $or: [
        { 'travelRequestData.createdBy.empId': empId },
        { 'travelRequestData.createdFor.empId': empId },
      ],
    });

    if (expenseReports.length === 0) {
      return res.status(404).json({ message: 'No expense reports found' });
    }
     console.log("expense reports for time period", expenseReports)
    return res.status(200).json({ expenseReports });
  } catch (error) {
    console.error('Error in fetching expense reports:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

