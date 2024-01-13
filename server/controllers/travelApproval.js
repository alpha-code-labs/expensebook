import axios from 'axios';
import { Approval } from '../models/approvalSchema.js';
import pino from 'pino';
import { approveAddALegToTrip, rejectAddALegToTrip } from '../internal/controllers/tripMicroservice.js';
import {  approveAddALegToExpense, rejectAddALegToExpense } from '../internal/controllers/expenseMicroservice.js';
import { ApproveAddALegToCash, rejectAddALegToCash } from '../internal/controllers/cashMicroservice.js';
import {  approveAddALegToTravel, rejectAddALegToTravel } from '../internal/controllers/travelMicroservice.js';
import { handleDatabaseError, validateInput } from '../utils/validations.js';
import { sendCashApprovalToDashboardQueue, sendTravelApprovalToDashboardQueue } from '../rabbitmq/dashboardMicroservice.js';
import { sendToOtherMicroservice } from '../rabbitmq/publisher.js';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
});


// 1) travel request standalone
export const getTravelRequestsStandalone = async (req, res) => {
  try {
    const { tenantId, empId } = req.params;

    // Use the Mongoose model for 'Approval' to find pending travel requests
    const travelRequests = await Approval.find({
      'tenantId': tenantId,
      'approvalType': 'travel',
      'travelRequestData.approvers.empId': empId,
      'travelRequestData.travelRequestStatus': 'pending approval',
      'travelRequestData.isCashAdvanceTaken': false,
    }).exec();

    if (travelRequests.length === 0) {
      // If no pending travel requests without cash advance are found, respond with a 404 Not Found status and a specific message
      return res.status(404).json({ message: 'No pending travel requests without cash advances found for this user.' });
    }

    const extractedData = travelRequests.map((request) => {
      const extractedRequestData = {
        approvalType: request.approvalType,
        travelRequestId: request.travelRequestData?.travelRequestId,
        createdBy: request.travelRequestData?.createdBy || 'EmpName',
        travelRequestStatus: request.travelRequestData?.travelRequestStatus,
        tripPurpose: request.travelRequestData?.tripPurpose || 'tripPurpose',
        itinerary: request.travelRequestData?.itinerary || 'itinerary',
        // departureFrom: request.travelRequestData?.itinerary.map((item) => item.departure.from) || 'from to',
        // departureTo: request.travelRequestData?.itinerary.map((item) => item.departure.to) || 'from to',
        // departure: request.travelRequestData?.itinerary.map((item) => item.departure) || 'from to',
      };

      if (request.cashAdvancesData) {
        // If there is an embedded cash advance, extract its fields
        // extractedRequestData.createdByCashAdvance = request.cashAdvancesData?.createdBy?.name || 'EmpName';
        // extractedRequestData.tripPurposeCashAdvance = request.travelRequestData.tripPurpose || 'tripPurpose';
        extractedRequestData.cashAdvanceStatuses = request.cashAdvancesData?.cashAdvances.map((cashAdvance) => cashAdvance.cashAdvanceStatus) || ['CashAdvanceStatus'];
        extractedRequestData.itineraryCitiesCashAdvance = request.travelRequestData?.itinerary.map((item) => item.departure.from) || 'Missing';
        extractedRequestData.amountDetailsCashAdvance = request.cashAdvancesData?.amountDetails || 'Cash';
        extractedRequestData.cashAdvanceViolations = request.cashAdvancesData?.cashAdvanceViolations || 'Violations';
      }

      return extractedRequestData;
    });

    return res.status(200).json(extractedData);
  } catch (error) {
    console.error('An error occurred:', error);
    return res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};

// Get Travel Request Details by Travel Request ID to display to the approver
// export const getTravelRequestDetails = async (req, res) => {
//   try {
//     const { tenantId, travelRequestId, empId } = req.params;

//     // Fetch travel request details by travelRequestId
//     const approval = await Approval.findOne({
//       'tenantId': tenantId,
//       'travelRequestData.travelRequestId': travelRequestId,
//       'travelRequestData.approvers.empId': empId,
//     });

//     if (!approval) {
//       // If the travel request doesn't exist, return a 404 Not Found response
//       return res.status(404).json({ error: 'Travel request not found.' });
//     }

//     const { travelRequestData: travelRequest } = approval;

//     // Filter out null, empty, or undefined values from an object
//     const filterObject = (obj) =>
//       Object.fromEntries(
//         Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined && v !== '')
//       );

//     // Filter the travel request details
//     const filteredTravelRequest = filterObject(travelRequest);

//     // Return the filtered travel request details
//     res.status(200).json(filteredTravelRequest);
//   } catch (error) {
//     // Handle errors
//     console.error('An error occurred while fetching travel request details:', error.message);
//     // Send an error response
//     res.status(500).json({ error: 'An error occurred while fetching travel request details.' });
//   }
// };
//2) travel request standalone - Details
export const getTravelRequestDetails = (req, res) => {
  const { tenantId, travelRequestId, empId } = req.params;

  const travelApproveDoc = {
    'tenantId': tenantId,
    'travelRequestData.travelRequestId': travelRequestId,
    'travelRequestData.approvers.empId': empId,
  };

  // Fetch travel request details by travelRequestId
  Approval.findOne(travelApproveDoc)
    .then((approval) => {
      if (!approval) {
        // If the travel request doesn't exist, return a 404 Not Found response
        return res.status(404).json({ error: 'Travel request not found.' });
      }

      const { travelRequestData: travelRequest } = approval;

      // Filter out null, empty, or undefined values from an object
      const filterObject = (obj) =>
        Object.fromEntries(
          Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined && v !== '')
        );

      // Filter the travel request details
      const filteredTravelRequest = filterObject(travelRequest);

      // Return the filtered travel request details
      res.status(200).json(filteredTravelRequest);
    })
    .catch((error) => {
      // Handle errors
      console.error('An error occurred while fetching travel request details:', error.message);
      // Send an error response
      res.status(500).json({ error: 'An error occurred while fetching travel request details.' });
    });
};


