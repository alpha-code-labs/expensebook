import { fullUpdateTravel } from "./messageProcessor/travel.js";
import dotenv from "dotenv";
import { updateTripStatus } from "./messageProcessor/trip.js";
import {
  expenseReportApproval,
  travelStandAloneApproval,
  travelWithCashApproval,
  travelWithCashTravelApproval,
} from "./messageProcessor/approval.js";
import { fullUpdateCash } from "./messageProcessor/cash.js";
import { getRabbitMQConnection } from "./connection.js";

dotenv.config();

export const consumeFromDashboardQueue = async () => {
  // console.log("sync - consumeFromDashboardQueue");
  try {
    //  console.log('Connecting to RabbitMQ...');
    const connection = await getRabbitMQConnection();
    const channel = await connection.createConfirmChannel();
    //  console.log('Connected to RabbitMQ.');
    const exchangeName = "amqp.dashboard";
    const queue = "sync";

    //  console.log(`Asserting exchange: ${exchangeName}`);
    await channel.assertExchange(exchangeName, "direct", { durable: true });

    //  console.log(`Asserting queue: ${queue}`);
    await channel.assertQueue(queue, { durable: true });

    //  console.log(`Binding queue ${queue} to exchange ${exchangeName}`);
    await channel.bindQueue(queue, exchangeName, "");

    channel.consume(
      queue,
      async (msg) => {
        if (msg !== null && msg.content) {
          try {
            const content = JSON.parse(msg.content.toString());
            const headers = content.headers;
            const payload = content.payload;
            const source = headers.source;
            const isNeedConfirmation = headers.needConfirmation;
            let action = headers.action;

            // Process only messages with type 'new'
            if (headers.type === "new") {
              //  console.log("Processing message of type 'new'", payload);
              //  console.log("Headers:", headers, "Source:", source, "Need Confirmation:", isNeedConfirmation);

              // Determine the confirmation status based on the success of the database update
              let success = false;
              if (isNeedConfirmation) {
                if (source === "travel") {
                  success = await fullUpdateTravel(payload);
                } else if (source === "trip") {
                  if (headers.action === "status-update") {
                    success = await updateTripStatus(payload);
                  }
                  if (headers.action === "full-update") {
                    success = await fullUpdateTrip(payload);
                  }
                } else if (source === "approval") {
                  if (action == "approve-reject-tr") {
                    console.log("approval standalone");
                    success = await travelStandAloneApproval(payload);
                  }
                  if (action == "approve-reject-tr-ca") {
                    console.log("approval - travel with cash");
                    success = await travelWithCashTravelApproval(payload);
                  }
                  if (action == "approve-reject-ca") {
                    console.log("approval - cash with travel with cash");
                    success = await travelWithCashApproval(payload);
                  }
                  if (action == "expense-approval") {
                    console.log("approve expense report");
                    success = await expenseReportApproval(payload);
                  }
                } else if (source == "cash") {
                  if (action == "full-update") {
                    console.log(
                      "from cash to dashboard sync - after travel admin booked"
                    );
                    success = await fullUpdateCash(payload);
                  }
                }
              }

              // Prepare confirmation message
              const confirmationMessage = {
                headers: {
                  type: "confirmation",
                  correlationId: msg.properties.correlationId,
                  needConfirmation: isNeedConfirmation,
                },
                payload: { success },
              };

              // Send confirmation back to the replyTo queue
              channel.sendToQueue(
                msg.properties.replyTo,
                Buffer.from(JSON.stringify(confirmationMessage)),
                {
                  correlationId: msg.properties.correlationId,
                }
              );

              // Acknowledge the message after sending the confirmation
              channel.ack(msg);
            }
          } catch (error) {
            console.error("Error processing message:", error);
            // Reject the message if there's an error
            if (msg) channel.reject(msg, true);
          }
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.log("Error consuming messages from RabbitMQ:", error);
    throw error;
  }
};
