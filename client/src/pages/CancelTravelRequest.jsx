import { useState, useEffect} from "react";
import {BrowserRouter as Router, useParams} from 'react-router-dom'
import axios from 'axios'
import Icon from "../components/common/Icon";
import { titleCase } from "../utils/handyFunctions";
import Button from "../components/common/Button";
import Error from "../components/common/Error";
import { updateTravelRequest_API, cancelTravelRequest_API } from "../utils/api";
import PopupMessage from "../components/common/PopupMessage";
import cab_icon from "../assets/cab-purple.svg"
import airplane_icon from "../assets/Airplane_1.svg"
import bus_icon from "../assets/bus.png"
import train_icon from '../assets/train.png'
import calendar_icon from "../assets/calendar.svg"
import double_arrow from '../assets/double-arrow.svg'

const TRAVEL_API = import.meta.env.VITE_TRAVEL_API_URL

console.log(import.meta.env.VITE_TRAVEL_API_URL)

export default function () {
  //get travel request Id from params
    const {travelRequestId} = useParams()
    const tenantId = 'tynod76eu'
    const [showPopup, setShowPopup] = useState(false)
    const [message, setMessage] = useState(false)
    const [showConfimationForCancllingTR, setShowConfirmationForCancellingTr] = useState(false)

    const handleCancel = (toSet, type, legIndex, itemIndex)=>{
        console.log('type legIndex itemIndex', type, legIndex, itemIndex)
        setItemType(type)
        setItemIndex(itemIndex)
        setItineraryIndex(legIndex)

        setShowCancelModal(true)
    }

    const handleCancelItem = async (type, itineraryIndex, itemIndex=null)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        console.log('this ran with type, itineraryIndex, itemIndex', type, itineraryIndex, itemIndex)

        switch(type){
            case 'boardingTransfer':{
                formData_copy.itinerary[itineraryIndex].boardingTransfer = null;
                formData_copy.itinerary[itineraryIndex].needsBoardingTransfer = false;
                break;
            }
            case 'hotelTransfer': {
                formData_copy.itinerary[itineraryIndex].hotelTransfer = null;
                formData_copy.itinerary[itineraryIndex].needsHotelTransfer = false;
                break;
            }
            case 'cab':{
                formData_copy.itinerary[itineraryIndex].cabs = formData.itinerary[itineraryIndex].cabs.filter((_,index)=>index!=itemIndex);
                if(formData_copy.itinerary[itineraryIndex].cabs.length == 0) formData_copy.itinerary[itineraryIndex].needsCab = false
                break;
            }
            case 'hotel':{
                formData_copy.itinerary[itineraryIndex].hotels = formData.itinerary[itineraryIndex].hotels.filter((_,index)=>index!=itemIndex);
                if(formData_copy.itinerary[itineraryIndex].needsHotel.length == 0) formData_copy.itinerary[itineraryIndex].needsHotel = false
                break;
            }
            case 'leg':{
                formData_copy.itinerary = formData.itinerary.filter((_,index)=>index!=itineraryIndex);
                break;
            }
            case 'return':{
                formData_copy.itinerary[itineraryIndex].return.date = null
                formData_copy.tripType.oneWayTrip = true
                formData_copy.tripType.roundTrip = false
                formData_copy.tripType.multiCityTrip = false
                break;
            }
        }

        setFormData(formData_copy)
        setShowCancelModal(false)
    }


    const handleTrCancel = async ()=>{    
        //cancel the travel request and redirect the user on dashboard
        setShowConfirmationForCancellingTr(false)
        console.log('travel request cancelled')

        const res = await cancelTravelRequest_API({travelRequestId})
        console.log(res.data.message)

        setMessage('Your Travel Request has been cancelled')
        setShowPopup(true)
        setTimeout(()=>{setShowPopup(false)},5000)
    }

    const handleSubmit = async ()=>{
        setIsLoading(true)
        await updateTravelRequest_API(formData)
        setIsLoading(false)
        setMessage('Cancellation processed')
        setShowPopup(true)
        //redirect to dashboard..
    }

    const [isLoading, setIsLoading] = useState(true)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)
    const [showCancelModal, setShowCancelModal] = useState(false)

    //fetch travel request data from backend
    useEffect(()=>{
        axios
        .get(`${TRAVEL_API}/travel-requests/${travelRequestId}`)
        .then((response) => {
            console.log(response.data)
            const travelRequestDetails = response.data
           //set form data...

           const currentFomData = {
              travelRequestId: travelRequestDetails.travelRequestId,
              approvers: travelRequestDetails.approvers,
              tenantId: travelRequestDetails.tenantId,
              tenantName:travelRequestDetails.tenantName,
              companyName:travelRequestDetails.companyName,
              status: travelRequestDetails.status,
              state: travelRequestDetails.state,
              createdBy: travelRequestDetails.createdBy,
              createdFor: travelRequestDetails.createdFor,
              travelAllocationHeaders:travelRequestDetails.travelAllocationHeaders,
              tripPurpose:travelRequestDetails.tripPurpose,

              raisingForDelegator: travelRequestDetails.createdFor === null ? false : true,
              nameOfDelegator: travelRequestDetails?.createdFor?.name || null,
              isDelegatorManager: false,
              selectDelegatorTeamMembers:false,
              delegatorsTeamMembers:[],

              bookingForSelf:true,
              bookiingForTeam:false,
              teamMembers : travelRequestDetails.teamMembers,
              travelDocuments: travelRequestDetails.travelDocuments,
              itinerary: travelRequestDetails.itinerary,
              tripType: travelRequestDetails.tripType,
              preferences:travelRequestDetails.preferences,
              travelViolations:travelRequestDetails.travelViolations,
              cancellationDate:travelRequestDetails.cancellationDate,
              cancellationReason:travelRequestDetails.cancellationReason,
              isCancelled:travelRequestDetails.isCancelled,
              travelRequestStatus:travelRequestDetails.travelRequestStatus,
           }

           setFormData(currentFomData)
            setIsLoading(false)

        })
        .catch(err=>{ 
            console.error(err)
            setLoadingErrMsg(err.response.message)
            //handle possible scenarios
        })
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
    const [itineraryIndex, setItineraryIndex] = useState(null)

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

                <div className="cursor-pointer px-2 py-1 bg-red-200 rounded-md w-fit h-fit items-center" onClick={()=>{setShowConfirmationForCancellingTr(true)}}>
                    <p className="font-cabin text-sm text-red-500">Cancel</p>
                </div>
            </div>
            <div>
                <div className="flex gap-2 font-cabin text-xs tracking-tight">
                    <p className="w-[100px] text-neutral-600">Raised By:</p>
                    <p className="text-neutral-700">{formData.createdBy.name}</p>
                </div>
                <div className="flex gap-2 font-cabin text-xs tracking-tight">
                    <p className="w-[100px] text-neutral-600">Raised For:</p>
                    <p className="text-neutral-700">{formData.createdFor?.name??'Self'}</p>
                </div>
                <div className="flex gap-2 font-cabin text-xs tracking-tight">
                    <p className="w-[100px] text-neutral-600">Team-members:</p>
                    <p className="text-neutral-700">{formData.teamMembers.length>0 ? formData.teamMembers.map(member=>`${member.name}, `) : 'N/A'}</p>
                </div>
            </div>
        
            <hr/>
            <div className="mt-5 flex flex-col gap-4">
                {formData.itinerary.map((leg,index)=>{
                    console.log(leg)
                    return(<>
                        <div className="flex items-center gap-2">
                            <p className="text-xl text-neutral-700">
                                {`${titleCase(leg.departure.from)}`}
                            </p>
                            <img src={double_arrow} className="w-6 h-6"/>
                            <p className="text-xl text-neutral-700">
                                {`${titleCase(leg.departure.to)} `}
                            </p>
                        </div>

                        <div className='flex flex-col gap-2'>
                        {<>
                            <FlightCard
                                onClick={()=>handleCancel('leg', 'leg', index, null)}
                                id={index} 
                                from={leg.departure.from} 
                                to={leg.departure.to} 
                                date={leg.departure.date}
                                travelClass={leg.travelClass} 
                                mode={leg.modeOfTransit}
                                time={leg.departure.time}/>
                            {leg.return?.date!=null && leg?.return?.date!=undefined && 
                                <FlightCard 
                                    onClick={()=>handleCancel('return', 'return', index, null)}
                                    id={index}
                                    from={leg.departure.to} 
                                    to={leg.departure.from} 
                                    date={leg.return.date}
                                    travelClass={leg.travelClass} 
                                    mode={leg.modeOfTransit} 
                                    time={leg.return.time }/>
                            }
                         </>}

                         {leg.needsBoardingTransfer && <>
                            <CabCard
                                onClick={()=>handleCancel('boardingTransfer', 'boardingTransfer', index, null)}
                                id={index} 
                                from={leg.boardingTransfer.pickupAddress} 
                                to={leg.boardingTransfer.dropAddress} 
                                date={leg.departure.date} 
                                isTransfer={true}
                                mode={leg.modeOfTransit}
                                time={leg.boardingTransfer.prefferedTime}/>
                         </>}

                         {leg.needsHotelTransfer && <>
                            <CabCard
                                onClick={()=>handleCancel('hotelTransfer', 'hotelTransfer', index, null)} 
                                id={index}
                                from={leg.hotelTransfer?.pickupAddress??spitBoardingPlace(leg.modeOfTransit)} 
                                to={leg.hotelTransfer?.dropAddress??'Hotel'} 
                                date={leg.departure.date} 
                                isTransfer={true}
                                mode={leg.modeOfTransit}
                                time={leg.hotelTransfer.prefferedTime}/>
                         </>}

                         {leg.needsCab && leg.cabs.length>0 && leg.cabs.map((cab,ind)=>
                            <CabCard
                            onClick={()=>handleCancel('cabs', 'cab', index, ind)}
                            from={cab.pickupAddress} 
                            to={cab.dropAddress} 
                            date={cab.date} 
                            mode={leg.modeOfTransit}
                            time={cab.prefferedTime}/>
                         )}

                        {leg.needsHotel && leg.hotels.length>0 && leg.hotels.map((hotel, ind)=>
                            <HotelCard
                            onClick={()=>handleCancel('hotels', 'hotel', index, ind)} 
                            checkIn={hotel.checkIn} 
                            checkOut={hotel.checkOut}
                            hotelClass={hotel.class}
                            preference={'Close to Airport'} 
                            />
                         )}
                        </div>
                         

                        {showCancelModal && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
                            <div className='z-10 max-w-4/5 w-2/5 min-h-4/5 max-h-4/5 scroll-none bg-white rounded-lg shadow-md'>
                                <div className="p-10">
                                    <p className="text-xl font-cabin">Are you sure you want to cancel?</p>
                                    <div className="flex mt-10 justify-between">
                                        <Button variant='fit' text='Yes, cancel it' onClick={()=>handleCancelItem(itemType, itineraryIndex, itemIndex)} />
                                        <Button variant='fit' text='No' onClick={()=>setShowCancelModal(false)} />
                                    </div>
                                </div>
                            </div>
                        </div>} 

                        {showConfimationForCancllingTR && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
                            <div className='z-10 max-w-4/5 w-2/5 min-h-4/5 max-h-4/5 scroll-none bg-white rounded-lg shadow-md'>
                                <div className="p-10">
                                    <p className="text-xl font-cabin">Are you about cancelling this Travel Request?</p>
                                    <div className="flex mt-10 justify-between">
                                        <Button variant='fit' text='Yes, cancel it' onClick={handleTrCancel} />
                                        <Button variant='fit' text='No' onClick={()=>setShowConfirmationForCancellingTr(false)} />
                                    </div>
                                </div>
                            </div>
                            </div>
                        }
   
                    </>)
                })}
            </div>
            
        </div>
        
        <div className="flex mt-10 flex-row-reverse">
            <Button text='Submit' onClick={handleSubmit}/>
        </div>
        </div>
      }
      <PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} message={message}/>
  </>;
}

