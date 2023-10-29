import { Approval } from '../models/approvalSchema.js';


// Get Expenses by Approver ID
export const getExpensesByApproverId = async (req, res) => {
  try {
    const empId = req.params.empId;

    // Filter approval documents by approver's empId, matching expenseStatus, and expenseHeaderType
    const approvalDocuments = await Approval.find({
      'embeddedExpenseSchema.approvers.empId': empId,
      'embeddedExpenseSchema.expenseHeaderType': 'non travel',
      'embeddedExpenseSchema.expenseStatus': { $nin: ['approved', 'rejected'] }, 
    }).exec();

    if (approvalDocuments.length === 0) {
      // If no approval documents are found, respond with a 404 Not Found status and a specific message
      return res.status(404).json({ message: 'No pending non-travel expenses found for this approver.' });
    }

    // Extracted expense data by approver ID
    const extractedData = [];

    approvalDocuments.forEach((document) => {
      const expenseHeaderID = document.embeddedExpenseSchema?.expenseHeaderID || 'Missing ExpenseHeaderID';
      const expenseStatus = document.embeddedExpenseSchema?.expenseStatus || 'Missing expenseStatus';
      const purpose = document.embeddedExpenseSchema?.purpose || 'Missing purpose';

      const totalAmounts = [];
      let firstBillDate = 'No Bills';

      document.embeddedExpenseSchema.expenseLines.forEach((line) => {
        const totalAmount = line.transactionData.totalAmount || 0; // Default to 0 if missing
        totalAmounts.push(totalAmount);


        // Find the first bill date
        if (line.transactionData.billDate) {
          if (firstBillDate === 'No Bills' || line.transactionData.billDate < firstBillDate) {
            firstBillDate = line.transactionData.billDate;
          }
        }
      });

      // Calculate the grand total
      const grandTotal = totalAmounts.reduce((acc, amount) => acc + amount, 0);

      const employeeName = document.embeddedExpenseSchema?.createdFor[0]?.name || 'Missing Employee Name';

      const expenseObject = {
        EmployeeName: employeeName,
        TotalAmount: grandTotal,
        FirstBillDate: firstBillDate,
        ExpenseHeaderID: expenseHeaderID,
        Purpose: purpose,
        ExpenseStatus: expenseStatus,
      };

      extractedData.push(expenseObject);
    });

    res.status(200).json(extractedData);
  } catch (error) {
    console.error('An error occurred while retrieving expenses:', error.message);
    res.status(500).json({ error: 'An error occurred while retrieving expenses.' });
  }
};




// Get Expenses by EmployeeName for approver
export const getExpensesByEmployeeName = async (req, res) => {
  try {
    const empId = req.params.empId;
    const employeeName = req.params.employeeName;

    // Filter approval documents by approver's empId and matching employeeName
    const approvalDocuments = await Approval.find({
      'embeddedExpenseSchema.approvers.empId': empId,
      'embeddedExpenseSchema.createdFor.name': employeeName,
      'embeddedExpenseSchema.expenseStatus': 'pending approval',
      'embeddedExpenseSchema.expenseHeaderType': 'non travel',
    }).exec();

    if (approvalDocuments.length === 0) {
      // If no approval documents are found, respond with a 404 Not Found status and a specific message
      return res.status(404).json({ message: 'No pending approval documents found for this user and employeeName.' });
    }

    // Extracted expense data by employeeName
    const extractedData = [];

    approvalDocuments.forEach((document) => {
      const expenseHeaderID = document.embeddedExpenseSchema?.expenseHeaderID || 'Missing ExpenseHeaderID';
      const expenseStatus = document.embeddedExpenseSchema?.expenseStatus || 'Missing expenseStatus';
      const purpose = document.embeddedExpenseSchema?.purpose || 'Missing purpose';

      const totalAmounts = [];
      let firstBillDate = 'No Bills';

      document.embeddedExpenseSchema.expenseLines.forEach((line) => {
        const totalAmount = line.transactionData.totalAmount || 0; // Default to 0 if missing
        totalAmounts.push(totalAmount);


        // Find the first bill date
        if (line.transactionData.billDate) {
          if (firstBillDate === 'No Bills' || line.transactionData.billDate < firstBillDate) {
            firstBillDate = line.transactionData.billDate;
          }
        }
      });

      // Calculate the grand total
      const grandTotal = totalAmounts.reduce((acc, amount) => acc + amount, 0);

      const expenseObject = {
        EmployeeName: employeeName,
        TotalAmount: grandTotal,
        FirstBillDate: firstBillDate,
        ExpenseHeaderID: expenseHeaderID,
        Purpose: purpose,
        ExpenseStatus: expenseStatus,
      };

      extractedData.push(expenseObject);
    });

    res.status(200).json(extractedData);
  } catch (error) {
    console.error('An error occurred while retrieving expenses:', error.message);
    res.status(500).json({ error: 'An error occurred while retrieving expenses.' });
  }
};

