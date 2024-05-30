// import CashAdvance from "../models/cashSchema.js";
// import cron from 'node-cron';


// const TRIP_CASH_API = 'http://localhost:8001/trip/cash-advances/multi'
// const EXPENSE_CASH_API = 'http://localhost:8001/expense/cash-advances/multi'
// const APPROVAL_CASH_API = 'http://localhost:8001/approval/cash-advances/multi'

// //basic status UpdateBatchJob function...
// export async function batchJob(){

//     try {   
//             const updatedCashAdvances_approval = []
//             const updatedCashAdvances_trip_expense = []
//             const dashBoardupdates = []

//             // const results = await CashAdvance.find({
//             //     'cashAdvanceData': {
//             //     $elemMatch: { 'cashAdvanceStatus': 'awaiting pending settlement' }
//             //     }
//             // });
            

//             const results = await CashAdvance.find({'travelRequestData.travelRequestStatus':'booked'})

//             // Iterate through each result
//             for (const result of results) {

//                 const ca_res = []
//                 result.cashAdvancesData.forEach(async (cashAdvance) => {
//                     if (cashAdvance.cashAdvanceStatus === 'awaiting pending settlement') {
//                         cashAdvance.cashAdvanceStatus = 'pending settlement';
//                         // if(cashAdvance.approvers.length>0){
//                         //     updatedCashAdvances_approval.push(cashAdvance.cashAdvanceId)
//                         // }
//                         if(result.travelRequestData?.sentToTrip){
//                             ca_ids.push(cashAdvance.cashAdvanceId)
//                         }    
//                     }
//                 });

//                 const travelRequestId = result.travelRequestData.travelRequestId
//                 const cashAdvanceIds = ca_ids
//                 const cashAdvanceStatus = 'pending settlement'


//                 if(ca_ids.length>0){
//                     updatedCashAdvances_trip_expense.push({travelRequestId, cashAdvanceIds, cashAdvanceStatus})
//                     dashBoardupdates.push(result)
//                 }
                    
//             }
            


//                 // //send update request to oths microservices
//                 // if(updatedCashAdvances_approval.length>0){
//                 //     //send to approval
//                 //     const res  = await axios.post(APPROVAL_CASH_API, {cashAdvancesIds:updatedCashAdvances_approval, cashAdvanceStatus:'pending settlement' })
//                 //     if(res.status!=200) throw new Error('Unable to update cash advance status in approval-ms')    
//                 // }

//                 // if(updatedCashAdvances_approval.length>0){
//                 //     //send to trip and expense
//                 //     const res_trip  = await axios.post(TRIP_CASH_API, {cashAdvancesId:updatedCashAdvances_approval, cashAdvanceStatus:'pending settlement'})
//                 //     if(res_trip.status!=200) throw new Error('Unable to update cash advance status in trip-ms')
                    
//                 //     const res  = await axios.post(EXPENSE_CASH_API, {cashAdvancesId:updatedCashAdvances_approval, cashAdvanceStatus:'pending settlement'})
//                 //     if(res.status!=200) throw new Error('Unable to update cash advance status in approval-ms')
//                 // }


//                 // Save the updated document
//                 //send update request to other microservices with status 'awaiting pending settlement'
//                 if(updatedCashAdvances_approval.length>0){
//                     //send to trip
//                     const t_res  = await axios.post(TRIP_CASH_API, updatedCashAdvances_trip_expense )
//                     if(t_res.status!=200) throw new Error('Unable to update cash advance status in trip-ms')
                    
//                     //send to expense
//                     const e_res  = await axios.post(EXPENSE_CASH_API, updatedCashAdvances_trip_expense)
//                     if(e_res.status!=200) throw new Error('Unable to update cash advance status in expense-ms')
//                 }
            
//                 sendToDashboardQueue(dashBoardupdates, false, 'batch')
//                 results.save()
                
//         } catch (e) {
//         console.error('error in statusUpdateBatchJob', e);
//       }    
// }


// // Schedule the cron job to run every day at midnight
// cron.schedule('0 0 * * *', () => {
//     console.log('Running batch job...');
//     batchJob();
//   });
  
//   // Function to trigger the batch job on demand
//   const triggerBatchJob = () => {
//     console.log('Triggering batch job on demand...');
//     batchJob();
//   };
  
//   export { triggerBatchJob };