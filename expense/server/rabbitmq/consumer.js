import amqp from 'amqplib';
import { updateHRMaster, updatePreferences } from './messageProcessor.js/onboardingMessage.js';
import {  addALegToTravelRequestData, deleteALegFromTravelRequestData, tripArrayFullUpdate, tripFullUpdate } from './messageProcessor.js/trip.js';
import { settleExpenseReport, settleExpenseReportPaidAndDistributed, settleNonTravelExpenseReport, settleOrRecoverCashAdvance } from './messageProcessor.js/finance.js';
import dotenv from 'dotenv';
import { approveRejectCashRaisedLater, expenseReportApproval, nonTravelReportApproval } from './messageProcessor.js/approval.js';
import { cashStatusUpdatePaid } from './messageProcessor.js/cashAdvanceMessage.js';

dotenv.config();

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

  
  const handleMessageAcknowledgment = (channel, msg, res) => {
    try{
      if (res.success) {
        channel.ack(msg);
        console.log('Message acknowledged successfully');
      } else {
        // channel.nack(msg, false, true);
        console.log('Error processing message, requeuing');
      }
    } catch(error){
      console.error('Error handling message acknowledgment:', error);
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
        // console.log("source", source,"action", action)
        if(content.headers.destination == 'expense'){
    
          if(source == 'onboarding' || source == 'system-config'){
            console.log('trying to update HR Master')
            const res = await updateHRMaster(payload)
            console.log(res)
            handleMessageAcknowledgment(channel, msg, res);
          } else if(source == 'trip'){
              if(action == 'full-update-array'){
                console.log('trying to batch job -  trip to expense 1st time ')
                const res = await tripArrayFullUpdate(payload)
                console.log(res)
                handleMessageAcknowledgment(channel, msg, res);
              }
              if(action == 'full-update'){
                console.log('trying to update Travel and cash after cancellation ')
                const response = await tripFullUpdate(payload)
                console.log(res)
                handleMessageAcknowledgment(channel, msg, res);
               }else {
                console.warn(`Unknown action '${action}' for source ${source}`);
              }
          } else if(source == 'finance'){
          if(action == 'settle-ca' || action == 'recover-ca') {
              console.log("settle-ca or recover-ca ")
              const res = await settleOrRecoverCashAdvance(payload);
              handleMessageAcknowledgment(channel, msg, res);
          }
          if(action == 'expense-paid') {
              console.log(" expense header status paid")
              const res = await settleExpenseReport(payload);
              handleMessageAcknowledgment(channel, msg, res);
          }
          if(action == 'settle-expense-Paid-and-distributed') {
            console.log(" expense header status paid and distributed")
            const res = await settleExpenseReportPaidAndDistributed(payload);
            handleMessageAcknowledgment(channel, msg, res);
          }
          if(action ==  'non-travel-paid') {
            console.log(" expense header status paid - 'non-travel-paid'")
            const res = await settleNonTravelExpenseReport(payload);
            handleMessageAcknowledgment(channel, msg, res);
        } else {
          console.warn(`Unknown action '${action}' for source ${source}`);
        }
          } else if (source == 'dashboard'){
            if(action == 'profile-update'){
              const res = await updatePreferences(payload);
              console.log(res)
              handleMessageAcknowledgment(channel, msg, res);
            }
            if(action == 'approve-reject-ca-later'){
              const res = await approveRejectCashRaisedLater(payload);
              console.log(res)
              handleMessageAcknowledgment(channel, msg, res);
            } 
            if(action == 'expense-approval'){
              const res = await expenseReportApproval(payload);
              console.log(res)
              handleMessageAcknowledgment(channel, msg, res);
            }
            if(action == 'nte-full-update'){
              const res = await nonTravelReportApproval(payload);
              console.log(res)
              handleMessageAcknowledgment(channel, msg, res);
            } else {
              console.warn(`j -Unknown action '${action}' for source ${source}`);
            }
          } else if (source == 'travel'){
            if(action == 'add-leg'){
              console.log('add-leg from travel microservice to expense microservice')
              const res = await addALegToTravelRequestData(payload);
              console.log(res)
              handleMessageAcknowledgment(channel, msg, res);
            } 
            if(action == 'remove-leg'){
              console.log('add-leg from travel microservice to expense microservice')
              const res = await deleteALegFromTravelRequestData(payload);
              console.log(res)
              handleMessageAcknowledgment(channel, msg, res);
            }
            else {
              console.warn(`Unknown action '${action}' for source ${source}`);
            }  
          } else if ( source == 'cash'){
            if(action == 'add-leg'){
              console.log('add-leg from cash microservice to expense microservice')
              const res = await addALegToTravelRequestData(payload);
              handleMessageAcknowledgment(channel, msg, res);
            }  
            if(action == 'status-update-batch-job'){
              console.log('status-update-batch-job')
              const res = await cashStatusUpdatePaid(payload);
              handleMessageAcknowledgment(channel, msg, res);
            } else {
              console.warn(`Unknown action '${action}' for source ${source}`);
            }
          }else if ( source == 'approval'){
            if(action == 'expense-approval'){
              const res = await expenseReportApproval(payload);
              console.log(res)
              handleMessageAcknowledgment(channel, msg, res);
            }else {
              console.warn(`Unknown action '${action}' for source ${source}`);
            }
        } }
      }}, { noAck: false });
}







