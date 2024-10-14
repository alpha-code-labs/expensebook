import Trip from "../../models/tripSchema.js";

//travel expense header 'paid'
const settleExpenseReport= async (payload) => {
    try {
      const { tenantId, expenseHeaderId, tripId, paidBy, } = payload;
  
      const trip = await Trip.findOneAndUpdate(
        { 
         tenantId,
         tripId,
        'travelExpenseData': { $elemMatch: {  'expenseHeaderId': expenseHeaderId } }
        },
        { 
          $set: { 
            'travelExpenseData.$.expenseHeaderStatus': 'paid', 
            'travelExpenseData.$.paidBy': paidBy ?? '', 
          }
        },
        { new: true }
      );
  
      console.log('Travel request status updated in approval microservice:', trip);
      return { success: true, error: null };
    } catch (error) {
      console.error('Failed to update travel request status in approval microservice:', error);
      return { success: false, error: error };
    }
};

  //settle cashAdvance or recover CashAdvance
const settleOrRecoverCashAdvance = async (payload) => {
  try {
    const { tenantId, travelRequestId, cashAdvanceId, paidBy ,cashAdvanceStatus,paidFlag,
        recoveredBy,recoveredFlag,settlementDetails
    } = payload;

    const report = await Trip.findOne(
      { 
        tenantId,
        'cashAdvancesData': { $elemMatch: { travelRequestId } }
        // 'cashAdvancesData': { $elemMatch: { cashAdvanceId,travelRequestId } }
      },)

      console.log("report", JSON.stringify(report,'',2))

      const { expenseAmountStatus,cashAdvancesData,} = report
      const isCash = cashAdvancesData.find(c => c.cashAdvanceId.toString() === cashAdvanceId.toString())


    console.log("settle ca payload", payload)
    const updateCashDoc = {
        'cashAdvancesData.$.cashAdvanceStatus': cashAdvanceStatus, 
    }

    if(paidBy !== undefined && paidFlag !== undefined){
      updateCashDoc['cashAdvancesData.$.paidBy'] = paidBy,
      updateCashDoc['cashAdvancesData.$.paidFlag'] = paidFlag
    }

    if(recoveredBy !== undefined && recoveredFlag !== undefined){
      updateCashDoc['cashAdvancesData.$.recoveredBy'] = recoveredBy,
      updateCashDoc['cashAdvancesData.$.recoveredFlag'] = recoveredFlag
    }

    if(Array.isArray(settlementDetails) && settlementDetails.length>0){
      updateCashDoc['push']={
        'cashAdvancesData.$.settlementDetails':settlementDetails
      }
    }

    const trip = await reporting.findOneAndUpdate(
      { 
        tenantId,
        'cashAdvancesData': { $elemMatch: { cashAdvanceId,travelRequestId } }
      },
      { 
        $set: updateCashDoc
      },
      { new: true }
    );

    if(!trip){
    throw new Error('cash advance status change to paid failed : while updating db')
    }
    console.log('Travel request status updated in Trip microservice:', trip);
    return { success: true, error: null };
  } catch (error) {
    console.error('Failed to update travel request status in Trip microservice:', error.message);
    return { success: false, error: error.message };
  }
};

export {
  settleExpenseReport,
  settleOrRecoverCashAdvance
}


