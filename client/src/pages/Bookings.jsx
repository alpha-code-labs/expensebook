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
import Tesseract from "tesseract.js";
import { extractDateFromText, extractTotalAmountFromText2, extractVendorName } from "../utils/regex";
import SlimDate from "../components/common/SlimDate";
import TimePicker from "../components/common/TimePicker";
import {getRawTravelRequest_API, updateRawTravelRequest_API, getTravelBookingOnboardingData_API, updateTravelBookings_API } from "../utils/api";
import { cab_icon, bus_icon, train_icon, biderectional_arrows_icon as double_arrow, calender_icon, clock_icon, airplane_icon } from "../assets/icon";


const TRAVEL_API = import.meta.env.VITE_TRAVEL_API_URL

console.log(import.meta.env.VITE_TRAVEL_API_URL)


const expenseCategories = {
    'flight' : [{name:'Vendor Name', id:'vendorName', toSet:'bookingDetails', type:'text'}, 
                {name:'Flight Date',  toSet:'bkd_date',  id:'bkd_date', type:'date'},
                {name:'Departure', toSet:'bkd_from',  id:'bkd_from', type:'text'}, 
                {name:'Arrival', type:'text', toSet:'bkd_to', id:'bkd_to'}, 
                {name:'Tax Amount', type:'amount', toSet:'bookingDetails', id:'taxAmount'}, 
                {name:'Total Amount', type:'amount', toSet:'bookingDetails', id:'totalAmount'}],
    'cab' : [{name:'Vendor Name', id:'vendorName', toSet:'bookingDetails', type:'text'},
                {name:'Booking Date',  toSet:'bkd_date',  id:'bkd_date', type:'date'}, 
                {name:'Pickup Address', toSet:'bkd_pickupAddress',  id:'bkd_pickupAddress', type:'text'}, 
                {name:'Drop Address', type:'text', toSet:'bkd_dropAddress', id:'bkd_dropAddress'}, 
                {name:'Tax Amount', type:'amount', toSet:'bookingDetails', id:'taxAmount'}, 
                {name:'Total Amount', type:'amount', toSet:'bookingDetails', id:'totalAmount'}],
    'hotel' : [{name:'Vendor Name', id:'vendorName', toSet:'bookingDetails', type:'text'}, 
                 {name:'Hotel Name', id:'hotelName', toSet:'bookingDetails', type:'text'},
                {name:'CheckIn',  toSet:'bkd_checkIn',  id:'bkd_checkIn', type:'date'}, 
                {name:'CheckOut', toSet:'bkd_checkOut', id:'bkd_checkOut', type:'date' }, 
                {name:'Tax Amount', type:'amount', toSet:'bookingDetails', id:'taxAmount'}, 
                {name:'Total Amount', type:'amount', toSet:'bookingDetails', id:'totalAmount'}]
}

