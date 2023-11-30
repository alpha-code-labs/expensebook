import Select from "../../components/common/Select"
import SlimDate from "../../components/common/SlimDate"
import AddMore from "../../components/common/AddMore"
import Checkbox from "../../components/common/Checkbox"
import { policyValidation_API } from "../../utils/api"
import CloseButton from "../../components/common/closeButton"


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

    const handleHotelClassChange = async (option, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].hotels[index].class = option
        setFormData(formData_copy)

        policyValidation_API({type, policy:'hotel class', value:option, groups:groups})
        .then(res=>{
            const formData_copy = JSON.parse(JSON.stringify(formData))
            formData_copy.itinerary.hotels[index].cabClassViolationMessage = res.violationMessage
            setFormData(formData_copy)
            console.log(res.violationMessage)
        })
        .catch(err=>console.error('error in policy validation', err))
    }

    const setNeedsHotel = (val)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].needsHotel = val
        setFormData(formData_copy)
    }

    const handleHotelDateChange = (e, index, field)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].hotels[index][field] = e.target.value
        setFormData(formData_copy)
    }

    const addHotel = ()=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].hotels.push({class:null, checkIn:null, checkOut:null, hotelClassViolationMessage:null, isModified:false, isCanceled:false, cancellationDate:null, cancellationReason:null})
        setFormData(formData_copy)
    }

    const deleteHotel = (e, index) => {
        console.log(index)
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].hotels = formData_copy.itinerary[itemIndex].hotels.filter((_, i) => i !== index);
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
            <div key={index} className="relative mt-4 bt-4 py-4 px-6 border border-gray-200 rounded-xl">
            <div key={index} className="flex flex-wrap gap-8 mt-8">
                {allowedHotelClass && allowedHotelClass.length>0 && 
                <Select options={allowedHotelClass}
                        title='Hotel Class'
                        placeholder='Select hotel class'
                        currentOption={hotels[index].class}
                        violationMessage={hotel.hotelClassViolationMessage}
                        error={hotelsError!=[]? hotelsError[index]?.classError : {}}
                        onSelect={(option)=>handleHotelClassChange(option, index)} />}
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
            </div>
            <div className='absolute right-2 top-2 md:right-4 md:top-4 '>
                <CloseButton onClick={(e)=>deleteHotel(e, index)} />
            </div>
            </div>)}
            
            <div className="mt-8">
                <AddMore text='Add Hotel' onClick={addHotel} /> 
            </div>
                
            </> 
            }

    </>)
}