import { fetchExpenseData } from '../services/expense.js';
import { Approval } from '../models/approvalSchema.js';
import { sendTripApprovalToDashboardQueue } from '../rabbitmq/dashboardMicroservice.js';
import { sendToDashboardMicroservice } from '../rabbitmq/publisherDashboard.js';
import { sendToOtherMicroservice } from '../rabbitmq/publisher.js';

//for saving both travel and non travel dummy data into Approval container.
export const saveDataInApprovalContainer = async (req, res) => {
  try {
    const expenseData = await fetchExpenseData();

    for (const newExpenseData of expenseData) {
      // Check if travelRequestId is null or missing
      if (!newExpenseData.travelRequestId) {
        console.log('Skipping record due to missing travelRequestId.');
        continue; // Skip this record and move to the next one
      }

      // Construct a query to find an existing Approval document based on conditions
      const query = {
        'travelRequestData.travelRequestId': newExpenseData.travelRequestId
      };

      // Find the existing approval document
      const existingApproval = await Approval.findOne(query);

      if (existingApproval) {
        // Update the existing approval document with the new data
        if (existingApproval.travelExpenseData) {
          // Find the specific expenseLine using billNumber
          const existingBill = existingApproval.travelExpenseData.expenseLines.find(
            (line) => line.transactionData.billNumber === newExpenseData.expenseLines[0].transactionData.billNumber
          );

          if (existingBill) {
            // Update the existing bill details
            existingBill.transactionData = newExpenseData.expenseLines[0].transactionData;
            console.log('Bill is updated.');
          } else {
            // Add a new bill to the expenseLines
            existingApproval.travelExpenseData.expenseLines.push(newExpenseData.expenseLines[0]);
          }
        } else {
          // Update the travelExpenseData if it doesn't exist
          existingApproval.travelExpenseData = newExpenseData;
        }

        // Save the updated approval document
        await existingApproval.save();
      } else {
        // Create a new approval document with the travelExpenseData
        const newApprovalData = {
          travelRequestData: newExpenseData,
          travelExpenseData: newExpenseData,
        };

        const newApproval = new Approval(newApprovalData);

        // Save the new approval document
        await newApproval.save();
      }
    }

    console.log('Success: Expense data saved or updated in the approval container.');
    res.status(200).json({ message: 'Success: Expense data saved or updated in the approval container.' });
  } catch (error) {
    console.error('An error occurred while saving expense data:', error.message);
    res.status(500).json({ error: 'An error occurred while saving data.' });
  }
};

 
//Get list of travel expenses  for approver
export const getExpenseDetails = async (req, res) => {
  try {
    const {tenantId, empId} = req.params;

    // Filter approval documents by approver's empId and expenseHeaderType: Travel
    const approvalDocuments = await Approval.find({
      'tenantId': tenantId,
      'approvalType':'travel-expense',
      'travelExpenseData.approvers.empId': empId,
      'travelExpenseData.expenseHeaderType': 'travel',
    }).exec();

    if (approvalDocuments.length === 0) {
      // If no approval documents are found, respond with a 404 Not Found status and a specific message
      return res.status(404).json({ message: 'No pending approval documents found for this user.' });
    }

    // Extracted travel expense data for approval
    const extractedData = approvalDocuments.map((document) => ({
      EmployeeName: document.travelExpenseData?.createdBy?.name || 'EmpName',
      TripPurpose: document.travelExpenseData?.tripPurpose || 'tripPurpose',
      itinerary: document.travelRequestData?.itinerary || 'from - to',
      expenseHeaderId: document.travelExpenseData?.expenseHeaderId || 'Missing expenseHeaderId',
      EmpId: empId || 'approver id',
      ExpenseHeaderType: document.travelExpenseData?.expenseHeaderType || 'travel',
    }));

    // Respond with the extracted data as an array of objects
    res.status(200).json(extractedData);
  } catch (error) {
    console.error('An error occurred while fetching expense details:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
};


export const viewTravelExpenseDetails = async (req, res) => {
  try {
    const {tenantId, empId,tripId, expenseHeaderId} = req.params;

    console.log(`viewTravelExpenseDetails`,req.params)
    // Filter approval documents by approver's empId and expenseHeaderType: Travel
    const approvalDocument = await Approval.findOne({
       'tripSchema.tenantId':tenantId,
       'tripSchema.tripId':tripId,
       'tripSchema.travelExpenseData':{
        $elemMatch:{
          'expenseHeaderId':expenseHeaderId,
          'approvers':{
            $elemMatch:{
              'empId':empId,
            }
          }
        }
       },
    }).exec();

    if (!approvalDocument) {
      return res.status(404).json({ message: 'No pending travel approval documents found for this user.' });
    } else{
      console.log(" before ",approvalDocument)
      const {travelExpenseData} = approvalDocument.tripSchema
      const expenseReport = travelExpenseData.find(expense => expense.expenseHeaderId.toString() === expenseHeaderId);
      console.log("after",expenseReport)

      if(expenseReport){
        return  res.status(200).json({ success: true , expenseReport});
      }
    }
   } catch (error) {
    console.error('An error occurred while fetching travel expense bill details:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching non-travel expense bill details.' });
  }
};

// Get Expense Details for all the bills in expenseLines
export const oldviewTravelExpenseDetails = async (req, res) => {
  try {
    const {tenantId, empId, expenseHeaderId} = req.params;

    // Filter approval documents by approver's empId and expenseHeaderType: Travel
    const approvalDocuments = await Approval.find({
       tenantId,
      'travelExpenseData.expenseHeaderId': expenseHeaderId,
      'travelExpenseData.approvers.empId': empId,
    }).exec();

    if (approvalDocuments.length === 0) {
      // If no approval documents are found, respond with a 404 Not Found status and a specific message
      return res.status(404).json({ message: 'No pending travel approval documents found for this user.' });
    }

    // Initialize variables to track total amount and advance amount
    let totalAmount = 0;
    let advanceAmount = 0;

    // Extract the relevant details from all bills in expenseLines
    const expenseLines = []; // Initialize an array to store extracted details

    // Extract billDetails
    approvalDocuments.forEach(approvalDoc => {
      const tripPurpose = approvalDoc.travelExpenseData?.tripPurpose || 'tripPurpose';
      const tripId = approvalDoc.tripId || 'tripId'; // tripId added as need for approval client screen
      const billDetails = approvalDoc.travelExpenseData.expenseLines || 'expense details';
      const expenseHeaderStatus = approvalDoc.travelExpenseData.expenseHeaderStatus || 'travelExpense status';

      if (billDetails) {
        // Extract the relevant details from each bill in expenseLines
        billDetails.forEach(bill => {
          const expenseType = bill.expenseType || 'ExpenseType';
          const billTotalAmount = bill.transactionData.totalAmount || 0; 
          const billDate = bill.transactionData.billDate || 'BillDate';
  

          // Add the bill's total amount to the running total
          totalAmount += billTotalAmount;

          // Create an object with the extracted data
          const expenseObject = {
            tripId: tripId,
            TripPurpose: tripPurpose,
            TotalAmount: billTotalAmount, 
            BillDate: billDate,
            ExpenseHeaderStatus : expenseHeaderStatus,
            EmpId: empId,
            expenseHeaderId: expenseHeaderId,
          };

          expenseLines.push(expenseObject);
        });
      }
    });

    // Extract advanceDetails
    approvalDocuments.forEach(approvalDoc => {
      // Extract the first advance amount and currency from each approval document
      const amountDetails = approvalDoc.embeddedCashAdvance?.amountDetails;

      if (amountDetails && Array.isArray(amountDetails) && amountDetails.length > 0) {
        const firstAmountDetails = amountDetails[0];

        const advanceAmountValue = firstAmountDetails.amount || 0; // Default to 0 if not present
        advanceAmount += advanceAmountValue;

        // Extract currency if available
        const advanceCurrency = firstAmountDetails.currency || 'INR'; // Default to 'INR'
        // You can use advanceCurrency here if needed
      }
    });

    // Calculate the AmountRemaining
    const amountRemaining = advanceAmount - totalAmount;

    // Respond with the extracted data and advance details
    res.status(200).json({ expenseLines, advanceAmount, amountRemaining });
  } catch (error) {
    console.error('An error occurred while fetching travel expense bill details:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching non-travel expense bill details.' });
  }
};