// Get Expenses by ExpenseStatus for approver
export const getExpensesByExpenseStatus = async (req, res) => {
  try {
    const empId = req.params.empId;
    const expenseStatus = req.params.expenseStatus;

    // Filter approval documents by approver's empId, matching ExpenseStatus, and expenseHeaderType
    const approvalDocuments = await Approval.find({
      'embeddedExpenseSchema.approvers.empId': empId,
      'embeddedExpenseSchema.expenseStatus': expenseStatus, 
      'embeddedExpenseSchema.expenseHeaderType': 'non travel',
    }).exec();

    if (approvalDocuments.length === 0) {
      // If no approval documents are found, respond with a 404 Not Found status and a specific message
      return res.status(404).json({ message: 'No pending approval documents found for this user and expenseStatus.' });
    }

    // Extracted expense data by expenseStatus
    const extractedData = [];

    approvalDocuments.forEach((document) => {
      const expenseHeaderID = document.embeddedExpenseSchema?.expenseHeaderID || 'Missing ExpenseHeaderID';
      const expenseStatus = document.embeddedExpenseSchema?.expenseStatus || 'Missing expenseStatus';
      const purpose = document.embeddedExpenseSchema?.purpose || 'Missing purpose';

      const totalAmounts = [];
      let firstBillDate = 'No Bills';

      document.embeddedExpenseSchema.expenseLines.forEach((line) => {
        const totalAmount = line.transactionData.totalAmount || 0; // Default to 0 if missing
        totalAmounts.push(totalAmount);

        // Find the first bill date
        if (line.transactionData.billDate) {
          if (firstBillDate === 'No Bills' || line.transactionData.billDate < firstBillDate) {
            firstBillDate = line.transactionData.billDate;
          }
        }
      });

      // Calculate the grand total
      const grandTotal = totalAmounts.reduce((acc, amount) => acc + amount, 0);

      const employeeName = document.embeddedExpenseSchema?.createdFor[0]?.name || 'Missing Employee Name';

      const expenseObject = {
        EmployeeName: employeeName,
        TotalAmount: grandTotal,
        FirstBillDate: firstBillDate,
        ExpenseHeaderID: expenseHeaderID,
        Purpose: purpose,
        ExpenseStatus: expenseStatus, 
      };

      extractedData.push(expenseObject);
    });

    res.status(200).json(extractedData);
  } catch (error) {
    console.error('An error occurred while retrieving expenses:', error.message);
    res.status(500).json({ error: 'An error occurred while retrieving expenses.' });
  }
};






