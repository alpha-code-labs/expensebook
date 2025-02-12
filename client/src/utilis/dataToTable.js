import { formatAmount } from "./handyFunctions";

export const flattenData = (data) => {
    const flattenedData = [];
    // Flatten travelExpense data
    data?.travelExpense?.forEach((travel) => {
      travel.travelExpenseData.forEach((expense) => {
        flattenedData.push({
          tripName: travel.tripName || "-",
          createdBy: travel.createdBy.name,
          type: "Travel Expense",
          'expense/cash-advance no.': expense.expenseHeaderNumber,
          paidBy: expense.settlementBy.name || "N/A",
          totalAmount: `${expense.defaultCurrency.shortName} ${formatAmount(expense.expenseAmountStatus.totalExpenseAmount)}`,
          status: expense?.settlementDetails?.[0]?.status ?? "-",
          comment: expense?.settlementDetails?.[0]?.comment ?? "-",
          url: expense?.settlementDetails[0]?.url ?? "-",
        });
      });
    });
    
    data?.nonTravelExpense?.forEach((nonTravel) => {
        flattenedData.push({
          createdBy: nonTravel?.createdBy.name,
          type: "Non-Travel Expense",
          'expense/cash-advance no.': nonTravel?.expenseHeaderNumber,
          paidBy: nonTravel?.settlementBy?.name || "N/A",
          totalAmount: `${nonTravel?.defaultCurrency?.shortName ?? 'N/A'} ${formatAmount(nonTravel?.expenseTotalAmount)}`,
          status: nonTravel?.settlementDetails[0]?.status ?? "-",
          comment: nonTravel?.settlementDetails[0]?.comment ?? "-",
          url: nonTravel?.settlementDetails[0]?.url ?? "-",
        });
      
    });
  
    // Flatten cash data
    data.cash.forEach((cashItem) => {
      cashItem.cashAdvancesData.forEach((cashAdvance) => {
          flattenedData.push({
            tripName: cashItem.tripName || "-",
            createdBy: cashItem.createdBy.name,
            type: "Cash Advance",
            'expense/cash-advance no.': cashAdvance.cashAdvanceNumber,
            paidBy: cashAdvance.paidBy.name || "-",
            totalAmount: `${cashAdvance?.amountDetails?.map(item => `${item.currency.shortName} ${item.amount}`).join(', ')}`,
            status: cashAdvance?.settlementDetails[0]?.status ?? "-",
          comment: cashAdvance?.settlementDetails[0]?.comment ?? "-",
          url: cashAdvance?.settlementDetails[0]?.url ?? "-",
          
        });
      });
    });
    // data.cash.forEach((cashItem) => {
    //   cashItem.cashAdvancesData.forEach((cashAdvance) => {
    //     cashAdvance.amountDetails.forEach((amountDetail) => {
    //       flattenedData.push({
    //         tripName: cashItem.tripName || "-",
    //         createdBy: cashItem.createdBy.name,
    //         type: "Cash Advance",
    //         'expense/cash-advance no.': cashAdvance.cashAdvanceNumber,
    //         paidBy: cashAdvance.paidBy.name || "N/A",
    //         totalAmount: `${amountDetail?.currency?.shortName} ${formatAmount(amountDetail?.amount)}`,
    //       });
    //     });
    //   });
    // });
    
    return flattenedData;
  };
  

  