/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/display-name */
import { useState, useEffect} from "react";
import {BrowserRouter as Router, useParams} from 'react-router-dom';
import axios from 'axios'
import Icon from "../components/common/Icon";
import { titleCase } from "../utils/handyFunctions";
import Button from "../components/common/Button";
import Error from "../components/common/Error";
import PopupMessage from "../components/common/PopupMessage";
import CashAdvanceDetails from "../itinerary/CashAdvanceDetails";
import { double_arrow, calender, cab_purple as cab_icon, airplane_1 as airplane_icon} from "../assets/icon";
//import { getRawTravelRequest_API, updateRawTravelRequest_API, cancelTravelRequest_API } from "../utils/api";
import dummyTravelWithCashAdvanceData from "../dummyData/travelWithCash";
import Select from "../components/common/Select";
import ActionButton from "../components/common/ActionButton";
import { approveLineItemApi, rejectLineItemApi } from "../utils/tripApi";

const rejectionReasonOptions = [
    'Too many Violations',
    'Budget Constraints',
    'Insufficient Documents',
    'Upcoming Project Deadline'
]

export default function () {
  //get travel request Id from params
   
    const [showPopup, setShowPopup] = useState(false)
    const [message, setMessage] = useState(false)
    const [showConfimationForCancllingTR, setShowConfirmationForCancellingTr] = useState(false)
    const [rejectionReason, setRejectionReason] = useState(null)
    const [travelRequestStatus, setTravelRequestStatus] = useState('pending approval')
  
    const handleReject = ()=>{
        console.log('rejected')
        setShowConfirmationForCancellingTr(false)
        //navigate to dashboard
    }

    const onReasonSelection = (option) => {
        setRejectionReason(option)
        console.log(option)
    }

    // const handleSubmit = async ()=>{
    //     setIsLoading(true)
    //     console.log('sending data to backend', formData )
    //     const res = await updateRawTravelRequest_API({travelRequest:formData, submitted:true})
    //     if(res.err){
    //         setIsLoading(false)
    //         setMessage('Cancellation Failed. Please try again after some time') 
    //         setShowPopup(true)
    //         return   
    //     }
    //     setIsLoading(false)
    //     setMessage('Cancellation processed')
    //     setShowPopup(true)
    //     //wait for 5 seconds
    //     setTimeout(()=>{
    //         setShowPopup(false)
    //         //redirect to dashboard
    //         window.location.href = DASHBOARD_URL
    //     },5000)
    // }

    const handleLineItemAction = (itnId, action)=>{
        if(action=='approved'){
            //handle approval
            console.log(itnId,action)
            approveLineItemApi("tenant123","emp123","trip123","iti123")
            window.location.href= "http://localhost:8080/"
        }
        if(action == 'rejected'){
            //handle rejection
            console.log(itnId,action)
            rejectLineItemApi("tenant123","emp123","trip123","iti123",{
                reason:"test"
            })
            window.location.href= "http://localhost:8080/"
        }
    }






    const [isLoading, setIsLoading] = useState(true)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [isReturn, setIsReturn] = useState(false)
    const [isCashAdvanceTaken, setIsCashAdvanceTaken] = useState(false)
    const [cashAdvanceDetails, setCashAdvanceDetails] = useState(null)

    //fetch travel request data from backend
    useEffect(() => {
        setIsCashAdvanceTaken(dummyTravelWithCashAdvanceData.travelRequestData.isCashAdvanceTaken)
        if(dummyTravelWithCashAdvanceData.travelRequestData.isCashAdvanceTaken){
            setCashAdvanceDetails(dummyTravelWithCashAdvanceData.cashAdvancesData)
        }
        const travelRequestDetails = dummyTravelWithCashAdvanceData.travelRequestData
        setFormData({...travelRequestDetails})
        setTravelRequestStatus(travelRequestDetails.travelRequestStatus)
        setIsLoading(false)
      },[])
      
    useEffect(()=>{
        if(showCancelModal){
            document.body.style.overflow = 'hidden'
        }
        else{
            document.body.style.overflow = 'auto'
        }
    },[showCancelModal])

    const [formData, setFormData] = useState()
    const [itemType, setItemType] = useState(null)
    const [itemIndex, setItemIndex] = useState(null)
    const [formId, setFormId] = useState(null)

  return <>
        {isLoading && <Error message={loadingErrMsg}/>}
      {!isLoading && 
        <div className="w-full h-full relative bg-white md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none">
        {/* app icon */}
        <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
            <Icon/>
        </div>

        {/* Rest of the section */}
        <div className="w-full h-full mt-10 p-10 font-cabin tracking-tight">
            <div className='flex justify-between'>
                <p className="text-2xl text-neutral-600 mb-5">{`${formData.tripPurpose} Trip`}</p>
                
                {travelRequestStatus === 'pending approval' && <div className="flex gap-4">
                    <div>
                        <ActionButton text={'approve'}/>
                    </div>
                    <div onClick={()=>{setShowConfirmationForCancellingTr(true)}}>
                        <ActionButton text={'reject'}/>
                    </div>
                    
                </div>}
             
            </div>
            <div>
                <div className="flex gap-2 font-cabin text-xs tracking-tight">
                    <p className="w-[100px] text-neutral-600">Requested By:</p>
                    <p className="text-neutral-700">{formData.createdBy.name}</p>
                </div>
                {/* <div className="flex gap-2 font-cabin text-xs tracking-tight">
                    <p className="w-[100px] text-neutral-600">Raised For:</p>
                    <p className="text-neutral-700">{formData.createdFor?.name??'Self'}</p>
                </div>
                <div className="flex gap-2 font-cabin text-xs tracking-tight">
                    <p className="w-[100px] text-neutral-600">Team-members:</p>
                    <p className="text-neutral-700">{formData.teamMembers.length>0 ? formData.teamMembers.map(member=>`${member.name}, `) : 'N/A'}</p>
                </div> */}
            </div>
        
            <hr/>
            <div className="mt-5 flex flex-col gap-4">
                {['flights', 'trains', 'buses', 'cabs', 'hotels'].map((itnItem, itnItemIndex) => {
                        if (formData.itinerary[itnItem].length > 0) {
                            return (
                                <div key={itnItemIndex}>
                                    <p className="text-xl text-neutral-700">
                                        {`${titleCase(itnItem)} `}
                                    </p>
                                    <div className='flex flex-col gap-1'>
                                        {formData.itinerary[itnItem].map((item, itemIndex) => {
                                            if (['flights', 'trains', 'buses'].includes(itnItem)) {
                                                return (
                                                    <div key={itemIndex}>
                                                        <FlightCard
                                                             
                                                            // onClick={()=>handleCancel(itnItem.slice(0, -1), itemIndex, item.formId, item.isReturnTravel)} 
                                                            from={item.from} 
                                                            to={item.to} 
                                                            itnId={item.itineraryId}
                                                            handleLineItemAction={handleLineItemAction}
                                                            showActionButtons={travelRequestStatus!='pending approval' && item.status == 'pending approval'}
                                                            date={item.date} time={item.time} travelClass={item.travelClass} mode={titleCase(itnItem.slice(0, -1))} />
                                                    </div>
                                                );
                                            } else if (itnItem === 'cabs') {
                                                return (
                                                    <div key={itemIndex}>
                                                        <CabCard 
                                                        // onClick={()=>handleCancel(itnItem.slice(0, -1), itemIndex, item.formId)}
                                                        itnId={item.itineraryId}
                                                        handleLineItemAction={handleLineItemAction}
                                                        showActionButtons={travelRequestStatus!='pending approval' && item.status == 'pending approval'} 
                                                        from={item.pickupAddress} to={item.dropAddress} date={item.date} time={item.time} travelClass={item.travelClass} isTransfer={item.type !== 'regular'} />
                                                    </div>
                                                );
                                            } else if (itnItem === 'hotels') {
                                                return (
                                                    <div key={itemIndex}>
                                                        <HotelCard 
                                                        // onClick={()=>handleCancel(itnItem.slice(0, -1), itemIndex, item.formId)}
                                                        itnId={item.itineraryId}
                                                        handleLineItemAction={handleLineItemAction}
                                                        showActionButtons={travelRequestStatus!='pending approval' && item.status == 'pending approval'} 
                                                        checkIn={item.checkIn} checkOut={item.checkOut} date={item.data} time={item.time} travelClass={item.travelClass} mode='Train' />
                                                    </div>
                                                );
                                            }
                                        })}
                                    </div>
                                </div>
                            );
                        }
                        return null; // Return null if no items in the itinerary
                    })}
            </div>

            {isCashAdvanceTaken && <div className="mt-5">
                <CashAdvanceDetails />
            </div>}
            
{/*             
            {showCancelModal && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
                <div className='z-10 max-w-4/5 w-2/5 min-h-4/5 max-h-4/5 scroll-none bg-white rounded-lg shadow-md'>
                    <div className="p-10">
                        <p className="text-xl font-cabin">Are you sure you want to cancel?</p>
                        <div className="flex mt-10 justify-between">
                            <Button variant='fit' text='Yes, cancel it' onClick={()=>handleCancelItem(itemType, formId, itemIndex, isReturn)} />
                            <Button variant='fit' text='No' onClick={()=>setShowCancelModal(false)} />
                        </div>
                    </div>
                </div>
            </div>}  */}

            {showConfimationForCancllingTR && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
                <div className='z-10 max-w-4/5 w-2/5 min-h-4/5 max-h-4/5 scroll-none bg-white  rounded-lg shadow-md'>
                    <div className="p-10">
                        <p className="text-xl font-cabin">Please select reasons for cancelling this travel Request</p>
                        <Select 
                            options={rejectionReasonOptions}
                            onSelect={onReasonSelection}
                            placeholder='Please select reason for rejection'
                        />
                        <div className="flex mt-10 justify-between">
                            <Button variant='fit' text='Done' onClick={handleReject} />
                            <Button variant='fit' text='Cancel' onClick={()=>setShowConfirmationForCancellingTr(false)} />
                        </div>
                    </div>
                </div>
                </div>
            }
        </div>
        
        {/* <div className="flex mt-10 flex-row-reverse">
            <Button text='Submit' onClick={handleSubmit}/>
        </div> */}
        </div>
      }
      <PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} message={message}/>
  </>;
}

