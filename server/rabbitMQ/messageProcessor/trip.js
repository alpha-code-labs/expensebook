import CashAdvance from "../../models/cashSchema.js"

export async function cancelTravelRequest(payload){
    try{
        const {travelRequestData, cashAdvancesData} = payload
        const travelRequestId = travelRequestData.travelRequestId

        const result = CashAdvance.updateOne({'travelRequestData.travelRequestId': travelRequestId}, {travelRequestData, cashAdvancesData})
        return {success:true, error:null}
    }catch(e){
        return {success:false, error:e}
        
    }
}


export async function markCompleted(payload){
    try{
        const {listOfClosedStandAloneTravelRequests, listOfCompletedStandAloneTravelRequests} = payload
        
        if(listOfClosedStandAloneTravelRequests?.lenght > 0){
            const result = await CashAdvance.updateMany(
                { 'travelRequestData.travelRequestId': { $in : listOfClosedStandAloneTravelRequests } },
                { $set : {'travelRequestData.travelRequestStatus': 'closed' } }
            );
        }

        if(listOfCompletedStandAloneTravelRequests?.lenght > 0){
            const result = await CashAdvance.updateMany(
                { 'travelRequestData.travelRequestId': { $in : listOfCompletedStandAloneTravelRequests } },
                { $set : {'travelRequestData.travelRequestStatus': 'completed' } }
            );
        }
        
        return {success:true, error:null}
    }catch(e){
        return {success:false, error:e}
    }
}