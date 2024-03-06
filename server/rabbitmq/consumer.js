import amqp from 'amqplib';
import { updateHRMaster } from './messageProcessor/hrMaster.js';
import { fullUpdateTravel } from './messageProcessor/travel.js';
import dotenv from 'dotenv';
import { fullUpdateExpense } from './messageProcessor/travelExpenseProcessor.js';
import { updateTrip } from './messageProcessor/trip.js';
import { fullUpdateCash } from './messageProcessor/cash.js';

dotenv.config();

export async function startConsumer(receiver) {
  const rabbitMQUrl = process.env.rabbitMQUrl ;
    const connectToRabbitMQ = async () => {
      try {
        console.log("Connecting to RabbitMQ...");
        const connection = await amqp.connect(rabbitMQUrl);
        const channel = await connection.createChannel();
        console.log("Connected to RabbitMQ.");
        return channel;
      } catch (error) {
        console.log("Error connecting to RabbitMQ:", error);
        return error;
      }
    };
 
 const channel = await connectToRabbitMQ();
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
     console.log('payload', content?.payload)
     const payload = content?.payload
     const source = content?.headers?.source
     const action = content?.headers?.action
  
      if(content.headers.destination == 'dashboard'){
  
        if(source == 'onboarding'){
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
        } else if(source == 'travel'){
            console.log('trying to update HR Master')
            const res = await fullUpdateTravel(payload)
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
          } else if(source == 'cash'){
            if(action == 'full-update'){
              console.log('trying to update CashAdvanceSchema')
              const res = await fullUpdateCash(payload)
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
            
          }else if (source == 'expense'){
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
          } else if (source == 'trip'){
            if (action == 'trip-creation') {
              console.log('Trying to update travelExpense Data');
              const results = await updateTrip(payload);
              for (const res of results) {
                if (res.success) {
                  // Acknowledge message
                  channel.ack(msg);
                  console.log('Message processed successfully');
                } else {
                  // Implement retry mechanism or handle error
                  console.log('Update failed with error:', res.error);
                }
              }
            }
          }
      }
    }}, { noAck: false });
}



