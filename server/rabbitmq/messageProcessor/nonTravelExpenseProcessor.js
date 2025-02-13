
import dashboard from "../../models/dashboardSchema.js";
import REIMBURSEMENT from "../../models/reimbursementSchema.js";



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
        { tenantId,'reimbursementSchema.expenseHeaderId': expenseHeaderId },
        {
          $set: {
            'reimbursementSchema.tenantId': tenantId ?? undefined,
            'reimbursementSchema.tenantName': tenantName ?? undefined,
            'reimbursementSchema.companyName': companyName ?? undefined,
            'reimbursementSchema.expenseHeaderId': expenseHeaderId ?? undefined,
            'reimbursementSchema.notificationSentToDashboardFlag': notificationSentToDashboardFlag ?? undefined,
            'reimbursementSchema.expenseLines': expenseLines ?? undefined,
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


