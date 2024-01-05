import  createCashAdvanceId  from "../utils/createCashAdvanceId.js";
import axios from 'axios'
import CashAdvance from '../models/cashSchema.js';
import HRMaster from '../models/hrMaster.js';
import policyValidation from '../services/policyValidation.js';
import mongoose  from "mongoose";

const TRAVEL_API_URL = 'http://localhost:8001/travel/internal/api'
const APPROVAL_API_URL = 'http://localhost:8001/approval/api'
const FINANCE_API_URL = 'http://localhost:8001/finance/api'
const TRIP_API_URL = 'http://localhost:8001/trip/api'

const createCashAdvance = async (req, res) => {
  try {
    const { travelRequestId } = req.params;

    //check if there is already a previous cash advance associated with this travelRequest
    const ca_res = await CashAdvance.findOne({'travelRequestData.travelRequestId': travelRequestId}, {travelRequestData:1, cashAdvancesData:1})
    
    if(ca_res){
      console.log(ca_res)

      //check if there is already a cash advance in draft.
      //if so return that cash advance number

      const cashAdvances = ca_res.cashAdvancesData
      const travelRequestData = ca_res.travelRequestData

      if(cashAdvances.length>0){

        for(let i=0; i<cashAdvances.length; i++){
          if(cashAdvances[i].cashAdvanceStatus === 'draft'){
            return res.status(200).json({message:'There is a draft cash advance', cashAdvanceId:cashAdvances[i].cashAdvanceId})
          }
        }
      }

      //no CA in draft state. Create a new one 
      const createdBy = travelRequestData?.createdFor?.empId ?? travelRequestData.createdBy
      const tenantId = travelRequestData.tenantId;
      const travelRequestNumber = travelRequestData.travelRequestNumber
      const count = cashAdvances.length
      const cashAdvanceNumber = `CA${count.toString().padStart(4, '0')}`
      const cashAdvanceId = createCashAdvanceId(tenantId, createdBy.empId);
      
      //default currency to be fetched from onboarding data
      const defaultCurrency = {fullName:'Indian Rupees', shortName:'INR', symbol:'₹', countryCode:'IN'}

      const newCashAdvance = {
        tenantId,
        travelRequestId,
        travelRequestNumber,
        cashAdvanceId,
        cashAdvanceNumber,
        createdBy,
        cashAdvanceStatus:'draft',
        cashAdvanceState:'section 0',
        amountDetails:[{amount:0, currency:defaultCurrency, mode:null}],
        approvers:travelRequestData.approvers,
        cashAdvanceViolations:null,
        cashAdvanceRequestDate: Date.now(),
        cashAdvanceApprovalDate:null,
        cashAdvanceSettlementDate:null,
        cashAdvanceRejectionReason:null,
        additionalCashAdvanceField:null
      }

      //update cash advance

      const updatedCashAdvance = await CashAdvance.findOneAndUpdate({'travelRequestData.travelRequestId': travelRequestId}, {$set: {cashAdvancesData:[...cashAdvances, newCashAdvance]}}, {new:true})
      //send data to dashboard
      await sendToDashboardQueue(updatedCashAdvance, false, 'online')

      return res.status(200).json({message:'Created cash advance in draft state', cashAdvanceId})
    }
    //There is not an already raised cash advance which is in draft state. 
    //Continue with normal flow--

    //fetch travel request from Travel MS
    const tr_res = await axios.get(`${TRAVEL_API_URL}/travel-requests/${travelRequestId}`)

    //check for errors
    if(!tr_res.status === 404){
      return res.status(404).json({message: 'Travel request not found'})
    }
    else if(!tr_res.status === 200){
      return res.status(500).json({message: 'Server error occured while fetching travel request'})
    }

    //everything looks good
    const travelRequestData = tr_res.data.travelRequest
    const requiredFields = [
      //tenantId
    ];

    console.log(req.body);

    const fieldsPresent = requiredFields.every((field) => field in req.body);

    if (!fieldsPresent) {
      return res.status(400).json({ message: "Required headers are not present" });
    }

    const createdBy = travelRequestData.createdFor?.empId ?? travelRequestData.createdBy
    const tenantId = travelRequestData.tenantId
    const travelRequestNumber = travelRequestData.travelRequestNumber
    const cashAdvanceNumber = `CA0001`
    const cashAdvanceId = new mongoose.Types.ObjectId
    
    const cashAdvanceData = {
      travelRequestData: {...travelRequestData, isCashAdvanceTaken:true},
      cashAdvancesData:[{
        tenantId,
        travelRequestId,
        travelRequestNumber,
        cashAdvanceId,
        cashAdvanceNumber,
        createdBy,
        cashAdvanceStatus:'draft',
        cashAdvanceState:'section 0',
        amountDetails:[{amount:null, currency:null, mode:null}],
        approvers:travelRequestData.approvers,
        cashAdvanceViolations:null,
        cashAdvanceRequestDate: Date.now(),
        cashAdvanceApprovalDate:null,
        cashAdvanceSettlementDate:null,
        cashAdvanceRejectionReason:null,
        additionalCashAdvanceField:null
      }]
    };

    const newCashAdvance = new CashAdvance(cashAdvanceData);
    //might serve as the savior from from MongoServerError: E11000
    newCashAdvance.isNew = true
    await newCashAdvance.save();

    await axios.patch(`${TRAVEL_API_URL}/travel-requests/${travelRequestId}/cash-advance-flag`, {isCashAdvanceTaken:true} )
    
    //send data to dashboard
    await sendToDashboardQueue(newCashAdvance, false, 'online')

    return res.status(201).json({ message: 'Cash Advance created in draft state', cashAdvanceId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while creating the cash advance' });
  }
}

const updateCashAdvance = async (req, res) => {
  try{
    const {travelRequestId, cashAdvanceId} = req.params
    console.log(travelRequestId)
    if(!travelRequestId || !travelRequestId){
      return res.status(400).json({message:'Bad Request'})
    }

    //check if tr and ca are present in db
    const ca_res = await CashAdvance.findOne({'travelRequestData.travelRequestId':travelRequestId}, {travelRequestData:1, cashAdvancesData:1})
    const cashAdvances = ca_res?.cashAdvancesData??[]

    if(!cashAdvances.some(ca=>ca.cashAdvanceId == cashAdvanceId)){
      return res.status(404).json({message:'Can not find the requested resource'})
    }

    //check for other validations that needs to be done..
    const updatedCashAdvance = req.body.cashAdvance
    console.log(req.body, 'req.body')

    if(updatedCashAdvance==null || updatedCashAdvance==undefined){
      return res.status(400).json({message:'Bad Request. Missing required fields'})
    }

    //check if some amount is requested
    let amountDetails = updatedCashAdvance.amountDetails

    if(amountDetails.length === 0){
      updatedCashAdvance.status = 'draft'
    }
    else{
      //remove cash advances with requested amount of '0'
      amountDetails = amountDetails.filter(item=>item.amount>0)
      if(amountDetails.length == 0) updatedCashAdvance.cashAdvanceStatus = 'draft'
      else{
        //some amount is requested
        //check if approval is needed
        if(updatedCashAdvance.approvers.length>0){
          //send for approval
          updatedCashAdvance.cashAdvanceStatus = 'pending approval'
        }
        else{
          //check if TR is booked
          if(ca_res.travelRequestData.travelRequestStatus == 'booked'){
            updatedCashAdvance.cashAdvanceStatus = 'pending settlement'
          } 
          else{
            updatedCashAdvance.cashAdvanceStatus = 'awaiting pending settlement'
          }

          updatedCashAdvance.cashAdvanceApprovalDate = Date.now()
        }
        updatedCashAdvance.cashAdvanceRequestDate = Date.now()
      } 
    }

    const ca_index = cashAdvances.map(ca=>ca.cashAdvanceId).indexOf(cashAdvanceId)
    cashAdvances[ca_index] = updatedCashAdvance
    
    const updatedData = await CashAdvance.findOneAndUpdate({'travelRequestData.travelRequestId': travelRequestId}, {$set:{cashAdvancesData: cashAdvances}}, {new:true})
    if(!updatedData) return res.status(200).json({message: 'Could not update the database'})
    console.log(updatedData)

    //send data to dashboard
    await sendToDashboardQueue(updatedData, false, 'online')

    //check status
    switch(updatedCashAdvance.cashAdvanceStatus){
      case 'draft': return res.status(200).json({message:'Cash advance updated'});

      case 'pending settlement': {
        //send updated data to finance ms
        //const finance_res = await axios.post(`${FINANCE_API_URL}/cash-advance/`, updatedData)
        //if(finance_res.status!=200) throw new Error('Error occured while replicating details in Finance-ms')
        return res.status(200).json({message: 'Cash advance submitted. Waiting for Travel Request to get booked'})
      }

      case 'awaiting pending settlement': {
        //send updated data to finance ms
        //const finance_res = await axios.post(`${FINANCE_API_URL}/cash-advance/`, updatedData)
        //if(finance_res.status!=200) throw new Error('Error occured while replicating details in Finance-ms')

        //send data to trip
        //const trip_res = await axios.post(`${TRIP_API_URL}/cash-advance/`, updatedData)
        //if(trip_res.status!=200) throw new Error('Error occured while replicating details in Finance-ms')
      
        return res.status(200).json({message: 'Cash advance submitted for settlement'})
      }

      

      case 'pending approval': {
        //send updated data to approval ms
        //const approval_res = await axios.post(`${APPROVAL_API_URL}/cash-advance/`, updatedData)
        //if(approval_res.status!=200) throw new Error('Error occured while replicating details in approval-ms')

        //check if TR status is booked
        if(updatedData.travelRequestData.travelRequestStatus == 'booked'){
          //send data to trip
          //const trip_res = await axios.post(`${TRIP_API_URL}/cash-advance/`, updatedData)
          //if(trip_res.status!=200) throw new Error('Error occured while replicating details in Finance-ms')

          //send data to expense
          //const expense_res = await axios.post(`${EXPENSE_API_URL}/cash-advance/`, updatedData)
          //if(expense_res.status!=200) throw new Error('Error occured while replicating details in expense-ms')
        }
        return res.status(200).json({message: 'Cash advance submitted for approval'})
      }
    }
  }catch(e){
      console.log(e)
      return res.status(500).json({message:'Internal server Error', Error:e})
  }
}

const getCashAdvances= async (req, res) => {
  try {
    console.log('route to get multiple cash advances')
    const {travelRequestId} = req.params
    console.log(travelRequestId)
    if(!travelRequestId){
      return res.status(400).json({message:'Bad Request. Missing travelRequestId'})
    }
    const cashAdvance = await CashAdvance.findOne({'travelRequestData.travelRequestId': travelRequestId}, {cashAdvancesData:1});

    if (!cashAdvance) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const cashAdvances = cashAdvance.cashAdvancesData

    return res.status(200).json({cashAdvances});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

const getCashAdvance = async (req, res) => {
  try {
    console.log('this got hit')
    const {travelRequestId, cashAdvanceId} = req.params
    if(!travelRequestId || !cashAdvanceId){
      return res.status(400).json({message:'Bad Request. Missing travelRequestId or cashAdvanceId'})
    }
    const cashAdvance = await CashAdvance.findOne({'travelRequestData.travelRequestId': travelRequestId}, {cashAdvancesData:1});

    if (!cashAdvance) {
      console.log('tr not found')
      return res.status(404).json({ message: "Travel Request not found" });
    }

    const cashAdvances = cashAdvance.cashAdvancesData

    if(!cashAdvances.some(ca=>ca.cashAdvanceId == cashAdvanceId)){
      console.log('ca not found')
      return res.status(404).json({message:'Cash Advance not found'})
    }

    return res.status(200).json({cashAdvance: cashAdvances.filter(ca=>ca.cashAdvanceId == cashAdvanceId)[0]});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

const getInitialData_cash = async (req, res) => {
  try{
    const {tenantId, employeeId} = req.params
    let tenantData = await HRMaster.findOne({tenantId}, {cashAdvanceOptions:1, multiCurrencyTable:1})

    if(!tenantData){
      return res.status(404).json({message: 'Can not find tenant/s for the given tenantId'})
    }

    //extract data relevant for rasing the cash advance.
    //1) Cash advance options 2) currency list
    const cashAdvanceOptions = tenantData.cashAdvaneOptions?? []
    const multiCurrencyTable = tenantData.multiCurrencyTable?? []
    res.status(200).json({cashAdvanceOptions, multiCurrencyTable})

  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Internal server error'})
  }
}

const validateCashAdvancePolicy = async (req, res) => {
  try {
    const {tenantId} = req.params
    const { type, groups, amount} = req.body;
    console.log(tenantId, type, groups, amount)
    //input validation needed
    if(!type || !groups || !amount){
      return res.status(400).json({message: 'Bad request missing values'})
    }

    const validation = await policyValidation(type.toLowerCase(), groups?.map(group=>group.toLowerCase()), amount);
    console.log(validation)
    return res.status(200).json({...validation});
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const cancelCashAdvance = async (req, res) =>{
  try{
    const {travelRequestId, cashAdvanceId} = req.params

    //find ca
    const cashAdvance = CashAdvance.findOne({'travelRequestData.travelRequestId': travelRequestId}, {cashAdvanceData:1, travelRequestData:1})

    if(!cashAdvance) return res.status(404).json({message:'Requested resource not found'})

    const cashAdvanceData = cashAdvance.cashAdvacneData
    const travelRequestData = cashAdvance.travelRequestData

    const sendToApproval = travelRequestData.approvers.length>0
    const sendToTrip = travelRequestData.sentToTrip && !['draft', 'pending approval', 'pending booking', 'cancelled'].includes(travelRequestStatus)

    //find ca details of given cashAdvanceId

    const cashAdvanceDetails = cashAdvanceData.find(ca=>ca.cashAdvanceId == cashAdvanceId)
    
    if(!cashAdvanceDetails){
      return res.status(404).json({message: 'Requested resource not found'})
    }

    //ca details found go ahead
    const currentStatus = cashAdvanceDetails.cashAdvanceStatus
    cashAdvanceDetails.cashAdvanceStatus = currentStatus == 'paid'? 'cancelled and paid' : 'cancelled'

    //update in database
    cashAdvanceData = [...cashAdvanceData.filter(ca=>ca.cashAdvanceId != cashAdvanceId), {...cashAdvanceDetails}]
    const updatedCashAdvance = CashAdvance.findOneAndUpdate({'travelRequestData.travelRequestId' : travelRequestId}, {$set: {cashAdvanceData}})

    //send data to dashboard
    await sendToDashboardQueue(updatedCashAdvance, true, 'online')

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
    if(sendToTrip){
      //send in trip
      //replicate data in trip microservice
      // const trip_res = axios.post(TRIP_ENDPOINT, result)
      
      // if(trip_res.status<200 || approval.status>299){
      //   return res.status(400).json({message: 'Unable to replicate data in approval microservice'})
      // }

      //replicate data in expense microservice
      // const expense_res = axios.post(APPROVAL_ENDPOINT, result)
      // if(expense_res.status(200)){
      //   return res.status(200).json({message: `Travel Request Sent for booking`});
      // }
      // else{
      //   return res.status(400).json({message: 'Unable to replicate data in expense microservice'})
      // }

      //just for now
      return res.status(200).json({message: `Cash advance cancelled`})
    }

  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Internal server error'})
  }
}

export { createCashAdvance, updateCashAdvance, getCashAdvances, getCashAdvance, getInitialData_cash, validateCashAdvancePolicy, cancelCashAdvance};
