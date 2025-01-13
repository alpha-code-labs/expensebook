import HRMaster from "../../models/hrCompanySchema.js";
import Reimbursement from "../../models/reimbursementSchema.js";
import Expense from "../../models/tripSchema.js";

const currencyConverter = async (tenantId, currencyName, totalAmount) => {
  try {
      console.log("currencyName:", currencyName, "totalAmount:", totalAmount);

      // Input validation
      if (!currencyName || totalAmount === undefined) {
          throw new Error('Currency name and total amount are required');
      }

      const hrDocument = await HRMaster.findOne({ tenantId });
      if (!hrDocument) {
          throw new Error('Tenant not found');
      }

      const { multiCurrencyTable } = hrDocument;
      const { defaultCurrency, exchangeValue } = multiCurrencyTable;

      // Check if the requested currency is the default currency
      const currencyNameInUpperCase = currencyName.toUpperCase();
      if (defaultCurrency?.shortName?.toUpperCase() === currencyNameInUpperCase) {
          return { defaultCurrency };
      }

      // Find the conversion rate for the specified currency
      const foundCurrency = exchangeValue.find(currency => currency.currency.shortName.toUpperCase() === currencyNameInUpperCase);
      if (!foundCurrency) {
          throw new Error('Currency not available for conversion');
      }

      const conversionPrice = foundCurrency.value;
      console.log("currency converter output",defaultCurrency, conversionPrice )
      return { defaultCurrency, conversionPrice };
      
  } catch (error) {
      console.error('Currency conversion error:', error.message);
      throw new Error(`Currency conversion failed: ${error.message}`);
  }
};


const calculateTotalCashAdvances = async (tenantId, cashAdvancesData,) => { 
  const totalCashAdvances = { totalPaid: [], totalRecovered: [] };

  try {
      // Validate input
      if (!Array.isArray(cashAdvancesData) || cashAdvancesData.length === 0) {
          throw new Error('Invalid input: cashAdvancesData should be a non-empty array');
      }

      for (const cashAdvance of cashAdvancesData) {
          const { amountDetails, cashAdvanceStatus } = cashAdvance;

          if (!Array.isArray(amountDetails)) {
              throw new Error('Invalid amountDetails structure; expected an array');
          }

          for (const detail of amountDetails) {
              const { amount, currency } = detail;
              console.info(`Valid amount: ${amount} in cash advance: ${JSON.stringify(detail, null, 2)}`);

              if (typeof amount !== 'number' || isNaN(amount)) {
                  throw new Error(`Invalid amount: ${amount} in cash advance: ${JSON.stringify(detail, null, 2)}`);
              }

              const { defaultCurrency, conversionPrice } = await currencyConverter(tenantId, currency.shortName, amount);

              let convertedAmount;
              if (currency.shortName === defaultCurrency.shortName) {
                  convertedAmount = amount; // No conversion needed
              } else {
                  convertedAmount = amount * conversionPrice; // Perform conversion
              }

              // Determine the target array based on the status
              let targetArray;
              if (cashAdvanceStatus === 'paid') {
                  targetArray = totalCashAdvances.totalPaid;
              } else if (cashAdvanceStatus === 'recovered') {
                  targetArray = totalCashAdvances.totalRecovered;
              } else {
                  continue;
              }

              // Find or create entry for the currency in the respective target array
              let existingTotal = targetArray.find(item => item.currency.shortName === defaultCurrency.shortName);

              if (!existingTotal) {
                  existingTotal = { currency: { ...defaultCurrency }, amount: 0 }; 
                  targetArray.push(existingTotal);
              }

              // Add the converted amount to the existing total
              console.log(`Adding ${convertedAmount} to existing total: ${existingTotal.amount}`);
              existingTotal.amount += convertedAmount; 
          }
      }

      console.log("totalCashAdvances - ", JSON.stringify(totalCashAdvances, null, 2));

      // Returning the total amount of paid cash advances
      const totalPaidAmount = totalCashAdvances.totalPaid.reduce((sum, item) => sum + item.amount, 0);
      const totalRecovered = totalCashAdvances.totalRecovered.reduce((sum, item) => sum + item.amount, 0);
      const totalCashAdvancePaid = +totalPaidAmount - +totalRecovered
      return totalCashAdvancePaid;

  } catch (error) {
      console.error('Error calculating total cash advances:', error.message);
      throw new Error(`Calculation error: ${error.message}`); 
  }
};

