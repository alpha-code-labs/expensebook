import HRMaster from "../models/hrMasterSchema.js";

const getPolicyDetails = async (tenantId, empId, travelType) => {
  try {
    const companyDetails = await HRMaster.findOne(
      { tenantId },
      {
        employees: { $elemMatch: { "employeeDetails.employeeId": empId } },
        policies: 1,
      }
    );

    if (!companyDetails) {
      console.log("Company details not found.");
      throw new Error("Company details not found");
    }

    const { employees, policies } = companyDetails;

    if (!employees || employees.length === 0) {
      console.log("Employee not found.");
      throw new Error("Employee not found");
    }

    const employee = employees[0];
    const employeeGroups = employee.group;

    if (!employeeGroups?.length) {
      console.log("No groups associated with the employee.");
      throw new Error("No groups associated with the employee");
    }

    const extractPolicies = (employeeGroups, travelTypes) => {
      const results = [];

      travelTypes.forEach((travelType) => {
        policies.travelPolicies.forEach((policy) => {
          for (const group in policy) {
            if (
              employeeGroups.some(
                (employeeGroup) =>
                  employeeGroup.toLowerCase() === group.toLowerCase()
              )
            ) {
              const groupPolicies = policy[group][travelType];
              if (groupPolicies) {
                results.push({
                  group,
                  travelType,
                  expenseReportDeadline:
                    groupPolicies["Expense Report Submission Deadline"],
                  allowInternationalExpenseSubmission:
                    groupPolicies[
                      "Allow International Travel Expense Submission with violations"
                    ],
                  expenseReportSubmissionDuringTravel:
                    groupPolicies[
                      "Allow expense report submission during travel"
                    ],
                });
              }
            }
          }
        });
      });

      return results;
    };

    // Get the extracted policies
    const extractedPolicies = extractPolicies(
      employeeGroups,
      Array.isArray(travelType) ? travelType : [travelType]
    );

    // If there are multiple groups, find the one with the smallest expense report deadline
    const policyByTravelType = {};

    extractedPolicies.forEach((policy) => {
      const { travelType, expenseReportDeadline } = policy;

      // Compare and keep the policy with the earliest deadline
      if (
        !policyByTravelType[travelType] ||
        expenseReportDeadline.dayLimit.days <
          policyByTravelType[travelType].expenseReportDeadline.dayLimit.days
      ) {
        policyByTravelType[travelType] = policy;
      }
    });

    return policyByTravelType;
  } catch (error) {
    console.error("Error fetching policy details:", error);
    throw error;
  }
};

export { getPolicyDetails };
