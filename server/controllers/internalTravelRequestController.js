import TravelRequest from "../models/travelRequest.js";

const getTravelRequestStatus = async (req, res) => {
  try {
    const { travelRequestId } = req.params;
    const travelRequestStatus = await TravelRequest.findOne(
      { travelRequestId },
      { travelRequestStatus: 1 }
    );

    if (!travelRequestStatus) {
      return res.status(404).json({ message: "Document not found" });
    }

    return res.status(200).json(travelRequestStatus);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getTravelRequest = async (req, res) => {
  try {
    const { travelRequestId } = req.params;
    const travelRequest = await TravelRequest.findOne({ travelRequestId });

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
    const  travelRequestStatus  = req?.query?.status.toLowerCase();
    console.log(req.query, 'query')
    console.log(travelRequestStatus, 'status')

    const status = [
      "draft",
      "approved",
      "rejected",
      "booked",
      "canceled",
      "completed",
    ];

    if (!status.includes(travelRequestStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const travelRequest = await TravelRequest.find({ travelRequestStatus });

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
    let { travelRequestStatus } = req.body;

    //check if received status is valid
    travelRequestStatus.toLowerCase();
    const status = [
      "draft",
      "approved",
      "rejected",
      "booked",
      "canceled",
      "completed",
    ];

    if (!status.includes(travelRequestStatus.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status" });
    }

    //everything is okay attempt updating status
    const result = await TravelRequest.findOneAndUpdate(
      { travelRequestId },
      { travelRequestStatus }
    );
    
    if (!result) {
      return res.status(404).json({ message: "Record not found" });
    }


    return res.status(200).json({
      message: `Status updated to ${travelRequestStatus}`,
    });
  } catch (e) {
    console.error(e);
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
    const fieldsPresent = requiredFields.every((field) => field in req.body);

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

export {
  getTravelRequest,
  updateTravelRequest,
  getTravelRequestStatus,
  updateTravelRequestStatus,
  getTravelRequests,
};
