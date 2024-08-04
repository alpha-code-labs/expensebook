import amqp from 'amqplib';

const rabbitMQUrl = 'amqp://localhost:5672';

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();
    return channel; 
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    throw error;
  }
};

const processMessage = async (msg) => {
  try {
    const message = JSON.parse(msg.content.toString());

    // Process message payload
    console.log('Received message:', message);

    // Send ack/nack based on needConfirmation
    if (message.headers.needConfirmation) {
      // Send ack
      console.log('Sending ack for message:', message);
      channel.sendToQueue(msg.properties.replyTo, 
        Buffer.from(JSON.stringify(true)),
        { correlationId: msg.properties.correlationId });
    } else {
      // Just ack, no response needed
      channel.ack(msg);
    }

  } catch (error) {
    console.error('Error processing message:', error);
  }
};

const subscribeToQueue = async (queue) => {
  try {
    const channel = await connectToRabbitMQ();

    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, processMessage);

    console.log(`Subscribed to queue: ${queue}`);
  } catch (error) {
    console.error('Error subscribing to queue:', error);
  }
};

subscribeToQueue('sync'); 
subscribeToQueue('async');


// export const approveNonTravelExpenseReports = async (req, res) => {
//   try {
//     const { error, value} = otherExpenseSchema.validate(req.params)
//     if(error){
//       return res.status(400).json({error: error.details[0].message})
//     }

//      const { tenantId, expenseHeaderId, empId } = value;
//      console.log("expense report - params -- approve", req.params);


//      const approvalDocument = await getNonTravelExpenseReport(tenantId,empId,expenseHeaderId)
 
//      if (!approvalDocument) {
//        return res.status(404).json({ message: 'No matching approval document found for updating travel expenses status.' });
//      }
 
//      const { reimbursementSchema={}} = approvalDocument

//      const { createdBy:{name = ''} = {}} = reimbursementSchema
 
//      console.log("valid expenseReport", expenseReportFound);

//      reimbursementSchema.approvers.forEach(approver => {
//          if (approver.empId === empId && approver.status === 'pending approval') {
//            approver.status = 'approved';
//          }
//        });
 
//       const allApproved = approvers.every(approver => approver.status == 'approved');
 
//       if (allApproved) {
//         expenseHeaderStatus = 'approved';
//       }
 
//        // Save the updated approvalDocument document
//       const expenseApproved = await approvalDocument.save();

//       if(!expenseApproved){
//         return res.status(404).json({message:`error occurred while updating expense report for ${name}`})
//       } else {

//         const { name } = expenseApproved?.reimbursementSchema?.createdBy;

//         const { reimbursementSchema } = expenseApproved;

//         console.log("expense report approvers", matchedExpense)
//         // Create the payload object
//         const payload = {
//           tenantId,
//           expenseHeaderId,
//           expenseHeaderStatus: 'approved',
//           rejectionReason: reimbursementSchema?.rejectionReason ||'',
//           approvers: reimbursementSchema?.approvers,
//         };

//      console.log("payload for approve", payload);
//      const action = 'partial-update';
//      const comments = 'Non Travel expense report approved at header level'

// // Assuming sendToOtherMicroservice and sendToDashboardMicroservice are defined elsewhere
// // const promises = [
// //    sendToOtherMicroservice(payload, action, 'expense', comments, source='dashboard', onlineVsBatch='online'),
// //    sendToOtherMicroservice(payload, action, 'approval', comments, source='dashboard', onlineVsBatch='online'),
// // ]
// //   await Promise.all(promises)
//      return res.status(200).json({ message: `expense Report approved for ${name}` });
//       }
//     } catch (error) {
//     console.error('An error occurred while updating Travel Expense status:', error.message);
//     res.status(500).json({ error: 'An error occurred while updating Travel Expense status.' });
//   }
// };

// export const rejectNonTravelExpenseReports = async (req, res) => {
//   try {
//     const { error: errorParams, value: valueParams} = otherExpenseSchema.validate(req.params)

//     if(errorParams){
//       return res.status(400).json({error: `Invalid Parameters ${errorParams.details[0].message}`})
//     }
//      const { tenantId, expenseHeaderId, empId } = valueParams;

//      console.log("expense report - params -- approve", req.params);

//      const {error: errorBody, value : valueBody} = rejectSchema.validate(req.body)

//      if(errorBody){
//       return res.status(400).json({error: errorBody.details[0].message})
//      }
//      const { rejectionReason } = valueBody;

//      const approvalDocument = await getNonTravelExpenseReport(tenantId,empId,expenseHeaderId)
 
//      if (!approvalDocument) {
//        return res.status(404).json({ message: 'No matching approval document found for updating travel expenses status.' });
//      }
 
//      const { reimbursementSchema} = approvalDocument
  
//      reimbursementSchema.approvers.forEach(approver => {
//          if (approver.empId === empId && approver.status === 'pending approval') {
//            approver.status = 'rejected';
//          }
//        });

//        reimbursementSchema.rejectionReason = rejectionReason
//        reimbursementSchema.expenseHeaderStatus = 'rejected';

//        // Save the updated approvalDocument document
//        const expenseApproved = await approvalDocument.save();

