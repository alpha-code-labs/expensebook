import Expense from '../models/expenseSchema.js';
import HRCompany from '../models/hrCompanySchema.js';


//1)get expense catagories for an employee for non_Travel expense booking
export const getExpenseCategoriesGroupsForEmpId = (req, res) => {
    const { tenantId, empId } = req.params; // Extracting tenantId and empId from request params
  
    HRCompany.findOne({
      'tenantId': tenantId,
      'employees.employeeDetails.employeeId': empId,
    }, { 'employees.$': 1, 'expenseCategories.categoryName': 1,'employeeName': 1  })
      .then(employeeDocument => {
        if (!employeeDocument || !employeeDocument.employees || employeeDocument.employees.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Employee not found for the given IDs',
          });
        }
  
        const employee = employeeDocument.employees[0];
  
        if (!employee) {
          return res.status(200).json({
            success: true,
            message: 'Employee not found for the provided ID',
            groups: [],
          });
        }
  
        const groups = employee.group;
        const expenseCategories = employeeDocument.expenseCategories || [];
        const categoryNames = expenseCategories.map(category => category.categoryName);

        const  nonTravelExpenseAllocation = employeeDocument.nonTravelExpenseAllocation || [];
        const  allocationName = nonTravelExpenseAllocation.map(allocation => allocation.headerName);
        const employeeName = employee.employeeDetails.employeeName;
  
        return res.status(200).json({
          success: true,
          message: `These are the  nonTravelExpenseAllocation, expense categories and Groups(if selected) found for ${employeeName}`,
          groups,
          expenseCategories: categoryNames,
          nonTravelExpenseAllocation: allocationName,
        });
      })
      .catch(error => {
        console.error('Error finding expense categories:', error);
        return res.status(500).json({
          success: false,
          message: 'Internal Server Error',
          error: error.message || 'Something went wrong',
          groups: [],
          expenseCategories: [],
        });
      });
  };
  
// 2) get form details for a expense category selected and groupName too(group name comes only if selected )
// const getFormDetailsForExpenseCategory = (req, res) => {
//     const { tenantId, empId } = req.params;
//     const { expenseCategory, groupName } = req.body;
  
//     HRCompany.findOne({
//       'tenantId': tenantId,
//       'employees.employeeDetails.employeeId': empId,
//     }, { 'employees.$': 1, 'expenseCategories': 1, 'employeeName': 1, 'group': 1 })
//       .then(employeeDocument => {
//         if (!employeeDocument || !employeeDocument.employees || employeeDocument.employees.length === 0) {
//           return res.status(404).json({
//             success: false,
//             message: 'Employee not found for the given IDs',
//           });
//         }
  
//         const employee = employeeDocument.employees[0];
  
//         if (!employee) {
//           return res.status(200).json({
//             success: true,
//             message: 'Employee not found for the provided ID',
//             groups: [],
//           });
//         }
  
//         const expenseCategories = employeeDocument.expenseCategories || [];
  
//         const selectedExpenseCategory = expenseCategories.find(cat => cat.categoryName === expenseCategory);
  
//         if (!selectedExpenseCategory) {
//           return res.status(404).json({
//             success: false,
//             message: 'Expense category not found for the employee',
//           });
//         }
  
//         const { categoryName, fields } = selectedExpenseCategory;
//         const group = employee.group || [];
  
//         if (groupName && !group.includes(groupName)) {
//           return res.status(400).json({
//             success: false,
//             message: 'Selected group is invalid for the employee',
//           });
//         } else if (groupName && group.includes(groupName)) {
//           return res.status(200).json({
//             success: true,
//             message: `${empId} is part of ${groupName}`,
//             expenseCategory: categoryName,
//             fields,
//             groupName,
//           });
//         }
  
