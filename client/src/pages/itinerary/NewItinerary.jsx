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
    const [errors, setErrors] = useState({flightsError:[], cabsError:[], carRentalsError:[], hotelsError:[], busessError:[], trainsError:[], modeOfTransitError:null, travelClassError:null})
    const [activeTab, setActiveTab] = useState('flight')
    const navigate = useNavigate()
    
    // const modeOfTransitList = onBoardingData?.modeOfTransitOptions
    // const travelClassOptions = onBoardingData?.travelClassOptions
    // const allowedCabClass = onBoardingData?.cabClassOptions 
    // const allowedHotelClass = onBoardingData?.hotelClassOptions
    
    const handleBackButton = ()=>{
        navigate(lastPage)
    }

    const handleContinueButton = async ()=>{
        console.log(formData)

        let allowSubmit = true
        //check required fields
        
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
        <div className="w-full h-full relative bg-white md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none">
            {/* app icon */}
            <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
                <Icon/>
            </div>

            {/* Rest of the section */}
            <div className="w-full h-full mt-10 p-4 sm:p-10">

                {/* back link */}
                <div className='flex items-center gap-4 cursor-pointer' onClick={handleBackButton}>
                    <img className='w-[24px] h-[24px]' src={leftArrow_icon} />
                    <p className='text-neutral-700 text-md font-semibold font-cabin'>Add travel details</p>
                </div>

                <TopBar activeTab={activeTab} setActiveTab={setActiveTab} />
                
                {activeTab=='cab' && <Cabs cabsError={errors.cabsError} formData={formData} setFormData={setFormData}  />}
                {activeTab=='flight' && <Flight flightsError={errors.flightsError} formData={formData} setFormData={setFormData} /> }
                {activeTab=='train' && <Train flightsError={errors.trainsError} formData={formData} setFormData={setFormData} /> }
                {activeTab=='bus' && <Bus flightsError={errors.busessError} formData={formData} setFormData={setFormData} /> }
                {activeTab=='carRental' && <CarRental carRentalsError={errors.carRentalsError} formData={formData} setFormData={setFormData} /> }
                {activeTab=='personalVehicle' && <PersonalVehicle personalVehiclesError={errors.personalVehiclesError} formData={formData} setFormData={setFormData} /> }
                {activeTab=='hotel' && <Hotel hotelsError={errors.hotelsError} formData={formData} setFormData={setFormData} /> }
                
                <hr className="text-indigo-600 my-4"/>

                <div className="flex flex-reverse justify-between items-center mt-10">
                    <Button variant='fit' text='Continue' onClick={handleContinueButton} />
                </div>
            </div>

        </div>}

    </>)
}

