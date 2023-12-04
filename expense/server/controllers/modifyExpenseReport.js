import Expense from '../models/expenseSchema.js';

//function to calculate total amoUNT
const calculateTotalCashAmount = expense => {
    let totalCashAmount = 0;
    const cashAdvances = expense.embeddedTrip.embeddedCashAdvance.cashAdvances || [];
  
    cashAdvances.forEach(cashAdvance => {
      // Filter for 'paid' cash advances only
      if (cashAdvance.cashAdvanceStatus === 'paid') {
        const amountDetails = cashAdvance.amountDetails || [];
        amountDetails.forEach(details => {
          totalCashAmount += details.amount || 0;
        });
      }
    });
  
    return totalCashAmount;
  };  

const calculateTotalExpenseAmount = expense => {
  let totalExpenseAmount = 0;
  const expenseLines = expense.expenseLines || [];

  expenseLines.forEach(line => {
    totalExpenseAmount += line.transactionData.totalAmount || 0;
    if (line.isPersonalExpense === true) {
      totalExpenseAmount -= line.personalExpenseAmount || 0;
    }
  });

  return totalExpenseAmount;
};

const calculateRemainingCash = (totalCashAmount, totalExpenseAmount) => {
  return totalCashAmount - totalExpenseAmount;
};

const updateExpenseWithAmountStatus = async (expense, totalCashAmount, totalExpenseAmount, remainingCash) => {
    try {
      if (!expense || !expense.embeddedTrip || !expense.embeddedTrip.userId) {
        throw new Error('Invalid expense structure: Unable to access necessary properties.');
      }
     
       
      expense.expenseAmountStatus = {
        totalCashAmount,
        totalExpenseAmount,
        remainingCash,
      };
  
      // Ensure that the necessary nested properties exist before setting 'createdBy' 
      if (expense.embeddedTrip?.embeddedTravelRequest?.createdBy.empId) {
        expense.createdBy = {
          empId: expense.embeddedTrip?.embeddedTravelRequest?.createdBy?.empId,
          name: expense.embeddedTrip?.embeddedTravelRequest?.createdBy?.name, 
        };
      } else {
        throw new Error('Missing/wrong empId within embeddedTrip.createdBy.');
      }
  
      const savedExpense = await expense.save();
  
      console.log('Expense updated successfully:', savedExpense);
  
      return savedExpense;
    } catch (error) {
      console.error('Error occurred while updating expense:', error);
      throw new Error('An error occurred while updating expense with expense amount status.');
    }
  };
  
  
