// export const BookExpenseReport = async (req, res) => {
//   try {
//       const { tenantId, empId, tripId } = req.params;
//       console.log('Params:', tenantId, empId, tripId);

//       const expenseReport = await Expense.findOne({
//           'tenantId': tenantId,
//           'tripId': tripId,
//           $or: [
//               { 'travelRequestData.createdBy.empId': empId },
//               { 'travelRequestData.createdFor.empId': empId },
//           ],
//       });

//       console.log('Expense Report:', expenseReport);

//       if (!expenseReport) {
//           return res.status(404).json({ message: 'expenseReport not found' });
//       }

//       // get additional details from HRMaster
//       let additionalDetails;
//       try {
//              additionalDetails = await getExpenseRelatedHrData(tenantId, res);
//          } catch (error) {
//              console.error('Error in getExpenseRelatedHrData:', error);
//              return res.status(500).json({ message: 'Server error' });
//          }

//          const { defaultCurrency, travelAllocationFlags, travelAllocations, expenseCategoryNames, expenseSettlementOptions } = additionalDetails;

//       const { tripNumber,tenantName, companyName, travelRequestData: { tripPurpose, approvers } } = expenseReport;
//       let expenseHeaderNumber = expenseReport?.travelExpenseData?.[0]?.expenseHeaderNumber;
       
//       const approversNames = approvers.map(({empId, name}) => ({empId,name}))

//       if (expenseHeaderNumber) {
//           await allExpenseReports(expenseReport);
  
//           return res.status(200).json({
//               tripId,
//               tripNumber,
//               tripPurpose,
//               newExpenseReport: false,
//               newExpenseReport: expenseHeaderNumber,
//               alreadyBookedExpense,
//               totalExpenseAmount,
//               totalAlreadyBookedExpense,
//               totalCashAmount,
//               remainingCash: currentRemainingCash,
//               companyDetails: currentCompanyDetails,
//               expenseAmountStatus,
//           });
//       } else {
//           const maxIncrementalValue = await Expense.findOne({}, 'travelExpenseData.expenseHeaderNumber')
//               .sort({ 'travelExpenseData.expenseHeaderNumber': -1 })
//               .limit(1);

//           let nextIncrementalValue = 0;

//           if (maxIncrementalValue && maxIncrementalValue.travelExpenseData && maxIncrementalValue.travelExpenseData.expenseHeaderNumber) {
//               nextIncrementalValue = parseInt(maxIncrementalValue.travelExpenseData.expenseHeaderNumber.substring(9), 10) + 1;
//           }

//           expenseHeaderNumber = generateIncrementalNumber(tenantId, nextIncrementalValue);

//           // expense header Number
//           expenseReport.travelExpenseData.expenseHeaderNumber = expenseHeaderNumber;

//           // Already booked expense reference directly
//           const alreadyBookedExpense = expenseReport.travelRequestData?.itinerary;

//           // total amount from already booked expenses
//           let currentTotalExpenseAmount = 0;
//           let currentTotalAlreadyBookedExpense = 0;

//           for (const key in alreadyBookedExpense) {
//               if (Object.prototype.hasOwnProperty.call(alreadyBookedExpense, key)) {
//                   const array = alreadyBookedExpense[key];
//                   const totalAmounts = array.map(obj => obj.bookingDetails?.billDetails?.totalAmount || 0);
//                   const totalAmount = totalAmounts.reduce((total, amount) => total + amount, 0);
//                   currentTotalExpenseAmount += totalAmount;
//                   currentTotalAlreadyBookedExpense = currentTotalExpenseAmount;
//               }
//           }

//           // const totalAmount = Array.isArray(alreadyBookedExpense)
//           // .flatMap(array => array.map(obj => obj.bookingDetails?.billDetails?.totalAmount || 0))
//           // .reduce((total, amount) => total + amount, 0);
        
//           // currentTotalExpenseAmount += totalAmount;
//           // currentTotalAlreadyBookedExpense = currentTotalExpenseAmount;

//           // if cash advance taken
//           let currentTotalcashAdvance = 0;
//           let currentRemainingCash = 0;
//           const isCashAdvanceTaken = expenseReport.travelRequestData?.isCashAdvanceTaken;
//           const cashAdvanceData = expenseReport?.cashAdvancesData ;

//           if (isCashAdvanceTaken) {
//               const cashAdvanceResult = await calculateTotalCashAdvances(cashAdvanceData, res);

//               currentTotalcashAdvance += cashAdvanceResult.totalPaid.reduce((total, item) => total + item.amount, 0);
//               // important - here -- No expense is booked so ,  total remaining cash advance is equal to total cash advance taken
//               currentRemainingCash = currentTotalcashAdvance;

//               const newTravelExpenseReport = await Expense.findOneAndUpdate(
//                   { tenantId, tripId }, 
//                   {
//                     $push: {
//                       expenseAmountStatus: {
//                           totalCashAmount: isCashAdvanceTaken ? currentTotalcashAdvance : 0,
//                           totalAlreadyBookedExpenseAmount: currentTotalAlreadyBookedExpense,
//                           totalExpenseAmount: currentTotalExpenseAmount,
//                           totalremainingCash: isCashAdvanceTaken ? currentTotalcashAdvance : 0,
//                         },
//                       travelExpenseData: {
//                         tenantId,
//                         tenantName,
//                         companyName,
//                         travelRequestId,
//                         travelRequestNumber,
//                         expenseHeaderNumber,
//                         expenseHeaderType: "travel",
//                         travelAllocationFlags,
//                         alreadyBookedExpenseLines:alreadyBookedExpens,
//                         approvers:approversNames,
//                   }
//               }
//             },
//             { new: true } 
//           );

//           if(newTravelExpenseReport){
//               return res.status(200).json({success:true,newTravelExpenseReport,
//               additionalDetails,
              
//               })
//           }
//           }

//           return res.status(200).json({
//               tripId,
//               tripNumber,
//               tripPurpose,
//               newExpenseReport: true,
//               expenseReportNumber: expenseHeaderNumber,
//               alreadyBookedExpense,
//               totalExpenseAmount : currentTotalExpenseAmount,
//               totalAlreadyBookedExpense: currentTotalAlreadyBookedExpense,
//               isCashAdvanceTaken: isCashAdvanceTaken,
//               totalCashAmount: currentTotalcashAdvance,
//               remainingCash: currentRemainingCash,
//               companyDetails: additionalDetails,
//           });
//       }  
//   } catch (error) {
//       console.error('Error:', error);
//       return res.status(500).json({ message: 'Internal Server Error' });
//   }
