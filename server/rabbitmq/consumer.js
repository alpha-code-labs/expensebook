import amqp from 'amqplib';
import { updateHRMaster, updatePreferences } from './messageProcessor/hrMessage.js';
import { partialCashUpdate, settleExpenseReport, updateCashStatus } from './messageProcessor/cashMessage.js';
import { processTravelRequests } from './messageProcessor/travelMessageProcessor.js';
import dotenv from 'dotenv';
import { processTravelRequestsWithCash } from './messageProcessor/cashAdvanceProcessor.js';
import { fullUpdateExpense } from './messageProcessor/expense.js';
import { expenseReportApproval } from './messageProcessor/approval.js';

dotenv.config();

//start consuming messages..
export async function startConsumer(receiver) {
  const rabbitMQUrl = process.env.rabbitMQUrl;
  let retryCount = 0;

  const connectToRabbitMQ = async () => {
    try {
      console.log("Connecting to RabbitMQ...");
      const connection = await amqp.connect(rabbitMQUrl);
      const channel = await connection.createChannel();
      console.log("Connected to RabbitMQ.");
      // Add error event listener to the connection
      connection.on("error", handleConnectionError);
      return channel; // Return the created channel
    } catch (error) {
      retryCount++;
      if (retryCount === 1) {
        console.error("Error connecting to RabbitMQ:", error);
      }
      if (retryCount === 3) {
        console.error("Failed after 3 times trying");
      } else {
        // Retry connection after 1 minute for the first two attempts, then after 3 minutes
        const retryDelay = retryCount <= 2 ? 1 : 3;
        console.log(`Retrying in ${retryDelay} minute(s)...`);
        setTimeout(connectToRabbitMQ, retryDelay * 60 * 1000);
      }
      return null; // Return null if connection fails
    }
  };

  const handleConnectionError = (err) => {
    console.error("RabbitMQ connection error:", err);
    // Retry connection after 3 minutes if the first attempt fails
    retryCount++;
    if (retryCount === 3) {
      console.error("Failed after 3 times trying");
    } else {
      const retryDelay = retryCount <= 2 ? 1 : 3;
      console.log(`Retrying in ${retryDelay} minute(s)...`);
      setTimeout(connectToRabbitMQ, retryDelay * 60 * 1000);
    }
  };

  // Start initial connection attempt
  const channel = await connectToRabbitMQ();
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
          if (source == "onboarding" || source == 'system-config') {
            console.log("trying to update HR Master");
            const res = await updateHRMaster(payload);
            console.log(res);
            if (res.success) {
              //acknowledge message
              channel.ack(msg);
              console.log("message processed successfully");
            } else {
              //implement retry mechanism
              console.log("update failed with error code", res.error);
            }
          } else  if ( source == 'travel'){
            if(action =='trip-creation' ){
              const res = await processTravelRequests(payload)
              console.log(res, 'at 110')
              if(res.success){
                channel.ack(msg)
                console.log('trip creation successful')
              } else{
                console.log('error in trip creation rabbitmq')
              }
            }
          } else if (source == 'cash'){
            if(action == 'trip-creation'){
              console.log("trip creation batchjob", payload)
              const res = await processTravelRequestsWithCash(payload)
              if(res.success){
                console.log('trip creation successful')
                channel.ack(msg)
              } else{
                console.log('error in trip creation rabbitmq')
              }
            }
            if(action == 'partial-cash-update') {
                console.log("trying to update cash partially")
                const res = await partialCashUpdate(payload);
                if(res.success){
                    channel.ack(msg)
                    console.log('cash update successful ')
                }else{
                    console.log('error updating travel and cash')
                }
            }
            if(action == 'cancel-cash-update') {
                console.log("trying to update cash partially")
                const res = await updateCashStatus(payload);
                if(res.success){
                    channel.ack(msg)
                    console.log('cash update successful ')
                }else{
                    console.log('error updating travel and cash')
                }
            }
          } else if (source == 'finance'){
        if(action == 'settle-cash') {
            console.log("trying to update cash partially")
            // const res = await settleCashStatus(payload);
            if(res.success){
                channel.ack(msg)
                console.log('cash update successful ')
            }else{
                console.log('error updating travel and cash')
            }
        }
        if(action == 'settle-expense') {
          console.log(" expenseheaderstatus paid")
          const res = await settleExpenseReport(payload);
          if(res.success){
              channel.ack(msg)
              console.log('cash update successful ')
          }else{
              console.log('error updating travel and cash')
          }
      }
          } else if (source == 'dashboard'){
          if(action == 'profile-update'){
            const res = await updatePreferences(payload);
            console.log(res)
            if(res.success){
              //acknowledge message
              channel.ack(msg)
              console.log('message processed successfully')
            }
            else{
              //implement retry mechanism
              console.log('update failed with error code', res.error)
            }
          }
          } else if (source == 'expense'){
            if(action == 'full-update'){
            console.log('trying to update travelExpense Data')
            const res = await fullUpdateExpense(payload)
            console.log(res)
            if(res.success){
              //acknowledge message
              channel.ack(msg)
              console.log('message processed successfully')
            }
            else{
              //implement retry mechanism
              console.log('update failed with error code', res.error)
            }
          }
          } else if ( source == 'approval'){
            if(action == 'expense-approval'){
              const res = await expenseReportApproval(payload);
              console.log(res)
              if(res.success){
                //acknowledge message
                channel.ack(msg)
                console.log('message processed successfully')
              }
              else{
                //implement retry mechanism
                console.log('update failed with error code', res.error)
              }
            }
          }
      }}
    },{ noAck: false }
)}
  
