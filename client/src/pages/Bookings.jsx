import React from "react";
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
import {getRawTravelRequest_API, updateRawTravelRequest_API, getTravelBookingOnboardingData_API, updateTravelBookings_API, uploadBill_API } from "../utils/api";
import { cab_icon, bus_icon, train_icon, biderectional_arrows_icon as double_arrow, calender_icon, clock_icon, airplane_icon, location_icon } from "../assets/icon";
import CloseButton from "../components/common/closeButton";
import Error from "../components/common/Error";
import { Document, Page } from 'react-pdf';
import Prompt from "../components/common/Prompt";
import { material_flight_black_icon, material_train_black_icon, material_bus_black_icon, material_cab_black_icon, material_car_rental_black_icon, material_hotel_black_icon, material_personal_black_icon, add_icon} from "../assets/icon";
import { BlobServiceClient } from "@azure/storage-blob";

const TRAVEL_API = import.meta.env.VITE_TRAVEL_API_URL
const az_blob_container = import.meta.env.VITE_AZURE_BLOB_CONTAINER
const blob_endpoint = import.meta.env.VITE_AZURE_BLOB_CONNECTION_URL


console.log(import.meta.env.VITE_TRAVEL_API_URL)

const expenseCategories = {
    'flight' : [{name:'Vendor Name', id:'vendorName', toSet:'bookingDetails', type:'text'}, 
                {name:'Flight Date',  toSet:'bkd_date',  id:'bkd_date', type:'date'},
                {name:'Flight Time',  toSet:'bkd_time',  id:'bkd_time', type:'time'},
                {name:'Departure', toSet:'bkd_from',  id:'bkd_from', type:'text'}, 
                {name:'Arrival', type:'text', toSet:'bkd_to', id:'bkd_to'}, 
                {name:'Tax Amount', type:'amount', toSet:'bookingDetails', id:'taxAmount'}, 
                {name:'Total Amount', type:'amount', toSet:'bookingDetails', id:'totalAmount'}],
    'train' : [{name:'Vendor Name', id:'vendorName', toSet:'bookingDetails', type:'text'}, 
                {name:'Train Date',  toSet:'bkd_date',  id:'bkd_date', type:'date'},
                {name:'Train Time',  toSet:'bkd_time',  id:'bkd_time', type:'time'},
                {name:'Departure', toSet:'bkd_from',  id:'bkd_from', type:'text'}, 
                {name:'Arrival', type:'text', toSet:'bkd_to', id:'bkd_to'}, 
                {name:'Tax Amount', type:'amount', toSet:'bookingDetails', id:'taxAmount'}, 
                {name:'Total Amount', type:'amount', toSet:'bookingDetails', id:'totalAmount'}],
    'bus' : [{name:'Vendor Name', id:'vendorName', toSet:'bookingDetails', type:'text'}, 
                {name:'Bus Date',  toSet:'bkd_date',  id:'bkd_date', type:'date'},
                {name:'Bus Time',  toSet:'bkd_time',  id:'bkd_time', type:'time'},
                {name:'Departure', toSet:'bkd_from',  id:'bkd_from', type:'text'}, 
                {name:'Arrival', type:'text', toSet:'bkd_to', id:'bkd_to'}, 
                {name:'Tax Amount', type:'amount', toSet:'bookingDetails', id:'taxAmount'}, 
                {name:'Total Amount', type:'amount', toSet:'bookingDetails', id:'totalAmount'}],
    'personalVehicle' : [{name:'Vendor Name', id:'vendorName', toSet:'bookingDetails', type:'text'}, 
                {name:'Travel Date',  toSet:'bkd_date',  id:'bkd_date', type:'date'},
                {name:'Departure', toSet:'bkd_from',  id:'bkd_from', type:'text'}, 
                {name:'Arrival', type:'text', toSet:'bkd_to', id:'bkd_to'}, 
                {name:'Tax Amount', type:'amount', toSet:'bookingDetails', id:'taxAmount'}, 
                {name:'Total Amount', type:'amount', toSet:'bookingDetails', id:'totalAmount'}],
    'cab' : [{name:'Vendor Name', id:'vendorName', toSet:'bookingDetails', type:'text'},
                {name:'Booking Date',  toSet:'bkd_date',  id:'bkd_date', type:'date'}, 
                {name:'Cab Time',  toSet:'bkd_time',  id:'bkd_time', type:'time'},
                {name:'Pickup Address', toSet:'bkd_pickupAddress',  id:'bkd_pickupAddress', type:'text'}, 
                {name:'Drop Address', type:'text', toSet:'bkd_dropAddress', id:'bkd_dropAddress'}, 
                {name:'Tax Amount', type:'amount', toSet:'bookingDetails', id:'taxAmount'}, 
                {name:'Total Amount', type:'amount', toSet:'bookingDetails', id:'totalAmount'}],
    'hotel' : [{name:'Vendor Name', id:'vendorName', toSet:'bookingDetails', type:'text'},
                {name:'Location', id:'bkd_location', toSet:'bkd_location', type:'text'}, 
                 {name:'Hotel Name', id:'hotelName', toSet:'bookingDetails', type:'text'},
                {name:'Check-In Date',  toSet:'bkd_checkIn',  id:'bkd_checkIn', type:'date'}, 
                {name:'Check-Out Date', toSet:'bkd_checkOut', id:'bkd_checkOut', type:'date' },
                {name:'Check-In Time',  toSet:'bkd_time',  id:'bkd_time', type:'time'}, 
                {name:'Tax Amount', type:'amount', toSet:'bookingDetails', id:'taxAmount'}, 
                {name:'Total Amount', type:'amount', toSet:'bookingDetails', id:'totalAmount'}]
}

