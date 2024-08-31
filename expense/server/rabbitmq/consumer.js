import amqp from 'amqplib';
import { updateHRMaster, updatePreferences } from './messageProcessor.js/onboardingMessage.js';
import {  addALegToTravelRequestData, deleteALegFromTravelRequestData, tripArrayFullUpdate, tripFullUpdate } from './messageProcessor.js/trip.js';
import { settleExpenseReport, settleExpenseReportPaidAndDistributed, settleOrRecoverCashAdvance } from './messageProcessor.js/finance.js';
import dotenv from 'dotenv';
import { approveRejectCashRaisedLater, expenseReportApproval } from './messageProcessor.js/approval.js';

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
        //console.log('payload', content?.payload)
        const payload = content?.payload
        const source = content?.headers?.source
        const action = content?.headers?.action
        
        if(content.headers.destination == 'expense'){
    
          if(source == 'onboarding' || source == 'system-config'){
            console.log('trying to update HR Master')
            const res = await updateHRMaster(payload)
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
          } else if(source == 'trip'){
              if(action == 'full-update-array'){
                console.log('trying to batch job -  trip to expense 1st time ')
                const res = await tripArrayFullUpdate(payload)
                console.log(res)
                if(res.success){
                  //acknowledge message
                  channel.ack(msg)
                  console.log('message processed successfully')
                } else{
                  //implement retry mechanism
                  console.log('update failed with error code', res.error)
                }
              }
              if(action == 'full-update'){
                console.log('trying to update Travel and cash after cancellation ')
                const response = await tripFullUpdate(payload)
                console.log(res)
                if(res.success){
                  //acknowledge message
                  channel.ack(msg)
                  console.log('message processed successfully')
                } else{
                  //implement retry mechanism
                  console.log('update failed with error code', res.error)
                }
               }
          } else if(source == 'finance'){
          if(action == 'settle-ca' || action == 'recover-ca') {
              console.log("settle-ca or recover-ca ")
              const res = await settleOrRecoverCashAdvance(payload);
              if(res.success){
                  channel.ack(msg)
                  console.log('cash update successful ')
              }else{
                  console.log('error updating travel and cash')
              }
          }
          if(action == 'settle-expense-paid') {
              console.log(" expense header status paid")
              const res = await settleExpenseReport(payload);
              if(res.success){
                  channel.ack(msg)
                  console.log('expense header status paid- successful ')
              }else{
                  console.log('error updating travel and cash')
              }
          }
          if(action == 'settle-expense-Paid-and-distributed') {
            console.log(" expense header status paid and distributed")
            const res = await settleExpenseReportPaidAndDistributed(payload);
            if(res.success){
                channel.ack(msg)
                console.log('expense header status paid- successful ')
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
            if(action == 'approve-reject-ca-later'){
              const res = await approveRejectCashRaisedLater(payload);
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
          } else if (source == 'travel'){
            if(action == 'add-leg'){
              console.log('add-leg from travel microservice to expense microservice')
              const res = await addALegToTravelRequestData(payload);
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
            if(action == 'remove-leg'){
              console.log('add-leg from travel microservice to expense microservice')
              const res = await deleteALegFromTravelRequestData(payload);
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
          } else if ( source == 'cash'){
            if(action == 'add-leg'){
              console.log('add-leg from cash microservice to expense microservice')
              const res = await addALegToTravelRequestData(payload);
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
          }else if ( source == 'approval'){
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
        } }
      }}, { noAck: false });
}







