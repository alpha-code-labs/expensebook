import reporting from "../../models/reportingSchema.js";

// export const fullUpdateExpense = async (payload) => {
//   const {getExpenseReport} = payload
//   const {
//     tenantId,
//     tripId,
//     travelRequestData,
//   } = getExpenseReport;

//     const {travelRequestId} = travelRequestData
//     console.log("payload for travelExpenseData: full update expense", payload )

//     try {
//     const updated = await reporting.updateOne(
//       { tenantId, travelRequestId, tripId },
//       {
//       $set:{...getExpenseReport}
//       },
//       { upsert: true, new: true }
//     );
//     console.log('Saved to dashboard: TravelExpenseData updated successfully', updated);
//     return { success: true, error: null}
//   } catch (error) {
//     console.error('Failed to update dashboard: TravelExpenseData updation failed', error);
//     return { success: false, error: error}
//   }
// }

//travel expense header 'paid'
export const fullUpdateExpense = async (payload) => {
  const { getExpenseReport } = payload;
  const { tenantId, travelRequestData, tripId, travelExpenseData } =
    getExpenseReport;
  const { travelRequestId } = travelRequestData;

  // console.log("payload for travelExpenseData: full update expense", payload);

  try {
    const filter = {
      tenantId,
      $or: [
        { "travelRequestData.travelRequestId": travelRequestId },
        { tripId },
      ],
    };

    const updateOptions = {
      upsert: true,
      returnDocument: "after",
    };

    // Remove _id from the replacement object if it exists
    const replacementDocument = { ...getExpenseReport };
    delete replacementDocument._id;

    const result = await reporting.findOneAndReplace(
      filter,
      replacementDocument,
      updateOptions
    );

    // console.log(
    //   result
    //     ? 'Expense report successfully updated/inserted'
    //     : 'No document matched the update criteria'
    // );

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Failed to update travel expense data", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const settleExpenseReport = async (payload) => {
  try {
    const {
      tenantId,
      travelRequestId,
      expenseHeaderId,
      settlementBy,
      expenseHeaderStatus,
      settlementDate,
    } = payload;

    const status = {
      PENDING_SETTLEMENT: "pending settlement",
      PAID: "paid",
      APPROVED: "approved",
    };

    const arrayFilters = [
      { "elem.expenseHeaderId": expenseHeaderId },
      { "lineItem.lineItemStatus": status.APPROVED },
    ];

    const trip = await reporting.findOneAndUpdate(
      {
        tenantId,
        "tripSchema.travelExpenseData": {
          $elemMatch: { travelRequestId, expenseHeaderId },
        },
      },
      {
        $set: {
          "tripSchema.travelExpenseData.$[elem].expenseHeaderStatus":
            expenseHeaderStatus,
          "tripSchema.travelExpenseData.$[elem].settlementDate": settlementDate,
          "tripSchema.travelExpenseData.$[elem].settlementBy": settlementBy,
          "tripSchema.travelExpenseData.$[elem].expenseLines.$[lineItem].lineItemStatus":
            status.PAID,
        },
      },
      { arrayFilters, new: true, runValidators: true }
    );

    // console.log('Travel request status updated in approval microservice:', trip);
    return { success: true, error: null };
  } catch (error) {
    console.error(
      "Failed to update travel request status in approval microservice:",
      error
    );
    return { success: false, error: error };
  }
};

export const processTravelExpense = async (message, correlationId) => {
  const failedUpdates = [];
  const successMessage = {
    message: "Successfully updated dashboard database-travel expense data",
    correlationId: correlationId,
  };
  for (const payload of message.payload) {
    const { tripId } = payload;

    try {
      const updated = await reporting.findOneAndUpdate(
        { "tripSchema.travelExpenseData.tripId": tripId },
        {
          $set: {
            "tripSchema.travelExpenseData": payload,
            "tripSchema.travelExpenseData.sendForNotification ": false, // always set 'sendForNotification' it as false when dashboard is updated
          },
        },
        { upsert: true, new: true }
      );
      // console.log('Saved to dashboard: using synchrnous queue', updated);
    } catch (error) {
      console.error(
        "Failed to update dashboard: using synchronous queue",
        error
      );

      // Collect failed updates
      failedUpdates.push(trip);
    }
  }

  // Send success message if updates were successful
  if (failedUpdates.length === 0) {
    try {
      // Send the success message and correlationId to another service or queue for further processing
      await sendSuccessConfirmationToTripMicroservice(
        successMessage,
        correlationId
      );
      // console.log('Success confirmation sent, using synchrnous queue:', successMessage);
    } catch (error) {
      console.error(
        "Failed to send success confirmation,using synchrnous queue:",
        error
      );
      // Handle error while sending confirmation
    }
  }

  // Send failed updates as confirmation message
  if (failedUpdates.length > 0) {
    try {
      // Send the failed updates to another service or queue for further processing
      await sendFailedConfirmationToTripMicroservice(
        failedUpdates,
        correlationId
      );
      console.log(
        " dashboard update failed and is sent to rabbitmq sent as confirmation,using synchrnous queue:",
        failedUpdates,
        correlationId
      );
    } catch (error) {
      console.error(
        "Failed to send failed updates confirmation,using synchrnous queue:",
        error
      );
    }
  }
};
