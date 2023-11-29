import { useState, useEffect, createContext } from "react";
import {BrowserRouter as Router, Routes, Route, useParams} from 'react-router-dom'
import axios from 'axios'
import Icon from "../components/common/Icon";
import { titleCase } from "../utils/handyFunctions";
import Modal from "../components/common/Modal";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Upload from "../components/common/Upload";
import scanner_icon from '../assets/scanner.svg'

const TRAVEL_API = import.meta.env.VITE_TRAVEL_API_URL

console.log(import.meta.env.VITE_TRAVEL_API_URL)

const expenseCategories = [
    {headerName:'flight', fields:[{name:'Vendor Name', type:'text'}, {name:'Departure', type:'text'}, {name:'Arrival', type:'text'}, {name:'Tax Amount', type:'amount'}, {name:'Total Amount', type:'amount'}, ]},
    {headerName:'Cab', fields:[{name:'Vendor Name', type:'text'}, {name:'Departure', type:'text'}, {name:'Arrival', type:'text'}, {name:'Tax Amount', type:'amount'}, {name:'Total Amount', type:'amount'}, ]},
    {headerName:'hotel', fields:[{name:'Vendor Name', type:'text'}, {name:'Check-In', type:'date'}, {name:'Checkout', type:'text'}, {name:'Tax Amount', type:'amount'}, {name:'Total Amount', type:'amount'}, ]},
]

export default function () {
  //get travel request Id from params
    const {travelRequestId} = useParams()
    const tenantId = 'tynod76eu'
    console.log(travelRequestId, 'travelRequestId')

    const bookingsData = useState(null)

    const [loadingTR, setLoadingTR] = useState(true)
    const [loadingOnboardingData, setLoadingOnboardingData] = useState(true)
    const [showTicketModal, setShowTicketModal] = useState(false)

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
                preferences:travelRequestDetails.preferences,
                travelViolations:travelRequestDetails.travelViolations,
           }

           const itinerary = travelRequestDetails.itinerary


           setFormData(currentFomData)
           setLoadingTR(false)
        })
        .catch(err=>{ 
            console.error(err)
            //handle possible scenarios
        })
    },[])

    useEffect(()=>{
        if(showTicketModal){
            document.body.style.overflow = 'hidden'
        }
        else{
            document.body.style.overflow = 'auto'
        }

    },[showTicketModal])

  const TRAVEL_MICROSERVICE_SERVER_URL = 'http://localhost:8001/travel/api' 
  const EMPLOYEE_ID  = '1001'
  const EMPLOYEE_NAME = 'Abhishek Kumar'


  const [formData, setFormData] = useState({
    travelRequestId: null,
    approvers: [],
    tenantId:tenantId,
    status: 'draft',
    state: 'section0',
    createdBy: {name: EMPLOYEE_NAME, empId: EMPLOYEE_ID},
    createdFor: null,
    travelAllocationHeaders:[],
    tripPurpose:null,
    sentToTrip:false,
    raisingForDelegator:false,
    nameOfDelegator:null,
    isDelegatorManager:false,
    selectDelegatorTeamMembers:false,
    delegatorsTeamMembers:[],

    bookingForSelf:true,
    bookiingForTeam:false,
    teamMembers : [],


    itinerary: [{
      journey:{
        from:null, 
        to:null, 
        departure:{date:null, time:null, isModified:false, isCanceled:false, cancellationDate:null, cancellationReason:null} , 
        return:{date:null, time:null, isModified:false, isCanceled:false, cancellationDate:null, cancellationReason:null}
      },
      hotels:[{class:null, checkIn:null, checkOut:null, hotelClassViolationMessage:null, isModified:false, isCanceled:false, cancellationDate:null, cancellationReason:null}],
      cabs:[{date:null, class:null, prefferedTime:null, pickupAddress:null, dropAddress:null, cabClassVioilationMessage:null, isModified:false, isCanceled:false, cancellationDate:null, cancellationReason:null}],
      modeOfTransit:null,
      travelClass:null,
      needsVisa:false,
      needsBoardingTransfer:false,
      needsHotelTransfer:false,
      boardingTransfer:{
        prefferedTime:null,
        pickupAddress:null,
        dropAddress:null, 
        isModified:false, 
        isCanceled:false, 
        cancellationDate:null, 
        cancellationReason:null
      },
      hotelTransfer:{
        prefferedTime:null,
        pickupAddress:null,
        dropAddress:null, 
        isModified:false, 
        isCanceled:false, 
        cancellationDate:null, 
        cancellationReason:null
      },
      needsHotel:false,
      needsCab:false,
      isModified:false, 
      isCanceled:false, 
      cancellationDate:null, 
      cancellationReason:null
    }],

    travelDocuments:[],
    tripType:{oneWayTrip:true, roundTrip:false, multiCityTrip:false},
    preferences:[],
    travelViolations:{
      tripPurposeViolationMessage:null,
      travelClassViolationMessage:null,
      hotelClassViolationMessage:null,
      cabClassVioilationMessage:null,
    },
  })


  const [onBoardingData, setOnBoardingData] = useState()
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileSelected, setFileSelected] = useState(null)
  const [preview, setPreview] = useState()

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

  //flags
