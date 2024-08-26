import CashAdvance from "../models/cashSchema.js";
import { sendToDashboardQueue, sendToOtherMicroservice } from "../rabbitMQ/publisher.js";
import {fetchOnboardingData} from "../services/onboardingService.js";
import policyValidation from "../utils/policyValidation.js";
import axios from 'axios'
import HRMaster from "../models/hrMaster.js";


const getOnboardingAndProfileData = async (req, res) => {
  try {
    const { tenantId, employeeId, travelType } = req.params;

    if (!tenantId || !employeeId) {
      return res.status(400).json({ message: "Bad request" });
    }
    const onboardingData = await fetchOnboardingData(tenantId, employeeId, travelType);
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

    console.log(travelRequestId, 'tr id')
    const travelRequest_res = await CashAdvance.findOne(
      { 'travelRequestData.travelRequestId':travelRequestId },
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

const cancelTravelRequest = async (req, res)=>{
  try {
    const { travelRequestId } = req.params;

    //find TR
    const cashAdvance = await CashAdvance.findOne({'travelRequestData.travelRequestId' : travelRequestId})
    if(!cashAdvance) return res.status(404).json({message: 'Can not find requested resource'})

    const travelRequest = cashAdvance.travelRequestData
    const cashAdvances = cashAdvance.cashAdvancesData

    const sendToApproval = travelRequest.approvers.length>0 && travelRequest.travelRequestStatus != 'draft'

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
    travelRequest.cancellationDate = new Date().toISOString();
    travelRequest.isCancelled = true;

    //update save in backend
    cashAdvance.travelRequestData = travelRequest
    cashAdvance.cashAdvancesData = cashAdvances
    const result = await cashAdvance.save()

    if(!result) return res.status(400).json({message: 'Can not update database at the momnet. Please try again later'})
    //send data to dashboard
    const confirmation = await sendToDashboardQueue(cashAdvance, true, 'online')

    console.log(`Confirmation received from dasshbaord: ${confirmation}`)

    if(sendToApproval){
        const payload = {
            tenantId:result.travelRequestData.tenantId,
            travelRequestId:result.travelRequestData.travelRequestId,
        }

        sendToOtherMicroservice(payload, 'cancellation-update', 'approval', 'To update status of TravelRequest and corresponding cash advances to cancelled')
        res.status(200).json({message: `Travel Request cancelled`});
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
    let lastTravelRequestApprovers = null;

    //find ca
    const cashAdvance = await CashAdvance.findOne({'travelRequestData.travelRequestId': travelRequestId})
    if(!cashAdvance) return res.status(404).json({message: 'Can not find the requested resource'})
    lastTravelRequestStatus = cashAdvance.travelRequestData.travelRequestStatus 
    lastTravelRequestApprovers = cashAdvance?.travelRequestData?.approvers??[];
    //update travel request data
    cashAdvance.travelRequestData.travelRequestDate = Date.now()
    if(cashAdvance.travelRequestData.approvers.length > 0){
      sendToApproval = true
      needApproval = true
    }

    if(travelRequest?.approvers?.length != lastTravelRequestApprovers?.length || travelRequest?.approvers?.some(approver=> !lastTravelRequestApprovers.map(ap=>ap.empId).includes(approver.empId) )){
      //update approvers in cashadvance
      cashAdvance?.cashAdvancesData.forEach(ca=>{
        ca.approvers = travelRequest?.approvers??[];
      })
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

      //update all cash advances status to draft if
      cashAdvance.cashAdvancesData.forEach(advance=> {
        if(['pending approval', 'approved', 'awaiting pending settlement'].includes(advance.cashAdvanceStatus)){
          advance.cashAdvanceStatus = 'draft'
        }
      })
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
          sendToOtherMicroservice(result, 'full-update', 'approval', 'To update entire travelRequestData in approval microservice', 'cash', 'online')
          return res.status(200).json({message: `Travel Request saved as draft`})
      }
      //send res
      else{
        return res.status(200).json({message: `Travel Request saved as draft`});
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
              needApproval && subItem?.approvers?.forEach(approver=>approver.status = 'pending approval');
            }
          })
        })
      }

      //update cashAdvance
      cashAdvance.travelRequestData = travelRequest;


      if(needApproval){
        //update travel request to pending approval
        cashAdvance.travelRequestData.travelRequestStatus = 'pending approval'
        cashAdvance.travelRequestData.approvers.forEach(ap=>ap.status = 'pending approval');

        //chage status of cash advances with status 'awaiting pending settlement' || 'approved' || ' to pending approval

        const applicableStatuses = ['awaiting pending settlement', 'approved', 'pending settlement'];

        cashAdvance.cashAdvancesData.forEach(cashAdvance=>{
          if(applicableStatuses.includes(cashAdvance.cashAdvanceStatus)){
            cashAdvance.cashAdvanceStatus = 'pending approval',
            cashAdvance.approvers.forEach(ap=>ap.status = 'pending approval');
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
          sendToOtherMicroservice(cashAdvance, 'full-update', 'approval', 'To update cash Advance Data in approval microservice')
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
          sendToOtherMicroservice(cashAdvance, 'full-update', 'approval', 'To update cash Advance Data in approval microservice')
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

const closeTravelRequests = async (req, res) => {
  try{
    const {travelRequestIds, travelRequestStatus} = req.body

    const filterArray = travelRequestIds.map(id=>({'travelRequestData.travelRequestId':id}))
    const updateResult = await CashAdvance.updateMany({ $or: filterArray }, { $set: { 'travelRequestData.travelRequestStatus': traveRequestStatus} });

    console.log(updateResult)

  }catch(e){
    console.log(e)
    res.status(500).json({message:'Internal server error'})
  }
}

const updateTravelBookings = async (req, res)=>{
  try{
    const { travelRequestId } = req.params;
    let { itinerary, submitted } = req.body;

    if(!req.body.hasOwnProperty('submitted') || !req.body.hasOwnProperty('itinerary') ){
      return res.status(400).json({message: 'missing required fields'})
    } 
    //further checks

    //find tr
    const cashAdvance = await CashAdvance.findOne({'travelRequestData.travelRequestId' : travelRequestId})
    if(!cashAdvance) return res.status(404).json({message: 'Requested resource not found'})

    const travelRequest = cashAdvance.travelRequestData;
    
    if(submitted){
      console.log('booking request submitted by user')
      //change all individual line statuses to booked, change main status to booked
      const message = {message: 'Booking Values not uploaded correctly'}

      const itineraryTypes = ['flights', 'cabs', 'carRentals', 'hotels', 'trains', 'buses'] 

      

      for (const itemType of itineraryTypes) {
        for (const item of itinerary[itemType]) {
          if (itemType === 'flights' || itemType === 'trains' || itemType === 'buses') {
            if (item.bkd_from == null || item.bkd_from == 'undefined') {
              return res.status(400).json(message);
            }
            if (item.bkd_to == null || item.bkd_to == 'undefined') {
              return res.status(400).json(message);
            }
          }
      
          if (itemType === 'cabs' || itemType === 'carRentals') {
            if (item.bkd_pickupAddress == null || item.bkd_pickupAddress == 'undefined') {
              return res.status(400).json(message);
            }
            if (item.bkd_dropAddress == null || item.bkd_dropAddress == 'undefined') {
              return res.status(400).json(message);
            }
          }
      
          if (itemType === 'hotels') {
            if (item.bkd_location == null || item.bkd_location == 'undefined') {
              return res.status(400).json(message);
            }
          }
        }
      }
      
      // Continue with the rest of your code if needed
      

      //everything looks fine change status of each itinerary item to booked 
      itineraryTypes.forEach(itemType=>{
        itinerary[itemType].forEach(item=>{
          if(item.status == 'pending booking'){
            item.status = 'booked'
          }
        })
      })

      

      //change main travelRequest status to booked
      travelRequest.travelRequestStatus = 'booked'
      travelRequest.itinerary = itinerary

      //change sent to trip flas as no
      travelRequest.sentToTrip = false;

      cashAdvance.travelRequestData = travelRequest;

      cashAdvance.cashAdvancesData.forEach(advance=>{
        if(advance.cashAdvanceStatus == 'awaiting pending settlement'){
          advance.cashAdvanceStatus = 'pending settlement'
        }
      })

      console.log('Updated everything')

      //send data to rabbitmq.. 
      const sentToDashboard = await sendToDashboardQueue(cashAdvance, 'to update travel request contents after booking', 'full-update','online')
      if(!sentToDashboard) {
        return res.status(400).json({message: 'Can not perform requested operation at the moment'})
      }

      console.log('Saving Request')
      await cashAdvance.save()

      console.log('Sending response')
  
      return res.status(200).json({message: 'Travel Request marked as Booked'})
    }

    if(!submitted){
      //simply save the provided itinerary in request
      travelRequest.itinerary = itinerary
      await cashAdvance.save()
      return res.status(200).json({message: 'Itinerary updated'})
    }

  }catch(e){
    console.log(e)
    return res.status(500).json({message:'Internal Server Error'})
  }
}

const getBookingsInitialData = async (req, res)=>{
  try{
    const {tenantId, employeeId, travelType} = req.params
    
    if(!tenantId || !employeeId || !travelType || tenantId == undefined || employeeId == undefined || travelType == undefined) return res.status(400).json({message: 'Request missing required fields'})
    //get tenant data, 
  
    /*--------------------------------------------
     |  later on optimize to get only relevan data |
      --------------------------------------------*/
  
    const tenantData = await HRMaster.findOne({tenantId})
    if(!tenantData) return res.status(404).json({message:'Can not find tenant'})
    //get employee details
    const employeeData = tenantData.employees.find(employee=>employee.employeeDetails.employeeId == employeeId)
    const employeeGroups = employeeData?.group
    console.log(employeeGroups, 'employee groups')
  
    let policies = tenantData.policies.travelPolicies??[]
    console.log(policies)
    // if(Object.keys(policies).length> 0){
    //   policies = Object.keys(policies).map(key=> policies[key])
    // }
    
    const getPolicy = (group, policy, travelType)=>{
      let result = null
      policies.forEach(groupPolicy=>{
        if(groupPolicy[group]!=null && groupPolicy[group]!=undefined){
            result = groupPolicy[group][travelType][policy] 
            return
        }
      })
  
      return result
    }
    
    const dummyGroups =  employeeGroups //['Engineers', 'All']
    const checkPolicies = ['Flight', 'Train', 'Cab Rental', 'Cab', 'Hotel']
    let allowed = {}
    //for now fetch data for group 'Engineers'
    const maxAllowedLimit = null
    async function extractor(checkPolicies, groups, travelType){
      try{
        checkPolicies.forEach(item=>{
          const groupPolicies = []
            groups.forEach(group=>{
                groupPolicies.push(getPolicy(group, item, travelType))
            })
  
            console.log(groupPolicies)
            
            let _class = {}
            let _limit = 0
            
            Object.keys(groupPolicies[0]?.class??[]).forEach(cl=>{
                _class = {..._class, [cl]:false}
            })
            
            groupPolicies.forEach(pl=>{
                Object.keys(pl?.class??[]).forEach(cl=>{
                    if(pl.class[cl].allowed) _class[cl] = true
                })
                if(Number(pl?.limit?.amount)>_limit) _limit = Number(pl.limit.amount) 
            })
  
            allowed = {...allowed, [item]: {class:_class, limit:_limit}}
      })
      }catch(e){
        console.log(e)
      }
    }
    
    extractor(checkPolicies, dummyGroups, 'international')
  
    const travelClassOptions={
      'flight':Object.keys(policies[0][Object.keys(policies[0])[0]][travelType]?.['Flight']?.class??['Economy', 'Premium Economy', 'Business', 'First']),
      'train': Object.keys(policies[0][Object.keys(policies[0])[0]][travelType]?.['Train']?.class??['First AC', 'Second AC', 'Third AC', 'Chair Car', 'Sleeper']),
      'bus': ['Sleeper', 'Semi-Sleeper', 'Regular'],
      'cab': Object.keys(policies[0][Object.keys(policies[0])[0]][travelType]?.['Cab']??['Regular', 'Executive'])
    }
    const hotelClassOptions = Object.keys(policies[0][Object.keys(policies[0])[0]][travelType]?.['Hotel']?.class??['Motel', '3 Star', '4 Star', '5 Star'])
    const cabClassOptions = Object.keys(policies[0][Object.keys(policies[0])[0]][travelType]?.['Cab Rental']?.class??['Regular', 'Executive'])
    let minDaysBeforeBooking = 9999
    const allowInternationalSubmissionWithViolations = policies[0]?.[dummyGroups[0]]?.['international']?.['Allow International Travel Submission/booking with violations']?.permission?.allowed??true
    
    dummyGroups.forEach(group=>{
      policies.forEach(groupPolicy=>{
        if(groupPolicy[group]!=null && groupPolicy[group]!=undefined){
            const result = groupPolicy[group]?.[travelType]?.['Minimum Days to Book Before Travel']?.dayLimit?.days??999 
            if(result<minDaysBeforeBooking) minDaysBeforeBooking = result 
        }
      })
    })
  
    if(minDaysBeforeBooking == 9999) minDaysBeforeBooking=0
  
    return res.status(200).json({policies:allowed, minDaysBeforeBooking, allowInternationalSubmissionWithViolations, travelClassOptions, hotelClassOptions, cabClassOptions})
  
  }catch(e){
    console.log(e)
    res.status(500).json({message:'internal server error'})
  }
}


export {
  getOnboardingAndProfileData,
  getTravelRequest,
  validateTravelPolicy,
  updateTravelRequest,
  cancelTravelRequest,
  closeTravelRequests,
  updateTravelBookings,
  getBookingsInitialData,
};
