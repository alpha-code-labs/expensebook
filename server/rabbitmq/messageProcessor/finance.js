import dashboard from "../../models/dashboardSchema.js";


//settle cashAdvance or recover Cash Advance
export const settleOrRecoverCashAdvance = async (payload) => {
  try {
    const { tenantId, travelRequestId, cashAdvanceId, paidBy ,cashAdvanceStatus,paidFlag,
        recoveredBy,recoveredFlag,
    } = payload;

    const getTrip = await dashboard.findOne(
      { 
        tenantId,
        'cashAdvanceData': { $elemMatch: { 'cashAdvanceId': cashAdvanceId, 'travelRequestId': travelRequestId } }
      },
    );

    
    console.log("settle ca payload", payload)
    const updateCashDoc = {
        'cashAdvanceData.$.cashAdvanceStatus': cashAdvanceStatus, 
    }

    const isPaidBy = paidBy !== undefined && paidFlag !== undefined
    const isTripPaidBy = getTrip?.cashAdvanceSchema && getTrip?.tripSchema?.cashAdvancesData?.length > 0

    const isRecoveredBy = recoveredBy !== undefined && recoveredFlag !== undefined
    const isTripRecoveredBy = getTrip?.cashAdvanceSchema && getTrip?.tripSchema?.cashAdvancesData?.length > 0

    if(isPaidBy){
      updateCashDoc['cashAdvanceData.$.paidBy'] = paidBy,
      updateCashDoc['cashAdvanceData.$.paidFlag'] = paidFlag
    }

    if(isRecoveredBy){
      updateCashDoc['cashAdvanceData.$.recoveredBy'] = recoveredBy,
      updateCashDoc['cashAdvanceData.$.recoveredFlag'] = recoveredFlag
    }

    if (isPaidBy && isTripPaidBy) {
      updateCashDoc[ 'tripSchema.cashAdvancesData.$.paidBy'] = paidBy,
      updateCashDoc[ 'tripSchema.cashAdvancesData.$.paidFlag'] = paidFlag
    }

    if (isRecoveredBy && isTripRecoveredBy ) {
      updateCashDoc[ 'tripSchema.cashAdvancesData.$.recoveredBy'] = recoveredBy,
      updateCashDoc[ 'tripSchema.cashAdvancesData.$.recoveredFlag'] = recoveredFlag
    }

    const trip = await dashboard.findOneAndUpdate(
      { 
        tenantId,
        'cashAdvanceData': { $elemMatch: { 'cashAdvanceId': cashAdvanceId, 'travelRequestId': travelRequestId } }
      },
      { 
        $set: updateCashDoc
      },
      { new: true }
    );

    console.log('Travel request status updated in Dashboard microservice:', trip);
    return { success: true, error: null };
  } catch (error) {
    console.error('Failed to update travel request status in Dashboard microservice:', error);
    return { success: false, error: error };
  }
};





