export default function () {
  //get travel request Id from params
    const {travelRequestId} = useParams()
    console.log(travelRequestId, 'travelRequestId')

    const bookingsData = useState(null)
    const [loadingTR, setLoadingTR] = useState(true)
    const [loadingOnboardingData, setLoadingOnboardingData] = useState(true)
    const [showTicketModal, setShowTicketModal] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)

    const [networkState, setNetworkState] = useState({isLoading:false, isUploading:false, loadingErrMsg:null})

    //fetch travel request details and other details
    useEffect(()=>{
        (async function(){
            const res = await getRawTravelRequest_API({travelRequestId})
            
            if(res.err){
                setLoadingErrMsg(res.err)
                return;
            }

            setFormData(res.data)

            const tenantId = res.data.tenantId
            const travelType = res.data.travelType

            console.log(tenantId)

            const employeeId = res.data?.createdFor?.empId??res.data?.createdBy?.empId
            console.log(employeeId)
            const onboarding_res = await getTravelBookingOnboardingData_API({tenantId, employeeId, travelType})
            console.log(onboarding_res.data, 'onboarding')
            setOnBoardingData(onboarding_res.data)

            console.log(res.data)
            
            setIsLoading(false)
        })()
    },[])

    async function uploadFileToAzure(file) {
        try{
            const blobServiceClient = new BlobServiceClient(blob_endpoint);
            const containerClient = blobServiceClient.getContainerClient(az_blob_container);
            const blobClient = containerClient.getBlobClient(file.name);
            const blockBlobClient = blobClient.getBlockBlobClient();
          
            const result = await blockBlobClient.uploadBrowserData(file, {
                blobHTTPHeaders: {blobContentType: file.type},
                blockSize: 4 * 1024 * 1024,
                concurrency: 20,
                onProgress: ev => console.log(ev)
            });
            console.log(`Upload of file '${file.name}' completed`);
            return {success:true}
        }catch(e){
            console.error(e)
            return {success:false}   
        }
      }

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
  const [addTicketVariables, setAddTicketVariables] = useState({toSet:null, itemIndex:null, transportType:null})
  const [fileState, setFileState] = useState({fileSelected:null, selectedFile:null, preview:null})
  const [categoryToScan, setCategoryToScan] = useState('flights')
  const [tesseractState, setTesseractState] = useState({status:null, progress:null, extractedVendorName:null, extractedDate:null, extractedAmount:null})
  const [entryMode, setEntryMode] = useState('null')
  
  const handleAddTicket = (toSet, itemIndex)=>{
    setAddTicketVariables({toSet, itemIndex, transportType:toSet.slice(0,-1)})
    setCategoryToScan(toSet);
    console.log(toSet)
    setShowTicketModal(true)
  }

  const handleFieldValueChange = (toSet, id, e)=>{  
    console.log(toSet, id, e.target.value)
    console.log(addTicketVariables)
    const _toSet = addTicketVariables.toSet
    const itemIndex = addTicketVariables.itemIndex
    const formData_copy = JSON.parse(JSON.stringify(formData))
    
    if(toSet != 'bookingDetails'){
        formData_copy.itinerary[_toSet][itemIndex][toSet] = e.target.value
    }

    else{
        console.log(onBoardingData?.policies?.['Train'])
        formData_copy.itinerary[_toSet][itemIndex][toSet].billDetails[id] = e.target.value 
        if(id == 'totalAmount'){
            if(_toSet == 'flights' && e.target.value > (onBoardingData?.policies?.['Flight']?.limit??99999999))
                formData_copy.itinerary[_toSet][itemIndex].bkd_violations.amount = 'Allowed limit exceeded'

            if(_toSet == 'trains' && e.target.value > (onBoardingData?.policies?.['Train']?.limit??99999999))
                formData_copy.itinerary[_toSet][itemIndex].bkd_violations.amount = 'Allowed limit exceeded'

            if(_toSet == 'cabs' && e.target.value > (onBoardingData?.policies?.['Cab']?.limit??99999999))
                formData_copy.itinerary[_toSet][itemIndex].bkd_violations.amount = 'Allowed limit exceeded'

            // if(_toSet == 'buses' && e.target.value > (onBoardingData?.policies?.['Cab Rental']?.limit??99999999))
            // formData_copy.itinerary[_toSet][itemIndex].bkd_violations.amount = 'Allowed limit exceeded'

            if(_toSet == 'cabRentals' && e.target.value > (onBoardingData?.policies?.['Cab Rental']?.limit??99999999))
                formData_copy.itinerary[_toSet][itemIndex].bkd_violations.amount = 'Allowed limit exceeded'
        }
    }

    console.log(formData_copy)
    setFormData(formData_copy)
    console.log(_toSet, itemIndex, toSet, id)
  }

  useEffect(()=>{
    console.log(formData, 'form data');
  },[formData])

  const handleIndividualTicketSave = async (toSet, itemIndex)=>{
    //we fist have to validate the fields.. but booking admin can not be forced to submit all values at once
    //maybe we need a second button for handling individual submits
    //for now simply send a call to backend for updating the itinerary.

    //if file is uploaded then upload file-->get a url-->set the url as docUrl

    //send data to backend
    const data = {itinerary:formData.itinerary, travelRequestId:formData.travelRequestId, submitted:false}
    const res = await updateTravelBookings_API(data)
    
    setShowTicketModal(false)
    console.log(res.data)
  }

  const [extractedData, setExtractedData] = useState({})
  const [scanComplete, setScanComplete] = useState(false)
  const [scannedData, setScannedData] = useState(null)
  const [fileType, setFileType] = useState(null)
  const [prompt, setPrompt] = useState({showPrompt:false, success:false, promptMsg:null})
  const [scanningInProgress, setScanningInProgress] = useState(false)
    
    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            setFileType(null)
            return
        }

        const regex = /\/([^\/]+)$/; // Matches the last '/' and captures everything after it
        const match = selectedFile.type.match(regex);
        setFileType(match ? match[1] : null)

        console.log(match ? match[1] : null, 'file type')
        const objectUrl = URL.createObjectURL(selectedFile)

        setPreview(objectUrl)
        console.log(selectedFile, objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    useEffect(()=>{
        if(!showTicketModal){
            setEntryMode(null)
            setScanComplete(false)
        }
    },[showTicketModal])

    const handleBillUpload = async (fileURL)=>{

        try{
            // if(!fileSelected || selectedFile==null || selectedFile=='undefined') {
            //     alert('Please select a file to upload')
            // }

            if(!fileURL){
                alert('No file selected')
                return;
            }
    
            //upload the file to azure...
            //const result = await uploadFileToAzure(selectedFile);

            // if(!result.success) {
            //     setPrompt({showPrompt:true, promptMsg: 'Unable to upload file at the moment. Please try again later.'})
            //     return;
            // }

            const formData_copy = JSON.parse(JSON.stringify(formData));
    
            const ind = addTicketVariables.itemIndex;
    
            formData_copy.itinerary[categoryToScan][ind].bookingDetails.docURL = fileURL;
            setFormData(formData_copy);
    
            const uploadData = new FormData();
            uploadData.append("file", selectedFile);
            uploadData.append("category", categoryToScan);


    
            setScannedData(null)
            setScanningInProgress(true)
            const res = await uploadBill_API({category:categoryToScan, fileURL, travelRequestId})
            // const res_ = await axios.post('http://192.168.1.7:8089/api/fe/expense/travel/upload', uploadData, {
            //     headers: {
            //       "Content-Type": "multipart/form-data",
            //     },
            //   } )
            
            if(res.err){
                console.log('Error in Scanning bill')
                setScanningInProgress(false)
                alert('Scanning failed. Please upload ticket manually')
                setEntryMode('manual')
                setScanComplete(false)
                return
            }
    
            console.log(res.data)
            setScannedData(res.data.response.data)
            addTicketVariables.itemIndex
    
            console.log(`${res.data.response.data}, category:${categoryToScan}, itineraryIndex:${addTicketVariables.itemIndex}`)
    
            if(res.data.response.data != null){
                //set form data to received fields
                const formData_copy = JSON.parse(JSON.stringify(formData))
                const itineraryItem = formData_copy.itinerary[categoryToScan][addTicketVariables.itemIndex]
                console.log(itineraryItem)
                const newData = res.data.response.data
                
                if(categoryToScan == 'flights'){
                    if(newData.from != null) itineraryItem.bkd_from = newData.from
                    if(newData.to != null) itineraryItem.bkd_to = newData.to
                    if(newData.date != null) itineraryItem.bkd_date = newData.date
                    if(newData.vendorName != null) itineraryItem.bookingDetails = {...itineraryItem.bookingDetails, billDetails: {...itineraryItem.bookingDetails.billDetails, vendorName: newData['Vendor Name']} }
                    if(newData.taxAmount != null) itineraryItem.bookingDetails = {...itineraryItem.bookingDetails, billDetails: {...itineraryItem.bookingDetails.billDetails, taxAmount: newData.taxAmount} }
                    if(newData.totalAmount != null) itineraryItem.bookingDetails = {...itineraryItem.bookingDetails, billDetails: {...itineraryItem.bookingDetails.billDetails, totalAmount: newData.totalAmount}}
                    
                    console.log(newData.totalAmount, 'limit:', onBoardingData?.policies?.['Flight']?.limit)
                    if(newData.totalAmount!= null && newData.totalAmount>(onBoardingData?.policies?.['Flight']?.limit??99999999))
                        itineraryItem.bkd_violations.amount = 'Allowed limit exceeded as per Amex policies for this employee'
                }
    
                if(categoryToScan == 'trains'){
                    if(newData.from != null) itineraryItem.bkd_from = newData.from
                    if(newData.to != null) itineraryItem.bkd_to = newData.to
                    if(newData.date != null) itineraryItem.bkd_date = newData.date
                    if(newData.vendorName != null) itineraryItem.bookingDetails = {...itineraryItem.bookingDetails, billDetails: {...itineraryItem.bookingDetails.billDetails, vendorName: newData['Vendor Name']} }
                    if(newData.taxAmount != null) itineraryItem.bookingDetails = {...itineraryItem.bookingDetails, billDetails: {...itineraryItem.bookingDetails.billDetails, taxAmount: newData.taxAmount} }
                    if(newData.totalAmount != null) itineraryItem.bookingDetails = {...itineraryItem.bookingDetails, billDetails: {...itineraryItem.bookingDetails.billDetails, totalAmount: newData.totalAmount}}
                    
                    if(newData.totalAmount!= null && newData.totalAmount>(onBoardingData?.policies?.['Train']?.limit??99999999))
                        itineraryItem.bkd_violations.amount = 'Allowed limit exceeded as per Amex policies for this employee'
                }
    
                if(categoryToScan == 'Buses'){
                    if(newData.from != null) itineraryItem.bkd_from = newData.from
                    if(newData.to != null) itineraryItem.bkd_to = newData.to
                    if(newData.date != null) itineraryItem.bkd_date = newData.date
                    if(newData.vendorName != null) itineraryItem.bookingDetails = {...itineraryItem.bookingDetails, billDetails: {...itineraryItem.bookingDetails.billDetails, vendorName: newData['Vendor Name']} }
                    if(newData.taxAmount != null) itineraryItem.bookingDetails = {...itineraryItem.bookingDetails, billDetails: {...itineraryItem.bookingDetails.billDetails, taxAmount: newData.taxAmount} }
                    if(newData.totalAmount != null) itineraryItem.bookingDetails = {...itineraryItem.bookingDetails, billDetails: {...itineraryItem.bookingDetails.billDetails, totalAmount: newData.totalAmount}}
                    
                    if(newData.totalAmount!= null && newData.totalAmount>(onBoardingData?.policies?.['Cab Rental']?.limit??99999999))
                        itineraryItem.bkd_violations.amount = 'Allowed limit exceeded as per Amex policies for this employee'
                }
    
                if(categoryToScan == 'cabs'){
                    if(newData.from != null) itineraryItem.bkd_pickupAddress = newData.from
                    if(newData.to != null) itineraryItem.bkd_dropAddress = newData.to
                    if(newData.date != null) itineraryItem.bkd_date = newData.date
                    if(newData.vendorName != null) itineraryItem.bookingDetails = {...itineraryItem.bookingDetails, billDetails: {...itineraryItem.bookingDetails.billDetails, vendorName: newData['Vendor Name']} }
                    if(newData.taxAmount != null) itineraryItem.bookingDetails = {...itineraryItem.bookingDetails, billDetails: {...itineraryItem.bookingDetails.billDetails, taxAmount: newData.taxAmount} }
                    if(newData.totalAmount != null) itineraryItem.bookingDetails = {...itineraryItem.bookingDetails, billDetails: {...itineraryItem.bookingDetails.billDetails, totalAmount: newData.totalAmount}}
                    
                    if(newData.totalAmount!= null && newData.totalAmount>(onBoardingData?.policies?.['Cab']?.limit??99999999))
                        itineraryItem.bkd_violations.amount = 'Allowed limit exceeded as per Amex policies for this employee'
                }
    
                if(categoryToScan == 'Car Rentals'){
                    if(newData.from != null) itineraryItem.bkd_pickupAddress = newData.from
                    if(newData.to != null) itineraryItem.bkd_dropAddress = newData.to
                    if(newData.date != null) itineraryItem.bkd_date = newData.date
                    if(newData.vendorName != null) itineraryItem.bookingDetails = {...itineraryItem.bookingDetails, billDetails: {...itineraryItem.bookingDetails.billDetails, vendorName: newData['Vendor Name']} }
                    if(newData.taxAmount != null) itineraryItem.bookingDetails = {...itineraryItem.bookingDetails, billDetails: {...itineraryItem.bookingDetails.billDetails, taxAmount: newData.taxAmount} }
                    if(newData.totalAmount != null) itineraryItem.bookingDetails = {...itineraryItem.bookingDetails, billDetails: {...itineraryItem.bookingDetails.billDetails, totalAmount: newData.totalAmount}}
                    
                    if(newData.totalAmount!= null && newData.totalAmount>(onBoardingData?.policies?.['Cab Rental']?.limit??99999999))
                        itineraryItem.bkd_violations.amount = 'Allowed limit exceeded as per Amex policies for this employee'
                }
    
                setFormData(formData_copy)
                console.log(formData_copy)
            }
    
            setScanningInProgress(false)
            setScanComplete(true)
        }catch(e){
            console.error(e)
            setPrompt({showPrompt:true, promptMsg: 'Something went wrong. Please try again later'});
        }
      }

    const handleSubmit = async ()=>{
        
        //check if required fields are filled for each ticket
        
        const goAhead = confirm('Please make sure you have uploaded the correct details. Click cancel to abort')
        console.log('go ahead', goAhead)    
        if(!goAhead) return 

        const data = {itinerary:formData.itinerary, travelRequestId:formData.travelRequestId, submitted:true}
        const res = await updateTravelBookings_API(data)
        

        if(res.err){
            console.log(res.err)
            setPrompt({showPrompt:true, promptMsg:res.err})
            return
        }

        setPrompt({showPrompt:true, promptMsg:res.data.message})
        
    }

  return <>
        {(isLoading) && <Error message={loadingErrMsg}/>}
       
       {!isLoading && 
        <div className="w-full h-full relative bg-white md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none">
        {/* app icon */}
        <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
            <Icon/>
        </div>

        {/* Rest of the section */}
        <div className="w-full h-full mt-10 p-10 font-cabin tracking-tight">
            <p className="text-2xl text-neutral-600 mb-5">{`${formData.tripPurpose} Trip`}</p>
            <div className='flex divide-x'>
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
                
                <div className="flex flex-col px-4">

                    <div className="flex gap-2 font-cabin text-xs tracking-tight">
                        <p className="w-[100px] text-neutral-600">Flight Preference:</p>
                        <p className="text-neutral-700">{'Window Seat, vegan meals'}</p>
                    </div>

                    <div className="flex gap-2 font-cabin text-xs tracking-tight">
                        <p className="w-[100px] text-neutral-600">Hotel Preference:</p>
                        <p className="text-neutral-700">{'double-room, queen-bed'}</p>
                    </div>

                    <div className="flex gap-2 font-cabin text-xs tracking-tight">
                        <p className="w-[100px] text-neutral-600">Train Preference:</p>
                        <p className="text-neutral-700">{'lower birth, vegan meals'}</p>
                    </div>

                </div>

            </div>
            

            <hr/>
            <div className='flex flex-col gap-2 lg:divide-x divide-y lg:flex-row'>
                <div className="flex-1 mt-5 flex flex-col gap-4">
                    {['flights', 'trains', 'buses', 'cabs', 'carRentals', 'personalVehicles', 'hotels'].map((itnItem, itnItemIndex) => {
                        if (formData.itinerary[itnItem].length > 0) {
                            return (
                                <div key={itnItemIndex}>
                                    <p className="text-xl text-neutral-700">
                                        {`${titleCase(itnItem)} `}
                                    </p>

                                    {formData.itinerary[itnItem].map((item, itemIndex) => {
                                        if (['flights', 'trains', 'buses', 'personalVehicles'].includes(itnItem)) {
                                            return (
                                                <div key={itemIndex}>
                                                    <FlightCard onClick={() => handleAddTicket(itnItem, itemIndex)} status={item.status} from={item.from} to={item.to} date={isoString(item?.date)} time={item.time} returnDate={isoString(item.returnDate)} returnTime={item.returnTime} travelClass={item.travelClass} vendorName={item?.bookingDetails?.billDetails?.vendorName??undefined} taxAmount={item?.bookingDetails?.billDetails?.taxAmount??undefined} totalAmount={item?.bookingDetails?.billDetails?.totalAmount??undefined}  mode={titleCase(itnItem.slice(0, -1))} />
                                                </div>
                                            );
                                        } else if (itnItem === 'cabs' || itnItem === 'carRentals') {
                                            return (
                                                <div key={itemIndex}>
                                                    <CabCard onClick={() => handleAddTicket('cabs', itemIndex)} status={item.status} from={item.pickupAddress} to={item.dropAddress} date={isoString(item?.date)} time={item.time} mode={itnItem == 'cabs'? 'Cab' : 'Rental Car'} travelClass={item.travelClass} vendorName={item?.bookingDetails?.billDetails?.vendorName??undefined} taxAmount={item?.bookingDetails?.billDetails?.taxAmount??undefined} totalAmount={item?.bookingDetails?.billDetails?.totalAmount??undefined} isTransfer={item.type !== 'regular'} />
                                                </div>
                                            );
                                        } else if (itnItem === 'hotels') {
                                            return (
                                                <div key={itemIndex}>
                                                    <HotelCard onClick={() => handleAddTicket('hotels', itemIndex)} status={item.status} checkIn={item.checkIn} checkOut={item.checkOut} date={item.data} time={item.time} location={item.location} travelClass={item.travelClass} vendorName={item?.bookingDetails?.billDetails?.vendorName??undefined} taxAmount={item?.bookingDetails?.billDetails?.taxAmount??undefined} totalAmount={item?.bookingDetails?.billDetails?.totalAmount??undefined} mode='Hotel' />
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
                            {Object.keys(onBoardingData?.policies??{}).map((pl_key, ind)=>{
                                return(<React.Fragment key={ind}>
                                    <div className="mt-1">
                                        <p className='text-sm text-neutral-600'>{`${pl_key}:`}</p>
                                        <div className='flex divide-x text-neutral-800'>
                                            {Object.keys(onBoardingData.policies[pl_key].class).map((cl,ind)=>{if(onBoardingData.policies[pl_key].class[cl]) return(<div className='text-sm px-[2px]'>{cl}</div>)})}
                                        </div>
                                    </div>
                                    <p className='text-sm text-neutral-600'>{`max. amount limit: ${onBoardingData.policies[pl_key].limit==0? 'not set' : onBoardingData.policies[pl_key].limit}`}</p>
                                </React.Fragment>)
                            })}
                        </div>
                </div>
            </div>
            
            <div className="mt-10">
                <Button text='Mark As Booked' variant='fit' onClick={handleSubmit} />
            </div>

            <Prompt prompt={prompt} setPrompt={setPrompt} />
        </div>

        {showTicketModal && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
            
            {entryMode!='ocr' && entryMode!='manual' && <div className="relative z-10 p-10 rounded bg-white h-fit">
                <p className="text text-neutral-700 text-lg font-cabin">
                    How would you like to upload
                </p>

                <div className='flex items-center gap-4 mt-10'>
                    <Button text='Scan Ticket' onClick={(e)=>{ setEntryMode('ocr')}}/>
                    <Button text='Upload Manually' onClick={(e)=>{ setEntryMode('manual')}}/>
                </div>

                <div className="absolute right-2 top-2">
                    <CloseButton onClick={()=>setShowTicketModal(false)} />
                </div>

            </div>}

            {entryMode =='ocr' && <div className='relative z-10 w-full h-4/5  sm:w-4/5 min-h-4/5 sm:max-h-4/5 overflow-y-scroll bg-white rounded-lg shadow-md'>
                    
                {<AddScannedTicket  
                    setEntryMode={setEntryMode}
                    setShowModal={setShowTicketModal} 
                    scannedData={scannedData}
                    addTicketVariables={addTicketVariables}
                    handleBillUpload={handleBillUpload}
                    uploadFileToAzure={uploadFileToAzure}
                    handleFieldValueChange={handleFieldValueChange}
                    expenseCategories={expenseCategories}
                    handleIndividualTicketSave={handleIndividualTicketSave}
                    minDaysBeforeBooking={onBoardingData?.minDaysBeforeBooking??0}
                    formData={formData}
                    setFormData={setFormData}
                    itinerary={formData.itinerary}
                    scanComplete={scanComplete}
                    showTicketModal={showTicketModal}
                    setShowTicketModal={setShowTicketModal}
                    scanningInProgress={scanningInProgress}
                        />}

            </div>}
            
            {entryMode == 'manual' && <div className='relative z-10 w-full h-full sm:w-4/5 min-h-4/5 sm:max-h-4/5 overflow-scroll bg-white rounded-lg shadow-md'>
                <AddTicketManually  
                    setShowModal={setShowTicketModal}
                    formData={formData}
                    setFormData={setFormData} 
                    addTicketVariables={addTicketVariables}
                    handleBillUpload={handleBillUpload}
                    handleFieldValueChange={handleFieldValueChange}
                    expenseCategories={expenseCategories}
                    handleIndividualTicketSave={handleIndividualTicketSave}
                    minDaysBeforeBooking={onBoardingData?.minDaysBeforeBooking??0}
                    uploadFileToAzure={uploadFileToAzure}
                    itinerary={formData.itinerary}
                />
            </div>}

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

function FlightCard({status, from, to, date, returnDate, time, returnTime, taxAmount, totalAmount, vendorName, travelClass, onClick, mode='Flight'}){
    console.log(returnDate)
    return(
        <div className="relative shadow-sm min-h-[60px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
        <img src={spitImageSource(mode)} className='w-4 h-4 md:w-6 md:h-6' />
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
                        <p>{date}</p>
                    </div>
                </div>
                {returnDate!=null && returnDate != undefined && returnDate!='' &&
                    <div className="">
                    <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Return Date</p>
                        <div className="flex items-center gap-1">
                            <img src={calender_icon} className='w-4'/>
                            <p>{returnDate}</p>
                        </div>
                    </div>
                }
                <div className="">
                <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Departure Time</p>
                    <div className='flex items-center gap-1'>
                        <img src={clock_icon} className='w-4'/>
                        <p>{formattedTime(time)??'--:--'}</p>    
                    </div>
                </div>

                {returnTime!=null &&
                    <div className="">
                    <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Return Time</p>
                        <div className='flex items-center gap-1'>
                            <img src={clock_icon} className='w-4'/>
                            <p>{formattedTime(returnTime)??'--:--'}</p>    
                        </div>
                    </div>
                }
            </div>
        </div>
        
        <div className="cursor-pointer" onClick={onClick}>
            <div className="ml-6 flex flex-col w-[60px] items-center -gap-2">
                <img src={add_icon} className='text-indigo-600 text-3xl font-bold' />
                <p className="text-xs text-neutral-600 ">Add Tickets</p>
            </div>
        </div>

        <div className="absolute right-0 -top-4">
            <div className={`flex text-center px-1 justify-center py-1 rounded-md text-xs truncate font-medium tracking-[0.03em] ${status=='booked'?  'bg-green-200 text-green-500' : 'bg-yellow-100 text-yellow-500'}`}>
            {status}
        </div>

        </div>
    </div>)
}

function CabCard({status, from, to, date, time, taxAmount, totalAmount, vendorName, travelClass, onClick, isTransfer=false, mode='Cab'}){
    return(
        <div className="relative shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
            <div className='font-semibold text-base text-neutral-600'>
            <img src={mode=='Cab'? material_cab_black_icon : material_car_rental_black_icon} className='w-4 h-4 md:w-6 md:h-6' />
            </div>
            <div className="w-full flex sm:block">
                <div className="mx-2 text-sm w-full flex justify-between flex-col lg:flex-row">
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
            <div className="cursor-pointer" onClick={onClick}>
                <div className="ml-6 flex flex-col w-[60px] items-center -gap-2">
                <img src={add_icon} className='text-indigo-600 text-3xl font-bold' />
                    <p className="text-xs text-neutral-600 ">Add Tickets</p>
                </div>
            </div>

            <div className="absolute right-0 -top-4">
                <div className={`flex text-center px-1 justify-center py-1 rounded-sm text-xs truncate font-medium tracking-[0.03em] ${status=='booked'?  'bg-green-200 text-green-500' : 'bg-yellow-100 text-yellow-500'}`}>
                    {status}
                </div>
            </div>
    </div>)
}

function HotelCard({status, checkIn, checkOut, taxAmount, totalAmount, vendorName, hotelClass, onClick, location}){
    return(
        <div className="relative shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
        <img src={material_hotel_black_icon} className='w-4 h-4 md:w-6 md:h-6'/>
        <div className="w-full flex sm:block">
            <div className="mx-2 text-sm w-full flex gap-1 flex-col lg:flex-row lg:justify-between lg:items-center">
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
        <div className="cursor-pointer" onClick={onClick}>
            <div className="ml-6 flex flex-col w-[60px] items-center -gap-2">
                <img src={add_icon} className='text-indigo-600 text-3xl font-bold' />
                <p className="text-xs text-neutral-600 ">Add Tickets</p>
            </div>
        </div>

        <div className="absolute right-0 -top-4">
            <div className={`flex text-center px-1 justify-center py-1 rounded-sm text-xs truncate font-medium tracking-[0.03em] ${status=='booked'?  'bg-green-200 text-green-500' : 'bg-yellow-100 text-yellow-500'}`}>
                {status}
            </div>
        </div>
    </div>)
}

function AddTicketManually(
    {
        setShowModal,  
        handleBillUpload, 
        addTicketVariables, 
        handleFieldValueChange,
        expenseCategories,
        handleIndividualTicketSave,
        minDaysBeforeBooking,
        itinerary,
        formData,
        setFormData,
        uploadFileToAzure,
        }){
    
    let presentURL = formData.itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex].bookingDetails.docURL??undefined;
       
    const [selectedFile, setSelectedFile] = useState(presentURL)
    const [fileSelected, setFileSelected] = useState(presentURL!=undefined && presentURL!=null ? true : false)
    const [preview, setPreview] = useState(presentURL)
    const [uploading, setUploading] = useState(false)


    useEffect(()=>{
        console.log(preview)
    }, preview)

    let firstTime = true;

    async function setDocURL(){
        if(firstTime) {firstTime = false; return;}
        setUploading(true)
        const res = await uploadFileToAzure(selectedFile)
        setUploading(false)

        if(res.success){
            //upload file to azure and store the url in bookingDetails
            const formData_copy = JSON.parse(JSON.stringify(formData));
            formData_copy.itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex].bookingDetails.docURL = `https://blobstorage318.blob.core.windows.net/images/images/${selectedFile.name}`;
            setFormData(formData_copy)
            setPreview(`https://blobstorage318.blob.core.windows.net/images/images/${selectedFile.name}`)
            presentURL = `https://blobstorage318.blob.core.windows.net/images/images/${selectedFile.name}`;
        }
        else{
            alert('Something went wrong while uploading file. Please try again after some time.')
            console.error(res, selectedFile)
            setSelectedFile(null);
            setFileSelected(false);
            setPreview(null);
        }
    }

    return(
        <div className=" m-4 p-4 flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 overflow-y-scroll scroll">
            {console.log(expenseCategories, addTicketVariables)}
            {expenseCategories[addTicketVariables.transportType.toLowerCase()]?.length>0 && expenseCategories[addTicketVariables.transportType.toLowerCase()].map((field,index)=>{
                switch(field.type){
                    case 'text' : return(  
                                    <div className='' key={index}>
                                        <Input 
                                            title={field.name} 
                                            value={field.toSet == field.id ? itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex][field.toSet] : itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex][field.toSet].billDetails?.[field.id]} 
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
                                        min={getDateXDaysAway(Number(minDaysBeforeBooking))}
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
                                onTimeChange={(e)=>handleFieldValueChange(field.toSet, field.id, e)} />
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
                                        value={itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex]?.[field.toSet].billDetails?.[field.id]} 
                                        onChange={(e)=>handleFieldValueChange(field.toSet, field.id, e)} />
                                    </div>

                                    {field.id=='totalAmount' && <p className="absolute top-[45px] left-6 text-xs text-yellow-600">{itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex]?.bkd_violations?.amount}</p>}
                                </div>

                            </div>
                        </div>)
                }
            })}
            
            {<div className="relative h-fit flex-1 flex-col items-center justify-center">
                <p className="py-2 text-neutral-700 font-cabin">Upload Ticket</p>

                {!fileSelected && <Upload selectedFile={selectedFile} 
                    setSelectedFile={setSelectedFile} 
                    fileSelected={fileSelected} 
                    setFileSelected={setFileSelected}  />}

                {
                    fileSelected && <p className="z-10 absolute left-[calc(50%-38px)] px-4 py-2 bg-white rounded-md top-0 text-sm mb-4 underline text-indigo-600 cursor-pointer" 
                    onClick={()=>{
                        setPreview(null); 
                        setFileSelected(false); 
                        setSelectedFile(null)
                        setPreview(null)

                        const formData_copy = JSON.parse(JSON.stringify(formData));
                        formData_copy.itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex].bookingDetails.docURL = undefined;
                        setFormData(formData_copy)
                        presentURL = undefined
                        }}>
                        Re-Select
                    </p>
                }
                
                {
                    fileSelected && presentURL == undefined && <p 
                    className="z-10 absolute left-[calc(50%-38px)] px-4 py-2 bg-white rounded-md top-10 text-sm mb-4 underline text-indigo-600 cursor-pointer" 
                    onClick={async ()=>{
                        if(uploading) return;
                        await setDocURL()
                    }}>
                        {`${uploading? 'Uploading....' : 'Upload'}`}
                    </p>
                }

                {
                    fileSelected && preview &&
                    <div className='relative flex flex-col items-center w-full h-full'>
                        {preview && <iframe src={`${preview}#toolbar=0`} className='w-[90%] h-[100%] mt-[40px]'/>}
                    </div>
                }

                {/* // */}
        
            </div>}

            <div className="my-4">
                <Button text='Save Details' onClick={()=>handleIndividualTicketSave(addTicketVariables.toSet, addTicketVariables.itemIndex)} />
            </div>

            <div className='absolute z-[11] right-2.5 top-2 cursor-pointer'>
                <CloseButton onClick={()=>setShowModal(false)} />
            </div>
        </div>
    )
}

function AddScannedTicket(
    {   
        scannedData,
        setEntryMode,
        setShowModal, 
        handleBillUpload, 
        addTicketVariables, 
        handleFieldValueChange,
        expenseCategories,
        handleIndividualTicketSave,
        minDaysBeforeBooking,
        formData,
        uploadFileToAzure,
        setFormData,
        itinerary,
        scanComplete,
        showTicketModal,
        setShowTicketModal,
        scanningInProgress,
        }){
    
     if(scanComplete && scannedData==null){
        alert('OCR Scan failed. Please upload manually')
        setEntryMode('manual')
        return;
     }

     console.log(addTicketVariables, 'addTicketVariables')
     let presentURL = formData.itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex].bookingDetails.docURL??undefined;
       
    const [selectedFile, setSelectedFile] = useState(presentURL)
    const [fileSelected, setFileSelected] = useState(presentURL!=undefined && presentURL!=null ? true : false)
    const [preview, setPreview] = useState(presentURL)
    const [uploading, setUploading] = useState(false)

    useEffect(()=>{
        console.log(preview)
    }, [preview])

    let firstTime = true;

    async function setDocURL(){
        if(firstTime) {firstTime = false; return;}
        setUploading(true)
        const res = await uploadFileToAzure(selectedFile)
        setUploading(false)

        if(res.success){
            //upload file to azure and store the url in bookingDetails
            const formData_copy = JSON.parse(JSON.stringify(formData));
            formData_copy.itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex].bookingDetails.docURL = `https://blobstorage318.blob.core.windows.net/images/images/${selectedFile.name}`;
            setFormData(formData_copy)
            setPreview(`https://blobstorage318.blob.core.windows.net/images/images/${selectedFile.name}`)
            presentURL = `https://blobstorage318.blob.core.windows.net/images/images/${selectedFile.name}`;
        }
        else{
            alert('Something went wrong while uploading file. Please try again after some time.')
            console.error(res, selectedFile)
            setSelectedFile(null);
            setFileSelected(false);
            setPreview(null);
        }
    }

     return(<>
        {!scanComplete && <div className="h-full flex flex-1 flex-col items-center justify-center overflow-y-scroll no-scroll">
                    
            {!fileSelected && <Upload selectedFile={selectedFile} 
                    setSelectedFile={setSelectedFile} 
                    fileSelected={fileSelected} 
                    setFileSelected={setFileSelected}  />}
        
            {fileSelected && 
                <div className='relative flex flex-col items-center w-full h-full'>
                    {preview && <iframe src={`${preview}#toolbar=0`} className='w-[90%] h-[100%] mt-[40px]'/>}
                </div>
            }
        
            {fileSelected && <p className="z-10 absolute left-[calc(50%-38px)] px-4 py-2 bg-white rounded-md top-0 text-sm mb-4 underline text-indigo-600 cursor-pointer border" 
                 onClick={()=>{
                    setPreview(null); 
                    setFileSelected(false); 
                    setSelectedFile(null)
                    setPreview(null)

                    const formData_copy = JSON.parse(JSON.stringify(formData));
                    formData_copy.itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex].bookingDetails.docURL = undefined;
                    setFormData(formData_copy)
                    presentURL = undefined
                    }}>
                Re-Upload
            </p>}

            {
                    fileSelected && presentURL == undefined && <p 
                    className="z-10 absolute left-[calc(50%-38px)] px-4 py-2 bg-white rounded-md top-10 text-sm mb-4 underline text-indigo-600 cursor-pointer" 
                    onClick={async ()=>{
                        if(uploading) return;
                        await setDocURL()
                    }}>
                        {`${uploading? 'Uploading....' : 'Upload'}`}
                    </p>
                }
        
            {preview && <div onClick={()=>handleBillUpload(preview)} className="absolute left-[calc(50%-57px)] bottom-10 flex gap-2 items-center border border-gray-800 bg-gray-100 px-6 py-2 rounded-md text-neutral-700 cursor-pointer">
                <p>Scan</p>
                <img src={scanner_icon} className="w-6 h-6" />
            </div>}
        
            {scanningInProgress && <div className='fixed z-[101] flex justify-center items-center top-0 left-0 w-[100%] h-[100%] bg-greay-100/60'>
                    <Error message={null} />
                </div>}
        
            <div className="absolute right-2 top-2">
                <CloseButton onClick={()=>setShowTicketModal(false)} />
            </div>
        
            </div>}
           {scanComplete && <div className=" m-4 p-4 flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 overflow-y-scroll scroll">
            {console.log(expenseCategories, addTicketVariables)}
            {expenseCategories[addTicketVariables.transportType.toLowerCase()]?.length>0 && expenseCategories[addTicketVariables.transportType.toLowerCase()].map((field,index)=>{

                switch(field.type){
                    case 'text' : return(  
                                    <div className='' key={index}>
                                        <Input 
                                            title={field.name} 
                                            value={field.toSet == field.id ? itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex][field.toSet] : itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex][field.toSet].billDetails[field.id]} 
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
                                        min={getDateXDaysAway(Number(minDaysBeforeBooking))}
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
                                onTimeChange={(e)=>handleFieldValueChange(field.toSet, field.id, e)} />
                        </div>)

                    case 'amount' : return(  
                        <div className='' key={index}>

                            <div className="relative min-w-[200px] w-full md:w-fit max-w-[403px] h-[73px] flex-col justify-start items-start gap-2 inline-flex">
                                {/* title */}
                                <div className="text-zinc-600 text-sm font-cabin">{field.name}</div>

                                {/* input */}
                                <div className="w-full h-full bg-white items-center flex">
                                    <div className="text-neutral-700 w-full  h-full text-sm font-normal font-cabin flex">
                                        <input 
                                            type='number' 
                                            className="w-full h-full decoration:none px-6 py-2 border rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 "
                                            name={field.name}
                                            value={itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex][field.toSet].billDetails[field.id]} 
                                            onChange={(e)=>handleFieldValueChange(field.toSet, field.id, e)} />
                                    </div>
                                </div>

                                {field.id=='totalAmount' && <p className="absolute top-[45px] left-6 text-xs text-yellow-600">{itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex].bkd_violations.amount}</p>}
                            </div>
                        </div>)
                }
            })}
            
            {<div className="relative h-fit flex-1 flex-col items-center justify-center">
                <p className="py-2 text-neutral-700 font-cabin">Upload Ticket</p>

                {!fileSelected && <Upload selectedFile={selectedFile} 
                    setSelectedFile={setSelectedFile} 
                    fileSelected={fileSelected} 
                    setFileSelected={setFileSelected}  />}


                {
                    fileSelected && <p className="z-10 absolute left-[calc(50%-38px)] px-4 py-2 bg-white rounded-md top-0 text-sm mb-4 underline text-indigo-600 cursor-pointer" 
                    onClick={()=>{
                        setPreview(null); 
                        setFileSelected(false); 
                        setSelectedFile(null)
                        setPreview(null)

                        const formData_copy = JSON.parse(JSON.stringify(formData));
                        formData_copy.itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex].bookingDetails.docURL = undefined;
                        setFormData(formData_copy)
                        presentURL = undefined
                        }}>
                        Re-Select
                    </p>
                }
                
                {
                    fileSelected && presentURL == undefined && <p 
                    className="z-10 absolute left-[calc(50%-38px)] px-4 py-2 bg-white rounded-md top-10 text-sm mb-4 underline text-indigo-600 cursor-pointer" 
                    onClick={async ()=>{
                        if(uploading) return;
                        await setDocURL()
                    }}>
                        {`${uploading? 'Uploading....' : 'Upload'}`}
                    </p>
                }

                {
                    fileSelected && preview &&
                    <div className='relative flex flex-col items-center w-full h-full'>
                        {preview && <iframe src={`${preview}#toolbar=0`} className='w-[90%] h-[100%] mt-[40px]'/>}
                    </div>
                }

            </div>}

            <div className="my-4">
                <Button text='Save Details' onClick={()=>handleIndividualTicketSave(addTicketVariables.toSet, addTicketVariables.itemIndex)} />
            </div>

            <div className='absolute z-[11] right-2.5 top-2 cursor-pointer'>
                <CloseButton onClick={()=>setShowModal(false)} />
            </div>
        </div>}
     </>
    )
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

function getDateXDaysAway(days) {
    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + days);
  
    const year = futureDate.getFullYear();
    const month = String(futureDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(futureDate.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
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

function getStatusClass(status){
    switch(status){
      case "approved":
        case "completed":
        return 'bg-green-100 text-green-200';
      case "rejected":
      case "cancelled":  
      case "paid and cancelled":  
        return 'bg-red-100 text-red-900';
      case "pending settlement":
      case "pending approval": 
      case "pending": 
      case "transit":
        return 'bg-yellow-100 text-yellow-200';
      default:
        return " ";  
    }
  }


  