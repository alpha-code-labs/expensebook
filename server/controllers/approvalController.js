import { Approval } from '../models/approvalSchema.js';
import { fetchTravelRequestData } from '../services/travelService.js';
import { fetchCashAdvanceData } from '../services/cashService.js';

// Save Travel Requests and Cash Advances
export const saveTravelRequestsAndCashAdvances = async (req, res) => {
  try {
    const travelRequests = await fetchTravelRequestData();
    const cashAdvances = await fetchCashAdvanceData();

    for (const travelRequest of travelRequests) {
      // Check if an approval record with the same travelRequestId already exists
      const existingApproval = await Approval.findOne({
        'embeddedTravelRequest.travelRequestId': travelRequest.travelRequestId,
      });

      if (!existingApproval) {
        // If no approval record exists, create a new one with the travel request
        await Approval.create({ embeddedTravelRequest: travelRequest });
      }

      const matchingCashAdvance = cashAdvances.find(
        (cashAdvance) => cashAdvance.travelRequestId === travelRequest.travelRequestId
      );

      if (matchingCashAdvance) {
        // Check if the travel request ID in the embedded cash advance object matches the travel request ID in the embedded travel request object
        if (matchingCashAdvance.embeddedTravelRequest.travelRequestId === travelRequest.travelRequestId) {
          // Save the embedded cash advance object with its respective embedded travel request object
          const approvalData = {
            embeddedTravelRequest: travelRequest,
            embeddedCashAdvance: matchingCashAdvance,
          };

          // Update the approval record with the new data
          await Approval.findOneAndUpdate(
            { 'embeddedTravelRequest.travelRequestId': travelRequest.travelRequestId },
            approvalData
          );
        }
      }
    }

    console.log('Success: Travel requests and cash advances saved or updated in the approval container.');

    res.status(200).json({ message: 'Success: Travel requests and cash advances saved or updated in the approval container.' });

  } catch (error) {
    console.error('An error occurred while saving travel requests and cash advances:', error.message);
    res.status(500).json({ error: 'An error occurred while saving data.' });
  }
};


// // Get travel request for an approver
// export const getTravelRequestsByApprovalId = async (req, res) => {
//   try {
//     const empId = req.params.empId;

//     // Use the Mongoose model for 'Approval' to find all travel requests where the provided empId exists in the 'approvers' array within 'embeddedTravelRequest'
//     const travelRequests = await Approval.find(
//       {
//         'embeddedTravelRequest.approvers.empId': empId,
//         'embeddedTravelRequest.travelRequestStatus': 'pending approval',
//       },
//       {
//         'embeddedTravelRequest.travelRequestId': 1,
//         'embeddedTravelRequest.createdBy.name': 1,
//         'embeddedTravelRequest.tripPurpose': 1,
//         'embeddedTravelRequest.itinerary.cities': 1,
//       }
//     ).exec();

//     if (travelRequests.length === 0) {
//       // If no travel requests are found, respond with a 404 Not Found status and a specific message
//       return res.status(404).json({ message: 'No pending travel requests found for this user.' });
//     }

//     // Extracted fields are added as objects in an array
//     const extractedRequests = travelRequests.map((request) => {
//       const extractedData = {};

//       // Handle the 'travelRequestId' field
//       if (request.embeddedTravelRequest.travelRequestId) {
//         extractedData.travelRequestId = request.embeddedTravelRequest.travelRequestId;
//       } else {
//         extractedData.travelRequestId = 'No Travel Request ID Available';
//       }

//       // Handle the 'createdBy' field
//       if (request.embeddedTravelRequest.createdBy && request.embeddedTravelRequest.createdBy.name) {
//         extractedData.createdBy = request.embeddedTravelRequest.createdBy.name;
//       } else {
//         extractedData.createdBy = 'Unknown';
//       }

//       // Handle the 'tripPurpose' field
//       if (request.embeddedTravelRequest.tripPurpose) {
//         extractedData.tripPurpose = request.embeddedTravelRequest.tripPurpose;
//       } else {
//         extractedData.tripPurpose = 'No Trip Purpose Available';
//       }

//       // Handle the 'departureCity' field
//       if (request.embeddedTravelRequest.itinerary && request.embeddedTravelRequest.itinerary.cities) {
//         extractedData.departureCity = request.embeddedTravelRequest.itinerary.cities;
//       } else {
//         extractedData.departureCity = 'No Departure City Available';
//       }

//       return extractedData;
//     });