// 1) On save , Expense line items, cash advance, already booked expenses updated with this controller
export const onSaveLineItem = async (req, res) => {
  try {
    const { tenantId, expenseHeaderID, empId } = req.params;
    const { expenseLines } = req.body;

    const expense = await Expense.findOne({
      'tenantId': tenantId,
      'expenseHeaderID': expenseHeaderID,
      $or: [
        { 'embeddedTrip.embeddedTravelRequest.createdBy.empId': empId },
        { 'embeddedTrip.embeddedTravelRequest.createdFor.empId': empId }
      ]
    });

    if (!expense) {
      console.log('Expense not found for the provided criteria.');
      return res.status(404).json({ error: 'Expense not found for the provided criteria.' });
    }

    // Check if empId exists in createdBy.empId or createdFor.empId
    const createdByEmpId = expense.embeddedTrip?.embeddedTravelRequest?.createdBy?.empId;
    const createdForEmpId = expense.embeddedTrip?.embeddedTravelRequest?.createdFor?.empId;
    const createdByEmpName = expense.embeddedTrip?.embeddedTravelRequest?.createdBy?.name;
    const createdForEmpName = expense.embeddedTrip?.embeddedTravelRequest?.createdFor?.name;

    if (createdByEmpId === empId) {
      expense.createdBy = {
        empId: createdByEmpId,
        name: createdByEmpName, // Assigning name from createdFor when matching createdByEmpId
      };
    } else if (createdForEmpId === empId) {
      expense.createdBy = {
        empId: createdForEmpId,
        name: createdForEmpName, // Assigning name from createdFor when matching createdForEmpId
      };
    }
  
  
      expenseLines.forEach((lineItemData) => {
        const existingExpenseLineIndex = expense.expenseLines.findIndex(
          (expenseLine) =>
            expenseLine.transactionData.billNumber === lineItemData.billNumber &&
            expenseLine.transactionData.totalAmount === lineItemData.totalAmount
        );
  
        if (existingExpenseLineIndex !== -1) {
          // Update existing expense line
          tenantId:tenantId,
          expense.expenseLines[existingExpenseLineIndex] = {
            transactionData: {
              businessPurpose: lineItemData.businessPurpose || '',
              vendorName: lineItemData.vendorName || '',
              billNumber: lineItemData.billNumber || '',
              billDate: lineItemData.billDate || '',
              grossAmount: lineItemData.grossAmount || 0,
              taxes: lineItemData.taxes || 0,
              totalAmount: lineItemData.totalAmount || 0,
              description: lineItemData.description || '',
            },
            expenseType: lineItemData.expenseType || '',
            lineItemStatus:'save',
            billRejectionReason: lineItemData.billRejectionReason || '',
            isPersonalExpense: lineItemData.isPersonalExpense || false,
            modeOfPayment: lineItemData.modeOfPayment || '',
            billImageUrl: lineItemData.billImageUrl || '',
            personalExpenseAmount: lineItemData.isPersonalExpense ? (lineItemData.personalExpenseAmount || 0) : undefined,
          };
          if (lineItemData.isPersonalExpense === true) {
            const totalAmount = lineItemData.totalAmount || 0;
            lineItemData.personalExpenseAmount = Math.min(lineItemData.personalExpenseAmount || 0, totalAmount);
  
            // Validate personalExpenseAmount against totalAmount
            if (lineItemData.personalExpenseAmount > totalAmount) {
              return res.status(400).json({ error: 'Personal expense amount cannot be more than total amount of the bill.' });
            }
          }
        } else {
          // Create new expense line
          const newExpenseLine = {
            tenantId:tenantId,
            transactionData: {
              businessPurpose: lineItemData.businessPurpose || '',
              vendorName: lineItemData.vendorName || '',
              billNumber: lineItemData.billNumber || '',
              billDate: lineItemData.billDate || '',
              grossAmount: lineItemData.grossAmount || 0,
              taxes: lineItemData.taxes || 0,
              totalAmount: lineItemData.totalAmount || 0,
              description: lineItemData.description || '',
            },
            expenseType: lineItemData.expenseType || '',
            lineItemStatus:'save',
            billRejectionReason: lineItemData.billRejectionReason || '',
            isPersonalExpense: lineItemData.isPersonalExpense || false,
            modeOfPayment: lineItemData.modeOfPayment || '',
            billImageUrl: lineItemData.billImageUrl || '',
            personalExpenseAmount: lineItemData.isPersonalExpense ? (lineItemData.personalExpenseAmount || 0) : undefined,
          };
          if (lineItemData.isPersonalExpense === true) {
            const totalAmount = lineItemData.totalAmount || 0;
            lineItemData.personalExpenseAmount = Math.min(lineItemData.personalExpenseAmount || 0, totalAmount);
  
            // Validate personalExpenseAmount against totalAmount
            if (lineItemData.personalExpenseAmount > totalAmount) {
              return res.status(400).json({ error: 'Personal expense amount cannot be more than total amount of the bill.' });
            }
          }
          expense.expenseLines.push(newExpenseLine);
        }
      }); 
// Save the updated expense lines first
  await expense.save();

//when ever any change in bookings(embedded Travel request) happen it is automatically reflected in alreadyBookedExpenseLines(expenses)
expense.alreadyBookedExpenseLines = expense.embeddedTrip.embeddedTravelRequest.bookings.map((booking) => ({ ...booking }));

  // Recalculate total amounts using the updated expense lines
  const totalCashAmount = calculateTotalCashAmount(expense);
  const totalExpenseAmount = calculateTotalExpenseAmount(expense);
  const remainingCash = calculateRemainingCash(totalCashAmount, totalExpenseAmount);

  // Update expense with the recalculated amounts
  const updatedExpense = await updateExpenseWithAmountStatus(expense, totalCashAmount, totalExpenseAmount, remainingCash);

  console.log('Expense line items saved successfully.');
  return res.status(200).json({ message: 'Expense line items updated successfully.',
  tenantId:tenantId,
    totalCashAmount,
    totalExpenseAmount,
    remainingCash
  });
} catch (error) {
  console.error('An error occurred while saving the expense line items:', error);
  return res.status(500).json({ error: 'An error occurred while saving the expense line items.' });
}
};

