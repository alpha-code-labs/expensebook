import Icon from "../../components/common/Icon"
import leftArrow_icon from '../assets/arrow-left.svg'
import upload_icon from '../assets/upload.svg'
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Input from "../../components/common/Input"
import DateTime from "../../components/common/DateTime"
import Date from "../../components/common/Date"
import Select from "../../components/common/Select"
import Checkbox from "../../components/common/Checkbox"
import SlimDate from "../../components/common/SlimDate"
import AddMore from "../../components/common/AddMore"
import Button from "../../components/common/Button"
import { updateTravelRequest_API, policyValidation_API } from "../../utils/api"
import ShowCabDates from "../../components/common/showCabDates"
import Cities from "../itinerary/Cities"
import ModeOfTransit from "../itinerary/ModeOfTransit"
import Hotels from "../itinerary/Hotels"
import Cabs from "../itinerary/Cabs"
import UploadDocuments from "../itinerary/UploadDocuments"


export default function (props){

    //onboarding data
    const onBoardingData = props.onBoardingData

    const modeOfTransitList = onBoardingData?.modeOfTransitOptions
    const travelClassOptions = onBoardingData?.travelClassOptions
    const allowedCabClass = onBoardingData?.cabClassOptions 
    const allowedHotelClass = onBoardingData?.hotelClassOptions
    
    //formdata
    const [formData, setFormData] = [props.formData, props.setFormData]

    const [oneWayTrip, setOneWayTrip] = useState(formData.itinerary.tripType.oneWayTrip)
    const [roundTrip, setRoundTrip] = useState(formData.itinerary.tripType.roundTrip)
    const [multiCityTrip, setMultiCityTrip] = useState(formData.itinerary.tripType.multiCityTrip)
    const [needsVisa, setNeedsVisa] = useState(formData.itinerary.needsVisa)
    const [needsAirportTransfer, setNeedsAirportTransfer] = useState(formData.itinerary.needsAirportTransfer)
    const [needsHotel, setNeedsHotel] = useState(formData.itinerary.needsHotel)
    const [needsFullDayCab, setNeedsFullDayCab] = useState(formData.itinerary.needsFullDayCabs)
    const [cabClass, setCabClass] = useState(formData.itinerary.cabs.class)
    const [cabDates, setCabDates] = useState(formData.itinerary.cabs.dates)
    //format: from, to , departureDate, returnDate
    const [cities, setCities] = useState(formData.itinerary.cities)
    const [modeOfTransit, setModeOfTransit] = useState(formData.itinerary.modeOfTransit)
    const [travelClass, setTravelClass] = useState(formData.itinerary.travelClass)
    const [hotels, setHotels] = useState(formData.itinerary.hotels)
    const [cabs, setCabs] = useState({})


    const [travelClassViolationMessage, setTravelClassViolationMessage] = useState(formData.travelViolations.travelClassViolationMessage)
    const [hotelClassViolationMessage, setHotelClassViolationMessage] = useState(formData.travelViolations.hotelClassViolationMessage)
    const [cabClassViolationMessage, setCabClassViolationMessage] = useState(formData.travelViolations.cabClassViolationMessage)
    const group = 'group 1'
    const type = 'international'

    useEffect(()=>{
        console.log(cabDates)
    },[cabDates])


    //update form
    {

    //update violations messages
    useEffect(()=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.travelViolations.travelClassViolationMessage = travelClassViolationMessage,
        formData_copy.hotelClassViolationMessage = hotelClassViolationMessage,
        formData_copy.cabClassViolationMessage = cabClassViolationMessage
        setFormData(formData_copy)

    },[travelClassViolationMessage, hotelClassViolationMessage, cabClassViolationMessage])

    //update type of trip
    useEffect(()=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.tripType = {oneWayTrip, roundTrip, multiCityTrip}
        console.log(formData_copy.itinerary.tripType, 'trip type')
        setFormData(formData_copy)
    }, [oneWayTrip, roundTrip, multiCityTrip])

    //update visa needed
    useEffect(()=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.needsVisa = needsVisa
        setFormData(formData_copy)
    },[needsVisa])

    //update airport transfer needed
    useEffect(()=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.needsAirportTransfer = needsAirportTransfer
        setFormData(formData_copy)
    },[needsAirportTransfer])

    //update hotel needed
    useEffect(()=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.needsHotel = needsHotel
        setFormData(formData_copy)
    },[needsHotel])

    useEffect(()=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.needsFullDayCabs = needsFullDayCab
        setFormData(formData_copy)

        if(!needsFullDayCab){
            setCabDates([])
            setCabClass(null)
        }

    },[needsFullDayCab])

    useEffect(()=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.cabs = {class:cabClass, dates:cabDates}
        setFormData(formData_copy)
    },[cabClass])

    useEffect(()=>{
        try{
            const formData_copy = JSON.parse(JSON.stringify(formData))
            formData_copy.itinerary.cabs = {class:cabClass, dates:cabDates}
            setFormData(formData_copy)
        }catch(e){console.log(e)}

    },[cabDates])

    useEffect(()=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.cities = cities
        setFormData(formData_copy)
    },[cities])

    useEffect(()=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.hotels = hotels
        setFormData(formData_copy)
    },[hotels])

    useEffect(()=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.modeOfTransit = modeOfTransit
        formData_copy.itinerary.needsAirportTransfer = false
        formData_copy.itinerary.needsVisa = false
        setFormData(formData_copy)
    },[modeOfTransit])

    useEffect(()=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.travelClass = travelClass
        setFormData(formData_copy)
    },[travelClass])
    }
    
    const navigate = useNavigate()

    const handleBackButton = ()=>{
        navigate('/section0')    
    }

    const handleContinueButton = async ()=>{
        console.log(sectionForm)
        console.log(formData)

        if(formData.travelRequestId){
            const response = await updateTravelRequest_API({...formData, travelRequestState:'section 1', travelRequestStatus:'draft'})
            console.log(response)   
        }

        navigate('/section2')
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

    const addHotel = ()=>{
        const hotels_copy = JSON.parse(JSON.stringify(hotels))
        hotels_copy.push({})
        setHotels(hotels_copy)
    }

    const addCities = ()=>{
        const cities_copy = JSON.parse(JSON.stringify(cities))
        cities_copy.push({from:null, to:null, departure: {date:null, time:null}, return: {date:null, time:null}})
        setCities(cities_copy)
    }

    useEffect(()=>{
        if(modeOfTransit && !travelClassOptions[modeOfTransit.toLowerCase()].includes(travelClass)){
            setTravelClass(null)
        }
        setNeedsAirportTransfer(false)
        setNeedsVisa(false)
    },[modeOfTransit])

    useEffect(()=>{
        if(!multiCityTrip){
            const cities_copy = JSON.parse(JSON.stringify(cities))
            cities_copy.splice(1, cities_copy.length-1)
            console.log(cities_copy)
            setCities(cities_copy)
        }
    },[multiCityTrip])

    const updateCity = (e, index, field)=>{
        const cities_copy = JSON.parse(JSON.stringify(cities))
        cities_copy[index][field] = e.target.value
        setCities(cities_copy)
    }

    const handleTimeChange = (e, index, field)=>{
      //  console.log(e.target.value, index, field)
        const cities_copy = JSON.parse(JSON.stringify(cities))
        cities_copy[index][field].time = e.target.value
        setCities(cities_copy)
    }

    const handleDateChange = (e, index, field)=>{
      //  console.log(e.target.value, index, field)
        const cities_copy = JSON.parse(JSON.stringify(cities))
        cities_copy[index][field].date = e.target.value
        setCities(cities_copy)
    }

    const handleTravelClassChange = async (option)=>{
        //policy validation
        switch(modeOfTransit){
            case 'Flight':{
                policyValidation_API({type:type, policy:'airfare class', value:option, group:group})
                .then(res=>{ console.log(res); setTravelClassViolationMessage(res.violationMessage)})
                .catch(err=>console.error('error in policy validation ', err))

                return
            }
            case 'Train':{
                policyValidation_API({type:type, policy:'railway class', value:option, group:group})
                .then(res=>{setTravelClassViolationMessage(res.violationMessage)})
                .catch(err=>console.error('error in policy validation ', err))

                return
            }
            case 'Cab':{
                policyValidation_API({type:type, policy:'cab class', value:option, group:group})
                .then(res=>{setTravelClassViolationMessage(res.violationMessage)})
                .catch(err=>console.error('error in policy validation ', err))

                return
            }
        }
        
        //set form data
        setTravelClass(option)
    }

    const handleHotelDateChange = (e, index, field)=>{
        const hotels_copy = JSON.parse(JSON.stringify(hotels))
        hotels_copy[index][field] = e.target.value
        setHotels(hotels_copy)
    }

    const handleHotelClassChange = async (option, index)=>{
        //policy validation
        await policyValidation_API({type:'international', policy:'hotel class', value:option, group:group}).then(res=>{
            setHotelClassViolationMessage(res.violationMessage)
            console.log(res.violationMessage)
        })
        .catch(err=>console.log('error in policy validation'))
       
        //update form states
        const hotels_copy = JSON.parse(JSON.stringify(hotels))
        hotels_copy[index].class = option
        setHotels(hotels_copy)
    }

    const handleCabClassChange =  (option, index=0)=>{

        policyValidation_API({type:type, policy:'cab class', value:option, group:group}).then(res=>{
            setCabClassViolationMessage(res.violationMessage)
            console.log(res.violationMessage)
        })
        .catch(err=>console.err('error in policy validation', err))
       
        //update form states
        setCabClass(option)
    }

    useEffect(()=>{
        console.log('hotel class violation message', hotelClassViolationMessage)
    },[hotelClassViolationMessage])
    
    useEffect(()=>{
        console.log('travel class violation message', travelClassViolationMessage)
    },travelClassViolationMessage)

    const sectionForm = {
        cities: cities,
        modeOfTransit: modeOfTransit,
        tripType: {oneWayTrip, roundTrip, multiCityTrip},
        hotels: hotels,
        cabs: cabs,
    }

    return(<>
        <div className="w-full h-full relative bg-white md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none">
            {/* app icon */}
            <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
                <Icon/>
            </div>

            {/* Rest of the section */}
            <div className="w-full h-full mt-10 p-10">

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

                {/* from, to , date */}
                <Cities cities={cities} 
                        oneWayTrip={oneWayTrip}
                        roundTrip={roundTrip}
                        multiCityTrip={multiCityTrip}
                        handleTimeChange={handleTimeChange}
                        handleDateChange={handleDateChange}
                        updateCity={updateCity}
                        addCities={addCities} />

                <hr className='mt-4' />

                {/* mode of transit */}
                <div className="pt-8">
                    <ModeOfTransit
                            modeOfTransit={modeOfTransit}
                            setModeOfTransit={setModeOfTransit}
                            travelClass={travelClass}
                            handleTravelClassChange={handleTravelClassChange}
                            travelClassOptions={travelClassOptions}
                            travelClassViolationMessage={travelClassViolationMessage}
                            needsVisa={needsVisa}
                            needsAirportTransfer={needsAirportTransfer}
                            setNeedsVisa={setNeedsVisa}
                            setNeedsAirportTransfer={setNeedsAirportTransfer}
                            modeOfTransitList={modeOfTransitList} />
                </div>

                <hr className='mt-8' />

                {/* upload document */}
                <UploadDocuments />


                {/* hotel */}
                <Hotels
                    needsHotel={needsHotel}
                    setNeedsHotel={setNeedsHotel}
                    addHotel={addHotel}
                    handleHotelClassChange={handleHotelClassChange}
                    handleHotelDateChange={handleHotelDateChange}
                    hotelClassViolationMessage={hotelClassViolationMessage}
                    allowedHotelClass={allowedHotelClass} 
                    hotels={hotels}/>            
        
                
                {/* cab */}
                <hr className='mt-8 mb-8' />
                <Cabs
                    needsFullDayCab={needsFullDayCab}
                    setNeedsFullDayCab={setNeedsFullDayCab}
                    cabDates={cabDates}
                    setCabDates={setCabDates}
                    handleCabClassChange={handleCabClassChange}
                    cabClassViolationMessage={cabClassViolationMessage}
                    allowedCabClass={allowedCabClass} 
                    cabClass={cabClass} />


                <div className='my-8 w-[134px] float-bottom float-right'>
                    <Button 
                        text='Continue' 
                        onClick={handleContinueButton} />
                </div> 

            </div>

        </div>
    </>)
}

