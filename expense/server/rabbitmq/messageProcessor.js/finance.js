import Expense from "../../models/travelExpenseSchema.js";

//travel expense header 'paid'
export const settleExpenseReport= async (payload) => {
    try {
      const { tenantId, expenseHeaderId, tripId, paidBy, } = payload;
  
      const trip = await Expense.findOneAndUpdate(
        { 
          'tenantId': tenantId,
           
          'travelexpenseData': { $elemMatch: { 'tripId': tripId, 'expenseHeaderId': expenseHeaderId } }
        },
        { 
          $set: { 
            'travelexpenseData.$.expenseHeaderStatus': 'paid', 
            'travelexpenseData.$.paidBy': paidBy ?? '', 
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
          'tenantId': tenantId,
           
          'travelexpenseData': { $elemMatch: { 'tripId': tripId, 'expenseHeaderId': expenseHeaderId } }
        },
        { 
          $set: { 
            'travelexpenseData.$.expenseHeaderStatus': 'paid and distributed', 
            'travelexpenseData.$.paidBy': paidBy ?? '', 
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
  export const settleCashAdvance = async (payload) => {
    try {
      const { tenantId, travelRequestId, cashAdvanceId, paidBy } = payload;
  
      const trip = await Expense.findOneAndUpdate(
        { 
          'tenantId': tenantId,
          'cashAdvanceData': { $elemMatch: { 'cashAdvanceId': cashAdvanceId, 'travelRequestId': travelRequestId } }
        },
        { 
          $set: { 
            'cashAdvanceData.$.cashAdvanceStatus': 'paid', 
            'cashAdvanceData.$.paidBy': paidBy, 
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
  
  //settle cashAdvance - 
export const recoverCashAdvance = async (payload) => {
    try {
      const { tenantId, travelRequestId, cashAdvanceId, recoveredBy } = payload;
  
      const trip = await Expense.findOneAndUpdate(
        { 
          'tenantId': tenantId,
          'cashAdvanceData': { $elemMatch: { 'cashAdvanceId': cashAdvanceId, 'travelRequestId': travelRequestId } }
        },
        { 
          $set: { 
            'cashAdvanceData.$.cashAdvanceStatus': 'recovered', 
            'cashAdvanceData.$.recoveredBy': recoveredBy 
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
  