//     // If travel requests are found, respond with a 200 OK status and the array of extracted fields
//     return res.status(200).json(extractedRequests);
//   } catch (error) {
//     // Handle and log errors
//     console.error('An error occurred:', error);
//     // Respond with a 500 Internal Server Error status and an error message
//     return res.status(500).json({ error: 'An error occurred while processing the request.' });
//   }
// };

// //Get travel request for an approver
// export const getTravelRequestsByApprovalId = async (req, res) => {
//   try {
//     const empId = req.params.empId;

//     // Use the Mongoose model for 'Approval' to find all travel requests where the provided empId exists in the 'approvers' array within 'embeddedTravelRequest'
//     const travelRequests = await Approval.find(
//       {
//         'embeddedTravelRequest.approvers.empId': empId,
//         'embeddedTravelRequest.travelRequestStatus': 'pending approval',
//       },
//       {
//         'embeddedTravelRequest.travelRequestId': 1,
//         'embeddedTravelRequest.createdBy.name': 1,
//         'embeddedTravelRequest.tripPurpose': 1,
//         'embeddedTravelRequest.itinerary.cities': 1,
//       }
//     ).exec();

//     if (travelRequests.length === 0) {
//       // If no travel requests are found, respond with a 404 Not Found status and a specific message
//       return res.status(404).json({ message: 'No pending travel requests found for this user.' });
//     }

//     // Extracted fields are added as objects in an array
//     const extractedRequests = travelRequests.map((request) => {
//       const extractedData = {};
      
//       if (request.embeddedTravelRequest.travelRequestId) {
//         extractedData.travelRequestId = request.embeddedTravelRequest.travelRequestId;
//       }

//       if (request.embeddedTravelRequest.createdBy.name) {
//         extractedData.createdBy = request.embeddedTravelRequest.createdBy.name;
//       }

//       if (request.embeddedTravelRequest.tripPurpose) {
//         extractedData.tripPurpose = request.embeddedTravelRequest.tripPurpose;
//       }

//       if (request.embeddedTravelRequest.itinerary.cities) {
//         extractedData.departureCity = request.embeddedTravelRequest.itinerary.cities;
//       }
//       console.log(extractedData)
//       return extractedData;
//     });

//     // If travel requests are found, respond with a 200 OK status and the array of extracted fields
//     return res.status(200).json(extractedRequests);
//   } catch (error) {
//     // Handle and log errors
//     console.error('An error occurred:', error);
//     // Respond with a 500 Internal Server Error status and an error message
//     return res.status(500).json({ error: 'An error occurred while processing the request.' });
//   }
// };


//Search Travel requests by tripPurpose or destination or EmployeeName for an approver
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

      if (request.embeddedTravelRequest.createdBy.name) {
        extractedData.createdBy = request.embeddedTravelRequest.createdBy.name;
      }

      if (request.embeddedTravelRequest.tripPurpose) {
        extractedData.tripPurpose = request.embeddedTravelRequest.tripPurpose;
      }

      if (request.embeddedTravelRequest.itinerary.cities) {
        extractedData.departureCity = request.embeddedTravelRequest.itinerary.cities;
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
//     //   'embeddedTravelRequest.approvers': {
//     //     $elemMatch: {
//     //       id: approversId,
//     //     },
//     //   },
//     //   'embeddedTravelRequest.travelRequestStatus': 'pending approval',
//     // });
//     const pendingRequests = await approval.find({
//       'embeddedTravelRequest.approvers.id': approversId,
//       'embeddedTravelRequest.travelRequestStatus': 'pending approval',
//     });
    

//     // If no matching requests are found, return a message
//     if (!pendingRequests || pendingRequests.length === 0) {
//      return res.status(200).json({ message: 'No pending approval requests found.' });
//     }

//     // Extract the required fields from each request and create a new array
//     const extractedRequests = pendingRequests.map((approval) => ({
//       employeeName: approval.embeddedTravelRequest.createdFor.name,
//       tripPurpose: approval.embeddedTravelRequest.tripPurpose,
//       destination: {
//         from: approval.embeddedTravelRequest.itinerary.departureCity,
//         to: approval.embeddedTravelRequest.itinerary.arrivalCity,
//       },
//       dates: { 
//         startDate: approval.embeddedTravelRequest.itinerary.departureDate,
//         endDate: approval.embeddedTravelRequest.itinerary.returnDate,
//       },
//       createdFor: approval.embeddedTravelRequest.createdFor.id,
//     }));

//     // Send the extracted data as a response
//     return res.status(200).json(extractedRequests);
//   } catch (error) {
//     console.error('Error fetching pending approval requests:', error);

//     // Return a more informative error response
//     return res.status(500).json({ error: 'An error occurred while fetching pending approval requests.' });
//   }
// };
