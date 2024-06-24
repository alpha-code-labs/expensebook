import { Approval } from "../../models/approvalSchema.js";


export const expenseReport = async(payload) => {
    try{
    console.log("Trying to update expense report for approval", payload);
    const { getExpenseReport: { tenantId, tripId, travelRequestData, expenseAmountStatus, travelExpenseData } } = payload;
    const {travelRequestId} = travelRequestData
    const {getExpenseReport} = payload

    const expenseReport = await Approval.findOneAndUpdate({'tripSchema.tenantId': tenantId,travelRequestId, 'tripSchema.tripId': tripId}, 
    {$set: {
        tripSchema: getExpenseReport
    }}, {upsert: true, new: true})

    if(!expenseReport) {
        return res.status(404).json({message: "failed to update expense report for approval"})
    } else{

        console.log("after update in approval", expenseReport)

        return ({ success: true, message: " expense report updated successfully in approval "})
    }
}catch(error){
    return {success: false , error}
}}


