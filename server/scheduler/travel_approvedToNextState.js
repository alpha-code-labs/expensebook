import CashAdvance from '../models/cashSchema.js'

//basic status UpdateBatchJob function...
export async function statusUpdateBatchJob(){
    try {
        const results = await CashAdvance.find({'travelRequestData.travelrequestStatus': 'approved'})
        
        const approvedTravelRequestIds = []
            //iterate throught results and check for TR that went for approval
            results.forEach(result=>{
              if(result.travelRequestData.approvers.length>0){
                approvedTravelRequestIds.push(result.travelRequestData.travelRequestId)
              }
            })

            //send results to approval
            //const res_approval  = await axios.post(`${APPROVAL_API}/${approval_endpoint}`, {travelRequestIds, status:'pending booking'})
            //if(res_approval.status!=200) throw new Error('Unable to send data to approval-ms')

            //modify records
            results.forEach(result=>{
                result.travelRequestData.travelRequestStatus = 'pending booking'
                result.cashAdvancesData.forEach(advance=>{
                    if(advance.cashAdvanceStatus = 'approved'){
                        advance.cashAdvanceStatus = 'awaiting pending settlement'
                    }
                })
            })

            //update records db
            const result = await results.save()
  
        console.log(result.modifiedCount, 'modifiedCount', result.matchedCount, 'matchedCount')
      } catch (e) {
        console.error('error in statusUpdateBatchJob', e);
      }    
}