// View Non-Travel Expense List
export const viewNonTravelExpenseList = async (req, res) => {
  try {
    const expenseHeaderID = req.params.expenseHeaderID;
    const empId = req.params.empId;

    // Find all documents that match the criteria
    const approvalDocuments = await Approval.find({
      'embeddedExpenseSchema.expenseHeaderID': expenseHeaderID,
      'embeddedExpenseSchema.expenseHeaderType': 'non travel',
      'embeddedExpenseSchema.approvers.empId': empId,
      'embeddedExpenseSchema.expenseStatus': { $nin: ['approved', 'rejected'] },
      'embeddedExpenseSchema.expenseStatus': 'pending approval',
    }).exec();

    if (approvalDocuments.length === 0) {
      // If no matching documents are found, respond with a 404 Not Found status and a specific message
      return res.status(404).json({ message: 'No pending non-travel expenses found for this approver.' });
    }

    // Extracted expense data
    const extractedData = [];

    approvalDocuments.forEach((document) => {
      const expenseHeaderID = document.embeddedExpenseSchema?.expenseHeaderID || 'Missing ExpenseHeaderID';

      const expenseLines = document.embeddedExpenseSchema.expenseLines;

      // Extract details from each bill and create an array of expense objects
      expenseLines.forEach((billDetails) => {
        const expenseType = billDetails.expenseType || 'ExpenseType';
        const totalAmount = billDetails.transactionData.totalAmount || 'Amount';
        const description = billDetails.transactionData.description || 'Description';
        const vendorName = billDetails.transactionData.vendorName || 'VendorName';
        const modeOfPayment = billDetails.modeOfPayment || 'PaymentMode';
        const billNumber = billDetails.transactionData.billNumber || 'BillNumber';

        const expenseObject = {
          ExpenseType: expenseType,
          TotalAmount: totalAmount,
          Description: description,
          VendorName: vendorName,
          PaymentType: modeOfPayment,
          BillNumber: billNumber,
          ExpenseHeaderID: expenseHeaderID,
        };

        extractedData.push(expenseObject);
      });
    });

    res.status(200).json(extractedData);
  } catch (error) {
    console.error('An error occurred while fetching non-travel expense list:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching non-travel expense list.' });
  }
};



// // Get Expense Details for a single bill
// export const viewNonTravelExpenseDetails = async (req, res) => {
//   try {
//     const expenseHeaderID = req.params.expenseHeaderID;
//     const billNumber = req.params.billNumber;

//     // Find the single document matching the expenseHeaderID
//     const approvalDocument = await Approval.findOne({
//       'embeddedExpenseSchema.expenseHeaderID': expenseHeaderID,
//       'embeddedExpenseSchema.expenseHeaderType': 'non travel',
//     }).exec();

//     // Check if the document exists
//     if (!approvalDocument) {
//       return res.status(404).json({ message: 'No matching approval document found to view non travel expense bill details' });
//     }

//     // Find the bill details within the embeddedExpenseSchema
//     const embeddedExpenseSchema = approvalDocument.embeddedExpenseSchema;
//     const expenseLines = embeddedExpenseSchema.expenseLines;

//     // Search for the bill with the specified billNumber
//     const billDetails = expenseLines.find((line) => line.transactionData.billNumber === billNumber);

//     // Check if the bill was found
//     if (!billDetails) {
//       return res.status(404).json({ message: 'No matching bill found to view non travel expense bill details.' });
//     }

//     // Extract the relevant details from the found bill
//     const expenseType = billDetails.expenseType || 'ExpenseType';
//     const totalAmount = billDetails.transactionData.totalAmount || 'Amount';
//     const description = billDetails.transactionData.description || 'Description';
//     const vendorName = billDetails.transactionData.vendorName || 'VendorName';
//     const modeOfPayment = billDetails.modeOfPayment || 'PaymentMode';
//     const billStatus = billDetails.billStatus || 'billStatus';

//     const expenseObject = {
//       ExpenseType: expenseType,
//       TotalAmount: totalAmount,
//       Description: description,
//       VendorName: vendorName,
//       BillStatus: billStatus,
//       PaymentType: modeOfPayment,
//       BillNumber: billNumber,
//       ExpenseHeaderID: expenseHeaderID,
//     };

//     // Respond with the extracted data
//     res.status(200).json(expenseObject);
//   } catch (error) {
//     console.error('An error occurred while fetching non travel expense bill details:', error.message);
//     res.status(500).json({ error: 'An error occurred while fetching non travel expense bill details.' });
//   }
// };




