
//Get travel request for an approver
export const getTravelRequestsByApprovalId = async (req, res) => {
    try {
      const empId = req.params.empId;
  
      // Use the Mongoose model for 'Approval' to find all travel requests where the provided empId exists in the 'approvers' array within 'embeddedTravelRequest'
      const travelRequests = await Approval.find(
        {
          'embeddedTravelRequest.approvers.empId': empId,
          'embeddedTravelRequest.travelRequestStatus': 'pending approval',
        },
        {
          'embeddedTravelRequest.travelRequestId': 1,
          'embeddedTravelRequest.createdBy.name': 1,
          'embeddedTravelRequest.tripPurpose': 1,
          'embeddedTravelRequest.itinerary.cities': 1,
        }
      ).exec();
  
      if (travelRequests.length === 0) {
        // If no travel requests are found, respond with a 404 Not Found status and a specific message
        return res.status(404).json({ message: 'No pending travel requests found for this user.' });
      }
  
      // Extracted fields are added as objects in an array
      const extractedRequests = travelRequests.map((request) => {
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
  
      // If travel requests are found, respond with a 200 OK status and the array of extracted fields
      return res.status(200).json(extractedRequests);
    } catch (error) {
      // Handle and log errors
      console.error('An error occurred:', error);
      // Respond with a 500 Internal Server Error status and an error message
      return res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
  };
  