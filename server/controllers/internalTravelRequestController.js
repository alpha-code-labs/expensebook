import TravelRequest from "../models/travelRequest.js";
import HRMaster from "../models/hrMaster.js";

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
      "cancelled",
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
      "cancelled",
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

const updateCashAdvanceFlag = async (req, res) => {
  try {
    const { travelRequestId } = req.params;
    let { isCashAdvanceTaken } = req.body;

    //everything is okay attempt updating status
    const result = await TravelRequest.findOneAndUpdate(
      { travelRequestId },
      {$set: {isCashAdvanceTaken} }
    );
    
    if (!result) {
      return res.status(404).json({ message: "Record not found" });
    }


    return res.status(200).json({
      message: `isCashAdvanceTaken flag updated`,
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
      "tripPurpose",
      "travelAllocationHeaders",
      "itinerary",
      "travelDocuments",
      "approvers",
      "preferences",
      "teamMembers",
      "travelViolations",
    ];

    // Check if one of the required fields are present in the request body
    const fieldsPresent = requiredFields.some((field) => field in req.body);

    if (!fieldsPresent) {
      return res.status(400).json({ message: "You haven't provided any valid fields to update" });
    }

    const {
      tenantId,
      travelRequestStatus,
      travelRequestState,
    } = req.body;

    if(!tenantId || tenantId==null || tenantId == "") {
      return res.status(400).json({ message: "tenant Id is missing" });
    }

    //validate tenant Id


    //validate status
    const status = [
      'draft', 
    'pending approval', 
    'approved', 
    'rejected', 
    'pending booking', 
    'booked',
    'transit', 
    'cancelled',  
    ];

    if (travelRequestStatus && travelRequestStatus !="" && !status.includes(travelRequestStatus)) {
      return res.status(400).json({ message: "Invalid status ", travelRequestStatus });
    }

    //validate state
    const state = ["section 0", "section 1", "section 2", "section 3", "section 4", "section 5"];
    
    if (travelRequestState && travelRequestState !="" && !state.includes(travelRequestState)) {
      return res.status(400).json({ message: "Invalid state ", travelRequestState });
    }

    //other validation methods are also needed,

    const expectedFields = [
      "createdFor",
      "teamMembers",
      "tripPurpose",
      "travelRequestStatus",
      "travelRequestState",
      "travelAllocationHeaders",
      "itinerary",
      "travelDocuments",
      "approvers",
      "preferences",
      "travelViolations",
      "isModified",
      "isCancelled",
      "cancellationDate",
      "cancellationReason",
      "sentToTrip",
      "isCashAdvanceTaken"
    ];
    
    // Initialize an array to store the updated fields that are present in the request
    const present = [];
    
    // Check which fields are present in the request
    for (const field of expectedFields) {
      if (req.body.hasOwnProperty(field)) {
        present.push(field);
      }
    }
    
    const updatedFields = {};
    present.forEach((field) => {updatedFields[field] = req.body[field]});
    console.log(updatedFields);

    const { travelRequestId } = req.params;
    //validate travelRequestId
    const travelRequestExists = await TravelRequest.findOne({travelRequestId}, {travelRequestId})
    if(!travelRequestExists || travelRequestExists.length==0){
      return res.status(404).json({message: 'Travel Request not found'})
    }

    //check if cash advance is taken
    if(req.body.hasOwnProperty('isCashAdvanceTaken')){
      if(req.body.isCashAdvanceTaken){
        //send data to cash microservice

      }
    }
    
    await TravelRequest.findOneAndUpdate({travelRequestId}, {$set: updatedFields});

    //check for approvers
    if(travelRequestStatus==='pending approval'){
      if(req.body.hasOwnProperty('approvers')){
        if(req.body.approvers.length>0){
          // might need to 
          //check with t&e how many approvers should be there
          //and wether he is selecting correct approvers
  
          // send data to approval microservice

         // return res.status(200).json({message: 'Travel Request submitted for approval'})
        }
      }
    }

    if(travelRequestStatus==='pending booking'){
      return res.status(200).json({message: 'Travel Request submitted for booking'})
    }

    return res.status(200).json({ message: "Travel Request updated" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateOnboardingContainer = async (req, res) => {
  //this is an internal request to update/create HRMaster. so trusting it fully and proceeding without validations
  try{
    const {hrMasterData} = req.body
    if(hrMasterData==undefined || hrMasterData==null){
      res.status(400).json({message:'Bad Request, missing hr data in request body'})
      return
    }

    const tenantId = hrMasterData?.tenantId

    if(!tenantId){
      res.status(400).json({message:'Bad Request, data missing tenantId'})
      return
    }
    //check if tenant already exists
    console.log('finding tenant')
    const tenant = await HRMaster.find({tenantId}, {tenantId:1})

    //sanitize data
    delete hrMasterData._id
    delete hrMasterData._v

    if(!tenant || tenant.length===0){
      console.log('tenant doe not exists')
      //create new tenant entry
      const newHRMaster = new HRMaster({...hrMasterData})
      await newHRMaster.save()
      res.status(201).json({message:'tenant Hr Data added to database'})
    }
    else{
      console.log('tenant exists', tenant)
      //update tenant
      const updatedTenant = await HRMaster.findOneAndUpdate({tenantId}, {...hrMasterData}, {new:true})
      console.log(updatedTenant)
      res.status(200).json({message:'tenant Hr Data updated'})
    }

  }catch(e){
    console.log(e)
  }
}

export {
  getTravelRequest,
  updateTravelRequest,
  getTravelRequestStatus,
  updateTravelRequestStatus,
  updateCashAdvanceFlag,
  getTravelRequests,
  updateOnboardingContainer,
};
