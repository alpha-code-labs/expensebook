import Dashboard from "../models/dashboardSchema.js";

/**
 * Picks up all the actionables that the Finance Role has to perform.
 *
 * @description
 * Finance Role Actionables:
 * 1. All Cash advances with status as pending settlement.
 * 2. All Cash advances with status as Paid and Cancelled.
 * 3. All Expense Header Reports with status as pending Settlement (Full Trip).
 * 4. All non-travel expense header reports with status pending Settlement.
 * 5. All expense header reports having status Paid.
 */

// to-do - (empId in params -to be added)fianace employee must be verified using hrCompanyStructure
export const financeSettlements = async (req, res) => {
    const { tenantId } = req.params;

    try {
        const settlements = await Dashboard.find({
            tenantId,
            'cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus': { $in: ['pending settlement', 'Paid and Cancelled'] },
            'tripSchema.travelExpenseData.expenseHeaderStatus':{$in: ['pending settlement', 'Paid']},
            'nonTravelExpenseSchema.expenseHeaderStatus':{$in: ['pending settlement']},
        });

        if (!settlements || settlements.length === 0) {
            return res.status(404).json({ message: 'No matching settlements found.' });
        }

        const pendingCashAdvanceSettlements = settlements.filter(doc => {
            return doc.cashAdvanceSchema.cashAdvancesData.some(
                data =>
                    data.cashAdvanceStatus === 'pending settlement' ||
                    data.cashAdvanceStatus === 'Paid and Cancelled'
            );
        });

        const pendingTravelExpenseSettlements = settlements.filter(doc => {
            return doc.tripSchema.travelExpenseData.some(
                data =>
                    data.expenseHeaderStatus === 'pending settlement' ||
                    data.expenseHeaderStatus === 'Paid'
            );
        });

        const pendingNonTravelExpenseSettlements = settlements.filter(doc => {
            return doc.nonTravelExpenseSchema.some(
                data =>
                    data.expenseHeaderStatus === 'pending settlement' 
            );
        });

        await processSettlements(pendingCashAdvanceSettlements, pendingTravelExpenseSettlements, pendingNonTravelExpenseSettlements);

        return res.status(200).json({
            message: 'Settlements processed successfully.',
        });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