export const TravelexpenseHeaderStatusApproved = async (req, res) => {
  try {
    const { tenantId,expenseHeaderId, empId } = req.params;
    console.log("approve expense report", req.params)

    if (!expenseHeaderId || !empId) {
      return res.status(400).json({
        message: 'Missing or invalid parameters in the request. Both expenseHeaderId and empId are required.',
      });
    }

    const tripApprovalDoc = await Approval.findOne({
      'tripSchema.tenantId':tenantId,
      'tripSchema.travelExpenseData':{
        $elemMatch:{
          'expenseHeaderId':expenseHeaderId,
          approvers:{
            $elemMatch:{
              "empId": empId,
            }
          }
        }
      },
    }).exec();

    if (!tripApprovalDoc) {
      return res.status(404).json({ message: 'No matching approval document found for updating travel expenses status.' });
    }

    const travelExpenseData = tripApprovalDoc.travelExpenseData;

    if (!travelExpenseData || !travelExpenseData.expenseHeaderStatus) {
      return res.status(404).json({ message: 'No matching Travel expense details found for updating bill status.' });
    }

    if (travelExpenseData.expenseHeaderStatus !== 'pending approval') {
      return res.status(400).json({ message: `Approval failed. Current status: ${travelExpenseData.expenseHeaderStatus}. It must be 'pending approval' to approve.` });
    }

    // Update the expenseHeaderStatus to 'approved'
    travelExpenseData.expenseHeaderStatus = 'approved';

    try {
     const getTravelExpense = await tripApprovalDoc.save();

     if (!getTravelExpense){
       res.status(404).json({ message: 'Invalid data sent for approval' });
     } else{
      const {tripSchema} = getTravelExpense
      const { travelExpenseData } = tripSchema;
      const matchedExpense = travelExpenseData.find(expense => expense.expenseHeaderId.toString() === expenseHeaderId);
      
      // Create the payload object
      const payload = {
        tenantId,
        expenseHeaderId,
        expenseHeaderStatus: 'approved',
        expenseRejectionReason: matchedExpense ? matchedExpense.expenseRejectionReason : '',
        approvers: matchedExpense ? matchedExpense.approvers : null,
      };

      console.log("payload for approve", payload)
      const action = 'expense-approval';
      // rabbitmq to send it to dashboard
      await sendToOtherMicroservice(payload, action, 'trip', comments, source='approval', onlineVsBatch='online')
      await sendToOtherMicroservice(payload, action, 'expense', comments, source='approval', onlineVsBatch='online')
      await sendToDashboardMicroservice(payload, action, comments, source = 'trip', 'online', true)

     return res.status(200).json({ message: 'Travel expense status updated to approved.' });
    }} catch (saveError) {
      console.error('An error occurred while saving the status update:', saveError.message);
      res.status(500).json({ error: 'An error occurred while updating Travel Expense status.' });
    }
  } catch (error) {
    console.error('An error occurred while updating Travel Expense status:', error.message);
    res.status(500).json({ error: 'An error occurred while updating Travel Expense status.' });
  }
};