export const NonTravelExpenseStatusApproved = async (req, res) => {
  try {
    const { expenseHeaderID, empId } = req.params;

    if (!expenseHeaderID || !empId) {
      return res.status(400).json({
        message: 'Missing or invalid parameters in the request. Both expenseHeaderID and empId are required.',
      });
    }

    const approvalDocument = await Approval.findOne({
      'embeddedExpenseSchema.expenseHeaderID': expenseHeaderID,
      'embeddedExpenseSchema.approvers.empId': empId,
      'embeddedExpenseSchema.expenseHeaderType': 'non travel',
    }).exec();

    if (!approvalDocument) {
      return res.status(404).json({ message: 'No matching approval document found for updating travel expenses status.' });
    }

    const embeddedExpenseSchema = approvalDocument.embeddedExpenseSchema;

    if (!embeddedExpenseSchema || !embeddedExpenseSchema.expenseStatus) {
      return res.status(404).json({ message: 'No matching Travel expense details found for updating bill status.' });
    }

    if (embeddedExpenseSchema.expenseStatus !== 'pending approval') {
      return res.status(400).json({ message: `Approval failed. Current status: ${embeddedExpenseSchema.expenseStatus}. It must be 'pending approval' to approve.` });
    }

    // Update the expenseStatus to 'approved'
    embeddedExpenseSchema.expenseStatus = 'approved';

    try {
      await approvalDocument.save();
      res.status(200).json({ message: 'Travel expense status updated to approved.' });
    } catch (saveError) {
      console.error('An error occurred while saving the status update:', saveError.message);
      res.status(500).json({ error: 'An error occurred while updating Travel Expense status.' });
    }
  } catch (error) {
    console.error('An error occurred while updating Travel Expense status:', error.message);
    res.status(500).json({ error: 'An error occurred while updating Travel Expense status.' });
  }
};


export const NonTravelExpenseStatusRejected = async (req, res) => {
  try {
    const { expenseHeaderID, empId } = req.params;
    const { expenseRejectionReason } = req.body;

    const approvalDocument = await Approval.findOne({
      'embeddedExpenseSchema.expenseHeaderID': expenseHeaderID,
      'embeddedExpenseSchema.approvers.empId': empId,
      'embeddedExpenseSchema.expenseHeaderType': 'non travel',
    }).exec();

    if (!approvalDocument) {
      return res.status(404).json({ message: 'No matching approval document found for updating travel expenses status.' });
    }

    const embeddedExpenseSchema = approvalDocument.embeddedExpenseSchema;

    if (!embeddedExpenseSchema || !embeddedExpenseSchema.expenseStatus) {
      return res.status(404).json({ message: 'No matching Travel expense details found for updating bill status.' });
    }

    if (embeddedExpenseSchema.expenseStatus !== 'pending approval') {
      return res.status(400).json({ message: `Deny failed. Current status: ${embeddedExpenseSchema.expenseStatus}. It must be 'pending approval' to reject/Send back to the employee.` });
    }

    if (!expenseRejectionReason) {
      return res.status(400).json({ message: 'Deny failed. An embeddedExpenseSchema.expenseRejectionReason is required to reject/Send back to the employee.' });
    }

    // Update the embeddedExpenseSchema.expenseStatus to 'rejected'
    embeddedExpenseSchema.expenseStatus = 'rejected';
    // Update the embeddedExpenseSchema.expenseRejectionReason
    embeddedExpenseSchema.expenseRejectionReason = expenseRejectionReason;

    try {
      await approvalDocument.save();
      res.status(200).json({ message: 'Travel expense status updated to Rejected.' });
    } catch (saveError) {
      console.error('An error occurred while saving the status update:', saveError.message);
      res.status(500).json({ error: 'An error occurred while updating Travel Expense status.' });
    }
  } catch (error) {
    console.error('An error occurred while updating Travel Expense status:', error.message);
    res.status(500).json({ error: 'An error occurred while updating Travel Expense status.' });
  }
};



