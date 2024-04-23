import Icon from "../../components/common/Icon"
import leftArrow_icon from '../../assets/arrow-left.svg'
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../../components/common/Button"
import { updateTravelRequest_API, policyValidation_API } from "../../utils/api"
import Cities from "../itineraryLegacy/Cities"
import ModeOfTransit from "../itineraryLegacy/ModeOfTransit"
import Hotels from "../itineraryLegacy/Hotels"
import UploadDocuments from "./UploadDocuments"
import AddMore from "../../components/common/AddMore"
import Error from "../../components/common/Error"
import TopBar from "./topBar"
import Cabs from "./Cab"
import Flight from "./Flight"
import { dummyCabs, dummyFlight } from "../../data/dummy"
import Train from "./Train"
import Bus from "./Bus"
import CarRental from "./CarRental"
import PersonalVehicle from "./PersonalVehicle"
import Hotel from "./Hotel"

const dummyItinerary = {
    from:null,
    to:null,
    departure: {
      from: null,
      to: null,
      date: null,
      time: null,
      bkd_from: null,
      bkd_to: null,
      bkd_date: null,
      bkd_time: null,
      modified: false,
      isCancelled: false,
      cancellationDate: null,
      cancellationReason: null,
      status:'draft',
      bookingDetails:{
        docURL: null,
        docType: null,
        billDetails: {}, 
      }
    }, 
    return:{
      from: null,
      to: null,
      date: null,
      time: null,
      bkd_from: null,
      bkd_to: null,
      bkd_date: null,
      bkd_time: null,
      modified: false,
      isCancelled: false,
      cancellationDate: null,
      cancellationReason: null,
      status:'draft',
      bookingDetails:{
        docURL: null,
        docType: null,
        billDetails: {}, 
      }
      },
    hotels:[],
    cabs:[],
    modeOfTransit:null,
    travelClass:null,
    needsVisa:false,
    transfers:{
      needsDeparturePickup:false,
      needsDepartureDrop:false,
      needsReturnPickup:false,
      needsReturnDrop:false,
    },
    needsHotel:false,
    needsCab:false,
    modified:false, 
    isCancelled:false, 
    cancellationDate:null, 
    cancellationReason:null,
    status:'draft',
  }

