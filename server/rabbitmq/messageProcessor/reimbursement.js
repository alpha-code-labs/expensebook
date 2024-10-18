import REIMBURSEMENT from "../../models/reimbursementSchema.js";


const updateReimbursement = async (payload) => {
    try {
        console.log("update updateReimbursement", payload)
        const { reimbursementReport } = payload;
        const { tenantId,expenseHeaderId, createdBy } = reimbursementReport;
        const { empId } = createdBy;
        console.log("updateReimbursement ....", payload);

        const reimbursement = await REIMBURSEMENT.findOneAndUpdate(
            { tenantId, 'createdBy.empId': empId ,expenseHeaderId},
            { $set: { ...reimbursementReport } },
            { upsert: true, new: true }
        );

        console.log("Reimbursement update result:", reimbursement);

        if (reimbursement) {
            console.log("Success: Reimbursement updated successfully.");
            return { success: true, error: null };
        } else {
            console.log("Failed: Unable to save reimbursement expense in dashboard.");
            return { success: false, error: "Failed to save reimbursement expense in dashboard." };
        }
    } catch (error) {
        console.error('Failed to update dashboard: using synchronous queue', error);
        return { success: false, error: error.message };
    }
};


const deleteReimbursement = async (payload) => {
    try {
        console.log("delete", payload)
        // const { reimbursementReport } = payload;
        const { tenantId,empId, expenseHeaderId } = payload;

        console.log("deleteReimbursement....", payload);
    const deleteReimbursementReport = await REIMBURSEMENT.findOneAndDelete({ 
        tenantId, expenseHeaderId })

        if(!deleteReimbursementReport){
            return {success: false, error: "Failed to delete reimbursement expense in dashboard."}
        } else{
            return {success: true, message: "Successfully deleted"}
        }
} catch (error){
    return {success: false, error: error}
}
}

export{
    updateReimbursement,
    deleteReimbursement
}