const updatePaidStatusInCash = (cashAdvancesData, update) => {
  const { cashAdvanceId, ...updateFields } = update;

  const updatedCashAdvances = cashAdvancesData.map((cashAdvance) => {
    if (cashAdvance.cashAdvanceId.toString() === cashAdvanceId.toString()) {
      console.log(`Updating cash advance with ID: ${cashAdvanceId}`);
      return { ...cashAdvance, ...updateFields };
    }
    return cashAdvance; 
  });

  return updatedCashAdvances; 
};


const settleOrRecoverCashAdvance = async (payload) => {
  const { 
    tenantId, 
    travelRequestId, 
    cashAdvanceId, 
    paidBy,
    cashAdvanceStatus,
    paidFlag,
    recoveredBy,
    recoveredFlag,
    settlementDetails
  } = payload;

  const update = {
    cashAdvanceId,
    paidBy, 
    cashAdvanceStatus,
    recoveredBy,
    settlementDetails
  }

  console.group("Cash Advance Paid")
  console.log("Cash paid kaboom", payload)
  console.groupCollapsed("Cash Advance logic");
  try {
    const report = await Expense.findOne(
      { 
        tenantId,
        'cashAdvancesData.travelRequestId': travelRequestId
      },
      { expenseAmountStatus: 1, cashAdvancesData: 1 }
    ).lean();

    if (!report) {
      throw new Error('Expense report not found');
    }

    const { expenseAmountStatus, cashAdvancesData } = report;
    if(!cashAdvancesData?.length){
      return { success: false, error: "cashAdvanceData is not an array in expense ms" };
    }
    const cashAdvance = cashAdvancesData.find(c => c.cashAdvanceId.toString() === cashAdvanceId.toString());

    if (!cashAdvance) {
      throw new Error('Cash advance not found');
    }

    const newCashAdvanceData = await updatePaidStatusInCash(cashAdvancesData,update)
    const totalCashAmount = await calculateTotalCashAdvances(tenantId, newCashAdvanceData);

    const { totalCashAmount: currentTotalCashAmount, totalRemainingCash: currentTotalRemainingCash } = expenseAmountStatus;

    const updateCashAmounts = (current, total,remaining) => {
      const difference = total - current
      const updatedTotalCashAmount = current + difference;
      const updatedTotalRemainingCash = remaining === 0 ? difference : difference + remaining

      return {
        updatedTotalCashAmount,
        updatedTotalRemainingCash
      };
    };

    const { updatedTotalCashAmount, updatedTotalRemainingCash } = updateCashAmounts(
      Number(currentTotalCashAmount), 
      Number(totalCashAmount),
      Number(currentTotalRemainingCash)
    );

    const updatedTrip = await Expense.findOneAndUpdate(
      {
        tenantId,
        cashAdvancesData: {
          $elemMatch: {
            cashAdvanceId: cashAdvanceId.toString(),
            travelRequestId: travelRequestId.toString(),
          },
        },
      },
      {
        $set: {
          'expenseAmountStatus.totalCashAmount': updatedTotalCashAmount,
          'expenseAmountStatus.totalRemainingCash': updatedTotalRemainingCash,
          'cashAdvancesData.$[elem].cashAdvanceStatus': payload.cashAdvanceStatus,
          'cashAdvancesData.$[elem].paidBy':payload.paidBy,
          'cashAdvancesData.$[elem].recoveredBy': payload.recoveredBy,
          'cashAdvancesData.$[elem].settlementDetails': payload.settlementDetails,

        },
      },
      {
        new: true, 
        arrayFilters: [
          { 
            'elem.cashAdvanceId': cashAdvanceId.toString(),
            'elem.travelRequestId': travelRequestId.toString(),
          },
        ],
        runValidators: true, 
      }
    );
    
    if (!updatedTrip) {
      throw new Error(
        `Failed to update cash advance status for cashAdvanceId: ${cashAdvanceId}, travelRequestId: ${travelRequestId}, tenantId: ${tenantId}`
      );
    }

    const checkCashAdvanceStatus = (cashAdvancesData, cashAdvanceId, travelRequestId, payload) => {
      const cashAdvance = cashAdvancesData.find(
        (c) =>
          c.cashAdvanceId.toString() === cashAdvanceId.toString() 
      );
    
      if (!cashAdvance) {
        return {
          success: false,
          error: `Cash advance with ID: ${cashAdvanceId} and travelRequestId: ${travelRequestId} not found.`,
        };
      }
    
      if (cashAdvance.cashAdvanceStatus === payload.cashAdvanceStatus) {
        return {
          success: true,
          error: null,
          message: `Cash advance status updated successfully for ID: ${cashAdvanceId}, travelRequestId: ${travelRequestId}`,
        };
      } else {
        return {
          success: false,
          error: `Mismatch in status for cashAdvanceId: ${cashAdvanceId}, travelRequestId: ${travelRequestId}. Expected: ${payload.cashAdvanceStatus}, Found: ${cashAdvance.status}`,
        };
      }
    };
    
    const result = checkCashAdvanceStatus(
      updatedTrip.cashAdvancesData,
      cashAdvanceId,
      travelRequestId,
      payload
    );
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    return result;

  } catch (error) {
    console.error('Error in settleOrRecoverCashAdvance:', error);
    return { success: false, error: error.message };
  }
};


