import HRMaster from "../../models/hrCompanySchema.js";
import Reimbursement from "../../models/reimbursementSchema.js";
import Expense from "../../models/tripSchema.js";

export const currencyConverter = async (tenantId, currencyName, totalAmount) => {
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
      return { defaultCurrency, conversionPrice };
      
  } catch (error) {
      console.error('Currency conversion error:', error.message);
      throw new Error(`Currency conversion failed: ${error.message}`);
  }
};


// const calculateTotalCashAdvances = async (tenantId, cashAdvancesData) => {
//   const totalCashAdvances = { totalPaid: [], totalUnpaid: [] , totalRecovered:[] };

//   try {
//       // Validate input
//       if (!Array.isArray(cashAdvancesData) || cashAdvancesData.length === 0) {
//           throw new Error('Invalid input: cashAdvancesData should be a non-empty array');
//       }

//       for (const cashAdvance of cashAdvancesData) {
//           const { amountDetails, cashAdvanceStatus } = cashAdvance;

//           if (!Array.isArray(amountDetails)) {
//               throw new Error('Invalid amountDetails structure; expected an array');
//           }

//           for (const detail of amountDetails) {
//               const { amount, currency } = detail;
//               console.info(`Valid amount: ${amount} in cash advance: ${JSON.stringify(detail, null, 2)}`);

//               if (typeof amount !== 'number' || isNaN(amount)) {
//                   throw new Error(`Invalid amount: ${amount} in cash advance: ${JSON.stringify(detail, null, 2)}`);
//               }

//               const { defaultCurrency, conversionPrice } = await currencyConverter(tenantId, currency.shortName, amount);

//               let convertedAmount;
//               if (currency.shortName === defaultCurrency.shortName) {
//                   convertedAmount = amount; // No conversion needed
//               } else {
//                   convertedAmount = amount * conversionPrice; // Perform conversion
//               }

//               // Determine the target array based on the status
//               const targetArray = cashAdvanceStatus === 'paid' ? totalCashAdvances.totalPaid : totalCashAdvances.totalUnpaid;

//               // Find or create entry for the currency in totalPaid
//               let existingTotal = targetArray.find(item => item.currency.shortName === defaultCurrency.shortName);

//               if (!existingTotal) {
//                   existingTotal = { currency: { ...defaultCurrency }, amount: 0 }; 
//                   targetArray.push(existingTotal);
//               }

//               // Add the converted amount to the existing total
//               console.log(`Adding ${convertedAmount} to existing total: ${existingTotal.amount}`);
//               existingTotal.amount += convertedAmount; 
//           }
//       }

//       console.log("totalCashAdvances - ", JSON.stringify(totalCashAdvances, null, 2));
//       console.log("totalCashAdvances", JSON.stringify(totalCashAdvances.totalPaid[0].amount,'',2))

//       const getTotalCashAdvances = totalCashAdvances.totalPaid[0].amount

//       return getTotalCashAdvances;

//   } catch (error) {
//       console.error('Error calculating total cash advances:', error.message);
//       throw new Error(`Calculation error: ${error.message}`); 
//   }
// };

const calculateTotalCashAdvances = async (tenantId, cashAdvancesData) => { 
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



const settleOrRecoverCashAdvance = async (payload) => {
  try {
    const { tenantId, travelRequestId, cashAdvanceId, paidBy ,cashAdvanceStatus,paidFlag,
        recoveredBy,recoveredFlag,
    } = payload;

    const report = await Expense.findOne(
      { 
        tenantId,
        'cashAdvancesData': { $elemMatch: { travelRequestId } }
        // 'cashAdvancesData': { $elemMatch: { cashAdvanceId,travelRequestId } }
      },)

      console.log("report", JSON.stringify(report,'',2))

      const { expenseAmountStatus,cashAdvancesData,} = report
      const isCash = cashAdvancesData.find(c => c.cashAdvanceId.toString() === cashAdvanceId.toString())

      if(isCash){
        
      }

    console.log("settle ca payload", payload)
    const updateCashDoc = {
        'cashAdvancesData.$.cashAdvanceStatus': cashAdvanceStatus, 
    }

    if(paidBy !== undefined && paidFlag !== undefined){
      updateCashDoc['cashAdvancesData.$.paidBy'] = paidBy,
      updateCashDoc['cashAdvancesData.$.paidFlag'] = paidFlag
    }

    if(recoveredBy !== undefined && recoveredFlag !== undefined){
      updateCashDoc['cashAdvancesData.$.recoveredBy'] = recoveredBy,
      updateCashDoc['cashAdvancesData.$.recoveredFlag'] = recoveredFlag
    }

    const trip = await Expense.findOneAndUpdate(
      { 
        tenantId,
        'cashAdvancesData': { $elemMatch: { cashAdvanceId,travelRequestId } }
      },
      { 
        $set: updateCashDoc
      },
      { new: true }
    );

    if(!trip){
    throw new Error('cash advance status change to paid failed : while updating db')
    }
    console.log('Travel request status updated in approval microservice:', trip);
    return { success: false, error: null };
  } catch (error) {
    console.error('Failed to update travel request status in approval microservice:', error.message);
    return { success: false, error: error.message };
  }
};


//travel expense header 'paid'
// at line item level also update status of lineItem as paid.
const settleExpenseReport= async (payload) => {
  try {
      const {  tenantId,travelRequestId, expenseHeaderId, settlementBy, expenseHeaderStatus, 
        settlementDate } = payload;
  
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
        }
      },
      { arrayFilters,new: true }
    );

    console.log('Travel request status updated in approval microservice:', JSON.stringify(trip,'',2));
    return { success: true, error: null };
  } catch (error) {
    console.error('Failed to update travel request status in approval microservice:', error);
    return { success: false, error: error };
  }
};


