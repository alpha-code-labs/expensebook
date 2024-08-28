import Trip from "../../models/tripSchema.js";

//travel expense header 'paid'
export const settleExpenseReport= async (payload) => {
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

export const settleExpenseReportPaidAndDistributed= async (payload) => {
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

  //settle cashAdvance or recover CashAdvance
  export const settleOrRecoverCashAdvance = async (payload) => {
    try {
      const { tenantId, travelRequestId, cashAdvanceId, paidBy ,cashAdvanceStatus,paidFlag,
          recoveredBy,recoveredFlag,
      } = payload;
  
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

      const trip = await Trip.findOneAndUpdate(
        { 
          tenantId,
          'cashAdvanceData': { $elemMatch: { 'cashAdvanceId': cashAdvanceId, 'travelRequestId': travelRequestId } }
        },
        { 
          $set: updateCashDoc
        },
        { new: true }
      );
  
      console.log('Travel request status updated in trip microservice:',"settleOrRecoverCashAdvance");
      return { success: true, error: null };
    } catch (error) {
      console.error('Failed to update travel request status in approval microservice:', error);
      return { success: false, error: error };
    }
  };

//settle cashAdvance - 
// export const recoverCashAdvance = async (payload) => {
//     try {
//       const { tenantId, travelRequestId, cashAdvanceId, recoveredBy } = payload;
  
//       const trip = await Trip.findOneAndUpdate(
//         { 
//           'tenantId': tenantId,
//           'cashAdvancesData': { $elemMatch: { 'cashAdvanceId': cashAdvanceId, 'travelRequestId': travelRequestId } }
//         },
//         { 
//           $set: { 
//             'cashAdvanceData.$.cashAdvanceStatus': 'recovered', 
//             'cashAdvanceData.$.recoveredBy': recoveredBy 
//           }
//         },
//         { new: true }
//       );
  
//       console.log('Travel request status updated in approval microservice:', trip);
//       return { success: true, error: null };
//     } catch (error) {
//       console.error('Failed to update travel request status in approval microservice:', error);
//       return { success: false, error: error };
//     }
// };



