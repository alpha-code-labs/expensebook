import CashAdvance from "../../models/cashSchema.js"

// export async function addALeg(payload /* */){
//     try{
//         console.log("add a leg payload", JSON.stringify(payload,'',2))
//         const {travelRequestId, tenantId, itineraryType, itineraryDetails} = payload
        
//         const cashAdvance = await CashAdvance.findOne({'travelRequestData.travelRequestId' : travelRequestId}) 
//         if(!cashAdvance) return {success:false, error: 'Travel Request not found'}
    
//         cashAdvance.travelRequestData.itinerary[itineraryType] = [...cashAdvance.travelRequestData.itinerary[itineraryType], ...itineraryDetails]
//         await cashAdvance.save()

//         return {success:true, error:null}
//     }catch(e){
//         return {success:false, error:e}
        
//     }
// }

export async function addALeg(payload){
    try{
        console.log("add a leg payload", JSON.stringify(payload,'',2))
        const {travelRequestId,itinerary} = payload
        
        const cashAdvance = await CashAdvance.findOneAndUpdate({'travelRequestData.travelRequestId' : travelRequestId},{
            $set:{'travelRequestData.itinerary':itinerary}
        }) 

        if(!cashAdvance) return {success:false, error: 'Travel Request not found'}
        return {success:true, error:null}
    }catch(e){
        return {success:false, error:e}
        
    }
}


export async function updateBookingAdmin(payload){
    try{
        const {travelRequestId, assignedTo} = payload;
        
        const res = await CashAdvance.updateOne({'travelRequestData.travelRequestId' : travelRequestId}, {$set: { 'travelRequestData.assignedTo' : assignedTo  }}) 
        
        if(res.matchedCount == 0) {
            return {success: false, error: 'Travel Request not found'}
        }

        return {success: true, error: null}

    }catch(e){
        return {success: false, error:e}
    }
}

export async function updateFinanceAdmin(payload){
    try{
        const {travelRequestId, assignedTo} = payload;
        
        const res = await CashAdvance.updateOne({'travelRequestData.travelRequestId' : travelRequestId}, {$set: { 'cashAdvancesData.assignedTo' : assignedTo }}) 
        
        if(res.matchedCount == 0) {
            return {success: false, error: 'Travel Request not found'}
        }

        return {success: true, error: null}

    }catch(e){
        return {success: false, error:e}
    }
}



