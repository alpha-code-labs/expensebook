import dashboard from "../../models/dashboardSchema.js";


export const travelStandAloneApproval = async(payload) =>{
   try{
    const {tenantId, travelRequestId, approvers,travelRequestStatus, rejectionReason} = payload || {};

    // console.log("Payload for travelStandAloneApproval", payload);
    const travelStandAlone = await dashboard.updateOne({
        tenantId,
        travelRequestId},
        {
         $set:{
            'travelRequestSchema.travelRequestStatus': travelRequestStatus,
             'travelRequestSchema.approvers': approvers,
             'travelRequestSchema.rejectionReason': rejectionReason,
            }
        }, 
    )

    //  console.log("update on travel request", travelStandAlone)
    if(travelStandAlone.modifiedCount == 0){
        return {success: false, message:"failed to update travel "}
    }else{
    //    console.log("Updated tr...",travelStandAlone)
        return {success: true, message:"travel Approval was updated successfully"}
    }
} catch (error){
    return {success: false, message:"failed to update travel ", error}
}
}


export const travelWithCashTravelApproval = async(payload) =>{
    try{
     const {tenantId, travelRequestId, approvers,travelRequestStatus, rejectionReason} = payload || {};
 
     console.log("Payload for travelWithCash   Travel  approval", payload);
     const travelWithCashTravel = await dashboard.updateOne({
         tenantId,
         travelRequestId},
         {
          $set:{
             'cashAdvanceSchema.travelRequestData.travelRequestStatus': travelRequestStatus,
              'cashAdvanceSchema.travelRequestData.approvers': approvers,
              'cashAdvanceSchema.travelRequestData.rejectionReason': rejectionReason,
             }
         }, 
     )
      console.log("after db update ", travelWithCashTravel)
     if(travelWithCashTravel.modifiedCount == 0){
         return {success: false, message:"failed to update travel "}
     }else{
        console.log("Updated travelWithCashTravel...",travelWithCashTravel)
         return {success: true, message:"travelWithCash Travel Approval was updated successfully"}
     }
 } catch (error){
     return {success: false, message:"failed to update travelWithCashTravel ", error}
 }
 }

export const travelWithCashApproval = async(payload) =>{
    try{
     const {tenantId, travelRequestId, cashAdvanceId, approvers,cashAdvanceStatus, rejectionReason} = payload || {};
 
     console.log("Payload for travelwithcash approval", payload);
     const travelStandAlone = await dashboard.updateOne({
         tenantId,
         travelRequestId,
         'cashAdvanceSchema.cashAdvancesData':{
             $elemMatch:{cashAdvanceId}}
        },
         {
          $set:{
              'cashAdvanceSchema.cashAdvancesData.$.cashAdvanceStatus': cashAdvanceStatus,
              'cashAdvanceSchema.cashAdvancesData.$.approvers': approvers,
              'cashAdvanceSchema.cashAdvancesData.$.rejectionReason': rejectionReason,
             }
         }, 
     )
      console.log("update on travel request", travelStandAlone)
     if(travelStandAlone.modifiedCount == 0){
         return {success: false, message:"failed to update travel "}
     }else{
        console.log("Updated tr...",travelStandAlone)
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
                tenantId,
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





