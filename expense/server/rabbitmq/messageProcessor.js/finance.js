import Expense from "../../models/tripSchema.js";

//travel expense header 'paid'
// at line item level also update status of lineItem as paid.
export const settleExpenseReport= async (payload) => {
  try {
      const {  tenantId,travelRequestId, expenseHeaderId, settlementBy, expenseHeaderStatus, 
        settlementDate } = payload;
  
    const trip = await Expense.findOneAndUpdate(
      { 
        'tenantId': tenantId,
         
        'travelExpenseData': { $elemMatch: { travelRequestId, expenseHeaderId } }
      },
      { 
        $set: { 
          'travelExpenseData.$.expenseHeaderStatus': expenseHeaderStatus, 
          'travelExpenseData.$.settlementDate': settlementDate,
          'travelExpenseData.$.settlementBy': settlementBy,
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


export const settleExpenseReportPaidAndDistributed= async (payload) => {
    try {
      const { tenantId, expenseHeaderId, tripId, paidBy, } = payload;
  
      const trip = await Expense.findOneAndUpdate(
        { 
          tenantId,
          tripId,
          'travelExpenseData': { $elemMatch: {'expenseHeaderId': expenseHeaderId } }
        },
        { 
          $set: { 
            'travelExpenseData.$.expenseHeaderStatus': 'paid and distributed', 
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

  //settle cashAdvance
  export const settleOrRecoverCashAdvance = async (payload) => {
    try {
      const { tenantId, travelRequestId, cashAdvanceId, paidBy ,cashAdvanceStatus,paidFlag,
          recoveredBy,recoveredFlag,
      } = payload;
  
      console.log("settle ca payload", payload)
      const updateCashDoc = {
          'cashAdvanceData.$.cashAdvanceStatus': cashAdvanceStatus, 
      }

      if(paidBy !== undefined && paidFlag !== undefined){
        updateCashDoc['cashAdvanceData.$.paidBy'] = paidBy,
        updateCashDoc['cashAdvanceData.$.paidFlag'] = paidFlag
      }

      if(recoveredBy !== undefined && recoveredFlag !== undefined){
        updateCashDoc['cashAdvanceData.$.recoveredBy'] = recoveredBy,
        updateCashDoc['cashAdvanceData.$.recoveredFlag'] = recoveredFlag
      }

      const trip = await Expense.findOneAndUpdate(
        { 
          tenantId,
          'cashAdvanceData': { $elemMatch: { 'cashAdvanceId': cashAdvanceId, 'travelRequestId': travelRequestId } }
        },
        { 
          $set: updateCashDoc
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
