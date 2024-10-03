import updateHRMaster from "./messageProcessor/onboarding.js";
import amqp from 'amqplib'
import dotenv from 'dotenv'
import {cancelTravelRequest, markCompleted} from "./messageProcessor/trip.js";
import {approveRejectLegItem, approveRejectTravelRequests} from "./messageProcessor/approval.js";
import { updatePreferences, addALeg, updateBookingAdmin, updateFinanceAdmin, addLeg } from "./messageProcessor/dashboard.js";


dotenv.config()

//start consuming messages..
export default async function startConsumer(receiver) {
    try{
        const rabbitMQUrl = process.env.NODE_ENV == 'production' ? process.env.RBMQ_PROD_URL : process.env.RBMQ_URL;
    
        const connectToRabbitMQ = async () => {
          try {
            console.log("Connecting to RabbitMQ...");
            console.log("on ", rabbitMQUrl);
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
            console.log('content', content)
            const payload = content?.payload;
            const source = content?.headers?.source;
            const action = content?.headers?.action
      
            if (source == "onboarding") {
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
            }

            if (source == "system-config") {
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
            }
            
            if (source == "trip") {
                if(action == 'full-update'){
                    const res = await cancelTravelRequest(payload)
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
                if(action == 'status-completed-closed'){
                    const res = await markCompleted(payload);
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

                // if(action == 'add-leg'){
                //     console.log("add-leg", payload)
                //     const res = await addALeg(payload)
                //     console.log(res);
                //     console.log(payload)
                //     if (res.success) {
                //         //acknowledge message
                //         channel.ack(msg);
                //         console.log("message processed successfully");
                //     } else {
                //         //implement retry mechanism
                //         console.log("update failed with error code", res.error);
                //     }
                // }
                if(action == 'add-leg'){
                    if(payload){
                      "i am in add a leg"
                      const result = await addLeg(payload)
                      console.log("results after trip status updated to completed or closed  ", result)
                      if(result.success) {
                          channel.ack(msg);
                          console.log('Message processed successfully');
                        } else {
                          // Implement retry mechanism or handle error
                          console.log('Update failed with error:', res.error);
                        }
                      }
                    else{
                      console.error(Error,"Payload is not an array");
                    }
                  }
            }
    
            if(source == 'approval'){
                if(action == 'approve-reject-tr'){
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
                }else if(action == 'approve-reject-add-leg'){
                    const res = await approveRejectLegItem(payload)
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

                if(action == 'update-booking-admin'){
                    const res = await updateBookingAdmin(payload)
                    if(res.success){
                        console.log('message consumed successfully')
                        channel.ack(msg)
                    }
                    else{
                        console.log("update failed with error code", res.error);
                    }
                }

                if(action == 'update-finance-admin'){
                    const res = await updateFinanceAdmin(payload)
                    if(res.success){
                        console.log('message consumed successfully')
                        channel.ack(msg)
                    }
                    else{
                        console.log("update failed with error code", res.error);
                    }
                }

                if(action == 'approve-reject-tr'){
                    console.log("i am in")
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
            }
            
          },
          { noAck: false }
        );
    }catch(e){
        console.log(e?.message)
    }
  }

  