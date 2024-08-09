import CashAdvance from "../../models/cashSchema.js"

export async function approveRejectTravelRequest(payload){
    try{
        const {travelRequestId, travelRequestStatus, rejectionReason, approvers} = payload
        
        const cashAdvance = await CashAdvance.findOne({'travelRequestData.travelRequestId' : travelRequestId}) 
        if(!cashAdvance) return {success:false, error: 'Travel Request not found'}


        cashAdvance.travelRequestData.travelRequestStatus = travelRequestStatus
        cashAdvance.travelRequestData.rejectionReason = rejectionReason??''
        cashAdvance.travelRequestData.approvers = approvers

        Object.keys(cashAdvance.travelRequestData.itinerary).forEach(key=>{
            cashAdvance.travelRequestData.itinerary[key].forEach(item=>{
                if(item.status == 'pending approval'){
                    item.status = travelRequestStatus
                    item.approvers = approvers
                }
            })
        })


        const result = await cashAdvance.save()

        return {success:true, error:null}
    }catch(e){
        return {success:false, error:e}
        
    }
}

export async function approveRejectCashAdvance(payload){
    try{
        const {travelRequestId, cashAdvanceId, cashAdvanceStatus, cashAdvanceRejectionReason, approvers} = payload
        
        const cashAdvance = await CashAdvance.findOne({'travelRequestData.travelRequestId' : travelRequestId}) 
        if(!cashAdvance) return {success:false, error: 'Travel Request not found'}

        cashAdvance.cashAdvancesData.forEach(ca=>{
            if(ca.cashAdvanceId == cashAdvanceId){
                ca.cashAdvanceStatus = cashAdvanceStatus
                ca.cashAdvanceRejectionReason  = cashAdvanceRejectionReason
                ca.approvers = approvers
            }
        })

        const result = await cashAdvance.save()

        return {success:true, error:null}
    }catch(e){
        return {success:false, error:e}
        
    }
}

export async function approveRejectLegItem(payload){
    try{
        const {travelRequestId, itineraryId, status, approvers} = payload
        
        const cashAdvance = await CashAdvance.findOne({'travelRequestData.travelRequestId': travelRequestId})
        if(!cashAdvance) return {success:false, error: 'Travel Request not found'}
        
        let match = false

        Object.keys(cashAdvance.travelRequestData.itinerary).forEach(key=>{
            if(key!='formsState'){
                cashAdvance.travelRequestData.itinerary[key].forEach((subItem, ind)=>{
                    if(subItem.itineraryId == itineraryId){
                        match = true
                        cashAdvance.travelRequestData.itinerary[key][ind].status = status
                        cashAdvance.travelRequestData.itinerary[key][ind].approvers = approvers
                    }
                })
            }
        })

        if(!match) return {success:false, error:'itinerary with provided itinerary id not found'}

        await cashAdvance.save()

        return {success:true, error:null}
    }catch(e){
        return {success:false, error:e}
        
    } 
}

export async function approveRejectRequests(payload) {
    try {
        const results = [];
        console.log("payload",payload)

        for (const request of payload) {
            const {
                travelRequestId,
                travelRequestStatus,
                rejectionReason,
                approvers,
                cashAdvances
            } = request;

            // Find the cash advance based on the travel request ID
            const cashAdvance = await CashAdvance.findOne({ 'travelRequestData.travelRequestId': travelRequestId });
            if (!cashAdvance) {
                results.push({ travelRequestId, success: false, error: 'Travel Request not found' });
                continue;
            }

            // Update travel request details
            cashAdvance.travelRequestData.travelRequestStatus = travelRequestStatus;
            cashAdvance.travelRequestData.rejectionReason = rejectionReason;
            cashAdvance.travelRequestData.approvers = approvers;

            // Update itinerary items if pending approval
            Object.keys(cashAdvance.travelRequestData.itinerary).forEach(key => {
                cashAdvance.travelRequestData.itinerary[key].forEach(item => {
                    if (item.status === 'pending approval') {
                        item.status = travelRequestStatus;
                        item.approvers = approvers;
                    }
                });
            });

            // Update cash advances
            cashAdvances.forEach(ca => {
                cashAdvance.cashAdvancesData.forEach(existingCa => {
                    if (existingCa.cashAdvanceId.toString() === ca.cashAdvanceId) {
                        existingCa.cashAdvanceStatus = ca.cashAdvanceStatus;
                        existingCa.cashAdvanceRejectionReason = ca.cashAdvanceRejectionReason;
                        existingCa.approvers = ca.approvers;
                    }
                });
            });

            // Save the updates
            await cashAdvance.save();
            console.log("cashAdvance",cashAdvance)
            results.push({ travelRequestId, success: true, error: null });
        }

        return {success: true, error: null};
    } catch (e) {
        return { success: false, error: e };
    }
}