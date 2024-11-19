import REIMBURSEMENT from "../../models/reimbursementSchema.js";


const updateReimbursement = async (payload) => {
    try {
        const { reimbursementReport } = payload;
        const { tenantId,expenseHeaderId, createdBy } = reimbursementReport;
        const { empId } = createdBy;

        const reimbursement = await REIMBURSEMENT.findOneAndReplace(
            { tenantId, 'createdBy.empId': empId ,expenseHeaderId},
            { ...reimbursementReport},
            { upsert: true}
        );

        console.log("Reimbursement update result:", reimbursement);

        if (result.lastErrorObject.updatedExisting) {
    console.log("Success: Reimbursement updated successfully."); 
    return { success: true, error: null }; 
    } else if (result.lastErrorObject.upserted) { 
        console.log("Success: Reimbursement created successfully."); 
        return { success: true, error: null }; 
    }  else { 
        console.log("Failed: Unable to save reimbursement expense in dashboard."); 
        return { success: false, error: "Failed to save reimbursement expense in dashboard." 
        };
    }
    } catch (error) {
        console.error('Failed to update dashboard: using synchronous queue', error);
        return { success: false, error: error.message };
    }
};


const deleteReimbursement = async (payload) => {
    try {
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

