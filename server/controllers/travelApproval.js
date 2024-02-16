import axios from 'axios';
import { Approval } from '../models/approvalSchema.js';
import pino from 'pino';
import { approveAddALegToTrip} from '../internal/controllers/tripMicroservice.js';
import {  approveAddALegToExpense } from '../internal/controllers/expenseMicroservice.js';
import { sendCashApprovalToDashboardQueue, sendTravelApprovalToDashboardQueue } from '../rabbitmq/dashboardMicroservice.js';
import { sendToDashboardQueue, sendToOtherMicroservice } from '../rabbitmq/publisher.js';

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


//2) travel request standalone - Details
export const getTravelRequestDetails = async (req, res) => {
  try {
    const { tenantId, travelRequestId, empId } = req.params;
    console.log("hi 78", req.params)

    const commonConditions = {
      'travelRequestData.tenantId': tenantId,
      'travelRequestData.approvers.empId': empId,
    };
    
    // Fetch travel request details by travelRequestId
    const approval = await Approval.findOne({
      $or: [
        {
          ...commonConditions,
          'travelRequestData.travelRequestId': travelRequestId,
        },
        {
          ...commonConditions,
          'travelRequestData.isAddALeg': true,
          'travelRequestData.travelRequestStatus': 'booked',
        },
      ]
    }).exec();
    
    // const travelApproveDoc = {
    //   'travelRequestData.tenantId': tenantId,
    //   'travelRequestData.travelRequestId': travelRequestId,
    //   'travelRequestData.approvers.empId': empId,
    // };

    if (!approval) {
      // If the travel request doesn't exist, return a 404 Not Found response
      return res.status(404).json({ error: 'Travel request not found.' });
    }
    const { travelRequestData , cashAdvancesData} = approval
    
   if (travelRequestData.isCashAdvanceTaken ) {
       return res.status(200).json({ success: true , travelRequestData, cashAdvancesData})
   } else {
       return res.status(200).json({success: true, travelRequestData, cashAdvancesData:[]});
   }

    // Return the filtered travel request details
  } catch (error) {
    // Handle errors
    console.error('An error occurred while fetching travel request details:', error.message);
    // Send an error response
    res.status(500).json({ error: 'An error occurred while fetching travel request details.' });
  }
};
 