export const TravelexpenseHeaderStatusRejected = async (req, res) => {
  try {
    const {tenantId, expenseHeaderId, empId } = req.params;
    const { expenseRejectionReason } = req.body;

    const tripApprovalDoc = await Approval.findOne({
      'tripSchema.tenantId':tenantId,
      'tripSchema.travelExpenseData':{
        $elemMatch:{
          expenseHeaderId,
          approvers:{
            $elemMatch:{
              empId
            }
          }
        }
      },
    }).exec();

    if (!tripApprovalDoc) {
      return res.status(404).json({ message: 'No matching approval document found for updating travel expenses status.' });
    }

    const travelExpenseData = tripApprovalDoc.travelExpenseData;

    if (!travelExpenseData || !travelExpenseData.expenseHeaderStatus) {
      return res.status(404).json({ message: 'No matching Travel expense details found for updating bill status.' });
    }

    if (travelExpenseData.expenseHeaderStatus !== 'pending approval') {
      return res.status(400).json({ message: `Deny failed. Current status: ${travelExpenseData.expenseHeaderStatus}. It must be 'pending approval' to reject/Send back to the employee.` });
    }

    if (!expenseRejectionReason) {
      return res.status(400).json({ message: 'Deny failed. An travelExpenseData.expenseRejectionReason is required to reject/Send back to the employee.' });
    }

    // Update the travelExpenseData.expenseHeaderStatus to 'rejected'
    travelExpenseData.expenseHeaderStatus = 'rejected';
    // Update the travelExpenseData.expenseRejectionReason
    travelExpenseData.expenseRejectionReason = expenseRejectionReason;

    try {
    const getExpenseReport =  await tripApprovalDoc.save();

    if(!getExpenseReport){
        return res.status(404).json({success: false, message:'error in updating data'})
    } else{

      const {tripSchema} = getExpenseReport
      const { travelExpenseData } = tripSchema;
      const matchedExpense = travelExpenseData.find(expense => expense.expenseHeaderId.toString() === expenseHeaderId);
      console.log("expense report approvers", matchedExpense)
      // Create the payload object
      const payload = {
        tenantId,
        expenseHeaderId,
        expenseHeaderStatus: 'rejected',
        expenseRejectionReason: matchedExpense ? matchedExpense.expenseRejectionReason : '',
        approvers: matchedExpense ? matchedExpense.approvers : null,
      };

      console.log("payload for rejected", payload)
      const action = 'expense-approval';
      // rabbitmq to send it to dashboard
      await sendToOtherMicroservice(payload, action, 'trip', comments, source='approval', onlineVsBatch='online')
      await sendToOtherMicroservice(payload, action, 'expense', comments, source='approval', onlineVsBatch='online')
      await sendToDashboardMicroservice(payload, action, comments, source = 'trip', 'online', true)

       
      res.status(200).json({ message: 'Travel expense status updated to Rejected.' });
    }


    } catch (saveError) {
      console.error('An error occurred while saving the status update:', saveError.message);
      res.status(500).json({ error: 'An error occurred while updating Travel Expense status.' });
    }
  } catch (error) {
    console.error('An error occurred while updating Travel Expense status:', error.message);
    res.status(500).json({ error: 'An error occurred while updating Travel Expense status.' });
  }
};


