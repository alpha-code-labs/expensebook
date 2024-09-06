import { formatAmount } from "./handyFunctions";

export const flattenData = (data) => {
    const flattenedData = [];
  
    // Flatten travelExpense data
    data.travelExpense.forEach((travel) => {
      travel.travelExpenseData.forEach((expense) => {
        flattenedData.push({
          tripName: travel.tripName || "-",
          createdBy: travel.createdBy.name,
          type: "Travel Expense",
          'expense/cash-advance no.': expense.expenseHeaderNumber,
          paidBy: expense.settlementBy.name || "N/A",
          totalAmount: `${expense.defaultCurrency.shortName} ${formatAmount(expense.expenseAmountStatus.totalExpenseAmount)}`,
        });
      });
    });


    data.nonTravelExpense.forEach((nonTravel) => {
     
        flattenedData.push({
          tripName: nonTravel?.tripName,
          createdBy: nonTravel?.createdBy.name,
          type: "Non-Travel Expense",
          'expense/cash-advance no.': nonTravel?.expenseHeaderNumber,
          paidBy: nonTravel?.settlementBy?.name || "N/A",
          totalAmount: `${nonTravel?.defaultCurrency?.shortName ?? 'N/A'} ${formatAmount(nonTravel?.expenseTotalAmount)}`,
        });
      
    });
  
    // Flatten cash data
    data.cash.forEach((cashItem) => {
      cashItem.cashAdvancesData.forEach((cashAdvance) => {
        cashAdvance.amountDetails.forEach((amountDetail) => {
          flattenedData.push({
            tripName: cashItem.tripName || "-",
            createdBy: cashItem.createdBy.name,
            type: "Cash Advance",
            'expense/cash-advance no.': cashAdvance.cashAdvanceNumber,
            paidBy: cashAdvance.paidBy.name || "N/A",
            totalAmount: `${amountDetail?.currency?.shortName} ${formatAmount(amountDetail?.amount)}`,
          });
        });
      });
    });
    
  
    return flattenedData;
  };
  

  