useEffect(() => {
  axios
    .get(`${TRAVEL_API}/initial-data/${tenantId}/${EMPLOYEE_ID}`)
    .then((response) => {
      console.log(response.data)
      setOnBoardingData(response.data)
      setLoadingOnboardingData(false)
    })
    .catch(err=>{ 
      console.error(err)
      //handle possible scenarios
    })
},[])

  return <>
        {(loadingTR || loadingOnboardingData) && <div>Loading Booking Request...</div>}
      {!loadingTR && !loadingOnboardingData && 
        <div className="w-full h-full relative bg-white md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none">
        {/* app icon */}
        <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
            <Icon/>
        </div>

        {/* Rest of the section */}
        <div className="w-full h-full mt-10 p-10 font-cabin tracking-tight">
            <p className="text-2xl text-neutral-600 mb-5">{`${formData.tripPurpose} Trip`}</p>
            <hr/>
            <div className="mt-5 flex flex-col gap-4">
                {formData.itinerary.map(leg=>{
                    console.log(leg)
                    return(<>
                        <p className="text-xl text-neutral-700">
                            {`${titleCase(leg.journey.from)} to ${titleCase(leg.journey.to)} `}
                        </p>

                        <div className='flex flex-col gap-2'>
                        {<>
                            <FlightCard
                                onClick={()=>setShowTicketModal(true)} 
                                from={leg.journey.from} 
                                to={leg.journey.to} 
                                date={leg.journey.departure.date}
                                travelClass={leg.travelClass} 
                                mode={leg.modeOfTransit}
                                time={leg.journey.departure.time}/>
                            {leg.journey?.return?.date!=null && leg.journey?.return?.date!=undefined && 
                                <FlightCard 
                                    onClick={()=>setShowTicketModal(true)}
                                    from={leg.journey.to} 
                                    to={leg.journey.from} 
                                    date={leg.journey.return.date}
                                    travelClass={leg.travelClass} 
                                    mode={leg.modeOfTransit} 
                                    time={leg.journey.return.time }/>
                            }
                         </>}

                         {leg.needsBoardingTransfer && <>
                            <CabCard
                                onClick={()=>setShowTicketModal(true)} 
                                from={leg.boardingTransfer.pickupAddress} 
                                to={leg.boardingTransfer.dropAddress} 
                                date={leg.journey.departure.date} 
                                isTransfer={true}
                                mode={leg.modeOfTransit}
                                time={leg.boardingTransfer.prefferedTime}/>
                         </>}

                         {leg.needsHotelTransfer && <>
                            <CabCard
                                onClick={()=>setShowTicketModal(true)} 
                                from={leg.hotelTransfer?.pickupAddress??spitBoardingPlace(leg.modeOfTransit)} 
                                to={leg.hotelTransfer?.dropAddress??'Hotel'} 
                                date={leg.journey.departure.date} 
                                isTransfer={true}
                                mode={leg.modeOfTransit}
                                time={leg.hotelTransfer.prefferedTime}/>
                         </>}

                         {leg.needsCab && leg.cabs.length>0 && leg.cabs.map(cab=>
                            <CabCard
                            onClick={()=>setShowTicketModal(true)} 
                            from={cab.pickupAddress} 
                            to={cab.dropAddress} 
                            date={cab.date} 
                            mode={leg.modeOfTransit}
                            time={cab.prefferedTime}/>
                         )}

                        {leg.needsHotel && leg.hotels.length>0 && leg.hotels.map(hotel=>
                            <HotelCard
                            onClick={()=>setShowTicketModal(true)} 
                            checkIn={hotel.checkIn} 
                            checkOut={hotel.checkOut}
                            hotelClass={hotel.class}
                            preference={'Close to Airport'} 
                            />
                         )}
                        </div>
                         

                        {showTicketModal && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
                            <div className='z-10 max-w-4/5 w-4/5 min-h-4/5 max-h-4/5 scroll-none bg-white rounded-lg shadow-md'>
                                <AddTicket setShowModal={setShowTicketModal} 
                                            selectedFile={selectedFile} 
                                            setSelectedFile={setSelectedFile} 
                                            fileSelected={fileSelected} 
                                            setFileSelected={setFileSelected}
                                            setPreview={setPreview}
                                            preview={preview} />
                            </div>
                        </div>}
                        
                    </>)
                })}
            </div>
            
        </div>

        </div>
      }
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

