import CashAdvance from '../models/cashSchema.js'
import cron from 'node-cron';
import { sendToDashboardQueue } from '../rabbitMQ/publisher.js'
import { sendToOtherMicroservice } from '../rabbitMQ/publisher.js';
import dotenv from 'dotenv';

dotenv.config();

const scheduleTime = process.env.SCHEDULE_TIME??'* * * * *';
//basic status UpdateBatchJob function...
export async function statusUpdateBatchJob(){
    try {
        const results = await CashAdvance.find({'travelRequestData.travelRequestStatus': 'approved'})

        if(results.length == 0) {
            console.log(0, 'modifiedCount')
            return;
        }
    
        //modify records
        const updatedResults = results.map(async result=>{
            result.travelRequestData.travelRequestStatus = 'pending booking'
            const travelItemsList = ['cabs', 'flights', 'trains', 'buses', 'carRentals', 'hotels']
            travelItemsList.forEach(itineraryItemType=>{
                result.travelRequestData.itinerary[itineraryItemType].forEach((item,ind)=>{
                    if(item.status == 'approved'){
                        result.travelRequestData.itinerary[itineraryItemType][ind].status = 'pending booking';
                        // item.status == 'pending booking'
                    }
                })
            })

            return result.save()
        })

        const res = await Promise.all(updatedResults)

        if(res.length > 0){
            //send to dashboard
            await sendToOtherMicroservice(res, 'full-update-batchjob', 'dashboard', 'To update cashadvance data after running travel status update batch job from approved to Next state', 'cash', 'batch')
        }
        

        console.log(res.length, 'modifiedCount')
      } catch (e) {
        console.error('error in statusUpdateBatchJob', e);
      }    
}


const batchJobApprovedToNextTravel = ()=>{
    // Schedule the cron job to run every day at midnight
    cron.schedule(scheduleTime, () => {
        console.log('Running batch job...');
        statusUpdateBatchJob();
    });   
}

  // Function to trigger the batch job on demand
  const triggerBatchJobApprovedToNextTravel = () => {
    console.log('Triggering batch job on demand...');
    statusUpdateBatchJob();
  };


  export {batchJobApprovedToNextTravel, triggerBatchJobApprovedToNextTravel};