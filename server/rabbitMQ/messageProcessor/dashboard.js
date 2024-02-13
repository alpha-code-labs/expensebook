import CashAdvance from "../../models/cashSchema.js"

export async function addALeg(payload /* */){
    try{
        const {travelRequestId, tenantId, itineraryType, itineraryDetails} = payload
        
        const cashAdvance = CashAdvance.findOne({'travelRequestData.travelRequestId' : travelRequestId}) 
        if(!cashAdvance) return {success:false, error: 'Travel Request not found'}

        let formIdCount = cashAdvance.travelRequestData.itinerary.formState.length
    
        cashAdvance.travelRequestData.itinerary[itineraryType] = [...cashAdvance.travelRequestData.itinerary[itineraryType], ...itineraryDetails]

        const result = cashAdvance.save()

        return {success:true, error:null}
    }catch(e){
        return {success:false, error:encodeURI}
        
    }
}