function spitBoardingPlace(modeOfTransit){
    if(modeOfTransit === 'Flight')
        return 'Airport'
    else if(modeOfTransit === 'Train')
        return 'Railway station'
    else if(modeOfTransit === 'Bus')
        return 'Bus station'
}

function spitImageSource(modeOfTransit){
    if(modeOfTransit === 'Flight')
        return airplane_icon
    else if(modeOfTransit === 'Train')
        return train_icon
    else if(modeOfTransit === 'Bus')
        return bus_icon
}

function FlightCard({from, to, date, time, travelClass, onClick, mode='Flight'}){
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

    <div className={`flex items-center px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] text-gray-600 cursor-pointer bg-slate-100  hover:bg-red-100  hover:text-red-900 `} onClick={onClick}>
        Cancel      
    </div>
    </div>)
}

function CabCard_({from, to, date, time, travelClass, onClick, mode, isTransfer=false}){
    return(
    <div className='Itinenery mb-4 bg-slate-50 mt-2' >
        <div className='h-auto w-auto border border-slate-300 rounded-md'>     
            <div className='flex flex-row py-3 px-2 divide-x'>
                <div className='flex items-center flex-grow divide-x '>
                
                <div className='flex items-start justify-start  flex-col shrink w-auto md:w-[200px] mr-4'>
                    <div className='flex items-center justify-center mb-2'>
                        <div className='pl-2'>
                            <img src={cab_icon} alt="calendar" width={16} height={16} />
                        </div>
                        <span className="ml-2 tracking-[0.03em] font-cabin leading-normal text-gray-800 text-xs md:text-sm">
                            Class : {travelClass}
                        </span>
                    </div>
                
                    <div className='ml-4 max-w-[200px] w-auto'>
                        <span className='text-xs font-cabin'>
                            <div className='ml-4 max-w-[200px] w-auto'>
                                <span className='text-xs font-cabin'>{date}, {time}</span>
                            </div>
                        </span>
                    </div>
                </div>
                
                <div className='flex grow  items-center justify-center '>
                <div className="flex text-xs text-gray-800 font-medium px-2 gap-4 justify-around">
                    
                    <div className='flex flex-col text-lg font-cabin w-3/7  items-center text-center shrink '>
                    <span className='text-xs'>Pick-Up</span>
                    <span className='text-x'> {from} </span> 
                    </div>
                    
                    <div className='flex justify-center items-center w-1/7 min-w-[20px] min-h-[20px]'>
                    <div className='p-4 bg-slate-100 rounded-full'>
                            <img src={double_arrow} alt="double arrow" width={20} height={20} />
                    </div>
                    </div>
                
                    <div className='flex flex-col text-lg font-cabin w-3/7 items-center text-center'>
                    <span className='text-xs'>Drop-Off</span>
                    <span className=''>{to}</span> 
                    </div>

                </div>
                </div>
                
                
                </div>
                
                
                <div className='flex justify-end items-center px-8'>
                
                <div className={`flex items-center px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] text-gray-600 cursor-pointer bg-slate-100  hover:bg-red-100  hover:text-red-900 `} onClick={onClick}>
                    Cancel      
                </div>
            </div>

            </div>  
        </div>
    </div>
    )
}

function HotelCard({checkIn, checkOut, hotelClass, onClick, preference={preference}}){
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

    <div className={`flex items-center px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] text-gray-600 cursor-pointer bg-slate-100  hover:bg-red-100  hover:text-red-900 `} onClick={onClick}>
        Cancel      
    </div>

    </div>)
}

function CabCard({from, to, date, time, travelClass, onClick, mode, isTransfer=false}){
    return(
    <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
    <div className='font-semibold text-base text-neutral-600'>
    <img src={cab_icon} className='w-6 h-6' />
        {isTransfer && <p className="text-xs text-neutral-500">{spitBoardingPlace(mode)}</p>}
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
    <div className={`flex items-center px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] text-gray-600 cursor-pointer bg-slate-100  hover:bg-red-100  hover:text-red-900 `} onClick={onClick}>
        Cancel      
    </div>
    </div>)
}