//--------------------------------------------------------------------------------------------------------

// Load environment variable for the Expense Booking Microservice URL
const expenseBookingMicroserviceUrl = process.env.EXPENSE_BOOKING_MICROSERVICE_URL;
//const expenseBookingMicroserviceUrl = 'http://expense-booking-microservice';


//  Function to find the approval document by expenseHeaderID

const findApprovalDocument = async (expenseHeaderID) => {
  return await Approval.findOne({
    'embeddedExpenseSchema.expenseHeaderID': expenseHeaderID,
  }).exec();
};

// Function to update the bill status in an approval document
const updateBillStatus = (billDetails, newBillStatus) => {
  billDetails.billStatus = newBillStatus;
};

// Function to make an asynchronous API call to update the bill status in the Expense Booking Microservice
const updateBillStatusInExpenseBookingMicroservice = async (expenseHeaderID, billNumber, newBillStatus) => {
  try {
    await axios.post(`${expenseBookingMicroserviceUrl}/updateBillStatus`, {
      expenseHeaderID,
      billNumber,
      newBillStatus,
    });
  } catch (error) {
    throw error;
  }
};

//Main function to handle the bill status update
export const BillStatusApprovedAsync = async (req, res) => {
  try {
    const expenseHeaderID = req.params.expenseHeaderID;
    const billNumber = req.params.billNumber;
    const newBillStatus = req.body.billStatus;

    // Find the approval document
    const approvalDocument = await findApprovalDocument(expenseHeaderID);

    // Check if the document exists
    if (!approvalDocument) {
      return res.status(404).json({ message: 'No matching approval document found for updating bill status.' });
    }

    // Find the bill details within the embeddedExpenseSchema
    const embeddedExpenseSchema = approvalDocument.embeddedExpenseSchema;
    const expenseLines = embeddedExpenseSchema.expenseLines;

    // Search for the bill with the specified billNumber
    const billDetails = expenseLines.find((line) => line.transactionData.billNumber === billNumber);

    // Check if the bill was found
    if (!billDetails) {
      return res.status(404).json({ message: 'No matching bill found in the approval document for updating bill status.' });
    }

    // Update the bill status
    updateBillStatus(billDetails, newBillStatus);

    // Save the changes
    await approvalDocument.save();

    // Update the status in the Expense Booking Microservice
    await updateBillStatusInExpenseBookingMicroservice(expenseHeaderID, billNumber, newBillStatus);

    // Respond with the updated data
    res.status(200).json({ message: 'Bill status updated successfully' });
  } catch (error) {
    console.error('Error updating bill status:', error.message);
    res.status(500).json({ error: 'An error occurred while updating bill status.' });
  }
};


//--------------------------------------------------------------------------------------------

// Load environment variable for the Expense Booking Microservice URL
// const expenseBookingMicroserviceUrl = process.env.EXPENSE_BOOKING_MICROSERVICE_URL;

// Load environment variable for the Trip Microservice URL
const tripMicroserviceUrl = process.env.TRIP_MICROSERVICE_URL;

/**
 * Function to find the approval document by expenseHeaderID
 */
// const findApprovalDocument = async (expenseHeaderID) => {
//   return await Approval.findOne({
//     'embeddedExpenseSchema.expenseHeaderID': expenseHeaderID,
//   }).exec();
// };

/**
 * Function to update the bill status and reason for rejection in an approval document
 */
const updateBillStatusAndReason = (billDetails, newBillStatus, reasonForRejection) => {
  billDetails.billStatus = newBillStatus;
  billDetails.billRejectionReason = reasonForRejection;
};

/**
 * Function to make an asynchronous API call to update the bill status in the Trip Microservice
 */
