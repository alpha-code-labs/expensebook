import amqp from 'amqplib';
import { updateHRMaster, updatePreferences } from './messageProcessor/hrMasterMessage.js';
import { TravelAndCashUpdate, cancelTravelWithCash, itineraryAddedToTravelRequest, updateCashStatus, updateTravel, updateTravelStatus } from './messageProcessor/travelMessage.js';
import dotenv from 'dotenv';
import { expenseReport } from './messageProcessor/expense.js';
import { deleteReimbursement, updateReimbursement } from './messageProcessor/reimbursement.js';
import { approveRejectTravelRequests, nonTravelApproval } from './messageProcessor/dashboard.js';

dotenv.config();
  
export default async function startConsumer(receiver){
    const rabbitMQUrl = process.env.rabbitMQUrl ;
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
        } else if (source == 'travel' ){
            if(action == 'full-update'){
                console.log('trying to update travelRequestData in approval microservice')
                const res = await updateTravel(payload)
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
            if(action == 'status-update'){
                console.log('trying to update travelRequestData in approval microservice')
                const res = await  updateTravelStatus(payload)
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
            if(action == 'cancellation-update'){
                console.log('cancel travel request standalone in approval microservice')
                const res = await cancelTravelStandalone(payload);
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
        } else if (source == 'cash'){
            if(action == 'full-update') {
            const res = await TravelAndCashUpdate(payload);
            if(res.success){
                channel.ack(msg)
            }else{
                console.log('error updating travel and cash')
            }
            }
            if(action == 'cancellation-update'){
                console.log('cancel travel request and its cash advance in approval microservice')
                const res = await cancelTravelWithCash(payload);
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
       } else if (source == 'dashboard'){
        if(action == 'add-leg'){
            console.log('add-leg from dashboard microservice to approval microservice')
            const res = await itineraryAddedToTravelRequest(payload);
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
        if(action == 'nte-full-update'){
          const res = await nonTravelApproval(payload);
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
        if(action == 'approve-reject-tr'){
          console.log('approve-reject-tr')
          const res = await approveRejectTravelRequests(payload)
          console.log(res);
          console.log(payload)
          if (res.success) {
              //acknowledge message
              channel.ack(msg);
              console.log("message processed successfully");
          } else {
              //implement retry mechanism
              console.log("update failed with error code", res.error);
          }
      }
      }else if (source == 'expense'){
          if(action == 'full-update'){
              console.log('expense report for approval', payload)
              const res = await expenseReport(payload);
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
        } else if (source == 'reimbursement'){
          if (action == 'full-update') {
            console.log('Trying to update reimbursement Data');
              const results = await updateReimbursement(payload);
                if (results.success) {
                  // Acknowledge message
                  channel.ack(msg);
                  console.log('Message processed successfully');
                } else {
                  // Implement retry mechanism or handle error
                  console.log('Update failed with error:', results.error);
                }
              } 
          if( action == 'delete'){    
            console.log('Trying to update reimbursement Data');
            const results = await deleteReimbursement(payload);
              if (results.success) {
                // Acknowledge message
                channel.ack(msg);
                console.log('Message processed successfully');
              } else {
                // Implement retry mechanism or handle error
                console.log('Update failed with error:', results.error);
              }

          }
        } 
  }}, { noAck: false });
}