//         return res.status(200).json({
//           success: true,
//           message: 'Expense category and its fields retrieved successfully',
//           expenseCategory: categoryName,
//           fields,
//         });
//       })
//       .catch(error => {
//         console.error('Error fetching expense category details:', error);
//         return res.status(500).json({
//           success: false,
//           message: 'Internal Server Error',
//           error: error.message || 'Something went wrong',
//         });
//       });
//   };
export const getFormDetailsForExpenseCategory = (req, res) => {
    const { tenantId, empId } = req.params;
    const { expenseCategory, groupName } = req.body;
  
    HRCompany.findOne({
      'tenantId': tenantId,
      'employees.employeeDetails.employeeId': empId,
    }, {
      'employees.$': 1,
      'expenseCategories': 1,
      'employeeName': 1,
      'orgHeaders': 1,
      'companyDetails.defaultCurrency': 1,
      'expenseSettlementOptions': 1,
      'nonTravelExpenseAllocation':1,
    })
      .then(employeeDocument => {
        if (!employeeDocument || !employeeDocument.employees || employeeDocument.employees.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Employee not found for the given IDs',
          });
        }
  
        const employee = employeeDocument.employees[0];
  
        if (!employee) {
          return res.status(200).json({
            success: true,
            message: 'Employee not found for the provided ID',
            groups: [],
          });
        }
  
        const expenseCategories = employeeDocument.expenseCategories || [];
  
        const selectedExpenseCategory = expenseCategories.find(cat => cat.categoryName === expenseCategory);
  
        if (!selectedExpenseCategory) {
          return res.status(404).json({
            success: false,
            message: 'Expense category not found for the employee',
          });
        }
  
        const { categoryName, fields } = selectedExpenseCategory;
        const orgHeaders = employeeDocument.orgHeaders || [];
        const defaultCurrency = employeeDocument.companyDetails.defaultCurrency || '';
        const expenseSettlementOptions = employeeDocument.expenseSettlementOptions || [];
        const nonTravelExpenseAllocation = employeeDocument.nonTravelExpenseAllocation || [];
        const group = employee.group || [];

  
        if (groupName && !group.includes(groupName)) {
          return res.status(400).json({
            success: false,
            message: 'Selected group is invalid for the employee',
          });
        } else if (groupName && group.includes(groupName)) {
          return res.status(200).json({
            success: true,
            message: `${empId} is part of ${groupName}`,
            expenseCategory: categoryName,
            fields,
            groupName,
            orgHeaders,
            defaultCurrency,
            expenseSettlementOptions,
            nonTravelExpenseAllocation,
          });
        }
  
        return res.status(200).json({
          success: true,
          message: 'Expense category and its fields retrieved successfully',
          expenseCategory: categoryName,
          fields,
          orgHeaders,
          defaultCurrency,
          expenseSettlementOptions,
        });
      })
      .catch(error => {
        console.error('Error fetching expense category details:', error);
        return res.status(500).json({
          success: false,
          message: 'Internal Server Error',
          error: error.message || 'Something went wrong',
        });
      });
  };
  
//3) non travel policy for an expenseCategory for a employee 
//(if group is selected then group policy or else 'company wide' policy sent) 
export const nonTravelPolicyValidation = (req, res) => {
    const { tenantId, empId } = req.params;
    let { expenseCategory, groupName } = req.body;

    // Set default groupName to 'company wide' if not provided in req.body
    if (!groupName) {
        groupName = 'company wide';
    }

    HRCompany.findOne({
        'tenantId': tenantId,
        'employees.employeeDetails.employeeId': empId,
    }, {
        'flags.isTravelPolicySetup': 1,
        'policies': 1,
        'nonTravelExpenseAllocation': 1, // Fetching nonTravelExpenseAllocation
    })
        .then(companyDocument => {
            if (!companyDocument || !companyDocument.flags || companyDocument.flags.isTravelPolicySetup !== true) {
                return res.status(200).json({
                    success: false,
                    message: 'Policy validation is not set up for the company',
                });
            }

            const policies = companyDocument.policies || [];
            const policy = policies.find(policy => policy[groupName]?.nonTravel?.[expenseCategory]);

            if (!policy) {
                return res.status(400).json({
                    success: false,
                    message: 'Policy not found for the provided expense category and group',
                });
            }

            // Extracting expense category details from the policy
            const expenseCategoryDetails = policy[groupName].nonTravel[expenseCategory];

            const nonTravelExpenseAllocation = companyDocument.nonTravelExpenseAllocation || [];
            const nonTravelExpenseAllocationArray = {};

            // Extracting headerNames and headerValues from nonTravelExpenseAllocation
            nonTravelExpenseAllocation.forEach(item => {
                nonTravelExpenseAllocationArray[item.headerName] = item.headerValues;
            });

            return res.status(200).json({
                success: true,
                message: 'Policy validation successful',
                expenseCategoryDetails,
                nonTravelExpenseAllocationArray, 
            });
        })
        .catch(error => {
            console.error('Error during policy validation:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error: error.message || 'Something went wrong',
            });
        });
};