// 2) On Draft,Expense line items, cash advance, already booked expenses updated with this controller
export const onDraftLineItem = async (req, res) => {
    try {
      const { tenantId, expenseHeaderID, empId } = req.params;
      const { expenseLines } = req.body;
  
      const expense = await Expense.findOne({
        'tenantId': tenantId,
        'expenseHeaderID': expenseHeaderID,
        $or: [
          { 'embeddedTrip.embeddedTravelRequest.createdBy.empId': empId },
          { 'embeddedTrip.embeddedTravelRequest.createdFor.empId': empId }
        ]
      });
  
      if (!expense) {
        console.log('Expense not found for the provided criteria.');
        return res.status(404).json({ error: 'Expense not found for the provided criteria.' });
      }
  
      // Check if empId exists in createdBy.empId or createdFor.empId
      const createdByEmpId = expense.embeddedTrip?.embeddedTravelRequest?.createdBy?.empId;
      const createdForEmpId = expense.embeddedTrip?.embeddedTravelRequest?.createdFor?.empId;
      const createdByEmpName = expense.embeddedTrip?.embeddedTravelRequest?.createdBy?.name;
      const createdForEmpName = expense.embeddedTrip?.embeddedTravelRequest?.createdFor?.name;
  
      if (createdByEmpId === empId) {
        expense.createdBy = {
          empId: createdByEmpId,
          name: createdByEmpName, // Assigning name from createdFor when matching createdByEmpId
        };
      } else if (createdForEmpId === empId) {
        expense.createdBy = {
          empId: createdForEmpId,
          name: createdForEmpName, // Assigning name from createdFor when matching createdForEmpId
        };
      }
    
    
        expenseLines.forEach((lineItemData) => {
          const existingExpenseLineIndex = expense.expenseLines.findIndex(
            (expenseLine) =>
              expenseLine.transactionData.billNumber === lineItemData.billNumber &&
              expenseLine.transactionData.totalAmount === lineItemData.totalAmount
          );
    
          if (existingExpenseLineIndex !== -1) {
            // Update existing expense line
            tenantId:tenantId,
            expense.expenseLines[existingExpenseLineIndex] = {
              transactionData: {
                businessPurpose: lineItemData.businessPurpose || '',
                vendorName: lineItemData.vendorName || '',
                billNumber: lineItemData.billNumber || '',
                billDate: lineItemData.billDate || '',
                grossAmount: lineItemData.grossAmount || 0,
                taxes: lineItemData.taxes || 0,
                totalAmount: lineItemData.totalAmount || 0,
                description: lineItemData.description || '',
              },
              expenseType: lineItemData.expenseType || '',
              lineItemStatus:'draft' || 'draft',
              billRejectionReason: lineItemData.billRejectionReason || '',
              isPersonalExpense: lineItemData.isPersonalExpense || false,
              modeOfPayment: lineItemData.modeOfPayment || '',
              billImageUrl: lineItemData.billImageUrl || '',
              personalExpenseAmount: lineItemData.isPersonalExpense ? (lineItemData.personalExpenseAmount || 0) : undefined,
            };
            if (lineItemData.isPersonalExpense === true) {
              const totalAmount = lineItemData.totalAmount || 0;
              lineItemData.personalExpenseAmount = Math.min(lineItemData.personalExpenseAmount || 0, totalAmount);
    
              // Validate personalExpenseAmount against totalAmount
              if (lineItemData.personalExpenseAmount > totalAmount) {
                return res.status(400).json({ error: 'Personal expense amount cannot be more than total amount of the bill.' });
              }
            }
          } else {
            // Create new expense line
            const newExpenseLine = {
              tenantId:tenantId,
              transactionData: {
                businessPurpose: lineItemData.businessPurpose || '',
                vendorName: lineItemData.vendorName || '',
                billNumber: lineItemData.billNumber || '',
                billDate: lineItemData.billDate || '',
                grossAmount: lineItemData.grossAmount || 0,
                taxes: lineItemData.taxes || 0,
                totalAmount: lineItemData.totalAmount || 0,
                description: lineItemData.description || '',
              },
              expenseType: lineItemData.expenseType || '',
              lineItemStatus:'draft' || 'draft',
              billRejectionReason: lineItemData.billRejectionReason || '',
              isPersonalExpense: lineItemData.isPersonalExpense || false,
              modeOfPayment: lineItemData.modeOfPayment || '',
              billImageUrl: lineItemData.billImageUrl || '',
              personalExpenseAmount: lineItemData.isPersonalExpense ? (lineItemData.personalExpenseAmount || 0) : undefined,
            };
            if (lineItemData.isPersonalExpense === true) {
              const totalAmount = lineItemData.totalAmount || 0;
              lineItemData.personalExpenseAmount = Math.min(lineItemData.personalExpenseAmount || 0, totalAmount);
    
              // Validate personalExpenseAmount against totalAmount
              if (lineItemData.personalExpenseAmount > totalAmount) {
                return res.status(400).json({ error: 'Personal expense amount cannot be more than total amount of the bill.' });
              }
            }
            expense.expenseLines.push(newExpenseLine);
          }
        }); 
  // Save the updated expense lines first
    await expense.save();
  
  //when ever any change in bookings(embedded Travel request) happen it is automatically reflected in alreadyBookedExpenseLines(expenses)
  expense.alreadyBookedExpenseLines = expense.embeddedTrip.embeddedTravelRequest.bookings.map((booking) => ({ ...booking }));
  
    // Recalculate total amounts using the updated expense lines
    const totalCashAmount = calculateTotalCashAmount(expense);
    const totalExpenseAmount = calculateTotalExpenseAmount(expense);
    const remainingCash = calculateRemainingCash(totalCashAmount, totalExpenseAmount);
  
    // Update expense with the recalculated amounts
    const updatedExpense = await updateExpenseWithAmountStatus(expense, totalCashAmount, totalExpenseAmount, remainingCash);
  
    console.log('Expense line items saved successfully.');
    return res.status(200).json({ message: 'Expense line items updated successfully.',
    tenantId:tenantId,
      totalCashAmount,
      totalExpenseAmount,
      remainingCash
    });
  } catch (error) {
    console.error('An error occurred while saving the expense line items:', error);
    return res.status(500).json({ error: 'An error occurred while saving the expense line items.' });
  }
  };


