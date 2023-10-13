import travelRequestsJsonData from "../dummyData/dummyData.js";
import { policiesData } from '../dummyData/cashAdvancePolicy.js';
import  createCashAdvanceId  from "../utils/createCashAdvanceId.js";
import CashAdvance from '../models/cashSchema.js';


const createCashAdvance = async (req, res) => {
  try {
    const { travelRequestId } = req.params;
    const travelRequestData = travelRequestsJsonData.find(
      (data) => data.travelRequestId === travelRequestId
    );

    if (!travelRequestData) {
      return res.status(404).json({ error: 'Travel request not found' });
    }

    const requiredFields = [
      // "tenantId",
      "amountDetails",
      "approvers",
    ];

    console.log(req.body);

    const fieldsPresent = requiredFields.every((field) => field in req.body);

    if (!fieldsPresent) {
      return res.status(400).json({ message: "Required headers are not present" });
    }

    // Policy validation
    const amountDetails = req.body.amountDetails;
    if (Array.isArray(amountDetails) && amountDetails.length > 0) {
      const { amount } = amountDetails[0];
      const { amount: policyAmount, violationMessage } = policiesData.policies.domestic["group 1"]["cash advance"];

      console.log("amount:", amount);
      console.log("policyAmount:", policyAmount);

      if (amount > policyAmount) {
        console.log("Policy violation detected.");
        var cashAdvanceViolations = violationMessage;
        
        // return res.status(400).json({ error: violationMessage });
      } else {
        console.log("No policy violation.");
      }
    }

    const travelRequestStatus = travelRequestData.travelRequestStatus; // Data from TR API
    const cashAdvanceCreatedBy = travelRequestData.createdBy;
    const tenantId = travelRequestData.tenantId;
    const cashAdvanceId = createCashAdvanceId(tenantId, cashAdvanceCreatedBy);

    const cashAdvanceApprovers = req.body.approvers;
    let cashAdvanceStatus = '';
    let cashAdvanceState = '';

    switch (travelRequestStatus) {
      case 'draft':
        cashAdvanceStatus = 'draft';
        cashAdvanceState = 'section 1';
        break;
      case 'booked':
      case 'approved':
        if (cashAdvanceApprovers.length > 0) {
          cashAdvanceStatus = 'pending approval';
        } else {
          cashAdvanceStatus = 'pending settlement';
        }
        cashAdvanceState = 'section 3';
        break;
      case 'pending booking':
      case 'pending approval':
        if (cashAdvanceApprovers.length > 0) {
          cashAdvanceStatus = 'pending approval';
        } else {
          cashAdvanceStatus = 'awaiting pending settlement';
        }
        cashAdvanceState = 'section 3';
        break;
      default:
        break;
    }

    const cashAdvanceData = {
      ...req.body,
      tenantId: tenantId,
      embeddedTravelRequest: travelRequestData,
      travelRequestId: travelRequestId,
      cashAdvanceRequestDate: Date.now(),
      cashAdvanceStatus: cashAdvanceStatus,
      cashAdvanceState: cashAdvanceState,
      cashAdvanceId: cashAdvanceId,
      createdBy: cashAdvanceCreatedBy,
      cashAdvanceViolations: cashAdvanceViolations,
      cashAdvanceApprovalDate:null,
      cashAdvanceSettlementDate:null,
      cashAdvanceRejectionReason:null,
      additionalCashAdvanceField:null
    };

    const newCashAdvance = new CashAdvance(cashAdvanceData);
    await newCashAdvance.save();
    // Cash advance status
    let message = '';
    if (cashAdvanceStatus === 'draft') {
      message = `Cash advance status is ${cashAdvanceStatus}. Submit the travel request before creating a cash advance.`;
    } else if (cashAdvanceStatus === 'pending approval') {
      message = 'Cash advance submitted successfully and is pending approval.';
    } else if (cashAdvanceStatus === 'pending settlement') {
      message = 'Cash advance submitted successfully and is pending settlement.';
    } else if (cashAdvanceStatus === 'awaiting pending settlement') {
      message = 'Awaiting for book the Travel Request.';
    }

    return res.status(201).json({ message: message, data: newCashAdvance });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while creating the cash advance' });
  }
}



const getCashAdvances= async (req, res) => {
  try {
    const cashAdvanceRequests = await CashAdvance.find();

    if (!cashAdvanceRequests) {
      return res.status(404).json({ message: "Cash Advance requests not found" });
    }

    if (cashAdvanceRequests.length===0) {
      return res.status(201).json({ message: "Cash Advance is not in Inbox" });
    }
    

    return res.status(200).json({ cashAdvanceRequests });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export { createCashAdvance ,getCashAdvances };