const settleExpenseReport= async (payload) => {
  try {
      const {  tenantId,travelRequestId, expenseHeaderId, settlementBy, expenseHeaderStatus, 
        settlementDate,settlementDetails } = payload;
  
        console.log("settle travel expense",{payload})
        const status = {
          PENDING_SETTLEMENT: 'pending settlement',
          PAID: 'paid',
          APPROVED:'approved'
        };

        const arrayFilters = [
          {'elem.expenseHeaderId': expenseHeaderId },
          {'lineItem.lineItemStatus':status.APPROVED}
        ];
    const trip = await Expense.findOneAndUpdate(
      { 
        'tenantId': tenantId,
        'travelExpenseData': { $elemMatch: { travelRequestId, expenseHeaderId } }
      },
      { 
        $set: { 
          'travelExpenseData.$[elem].expenseHeaderStatus': expenseHeaderStatus, 
          'travelExpenseData.$[elem].settlementDate': settlementDate,
          'travelExpenseData.$[elem].settlementBy': settlementBy,
          'travelExpenseData.$[elem].settlementDate': new Date(),
          'travelExpenseData.$[elem].expenseLines.$[lineItem].lineItemStatus': status.PAID,
        },
        $push:{
          'travelExpenseData.$[elem].settlementDetails': settlementDetails
        }
      },
      { arrayFilters,new: true }
    );

    console.log('Travel request status updated in Expense microservice:', JSON.stringify(trip,'',2));
    return { success: true, error: null };
  } catch (error) {
    console.error('Failed to update travel request status in Expense microservice:', error);
    return { success: false, error: error };
  }
};


const settleNonTravelExpenseReport = async (payload) => {
  try {
    const {
      tenantId,
      expenseHeaderId,
      settlementBy,
      expenseHeaderStatus,
      settlementDate,
      settlementDetails
    } = payload;

    let name, empId;

    if (settlementBy) {
      // Destructure only if settlementBy is defined
      ({ name, empId } = settlementBy);
      console.log(`Settled by: ${name}, empId: ${empId}`);
    } else {
      console.error('settlementBy is undefined for one of the settlements');
      // Handle this case if needed, e.g., throw an error
      throw new Error('settlementBy is undefined');
    }

    console.log("Non-travel settlement", payload);
    const status = {
      PENDING_SETTLEMENT: 'pending settlement',
      PAID: 'paid',
      APPROVED: 'approved',
    };

    const filter = {
      tenantId,
      expenseHeaderId,
      // 'expenseHeaderStatus': status.PENDING_SETTLEMENT,
    };

    // Use findOne to find the document
    const updateResult = await Reimbursement.findOne(filter);

    if (!updateResult) {
      throw new Error('Non-travel expense report not found in dashboard MS');
    }

    const { expenseLines } = updateResult;

    const updatedExpenseLines = expenseLines.map((line) => {
      if (line.lineItemStatus === status.APPROVED) {
        return {
          ...line,
          lineItemStatus: status.PAID,
          actionedUpon: true,
          settlementBy: { name, empId },
          expenseSettledDate: settlementDate,
        };
      }
      return line;
    });

    updateResult.expenseLines = updatedExpenseLines;
    updateResult.settlementBy = settlementBy; // This can be set without issue as settlementBy is checked
    updateResult.expenseHeaderStatus = expenseHeaderStatus;
    updateResult.settlementDate = settlementDate;
    updateResult.actionedUpon = true;

    if(Array.isArray(settlementDetails) && settlementDetails.length > 0){
      updateResult.settlementDetails = settlementDetails
    }

    const report = await updateResult.save();
    console.log('Travel request status updated in expense microservice:', JSON.stringify(report, '', 2));
    const { expenseHeaderStatus: getStatus } = report;

    if (getStatus === status.PAID) {
      return { success: true, error: null };
    }
    return { success: true, error: `Non-travel expense report has ${getStatus} as expenseHeaderStatus` };
  } catch (error) {
    console.error('Failed to update travel request status in expense microservice:', error);
    return { success: false, error: error.message };
  }
};




