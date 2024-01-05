import dashboard from "../../models/dashboardSchema.js";

export const processTransitTrip = async (message) => {
    for (const payload of message.expenseHeaderId) {
      const {
        tenantId,
        tenantName,
        companyName,
        notificationSentToDashboardFlag,
        expenseLines,
      } = payload;
  
      try {
      const updated = await dashboard.findOneAndUpdate(
        { 'nonTravelExpenseSchema.expenseHeaderId': expenseHeaderId },
        {
          $set: {
            'nonTravelExpenseSchema.tenantId': tenantId ?? undefined,
            'nonTravelExpenseSchema.tenantName': tenantName ?? undefined,
            'nonTravelExpenseSchema.companyName': companyName ?? undefined,
            'nonTravelExpenseSchema.expenseHeaderId': expenseHeaderId ?? undefined,
            'nonTravelExpenseSchema.notificationSentToDashboardFlag': notificationSentToDashboardFlag ?? undefined,
            'nonTravelExpenseSchema.expenseLines': expenseLines ?? undefined,
          },
        },
        { upsert: true, new: true }
      );
      console.log('Saved to dashboard: non travel expense ', updated);
  
    } catch (error) {
      console.error('Failed to update dashboard:', error);
  
      // Collect failed updates
      failedUpdates.push(trip);
      console.error('Failed to update dashboard:', error);
  
    }
  }
  }