// 3) travel request standalone -status-Approved 
export const travelStandaloneApprove = async (req, res) => {
  try {
    const { tenantId, empId, travelRequestId } = req.params;

    const travelApprovalDoc = await Approval.findOne({
      tenantId,
      'approvalType': 'travel',
      'travelRequestData.isCashAdvanceTaken': false,
      'travelRequestData.travelRequestId': travelRequestId,
      'travelRequestData.travelRequestStatus': 'pending approval',
      'travelRequestData.approvers': {
        $elemMatch: {
          'empId': empId,
          'status': 'pending approval'
        }
      }
    });

    if (!travelApprovalDoc) {
      throw new Error('Travel request not found.');
    }

    const { travelRequestData } = travelApprovalDoc;
    const { approvers } = travelRequestData;

    const updatedApprovers = approvers.map((approver) => {
      if (approver.empId === empId) {
        return {
          ...approver,
          status: 'approved',
        };
      }
      return approver;
    });

    travelApprovalDoc.travelRequestData.approvers = updatedApprovers;

    const allApproved = updatedApprovers.every(approver => approver.status === 'approved');

    if (allApproved) {
      travelApprovalDoc.travelRequestData.travelRequestStatus = 'approved';
    }

    await travelApprovalDoc.save();

    // `sendTravelApprovedToTravelMicroservice` is an asynchronous function
    // await sendTravelApprovedToTravelMicroservice(tenantId, empId, travelRequestId, updatedApprovers);

    // Send updated travel to the dashboard asynchronously
    await sendTravelApprovalToDashboardQueue(travelApprovalDoc)

    const payload = {
      travelRequestId: travelApprovalDoc.travelRequestData.travelRequestId,
      travelRequestStatus: travelApprovalDoc.travelRequestData.travelRequestStatus,
      approvers:travelApprovalDoc.travelRequestData.approvers,
      rejectionReasons: '',
    }

    // send approval to travel
    sendToOtherMicroservice(payload, 'approve-reject-tr', 'travel', 'travel standalone approved ')

    res.status(200).json({ message: `Approval for empId ${empId} updated to 'approved'.` });
  } catch (error) {
    if (error.message === 'Travel request not found.') {
      res.status(404).json({ error: 'Travel request not found.' });
    } else {
      console.error('An error occurred while updating approval:', error.message);
      res.status(500).json({ error: 'Failed to update approval.' });
    }
  }
};

// export const travelStandaloneApprove = (req, res) => {
//   const { tenantId, empId, travelRequestId } = req.params;

//   Approval.findOne({
//     tenantId,
//     'approvalType': 'travel',
//     'travelRequestData.isCashAdvanceTaken': false,
//     'travelRequestData.travelRequestId': travelRequestId,
//     'travelRequestData.travelRequestStatus': 'pending approval',
//     'travelRequestData.approvers': {
//       $elemMatch: {
//         'empId': empId,
//         'status': 'pending approval'
//       }
//     }
//   })
//     .then((approval) => {
//       if (!approval) {
//         throw new Error('Travel request not found.');
//       }

//       const { travelRequestData } = approval;
//       const { approvers } = travelRequestData;

//       const updatedApprovers = approvers.map((approver) => {
//         if (approver.empId === empId) {
//           return {
//             ...approver,
//             status: 'approved',
//           };
//         }
//         return approver;
//       });

//       approval.travelRequestData.approvers = updatedApprovers;

//       const allApproved = updatedApprovers.every(approver => approver.status === 'approved');

//       if (allApproved) {
//         approval.travelRequestData.travelRequestStatus = 'approved';
//       }

//       return approval.save();
//     })
//     .then(() => {
//       // `sendTravelApprovedToTravelMicroservice` is an asynchronous function
//       // sendTravelApprovedToTravelMicroservice(tenantId, empId, travelRequestId, updatedApprovers);

//       res.status(200).json({ message: `Approval for empId ${empId} updated to 'approved'.` });
//     })
//     .catch((error) => {
//       if (error.message === 'Travel request not found.') {
//         res.status(404).json({ error: 'Travel request not found.' });
//       } else {
//         console.error('An error occurred while updating approval:', error.message);
//         res.status(500).json({ error: 'Failed to update approval.' });
//       }
//     });
// };



// 


// const updateApprovalDocument = async (approval, rejectionReasons) => {
//   const { travelRequestData } = approval;
//   const { approvers } = travelRequestData;

//   // Find the matching approver by empId and update its status to 'rejected'
//   const updatedApprovers = approvers.map((approver) => {
//     if (approver.empId === empId) {
//       return {
//         ...approver,
//         status: 'rejected',
//       };
//     }
//     return approver;
//   });

//   // Update the approval document with the modified approvers array and rejection reasons
//   approval.travelRequestData.approvers = updatedApprovers;
//   approvalStatus = 'rejected',
//   approval.travelRequestData.travelRequestRejectionReason = rejectionReasons;

//   // Save the updated approval document
//   return await approval.save();
// };

// (microservice) travel request standalone- status- rejected , microservice- travel



// 4) travel request standalone - status-rejected
// export const travelStandaloneReject = async (req, res) => {
//   const { tenantId, empId, travelRequestId } = req.params;
//   const { rejectionReasons } = req.body;

//   try {
//     const approval = await Approval.findOne({
//       'tenantId': tenantId,
//       'approvalType': 'travel',
//       'travelRequestData.isCashAdvanceTaken': false,
//       'travelRequestData.travelRequestId': travelRequestId,
//       'travelRequestData.travelRequestStatus': 'pending approval',
//       'travelRequestData.approvers': {
//         $elemMatch: {
//           'empId': empId,
//           'status': 'pending approval'
//         }
//       }
//     });

//     if (!approval) {
//       throw new Error('Travel request not found.');
//     }

//     const { travelRequestData } = approval;
//     const { approvers } = travelRequestData;

//     const updatedApprovers = approvers.map((approver) => {
//       if (approver.empId === empId) {
//         return {
//           ...approver,
//           status: 'rejected',
//         };
//       }
//       return approver;
//     });

//     // Update the approval document with the modified approvers array and rejection reasons
//     approval.travelRequestData.approvers = updatedApprovers;
//     approval.travelRequestData.travelRequestRejectionReason = rejectionReasons;

//     // Update the status within the approval document
//     approval.travelRequestData.travelRequestStatus = 'rejected';

