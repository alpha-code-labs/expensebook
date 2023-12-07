import { Approval } from '../models/approvalSchema.js';

// Standalone cash advance with travel requests 'approved' status for an approver
export const getPendingCashAdvances = async (req, res) => {
  try {
    const { tenantId, empId } = req.params;

    // Find travel requests with 'approved' or 'booked' status for the provided empId and tenantId
    const travelRequests = await Approval.find({
      'tenantId': tenantId,
      'approvalType': 'travel',
      'embeddedTravelRequest.isCashAdvanceTaken': true,
      'embeddedTravelRequest.approvers.empId': empId,
      'embeddedTravelRequest.travelRequestStatus': { $in: ['approved', 'booked'] }, 
    }).exec();

    if (travelRequests.length === 0) {
      return res.status(404).json({ message: 'No approved or booked travel requests found for this user.' });
    }

    const extractedData = [];

    for (const request of travelRequests) {
      const extractedRequestData = {
        travelRequestStatus: request.embeddedTravelRequest?.travelRequestStatus,
        itineraryCities: request.embeddedTravelRequest?.itinerary.map(item => item.departure.to) || [],
      };

      if (request.embeddedCashAdvance) {
        for (const cashAdvance of request.embeddedCashAdvance.cashAdvances) {
          if (cashAdvance.cashAdvanceStatus === 'pending approval') {
            const {
              amountDetails,
              createdBy,
              tripPurpose,
              cashAdvanceStatus,
              cashAdvanceViolations,
            } = cashAdvance;

            extractedRequestData.amountDetailsCashAdvance = amountDetails.map(amountDetail => ({
              amount: amountDetail.amount,
              currency: amountDetail.currency,
            }));
            extractedRequestData.createdByCashAdvance = createdBy.name || 'EmpName';
            extractedRequestData.tripPurposeCashAdvance = tripPurpose || 'tripPurpose';
            extractedRequestData.cashAdvanceStatus = cashAdvanceStatus || 'CashAdvanceStatus';
            extractedRequestData.cashAdvanceViolations = cashAdvanceViolations || [];
            extractedData.push(extractedRequestData);
          }
        }
      }
    }

    return res.status(200).json(extractedData);
  } catch (error) {
    console.error('An error occurred:', error);
    return res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};

//for a single travel request 
export const getPendingCashAdvancesForATravelRequest = async (req, res) => {
  try {
    const { tenantId, empId, travelRequestId } = req.params;

    const travelRequests = await Approval.find({
      'tenantId': tenantId,
      'approvalType': 'travel',
      'embeddedTravelRequest.travelRequestId': travelRequestId,
      'embeddedTravelRequest.isCashAdvanceTaken': true,
      'embeddedTravelRequest.approvers.empId': empId,
      'embeddedTravelRequest.travelRequestStatus': { $in: ['approved', 'booked'] },
    }).exec();

    if (travelRequests.length === 0) {
      return res.status(404).json({ message: 'No approved or booked travel requests found for this user.' });
    }

    const extractedData = [];

    for (const request of travelRequests) {
      const extractedRequestData = {
        travelRequestStatus: request.embeddedTravelRequest?.travelRequestStatus,
        itineraryCities: request.embeddedTravelRequest?.itinerary.map(item => item.departure.to) || [],
      };

      if (request.embeddedCashAdvance) {
        for (const cashAdvance of request.embeddedCashAdvance.cashAdvances) {
          if (cashAdvance.cashAdvanceStatus === 'pending approval') {
            const {
              amountDetails,
              createdBy,
              tripPurpose,
              cashAdvanceStatus,
              cashAdvanceViolations,
            } = cashAdvance;

            extractedRequestData.amountDetailsCashAdvance = amountDetails.map(amountDetail => ({
              amount: amountDetail.amount,
              currency: amountDetail.currency,
            }));
            extractedRequestData.createdByCashAdvance = createdBy.name || 'EmpName';
            extractedRequestData.tripPurposeCashAdvance = tripPurpose || 'tripPurpose';
            extractedRequestData.cashAdvanceStatus = cashAdvanceStatus || 'CashAdvanceStatus';
            extractedRequestData.cashAdvanceViolations = cashAdvanceViolations || [];
            extractedData.push(extractedRequestData);
          }
        }
      }
    }

    return res.status(200).json(extractedData);
  } catch (error) {
    console.error('An error occurred:', error);
    return res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};

// Standalone cash advance with travel requests 'approved' status for a single tr - details
export const getPendingCashAdvancesForEmployee = async (req, res) => {
  try {
    const { tenantId, empId, travelRequestId } = req.params;

    const travelRequest = await Approval.findOne({
      'tenantId': tenantId,
      'approvalType': 'travel',
      'embeddedTravelRequest.travelRequestId': travelRequestId,
      'embeddedTravelRequest.isCashAdvanceTaken': true,
      'embeddedTravelRequest.approvers.empId': empId,
      'embeddedTravelRequest.travelRequestStatus': { $in: ['approved', 'booked'] },
    }).exec();

    if (!travelRequest) {
      return res.status(404).json({ message: 'No approved or booked travel request found.' });
    }

    const extractedTravelData = {
      travelRequestStatus: travelRequest.embeddedTravelRequest?.travelRequestStatus || 'No Status',
      departureFrom: travelRequest.embeddedTravelRequest?.itinerary.map(item => item.departure.from) || [],
      departureTo: travelRequest.embeddedTravelRequest?.itinerary.map(item => item.departure.to) || [],
      cashAdvances: [],
    };

    if (travelRequest.embeddedCashAdvance) {
      for (const cashAdvance of travelRequest.embeddedCashAdvance.cashAdvances || []) {
        if (cashAdvance.cashAdvanceStatus === 'pending approval') {
          const {
            amountDetails = [],
            createdBy = {},
            tripPurpose,
            cashAdvanceStatus,
            cashAdvanceViolations = [],
          } = cashAdvance;

          const cashAdvanceData = {
            amountDetailsCashAdvance: amountDetails.map(amountDetail => ({
              amount: amountDetail.amount || 0,
              currency: amountDetail.currency || 'Currency',
            })),
            createdByCashAdvance: createdBy.name || 'EmpName',
            tripPurposeCashAdvance: tripPurpose || 'tripPurpose',
            cashAdvanceStatus: cashAdvanceStatus || 'CashAdvanceStatus',
            cashAdvanceViolations,
          };

          extractedTravelData.cashAdvances.push(cashAdvanceData);
        }
      }
    }

    return res.status(200).json(extractedTravelData);
  } catch (error) {
    console.error('An error occurred:', error);
    return res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};



// approve cash advance raised LATER
export const approveCashRaisedLater = async (req, res) => {
  try {
    const { tenantId, empId, travelRequestId } = req.params;

    const approval = await Approval.findOne({
      'tenantId': tenantId,
      'approvalType': 'travel',
      'embeddedTravelRequest.travelRequestId': travelRequestId,
      'embeddedTravelRequest.isCashAdvanceTaken': true,
      'embeddedTravelRequest.approvers.empId': empId,
      'embeddedTravelRequest.travelRequestStatus': { $in: ['approved', 'booked'] },
    }).exec();

    if (!approval) {
      return res.status(404).json({ message: 'No approved or booked travel request found.' });
    }

    approval.embeddedCashAdvance.cashAdvances.forEach((cashAdvance) => {
      if (cashAdvance.cashAdvanceStatus === 'pending approval') {
        cashAdvance.cashAdvanceStatus = 'approved';
      }
    });

    // Save the updated approval document
    const updatedApproval = await approval.save();

    return res.status(200).json({
      message: 'Cash advances approved for the travel request.',
      updatedApproval,
    });
  } catch (error) {
    console.error('An error occurred:', error);
    return res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};


// Reject cash ADVANCE RAISED LATER 
export const rejectCashAdvanceRaisedLater = async (req, res) => {
  try {
    const { tenantId, empId, travelRequestId } = req.params;
    const { rejectionReasons } = req.body;

    const approval = await Approval.findOne({
      'tenantId': tenantId,
      'approvalType': 'travel',
      'embeddedTravelRequest.travelRequestId': travelRequestId,
      'embeddedTravelRequest.isCashAdvanceTaken': true,
      'embeddedTravelRequest.approvers.empId': empId,
      'embeddedTravelRequest.travelRequestStatus': { $in: ['approved', 'booked'] },
    }).exec();

    if (!approval) {
      return res.status(404).json({ message: 'No approved or booked travel request found.' });
    }

    // Update cash advances' rejection reasons
    approval.embeddedCashAdvance.cashAdvances.forEach((cashAdvance) => {
      if (cashAdvance.cashAdvanceStatus === 'pending approval') {
        cashAdvance.cashAdvanceRejectionReason = rejectionReasons || 'No specific reason provided';
        cashAdvance.cashAdvanceStatus = 'rejected';
      }
    });

    // Save the updated approval document
    const updatedApproval = await approval.save();

    return res.status(200).json({
      message: 'Cash advances rejected for the travel request.',
      updatedApproval,
    });
  } catch (error) {
    console.error('An error occurred:', error);
    return res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};
