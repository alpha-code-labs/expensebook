import { useState, useEffect} from "react";
import {BrowserRouter as Router, useParams} from 'react-router-dom'
import axios from 'axios'
import Icon from "../components/common/Icon";
import { camelCaseToTitleCase, titleCase } from "../utils/handyFunctions";
import Button from "../components/common/Button";
import Error from "../components/common/Error";
import PopupMessage from "../components/common/PopupMessage";
import cab_icon from "../assets/cab-purple.svg"
import double_arrow from '../assets/double-arrow.svg'
import { getTravelRequest_API, updateTravelRequest_API, cancelTravelRequest_API } from "../utils/api";
import { material_flight_black_icon, material_train_black_icon, material_bus_black_icon, material_cab_black_icon, material_car_rental_black_icon, material_hotel_black_icon, material_personal_black_icon } from "../assets/icon";
import { left_arrow_icon, calender_icon, location_icon , clock_icon} from "../assets/icon";



const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL

export default function () {
  //get travel request Id from params
    const {travelRequestId} = useParams()
    const [showPopup, setShowPopup] = useState(false)
    const [message, setMessage] = useState(false)
    const [showConfimationForCancllingTR, setShowConfirmationForCancellingTr] = useState(false)
    const [tenantId, setTenantId] = useState(undefined)
    const [employeeId, setEmployeeId] = useState(undefined)

    const handleCancel = (type, formId, itemIndex, isReturn)=>{
        console.log('type formId itemIndex', type, formId, itemIndex, isReturn)
        setItemType(type)
        setItemIndex(itemIndex)
        setFormId(formId)
        setIsReturn(isReturn)
        setShowCancelModal(true)
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

        // setMessage('Your Travel Request has been cancelled');
        // setShowPopup(true)

        window.parent.postMessage({message:"cash message posted" , 
        popupMsgData: { showPopup:true, message:"Your Travel Request has been cancelled", iconCode: "101" }}, DASHBOARD_URL);


        setTimeout(()=>{
           // setShowPopup(false)
            //redirect to dashaboard
            window.location.href = `${DASHBOARD_URL}/${tenantId}/${employeeId}/overview`
        },5000)
    }

    const handleSubmit = async ()=>{
        setIsLoading(true)
        console.log('sending data to backend', formData )
        const res = await updateTravelRequest_API({travelRequest:formData, submitted:true})
        if(res.err){
            setIsLoading(false)
            // setMessage('Cancellation Failed. Please try again after some time') 
            // setShowPopup(true)
            window.parent.postMessage({message:"cash message posted" , 
            popupMsgData: { showPopup:true, message:"Cancellation Failed. Please try again after some time", iconCode: "102" }}, DASHBOARD_URL);
            return   
        }
        setIsLoading(false)
        setMessage('Cancellation processed')
        setShowPopup(true)
        window.parent.postMessage({message:"cash message posted" , 
        popupMsgData: { showPopup:true, message:"Cancellation processed", iconCode: "101" }}, DASHBOARD_URL);
        //wait for 5 seconds
        setTimeOut(()=>{
            setShowPopup(false)
            //redirect to dashboard
            window.location.href = `${DASHBOARD_URL}/${tenantId}/${employeeId}/overview`
        },0)
    }

    const [isLoading, setIsLoading] = useState(true)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [isReturn, setIsReturn] = useState(false)

   
    //fetch travel request data from backend
    useEffect(() => {
        (async function(){
          const travel_res = await getTravelRequest_API({travelRequestId})
          if(travel_res.err){
            setLoadingErrMsg(travel_res.err)
            return
          }
          const travelRequestDetails = travel_res.data.travelRequest
          setTenantId(travelRequestDetails.tenantId)
          setEmployeeId(travelRequestDetails.createdBy.empId)
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

            {/* back link */}
            <div className='flex items-center gap-4 cursor-pointer'>
                <img className='w-[24px] h-[24px]' src={left_arrow_icon} onClick={()=>window.location.href = `${DASHBOARD_URL}/${tenantId}/${employeeId}/overview`} />
                <p className='text-neutral-700 text-md font-semibold font-cabin'>Create travel request</p>
            </div>
            
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