import Icon from '../components/common/Icon'
import leftArrow_icon from '../assets/arrow-left.svg'
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CurrencyInput from "../components/CurrencyIntput";

import axios from 'axios'
import AddMore from '../components/common/AddMore';
import Button from '../components/common/Button'
import PopupMessage from '../components/common/PopupMessage';
import { cashPolicyValidation_API, getOnboardingDataForCash_API } from '../utils/api';

const CASH_API_URL = import.meta.env.VITE_TRAVEL_API_URL
const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL

export default function(){

  const navigate = useNavigate()
  const {travelRequestId, cashAdvanceId} = useParams()

  const [tenantId, setTenantId] = useState(null)
  const [employeeId, setEmployeeId] = useState('')

  const handleBackButton = ()=>{
    window.location.href = `${DASHBOARD_URL}/${tenantId}/${employeeId}/overview`
  }

  const [cashAdvance, setCashAdvance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currencyDropdown, setCurrencyDropdown] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [paymentOptions, setPaymentOptions] = useState([])
  const [multiCurrencyTable, setMultiCurrencyTable] = useState([])
  const [defaultCurrency, setDefaultCurrency] = useState({fullName:'Indian Rupees', shortName:'INR', symbol:'₹', countryCode:'IN'})
  const [violationMessage, setViolationMessage] = useState(cashAdvance?.cashAdvanceViolations??undefined)


  useEffect(()=>{
    console.log(multiCurrencyTable)
    setFilteredCurrencyOptions(multiCurrencyTable.exchangeValue)
    setDefaultCurrency(multiCurrencyTable.defaultCurrency)
  }, [multiCurrencyTable])

  useEffect(()=>{
    (async function(){
      try{
        const res = await axios.get(`${CASH_API_URL}/cash-advances/${travelRequestId}/${cashAdvanceId}`)
        //const onboardingData_res = await axios.get(`${CASH_API_URL}/initial-data-cash/${tenantId}/${employeeId}`)
        if(res.status === 200){
          const cashAdvance = res.data.cashAdvance 
          console.log(cashAdvance)
          setCashAdvance(cashAdvance)
          setViolationMessage(cashAdvance?.cashAdvanceViolations??undefined)

          const tenantId = cashAdvance.tenantId
          setTenantId(tenantId)
          const employeeId = cashAdvance.createdBy.empId
          setEmployeeId(employeeId)
          const travelType = cashAdvance?.travelType??'international'
          const onboardingData_res = await getOnboardingDataForCash_API({tenantId, EMPLOYEE_ID:employeeId, travelType})        

          if(!onboardingData_res.err){
            const onboardingData = onboardingData_res.data.onboardingData
            console.log(onboardingData)
            setPaymentOptions(onboardingData.cashAdvanceOptions)
            setMultiCurrencyTable(onboardingData.multiCurrencyTable)
            setLoading(false)
          }
        }
        
      }catch(e){
        console.log(e)
      }
    })()
    
  },[])

  const [filteredCurrencyOptions, setFilteredCurrencyOptions] = useState(multiCurrencyTable.exchangeValue)
  const [searchParam, setSearchParam] = useState('')
  
  useEffect(()=>{
    console.log(filteredCurrencyOptions)
  },[filteredCurrencyOptions])

  useEffect(()=>{
    if(searchParam == '' || searchParam == null || searchParam==undefined)
    setFilteredCurrencyOptions(multiCurrencyTable.exchangeValue)

    else{
     const filteredOptions = multiCurrencyTable.exchangeValue.filter(option=> (option.currency.fullName.toLowerCase().startsWith(searchParam.toLowerCase()) || option.currency.shortName.toLowerCase().startsWith(searchParam.toLowerCase()) ))
     setFilteredCurrencyOptions(filteredOptions)
    }

  }, [searchParam])

  useEffect(()=>{
    console.log(cashAdvance)
  },[cashAdvance])

  async function amountValidator(cashAdvance){
    const exchangeValue = (currency)=>{
      if(currency.shortName == multiCurrencyTable.defaultCurrency.shortName) return 1
      const foundCurrency = multiCurrencyTable.exchangeValue.find(exchangeCurrency=> exchangeCurrency.currency.shortName == currency.shortName)
      console.log(foundCurrency)
      return foundCurrency?.value??0
    }
    console.log(cashAdvance.amountDetails[0])
    let totalAmountInDefaultCurrency = 0
    if(cashAdvance.amountDetails.length>0){
      totalAmountInDefaultCurrency = cashAdvance.amountDetails
      .map(amd=>{
        if(amd.amount!=null && amd.amount!=undefined && amd.amount)
         return amd.amount*exchangeValue(amd.currency)})
      .reduce((acc,cur)=>acc+cur)
      console.log(totalAmountInDefaultCurrency)
    }
    
    const res = await cashPolicyValidation_API({tenantId, employeeId:cashAdvance.createdBy.empId, type:'international', amount:totalAmountInDefaultCurrency})
    console.log(res.data)
    if(res.err) return
    setViolationMessage(res.data.response.violationMessage)
    return res.data.response.violationMessage
  }

  const handleAmountChange = async (value, id) =>{
    const cashAdvance_copy = JSON.parse(JSON.stringify(cashAdvance))
    cashAdvance_copy.amountDetails[id].amount = value
    cashAdvance_copy.cashAdvanceViolations = await amountValidator(cashAdvance_copy) 
    setCashAdvance(cashAdvance_copy)
  }

  const handleCurrencyChange = async (value, id)=>{
    const cashAdvance_copy = JSON.parse(JSON.stringify(cashAdvance))
    cashAdvance_copy.amountDetails[id].currency = value
    cashAdvance_copy.cashAdvanceViolations = await amountValidator(cashAdvance_copy) 
    setCashAdvance(cashAdvance_copy) 
  }

  const handleModeChange = (value, id)=>{
    const cashAdvance_copy = JSON.parse(JSON.stringify(cashAdvance))
    cashAdvance_copy.amountDetails[id].mode = value
    setCashAdvance(cashAdvance_copy) 
  }

  const removeItem = (id)=>{
    const cashAdvance_copy = JSON.parse(JSON.stringify(cashAdvance))
    cashAdvance_copy.amountDetails = cashAdvance.amountDetails.filter((_,index)=> index != id)
    setCashAdvance(cashAdvance_copy)
  }

  const handleAddMore = ()=>{
    const cashAdvance_copy = JSON.parse(JSON.stringify(cashAdvance))
    cashAdvance_copy.amountDetails.push({currency:defaultCurrency, amount:'0', mode:null})
    setCashAdvance(cashAdvance_copy)
  }



  const handleSaveAsDraft = async ()=>{
    let allowSubmit = false
    
    async function validate(){
      return(new Promise((resolve, reject)=>{

        allowSubmit=true
        resolve()
      }))
    }

    await validate()

    
    //send data to backend 
    try{
      console.log('this ran')
      const res = await axios.post(`${CASH_API_URL}/cash-advances/${travelRequestId}/${cashAdvance.cashAdvanceId}`, {cashAdvance, draft:true})
      console.log(res.data)

      if(res.status == 200){
        setPopupMessage("Your cash advance has been saved in draft")
        setShowPopup(true)

        //redirect to desktop after 5 seconds
        setTimeout(()=>{
          setShowPopup(false)
          window.location.href = `${DASHBOARD_URL}/${tenantId}/${employeeId}/overview`
        }, 5000)
      }

    }catch(e){console.log(e)}
  }

  const handleSubmit = async ()=>{
    //do validations
    let allowSubmit = false
    
    async function validate(){
      return(new Promise((resolve, reject)=>{

        allowSubmit=true
        resolve()
      }))
    }

    await validate()

    
    //send data to backend 
    try{
      console.log('this ran')
      const res = await axios.post(`${CASH_API_URL}/cash-advances/${travelRequestId}/${cashAdvance.cashAdvanceId}`, {cashAdvance})
      console.log(res.data)

      if(res.status == 200){
        setPopupMessage(res.data.message)
        setShowPopup(true)

        //redirect to desktop after 5 seconds
        setTimeout(()=>{
          setShowPopup(false)
          window.location.href = `${DASHBOARD_URL}/${tenantId}/${employeeId}/overview`
        }, 5000)
      }

    }catch(e){console.log(e)}
  }

  function spitUnderstandableStatus(status){
    switch(status){
        case 'awaiting pending settlement' : return 'Waiting for the travel request to get booked'
        case 'pending settlement': return 'Qued for settlement'
        case 'draft' : return 'Draft'
        case 'cancelled': return 'Cancelled'
        case 'rejected': return 'Rejected'
        case 'pending approval': return 'Qued for Approval'
    }
  }

    
  return (
    <div className="w-full h-full relative bg-white md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none">
            {/* app icon */}
            <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
                <Icon/>
            </div>

            {/* Rest of the section */}
              {loading && <div className='w-full h-full mt-10 p-10'>Loading...</div>}
              {!loading && <div className='w-full h-full mt-10 p-10'>   

                {/* back link */}
                <div className='flex items-center gap-4 cursor-pointer' onClick={handleBackButton}>
                    <img className='w-[24px] h-[24px]' src={leftArrow_icon} />
                    <p className='text-neutral-700 text-md font-semibold font-cabin'>Edit Cash Advance</p>
                </div>
                
                <div className='mt-10 flex flex-col gap-4'>
                  <div className='flex items-center flex-wrap gap-6 mb-2'>
                  <div>
                    <p className='font-cabin text-xs text-neutral-600'>Travel Request Number</p>
                    <p className='font-cabin font-semibold tex-lg'>{cashAdvance?.travelRequestNumber}</p>
                  </div>
                  <p className='font-cabin text-sm tracking-tight text-yellow-600'>{violationMessage}</p>
                </div>
                </div>


                <div className='mt-10 flex flex-col gap-4'>
                <div className='flex font-cabin gap-1'>
                  <p className='text-sm text-neutral-700'>Status :</p>
                  <p className='text-sm text-neutral-600'>{spitUnderstandableStatus(cashAdvance.cashAdvanceStatus)}</p>
                </div>
                {cashAdvance.amountDetails?.map((amountLine, index)=>
                  <CurrencyInput id={index} amount={amountLine.amount} currency={amountLine.currency} mode={amountLine.mode} onModeChange= {handleModeChange} currencyOptions={filteredCurrencyOptions} onAmountChange={handleAmountChange} onCurrencyChange={handleCurrencyChange} setSearchParam={setSearchParam} removeItem={removeItem} />)
                }
                </div>

                <div className='mt-6'>
                  <AddMore onClick={handleAddMore} />
                </div>

                <div className='flex mt-10 justify-between items-center w-full'>
                  <Button variant='fit' text="Save As Draft" onClick={handleSaveAsDraft} />
                  <Button variant='fit' text="Submit" onClick={handleSubmit} />
                </div>

              </div>}
              
              <PopupMessage showPopup={showPopup} setshowPopup={setShowPopup} message={popupMessage} />
      </div>
      );
};

