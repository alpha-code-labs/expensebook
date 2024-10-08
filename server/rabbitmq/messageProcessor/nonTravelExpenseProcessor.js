
import dashboard from "../../models/dashboardSchema.js";
import REIMBURSEMENT from "../../models/reimbursementSchema.js";


// Non travel expense header 'paid'
// export const settleNonTravelExpenseReport= async (payload) => {
//   try {
//       const {  tenantId, expenseHeaderId, settlementBy, expenseHeaderStatus, 
//         settlementDate } = payload;

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
//         const updateResult = await REIMBURSEMENT.findOne(
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
//               settlementBy: settlementBy,
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
//     console.log('settle non Travel expense report status updated in Dashboard microservice:', JSON.stringify(report,'',2));

//     // Check if report and reimbursementSchema exist
//     if (report) {
//       const { expenseHeaderStatus: getStatus } = report;
    
//       // Ensure getStatus is a string before comparing
//       if (typeof getStatus === 'string' && getStatus.toString() === status.PAID) {
//         return { success: true, error: null };
//       }
    
//       return { success: false, error: `Non Travel expense report has ${getStatus} as expenseHeaderStatus` };
//     } else {
//       return { success: false, error: 'Report or reimbursementSchema is missing.' };
//     }
    
//   } catch (error) {
//     console.error('Failed to update travel request status in Dashboard microservice:', error);
//     return { success: false, error: error.message };
//   }
// };
export const settleNonTravelExpenseReport = async (payload) => {
  try {
    const { tenantId, expenseHeaderId, settlementBy, expenseHeaderStatus, settlementDate } = payload;
    console.log("non travel settlement", payload);

    const status = {
      PENDING_SETTLEMENT: 'pending settlement',
      PAID: 'paid',
      APPROVED: 'approved'
    };

    const filter = { tenantId, expenseHeaderId };

    const updateResult = await REIMBURSEMENT.findOne(filter);

    if (!updateResult) {
      throw new Error('Non travel expense report not found in dashboard ms');
    }

    updateResult.expenseLines = updateResult.expenseLines.map((line) => 
      line.lineItemStatus === status.APPROVED
        ? {
            ...line,
            lineItemStatus: status.PAID,
            actionedUpon: true,
            settlementBy,
            expenseSettledDate: settlementDate,
          }
        : line
    );

    updateResult.settlementBy = settlementBy;
    updateResult.expenseHeaderStatus = expenseHeaderStatus;
    updateResult.settlementDate = settlementDate;
    updateResult.actionedUpon = true;

    const report = await updateResult.save();
    console.log('Settle non Travel expense report status updated in Dashboard microservice:', JSON.stringify(report, null, 2));

    if (report && report.expenseHeaderStatus === status.PAID) {
      return { success: true, error: null };
    } 
    return { 
        success: false, 
        error: `Non Travel expense report has ${report ? report.expenseHeaderStatus : 'unknown'} as expenseHeaderStatus` 
    };

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


