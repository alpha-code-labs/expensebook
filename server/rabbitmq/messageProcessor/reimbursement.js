import REIMBURSEMENT from "../../models/reimbursementSchema.js";


// const updateReimbursement = async (payload) => {
//     try {
//         const { reimbursementReport } = payload;
//         const { tenantId,expenseHeaderId, createdBy } = reimbursementReport;
//         const { empId } = createdBy;

//         console.log("update reimbursement", JSON.stringify(reimbursementReport,'',2))
//         const reimbursement = await REIMBURSEMENT.findOneAndReplace(
//             { tenantId, 'createdBy.empId': empId ,expenseHeaderId},
//             { ...reimbursementReport},
//             { upsert: true}
//         );

//         console.log("Reimbursement update result:", JSON.stringify(reimbursement,'',2));

//         if (reimbursement) {
//     console.log("Success: Reimbursement updated successfully."); 
//     return { success: true, error: null }; 
//     } else { 
//         console.log("Failed: Unable to save reimbursement expense in dashboard."); 
//         return { success: false, error: "Failed to save reimbursement expense in dashboard." 
//         };
//     }
//     } catch (error) {
//         console.error('Failed to update dashboard: using synchronous queue', error);
//         return { success: false, error: error.message };
//     }
// };

const updateReimbursement = async (payload) => {
    try {
      console.log("update updateReimbursement", payload);
      const { reimbursementReport } = payload;
      const { tenantId, expenseHeaderId, createdBy } = reimbursementReport;
      const { empId } = createdBy;
  
      console.log("updateReimbursement ....", payload);
  
      const filter = { 
        tenantId, 
        'createdBy.empId': empId, 
        'expenseHeaderId': expenseHeaderId 
      };
  
      const options = { upsert: true };
  
      // Remove _id field from reimbursementReport
      const { _id, ...rest } = reimbursementReport;
  
      // Replace the document entirely
      const result = await REIMBURSEMENT.replaceOne(filter, rest, options);
  
      console.log("Reimbursement update result:", result);
  
      if (result.upsertedCount > 0 || result.modifiedCount > 0) {
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

const deleteReimbursement = async (payload) => {
    try {
        const { tenantId,empId, expenseHeaderId } = payload;

        console.log("deleteReimbursement....", payload);
    const deleteReimbursementReport = await REIMBURSEMENT.findOneAndDelete({ 
        expenseHeaderId })

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

