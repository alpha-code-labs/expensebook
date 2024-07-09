import TravelRequest from "../../models/travelRequest.js"

export async function cancelTravelRequest(payload){
    try{
        const {travelRequestData} = payload
        const travelRequestId = travelRequestData.travelRequestId

        const result = await TravelRequest.updateOne({travelRequestId}, {...travelRequestData})
        
        return {success:true, error:null}
    }catch(e){
        return {success:false, error:e}
        
    }
}

export async function markCompleted(payload){
    try{
        const {listOfClosedStandAloneTravelRequests} = payload
        const result = await TravelRequest.updateMany(
            { travelRequestId: { $in : listOfClosedStandAloneTravelRequests }}, 
            { $set : { travelRequestStatus: 'completed' } });
        return {success:true, error:null}
    }catch(e){
        return {success:false, error:e}
    }
}