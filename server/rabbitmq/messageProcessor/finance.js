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
  
      console.log("settle ca ", payload)
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

      const trip = await Trip.findOneAndUpdate(
        { 
          tenantId,
          'cashAdvancesData': { $elemMatch: { 'cashAdvanceId': cashAdvanceId, 'travelRequestId': travelRequestId } }
        },
        { 
          $set: updateCashDoc
        },
        { new: true }
      );
  
      if(!trip){
        throw new Error('cash advance failed in ')
      }
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
//             'cashAdvancesData.$.cashAdvanceStatus': 'recovered', 
//             'cashAdvancesData.$.recoveredBy': recoveredBy 
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



