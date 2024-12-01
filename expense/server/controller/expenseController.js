// import { onSaveAsDraftExpenseHeaderToTrip, onSaveLineItemToTrip } from "../internalControllers/controllers/tripMicroservice.js";
import { sendToDashboardMicroservice, sendTravelExpenseToDashboardQueue } from "../rabbitmq/dashboardMicroservice.js";
import Expense from '../models/tripSchema.js';
import HRMaster from '../models/hrCompanySchema.js';

const generateIncrementalNumber = (tenantId, incrementalValue) => {
  const formattedTenant = (tenantId || '').toUpperCase().substring(0, 3);
  return `ER${formattedTenant}${incrementalValue.toString().padStart(6, '0')}`;
};

// Total cash advance with status as 'paid' for a transit trip
const calculateTotalCashAdvances = async(cashAdvances) => {
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

// 'pending approval', if it is rejected, then create a new one
const allExpenseReports = async (expenseReport) => {
    try {
        expenseReport.forEach(async expense => {
            const { expenseReport: reportDetails, expenseHeaderStatus } = expense;

            if (Array.isArray(reportDetails)) {
                reportDetails.forEach(async detail => {
                    if (expenseHeaderStatus === 'paid' || expenseHeaderStatus === 'paid and distributed') {
                        let totalExpenseReports = reportDetails.find(item => item.expenseHeaderStatus === expenseHeaderStatus);

                        if (!totalExpenseReports) {
                            totalExpenseReports = { expenseHeaderStatus };
                            reportDetails.push(totalExpenseReports);
                        }

                        const maxIncrementalValue = await Expense.findOne({}, 'travelExpenseData.expenseHeaderNumber')
                            .sort({ 'travelExpenseData.expenseHeaderNumber': -1 })
                            .limit(1);

                        // Calculate the next incremental value
                        const nextIncrementalValue = (maxIncrementalValue ? parseInt(maxIncrementalValue.travelExpenseData.expenseHeaderNumber.substring(9), 10) : 0) + 1;

                        // Generate the new expenseHeaderNumber
                        const expenseHeaderNumber = generateIncrementalNumber(tenantId, nextIncrementalValue);

                        // Assign the new expenseHeaderNumber to tripData
                        detail.travelExpenseData.expenseHeaderNumber = expenseHeaderNumber;

                        totalExpenseReports = {} || 0;
                    } else {
                        if (['draft', 'pending approval', 'approved', 'pending settlement'].includes(expenseHeaderStatus)) {
                            let totalExpenseReports = reportDetails.find(item => item.expenseHeaderStatus === expenseHeaderStatus);

                            if (!totalExpenseReports) {
                                totalExpenseReports = { expenseHeaderStatus };
                                reportDetails.push(totalExpenseReports);
                            }

                            totalExpenseReports = {} || 0;
                        }
                    }
                });
            }
        });

        return expenseHeaderStatus;
    } catch (error) {
        // Handle errors using a standardized response structure
        console.error(error);
        throw new Error('An error occurred while processing expense reports.');
    }
};

// 2) Get Default currency
const getExpenseRelatedHrData = async (req, res) => {
    try {
        const { tenantId, tenantName } = req.params;

        // Find the matching document in HRCompany based on tenantId and tenantName
        const companyDetails = await HRMaster.findOne({ tenantId, tenantName });

        if (!companyDetails) {
            return res.status(404).json({ message: 'Company details not found' });
        }

        // Extract and send the defaultCurrency
        const defaultCurrency = companyDetails.companyDetails.defaultCurrency;

        // Get travelAllocations
        const travelAllocations = companyDetails?.travelAllocations;

        // Get advanceSettlementOptions
        const advanceSettlementOptions = companyDetails?.advanceSettlementOptions;

        // Get expenseSettlementOptions
        const expenseSettlementOptions = companyDetails?.expenseSettlementOptions;

        res.status(200).json({ defaultCurrency, travelAllocations, advanceSettlementOptions, expenseSettlementOptions });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


// Get expense report
export const getBookExpense = async (req, res) => {
    try {
        const { tenantId, empId, tripId } = req.params;
        const expenseReport = await Expense.findOne({
            'tenantId': tenantId,
            'createdBy.empId': empId,
            'tripId': tripId,
        });

        if (!expenseReport) {
            return res.status(404).json({ message: 'expenseReport not found' });
        }

        const { tripNumber, tripPurpose } = expenseReport.tripData;
        let expenseHeaderNumber = expenseReport?.travelExpenseData?.expenseHeaderNumber;

        if (!expenseHeaderNumber) {
            const maxIncrementalValue = await Expense.findOne({}, 'travelExpenseData.expenseHeaderNumber')
                .sort({ 'travelExpenseData.expenseHeaderNumber': -1 })
                .limit(1);

            const nextIncrementalValue = (maxIncrementalValue ? parseInt(maxIncrementalValue.travelExpenseData.expenseHeaderNumber.substring(9), 10) : 0) + 1;
            expenseHeaderNumber = generateIncrementalNumber(tenantId, nextIncrementalValue);

            expenseReport.travelExpenseData.expenseHeaderNumber = expenseHeaderNumber;
            expenseReport.tripData.travelExpenseData.itinerary = alreadyBookedExpense;
            expenseReport.tripData.travelExpenseData.itinerary.bookingDetails.billDetails.totalAmount = totalExpenseAmount;
            expenseReport.tripData.travelExpenseData.itinerary.bookingDetails.billDetails.totalAmount = totalAlreadyBookedExpense;
            expenseReport.tripData.travelRequestData.isCashAdvanceTaken = isCashAdvanceTaken;

            if (isCashAdvanceTaken) {
                expenseReport.tripData.cashAdvanceData.cashAdvance = await calculateTotalCashAdvances(cashAdvance);
            }

            expenseReport.tripData.cashAdvanceData.amountDetails.amount = remainingCash;

            companyDetails = await getExpenseRelatedHrData;

            res.status(200).json({
                tripData: tripData, tripId, tripNumber: tripNumber,tripPurpose, newExpenseReport: expenseHeaderNumber,
                alreadyBookedExpense: alreadyBookedExpense, totalExpenseAmount: totalExpenseAmount,
                totalAlreadyBookedExpense: totalAlreadyBookedExpense, remainingCash: remainingCash, companyDetails: companyDetails
            });
        } else if (!expenseReport.travelExpenseData.expenseHeaderNumber || !expenseReport.travelExpenseData.expenseHeaderStatus) {
            return res.status(400).json({ message: 'Invalid trip data' });
        } else {
            if (expenseReport.travelExpenseData.expenseHeaderNumber || expenseReport.travelExpenseData.expenseHeaderStatus) {
                await allExpenseReports(expenseReport);

                res.status(200).json({
                    tripData: tripData, tripId, tripNumber: tripNumber,tripPurpose, newExpenseReport: false, newExpenseReport: expenseHeaderNumber,
                    alreadyBookedExpense: alreadyBookedExpense, totalExpenseAmount: totalExpenseAmount,
                    totalAlreadyBookedExpense: totalAlreadyBookedExpense, remainingCash: remainingCash, companyDetails: companyDetails, expenseAmountStatus: expenseAmountStatus
                });
            }
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


// modify expense report
export const getModifyExpenseReport = async (req, res) => {
  try {
      const { tenantId, empId, expenseHeaderId } = req.params;

      // Check if required parameters are provided
      if (!tenantId || !empId || !expenseHeaderId) {
          return res.status(400).json({
              success: false,
              message: 'Missing required parameters',
          });
      }

      const expense = await Expense.findOne({
         tenantId,
         $or:[
          { "travelRequestData.createdBy.empId":empId},
          {"travelRequestData.createdFor.empId":empId}
        ],
         "travelExpenseData":{
            $elemMatch: { "expenseHeaderId":expenseHeaderId}
         }
        });
      
      if (!expense) {
          return res.status(404).json({
              success: false,
              message: 'Travel expense Report not found or unauthorized',
          });
      }

      res.status(200).json({
          success: true,
          message: 'Travel expense Report retrieved successfully',
          expense
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve Travel expense Report' });
  }
};


// clear rejected expense report
export const getClearRejectedReport = async (req, res) => {
  try {
      const { tenantId, empId, tripId, expenseHeaderId } = req.params;

      const expense = await Expense.findOne({
        tenantId, 
        tripId, 
        $or:[
          { "travelRequestData.createdBy.empId":empId},
          {"travelRequestData.createdFor.empId":empId}
        ],
        travelExpenseData:{
          $elemMatch:{
            'expenseHeaderId':expenseHeaderId
          }
        }
      });

      if (!expense) {
          return res.status(404).json({
              success: false,
              message: 'Travel expense Report not found or unauthorized',
          });
      }

      res.status(200).json({
          success: true,
          message: 'Travel expense Report retrieved successfully',
          expense
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve Travel expense Report' });
  }
};


// Function to calculate total amount of paid cash advances
const calculateTotalCashAmount = (expense) => {
  let totalCashAmount = 0;
  const cashAdvances = expense.tripData?.cashAdvancesData?.cashAdvances || [];

  cashAdvances.forEach((cashAdvance) => {
    if (cashAdvance.cashAdvanceStatus === 'paid') {
      const amountDetails = cashAdvance.amountDetails || [];
      amountDetails.forEach((details) => {
        totalCashAmount += details.amount || 0;
      });
    }
  });

  return totalCashAmount;
};

// Function to calculate total non-personal expense amount
const calculateTotalExpenseAmount = (expense) => {
  let totalExpenseAmount = 0;
  const expenseLines = expense.expenseLines || [];

  expenseLines.forEach((line) => {
    totalExpenseAmount += line.transactionData?.totalAmount || 0;

    if (line.isPersonalExpense === true) {
      totalExpenseAmount -= line.personalExpenseAmount || 0;
    }
  });

  return totalExpenseAmount;
};

// Function to calculate remaining cash
const calculateRemainingCash = (totalCashAmount, totalExpenseAmount) => {
  return totalCashAmount - totalExpenseAmount;
};

// Function to update expense with amount status
const updateExpenseWithAmountStatus = async (expense, totalCashAmount, totalExpenseAmount, remainingCash) => {
  try {
    if (!expense || !expense.tripData || !expense.tripData.userId) {
      throw new Error('Invalid expense structure: Unable to access necessary properties.');
    }

    expense.expenseAmountStatus = {
      totalCashAmount,
      totalExpenseAmount,
      remainingCash,
    };

    // Ensure that the necessary nested properties exist before setting 'createdBy'
    if (expense.tripData?.travelRequestData?.createdBy?.empId) {
      expense.createdBy = {
        empId: expense.tripData.travelRequestData.createdBy.empId,
        name: expense.tripData.travelRequestData.createdBy.name,
      };
    } else {
      throw new Error('Missing/wrong empId within tripData.createdBy.');
    }

    const savedExpense = await expense.save();

    console.log('Expense updated successfully:', savedExpense);

    return savedExpense;
  } catch (error) {
    console.error('Error occurred while updating expense:', error);
    throw new Error('An error occurred while updating expense with expense amount status.');
  }
};

export { calculateTotalCashAmount, calculateTotalExpenseAmount, calculateRemainingCash, updateExpenseWithAmountStatus };

//Trip Number, Expense Header Report Number, Cash Advance Amount,  
//add the new expense amount to the lineItem .totalExpenseAmount.
//Total Expense Amount and the Actual Line Item/Line Items.


// from line item take non personal amount and add it to total expense amount 
export const onSaveOld = async (req, res) => {
    const { tripId, expenseHeaderId } = req.params;
    const { totalExpenseAmount, totalAlreadyBookedExpenseAmount, totalPersonalAmount, remainingCash, travelAllocationFlags, lineItem } = req.body;
  
    try {
      let newTotalExpenseAmount;
      let updatedRemainingCash = remainingCash;
      let newTotalPersonalExpenseAmount;
      let newRemainingCashAmount;

      const hasPersonalExpense = lineItem.isPersonalExpense;
  
      if (hasPersonalExpense) {
        const updatedNonPersonalAmount = lineItem.nonPersonalAmount;
  
        newTotalExpenseAmount = totalExpenseAmount + updatedNonPersonalAmount;
  
        updatedPersonalAmount = lineItem.personalAmount;
  
        newTotalPersonalExpenseAmount = totalPersonalAmount + updatedPersonalAmount;
  
        newRemainingCashAmount = remainingCash - updatedNonPersonalAmount;
  
        // Update expense with the recalculated amounts
      } else {
        // updated remaining cash is added to totalRemainingCash
        newRemainingCashAmount = updatedRemainingCash;
      }
  
      // Update the expenseReport using $set
      const updatedExpenseReport = await Expense.findOneAndUpdate(
        {
          'travelExpenseData.expenseHeaderId': expenseHeaderId,
          'tripId': tripId,
          $or: [
            { 'travelRequestData.createdBy.empId': empId },
            { 'travelRequestData.createdFor.empId': empId }
          ]
        },
        {
          $set: {
            'travelExpenseData.travelAllocationFlags':travelAllocationFlags,
            'expenseAmountStatus.totalPersonalExpense': newTotalPersonalExpenseAmount,
            'expenseAmountStatus.totalExpenseAmount': newTotalExpenseAmount,
            'expenseAmountStatus.totalAlreadyBookedExpense':newTotalExpenseAmount,
            'expenseAmountStatus.remainingCash': newRemainingCashAmount,
            'travelExpenseData.alreadySaved':true,
          }
        },
        {
          $push: {
          'travelExpenseData.expenseLines': expenseLines[0],
          }
        },        
        { new: true }
      );
  
      const { tenantId, totalCashAmount, totalExpenseAmount, remainingCash } = updatedExpenseReport;

      // send it to trip
      // await onSaveLineItemToTrip(updatedExpenseReport);

      return res.status(200).json({
        message: 'Expense line items updated successfully.',
        tenantId,
        totalCashAmount,
        totalExpenseAmount,
        remainingCash
      });
    } catch (error) {
      console.error('An error occurred while saving the expense line items:', error);
      return res.status(500).json({ error: 'An error occurred while saving the expense line items.' });
    }
};

// entire expenselines saved as draft
const onSaveAsDraftExpenseHeader = async (req, res) => {
    const {tenantId, empId, tripId, expenseHeaderId } = req.params;
  
    try {
      const draftExpenseReport = await Expense.findOneAndUpdate(
        { 'tenantId': tenantId,
          'tripId': tripId,
          $or: [
            { 'travelRequestData.createdBy.empId': empId },
            { 'travelRequestData.createdFor.empId': empId }
          ],
          'travelExpenseData': {
            $elemMatch: {
              'expenseHeaderId': expenseHeaderId,
            }
          },
        },
        {
          $set: {
            'travelExpenseData.$.expenseHeaderStatus': 'draft',
          }
        },
        { new: true }
      );
  
      if (!draftExpenseReport) {
        return res.status(404).json({ message: 'Expense report not found' });
      }

      // send it to trip
      // await onSaveAsDraftExpenseHeaderToTrip(draftExpenseReport);

      const payload = {...draftExpenseReport};
      const needConfirmation = false;
      const source = 'travel-expense'
      const onlineVsBatch = 'online';

      await sendTravelExpenseToDashboardQueue(payload, needConfirmation, onlineVsBatch, source);
  
      res.status(200).json({ message: 'Expense report status updated as draft' });
    } catch (error) {
      console.error('An error occurred while saving the expense header:', error);
      return res.status(500).json({ error: 'An error occurred while status updated as draft at the expense header.' });
    }
};


// pending settlement 
// To update expense header status
const updateExpenseHeaderStatus = (expenseReport) => {
  if (expenseReport.travelExpenseData.approvers && expenseReport.travelExpenseData.approvers.length > 0) {
    return 'pending approval';
  } else if (
    expenseReport?.expenseLines &&
    expenseReport?.expenseLines.length > 0 &&
    expenseReport?.expenseLines.some((line) => line.lineItemId === expenseReport.itineraryId)
  ) {
    return 'paid';
  } else {
    return 'pending settlement'; // finance admin
  }
};

// Exported function for handling expense header submission ()(when cancelling at header level check length of travelExpenseData, if it is just 1 object and getting cancelled then reset all amounts to 0 or else - the total amounts   is available if it is available  )
const onSubmitExpenseHeader = async (req, res) => {
  const {tenantId, empId, tripId, expenseHeaderId } = req.params;

  try {
    const expenseReport = await Expense.findOneAndUpdate(
      {
        'tenantId': tenantId,
        'tripId': tripId,
        $or: [
          { 'travelRequestData.createdBy.empId': empId },
          { 'travelRequestData.createdFor.empId': empId },
        ],
        'travelExpenseData':{
          $elemMatch:{
            'expenseHeaderId':expenseHeaderId,
          },
        },
      },
      {
        $set: {
          'travelExpenseData.$.expenseHeaderStatus': updateExpenseHeaderStatus(expenseReport),
        },
      },
      { new: true }
    );

    // Check if the expense report is not found
    if (!expenseReport) {
      return res.status(404).json({ message: 'Expense report not found' });
    }

    // Update the expense header status based on logic
    expenseReport.travelExpenseData.expenseHeaderStatus = updateExpenseHeaderStatus(expenseReport);

    // Save the updated status in the database
    await expenseReport.save();

    // await onSaveLineItemToTrip(updatedExpenseReport);
    const payload = {...expenseReport};
    const needConfirmation = false;
    const source = 'travel-expense'
    const onlineVsBatch = 'online';

    await sendTravelExpenseToDashboardQueue(payload, needConfirmation, onlineVsBatch, source);

    return res.status(200).json({ message: 'Expense report status updated successfully' });
  } catch (error) {
    // Handle errors in a consistent manner
    console.error('An error occurred while updating the expense header:', error);
    return res.status(500).json({ error: 'An error occurred while updating the expense header.' });
  }
};


const getTravelExpenseReport = async (req, res) => {
  try {
    const { tenantId, empId, tripId, expenseHeaderId } = req.params;

    // Find the expense report using findOne method
    const expenseReport = await Expense.findOne({
      tenantId,
      tripId,
      'travelExpenseData.expenseHeaderId': expenseHeaderId,
      'createdBy.empId': empId,
    });

    if (!expenseReport) {
      // If the expense report is not found, return a 404 status with a message
      return res.status(404).json({
        success: false,
        message: 'Expense Report not found for the given IDs',
      });
    }

    //added flag to open
    expenseReport.travelExpenseData.forEach((expense) => {
      if (expense.expenseHeaderId === expenseHeaderId) {
        expense.flagToOpen = true;
      }
    });

    // Sending the successful response with the expenseReport data
    res.status(200).json({
      success: true,
      expenseReport: expenseReport.expenseReport,
    });
  } catch (error) {
    // Handling any potential errors
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve TravelExpenseReport',
    });
  }
};

// rejection reasons
const getRejectionReasons = async (req, res) => {
  try {
    const { tenantId, empId, tripId, expenseHeaderId } = req.params;

    // Find the expense report using findOne method
    const expenseReport = await Expense.findOne({
      tenantId,
      tripId,
      'travelExpenseData.expenseHeaderId': expenseHeaderId,
      'createdBy.empId': empId,
    });

    if (!expenseReport) {
      // If the expense report is not found, return a 404 status with a message
      return res.status(404).json({
        success: false,
        message: 'Expense Report not found for the given IDs',
      });
    }

    // Find the matching expense object
    const matchingExpense = expenseReport.travelExpenseData.find(
      (expense) => expense.expenseHeaderId === expenseHeaderId
    );
  
    if (!matchingExpense) {
      // If the matching expense object is not found, return a 404 status with a message
      return res.status(404).json({
        success: false,
        message: 'Expense Header ID not found in the report',
      });
    }

    // Retrieve the rejectionReason from the matching object
    const { expenseHeaderId: matchedHeaderId, rejectionReason } = matchingExpense;
    // Sending the successful response with the matched expenseHeaderId and rejectionReason
    res.status(200).json({
      success: true,
      tripId, // add- tripNumber
      expenseHeaderId: matchedHeaderId, //add- expenseHeaderNumber
      rejectionReason,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve rejected TravelExpenseReport',
    });
  }
};

const getRejectedReport = async (req, res) => {
  try {
    const { tenantId, empId, tripId, expenseHeaderId } = req.params;

    // Find the expense report using findOne method
    const expenseReport = await Expense.findOne({
      tenantId,
      tripId,
      'travelExpenseData.expenseHeaderId': expenseHeaderId,
      'createdBy.empId': empId,
    });

    if (!expenseReport) {
      // If the expense report is not found, return a 404 status with a message
      return res.status(404).json({
        success: false,
        message: 'Expense Report not found for the given IDs',
      });
    }

    //added flag to open
    expenseReport.travelExpenseData.forEach((expense) => {
      if (expense.expenseHeaderId === expenseHeaderId) {
        expense.flagToOpen = true;
      }
    });

    // Sending the successful response with the expenseReport data
    res.status(200).json({
      success: true,
      expenseReport: expenseReport.expenseReport,
    });
  } catch (error) {
    // Handling any potential errors
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve rejected TravelExpenseReport',
    });
  }
};


/**
 * 
4. If user clicks Cancel at the Header Level
    1. If user clicks this in the first Expense Header Report Number that has the already booked expenses.
        1. Reset all amount fields to 0.
        2. Delete the expense Header Report completely. 
    2. If user clicks this in any other Expense Header Report Number that does not have the already booked expenses. 
        1. Check if the line items of the Expense Header Report have personal expenses. If yes, subtract this amount from the total personal amount.
        2. Add all the other line items and arrive at an amount. Subtract this amount from the total expense amount.
        3. Total Cash amount will be same.
        4. The amount in 2 needs to be added back to the Balance Cash Amount. 
        5. Overwrite the amount in the amount fields. 
        6. Delete the entire Expense Header Report cancelled. 
 */

const cancelAtHeaderLevelForAReport = async (req, res) => {
  const { tenantId, tripId, expenseHeaderId } = req.params;
  const { expenseAmountStatus, travelExpenseReport } = req.body;
  let { totalCashAmount, totalExpenseAmount, totalPersonalExpenseAmount, totalremainingCash } = expenseAmountStatus;

try {

const hasAlreadyBookedExpense = travelExpenseReport && travelExpenseReport.alreadyBookedExpense && Array.isArray(travelExpenseReport.alreadyBookedExpense) && travelExpenseReport.alreadyBookedExpense.length > 0;
const isMatchingExpenseHeaderId = travelExpenseReport && travelExpenseReport.expenseHeaderId === expenseHeaderId;


if (hasAlreadyBookedExpense && isMatchingExpenseHeaderId){

      const updatedExpenseReport = await Expense.findOneAndUpdate(
        {
          'tenantId': tenantId,
          'expenseHeaderId': expenseHeaderId,
          'tripId': tripId,
          $or: [
            { 'travelRequestData.createdBy.empId': req.user.empId },
            { 'travelRequestData.createdFor.empId': req.user.empId }
          ],
          'travelExpenseData': { $elemMatch: { 'expenseHeaderId': expenseHeaderId } }
        },
        {
          $unset: { travelExpenseData: 1 },
          $set: {
            'expenseAmountStatus.totalCashAmount': 0,
            'expenseAmountStatus.totalAlreadyBookedExpenseAmount': 0,
            'expenseAmountStatus.totalExpenseAmount': 0,
            'expenseAmountStatus.totalremainingCash': 0,
            'expenseAmountStatus.totalPersonalExpenseAmount': 0,
            'expenseAmountStatus.totalNonPersonalExpenseAmount': 0,
          },
        },
        { new: true }
      );

      if(updatedExpenseReport){
        const payload = updatedExpenseReport;
        const action = 'full-update'
        const comments = 'cancel of travelExpenseReport at header level'
       const success = await sendToDashboardMicroservice(payload, action, comments,'expense','online',true)
        if (success){
          res.status(200).json({ success: true, data: updatedExpenseReport })
        } else{
          res.status(500).json({success: false, message: 'Error in deleting expense report' })
          }
      }
    } else {
      // Use reduce to calculate newPersonalExpenseAmount and newNonPersonalExpenseAmount

     const { expenseLines} = travelExpenseReport;
      
      const newPersonalExpenseAmount = expenseLines.reduce((total, line) => {
        if (line.isPersonalExpense) {
          return total + line.personalExpenseAmount;
        }
        return total;
      }, 0);

      // const newNonPersonalExpenseAmount = expenseLines.reduce((total, line) => {
      //   if (line.isPersonalExpense) {
      //     return total + line.nonPersonalExpenseAmount;
      //   }
      //   return total;
      // }, 0);

     const totalAmountObject = expenseCategory.fields.find(field => field.name.toLowerCase().replace(/\s/g, '') === "totalamount") || {};

     const totalAmount = totalAmountObject.value;

     const newNonPersonalExpenseAmount = expenseLines.reduce((total, line) => {
      if (line.isPersonalExpense) {
     return total + line.nonPersonalExpenseAmount;
     } else {
     total += parseFloat(totalAmount); 
     return total;
     }
     }, 0);


      // Update totalExpenseAmount and totalPersonalExpenseAmount
      totalExpenseAmount -= newNonPersonalExpenseAmount;
      totalPersonalExpenseAmount -= newPersonalExpenseAmount;
      totalremainingCash += newNonPersonalExpenseAmount

      // Perform the update operations
      const newExpenseReport = await Expense.findOneAndUpdate(
        {
          'tenantId': tenantId,
          'expenseHeaderId': expenseHeaderId,
          'tripId': tripId,
          $or: [
            { 'travelRequestData.createdBy.empId': req.user.empId },
            { 'travelRequestData.createdFor.empId': req.user.empId }
          ],
          'travelExpenseData': { $elemMatch: { 'expenseHeaderId': expenseHeaderId } }
        },
        {
          $unset: { travelExpenseData: 1 },
          $set: {
            'expenseAmountStatus.totalCashAmount': 0,
            'expenseAmountStatus.totalAlreadyBookedExpenseAmount': 0,
            'expenseAmountStatus.totalExpenseAmount': totalExpenseAmount,
            'expenseAmountStatus.totalremainingCash': totalremainingCash ,
            'expenseAmountStatus.totalPersonalExpenseAmount': totalPersonalExpenseAmount ,
          },
        },
        { new: true }
      );

      if(newExpenseReport){
        const payload = newExpenseReport;
        const action = 'full-update'
        const comments = 'cancel of travelExpenseReport at header level'
       const success = await sendToDashboardMicroservice(payload, action, comments,'expense','batch',true)
        if (success){
          res.status(200).json({ success: true, data: newExpenseReport })
        } else{
          res.status(500).json({success: false, message: 'Error in deleting expense report' })
          }
      }
    }
  } catch (error) {
    console.error('Error canceling at header level:', error);
    res.status(500).json({ success: false, message: 'Internal server error.', error: error.message });
  }
};


// const needTobeAddedDeleteExpenseReportHeaderLevel = async () =>{
//   const payload = {...expenseReport};
// const needConfirmation = true;
// const source = 'travel-expense'
// const onlineVsBatch = 'online';

// await sendTravelExpenseToDashboardQueue(payload, needConfirmation, onlineVsBatch, source);
// }


// 5. If user user clicks Cancel at the Expense Line Item Level
//     1. If the amount is a personal expense simply reduce the amount from the Total Personal Amount. 
//     2. If the amount is any other amount, reduce the amount from the Total expense amount. 
//     3. Add this amount back to Remaining Cash. 
//     4. Overwrite the amount in the amount fields. 
//     5. Delete the line item completely. 

const cancelAtLine = async (req, res) => {
  try {
    const {tenantId, empId, tripId, expenseHeaderId } = req.params;
    const {expenseAmountStatus, expenseLine } = req.body;
    const {
      totalCashAmount,
      totalExpenseAmount,
      totalPersonalExpenseAmount,
      totalRemainingCash
    } = expenseAmountStatus;

     // Check if cash advance is taken
     const isCashAdvanceTaken = totalCashAmount > 0;

    // Initialize variables
    totalPersonalExpenseAmount = totalPersonalExpenseAmount || 0;

    const personalExpenseIncluded = expenseLine?.isPersonalExpense || "undefined";

    const totalAmountObject = expenseCategory.fields.find(field => field.name.toLowerCase().replace(/\s/g, '') === "totalamount") || {};

    const totalAmount = totalAmountObject.value;
    // Update personal amounts if the line item is a personal expense
    if (personalExpenseIncluded) {
      totalPersonalExpenseAmount -= expenseLine.personalExpense;
      totalExpenseAmount += expenseLine.nonPersonalExpense;
      totalRemainingCash += isCashAdvanceTaken ? expenseLine.amount : 0;
    } else{
      totalRemainingCash += isCashAdvanceTaken ? expenseLine.amount : 0;
      totalExpenseAmount-=parseFloat(totalAmount); 
    }

    // Replace totalRemainingCash in MongoDB and delete the expense line completely
    const cancelAtLineItem = await Expense.findOneAndUpdate(
      { 
        'tenantId':tenantId,
        'expenseHeaderId': expenseHeaderId,
        'tripId': tripId,
        $or: [
          { 'travelRequestData.createdBy.empId': empId }, 
          { 'travelRequestData.createdFor.empId': empId }
        ]
      },
      {
        $set: {
          'expenseAmountStatus.totalExpenseAmount': totalExpenseAmount,
          'expenseAmountStatus.totalPersonalExpenseAmount': totalPersonalExpenseAmount,
          'expenseAmountStatus.totalRemainingCash': totalRemainingCash ,
        }
      },
      { new: true }
    );


    if(cancelAtLineItem){
      const payload = cancelAtLineItem;
      const action = 'full-update'
      const comments = 'cancel of travelExpenseReport at header level'
     const success = await sendToDashboardMicroservice(payload, action, comments,'expense','online',true)
      if (success){
        res.status(200).json({ success: true, message: 'Expense canceled successfully.' });
      } else{
        res.status(500).json({success: false, message: 'Error in deleting expense report' })
        }
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to cancel expense at line item level.' });
  }
};


// const cancelAtHeaderLevel = async (req,res) => {
//     const { tripId, expenseHeaderId} = req.params;
//     const {travelExpenseData } = req.body;

//     try {
         
//         if(travelExpenseData.itineraryId ){
//            let totalCashAmount = 0;
//            let totalAlreadyBookedExpenseAmount = 0 ;
//            let totalExpenseAmount = 0;
//            let totalPersonalExpenseAmount = 0;
//            let totalremainingCash = 0;
//         }
      
//         const expenseReport = await Expense.findOneAndUpdate(
//             {
//               'expenseHeaderId': expenseHeaderId,
//               'tripId': tripId,
//               $or: [
//                 { 'travelRequestData.createdBy.empId': empId },
//                 { 'travelRequestData.createdFor.empId': empId }
//               ]
//             },
//             {
//               $set: {
//                 'expenseAmountStatus.totalCashAmount': totalCashAmount,
//                  'expenseAmountStatus.totalAlreadyBookedExpenseAmount':totalAlreadyBookedExpenseAmount,
//                  'expenseAmountStatus.totalExpenseAmount' : expenseAmountStatus,
//                  'expenseAmountStatus.totalremainingCash' : totalremainingCash,
//                  'expenseAmountStatus.totalPersonalExpenseAmount' : totalPersonalExpenseAmount
                 
//               }
//             },
//             {
//               $pull: {
//                 'travelExpenseData.expenseLines': { lineItemId: lineItemId }
//               }              
//             },
//             { new: true } 
//           );
//      // figure out how to do this -- i have to set th expense amount to o and then delete expense header completely.

//  // case -2 . if there is  no itineraryId then 
//  //Check if the line items of the Expense Header Report have personal expenses.
//  // If yes, subtract this amount from the total personal amount.

//       let totalPersonalAmount = travelExpenseData.totalPersonalAmount || 0;
//       let updatedPersonalExpenses = 0;

//       lineItemData.forEach((lineItem) => {
//             if (isPersonalExpense(lineItem)) {
//             totalPersonalAmount -= lineItem.amount;
//             updatedPersonalExpenses += lineItem.amount;
//          }
//     });
//       travelExpenseData.totalPersonalAmount = totalPersonalAmount;
//   // nonPersonalExpense is not added to the schema but it comes from frontend !!
//   let nonPersonalExpense = 0;
//   let totalAmount = 0;

//   lineItems.forEach((item) => {
//     if (item.hasOwnProperty('nonPersonalExpense')) {
//       nonPersonalExpense += item.nonPersonalExpense;
//     } else if (item.hasOwnProperty('totalAmount')) {
//       totalAmount += item.totalAmount;
//     } else {
//       return { error: 'Expense line should have either nonPersonalExpense or totalAmount property.' };
//     }
//   });
  
//   // THIS expense difference is added to the totalRemainingCash 
//    const expenseDifference = nonPersonalExpense - totalAmount;
//     // totalRemainingCash  replace with  it in mongodb and delete expense header completely.
//   if (!isNaN(expenseDifference)) {
//     return { success: true, expenseDifference };
//   } else {
//     return { error: 'Error calculating expense difference.' };
//   }
// }}



//usecase 1- delete complety and reset amount values all 5
// usecase 2- replace amount fields - total remaining cash, personalexpense, total expense , (mongoose)
// fe- no change - replace total already booked amount , total cash advance amount. delete expense header completely.


// const cancelExpenseAtLineItemLevel = (req,res) => {
//     const { tripId, expenseHeaderId} = req.params;
//     const { lineItem} = req.body;

//      let totalPersonalAmount = travelExpenseData.totalPersonalAmount || 0;
//       let updatedPersonalExpenses = 0;

//      if (lineItem.isPersonalExpense) {
//             totalPersonalAmount -= lineItem.amount;
//             updatedPersonalExpenses += lineItem.amount;
//          }
//     };
//       travelExpenseData.totalPersonalAmount = totalPersonalAmount;

//    // // nonPersonalExpense is not added to the schema but it comes from frontend !!
//   let nonPersonalExpense = 0;
//   let totalAmount = 0;

//     if (item.hasOwnProperty('nonPersonalExpense')) {
//       nonPersonalExpense += item.nonPersonalExpense;
//     } else if (item.hasOwnProperty('totalAmount')) {
//       totalAmount += item.totalAmount;
//     } else {
//       return { error: 'Expense line should have either nonPersonalExpense or totalAmount property.' };
//     }
  
//   // THIS expense difference is added to the totalRemainingCash 
//    const expenseDifference = nonPersonalExpense - totalAmount;
//     // totalRemainingCash  replace with  it in mongodb and delete expense header completely.
    
//     const cancelExpenseAtLineItem = await Expense.findOneAndUpdate({
//         {
//             'expenseHeaderId': expenseHeaderId,
//             'tripId': tripId,
//             $or: [
//               { 'travelRequestData.createdBy.empId': empId },
//               { 'travelRequestData.createdFor.empId': empId }
//             ]
//           },
//           {
//             $set: {
//               'travelExpenseData.expenseAmountStatus.totalCashAmount': totalCashAmount,
//                'travelExpenseData.expenseAmountStatus.totalAlreadyBookedExpenseAmount':totalAlreadyBookedExpenseAmount,
//                'travelExpenseData.expenseAmountStatus.totalExpenseAmount' : expenseAmountStatus,
//                'travelExpenseData.expenseAmountStatus.totalremainingCash' : totalremainingCash,
//                'travelExpenseData.expenseAmountStatus.totalPersonalExpenseAmount' : totalPersonalExpenseAmount
               
//             }
//           },
//           { new: true } 
//         );
             

  // totalRemainingCash  replace with  it in mongodb and delete expense line completely.


  // add a line item, adding cash advance amount, 

  // const payload = {...expenseReport};
  // const needConfirmation = true;
  // const source = 'travel-expense'
  // const onlineVsBatch = 'online';

  // await sendTravelExpenseToDashboardQueue(payload, needConfirmation, onlineVsBatch, source);

export { 
  getExpenseRelatedHrData,
  getRejectedReport,
  getRejectionReasons,
  getTravelExpenseReport,
  onSubmitExpenseHeader,
  onSaveAsDraftExpenseHeader,
  cancelAtHeaderLevelForAReport,
  cancelAtLine,
};
