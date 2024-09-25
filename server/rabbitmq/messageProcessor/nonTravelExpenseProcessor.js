
import dashboard from "../../models/dashboardSchema.js";
import REIMBURSEMENT from "../../models/reimbursementSchema.js";


// Non travel expense header 'paid'
export const settleNonTravelExpenseReport= async (payload) => {
  try {
      const {  tenantId, expenseHeaderId, settlementBy, expenseHeaderStatus, 
        settlementDate } = payload;

        console.log("non travel settlement", payload)
        const status = {
          PENDING_SETTLEMENT: 'pending settlement',
          PAID: 'paid',
          APPROVED:'approved'
        };
        
        const filter = {
          tenantId,
          expenseHeaderId,
          'expenseHeaderStatus': status.PENDING_SETTLEMENT,
        };
        
        // Use findOneAndUpdate to find and update in one operation
        const updateResult = await REIMBURSEMENT.findOne(
          filter,
        );

        if(!updateResult){
          throw new Error('non travel expense report not found in dashboard ms')
        }

        const {expenseLines} = updateResult

        const updatedExpenseLines = expenseLines.map((line) => {
          if(line.lineItemStatus == status.APPROVED){
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

        updateResult.expenseLines = updatedExpenseLines
        updateResult.settlementBy = settlementBy
        updateResult.expenseHeaderStatus = expenseHeaderStatus
        updateResult.settlementDate = settlementDate
        updateResult.actionedUpon = true
        
      const report =  await updateResult.save()
    console.log('Travel request status updated in Dashboard microservice:', JSON.stringify(report,'',2));
    const {expenseHeaderStatus:getStatus} = report.reimbursementSchema

    if(getStatus === status.PAID){
      return { success: true, error: null };
    }
    return { success: false, error:`non Travel expense report has ${getStatus} as expenseHeaderStatus` };
  } catch (error) {
    console.error('Failed to update travel request status in Dashboard microservice:', error);
    return { success: false, error: error.message };
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


