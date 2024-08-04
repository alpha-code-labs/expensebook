import TravelRequest from "../../models/travelRequest.js"

export async function approveRejectTravelRequest(payload){
    try{
        const {travelRequestId, travelRequestStatus, rejectionReason, approvers} = payload
        
        const travelRequest = await TravelRequest.findOne({travelRequestId})
        if(!travelRequest) return {success:false, error: 'Travel Request not found'}

        travelRequest.travelRequestStatus = travelRequestStatus
        travelRequest.rejectionReason = rejectionReason??''
        travelRequest.approvers = approvers

        Object.keys(travelRequest.itinerary).forEach(key=>{
            travelRequest.itinerary[key].forEach(item=>{
                if(item.status = 'pending approval'){
                    item.status = travelRequestStatus
                    item.approvers = approvers
                }
            })
        })
        const result = await travelRequest.save()
        return {success:true, error:null}
    }catch(e){
        return {success:false, error:e}
    }
}

export async function approveRejectTravelRequests(payload) {
    try {
        const results = [];

        for (const request of payload) {
            const { travelRequestId, travelRequestStatus, rejectionReason, approvers } = request;
            
            const travelRequest = await TravelRequest.findOne({ travelRequestId });
            if (!travelRequest) {
                results.push({ travelRequestId, success: false, error: 'Travel Request not found' });
                continue;
            }

            travelRequest.travelRequestStatus = travelRequestStatus;
            travelRequest.rejectionReason = rejectionReason ?? null;
            travelRequest.approvers = approvers;

            Object.keys(travelRequest.itinerary).forEach(key => {
                travelRequest.itinerary[key].forEach(item => {
                    if (item.status === 'pending approval') {
                        item.status = travelRequestStatus;
                        item.approvers = approvers;
                    }
                });
            });

            const result = await travelRequest.save();
            results.push({ travelRequestId, success: true, error: null });
        }

        return {success:true, error:null};
    } catch (e) {
        return { success: false, error: e };
    }
}


export async function approveRejectLegItem(payload){
    try{
        const {travelRequestId, itineraryId, status, approvers, rejectionReason} = payload
        
        const travelRequest = await TravelRequest.findOne({travelRequestId})
        if(!travelRequest) return {success:false, error: 'Travel Request not found'}
        
        let match = false

        Object.keys(travelRequest.itinerary).forEach(key=>{
            if(key!='formsState'){
                travelRequest.itinerary[key].forEach((subItem, ind)=>{
                    if(subItem.itineraryId == itineraryId){
                        match = true
                        travelRequest.itinerary[key][ind].status = status
                        travelRequest.itinerary[key][ind].approvers = approvers
                        travelRequest.itinerary[key][ind].rejectionReason = rejectionReason??''
                    }
                })
            }
        })

        if(!match) return {success:false, error:'itinerary with provided itinerary id not found'}

        const result = await travelRequest.save()

        return {success:true, error:null}
    }catch(e){
        return {success:false, error:e}
        
    } 
}

