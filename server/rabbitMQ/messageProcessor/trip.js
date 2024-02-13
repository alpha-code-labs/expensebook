import CashAdvance from "../../models/cashSchema.js"

export default async function cancelTravelRequest(payload){
    try{
        const {travelRequestData, cashAdvancesData} = payload
        const travelRequestId = travelRequestData.travelRequestId

        const result = CashAdvance.updateOne({'travelRequestData.travelRequestId': travelRequestId}, {travelRequestData, cashAdvanceData})
        return {success:true, error:null}
    }catch(e){
        return {success:false, error:e}
        
    }
}