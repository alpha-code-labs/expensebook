import amqp from "amqplib";
import dotenv from "dotenv";
import { saveProfile, updateHRMaster } from "./messageProcessor/hrMaster.js";
import { updateFinance } from "./messageProcessor/dashboardProcessor.js";
import { getRabbitMQConnection } from "./conncection.js";

dotenv.config();

export async function startConsumer(receiver) {
  try {
    const connection = await getRabbitMQConnection();
    const channel = await connection.createChannel();
    if (!channel) {
      console.error("Failed to establish connection to RabbitMQ.");
      return;
    }

    const exchangeName = "amqp.dashboard";
    const queue = `q.${receiver}`;
    const routingKey = `rk.${receiver}`;

    console.log(`Asserting exchange: ${exchangeName}`);
    await channel.assertExchange(exchangeName, "direct", { durable: true });
    console.log(`Asserting queue: ${queue}`);
    await channel.assertQueue(queue, { durable: true });
    console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
    await channel.bindQueue(queue, exchangeName, routingKey);
    console.log("listening for messages. To exit press CTRL+C");

    // Listen for response
    channel.consume(
      queue,
      async (msg) => {
        if (msg && msg.content) {
          const content = JSON.parse(msg.content.toString());

          console.log(
            `coming from ${content.headers?.source} meant for ${content.headers?.destination}`
          );
          //console.log('payload', content?.payload)
          const payload = content?.payload;
          const source = content?.headers?.source;
          const action = content?.headers?.action;

          if (content.headers.destination == "finance") {
            if (source == "onboarding" || source == "system-config") {
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
            } else if (source == "dashboard") {
              // console.log("from dashboard rabbitmq", payload);
              if (action == "full-update") {
                console.log("trying to update travelExpense Data");
                if (payload.message == "All are settled.") {
                  console.log(
                    "'All are settled. nothing new to update in finance'"
                  );
                  channel.ack(msg);
                }
                const res = await updateFinance(payload);
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
              if (action == "profile-update") {
                const res = await saveProfile(payload);
                console.log(res);
                if (res.success) {
                  channel.ack(msg);
                  console.log("message processed successfully");
                } else {
                  console.log("update failed with error code", res.error);
                }
              }
            }
          }
        }
      },
      { noAck: false }
    );
  } catch (e) {
    console.error("Failed to establish RabbitMQ connection:", error.message);
    throw e;
  }
}