function FlightCard({from, to, date, time, travelClass, onClick, mode='Flight'}){
    return(<div className="shadow rounded-lg border w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
    <p className='font-semibold text-base text-neutral-600'>{mode}</p>
    <div className="w-full flex sm:block">
        <div className='mx-2 text-sm text-neutral-500 flex justify-between flex-col sm:flex-row'>
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
    <div className="cursor-pointer" onClick={onClick}>
        <div className="ml-6 flex flex-col w-[60px] items-center -gap-2">
            <div className='text-indigo-600 text-3xl font-bold'>+</div>
            <p className="text-xs text-neutral-600 ">Add Tickets</p>
        </div>
    </div>
    </div>)
}

function CabCard({from, to, date, time, travelClass, onClick, mode, isTransfer=false}){
    return(<div className="shadow rounded-lg border w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
    <div className='font-semibold text-base text-neutral-600'>
        <div>Cab</div>
        {isTransfer && <p className="text-xs text-neutral-500">{spitBoardingPlace(mode)}</p>}
    </div>
    <div className="w-full flex sm:block">
        <div className='mx-2 text-sm text-neutral-500 flex justify-between flex-col sm:flex-row'>
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
    <div className="cursor-pointer" onClick={onClick}>
        <div className="ml-6 flex flex-col w-[60px] items-center -gap-2">
            <div className='text-indigo-600 text-3xl font-bold'>+</div>
            <p className="text-xs text-neutral-600 ">Add Tickets</p>
        </div>
    </div>
    </div>)
}

function HotelCard({checkIn, checkOut, hotelClass, onClick, preference={preference}}){
    return(<div className="shadow rounded-lg border w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
    <p className='font-semibold text-base text-neutral-600'>Hotel</p>
    <div className="w-full flex sm:block">
        <div className='mx-2 text-sm text-neutral-500 flex justify-between flex-col sm:flex-row'>
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
    <div className="cursor-pointer" onClick={onClick}>
        <div className="ml-6 flex flex-col w-[60px] items-center -gap-2">
            <div className='text-indigo-600 text-3xl font-bold'>+</div>
            <p className="text-xs text-neutral-600 ">Add Tickets</p>
        </div>
    </div>
    </div>)
}

function AddTicket({setShowModal, selectedFile, setSelectedFile, fileSelected, setFileSelected, preview, setPreview}){
    return(<div className="">
        <div className="mx-6 my-4 border">
            
        </div>
        <div className='flex mx-6 my-4 relative'>
            <div className="flex-1 flex-col items-center justify-center overflow-y-scroll">
                
               {!fileSelected && <Upload selectedFile={selectedFile} 
                        setSelectedFile={setSelectedFile} 
                        fileSelected={fileSelected} 
                        setFileSelected={setFileSelected}  />}

                {fileSelected && 
                    <div className='relative flex flex-col items-center max-h-[200px]'>
                        <p className="text-sm mb-4 underline text-indigo-600 cursor-pointer" onClick={()=>{setPreview(null); setFileSelected(false); setSelectedFile(null) }}>
                            Re-Upload
                        </p>
                        {preview && 
                            <>
                                <img src={preview} className="" />
                            </>
                        }
                    </div>
                }
            </div>

            <div className="border m-2 p-4 flex-1">
                <div className=''>
                    <div>
                        <Input title='Vendor Name' />
                        <Input title='Departure' />
                        <Input title='Arrival' />
                        <Input title='Ticket Price' />
                        <Input title='Tax Amount' />
                        <div className="my-4"></div>
                        <Button text='Save Details'/>
                    </div>
                </div>
            </div>
            <div className='absolute right-1 top-0 cursor-pointer'>
                <p className="text-2xl text-neutral-700 hover:text-neutral-500" onClick={()=>setShowModal(false)}>x</p>
            </div>

            {preview && <div className="fixed flex gap-2 items-center border border-gray-800 bottom-10 bg-gray-100 px-6 py-2 rounded-md text-neutral-700">
                <p>Scan</p>
                <img src={scanner_icon} className="w-6 h-6" />
            </div>}
        </div>
    </div>)
}