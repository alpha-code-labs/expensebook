import reporting from "../../models/reportingSchema.js";


export const updateReimbursement = async (payload) => {
    try {
        console.log("update updateReimbursement", payload)
        const { reimbursementReport } = payload;
        const { tenantId,expenseHeaderId, createdBy } = reimbursementReport;
        const { empId } = createdBy;
        console.log("updateReimbursement ....", payload);

        const reimbursement = await reporting.findOneAndUpdate(
            { tenantId,
            'reimbursementSchema.tenantId': tenantId, 
            'reimbursementSchema.createdBy.empId': empId , 
            'reimbursementSchema.expenseHeaderId': expenseHeaderId},
            { $set: { reimbursementSchema: reimbursementReport } },
            { upsert: true, new: true }
        );

        console.log("Reimbursement update result:", reimbursement);

        if (reimbursement) {
            console.log("Success: Reimbursement updated successfully.");
            return { success: true, error: null };
        } else {
            console.log("Failed: Unable to save reimbursement expense in reporting.");
            return { success: false, error: "Failed to save reimbursement expense in reporting." };
        }
    } catch (error) {
        console.error('Failed to update reporting: using synchronous queue', error);
        return { success: false, error: error.message };
    }
};


export const deleteReimbursement = async (payload) => {
    try {
        console.log("delete", payload)
        // const { reimbursementReport } = payload;
        const { tenantId,empId, expenseHeaderId } = payload;

        console.log("deleteReimbursement....", payload);
    const deleteReimbursementReport = await reporting.findOneAndDelete({ 
        'reimbursementSchema.tenantId': tenantId, 'reimbursementSchema.expenseHeaderId': expenseHeaderId })

        if(!deleteReimbursementReport){
            return {success: false, error: "Failed to delete reimbursement expense in reporting."}
        } else{
            return {success: true, message: "Successfully deleted"}
        }
} catch (error){
    return {success: false, error: error}
}
}



