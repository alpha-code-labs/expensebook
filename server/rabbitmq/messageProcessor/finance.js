import dashboard from "../../models/dashboardSchema.js";

//settle cashAdvance
export const settleCashAdvance = async (payload) => {
    try {
    const { tenantId, travelRequestId, cashAdvanceId, paidBy } = payload;

    const trip = await dashboard.findOneAndUpdate(
        { 
        tenantId,
        'tripSchema.cashAdvancesData': { $elemMatch: { 'cashAdvanceId': cashAdvanceId, 'travelRequestId': travelRequestId } }
        },
        { 
        $set: { 
            'tripSchema.cashAdvanceData.$.cashAdvanceStatus': 'paid', 
            'tripSchema.cashAdvanceData.$.paidBy': paidBy, 
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

//settle cashAdvance- 
export const recoverCashAdvance = async (payload) => {
    try {
      const { tenantId, travelRequestId, cashAdvanceId, recoveredBy } = payload;

      const trip = await Expense.findOneAndUpdate(
        { 
        tenantId,
        'tripSchema.cashAdvancesData': { $elemMatch: { 'cashAdvanceId': cashAdvanceId, 'travelRequestId': travelRequestId } }
        },
        { 
          $set: { 
            'tripSchema.cashAdvanceData.$.cashAdvanceStatus': 'recovered', 
            'tripSchema.cashAdvanceData.$.recoveredBy': recoveredBy 
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