//4)currency conversion 
export const currencyConverter = (req, res) => {
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
//asyc call for currencyConverter
// const currencyConverter = async (req, res) => {
//     try {
//         const { tenantId, amount, currencyName } = req.params;

//         const hrDocument = await HRCompany.findOne({ tenantId });

//         if (!hrDocument) {
//             return res.status(404).json({ message: 'Tenant not found' });
//         }

//         const { multiCurrencyTable } = hrDocument;
//         const { defaultCurrency, exchangeValue } = multiCurrencyTable;

//         const foundDefaultCurrency = defaultCurrency.shortName.toUpperCase() === currencyName.toUpperCase();

//         if (foundDefaultCurrency) {
//             const currencyConverterData = {
//                 companyName: hrDocument?.companyDetails?.companyName || 'Dummy Company',
//                 defaultCurrency: defaultCurrency.shortName,
//                 convertedCurrency: currencyName.toUpperCase(),
//                 convertedAmount: amount,
//                 message: 'This is your company default currency, no need to do conversion',
//             };
//             return res.status(200).json({ currencyConverterData });
//         }

//         const foundCurrency = exchangeValue.find(currency => currency.currency.shortName.toUpperCase() === currencyName.toUpperCase());

//         if (!foundCurrency) {
//             return res.status(404).json({ message: 'This currency is not available in your multiCurrency table. Before submitting this bill, talk to your company admin to enter the multiCurrency value in the table' });
//         }

//         const conversionPrice = foundCurrency.value;
//         const convertedAmount = amount * conversionPrice;

//         const currencyConverterData = {
//             companyName: hrDocument?.companyDetails?.companyName || 'Dummy Company',
//             defaultCurrency: defaultCurrency.shortName,
//             convertedCurrency: currencyName,
//             convertedAmount,
//         };

//         return res.status(200).json({ currencyConverterData });
//     } catch (error) {
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };
//5)
// getEmployeeDetails.js 111
// const getEmployeeDetails = async (tenantId, empId) => {
//   try {
//     if (!tenantId || !empId) {
//       throw new Error('Missing required parameters: tenantId and empId are required');
//     }

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
//       employeeName: employeeName,
//       companyName: companyName,
//       defaultCurrency: defaultCurrency,
//     };
//   } catch (error) {
//     throw new Error(`Failed to fetch employee details: ${error.message}`);
//   }
// };



// export {getEmployeeDetails} ;

// //5)saveNonTravelExpenseLine 
// const saveNonTravelExpenseLine = async (req, res) => {
//   try {
//     const { tenantId, empId } = req.params;
    
//     const employeeDetails = await getEmployeeDetails(tenantId, empId);
//     if (!employeeDetails || !employeeDetails.success) {
//       return res.status(404).json({
//         success: false,
//         message: 'Employee not found for the given IDs',
//       });
//     }

//     const { employeeName, companyName, defaultCurrency } = employeeDetails;

//     const {
//       expenseHeaderID,
//       transactionData,
//       lineItemStatus,
//       expenseLineAllocation,
//       expenseLineCategory,
//       modeOfPayment,
//       billImageUrl,
//       billRejectionReason,
//     } = req.body;

//     let expense;

