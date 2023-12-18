import Icon from "../../components/common/Icon"
import leftArrow_icon from '../../assets/arrow-left.svg'
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../../components/common/Button"
import { updateTravelRequest_API, policyValidation_API } from "../../utils/api"
import Cities from "./Cities"
import ModeOfTransit from "./ModeOfTransit"
import Hotels from "./Hotels"
import Cabs from "./Cabs"
import UploadDocuments from "./UploadDocuments"
import AddMore from "../../components/common/AddMore"
import Error from "../../components/common/Error"

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

export default function (props){

    //loader state
    const [isLoading, setIsLoading] = useState(false)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)

    //next and last pages
    const nextPage = props.nextPage
    const lastPage = props.lastPage

    //onboarding data
    const onBoardingData = props.onBoardingData
    const modeOfTransitList = onBoardingData?.modeOfTransitOptions
    const travelClassOptions = onBoardingData?.travelClassOptions
    const allowedCabClass = onBoardingData?.cabClassOptions 
    const allowedHotelClass = onBoardingData?.hotelClassOptions

    //formdata
    const [formData, setFormData] = [props.formData, props.setFormData]

    const [oneWayTrip, setOneWayTrip] = useState(formData.tripType.oneWayTrip)
    const [roundTrip, setRoundTrip] = useState(formData.tripType.roundTrip)
    const [multiCityTrip, setMultiCityTrip] = useState(formData.tripType.multiCityTrip)
    
    const groups = ['group 1']
    const type = 'international'
    const [errors, setErrors] = useState(formData.itinerary.map(itn =>({citiesError:{}, cabsError:[], hotelsError:[], modeOfTransitError:null, travelClassError:null})))
    
    const handleContinueButton = async ()=>{
        setIsLoading(true)
        console.log(formData)

        let allowSubmit = false
        //check required fields
        async function checkRequiredFields(){
            return new Promise((resolve, reject)=>{
                
                allowSubmit = true
                
                const errors_copy = JSON.parse(JSON.stringify(errors))

                formData.itinerary.forEach((item, itemIndex)=>{

                    if(item.needsHotel){
                        item.hotels?.forEach(hotel=>{
                            let checkInDateError = {set:false, message:'Enter Check-in date'}
                            let checkOutDateError = {set:false, message:'Enter Check-out date'}
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
                                allowSubmit = false
                            }
                            
                            errors_copy[itemIndex].hotelsError.push({checkInDateError, checkOutDateError, classError})
                        })
                    }

                    if(item.needsCab){
                        item.cabs?.forEach(cab=>{
                            let dateError = {set:false, message:'Select date for cab'}
                            let classError = {set:false, message:'Select cab class'}
    
                            if(cab.date == null && cab.type == 'regular') {
                                dateError.set = true
                                allowSubmit = false
                            }
                                
                            errors_copy[itemIndex].cabsError.push({dateError, classError})
                        })
                    }

                    
                    let fromError = {set:false, message:'Enter departure city'}
                    let toError = {set:false, message:'Enter destination city'}
                    let departureDateError = {set:false, message:'Enter departure date'}
                    let returnDateError = {set:false, message:'Enter return date'}

                    if(item.departure.from == null || item.departure.from == ''){
                        fromError.set = true
                        allowSubmit = false
                    }

                    if(item.departure.to == null || item.departure.to == ''){
                        toError.set = true
                        allowSubmit = false
                    }

                    if(item.departure.date == null){
                        departureDateError.set = true
                        allowSubmit = false
                    }

                    if(formData.itinerary[itemIndex].roundTripTrip){
                        if(city.return.date == null){
                            returnDateError.set = true
                            allowSubmit = false
                        }
    
                        else if(item.return.date < item.departure.date){
                            returnDateError.set = true
                            returnDateError.message = 'Return date cannot be before departure date'
                            allowSubmit = false
                        }
                    }
                    
                    errors_copy[itemIndex].citiesError = {fromError, toError, departureDateError, returnDateError}


                    if(item.modeOfTransit == null){
                        errors_copy[itemIndex].modeOfTransitError = {set:true, message:'Select mode of transit'}
                        allowSubmit = false
                    }
                    else{
                        errors_copy[itemIndex].modeOfTransitError = {set:false, message:'Select mode of transit'}
                    }
    
                    if(item.travelClass == null){
                        errors_copy[itemIndex].travelClassError = {set:true, message:'Select travel class'}
                        allowSubmit = false
                    }
                    else{
                        errors_copy[itemIndex].travelClassError = {set:false, message:'Select travel class'}
                    }

                })

                setErrors(errors_copy)
                resolve()
            })
        }

        await checkRequiredFields()
        console.log(allowSubmit, 'allowSubmit...')

        setIsLoading(false)

        if(allowSubmit){
            navigate(nextPage)
        }   
    }

    const addMoreCities = async() =>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        const errors_copy = JSON.parse(JSON.stringify(errors))
        errors_copy.push({citiesError:{}, cabsError:[], hotelsError:[], modeOfTransitError:null, travelClassError:null})
        formData_copy.itinerary.push(dummyItinerary)
        setErrors(errors_copy)
        setFormData(formData_copy)
    }

    //update type of trip
    useEffect(()=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.tripType = {oneWayTrip, roundTrip, multiCityTrip}
        console.log(formData_copy.itinerary.tripType, 'trip type')
        setFormData(formData_copy)
    }, [oneWayTrip, roundTrip, multiCityTrip])
    
    const navigate = useNavigate()

    const handleBackButton = ()=>{
        navigate(lastPage)    
    }

    function selectTripType(type){

        switch(type){
            case 'oneWay':{
                setOneWayTrip(true)
                setRoundTrip(false)
                setMultiCityTrip(false)
                return
            }

            case 'round':{
                setOneWayTrip(false)
                setRoundTrip(true)
                setMultiCityTrip(false)
                return
            }

            case 'multiCity':{
                setOneWayTrip(false)
                setRoundTrip(false)
                setMultiCityTrip(true)
                return
            }

            default : {
                setOneWayTrip(true)
                setRoundTrip(false)
                setMultiCityTrip(false)
                return
            }

        }
    }

    useEffect(()=>{
        if(!multiCityTrip){
            const formData_copy = JSON.parse(JSON.stringify(formData))
            formData_copy.itinerary.splice(1, formData_copy.itinerary.length-1)
            setFormData(formData_copy)
        }
    },[multiCityTrip])
    

    return(<>
        {isLoading && <Error message={loadingErrMsg} /> }
        {!isLoading &&
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

                {/* one way, round trip, multi-city */}
               <div className="w-fit h-6 justify-start items-center gap-4 inline-flex mt-5">
                    <div onClick={()=>{selectTripType('oneWay')}} className={`${ oneWayTrip? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500' } text-xs font-medium font-cabin cursor-pointer`}>One Way </div>
                    <div onClick={()=>selectTripType('round')} className={`${ roundTrip? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500' } text-xs font-medium font-cabin cursor-pointer `}>Round Trip</div>
                    <div onClick={()=>{selectTripType('multiCity')}} className={`${ multiCityTrip? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500' } text-xs font-medium font-cabin cursor-pointer `}>Multi City</div>
                </div> 
                <hr className='mt-2 -mb-4' />

                {
            formData.itinerary.map((_,itemIndex)=>{
                        return(<>
                
                {itemIndex!=0 && <hr className="border-dashed mt-8 border-2 border-indigo-600" />}
                {/* from, to , date */}
                <Cities itemIndex={itemIndex} 
                        formData={formData}
                        setFormData={setFormData}
                        citiesError={errors[itemIndex]?.citiesError}
                         />

                <hr className='mt-4' />

                {/* mode of transit */}
                <div className="pt-8">
                    <ModeOfTransit
                            itemIndex={itemIndex}
                            formData={formData}
                            setFormData={setFormData}
                            type={type}
                            groups={groups}
                            travelClassOptions={travelClassOptions}
                            modeOfTransitError={errors[itemIndex]?.modeOfTransitError}
                            travelClassError={errors[itemIndex]?.travelClassError}
                            modeOfTransitList={modeOfTransitList}
                             />
                </div>

                <hr className='mt-8 mb-8' />


                {/* cabs */}
                <Cabs
                    itemIndex={itemIndex}
                    formData={formData}
                    setFormData={setFormData}
                    type={type}
                    groups={groups}
                    cabsError={errors[itemIndex]?.cabsError}
                    allowedCabClass={allowedCabClass} />
        
                
                {/* hotels */}
                <hr className='mt-8 mb-8' />

                <Hotels
                    itemIndex={itemIndex}
                    formData={formData}
                    setFormData={setFormData}
                    hotelsError = {errors[itemIndex]?.hotelsError}
                    groups = {groups}
                    type={type}
                    allowedHotelClass={allowedHotelClass} 
                    />
                        </>)
                    })

                }

                { multiCityTrip &&              
                    <>
                    <hr className="mt-8 mb-8"/>            
                    <AddMore text='Add Another City' onClick={addMoreCities} />
                    </>
                }
                <hr className='mt-8' />
                {/* upload document */}
                <UploadDocuments />

                <div className='my-8 w-[134px] float-bottom float-right'>
                    <Button 
                        text='Continue' 
                        onClick={handleContinueButton} />
                </div> 

            </div>

        </div>
        }
    </>)
}

