import Icon from '../components/common/Icon'
import leftArrow_icon from '../assets/arrow-left.svg'
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CircleFlag } from 'react-circle-flags'

import axios from 'axios'
import AddMore from '../components/common/AddMore';
import Button from '../components/common/Button'
import PopupMessage from '../components/common/PopupMessage';
import CloseButton from '../components/common/closeButton'
import { cancelCashAdvance_API, cashPolicyValidation_API, getCashAdvance_API } from '../utils/api';
import Modal from '../components/common/Modal';
import Error from '../components/common/Error';


const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL


export default function(){
  const {travelRequestId, cashAdvanceId} = useParams()

  const handleBackButton = ()=>{
    //back to dashboard
    window.location.href = `${DASHBOARD_URL}/${tenantId}/${employeeId}/overview`
  }

  const [cashAdvance, setCashAdvance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingErrMsg, setLoadingErrMsg] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [violationMessage, setViolationMessage] = useState(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [tenantId, setTenantId] = useState(undefined)
  const [employeeId, setEmployeeId] = useState(undefined)


  useEffect(()=>{
    (async function(){
      try{
        //const res = await axios.get(`${CASH_API_URL}/cash-advances/${travelRequestId}/${cashAdvanceId}`)
        const res = await getCashAdvance_API({travelRequestId, cashAdvanceId})
        if(!res.err){
          const cashAdvance = res.data.cashAdvance 
          console.log(cashAdvance)
          setCashAdvance(cashAdvance)
          setTenantId(cashAdvance.tenantId)
          setEmployeeId(cashAdvance.createdBy.empId) 
          setViolationMessage(cashAdvance.cashAdvanceViolations??'')
          setLoading(false)
        }
        else{
          setLoadingErrMsg(res.err);
        }
      }catch(e){
        console.log(e)
      }
    })()
    
  },[])

  useEffect(()=>{
    console.log(cashAdvance)
  },[cashAdvance])


  const handleSubmit = async ()=>{

    setShowCancelModal(false)
    const res = await cancelCashAdvance_API({travelRequestId, cashAdvanceId})

    if(res.err) return
    // setPopupMessage('Advance cancelled')
    // setShowPopup(true)

    window.parent.postMessage({message:"cash message posted" , 
    popupMsgData: { showPopup:true, message:"Advance cancelled", iconCode: "101" }}, DASHBOARD_URL);

    //redirect to desktop after 5 seconds
    setTimeout(()=>{
        //setShowPopup(false)
        window.location.href = `${DASHBOARD_URL}/${tenantId}/${employeeId}/overview`
        }, 0)
  }

  function spitUnderstandableStatus(status){
    switch(status){
        case 'awaiting pending settlement' : return 'Waiting for the travel request to get booked'
        case 'pending settlement': return 'Qued for settlement'
        case 'draft' : return 'Draft'
        case 'cancelled': return 'Cancelled'
        case 'rejected': return 'Rejected'
        case 'approved': return 'Approved'
        case 'pending approval' : return 'pending approval'
    }
  }

  return (
    <>
      {loading && <Error message={loadingErrMsg}/>}
      {!loading && <div className="w-full h-full relative bg-white md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none">
            {/* app icon */}
            <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
                <Icon/>
            </div>

            {/* Rest of the section */}
              <div className='w-full h-full mt-10 p-10'>   

                {/* back link */}
                <div className='flex items-center gap-4 cursor-pointer' onClick={handleBackButton}>
                    <img className='w-[24px] h-[24px]' src={leftArrow_icon} />
                    <p className='text-neutral-700 text-md font-semibold font-cabin'>Cancel Cash Advance</p>
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
                <div className='flex'>{`status: ${spitUnderstandableStatus(cashAdvance.cashAdvanceStatus)}`}</div>
                {cashAdvance.amountDetails?.map((amountLine, index)=>
                  <CurrencyInput id={index} amount={amountLine.amount} currency={amountLine.currency} mode={amountLine.mode??'Default'} />)
                }
                </div>

                <div className='flex flex-row-reverse mt-10 w-full'>
                  <Button variant='fit' text="Cancel" onClick={()=>setShowCancelModal(true)} />
                </div>

              </div>
              
              {showCancelModal && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
                <div className='z-10 max-w-4/5 w-fit min-h-4/5 max-h-4/5 scroll-none bg-white rounded-lg shadow-md'>
                    <div className="p-10">
                        <p className="text-xl font-cabin">Are you sure you want to cancel?</p>
                        <div className="flex mt-10 justify-between">
                            <Button variant='fit' text='Yes, cancel it' onClick={()=>handleSubmit()} />
                            <Button variant='fit' text='No' onClick={()=>setShowCancelModal(false)} />
                        </div>
                    </div>
                </div>
            </div>} 

            <PopupMessage showPopup={showPopup} setshowPopup={setShowPopup} message={popupMessage} />
      </div> }
    </>
      );
};

const CurrencyInput = ({id, amount, currency, mode})=>{
  return (<>
      <div className="px-2 sm:px-4 py-3 rounded-xl bg-gray-200 border border-gray-400 flex gap-8 w-fit">
        <div className='relative flex items-center gap-4'>
            <div className='relative'>
            <div 
              className='flex items-center gap-6 p-2 rounded-md'>
              <div className='w-6 h-6'>
                  <CircleFlag countryCode={currency?.countryCode.toLowerCase()??'in'} />
              </div>
              <p className="symbol">{currency?.shortName}</p>
            </div>
            </div>

            <div className='flex items-center gap-2 text-neutral-700 font-cabin font-normal text-sm'>
                
                <div className="inline-flex items-center border border-gray-200 w-[120px] h-10 rounded-md p-4 border-neutral-300">
                    {amount}
                </div>
                <div className="inline-flex items-center p-4 font-cabin border border-gray-200 w-[120px] h-10 rounded-md border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600" >
                  {mode}
                </div>

            </div>

        </div>
    </div>
  </>)
}