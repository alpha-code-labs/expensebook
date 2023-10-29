import { Approval } from '../models/approvalSchema.js';

// Standalone cash advance with travel requests 'approved' status for an approver
export const getPendingCashAdvances = async (req, res) => {
    try {
        const empId = req.params.empId;
    
        // Use the Mongoose model for 'Approval' to find all travel requests where the provided empId exists in the 'approvers' array within 'embeddedTravelRequest'
        // and travel request status is 'approved'
        const travelRequests = await Approval.find({
          'embeddedTravelRequest.approvers.empId': empId,
          'embeddedTravelRequest.travelRequestStatus': 'approved',
        }).exec();
    
        if (travelRequests.length === 0) {
          // If no approved travel requests are found, respond with a 404 Not Found status and a specific message
          return res.status(404).json({ message: 'No approved travel requests found for this user.' });
        }
    
        // Extracted fields for travel requests and associated cash advances are added as objects in an array
        const extractedData = travelRequests.map((request) => {
          const extractedRequestData = {
            travelRequestStatus: request.embeddedTravelRequest?.travelRequestStatus,
            itineraryCities: request.embeddedTravelRequest?.itinerary.cities || 'cities',
          };
    
          if (request.embeddedCashAdvance && request.embeddedCashAdvance.cashAdvanceStatus === 'pending approval') {
            const cashAdvance = request.embeddedCashAdvance;
    
    
            // Extract amount from amountDetails or set to 'Missing'
            extractedRequestData.amountDetailsCashAdvance = cashAdvance?.amountDetails.map((amountDetail) => {
              return {
                amount: amountDetail.amount,
                currency: amountDetail.currency,
              };
            }) || 'Missing';
    
            // Extract other fields
            extractedRequestData.createdByCashAdvance = cashAdvance?.createdBy.name || 'EmpName';
            extractedRequestData.tripPurposeCashAdvance = cashAdvance?.tripPurpose || 'tripPurpose';
            extractedRequestData.cashAdvanceStatus = cashAdvance?.cashAdvanceStatus || 'CashAdvanceStatus';
            extractedRequestData.cashAdvanceViolations = cashAdvance?.cashAdvanceViolations || 'Violations';
          }
    
          return extractedRequestData;
        });
    
        // If approved travel requests are found, respond with a 200 OK status and the array of extracted fields
        return res.status(200).json(extractedData);
      } catch (error) {
        // Handle and log errors
        console.error('An error occurred:', error);
        // Respond with a 500 Internal Server Error status and an error message
        return res.status(500).json({ error: 'An error occurred while processing the request.' });
      }
    };