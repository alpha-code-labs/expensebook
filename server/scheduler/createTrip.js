import CashAdvance from "../models/cashSchema.js";
import cron from 'node-cron';


const TRIP_API = 'http://localhost:8001/trip/'
const trip_endpoint = 'trips/create/multi'

const APPROVAL_API = 'http://localhost:8001/approval'
const approval_endpoint = ''

//basic status UpdateBatchJob function...
async function batchJob(){
    try {   
            const updatedCashAdvances_approval = []
            const updatedCashAdvances_trip_expense = []

            const results = await CashAdvance.find({
                'travelRequestData.travelRequestStatus' : 'booked',
                'travelRequestData.sentToTrip' : false,
            });
            
            //send results to trip 
            //const res_trip  = await axios.post(`${TRIP_API}/${trip_endpoint}`, {trips:results})
            //if(res_trip.status!=200) throw new Error('Unable to update cash advance status in trip-ms')

            const approvedTravelRequestIds = []
            //iterate throught results and check for TR that went for approval
            results.forEach(result=>{
              if(result.approvers.length>0){
                approvedTravelRequestIds.push(result.travelRequestData.travelRequestId)
              }
            })

            //send results to approval
            //const res_approval  = await axios.post(`${APPROVAL_API}/${approval_endpoint}`, {travelRequestIds, status:'booked'})
            //if(res_approval.status!=200) throw new Error('Unable to send data to approval-ms')

            //update  sentToTrip flag to true 
            const updateResults = await CashAdvance.updateMany({
                'travelRequestData.travelRequestStatus' : 'booked',
                'travelRequestData.sentToTrip' : false,
                'travelRequestData.isCashAdvanceTaken': true,
            }, 
            {$set : {'travelRequestData.sentToTrip':true}});

        } catch (e) {
        console.error('error in statusUpdateBatchJob', e);
      }    
}

// Schedule the cron job to run every day at midnight
cron.schedule('0 0 * * *', () => {
    console.log('Running batch job...');
    batchJob();
  });
  
  // Function to trigger the batch job on demand
  const triggerBatchJob = () => {
    console.log('Triggering batch job on demand...');
    batchJob();
  };
  
  export { triggerBatchJob };