// function spitBoardingPlace(modeOfTransit){
//     if(modeOfTransit === 'Flight')
//         return 'Airport'
//     else if(modeOfTransit === 'Train')
//         return 'Railway station'
//     else if(modeOfTransit === 'Bus')
//         return 'Bus station'
// }

function spitImageSource(modeOfTransit){
    if(modeOfTransit === 'Flight')
        return airplane_icon
    else if(modeOfTransit === 'Train')
        return cab_icon
    else if(modeOfTransit === 'Bus')
        return cab_icon
}

function FlightCard({from, to, date, time, travelClass, onClick, mode='Flight', showActionButtons, itnId, handleLineItemAction}){
    return(
    <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
    <img src={spitImageSource(mode)} className='w-4 h-4' />
    <div className="w-full flex sm:block">
        <div className='mx-2 text-xs text-neutral-600 flex justify-between flex-col sm:flex-row'>
            <div className="flex-1">
                From     
            </div>
            <div className="flex-1" >
                To     
            </div>

            <div className="flex-1">
                    Date
            </div>
            <div className="flex-1">
                Preffered Time
            </div>
            <div className="flex-1">
                Class/Type
            </div>
        </div>

        <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
            <div className="flex-1">
                {titleCase(from)}     
            </div>
            <div className="flex-1">
                {titleCase(to)}     
            </div>
            <div className="flex-1">
                {date}
            </div>
            <div className="flex-1">
                {time??'N/A'}
            </div>
            <div className="flex-1">
                {travelClass??'N/A'}
            </div>
        </div>
    </div>

    {showActionButtons && 
    <div className={`flex items-center gap-2 px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] text-gray-600 cursor-pointer bg-slate-100  hover:bg-red-100  hover:text-red-900 `} onClick={onClick}>
        <div onClick={()=>handleLineItemAction(itnId, 'approved')}>
            <ActionButton text={'approve'}/>
        </div>
        <div onClick={()=>handleLineItemAction(itnId, 'rejected')}>
            <ActionButton text={'reject'}/>   
        </div>   
    </div>}

    </div>)
}

