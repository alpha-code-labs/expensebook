import CashAdvance from "../models/cashSchema.js";
import cron from 'node-cron';
import { sendToDashboardQueue, sendToOtherMicroservice } from "../rabbitMQ/publisher.js";
import dotenv from 'dotenv'

dotenv.config();

const scheduleTime = process.env.SCHEDULE_TIME??'* * * * * *';

//basic status UpdateBatchJob function...
async function createTrip(){
    try {   
            
            const results = await CashAdvance.find({
                'travelRequestData.travelRequestStatus' : 'booked',
                'travelRequestData.sentToTrip' : false,
            });


            results.map(result=>{
              const travelRequest = result.travelRequestData
              const cashAdvances = result.cashAdvancesData

              travelRequest.sentToTrip = true

              cashAdvances.forEach(cashAdvance=>{
                if(cashAdvance.cashAdvanceStatus == 'awaiting pending settlement'){
                  cashAdvance.cashAdvanceStatus = 'pending settlement'
                }
              })

              return result.save()
            })

            const updatedResults = await Promise.all(results)

            if(updatedResults.length == 0) {
              console.log(`BJ: SEND booked requests to trip and dashboard :: match count: ${updatedResults.length}`)
              return;
            }

            //send to trip
            await sendToOtherMicroservice(updatedResults, 'trip-creation', 'trip', 'full update for all newly booked travel requests from cash', 'cash','batch')
            //send to dashboard
            await sendToOtherMicroservice(updatedResults, 'full-update-batchjob', 'dashboard', 'To update cashadvance data after running trip creation batch job', 'cash', 'batch')

            //update  sentToTrip flag to true 
            console.log(`BJ: SEND booked requests to trip and dashboard :: match count: ${updatedResults.length}`)

        } catch (e) {
        console.error('error in statusUpdateBatchJob', e);
      }    
}

const batchJobCreateTrip = ()=>{
  // Schedule the cron job to run every day at midnight
  cron.schedule(scheduleTime, () => {
    console.log('Running batch job for booked requests');
    createTrip();
  });
}
   
  // Function to trigger the batch job on demand
  const triggerBatchJobCreateTrip = () => {
    console.log('Triggering batch job on demand...');
    createTrip();
  };
  
  export { triggerBatchJobCreateTrip, batchJobCreateTrip};