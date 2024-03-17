import { useState, useEffect} from "react";
import {BrowserRouter as Router, useParams} from 'react-router-dom'
import axios from 'axios'
import Icon from "../components/common/Icon";
import { camelCaseToTitleCase, titleCase } from "../utils/handyFunctions";
import Button from "../components/common/Button";
import Error from "../components/common/Error";
import PopupMessage from "../components/common/PopupMessage";
import cab_icon from "../assets/cab-purple.svg"
//import airplane_icon from "../assets/Airplane_1.svg"
//import bus_icon from "../assets/bus.png"
//import train_icon from '../assets/train.png'
//import calendar_icon from "../assets/calendar.svg"
import double_arrow from '../assets/double-arrow.svg'
import { getRawTravelRequest_API, updateRawTravelRequest_API, cancelTravelRequest_API } from "../utils/api";
import { material_flight_black_icon, material_train_black_icon, material_bus_black_icon, material_cab_black_icon, material_car_rental_black_icon, material_hotel_black_icon, material_personal_black_icon } from "../assets/icon";
import { calender_icon, location_icon , clock_icon} from "../assets/icon";

console.log(import.meta.env.VITE_TRAVEL_API_URL)

export default function () {
  //get travel request Id from params
    const {travelRequestId} = useParams()
    const [showPopup, setShowPopup] = useState(false)
    const [message, setMessage] = useState(false)
    const [showConfimationForCancllingTR, setShowConfirmationForCancellingTr] = useState(false)

    const handleCancel = (type, formId, itemIndex, isReturn)=>{
        console.log('type formId itemIndex', type, formId, itemIndex, isReturn)
        setItemType(type)
        setItemIndex(itemIndex)
        setFormId(formId)
        setIsReturn(isReturn)
        setShowCancelModal(true)
    }

    const handleCancelItem_ = async (type, itemIndex, formId, isReturn)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        console.log('this ran with type, formId, itemIndex', type, formId, itemIndex)

        if(type== 'cab'){
            formData_copy.itinerary.cabs = formData.itinerary.cabs.filter((_,index)=>index!=itemIndex);
            const regularCabsCount = formData_copy.itinerary.cabs.filter(cab=> cab.type == 'regular').length
            
            const departruePickupCab = formData_copy.itinerary.cabs.filter(cab=> cab.type == 'departure pickup' && cab.formId == formId).length
            if(!departruePickupCab) formData_copy.itinerary.formState[formId].transfers.needsDeparturePickup = false
            
            const departureDropCab = formData_copy.itinerary.cabs.filter(cab=> cab.type == 'departure drop' && cab.formId == formId).length
            if(!departureDropCab) formData_copy.itinerary.formState[formId].transfers.needsDepartureDrop = false
            
            const returnPickupCab = formData_copy.itinerary.cabs.filter(cab=> cab.type == 'return pickup' && cab.formId == formId).length
            if(!returnPickupCab) formData_copy.itinerary.formState[formId].transfers.needsReturnPickup = false
            
            const returnDropCab = formData_copy.itinerary.cabs.filter(cab=> cab.type == 'return drop' && cab.formId == formId).length
            if(!returnDropCab) formData_copy.itinerary.formState[formId].transfers.needsReturnDrop = false
            
            if(!regularCabsCount) formData_copy.itinerary.formState[formId].needsCab = false
            
        }
        else if(type == 'hotel'){
            console.log(type, itemIndex, formId)
            console.log(formData.itinerary.hotels.filter((_,index)=>index!=itemIndex))
            formData_copy.itinerary.hotels = formData.itinerary.hotels.filter((_,index)=>index!=itemIndex)
            const hotelCount = formData_copy.itinerary.hotels.filter(hotel=> hotel.formId == formId).length
            if(hotelCount == 0) formData_copy.itinerary.formState[formId].needsHotel = false
        }
        else if(type == 'flight'){
            console.log(isReturn)
            formData_copy.itinerary.flights = formData.itinerary.flights.filter((_,index)=>index!=itemIndex);
            if(isReturn){
                //flight is for return remove transfer cabs if available
                console.log('this ran return should be true', isReturn)
                console.log(formData_copy.itinerary.cabs.filter(cab=> cab.formId != formId || cab.type == 'regular' || cab.type == 'departure pickup' || cab.type == 'departure drop'))
                formData_copy.itinerary.cabs = formData_copy.itinerary.cabs.filter(cab=> cab.formId != formId || cab.type == 'regular' || cab.type == 'departure pickup' || cab.type == 'departure drop' )
                formData_copy.itinerary.formState[formId].transfers.needsReturnPickup = false
                formData_copy.itinerary.formState[formId].transfers.needsReturnDrop = false
            }else{
                //flight is for departure remove transfer cabs if available
                console.log('this ran return should be false', isReturn)
                formData_copy.itinerary.cabs = formData_copy.itinerary.cabs.filter(cab=> cab.formId != formId || cab.type == 'regular' || cab.type == 'return pickup' || cab.type == 'return drop')
                console.log(formData_copy.itinerary.cabs.filter(cab=> cab.formId != formId || cab.type == 'regular' || cab.type == 'return pickup' || cab.type == 'return drop'))
                formData_copy.itinerary.formState[formId].transfers.needsDeparturePickup = false
                formData_copy.itinerary.formState[formId].transfers.needsDepartureDrop = false
            }
        }
        else if(type == 'train'){
            formData_copy.itinerary.trains = formData.itinerary.trains.filter((_,index)=>index!=itemIndex);
            if(isReturn){
                //remove transfer cabs if available
                formData_copy.itinerary.cabs = formData_copy.itinerary.cabs.filter(cab=> cab.formId != formId || cab.type == 'regular' || cab.type == 'departure pickup' || cab.type == 'departure drop' )
                formData_copy.itinerary.formState[formId].transfers.needsReturnPickup = false
                formData_copy.itinerary.formState[formId].transfers.needsReturnDrop = false
            }else{
                //remove transfer cabs if available
                formData_copy.itinerary.cabs = formData_copy.itinerary.cabs.filter(cab=> cab.formId != formId || cab.type == 'regular' || cab.type == 'return pickup' || cab.type == 'return drop' )
                formData_copy.itinerary.formState[formId].transfers.needsDeparturePickup = false
                formData_copy.itinerary.formState[formId].transfers.needsDepartureDrop = false
            }
        }
        else if(type == 'bus'){
            formData_copy.itinerary.buses = formData.itinerary.buses.filter((_,index)=>index!=itemIndex);
            if(isReturn){
                //remove transfer cabs if available
                formData_copy.itinerary.cabs = formData_copy.itinerary.cabs.filter(cab=> cab.formId != formId || cab.type == 'regular' || cab.type == 'departure pickup' || cab.type == 'departure drop' )
                formData_copy.itinerary.formState[formId].transfers.needsReturnPickup = false
                formData_copy.itinerary.formState[formId].transfers.needsReturnDrop = false
            }else{
                //remove transfer cabs if available
                formData_copy.itinerary.cabs = formData_copy.itinerary.cabs.filter(cab=> cab.formId != formId || cab.type == 'regular' || cab.type == 'return pickup' || cab.type == 'return drop' )
                formData_copy.itinerary.formState[formId].transfers.needsDeparturePickup = false
                formData_copy.itinerary.formState[formId].transfers.needsDepartureDrop = false
            }
        }

        setFormData(formData_copy)
        setShowCancelModal(false)
    }

    const handleCancelItem = (type, itineraryId)=>{
        console.log(type, itineraryId)
        const confirm = window.confirm(`Are you sure you want to cancel this ${camelCaseToTitleCase(type.slice(0, -1))}`)
        if(!confirm) return;
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[type] = formData_copy.itinerary[type].filter(item=>item.itineraryId != itineraryId)
        console.log(formData_copy, 'copy')
        setFormData(formData_copy)
    }

    const handleTrCancel = async ()=>{    
        //cancel the travel request and redirect the user on dashboard
        setShowConfirmationForCancellingTr(false)
        console.log('travel request cancelled')

        const res = await cancelTravelRequest_API({travelRequestId})
        console.log(res?.data?.message)

        setMessage('Your Travel Request has been cancelled')
        setShowPopup(true)
        setTimeout(()=>{
            setShowPopup(false)
            //redirect to dashaboard
            //window.location.href = DASHBOARD_URL
        },5000)
    }

    const handleSubmit = async ()=>{
        setIsLoading(true)
        console.log('sending data to backend', formData )
        const res = await updateRawTravelRequest_API({travelRequest:formData, submitted:true})
        if(res.err){
            setIsLoading(false)
            setMessage('Cancellation Failed. Please try again after some time') 
            setShowPopup(true)
            return   
        }
        setIsLoading(false)
        setMessage('Cancellation processed')
        setShowPopup(true)
        //wait for 5 seconds
        setTimeOut(()=>{
            setShowPopup(false)
            //redirect to dashboard
            //window.location.href = DASHBOARD_URL
        },5000)
    }

    const [isLoading, setIsLoading] = useState(true)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [isReturn, setIsReturn] = useState(false)

   
    //fetch travel request data from backend
    useEffect(() => {
        (async function(){
          const travel_res = await getRawTravelRequest_API({travelRequestId})
          if(travel_res.err){
            setLoadingErrMsg(travel_res.err)
            return
          }
          const travelRequestDetails = travel_res.data
          console.log('form state got reset reset')
          setFormData({...travelRequestDetails})
          setIsLoading(false)
        })()
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
                {formData.itinerary.flights?.map((flight, index)=>{
            return(<div key={index}>
                <div className="flex items-center gap-2">
                    <p className="text-xl text-neutral-700">
                        {`${titleCase(flight.from)}`}
                    </p>
                    <img src={double_arrow} className="w-6 h-6"/>
                    <p className="text-xl text-neutral-700">
                        {`${titleCase(flight.to)} `}
                    </p>
                </div>

                <div className='flex flex-col gap-2 mt-2'>
                {<>
                    <FlightCard
                        onClick={()=>handleCancelItem('flights',flight.itineraryId)}
                        id={index} 
                        from={flight.from} 
                        to={flight.to} 
                        date={flight.date}
                        returnDate={flight.returnDate}
                        returnTime={flight.returnTime}
                        travelClass={flight.travelClass} 
                        mode={'Flight'}
                        time={flight.time}/>
                    {/* {(flight.return?.date??false) && 
                        <FlightCard 
                            id={index}
                            from={flight.to} 
                            to={flight.from} 
                            date={flight.returnDate}
                            travelClass={'N/A'} 
                            mode={'flight'} 
                            time={flight.returnTime }/>
                    } */}
                </>}
                </div>
            </div>) 
            })}

            {formData.itinerary.trains?.map((train, index)=>{
            return(<div key={index}>

                <div className='flex flex-col gap-2 mt-2'>
                {<>
                    <FlightCard
                        onClick={()=>handleCancelItem('trains', train.itineraryId)}
                        id={index} 
                        from={train.from} 
                        to={train.to} 
                        date={train.date}
                        travelClass={train.travelClass} 
                        mode={'Train'}
                        time={train.time}/>
                </>}
                </div>
            </div>) 
            })}

        {formData.itinerary.buses?.map((bus, index)=>{
            return(<div key={index}>

                <div className='flex flex-col gap-2 mt-2'>
                {<>
                    <FlightCard
                        onClick={()=>handleCancelItem('buses', bus.itineraryId)}
                        id={index} 
                        from={bus.from} 
                        to={bus.to} 
                        date={bus.date}
                        travelClass={bus.travelClass} 
                        mode={'Train'}
                        time={bus.time}/>
                </>}
                </div>
            </div>) 
            })}

        {formData.itinerary.personalVehicles?.map((pv, index)=>{
            return(<div key={index}>

                <div className='flex flex-col gap-2 mt-2'>
                {<>
                    <FlightCard
                        onClick={()=>handleCancelItem('personalVehicles', pv.itineraryId)}
                        id={index} 
                        from={pv.from} 
                        to={pv.to} 
                        date={pv.date}
                        travelClass={pv.travelClass} 
                        mode={'Train'}
                        time={pv.time}/>
                </>}
                </div>
            </div>) 
            })}

            {formData.itinerary.cabs?.map((cab, index)=>{
            return(<div key={index}>
                
                <div className='flex flex-col gap-2 mt-2'>
                {<>
                    <CabCard
                        onClick={()=>handleCancelItem('cabs', cab.itineraryId)}
                        id={index} 
                        from={cab.pickupAddress} 
                        to={cab.dropAddress} 
                        date={cab.date}
                        travelClass={cab.travelClass} 
                        mode={'Cab'}
                        time={cab.time}/>
                </>}
                </div>
            </div>) 
            })}

            {formData.itinerary.carRentals?.map((cab, index)=>{
            return(<div key={index}>
                
                <div className='flex flex-col gap-2 mt-2'>
                {<>
                    <CabCard
                        onClick={()=>handleCancelItem('carRentals', cab.itineraryId)}
                        id={index} 
                        from={cab.pickupAddress} 
                        to={cab.dropAddress} 
                        date={cab.date}
                        travelClass={cab.travelClass} 
                        mode={'Cab'}
                        time={cab.time}/>
                </>}
                </div>
            </div>) 
            })}

            {formData.itinerary.hotels?.map((hotel, index)=>{
            return(<div key={index}>
                
                <div className='flex flex-col gap-2 mt-2'>
                {<>
                    <HotelCard
                        onClick={()=>handleCancelItem('hotels', hotel.itineraryId)}
                        id={index} 
                        checkIn={hotel.checkIn} 
                        checkOut={hotel.checkOut} 
                        location={hotel.location}
                        time={hotel.preferredTime}/>
                </>}
                </div>
            </div>) 
            })}
            </div>
            
            
            {showCancelModal && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
                <div className='z-10 max-w-4/5 w-2/5 min-h-4/5 max-h-4/5 scroll-none bg-white rounded-lg shadow-md'>
                    <div className="p-10">
                        <p className="text-xl font-cabin">Are you sure you want to cancel?</p>
                        <div className="flex mt-10 justify-between">
                            <Button variant='fit' text='Yes, cancel it' onClick={()=>()=>handleCancelItem(itemType, formId, itemIndex, isReturn)} />
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
        </div>
        
        <div className="flex mt-10 flex-row-reverse">
            <Button text='Submit' onClick={handleSubmit}/>
        </div>

        </div>
       }
      <PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} message={message}/>
  </>;
}


