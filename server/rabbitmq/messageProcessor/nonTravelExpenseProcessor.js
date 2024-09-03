import dashboard from "../../models/dashboardSchema.js";


// Non travel expense header 'paid'
export const settleNonTravelExpenseReport= async (payload) => {
  try {
      const {  tenantId, expenseHeaderId, settlementBy, expenseHeaderStatus, 
        settlementDate } = payload;

        const status = {
          PENDING_SETTLEMENT: 'pending settlement',
          PAID: 'paid',
        };
        
        const filter = {
          'reimbursementSchema.tenantId': tenantId,
          'reimbursementSchema.expenseHeaderId': expenseHeaderId,
          'reimbursementSchema.expenseHeaderStatus': status.PENDING_SETTLEMENT,
        };
        
        // Use findOneAndUpdate to find and update in one operation
        const updateResult = await dashboard.findOne(
          filter,
        );

        if(!updateResult){
          return { success: false, error: null };
        }

        const {expenseLines} = updateResult.reimbursementSchema

        const updatedExpenseLines = expenseLines.map((line) => {
          if(line.lineItemStatus == status.PENDING_SETTLEMENT){
            return{
              ...line,
              lineItemStatus: status.PAID,
              actionedUpon:true,
              settlementBy: settlementBy,
              expenseSettledDate:settlementDate,
            }
          }
          return line
        })

        updateResult.reimbursementSchema.expenseLines = updatedExpenseLines
        updateResult.reimbursementSchema.settlementBy = settlementBy
        updateResult.reimbursementSchema.expenseHeaderStatus = expenseHeaderStatus
        updateResult.reimbursementSchema.settlementDate = settlementDate
        updateResult.reimbursementSchema.actionedUpon = true
        
    console.log('Travel request status updated in approval microservice:', trip);
    return { success: true, error: null };
  } catch (error) {
    console.error('Failed to update travel request status in approval microservice:', error);
    return { success: false, error: error };
  }
};



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


