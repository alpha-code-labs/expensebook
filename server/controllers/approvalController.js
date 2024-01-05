import { Approval } from '../models/approvalSchema.js';
import { travelRequestData, cashAdvancesData } from '../dummyData/dummyData.js';

// Extract the logic to create the approvalData object
const createApprovalData = (travelRequest, cashAdvance) => {
  const { tenantId, tenantName, companyName } = travelRequest;

  return {
    tenantId,
    tenantName,
    companyName,
    approvalType: travelRequest.approvalType || 'travel', // Default value 'travel'
    travelRequestData: travelRequest,
    cashAdvancesData: cashAdvance,
    notificationSentToDashboardFlag: false, // You may set this based on your logic
  };
};

export const createOrUpdateApproval = async (travelRequest, cashAdvance) => {
  try {
    // Call the createApprovalData function to get the approvalData object
    const approvalData = createApprovalData(travelRequest, cashAdvance);

    // Check if an approval record with the same travelRequestId already exists
    const existingApproval = await Approval.findOne({
      'travelRequestData.travelRequestId': travelRequest.travelRequestId,
    });

    if (existingApproval) {
      // If approval record exists, update it
      await Approval.findOneAndUpdate(
        { 'travelRequestData.travelRequestId': travelRequest.travelRequestId },
        approvalData
      );
    } else {
      // If no approval record exists, create a new one
      await Approval.create(approvalData);
    }

    console.log(`Success: Approval record created or updated for travelRequestId ${travelRequest.travelRequestId}`);
  } catch (error) {
    console.error('An error occurred while creating or updating approval record:', error.message);
    throw error;
  }
};

// Iterate through each travel request and associated cash advance
for (const travelRequest of travelRequestData) {
  const matchingCashAdvance = cashAdvancesData.find(
    (cashAdvance) => cashAdvance.travelRequestId === travelRequest.travelRequestId
  );

  if (matchingCashAdvance) {
    await createOrUpdateApproval(travelRequest, matchingCashAdvance);
  }
}



export const lsaveTravelRequestsAndCashAdvances = async (req, res) => {
  try {
    const travelRequestData = await fetchTravelRequestData();

    for (const travelRequest of travelRequestData) {
      const existingApproval = await Approval.findOne({
        'travelRequestData.travelRequestId': travelRequest.travelRequestId,
      });

      if (!existingApproval) {
        await Approval.create({ travelRequestData: travelRequest });
      }

      const matchingCashAdvance = travelRequest.cashAdvance; 

      if (matchingCashAdvance) {
        if (matchingCashAdvance.travelRequestData.travelRequestId === travelRequest.travelRequestId) {
          await updateOrCreateApproval(travelRequest, matchingCashAdvance);
        }
      }
    }

    console.log('Success: Travel requests and cash advances saved or updated in the approval container.');

    res.status(200).json({
      message: 'Success: Travel requests and cash advances saved or updated in the approval container.',
    });
  } catch (error) {
    console.error('An error occurred while saving travel requests and cash advances:', error.message);
    res.status(500).json({ error: 'An error occurred while saving data.' });
  }
};

export const getTravelRequestByField = async (req, res) => {
  try {
    const empId = req.params.empId;
    const { field, value } = req.query.tripPurpose || req.query.to || req.query.name;

    // Validate that 'field' is one of the expected values
    const validFields = ['tripPurpose', 'destination', 'employeeName'];
    if (!validFields.includes(field)) {
      return res.status(400).json({ error: 'Invalid query field.' });
    }

    // Create a dynamic query object based on the provided field
    const query = {
      'travelRequestData.approvers.empId': empId,
    };

    // Construct the field-specific query based on the 'field' parameter
    switch (field) {
      case 'tripPurpose':
        query['travelRequestData.tripPurpose'] = value;
        break;
      case 'destination':
        query['travelRequestData.itinerary.cities.to'] = value;
        break;
      case 'employeeName':
        query['travelRequestData.createdBy.name'] = value;
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
      
      if (request.travelRequestData.travelRequestId) {
        extractedData.travelRequestId = request.travelRequestData.travelRequestId;
      }

      if (request.travelRequestData.createdBy.name) {
        extractedData.createdBy = request.travelRequestData.createdBy.name;
      }

      if (request.travelRequestData.tripPurpose) {
        extractedData.tripPurpose = request.travelRequestData.tripPurpose;
      }

      if (request.travelRequestData.itinerary.cities) {
        extractedData.departureCity = request.travelRequestData.itinerary.cities;
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


















// export const getPendingApprovalRequests = async (req, res) => {
//   const approversId = req.params.approversId;

//   try {
//     // Find all approvals where the embedded TravelRequest matches the criteria
//     // const pendingRequests = await approval.find({
//     //   'travelRequestData.approvers': {
//     //     $elemMatch: {
//     //       id: approversId,
//     //     },
//     //   },
//     //   'travelRequestData.travelRequestStatus': 'pending approval',
//     // });
//     const pendingRequests = await approval.find({
//       'travelRequestData.approvers.id': approversId,
//       'travelRequestData.travelRequestStatus': 'pending approval',
//     });
    

//     // If no matching requests are found, return a message
//     if (!pendingRequests || pendingRequests.length === 0) {
//      return res.status(200).json({ message: 'No pending approval requests found.' });
//     }

//     // Extract the required fields from each request and create a new array
//     const extractedRequests = pendingRequests.map((approval) => ({
//       employeeName: approval.travelRequestData.createdFor.name,
//       tripPurpose: approval.travelRequestData.tripPurpose,
//       destination: {
//         from: approval.travelRequestData.itinerary.departureCity,
//         to: approval.travelRequestData.itinerary.arrivalCity,
//       },
//       dates: { 
//         startDate: approval.travelRequestData.itinerary.departureDate,
//         endDate: approval.travelRequestData.itinerary.returnDate,
//       },
//       createdFor: approval.travelRequestData.createdFor.id,
//     }));

//     // Send the extracted data as a response
//     return res.status(200).json(extractedRequests);
//   } catch (error) {
//     console.error('Error fetching pending approval requests:', error);

//     // Return a more informative error response
//     return res.status(500).json({ error: 'An error occurred while fetching pending approval requests.' });
//   }
// };
