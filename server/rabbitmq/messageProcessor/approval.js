import dashboard from "../../models/dashboardSchema.js";


export const expenseReportApproval = async (payload) => {
    const { tenantId, expenseHeaderId, expenseHeaderStatus, expenseRejectionReason, approvers } = payload;

    console.log("Payload for travelExpenseData approval", payload);

    try {
        const updated = await dashboard.findOneAndUpdate(
            { 
                'tripSchema.tenantId': tenantId,
                'tripSchema.travelExpenseData': {
                    $elemMatch: {
                        'expenseHeaderId': expenseHeaderId
                    }
                }
            },
            {
                $set: {
                    'tripSchema.travelExpenseData.$.expenseHeaderStatus': expenseHeaderStatus,
                    'tripSchema.travelExpenseData.$.expenseRejectionReason': expenseRejectionReason,
                    'tripSchema.travelExpenseData.$.approvers': approvers
                }
            },
            { upsert: true, new: true }
        );

        console.log('Saved to dashboard: TravelExpenseData updated successfully', updated);
        return { success: true, error: null };
    } catch (error) {
        console.error('Failed to update dashboard: TravelExpenseData updation failed', error);
        return { success: false, error: error };
    }
};
