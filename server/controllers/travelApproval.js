import { Approval } from '../models/approvalSchema.js';

// Get travel requests and associated cash advances for an approver
export const getTravelRequestsAndCashAdvancesByApprovalId = async (req, res) => {
  try {
    const empId = req.params.empId;

    // Use the Mongoose model for 'Approval' to find all travel requests where the provided empId exists in the 'approvers' array within 'embeddedTravelRequest'
    const travelRequests = await Approval.find(
      {
        'embeddedTravelRequest.approvers.empId': empId,
        'embeddedTravelRequest.travelRequestStatus': 'pending approval',
      }
    ).exec();

    if (travelRequests.length === 0) {
      // If no travel requests are found, respond with a 404 Not Found status and a specific message
      return res.status(404).json({ message: 'No pending travel requests found for this user.' });
    }

    // Extracted fields for travel requests and associated cash advances are added as objects in an array
    const extractedData = travelRequests.map((request) => {
      const extractedRequestData = {
        travelRequestId: request.embeddedTravelRequest?.travelRequestId,
        createdBy: request.embeddedTravelRequest.createdBy?.name || 'EmpName',
        travelRequestStatus: request.embeddedTravelRequest?.travelRequestStatus,
        tripPurpose: request.embeddedTravelRequest?.tripPurpose || 'tripPurpose',
        departureCity: request.embeddedTravelRequest?.itinerary.cities || 'from to'
      };

      if (request.embeddedCashAdvance) {
        // If there is an embedded cash advance, extract its fields
        extractedRequestData.createdByCashAdvance = request.embeddedCashAdvance.createdBy.name || 'EmpName';
        extractedRequestData.tripPurposeCashAdvance = request.embeddedTravelRequest.tripPurpose || 'tripPurpose';
        extractedRequestData.cashAdvanceStatus = request.embeddedCashAdvance.cashAdvanceStatus || 'CashAdvanceStatus'
        extractedRequestData.itineraryCitiesCashAdvance = request.embeddedTravelRequest.itinerary.cities || 'Missing';
        extractedRequestData.amountDetailsCashAdvance = request.embeddedCashAdvance.amountDetails || 'Cash';
        extractedRequestData.cashAdvanceViolations = request.embeddedCashAdvance.cashAdvanceViolations || 'Violations';
      }

      return extractedRequestData;
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












// Get Travel Request Details by Travel Request ID to display to the approver
export const getTravelRequestDetails = async (req, res) => {
  try {
    const { travelRequestId } = req.params; 

    // Fetch travel request details by travelRequestId
    const approval = await Approval.findOne({ 'embeddedTravelRequest.travelRequestId': travelRequestId });

    if (!approval) {
      // If the travel request doesn't exist, return a 404 Not Found response
      return res.status(404).json({ error: 'Travel request not found.' });
    }

    const travelRequest = approval.embeddedTravelRequest;

    // Define a function to filter out null, empty, or undefined values from an object
    const filterObject = (obj) => {
      const filteredObj = {};
      for (const key in obj) {
        if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
          filteredObj[key] = obj[key];
        }
      }
      return filteredObj;
    };

    // Filter the travel request details
    const filteredTravelRequest = filterObject(travelRequest);

    // Return the filtered travel request details
    res.status(200).json(filteredTravelRequest);
  } catch (error) {
    // Handle errors
    console.error('An error occurred while fetching travel request details:', error.message);
    // Send an error response
    res.status(500).json({ error: 'An error occurred while fetching travel request details.' });
  }
};
