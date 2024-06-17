import amqp from 'amqplib';
import dotenv from 'dotenv';
import { updateHRMaster } from './messageProcessor/hrMaster.js';
import { updateFinance } from './messageProcessor/dashboardProcessor.js';


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
     console.log('payload', content?.payload)
     const payload = content?.payload
     const source = content?.headers?.source
     const action = content?.headers?.action
  
      if(content.headers.destination == 'finance'){
  
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
          } else if (source == 'dashboard'){
            console.log("from dashboard rabbitmq", payload)
            if(action == 'full-update'){
            console.log('trying to update travelExpense Data')
            if(payload.message == 'All are settled.'){
              console.log("'All are settled. nothing new to update in finance'")
              channel.ack(msg)
            } 
            const res = await updateFinance(payload)
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
      }
    }}, { noAck: false });
}





