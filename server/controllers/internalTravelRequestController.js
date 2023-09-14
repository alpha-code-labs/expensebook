import TravelRequest from "../models/travelRequest.js";

const getTravelRequestStatus = async (req, res) => {
  try {
    const { travelRequestId } = req.params;
    const travelRequestStatus = await TravelRequest.findOne(
      { travelRequestId },
      { travelRequestStatus }
    );

    if (!travelRequestStatus) {
      return res.status(404).json({ message: "Document not found" });
    }

    return res.status(200).json(travelRequestStatus);
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getTravelRequest = async (req, res) => {
  try {
    const { travelRequestId } = req.params;
    const travelRequest = TravelRequest.findOne({ travelRequestId });

    if (!travelRequest) {
      return res.status(404).json({ message: "not found" });
    }

    return res.status(200).json({ travelRequest });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//get all travel requests having a particular status
const getTravelRequests = async (req, res) => {
  try {
    const { travelRequestStatus } = req.body;
    const travelRequest = TravelRequest.find({ travelRequestStatus });

    if (!travelRequest) {
      return res.status(404).json({ message: "not found" });
    }

    return res.status(200).json({ travelRequest });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateTravelRequestStatus = async (req, res) => {
  try {
    const { travelRequestId } = req.params;
    const { travelRequestStatus } = req.body;
    await TravelRequest.findOneAndUpdate(
      { travelRequestId },
      { travelRequestStatus }
    );

    if (!travelRequestStatus) {
      return res.status(404).json({ message: "Document not found" });
    }

    return res.status(200).json(travelRequestStatus);
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateTravelRequest = async (req, res) => {
    try {
      const requiredFields = [
        "travelRequestStatus",
        "travelRequestState",
        "createdFor",
        "travelAllocationHeaders",
        "itinerary",
        "travelDocuments",
        "approvers",
        "preferences",
        "travelViolations",
      ];
  
      // Check if all required fields are present in the request body
      const fieldsPresent = requiredFields.every((field) => req.body[field]);
  
      if (!fieldsPresent) {
        return res.status(400).json({ message: "Required fields are missing." });
      }
  
      //other validation methods are also needed,
  
      const { travelRequestId } = req.params;
      await TravelRequest.findOneAndUpdate(travelRequestId, req.body);
      return res
        .status(200)
        .json({ message: "Travel Request updated successfully" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

export {getTravelRequest, updateTravelRequest, getTravelRequestStatus, updateTravelRequestStatus, getTravelRequests}