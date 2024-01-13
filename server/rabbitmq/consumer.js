import amqp from 'amqplib';
import { updateHRMaster } from './messageProcessor/hrMasterMessage.js';
import { TravelAndCashUpdate, cancelTravelWithCash, updateCashStatus, updateTravel, updateTravelStatus } from './messageProcessor/travelMessage.js';

export async function startConsumer(receiver){
    const rabbitMQUrl = 'amqp://localhost:5672/';
  
   const connectToRabbitMQ = async () => {
    try {
      console.log('Connecting to RabbitMQ...');
      const connection = await amqp.connect(rabbitMQUrl);
       const channel = await connection.createConfirmChannel();
      console.log('Connected to RabbitMQ.');
      return channel;
    } catch (error) {
      console.log('Error connecting to RabbitMQ:', error);
      throw error;
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
            if(action == 'full-update') {
                const res = await TravelAndCashUpdate(payload);
                if(res.success){
                    channel.ack(msg)
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
      }
      else if (source == 'dashboard'){
        if(action == 'add-leg'){
            console.log('cancel travel request and its cash advance in approval microservice')
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
    }}}, { noAck: false });
}


