import amqp from 'amqplib';
import { updateHRMaster } from './messageProcessor.js/onboardingMessage.js';
import {  addALegToTravelRequestData, deleteALegFromTravelRequestData, tripArrayFullUpdate, tripFullUpdate, updateTripToCompleteOrClosed } from './messageProcessor.js/trip.js';
import { settleExpenseReport,  settleNonTravelExpenseReport, settleOrRecoverCashAdvance } from './messageProcessor.js/finance.js';
import dotenv from 'dotenv';
import { cashStatusUpdatePaid } from './messageProcessor.js/cashAdvanceMessage.js';
import { approveRejectCashRaisedLater, expenseReportApproval, nonTravelReportApproval, updatePreferences } from './messageProcessor.js/dashboard.js';
import { getRabbitMQConnection } from './connection.js';

dotenv.config();

export async function startConsumer(receiver) {
  try{
  const connection = await getRabbitMQConnection();
  const channel = await connection.createChannel();

  const handleMessageAcknowledgment = (channel, msg, res) => {
    try{
      if (res.success) {
        channel.ack(msg);
        console.log('Message acknowledged successfully');
      } else {
        // channel.nack(msg, false, true);
        const content = JSON.parse(msg.content.toString());
        const payload = content?.payload
        console.log("message", JSON.stringify(payload,'',2))
        // channel.nack(msg, false, true);
        console.log('Error processing message, requeuing');
      }
    } catch(error){
      console.error('Error handling message acknowledgment:', error);
    }
  };

  if (!channel) {
    console.error("Failed to establish connection to RabbitMQ.");
    return; // Exit function if connection failed
  }

  const exchangeName = 'amqp.dashboard';
  const queue = `q.${receiver}`;
  const routingKey = `rk.${receiver}`;
  
  console.log(`Asserting exchange: ${exchangeName}`);
  await channel.assertExchange(exchangeName, 'direct', { durable: true });
  
  console.log(`Asserting queue: ${queue}`);
  await channel.assertQueue(queue, { durable: true });
  
  console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
  await channel.bindQueue(queue, exchangeName, routingKey);
  
  console.log('listening for messages. To exit press CTRL+C');
        // Listen for response
        channel.consume(queue, async (msg) => {
          if (msg && msg.content) {
  
        const content = JSON.parse(msg.content.toString());

        console.log(`coming from ${content.headers?.source} meant for ${content.headers?.destination}`)
        // console.log('payload', content?.payload)
        const payload = content?.payload
        const source = content?.headers?.source
        const action = content?.headers?.action
        console.log("source", source,"action", action)
        if(content.headers.destination == 'expense'){
          switch(source){
            case 'onboarding':
            case 'system-config':
              console.log('trying to update HR Master')
              const res = await updateHRMaster(payload)
              console.log(res)
              handleMessageAcknowledgment(channel, msg, res);
              break;
            
            case 'trip':
              switch(action){
                case 'full-update-array':
                  console.log('trying to batch job -  trip to expense 1st time ')
                  const res1 = await tripArrayFullUpdate(payload)
                  console.log(res1)
                  handleMessageAcknowledgment(channel, msg, res1);
                  break;

                case 'full-update':
                  console.log('trying to update Travel and cash after cancellation ')
                  const res2 = await tripFullUpdate(payload)
                  console.log(res2)
                  handleMessageAcknowledgment(channel, msg, res2);
                  break;

                case 'status-completed-closed':
                    if(payload){
                      const result = await updateTripToCompleteOrClosed(payload)
                      console.log("results after trip status updated to completed or closed  ", result)
                      if(result.success) {
                          channel.ack(msg);
                          console.log('Message processed successfully');
                        } else {
                          // Implement retry mechanism or handle error
                          console.log('Update failed with error:', result.error);
                        }
                      }
                    else{
                      console.error(Error,"Payload is not an array");
                    }
                    break;

                default:
                console.warn(`Unknown action '${action}' for source ${source}`);
                break;
              }
              break;

            case 'finance':
              switch(action){
                case 'settle-ca':
                case 'recover-ca':
                  console.log("settle-ca or recover-ca ")
                  const res3 = await settleOrRecoverCashAdvance(payload);
                  handleMessageAcknowledgment(channel, msg, res3);
                  break;

                case 'expense-paid':
                  console.log(" expense header status paid")
                  const res4 = await settleExpenseReport(payload);
                  handleMessageAcknowledgment(channel, msg, res4);
                  break;
                
                case 'non-travel-paid':
                  console.log(" expense header status paid - 'non-travel-paid'")
                  const res6 = await settleNonTravelExpenseReport(payload);
                  handleMessageAcknowledgment(channel, msg, res6);
                  break;

                
                default:
                  console.warn(`unknown action ${action} for source ${source}`)
                  break;
              }
              break;

            case 'dashboard':
              switch(action){
                case 'profile-update':
                  const res7 = await updatePreferences(payload);
                  console.log(res7)
                  handleMessageAcknowledgment(channel, msg, res7);
                  break;
                
                case 'approve-reject-ca-later':
                  const res8 = await approveRejectCashRaisedLater(payload);
                  console.log(res8)
                  handleMessageAcknowledgment(channel, msg, res8);
                  break;

                case 'expense-approval':
                  const res9 = await expenseReportApproval(payload);
                  console.log(res9)
                  handleMessageAcknowledgment(channel, msg, res9);
                  break;

                case 'nte-full-update':
                  const res10 = await nonTravelReportApproval(payload);
                  console.log(res10)
                  handleMessageAcknowledgment(channel, msg, res10);
                  break;

                default:
                  console.warn(`Unknown action '${action}' for source ${source}`);
                  break;
              }
              break;

            case 'travel':
              switch(action){
                case 'add-leg':
                  console.log('add-leg from travel microservice to expense microservice')
                  const res11 = await addALegToTravelRequestData(payload);
                  console.log(res11)
                  handleMessageAcknowledgment(channel, msg, res11);
                  break;
                
                case 'remove-leg':
                    console.log('add-leg from travel microservice to expense microservice')
                    const res12 = await deleteALegFromTravelRequestData(payload);
                    console.log(res12)
                    handleMessageAcknowledgment(channel, msg, res12);
                    break;

                default:
                  console.warn(`Unknown action '${action}' for source ${source}`);
                break;
              }
              break;
            
            case 'cash':
              switch(action){
                case 'add-leg':
                  console.log('add-leg from cash microservice to expense microservice')
                  const res12 = await addALegToTravelRequestData(payload);
                  handleMessageAcknowledgment(channel, msg, res12);
                  break;

                case 'status-update-batch-job':
                  console.log('status-update-batch-job')
                  const res13 = await cashStatusUpdatePaid(payload);
                  handleMessageAcknowledgment(channel, msg, res13);
                  break;

                default:
                  console.warn(`Unknown action '${action}' for source ${source}`);
                  break;
              }
              break;

            case 'approval':
              switch(action){
                case 'expense-approval':
                  const res14 = await expenseReportApproval(payload);
                  console.log(res14)
                  handleMessageAcknowledgment(channel, msg, res14);
                  break;
                
                default:
                  console.warn(`Unknown action ${action} for source ${source}`)
                  break;
              }
              break;
            

            default:
              console.warn(`Unknown source '${source}' for action ${action}`)
              break;
          }
      }
      }}, { noAck: false });
} catch(e){
  throw e
}}















