import TravelRequest from "../models/travelRequest.js";

//basic status UpdateBatchJob function...
export async function statusUpdateBatchJob(){
    try {
        const result = await TravelRequest.updateMany({ travelRequestStatus:'approved' }, {$set: { travelRequestStatus: 'pending booking'} });
        console.log(result.modifiedCount, 'modifiedCount', result.matchedCount, 'matchedCount')
      } catch (e) {
        console.error('error in statusUpdateBatchJob', e);
      }    
}