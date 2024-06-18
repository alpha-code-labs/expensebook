import  createCashAdvanceId  from "../utils/createCashAdvanceId.js";
import axios from 'axios'
import CashAdvance from '../models/cashSchema.js';
import HRMaster from '../models/hrMaster.js';
import policyValidation from '../services/policyValidation.js';
import mongoose  from "mongoose";
import { sendToDashboardQueue, sendToOtherMicroservice } from "../rabbitMQ/publisher.js";
import dotenv from 'dotenv'

dotenv.config();

const TRAVEL_API_URL = process.env.TRAVEL_API_URL??'https://travel-server.victoriousplant-d49987f1.centralindia.azurecontainerapps.io/travel/internal/api';

 //'http://localhost:8021/travel/internal/api'  

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
      const tenantId = travelRequestData.tenantId

      if(cashAdvances.length>0){
        for(let i=0; i<cashAdvances.length; i++){
          if(cashAdvances[i].cashAdvanceStatus === 'draft'){
            return res.status(200).json({message:'There is a draft cash advance', cashAdvanceId:cashAdvances[i].cashAdvanceId})
          }
        }
      }

      //no CA in draft state. Create a new one 
      const createdBy = travelRequestData?.createdFor?.empId ?? travelRequestData.createdBy
      const travelRequestNumber = travelRequestData.travelRequestNumber
      const travelType = travelRequestData.travelType
      const count = cashAdvances.length+1;
      const cashAdvanceNumber = `CA${count.toString().padStart(4, '0')}`
      const cashAdvanceId = new mongoose.Types.ObjectId;
      
      //default currency fetched from onboarding data
      const defaultCurrency_res = await HRMaster.findOne({tenantId}, {companyDetails:1})
      
      //set it to something fixed. No other better Idea for now (maybe use locale)
      let defaultCurrency = {fullName:'Indian Rupees', shortName:'INR', symbol:'₹', countryCode:'IN'}

      if(defaultCurrency_res && Object.keys(defaultCurrency_res?.companyDetails?.defaultCurrency??{}).length>0){
        defaultCurrency = defaultCurrency_res.companyDetails.defaultCurrency
      }

      const newCashAdvance = {
        tenantId,
        travelRequestId,
        travelRequestNumber,
        travelType,
        cashAdvanceId,
        cashAdvanceNumber,
        createdBy,
        cashAdvanceStatus:'draft',
        cashAdvanceState:'section 0',
        amountDetails:[{amount:0, currency:defaultCurrency, mode:null}],
        approvers: travelRequestData.approvers,
        cashAdvanceViolations:null,
        cashAdvanceRequestDate: Date.now(),
        cashAdvanceApprovalDate:null,
        cashAdvanceSettlementDate:null,
        cashAdvanceRejectionReason:null,
        additionalCashAdvanceField:null
      }

      if(newCashAdvance.approvers.length > 0 ){
        newCashAdvance.approvers.forEach(approver=>{
          approver.status = 'pending approval'
        })
      }

      if(newCashAdvance.approvers.length > 0 ){
        newCashAdvance.approvers.forEach(approver=>{
          approver.status = 'pending approval'
        })
      }
      //update cash advance

      const updatedCashAdvance = await CashAdvance.findOneAndUpdate({'travelRequestData.travelRequestId': travelRequestId}, {$set: {cashAdvancesData:[...cashAdvances, newCashAdvance]}}, {new:true})
      //send data to dashboard
      //await sendToDashboardQueue(updatedCashAdvance, false, 'online')

      await sendToOtherMicroservice(updatedCashAdvance, 'full-update', 'dashboard', 'To update full cash advance data in dashboard')

      return res.status(200).json({message:'Created cash advance in draft state', cashAdvanceId})
    }
    //no raised cash advance found. 
    //Continue with normal flow--

    //fetch travel request from Travel MS
    const tr_res = await axios.get(`${TRAVEL_API_URL}/travel-requests/${travelRequestId}`)

    //check for errors
    if(tr_res.status === 404){
      return res.status(404).json({message: 'Travel request not found'});
    }
    else if(!tr_res.status === 200){
      return res.status(500).json({message: 'Server error occured while fetching travel request'});
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
    const travelType = travelRequestData.travelType
    const cashAdvanceNumber = `CA0001`
    const cashAdvanceId = new mongoose.Types.ObjectId

     //default currency fetched from onboarding data
     const defaultCurrency_res = await HRMaster.findOne({tenantId}, {companyDetails:1})
      
     //set it to something fixed. No other better Idea for now (maybe use locale)
     let defaultCurrency = {fullName:'Indian Rupees', shortName:'INR', symbol:'₹', countryCode:'IN'}

     if(defaultCurrency_res && Object.keys(defaultCurrency_res?.companyDetails?.defaultCurrency??{}).length>0){
       defaultCurrency = defaultCurrency_res.companyDetails.defaultCurrency
     }
    
    const cashAdvanceData = {
      travelRequestData: {...travelRequestData, isCashAdvanceTaken: true},
      cashAdvancesData:[{
        tenantId,
        travelRequestId,
        totalConvertedAmount: 0,
        defaultCurrency,
        travelRequestNumber,
        travelType,
        cashAdvanceId,
        cashAdvanceNumber,
        createdBy,
        cashAdvanceStatus:'draft',
        cashAdvanceState:'section 0',
        amountDetails:[{amount:0, currency:defaultCurrency, mode:null, convertedAmount:0, exchangeRate: 1}],
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
    //await sendToDashboardQueue(newCashAdvance, false, 'online')
    await sendToOtherMicroservice(newCashAdvance, 'full-update', 'dashboard', 'To update full cash advance data in dashboard')

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
    const ca_res = await CashAdvance.findOne({'travelRequestData.travelRequestId':travelRequestId})
    const cashAdvances = ca_res?.cashAdvancesData??[]

    if(!cashAdvances.some(ca=>ca.cashAdvanceId == cashAdvanceId)){
      return res.status(404).json({message:'Can not find the requested resource'})
    }

    //check for other validations that needs to be done..
    const updatedCashAdvance = req.body.cashAdvance
    const draft = req.body?.draft??false

    console.log(req.body, 'req.body')

    if(updatedCashAdvance==null || updatedCashAdvance==undefined){
      return res.status(400).json({message:'Bad Request. Missing required fields'})
    }

    //check if some amount is requested
    let amountDetails = updatedCashAdvance?.amountDetails
    console.log(amountDetails)

    if(amountDetails.length === 0){
      updatedCashAdvance.status = 'draft'
    }
    else{
      //fetch multicurrency details


      //remove cash advances with requested amount of '0'
      amountDetails = amountDetails.filter(item=>item.amount>0)
      console.log(amountDetails)
      if(draft??false) updatedCashAdvance.cashAdvanceStatus = 'draft';
      else{
        if(amountDetails.length == 0) updatedCashAdvance.cashAdvanceStatus = 'draft'
        else{
          //some amount is requested
          
          //populate converted amount in amount details
          const currencyRates_res = await HRMaster.findOne({tenantId: cashAdvances[0].tenantId}, {multiCurrencyTable:1});
          if(!currencyRates_res) throw new Error('Can not query multicurrency table');

          const multiCurrencyTable = currencyRates_res.multiCurrencyTable;
          const defaultCurrency = multiCurrencyTable.defaultCurrency;
          
          let totalConvertedAmount = 0;
          updatedCashAdvance.amountDetails.forEach(item=>{

            const exchangeValueItem = 
            multiCurrencyTable.exchangeValue.find(er=> er.currency.shortName  ==  item.currency.shortName)?? item.currency.shortName == defaultCurrency.shortName ? {value: 1} : false ;
            if(!exchangeValueItem) throw new Error('Can not find requested currencies conversion rate');

            const conversionRate = exchangeValueItem.value;
            item.exchangeRate = conversionRate;
            item.convertedAmount = Math.round(item?.amount*conversionRate*100)/100 ?? 0;
            totalConvertedAmount+=item.convertedAmount;
          })
          
          updatedCashAdvance.totalConvertedAmount = totalConvertedAmount;

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
    }

    const ca_index = cashAdvances.findIndex(ca=>ca.cashAdvanceId == cashAdvanceId)
    console.log(ca_index, 'index of cash advance')
    ca_res.cashAdvancesData[ca_index] = updatedCashAdvance;

    ca_res.cashAdvancesData.forEach((advance)=>console.log(advance?.totalConvertedAmount??'not found'));

    const requested_statusList = ['pending approval', 'pending settlement', 'awaiting pending settlement', 'cancelled', 'paid'] 

    ca_res.totalAdvanceRequested = ca_res.cashAdvancesData
    .filter(advance=>advance.totalConvertedAmount>0 && requested_statusList.includes(advance.cashAdvanceStatus) )
    .reduce((acc, advance)=> advance?.totalConvertedAmount + acc, 0);

    const granted_statusList = ['paid', 'recovered', 'paid and cancelled'] 
    ca_res.totalAdvanceGranted = ca_res.cashAdvancesData
    .filter(advance=>advance.totalConvertedAmount>0 && granted_statusList.includes(advance.cashAdvanceStatus) )
    .reduce((acc, advance)=> advance?.totalConvertedAmount + acc, 0);

    const recovered_statusList = ['recovered'] 
    ca_res.totalAdvanceRecovered = ca_res.cashAdvancesData
    .filter(advance=>advance.totalConvertedAmount>0 && recovered_statusList.includes(advance.cashAdvanceStatus) )
    .reduce((acc, advance)=> advance?.totalConvertedAmount + acc, 0);

    
    console.log(ca_res, 'ca_res')
    const updatedData = await ca_res.save()
    if(!updatedData) return res.status(200).json({message: 'Could not update the database'})
    //console.log(updatedData)

    //send data to dashboard

    //await sendToDashboardQueue(updatedData, false, 'online')
    await sendToOtherMicroservice(updatedData, 'full-update', 'dashboard', 'To update cash advance and travelRequest data in dashboard', 'cash')
    console.log('sent to dashboard')

    //check status
    switch(updatedCashAdvance.cashAdvanceStatus){
      case 'draft': return res.status(200).json({message:'Cash advance updated'});

      case 'pending settlement': {
        //send updated data to finance ms
        //const finance_res = await axios.post(`${FINANCE_API_URL}/cash-advance/`, updatedData)
        //if(finance_res.status!=200) throw new Error('Error occured while replicating details in Finance-ms')

        //sendToOtherMicroservice(updatedData, 'full-update', 'finance', 'To update travelRequestData and cashAdvanceData in approval-ms', 'cash' )
        return res.status(200).json({message: 'Cash advance submitted. Waiting for Travel Request to get booked'})
      }

      case 'awaiting pending settlement': {
        //send updated data to finance ms
        //const finance_res = await axios.post(`${FINANCE_API_URL}/cash-advance/`, updatedData)
        //if(finance_res.status!=200) throw new Error('Error occured while replicating details in Finance-ms')

        //send data to trip
        //const trip_res = await axios.post(`${TRIP_API_URL}/cash-advance/`, updatedData)
        //if(trip_res.status!=200) throw new Error('Error occured while replicating details in Finance-ms')
      
        sendToOtherMicroservice(updatedCashAdvance, 'partial-cash-update', 'trip', 'To update raised cash advance in trip-ms', 'cash' )
        return res.status(200).json({message: 'Cash advance submitted for settlement'})
      }

      case 'pending approval': {
        //send updated data to approval ms
        //const approval_res = await axios.post(`${APPROVAL_API_URL}/cash-advance/`, updatedData)
        //if(approval_res.status!=200) throw new Error('Error occured while replicating details in approval-ms')
    
        sendToOtherMicroservice(updatedData, 'full-update', 'approval', 'To update travelRequestData and cashAdvanceData in approval-ms', 'cash' )
        
        //sendToOtherMicroservice(updatedCashAdvance, 'partial-cash-update', 'trip', 'To update raised cash advance in trip-ms', 'cash' )
       
        //check if TR status is booked and sent to trip flas is yes
        if(updatedData.travelRequestData.travelRequestStatus == 'booked' && updatedData.travelRequestData.sendToTrip){
          //send data to trip
          sendToOtherMicroservice(updatedCashAdvance, 'partial-cash-update', 'trip', 'To update raised cash advance in trip-ms', 'cash' )
          //send data to expense
          sendToOtherMicroservice(updatedCashAdvance, 'partial-cash-update', 'expense', 'To update raised cash advance in expense-ms', 'cash' )
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

    const otherAdvances = cashAdvances.filter(ca=>ca.cashAdvanceId != cashAdvanceId)
    let totalAdvanceRequestedSoFar = 0

    //will build it later...
    // if(otherAdvances.length>0){
    //   otherAdvances.forEach(advance=>{
    //     if(advance.cashAdvanceStatus == 'pending approval' || advance.cashAdvanceStatu == 'pending settlement'){
    //       adv
    //     }
    //   })
    // }

    return res.status(200).json({cashAdvance: cashAdvances.filter(ca=>ca.cashAdvanceId == cashAdvanceId)[0], totalAdvanceRequestedSoFar});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

const getInitialData_cash = async (req, res) => {
  try{
    const {tenantId, employeeId} = req.params
    console.log(tenantId)
    let tenantData = await HRMaster.findOne({tenantId}, {advanceSettlementOptions:1, multiCurrencyTable:1})

    if(!tenantData){
      return res.status(404).json({message: 'Can not find tenant/s for the given tenantId'})
    }

    //extract data relevant for rasing the cash advance.
    //1) Cash advance options 2) currency list
    let cashAdvanceOptions = []
    if(Object.keys(tenantData?.advanceSettlementOptions??{}).length>0){
      cashAdvanceOptions = Object.keys(tenantData?.advanceSettlementOptions).map(key=> {
        if(tenantData.advanceSettlementOptions[key]) return key
      }).filter(val=>val!=null)
    }
    const multiCurrencyTable = tenantData.multiCurrencyTable?? []
    res.status(200).json({cashAdvanceOptions, multiCurrencyTable})

  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Internal server error'})
  }
}

const validateCashAdvancePolicy = async (req, res) => {
  try {
    // const {tenantId} = req.params
    const { tenantId, employeeId, type, amount} = req.body;
    console.log(tenantId, type, employeeId, amount)
    //input validation needed
    if(!tenantId || !employeeId || !type || !amount){
      return res.status(400).json({message: 'Bad request missing values'})
    }

    const validation = await policyValidation(tenantId, employeeId, type, amount);
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
    const cashAdvance = await CashAdvance.findOne({'travelRequestData.travelRequestId': travelRequestId}, {cashAdvancesData:1, travelRequestData:1})

    if(!cashAdvance) return res.status(404).json({message:'Requested resource not found'})

    const cashAdvanceData = cashAdvance.cashAdvancesData
    const travelRequestData = cashAdvance.travelRequestData
    const travelRequestStatus = travelRequestData.travelRequestStatus

    const sendToApproval = travelRequestData.approvers.length>0
    const sendToTrip = travelRequestData.sentToTrip && !['draft', 'pending approval', 'pending booking', 'cancelled'].includes(travelRequestStatus)

    //find ca details of given cashAdvanceId

    const cashAdvanceDetails = cashAdvanceData.find(ca=>ca.cashAdvanceId == cashAdvanceId)
    
    if(!cashAdvanceDetails){
      return res.status(404).json({message: 'Requested resource not found'})
    }
    

    //ca details found go ahead
    const currentStatus = cashAdvanceDetails.cashAdvanceStatus
    cashAdvanceDetails.cashAdvanceStatus = currentStatus == 'paid'? 'paid and cancelled' : 'cancelled'

    //update in database
    const cashAdvancesData = [...cashAdvanceData.filter(ca=>ca.cashAdvanceId != cashAdvanceId), {...cashAdvanceDetails}]
    const updatedCashAdvance = await CashAdvance.findOneAndUpdate({'travelRequestData.travelRequestId' : travelRequestId}, {$set: {cashAdvancesData}}, {new:true})

    //send data to dashboard
    await sendToDashboardQueue(updatedCashAdvance, true, 'online')

    const payload = {
      tenantId: updatedCashAdvance.travelRequestData.tenantId,
      travelRequestId: updatedCashAdvance.travelRequestData.travelRequestId,
      cashAdvanceId,
      cashAdvanceStatus: cashAdvanceDetails.cashAdvanceStatus
    }

    if(sendToTrip){
      //send to trip and expense
      await sendToOtherMicroservice(payload, 'cancel-cash-update', 'expense', 'To update raised cash advance in expense-ms', 'cash' )
      await sendToOtherMicroservice(payload, 'cancel-cash-update', 'trip', 'To update raised cash advance in trip-ms', 'cash' )
    }

    return res.status(200).json({message: `Cash advance cancelled`})

  }catch(e){
    console.log(e)
    return res.status(500).json({message: 'Internal server error'})
  }
}

export { 
  createCashAdvance, 
  updateCashAdvance, 
  getCashAdvances, 
  getCashAdvance, 
  getInitialData_cash, 
  validateCashAdvancePolicy, 
  cancelCashAdvance
};