// 3) travel request standalone -status-Approved 
export const travelStandaloneApprove = async (req, res) => {
  try {
    const { tenantId, empId, travelRequestId } = req.params;

    const travelApprovalDoc = await Approval.findOne({
      "travelRequestData.tenantId":tenantId,
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
    const { itinerary, approvers } = travelRequestData;

   if (typeof itinerary === 'object' && Object.keys(itinerary).length >= 1) {
        const itineraryApproved = Object.values(itinerary).flatMap(Object.values);

      itineraryApproved.forEach(booking => {  
        booking.approvers.forEach(approver => {
          if(approver.empId === req.params.empId && approver.status == 'pending approval' && booking.status == 'pending approval'){
           approver.status = 'approved'
          }
        })
        
        const isPendingApproval = booking.status == 'pending approval'
        const allApproversApproved = booking.approvers.every(approver => approver.status == 'approved') 
        if (allApproversApproved && isPendingApproval){
          booking.status = 'approved'
        }})
  
    } else {
      throw new Error('Travel Request doenst have anything in itinerary to approve');
    }
   
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

    const employee = travelRequestData.createdBy.name;

    // Send updated travel to the dashboard synchronously
     await sendToDashboardQueue(travelApprovalDoc, true, 'online')

    const payload = {
      travelRequestId: travelApprovalDoc.travelRequestData.travelRequestId,
      travelRequestStatus: travelApprovalDoc.travelRequestData.travelRequestStatus,
      approvers:travelApprovalDoc.travelRequestData.approvers,
      rejectionReasons: travelApprovalDoc.travelRequestData.rejectionReason,
    }

    // send approval to travel
    sendToOtherMicroservice(payload, 'approve-reject-tr', 'travel', 'travel standalone approved ')

    return res.status(200).json({ message: `Travel request is approved for ${employee}` });
  } catch (error) {
    console.error('An error occurred while updating approval:', error.message);
    return res.status(500).json({ error: 'Failed to update approval.', error: error.message });
  }
};


export const travelStandaloneReject = async (req, res) => {
  const { tenantId, empId, travelRequestId } = req.params;
  const { rejectionReason } = req.body;

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
    const { approvers , itinerary } = travelRequestData;

    
   if (typeof itinerary === 'object' && Object.keys(itinerary).length >= 1) {
    const itineraryApproved = Object.values(itinerary).flatMap(Object.values);

  itineraryApproved.forEach(booking => {  
    booking.approvers.forEach(approver => {
      if(approver.empId === req.params.empId && approver.status == 'pending approval' && booking.status == 'pending approval'){
       approver.status = 'rejected'
      }
    })
    
    const isPendingApproval = booking.status == 'pending approval'
    if (isPendingApproval){
      booking.status = 'rejected'
      booking.rejectionReason = rejectionReason
    }})

} else {
  throw new Error('Travel Request doenst have anything in itinerary to approve');
}

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

    // Update the travelApprovalDoc document with the modified approvers array and rejection reason
    travelApprovalDoc.travelRequestData.approvers = updatedApprovers;
    travelApprovalDoc.travelRequestData.rejectionReason = rejectionReason;

    // Update the status within the travelApprovalDoc document
    travelApprovalDoc.travelRequestData.travelRequestStatus = 'rejected';

    console.log(updatedApprovers , rejectionReason);
    // Save the updated travelApprovalDoc document
    await travelApprovalDoc.save();

    const employee = travelRequestData.createdBy.name;

    // Send updated travel to the dashboard synchronously
    await sendToDashboardQueue(travelApprovalDoc, true, 'online')

    const payload = {
      travelRequestId: travelApprovalDoc.travelRequestData.travelRequestId,
      travelRequestStatus: travelApprovalDoc.travelRequestData.travelRequestStatus,
      approvers:travelApprovalDoc.travelRequestData.approvers,
      rejectionReason:  travelApprovalDoc.travelRequestData.rejectionReason,
    }

    // send approval to travel
    await sendToOtherMicroservice(payload, 'approve-reject-tr', 'travel', 'travel standalone rejected ')

    console.log('After saving approval...');
    return res.status(200).json({ message: `Travel request is rejected for ${employee}` });
  } catch (error) {
    console.error('An error occurred while updating approval:', error.message);
    return res.status(500).json({ error: 'Failed to update approval.', error: error.message });
  }
};

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
      'travelRequestData.tenantId': tenantId,
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

    console.log("now ---", req.params)
    const cashApprovalDoc = await Approval.findOne({
      "travelRequestData.tenantId":tenantId,
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
    const { itinerary, approvers } = travelRequestData;

    if (typeof itinerary === 'object' ) {
      const itineraryApproved = Object.values(itinerary).flatMap(Object.values);

    itineraryApproved.forEach(booking => {  
      booking.approvers.forEach(approver => {
        if(approver.empId === req.params.empId && approver.status == 'pending approval' && booking.status == 'pending approval'){
         approver.status = 'approved'
        }
      })
      
      const isPendingApproval = booking.status == 'pending approval'
      const allApproversApproved = booking.approvers.every(approver => approver.status == 'approved') 
      if (allApproversApproved && isPendingApproval){
        booking.status = 'approved'
      }})

  } else {
    throw new Error('Travel Request doenst have anything in itinerary to approve');
  }

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
    console.log("approved", cashApprovalDoc)
    const employee = travelRequestData.createdBy.name;

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
      rejectionReason: cashApprovalDoc.travelRequestData?.rejectionReason,
    }
    console.log("hiiiii", payload)
    // send approval to Cash
    sendToOtherMicroservice(payload, 'approve-reject-tr', 'cash', 'To update travelRequestStatus to approved in cash microservice')

   return res.status(200).json({ message: `TravelRequest approved for ${employee}` });
 } catch (error) {
    console.error('An error occurred while updating approval:', error.message);
    return res.status(500).json({ error: 'Failed to update approval.', error: error.message });
  }
};