//old code 
// if(source == 'onboarding' || source == 'system-config'){
//   console.log('trying to update HR Master')
//   const res = await updateHRMaster(payload)
//   console.log(res)
//   handleMessageAcknowledgment(channel, msg, res);
// } else if(source == 'trip'){
//     if(action == 'full-update-array'){
//       console.log('trying to batch job -  trip to expense 1st time ')
//       const res = await tripArrayFullUpdate(payload)
//       console.log(res)
//       handleMessageAcknowledgment(channel, msg, res);
//     }else if(action == 'full-update'){
//       console.log('trying to update Travel and cash after cancellation ')
//       const response = await tripFullUpdate(payload)
//       console.log(res)
//       handleMessageAcknowledgment(channel, msg, res);
//     } else {
//       console.warn(`Unknown action '${action}' for source ${source}`);
//     }
// } else if(source == 'finance'){
// if(action == 'settle-ca' || action == 'recover-ca') {
//     console.log("settle-ca or recover-ca ")
//     const res = await settleOrRecoverCashAdvance(payload);
//     handleMessageAcknowledgment(channel, msg, res);
// }else if(action == 'expense-paid') {
//     console.log(" expense header status paid")
//     const res = await settleExpenseReport(payload);
//     handleMessageAcknowledgment(channel, msg, res);
// }else if(action == 'settle-expense-Paid-and-distributed') {
//   console.log(" expense header status paid and distributed")
//   const res = await settleExpenseReportPaidAndDistributed(payload);
//   handleMessageAcknowledgment(channel, msg, res);
// }else if(action ==  'non-travel-paid') {
//   console.log(" expense header status paid - 'non-travel-paid'")
//   const res = await settleNonTravelExpenseReport(payload);
//   handleMessageAcknowledgment(channel, msg, res);
// } else {
// console.warn(`Unknown action '${action}' for source ${source}`);
// }
// } else if (source == 'dashboard'){
//   if(action == 'profile-update'){
//     const res = await updatePreferences(payload);
//     console.log(res)
//     handleMessageAcknowledgment(channel, msg, res);
//   }else if(action == 'approve-reject-ca-later'){
//     const res = await approveRejectCashRaisedLater(payload);
//     console.log(res)
//     handleMessageAcknowledgment(channel, msg, res);
//   }else if(action == 'expense-approval'){
//     const res = await expenseReportApproval(payload);
//     console.log(res)
//     handleMessageAcknowledgment(channel, msg, res);
//   }else if(action == 'nte-full-update'){
//     const res = await nonTravelReportApproval(payload);
//     console.log(res)
//     handleMessageAcknowledgment(channel, msg, res);
//   }else {
//     console.warn(`j -Unknown action '${action}' for source ${source}`);
//   }
// } else if (source == 'travel'){
//   if(action == 'add-leg'){
//     console.log('add-leg from travel microservice to expense microservice')
//     const res = await addALegToTravelRequestData(payload);
//     console.log(res)
//     handleMessageAcknowledgment(channel, msg, res);
//   }else if(action == 'remove-leg'){
//     console.log('add-leg from travel microservice to expense microservice')
//     const res = await deleteALegFromTravelRequestData(payload);
//     console.log(res)
//     handleMessageAcknowledgment(channel, msg, res);
//   }else {
//     console.warn(`Unknown action '${action}' for source ${source}`);
//   }  
// } else if ( source == 'cash'){
//   if(action == 'add-leg'){
//     console.log('add-leg from cash microservice to expense microservice')
//     const res = await addALegToTravelRequestData(payload);
//     handleMessageAcknowledgment(channel, msg, res);
//   }  
//   if(action == 'status-update-batch-job'){
//     console.log('status-update-batch-job')
//     const res = await cashStatusUpdatePaid(payload);
//     handleMessageAcknowledgment(channel, msg, res);
//   } else {
//     console.warn(`Unknown action '${action}' for source ${source}`);
//   }
// } else if ( source == 'approval'){
//   if(action == 'expense-approval'){
//     const res = await expenseReportApproval(payload);
//     console.log(res)
//     handleMessageAcknowledgment(channel, msg, res);
//   } else {
//     console.warn(`Unknown action '${action}' for source ${source}`);
//   }
// } 






