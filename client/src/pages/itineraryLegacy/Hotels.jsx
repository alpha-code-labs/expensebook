import Select from "../../components/common/Select"
import SlimDate from "../../components/common/SlimDate"
import AddMore from "../../components/common/AddMore"
import Checkbox from "../../components/common/Checkbox"
import { policyValidation_API } from "../../utils/api"
import CloseButton from "../../components/common/closeButton"
import Input from "../../components/common/Input"
import { useState, useEffect } from "react"
import { generateUniqueIdentifier } from "../../utils/uuid"

const dummyHotel = {
    location:null,
    nearby:null,
    class:null, 
    checkIn:null, 
    checkOut:null,
    violations:{
      class: null,
      amount: null,
    }, 
    bkd_location:null,
    bkd_class:null,
    bkd_checkIn:null,
    bkd_checkOut:null,
    bkd_violations:{
      class: null,
      amount: null,
    },
    modified:false, 
    isCancelled:false, 
    cancellationDate:null,
    cancellationReason:null, 
    status:null, 
    status:'draft',
    bookingDetails:{
      docURL: null,
      docType: null,
      billDetails: {}, 
    }
  }

export default function Hotels({
    formData,
    setFormData,
    allowedHotelClass,
    itemIndex,
    hotelsError,
    groups,
    type,
}){


    const hotels = formData.itinerary[itemIndex].hotels
    if(!hotelsError) hotelsError = []
    const needsHotel = formData.itinerary[itemIndex].needsHotel
    const [nearbyOptions, setNearbyOptions] = useState(null)

    useEffect(()=>{
        console.log('mode of transit changed to', formData.modeOfTrasit)
        switch(formData.itinerary[itemIndex].modeOfTransit){
            case 'Flight': setNearbyOptions(['Close to Airport','Clost to City Center',]); break;
            case 'Train': setNearbyOptions(['Close to Railway Station','Clost to City Center',]); break;
            case 'Bus': setNearbyOptions(['Close to Bus Station','Clost to City Center',]); break;
        }

        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].hotels.forEach(hotel=>{
            hotel.nearby = null
        })
        setFormData(formData_copy)
        
    },[formData.itinerary[itemIndex].modeOfTransit])

    const handleHotelClassChange = async (option, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].hotels[index].class = option
        

        const res = await policyValidation_API({tenantId:formData.tenantId, type, policy:'hotel class', value:option, groups:groups})
        if(!res.err){
            formData_copy.itinerary[itemIndex].hotels[index].violations.class = res.data.response.violationMessage
            console.log(res.data)
        }

        setFormData(formData_copy)
    }

    const setNeedsHotel = (val)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].needsHotel = val
        if(val){
            formData_copy.itinerary[itemIndex].hotels.push(dummyHotel)
        }
        else{
            formData_copy.itinerary[itemIndex].hotels = []
        }
        setFormData(formData_copy)
    }

    const handleHotelDateChange = (e, index, field)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].hotels[index][field] = e.target.value
        setFormData(formData_copy)
    }

    const addHotel = ()=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].hotels.push({...dummyHotel, itineraryId: generateUniqueIdentifier()})
        setFormData(formData_copy)
    }

    const deleteHotel = (e, index) => {
        console.log(index)
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].hotels = formData.itinerary[itemIndex].hotels.filter((_, i) => i !== index);
        const hotelCount = formData_copy.itinerary[itemIndex].hotels.length
        if(hotelCount<1){
            formData_copy.itinerary[itemIndex].needsHotel = false
        }
        setFormData(formData_copy)
    }

    const handleNearbyChange = (option, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].hotels[index].nearby = option
        setFormData(formData_copy)
    }

    return(<>

    <div className="flex gap-2 items-center">
            <p className="text-neutral-700 text-sm font-normal font-cabin">
                Will you need a hotel?
            </p>
            <Checkbox checked={needsHotel} onClick={(e)=>{setNeedsHotel(e.target.checked)}} />
        </div>

        {needsHotel && <> 
            {hotels && hotels.map((hotel,index)=>
            <div key={index} className="relative mt-4 bt-4 py-4 px-0 border-t border-b border-gray-200 rounded-xl">
            
            <div key={index} className="flex flex-wrap gap-8 mt-8">
                <Input
                    placeholder='Enter City' 
                    title='Location'/>
                
                <SlimDate 
                        title='Check In' 
                        date={hotels[index].checkIn}
                        error={hotelsError[index]?.checkInDateError} 
                        onChange={(e)=>{handleHotelDateChange(e, index, 'checkIn')}} />
                <SlimDate 
                        title='Check Out' 
                        date={hotels[index].checkOut} 
                        error={hotelsError[index]?.checkOutDateError}
                        onChange={(e)=>{handleHotelDateChange(e, index, 'checkOut')}}/>

                {false && allowedHotelClass && allowedHotelClass.length>0 && 
                <Select options={allowedHotelClass}
                        title='Hotel Class'
                        placeholder='Select hotel class'
                        currentOption={hotels[index].class}
                        violationMessage={hotel?.violations?.class}
                        error={hotelsError!=[]? hotelsError[index]?.classError : {}}
                        onSelect={(option)=>handleHotelClassChange(option, index)} />}
                {allowedHotelClass && allowedHotelClass.length>0 && 
                <Select options={nearbyOptions}
                        title='Nearby'
                        placeholder='Select location preference'
                        currentOption={hotels[index].nearby}
                        onSelect={(option)=>handleNearbyChange(option, index)} />}
            </div>

            {hotel.status == 'draft' && <div className='absolute right-2 top-2 md:right-4 md:top-4 '>
                <CloseButton onClick={(e)=>deleteHotel(e, index)} />
            </div>}

            </div>)}
            
            <div className="mt-8">
                <AddMore text='Add Hotel' onClick={addHotel} /> 
            </div>
                
            </> 
            }

    </>)
}