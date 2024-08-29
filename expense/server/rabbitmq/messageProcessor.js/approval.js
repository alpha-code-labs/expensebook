import Expense from "../../models/tripSchema.js";

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


export async function approveRejectCashRaisedLater(payload) {
    try {
        console.log("payload", payload);

        const results = await Promise.all(payload.map(handleRequest));

        return { success: true, results };
    } catch (e) {
        return { success: false, error: e.message || e };
    }
}

async function handleRequest(request) {
    const { travelRequestId, cashAdvances } = request;

    const cashAdvance = await Expense.findOne({ 'travelRequestData.travelRequestId': travelRequestId });
    if (!cashAdvance) {
        return { travelRequestId, success: false, error: 'Travel Request not found' };
    }

    // Update cash advances
    const updatedCashAdvancesData = updateCashAdvances(cashAdvance.cashAdvancesData, cashAdvances);

    // Save the updates
    cashAdvance.cashAdvancesData = updatedCashAdvancesData;
    await cashAdvance.save();

    console.log("cashAdvance", cashAdvance);
    return { travelRequestId, success: true, error: null };
}

function updateCashAdvances(existingCashAdvances, newCashAdvances) {
    return existingCashAdvances.map(existingCa => {
        const matchingCa = newCashAdvances.find(ca => ca.cashAdvanceId === existingCa.cashAdvanceId.toString());
        if (matchingCa) {
            return {
                ...existingCa,
                cashAdvanceStatus: matchingCa.cashAdvanceStatus,
                cashAdvanceRejectionReason: matchingCa.cashAdvanceRejectionReason,
                approvers: matchingCa.approvers,
            };
        }
        return existingCa; 
    });
}