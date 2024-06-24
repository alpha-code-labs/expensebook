import CashAdvance from "../models/cashSchema.js";
import cron from 'node-cron';
import { sendToOtherMicroservice, sendToDashboardQueue } from "../rabbitMQ/publisher.js";
import dotenv from 'dotenv'

dotenv.config();

const scheduleTime = process.env.SCHEDULE_TIME??'* * * * * *';

//basic status UpdateBatchJob function...
export async function batchJob(){

    try {   
    
        const results = await CashAdvance.find({
            'cashAdvancesData': {
            $elemMatch: { 'cashAdvanceStatus': 'approved'}
            }
        });

        const updatedResults = results.map(async result=>{
            const cashAdvanceData = result.cashAdvancesData
            const travelRequestData = result.travelRequestData

            cashAdvanceData.forEach(cashAdvance=>{
                if (cashAdvance.cashAdvanceStatus === 'approved') {

                    if(travelRequestData.travelRequestStatus === 'booked'){
                        cashAdvance.cashAdvanceStatus = 'pending settlement';
                    }else{
                        cashAdvance.cashAdvanceStatus = 'awaiting pending settlement';
                    }
                    // if(cashAdvance.approvers.length>0){
                    //     updatedCashAdvances_approval.push(cashAdvance.cashAdvanceId)
                    // }
                    if(result.travelRequestData?.sentToTrip){
                        ca_ids.push(cashAdvance.cashAdvanceId)
                    }    
                }
            })

            travelRequestData.travelRequestStatus = 'pending booking';

            return result.save()
        })

        const res = await Promise.all(updatedResults)
        
        if(res.length >0){
            //send update to dashboard
            await sendToOtherMicroservice(res, 'full-update-batchjob', 'dashboard', 'To update cashadvance records after batch job that changes status from approved to next'  )
        }
        
        //see if some records are already sent to trip 
        const sentToTripRecords = res.filter(record=>record.travelRequestData.sentToTrip)

        if(sentToTripRecords.length>0){
            await sendToOtherMicroservice(sentToTripRecords, 'stauts-update-batch-job', 'trip', 'To update cashAdvance records in trip', 'cash', 'batch')
            await sendToOtherMicroservice(sentToTripRecords, 'stauts-update-batch-job', 'expense', 'To update cashAdvance records in expense', 'cash', 'batch')
        }

        console.log(`BJ: MOV CA from approved to next state :: modified count ${res.length} sentToTrip Count: ${sentToTripRecords.length}`)

        } catch (e) {
        console.error('error in statusUpdateBatchJob', e);
      }    
}

  const batchJobApprovedToNextCash = ()=>{
    // Schedule the cron job to run every day at midnight
    cron.schedule(scheduleTime, () => {
        console.log('Running batch job...');
        batchJob();
    });
  }
  
  // Function to trigger the batch job on demand
  const triggerBatchJobApprovedToNextCash = () => {
    console.log('Triggering batch job on demand...');
    batchJob();
  };
  
  export {batchJobApprovedToNextCash, triggerBatchJobApprovedToNextCash };