//     if (!expenseHeaderID) {
//       const newExpense = new Expense({
//         tenantId: tenantId,
//         tenantName: companyName,
//         companyName: companyName,
//         createdBy: {
//           empId: empId,
//           name: employeeName,
//         },
//         // expenseSubmissionDate: new Date(),
//         expenseLines: [
//           {
//             transactionData: {
//               businessPurpose: transactionData.businessPurpose,
//               vendorName: transactionData.vendorName,
//               billNumber: transactionData.billNumber,
//               billDate: transactionData.billDate,
//               grossAmount: transactionData.grossAmount,
//               taxes: transactionData.taxes,
//               totalAmount: transactionData.totalAmount,
//               description: transactionData.description,
//             },
//             lineItemStatus: lineItemStatus,
//             expenseLineAllocation: expenseLineAllocation,
//             expenseLineCategory: expenseLineCategory,
//             modeOfPayment: modeOfPayment,
//             billImageUrl: billImageUrl,
//             billRejectionReason: billRejectionReason,
//           },
//         ],
//       });

//       newExpense.expenseHeaderType = 'non travel';
//       await newExpense.save();
      
//       return res.status(201).json({ message: 'New Non travel expense LINE created successfully' });
//     } else {
//       expense = await Expense.findOneAndUpdate(
//         { _id: expenseHeaderID, 'createdBy.empId': empId },
//         {
//           $push: {
//             expenseLines: {
//               transactionData: {
//                 businessPurpose: transactionData.businessPurpose,
//                 vendorName: transactionData.vendorName,
//                 billNumber: transactionData.billNumber,
//                 billDate: transactionData.billDate,
//                 grossAmount: transactionData.grossAmount,
//                 taxes: transactionData.taxes,
//                 totalAmount: transactionData.totalAmount,
//                 description: transactionData.description,
//               },
//               lineItemStatus: lineItemStatus,
//               expenseLineAllocation: expenseLineAllocation,
//               expenseLineCategory: expenseLineCategory,
//               modeOfPayment: modeOfPayment,
//               billImageUrl: billImageUrl,
//               billRejectionReason: billRejectionReason,
//             },
//           },
//         },
//         { new: true }
//       );
//       if (!expense) {
//         return res.status(404).json({ message: 'Non travel expense LINE- not found or unauthorized' });
//       }

//       return res.status(200).json({
//         success: true,
//         message: 'Non travel expense LINE  updated successfully',
//         employeeName,
//         companyName,
//         defaultCurrency,
//   // Other data or messages as need
// });
// }
// } catch (error) {
// console.error(error);
// res.status(500).json({ message: 'Failed to save/update Non travel expense LINE' });
// }
// };

/**
 * Retrieves employee details based on tenant ID and employee ID.
 * @param {string} tenantId - The tenant ID.
 * @param {string} empId - The employee ID.
 * @returns {Promise<Object>} - Object containing employee details.
 */
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

