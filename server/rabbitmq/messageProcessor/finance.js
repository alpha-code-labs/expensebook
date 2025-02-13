import dashboard from "../../models/dashboardSchema.js";
import REIMBURSEMENT from "../../models/reimbursementSchema.js";

//settle cashAdvance or recover Cash Advance
const settleOrRecoverCashAdvance = async (payload) => {
  try {
    const { tenantId, travelRequestId, cashAdvanceId, paidBy ,cashAdvanceStatus,paidFlag,
        recoveredBy,recoveredFlag,settlementDetails
    } = payload;

    const filter =  { 
      tenantId,
      'cashAdvanceSchema.cashAdvancesData': { $elemMatch: { 'cashAdvanceId': cashAdvanceId, 'travelRequestId': travelRequestId } }
    }
    const getTrip = await dashboard.findOne(filter);

    if(!getTrip){
     throw new Error('cash document not found in dashboard db')
    }
    console.log("settle ca payload", payload , "getTrip", JSON.stringify(getTrip,'',2))
    const updateCashDoc = {
        'cashAdvanceSchema.cashAdvancesData.$.cashAdvanceStatus': cashAdvanceStatus, 
    }

    const isPaidBy = paidBy !== undefined && paidFlag !== undefined
    const isTripPaidBy = getTrip?.cashAdvanceSchema && getTrip?.tripSchema?.cashAdvancesData?.length > 0

    const isRecoveredBy = recoveredBy !== undefined && recoveredFlag !== undefined
    const isTripRecoveredBy = getTrip?.cashAdvanceSchema && getTrip?.tripSchema?.cashAdvancesData?.length > 0

    if(isPaidBy && !isTripPaidBy){
      updateCashDoc['cashAdvanceSchema.cashAdvancesData.$.paidBy'] = paidBy,
      updateCashDoc['cashAdvanceSchema.cashAdvancesData.$.paidFlag'] = paidFlag
      if (settlementDetails !== undefined) {
        updateCashDoc['$push'] = {
          'cashAdvanceSchema.cashAdvancesData.$.settlementDetails': settlementDetails
        };
      }
    }

    if (isRecoveredBy && !isTripRecoveredBy) {
      updateCashDoc['cashAdvanceSchema.cashAdvancesData.$.recoveredBy'] = recoveredBy;
      updateCashDoc['cashAdvanceSchema.cashAdvancesData.$.recoveredFlag'] = recoveredFlag;

      if (settlementDetails !== undefined) {
        updateCashDoc['$push'] = {
          'cashAdvanceSchema.cashAdvancesData.$.settlementDetails': settlementDetails
        };
      }
    }
    

    if (isPaidBy && isTripPaidBy) {
      updateCashDoc['tripSchema.cashAdvancesData.$.paidBy'] = paidBy;
      updateCashDoc['tripSchema.cashAdvancesData.$.paidFlag'] = paidFlag;
    
      if (settlementDetails !== undefined) {
        updateCashDoc['$push'] = {
          'tripSchema.cashAdvancesData.$.settlementDetails': settlementDetails
        };
      }
    }
    
    if (isRecoveredBy && isTripRecoveredBy) {
      updateCashDoc['tripSchema.cashAdvancesData.$.recoveredBy'] = recoveredBy;
      updateCashDoc['tripSchema.cashAdvancesData.$.recoveredFlag'] = recoveredFlag;
    
      if (settlementDetails !== undefined) {
        updateCashDoc['$push'] = {
          'tripSchema.cashAdvancesData.$.settlementDetails': settlementDetails
        };
      }
    }
    

    const trip = await dashboard.findOneAndUpdate(
      filter,
      { 
        $set: updateCashDoc
      },
      { new: true }
    );

    console.log('Travel request status updated in Dashboard microservice:', trip);
    return { success: true, error: null };
  } catch (error) {
    console.error('Failed to update travel request status in Dashboard microservice:', error);
    return { success: false, error: error.message };
  }
};

// Non travel expense header 'paid'
const settleNonTravelExpenseReport = async (payload) => {
  try {
    const { tenantId, expenseHeaderId, settlementBy, expenseHeaderStatus, settlementDate, settlementDetails } = payload;
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
    if (Array.isArray(settlementDetails) && settlementDetails.length > 0) {
    updateResult.settlementDetails = updateResult.settlementDetails || [];
    updateResult.settlementDetails.push(...settlementDetails);
    }

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

//travel expense header 'paid'
const settleExpenseReport= async (payload) => {
  try {
      const {  tenantId,travelRequestId, expenseHeaderId, settlementBy, expenseHeaderStatus, 
        settlementDate } = payload;
  
        const status = {
          PENDING_SETTLEMENT: 'pending settlement',
          PAID: 'paid',
          APPROVED:'approved'
        };

        const arrayFilters = [
          {'elem.expenseHeaderId':expenseHeaderId},
          {'lineItem.lineItemStatus':status.APPROVED}
        ]
    const trip = await dashboard.findOneAndUpdate(
      { 
        tenantId,
        'tripSchema.travelExpenseData': { $elemMatch: { travelRequestId, expenseHeaderId } }
      },
      { 
        $set: { 
          'tripSchema.travelExpenseData.$[elem].expenseHeaderStatus': expenseHeaderStatus, 
          'tripSchema.travelExpenseData.$[elem].settlementDate': settlementDate,
          'tripSchema.travelExpenseData.$[elem].settlementBy': settlementBy,
          'tripSchema.travelExpenseData.$[elem].expenseLines.$[lineItem].lineItemStatus':status.PAID
        }
      },
      { arrayFilters,new: true, runValidators:true }
    );

    console.log('Travel request status updated in approval microservice:', trip);
    return { success: true, error: null };
  } catch (error) {
    console.error('Failed to update travel request status in approval microservice:', error);
    return { success: false, error: error };
  }
};


export {
  settleOrRecoverCashAdvance,
  settleExpenseReport,
  settleNonTravelExpenseReport,
}


















