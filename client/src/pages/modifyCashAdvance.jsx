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
import CommentBox from '../components/common/CommentBox';
import { currenciesList } from '../data/currenciesList';
import Error from '../components/common/Error';

const CASH_API_URL = import.meta.env.VITE_API_BASE_URL
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
  const [reasonError, setReasonError] = useState({set:false, message: 'Please state reason for cash advance'});
  const [loadingErrMsg, setLoadingErrMsg] = useState(null)

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
      if(currency?.shortName == multiCurrencyTable?.defaultCurrency?.shortName) return 1
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
          //window.location.href = `${DASHBOARD_URL}/${tenantId}/${employeeId}/overview`
          window.parent.postMessage('closeIframe', DASHBOARD_URL);
        }, 5000)
      }

    }catch(e){console.log(e)}
  }


  const handleSubmit = async ()=>{
    //do validations
  
    async function validate(){
      return(new Promise((resolve, reject)=>{
        if(cashAdvance.amountDetails.some(item=>item.amount > 0)){
          if(cashAdvance.cashAdvanceReason == undefined || cashAdvance.cashAdvanceReason == ""){
            setReasonError({set:true, message:''});
            return;
          }else {
            setReasonError({set:false, message:''})
          }
        }else{
          setReasonError({set:false, message:''})
        }
        
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
          //window.location.href = `${DASHBOARD_URL}/${tenantId}/${employeeId}/overview`
          
          window.parent.postMessage('closeIframe', DASHBOARD_URL);
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

  function handleReasonChange(e){
    const cashAdvance_copy = JSON.parse(JSON.stringify(cashAdvance))
    cashAdvance_copy.cashAdvanceReason = e.target.value;
    setCashAdvance(cashAdvance_copy)
  }

    
  return (<>
    {loading && <Error message={loadingErrMsg}/>}
    {!loading && <div className="w-fit h-full relative bg-white md:px-8 sm:px-2 mx-auto py-4 select-none">

            {/* Rest of the section */}
              {<div className='w-full h-full mt-10'>   
                {/* back link */}
                <div className='flex items-center gap-4 cursor-pointer'>
                    <p className='text-neutral-700 text-md font-semibold font-cabin'>Create Cash Advance</p>
                </div>

                <div className='mt-10 flex flex-col gap-4'>

                  <div className='flex flex-col gap-2 mb-2'>
                    <div>
                      <p className='font-cabin text-xs text-neutral-600'>Trip Name</p>
                      <p className='font-sans-serif tex-[14px] text-neutral-700'>{cashAdvance?.tripName}</p>
                    </div>
                    <p className='font-cabin text-sm tracking-tight text-yellow-600'>{violationMessage}</p>
                  </div>

                 { cashAdvance.approvers && cashAdvance.approvers.length > 0 && <div className='flex flex-col gap-2 mb-2'>
       
                      <p className='font-cabin text-xs text-neutral-600'>Approvers</p>
                        {cashAdvance?.approvers && cashAdvance?.approvers?.length>0 && cashAdvance?.approvers.map((approver, index)=>
                          <div
                              key={index}
                              className='h-[40px] w-fit px-2 py-.5 flex gap-2 bg-gray-100 hover:bg-gray-200 rounded-sm items-center transition ease-out hover:ease-in'>
                              <img src={approver?.imageUrl??'https://blobstorage0401.blob.core.windows.net/avatars/IDR_PROFILE_AVATAR_27@1x.png'} className='w-8 h-8 rounded-full' />
                              <div className="text-neutral-700 text-normal text-sm sm:text-[14.5px] font-cabin -mt-1 sm:mt-0">{approver.name}</div>
                          </div>)}
                  </div>}


                  
                
                <div className='mt-8'>
                    <CommentBox title='Reason for Cash Advance' onchange={handleReasonChange} value={cashAdvance.cashAdvanceReason} error={reasonError} />
                </div>
                
                {cashAdvance.amountDetails?.map((amountLine, index)=>
                  <div key={index}>
                    <div className='flex gap-4 items-center'>
                    <CurrencyInput 
                      id={index} 
                      amount={amountLine.amount} 
                      currency={amountLine.currency} 
                      mode={amountLine.mode} 
                      onModeChange= {handleModeChange} 
                      currencyOptions={currenciesList.map(cr=>({...cr, imageUrl:`https://hatscripts.github.io/circle-flags/flags/${cr.countryCode.toLowerCase()}.svg`}))} 
                      onAmountChange={handleAmountChange} 
                      onCurrencyChange={handleCurrencyChange} 
                      setSearchParam={setSearchParam} 
                      removeItem={removeItem} />
                    
                     {index + 1 == cashAdvance.amountDetails.length && 
                     <div className='' onClick={handleAddMore}>
                        <p className='text-blue-800 underline cursor-pointer'>Add More</p>
                      </div>}

                    </div>
                  </div>)
                }
                </div>

                <div className='flex flex-row-reverse mt-10 justify-between items-center w-full'>
                  <Button variant='fit' text="Submit" onClick={handleSubmit} />
                </div>
              </div>}
              
              <PopupMessage showPopup={showPopup} setshowPopup={setShowPopup} message={popupMessage} />
      </div>}
      </>);
};

