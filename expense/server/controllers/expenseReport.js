import Expense from '../models/expenseSchema.js';
import HRCompany from '../models/hrCompanySchema.js';
 
//1)get expense report details when for employee ("createdFor") transit or completed trips
const fetchExpenseReportDetails = async (req, res) => {
    const { travelRequestId, empId, tenantId } = req.params;
    try {
        const expenseDocument = await Expense.findOne({
            travelRequestId: travelRequestId,
            'embeddedTrip.embeddedTravelRequest.createdFor.empId': empId,
            'embeddedTrip.tripStatus': { $in: ['transit', 'completed'] },        
        });

        if (!expenseDocument) {
            return res.status(404).json({ message: 'Expense report not found' });
        }

      const alreadyBookedExpenseLines = expenseDocument?.embeddedTrip?.embeddedTravelRequest?.bookings || [] ;
      const expenseLines = expenseDocument?.expenseLines || [] ;
      const isCashAdvanceTaken = expenseDocument?.embeddedTrip?.embeddedTravelRequest?.isCashAdvanceTaken ||[];
      const cashAdvances = expenseDocument?.embeddedTrip?.embeddedCashAdvance?.cashAdvances || []; 

      const totalCashAdvance = calculateTotalCashAdvances(cashAdvances);
  
      const approverNames = (expenseDocument?.embeddedTrip?.embeddedTravelRequest?.approvers || []).map(approver => approver.name);

      const listOfApproverNames = approverNames.length > 0 ? approverNames.join(', ') : 'No approver names found';
        
      // Assuming getHRCompanyData retrieves necessary data in the required format
      const HRCompanyData = await getHRCompanyData(tenantId, empId);
  
      const responseData = {
        isValidTenant: HRCompanyData.orgHeaders ? true : false,
        isCashAdvanceTaken,
        totalCashAdvance,
        listOfApproverNames,
        alreadyBookedExpenseLines,
        expenseLines,
        ...HRCompanyData,
      };
  
      res.status(200).json(responseData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
const getHRCompanyData = async (tenantId) => {
    try {
      // Assuming HRCompany is accessible/imported directly
      // Find a document in HRCompany collection based on the provided tenantId
      const hrCompanyData = await HRCompany.findOne({ tenantId });
  
      // Placeholder values
      const dummyOrgHeaders = { /* dummy orgHeaders object */ };
      const dummyCompanyName = 'Company Name N/A';
      const dummyDefaultCurrency = 'Default Currency N/A';
      const dummyGroups = ['Group N/A'];
      const dummyAccountLines = ['Account Line N/A'];
      const dummyMultiCurrencyTable = ['Multi Currency Table N/A'];
  
      // Initialize extracted data with dummy values
      const extractedData = {
        orgHeaders: hrCompanyData?.orgHeaders || dummyOrgHeaders,
        companyName: hrCompanyData?.companyDetails?.companyName || dummyCompanyName,
        defaultCurrency: hrCompanyData?.companyDetails?.defaultCurrency || dummyDefaultCurrency,
        multiCurrencyTable: (hrCompanyData?.multiCurrencyTable?.exchangeValue?.length
                       ? hrCompanyData.multiCurrencyTable.exchangeValue.map(item => item.currency.shortName)
                    : []) || dummyMultiCurrencyTable,
        groups: (hrCompanyData?.groups?.length
            ? hrCompanyData.groups.map(group => ({
                groupName: group.groupName,
                filters: group.filters || [], // Ensure filters exist or use an empty array as a default
              }))
              : []) || dummyGroups,
        accountLines: hrCompanyData?.accountLines?.length ? hrCompanyData.accountLines.map(line => ({
        categoryName: line.categoryName,
        accountLine: line.accountLine,
                     })) : dummyAccountLines,
      };
      return extractedData;
    } catch (error) {
      throw new Error(`Failed to fetch HRCompany data: ${error.message}`);
    }
  };
  
  //Total cash advance with status as 'paid' for an transit trip
  const calculateTotalCashAdvances = (cashAdvances) => {
          const totalCashAdvances = { totalPaid: [], totalUnpaid: [] };
      
          cashAdvances.forEach(cashAdvance => {
              const { amountDetails, cashAdvanceStatus } = cashAdvance;
      
              if (Array.isArray(amountDetails)) {
                  amountDetails.forEach(detail => {
                      const { amount, currency } = detail;
      
                      if (cashAdvanceStatus === 'paid') {
                          let existingTotal = totalCashAdvances.totalPaid.find(item => item.currency === currency);
      
                          if (!existingTotal) {
                              existingTotal = { currency, amount: 0 };
                              totalCashAdvances.totalPaid.push(existingTotal);
                          }
      
                          existingTotal.amount += amount || 0;
                      } else {
                          let existingTotal = totalCashAdvances.totalUnpaid.find(item => item.currency === currency);
      
                          if (!existingTotal) {
                              existingTotal = { currency, amount: 0 };
                              totalCashAdvances.totalUnpaid.push(existingTotal);
                          }
      
                          existingTotal.amount += amount || 0;
                      }
                  });
              }
          });
      
          return totalCashAdvances;
      };
  
  export {
    calculateTotalCashAdvances,
    fetchExpenseReportDetails,
  };
  
//2)get Default currency
const getDefaultCurrency = async (req, res) => {
  try {
    const { tenantId, tenantName } = req.params;

    // Find the matching document in HRCompany based on tenantId and tenantName
    const companyDetails = await HRCompany.findOne({ tenantId, tenantName });

    if (!companyDetails) {
      return res.status(404).json({ message: 'Company details not found' });
    }

    // Extract and send the defaultCurrency
    const defaultCurrency = companyDetails.companyDetails.defaultCurrency;

    res.status(200).json({ defaultCurrency });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export { getDefaultCurrency };


// 3)For transit or completed trip calculate paid total cash advance amount
const totalAdvanceForTransitTrip = async (req, res) => {
    const { travelRequestId, empId } = req.params;

    try {
        const expenseDocument = await Expense.findOne({
           travelRequestId: travelRequestId,
            'embeddedTrip.embeddedTravelRequest.createdFor.empId': empId,
            'embeddedTrip.tripStatus': { $in: ['transit', 'completed'] },
        });

        if (!expenseDocument) {
            return res.status(404).json({ message: 'Expense report not found' });
        }

        const cashAdvances = expenseDocument?.embeddedTrip?.embeddedCashAdvance?.cashAdvances || []; 

        const totalCashAdvance = calculateTotalCashAdvancesForTransitTrips(cashAdvances);

        return res.status(200).json({ totalCashAdvance });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const calculateTotalCashAdvancesForTransitTrips = (cashAdvances) => {
    const totalCashAdvances = { totalPaid: [], totalUnpaid: [] };

    cashAdvances.forEach(cashAdvance => {
        const { amountDetails, cashAdvanceStatus } = cashAdvance;

        if (Array.isArray(amountDetails)) {
            amountDetails.forEach(detail => {
                const { amount, currency } = detail;

                if (cashAdvanceStatus === 'paid') {
                    let existingTotal = totalCashAdvances.totalPaid.find(item => item.currency === currency);

                    if (!existingTotal) {
                        existingTotal = { currency, amount: 0 };
                        totalCashAdvances.totalPaid.push(existingTotal);
                    }

                    existingTotal.amount += amount || 0;
                } else {
                    let existingTotal = totalCashAdvances.totalUnpaid.find(item => item.currency === currency);

                    if (!existingTotal) {
                        existingTotal = { currency, amount: 0 };
                        totalCashAdvances.totalUnpaid.push(existingTotal);
                    }

                    existingTotal.amount += amount || 0;
                }
            });
        }
    });

    return totalCashAdvances;
}; 

export {totalAdvanceForTransitTrip} ;

 // 4)T&E policy on groups and approval for a emp
 const policyOnGroupsAndApprovalForAEmp = async (req, res) => {
    const { tenantId, empId } = req.params;

    try {
        const hrDocument = await HRCompany.findOne({
            'employees.employeeDetails.employeeId': empId,
            tenantId: tenantId, 
        });


        const extractedGroups = hrDocument?.employees
            ?.find(employee => employee.employeeDetails.employeeId === empId)
            ?.group || [];

        const orgGroups = await HRCompany.findOne({
            'groups.groupName': { $in: extractedGroups.map(group => group.groupName) },
        });

        const filteredOrgGroups = orgGroups?.groups.filter(group =>
            extractedGroups.some(extractedGroup => extractedGroup.groupName === group.groupName)
        );

        const policies = filteredOrgGroups?.map(group => ({
            [group.groupName]: group.filters, 
        })) || [];

        const extractedData = {
            groups: extractedGroups,
            orgGroups: filteredOrgGroups || [],
            policies: policies,
            // T&E Policies, Approval Rules, etc.
        };

        res.status(200).json({
            message: `T&E Policies and Groups and Approval Rules for Tenant ${tenantId} and Employee ${empId}`,
            extractedData,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export {policyOnGroupsAndApprovalForAEmp} ;

//Synchronous call
//5)Currency conversion if currency among the list of accepted currencies by the company
const currencyConverter = (req, res) => {
    const { tenantId, amount, currencyName } = req.params;

    HRCompany.findOne({ tenantId })
        .then(hrDocument => {
            if (!hrDocument) {
                return res.status(404).json({ message: 'Tenant not found' });
            }

            const { multiCurrencyTable } = hrDocument;
            const { defaultCurrency, exchangeValue } = multiCurrencyTable;

            const foundDefaultCurrency = defaultCurrency.shortName.toUpperCase() === currencyName.toUpperCase();

            if (foundDefaultCurrency) {
                const currencyConverterData = {
                    companyName: hrDocument?.companyDetails?.companyName || 'Dummy Company',
                    defaultCurrency: defaultCurrency.shortName,
                    convertedCurrency: currencyName.toUpperCase(),
                    convertedAmount: amount,
                    message: 'This is your company default currency, no need to do conversion',
                };
                return res.status(200).json({ currencyConverterData });
            } else {
                const foundCurrency = exchangeValue.find(currency => currency.currency.shortName.toUpperCase() === currencyName.toUpperCase());

                if (!foundCurrency) {
                    return res.status(404).json({ message: 'This currency is not available in your multiCurrency table. Before submitting this bill, talk to your company admin to enter the multiCurrency value in the table' });
                }

                const conversionPrice = foundCurrency.value;
                const convertedAmount = amount * conversionPrice;

                const currencyConverterData = {
                    companyName: hrDocument?.companyDetails?.companyName || 'Dummy Company',
                    defaultCurrency: defaultCurrency.shortName,
                    convertedCurrency: currencyName,
                    convertedAmount,
                };

                return res.status(200).json({ currencyConverterData });
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'Internal server error' });
        });
};


 
export {currencyConverter};

//get employee details for expense report
//6)
// export const getEmployeeDetails = async (tenantId, empId) => {
//   if (!tenantId || !empId) {
//     throw new Error('Missing required parameters: tenantId and empId are required');
//   }

//   try {
//     const employeeDocument = await HRCompany.findOne({
//       'tenantId': tenantId,
//       'employees.employeeDetails.employeeId': empId,
//     }, {
//       'employees.$': 1,
//       'employeeDetails.employeeName': 1,
//       'companyDetails.companyName': 1,
//       'companyDetails.defaultCurrency': 1
//     });

//     if (!employeeDocument || !employeeDocument.employees || employeeDocument.employees.length === 0) {
//       throw new Error('Employee not found for the given IDs');
//     }

//     const employee = employeeDocument.employees[0];
//     const employeeName = employee.employeeDetails.employeeName;
//     const companyName = employeeDocument.companyDetails.companyName || '';
//     const defaultCurrency = employeeDocument.companyDetails.defaultCurrency || '';

//     return {
//       success: true,
//       employeeName,
//       companyName,
//       defaultCurrency,
//     };
//   } catch (error) {
//     throw new Error(`Failed to fetch employee details: ${error.message}`);
//   }
// };
export const getEmployeeDetails = (tenantId, empId) => {
    return new Promise((resolve, reject) => {
      if (!tenantId || !empId) {
        reject(new Error('Missing required parameters: tenantId and empId are required'));
      } else {
        HRCompany.findOne({
          'tenantId': tenantId,
          'employees.employeeDetails.employeeId': empId,
        }, {
          'employees.$': 1,
          'employeeDetails.employeeName': 1,
          'companyDetails.companyName': 1,
          'companyDetails.defaultCurrency': 1
        })
        .then((employeeDocument) => {
          if (!employeeDocument || !employeeDocument.employees || employeeDocument.employees.length === 0) {
            reject(new Error('Employee not found for the given IDs'));
          } else {
            const employee = employeeDocument.employees[0];
            const employeeName = employee.employeeDetails.employeeName;
            const companyName = employeeDocument.companyDetails.companyName || '';
            const defaultCurrency = employeeDocument.companyDetails.defaultCurrency || '';
  
            resolve({
              success: true,
              employeeName,
              companyName,
              defaultCurrency,
            });
          }
        })
        .catch((error) => {
          reject(new Error(`Failed to fetch employee details: ${error.message}`));
        });
      }
    });
  };


//6)This controller gets rejected Travel expenses report and rejected non-travel expense report.
export const getRejectedExpenses = (req, res) => {
    const { tenantId, empId, expenseHeaderID } = req.params;
  
    getEmployeeDetails(tenantId, empId)
      .then((employeeDetails) => {
        if (!employeeDetails || !employeeDetails.success) {
          return res.status(404).json({
            success: false,
            message: 'Employee not found for the given IDs',
          });
        }
  
        Expense.findOne({
          expenseHeaderID: expenseHeaderID,
          'createdBy.empId': empId,
          expenseHeaderStatus: 'rejected', // Check for rejected expenseHeaderStatus
        //   'approvers.status': 'rejected', // Check for rejected approvers
        })
          .then((expense) => {
            if (!expense) {
              return res.status(404).json({
                success: false,
                message: 'expense Report not found or unauthorized',
              });
            }
  
            const { employeeName, companyName, defaultCurrency } = employeeDetails;
  
            res.status(200).json({
              success: true,
              message: 'expense Report retrieved successfully',
              employeeName,
              companyName,
              defaultCurrency,
              expense, // Return the found expense document
              // Other data or messages as needed
            });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Failed to retrieve  expense Report' });
          });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve employee details' });
      });
  };
  
//7) Cancel at line item level or expense report level (alrEADY BOoked expenses cannot be cancelled )
export const cancelExpenseLinesOrReport = (req, res) => {
    const { tenantId, empId, expenseHeaderID } = req.params;
    const { expenseHeaderStatus, lineItemStatus } = req.body;
  
    getEmployeeDetails(tenantId, empId)
      .then((employeeDetails) => {
        if (!employeeDetails || !employeeDetails.success) {
          return res.status(404).json({
            success: false,
            message: 'Employee not found for the given IDs',
          });
        }
  
        Expense.findOneAndUpdate(
          {
            expenseHeaderID: expenseHeaderID,
            'createdBy.empId': empId,
          },
          {
            expenseHeaderStatus: expenseHeaderStatus, // Update expenseHeaderStatus from req.body
            'expenseLines.lineItemStatus': lineItemStatus, // Update lineItemStatus within expenseLines
          },
          { new: true }
        )
          .then((expense) => {
            if (!expense) {
              return res.status(404).json({
                success: false,
                message: 'Expense report not found or unauthorized',
              });
            }
  
            const { employeeName, companyName, defaultCurrency } = employeeDetails;
  
            res.status(200).json({
              success: true,
              message: 'Expense report updated successfully',
              employeeName,
              companyName,
              defaultCurrency,
              expense, // Return the updated expense document
              // Other data or messages as needed
            });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Failed to update expense report' });
          });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve employee details' });
      });
  };
  
  //THIS ONE IS NOT INclOUDed THE app for now /7.1)cancel and recover CASH Advance taKEN
  export const cancelExpenseLinesOrReportAndRecoverCashAdvance = (req, res) => {
    const { tenantId, empId, expenseHeaderID } = req.params;
    const { expenseHeaderStatus, lineItemStatus } = req.body;
  
    getEmployeeDetails(tenantId, empId)
      .then((employeeDetails) => {
        if (!employeeDetails || !employeeDetails.success) {
          return res.status(404).json({
            success: false,
            message: 'Employee not found for the given IDs',
          });
        }
  
        Expense.findOne({
          expenseHeaderID: expenseHeaderID,
          'createdBy.empId': empId,
        })
          .then((expense) => {
            if (!expense) {
              return res.status(404).json({
                success: false,
                message: 'Expense report not found or unauthorized',
              });
            }
  
            // Check conditions before allowing deletion
            if (
              expense.expenseHeaderType === 'travel' &&
              expense.embeddedTrip &&
              expense.embeddedTrip.embeddedTravelRequest &&
              expense.embeddedTrip.embeddedTravelRequest.isCashAdvanceTaken &&
              expense.expenseAmountStatus &&
              expense.expenseAmountStatus.totalCashAmount !== undefined &&
              expense.expenseAmountStatus.totalExpenseAmount !== undefined &&
              expense.expenseAmountStatus.remainingCash !== undefined
            ) {
              return res.status(400).json({
                success: false,
                message: 'Cannot delete unless the expenses are settled with finance',
              });
            }
  
            // Update expenseHeaderStatus and lineItemStatus if conditions are met
            Expense.findOneAndUpdate(
              {
                expenseHeaderID: expenseHeaderID,
                'createdBy.empId': empId,
              },
              {
                expenseHeaderStatus: expenseHeaderStatus,
                'expenseLines.lineItemStatus': lineItemStatus,
              },
              { new: true }
            )
              .then((updatedExpense) => {
                if (!updatedExpense) {
                  return res.status(404).json({
                    success: false,
                    message: 'Expense report not found or unauthorized',
                  });
                }
  
                const { employeeName, companyName, defaultCurrency } = employeeDetails;
  
                res.status(200).json({
                  success: true,
                  message: 'Expense report updated successfully',
                  employeeName,
                  companyName,
                  defaultCurrency,
                  expense: updatedExpense, // Return the updated expense document
                  // Other data or messages as needed
                });
              })
              .catch((error) => {
                console.error(error);
                res.status(500).json({ message: 'Failed to update expense report' });
              });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Failed to retrieve expense report' });
          });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve employee details' });
      });
  };
  
//8) get expense details by expenseHeaderID
export const getTravelExpenseReport = (req, res) => {
    const { tenantId, empId, expenseHeaderID } = req.params;
  
    getEmployeeDetails(tenantId, empId)
      .then((employeeDetails) => {
        if (!employeeDetails || !employeeDetails.success) {
          return res.status(404).json({
            success: false,
            message: 'Employee not found for the given IDs',
          });
        }
  
        Expense.findOne({
          tenantId: tenantId,
          expenseHeaderID: expenseHeaderID,
          expenseHeaderType: 'travel',
          'createdBy.empId': empId,
        })
          .then((expense) => {
            if (!expense) {
              return res.status(404).json({
                success: false,
                message: 'Travel expense Report not found or unauthorized',
              });
            }
  
            const { employeeName, companyName, defaultCurrency } = employeeDetails;
  
            res.status(200).json({
              success: true,
              message: 'Travel expense Report retrieved successfully',
              employeeName,
              companyName,
              defaultCurrency,
              expense, // Return the found expense document
              // Other data or messages as needed
            });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Failed to retrieve Travel expense REport' });
          });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve employee details' });
      });
  };