const settleExpenseReportPaidAndDistributed= async (payload) => {
    try {
      const { tenantId, expenseHeaderId, tripId, paidBy, } = payload;
  
      const trip = await Expense.findOneAndUpdate(
        { 
          tenantId,
          tripId,
          'travelExpenseData': { $elemMatch: {'expenseHeaderId': expenseHeaderId } }
        },
        { 
          $set: { 
            'travelExpenseData.$.expenseHeaderStatus': 'paid and distributed', 
            'travelExpenseData.$.paidBy': paidBy ?? '', 
          }
        },
        { new: true }
      );
  
      console.log('Travel request status updated in approval microservice:', trip);
      return { success: true, error: null };
    } catch (error) {
      console.error('Failed to update travel request status in approval microservice:', error);
      return { success: false, error: error };
    }
};


// export const settleNonTravelExpenseReport= async (payload) => {
//   try {
//       const {  tenantId, expenseHeaderId, settlementBy, expenseHeaderStatus, 
//         settlementDate } = payload;
// let name 
// let empId
//         if (settlementBy) {
//           let { name, empId } = settlementBy;
//           console.log(`Settled by: ${name}, empId: ${empId}`);
//         } else {
//           console.error('settlementBy is undefined for one of the settlements');
//         }

//         console.log("non travel settlement", payload)
//         const status = {
//           PENDING_SETTLEMENT: 'pending settlement',
//           PAID: 'paid',
//           APPROVED:'approved'
//         };
        
//         const filter = {
//           tenantId,
//           expenseHeaderId,
//           // 'expenseHeaderStatus': status.PENDING_SETTLEMENT,
//         };
        
//         // Use findOneAndUpdate to find and update in one operation
//         const updateResult = await Reimbursement.findOne(
//           filter,
//         );

//         if(!updateResult){
//           throw new Error('non travel expense report not found in dashboard ms')
//         }

//         const {expenseLines} = updateResult

//         const updatedExpenseLines = expenseLines.map((line) => {
//           if(line.lineItemStatus == status.APPROVED){
//             return{
//               ...line,
//               lineItemStatus: status.PAID,
//               actionedUpon:true,
//               settlementBy: {name,empId},
//               expenseSettledDate:settlementDate,
//             }
//           }
//           return line
//         })

//         updateResult.expenseLines = updatedExpenseLines
//         updateResult.settlementBy = settlementBy
//         updateResult.expenseHeaderStatus = expenseHeaderStatus
//         updateResult.settlementDate = settlementDate
//         updateResult.actionedUpon = true
        
//       const report =  await updateResult.save()
//     console.log('Travel request status updated in expense microservice:', JSON.stringify(report,'',2));
//     const {expenseHeaderStatus:getStatus} = report

//     if(getStatus === status.PAID){
//       return { success: true, error: null };
//     }
//     return { success: false, error:`non Travel expense report has ${getStatus} as expenseHeaderStatus` };
//   } catch (error) {
//     console.error('Failed to update travel request status in expense microservice:', error);
//     return { success: false, error: error.message };
//   }
// };

const settleNonTravelExpenseReport = async (payload) => {
  try {
    const {
      tenantId,
      expenseHeaderId,
      settlementBy,
      expenseHeaderStatus,
      settlementDate,
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

    const report = await updateResult.save();
    console.log('Travel request status updated in expense microservice:', JSON.stringify(report, '', 2));
    const { expenseHeaderStatus: getStatus } = report;

    if (getStatus === status.PAID) {
      return { success: true, error: null };
    }
    return { success: false, error: `Non-travel expense report has ${getStatus} as expenseHeaderStatus` };
  } catch (error) {
    console.error('Failed to update travel request status in expense microservice:', error);
    return { success: false, error: error.message };
  }
};




export {
  settleOrRecoverCashAdvance,
  settleExpenseReport,
  settleNonTravelExpenseReport,
  settleExpenseReportPaidAndDistributed,
  calculateTotalCashAdvances
}