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
        const {listOfClosedStandAloneTravelRequests} = payload
        const result = await CashAdvance.updateMany(
            { 'travelRequestData.travelRequestId': { $in : listOfClosedStandAloneTravelRequests } },
            { $set : {'travelRequestData.travelRequestStatus': 'completed' } }
        );
        return {success:true, error:null}
    }catch(e){
        return {success:false, error:e}
    }
}