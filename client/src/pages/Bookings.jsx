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
import TimePicker from "../components/common/TimePicker";
import {getTravelRequest_API, getTravelBookingOnboardingData_API, updateTravelBookings_API, uploadBill_API } from "../utils/api";
import { cab_icon, bus_icon, train_icon, biderectional_arrows_icon as double_arrow, calender_icon, clock_icon, airplane_icon, location_icon } from "../assets/icon";
import CloseButton from "../components/common/closeButton";
import Error from "../components/common/Error";
import Prompt from "../components/common/Prompt";
import { close_gray_icon, material_flight_black_icon, material_train_black_icon, material_bus_black_icon, material_cab_black_icon, material_car_rental_black_icon, material_hotel_black_icon, material_personal_black_icon, add_icon} from "../assets/icon";
import { BlobServiceClient } from "@azure/storage-blob";

const az_blob_container = import.meta.env.VITE_AZURE_BLOB_CONTAINER

const storage_sas_token = import.meta.env.VITE_AZURE_BLOB_SAS_TOKEN
const storage_account = import.meta.env.VITE_AZURE_BLOB_ACCOUNT
const blob_endpoint = `https://${storage_account}.blob.core.windows.net/?${storage_sas_token}`



const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL


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
                {name: 'Return Date', toSet:'bkd_returnDate', id:'bkd_returnDate', type:'date'}, 
                {name:'Time',  toSet:'bkd_time',  id:'bkd_time', type:'time'},
                {name:'Return Time',  toSet:'bkd_returnTime',  id:'bkd_returnTime', type:'time'},
                {name:'Pickup Address', toSet:'bkd_pickupAddress',  id:'bkd_pickupAddress', type:'text'}, 
                {name:'Drop Address', type:'text', toSet:'bkd_dropAddress', id:'bkd_dropAddress'}, 
                {name:'Tax Amount', type:'amount', toSet:'bookingDetails', id:'taxAmount'}, 
                {name:'Total Amount', type:'amount', toSet:'bookingDetails', id:'totalAmount'}],

    'carRentals' : [{name:'Vendor Name', id:'vendorName', toSet:'bookingDetails', type:'text'},
                {name:'Booking Date',  toSet:'bkd_date',  id:'bkd_date', type:'date'},
                {name: 'Return Date', toSet:'bkd_returnDate', id:'bkd_returnDate', type:'date'}, 
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
                {name:'Check-In Time',  toSet:'bkd_checkInTime',  id:'bkd_checkInTime', type:'time'}, 
                {name:'Check-Out Time',  toSet:'bkd_checkOutTime',  id:'bkd_checkOutTime', type:'time'},
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
            const res = await getTravelRequest_API({travelRequestId})
            
            if(res.err){
                //setLoadingErrMsg(res.err)
                window.parent.postMessage({message:"cash message posted" , 
                popupMsgData: { showPopup:true, message:res.err, iconCode: "101" }}, DASHBOARD_URL);

                return;
            }

            setFormData(res.data.travelRequest)

            const tenantId = res.data.travelRequest.tenantId
            const travelType = res.data.travelRequest.travelType

            console.log(tenantId)

            const employeeId = res.data?.travelRequest?.createdFor?.empId??res.data?.travelRequest?.createdBy?.empId
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
            let goAhead = true;

            if(_toSet == 'flights' && e.target.value > (onBoardingData?.policies?.['Flight']?.limit??99999999) && onBoardingData?.policies?.['Flight']?.limit != 0){
                console.log('violation occured in flight ticket amount')
                formData_copy.itinerary[_toSet][itemIndex].bkd_violations.amount = 'Allowed flight ticket limit exceeded'
                goAhead=false;
            } else if(goAhead)  {formData_copy.itinerary[_toSet][itemIndex].bkd_violations.amount = ''; goAhead=false}
                
            // else formData_copy.itinerary[_toSet][itemIndex].bkd_violations.amount = '';

            if(_toSet == 'trains' && e.target.value > (onBoardingData?.policies?.['Train']?.limit??99999999)){
                formData_copy.itinerary[_toSet][itemIndex].bkd_violations.amount = 'Allowed Train ticket limit exceeded'
                goAhead=false;
            }else if(goAhead) formData_copy.itinerary[_toSet][itemIndex].bkd_violations.amount = '';

            if(_toSet == 'cabs' && e.target.value > (onBoardingData?.policies?.['Cab']?.limit??99999999)){
                formData_copy.itinerary[_toSet][itemIndex].bkd_violations.amount = 'Allowed Cab booking limit exceeded'
                goAhead=false;
            }else if(goAhead) {formData_copy.itinerary[_toSet][itemIndex].bkd_violations.amount = ''; goAhead=false}

            // if(_toSet == 'buses' && e.target.value > (onBoardingData?.policies?.['Cab Rental']?.limit??99999999))
            // formData_copy.itinerary[_toSet][itemIndex].bkd_violations.amount = 'Allowed limit exceeded'

            if(_toSet == 'cabRentals' && e.target.value > (onBoardingData?.policies?.['Cab Rental']?.limit??99999999)){
                formData_copy.itinerary[_toSet][itemIndex].bkd_violations.amount = 'Allowed Cab Rental booking limit exceeded'
                goAhead=false;
            }else if(goAhead) {formData_copy.itinerary[_toSet][itemIndex].bkd_violations.amount = ''; goAhead=false}
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
    const formData_copy = JSON.parse(JSON.stringify(formData))
    formData_copy.itinerary[toSet].forEach( (item,index)=>{
        if(index == itemIndex){
            //check if all required fields are filled
            switch(toSet){
                case 'flights': {
                    if(item.bkd_from && item.bkd_to && item.bkd_date && item.bkd_time && item.bookingDetails.billDetails.vendorName && item.bookingDetails.billDetails.taxAmount && item.bookingDetails.billDetails.totalAmount){
                        formData_copy.itinerary[toSet][index].status = 'booked';
                    }
                    return;
                }
                case 'buses': {
                    if(item.bkd_from && item.bkd_to && item.bkd_date && item.bkd_time && item.bookingDetails.billDetails.vendorName &&  item.bookingDetails.billDetails.taxAmount && item.bookingDetails.billDetails.totalAmount){
                        formData_copy.itinerary[toSet][index].status = 'booked';
                    }
                    return;
                }
                case 'trains': {
                    if(item.bkd_from && item.bkd_to && item.bkd_date && item.bkd_time && item.bookingDetails.billDetails.vendorName && item.bookingDetails.billDetails.taxAmount && item.bookingDetails.billDetails.totalAmount){
                        formData_copy.itinerary[toSet][index].status = 'booked';
                    }
                    return;
                }
                case 'cabs': {
                    if(item.bkd_pickupAddress && item.bkd_dropAddress && item.bkd_date && item.bkd_time && item.bookingDetails.billDetails.vendorName && item.bookingDetails.billDetails.taxAmount && item.bookingDetails.billDetails.totalAmount){
                        if(item.isFullDayCab){
                            if(item.returnDate) formData_copy.itinerary[toSet][index].status = 'booked';
                        }else{
                            formData_copy.itinerary[toSet][index].status = 'booked';
                        }
                    }
                    return;
                }
                case 'carRentals': {
                    if(item.bkd_pickupAddress && item.bkd_dropAddress && item.bkd_date && item.bkd_time && item.bookingDetails.billDetails.vendorName && item.bookingDetails.billDetails.taxAmount && item.bookingDetails.billDetails.totalAmount){
                        if(item.isFullDayCab){
                            if(item.returnDate) formData_copy.itinerary[toSet][index].status = 'booked';
                        }else{
                            formData_copy.itinerary[toSet][index].status = 'booked';
                        }
                    }
                    return;
                }
                case 'hotels':{
                    if(item.bkd_location && item.bkd_checkIn && item.bkd_checkOut && item.bkd_checkInTime && item.bkd_checkOutTime  && item.bookingDetails.billDetails.vendorName && item.bookingDetails.billDetails.taxAmount && item.bookingDetails.billDetails.totalAmount){
                        formData_copy.itinerary[toSet][index].status = 'booked';
                    }
                }

            }
        }
    })

    setFormData(formData_copy)

    const data = {itinerary:formData_copy.itinerary, travelRequestId:formData.travelRequestId, submitted:false}
    const res = await updateTravelBookings_API(data)
    
    setShowTicketModal(false)
    console.log(res.data)

    //referesh page
    //navigate(`/bookings/travel/${formData.travelRequestId}`)

    // const endpoint = import.meta.env.VITE_CASH_URL
    // window.location.href = `${endpoint}/bookings/travel/${formData.travelRequestId}`
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
            
            if(res.err || !res.data.response?.success){
                console.log('Error in Scanning bill')
                setScanningInProgress(false)
                //alert('Scanning failed. Please upload ticket manually')
                window.parent.postMessage({message:"cash message posted" , 
                popupMsgData: { showPopup:true, message:"Scanning failed. Please upload ticket manually", iconCode: "102" }}, DASHBOARD_URL);

                setEntryMode('manual')
                setScanComplete(false)
                return
            }
    
            console.log(res.data, 'scanned response')
            setScannedData(res.data.response.data)
            addTicketVariables.itemIndex
    
            console.log(`${res.data.response.data}, category:${categoryToScan}, itineraryIndex:${addTicketVariables.itemIndex}`)
    
            if(res.data.response.data != null){
                //set form data to received fields
                const formData_copy = JSON.parse(JSON.stringify(formData))
                const itineraryItem = formData_copy.itinerary[categoryToScan][addTicketVariables.itemIndex]
                console.log(itineraryItem)
                const newData = res.data.response.data
                
                const newDataKeys = Object.keys(newData);

                for(let i=0; i<newDataKeys.length; i++){
                    if(newData[newDataKeys[i]] == null){
                        window.parent.postMessage({message:"cash message posted" , 
                        popupMsgData: { showPopup:true, message:"Values not picked correctly. Please enter them manually", iconCode: "102" }}, DASHBOARD_URL);
                        break;
                    }
                }
                
                if(categoryToScan == 'flights'){
                    itineraryItem.bkd_from = newData.from
                    itineraryItem.bkd_time = newData.time
                    itineraryItem.bkd_to = newData.to
                    itineraryItem.bkd_date = newData.date
                    itineraryItem.bookingDetails.billDetails.vendorName =  newData.vendorName;
                    itineraryItem.bookingDetails = {...itineraryItem.bookingDetails, billDetails: {...itineraryItem.bookingDetails.billDetails, taxAmount: newData.taxAmount} }
                    itineraryItem.bookingDetails = {...itineraryItem.bookingDetails, billDetails: {...itineraryItem.bookingDetails.billDetails, totalAmount: newData.totalAmount}}
                    
                    console.log(newData.totalAmount, 'limit:', onBoardingData?.policies?.['Flight']?.limit)
                    if(newData.totalAmount!= null && newData.totalAmount>(onBoardingData?.policies?.['Flight']?.limit??99999999) && onBoardingData?.policies?.['Flight']?.limit != 0){
                        itineraryItem.bkd_violations.amount = `Allowed limit exceeded as per ${formData.tenantName??'your company'} policies for this employee`
                    }else itineraryItem.bkd_violations.amount = '';
                }
    
                if(categoryToScan == 'trains'){
                    console.log(itineraryItem.bookingDetails.billDetails.vendorName, newData, 'vendor name of trains..')
                    itineraryItem.bkd_from = newData.from
                    itineraryItem.bkd_time = newData.time
                    itineraryItem.bkd_to = newData.to
                    itineraryItem.bkd_date = newData.date
                    itineraryItem.bookingDetails.billDetails.vendorName =  newData.vendorName;
                    itineraryItem.bookingDetails = {...itineraryItem.bookingDetails, billDetails: {...itineraryItem.bookingDetails.billDetails, taxAmount: newData.taxAmount} }
                    itineraryItem.bookingDetails = {...itineraryItem.bookingDetails, billDetails: {...itineraryItem.bookingDetails.billDetails, totalAmount: newData.totalAmount}}

                    if(newData.totalAmount!= null && newData.totalAmount>(onBoardingData?.policies?.['Train']?.limit??99999999)){
                        itineraryItem.bkd_violations.amount = `Allowed limit exceeded as per ${formData.tenantName??'your company'} policies for this employee`
                    }else itineraryItem.bkd_violations.amount = '';
                }
    
                if(categoryToScan == 'Buses'){
                    itineraryItem.bkd_from = newData.from
                    itineraryItem.bkd_time = newData.time
                    itineraryItem.bkd_to = newData.to
                    itineraryItem.bkd_date = newData.date
                    itineraryItem.bookingDetails.billDetails.vendorName =  newData.vendorName;
                    itineraryItem.bookingDetails = {...itineraryItem.bookingDetails, billDetails: {...itineraryItem.bookingDetails.billDetails, taxAmount: newData.taxAmount} }
                    itineraryItem.bookingDetails = {...itineraryItem.bookingDetails, billDetails: {...itineraryItem.bookingDetails.billDetails, totalAmount: newData.totalAmount}}
                    
                    if(newData.totalAmount!= null && newData.totalAmount>(onBoardingData?.policies?.['Cab Rental']?.limit??99999999)){
                        itineraryItem.bkd_violations.amount = `Allowed limit exceeded as per ${formData.tenantName??'your company'} policies for this employee`
                    }else itineraryItem.bkd_violations.amount = '';
                }
    
                if(categoryToScan == 'cabs'){
                    itineraryItem.bkd_pickupAddress = newData.pickupAddress
                    itineraryItem.bkd_dropAddress = newData.dropAddress
                    itineraryItem.bkd_date = newData.date
                    itineraryItem.bkd_time = newData.time
                    itineraryItem.bookingDetails.billDetails.vendorName =  newData.vendorName;
                    itineraryItem.bookingDetails = {...itineraryItem.bookingDetails, billDetails: {...itineraryItem.bookingDetails.billDetails, taxAmount: newData.taxAmount} }
                    itineraryItem.bookingDetails = {...itineraryItem.bookingDetails, billDetails: {...itineraryItem.bookingDetails.billDetails, totalAmount: newData.totalAmount}}
                    
                    if(newData.totalAmount!= null && newData.totalAmount>(onBoardingData?.policies?.['Cab']?.limit??99999999)){
                        itineraryItem.bkd_violations.amount = `Allowed limit exceeded as per ${formData.tenantName??'your company'} policies for this employee`
                    }else itineraryItem.bkd_violations.amount = '';
                }
    
                if(categoryToScan == 'Car Rentals'){
                    if(newData.pickupAddress != null) itineraryItem.bkd_pickupAddress = newData.pickupAddress
                    if(newData.dropAddress != null) itineraryItem.bkd_dropAddress = newData.dropAddress
                    if(newData.date != null) itineraryItem.bkd_date = newData.date
                    if(newData.vendorName != null) itineraryItem.bookingDetails.billDetails.vendorName =  newData.vendorName;
                    if(newData.taxAmount != null) itineraryItem.bookingDetails = {...itineraryItem.bookingDetails, billDetails: {...itineraryItem.bookingDetails.billDetails, taxAmount: newData.taxAmount} }
                    if(newData.totalAmount != null) itineraryItem.bookingDetails = {...itineraryItem.bookingDetails, billDetails: {...itineraryItem.bookingDetails.billDetails, totalAmount: newData.totalAmount}}
                    
                    if(newData.totalAmount!= null && newData.totalAmount>(onBoardingData?.policies?.['Cab Rental']?.limit??99999999)){
                        itineraryItem.bkd_violations.amount = `Allowed limit exceeded as per ${formData.tenantName??'your company'} policies for this employee`
                    }else itineraryItem.bkd_violations.amount = '';
                }

                if(categoryToScan == 'hotels'){
                    itineraryItem.bkd_location = newData.location
                    itineraryItem.bkd_location = newData.location
                    itineraryItem.bkd_checkIn = newData.checkIn
                    itineraryItem.bkd_checkOut = newData.checkOut
                    itineraryItem.bkd_checkInTime = newData.checkInTime
                    itineraryItem.bkd_checkOutTime = newData.checkOutTime
                    itineraryItem.bookingDetails.billDetails.vendorName =  newData.vendorName;
                    itineraryItem.bookingDetails.billDetails.hotelName =  newData.hotelName;
                    itineraryItem.bookingDetails = {...itineraryItem.bookingDetails, billDetails: {...itineraryItem.bookingDetails.billDetails, taxAmount: newData.taxAmount} }
                    itineraryItem.bookingDetails = {...itineraryItem.bookingDetails, billDetails: {...itineraryItem.bookingDetails.billDetails, totalAmount: newData.totalAmount}}
                    
                    if(newData.totalAmount!= null && newData.totalAmount>(onBoardingData?.policies?.['Hotels']?.limit??99999999)){
                        itineraryItem.bkd_violations.amount = `Allowed limit exceeded as per ${formData.tenantName??'your company'} policies for this employee`
                    }else itineraryItem.bkd_violations.amount = '';
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
        
        const goAhead = true 
        //confirm('Please make sure you have uploaded the correct details. Click cancel to abort')

        console.log('go ahead', goAhead)    
        if(!goAhead) return 

        const data = {itinerary:formData.itinerary, travelRequestId:formData.travelRequestId, submitted:true}
        const res = await updateTravelBookings_API(data)
        

        if(res.err){
            console.log(res.err)
            //setPrompt({showPrompt:true, promptMsg:res.err??'Values were not filled correctly. Please resubmit after filling the form correctly'})
            
            window.parent.postMessage({message:"cash message posted" , 
            popupMsgData: { showPopup:true, message:"Values were not filled correctly. Please resubmit after filling the form correctly", iconCode: "102" }}, DASHBOARD_URL);
            return
        }

        //setPrompt({showPrompt:true, promptMsg: 'Trave Request Booked'})
        window.parent.postMessage({message:"cash message posted" , 
        popupMsgData: { showPopup:true, message:"Travel Request Booked", iconCode: "101" }}, DASHBOARD_URL);

        setTimeout(()=>{
            //window.location.href = `${DASHBOARD_URL}/${formData.tenantId}/${formData.createdBy.empId}/overview`
            //window.location.href = `${DASHBOARD_URL}/${formData.tenantId}/${formData.assignedTo.empId}/bookings`
            window.parent.postMessage('closeIframe', DASHBOARD_URL);
        }, 100)
        
    }

  return <>
        {(isLoading) && <Error message={loadingErrMsg}/>}
       
       {!isLoading && 
        <div className="w-full h-full relative  select-none">
        {/* app icon */}
        {/* <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
            <Icon/>
        </div> */}

        {/* Rest of the section */}
        <div className="w-full h-full p-10 font-cabin tracking-tight">
            <p className="text-2xl text-neutral-600 mb-5">{`${formData.tripPurpose} Trip`}</p>
            <div className='flex divide-x'>
                <div className='flex flex-col sm:flex-row gap-1 pr-1'>
                    <div className='flex-2'>
                        <div className="flex gap-2 font-cabin text-xs tracking-tight">
                            <p className="w-[100px] text-neutral-600">Raised By:</p>
                            <p className="text-neutral-700">{formData?.createdBy?.name}</p>
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
                
                <div className="flex flex-col px-4 gap-1">

                    <div className="flex gap-2 font-cabin text-xs tracking-tight">
                        <p className="w-[100px] text-neutral-600">Flight Preference:</p>
                        <p className="text-neutral-700">{'Window Seat |  Vegan Meals'}</p>
                    </div>

                    <div className="flex gap-2 font-cabin text-xs tracking-tight">
                        <p className="w-[100px] text-neutral-600">Hotel Preference:</p>
                        <p className="text-neutral-700">{'Double-Room |  Queen-Bed'}</p>
                    </div>

                    <div className="flex gap-2 font-cabin text-xs tracking-tight">
                        <p className="w-[100px] text-neutral-600">Train Preference:</p>
                        <p className="text-neutral-700">{'Lower Birth | Vegan Meals'}</p>
                    </div>

                </div>

            </div>
            

            <hr/>
            <div className='flex flex-col gap-4 lg:divide-x divide-y lg:flex-row'>
                <div className="flex-1 mt-5 flex flex-col gap-4">
                    {['flights', 'trains', 'buses', 'cabs', 'carRentals', 'personalVehicles', 'hotels'].map((itnItem, itnItemIndex) => {
                        if (formData.itinerary[itnItem].length > 0) {
                            return (
                                <div key={itnItemIndex} className='flex flex-col gap-4'>
                                    <p className="text-xl text-neutral-400">
                                        {`${titleCase(itnItem)} `}
                                    </p>

                                    {formData.itinerary[itnItem].filter(item=>['booked', 'pending booking'].includes(item.status)).map((item, itemIndex) => {
                                        if (['flights', 'trains', 'buses', 'personalVehicles'].includes(itnItem)) {
                                            return (
                                                <div key={itemIndex}>
                                                    <FlightCard onClick={() => handleAddTicket(itnItem, itemIndex)} status={item.status} from={item.from} to={item.to} date={isoString(item?.date)} time={item.time} returnDate={isoString(item.returnDate)} returnTime={item.returnTime} travelClass={item.travelClass} vendorName={item?.bookingDetails?.billDetails?.vendorName??undefined} taxAmount={item?.bookingDetails?.billDetails?.taxAmount??undefined} totalAmount={item?.bookingDetails?.billDetails?.totalAmount??undefined}  mode={titleCase(itnItem.slice(0, -1))} />
                                                </div>
                                            );
                                        } else if (itnItem === 'cabs') {
                                            return (
                                                <div key={itemIndex}>
                                                    <CabCard onClick={() => handleAddTicket(itnItem, itemIndex)} status={item.status} from={item.pickupAddress} to={item.dropAddress} date={isoString(item?.date)} returnDate={isoString(item.returnDate)} isFullDayCab={item.isFullDayCab} time={item.time} mode={itnItem == 'cabs'? 'Cab' : 'Rental Car'} travelClass={item.travelClass} vendorName={item?.bookingDetails?.billDetails?.vendorName??undefined} taxAmount={item?.bookingDetails?.billDetails?.taxAmount??undefined} totalAmount={item?.bookingDetails?.billDetails?.totalAmount??undefined} isTransfer={item.type !== 'regular'} />
                                                </div>
                                            );
                                        } else if (itnItem === 'carRentals') {
                                            return (
                                                <div key={itemIndex}>
                                                    <CabCard onClick={() => handleAddTicket(itnItem, itemIndex)} status={item.status} from={item.pickupAddress} to={item.dropAddress} date={isoString(item?.date)} returnDate={isoString(item.returnDate)} isRentalCab={true} isFullDayCab={item.isFullDayCab} time={item.time} mode={itnItem == 'cabs'? 'Cab' : 'Rental Car'} travelClass={item.travelClass} vendorName={item?.bookingDetails?.billDetails?.vendorName??undefined} taxAmount={item?.bookingDetails?.billDetails?.taxAmount??undefined} totalAmount={item?.bookingDetails?.billDetails?.totalAmount??undefined} isTransfer={item.type !== 'regular'} />
                                                </div>
                                            );
                                        }else if (itnItem === 'hotels') {
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

            <Prompt prompt={prompt} setPrompt={setPrompt} timeout={2700} />
        </div>

        {showTicketModal && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
            
            {entryMode!='ocr' && entryMode!='manual' && <div className="relative z-10 p-10 rounded bg-white h-fit">
                <p className="text text-neutral-700 text-lg font-cabin">
                    How would you like to upload
                </p>

                <div className='flex items-center gap-4 mt-10'>
                    <Button text='Upload Ticket' onClick={(e)=>{ setEntryMode('ocr')}}/>
                    <Button text='Enter Manually' onClick={(e)=>{ setEntryMode('manual')}}/>
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
        
        <Button text="test dashboard message" onClick={()=>{
            console.log("posting message to dashboard ...", JSON.stringify({message:"cash message posted" , 
                ocrMsgData: { showPopup:true, message:"ocrMsg", iconCode: "103", autoSkip:false }}), " posted to ", DASHBOARD_URL);
            window.parent.postMessage({message:"cash message posted" , 
            ocrMsgData: { showPopup:true, message:"ocrMsg", iconCode: "103", autoSkip:false }}, DASHBOARD_URL);
        }}>

        </Button>

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
        <div className='relative'>
            <div className="shadow-sm min-h-[60px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
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
            </div>

            <div className="absolute right-0 -top-[11px] right-[3px]">
                <div className={`flex text-center px-1 justify-center py-1 rounded-md text-xs truncate font-medium tracking-[0.03em] ${status=='booked'?  'bg-green-200 text-green-500' : 'bg-yellow-100 text-yellow-500'}`}>
                {status}
            </div>
        </div>
    </div>)
}

function CabCard({status, from, to, date, returnDate, time, isFullDayCab, taxAmount, totalAmount, vendorName, travelClass, onClick, isTransfer=false, mode='Cab'}){
    return(
        <div className='relative'>
            <div className="relative shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
                <div className='font-semibold text-base text-neutral-600'>
                    <img src={mode=='Cab'? material_cab_black_icon : material_car_rental_black_icon} className='w-4 h-4 md:w-6 md:h-6' />
                    {isFullDayCab && <p className="text-xs font-thin whitespace-nowrap">Full Day</p>}
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
                        {isFullDayCab && <div className="flex-1">
                            <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Return Date</p>
                            <div className="flex items-center gap-1">
                                <img src={calender_icon} className="w-4 h-4"/>
                                <p className="whitespace-wrap">{isoString(returnDate)??'not provided'}</p>
                            </div>
                        </div>}
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
            </div>
            
            <div className="absolute right-0 -top-[11px] right-[3px]">
                <div className={`flex text-center px-1 justify-center py-1 rounded-md text-xs truncate font-medium tracking-[0.03em] ${status=='booked'?  'bg-green-200 text-green-500' : 'bg-yellow-100 text-yellow-500'}`}>
                    {status}
                </div>
            </div>

    </div>)
}

function HotelCard({status, checkIn, checkOut, taxAmount, totalAmount, vendorName, hotelClass, onClick, location}){
    return(
        <div className='relative'>
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
            </div>

            <div className="absolute right-0 -top-[11px] right-[3px]">
                <div className={`flex text-center px-1 justify-center py-1 rounded-md text-xs truncate font-medium tracking-[0.03em] ${status=='booked'?  'bg-green-200 text-green-500' : 'bg-yellow-100 text-yellow-500'}`}>
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
        if(!presentURL){
            setDocURL();
        }
    }, [fileSelected, presentURL]);

    useEffect(()=>{
        //if itinerary fileds are empty set them them to travel request forms values
        const formData_copy = JSON.parse(JSON.stringify(formData));
        Object.keys(formData_copy.itinerary).forEach(key=>{
            if(key == 'flights' || key == 'buses' || key == 'trains' ){
                formData_copy.itinerary[key].forEach(item=>{
                    if(!item.bkd_from){
                        item.bkd_from = item.from;
                    }
                    if(!item.bkd_to){
                        item.bkd_to = item.to;
                    }
                    if(!item.bkd_date){
                        item.bkd_date = item.date;
                    }
                    if(!item.bkd_time){
                        item.bkd_time = '11:00'
                    } 
                })
            }

            if(key == 'cabs' || key == 'carRentals'){
                formData_copy.itinerary[key].forEach(item=>{
                    if(!item.bkd_pickupAddress){
                        item.bkd_pickupAddress = item.pickupAddress;
                    }
                    if(!item.bkd_dropAddress){
                        item.bkd_dropAddress = item.dropAddress;
                    }
                    if(!item.bkd_date){
                        item.bkd_date = item.date;
                    } 
                    if((item.isFullDayCab || item.isRentalCab) && !item.bkd_returnDate){
                        item.bkd_returnDate = item.returnDate;
                    }
                    if(!item.bkd_time){
                        item.bkd_time = '11:00'
                    } 
                })
            }

            if(key == 'hotels'){
                formData_copy.itinerary[key].forEach(item=>{
                    if(!item.bkd_location){
                        item.bkd_location = item.location;
                    }
                    if(!item.bkd_checkIn){
                        item.bkd_checkIn = item.checkIn;
                    }
                    if(!item.bkd_checkOut){
                        item.bkd_checkOut = item.checkOut;
                    }
                    if(!item.bkd_checkInTime){
                        item.bkd_checkInTime = '11:00'
                    } 
                    if(!item.bkd_checkOutTime){
                        item.bkd_checkOutTime = '11:00';
                    }
                })
            }
        });
        setFormData(formData_copy);
    },[]);

    let firstTime = true;

    async function setDocURL(){
        if(firstTime) {firstTime = false; return;}
        if(!selectedFile) return;
        setUploading(true)
        const res = await uploadFileToAzure(selectedFile)
        setUploading(false)

        if(res.success){
            //upload file to azure and store the url in bookingDetails
            const formData_copy = JSON.parse(JSON.stringify(formData));
            formData_copy.itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex].bookingDetails.docURL = `https://${storage_account}.blob.core.windows.net/${az_blob_container}/${selectedFile.name}`;
            setFormData(formData_copy)
            setPreview(`https://${storage_account}.blob.core.windows.net/${az_blob_container}/${selectedFile.name}`)
            presentURL = `https://${storage_account}.blob.core.windows.net/${az_blob_container}/${selectedFile.name}`;
        }
        else{
            //alert('Something went wrong while uploading file. Please try again after some time.')
            window.parent.postMessage({message:"cash message posted" , 
            popupMsgData: { showPopup:true, message:"Something went wrong while uploading file. Please try again after some time.", iconCode: "102" }}, DASHBOARD_URL);

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
                                            highlightIfNull = {true}
                                            title={field.name} 
                                            value={
                                                field.toSet == field.id ? itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex][field.toSet] ? itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex][field.toSet] : itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex][field.toSet.split('_')[1]]  : itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex][field.toSet].billDetails?.[field.id]} 
                                            onChange={(e)=>handleFieldValueChange(field.toSet, field.id, e)} />
                                    </div>)

                    case 'date' : return( (field.toSet != 'bkd_returnDate' || addTicketVariables.toSet != 'cabs' ||   itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex].isFullDayCab) &&
                        <div className='' key={index}>

                            <div className="min-w-[200px] w-full md:w-fit max-w-[403px] h-[73px] flex-col justify-start items-start gap-2 inline-flex">
                                {/* title */}
                                <div className="text-zinc-600 text-sm font-cabin">{field.name}</div>

                                {/* input */}
                                <div className="relative w-full h-full bg-white items-center flex">
                                    <div className="text-neutral-700 w-full  h-full text-sm font-normal font-cabin">
                                        <input 
                                        type='date' 
                                        // min={getDateXDaysAway(Number(minDaysBeforeBooking))}
                                        className="w-full h-full decoration:none px-6 py-2 border rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 "
                                        name={field.name} 
                                        value={itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex][field.toSet] ? formattedDate(itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex][field.toSet]) : formattedDate(itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex][field.toSet.split('_')[1]])}
                                        onChange={(e)=>handleFieldValueChange(field.toSet, field.id, e)} />
                                    </div>
                                </div>
                            </div>
                        </div>)

                    case 'time' : return(  
                        <div className='' key={index}>
                            <TimePicker 
                                // highlightIfNull = {true}
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
        //alert('OCR Scan failed. Please upload manually')
        window.parent.postMessage({message:"cash message posted" , 
        popupMsgData: { showPopup:true, message:"OCR Scan failed. Please enter the details manually", iconCode: "102" }}, DASHBOARD_URL);
        
        setEntryMode('manual')
        return;
     }

     console.log('from add scanned tickets');
     console.log(addTicketVariables, 'addTicketVariables')
     let presentURL = formData.itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex].bookingDetails.docURL??undefined;
       
    const [selectedFile, setSelectedFile] = useState(presentURL)
    const [fileSelected, setFileSelected] = useState(presentURL!=undefined && presentURL!=null ? true : false)
    const [preview, setPreview] = useState(presentURL)
    const [uploading, setUploading] = useState(false)
    const [scanCompleteModal, setScanCompleteModal] = useState(false);
    const [modalClosed, setModalClosed] = useState(false);

    useEffect(()=>{
        if(scanComplete && !modalClosed){
           // setScanCompleteModal(true);
            window.parent.postMessage({message:"cash message posted" , 
                ocrMsgData: { showPopup:true, message:"ocrMsg", iconCode: "103", autoSkip:false }}, DASHBOARD_URL);
        }
    })

     let firstTime  = true;
    useEffect(()=>{
        if(fileSelected && presentURL == undefined){
            setDocURL()
        }
    }, [fileSelected, presentURL])


    async function setDocURL(){
        setUploading(true)
        const res = await uploadFileToAzure(selectedFile)
        setUploading(false)

        if(res.success){
            //upload file to azure and store the url in bookingDetails
            const formData_copy = JSON.parse(JSON.stringify(formData));
            formData_copy.itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex].bookingDetails.docURL = `https://${storage_account}.blob.core.windows.net/${az_blob_container}/${selectedFile.name}`;
            setFormData(formData_copy)
            setPreview(`https://${storage_account}.blob.core.windows.net/${az_blob_container}/${selectedFile.name}`)
            presentURL = `https://${storage_account}.blob.core.windows.net/${az_blob_container}/${selectedFile.name}`;
        }
        else{
            //alert('Something went wrong while uploading file. Please try again after some time.')
            window.parent.postMessage({message:"cash message posted" , 
            popupMsgData: { showPopup:true, message:"Something went wrong while uploading file. Please try again after some time.", iconCode: "102" }}, DASHBOARD_URL);
            
            console.error(res, selectedFile)
            setSelectedFile(null);
            setFileSelected(false);
            presentURL = undefined;
            setPreview(null);
        }
    }

     return(<>
        {!scanComplete && <div className="h-full flex flex-1 flex-col items-center justify-center overflow-y-scroll no-scroll">
                    
            {!fileSelected && 
                    <div>
                        <Upload 
                                selectedFile={selectedFile} 
                                setSelectedFile={setSelectedFile} 
                                fileSelected={fileSelected} 
                                setFileSelected={setFileSelected}  />

                        {/* <label htmlFor="camera_input">Open Camera</label>      
                        <input name='camera_input' type="file" accept="image/*" capture="camera"/> */}
                    </div>
                    }
        
            {fileSelected && 
                <div className='relative flex flex-col items-center w-full h-full'>
                    {preview && <iframe src={`${preview}#toolbar=0`} className='w-[90%] h-[100%] mt-[40px]'/>}
                </div>
            }
        
            {/* {fileSelected && <div className="z-10 absolute left-[calc(50%-38px)] top-12 cursor-pointer" >
                <CloseButton 
                    onClick={()=>{
                        setPreview(null); 
                        setFileSelected(false); 
                        setSelectedFile(null)
                        setPreview(null)
    
                        const formData_copy = JSON.parse(JSON.stringify(formData));
                        formData_copy.itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex].bookingDetails.docURL = undefined;
                        setFormData(formData_copy)
                        presentURL = undefined
                        }} />
                <img src={close_gray_icon} className={`w-8 h-8 rounded-full bg-gray-100 p-1 hover:bg-gray-200 shadow-lg`} />
            </div>} */}

                {
                    fileSelected && presentURL == undefined && <p 
                    className="z-10 absolute left-[calc(50%-38px)] px-4 py-2 bg-white rounded-md top-10 text-sm mb-4 underline text-indigo-600 cursor-pointer" 
                    onClick={async ()=>{
                        if(uploading) return;
                        await setDocURL()
                    }}>
                        {`${uploading? 'Uploading file....' : 'Upload'}`}
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
            
            <Modal showModal={scanCompleteModal} setShowModal={setScanCompleteModal} >
                <div className="px-6 py-4">
                    <p className="font-cabin text-zinc-500 text-xl">Review Scanned Details</p>
                    <div className="mt-6 mb-6 text-normal text-neutral-800 font-cabin">
                        <p>We’ve scanned the bill and extracted its details. Please review the following information carefully before submission:</p>
                        <p className="mt-4">Verify that all the extracted values are accurate.</p>
                        <p>Enter any missing values or correct errors if necessary.</p>
                        <p className="mt-4">This step ensures that the information submitted is accurate. Once you’re satisfied with the details, click Submit to proceed.</p>
                    </div>
                    <Button text='OK' onClick={()=>{setScanCompleteModal(false); setModalClosed(true)}}/>
                </div>
            </Modal>

            {expenseCategories[addTicketVariables.transportType.toLowerCase()]?.length>0 && expenseCategories[addTicketVariables.transportType.toLowerCase()].map((field,index)=>{

                switch(field.type){
                    case 'text' : return(  
                                    <div className='' key={index}>
                                        <Input 
                                            title={field.name} 
                                            value={field.toSet == field.id ? itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex][field.toSet] : itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex][field.toSet].billDetails[field.id]} 
                                            //value={itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex][field.toSet]}
                                            onChange={(e)=>handleFieldValueChange(field.toSet, field.id, e)} />
                                    </div>)

                    // case 'date' : return(  
                    //     <div className='' key={index}>

                    //         <div className="min-w-[200px] w-full md:w-fit max-w-[403px] h-[73px] flex-col justify-start items-start gap-2 inline-flex">
                    //             {/* title */}
                    //             <div className="text-zinc-600 text-sm font-cabin">{field.name}</div>

                    //             {/* input */}
                    //             <div className="relative w-full h-full bg-white items-center flex">
                    //                 <div className="text-neutral-700 w-full  h-full text-sm font-normal font-cabin">
                    //                     <input 
                    //                     type='date' 
                    //                     min={getDateXDaysAway(Number(minDaysBeforeBooking))}
                    //                     className={`w-full h-full decoration:none px-6 py-2 border rounded-md border ${itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex][field.toSet]!=null ? 'border-neutral-300' : 'border-red-300'} focus-visible:outline-0 focus-visible:border-indigo-600 `}
                    //                     name={field.name} 
                    //                     value={itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex][field.toSet]}
                    //                     onChange={(e)=>handleFieldValueChange(field.toSet, field.id, e)} />
                    //                 </div>
                    //             </div>
                    //         </div>
                    //     </div>)

                        case 'date' : return( (field.toSet != 'bkd_returnDate' || addTicketVariables.toSet != 'cabs' ||   itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex].isFullDayCab) &&
                        <div className='' key={index}>

                            <div className="min-w-[200px] w-full md:w-fit max-w-[403px] h-[73px] flex-col justify-start items-start gap-2 inline-flex">
                                {/* title */}
                                <div className="text-zinc-600 text-sm font-cabin">{field.name}</div>

                                {/* input */}
                                <div className="relative w-full h-full bg-white items-center flex">
                                    <div className="text-neutral-700 w-full  h-full text-sm font-normal font-cabin">
                                        <input 
                                        type='date'
                                        highlightIfNull = {true} 
                                        // min={getDateXDaysAway(Number(minDaysBeforeBooking))}
                                        className={`w-full h-full decoration:none px-6 py-2 border rounded-md border ${itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex][field.toSet]!=null ? 'border-neutral-300' : 'border-red-300'} focus-visible:outline-0 focus-visible:border-indigo-600 `}
                                        name={field.name} 
                                        value={itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex][field.toSet] ? itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex][field.toSet] : itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex][field.toSet.split('_')[1]]}
                                        onChange={(e)=>handleFieldValueChange(field.toSet, field.id, e)} />
                                    </div>
                                </div>
                            </div>
                        </div>)

                    case 'time' : return(  
                        <div className='' key={index}>
                            <TimePicker 
                                //highlightIfNull = {true} 
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
                                            value={itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex][field.toSet].billDetails[field.id]} 
                                            onChange={(e)=>handleFieldValueChange(field.toSet, field.id, e)} />
                                    </div>
                                    {field.id=='totalAmount' && <p className="absolute top-[45px] left-6 text-xs text-yellow-600">{itinerary[addTicketVariables.toSet][addTicketVariables.itemIndex]?.bkd_violations?.amount}</p>}
                                </div>
                            </div>
                        </div>)
                }
            })}
            
            {<div className="relative h-fit flex-1 flex-col items-center justify-center">
                {/* <p className="py-2 text-neutral-700 font-cabin">Upload Ticket</p> */}

                {!fileSelected && <Upload selectedFile={selectedFile} 
                    setSelectedFile={setSelectedFile} 
                    fileSelected={fileSelected} 
                    setFileSelected={setFileSelected}  />}


                {/* {
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
                } */}
                
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

function formattedDate(date){
    const givenDate = new Date(date);
    const day = String(givenDate.getDate()).padStart(2,'0');
    const month = String(givenDate.getMonth()).padStart(2,'0');
    const year = givenDate.getFullYear();

    return `${year}-${month}-${day}`;
}

  function formattedTime(timeValue){
    try{
        // if(timeValue == null || timeValue == undefined) return timeValue
        // const hours = timeValue.split(':')[0]>=12? timeValue.split(':')[0]-12 : timeValue.split(':')[0]
        // const minutes = timeValue.split(':')[1]
        // const suffix = timeValue.split(':')[0]>=12? 'PM' : 'AM'

        // return `${hours}:${minutes} ${suffix}`

        return timeValue;
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