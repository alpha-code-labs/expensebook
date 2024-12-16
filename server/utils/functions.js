import HRCompany from "../models/hrCompanySchema.js";

/**
 * Fetches an employee document by tenantId and empId from the HRCompany collection
 * @param {string} tenantId - The tenant ID to search for
 * @param {string} empId - The employee ID to locate
 * @returns {Promise<Object|null>} - A promise that resolves to the employee document or null if not found
 */
const getEmployeeDocument = async (tenantId, empId) => {
  try {
    const employeeDocument = await HRCompany.findOne({
      tenantId,
      "employees.employeeDetails.employeeId": empId,
    });

    if (!employeeDocument) {
      throw new Error("No document found for the given tenantId and empId.");
    }

    return employeeDocument;
  } catch (error) {
    console.error(
      "Error occurred while fetching employee document:",
      error.message
    );
    return null;
  }
};

const getEmployeeDetails = async (tenantId, empId) => {
  try {
    const employeeDocument = await getEmployeeDocument(tenantId, empId);

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
    let getAllDepartments;
    let isSuperAdmin = false;
    let isFinance = false;

    if (employeeDocument) {
      const employee = employeeDocument.employees.find(
        (emp) => emp.employeeDetails?.employeeId === empId
      );

      if (employee?.employeeRoles.superAdmin === true) {
        isSuperAdmin = true;
      }

      if (employee?.employeeRoles.finance === true) {
        isFinance = true;
      }
    }

    if (isSuperAdmin || isFinance) {
      getAllDepartments = employeeDocument.groupingLabels
        .filter((label) => label.headerName === "department")
        .flatMap((label) => label.headerValues);
    }

    const getAllGroups = groups.map((group) => group.groupName);
    const getEmployee = employeeDocument?.employees.find(
      (e) => e.employeeDetails.employeeId.toString() === empId.toString()
    );
    const {
      employeeDetails: getEmployeeDetails,
      group,
      employeeRoles,
    } = getEmployee;
    const {
      employeeName,
      employeeId,
      department,
      designation,
      grade,
      project,
    } = getEmployeeDetails;
    // console.log("employee name man", employeeName, employeeId);
    const employeeDetails = {
      employeeName,
      employeeId,
      department,
      designation,
      grade,
      project,
    };

    // console.log("getAllDepartments for Finance", getAllDepartments);
    return {
      employeeRoles,
      employeeDocument,
      employeeDetails,
      group,
      getAllGroups,
      getAllDepartments,
    };
  } catch (error) {
    console.log(error);
  }
};

const getGroupDetails = async (tenantId, empId, getGroups) => {
  try {
    let matchedEmployees;
    const employeeDocument = await getEmployeeDocument(tenantId, empId);

    if (!employeeDocument) {
      console.warn(
        `Employee not found for tenantId: ${tenantId}, empId: ${empId}`
      );
      return {
        success: false,
        message: "Invalid credentials. Please check your employee ID.",
      };
    }

    let getAllDepartments;
    let isSuperAdmin = false;
    let isFinance = false;

    if (employeeDocument) {
      const employee = employeeDocument.employees.find(
        (emp) => emp.employeeDetails?.employeeId === empId
      );

      if (employee?.employeeRoles.superAdmin === true) {
        isSuperAdmin = true;
      }
      if (employee?.employeeRoles.finance === true) {
        isFinance = true;
      }
    }

    const { groups } = employeeDocument;
    const getAllGroups = groups.map((group) => group.groupName);

    if (isSuperAdmin || isFinance) {
      getAllDepartments = employeeDocument.groupingLabels
        .filter((label) => label.headerName === "department")
        .flatMap((label) => label.headerValues);
    }

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
    console.log("getAllDepartments found imax", getAllDepartments);

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
      getAllDepartments,
      matchedEmployees,
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
};

//For superAdmin
const getEmployeeIdsByDepartments = async (tenantId, empId, departments) => {
  try {
    const employeeDocument = await getEmployeeDocument(tenantId, empId);

    if (!employeeDocument) {
      console.error("No document found for the given tenantId and empId.");
      return [];
    }

    const isSuperAdmin = employeeDocument.employees.some(
      (emp) =>
        emp.employeeDetails?.employeeId === empId &&
        (emp.employeeRoles?.superAdmin === true ||
          emp.employeeRoles?.finance === true)
    );

    if (!isSuperAdmin) {
      console.error("Employee is not a super admin.");
      return [];
    }

    if (!Array.isArray(departments) || departments.length === 0) {
      console.error("Departments must be a non-empty array of strings.");
      return [];
    }

    const employeeIds = employeeDocument.employees
      .filter((employee) =>
        departments.includes(employee.employeeDetails?.department)
      )
      .map((employee) => employee.employeeDetails?.employeeId);

    console.log("Filtered Employee IDs:", employeeIds);

    return employeeIds;
  } catch (error) {
    console.error(
      "Error occurred while fetching employee data:",
      error.message
    );
    return [];
  }
};

export { getEmployeeDetails, getGroupDetails, getEmployeeIdsByDepartments };
