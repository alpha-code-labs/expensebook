import amqp from 'amqplib';
import { updateHRMaster, updatePreferences } from './messageProcessor/hrMessage.js';
import { cashStatusUpdatePaid, partialCashUpdate, updateCashStatus } from './messageProcessor/cashMessage.js';
import { processTravelRequests } from './messageProcessor/travelMessageProcessor.js';
import dotenv from 'dotenv';
import { processTravelRequestsWithCash } from './messageProcessor/cashAdvanceProcessor.js';
import { fullUpdateExpense } from './messageProcessor/expense.js';
import { approveRejectCashRaisedLater, expenseReportApproval } from './messageProcessor/approval.js';
import { getRabbitMQConnection } from './connection.js';

dotenv.config();

//start consuming messages..
export async function startConsumer(receiver) {
  try{
  // const rabbitMQUrl = process.env.rabbitMQUrl;
  // let retryCount = 0;

  // const connectToRabbitMQ = async () => {
  //   try {
  //     console.log("Connecting to RabbitMQ...");
  //     const connection = await amqp.connect(rabbitMQUrl);
  //     const channel = await connection.createChannel();
  //     console.log("Connected to RabbitMQ.");
  //     // Add error event listener to the connection
  //     connection.on("error", handleConnectionError);
  //     return channel; // Return the created channel
  //   } catch (error) {
  //     retryCount++;
  //     if (retryCount === 1) {
  //       console.error("Error connecting to RabbitMQ:", error);
  //     }
  //     if (retryCount === 3) {
  //       console.error("Failed after 3 times trying");
  //     } else {
  //       // Retry connection after 1 minute for the first two attempts, then after 3 minutes
  //       const retryDelay = retryCount <= 2 ? 1 : 3;
  //       console.log(`Retrying in ${retryDelay} minute(s)...`);
  //       setTimeout(connectToRabbitMQ, retryDelay * 60 * 1000);
  //     }
  //     return null; // Return null if connection fails
  //   }
  // };

  // const handleConnectionError = (err) => {
  //   console.error("RabbitMQ connection error:", err);
  //   // Retry connection after 3 minutes if the first attempt fails
  //   retryCount++;
  //   if (retryCount === 3) {
  //     console.error("Failed after 3 times trying");
  //   } else {
  //     const retryDelay = retryCount <= 2 ? 1 : 3;
  //     console.log(`Retrying in ${retryDelay} minute(s)...`);
  //     setTimeout(connectToRabbitMQ, retryDelay * 60 * 1000);
  //   }
  // };
  const connection = await getRabbitMQConnection();
  const channel = await connection.createChannel();
  const handleMessageAcknowledgment = (channel,msg,res) => {
    try{
      if(res.success){
        channel.ack(msg)
        console.info('Message acknowledged Successfully')
      } else{
        // channel.noAck(msg,false,true)
        console.error('Error Processing message, requeuing')
      }
    }catch(error){
      console.error('Error handling message acknowledgment:', error)
    }
  }

  // Start initial connection attempt
  // const channel = await connectToRabbitMQ();
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
  
  
    console.log("listening for new messages...");
    // Listen for response
    channel.consume(queue, async (msg) => {
        if (msg && msg.content) {
        const content = JSON.parse(msg.content.toString());

        console.log(
            `Rabbitmq consumer -coming from ${content?.headers?.source} meant for ${content?.headers?.destination}`
            , content
          );

        console.log('payload', content?.payload)
        const payload = content?.payload;
        const source = content?.headers?.source;
        const action = content?.headers?.action;
  
        if (content?.headers?.destination == "trip") {

        let res;
        switch (source) {
          case 'onboarding':
          case 'system-config':
            console.log("trying to update HR Master");
            res = await updateHRMaster(payload);
            console.log(res);
            handleMessageAcknowledgment(channel,msg,res)            
            break;
          
          case 'travel':
            switch (action) {
              case 'trip-creation':
                console.log("trying to create trip");
                res = await processTravelRequests(payload)
                console.log(res, 'at 110')
                handleMessageAcknowledgment(channel,msg,res)
                break;
            
              default:
               console.warn(`Unknown action ${action} for Source ${source} `)
                break;
            }
            break;

          case 'cash':
            switch(action){
              case 'trip-creation':
                console.log("trip creation batchjob", payload)
                res = await processTravelRequestsWithCash(payload)
                handleMessageAcknowledgment(channel,msg,res)
                break;

              case 'partial-cash-update':
                console.log("trying to update cash partially")
                res = await partialCashUpdate(payload);
                handleMessageAcknowledgment(channel,msg,res)
                break;


                case 'cancel-cash-update':
                  console.log("trying to cancel cash update")
                  console.log("trying to update cash partially")
                  res = await updateCashStatus(payload);
                  handleMessageAcknowledgment(channel,msg,res)
                  break;


                case 'status-update-batch-job':
                  console.log('status-update-batch-job')
                  res = await cashStatusUpdatePaid(payload);
                  console.log(res)
                  handleMessageAcknowledgment(channel,msg,res)
                  break;

            }
            break;

          case 'dashboard':
            switch (action){
              case 'profile-update':
                console.log("profile update")
                res = await updatePreferences(payload);
                console.log(res)
                handleMessageAcknowledgment(channel,msg,res)
                break;

              case 'approve-reject-ca-later':
                console.log("approve-reject-ca-later")
                res = await approveRejectCashRaisedLater(payload);
                console.log(res)
                handleMessageAcknowledgment(channel,msg,res)
                break;

              case 'expense-approval':
                res = await expenseReportApproval(payload);
                console.log(res)
                handleMessageAcknowledgment(channel,msg,res)
                break;
              
              default:
                  console.warn(`Unknown action ${action} for source ${source}`)
              break;
            }
            break;

          case 'expense':
            switch (action) {
              case 'full-update':
                console.log('trying to update travelExpense Data')
                res = await fullUpdateExpense(payload)
                console.log(res)
                handleMessageAcknowledgment(channel,msg,res)
                break;
            
                default:
                  console.warn(`Unknown action ${action} for source ${source}`)
                  break;
            }
            break;

          case 'approval':
          switch (action) {
            case 'expense-approval':
              res = await expenseReportApproval(payload);
              console.log(res)
              handleMessageAcknowledgment(channel,msg,res)
              break;
          
            default:
              console.warn(`unknown action ${action} for source ${source}`)
              break;
          }
          break;

          default:
          console.warn(`Unknown source ${source} for action ${action}`)
            break;
        }
      }}
    },{ noAck: false }
)} catch (e) {
    console.error("Failed to establish RabbitMQ connection:", error.message);
      throw e;
  }
}
















