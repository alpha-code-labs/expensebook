import Select from "../../components/common/Select"
import SlimDate from "../../components/common/SlimDate"
import AddMore from "../../components/common/AddMore"
import Checkbox from "../../components/common/Checkbox"
import { policyValidation_API } from "../../utils/api"
import CloseButton from "../../components/common/closeButton"
import Input from "../../components/common/Input"
import { useState, useEffect } from "react"
import { generateUniqueIdentifier } from "../../utils/uuid"
import { dummyHotel } from "../../data/dummy"

export default function ({
    min,
    formData,
    setFormData,
    allowedHotelClass,
    hotelsError = [],
    groups,
    type,
}){

    const hotels = formData.itinerary.hotels
    if(!hotelsError) hotelsError = []
    const needsHotel = formData.itinerary.needsHotel
    const [nearbyOptions, setNearbyOptions] = useState(null)

    useEffect(()=>{
        console.log('mode of transit changed to', formData.modeOfTrasit)
        switch(formData.itinerary.modeOfTransit){
            case 'Flight': setNearbyOptions(['Close to Airport','Clost to City Center',]); break;
            case 'Train': setNearbyOptions(['Close to Railway Station','Clost to City Center',]); break;
            case 'Bus': setNearbyOptions(['Close to Bus Station','Clost to City Center',]); break;
        }

        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.hotels.forEach(hotel=>{
            hotel.nearby = null
        })
        setFormData(formData_copy)
        
    },[formData.itinerary.modeOfTransit])

    const handleHotelClassChange = async (option, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.hotels[index].class = option
        

        const res = await policyValidation_API({tenantId:formData.tenantId, type, policy:'hotel class', value:option, groups:groups})
        if(!res.err){
            formData_copy.itinerary.hotels[index].violations.class = res.data.response.violationMessage
            console.log(res.data)
        }

        setFormData(formData_copy)
    }

    const setNeedsHotel = (val)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.needsHotel = val
        if(val){
            formData_copy.itinerary.hotels.push(dummyHotel)
        }
        else{
            formData_copy.itinerary.hotels = []
        }
        setFormData(formData_copy)
    }

    const handleHotelDateChange = (e, index, field)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.hotels[index][field] = e.target.value
        setFormData(formData_copy)
    }

    const addHotel = ()=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.hotels.push({...dummyHotel, approvers:formData.approvers, formId: generateUniqueIdentifier})
        setFormData(formData_copy)
    }

    const deleteHotel = (e, index) => {
        console.log(index)
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.hotels = formData.itinerary.hotels.filter((_, i) => i !== index);
        const hotelCount = formData_copy.itinerary.hotels.length
        if(hotelCount<1){
            formData_copy.itinerary.needsHotel = false
        }
        setFormData(formData_copy)
    }

    const handleNearbyChange = (option, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.hotels[index].nearby = option
        setFormData(formData_copy)
    }

    const handleLocationChange = (e, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.hotels[index].location = e.target.value
        setFormData(formData_copy)
    }

    return(<>

    {formData.itinerary.hotels.map((hotel,index)=>
    <div key={hotel.formId} className="relative mt-4 bt-4 py-4 px-0 border-t border-b border-gray-200 rounded-xl">
    
    <div key={index} className="flex flex-wrap gap-8 mt-8">
        <Input
            placeholder='Enter City'
            onBlur={(e)=>handleLocationChange(e, index)}
            value={hotel.location} 
            title='Location'/>
        
        <SlimDate 
                min={min}
                title='Check In' 
                date={hotel.checkIn}
                error={hotelsError[index]?.checkInDateError} 
                onChange={(e)=>{handleHotelDateChange(e, index, 'checkIn')}} />
        <SlimDate 
                min={min}
                title='Check Out' 
                date={hotel.checkOut} 
                error={hotelsError[index]?.checkOutDateError}
                onChange={(e)=>{handleHotelDateChange(e, index, 'checkOut')}}/>

        {allowedHotelClass && allowedHotelClass.length>0 && 
        <Select options={nearbyOptions}
                title='Nearby'
                placeholder='Select location preference'
                currentOption={hotel.nearby}
                onSelect={(option)=>handleNearbyChange(option, index)} />}
    </div>

    {['draft', 'pending approval', 'pending booking'].includes(hotel.status) && <div className='absolute right-2 top-2 md:right-4 md:top-4 '>
        <CloseButton onClick={(e)=>deleteHotel(e, index)} />
    </div>}

    </div>)}
    
    <div className="mt-8">
        <AddMore text='Add Hotel' onClick={addHotel} /> 
    </div>
    </>)
}