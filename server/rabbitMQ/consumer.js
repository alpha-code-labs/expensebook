import updateHRMaster from "./messageProcessor/onboarding.js";
import {cancelTravelRequest, markCompleted} from "./messageProcessor/trip.js";
import {
  approveRejectTravelRequest,
  approveRejectCashAdvance,
  approveRejectRequests,
  approveRejectLegItem,
  approveRejectCashRaisedLater,
} from "./messageProcessor/approval.js";

import amqp from "amqplib";
import dotenv from "dotenv";
import {
  recoveryCashAdvance,
  settleCashAdvance,
} from "./messageProcessor/finance.js";
import { sendToDashboardQueue } from "./publisher.js";
import { addALeg, updateBookingAdmin, updateFinanceAdmin } from "./messageProcessor/dashboard.js";

dotenv.config();

//start consuming messages..
export default async function startConsumer(receiver) {
  try{
    const rabbitMQUrl = process.env.NODE_ENV == 'production' ? process.env.RBMQ_PROD_URL : process.env.RBMQ_URL;

    const connectToRabbitMQ = async () => {
      try {
        console.log("Connecting to RabbitMQ...");
        console.log("on ", rabbitMQUrl)
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
      }else if (source == "system-config") {
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
      } else if (source == "trip") {
        if ((action == "full-update")) {
          const res = await cancelTravelRequest(payload);
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
        if(action == 'add-leg'){
          const res = await addALeg(payload)
          if(res.success){
              console.log('message consumed successfully')
              channel.ack(msg)
          }
          else{
              console.log("update failed with error code", res.error);
          }
      }
      } else if (source == "approval") {
        if ((action == "approve-reject-ca")) {
          const res = await approveRejectRequests(payload);
          console.log(res);
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
      } else if (source == "finance") {
        if (action == "settle-ca") {
          const res = await settleCashAdvance(payload);
          console.log(res);
          if (res.success) {
            //acknowledge message
            channel.ack(msg);
            console.log("message processed successfully");
          } else {
            //implement retry mechanism
            console.log("update failed with error code", res.error);
          }
        } else if (action == "recover-ca") {
          const res = await recoveryCashAdvance(payload);
          console.log(res);
          if (res.success) {
            //acknowledge message
            await sendToDashboardQueue(res.dashBoardPayload, false, "online");
            channel.ack(msg);
            console.log("message processed successfully");
          } else {
            //implement retry mechanism
            await sendToDashboardQueue(res.dashBoardPayload, false, "online");
            console.log("update failed with error code", res.error);
          }
        }
      } else if (source == 'dashboard') {
        if(action == 'add-leg'){
            const res = await addALeg(payload)
            if(res.success){
                console.log('message consumed successfully')
                channel.ack(msg)
            }
            else{
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
        if ((action == "approve-reject-ca")) {
          const res = await approveRejectRequests(payload);
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
        if ((action == "approve-reject-ca-later")) {
          const res = await approveRejectCashRaisedLater(payload);
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