//old code
// if (source == "onboarding" || source == 'system-config') {
//   console.log("trying to update HR Master");
//   const res = await updateHRMaster(payload);
//   console.log(res);
//   handleMessageAcknowledgment(channel,msg,res)

// } else  if ( source == 'travel'){
//   if(action =='trip-creation' ){
//     const res = await processTravelRequests(payload)
//     console.log(res, 'at 110')
//     handleMessageAcknowledgment(channel,msg,res)
//   }
// } else if (source == 'cash'){
//   if(action == 'trip-creation'){
//     console.log("trip creation batchjob", payload)
//     const res = await processTravelRequestsWithCash(payload)
//     handleMessageAcknowledgment(channel,msg,res)
//   }
//   if(action == 'partial-cash-update') {
//       console.log("trying to update cash partially")
//       const res = await partialCashUpdate(payload);
//       handleMessageAcknowledgment(channel,msg,res)

//   }
//   if(action == 'cancel-cash-update') {
//       console.log("trying to update cash partially")
//       const res = await updateCashStatus(payload);
//       handleMessageAcknowledgment(channel,msg,res)

//   }
//   if(action == 'status-update-batch-job'){
//     console.log('status-update-batch-job')
//     const res = await cashStatusUpdatePaid(payload);
//     console.log(res)
//     handleMessageAcknowledgment(channel,msg,res)

//   } 
// } else if(source == 'finance'){
//   if(action == 'settle-ca') {
//     console.log("settle-ca")
//     const res = await settleOrRecoverCashAdvance(payload);
//     handleMessageAcknowledgment(channel,msg,res)

// }
//   if(action == 'expense-paid') {
//     console.log('expense-paid')
//     const res = await settleExpenseReport(payload);
//     handleMessageAcknowledgment(channel,msg,res)

//  }
// if(action == 'settle-expense-Paid-and-distributed') {
//   console.log(" expenseheaderstatus paid and distributed")
//   const res = await settleExpenseReportPaidAndDistributed(payload);
//   handleMessageAcknowledgment(channel,msg,res)

// }
// } else if (source == 'dashboard'){
// if(action == 'profile-update'){
//   const res = await updatePreferences(payload);
//   console.log(res)
//   handleMessageAcknowledgment(channel,msg,res)

// }
// if(action == 'approve-reject-ca-later'){
//   const res = await approveRejectCashRaisedLater(payload);
//   console.log(res)
//   handleMessageAcknowledgment(channel,msg,res)

// } 
// if(action == 'expense-approval'){
//   const res = await expenseReportApproval(payload);
//   console.log(res)
//   handleMessageAcknowledgment(channel,msg,res)

// }
// } else if (source == 'expense'){
//   if(action == 'full-update'){
//   console.log('trying to update travelExpense Data')
//   const res = await fullUpdateExpense(payload)
//   console.log(res)
//   handleMessageAcknowledgment(channel,msg,res)

// }
// } else if ( source == 'approval'){
//   if(action == 'expense-approval'){
//     const res = await expenseReportApproval(payload);
//     console.log(res)
//     handleMessageAcknowledgment(channel,msg,res)

//   }
// }