//        if(!expenseApproved){
//          return res.status(404).json({message:`error occurred while updating expense report for ${name}`})
//        } else {
//         const { name } = expenseApproved?.reimbursementSchema?.createdBy;

//         const { reimbursementSchema } = expenseApproved;

//         console.log("expense report approvers", matchedExpense)
//         // Create the payload object
//         const payload = {
//           tenantId,
//           expenseHeaderId,
//           expenseHeaderStatus: 'rejected',
//           rejectionReason: reimbursementSchema?.rejectionReason ||'',
//           approvers: reimbursementSchema?.approvers,
//         };
    
//         console.log("payload for rejected non travel report", payload);
//         const action = 'partial-update';
//         const comments = 'non travel expense report rejected at header level'
//         // Assuming sendToOtherMicroservice and sendToDashboardMicroservice are defined elsewhere
//     //  const promises = [
//     //    sendToOtherMicroservice(payload, action, 'expense', comments,  source='dashboard', onlineVsBatch='online'),
//     //    sendToOtherMicroservice(payload, action, 'approval', comments,  source='dashboard', onlineVsBatch='online'),
//     //  ]
    
//     //  await Promise.all(promises);
//        //  await sendToDashboardMicroservice(payload, action, comments,'approval', 'online', true);
//     return res.status(200).json({ message: `expense Report rejected for ${name}` });

//        }

//      } catch (error) {
//      console.error('An error occurred while updating Travel Expense status:', error.message);
//      res.status(500).json({ error: 'An error occurred while updating Travel Expense status.' });
//   }
// };

// //approve nte line items
// export const approveNonTravelExpenseLines = async (req, res) => {
//   try {
//     const { error, value} = otherExpenseSchema.validate(req.params)
//     if(error){
//       return res.status(400).json({error: error.details[0].message})
//     }

//      const { tenantId, expenseHeaderId, empId } = value;
//      console.log("expense report - params -- approve", req.params);
     
//      const {error: errorBody, value: valueBody} = approveLineSchema.validate(req.body)
//      if(errorBody){
//       return res.status(400).json({error: error.details[0].message})
//      }

//      const { approve, reject} = valueBody

//      const approvalDocument = await getNonTravelExpenseReport(tenantId,empId,expenseHeaderId)
 
//      if (!approvalDocument) {
//        return res.status(404).json({ message: 'No matching approval document found for updating travel expenses status.' });
//      }
 
//      const { reimbursementSchema={}} = approvalDocument

//      const { createdBy:{name = ''} = {}} = reimbursementSchema
 
//      console.log("valid expenseReport", reimbursementSchema);

//      const {expenseLines = []} =reimbursementSchema

//      const updatedExpenseLines = updateExpenseLineStatus(expenseLines, approve, reject)

//      reimbursementSchema.expenseLines = updatedExpenseLines
//      const expenseLinesApproved = updatedExpenseLines.some(line => line.lineItemStatus === 'approved')
//      const isPendingApproval = updatedExpenseLines.some(line => line.lineItemStatus === 'pending approval')
//      const isRejected = updatedExpenseLines.some(line => line.lineItemStatus === 'rejected')


//       const approver = reimbursementSchema.approvers.find(approver =>
//        approver.empId === empId && approver.status === 'pending approval'
//       )

//       if(approver && expenseLinesApproved && !isPendingApproval && !isRejected){
//        approver.status = 'approved'
//       } else if(approver && expenseLinesApproved && !isPendingApproval && isRejected ){
//        approver.status = 'rejected'
//       }

//       const allApproved = reimbursementSchema.approvers.every(approver => approver.status == 'approved');

//       if (allApproved && expenseLinesApproved && !isPendingApproval)  {
//        reimbursementSchema.expenseHeaderStatus = 'approved';
//       } else if (!allApproved && !isPendingApproval && isRejected){
//        reimbursementSchema.expenseHeaderStatus = 'rejected';
//       }

//       // Save the updated approvalDocument document
//        const expenseApproved = await approvalDocument.save();

//        if(!expenseApproved){
//          return res.status(404).json({message:`error occurred while updating expense report for ${name}`})
//        } else {

//         const { name } = expenseApproved?.reimbursementSchema?.createdBy;

//         const { reimbursementSchema } = expenseApproved;

//         console.log("expense report approvers", matchedExpense)
//         // Create the payload object
//         const payload = {
//           tenantId,
//           expenseHeaderId,
//           expenseHeaderStatus: 'rejected',
//           reimbursementSchema: reimbursementSchema
//         };

//      console.log("payload for approve", payload);
//      const action = 'full-update';
//      const comments = 'Non Travel expense report approved for line items'

//      // Assuming sendToOtherMicroservice and sendToDashboardMicroservice are defined elsewhere
// // const promises = [
// //    sendToOtherMicroservice(payload, action, 'expense', comments, source='dashboard', onlineVsBatch='online'),
// //    sendToOtherMicroservice(payload, action, 'approval', comments, source='dashboard', onlineVsBatch='online'),
// // ]
// //   await Promise.all(promises)
//      return res.status(200).json({ message: `expense Report approved for ${name}` });
//       }
//     } catch (error) {
//     console.error('An error occurred while updating Travel Expense status:', error.message);
//     res.status(500).json({ error: 'An error occurred while updating Travel Expense status.' });
//   }
// };