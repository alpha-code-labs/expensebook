import Icon from '../components/common/Icon'
import leftArrow_icon from '../assets/arrow-left.svg'
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CircleFlag } from 'react-circle-flags'
import axios from 'axios'
import AddMore from '../components/common/AddMore';
import Button from '../components/common/Button'
import PopupMessage from '../components/common/PopupMessage';
import CloseButton from '../components/common/closeButton'
import { cashPolicyValidation_API } from '../utils/api';

const CASH_API_URL = import.meta.env.VITE_TRAVEL_API_URL

const currencyOptions = [
  'USD $',
  'EUR €',
  'GBP £',
  'JPY ¥',
  'AUD $',
  'CAD $',
  'CHF Fr',
  'CNY ¥',
  'INR ₹',
  'SGD $',
];

export default function(){

  const navigate = useNavigate()
  const {travelRequestId} = useParams()

  const handleBackButton = ()=>{
    //navigate(TRAVEL_URL)
  }

  const [cashAdvance, setCashAdvance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currencyDropdown, setCurrencyDropdown] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [paymentOptions, setPaymentOptions] = useState(['Cheque', 'Account Transfer', ''])
  const [multiCurrencyTable, setMultiCurrencyTable] = useState([])
  const [defaultCurrency, setDefaultCurrency] = useState({fullName:'Indian Rupees', shortName:'INR', symbol:'₹', countryCode:'IN'})
  const [violationMessage, setViolationMessage] = useState(null)

  const tenantId = 'tynod76eu'
  const employeeId = 1001

//   const debounce = (func, delay) => { 
//     let timer 
//     return function(...args) { 
//             clearTimeout(timer) 
//                 timer = setTimeout(() => func.apply(this, args), delay) 
//     } 
// } 

  useEffect(()=>{
    console.log(multiCurrencyTable)
    setFilteredCurrencyOptions(multiCurrencyTable.exchangeValue)
    setDefaultCurrency(multiCurrencyTable.defaultCurrency)
  }, [multiCurrencyTable])

  useEffect(()=>{
    (async function(){
      try{
        const res = await axios.post(`${CASH_API_URL}/cash-advances/${travelRequestId}`)
        const onboardingData_res = await axios.get(`${CASH_API_URL}/initial-data-cash/${tenantId}/${employeeId}`)
          
        if(onboardingData_res.status == 200){
          const onboardingData = onboardingData_res.data
          setPaymentOptions(onboardingData.cashAdvanceOptions)
          console.log(onboardingData.cashAdvanceOptions)
          setMultiCurrencyTable(onboardingData.multiCurrencyTable)
        }

        console.log(res)
        if(res.status > 199 && res.status < 300){
          console.log(res.data, '...res.data')
          const cashAdvanceId = res.data.cashAdvanceId

          const ca_res = await axios.get(`${CASH_API_URL}/cash-advances/${travelRequestId}/${cashAdvanceId}`)
          const cashAdvance = ca_res.data.cashAdvance 

          console.log(cashAdvance)

          setCashAdvance(cashAdvance)
          setLoading(false)
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
    
    const res = await cashPolicyValidation_API({tenantId, groups:['group 1'], type:'international', amount:totalAmountInDefaultCurrency})
    console.log(res.data)
    if(res.err) return
    setViolationMessage(res.data.response.violationMessage)
    return res.data.response.violationMessage
  }

  //const debouncedAmountValidator = useCallback(debounce(amountValidator(cashAdvance, multiCurrencyTable), 3000),[])

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

  const handleSaveAsDraft = ()=>{
    setPopupMessage("Your cash advance has been saved in draft")
    setShowPopup(true)
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
          //navigate(DESKTOP_URL)
        }, 5000)
      }

    }catch(e){console.log(e)}
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
                    <p className='text-neutral-700 text-md font-semibold font-cabin'>Create Cash Advance</p>
                </div>

                <div className='mt-10 flex flex-col gap-4'>
                  <div className='flex items-center flex-wrap gap-6 mb-2'>
                  <p className='font-cabin font-semibold tex-lg'>{cashAdvance?.travelRequestNumber}</p>
                  <p className='font-cabin text-sm tracking-tight text-yellow-600'>{violationMessage}</p>
                </div>

                {cashAdvance.amountDetails?.map((amountLine, index)=>
                  <div key={index}>
                    <CurrencyInput id={index} amount={amountLine.amount} currency={amountLine.currency} mode={amountLine.mode} onModeChange= {handleModeChange} currencyOptions={filteredCurrencyOptions} cashAdvanceOptions={paymentOptions} onAmountChange={handleAmountChange} onCurrencyChange={handleCurrencyChange} setSearchParam={setSearchParam} removeItem={removeItem} />
                  </div>)
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


const CurrencyInput = ({id, amount, currency, mode, onModeChange, currencyOptions, cashAdvanceOptions, onAmountChange, onCurrencyChange, setSearchParam, removeItem })=>{

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null)
  const dropdownTriggerRef = useRef(null)

  //close dropdown on outside click


//for closing the dropdown on outside click
useEffect(() => {
  const handleClick = (event) => {
    if (dropdownRef.current && dropdownTriggerRef && !dropdownTriggerRef.current.contains(event.target) && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
        console.log('this ran')
    }
  };
  document.addEventListener("click", handleClick)

  return () => {
    console.log('removing dropdown')
    document.removeEventListener("click", handleClick)
  }

}, []);


  return (<>
      <div className="px-4 py-3 rounded-xl bg-gray-200 border border-gray-400 flex gap-8">
        <div className='relative flex items-center gap-4'>
            <div className='relative'>
            <div 
              ref={dropdownTriggerRef}
              onClick={(e)=>{e.stopPropagation; console.log('state-', isDropdownOpen); setIsDropdownOpen(pre=>!pre)}}
              className='flex items-center gap-6 cursor-pointer p-2 rounded-md hover:bg-gray-100'>
              <div className='w-6 h-6'>
                  <CircleFlag countryCode={currency?.countryCode.toLowerCase()??'in'} />
              </div>
              <p className="symbol">{currency?.shortName}</p>
            </div>
            {isDropdownOpen && 
              <div ref={dropdownRef} className='z-[100] pt-4 flex flex-col items-center justify-center w-[150px] -left-[7%] top-[40px] absolute shadow-sm border-sm border-gray-400'>
                    <div className='relative bg-white border border-gray-200'>
                        <div className='absolute top-1 left-0 px-1'>
                          <input type='text' className='px-2 py-1 rounded-md w-[140px] text-xs border border-gray-400 bg-gray-100 focus-visible:bg-white focus-visible:outline-0 focus-visible:border-indigo-600'  onChange={(e)=>setSearchParam(e.target.value)} />
                        </div>
                        
                        <div className='mt-8 h-[200px] w-[150px] p-4 overflow-y-scroll scroll flex flex-col divide-y font-cabin text-sm gap-1 text-neutral-700'>
                            {currencyOptions.length>0 && currencyOptions.map(option=><div className='hover:bg-indigo-600 hover:text-gray-100' onClick={(e)=>{onCurrencyChange(option.currency,id); setIsDropdownOpen(false)}}>{option.currency.fullName}-({option.currency.shortName})</div>)}
                        </div>
                    </div>
                </div>}
            </div>
            <div className='flex items-center gap-2 text-neutral-700 font-cabin font-normal text-sm'>
                
                <input value={amount}  placeholder='amount' onChange={(e)=>onAmountChange(e.target.value, id)} className="border border-gray-200 w-[120px] h-10 rounded-md p-4 border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600" />
                <select placeholder='mode' value={mode} onChange={(e)=>onModeChange(e.target.value, id)} className="font-cabin border border-gray-200 w-[120px] h-10 rounded-md border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600" >
                  {cashAdvanceOptions.length>0 ? cashAdvanceOptions.map(caoption=><option>{caoption}</option>) : <option>Default</option>}
                </select>
            </div>
            <div className=''>
              <CloseButton onClick={()=>removeItem(id)} />
            </div>
        </div>
    </div>
  </>)
}