5
/**
 * //5th one - Saves a non_Travel expense line.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
//Asynchronous call
// export const saveNonTravelExpenseLine = async (req, res) => {
//   try {
//     const { tenantId, empId } = req.params;

//     const employeeDetails = await getEmployeeDetails(tenantId, empId);
//     if (!employeeDetails || !employeeDetails.success) {
//       return res.status(404).json({
//         success: false,
//         message: 'Employee not found for the given IDs',
//       });
//     }

//     const { employeeName, companyName, defaultCurrency } = employeeDetails;

//     const {
//       expenseHeaderID,
//       transactionData,
//       lineItemStatus,
//       expenseLineAllocation,
//       expenseLineCategory,
//       modeOfPayment,
//       billImageUrl,
//       billRejectionReason,
//     } = req.body;

//     let expense;

//     const expenseLineData = {
//       transactionData: {
//         businessPurpose: transactionData.businessPurpose,
//         vendorName: transactionData.vendorName,
//         billNumber: transactionData.billNumber,
//         billDate: transactionData.billDate,
//         grossAmount: transactionData.grossAmount,
//         taxes: transactionData.taxes,
//         totalAmount: transactionData.totalAmount,
//         description: transactionData.description,
//       },
//       lineItemStatus,
//       expenseLineAllocation,
//       expenseLineCategory,
//       modeOfPayment,
//       billImageUrl,
//       billRejectionReason,
//     };

//     if (!expenseHeaderID) {
//       const newExpense = new Expense({
//         tenantId,
//         tenantName: companyName,
//         companyName,
//         createdBy: {
//           empId,
//           name: employeeName,
//         },
//         expenseHeaderType: 'non_Travel',
//         expenseLines: [expenseLineData],
//       });

//       await newExpense.save();
//       return res.status(201).json({ message: 'New non_Travel expense LINE created successfully' });
//     } else {
//       expense = await Expense.findOneAndUpdate(
//         { expenseHeaderID: expenseHeaderID, 'createdBy.empId': empId },
//         { $push: { expenseLines: expenseLineData } },
//         { new: true }
//       );

//       if (!expense) {
//         return res.status(404).json({ message: 'non_Travel expense LINE not found or unauthorized' });
//       }

//       return res.status(200).json({
//         success: true,
//         message: 'non_Travel expense LINE updated successfully',
//         employeeName,
//         companyName,
//         defaultCurrency,
//         // Other data or messages as needed
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to save/update non_Travel expense LINE' });
//   }
// };

//synchronous call
//
export const saveNonTravelExpenseLine = (req, res) => { //SYNCHRonous call
  const { tenantId, empId } = req.params;

  getEmployeeDetails(tenantId, empId)
    .then((employeeDetails) => {
      if (!employeeDetails || !employeeDetails.success) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found for the given IDs',
        });
      }

      const { employeeName, companyName, defaultCurrency } = employeeDetails;

      const {
        expenseHeaderID,
        transactionData,
        expenseLineAllocation,
        expenseLineCategory,
        modeOfPayment,
        billImageUrl,
        billRejectionReason,
      } = req.body;

      let expense;

      const expenseLineData = {
        transactionData: {
          businessPurpose: transactionData.businessPurpose,
          vendorName: transactionData.vendorName,
          billNumber: transactionData.billNumber,
          billDate: transactionData.billDate,
          grossAmount: transactionData.grossAmount,
          taxes: transactionData.taxes,
          totalAmount: transactionData.totalAmount,
          description: transactionData.description,
        },
        lineItemStatus: 'save',
        expenseLineAllocation,
        expenseLineCategory,
        modeOfPayment,
        billImageUrl,
        billRejectionReason,
      };

      if (!expenseHeaderID) {
        const newExpense = new Expense({
          tenantId,
          tenantName: companyName,
          companyName,
          createdBy: {
            empId,
            name: employeeName,
          },
          expenseHeaderType: 'non_Travel',
          expenseLines: [expenseLineData],
        });

        newExpense.save()
          .then(() => {
            res.status(201).json({ message: 'New non_Travel expense LINE created successfully' });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Failed to save non_Travel expense LINE' });
          });
      } else {
        Expense.findOneAndUpdate(
          { expenseHeaderID: expenseHeaderID, 'createdBy.empId': empId },
          { $push: { expenseLines: expenseLineData } },
          { new: true }
        )
          .then((updatedExpense) => {
            if (!updatedExpense) {
              return res.status(404).json({ message: 'non_Travel expense LINE not found or unauthorized' });
            }

            res.status(200).json({
              success: true,
              message: 'non_Travel expense LINE updated successfully',
              employeeName,
              companyName,
              defaultCurrency,
              // Other data or messages as needed
            });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Failed to update non_Travel expense LINE' });
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve employee details' });
    });
};

//6) STATUS as draft for NON TRAVEL EXPENSE LInE 
export const draftNonTravelExpenseLine = (req, res) => { //SYNCHRonous call
  const { tenantId, empId } = req.params;

  getEmployeeDetails(tenantId, empId)
    .then((employeeDetails) => {
      if (!employeeDetails || !employeeDetails.success) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found for the given IDs',
        });
      }

      const { employeeName, companyName, defaultCurrency } = employeeDetails;

      const {
        expenseHeaderID,
        transactionData,
        expenseLineAllocation,
        expenseLineCategory,
        modeOfPayment,
        billImageUrl,
        billRejectionReason,
      } = req.body;

      let expense;

      const expenseLineData = {
        transactionData: {
          businessPurpose: transactionData.businessPurpose,
          vendorName: transactionData.vendorName,
          billNumber: transactionData.billNumber,
          billDate: transactionData.billDate,
          grossAmount: transactionData.grossAmount,
          taxes: transactionData.taxes,
          totalAmount: transactionData.totalAmount,
          description: transactionData.description,
        },
        lineItemStatus: 'draft',
        isPersonalExpense: lineItemData.isPersonalExpense || false,
        expenseLineAllocation,
        expenseLineCategory,
        modeOfPayment,
        billImageUrl,
        billRejectionReason,
        personalExpenseAmount: lineItemData.isPersonalExpense ? (lineItemData.personalExpenseAmount || 0) : undefined,
      };

      if (!expenseHeaderID) {
        const newExpense = new Expense({
          tenantId,
          tenantName: companyName,
          companyName,
          createdBy: {
            empId,
            name: employeeName,
          },
          expenseHeaderType: 'non_Travel',
          expenseLines: [expenseLineData],
        });

        newExpense.save()
          .then(() => {
            res.status(201).json({ message: 'New non_Travel expense LINE created successfully' });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Failed to save non_Travel expense LINE' });
          });
      } else {
        Expense.findOneAndUpdate(
          { expenseHeaderID: expenseHeaderID, 'createdBy.empId': empId },
          { $push: { expenseLines: expenseLineData } },
          { new: true }
        )
          .then((updatedExpense) => {
            if (!updatedExpense) {
              return res.status(404).json({ message: 'non_Travel expense LINE not found or unauthorized' });
            }

            res.status(200).json({
              success: true,
              message: 'non_Travel expense LINE updated with status -DRAFT successfully',
              employeeName,
              companyName,
              defaultCurrency,
              // Other data or messages as needed
            });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Failed to update non_Travel expense LINE WITH STATUS DRAFT' });
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve employee details to update with status as draft' });
    });
};


// 7) Submit non travel expenses
export const submitNonTravelExpenseLine = (req, res) => {
  const { tenantId, empId } = req.params;

  getEmployeeDetails(tenantId, empId)
    .then((employeeDetails) => {
      if (!employeeDetails || !employeeDetails.success) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found for the given IDs',
        });
      }

      const { employeeName, companyName, defaultCurrency } = employeeDetails;

      const {
        expenseHeaderID,
        expenseLines,
        expenseLineAllocation,
        expenseLineCategory,
        modeOfPayment,
        billImageUrl,
        billRejectionReason,
      } = req.body;

      if (!expenseLines || !Array.isArray(expenseLines)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing expense lines in the request',
        });
      }

      // Check lineItemStatus of all expenseLineData
      const allLineItemStatusSave = expenseLines.every(line => line.lineItemStatus === 'save');

      if (!allLineItemStatusSave) {
        return res.status(400).json({
          success: false,
          message: 'One or more expense lines have an invalid status',
        });
      }

      if (!expenseHeaderID) {
        const newExpense = new Expense({
          tenantId,
          tenantName: companyName,
          companyName,
          createdBy: {
            empId,
            name: employeeName,
          },
          expenseHeaderType: 'non_Travel',
          expenseLines: expenseLines,
          expenseHeaderStatus: 'pending settlement', // Update expenseStatus
          expenseSubmissionDate: new Date(), // Update expenseSubmissionDate
          expenseLineAllocation,
          expenseLineCategory,
          modeOfPayment,
          billImageUrl,
          billRejectionReason,
        });

        newExpense.save()
          .then(() => {
            res.status(201).json({ message: 'New non_Travel expense LINE Submitted successfully and expense status UPDATED AS "pending settlement"' });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Failed to Submit non_Travel expense LINE' });
          });
      } else {
        Expense.findOneAndUpdate(
          { expenseHeaderID: expenseHeaderID, 'createdBy.empId': empId },
          { 
            $push: { expenseLines: { $each: expenseLines } },
            expenseHeaderStatus: 'pending settlement', // Update expenseStatus
            expenseSubmissionDate: new Date(), // Update expenseSubmissionDate
            expenseLineAllocation,
            expenseLineCategory,
            modeOfPayment,
            billImageUrl,
            billRejectionReason,
          },
          { new: true }
        )
          .then((updatedExpense) => {
            if (!updatedExpense) {
              return res.status(404).json({ message: 'non_Travel expense LINE not found or unauthorized' });
            }

            res.status(200).json({
              success: true,
              message: 'non_Travel expense LINE updated successfully',
              employeeName,
              companyName,
              defaultCurrency,
              // Other data or messages as needed
            });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Failed to update non_Travel expense LINE' });
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve employee details' });
    });
};

//8) get expense details by expenseHeaderID
export const getNonTravelExpenses = (req, res) => {
  const { tenantId, empId, expenseHeaderId } = req.params;

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
        expenseHeaderID: expenseHeaderId,
        'createdBy.empId': empId,
      })
        .then((expense) => {
          if (!expense) {
            return res.status(404).json({
              success: false,
              message: 'Non_Travel expense LINE not found or unauthorized',
            });
          }

          const { employeeName, companyName, defaultCurrency } = employeeDetails;

          res.status(200).json({
            success: true,
            message: 'Non_Travel expense LINE retrieved successfully',
            employeeName,
            companyName,
            defaultCurrency,
            expense, // Return the found expense document
            // Other data or messages as needed
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ message: 'Failed to retrieve non_Travel expense LINE' });
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve employee details' });
    });
};

// 9) Expense line is deleted from expense report /synchronous call
export const deleteExpenseLineItem = (req, res) => {
  try {
    const { tenantId, empId, expenseHeaderId, _id } = req.params;

    const filter = {
      tenantId,
      expenseHeaderType: 'non_Travel',
      expenseHeaderID: expenseHeaderId,
      'createdBy.empId': empId,
    };

    Expense.findOne(filter)
      .then((expense) => {
        if (!expense) {
          return res.status(404).json({ message: 'Expense not found for the provided criteria.' });
        }

        const updatedExpenseLines = expense.expenseLines.filter(line => String(line._id) !== _id);

        if (updatedExpenseLines.length === expense.expenseLines.length) {
          return res.status(404).json({ message: 'Expense line item not found within the expenseLines array.' });
        }

        expense.expenseLines = updatedExpenseLines;
        return expense.save();
      })
      .then((updatedExpense) => {
        return res.status(200).json({
          success: true,
          message: 'Expense line item deleted successfully',
          updatedExpense,
        });
      })
      .catch((error) => {
        console.error('Error while deleting expense line item:', error);
        return res.status(500).json({ message: 'Failed to delete expense line item' });
      });
  } catch (error) {
    console.error('Error while deleting expense line item:', error);
    return res.status(500).json({ message: 'Failed to delete expense line item' });
  }
};




// 10) Delete ENTIRE NON-TRAVEL EXPENSE REPORT
export const deleteNonTravelExpenseReport = async (req, res) => {
  try {
    const { tenantId, empId, expenseHeaderId } = req.params;

    // console.log('Deleting Non-Travel Expense Report:');
    // console.log('tenantId:', tenantId);
    // console.log('empId:', empId);
    // console.log('expenseHeaderId:', expenseHeaderId);

    const deletedExpense = await Expense.findOneAndDelete({
      'tenantId': tenantId,
      'expenseHeaderType': 'non_Travel',
      'expenseHeaderID': expenseHeaderId,
      'createdBy.empId': empId,
    });

    if (!deletedExpense) {
      console.log('Non-Travel expense report not found or unauthorized');
      return res.status(404).json({ message: 'Non-Travel expense report not found or unauthorized' });
    }

    console.log('Non-travel expense report deleted successfully:', expenseHeaderId);
    return res.status(200).json({
      success: true,
      message: `Non-travel expense report deleted successfully ${expenseHeaderId}`,
    });
  } catch (error) {
    console.error('Error while deleting non-travel expense report:', error);
    return res.status(500).json({ message: 'Failed to delete non-travel expense report' });
  }
};
  

  
  

