//     // Save the updated approval document
//     await approval.save();

//     // Update approval document status and rejection reasons
//     // const travelRejected = await updateApprovalDocument(approval, rejectionReasons);
    
//     //    // Send changes to the Travel Microservice
//     // await sendTravelRejectedToTravelMicroservice(tenantId, empId, travelRejected, rejectionReasons);

//     //  // Send changes to the Trip Microservice
//     // await  sendTravelRejectedToTripMicroservice(tenantId, empId, travelRejected, rejectionReasons); 


//     res.status(200).json({ 
//       message: `Approval for empId ${empId} updated to 'rejected'.`
//       // travelRejected, // Define or remove this variable from response
//     });
//   } catch (error) {
//     if (error.message === 'Travel request not found.') {
//       res.status(404).json({ error: 'Travel request not found.' });
//       logger.error('An error occurred while updating approval:', error.message);
//     } else {
//       console.error('An error occurred while updating approval:', error.message);
//       res.status(500).json({ error: 'Failed to update approval.' });
//     }
//   }
// }

export const travelStandaloneReject = async (req, res) => {
  const { tenantId, empId, travelRequestId } = req.params;
  const { rejectionReasons } = req.body;

  try {
    const travelApprovalDoc = await Approval.findOne({
      'travelRequestData.tenantId': tenantId,
      'travelRequestData.travelRequestId': travelRequestId,
      'travelRequestData.approvers': {
        $elemMatch: {
          'empId': empId,
          'status': 'pending approval'
        }
      }
    });
     console.log(travelApprovalDoc)
    if (!travelApprovalDoc) {
      throw new Error('Travel request not found.');
    }

    const { travelRequestData } = travelApprovalDoc;
    const { approvers } = travelRequestData;

    console.log(approvers , );
    const updatedApprovers = approvers.map((approver) => {
      if (approver.empId === empId) {
        return {
          ...approver,
          status: 'rejected',
        };
      }
      return approver;
    });

    // Update the travelApprovalDoc document with the modified approvers array and rejection reasons
    travelApprovalDoc.travelRequestData.approvers = updatedApprovers;
    travelApprovalDoc.travelRequestData.rejectionReason = rejectionReasons;

    // Update the status within the travelApprovalDoc document
    travelApprovalDoc.travelRequestData.travelRequestStatus = 'rejected';

    console.log(updatedApprovers , rejectionReasons);
    // Save the updated travelApprovalDoc document
    await travelApprovalDoc.save();

    // Send updated travel to the dashboard asynchronously
    await sendTravelApprovalToDashboardQueue(travelApprovalDoc)

    // Update approval document status and rejection reasons
    // const travelRejected = await updateApprovalDocument(approval, rejectionReasons);
    
    //    // Send changes to the Travel Microservice
    // await sendTravelRejectedToTravelMicroservice(tenantId, empId, travelRejected, rejectionReasons);

    //  // Send changes to the Trip Microservice
    // await  sendTravelRejectedToTripMicroservice(tenantId, empId, travelRejected, rejectionReasons); 

    const payload = {
      travelRequestId: travelApprovalDoc.travelRequestData.travelRequestId,
      travelRequestStatus: travelApprovalDoc.travelRequestData.travelRequestStatus,
      approvers:travelApprovalDoc.travelRequestData.approvers,
      rejectionReasons:  travelApprovalDoc.travelRequestData.rejectionReason,
    }

    // send approval to travel
    sendToOtherMicroservice(payload, 'approve-reject-tr', 'travel', 'travel standalone rejected ')

    console.log('After saving approval...');
    res.status(200).json({ 
      message: `Approval for empId ${empId} updated to 'rejected'.`
      // travelRejected, // Define or remove this variable from response
    });
  } catch (error) {
    console.error('An error occurred while updating approval:', error.message);
    if (error.message === 'Travel request not found.') {
      res.status(404).json({ error: 'Travel request not found.' });
      logger.error('An error occurred while updating approval:', error.message);
    } else {
      res.status(500).json({ error: 'Failed to update approval.' });
    }
  }
}

//-------------------------------------------------------------------------------

// Approval Flow for Travel Requests with cash advance - Raised Together

