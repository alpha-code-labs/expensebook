//Total cash advance 
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

const calculateTotalExpenseAmount = (itinerary) => {
    const totalCashAdvances = { totalPaid: [], totalUnpaid: [] };

    itinerary.forEach(item => {
        const { amountDetails, cashAdvanceStatus } = item;

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


const reqBodyOnSave = {
    expenseHeaderNumber: "ERTNT000000",
    "expenseAmountStatus": {
        "totalCashAmount": 8000,
        "totalAlreadyBookedExpenseAmount": 107226,
        "totalExpenseAmount": 107226,
        "totalPersonalExpenseAmount": 0,
        "totalremainingCash": 8000
    },
    expenseLine: {
      expenseAllocation: [
        {
          headerName: "Travel",
          headerValues: ["Hotel"],
        },
      ],
      expenseAllocation_accountLine: "Account456",
      expenseCategory: {
            categoryName: "Hotel",
            fields: [
              { name: "Hotel Name", value: "Deluxe Inn" },
              { name: "City",  value: "Delhi" },
              { name: "Tax amount",  value: 200 },
              { name: "Total amount",  value: 2200 },
              { name: "Guest name", value: "Dwayne" },
              { name: "Booking Reference No.",  value: "ABC123456" },
              { name: "Payment Method",  value: "Credit Card" },
            ],
            modeOfTranfer: false,
            class: "4 star",
       },
    isPersonalExpense: true,
    personalExpenseAmount: 200,
    nonPersonalExpenseAmount: 2000,
    billImageUrl: "https://example.com/another-bill-image.jpg",
    },
}
   
  

const BookExpenseReport = async (req, res) => {
    try {
      // Destructuring the parameters from the request object
      const { tenantId, empId, tripId } = req.params;
      console.log('Params:', tenantId, empId, tripId);

     // Retrieving the expense report based on specified conditions
     const expenseReport = await Expense.findOne({
      tenantId,
      "tripId":tripId,
      $or: [
        { 'travelRequestData.createdBy.empId': empId },
        { 'travelRequestData.createdFor.empId': empId },
      ],
     });
  
      // Handling the case when no expense report is found
      if (!expenseReport) {
        return res.status(404).json({ message: 'expenseReport not found' });
      }
  
      // Getting additional details from HRMaster
      let additionalDetails;
      try {
        additionalDetails = await getExpenseRelatedHrData(tenantId, res);
        // const travelAllocationFlags = {}
        // additionalDetails = {travelAllocationFlags};
      } catch (error) {
        console.error('Error in getExpenseRelatedHrData:', error);
        return res.status(500).json({ message: 'Server error' });
      }
  
      // Destructuring additional details
      const { defaultCurrency, travelAllocationFlags,expenseAllocation, expenseAllocation_accountLine,  expenseCategoryNames, expenseSettlementOptions } = additionalDetails;
  
      // Destructuring properties from the expense report
      const { tripNumber, tenantName, companyName, travelRequestData: { travelRequestId, travelRequestNumber, tripPurpose, approvers } } = expenseReport;
      let expenseHeaderNumber = expenseReport?.travelExpenseData?.[0]?.expenseHeaderNumber;
  
      const approversNames = approvers.map(({ empId, name }) => ({ empId, name }));
  
      // Handling the case when expenseHeaderNumber is present
      if (expenseHeaderNumber) {
       const allExpenseReportsList = await allExpenseReports(expenseReport);
    //    console.log(" all expense reports", allExpenseReportsList)
       const {  entireExpenseReport, flagToOpen} = allExpenseReportsList
       const{expenseAmountStatus,travelExpenseData } =  entireExpenseReport
        return res.status(200).json({
          success: true,
          tripId,
          tripNumber,
          tripPurpose,
          newExpenseReport: false, 
          flagToOpen:flagToOpen ? flagToOpen : undefined,
          expenseAmountStatus,
          travelExpenseData,
          companyDetails: additionalDetails,
        });
      } else {
        const maxIncrementalValue = await Expense.findOne({}, 'travelExpenseData.expenseHeaderNumber')
          .sort({ 'travelExpenseData.expenseHeaderNumber': -1 })
          .limit(1);

        let nextIncrementalValue = 0;

        if (maxIncrementalValue && maxIncrementalValue.travelExpenseData && maxIncrementalValue.travelExpenseData.expenseHeaderNumber) {
          nextIncrementalValue = parseInt(maxIncrementalValue.travelExpenseData.expenseHeaderNumber.substring(9), 10) + 1;
        }

        expenseHeaderNumber = generateIncrementalNumber(tenantId, nextIncrementalValue);

        // Updating the expense header number in the travelExpenseData
        expenseReport.travelExpenseData.expenseHeaderNumber = expenseHeaderNumber;

        // Extracting already booked expenses
        const alreadyBookedExpense = expenseReport.travelRequestData?.itinerary;

        // Initialize total expense amount
// let currentTotalExpenseAmount = 0;

// // Iterate over each key in alreadyBookedExpense
// for (const key in alreadyBookedExpense) {
//   if (Object.prototype.hasOwnProperty.call(alreadyBookedExpense, key)) {
//     const array = alreadyBookedExpense[key];
//     const totalAmounts = array.map(obj => parseFloat(obj.bookingDetails?.billDetails?.totalAmount) || 0);
    
//     // Sum the totalAmounts to calculate total expenses for the current key
//     const totalAmountForKey = totalAmounts.reduce((total, amount) => total + amount, 0);
    
//     // Accumulate the total expenses across all keys
//     currentTotalExpenseAmount += totalAmountForKey;
//   }
// }

// // Set the total already booked expense amount outside the loop
// let currentTotalAlreadyBookedExpense = currentTotalExpenseAmount;


// Initialize total expense amount
const currentTotalExpenseAmount = Object.values(alreadyBookedExpense)
  // Map over each array and extract totalAmount from billDetails, converting to number
  .map(array =>
    array.reduce((total, obj) =>
      total + parseFloat(obj.bookingDetails?.billDetails?.totalAmount) || 0, 0))
  // Sum the totalAmounts to calculate total expenses across all keys
  .reduce((total, totalAmountForKey) => total + totalAmountForKey, 0);

  // Set the total already booked expense amount outside the loop
const currentTotalAlreadyBookedExpense = currentTotalExpenseAmount;


        // Handling cash advance details
        let currentTotalcashAdvance = 0;
        let currentRemainingCash = 0;
        const isCashAdvanceTaken = expenseReport.travelRequestData?.isCashAdvanceTaken;
        const cashAdvanceData = expenseReport?.cashAdvancesData;

        if (isCashAdvanceTaken) {
          const cashAdvanceResult = await calculateTotalCashAdvances(cashAdvanceData, res);

          currentTotalcashAdvance += cashAdvanceResult.totalPaid.reduce((total, item) => total + item.amount, 0);
          currentRemainingCash = currentTotalcashAdvance;
        }

        // Updating the expenseAmountStatus in the existing document
        expenseReport.expenseAmountStatus.totalCashAmount = isCashAdvanceTaken ? currentTotalcashAdvance : 0 ;
        expenseReport.expenseAmountStatus.totalAlreadyBookedExpenseAmount = currentTotalAlreadyBookedExpense;
        expenseReport.expenseAmountStatus.totalExpenseAmount = currentTotalExpenseAmount;
        expenseReport.expenseAmountStatus.totalremainingCash = isCashAdvanceTaken ? currentRemainingCash : 0;

        //create a expenseHeaderId
        const newExpenseHeaderId = new mongoose.Types.ObjectId();

        // Creating newTravelExpenseData object
        const newTravelExpenseData = {
          tenantId,
          tenantName,
          companyName,
          travelRequestId,
          travelRequestNumber,
          expenseHeaderNumber,
          expenseHeaderId:newExpenseHeaderId,
          expenseHeaderType: "travel",
          travelAllocationFlags,
          alreadyBookedExpenseLines: alreadyBookedExpense,
          approvers: approversNames,
        };

        // Adding newTravelExpenseData to travelExpenseData array
        expenseReport.travelExpenseData.push(newTravelExpenseData);

        // Saving the updated document
        await expenseReport.save();
         const {expenseAmountStatus,travelExpenseData} = expenseReport
        // Returning success response with relevant details
        return res.status(200).json({
          success: true,
          tripId,
          tripNumber,
          tripPurpose,
          newExpenseReport: true,
          expenseHeaderNumber,
          expenseAmountStatus,
          travelExpenseData,
        //   expenseReport,
        //   expenseAmountStatus: expenseReport.expenseAmountStatus,
        //   travelExpenseData: expenseReport.travelExpenseData,
        //   additionalDetails,
        //   alreadyBookedExpense,
        //   totalExpenseAmount: currentTotalExpenseAmount,
        //   totalAlreadyBookedExpense: currentTotalAlreadyBookedExpense,
          isCashAdvanceTaken: isCashAdvanceTaken,
        //   totalCashAmount: currentTotalcashAdvance,
        //   remainingCash: currentRemainingCash,
          companyDetails: additionalDetails,
        });
      }
    } catch (error) {
      // Handling generic errors and returning a standardized response
      console.error('Error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
};


const oldallExpenseReports = async (expenseReport) => {
  try {
      const { tenantId, tenantName, companyName, travelRequestData, travelExpenseData } = expenseReport;
      const { travelRequestId, travelRequestNumber, approvers, travelType } = travelRequestData;
      const { travelAllocationFlags } = travelExpenseData[0];
      const approverNames = approvers.map(({ empId, name }) => ({ empId, name }));
      //console.log("travelType..........", travelType)
      let flagToOpen;
      let expenseHeaderStatus; // Declare expenseHeaderStatus here


      const validPaidStatuses = ['paid', 'paid and distributed'];
      const validStatuses = ['draft', 'pending approval', 'approved', 'pending settlement', 'new'];
      
      if (Array.isArray(travelExpenseData)) {
          const areAllExpenseReportsPaid = travelExpenseData.every(report =>
              validPaidStatuses.includes(report.expenseHeaderStatus)
          );
      
          const areAllExpenseReportsValid = travelExpenseData.every(report =>
              validStatuses.includes(report.expenseHeaderStatus)
          );
      

      // if (Array.isArray(travelExpenseData)) {
      //     for (const travelExpenseReport of travelExpenseData) {
      //         expenseHeaderStatus = travelExpenseReport.expenseHeaderStatus;

      //         if (expenseHeaderStatus === 'paid' || expenseHeaderStatus === 'paid and distributed') 
      if (areAllExpenseReportsPaid) {
                  const totalExpenseReports = travelExpenseData.some(item => item.expenseHeaderStatus === expenseHeaderStatus);

                  if (totalExpenseReports) {
                      const maxIncrementalValue = await Expense.findOne({}, 'travelExpenseData.expenseHeaderNumber')
                          .sort({ 'travelExpenseData.expenseHeaderNumber': -1 })
                          .limit(1);

                      let nextIncrementalValue = 0;

                      if (maxIncrementalValue && maxIncrementalValue.travelExpenseData && maxIncrementalValue.travelExpenseData.expenseHeaderNumber) {
                          nextIncrementalValue = parseInt(maxIncrementalValue.travelExpenseData.expenseHeaderNumber.substring(9), 10) + 1;
                      }

                      let expenseHeaderNumber = generateIncrementalNumber(tenantId, nextIncrementalValue);
                      const newExpenseHeaderId = new mongoose.Types.ObjectId();
                      flagToOpen = newExpenseHeaderId;

                      // Creating newTravelExpenseData object
                      const newTravelExpenseData = {
                          tenantId,
                          tenantName,
                          companyName,
                          travelRequestId,
                          travelRequestNumber,
                          expenseHeaderNumber,
                          expenseHeaderId: newExpenseHeaderId,
                          expenseHeaderType: "travel",
                          travelAllocationFlags,
                          approvers: approverNames,
                          travelType:travelType,
                      };

                      // Adding newTravelExpenseData to travelExpenseData array
                      expenseReport.travelExpenseData.push(newTravelExpenseData);

                      // Saving the updated document
                      await expenseReport.save();

          }}
              // } else if (Array.isArray(travelExpenseData) && areAllExpenseReportsValid){
              else if (areAllExpenseReportsValid) {
                  const matchingExpenseReport = travelExpenseData.find(item => item.expenseHeaderStatus === expenseHeaderStatus);
                  console.log("matching expenseReport .........", matchingExpenseReport )
  
                  if (matchingExpenseReport) {
                      flagToOpen = matchingExpenseReport.expenseHeaderId;
                  }
              }
          } else{
            throw new Error("No expense reports found");
          }
        console.log("Returning from Array:", { expenseReport, flagToOpen });
          return { entireExpenseReport : expenseReport, flagToOpen };
      }
  catch (error) {
      console.error("An error occurred in allExpenseReports:", error.message);
      // Log the error using a logging service in production
      throw new Error('An error occurred while processing expense reports. Check logs for details.');
  }
};



const worksAllExpenseReports = async (expenseReport) => {
  try {
      const { tenantId, tenantName, companyName, travelRequestData, travelExpenseData } = expenseReport;
      const { travelRequestId, travelRequestNumber, approvers, travelType } = travelRequestData;
      const { travelAllocationFlags } = travelExpenseData[0];
      const approverNames = approvers.map(({ empId, name }) => ({ empId, name }));
// console.log("travelType..........", travelType)
      let flagToOpen;
      let expenseHeaderStatus; // Declare expenseHeaderStatus here

      if (Array.isArray(travelExpenseData)) {
          for (const travelExpenseReport of travelExpenseData) {
              expenseHeaderStatus = travelExpenseReport.expenseHeaderStatus;

              if (expenseHeaderStatus === 'paid' || expenseHeaderStatus === 'paid and distributed') {
                  const totalExpenseReports = travelExpenseData.some(item => item.expenseHeaderStatus === expenseHeaderStatus);

                  if (totalExpenseReports) {
                      const maxIncrementalValue = await Expense.findOne({}, 'travelExpenseData.expenseHeaderNumber')
                          .sort({ 'travelExpenseData.expenseHeaderNumber': -1 })
                          .limit(1);

                      let nextIncrementalValue = 0;

                      if (maxIncrementalValue && maxIncrementalValue.travelExpenseData && maxIncrementalValue.travelExpenseData.expenseHeaderNumber) {
                          nextIncrementalValue = parseInt(maxIncrementalValue.travelExpenseData.expenseHeaderNumber.substring(9), 10) + 1;
                      }

                      let expenseHeaderNumber = generateIncrementalNumber(tenantId, nextIncrementalValue);
                      const newExpenseHeaderId = new mongoose.Types.ObjectId();
                      flagToOpen = newExpenseHeaderId;

                      // Creating newTravelExpenseData object
                      const newTravelExpenseData = {
                          tenantId,
                          tenantName,
                          companyName,
                          travelRequestId,
                          travelRequestNumber,
                          expenseHeaderNumber,
                          expenseHeaderId: newExpenseHeaderId,
                          expenseHeaderType: "travel",
                          travelAllocationFlags,
                          approvers: approverNames,
                          travelType:travelType,
                      };

                      // Adding newTravelExpenseData to travelExpenseData array
                      expenseReport.travelExpenseData.push(newTravelExpenseData);

                      // Saving the updated document
                      await expenseReport.save();

                  }
              } else if (['draft', 'pending approval', 'approved', 'pending settlement', 'new'].includes(expenseHeaderStatus)) {
                  const matchingExpenseReport = travelExpenseData.find(item => item.expenseHeaderStatus === expenseHeaderStatus);
                  // console.log("matching expenseReport .........", matchingExpenseReport )
  
                  if (matchingExpenseReport) {
                      flagToOpen = matchingExpenseReport.expenseHeaderId;
                  }
              }
          }
           console.log("Returning from Array:", { expenseReport, flagToOpen });
          return { entireExpenseReport : expenseReport, flagToOpen };
      }
  } catch (error) {
      console.error("An error occurred in allExpenseReports:", error.message);
      // Log the error using a logging service in production
      throw new Error('An error occurred while processing expense reports. Check logs for details.');
  }
};
const worksOnSaveExpenseLine = async (req, res) => {
  try {
    const { tenantId, tripId, empId, expenseHeaderId } = req.params;
    const {travelType,isCashAdvanceTaken, expenseAmountStatus, expenseLine, allocations} = req.body;
    console.log("Params",req.params)
    console.log("on save req.body", req.body)
  
    const isPersonalExpense  = expenseLine?.isPersonalExpense
    const isMultiCurrency = expenseLine?.isMultiCurrency
  
    const requiredFields = ['expenseAmountStatus', 'expenseLine', 'travelType', 'allocations']
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0){
      return res.status(404).json({message: `Missing required fields:${missingFields.join(", ")}`})
    }
  
    let {totalExpenseAmount, totalPersonalExpenseAmount,totalRemainingCash} = expenseAmountStatus
    const totalAmountNames = ['Total Fare', 'Total Amount', 'Subscription cost', 'Cost', 'Premium Cost'];

    let totalAmount = extractTotalAmount(expenseLine, totalAmountNames);

    console.log("totalAmount received", totalAmount)

    //Converting to Numbers
    totalExpenseAmount = Number(totalExpenseAmount)
    totalPersonalExpenseAmount = Number(totalPersonalExpenseAmount)
    totalRemainingCash = Number(totalRemainingCash)
    totalAmount = Number(totalAmount)


    console.log("totalAmount received", totalAmount)
    // totalAmount = expenseLine['Total Amount'] ? expenseLine['Total Amount'].trim().toUpperCase() : '';
    const travelClass = expenseLine['Class of Service'] ? expenseLine['Class of Service'].trim().toUpperCase() : '';
    const categoryName = expenseLine['Category Name'] ? expenseLine['Category Name'].trim().toUpperCase() : '';
    console.log("is this key ....", totalAmount)
    let { personalExpenseAmount } = expenseLine;
    const filter = { 
      tenantId, 
      tripId,
      $or: [
        { 'travelRequestData.createdBy.empId': empId },
        { 'travelRequestData.createdFor.empId': empId },
      ],
      'travelExpenseData': {
        $elemMatch: { 'expenseHeaderId': expenseHeaderId },
      },
    }

    const expenseLineId = new mongoose.Types.ObjectId();

    if (isPersonalExpense && !isMultiCurrency)  {
      console.log("personalExpenseAmount: -........", personalExpenseAmount , "totalAmount-", totalAmount)
      if (personalExpenseAmount > totalAmount) {
        console.log("Personal expense amount cannot exceed total amount, personalExpenseAmount: -", personalExpenseAmount , "totalAmount-", totalAmount)
        return res.status(400).json({ message: "Personal expense amount cannot exceed total amount" });
      }        
      console.log("i am inside multicurrency and personal expense", isPersonalExpense, !isMultiCurrency )

      const nonPersonalExpenseAmount = totalAmount - personalExpenseAmount;
      totalExpenseAmount += nonPersonalExpenseAmount;
      totalPersonalExpenseAmount += personalExpenseAmount;
      totalRemainingCash -= nonPersonalExpenseAmount;
      expenseLine.alreadySaved = true;
      expenseLine.lineItemStatus = 'save';
      expenseLine.expenseLineId = expenseLineId;

      // if(isCashAdvanceTaken){

      // } else {

      // }
    //  const policyValidationResult = await policyValidationHr(
    //   tenantId,
    //   empId,
    //   categoryName,
    //   travelType,
    //   travelClass,
    //   totalAmount,
    //   res
    // );

    // if(policyValidationResult){
    //   return policyValidationResult
    //   console.log("policyValidationResult..........", policyValidationResult)
    // }

        const updatedExpenseReport = await Expense.findOneAndUpdate(filter,
          {
            $set: {
              'expenseAmountStatus.totalPersonalExpenseAmount': totalPersonalExpenseAmount,
              'expenseAmountStatus.totalExpenseAmount': totalExpenseAmount,
              'expenseAmountStatus.totalRemainingCash': totalRemainingCash,
              'travelExpenseData.$.allocations':allocations,
            },
            $push: {
              'travelExpenseData.$.expenseLines': expenseLine,
            },
          },
          {
            // arrayFilters: [{ 'element.expenseHeaderNumber': expenseHeaderNumber }],
            new: true, // To return the modified document
          }
        );

    if(!updatedExpenseReport){
      return res.status(404).json({message:"Expense report not found"})
    } else {
      const {travelExpenseData, expenseAmountStatus } = updatedExpenseReport
      console.log("569....",travelExpenseData, expenseAmountStatus )

    return res.status(200).json({
      message: 'Expense line items updated successfully.',
      travelExpenseData,
      expenseAmountStatus
    });}
    } else if(isPersonalExpense && isMultiCurrency){
      console.log("i am inside multicurrency and personal expense", isPersonalExpense, isMultiCurrency )
      console.log("personalExpenseAmount: -........", personalExpenseAmount , "totalAmount-", totalAmount)
      let {convertedTotalAmount, convertedPersonalAmount, convertedBookableTotalAmount } = expenseLine?.convertedAmountDetails
      totalAmount = convertedTotalAmount;
      personalExpenseAmount = convertedPersonalAmount;
      if (personalExpenseAmount > totalAmount) {
        console.log("Personal expense amount cannot exceed total amount, personalExpenseAmount: -", personalExpenseAmount , "totalAmount-", totalAmount)
        return res.status(400).json({ message: "Personal expense amount cannot exceed total amount" });
      }        
      console.log("i am inside multicurrency and personal expense", isPersonalExpense, !isMultiCurrency )



      const nonPersonalExpenseAmount = totalAmount - personalExpenseAmount;
      if(convertedBookableTotalAmount == nonPersonalExpenseAmount){
        totalExpenseAmount += nonPersonalExpenseAmount;
        totalPersonalExpenseAmount += personalExpenseAmount;
        totalRemainingCash -= nonPersonalExpenseAmount;
      }

      expenseLine.alreadySaved = true;
      expenseLine.lineItemStatus = 'save';
      expenseLine.expenseLineId = expenseLineId;


    //  const policyValidationResult = await policyValidationHr(
    //   tenantId,
    //   empId,
    //   categoryName,
    //   travelType,
    //   travelClass,
    //   totalAmount,
    //   res
    // );

    // if(policyValidationResult){
    //   return policyValidationResult
    //   console.log("policyValidationResult..........", policyValidationResult)
    // }

        const updatedExpenseReport = await Expense.findOneAndUpdate( filter,
          {
            $set: {
              'expenseAmountStatus.totalPersonalExpenseAmount': totalPersonalExpenseAmount,
              'expenseAmountStatus.totalExpenseAmount': totalExpenseAmount,
              'expenseAmountStatus.totalRemainingCash': totalRemainingCash,
              'travelExpenseData.$.allocations':allocations,
            },
            $push: {
              'travelExpenseData.$.expenseLines': expenseLine,
            },
          },
          {
            // arrayFilters: [{ 'element.expenseHeaderNumber': expenseHeaderNumber }],
            new: true, // To return the modified document
          }
        );
    console.log("625",categoryName, updatedExpenseReport )
    if(!updatedExpenseReport){
      return res.status(404).json({message:"Expense report not found"})
    } else {
      const {travelExpenseData, expenseAmountStatus} = updatedExpenseReport
    return res.status(200).json({
      message: 'Expense line items updated successfully.',
      travelExpenseData, expenseAmountStatus
    });}
    } else if(!isPersonalExpense && isMultiCurrency){
      console.log("only multicurrency", !isPersonalExpense, isMultiCurrency)
      let {convertedTotalAmount } = expenseLine?.convertedAmountDetails
      if(!convertedTotalAmount){
        return res.status(404).json({success: false, message: " conversion total amount is missing"})
      }
      console.log( "convertedTotalAmount-", convertedTotalAmount)

        totalExpenseAmount += convertedTotalAmount;
        totalRemainingCash -= convertedTotalAmount;

        expenseLine.alreadySaved = true;
        expenseLine.lineItemStatus = 'save';
        expenseLine.expenseLineId = expenseLineId;


    //  const policyValidationResult = await policyValidationHr(
    //   tenantId,
    //   empId,
    //   categoryName,
    //   travelType,
    //   travelClass,
    //   totalAmount,
    //   res
    // );

    // if(policyValidationResult){
    //   return policyValidationResult
    //   console.log("policyValidationResult..........", policyValidationResult)
    // }

        const updatedExpenseReport = await Expense.findOneAndUpdate( filter,
          {
            $set: {
              'expenseAmountStatus.totalExpenseAmount': totalExpenseAmount,
              'expenseAmountStatus.totalRemainingCash': totalRemainingCash,
              'travelExpenseData.$.allocations':allocations,
            },
            $push: {
              'travelExpenseData.$.expenseLines': expenseLine,
            },
          },
          {
            // arrayFilters: [{ 'element.expenseHeaderNumber': expenseHeaderNumber }],
            new: true, // To return the modified document
          }
        );
    console.log("775",categoryName, updatedExpenseReport )
    if(!updatedExpenseReport){
      return res.status(404).json({message:"Expense report not found"})
    } else{
    return res.status(200).json({
      message: 'Expense line items updated successfully.',
      updatedExpenseReport,
    });}
    } else {
      // updated remaining cash is added to totalRemainingCash
      totalRemainingCash -= totalAmount;
      console.log("totalRemainingCash after update", totalRemainingCash)
       // total amount from fields in expense category
       totalExpenseAmount += totalAmount;

       expenseLine.alreadySaved = true;
       expenseLine.lineItemStatus = 'save';
       expenseLine.expenseLineId = expenseLineId;

       console.log("totalRemainingCash after update", totalRemainingCash, "totalExpenseAmount", totalExpenseAmount)

  // const policyValidationResult = await policyValidationHr(
  //   tenantId,
  //   empId,
  //   categoryName,
  //   travelType,
  //   travelClass,
  //   totalAmount,
  //   res
  // );

  // if(policyValidationResult){
  //   return policyValidationResult
  //   console.log("policyValidationResult..........", policyValidationResult)
  // }

      const ExpenseReport = await Expense.findOneAndUpdate( filter,
          {
            $push: {
              'travelExpenseData.$.expenseLines': expenseLine,
            },
            $set: {
              'travelExpenseData.$.allocations':allocations,
              'expenseAmountStatus.totalExpenseAmount': totalExpenseAmount,
              'expenseAmountStatus.totalRemainingCash': totalRemainingCash,
            },
          },
          {
            // arrayFilters: [{ 'element.expenseHeaderId': expenseHeaderId }],
            new: true, // To return the modified document
          }
        );
        console.log("715.......",ExpenseReport)
        if(!ExpenseReport){
          return res.status(404).json({message:"Expense report not found"})
        } else{
          return res.status(200).json({
            message: 'Expense line items updated successfully.',
            ExpenseReport,
          });
        }
        
    }
  } catch (error) {
    console.error('An error occurred while saving the expense line items:', error);
    return res.status(500).json({ error: 'An error occurred while saving the expense line items.' });
  }
};

 const newOnSaveExpenseLine = async (req, res) => {
  try {
    const { tenantId, tripId, empId, expenseHeaderId } = req.params;
    const {travelType,isCashAdvanceTaken, expenseAmountStatus, expenseLine, allocations} = req.body;
    console.log("Params",req.params)
    console.log("on save req.body", req.body)
  
    const isPersonalExpense  = expenseLine?.isPersonalExpense
    const isMultiCurrency = expenseLine?.isMultiCurrency
    const isLineUpdate = expenseLine?.expenseLineId
  
    const requiredFields = ['expenseAmountStatus', 'expenseLine', 'travelType', 'allocations']
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0){
      return res.status(404).json({message: `Missing required fields:${missingFields.join(", ")}`})
    }
  
    let {totalExpenseAmount, totalPersonalExpenseAmount,totalRemainingCash} = expenseAmountStatus
    const totalAmountNames = ['Total Fare', 'Total Amount', 'Subscription cost', 'Cost', 'Premium Cost'];

    let totalAmount = extractTotalAmount(expenseLine, totalAmountNames);

    console.log("totalAmount received", totalAmount)

    //Converting to Numbers
    totalExpenseAmount = Number(totalExpenseAmount)
    totalPersonalExpenseAmount = Number(totalPersonalExpenseAmount)
    totalRemainingCash = Number(totalRemainingCash)
    totalAmount = Number(totalAmount)


    console.log("totalAmount received", totalAmount)
    // totalAmount = expenseLine['Total Amount'] ? expenseLine['Total Amount'].trim().toUpperCase() : '';
    const travelClass = expenseLine['Class of Service'] ? expenseLine['Class of Service'].trim().toUpperCase() : '';
    const categoryName = expenseLine['Category Name'] ? expenseLine['Category Name'].trim().toUpperCase() : '';
    console.log("is this key ....", totalAmount)
    let { personalExpenseAmount } = expenseLine;
    const expenseLineId = new mongoose.Types.ObjectId();
    const filter = { 
      tenantId, 
      tripId,
      $or: [
        { 'travelRequestData.createdBy.empId': empId },
        { 'travelRequestData.createdFor.empId': empId },
      ],
      'travelExpenseData': {
        $elemMatch: { 'expenseHeaderId': expenseHeaderId },
      },
    }

    const update = {
      $set: {
        'expenseAmountStatus.totalPersonalExpenseAmount': totalPersonalExpenseAmount,
        'expenseAmountStatus.totalExpenseAmount': totalExpenseAmount,
        'expenseAmountStatus.totalRemainingCash': totalRemainingCash,
        'travelExpenseData.$.allocations': allocations,
      },
    };

    const options = { new: true }; // To return the modified document

    if (isLineUpdate) {
      // If expenseLineId is present, find and update matching expenseLine
      update.$set[`travelExpenseData.0.expenseLines.$[elem]`] = expenseLine;
      const arrayFilters = [{ 'elem.expenseLineId': expenseLine.expenseLineId }];
      await Expense.findOneAndUpdate(filter, update, { arrayFilters, ...options });
    } else {
      // If expenseLineId is not present, push the new expenseLine to the array
      update.$push = {
        'travelExpenseData.$.expenseLines': expenseLine,
      };
      await Expense.findOneAndUpdate(filter, update, options);
    }

    const updatedExpenseReport = await Expense.findOne(filter).select('travelExpenseData expenseAmountStatus');

    if (!updatedExpenseReport) {
      return res.status(404).json({ message: "Expense report not found" });
    } else {
      const { travelExpenseData, expenseAmountStatus } = updatedExpenseReport;
      return res.status(200).json({
        message: 'Expense line items updated successfully.',
        travelExpenseData,
        expenseAmountStatus,
      });
    }


    if (isPersonalExpense && !isMultiCurrency)  {
      console.log("personalExpenseAmount: -........", personalExpenseAmount , "totalAmount-", totalAmount)
      if (personalExpenseAmount > totalAmount) {
        console.log("Personal expense amount cannot exceed total amount, personalExpenseAmount: -", personalExpenseAmount , "totalAmount-", totalAmount)
        return res.status(400).json({ message: "Personal expense amount cannot exceed total amount" });
      }        
      console.log("i am inside multicurrency and personal expense", isPersonalExpense, !isMultiCurrency )

      const nonPersonalExpenseAmount = totalAmount - personalExpenseAmount;
      totalExpenseAmount += nonPersonalExpenseAmount;
      totalPersonalExpenseAmount += personalExpenseAmount;
      totalRemainingCash -= nonPersonalExpenseAmount;
      expenseLine.alreadySaved = true;
      expenseLine.lineItemStatus = 'save';
      expenseLine.expenseLineId = expenseLineId;

      // if(isCashAdvanceTaken){

      // } else {

      // }
    //  const policyValidationResult = await policyValidationHr(
    //   tenantId,
    //   empId,
    //   categoryName,
    //   travelType,
    //   travelClass,
    //   totalAmount,
    //   res
    // );

    // if(policyValidationResult){
    //   return policyValidationResult
    //   console.log("policyValidationResult..........", policyValidationResult)
    // }

        const updatedExpenseReport = await Expense.findOneAndUpdate(filter,
          {
            $set: {
              'expenseAmountStatus.totalPersonalExpenseAmount': totalPersonalExpenseAmount,
              'expenseAmountStatus.totalExpenseAmount': totalExpenseAmount,
              'expenseAmountStatus.totalRemainingCash': totalRemainingCash,
              'travelExpenseData.$.allocations':allocations,
            },
            $push: {
              'travelExpenseData.$.expenseLines': expenseLine,
            },
          },
          {
            // arrayFilters: [{ 'element.expenseHeaderNumber': expenseHeaderNumber }],
            new: true, // To return the modified document
          }
        );

    if(!updatedExpenseReport){
      return res.status(404).json({message:"Expense report not found"})
    } else {
      const {travelExpenseData, expenseAmountStatus } = updatedExpenseReport
      console.log("569....",travelExpenseData, expenseAmountStatus )

    return res.status(200).json({
      message: 'Expense line items updated successfully.',
      travelExpenseData,
      expenseAmountStatus
    });}
    } else if(isPersonalExpense && isMultiCurrency){
      console.log("i am inside multicurrency and personal expense", isPersonalExpense, isMultiCurrency )
      console.log("personalExpenseAmount: -........", personalExpenseAmount , "totalAmount-", totalAmount)
      let {convertedTotalAmount, convertedPersonalAmount, convertedBookableTotalAmount } = expenseLine?.convertedAmountDetails
      totalAmount = convertedTotalAmount;
      personalExpenseAmount = convertedPersonalAmount;
      if (personalExpenseAmount > totalAmount) {
        console.log("Personal expense amount cannot exceed total amount, personalExpenseAmount: -", personalExpenseAmount , "totalAmount-", totalAmount)
        return res.status(400).json({ message: "Personal expense amount cannot exceed total amount" });
      }        
      console.log("i am inside multicurrency and personal expense", isPersonalExpense, !isMultiCurrency )



      const nonPersonalExpenseAmount = totalAmount - personalExpenseAmount;
      if(convertedBookableTotalAmount == nonPersonalExpenseAmount){
        totalExpenseAmount += nonPersonalExpenseAmount;
        totalPersonalExpenseAmount += personalExpenseAmount;
        totalRemainingCash -= nonPersonalExpenseAmount;
      }

      expenseLine.alreadySaved = true;
      expenseLine.lineItemStatus = 'save';
      expenseLine.expenseLineId = expenseLineId;


    //  const policyValidationResult = await policyValidationHr(
    //   tenantId,
    //   empId,
    //   categoryName,
    //   travelType,
    //   travelClass,
    //   totalAmount,
    //   res
    // );

    // if(policyValidationResult){
    //   return policyValidationResult
    //   console.log("policyValidationResult..........", policyValidationResult)
    // }

        const updatedExpenseReport = await Expense.findOneAndUpdate( filter,
          {
            $set: {
              'expenseAmountStatus.totalPersonalExpenseAmount': totalPersonalExpenseAmount,
              'expenseAmountStatus.totalExpenseAmount': totalExpenseAmount,
              'expenseAmountStatus.totalRemainingCash': totalRemainingCash,
              'travelExpenseData.$.allocations':allocations,
            },
            $push: {
              'travelExpenseData.$.expenseLines': expenseLine,
            },
          },
          {
            // arrayFilters: [{ 'element.expenseHeaderNumber': expenseHeaderNumber }],
            new: true, // To return the modified document
          }
        );
    console.log("625",categoryName, updatedExpenseReport )
    if(!updatedExpenseReport){
      return res.status(404).json({message:"Expense report not found"})
    } else {
      const {travelExpenseData, expenseAmountStatus} = updatedExpenseReport
    return res.status(200).json({
      message: 'Expense line items updated successfully.',
      travelExpenseData, expenseAmountStatus
    });}
    } else if(!isPersonalExpense && isMultiCurrency){
      console.log("only multicurrency", !isPersonalExpense, isMultiCurrency)
      let {convertedTotalAmount } = expenseLine?.convertedAmountDetails
      if(!convertedTotalAmount){
        return res.status(404).json({success: false, message: " conversion total amount is missing"})
      }
      console.log( "convertedTotalAmount-", convertedTotalAmount)

        totalExpenseAmount += convertedTotalAmount;
        totalRemainingCash -= convertedTotalAmount;

        expenseLine.alreadySaved = true;
        expenseLine.lineItemStatus = 'save';
        expenseLine.expenseLineId = expenseLineId;


    //  const policyValidationResult = await policyValidationHr(
    //   tenantId,
    //   empId,
    //   categoryName,
    //   travelType,
    //   travelClass,
    //   totalAmount,
    //   res
    // );

    // if(policyValidationResult){
    //   return policyValidationResult
    //   console.log("policyValidationResult..........", policyValidationResult)
    // }

        const updatedExpenseReport = await Expense.findOneAndUpdate( filter,
          {
            $set: {
              'expenseAmountStatus.totalExpenseAmount': totalExpenseAmount,
              'expenseAmountStatus.totalRemainingCash': totalRemainingCash,
              'travelExpenseData.$.allocations':allocations,
            },
            $push: {
              'travelExpenseData.$.expenseLines': expenseLine,
            },
          },
          {
            // arrayFilters: [{ 'element.expenseHeaderNumber': expenseHeaderNumber }],
            new: true, // To return the modified document
          }
        );
    console.log("775",categoryName, updatedExpenseReport )
    if(!updatedExpenseReport){
      return res.status(404).json({message:"Expense report not found"})
    } else{
    return res.status(200).json({
      message: 'Expense line items updated successfully.',
      updatedExpenseReport,
    });}
    } else {
      // updated remaining cash is added to totalRemainingCash
      totalRemainingCash -= totalAmount;
      console.log("totalRemainingCash after update", totalRemainingCash)
       // total amount from fields in expense category
       totalExpenseAmount += totalAmount;

       expenseLine.alreadySaved = true;
       expenseLine.lineItemStatus = 'save';
       expenseLine.expenseLineId = expenseLineId;

       console.log("totalRemainingCash after update", totalRemainingCash, "totalExpenseAmount", totalExpenseAmount)

  // const policyValidationResult = await policyValidationHr(
  //   tenantId,
  //   empId,
  //   categoryName,
  //   travelType,
  //   travelClass,
  //   totalAmount,
  //   res
  // );

  // if(policyValidationResult){
  //   return policyValidationResult
  //   console.log("policyValidationResult..........", policyValidationResult)
  // }

      const ExpenseReport = await Expense.findOneAndUpdate( filter,
          {
            $push: {
              'travelExpenseData.$.expenseLines': expenseLine,
            },
            $set: {
              'travelExpenseData.$.allocations':allocations,
              'expenseAmountStatus.totalExpenseAmount': totalExpenseAmount,
              'expenseAmountStatus.totalRemainingCash': totalRemainingCash,
            },
          },
          {
            // arrayFilters: [{ 'element.expenseHeaderId': expenseHeaderId }],
            new: true, // To return the modified document
          }
        );
        console.log("715.......",ExpenseReport)
        if(!ExpenseReport){
          return res.status(404).json({message:"Expense report not found"})
        } else{
          return res.status(200).json({
            message: 'Expense line items updated successfully.',
            ExpenseReport,
          });
        }
        
    }
  } catch (error) {
    console.error('An error occurred while saving the expense line items:', error);
    return res.status(500).json({ error: 'An error occurred while saving the expense line items.' });
  }
};

const cancelAtHeaderLevelForAReport = async (req, res) => {
  const { tenantId, tripId, expenseHeaderId } = req.params;
  const { expenseAmountStatus, travelExpenseReport } = req.body;

  if(expenseAmountStatus){
    let {  totalExpenseAmount, totalPersonalExpenseAmount, totalremainingCash } = expenseAmountStatus;
  }
  

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

      const payload = {...updatedExpenseReport};
      const needConfirmation = true;
      const source = 'travel-expense'
      const onlineVsBatch = 'online';
      
      await sendTravelExpenseToDashboardQueue(payload, needConfirmation, onlineVsBatch, source);

      // Process the updated expenseReport if needed
      res.status(200).json({ success: true, data: updatedExpenseReport });
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

      const payload = {...newExpenseReport};
      const needConfirmation = true;
      const source = 'travel-expense'
      const onlineVsBatch = 'online';
      
      await sendTravelExpenseToDashboardQueue(payload, needConfirmation, onlineVsBatch, source);
      // Process the updated expenseReport if needed
      res.status(200).json({ success: true, data: newExpenseReport });
    }
  } catch (error) {
    console.error('Error canceling at header level:', error);
    res.status(500).json({ success: false, message: 'Internal server error.', error: error.message });
  }
};