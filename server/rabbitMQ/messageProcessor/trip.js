import TravelRequest from "../../models/travelRequest.js"

export default async function cancelTravelRequest(payload){
    try{
        const {travelRequestData} = payload
        const travelRequestId = travelRequestData.travelRequestId

        const result = await TravelRequest.updateOne({travelRequestId}, {...travelRequestData})
        
        return {success:true, error:null}
    }catch(e){
        return {success:false, error:e}
        
    }
}