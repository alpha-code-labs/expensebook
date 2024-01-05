import CashAdvance from "../models/cashSchema.js";
import cron from 'node-cron';


const TRIP_CASH_API = 'http://localhost:8001/trip/cash-advances/multi'
const EXPENSE_CASH_API = 'http://localhost:8001/expense/cash-advances/multi'
const APPROVAL_CASH_API = 'http://localhost:8001/approval/cash-advances/multi'

//basic status UpdateBatchJob function...
export async function batchJob(){

    try {   

            const updatedCashAdvances_approval = []
            const updatedCashAdvances_trip_expense = []


            const results = await CashAdvance.find({
                'cashAdvances': {
                $elemMatch: { 'cashAdvanceStatus': 'approved' }
                }
            });
            
            // Iterate through each result
            for (const result of results) {
                
                // Update the corresponding cashAdvances elements with cashAdvanceStatus 'awaiting pending settlement'
                result.cashAdvances.forEach(async (cashAdvance) => {
                    if (cashAdvance.cashAdvanceStatus === 'approved') {
                        cashAdvance.cashAdvanceStatus = 'awaiting pending settlement';
                        if(cashAdvance.approvers.length>0){
                            updatedCashAdvances_approval.push(cashAdvance.cashAdvanceId)
                        }
                        if(result.embeddedTravelRequest?.sentToTrip){
                            updatedCashAdvances_trip_expense.push(cashAdvance.cashAdvanceId)
                        }    
                    }
                });
            


                // //send update request to other microservices with status 'awaiting pending settlement'
                // if(updatedCashAdvances_approval.length>0){
                //     //send to approval
                //     const res  = await axios.post(APPROVAL_CASH_API, {cashAdvancesIds:updatedCashAdvances_approval, cashAdvanceStatus:'awaiting pending settlement' })
                //     if(res.status!=200) throw new Error('Unable to update cash advance status in approval-ms')    
                // }

                // if(updatedCashAdvances_approval.length>0){
                //     //send to trip and expense
                //     const res_trip  = await axios.post(TRIP_CASH_API, {cashAdvancesId:updatedCashAdvances_approval, cashAdvanceStatus:'awaiting pending settlement'})
                //     if(res_trip.status!=200) throw new Error('Unable to update cash advance status in trip-ms')
                    
                //     const res  = await axios.post(EXPENSE_CASH_API, {cashAdvancesId:updatedCashAdvances_approval, cashAdvanceStatus:'awaiting pending settlement'})
                //     if(res.status!=200) throw new Error('Unable to update cash advance status in approval-ms')
                // }


                // Save the updated document
                await result.save();

                }

          
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