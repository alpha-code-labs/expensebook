import TravelRequest from "../models/travelRequest.js";
import cron from 'node-cron';
import { sendToOtherMicroservice } from "../rabbitMQ/publisher.js";
import dotenv from 'dotenv'

dotenv.config();


const scheduleTime = process.env.SCHEDULE_TIME??'* * * * *';

//basic status UpdateBatchJob function...
async function createTripBatchJob(){

    try {   
          //update  sentToTrip flag to true 
          const results = await TravelRequest.find({
              travelRequestStatus : 'booked',
              sentToTrip : false,
              isCashAdvanceTaken: false,
          })

          const promises = results.map(result=>{
            result.sentToTrip = true;
            return result.save()
          })

          const updatedResults =  await Promise.all(promises)
          
          //send to trip ms
          if(updatedResults.length>0){
            // await sendToOtherMicroservice(updatedResults, 'Booked Travel Requests Update from Travel MS', 'trip', 'travel', 'batch', 'trip-creation')
            const payload=updatedResults;
            const comments='Booked Travel Requests Update from Travel MS';
            const destination='trip';
            const source = 'travel'; 
            const onlineVsBatch = 'batch';
            const action = 'trip-creation';
            await sendToOtherMicroservice(payload, comments, destination, source, 'batch', 'trip-creation');
          }

          //update  sentToTrip flag to true 
          console.log(`BJ: SEND booked requests to trip :: match count: ${updatedResults.length}`)
        } catch (e) {
        console.error('error in statusUpdateBatchJob', e);
      }    
}

 // Schedule the cron job to run every day at midnight
 cron.schedule(scheduleTime, () => {
    console.log('Running batch job...');
    createTripBatchJob();
  });
  
  // Function to trigger the batch job on demand
  const triggerBatchJob = () => {
    console.log('Triggering batch job on demand...');
    createTripBatchJob();
  };
  
  export { triggerBatchJob, createTripBatchJob };