export {
  currencyConverter,
  settleOrRecoverCashAdvance,
  settleExpenseReport,
  settleNonTravelExpenseReport,
  calculateTotalCashAdvances
}





























// const updateCashAmounts = (current, total,remaining) => {
//   const difference = Math.abs(total - current);
//   const updatedTotal = current < total ? current + difference : current - difference;
//   return {
//     updatedTotalCashAmount: updatedTotal,
//     updatedTotalRemainingCash: updatedTotal === 0 ? 0 : updatedTotal
//   };
// };

// const { updatedTotalCashAmount, updatedTotalRemainingCash } = updateCashAmounts(
//   Number(currentTotalCashAmount), 
//   Number(totalCashAmount),
//   Number(currentTotalRemainingCash)
// );













const testCalculateTotalCashAdvances = async (tenantId, cashAdvancesData) => {
  if (!Array.isArray(cashAdvancesData) || cashAdvancesData.length === 0) {
    throw new Error('Invalid input: cashAdvancesData should be a non-empty array');
  }

  const conversionCache = new Map();
  const getConversionRate = async (currency) => {
    if (!conversionCache.has(currency)) {
      const { defaultCurrency, conversionPrice } = await currencyConverter(tenantId, currency, 1);
      conversionCache.set(currency, { defaultCurrency, conversionPrice });
    }
    return conversionCache.get(currency);
  };

  const totals = await cashAdvancesData.reduce(async (accPromise, { amountDetails, cashAdvanceStatus }) => {
    const acc = await accPromise;
    if (!Array.isArray(amountDetails)) {
      throw new Error('Invalid amountDetails structure; expected an array');
    }

    const convertedAmounts = await Promise.all(amountDetails.map(async ({ amount, currency }) => {
      if (typeof amount !== 'number' || isNaN(amount)) {
        throw new Error(`Invalid amount: ${amount} in cash advance`);
      }

      const { defaultCurrency, conversionPrice } = await getConversionRate(currency.shortName);
      return currency.shortName === defaultCurrency.shortName ? amount : amount * conversionPrice;
    }));

    const total = convertedAmounts.reduce((sum, amount) => sum + amount, 0);
    acc[cashAdvanceStatus] = (acc[cashAdvanceStatus] || 0) + total;
    return acc;
  }, Promise.resolve({}));

  return (totals.paid || 0) - (totals.recovered || 0);
};

const testSettleOrRecoverCashAdvance = async (payload) => {
  try {
    const { 
      tenantId, 
      travelRequestId, 
      cashAdvanceId, 
      paidBy,
      cashAdvanceStatus,
      paidFlag,
      recoveredBy,
      recoveredFlag
    } = payload;

    const report = await Expense.findOne(
      { 
        tenantId,
        'cashAdvancesData': { $elemMatch: { cashAdvanceId, travelRequestId } }
      },
      { cashAdvancesData: 1, expenseAmountStatus: 1 }
    );

    if (!report) {
      throw new Error('Expense report not found');
    }

    const totalCashAmount = await calculateTotalCashAdvances(tenantId, report.cashAdvancesData);

    const updateCashDoc = {
      'cashAdvancesData.$.cashAdvanceStatus': cashAdvanceStatus,
      ...(paidBy && { 'cashAdvancesData.$.paidBy': paidBy, 'cashAdvancesData.$.paidFlag': paidFlag }),
      ...(recoveredBy && { 'cashAdvancesData.$.recoveredBy': recoveredBy, 'cashAdvancesData.$.recoveredFlag': recoveredFlag }),
      'expenseAmountStatus.totalCashAmount': totalCashAmount,
      'expenseAmountStatus.totalRemainingCash': Math.max(totalCashAmount, 0)
    };

    const updatedTrip = await Expense.findOneAndUpdate(
      { 
        tenantId,
        'cashAdvancesData': { $elemMatch: { cashAdvanceId, travelRequestId } }
      },
      { $set: updateCashDoc },
      { new: true, runValidators: true }
    );

    if (!updatedTrip) {
      throw new Error('Failed to update cash advance status');
    }

    return { success: true, data: updatedTrip };
  } catch (error) {
    console.error('Error in settleOrRecoverCashAdvance:', error);
    return { success: false, error: error.message };
  }
};