// 3) submit Travel expense Report 
export const submitTravelExpenseReport = async (req, res) => {
        try {
          const { tenantId, expenseHeaderID, empId } = req.params;
          const { expenseLines } = req.body;
      
          const expense = await Expense.findOne({
            'tenantId': tenantId,
            'expenseHeaderID': expenseHeaderID,
            $or: [
              { 'embeddedTrip.embeddedTravelRequest.createdBy.empId': empId },
              { 'embeddedTrip.embeddedTravelRequest.createdFor.empId': empId }
            ]
          });
      
          if (!expense) {
            console.log('Expense not found for the provided criteria.');
            return res.status(404).json({ error: 'Expense not found for the provided criteria.' });
          }
      
          // Check if empId exists in createdBy.empId or createdFor.empId
          const createdByEmpId = expense.embeddedTrip?.embeddedTravelRequest?.createdBy?.empId;
          const createdForEmpId = expense.embeddedTrip?.embeddedTravelRequest?.createdFor?.empId;
          const createdByEmpName = expense.embeddedTrip?.embeddedTravelRequest?.createdBy?.name;
          const createdForEmpName = expense.embeddedTrip?.embeddedTravelRequest?.createdFor?.name;
      
          if (createdByEmpId === empId) {
            expense.createdBy = {
              empId: createdByEmpId,
              name: createdByEmpName, // Assigning name from createdFor when matching createdByEmpId
            };
          } else if (createdForEmpId === empId) {
            expense.createdBy = {
              empId: createdForEmpId,
              name: createdForEmpName, // Assigning name from createdFor when matching createdForEmpId
            };
          }
        

        let isDraftFound = false;
        let isTAndEPolicy = expense.tAndEPolicy || false;
        let isApproval = expense.Approval || false;

        expenseLines.forEach((lineItemData) => {
            if (lineItemData.lineItemStatus === 'draft') {
                isDraftFound = true;
                return res.status(400).json({ error: `Line item with bill number ${lineItemData.billNumber} is in 'draft' status. Please save it as 'save'.` });
            }
                const existingExpenseLineIndex = expense.expenseLines.findIndex(
                  (expenseLine) =>
                    expenseLine.transactionData.billNumber === lineItemData.billNumber &&
                    expenseLine.transactionData.totalAmount === lineItemData.totalAmount
                );
          
                if (existingExpenseLineIndex !== -1) {
                  // Update existing expense line
                  expense.expenseLines[existingExpenseLineIndex] = {
                    transactionData: {
                      businessPurpose: lineItemData.businessPurpose || '',
                      vendorName: lineItemData.vendorName || '',
                      billNumber: lineItemData.billNumber || '',
                      billDate: lineItemData.billDate || '',
                      grossAmount: lineItemData.grossAmount || 0,
                      taxes: lineItemData.taxes || 0,
                      totalAmount: lineItemData.totalAmount || 0,
                      description: lineItemData.description || '',
                    },
                    expenseType: lineItemData.expenseType || '',
                    lineItemStatus:'save',
                    billRejectionReason: lineItemData.billRejectionReason || '',
                    isPersonalExpense: lineItemData.isPersonalExpense || false,
                    modeOfPayment: lineItemData.modeOfPayment || '',
                    billImageUrl: lineItemData.billImageUrl || '',
                    personalExpenseAmount: lineItemData.isPersonalExpense ? (lineItemData.personalExpenseAmount || 0) : undefined,
                  };
                  if (lineItemData.isPersonalExpense === true) {
                    const totalAmount = lineItemData.totalAmount || 0;
                    lineItemData.personalExpenseAmount = Math.min(lineItemData.personalExpenseAmount || 0, totalAmount);
          
                    // Validate personalExpenseAmount against totalAmount
                    if (lineItemData.personalExpenseAmount > totalAmount) {
                      return res.status(400).json({ error: 'Personal expense amount cannot be more than total amount of the bill.' });
                    }
                  }
                } else {
                  // Create new expense line
                  const newExpenseLine = {
                    transactionData: {
                      businessPurpose: lineItemData.businessPurpose || '',
                      vendorName: lineItemData.vendorName || '',
                      billNumber: lineItemData.billNumber || '',
                      billDate: lineItemData.billDate || '',
                      grossAmount: lineItemData.grossAmount || 0,
                      taxes: lineItemData.taxes || 0,
                      totalAmount: lineItemData.totalAmount || 0,
                      description: lineItemData.description || '',
                    },
                    expenseType: lineItemData.expenseType || '',
                    lineItemStatus:'save',
                    billRejectionReason: lineItemData.billRejectionReason || '',
                    isPersonalExpense: lineItemData.isPersonalExpense || false,
                    modeOfPayment: lineItemData.modeOfPayment || '',
                    billImageUrl: lineItemData.billImageUrl || '',
                    personalExpenseAmount: lineItemData.isPersonalExpense ? (lineItemData.personalExpenseAmount || 0) : undefined,
                  };
                  if (lineItemData.isPersonalExpense === true) {
                    const totalAmount = lineItemData.totalAmount || 0;
                    lineItemData.personalExpenseAmount = Math.min(lineItemData.personalExpenseAmount || 0, totalAmount);
          
                    // Validate personalExpenseAmount against totalAmount
                    if (lineItemData.personalExpenseAmount > totalAmount) {
                      return res.status(400).json({ error: 'Personal expense amount cannot be more than total amount of the bill.' });
                    }
                  }
                  expense.expenseLines.push(newExpenseLine);
                }
        });

        // Save the updated expense lines first
        await expense.save();
        //when ever any change in bookings(embedded Travel request) happen it is automatically reflected in alreadyBookedExpenseLines(expenses)
  expense.alreadyBookedExpenseLines = expense.embeddedTrip.embeddedTravelRequest.bookings.map((booking) => ({ ...booking }));
        // Set expenseStatus based on conditions
        if (isTAndEPolicy && isApproval) {
            expense.expenseStatus = 'pending approval';
        }

        // Recalculate total amounts using the updated expense lines
         const totalCashAmount = calculateTotalCashAmount(expense);
        const totalExpenseAmount = calculateTotalExpenseAmount(expense);
       const remainingCash = calculateRemainingCash(totalCashAmount, totalExpenseAmount);

      // Update expense with the recalculated amounts
      const updatedExpense = await updateExpenseWithAmountStatus(expense, totalCashAmount, totalExpenseAmount, remainingCash);


        if (totalCashAmount === remainingCash || remainingCash === 0) {
            expense.expenseStatus = 'paid'; // company has already paid the employee
        } else if (remainingCash < 0) {
            expense.expenseStatus = 'pending settlement'; // company has to pay the employee
        } else {
            expense.expenseStatus = 'pending payup'; // employee has to pay the company
        }



        console.log('Expense line items saved successfully.');
        return res.status(200).json({
            message: `Expense header report number ${expenseHeaderID} has been submitted.`,
            totalCashAmount,
            totalExpenseAmount,
            remainingCash
        });
    } catch (error) {
        console.error('An error occurred while saving the expense line items:', error);
        return res.status(500).json({ error: 'An error occurred while saving the expense line items.' });
    }
};

