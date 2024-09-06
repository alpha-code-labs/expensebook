import dashboard from "../../models/dashboardSchema.js";


//settle cashAdvance or recover Cash Advance
export const settleOrRecoverCashAdvance = async (payload) => {
  try {
    const { tenantId, travelRequestId, cashAdvanceId, paidBy ,cashAdvanceStatus,paidFlag,
        recoveredBy,recoveredFlag,
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
    }

    if(isRecoveredBy && !isTripRecoveredBy){
      updateCashDoc['cashAdvanceSchema.cashAdvancesData.$.recoveredBy'] = recoveredBy,
      updateCashDoc['cashAdvanceSchema.cashAdvancesData.$.recoveredFlag'] = recoveredFlag
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
    return { success: false, error: error };
  }
};





















