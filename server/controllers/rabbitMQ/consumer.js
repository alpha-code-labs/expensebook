import {updateHRMaster,updateEmployee} from "./messageProcessor/onboarding.js";
import amqp from "amqplib";
import dotenv from "dotenv";


dotenv.config();

//start consuming messages..
export default async function startConsumer(receiver) {
  try{
    const rabbitMQUrl = process.env.RBMQ_URL;
  const connectToRabbitMQ = async () => {
    try {
      console.log("Connecting to RabbitMQ...");
      const connection = await amqp.connect(rabbitMQUrl);
      const channel = await connection.createConfirmChannel();
      console.log("Connected to RabbitMQ.");
      return channel;
    } catch (error) {
      console.log("Error connecting to RabbitMQ:", error);
      throw error;
    }
  };

  const channel = await connectToRabbitMQ();
  const exchangeName = "amqp.dashboard";
  const routingKey = `rk.${receiver}`;
  const queue = `q.${receiver}`;

  console.log(`Asserting exchange: ${exchangeName}`);
  await channel.assertExchange(exchangeName, "direct", { durable: true });

  console.log(`Asserting queue: ${queue}`);
  await channel.assertQueue(queue, { durable: true });

  console.log(
    `Binding queue ${queue} to exchange ${exchangeName} with routing key ${routingKey}`
  );
  await channel.bindQueue(queue, exchangeName, routingKey);

  console.log("listening for new messages...");
  // Listen for response
  channel.consume(
    queue,
    async (msg) => {
      const content = JSON.parse(msg?.content?.toString());
      console.log(content, ",,content0");
      //console.log('payload', content?.payload)
      const payload = content?.payload;
      const source = content?.headers?.source;
      const action = content?.headers?.action;

      if (source == "onboarding") {
        if(action == 'full-update'){
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
        }else if(action == 'otp-update'){
            console.log("trying to update HR Master");
            const res = await updateEmployee(payload);
            console.log(res);
            if (res.success) {
            //acknowledge message
            channel.ack(msg);
            console.log("message processed successfully");
            } else {
            //implement retry mechanism
            console.log("update failed with error code", res.error);
            }

        } 


    }
        
   
    },
    { noAck: false }
  );
  }catch(e){
    console.log(e)
  }
}