function FlightCard({from, to, date, returnDate, time, returnTime, travelClass, onClick, mode='Flight'}){
    return(
    <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
    <div className="flex flex-col justify-center">
        <img src={spitImageSource(mode)} className='w-4 h-4 md:w-6 md:h-6' />
      </div>
    <div className="w-full flex sm:block">
            <div className="mx-2 text-sm w-full flex gap-1 flex-col lg:flex-row lg:justify-between lg:items-center">
                <div className='flex items-center gap-1'>
                    <div className="text-lg semibold">
                        {titleCase(from)}     
                    </div>
                    <img src={double_arrow} className="w-5"/>
                    <div className="text-lg semibold">
                        {titleCase(to)}     
                    </div>
                </div>
                <div className="">
                    <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Departure Date</p>
                    <div className="flex items-center gap-1">
                        <img src={calender_icon} className='w-4'/>
                        <p>{isoString(date)}</p>
                    </div>
                </div>

                <div className="">
                    <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Departure Time</p>
                    <div className='flex items-center gap-1'>
                        <img src={clock_icon} className='w-4'/>
                        <p>{formattedTime(time)??'--:--'}</p>    
                    </div>
                </div>

                {returnDate!=null && returnDate != undefined && 
                <div className="">
                    <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Return Date</p>
                    <div className="flex items-center gap-1">
                        <img src={calender_icon} className='w-4'/>
                        <p>{isoString(returnDate)}</p>
                    </div>
                </div>
                }

                {returnTime!=null && 
                <div className="">
                    <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Retrun Time</p>
                    <div className='flex items-center gap-1'>
                        <img src={clock_icon} className='w-4'/>
                        <p>{formattedTime(returnTime)??'--:--'}</p>    
                    </div>
                </div>
                }

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

function HotelCard({checkIn, checkOut, location, onClick, preference='close to airport'}){
    return(
    <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
    <img src={material_hotel_black_icon} className="w-4 h-4 md:w-6 md:h-6"/>
    <div className="w-full flex sm:block">
          <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
          <div className="flex-1">
                    <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">CheckIn Date</p>
                    <div className="flex items-center gap-1">
                        <img src={calender_icon} className='w-4'/>
                        <p>{isoString(checkIn)}</p>
                    </div>
                </div>
                <div className="flex-1">
                    <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">CheckOut Date</p>
                    <div className="flex items-center gap-1">
                        <img src={calender_icon} className='w-4'/>
                        <p>{isoString(checkOut)}</p>
                    </div>
                </div>
                <div className='flex-1'>
                    <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Location</p>
                    <div className="flex items-center gap-1">
                        <img src={location_icon} className='w-4'/>
                        <p>{location??'not provided'}</p>
                    </div>
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
      <img src={spitImageSource(mode)} className='w-4 h-4 md:w-6 md:h-6' />
      </div>
    <div className="w-full flex sm:block">
          
          <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
              <div className="flex-1">
                 <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Pickup Location</p>
                  <div className="flex items-center gap-1">
                    <img src={location_icon} className="w-4 h-4"/>
                    <p className="whitespace-wrap">{from??'not provided'}</p>
                  </div>     
              </div>
              <div className="flex-1">
                  <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Drop Location</p>
                  <div className="flex items-center gap-1">
                    <img src={location_icon} className="w-4 h-4"/>
                    <p className="whitespace-wrap">{to??'not provided'}</p>
                  </div>     
              </div>
              <div className="flex-1">
                  <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">{mode} Date</p>
                  <div className="flex items-center gap-1">
                    <img src={calender_icon} className="w-4 h-4"/>
                    <p className="whitespace-wrap">{isoString(date)??'not provided'}</p>
                  </div>
              </div>
              <div className="flex-1">
                  <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Prefferred Time</p>
                  <div className="flex items-center gap-1">
                    <img src={clock_icon} className="w-4 h-4"/>
                    <p className="whitespace-wrap">{formattedTime(time)??'not provided'}</p>
                  </div>
              </div>
          </div>
      </div>
    <div className={`flex items-center px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] text-gray-600 cursor-pointer bg-slate-100  hover:bg-red-100  hover:text-red-900 `} onClick={onClick}>
        Cancel      
    </div>
    </div>)
}


function spitImageSource(modeOfTransit){
    if(modeOfTransit === 'Flight')
        return material_flight_black_icon
    else if(modeOfTransit === 'Train')
        return material_train_black_icon
    else if(modeOfTransit === 'Bus')
        return material_bus_black_icon
    else if(modeOfTransit === 'Cab')
        return material_cab_black_icon
    else if(modeOfTransit === 'Cab Rentals')
        return material_car_rental_black_icon
    else if(modeOfTransit === 'Personal Vehicle')
        return material_personal_black_icon
}

function isoString(dateString){
    console.log('receivedDate', dateString)
    if(dateString==null || dateString == undefined) return ''
    // Convert string to Date object
    const dateObject = new Date(dateString);
    // Convert Date object back to ISO string
    const isoDateString = dateObject.toDateString();
    console.log(isoDateString);
    return isoDateString
}

function formattedTime(timeValue){
    try{
        if(timeValue == null || timeValue == undefined) return timeValue
        const hours = timeValue.split(':')[0]>=12? timeValue.split(':')[0]-12 : timeValue.split(':')[0]
        const minutes = timeValue.split(':')[1]
        const suffix = timeValue.split(':')[0]>=12? 'PM' : 'AM'

        return `${hours}:${minutes} ${suffix}`
    }
    catch(e){
        return timeValue
    }
}