import { Approval } from '../models/approvalSchema.js';
import { fetchTravelRequestData } from '../services/travelService.js';
import { fetchCashAdvanceData } from '../services/cashService.js';

// TO SAVE DUMMY DATA INTO APPROVALS DATABASE
export const saveTravelRequestsAndCashAdvances = async (req, res) => {
  try {
    const travelRequests = await fetchTravelRequestData();
    const cashAdvances = await fetchCashAdvanceData();

    for (const travelRequest of travelRequests) {
      const existingApproval = await Approval.findOne({
        tenantId: travelRequest.tenantId,
        tenantName: travelRequest.tenantName,
        approvalType:'travel',
        'embeddedTravelRequest.travelRequestId': travelRequest.travelRequestId,
      });

      if (!existingApproval) {
        await Approval.create({  
          tenantId: travelRequest.tenantId,
          tenantName: travelRequest.tenantName,
          approvalType:'travel', 
          embeddedTravelRequest: travelRequest 
        });
      }

      const matchingCashAdvance = cashAdvances.find((cashAdvance) => 
        cashAdvance.travelRequestId === travelRequest.travelRequestId &&
        cashAdvance.tenantId === travelRequest.tenantId &&
        cashAdvance.tenantName === travelRequest.tenantName
      );

      if (matchingCashAdvance) {
        const approvalData = {
          embeddedTravelRequest: travelRequest,
          embeddedCashAdvance: matchingCashAdvance,
        };
        console.error('Approval Data:', approvalData);

        console.log('Approval Data:', approvalData); 
        await Approval.findOneAndUpdate(
          { 
            tenantId: travelRequest.tenantId,
            tenantName: travelRequest.tenantName,
            approvalType:'travel',
            'embeddedTravelRequest.travelRequestId': travelRequest.travelRequestId 
          },
          approvalData
        );
      }

    
    }

    console.log('Success: Travel requests and cash advances saved or updated in the approval container.');
    res.status(200).json({ message: 'Success: Travel requests and cash advances saved or updated in the approval container.' });

  } catch (error) {
    console.error('An error occurred while saving travel requests and cash advances:', error.message);
    res.status(500).json({ error: 'An error occurred while saving data.' });
  }
};



//Search Travel requests by tripPurpose or destination or EmployeeName for an approver
export const getTravelRequestByField = async (req, res) => {
  try {
    const {tenantId, empId} = req.params;
    const { field, value } = req.query.tripPurpose || req.query.to || req.query.name;

    // Validate that 'field' is one of the expected values
    const validFields = ['tripPurpose', 'destination', 'employeeName'];
    if (!validFields.includes(field)) {
      return res.status(400).json({ error: 'Invalid query field.' });
    }

    // Create a dynamic query object based on the provided field
    const query = {
      'tenantId':tenantId,
      'embeddedTravelRequest.approvers.empId': empId,
    };

    // Construct the field-specific query based on the 'field' parameter
    switch (field) {
      case 'tripPurpose':
        query['embeddedTravelRequest.tripPurpose'] = value;
        break;
      case 'destination':
        query['embeddedTravelRequest.itinerary.cities.to'] = value;
        break;
      case 'employeeName':
        query['embeddedTravelRequest.createdBy.name'] = value;
        break;
    }

    // Use the Mongoose model for 'Approval' to find a travel request based on the dynamic query
    const travelRequest = await Approval.findOne(query).exec();

    if (!travelRequest) {
      // If no matching travel request is found, respond with a 404 Not Found status and a specific message
      return res.status(404).json({ message: 'No matching travel request found for this user.' });
    }

    // Extracted fields are added as objects in an array
    const allExtractedRequests = travelRequest.map((request) => {
      const extractedData = {};
      
      if (request.embeddedTravelRequest.travelRequestId) {
        extractedData.travelRequestId = request.embeddedTravelRequest.travelRequestId;
      }

      if (request.embeddedTravelRequest.createdBy) {
        extractedData.createdBy = request.embeddedTravelRequest.createdBy;
      }

      if (request.embeddedTravelRequest.tripPurpose) {
        extractedData.tripPurpose = request.embeddedTravelRequest.tripPurpose;
      }

      if (request.embeddedTravelRequest.itinerary) {
        extractedData.departure = request.embeddedTravelRequest.itinerary;
      }
      console.log(extractedData)
      return extractedData;
    });

    // Respond with a 200 OK status and the extracted data
    return res.status(200).json(allExtractedRequests);
  } catch (error) {
    // Handle and log errors
    console.error('An error occurred:', error);
    // Respond with a 500 Internal Server Error status and an error message
    return res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};






