import TravelRequest from "../models/travelRequest.js";

//basic status UpdateBatchJob function...
export async function statusUpdateBatchJob(){
    try {
        const results = await TravelRequest.find({travelRequestStatus: 'approved'})
        
        const approvedTravelRequestIds = []
            //iterate throught results and check for TR that went for approval
            results.forEach(result=>{
              if(result.approvers.length>0){
                approvedTravelRequestIds.push(result.travelRequestId)
              }
            })

            //send results to approval
            //const res_approval  = await axios.post(`${APPROVAL_API}/${approval_endpoint}`, {travelRequestIds, status:'pending booking'})
            //if(res_approval.status!=200) throw new Error('Unable to send data to approval-ms')

        const result = await TravelRequest.updateMany({ travelRequestStatus:'approved' }, {$set: { travelRequestStatus: 'pending booking'} });

  
        console.log(result.modifiedCount, 'modifiedCount', result.matchedCount, 'matchedCount')
      } catch (e) {
        console.error('error in statusUpdateBatchJob', e);
      }    
}