
import HRMaster from "../models/hrMaster.js";
import { getCashAdvanceToSettle, getPaidAndCancelledCash } from "./cashAdvanceController.js";
import { getReimbursement } from "./reimbursementController.js";
import { getTravelExpenseData } from "./travelExpenseController.js";

const getEmployeeRoles = async (tenantId, empId) => {
    const toString = empId.toString();
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
    return employee.employeeRoles;
};


export const roleBasedLayout = async (req, res) => {
  try {
    const { tenantId, empId } = req.params;

    // Input validation
    if (!tenantId || !empId) {
      return res.status(400).json({ error: "Invalid input parameters" });
    }

    // Get employee roles and execute layout functions
    const dashboardViews = await getDashboardViews(tenantId, empId);

    // Send response
    return res.status(200).json(dashboardViews);
  } catch (error) {
    console.error("Error:", error);
    // Handle the error, but do not send another response
    return;
  }
};


const getDashboardViews = async (tenantId, empId) => {
  try {
      const employeeRoles = await getEmployeeRoles(tenantId, empId);
      const layoutFunctions = {
          employee: async () => {},
          employeeManager: async () => {},
          finance: async () => financeLayout(tenantId, empId),
          businessAdmin: async () => {},
          superAdmin: async () => {}

        //   employee: async () => employeeLayout(tenantId, empId),
        //   employeeManager: async () => managerLayout(tenantId, empId),
        //   finance: async () => financeLayout(tenantId, empId),
        //   businessAdmin: async () => businessAdminLayout(tenantId, empId),
        //   superAdmin: async () => superAdminLayout(tenantId, empId)
      };

      const applicableRoles = Object.keys(employeeRoles).filter(role => employeeRoles[role]);

      const dashboardViews = await Promise.all(applicableRoles.map(async role => {
          try {
              const data = await layoutFunctions[role]();
              return { [role]: data };
          } catch (error) {
              console.error("Error fetching data for role", role, "Error:", error);
              return { [role]: null }; // Handle the error case as needed
          }
      }));

      const formattedDashboardViews = dashboardViews.reduce((acc, curr) => ({ ...acc, ...curr }), {});

      return {
          dashboardViews: formattedDashboardViews,
          employeeRoles
      };
  } catch (error) {
      console.error("Error fetching dashboard views:", error);
      throw error; // Propagate the error to the caller
  }
};


const financeLayout = async (tenantId, empId) => {
    console.log("Entering financeLayout function...", tenantId, empId);
  try {
      const paidAndCancelledCash = await getPaidAndCancelledCash(tenantId, empId);
    const cashAdvanceToSettle = await getCashAdvanceToSettle(tenantId, empId);
    const nonTravelExpense = await getReimbursement(tenantId, empId);
    const travelExpense = await getTravelExpenseData(tenantId, empId);
    const settlements = { cashAdvanceToSettle, paidAndCancelledCash, travelExpense, nonTravelExpense}
    return settlements;
  } catch (error) {
    console.error("Error:", error);
    throw new Error({ message: 'Internal server error :Finance Layout' });
  }
};