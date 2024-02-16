
import amqp from 'amqplib';
import { updateHRMaster, updatePreferences } from './messageProcessor/hrMessage.js';
import { partialCashUpdate, settleExpenseReport, updateCashStatus } from './messageProcessor/cashMessage.js';
import { processTravelRequests } from './messageProcessor/travelMessageProcessor.js';

//start consuming messages..
export default async function startConsumer(receiver) {
    // const rabbitMQUrl = "amqp://guest:guest@192.168.1.11:5672";
    const rabbitMQUrl = 'amqp://localhost:5672/';
  
    const connectToRabbitMQ = async () => {
      try {
        console.log("Connecting to RabbitMQ...");
        const connection = await amqp.connect(rabbitMQUrl);
        const channel = await connection.createConfirmChannel();
        console.log("Connected to RabbitMQ.");
        return channel;
      } catch (error) {
        console.log("Error connecting to RabbitMQ:", error);
        return error;
      }
    };
  
    const channel = await connectToRabbitMQ()
    const exchangeName = "amqp.dashboard"
    const queue = `q.${receiver}`
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
        if (msg && msg.content) {
        const content = JSON.parse(msg.content.toString());

        console.log(
            `coming from ${content?.headers?.source} meant for ${content?.headers?.destination}`
          );

        //console.log('payload', content?.payload)
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
          } else if ( source == 'travel'){
            if(action =='trip-creation'){
              const res = await processTravelRequests(payload)
              if(res.success){
                channel.ack(msg)
                console.log('trip creation successful')
              } else{
                console.log('error in trip creation rabbitmq')
              }
            }
          } else if (source == 'cash'){
            if(action =='trip-creation'){
              const res = await processTravelRequests(payload)
              if(res.success){
                channel.ack(msg)
                console.log('trip creation successful')
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
          }
      }}
    },{ noAck: false }
    )}
  

