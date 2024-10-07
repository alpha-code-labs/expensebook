const flattedCashadvanceData = (data, subData) => {
  if (!data || data.length === 0) {
    return []; // Return an empty array if no trip data is provided
  }
    return data.flatMap(item => 
      item[subData].flatMap(obj => 
        obj.amountDetails.map(amountDetail => ({
          group:`${item?.groupName?.map(group=>group).join(". ") ?? "-"}`,
          travelRequestNumber: item?.travelRequestNumber,
          travelRequestStatus: item?.travelRequestStatus,
          travelType: item?.travelType,
          cashAdvanceNumber: obj.cashAdvanceNumber,
          cashAdvanceRequestDate: obj.cashAdvanceRequestDate,
          createdBy: item.createdBy?.name,
          cashAdvanceStatus: obj.cashAdvanceStatus,
          amount: amountDetail.amount,
          currency: amountDetail.currency?.shortName,
          paymentMode: amountDetail?.mode ?? "-",
          paidBy: obj.paidBy?.name ?? "-",
          recoveredBy: obj.recoveredBy?.name ?? "-",
          approvers: obj?.approvers?.map(approver => `${approver?.name ?? "-"} (${approver?.status ?? "-"})`).join(", "),
        }))
      )
    );
  };


  const flattedTravelExpenseData = (tripData) => {
    if (!tripData || tripData.length === 0) {
      return []; // Return an empty array if no trip data is provided
    }
    return tripData?.flatMap(trip => {
      // Flatten the travel expenses into individual objects
      return trip?.travelExpenses?.map(expense => ({
        tripName:trip?.tripName,
        tripNumber: trip.tripNumber ?? trip?.travelRequestNumber,
        tripStatus: trip.tripStatus ?? "-",
        travelType: trip.travelType,
        expenseNumber: expense.expenseHeaderNumber, // Assuming there's a field for expense number
        submittedOn: expense.submittedOn || null, // Assuming the submitted date exists
        expenseDate: expense.expenseHeaderDate, // Assuming 'expenseHeaderDate' refers to the expense date
        expenseAmount: expense.totalAmount,
        createdBy:  trip.createdBy.name, // Fallback to trip creator if not found
        expenseHeaderStatus: expense.expenseHeaderStatus,
        paymentMode: expense.paymentMode,
        group:trip?.groupName?.map(group=>group).join(", ") ?? "-",
        approvers: expense?.approvers?.map(approver => `${approver?.name ?? "-"} (${approver?.status ?? "-"})`).join(", "),
        
        paidBy: expense.settlementBy?.name || null, // Assuming 'paidBy' field exists
        
      }));
    });
  };




const flattenTripData = (data) => {
  console.log('processing data', data);
  if (!data || data.length === 0) {
    return []; // Return an empty array if no trip data is provided
  }
  
  return data?.map(trip => ({
    tripId: trip.tripId,
    travelRequestId: trip.travelRequestId,
    travelRequestNumber: trip.travelRequestNumber,
    createdBy: trip.createdBy?.name,
    tripPurpose: trip.tripPurpose,
    tripStartDate: trip.tripStartDate,
    tripStatus: trip.tripStatus,
    group: `${trip?.groupName?.map(group=>group).join(". ") ?? "-"}`,
    tripName: trip.tripName,
    tripNumber: trip?.tripNumber,
    tripCompletionDate: trip.tripCompletionDate,
    travelRequestStatus: trip.travelRequestStatus,
    isCashAdvanceTaken: trip.isCashAdvanceTaken,
    travelType: trip.travelType,
    approvers: trip?.approvers?.map(approver => `${approver?.name ?? "-"} (${approver?.status ?? "-"})`).join(", "),
    // Handle cash advances if they exist
    // cashAdvances: trip.cashAdvances?.map(cashAdvance => ({
    //   cashAdvanceId: cashAdvance.cashAdvanceId,
    //   cashAdvanceNumber: cashAdvance.cashAdvanceNumber,
    //   cashAdvanceStatus: cashAdvance.cashAdvanceStatus,
    //   amountDetails: cashAdvance.amountDetails.map(amountDetail => ({
    //     amount: amountDetail.amount,
    //     currency: amountDetail.currency?.shortName,
    //     mode: amountDetail.mode
    //   }))
    // })) || []
  }));
};


  const flattenNonTravelExpenseData = (data) => {
    if (!data || data?.length === 0) {
      return []; // Return an empty array if no trip data is provided
    }
    return data.map(expense => ({
      expenseHeaderNumber: expense?.expenseHeaderNumber,
      expenseSubmissionDate: new Date(expense?.expenseSubmissionDate)?.toLocaleDateString(), // Format date as needed
      createdBy: expense?.createdBy?.name,
      expenseHeaderStatus: expense?.expenseHeaderStatus,
      paidBy: expense.paidBy?.name || '-', // Fallback if null
      totalExpenseAmount: expense?.expenseAmountStatus?.totalExpenseAmount,
      defaultCurrency: expense?.defaultCurrency?.shortName,
      group:expense?.groupName?.map(group=>group).join(". ") ?? "-",
      approvers: expense?.approvers?.map(approver => `${approver?.name ?? "-"} (${approver?.status ?? "-"})`).join(", "),
      expenseType:"Non-Travel Expense"

    }));
  };


  export {flattenTripData , flattedCashadvanceData,flattenNonTravelExpenseData, flattedTravelExpenseData}