
import Joi from "joi";
import HRMaster from "../models/hrMaster.js";
import { getCashAdvanceToSettle, getPaidAndCancelledCash } from "./cashAdvanceController.js";
import { getReimbursement } from "./reimbursementController.js";
import { getTravelAndNonTravelExpenseData } from "./settlingAccountingEntries.js";
import { getTravelExpenseData } from "./travelExpenseController.js";
import { handleErrors } from "../errorHandler/errorHandler.js";

const getEmployeeRoles = async (tenantId, empId) => {
    const hrDocument = await HRMaster.findOne({
        'tenantId': tenantId,
        'employees.employeeDetails.employeeId': empId,
    });
    if (!hrDocument) {
        throw new Error("HR document not found");
    }

    const employee = hrDocument?.employees.find(emp => emp.employeeDetails.employeeId === empId);
    if (!employee || !employee.employeeRoles) {
        throw new Error("Employee roles not found");
    }
    // console.log("employee", employee)
    const employeeRoles = employee?.employeeRoles
    const { employeeName,employeeId }= employee?.employeeDetails

    const employeeData = { name:employeeName,empId:employeeId}
    return {employeeRoles, employeeData}
};

const employeeSchema = Joi.object({
  tenantId: Joi.string().required(),
  empId: Joi.string().required()
})

export const roleBasedLayout = async (req, res, next) => {
  try {
    const { error, value} = employeeSchema.validate(req.params)
    if(error) throw new Error(error.details[0].message)
    const { tenantId, empId } = value;

    // Input validation
    if (!tenantId || !empId) {
      return res.status(400).json({ error: "Invalid input parameters" });
    }

    // Get employee roles and execute layout functions
    const dashboardViews = await getFinanceView(tenantId, empId);

    // Send response
    return res.status(200).json(dashboardViews);
  } catch (error) {
    console.error("Error:", error);
    next(error)
  }
};


const getFinanceView = async (tenantId, empId) => {
  try {
      const {employeeRoles, employeeData}= await getEmployeeRoles(tenantId, empId);
      // console.log("employeeRoles",employeeRoles)
      const applicableRoles = Object.keys(employeeRoles).filter(role => role =='finance' && employeeRoles[role]);
      const finance = applicableRoles.includes('finance') ? await financeLayout(tenantId,empId) : null
  
      return {
          finance,
          employeeData,
          employeeRoles
      };
  } catch (error) {
      console.error("Error fetching dashboard views:", error);
      throw error; 
  }
};


const financeLayout = async(tenantId,empId) => {
  try{
    const [paidAndCancelledCash,cashAdvanceToSettle,travelExpense,nonTravelExpense,entries]  = await Promise.all([
      getPaidAndCancelledCash(tenantId,empId),
      getCashAdvanceToSettle(tenantId,empId),
      getTravelExpenseData(tenantId,empId),
      getReimbursement(tenantId,empId),
      getTravelAndNonTravelExpenseData(tenantId,empId)
    ])
    const settlements = { cashAdvanceToSettle, paidAndCancelledCash, travelExpense, nonTravelExpense, entries}
    return settlements 
  }catch(error){
    console.error(error.message)
    throw error
  }
}



