import TravelRequest from "../models/travelRequest.js";
import { sendToDashboardQueue, sendToOtherMicroservice } from "../rabbitMQ/publisher.js";

//basic status UpdateBatchJob function...
export async function statusUpdateBatchJob(){
    try {
        //const results = await TravelRequest.find({travelRequestStatus: 'approved'})
        
        const travelRequestsToUpdate = await TravelRequest.find({ travelRequestStatus: 'approved' });

        const updatedTravelRequests = travelRequestsToUpdate.map((travelRequest) => {
          travelRequest.travelRequestStatus = 'pending booking';
          
          ['flights', 'trains', 'cabs', 'carRentals', 'buses'].map(itineraryType=>{
            travelRequest.itinerary[itineraryType].forEach(item=>{
              if(item.status == 'approved'){
                item.status = 'pending booking'
              }
            })
          })

          return travelRequest.save();
        });
        
        // Wait for all the updates to complete
        const res = await Promise.all(updatedTravelRequests);
  
        //send to dashboard
        if(res.length>0){
          // console.log(res)
          await sendToDashboardQueue(res, 'false', 'online')
          sendToOtherMicroservice(res, 'Batch Job To Update all approved')
        }
        console.log(res.length, 'modified count')

      } catch (e) {
        console.error('error in statusUpdateBatchJob', e);
      }    
}