const updateBillStatusInTripMicroservice = async (expenseHeaderID, billNumber, newBillStatus) => {
  try {
    await axios.post(`${tripMicroserviceUrl}/updateBillStatus`, {
      expenseHeaderID,
      billNumber,
      newBillStatus,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Main function to handle the bill status update
 */
export const BillStatusRejectedAsync = async (req, res) => {
  try {
    const expenseHeaderID = req.params.expenseHeaderID;
    const billNumber = req.params.billNumber;
    const newBillStatus = req.body.billStatus;
    const reasonForRejection = req.body.reasonForRejection;

    // Find the approval document
    const approvalDocument = await findApprovalDocument(expenseHeaderID);

    // Check if the document exists
    if (!approvalDocument) {
      return res.status(404).json({ message: 'No matching approval document found.' });
    }

    // Find the bill details within the embeddedExpenseSchema
    const embeddedExpenseSchema = approvalDocument.embeddedExpenseSchema;
    const expenseLines = embeddedExpenseSchema.expenseLines;

    // Search for the bill with the specified billNumber
    const billDetails = expenseLines.find((line) => line.transactionData.billNumber === billNumber);

    // Check if the bill was found
    if (!billDetails) {
      return res.status(404).json({ message: 'No matching bill found in the approval document.' });
    }

    // Update the bill status and reason for rejection
    updateBillStatusAndReason(billDetails, newBillStatus, reasonForRejection);

    // Save the changes
    await approvalDocument.save();

    // Make an asynchronous API call to the Expense Booking Microservice
    await updateBillStatusInExpenseBookingMicroservice(expenseHeaderID, billNumber, newBillStatus);

    // Check the expenseHeaderType
    if (approvalDocument.embeddedExpenseSchema.expenseHeaderType === 'travel') {
      // Make an asynchronous API call to the Trip Microservice
      await updateBillStatusInTripMicroservice(expenseHeaderID, billNumber, newBillStatus);
    }

    // Respond with the updated data
    res.status(200).json({ message: 'Bill status and reason for rejection updated successfully' });
  } catch (error) {
    console.error('An error occurred while updating bill status:', error.message);
    res.status(500).json({ error: 'An error occurred while updating bill status.' });
  }
};





































// // Get Expense Details for a single bill
// export const viewNonTravelExpenseDetails = async (req, res) => {
//   try {
//     const expenseHeaderID = req.params.expenseHeaderID;
//     const empId = req.params.empId;
//     const billNumber = req.params.billNumber;

//     // Use Promise.all to handle multiple asynchronous queries
//     const [approvalDocuments] = await Promise.all([
//       Approval.find({
//         'embeddedExpenseSchema.expenseHeaderID': embeddedExpenseSchema.expenseHeaderID,
//         'embeddedExpenseSchema.approvers': { $elemMatch: { empId: empId } },
//       }).exec(),
//     ]);

//     // Check if any of the queries failed
//     if (!approvalDocuments) {
//       return res.status(404).json({ message: 'No matching approval documents found.' });
//     }

//     // Extracted expense data for the matching bill
//     const extractedData = [];

//     approvalDocuments.forEach((document) => {
//       document.embeddedExpenseSchema.expenseLines.forEach((line) => {
//         if (line.transactionData.billNumber === billNumber) {
//           const expenseType = line.expenseType || 'ExpenseType';
//           const totalAmount = line.transactionData.totalAmount || 'Amount';
//           const description = line.transactionData.description || 'Description';
//           const vendorName = line.transactionData.vendorName || 'VendorName';
//           const modeOfPayment = line.modeOfPayment || 'PaymentMode';

//           const expenseObject = {
//             ExpenseType: expenseType,
//             TotalAmount: totalAmount,
//             Description: description,
//             VendorName: vendorName,
//             PaymentType: modeOfPayment,
//           };

//           extractedData.push(expenseObject);
//         }
//       });
//     });

//     // Check if the bill was found
//     if (extractedData.length === 0) {
//       return res.status(404).json({ message: 'No matching bill found in approval documents.' });
//     }

//     // Respond with the extracted data as an array of objects
//     res.status(200).json(extractedData);
//   } catch (error) {
//     console.error('An error occurred while fetching expense details:', error.message);
//     res.status(500).json({ error: 'An error occurred while fetching data.' });
//   }
// };