import axios from 'axios';
import { Approval } from '../models/approvalSchema.js';
import pino from 'pino';

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
      'embeddedTravelRequest.approvers.empId': empId,
      'embeddedTravelRequest.travelRequestStatus': 'pending approval',
      'embeddedTravelRequest.isCashAdvanceTaken': false,
    }).exec();

    if (travelRequests.length === 0) {
      // If no pending travel requests without cash advance are found, respond with a 404 Not Found status and a specific message
      return res.status(404).json({ message: 'No pending travel requests without cash advances found for this user.' });
    }

    const extractedData = travelRequests.map((request) => {
      const extractedRequestData = {
        approvalType: request.approvalType,
        travelRequestId: request.embeddedTravelRequest?.travelRequestId,
        createdBy: request.embeddedTravelRequest?.createdBy || 'EmpName',
        travelRequestStatus: request.embeddedTravelRequest?.travelRequestStatus,
        tripPurpose: request.embeddedTravelRequest?.tripPurpose || 'tripPurpose',
        departureFrom: request.embeddedTravelRequest?.itinerary.map((item) => item.departure.from) || 'from to',
        departureTo: request.embeddedTravelRequest?.itinerary.map((item) => item.departure.to) || 'from to',
        departure: request.embeddedTravelRequest?.itinerary.map((item) => item.departure) || 'from to',
      };

      if (request.embeddedCashAdvance) {
        // If there is an embedded cash advance, extract its fields
        extractedRequestData.createdByCashAdvance = request.embeddedCashAdvance?.createdBy?.name || 'EmpName';
        extractedRequestData.tripPurposeCashAdvance = request.embeddedTravelRequest.tripPurpose || 'tripPurpose';
        extractedRequestData.cashAdvanceStatuses = request.embeddedCashAdvance?.cashAdvances.map((cashAdvance) => cashAdvance.cashAdvanceStatus) || ['CashAdvanceStatus'];
        extractedRequestData.itineraryCitiesCashAdvance = request.embeddedTravelRequest?.itinerary.map((item) => item.departure.from) || 'Missing';
        extractedRequestData.amountDetailsCashAdvance = request.embeddedCashAdvance?.amountDetails || 'Cash';
        extractedRequestData.cashAdvanceViolations = request.embeddedCashAdvance?.cashAdvanceViolations || 'Violations';
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
//       'embeddedTravelRequest.travelRequestId': travelRequestId,
//       'embeddedTravelRequest.approvers.empId': empId,
//     });

//     if (!approval) {
//       // If the travel request doesn't exist, return a 404 Not Found response
//       return res.status(404).json({ error: 'Travel request not found.' });
//     }

//     const { embeddedTravelRequest: travelRequest } = approval;

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
    'embeddedTravelRequest.travelRequestId': travelRequestId,
    'embeddedTravelRequest.approvers.empId': empId,
  };

  // Fetch travel request details by travelRequestId
  Approval.findOne(travelApproveDoc)
    .then((approval) => {
      if (!approval) {
        // If the travel request doesn't exist, return a 404 Not Found response
        return res.status(404).json({ error: 'Travel request not found.' });
      }

      const { embeddedTravelRequest: travelRequest } = approval;

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


// (microservice) travel request standalone - status-approved, microservice-travel
const sendTravelApprovedToTravelMicroservice = async (tenantId, empId, travelRequestId, updatedApprovers) => {
  try {
    const travelMicroserviceUrl = process.env.TRAVEL_MICROSERVICE_URL;

    // Find the index of the matched empId in the updatedApprovers array
    const matchedIndex = updatedApprovers.findIndex(approver => approver.empId === empId);

    if (matchedIndex !== -1) {
      updatedApprovers[matchedIndex].status = 'approved'; 
    }

    // Prepare the data to be sent to the Travel Microservice
    const formattedData = {
      tenantId,
      travelRequestId,
      approvers: updatedApprovers, 
    };

    // Make an API call to the Travel Microservice with the formatted data
    await axios.post(`${travelMicroserviceUrl}/ts-approved`, formattedData, { retry: 5, retryInterval: 3000 });
  } catch (error) {
    logger.error('Error sending changes to Travel Microservice: standalone travel request - status-approved failed', error.message);
    throw error;
  }
};


// 3) travel request standalone -status-Approved 
export const travelStandaloneApprove = async (req, res) => {
  try {
    const { tenantId, empId, travelRequestId } = req.params;

    const approval = await Approval.findOne({
      tenantId,
      'approvalType': 'travel',
      'embeddedTravelRequest.isCashAdvanceTaken': false,
      'embeddedTravelRequest.travelRequestId': travelRequestId,
      'embeddedTravelRequest.travelRequestStatus': 'pending approval',
      'embeddedTravelRequest.approvers': {
        $elemMatch: {
          'empId': empId,
          'status': 'pending approval'
        }
      }
    });

    if (!approval) {
      throw new Error('Travel request not found.');
    }

    const { embeddedTravelRequest } = approval;
    const { approvers } = embeddedTravelRequest;

    const updatedApprovers = approvers.map((approver) => {
      if (approver.empId === empId) {
        return {
          ...approver,
          status: 'approved',
        };
      }
      return approver;
    });

    approval.embeddedTravelRequest.approvers = updatedApprovers;

    const allApproved = updatedApprovers.every(approver => approver.status === 'approved');

    if (allApproved) {
      approval.embeddedTravelRequest.travelRequestStatus = 'approved';
    }

    await approval.save();

    // `sendTravelApprovedToTravelMicroservice` is an asynchronous function
    // await sendTravelApprovedToTravelMicroservice(tenantId, empId, travelRequestId, updatedApprovers);

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
//     'embeddedTravelRequest.isCashAdvanceTaken': false,
//     'embeddedTravelRequest.travelRequestId': travelRequestId,
//     'embeddedTravelRequest.travelRequestStatus': 'pending approval',
//     'embeddedTravelRequest.approvers': {
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

//       const { embeddedTravelRequest } = approval;
//       const { approvers } = embeddedTravelRequest;

//       const updatedApprovers = approvers.map((approver) => {
//         if (approver.empId === empId) {
//           return {
//             ...approver,
//             status: 'approved',
//           };
//         }
//         return approver;
//       });

//       approval.embeddedTravelRequest.approvers = updatedApprovers;

//       const allApproved = updatedApprovers.every(approver => approver.status === 'approved');

//       if (allApproved) {
//         approval.embeddedTravelRequest.travelRequestStatus = 'approved';
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
//   const { embeddedTravelRequest } = approval;
//   const { approvers } = embeddedTravelRequest;

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
//   approval.embeddedTravelRequest.approvers = updatedApprovers;
//   approvalStatus = 'rejected',
//   approval.embeddedTravelRequest.travelRequestRejectionReason = rejectionReasons;

//   // Save the updated approval document
//   return await approval.save();
// };

// (microservice) travel request standalone- status- rejected , microservice- travel

const sendTravelRejectedToTravelMicroservice = async (tenantId, empId, travelRequestId, travelRejected, rejectionReasons) => {
  try {
    const travelMicroserviceUrl = process.env.TRAVEL_MICROSERVICE_URL;
    const travelRejected = {
        tenantId,
        'embeddedTravelRequest.travelRequestId': approval.travelRequestId ,
        'embeddedTravelRequest.approvers.empId': approval.empId,
        'embeddedTravelRequest.approvers.status': 'rejected',
        'embeddedTravelRequest.travelRequestRejectionReason': approval.rejectionReasons,
        approvalStatus : 'rejected',
    }

    // Make an API call to the Travel Microservice with the updated data
    await axios.post(`${travelMicroserviceUrl}/ts-rejected`, 
    travelRejected, { retry : 5, retryInterval: 3000});
  } catch (error) {
    logger.error('Error sending changes to Travel Microservice:', error.message);
    throw error;
  }
};

// (microservice) travel request standalone- status- rejected, microservice- trip
const sendTravelRejectedToTripMicroservice = async (tenantId, empId, travelRequestId, travelRejected, rejectionReasons) => {
  try {
    const tripMicroserviceUrl = process.env.TRIP_MICROSERVICE_URL;
    
    const travelRejected = {
      tenantId: tenantId,
      'embeddedTravelRequest.approvers.empId': empId,
      'embeddedTravelRequest.travelRequestId': travelRequestId,
      'embeddedTravelRequest.approvers.status': 'rejected',
      'embeddedTravelRequest.travelRequestRejectionReason': rejectionReasons,
      approvalStatus :'rejected',

    }

    // Make an API call to the Trip Microservice with the rejection reasons
    await axios.post(`${tripMicroserviceUrl}/ts-rejected`,
     travelRejected , { retry: 5, retryInterval: 3000 });
  } catch (error) {
    logger.error('Error sending changes to Trip Microservice:', error.message);
    throw error;
  }
};

// 4) travel request standalone - status-rejected
// export const travelStandaloneReject = async (req, res) => {
//   const { tenantId, empId, travelRequestId } = req.params;
//   const { rejectionReasons } = req.body;

//   try {
//     const approval = await Approval.findOne({
//       'tenantId': tenantId,
//       'approvalType': 'travel',
//       'embeddedTravelRequest.isCashAdvanceTaken': false,
//       'embeddedTravelRequest.travelRequestId': travelRequestId,
//       'embeddedTravelRequest.travelRequestStatus': 'pending approval',
//       'embeddedTravelRequest.approvers': {
//         $elemMatch: {
//           'empId': empId,
//           'status': 'pending approval'
//         }
//       }
//     });

//     if (!approval) {
//       throw new Error('Travel request not found.');
//     }

//     const { embeddedTravelRequest } = approval;
//     const { approvers } = embeddedTravelRequest;

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
//     approval.embeddedTravelRequest.approvers = updatedApprovers;
//     approval.embeddedTravelRequest.travelRequestRejectionReason = rejectionReasons;

//     // Update the status within the approval document
//     approval.embeddedTravelRequest.travelRequestStatus = 'rejected';

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
    const approval = await Approval.findOne({
      'embeddedTravelRequest.tenantId': tenantId,
      'embeddedTravelRequest.travelRequestId': travelRequestId,
      'embeddedTravelRequest.approvers': {
        $elemMatch: {
          'empId': empId,
          'status': 'pending approval'
        }
      }
    });
     console.log(approval)
    if (!approval) {
      throw new Error('Travel request not found.');
    }

    const { embeddedTravelRequest } = approval;
    const { approvers } = embeddedTravelRequest;

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

    // Update the approval document with the modified approvers array and rejection reasons
    approval.embeddedTravelRequest.approvers = updatedApprovers;
    approval.embeddedTravelRequest.travelRequestRejectionReason = rejectionReasons;

    // Update the status within the approval document
    approval.embeddedTravelRequest.travelRequestStatus = 'rejected';

    console.log(updatedApprovers , rejectionReasons);
    // Save the updated approval document
    await approval.save();

    // Update approval document status and rejection reasons
    // const travelRejected = await updateApprovalDocument(approval, rejectionReasons);
    
    //    // Send changes to the Travel Microservice
    // await sendTravelRejectedToTravelMicroservice(tenantId, empId, travelRejected, rejectionReasons);

    //  // Send changes to the Trip Microservice
    // await  sendTravelRejectedToTripMicroservice(tenantId, empId, travelRejected, rejectionReasons); 

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

    // Use the Mongoose model for 'Approval' to find all travel requests where the provided empId exists in the 'approvers' array within 'embeddedTravelRequest'
    const travelRequests = await Approval.find(
      {
        'tenantId': tenantId,
        'approvalType': 'travel',
        'embeddedTravelRequest.approvers.empId': empId,
        'embeddedTravelRequest.travelRequestStatus': 'pending approval',
        'embeddedTravelRequest.isCashAdvanceTaken': true,
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
        travelRequestId: request.embeddedTravelRequest?.travelRequestId,
        createdBy: request.embeddedTravelRequest?.createdBy || 'EmpName',
        travelRequestStatus: request.embeddedTravelRequest?.travelRequestStatus,
        tripPurpose: request.embeddedTravelRequest?.tripPurpose || 'tripPurpose',
        departureFrom: request.embeddedTravelRequest?.itinerary.map((item) => item.departure.from) || 'from to',
        departureTo: request.embeddedTravelRequest?.itinerary.map((item) => item.departure.to) || 'from to',
        // departureFt: request.embeddedTravelRequest?.itinerary || 'from to',
        departure: request.embeddedTravelRequest?.itinerary.map((item) => item.departure) || 'from to',
      };

      if (request.embeddedCashAdvance) {
        // If there is an embedded cash advance, extract its fields
        extractedRequestData.createdByCashAdvance = request.embeddedCashAdvance?.createdBy?.name || 'EmpName';
        extractedRequestData.tripPurposeCashAdvance = request.embeddedTravelRequest.tripPurpose || 'tripPurpose';
        extractedRequestData.cashAdvanceStatuses = request.embeddedCashAdvance?.cashAdvances.map((cashAdvance) => cashAdvance.cashAdvanceStatus) || ['CashAdvanceStatus'];
        extractedRequestData.itineraryCitiesCashAdvance = request.embeddedTravelRequest?.itinerary.map((item) => item.departure.from) || 'Missing';
        extractedRequestData.amountDetailsCashAdvance = request.embeddedCashAdvance?.amountDetails || 'Cash';
        extractedRequestData.cashAdvanceViolations = request.embeddedCashAdvance?.cashAdvanceViolations || 'Violations';
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
      'embeddedTravelRequest.travelRequestId': travelRequestId,
      'embeddedTravelRequest.isCashAdvanceTaken': true,
      'embeddedTravelRequest.approvers.empId': empId,
      'embeddedTravelRequest.travelRequestStatus': 'pending approval',
    }).exec();

    if (!travelRequest) {
      // If no matching travel request is found, respond with a 404 Not Found status and a specific message
      return res.status(404).json({ message: 'No matching pending travel request found for this user.' });
    }

    // Extracted fields for the single travel request and its associated cash advance
    const extractedRequestData = {
      approvalType: travelRequest.approvalType,
      travelRequestId: travelRequest.embeddedTravelRequest?.travelRequestId,
      createdBy: travelRequest.embeddedTravelRequest?.createdBy || 'EmpName',
      travelRequestStatus: travelRequest.embeddedTravelRequest?.travelRequestStatus,
      tripPurpose: travelRequest.embeddedTravelRequest?.tripPurpose || 'tripPurpose',
      departureFrom: travelRequest.embeddedTravelRequest?.itinerary.map((item) => item.departure.from) || 'from to',
      departureTo: travelRequest.embeddedTravelRequest?.itinerary.map((item) => item.departure.to) || 'from to',
      departure: travelRequest.embeddedTravelRequest?.itinerary.map((item) => item.departure) || 'from to',
    };

    if (travelRequest.embeddedCashAdvance) {
      // If there is an embedded cash advance, extract its fields
      extractedRequestData.createdByCashAdvance = travelRequest.embeddedCashAdvance?.createdBy?.name || 'EmpName';
      extractedRequestData.tripPurposeCashAdvance = travelRequest.embeddedTravelRequest.tripPurpose || 'tripPurpose';
      extractedRequestData.cashAdvanceStatuses = travelRequest.embeddedCashAdvance?.cashAdvances.map((cashAdvance) => cashAdvance.cashAdvanceStatus) || ['CashAdvanceStatus'];
      extractedRequestData.itineraryCitiesCashAdvance = travelRequest.embeddedTravelRequest?.itinerary.map((item) => item.departure.from) || 'Missing';
      extractedRequestData.amountDetailsCashAdvance = travelRequest.embeddedCashAdvance?.amountDetails || 'Cash';
      extractedRequestData.cashAdvanceViolations = travelRequest.embeddedCashAdvance?.cashAdvanceViolations || 'Violations';
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


// (microservice) status- Approved , microservice- travel
const  updatedApproveTwcApproveTravelToTravelMicroservice = async (tenantId, UpdatedApproveTwcApproveTravel) => {
  try {
    const travelMicroserviceUrl = process.env.TRAVEL_MICROSERVICE_URL;
    const UpdatedApproveTwcApproveTravel = {
        tenantId,
        'embeddedTravelRequest.travelRequestId': approval.travelRequestId ,
        'embeddedTravelRequest.approvers.empId': approval.empId,
        'embeddedTravelRequest.approvers.status': 'approved',
        approvalStatus : 'approved',
    }

    // Make an API call to the Travel Microservice with the updated data
    await axios.post(`${travelMicroserviceUrl}/twca-tr-approved`, 
    UpdatedApproveTwcApproveTravel, { retry : 5, retryInterval: 3000});
  } catch (error) {
    logger.error('Error sending changes to Travel Microservice:', error.message);
    throw error;
  }
};

// (microservice) status- Approved, microservice- trip
const updatedApproveTwcApproveTravelToTripMicroservice = async (tenantId, empId, travelRequestId, UpdatedApproveTwcApproveTravel) => {
  try {
    const tripMicroserviceUrl = process.env.TRIP_MICROSERVICE_URL;
    
    const UpdatedApproveTwcApproveTravel = {
      tenantId: tenantId,
      'embeddedCashAdvance.approvers.empId': empId,
      'embeddedCashAdvance.travelRequestId': travelRequestId,
      'embeddedCashAdvance.approvers.status': 'approved',
      approvalStatus :'approved',
    }

    // Make an API call to the Trip Microservice with the rejection reasons
    await axios.post(`${tripMicroserviceUrl}/twca-tr-approved`,
    UpdatedApproveTwcApproveTravel , { retry: 5, retryInterval: 3000 });
  } catch (error) {
    logger.error('Error sending changes to Trip Microservice:', error.message);
    throw error;
  }
};

// 7) travel with cash advance -- Approve Travel Request
export const travelWithCashApproveTravelRequest = async (req, res) => {
  try {
    const { tenantId, empId, travelRequestId } = req.params;

    const approval = await Approval.findOne({
      tenantId,
      'approvalType': 'travel',
      'embeddedTravelRequest.isCashAdvanceTaken': true,
      'embeddedTravelRequest.travelRequestId': travelRequestId,
      'embeddedTravelRequest.travelRequestStatus': 'pending approval',
      'embeddedTravelRequest.approvers': {
        $elemMatch: {
          'empId': empId,
          'status': 'pending approval'
        }
      }
    });

    if (!approval) {
      throw new Error('Travel request not found.');
    }

    const { embeddedTravelRequest } = approval;
    const { approvers } = embeddedTravelRequest;

    const updatedApprovers = approvers.map((approver) => {
      if (approver.empId === empId) {
        return {
          ...approver,
          status: 'approved',
        };
      }
      return approver;
    });

    approval.embeddedTravelRequest.approvers = updatedApprovers;

    const allApproved = updatedApprovers.every(approver => approver.status === 'approved');

    if (allApproved) {
      approval.embeddedTravelRequest.travelRequestStatus = 'approved';
    }

    await approval.save();



    // // Send changes to the Travel Microservice and the Trip Microservice
    // await Promise.all([
    //   updatedApproveTwcApproveTravelToTravelMicroservice(tenantId, empId, UpdatedApproveTwcApproveTravel),
    //   updatedApproveTwcApproveTravelToTripMicroservice(tenantId, empId, UpdatedApproveTwcApproveTravel),
    // ]);

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


//
const twcRejectTravel = async (approval) => {
  const { embeddedCashAdvance } = approval;
  const { approvers } = embeddedCashAdvance;

  // Find the matching approver by empId and update its status to 'approved'
  const updatedApprovers = approvers.map((approver) => {
    if (approver.empId === empId) {
      return {
        ...approver,
        status: 'approved',
      };
    }
    return approver;
  });

  // Update the approval document with the modified approvers array and rejection reasons
  approval.embeddedCashAdvance.approvers = updatedApprovers;
  approval.embeddedCashAdvance.travelRequestStatus = 'approved'; //NEED TO BE UPDATED
  // Save the updated approval document
  return await approval.save();
};

// (microservice) status- rejected , microservice- travel
const  updatedTwcRejectTravelToTravelMicroservice = async (tenantId, UpdatedTwcRejectTravel) => {
  try {
    const travelMicroserviceUrl = process.env.TRAVEL_MICROSERVICE_URL;
    const UpdatedTwcRejectTravel = {
        tenantId,
        'embeddedTravelRequest.travelRequestId': approval.travelRequestId ,
        'embeddedTravelRequest.approvers.empId': approval.empId,
        'embeddedTravelRequest.approvers.status': 'rejected',
        approvalStatus : 'rejected',
    }

    // Make an API call to the Travel Microservice with the updated data
    await axios.post(`${travelMicroserviceUrl}/twca-tr-rejected`, 
    UpdatedTwcRejectTravel, { retry : 5, retryInterval: 3000});
  } catch (error) {
    logger.error('Error sending changes to Travel Microservice:', error.message);
    throw error;
  }
};

// (microservice) status- rejected, microservice- trip
const updatedTwcRejectTravelToTripMicroservice = async (tenantId, empId, travelRequestId, UpdatedTwcRejectTravel) => {
  try {
    const tripMicroserviceUrl = process.env.TRIP_MICROSERVICE_URL;
    
    const UpdatedTwcRejectTravel = {
      tenantId: tenantId,
      'embeddedCashAdvance.approvers.empId': empId,
      'embeddedCashAdvance.travelRequestId': travelRequestId,
      'embeddedCashAdvance.approvers.status': 'rejected',
      approvalStatus :'rejected',
    }

    // Make an API call to the Trip Microservice with the rejection reasons
    await axios.post(`${tripMicroserviceUrl}/twca-tr-rejected`,
    UpdatedTwcRejectTravel , { retry: 5, retryInterval: 3000 });
  } catch (error) {
    logger.error('Error sending changes to Trip Microservice:', error.message);
    throw error;
  }
};

// 8) travel with cash advance -- Reject Travel Request (IF Travel request is rejected then status of cash advance is updated to draft)
export const travelWithCashRejectTravelRequest = async (req, res) => {
  const { tenantId, empId, travelRequestId } = req.params;
  const { rejectionReasons } = req.body;

  try {
    const approval = await Approval.findOne({
      'approvalType': 'travel',
      'embeddedTravelRequest.isCashAdvanceTaken': true,
      'embeddedTravelRequest.travelRequestId': travelRequestId,
      'embeddedTravelRequest.travelRequestStatus': 'pending approval',
      'embeddedTravelRequest.tenantId': tenantId,
      'embeddedTravelRequest.approvers': {
        $elemMatch: {
          'empId': empId,
          'status': 'pending approval'
        }
      }
    });
     console.log(approval)
    if (!approval) {
      throw new Error('Travel request not found.');
    }

    const { embeddedTravelRequest } = approval;
    const { approvers } = embeddedTravelRequest;

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

    // Update the approval document with the approvers array and rejection reasons
    approval.embeddedTravelRequest.approvers = updatedApprovers;
    approval.embeddedTravelRequest.travelRequestRejectionReason = rejectionReasons;

    // Update the status within the approval document
    approval.embeddedTravelRequest.travelRequestStatus = 'rejected';
    approval.embeddedCashAdvance.cashAdvances = approval.embeddedCashAdvance.cashAdvances.map(cashAdvance => ({
    ...cashAdvance,
    cashAdvanceStatus: 'draft'
    }));


    console.log(updatedApprovers , rejectionReasons);
    // Save the updated approval document
    await approval.save();

    // // Send changes to the Travel Microservice and the Trip Microservice
    // await Promise.all([
    //   updatedTwcRejectTravelToTravelMicroservice(tenantId, empId, UpdatedTwcRejectTravel),
    //   updatedTwcRejectTravelToTripMicroservice(tenantId, empId, UpdatedTwcRejectTravel),
    // ]);

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

//
const cashApprovedTrApproved = async (approval) => {
  const { embeddedCashAdvance } = approval;
  const { approvers } = embeddedCashAdvance;

  // Find the matching approver by empId and update its status to 'approved'
  const updatedApprovers = approvers.map((approver) => {
    if (approver.empId === empId) {
      return {
        ...approver,
        status: 'approved',
      };
    }
    return approver;
  });

  // Update the approval document with the modified approvers array and rejection reasons
  approval.embeddedCashAdvance.approvers = updatedApprovers;
  approval.embeddedCashAdvance.travelRequestStatus = 'approved'; //NEED TO BE UPDATED
  // Save the updated approval document
  return await approval.save();
};

// (microservice) status- Approved , microservice- travel
const  cashApprovedTrApprovedToTravelMicroservice = async (tenantId, updateCashApprovedTrApproved) => {
  try {
    const travelMicroserviceUrl = process.env.TRAVEL_MICROSERVICE_URL;
    const updateCashApprovedTrApproved = {
        tenantId,
        'embeddedTravelRequest.travelRequestId': approval.travelRequestId ,
        'embeddedTravelRequest.approvers.empId': approval.empId,
        'embeddedTravelRequest.approvers.status': 'approved',
        approvalStatus : 'approved',
    }

    // Make an API call to the Travel Microservice with the updated data
    await axios.post(`${travelMicroserviceUrl}/twca-ca-approved`, 
    updateCashApprovedTrApproved, { retry : 5, retryInterval: 3000});
  } catch (error) {
    logger.error('Error sending changes to Travel Microservice:', error.message);
    throw error;
  }
};

// (microservice) status- Approved, microservice- trip
const cashApprovedTrApprovedToTripMicroservice = async (tenantId, empId, travelRequestId, updateCashApprovedTrApproved) => {
  try {
    const tripMicroserviceUrl = process.env.TRIP_MICROSERVICE_URL;
    
    const updateCashApprovedTrApproved = {
      tenantId: tenantId,
      'embeddedCashAdvance.approvers.empId': empId,
      'embeddedCashAdvance.travelRequestId': travelRequestId,
      'embeddedCashAdvance.approvers.status': 'approved',
      approvalStatus :'approved',
    }

    // Make an API call to the Trip Microservice with the rejection reasons
    await axios.post(`${tripMicroserviceUrl}/twca-ca-approved`,
    updateCashApprovedTrApproved , { retry: 5, retryInterval: 3000 });
  } catch (error) {
    logger.error('Error sending changes to Trip Microservice:', error.message);
    throw error;
  }
};

// 9) travel with cash advance -- Approve cash advance 
  export const travelWithCashApproveCashAdvance = async (req, res) => {
    const { tenantId, empId, travelRequestId } = req.params;
  
    try {
      const approval = await Approval.findOne({
        'approvalType': 'travel',
        'embeddedTravelRequest.isCashAdvanceTaken': true,
        'embeddedTravelRequest.travelRequestId': travelRequestId,
        'embeddedTravelRequest.tenantId': tenantId,
        'embeddedTravelRequest.approvers': {
          $elemMatch: {
            'empId': empId,
            'status': 'approved'
          }
        }
      });
  
      if (!approval) {
        throw new Error('Travel request not found.');
      }
  
      const { embeddedCashAdvance } = approval;
      const { cashAdvances } = embeddedCashAdvance;
  
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
  
      // Save the updated approval document
      await approval.save();

    // // Send changes to the Travel Microservice
    // await cashApprovedTrApprovedToTravelMicroservice(tenantId, empId, updateCashApprovedTrApproved);

    // // Send changes to the Trip Microservice
    // await cashApprovedTrApprovedToTripMicroservice(tenantId, empId, updateCashApprovedTrApproved);

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


//
const cashRejectedTrApproved = async (approval, rejectionReasons) => {
  const { embeddedCashAdvance } = approval;
  const { approvers } = embeddedCashAdvance;

  // Find the matching approver by empId and update its status to 'rejected'
  const updatedApprovers = approvers.map((approver) => {
    if (approver.empId === empId) {
      return {
        ...approver,
        status: 'rejected',
      };
    }
    return approver;
  });

  // Update the approval document with the modified approvers array and rejection reasons
  approval.embeddedCashAdvance.approvers = updatedApprovers;
  approval.embeddedCashAdvance.travelRequestStatus = 'rejected'; 
  approval.embeddedCashAdvance.travelRequestRejectionReason = rejectionReasons; 
  // Save the updated approval document
  return await approval.save();
};


// (microservice) status- rejected , microservice- travel
const  cashRejectedTrApprovedToTravelMicroservice = async (tenantId, empId, travelRequestId, UpdateCashRejectedTrApproved, rejectionReasons) => {
  try {
    const travelMicroserviceUrl = process.env.TRAVEL_MICROSERVICE_URL;
    const UpdateCashRejectedTrApproved = {
        tenantId,
        'embeddedTravelRequest.travelRequestId': approval.travelRequestId ,
        'embeddedTravelRequest.approvers.empId': approval.empId,
        'embeddedTravelRequest.approvers.status': 'rejected',
        'embeddedTravelRequest.travelRequestRejectionReason': approval.rejectionReasons,
        approvalStatus : 'rejected',
    }

    // Make an API call to the Travel Microservice with the updated data
    await axios.post(`${travelMicroserviceUrl}/ts-rejected`, 
    UpdateCashRejectedTrApproved, { retry : 5, retryInterval: 3000});
  } catch (error) {
    logger.error('Error sending changes to Travel Microservice:', error.message);
    throw error;
  }
};

// (microservice) status- rejected, microservice- trip
const cashRejectedTrApprovedToTripMicroservice = async (tenantId, empId, travelRequestId, UpdateCashRejectedTrApproved, rejectionReasons) => {
  try {
    const tripMicroserviceUrl = process.env.TRIP_MICROSERVICE_URL;
    
    const UpdateCashRejectedTrApproved = {
      tenantId: tenantId,
      'embeddedTravelRequest.approvers.empId': empId,
      'embeddedTravelRequest.travelRequestId': travelRequestId,
      'embeddedTravelRequest.approvers.status': 'rejected',
      'embeddedTravelRequest.travelRequestRejectionReason': rejectionReasons,
      approvalStatus :'rejected',

    }

    // Make an API call to the Trip Microservice with the rejection reasons
    await axios.post(`${tripMicroserviceUrl}/ts-rejected`,
     UpdateCashRejectedTrApproved , { retry: 5, retryInterval: 3000 });
  } catch (error) {
    logger.error('Error sending changes to Trip Microservice:', error.message);
    throw error;
  }
};

// 10) travel with cash advance -- Reject cash advance 
export const travelWithCashRejectCashAdvance = async (req, res) => {
  const { tenantId, empId, travelRequestId } = req.params;
  const { rejectionReasons } = req.body; 

  try {
    const approval = await Approval.findOne({
      'approvalType': 'travel',
      'embeddedTravelRequest.isCashAdvanceTaken': true,
      'embeddedTravelRequest.travelRequestId': travelRequestId,
      'embeddedTravelRequest.tenantId': tenantId,
      'embeddedTravelRequest.approvers': {
        $elemMatch: {
          'empId': empId,
          'status': 'approved'
        }
      }
    });

    if (!approval) {
      throw new Error('Travel request not found.');
    }

    const { embeddedCashAdvance } = approval;
    const { cashAdvances } = embeddedCashAdvance;

    cashAdvances.forEach(cashAdvance => {
      cashAdvance.approvers.forEach(approver => {
        if (approver.empId === empId) {
          approver.status = 'rejected';
        }
      });
      cashAdvance.cashAdvanceStatus = 'rejected'; 
      cashAdvance.cashAdvanceRejectionReason = rejectionReasons; // Update rejection reason
    });

    // Save the updated approval document
    await approval.save();

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











// export const travelWithCashRejectCashAdvance = async (req, res) => {
//   const { tenantId, empId } = req.params;
//   const { rejectionReasons } = req.body;

//   try {
//     // Find the approval document
//     const approval = await  Approval.findOne({
//       'tenantId': tenantId,
//       'approvalType': 'travel',
//       'embeddedTravelRequest.isCashAdvanceTaken': true,
//       'embeddedTravelRequest.approvers.empId': empId,
//       'embeddedTravelRequest.travelRequestStatus': { $in: ['approved', 'booked'] },
//     }).exec();
  

//     if (!approval) {
//       return res.status(404).json({ error: 'Travel request not found.' });
//     }

//     // Update approval document status and rejection reasons
//     const UpdateCashRejectedTrApproved = await cashRejectedTrApproved(approval, rejectionReasons);

//     // Send changes to the Travel Microservice
//     await cashRejectedTrApprovedToTravelMicroservice(tenantId, empId, UpdateCashRejectedTrApproved, rejectionReasons);

//     // Send changes to the Trip Microservice
//     await cashRejectedTrApprovedToTripMicroservice(tenantId, empId, UpdateCashRejectedTrApproved, rejectionReasons);

//     res.status(200).json({ 
//       message: `Approval for empId ${empId} updated to 'rejected'.`,
//       UpdateCashRejectedTrApproved, 
//     });

//   } catch (error) {
//     logger.error('An error occurred while updating approval:', error.message);
//     res.status(500).json({ error: 'Failed to update approval.' });
//   }
// };


