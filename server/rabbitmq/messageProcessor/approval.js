import dashboard from "../../models/dashboardSchema.js";


export const travelStandAloneApproval = async(payload) =>{
   try{
    const {tenantId, travelRequestId, approvers, rejectionReason} = payload || {};

    console.log("Payload for travelStandAloneApproval", payload);
    const travelStandAlone = await dashboard.findOneAndUpdate({
        'travelRequestSchema.tenantId': tenantId,
        'travelRequestSchema.travelRequestId': travelRequestId},
        {
         $set:{
             'travelRequestSchema.approvers': approvers,
             'travelRequestSchema.rejectionReason': rejectionReason,
             'travelRequestSchema.sendForNotification ': false
            }
        }, 
        { upsert: true, new: true }
    )

    if(!travelStandAlone.length){
        return {success: false, message:"failed to update travel "}
    }else{

        return {success: true, message:"travel Approval was updated successfully"}
    }
} catch (error){
    return {success: false, message:"failed to update travel ", error}
}
}

export const expenseReportApproval = async (payload) => {
    const { tenantId, expenseHeaderId, expenseHeaderStatus, expenseRejectionReason, approvers } = payload;

    console.log("Payload for travelExpenseData - expense report approval", payload);

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

        if(updated){
            
            console.log('Saved to dashboard: TravelExpenseData updated successfully', updated);
            return { success: true, error: null };
        }
 
    } catch (error) {
        console.error('Failed to update dashboard: TravelExpenseData updation failed', error);
        return { success: false, error: error };
    }
};