// Function to update expense with amount status
const updateExpenseTotalAmountAfterDeletion = async (expense) => {
  try {
    // Calculate necessary amounts
    const totalCashAmount = calculateTotalCashAmount(expense);
    const totalExpenseAmount = calculateTotalExpenseAmount(expense);
    const remainingCash = calculateRemainingCash(totalCashAmount, totalExpenseAmount);

    // Update expense with the calculated amounts
    expense.expenseAmountStatus = {
      totalCashAmount,
      totalExpenseAmount,
      remainingCash,
    };

    // Update 'createdBy' based on existing properties
    if (expense.embeddedTrip?.embeddedTravelRequest?.createdBy.empId) {
      expense.createdBy = {
        empId: expense.embeddedTrip?.embeddedTravelRequest?.createdBy?.empId,
        name: expense.embeddedTrip?.embeddedTravelRequest?.createdBy?.name,
      };
    } else {
      throw new Error('Missing or wrong empId within embeddedTrip.createdBy.');
    }

    // Save the updated expense
    const savedExpense = await expense.save();

    console.log('Expense updated successfully:', savedExpense);

    return savedExpense;
  } catch (error) {
    console.error('Error occurred while updating expense:', error);
    throw new Error('An error occurred while updating expense with expense amount status.');
  }
};