// 8) travel with cash advance -- Reject Travel Request (IF Travel request is rejected then status of cash advance is updated to draft)
export const travelWithCashRejectTravelRequest = async (req, res) => {
  const { tenantId, empId, travelRequestId } = req.params;
  const { rejectionReason } = req.body;
  
  console.log("reject tr req.body", req.body, req.params)
  try {
    const cashApprovalDoc = await Approval.findOne({
      'travelRequestData.tenantId':tenantId,
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
     console.log(cashApprovalDoc)
    if (!cashApprovalDoc) {
      throw new Error('Travel request not found.');
    }

    const { travelRequestData } = cashApprovalDoc;
    const { itinerary, approvers } = travelRequestData;

    if (typeof itinerary === 'object') {
      const itineraryApproved = Object.values(itinerary).flatMap(Object.values);

    itineraryApproved.forEach(booking => {  
      booking.approvers.forEach(approver => {
        if(approver.empId === req.params.empId && approver.status == 'pending approval' && booking.status == 'pending approval'){
         approver.status = 'rejected'
        }
      })
      
      const isPendingApproval = booking.status == 'pending approval'
      if (isPendingApproval){
        booking.status = 'rejected'
      }})
  } else {
    throw new Error('Travel Request doenst have anything in itinerary to approve');
  }

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

    // Update the cashApprovalDoc document with the approvers array and rejection reason
    cashApprovalDoc.travelRequestData.approvers = updatedApprovers;
    cashApprovalDoc.travelRequestData.rejectionReason = rejectionReason;

    // Update the status within the cashApprovalDoc document
    cashApprovalDoc.travelRequestData.travelRequestStatus = 'rejected';

    cashApprovalDoc.cashAdvancesData.forEach(cashAdvance => {
      cashAdvance.approvers = cashAdvance.approvers.map(approver => {
        if (approver.empId === empId && approver.status === 'pending approval') {
          return { ...approver, status: 'rejected' };
        }
        return approver;
      });
    
      // Check if cashAdvanceStatus is 'pending approval', update to 'rejected'
      if (cashAdvance.cashAdvanceStatus === 'pending approval') {
        cashAdvance.cashAdvanceStatus = 'rejected';
      }
    });

    console.log( "these are the updated approvers , rejectionReason", updatedApprovers , rejectionReason);
    // Save the updated cashApprovalDoc document
     await cashApprovalDoc.save();

     const employee = travelRequestData.createdBy.name;

      //Sending to dashboard via rabbitmq
      await sendCashApprovalToDashboardQueue(cashApprovalDoc);

    const payload = {
      travelRequestId: cashApprovalDoc.travelRequestData.travelRequestId,
      travelRequestStatus: cashApprovalDoc.travelRequestData.travelRequestStatus,
      approvers:cashApprovalDoc.travelRequestData.approvers,
      rejectionReason: cashApprovalDoc.travelRequestData.rejectionReason,
    }

    console.log("Travel reject payload", payload);
    // send Rejected Travel request to Cash microservice
    sendToOtherMicroservice(payload, 'approve-reject-tr', 'cash', 'To update travelRequestStatus to rejected in cash microservice')

    return res.status(200).json({ message: `Travel request is rejected for ${employee}` });
  } catch (error) {
    console.error('An error occurred while updating approval:', error.message);
    return res.status(500).json({ error: 'Failed to update approval.', error: error.message });
  }
};

// 9) travel with cash advance -- Approve cash advance / approve cashAdvance raised later
export const travelWithCashApproveCashAdvance = async (req, res) => {
  const { tenantId, empId, travelRequestId, cashAdvanceId } = req.params;

  console.log("cash advance approve params ......", req.params);

  try {
    const cashApprovalDoc = await Approval.findOne({
      'travelRequestData.tenantId': tenantId,
      'travelRequestData.travelRequestId': travelRequestId,
      'travelRequestData.isCashAdvanceTaken': true,
      $or: [
        {
          'travelRequestData.approvers': {
            $elemMatch: {
              'empId': empId,
              'status': 'approved'
            }
          }
        },
        {
          'travelRequestData.approvers': {
            $elemMatch: {
              'empId': empId
            }
          },
          'travelRequestData.travelRequestStatus': { $in: ['approved', 'booked'] },
        }
      ]
    }).exec();

    if (!cashApprovalDoc) {
      return res.status(404).json({ error: 'Travel request not found.' });
    }

    const { cashAdvancesData } = cashApprovalDoc;
    const cashAdvanceFound = cashAdvancesData.find(cashAdvance => cashAdvance.cashAdvanceId.toString() == cashAdvanceId);

    console.log("valid cash advanceId", cashAdvanceFound);

    if (cashAdvanceFound) {
      cashAdvanceFound.approvers.forEach(approver => {
        if (approver.empId === empId && approver.status === 'pending approval') {
          approver.status = 'approved';
        }
      });

      const allApproved = cashAdvanceFound.approvers.every(approver => approver.status == 'approved');

      if (allApproved) {
        cashAdvanceFound.cashAdvanceStatus = 'approved';
      }

      // Save the updated cashApprovalDoc document
      const cashApproved = await cashApprovalDoc.save();

      const employee = cashAdvanceFound.createdBy.name;
      console.log("after approved ..", cashApproved);

      // Sending to dashboard via rabbitmq
      await sendCashApprovalToDashboardQueue(cashApprovalDoc);

      const payload = {
        travelRequestId: cashApprovalDoc.travelRequestData.travelRequestId,
        cashAdvanceId: cashAdvanceId,
        cashAdvanceStatus: cashAdvanceFound?.cashAdvanceStatus,
        approvers: cashAdvanceFound?.approvers,
        rejectionReason: cashAdvanceFound?.rejectionReason,
      };

      console.log("is payload updated save()....", payload);

      // send Approved cashAdvance to Cash microservice
      sendToOtherMicroservice(payload, 'approve-reject-ca', 'cash', 'To update cashAdvanceStatus to approved in cash microservice');

      return res.status(200).json({ message: `Cash advance approved for ${employee}` });
    }
  } catch (error) {
    console.error('An error occurred while updating approval:', error.message);
    return res.status(500).json({ error: 'Failed to update approval.', error: error.message });
  }
};



// 10) travel with cash advance -- Reject cash advance / reject cash Advance raised later
export const travelWithCashRejectCashAdvance = async (req, res) => {
  const { tenantId, empId, travelRequestId, cashAdvanceId } = req.params;
  const {  rejectionReason } = req.body; 

  try {
    // const cashApprovalDoc = await Approval.findOne({
    //   'travelRequestData.tenantId': tenantId,
    //   'travelRequestData.isCashAdvanceTaken': true,
    //   'travelRequestData.travelRequestId': travelRequestId,
    //   'travelRequestData.tenantId': tenantId,
    //   'travelRequestData.approvers': {
    //     $elemMatch: {
    //       'empId': empId,
    //       'status': 'approved'
    //     }
    //   }
    // });

    const cashApprovalDoc = await Approval.findOne({
      'travelRequestData.tenantId': tenantId,
      'travelRequestData.travelRequestId': travelRequestId,
      'travelRequestData.isCashAdvanceTaken': true,
      $or: [
        {
          'travelRequestData.approvers': {
            $elemMatch: {
              'empId': empId,
              'status': 'approved'
            }
          }
        },
        {
          'travelRequestData.approvers': {
            $elemMatch: {
              'empId': empId
            }
          },
          'travelRequestData.travelRequestStatus': { $in: ['approved', 'booked'] },
        }
      ]
    }).exec();

    if (!cashApprovalDoc) {
      throw new Error('Travel request not found.');
    }

    const { cashAdvancesData } = cashApprovalDoc;

    const cashAdvanceFound = cashAdvancesData.find(cashAdvance => cashAdvance.cashAdvanceId.toString() == cashAdvanceId);

    console.log("valid cash advanceId", cashAdvanceFound);

    if (cashAdvanceFound) {
      cashAdvanceFound.approvers.forEach(approver => {
        if (approver.empId === empId && approver.status === 'pending approval') {
          approver.status = 'rejected';
          cashAdvanceFound.cashAdvanceStatus = 'rejected'; 
          cashAdvanceFound.cashAdvanceRejectionReason = rejectionReason; // Update rejection reason
        }
      });
  
      // Save the updated cashApprovalDoc document
      await cashApprovalDoc.save();
      const employee = cashAdvanceFound.createdBy.name;
  
      //Sending to dashboard via rabbitmq
      await sendCashApprovalToDashboardQueue(cashApprovalDoc);
  
      const payload = {
        travelRequestId: cashApprovalDoc.travelRequestData.travelRequestId,
        cashAdvanceId: cashAdvanceId,
        cashAdvanceStatus: cashAdvanceFound?.cashAdvanceStatus,
        approvers: cashAdvanceFound?.approvers,
        cashAdvanceRejectionReason:cashAdvanceFound?.cashAdvanceRejectionReason,
      }

      console.log("payload updated?", payload)
  
      // send Rejected cash advance to Cash microservice
      sendToOtherMicroservice(payload, 'approve-reject-ca', 'cash', 'To update cashAdvanceStatus to rejected in cash microservice')
  
     return res.status(200).json({ message: `Cash advance rejected for ${employee}` });
    }
  } catch (error) {
    console.error('An error occurred while updating approval:', error.message);
    return res.status(500).json({ error: 'Failed to update approval.', error: error.message });
  }
};



// 11) Get add a leg all 'booked' Travel Requests with cash advance -- !! important - isAddALeg : true
export const getAddALegTravelRequestsForApprover = async (req, res) => {
  try {
    const {tenantId, empId} = req.params;

    // Use the Mongoose model for 'Approval' to find all travel requests where the provided empId exists in the 'approvers' array within 'travelRequestData'
    const travelRequests = await Approval.find(
      {
        'travelRequestData.tenantId': tenantId,
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
      'travelRequestData.tenantId': tenantId,
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
export const approveAddALeg = async (req, res) => {
  try {
    const { tenantId, empId, travelRequestId, itineraryId } = req.params;

    const approval = await Approval.findOne({
      "travelRequestData.tenantId": tenantId,
      'travelRequestData.travelRequestId': travelRequestId,
      'travelRequestData.isAddALeg': true,
      'travelRequestData.travelRequestStatus': 'booked',
    });

    if (!approval) {
      return res.status(404).json({ error: 'Travel request not found for approval: ApproveAddALeg' });
    }

    const { itinerary = {}, isCashAdvanceTaken } = approval.travelRequestData;

    const itineraryArray = Object.values(itinerary).flatMap(Object.values);
    const itineraryFound = itineraryArray.find(obj => obj.itineraryId.toString() === itineraryId);

    if (itineraryFound) {
      const { approvers = [], status = "" } = itineraryFound;

      const updatedApprovers = approvers.map((approver) => {
        if (approver.empId === empId && approver.status === 'pending approval') {
          return { ...approver, status: 'approved' };
        }
        return approver;
      });
      
      itineraryFound.approvers = updatedApprovers;

      const allApproved = updatedApprovers.every(approver => approver.status === 'approved');

      let isAllApproved;
      if (allApproved) {
        isAllApproved = itineraryFound.status = 'approved';
      }

      approval.markModified('travelRequestData'); // Mark the field as modified before saving
      await approval.save();

        const payload = {
          travelRequestId: approval.travelRequestData.travelRequestId,
          travelRequestStatus: approval.travelRequestData.travelRequestStatus,
          itineraryId: itineraryId,
          approvers:updatedApprovers,
          status:isAllApproved,
        };

        console.log("the payload", payload)

        if (isCashAdvanceTaken) {
          await sendToOtherMicroservice(payload, 'approve-add-leg', 'cash', 'To update itinerary approved status in cash microservice');
        } else {
          await sendToOtherMicroservice(payload, 'approve-add-leg', 'travel', 'To update itinerary approved status in travel microservice');
        }
     
     return res.status(200).json({ message: `Approval for empId ${empId} updated to 'approved'.`, itineraryFound });
    } else {
      return res.status(404).json({ error: 'No itinerary found or approvers are undefined.' });
    }
  } catch (error) {
    if (error.message === 'Travel request not found.') {
      res.status(404).json({ error: 'Travel request not found.' });
    } else {
      console.error('An error occurred while updating approval:', error.message);
      res.status(500).json({ error: 'Failed to update approval.' });
    }
  }
};

export const rejectAddALeg = async (req, res) => {
  try {
    const { tenantId, empId, travelRequestId, itineraryId } = req.params;
    const { rejectionReason } = req.body;

    // Input validation
    if (!tenantId || !empId || !travelRequestId || !itineraryId) {
      return res.status(400).json({ error: 'Missing required parameters.' });
    }

    if (!rejectionReason){
      return res.status(400).json({error: "missing rejection reason"})
    }

    console.log("adda leg params", req.params);
    
    const approval = await Approval.findOne({
       "travelRequestData.tenantId": tenantId,
      'travelRequestData.travelRequestId': travelRequestId,
      'travelRequestData.isAddALeg': true,
      'travelRequestData.travelRequestStatus': 'booked',
    });

    if (!approval) {
      return res.status(404).json({ error: 'Travel request not found for approval.' });
    } 

    const { itinerary = {}, isCashAdvanceTaken } = approval.travelRequestData;
    console.log('Travel request', itinerary)

    const itineraryArray = Object.values(itinerary).flatMap(Object.values);
    console.log("itineraryArray", itineraryArray)

    const itineraryFound = itineraryArray.find(obj => obj.itineraryId.toString() === itineraryId);
  console.log("aaaaa", itineraryFound)
    if (itineraryFound) {
      const { approvers = [], status = "" } = itineraryFound;

      const updatedApprovers = approvers.map((approver) => {
        if (approver.empId === empId && approver.status === 'pending approval') {
          return { ...approver, status: 'rejected' };
        }
        return approver;
      });
      
      itineraryFound.approvers = updatedApprovers;
  
      if(rejectionReason){
        itineraryFound.rejectionReason = rejectionReason
        itineraryFound.status = 'rejected';
      }

      approval.markModified('travelRequestData'); // Mark the field as modified before saving

      const updatedApproval = await approval.save();
      
      const {itinerary} = updatedApproval.travelRequestData.itinerary
      const getItinerary = Object.values(itinerary).flatMap(Object.values);
      const updatedItineraryFound = getItinerary.find(itinerary => itinerary.itineraryId === itinerary);
      //    const { approvers, status} = updatedItineraryFound

 const payload = {
  travelRequestId: approval.travelRequestData.travelRequestId,
  travelRequestStatus: approval.travelRequestData.travelRequestStatus,
  itineraryId: itineraryId,
  approvers: approvers,
  rejectionReason:  itineraryFound.rejectionReason,
  status:itineraryFound.status,
}

if (isCashAdvanceTaken) {
  console.log('Is cash advance taken:', isCashAdvanceTaken);
  await sendToOtherMicroservice(payload, 'add-leg', 'cash', 'To update itinerary rejected status in cash microservice')
} else {
  await sendToOtherMicroservice(payload, 'add-leg', 'travel', 'To update itinerary rejected status in travel microservice');
}
      console.log("Updated itineraryFound after save payload payload:", payload);

      res.status(200).json({ message: `Approval for empId ${empId} updated to 'approved'.`, payload , updatedItineraryFound});
    } else {
      console.log("No itinerary found or approvers are undefined.");
      res.status(404).json({ error: 'No itinerary found or approvers are undefined.' });
    }
  } catch (error) {
    console.error('An error occurred while updating approval:', error.message);
    res.status(500).json({ error: 'Failed to update approval.' });
  }
};



// // 13) travel with cash advance -- Approve Travel Request
// !! Important -- checking isAddALeg flag is very imporatant and after the action updating it too is important.
export const oldApproveAddALegss = async (req, res) => {
  try {
    const { tenantId, empId, travelRequestId, itineraryId } = req.params;

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

// Reject add a leg with rejection reasons - travel status is booked 

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