// function CabCard_({from, to, date, time, travelClass, onClick, mode, isTransfer=false, showActionButtons, itnId}){
//     return(
//     <div className='Itinenery mb-4 bg-slate-50 mt-2' >
//         <div className='h-auto w-auto border border-slate-300 rounded-md'>     
//             <div className='flex flex-row py-3 px-2 divide-x'>
//                 <div className='flex items-center flex-grow divide-x '>
                
//                 <div className='flex items-start justify-start  flex-col shrink w-auto md:w-[200px] mr-4'>
//                     <div className='flex items-center justify-center mb-2'>
//                         <div className='pl-2'>
//                             <img src={cab_icon} alt="calendar" width={16} height={16} />
//                         </div>
//                         <span className="ml-2 tracking-[0.03em] font-cabin leading-normal text-gray-800 text-xs md:text-sm">
//                             Class : {travelClass}
//                         </span>
//                     </div>
                
//                     <div className='ml-4 max-w-[200px] w-auto'>
//                         <span className='text-xs font-cabin'>
//                             <div className='ml-4 max-w-[200px] w-auto'>
//                                 <span className='text-xs font-cabin'>{date}, {time}</span>
//                             </div>
//                         </span>
//                     </div>
//                 </div>
                
//                 <div className='flex grow  items-center justify-center '>
//                 <div className="flex text-xs text-gray-800 font-medium px-2 gap-4 justify-around">
                    