export default function({formData, setFormData, nextPage, lastPage, onBoardingData}){

    const [networkState, setNetworkState] = useState({isLoading:false, loadingErrMsg:null, isUploading:null})
    const [errors, setErrors] = useState({flightsError:[], cabsError:[], carRentalsError:[], hotelsError:[], busesError:[], trainsError:[], modeOfTransitError:null, travelClassError:null})
    const [activeTab, setActiveTab] = useState('flight')
    const navigate = useNavigate()
    
    // const modeOfTransitList = onBoardingData?.modeOfTransitOptions
    // const travelClassOptions = onBoardingData?.travelClassOptions
    // const allowedCabClass = onBoardingData?.cabClassOptions 
    // const allowedHotelClass = onBoardingData?.hotelClassOptions
    
    const min = onBoardingData?.minDaysBeforeTravelBooking??0

    const handleBackButton = ()=>{
        navigate(lastPage)
    }

    const handleContinueButton = async ()=>{
        console.log(formData)


        let allowSubmit = false
        //check required fields
        async function checkRequiredFields(){
            return new Promise((resolve, reject)=>{
                
                allowSubmit = true
                
                const errors_copy = JSON.parse(JSON.stringify(errors))

                formData.itinerary.cabs.forEach(cab=>{
                    let dateError = {set:false, message:'Select date for cab'}
                    let classError = {set:false, message:'Select cab class'}

                    if(cab.date == null) {
                        dateError.set = true
                        allowSubmit = false
                    }
                        
                    errors_copy.cabsError.push({dateError, classError})
                })

                formData.itinerary.flights.forEach(flight=>{
                    console.log('looking for flight errors...')
                    let fromError = {set:false, message:'Enter departure city'}
                    let toError = {set:false, message:'Enter destination city'}
                    let departureDateError = {set:false, message:'Enter departure date'}
                    let returnDateError = {set:false, message:'Enter return date'}

                    if(flight.date == null) {
                        departureDateError.set = true
                        allowSubmit = false
                    }

                    if(flight.from == null){
                        fromError.set = true 
                        allowSubmit = false
                    }

                    if(flight.to == null){
                        toError.set = true 
                        allowSubmit = false
                    }
    
                    errors_copy.flightsError.push({fromError, toError, departureDateError, returnDateError})
                })

                formData.itinerary.trains.forEach(train=>{
                    let fromError = {set:false, message:'Enter departure city'}
                    let toError = {set:false, message:'Enter destination city'}
                    let departureDateError = {set:false, message:'Enter departure date'}
                    let returnDateError = {set:false, message:'Enter return date'}

                    if(train.date == null) {
                        departureDateError.set = true
                        allowSubmit = false
                    }

                    if(train.from == null){
                        fromError.set = true 
                        allowSubmit = false
                    }

                    if(train.to == null){
                        toError.set = true 
                        allowSubmit = false
                    }
    
                    errors_copy.trainsError.push({fromError, toError, departureDateError, returnDateError})
                })

                formData.itinerary.buses.forEach(bus=>{
                    let fromError = {set:false, message:'Enter departure city'}
                    let toError = {set:false, message:'Enter destination city'}
                    let departureDateError = {set:false, message:'Enter departure date'}
                    let returnDateError = {set:false, message:'Enter return date'}

                    if(bus.date == null) {
                        departureDateError.set = true
                        allowSubmit = false
                    }

                    if(bus.from == null){
                        fromError.set = true 
                        allowSubmit = false
                    }

                    if(bus.to == null){
                        toError.set = true 
                        allowSubmit = false
                    }
    
                    errors_copy.busesError.push({fromError, toError, departureDateError, returnDateError})
                })

                formData.itinerary.carRentals.forEach(cab=>{
                    let dateError = {set:false, message:'Select date for cab'}
                    let classError = {set:false, message:'Select cab class'}

                    if(cab.date == null) {
                        dateError.set = true
                        allowSubmit = false
                    }
                        
                    errors_copy.carRentalsError.push({dateError, classError})
                })

                formData.itinerary.hotels.forEach(hotel=>{
                    let checkInDateError = {set:false, message:'Enter Check-in date'}
                    let checkOutDateError = {set:false, message:'Enter Check-out date'}
                    let locationError = {set:false, message:'Location Error'}
                    let classError = {set:false, message:'Select hotel class'}

                    if(hotel.checkIn == null) {
                        checkInDateError.set = true
                        allowSubmit = false
                    }

                    if(hotel.checkOut == null) {
                        checkOutDateError.set = true
                        allowSubmit = false
                    }

                    else if(hotel.checkOut < hotel.checkIn){
                        checkOutDateError.set = true
                        checkOutDateError.message = 'Check-out date cannot be before check-in date'
                        allowSubmit = false
                    }

                    if(hotel.class == null){
                        classError.set = true
                       // allowSubmit = false
                    }

                    if(hotel.location == null || hotel.location == undefined){
                        locationError.set = true 
                        allowSubmit = false
                    }
                    
                    errors_copy.hotelsError.push({checkInDateError, checkOutDateError, classError, locationError})
                })

                setErrors(errors_copy)
                resolve()
            })
        }

        await checkRequiredFields()

        console.log(allowSubmit, 'allowSubmit...')
        
        if(allowSubmit){
            //check if level3 allocations are there
            if(onBoardingData.travelAllocationFlags.level3){
                navigate(nextPage)
            }
            else{
                navigate(nextPage)
            }
        }   
    }

    return(<>
        {networkState.isLoading && <Error message={networkState.loadingErrMsg} /> }
        {!networkState.isLoading &&
        <div className="w-full h-full relative  md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none bg-slate-100">
            {/* app icon */}
            <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
                <Icon/>
            </div>

            {/* Rest of the section */}
            <div className="w-full h-full mt-4 p-4 sm:p-10 bg-white">

                {/* back link */}
                <div className='flex items-center gap-4 cursor-pointer' onClick={handleBackButton}>
                    <img className='w-[24px] h-[24px]' src={leftArrow_icon} />
                    <p className='text-neutral-700 text-md font-semibold font-cabin'>Add travel details</p>
                </div>

                <div className='sticky top-0 z-[1000] bg-gray-100 rounded'>
                    <TopBar activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                
                {activeTab=='cab' && <Cabs min={min} cabsError={errors.cabsError} formData={formData} setFormData={setFormData}  />}
                {activeTab=='flight' && <Flight min={min} flightsError={errors.flightsError} formData={formData} setFormData={setFormData} /> }
                {activeTab=='train' && <Train min={min} flightsError={errors.trainsError} formData={formData} setFormData={setFormData} /> }
                {activeTab=='bus' && <Bus min={min} flightsError={errors.busessError} formData={formData} setFormData={setFormData} /> }
                {activeTab=='carRental' && <CarRental min={min} carRentalsError={errors.carRentalsError} formData={formData} setFormData={setFormData} /> }
                {activeTab=='personalVehicle' && <PersonalVehicle min={min} personalVehiclesError={errors.personalVehiclesError} formData={formData} setFormData={setFormData} /> }
                {activeTab=='hotel' && <Hotel min={min} hotelsError={errors.hotelsError} formData={formData} setFormData={setFormData} /> }
                
                <hr className="text-indigo-600 my-4"/>

                <div className="flex flex-reverse justify-between items-center mt-10">
                    <Button variant='fit' text='Continue' onClick={handleContinueButton} />
                </div>
            </div>

        </div>}

    </>)
}