// 5) Get all Travel Requests with cash advance - Raised Together for an approver
export const getTravelRequestsAndCashAdvancesForApprover = async (req, res) => {
  try {
    const {tenantId, empId} = req.params;

    // Use the Mongoose model for 'Approval' to find all travel requests where the provided empId exists in the 'approvers' array within 'travelRequestData'
    const travelRequests = await Approval.find(
      {
        'tenantId': tenantId,
        'approvalType': 'travel',
        'travelRequestData.approvers.empId': empId,
        'travelRequestData.travelRequestStatus': 'pending approval',
        'travelRequestData.isCashAdvanceTaken': true,
      }     
    ).exec();

    if (travelRequests.length === 0) {
      // If no travel requests are found, respond with a 404 Not Found status and a specific message
      return res.status(404).json({ message: 'No pending travel requests found for this user.' });
    }

    // Extracted fields for travel requests and associated cash advances are added as objects in an array
    
    const extractedData = travelRequests.map((request) => {
      const extractedRequestData = {
        approvalType: request.approvalType,
        travelRequestId: request.travelRequestData?.travelRequestId,
        createdBy: request.travelRequestData?.createdBy || 'EmpName',
        travelRequestStatus: request.travelRequestData?.travelRequestStatus,
        tripPurpose: request.travelRequestData?.tripPurpose || 'tripPurpose',
        departureFrom: request.travelRequestData?.itinerary.map((item) => item.departure.from) || 'from to',
        departureTo: request.travelRequestData?.itinerary.map((item) => item.departure.to) || 'from to',
        // departureFt: request.travelRequestData?.itinerary || 'from to',
        departure: request.travelRequestData?.itinerary.map((item) => item.departure) || 'from to',
      };

      if (request.cashAdvancesData) {
        // If there is an embedded cash advance, extract its fields
        extractedRequestData.createdByCashAdvance = request.cashAdvancesData?.createdBy?.name || 'EmpName';
        extractedRequestData.tripPurposeCashAdvance = request.travelRequestData.tripPurpose || 'tripPurpose';
        extractedRequestData.cashAdvanceStatuses = request.cashAdvancesData?.cashAdvances.map((cashAdvance) => cashAdvance.cashAdvanceStatus) || ['CashAdvanceStatus'];
        extractedRequestData.itineraryCitiesCashAdvance = request.travelRequestData?.itinerary.map((item) => item.departure.from) || 'Missing';
        extractedRequestData.amountDetailsCashAdvance = request.cashAdvancesData?.amountDetails || 'Cash';
        extractedRequestData.cashAdvanceViolations = request.cashAdvancesData?.cashAdvanceViolations || 'Violations';
      }

      return extractedRequestData;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              Q
    });

    // If travel requests are found, respond with a 200 OK status and the array of extracted fields
    return res.status(200).json(extractedData);
  } catch (error) {
    // Handle and log errors
    console.error('An error occurred:', error);
    // Respond with a 500 Internal Server Error status and an error message
    return res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};

// 6) travel request with cash advance -- Details
export const getTravelWithCashDetails = async (req, res) => {
  try {
    const { tenantId, empId, travelRequestId } = req.params;

    // Use the Mongoose model for 'Approval' to find a single travel request with the provided travelRequestId and relevant conditions
    const travelRequest = await Approval.findOne({
      'tenantId': tenantId,
      'approvalType': 'travel',
      'travelRequestData.travelRequestId': travelRequestId,
      'travelRequestData.isCashAdvanceTaken': true,
      'travelRequestData.approvers.empId': empId,
      'travelRequestData.travelRequestStatus': 'pending approval',
    }).exec();

    if (!travelRequest) {
      // If no matching travel request is found, respond with a 404 Not Found status and a specific message
      return res.status(404).json({ message: 'No matching pending travel request found for this user.' });
    }

    // Extracted fields for the single travel request and its associated cash advance
    const extractedRequestData = {
      approvalType: travelRequest.approvalType,
      travelRequestId: travelRequest.travelRequestData?.travelRequestId,
      createdBy: travelRequest.travelRequestData?.createdBy || 'EmpName',
      travelRequestStatus: travelRequest.travelRequestData?.travelRequestStatus,
      tripPurpose: travelRequest.travelRequestData?.tripPurpose || 'tripPurpose',
      itinerary:travelRequest.travelRequestData?.itinerary || 'itinerary',
      // departureFrom: travelRequest.travelRequestData?.itinerary.map((item) => item.departure.from) || 'from to',
      // departureTo: travelRequest.travelRequestData?.itinerary.map((item) => item.departure.to) || 'from to',
      // departure: travelRequest.travelRequestData?.itinerary.map((item) => item.departure) || 'from to',
    };

    if (travelRequest.cashAdvancesData) {
      // If there is an embedded cash advance, extract its fields
      extractedRequestData.createdByCashAdvance = travelRequest.cashAdvancesData?.createdBy?.name || 'EmpName';
      extractedRequestData.tripPurposeCashAdvance = travelRequest.travelRequestData.tripPurpose || 'tripPurpose';
      extractedRequestData.cashAdvanceStatuses = travelRequest.cashAdvancesData?.cashAdvances.map((cashAdvance) => cashAdvance.cashAdvanceStatus) || ['CashAdvanceStatus'];
      extractedRequestData.itineraryCitiesCashAdvance = travelRequest.travelRequestData?.itinerary.map((item) => item.departure.from) || 'Missing';
      extractedRequestData.amountDetailsCashAdvance = travelRequest.cashAdvancesData?.amountDetails || 'Cash';
      extractedRequestData.cashAdvanceViolations = travelRequest.cashAdvancesData?.cashAdvanceViolations || 'Violations';
    }

    // Respond with a 200 OK status and the extracted fields for the single travel request
    return res.status(200).json(extractedRequestData);
  } catch (error) {
    // Handle and log errors
    console.error('An error occurred:', error);
    // Respond with a 500 Internal Server Error status and an error message
    return res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};

// 7) travel with cash advance -- Approve Travel Request
export const travelWithCashApproveTravelRequest = async (req, res) => {
  try {
    const { tenantId, empId, travelRequestId } = req.params;

    const cashApprovalDoc = await Approval.findOne({
      tenantId,
      'approvalType': 'travel',
      'travelRequestData.isCashAdvanceTaken': true,
      'travelRequestData.travelRequestId': travelRequestId,
      'travelRequestData.travelRequestStatus': 'pending approval',
      'travelRequestData.approvers': {
        $elemMatch: {
          'empId': empId,
          'status': 'pending approval'
        }
      }
    });

    if (!cashApprovalDoc) {
      throw new Error('Travel request not found.');
    }

    const { travelRequestData } = cashApprovalDoc;
    const { approvers } = travelRequestData;

    const updatedApprovers = approvers.map((approver) => {
      if (approver.empId === empId) {
        return {
          ...approver,
          status: 'approved',
        };
      }
      return approver;
    });

    cashApprovalDoc.travelRequestData.approvers = updatedApprovers;

    const allApproved = updatedApprovers.every(approver => approver.status === 'approved');

    if (allApproved) {
      cashApprovalDoc.travelRequestData.travelRequestStatus = 'approved';
    }

    await cashApprovalDoc.save();

    //Sending to dashboard via rabbitmq
    await sendCashApprovalToDashboardQueue(cashApprovalDoc);

    // // Send changes to the Travel Microservice and the Trip Microservice
    // await Promise.all([
    //   updatedApproveTwcApproveTravelToTravelMicroservice(tenantId, empId, UpdatedApproveTwcApproveTravel),
    //   updatedApproveTwcApproveTravelToTripMicroservice(tenantId, empId, UpdatedApproveTwcApproveTravel),
    // ]);

    const payload = {
      travelRequestId: cashApprovalDoc.travelRequestData.travelRequestId,
      travelRequestStatus: cashApprovalDoc.travelRequestData.travelRequestStatus,
      approvers:cashApprovalDoc.travelRequestData.approvers,
      rejectionReasons:  '',
    }

    // send approval to Cash
    sendToOtherMicroservice(payload, 'approve-reject-tr', 'cash', 'To update travelRequestStatus to approved in cash microservice')


    res.status(200).json({ message: `Approval for empId ${empId} updated to 'approved'.` });
  } catch (error) {
    if (error.message === 'Travel request not found.') {
      res.status(404).json({ error: 'Travel request not found.' });
    } else {
      console.error('An error occurred while updating approval:', error.message);
      res.status(500).json({ error: 'Failed to update approval.' });
    }
  }
};


// 8) travel with cash advance -- Reject Travel Request (IF Travel request is rejected then status of cash advance is updated to draft)
export const travelWithCashRejectTravelRequest = async (req, res) => {
  const { tenantId, empId, travelRequestId } = req.params;
  const { rejectionReasons } = req.body;

  try {
    const cashApprovalDoc = await Approval.findOne({
      'approvalType': 'travel',
      'travelRequestData.isCashAdvanceTaken': true,
      'travelRequestData.travelRequestId': travelRequestId,
      'travelRequestData.travelRequestStatus': 'pending approval',
      'travelRequestData.tenantId': tenantId,
      'travelRequestData.approvers': {
        $elemMatch: {
          'empId': empId,
          'status': 'pending approval'
        }
      }
    });
     console.log(cashApprovalDoc)
    if (!cashApprovalDoc) {
      throw new Error('Travel request not found.');
    }

    const { travelRequestData } = cashApprovalDoc;
    const { approvers } = travelRequestData;

    console.log(approvers , );
    const updatedApprovers = approvers.map((approver) => {
      if (approver.empId === empId) {
        return {
          ...approver,
          status: 'rejected',
        };
      }
      return approver;
    });

    // Update the cashApprovalDoc document with the approvers array and rejection reasons
    cashApprovalDoc.travelRequestData.approvers = updatedApprovers;
    cashApprovalDoc.travelRequestData.rejectionReason = rejectionReasons;

    // Update the status within the cashApprovalDoc document
    cashApprovalDoc.travelRequestData.travelRequestStatus = 'rejected';
    cashApprovalDoc.cashAdvancesData.cashAdvances = cashApprovalDoc.cashAdvancesData.cashAdvances.map(cashAdvance => ({
    ...cashAdvance,
    cashAdvanceStatus: 'draft'
    }));


    console.log(updatedApprovers , rejectionReasons);
    // Save the updated cashApprovalDoc document
     await cashApprovalDoc.save();

      //Sending to dashboard via rabbitmq
      await sendCashApprovalToDashboardQueue(cashApprovalDoc);

    const payload = {
      travelRequestId: cashApprovalDoc.travelRequestData.travelRequestId,
      travelRequestStatus: cashApprovalDoc.travelRequestData.travelRequestStatus,
      approvers:cashApprovalDoc.travelRequestData.approvers,
      rejectionReasons: cashApprovalDoc.travelRequestData.rejectionReason,
    }

    // send Rejected Travel request to Cash microservice
    sendToOtherMicroservice(payload, 'approve-reject-tr', 'cash', 'To update travelRequestStatus to rejected in cash microservice')

    res.status(200).json({ message: `Travel request is rejected then status of cash advance is updated to draft` });
  } catch (error) {
    if (error.message === 'Travel request not found.') {
      res.status(404).json({ error: 'Travel request not found.' });
    } else {
      console.error('An error occurred while updating approval:', error.message);
      res.status(500).json({ error: 'Failed to update approval.' });
    }
  }
};


// 9) travel with cash advance -- Approve cash advance 
  export const travelWithCashApproveCashAdvance = async (req, res) => {
    const { tenantId, empId, travelRequestId, cashAdvanceId } = req.params;
  
    try {
      const cashApprovalDoc = await Approval.findOne({
        'approvalType': 'travel',
        'travelRequestData.isCashAdvanceTaken': true,
        'travelRequestData.travelRequestId': travelRequestId,
        'travelRequestData.tenantId': tenantId,
        'travelRequestData.approvers': {
          $elemMatch: {
            'empId': empId,
            'status': 'approved'
          }
        }
      });
  
      if (!cashApprovalDoc) {
        throw new Error('Travel request not found.');
      }
  
      const { cashAdvancesData } = cashApprovalDoc;
      const { cashAdvances } = cashAdvancesData;
  
      cashAdvances.forEach(cashAdvance => {
        cashAdvance.approvers.forEach(approver => {
          if (approver.empId === empId) {
            approver.status = 'approved';
          }
        });
  
        const allApproved = cashAdvance.approvers.every(approver => approver.status === 'approved');
  
        if (allApproved) {
          cashAdvance.cashAdvanceStatus = 'approved';
        }
      });
  
      // Save the updated cashApprovalDoc document
      await cashApprovalDoc.save();

      //Sending to dashboard via rabbitmq
      await sendCashApprovalToDashboardQueue(cashApprovalDoc);

    const payload = {
      travelRequestId: cashApprovalDoc.travelRequestData.travelRequestId,
      cashAdvanceId: cashAdvanceId,
      cashAdvanceStatus: cashAdvances.filter(ca=>ca.cashAdvanceId = cashAdvanceId)[0]?.cashAdvanceStatus,
      approvers: cashAdvances.filter(ca=>ca.cashAdvanceId = cashAdvanceId)[0]?.approvers,
      rejectionReason: '',
    }

    // send Approved cashAdvance to Cash microservice
    sendToOtherMicroservice(payload, 'approve-reject-ca', 'cash', 'To update cashAdvanceStatus to approved in cash microservice')


    res.status(200).json({ message: `travel with cash advance -- cash advance:'approved' ` });
  } catch (error) {
    if (error.message === 'Travel request not found.') {
      res.status(404).json({ error: 'Travel request not found.' });
    } else {
      console.error('An error occurred while updating approval:', error.message);
      res.status(500).json({ error: 'Failed to update approval.' });
    }
  }
};



// 10) travel with cash advance -- Reject cash advance 
export const travelWithCashRejectCashAdvance = async (req, res) => {
  const { tenantId, empId, travelRequestId } = req.params;
  const { cashAdvanceId, rejectionReasons } = req.body; 

  try {
    const cashApprovalDoc = await Approval.findOne({
      'approvalType': 'travel',
      'travelRequestData.isCashAdvanceTaken': true,
      'travelRequestData.travelRequestId': travelRequestId,
      'travelRequestData.tenantId': tenantId,
      'travelRequestData.approvers': {
        $elemMatch: {
          'empId': empId,
          'status': 'approved'
        }
      }
    });

    if (!cashApprovalDoc) {
      throw new Error('Travel request not found.');
    }

    const { cashAdvancesData } = cashApprovalDoc;
    const { cashAdvances } = cashAdvancesData;

    cashAdvances.forEach(cashAdvance => {
      cashAdvance.approvers.forEach(approver => {
        if (approver.empId === empId) {
          approver.status = 'rejected';
        }
      });
      cashAdvance.cashAdvanceStatus = 'rejected'; 
      cashAdvance.cashAdvanceRejectionReason = rejectionReasons; // Update rejection reason
    });

    // Save the updated cashApprovalDoc document
    await cashApprovalDoc.save();

    //Sending to dashboard via rabbitmq
    await sendCashApprovalToDashboardQueue(cashApprovalDoc);

    const payload = {
      travelRequestId: cashApprovalDoc.travelRequestData.travelRequestId,
      cashAdvanceId: cashAdvanceId,
      cashAdvanceStatus: cashAdvances.filter(ca=>ca.cashAdvanceId = cashAdvanceId)[0]?.cashAdvanceStatus,
      approvers: cashAdvances.filter(ca=>ca.cashAdvanceId = cashAdvanceId)[0]?.approvers,
      rejectionReason:cashAdvances.filter(ca=>ca.cashAdvanceId = cashAdvanceId)[0]?.rejectionReason,
    }

    // send Rejected cash advance to Cash microservice
    sendToOtherMicroservice(payload, 'approve-reject-ca', 'cash', 'To update cashAdvanceStatus to rejected in cash microservice')

    res.status(200).json({ message: `Travel with cash advance - cash advance: 'rejected'` });
  } catch (error) {
    if (error.message === 'Travel request not found.') {
      res.status(404).json({ error: 'Travel request not found.' });
    } else {
      console.error('An error occurred while updating approval:', error.message);
      res.status(500).json({ error: 'Failed to update approval.' });
    }
  } 
};


// 11) Get add a leg all 'booked' Travel Requests with cash advance -- !! important - isAddALeg : true
export const getAddALegTravelRequestsForApprover = async (req, res) => {
  try {
    const {tenantId, empId} = req.params;

    // Use the Mongoose model for 'Approval' to find all travel requests where the provided empId exists in the 'approvers' array within 'travelRequestData'
    const travelRequests = await Approval.find(
      {
        'tenantId': tenantId,
        'approvalType': 'travel',
        'travelRequestData.approvers.empId': empId,
        'travelRequestData.isAddALeg': true,
        'travelRequestData.travelRequestStatus': 'booked',
        'travelRequestData.isCashAdvanceTaken': true,
      }     
    ).exec();

    if (travelRequests.length === 0) {
      // If no travel requests are found, respond with a 404 Not Found status and a specific message
      return res.status(404).json({ message: 'No pending travel requests found for this user.' });
    }

    // Extracted fields for travel requests and associated cash advances are added as objects in an array 
    const extractedData = travelRequests.map((request) => {
      const extractedRequestData = {
        approvalType: request.approvalType,
        travelRequestId: request.travelRequestData?.travelRequestId,
        createdBy: request.travelRequestData?.createdBy || 'EmpName',
        travelRequestStatus: request.travelRequestData?.travelRequestStatus,
        tripPurpose: request.travelRequestData?.tripPurpose || 'tripPurpose',
        // departureFrom: request.travelRequestData?.itinerary.map((item) => item.departure.from) || 'from to',
        // departureTo: request.travelRequestData?.itinerary.map((item) => item.departure.to) || 'from to',
        // departureFt: request.travelRequestData?.itinerary || 'from to',
        departure: request.travelRequestData?.itinerary.map((item) => item.departure) || 'from to',
      };

      if (request.cashAdvancesData) {
        // If there is an embedded cash advance, extract its fields
        extractedRequestData.createdByCashAdvance = request.cashAdvancesData?.createdBy?.name || 'EmpName';
        extractedRequestData.tripPurposeCashAdvance = request.travelRequestData.tripPurpose || 'tripPurpose';
        extractedRequestData.cashAdvanceStatuses = request.cashAdvancesData?.cashAdvances.map((cashAdvance) => cashAdvance.cashAdvanceStatus) || ['CashAdvanceStatus'];
        extractedRequestData.amountDetailsCashAdvance = request.cashAdvancesData?.amountDetails || 'Cash';
        extractedRequestData.cashAdvanceViolations = request.cashAdvancesData?.cashAdvanceViolations || 'Violations';
      }

      return extractedRequestData;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              Q
    });

    // If travel requests are found, respond with a 200 OK status and the array of extracted fields
    return res.status(200).json(extractedData);
  } catch (error) {
    // Handle and log errors
    console.error('An error occurred:', error);
    // Respond with a 500 Internal Server Error status and an error message
    return res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};


// 12) add a leg -  travel request with/without cash advance -- Details
// !! Important -- checking isAddALeg flag is very imporatant and after the action updating it too is important.
export const getTravelWithCashDetailsForAddALeg = async (req, res) => {
  try {
    const { tenantId, empId, travelRequestId } = req.params;

    // Use the Mongoose model for 'Approval' to find a single travel request with the provided travelRequestId and relevant conditions
    const travelRequest = await Approval.findOne({
      'tenantId': tenantId,
      'approvalType': 'travel',
      'travelRequestData.travelRequestId': travelRequestId,
      'travelRequestData.isAddALeg': true,
      'travelRequestData.approvers.empId': empId,
      'travelRequestData.travelRequestStatus': 'booked',
    }).exec();

    if (!travelRequest) {
      // If no matching travel request is found, respond with a 404 Not Found status and a specific message
      return res.status(404).json({ message: 'No matching pending Add a leg ,travel request found for this user.' });
    }

    // Extracted fields for the single travel request and its associated cash advance
    const extractedRequestData = {
      approvalType: travelRequest.approvalType,
      travelRequestId: travelRequest.travelRequestData?.travelRequestId,
      createdBy: travelRequest.travelRequestData?.createdBy || 'EmpName',
      travelRequestStatus: travelRequest.travelRequestData?.travelRequestStatus,
      tripPurpose: travelRequest.travelRequestData?.tripPurpose || 'tripPurpose',
      itinerary: travelRequest.travelRequestData?.itinerary || 'from to',
      // departureTo: travelRequest.travelRequestData?.itinerary.map((item) => item.departure.to) || 'from to',
      // departure: travelRequest.travelRequestData?.itinerary.map((item) => item.departure) || 'from to',
    };

    if (travelRequest.cashAdvancesData) {
      // If there is an embedded cash advance, extract its fields
      extractedRequestData.tripPurposeCashAdvance = travelRequest.travelRequestData.tripPurpose || 'tripPurpose';
      // extractedRequestData.cashAdvanceStatuses = travelRequest.cashAdvancesData?.cashAdvances.map((cashAdvance) => cashAdvance.cashAdvanceStatus) || ['CashAdvanceStatus'];
      extractedRequestData.amountDetailsCashAdvance = travelRequest.cashAdvancesData?.cashAdvances[0]?.amountDetails || 'Cash';
      extractedRequestData.cashAdvanceViolations = travelRequest.cashAdvancesData?.cashAdvanceViolations || 'Violations';
    }

    // Respond with a 200 OK status and the extracted fields for the single travel request
    return res.status(200).json(extractedRequestData);
  } catch (error) {
    // Handle and log errors
    console.error('An error occurred:', error);
    // Respond with a 500 Internal Server Error status and an error message
    return res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};


// // 13) travel with cash advance -- Approve Travel Request
// export const ApproveAddALeg = async (req, res) => {
//   try {
//     const { tenantId, empId, travelRequestId } = req.params;

//     const approval = await Approval.findOne({
//       tenantId,
//       'approvalType': 'travel',
//       'travelRequestData.travelRequestId': travelRequestId,
//       'travelRequestData.isAddALeg': true,
//       'travelRequestData.travelRequestStatus': 'booked',
//       'travelRequestData.approvers': {
//         $elemMatch: {
//           'empId': empId,
//           'status': 'pending approval'
//         }
//       }
//     });

//     if (!approval) {
//       throw new Error('Travel request not found.');
//     }

//     const { travelRequestData } = approval;
//     const { approvers } = travelRequestData;

//     const updatedApprovers = approvers.map((approver) => {
//       if (approver.empId === empId) {
//         return {
//           ...approver,
//           status: 'approved',
//         };
//       }
//       return approver;
//     });

//     approval.travelRequestData.approvers = updatedApprovers;

//     const allApproved = updatedApprovers.every(approver => approver.status === 'approved');

//     //it is Mandatory to change the isAddALeg to false 
//     //(when new add a leg is added from dashboard add a leg changes to true). Maintain flag
//     if (allApproved) {
//       approval.travelRequestData.isAddALeg = false;
//     }

//     await approval.save();

//     res.status(200).json({ message: `Approval for empId ${empId} updated to 'approved'.` });
//   } catch (error) {
//     if (error.message === 'Travel request not found.') {
//       res.status(404).json({ error: 'Travel request not found.' });
//     } else {
//       console.error('An error occurred while updating approval:', error.message);
//       res.status(500).json({ error: 'Failed to update approval.' });
//     }
//   }
// };

// // 13) travel with cash advance -- Approve Travel Request
// !! Important -- checking isAddALeg flag is very imporatant and after the action updating it too is important.
export const ApproveAddALeg = async (req, res) => {
  try {
    const { tenantId, empId, travelRequestId } = req.params;

    const approval = await Approval.findOne({
      tenantId,
      'approvalType': 'travel',
      'travelRequestData.travelRequestId': travelRequestId,
      'travelRequestData.isAddALeg': true,
      'travelRequestData.travelRequestStatus': 'booked',
      'travelRequestData.approvers': {
        $elemMatch: {
          'empId': empId,
          'status': 'pending approval'
        }
      }
    });

    if (!approval) {
      return res.status(404).json({ error:'Travel request not found for approval:ApproveAddALeg'});
    }

    const { travelRequestData } = approval;
    const { approvers } = travelRequestData;

    const changesMade = [];

    const updatedApprovers = approvers.map((approver) => {
      if (approver.empId === empId && approver.status === 'pending approval') {
        changesMade.push({
          empId: empId,
          status: 'approved',
        });

        return {
          ...approver,
          status: 'approved',
        };
      }
      return approver;
    });

    approval.travelRequestData.approvers = updatedApprovers;

    const allApproved = updatedApprovers.every(approver => approver.status === 'approved');

    // It is Mandatory to change the isAddALeg to false 
    // (when new add a leg is added from the dashboard add a leg changes to true). Maintain flag
    if (allApproved) {
      // Update the approval document with isAddALeg set to false
      approval.travelRequestData.isAddALeg = false;
      changesMade.push({
        field: 'isAddALeg',
        oldValue: true,
        newValue: false,
      });
    }

    await approval.save();

    // Send changes to Trip microservice asynchronously
    await approveAddALegToTrip(changesMade);

    // Send changes to expense microservice asynchronously
    await approveAddALegToExpense(changesMade);

   // Check if cash advance was taken 

   // Send changes to the Travel Microservice and the Trip Microservice
   // Send Changes to dashboard via rabbitmq 
  //  if (approval.travelRequestData.isCashAdvanceTaken){
  //   console.log('Is cash advance taken:', approval.travelRequestData.isCashAdvanceTaken);
  //   await sendCashApprovalToDashboardQueue(cashApprovalDoc);
  //   await ApproveAddALegToCash(changesMade);
  //  } else{
  //   await sendTravelApprovalToDashboardQueue(travelApprovalDoc);
  //   await approveAddALegToTravel(changesMade);
  //  }


   const payload = {
    travelRequestId: cashApprovalDoc.travelRequestData.travelRequestId,
    status,
    itineraryId: itineraryId,
    approvers: itinerary.filter(ca=>ca.cashAdvanceId = cashAdvanceId)[0]?.approvers,
    rejectionReason: '',
  }

  // send Rejected Travel request to Cash microservice
  sendToOtherMicroservice(payload, 'approve-reject-ca', 'cash', 'To update travelRequestStatus to rejected in cash microservice')

    res.status(200).json({ message: `Approval for empId ${empId} updated to 'approved'.`, changesMade });
  } catch (error) {
    if (error.message === 'Travel request not found.') {
      res.status(404).json({ error: 'Travel request not found.' });
    } else {
      console.error('An error occurred while updating approval:', error.message);
      res.status(500).json({ error: 'Failed to update approval.' });
    }
  }
};

// Reject add a leg with rejection reasons - travel status is booked -
// !! Important -- checking isAddALeg flag is very imporatant and after the action updating it too is important.
export const rejectAddALeg = async (req, res) => {
  try {
    const { tenantId, empId, travelRequestId } = req.params;
    const { rejectionReasons } = req.body;

    // Input validation
    validateInput({ tenantId, empId, travelRequestId, rejectionReasons });

    const approval = await Approval.findOne({
      tenantId,
      approvalType: 'travel',
      'travelRequestData.travelRequestId': travelRequestId,
      'travelRequestData.isAddALeg': true,
      'travelRequestData.travelRequestStatus': 'booked',
      'travelRequestData.approvers': {
        $elemMatch: {
          empId: empId,
          status: 'pending approval',
        },
      },
    });

    if (!approval) {
      return res.status(404).json({ error: 'Travel request not found.' });
    }

    const { travelRequestData } = approval;
    const { approvers } = travelRequestData;

    const changesMade = [];

    const updatedApprovers = approvers.map((approver) => {
      if (approver.empId === empId) {
        changesMade.push({
          empId: empId,
          status: 'rejected',
        });

        return {
          ...approver,
          status: 'rejected',
        };
      }
      return approver;
    });

    // Update the approval document with the modified approvers array and rejection reasons
    approval.travelRequestData.approvers = updatedApprovers;
    // approval.travelRequestData.travelRequestRejectionReason = rejectionReasons;
    approval.travelRequestData.travelRequestStatus = 'rejected';
    
    if (rejectionReasons) {
      changesMade.push({
        field: 'travelRequestRejectionReason',
        oldValue: approval.travelRequestData.travelRequestRejectionReason,
        newValue: rejectionReasons,
      });
      approval.travelRequestData.travelRequestRejectionReason = rejectionReasons;
    }

    // Save the updated approval document
    await approval.save();

     // Send changes to Trip microservice asynchronously
     await rejectAddALegToTrip(changesMade);

     // Send changes to expense microservice asynchronously
     await rejectAddALegToExpense(changesMade);
 

     // action = 'approve-reject-add-leg'
     // Check if cash advance was taken 
   const travelApprovalDoc = {...approval};
   const cashApprovalDoc = {...approval};

   // Send changes to the Travel Microservice and the Trip Microservice
   // Send Changes to dashboard via rabbitmq ,Check if cash advance was taken 
    if (approval.travelRequestData.isCashAdvanceTaken) {
    console.log('Is cash advance taken:', approval.travelRequestData.isCashAdvanceTaken);
    await sendCashApprovalToDashboardQueue(cashApprovalDoc);
    await rejectAddALegToCash(changesMade);
    } else {
      await sendTravelApprovalToDashboardQueue(travelApprovalDoc);
     await rejectAddALegToTravel(changesMade);
    }
    // Log the changes made
    // console.log('Changes made:', changesMade);

    res.status(200).json({ 
      message: `Approval for empId ${empId} updated to 'rejected'.`,
      data: {
        approval: approval,
        changesMade: changesMade,
      },
    });
  } catch (error) {
    handleDatabaseError(error);
    if (error.message === 'Travel request not found.') {
      res.status(404).json({ error: 'Travel request not found.' });
      console.error('An error occurred while updating approval:', error.message);
    } else {
      res.status(500).json({ error: 'Failed to update approval.' });
      console.error('An error occurred while updating approval:', error.message);
    }
  }
};

// 14) get travelRequestDetails for all usecases
export const getTravelRequestDetailsForApprover = async (req, res) => {
  try {
    const { tenantId, empId, travelRequestId } = req.params;

    const travelRequest = await Approval.findOne({
      'tenantId': tenantId,
      'approvalType': 'travel',
      'travelRequestData.travelRequestId': travelRequestId,
      'travelRequestData.approvers.empId': empId,
    }).exec();

    if (!travelRequest) {
      // If no matching travel request is found, respond with a 404 Not Found status and a specific message
      return res.status(404).json({ message: 'No matching pending Add a leg ,travel request found for this user.' });
    }

    // Extracted fields for the single travel request and its associated cash advance
    const extractedRequestData = {
      approvalType: travelRequest.approvalType,
      travelRequestId: travelRequest.travelRequestData?.travelRequestId,
      createdBy: travelRequest.travelRequestData?.createdBy || 'EmpName',
      travelRequestStatus: travelRequest.travelRequestData?.travelRequestStatus,
      tripPurpose: travelRequest.travelRequestData?.tripPurpose || 'tripPurpose',
      itinerary: travelRequest.travelRequestData?.itinerary || 'from to',
    };

    const hasCashAdvancesData = travelRequest?.cashAdvancesData;

    if (hasCashAdvancesData) {
      // If there is an embedded cash advance, extract its fields
      extractedRequestData.tripPurposeCashAdvance = travelRequest.travelRequestData.tripPurpose || 'tripPurpose';
      extractedRequestData.cashAdvance = travelRequest.cashAdvancesData?.cashAdvances|| ['CashAdvance'];
      extractedRequestData.amountDetailsCashAdvance = travelRequest.cashAdvancesData?.cashAdvances[0]?.amountDetails || 'Cash';
      extractedRequestData.cashAdvanceViolations = travelRequest.cashAdvancesData?.cashAdvanceViolations || 'Violations';
    }

    // Respond with a 200 OK status and the extracted fields for the single travel request
    return res.status(200).json(extractedRequestData);
  } catch (error) {
    // Handle and log errors
    console.error('An error occurred:', error);
    // Respond with a 500 Internal Server Error status and an error message
    return res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};