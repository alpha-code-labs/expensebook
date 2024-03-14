import updateHRMaster from "./messageProcessor/onboarding.js";
import amqp from 'amqplib'
import dotenv from 'dotenv'
import cancelTravelRequest from "./messageProcessor/trip.js";
import {approveRejectLegItem, approveRejectTravelRequest} from "./messageProcessor/approval.js";
import { updatePreferences } from "./messageProcessor/dashboard.js";

dotenv.config()

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
        const queue = `q.${receiver}`;
        const routingKey = `rk.${receiver}`
        
        console.log(`Asserting exchange: ${exchangeName}`);
        await channel.assertExchange(exchangeName, "direct", { durable: true });
      
        console.log(`Asserting queue: ${queue}`);
        await channel.assertQueue(queue, { durable: true });
      
        console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
        await channel.bindQueue(queue, exchangeName, routingKey);
      
        console.log("listening for new messages...");
        // Listen for response
        channel.consume(queue, async (msg) => {
            const content = JSON.parse(msg.content.toString());
      
            console.log(
              `coming from ${content?.headers?.source} meant for ${content?.headers?.destination}`
            );
            //console.log('payload', content?.payload)
            const payload = content?.payload;
            const source = content?.headers?.source;
            const action = content?.headers?.action
      
            if(source == 'dashboard'){
                if(action == 'profile-update'){
                    const res = updatePreferences(payload)
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
        console.log(e?.message)
    }
  }

  