// 4) Delete line item from expense lines FOR TRAVEL EXPENSE REPORT AND UPDATE CASH ADVANCE (IF TAKEN)
export const onDeleteLineItem = async (req, res) => {
  try {
    const { tenantId, expenseHeaderID, empId, _id } = req.params;

    const expense = await Expense.findOne({
      'tenantId': tenantId,
      'expenseHeaderID': expenseHeaderID,
      'createdBy.empId': empId,
    }).exec();

    if (!expense) {
      console.log('Expense not found for the provided criteria.');
      return res.status(404).json({ error: 'Expense not found for the provided criteria.' });
    }

    const foundExpenseLineIndex = expense.expenseLines.findIndex(line =>
      String(line._id) === String(_id)
    );


    if (foundExpenseLineIndex === -1) {
      return res.status(404).json({ error: 'Expense line not found within the expenseLines array.' });
    }

    const foundExpenseLine = expense.expenseLines[foundExpenseLineIndex];

    if (
      foundExpenseLine.isPersonalExpense ||
      foundExpenseLine.multiCurrencyDetails ||
      foundExpenseLine.transactionData.totalAmount
    ) {
      // Recalculate totals and update the expense with amount status
      const updatedExpense = await updateExpenseTotalAmountAfterDeletion(expense);
      // Remove the expense line from the expenseLines array
      expense.expenseLines.splice(foundExpenseLineIndex, 1);

      // Save the updated expense object back to the database
      await expense.save(); 
      // Update Trip Microservice with modified data
      // await tripService.updateTripMicroservice(expense);

      // Check 'approvers' array and update Approval Microservice
      // await tripService.checkApproversAndSendUpdatesToApproval(expense);

      return res.status(200).json({
        message: 'Expense line item updated and deleted successfully.',
        tenantId: tenantId,
        expenseHeaderID,
        deletedExpenseLine: _id,
        totalCashAmount: updatedExpense.expenseAmountStatus.totalCashAmount,
        totalExpenseAmount: updatedExpense.expenseAmountStatus.totalExpenseAmount,
        remainingCash: updatedExpense.expenseAmountStatus.remainingCash
      });
    }

  } catch (error) {
    console.error('An error occurred while deleting the expense line items in expense report:', error);
    return res.status(500).json({ error: 'An error occurred while saving the expense line items.' });
  }
};