export default function () {
  //get travel request Id from params
    const {travelRequestId} = useParams()
    const tenantId = 'tynod76eu'
    console.log(travelRequestId, 'travelRequestId')

    const bookingsData = useState(null)
    const [loadingTR, setLoadingTR] = useState(true)
    const [loadingOnboardingData, setLoadingOnboardingData] = useState(true)
    const [showTicketModal, setShowTicketModal] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)

    //fetch travel request details and other details
    useEffect(()=>{
        (async function(){
            const res = await getRawTravelRequest_API({travelRequestId})
            
            if(res.err){
                setLoadingErrMsg(res.err)
                return;
            }

            const employeeId = res.data?.createdFor?.empId??res.data?.createdBy?.empId
            console.log(employeeId)
            const onboarding_res = await getTravelBookingOnboardingData_API({tenantId, employeeId, travelType:'international'})
            console.log(onboarding_res.data, 'onboarding')
            setOnBoardingData(onboarding_res.data)

            console.log(res.data)
            setFormData(res.data)
            setIsLoading(false)
        })()
    },[])

    useEffect(()=>{
        if(showTicketModal){
            document.body.style.overflow = 'hidden'
        }
        else{
            document.body.style.overflow = 'auto'
        }

    },[showTicketModal])

  const [formData, setFormData] = useState({})
  const [onBoardingData, setOnBoardingData] = useState()
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileSelected, setFileSelected] = useState(null)
  const [preview, setPreview] = useState()
  const [extractedVendorName, setExtractedVendorName] = useState(null)
  const [extractedDate, setExtractedDate] = useState(null)
  const [extractedAmount2, setExtractedAmount2] = useState(null)
  const [status, setStatus] = useState(null)
  const [progress, setProgress] = useState(0)
  const [formFields, setFormFields] = useState([])
  const [addTicketVariables, setAddTicketVariables] = useState({toSet:null, itemIndex:null, transportType:null})
  const [fileState, setFileState] = useState({fileSelected:null, selectedFile:null, preview:null})
  const [tesseractState, setTesseractState] = useState({status:null, progress:null, extractedVendorName:null, extractedDate:null, extractedAmount:null})

  const handleAddTicket = (toSet, itemIndex)=>{
    setAddTicketVariables({toSet, itemIndex, transportType:toSet.slice(0,-1)})
    setShowTicketModal(true)
  }

  const handleFieldValueChange = (toSet, id, e)=>{
    console.log(addTicketVariables)
    const _toSet = addTicketVariables.toSet
    const itemIndex = addTicketVariables.itemIndex
    const formData_copy = JSON.parse(JSON.stringify(formData))
    
    if(toSet != 'bookingDetails'){
        formData_copy.itinerary[_toSet][itemIndex][toSet] = e.target.value
    }

    else{
        formData_copy.itinerary[_toSet][itemIndex][toSet] = {...formData_copy.itinerary[_toSet][itemIndex][toSet], [id]:e.target.value} 
    }

    console.log(formData_copy)
    setFormData(formData_copy)
    console.log(_toSet, itemIndex, toSet, id)
  }

  const handleIndividualTicketSave = async (toSet, itemIndex)=>{
    //we fist have to validate the fields.. but booking admin can not be forced to submit all values at once
    //maybe we need a second button for handling individual submits
    //for now simply send a call to backend for updating the itinerary.

    //if file is uploaded then upload filel get url and set the url as doc url

    //send data to backend
    const data = {itinerary:formData.itinerary, travelRequestId:formData.travelRequestId, submitted:false}
    const res = await updateTravelBookings_API(data)
    
    setShowTicketModal(false)
    console.log(res.data)
  }
    
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

    const handleConvert = async ()=>{
       
        Tesseract.recognize(URL.createObjectURL(selectedFile),
          'eng',
            {
              user_words : './assets/dict.txt',
              logger : m=> {
                setStatus(m.status)
                setProgress(`${m.progress.toFixed(2)*100}`)
              //  console.log(m)
              }
            })
        .catch(err=> console.log(err))
        .then(res=>{
          console.log(res.data.text??'extraction failed')
          const date = extractDateFromText(res.data.text)
          setExtractedDate(date)
          setExtractedAmount2(extractTotalAmountFromText2(res.data.text)) 
          setStatus('Done !')
          //console.log(res.data.text)
          setExtractedVendorName(extractVendorName(res.data.text))
          })
      }

      useEffect(()=>{
        console.log(extractedVendorName, extractedDate, extractedAmount2, "Vendor Name, Date, Amount")
      }, [extractedVendorName, extractedDate, extractedAmount2])

  return <>
        {(isLoading) && <div>Loading Booking Request...</div>}
      {!isLoading && 
        <div className="w-full h-full relative bg-white md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none">
        {/* app icon */}
        <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
            <Icon/>
        </div>

        {/* Rest of the section */}
        <div className="w-full h-full mt-10 p-10 font-cabin tracking-tight">
            <p className="text-2xl text-neutral-600 mb-5">{`${formData.tripPurpose} Trip`}</p>
            <div className='flex flex-col sm:flex-row'>
                <div className='flex-2'>
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
            </div>
            <hr/>
            <div className='flex gap-2 divide-x'>
                <div className="flex-1 mt-5 flex flex-col gap-4">
                    {['flights', 'trains', 'buses', 'cabs', 'hotels'].map((itnItem, itnItemIndex) => {
                        if (formData.itinerary[itnItem].length > 0) {
                            return (
                                <div key={itnItemIndex}>
                                    <p className="text-xl text-neutral-700">
                                        {`${titleCase(itnItem)} `}
                                    </p>

                                    {formData.itinerary[itnItem].map((item, itemIndex) => {
                                        if (['flights', 'trains', 'buses'].includes(itnItem)) {
                                            return (
                                                <div key={itemIndex}>
                                                    <FlightCard onClick={() => handleAddTicket(itnItem, itemIndex)} from={item.from} to={item.to} date={item.date} time={item.time} travelClass={item.travelClass} mode={titleCase(itnItem.slice(0, -1))} />
                                                </div>
                                            );
                                        } else if (itnItem === 'cabs') {
                                            return (
                                                <div key={itemIndex}>
                                                    <CabCard onClick={() => handleAddTicket('cabs', itemIndex)} from={item.pickupAddress} to={item.dropAddress} date={item.date} time={item.time} travelClass={item.travelClass} isTransfer={item.type !== 'regular'} />
                                                </div>
                                            );
                                        } else if (itnItem === 'hotels') {
                                            return (
                                                <div key={itemIndex}>
                                                    <HotelCard onClick={() => handleAddTicket('hotels', itemIndex)} checkIn={item.checkIn} checkOut={item.checkOut} date={item.data} time={item.time} travelClass={item.travelClass} mode='Train' />
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            );
                        }
                        return null; // Return null if no items in the itinerary
                    })}
                </div>

                <div className="flex-3 px-2">
                        <p className='text-md underline semibold mt-1'>Applicable policies</p>
                        <div className="grid grid-cols-1 mt-2 font-cabin">
                            {Object.keys(onBoardingData.policies).map(pl_key=>{
                                return(<>
                                    <div className="mt-1">
                                        <p className='text-sm text-neutral-600'>{`${pl_key}:`}</p>
                                        <div className='flex divide-x text-neutral-800'>
                                            {Object.keys(onBoardingData.policies[pl_key].class).map((cl,ind)=>{if(onBoardingData.policies[pl_key].class[cl]) return(<div className='text-sm px-[2px]'>{cl}</div>)})}
                                        </div>
                                    </div>
                                    <p className='text-sm text-neutral-600'>{`max. amount limit: ${onBoardingData.policies[pl_key].limit}`}</p>
                                </>)
                            })}
                        </div>
                </div>
            </div>
            
        </div>

        {showTicketModal && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
            <div className='z-10 w-full h-full sm:w-4/5 min-h-4/5 sm:max-h-4/5 scroll-none bg-white rounded-lg shadow-md'>
                <AddTicket  setShowModal={setShowTicketModal} 
                            
                            selectedFile={selectedFile} 
                            setSelectedFile={setSelectedFile} 
                            fileSelected={fileSelected} 
                            setFileSelected={setFileSelected}
                            preview={preview}
                            setPreview={setPreview}
                            addTicketVariables={addTicketVariables}
                            handleConvert={handleConvert}
                            handleFieldValueChange={handleFieldValueChange}
                            expenseCategories={expenseCategories}
                            handleIndividualTicketSave={handleIndividualTicketSave}
                            itinerary={formData.itinerary}
                                />
            </div>
        </div>}

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
        <div className="shadow-sm min-h-[60px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
        <img src={spitImageSource(mode)} className='w-4 h-4' />
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
                    <div className="flex">
                        <img src={calender_icon} className='w-4'/>
                        <p>{date}</p>
                    </div>
                </div>
                <div className="">
                    <div className='flex'>
                        <img src={clock_icon} className='w-4'/>
                        <p>{time??'N/A'}</p>    
                    </div>
                </div>
                <div className="">
                    {travelClass?.toUpperCase()??'N/A'}
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

function CabCard({from, to, date, time, travelClass, onClick, isTransfer=false}){
    return(
        <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
        <div className='font-semibold text-base text-neutral-600'>
        <img src={cab_icon} className='w-6 h-6' />
            {<p className="text-xs text-neutral-500">{isTransfer? 'Transfer Cab' : 'Cab'}</p>}
        </div>
        <div className="w-full flex sm:block">
            <div className="mx-2 text-sm w-full flex gap-1 flex-col lg:flex-row lg:justify-between lg:items-center">
                <div className="flex-1">
                    {`pickup: ${from??'not provided'}`}   
                </div>
                <div className="flex-1">
                    {`drop: ${from??'not provided'}`}      
                </div>
                <div className="">
                    <div className="flex">
                        <img src={calender_icon} className='w-4'/>
                        <p>{date}</p>
                    </div>
                </div>
                <div className="">
                    <div className='flex'>
                        <img src={clock_icon} className='w-4'/>
                        <p>{time??'N/A'}</p>    
                    </div>
                </div>
               {!isTransfer && <div className="flex-1">
                    {travelClass?.toUpperCase()??'Any'}
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

function HotelCard({checkIn, checkOut, hotelClass, onClick, preference='close to airport'}){
    return(
        <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
        <p className='font-semibold text-base text-neutral-600'>Hotel</p>
        <div className="w-full flex sm:block">
            <div className="mx-2 text-sm w-full flex gap-1 flex-col lg:flex-row lg:justify-between lg:items-center">
                <div className="flex">
                    <img src={calender_icon} className='w-4'/>
                    <p>{checkIn}</p>
                </div>
                <div className="flex">
                    <img src={calender_icon} className='w-4'/>
                    <p>{checkOut}</p>
                </div>
                <div className="flex-1">
                    {hotelClass?.toUpperCase()??'N/A'}
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

function AddTicket(
    {
        setShowModal, 
        selectedFile, 
        setSelectedFile, 
        fileSelected, 
        setFileSelected, 
        preview, 
        setPreview, 
        handleConvert, 
        addTicketVariables, 
        handleFieldValueChange,
        expenseCategories,
        handleIndividualTicketSave,
        itinerary
        }){
    
    return(<div className="relative">
        <div className='flex flex-col overflow-y-scroll md:flex-row mx-6 my-4 relative'>

            <div className="relative h-[80vh] flex-1 flex-col items-center justify-center overflow-y-scroll">
                
               {!fileSelected && <Upload selectedFile={selectedFile} 
                        setSelectedFile={setSelectedFile} 
                        fileSelected={fileSelected} 
                        setFileSelected={setFileSelected}  />}

                {fileSelected && 
                    <div className='relative flex flex-col items-center max-h-[200px]'>
                        {preview && 
                            <>
                                <img src={preview} className="" />
                            </>
                        }
                    </div>
                }

                {fileSelected && <p className="z-10 absolute left-[calc(50%-38px)] px-4 py-2 bg-white rounded-md top-0 text-sm mb-4 underline text-indigo-600 cursor-pointer" onClick={()=>{setPreview(null); setFileSelected(false); setSelectedFile(null) }}>
                    Re-Upload
                </p>}

                {preview && <div className="absolute left-[calc(50%-57px)] bottom-10 flex gap-2 items-center border border-gray-800 bg-gray-100 px-6 py-2 rounded-md text-neutral-700 cursor-pointer">
                    <p>Scan</p>
                    <img src={scanner_icon} className="w-6 h-6" onClick={handleConvert} />
                </div>}

            </div>

            <div className="h-[80vh] border m-2 p-4 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2 overflow-y-scroll">
                {console.log(expenseCategories, addTicketVariables)}
                {expenseCategories[addTicketVariables.transportType.toLowerCase()]?.length>0 && expenseCategories[addTicketVariables.transportType.toLowerCase()].map((field,index)=>{

                    switch(field.type){
                        case 'text' : return(  
                                        <div className='' key={index}>
                                            <Input 
                                                title={field.name} 
                                                value={field.toSet == field.id ? itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex][field.toSet] : itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex][field.toSet][field.id]} 
                                                onChange={(e)=>handleFieldValueChange(field.toSet, field.id, e)} />
                                        </div>)

                        case 'date' : return(  
                            <div className='' key={index}>

                                <div className="min-w-[200px] w-full md:w-fit max-w-[403px] h-[73px] flex-col justify-start items-start gap-2 inline-flex">
                                    {/* title */}
                                    <div className="text-zinc-600 text-sm font-cabin">{field.name}</div>

                                    {/* input */}
                                    <div className="relative w-full h-full bg-white items-center flex">
                                        <div className="text-neutral-700 w-full  h-full text-sm font-normal font-cabin">
                                            <input 
                                            type='date' 
                                            className="w-full h-full decoration:none px-6 py-2 border rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 "
                                            name={field.name} 
                                            value={itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex][field.toSet]}
                                            onChange={(e)=>handleFieldValueChange(field.toSet, field.id, e)} />
                                        </div>
                                    </div>
                                </div>
                            </div>)

                        case 'time' : return(  
                            <div className='' key={index}>
                                <TimePicker 
                                    time={itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex][field.toSet]} title={field.name} 
                                    onChange={(e)=>handleFieldValueChange(field.toSet, field.id, e)} />
                            </div>)

                        case 'amount' : return(  
                            <div className='' key={index}>

                                <div className="min-w-[200px] w-full md:w-fit max-w-[403px] h-[73px] flex-col justify-start items-start gap-2 inline-flex">
                                    {/* title */}
                                    <div className="text-zinc-600 text-sm font-cabin">{field.name}</div>

                                    {/* input */}
                                    <div className="relative w-full h-full bg-white items-center flex">
                                        <div className="text-neutral-700 w-full  h-full text-sm font-normal font-cabin flex">
                                            <input 
                                            type='number' 
                                            className="w-full h-full decoration:none px-6 py-2 border rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 "
                                            name={field.name}
                                            value={itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex][field.toSet][field.id]} 
                                            onChange={(e)=>handleFieldValueChange(field.toSet, field.id, e)} />
                                        </div>
                                    </div>
                                </div>
                            </div>)
                    }
                })}
                
                <div className="my-4">
                    <Button text='Save Details' onClick={()=>handleIndividualTicketSave(addTicketVariables.toSet, addTicketVariables.itemIndex)} />
                </div>
            </div>
        </div>

        <div className='absolute right-2.5 top-[-18px] cursor-pointer'>
            <p className="text-2xl text-neutral-700 hover:text-neutral-500" onClick={()=>setShowModal(false)}>x</p>
        </div>

    </div>)
}