//                     <div className='flex flex-col text-lg font-cabin w-3/7  items-center text-center shrink '>
//                     <span className='text-xs'>Pick-Up</span>
//                     <span className='text-x'> {from} </span> 
//                     </div>
                    
//                     <div className='flex justify-center items-center w-1/7 min-w-[20px] min-h-[20px]'>
//                     <div className='p-4 bg-slate-100 rounded-full'>
//                             <img src={double_arrow} alt="double arrow" width={20} height={20} />
//                     </div>
//                     </div>
                
//                     <div className='flex flex-col text-lg font-cabin w-3/7 items-center text-center'>
//                     <span className='text-xs'>Drop-Off</span>
//                     <span className=''>{to}</span> 
//                     </div>

//                 </div>
//                 </div>
                
                
//                 </div>
                
                
//                 <div className='flex justify-end items-center px-8'>
                
//                 <div className={`flex items-center px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] text-gray-600 cursor-pointer bg-slate-100  hover:bg-red-100  hover:text-red-900 `} onClick={onClick}>
//                     Cancel      
//                 </div>
//             </div>

//             </div>  
//         </div>
//     </div>
//     )
// }

function HotelCard({checkIn, checkOut, hotelClass, onClick, preference='close to airport,', showActionButtons, itnId, handleLineItemAction}){
    return(
    <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
    <p className='font-semibold text-base text-neutral-600'>Hotel</p>
    <div className="w-full flex sm:block">
        <div className='mx-2 text-xs text-neutral-600 flex justify-between flex-col sm:flex-row'>
            <div className="flex-1">
                Check-In  
            </div>
            <div className="flex-1" >
                Checkout
            </div>
            <div className="flex-1">
                Class/Type
            </div>
            <div className='flex-1'>
                Site Preference
            </div>
        </div>

        <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
            <div className="flex-1">
                {checkIn}     
            </div>
            <div className="flex-1">
                {checkOut}     
            </div>
            <div className="flex-1">
                {hotelClass??'N/A'}
            </div>
            <div className='flex-1'>
                {preference??'N/A'}
            </div>
        </div>

    </div>

    {showActionButtons && 
    <div className={`flex items-center gap-2 px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] text-gray-600 cursor-pointer bg-slate-100  hover:bg-red-100  hover:text-red-900 `} onClick={onClick}>
        <div onClick={()=>handleLineItemAction(itnId, 'approved')}>
            <ActionButton text={'approve'}/>
        </div>
        <div onClick={()=>handleLineItemAction(itnId, 'rejected')}>
            <ActionButton text={'reject'}/>   
        </div>   
    </div>}

    </div>)
}

function CabCard({from, to, date, time, travelClass, onClick, mode, isTransfer=false, showActionButtons, itnId, handleLineItemAction}){
    return(
    <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
    <div className='font-semibold text-base text-neutral-600'>
    <img src={cab_icon} className='w-6 h-6' />
        <p className="text-xs text-neutral-500">{isTransfer? 'Transfer Cab': 'Cab'}</p>
    </div>
    <div className="w-full flex sm:block">
        <div className='mx-2 text-xs text-neutral-600 flex justify-between flex-col sm:flex-row'>
            <div className="flex-1">
                Pickup     
            </div>
            <div className="flex-1" >
                Drop    
            </div>
            <div className="flex-1">
                    Date
            </div>
            <div className="flex-1">
                Preffered Time
            </div>
            {!isTransfer && <div className="flex-1">
                Class/Type
            </div>}
        </div>

        <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
            <div className="flex-1">
                {from??'not provided'}     
            </div>
            <div className="flex-1">
                {to??'not provided'}     
            </div>
            <div className="flex-1">
                {date??'not provided'}
            </div>
            <div className="flex-1">
                {time??'N/A'}
            </div>
           {!isTransfer && <div className="flex-1">
                {travelClass??'N/A'}
            </div>}
        </div>
    </div>
    {showActionButtons && 
    <div className={`flex items-center gap-2 px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] text-gray-600 cursor-pointer bg-slate-100  hover:bg-red-100  hover:text-red-900 `} onClick={onClick}>
        <div onClick={()=>handleLineItemAction(itnId, 'approved')}>
            <ActionButton text={'approve'}/>
        </div>
        <div onClick={()=>handleLineItemAction(itnId, 'rejected')}>
            <ActionButton text={'reject'}/>   
        </div>   
    </div>}
    </div>)
}