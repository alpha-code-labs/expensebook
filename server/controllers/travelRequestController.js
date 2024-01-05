import CashAdvance from "../models/cashSchema.js";
import { sendToDashboardQueue } from "../rabbitMQ/publisher.js";
import {fetchOnboardingData} from "../services/onboardingService.js";
import policyValidation from "../utils/policyValidation.js";
import axios from 'axios'


const TRAVEL_API_URL = 'http://localhost:8001/travel/internal/api'
const APPROVAL_API_URL = 'http://localhost:8001/approval/api'
const FINANCE_API_URL = 'http://localhost:8001/finance/api'
const TRIP_API_URL = 'http://localhost:8001/trip/api'

const getOnboardingAndProfileData = async (req, res) => {
  try {
    const { tenantId, employeeId } = req.params;

    if (!tenantId || !employeeId) {
      return res.status(400).json({ message: "Bad request" });
    }
    const onboardingData = await fetchOnboardingData(tenantId, employeeId);
    //const profileData = await fetchProfileData(tenantId, employeeId);

    res.status(200).json(onboardingData /** , profileData */);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTravelRequest = async (req, res) => {
  try {
    const { travelRequestId } = req.params;
    if (!travelRequestId) {
      return res
        .status(400)
        .json({ message: "missing travel request identifier" });
    }

    const travelRequest_res = await CashAdvance.findOne(
      { travelRequestId },
      { travelRequestData: 1, cashAdvancesData:1}
    );
      
    console.log(travelRequest_res)

    const travelRequest = travelRequest_res?.travelRequestData
    const cashAdvances = travelRequest_res?.cashAdvancesData
  
    if (!travelRequest) {
      return res.status(404).json({ message: "not found" });
    }

    return res.status(200).json({travelRequest, cashAdvances});
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const validateTravelPolicy = async (req, res) => {
  try {
    const { type, groups, policy, value } = req.params;
    //input validation needed
    console.log(type, groups, policy, value)

    const validation = await policyValidation(type.toLowerCase(), groups.map(group=>group.toLowerCase()), policy.toLowerCase(), value.toLowerCase());
    console.log(validation)
    return res.status(200).json(validation);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateTravelRequest__ = async (req, res) => {
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
      "cashAdvances",
    ];

    // Check if one of the required fields are present in the request body
    const fieldsPresent = requiredFields.some((field) => field in req.body);

    if (!fieldsPresent) {
      return res.status(400).json({ message: "No valid fields provided to update" });
    }

    const {
      tenantId,
      travelRequestState,
      travelRequestStatus
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
    'canceled',
    'closed',  
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
      "bookings",
      "travelViolations",
      "isModified",
      "isCancelled",
      "cancellationDate",
      "cancellationReason",
      "sentToTrip",
      "cashAdvances"
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
    const ca_res = await CashAdvance.findOne({'travelRequestData.travelRequestId': travelRequestId}, {travelRequestId:1, travelRequestData:1, cashAdvancesData:1})
    let travelRequest = ca_res.travelRequestData
    let cashAdvances = ca_res.cashAdvancesData

    if(!travelRequest){
      return res.status(404).json({message: 'Travel Request not found'})
    }
    
    //update travelRequest and cashAdvances
    Object.keys(updatedFields).forEach(fieldKey=>{
      if(fieldKey == 'cashAdvances'){
        if(req.body.cashAdvances != null){
          cashAdvances = req.body.cashAdvances
        }
        else{
          travelRequest[fieldKey] = req.body[fieldKey]
        }
      }  
    })

    if(travelRequest.approvers.length>0){
      travelRequest.travelRequestStatus = 'pending approval'
    }
    else{
      travelRequest.travelRequestStatus = 'pending booking'
    }

    const latestCA = await CashAdvance.findOneAndUpdate({'travelRequestData.travelRequestId': travelRequestId}, {$set:{travelRequestData:travelRequest, cashAdvances:cashAdvances }})
    
    //update other containers
    if(travelRequest.approvers.length>0){
      //send to approval and travel
      //const approval_res = await axios.post(`${APPROVAL_API_URL}/cash-advance/`, updatedData)
      //if(approval_res.status!=200) throw new Error('Error occured while replicating details in approval-ms')

      const travel_res = await axios.post(`${TRAVEL_API_URL}/travel-requests/${travelRequestId}`, travelRequest)
      if(travel_res.status!=200) throw new Error('Error occured while replicating details in travel-ms')
      return res.status(200).json({message: 'Travel Request updated and sent for approval.'})
    }
    else{
      //send to travel
      const travel_res = await axios.post(`${TRAVEL_API_URL}/travel-requests/${travelRequestId}`, travelRequest)
      if(travel_res.status!=200) throw new Error('Error occured while replicating details in travel-ms')
      return res.status(200).json({message:'Travel Requested updated and sent for booking'})     
    }
    
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateTravelRequest_ = async (req, res) => {
  try {
    const requiredFields = [
      "tripPurpose",
      "travelRequestDate",
      "createdFor",
      "teamMembers",
      "travelRequestStatus",
      "travelRequestState",
      "travelAllocationHeaders",
      "itinerary",
      "tripType",
      "travelDocuments",
      "approvers",
      "preferences",
      "travelViolations",
      "travelBookingDate",
      "travelCompletionDate",
      "travelRequestRejectionReason",
      "isCancelled",
      "cancellationDate",
      "cancellationReason",
      "sentToTrip",
      "isCashAdvanceTaken",
      "submitted",
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

    //other validation methods are also needed,

    const expectedFields = [
      "tripPurpose",
      "travelRequestDate",
      "createdFor",
      "teamMembers",
      "travelRequestStatus",
      "travelRequestState",
      "travelAllocationHeaders",
      "itinerary",
      "tripType",
      "travelDocuments",
      "approvers",
      "preferences",
      "travelViolations",
      "travelBookingDate",
      "travelCompletionDate",
      "travelRequestRejectionReason",
      "isCancelled",
      "cancellationDate",
      "cancellationReason",
      "sentToTrip",
      "isCashAdvanceTaken",
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
    const travelRequestExists = await CashAdvance.findOne({'travelRequestData.travelRequestId': travelRequestId}, {travelRequestData:1, cashAdvancesData:1})
    
    if(!travelRequestExists){
      return res.status(404).json({message: 'Travel Request not found'})
    }

    const lastStatus = travelRequestExists.travelRequestData.travelRequestStatus
    const lastApprovers = travelRequestExists.travelRequestData.approvers


    //case travelRequest status is draft
    if(travelRequestStatus == 'draft'){
      if(req.body?.submitted == null || req.body?.submitted == undefined){ 
        return res.status(400).json({ message: "Field or value for field is missing: 'submitted' " })
      }
      
      //check for approvers
      if(req.body.hasOwnProperty("approvers") && req.body.approvers.length>0){
        // might need to 
        //check with t&e how many approvers should be there
        //and wether he is selecting correct approvers

        //update status of each itinerary item to pending approval
        if(updatedFields.hasOwnProperty('itinerary')){
          updatedFields.itinerary.flights.forEach(flight=>{
            if(flight.date??false) flight.status = req.body.submitted? 'pending approval' : 'draft'
          })
          updatedFields.itinerary.trains.forEach(train=>{
            if(train.date??false) train.status = req.body.submitted? 'pending approval' : 'draft'
          })
          updatedFields.itinerary.buses.forEach(bus=>{
            if(bus.date??false) bus.status = req.body.submitted? 'pending approval' : 'draft'
          })
          updatedFields.itinerary.cabs.forEach(cab=>{
            if(cab.date??false) cab.status = req.body.submitted? 'pending approval' : 'draft'
          })
          updatedFields.itinerary.hotels.forEach(hotel=>{
            if(hotel.checkIn??false) hotel.status = req.body.submitted? 'pending approval' : 'draft'
          })
        }

        //update data in backend with status 'pending approval'
        //await TravelRequest.findOneAndUpdate({'travelRequestData.travelRequestId': travelRequestId}, {$set: {...updatedFields, travelRequestStatus: req.body.submitted? 'pending approval' : 'draft'}});
        await CashAdvance.findOneAndUpdate({'travelRequestData.travelRequestId': travelRequestId}, 
            {$set: 
              { travelRequestData: 
                {...updatedFields, travelRequestStatus: req.body.submitted? 'pending approval' : 'draft'
              }, 
              'cashAdvances.$[].cashAdvanceStatus': req.body.submitted? 'pending approval' : 'draft' }})

        res.status(200).json({message:  req.body.submitted ? `Travel Request submitted for approval` : 'Travel Request saved as draft'})
        // send data to approval microservice
      }

      else{
        //update data in backend with status 'pending booking'
        //update status of each itinerary item to pending booking
        if(updatedFields.hasOwnProperty('itinerary')){
            updatedFields.itinerary.flights.forEach(flight=>{
              if(flight.date??false) flight.status = req.body.submitted? 'pending booking' : 'draft'
            })
            updatedFields.itinerary.trains.forEach(train=>{
              if(train.date??false) train.status = req.body.submitted? 'pending booking' : 'draft'
            })
            updatedFields.itinerary.buses.forEach(bus=>{
              if(bus.date??false) bus.status = req.body.submitted? 'pending booking' : 'draft'
            })
            updatedFields.itinerary.cabs.forEach(cab=>{
              if((cab.date??false) || (cab.type!='regular')) cab.status = req.body.submitted? 'pending booking' : 'draft'
            })
            updatedFields.itinerary.hotels.forEach(hotel=>{
              if(hotel.checkIn??false) hotel.status = req.body.submitted? 'pending booking' : 'draft'
            }) 
        }
        //await TravelRequest.findOneAndUpdate({'travelRequestData.travelRequestId': travelRequestId}, {$set: {...updatedFields, travelRequestStatus: req.body.submitted? 'pending booking' : 'draft'}});
        await CashAdvance.findOneAndUpdate({'travelRequestData.travelRequestId': travelRequestId}, 
          {$set: 
            { travelRequestData: 
              {...updatedFields, travelRequestStatus: req.body.submitted? 'pending booking' : 'draft'
            }, 
            'cashAdvances.$[].cashAdvanceStatus': req.body.submitted? 'awaiting pending settlement' : 'draft' }})

        res.status(200).json({message: 'Travel Request submitted for booking'})
        // send data to approval microservice
      } 
    }

    //travel request status is pending booking
    else if(travelRequestStatus == 'pending booking'){
      //check if any new itinerary item is added. if so treat it as a draft status request
      //and send for approval if required
      let itemAdded = false
      let status = ''

      if(updatedFields.hasOwnProperty('itinerary')){
          updatedFields.itinerary.flights.forEach(flight=>{
            if((flight.date??false) && flight.status == 'draft'){
              flight.status = lastApprovers.length>0? 'pending approval' : 'pending booking'
              itemAdded = true
            }
          })
          updatedFields.itinerary.trains.forEach(train=>{
            if((train.date??false) && train.status == 'draft'){
              train.status = lastApprovers.length>0? 'pending approval' : 'pending booking'
              itemAdded = true
            }
          })
          updatedFields.itinerary.buses.forEach(bus=>{
            if((bus.date??false) && bus.status == 'draft'){
              bus.status = lastApprovers.length>0? 'pending approval' : 'pending booking'
              itemAdded = true
            }
          })
          updatedFields.itinerary.cabs.forEach(cab=>{
            if(((cab.date??false) || (cab.type!='regular')) && cab.status == 'draft'){
              cab.status = lastApprovers.length>0? 'pending approval' : 'pending booking'
              itemAdded = true
            }
          })
          updatedFields.itinerary.hotels.forEach(hotel=>{
            if((hotel.checkIn??false) && hotel.status == 'draft'){
              hotel.status = lastApprovers.length>0? 'pending approval' : 'pending booking'
              itemAdded = true
            }
          })
      }

      if(updatedFields.hasOwnProperty('approvers')){
        if(updatedFields.approvers.length>0){
          if(JSON.stringify(lastApprovers) != JSON.stringify(updatedFields.approvers)){
            status = 'pending approval'
          }

          if(itemAdded) status = 'pending approval'

          else status = 'pending booking'
        }
        else status = 'pending booking'
      }

      else status = 'pending booking'

      console.log(status, 'status -pending booking route line-470')


      if(status == 'pending booking'){
        //update only travel request status keep cash advance status same
        await CashAdvance.findOneAndUpdate({'travelRequestData.travelRequestId': travelRequestId}, 
          {$set: 
            { travelRequestData: 
              {...updatedFields, travelRequestStatus: status
            },
            }})

          res.status(200).json({message: 'Travel Request submitted for booking'})
      }

      if(status == 'pending approval'){

        //update travel request to 
        await CashAdvance.updateOne({'travelRequestData.travelRequestId': travelRequestId}, {$set: { travelRequestData: {...updatedFields, travelRequestStatus: 'pending approval'}}})

        const updatedCashAdvance = await CashAdvance.findAndUpdateOne({'travelRequestData.travelRequestId': travelRequestId},
          {
            $set: { 'cashAdvances.$[element].cashAdvanceStatus': 'pending approval' }
          },
          { arrayFilters: [{ 'element.cashAdvanceStatus': 'awaiting pending settlement' }]},
          {new:true}
        );
        
        // send data to approval microservice
        //fetch updated record
        if(updatedCashAdvance){
          //axios.post(APPROVAL_ENDPOINT, )
          console.log(updatedCashAdvance)
        }
        

        res.status(200).json({message: 'Travel Request submitted for approval'})
      }    
    }

    //travel request status is pending approval
    else if(travelRequestStatus == 'pending approval'){
      //check if any new itinerary item is added. if so treat it as a draft status request
      //and send for approval if required
      let itemAdded = false
      let status = ''

      if(updatedFields.hasOwnProperty('itinerary')){
        
          updatedFields.itinerary.flights.forEach(flight=>{
            if((flight.date??false) && flight.status == draft){
              flight.status = lastApprovers.length>0? 'pending approval' : 'pending booking'
              itemAdded = true
            }
          })
          updatedFields.itinerary.trains.forEach(train=>{
            if((train.date??false) && train.status == draft){
              train.status = lastApprovers.length>0? 'pending approval' : 'pending booking'
              itemAdded = true
            }
          })
          updatedFields.itinerary.buses.forEach(bus=>{
            if((bus.date??false) && bus.status == draft){
              bus.status = lastApprovers.length>0? 'pending approval' : 'pending booking'
              itemAdded = true
            }
          })
          updatedFields.itinerary.cabs.forEach(cab=>{
            if((cab.date??false) && cab.status == draft){
              cab.status = lastApprovers.length>0? 'pending approval' : 'pending booking'
              itemAdded = true
            }
          })
          updatedFields.itinerary.hotels.forEach(hotel=>{
            if((hotel.checkIn??false) && hotel.status == 'draft'){
              hotel.status = lastApprovers.length>0? 'pending approval' : 'pending booking'
              itemAdded = true
            }
          })
      }

      if(updatedFields.hasOwnProperty('approvers')){
        if(updatedFields.approvers.length>0){
          if(JSON.stringify(lastApprovers) != JSON.stringify(updatedFields.approvers)){
            status = 'pending approval'
          }

          if(itemAdded) status = 'pending approval'

          else status = 'pending booking'
        }
      }
      else status = 'pending booking'

      await TravelRequest.findOneAndUpdate({'travelRequestData.travelRequestId': travelRequestId}, {$set: {...updatedFields, travelRequestStatus:status}});
      res.status(200).json({message: 'Travel Request submitted for booking'})

      if(status == 'pending approval'){
        // send data to approval microservice
      }
      
    }

    //travel request status is cancelled
    else if(travelRequestStatus == 'cancelled'){
      return res.status(400).json({message: 'This Travel Request has been cancelled. Please raise a fresh Travel Request'})
    }

    else if(travelRequestStatus == 'booked'){
      return res.status(400).json({message: 'Travel Request is already booked. Please go to trip modification if you want to modify this trip'})
    }

    else if(travelRequestStatus == 'rejected'){
      {
        if(!req.body?.submitted??true){ 
          return res.status(400).json({ message: "Field or value for field is missing: 'submitted' " })
        }
  
        //check for approvers
        if(req.body.hasOwnProperty("approvers") && req.body.approvers.length>0){
          // might need to 
          //check with t&e how many approvers should be there
          //and wether he is selecting correct approvers
  
          //update status of each itinerary item to pending approval
          if(updatedFields.hasOwnProperty('itinerary')){
              updatedFields.itinerary.forEach(item=>{
                if(item?.departure?.date??false) item.departure.status = 'pending approval'
                if(item?.return?.date??false) item.return.status = 'pending approval'
                if(item?.boardingTransfer?.date??false) item.boardingTransfer.status = 'pending approval'
                if(item?.hotelTransfer?.date??false) item.hotelTransfer.status = 'pending approval'
                item.cabs.forEach(cab=>{
                  if(cab.date??false) cab.status = 'pending approval'
                })
                item.hotels.forEach(hotel=>{
                  if(hotel.checkIn??false) hote.status = 'pending approval'
                })
              }) 
          }
  
          //update data in backend with status 'pending approval'
          await TravelRequest.findOneAndUpdate({'travelRequestData.travelRequestId': travelRequestId}, {$set: {...updatedFields, travelRequestStatus:'pending approval'}});
          res.status(200).json({message: 'Travel Request submitted for approval'})
          // send data to approval microservice
        }
  
        else{
          //update data in backend with status 'pending booking'
          //update status of each itinerary item to pending booking
          if(updatedFields.hasOwnProperty('itinerary')){
            updatedFields.itinerary.forEach(item=>{
              if(item?.departure?.date??false) item.departure.status = 'pending booking'
              if(item?.return?.date??false) item.return.status = 'pending booking'
              if(item?.boardingTransfer?.date??false) item.boardingTransfer.status = 'pending booking'
              if(item?.hotelTransfer?.date??false) item.hotelTransfer.status = 'pending booking'
              item.cabs.forEach(cab=>{
                if(cab.date??false) cab.status = 'pending booking'
              })
              item.hotels.forEach(hotel=>{
                if(hotel.checkIn??false) hotel.status = 'pending booking'
              })
            }) 
          }
          await TravelRequest.findOneAndUpdate({'travelRequestData.travelRequestId': travelRequestId}, {$set: {...updatedFields, travelRequestStatus:'pending booking'}});
          res.status(200).json({message: 'Travel Request submitted for booking'})
          // send data to approval microservice
        } 
  
      }
    }

    else {
      return res.status(400).json({message: 'Unrecognized status'})
    }

  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const cancelTravelRequest = async (req, res)=>{
  try {
    const { travelRequestId } = req.params;

    //find TR
    const cashAdvance = await CashAdvance.find({'travelRequestData.travelRequestId' : travelRequestId})
    if(!cashAdvance) return res.status(404).json({message: 'Can not find requested resource'})

    const travelRequest = cashAdvance.travelRequestData
    const cashAdvances = cashAdvance.cashAdvancesData

    const sendToApproval = travelRequest.approvers.length>0 && travelRequest.status != 'draft'

    //update all itinerary item statu to cancelled
    if(travelRequest.hasOwnProperty('itinerary')){
      const items = ['flights', 'trains', 'buses', 'cabs', 'hotels']
      items.forEach(item=>{
        travelRequest.itinerary[item].forEach(subItem=>{
          subItem.status = 'cancelled'
        })
      })
    }

    //update all cashAdvances status to cancelled
    cashAdvances.forEach(advance=> advance.cashAdvanceStatus = 'cancelled')

    //update  status to cancelled
    travelRequest.travelRequestStatus = 'cancelled'

    //update save in backend
    cashAdvance.travelRequestData = travelRequest
    cashAdvance.cashAdvancesData = cashAdvances
    const result = cashAdvance.save()
    if(!result) return res.status(400).json({message: 'Can not update database at the momnet. Please try again later'})
    //send data to dashboard
    await sendToDashboardQueue(cashAdvance, true, 'online')

    if(sendToApproval){
      //replicate data in approval microservice
        // const approval_res = axios.post(APPROVAL_ENDPOINT, result)
        // if(approval_res.status(200)){
        //   return res.status(200).json({message: `Travel Request Sent for booking`});
        // }
        // else{
        //   return res.status(400).json({message: 'Unable to replicate data in approval microservice'})
        // }

        //just for now
        res.status(200).json({
          message: `Travel Request cancelled`,
        });
    }else return res.status(200).json({message: 'Travel Request Cancelled'})

  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const updateTravelRequest = async (req, res) =>{
  try{
    const {travelRequestId} = req.params
    const {travelRequest, submitted} = req.body
    console.log(submitted)

    let sendToApproval = false
    let needApproval = false
    let lastTravelRequestStatus = null
    //find ca
    const cashAdvance = await CashAdvance.findOne({'travelRequestData.travelRequestId': travelRequestId})
    if(!cashAdvance) return res.status(404).json({message: 'Can not find the requested resource'})
    lastTravelRequestStatus = cashAdvance.travelRequestData.travelRequestStatus 
    //update travel request data
    cashAdvance.travelRequestData.travelRequestDate = Date.now()
    if(cashAdvance.travelRequestData.approvers.length > 0){
      sendToApproval = true
      needApproval = true
    }
    //cash advance record is present go ahead
    if(!submitted){
      //save everything in draft state

      //update all itinerary items to draft
      if(travelRequest.hasOwnProperty('itinerary')){
        const items = ['flights', 'trains', 'buses', 'cabs', 'hotels']
        items.forEach(item=>{
          travelRequest.itinerary[item].forEach(subItem=>{
            subItem.status = 'draft'
          })
        })
      }

      //update travel request status to draft
      travelRequest.travelRequestStatus = 'draft'

      //update travelRequest in cashAdvance
      cashAdvance.travelRequestData = travelRequest
      //update all cash advances status to draft
      cashAdvance.cashAdvancesData.forEach(advance=> advance.cashAdvanceStatus = 'draft')
      //save the structre
      const result = await cashAdvance.save()

      if(!result){
        return res.status(400).json({
          message:'Can not update database please try again',
        });  
      }

      //send data to dashboard
      await sendToDashboardQueue(cashAdvance, false, 'online')
      
      if(sendToApproval){
          //replicate data in approval microservice
          // const approval_res = axios.post(APPROVAL_ENDPOINT, result)
          // if(approval_res.status(200)){
          //   return res.status(200).json({message: `Travel Request Sent for booking`});
          // }
          // else{
          //   return res.status(400).json({message: 'Unable to replicate data in approval microservice'})
          // }

          //just for now
          return res.status(200).json({message: `Travel Request Sent for booking`})
      }
      //send res
      else{
        return res.status(200).json({message: `Travel Request Sent for booking`});
      }      
    }

    if(submitted){
      //update all itinerary items to appropriate state
      if(travelRequest.hasOwnProperty('itinerary')){
        const items = ['flights', 'trains', 'buses', 'cabs', 'hotels']
        items.forEach(item=>{
          travelRequest.itinerary[item].forEach(subItem=>{
            if((subItem.date??false)){
              subItem.status = needApproval? 'pending approval' : 'pending booking'
            }
          })
        })
      }

      if(needApproval){
        //update travel request to pending approval
        cashAdvance.travelRequestData.travelRequestStatus = 'pending approval'
        //chage status of cash advances with status 'awaiting pending settlement' to pending approval
        cashAdvance.cashAdvancesData.forEach(cashAdvance=>{
          if(cashAdvance.cashAdvanceStatus == 'awaiting pending settlement'){
            cashAdvance.cashAdvanceStatus = 'pending approval'
          }
        })

        const result = await cashAdvance.save()

        if(!result){
          return res.status(400).json({
            message:'Can not update database please try again',
          });  
        }

        if(sendToApproval){
          //replicate data in approval microservice
          // const approval_res = axios.post(APPROVAL_ENDPOINT, result)
          // if(approval_res.status(200)){
          //   return res.status(200).json({message: `Travel Request Sent for booking`});
          // }
          // else{
          //   return res.status(400).json({message: 'Unable to replicate data in approval microservice'})
          // }

          //just for now

          //send data to dashboard
          await sendToDashboardQueue(cashAdvance, false, 'online')

          return res.status(200).json({message: `Travel Request Sent for approval`})
        }

        //send res
        else{

          //send data to dashboard
          await sendToDashboardQueue(cashAdvance, false, 'online')
          return res.status(200).json({message: `Travel Request Sent for approval`});
        }
      }

      else{
        //update travel request to pending booking + no change in cahs advances status
        cashAdvance.travelRequestData.travelRequestStatus = 'pending booking'
        const result = await cashAdvance.save()

        if(!result){
          return res.status(400).json({
            message:'Can not update database please try again',
          });  
        }


        if(sendToApproval){
          //replicate data in approval microservice
          // const approval_res = axios.post(APPROVAL_ENDPOINT, result)
          // if(approval_res.status(200)){
          //   return res.status(200).json({message: `Travel Request Sent for booking`});
          // }
          // else{
          //   return res.status(400).json({message: 'Unable to replicate data in approval microservice'})
          // }

          //send data to dashboard
          await sendToDashboardQueue(cashAdvance, false, 'online')

          //just for now
          return res.status(200).json({message: `Travel Request Sent for booking`})
        }

        //send res
        else{

          //send data to dashboard
          await sendToDashboardQueue(cashAdvance, false, 'online')

          return res.status(200).json({message: `Travel Request Sent for approval`});
        }
      }
    }

    else{
      return res.status(400).json({message: 'Something went wrong ):' })
    }
  }catch(e){
    console.log(e)
    res.status(500).json({message:'Internal server error'})
  }
}

export {
  getOnboardingAndProfileData,
  getTravelRequest,
  validateTravelPolicy,
  updateTravelRequest,
  cancelTravelRequest,
};
