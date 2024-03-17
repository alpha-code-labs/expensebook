import Expense from "../../models/travelExpenseSchema.js";

export const expenseReportApproval = async (payload) => {
    const { tenantId, expenseHeaderId, expenseHeaderStatus, expenseRejectionReason, approvers } = payload;

    console.log("Payload for travelExpenseData - expense report approval", payload);

    try {
        const updated = await Expense.findOneAndUpdate(
            { 
                'tenantId': tenantId,
                'travelExpenseData': {
                    $elemMatch: {
                        'expenseHeaderId': expenseHeaderId
                    }
                }
            },
            {
                $set: {
                    'travelExpenseData.$.expenseHeaderStatus': expenseHeaderStatus,
                    'travelExpenseData.$.expenseRejectionReason': expenseRejectionReason,
                    'travelExpenseData.$.approvers': approvers
                }
            },
            { upsert: true, new: true }
        );

        if(updated){
            
            console.log('Saved to dashboard: TravelExpenseData updated successfully', updated);
            return { success: true, error: null };
        }
 
    } catch (error) {
        console.error('Failed to update dashboard: TravelExpenseData updation failed', error);
        return { success: false, error: error };
    }
};