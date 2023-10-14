import Select from "../../components/common/Select"
import SlimDate from "../../components/common/SlimDate"
import AddMore from "../../components/common/AddMore"
import Checkbox from "../../components/common/Checkbox"

export default function Hotels(props){


    const hotels = props.hotels
    const allowedHotelClass = props.allowedHotelClass
    const hotelClassViolationMessage = props.hotelClassViolationMessage
    const hotelsError = props?.hotelsError || []
    const needsHotel = props.needsHotel
    const setNeedsHotel = props.setNeedsHotel
    const handleHotelClassChange = props.handleHotelClassChange
    const handleHotelDateChange = props.handleHotelDateChange
    const addHotel = props.addHotel
    

    return(<>

    <div className="flex gap-2 items-center">
            <p className="text-neutral-700 text-sm font-normal font-cabin">
                Will you need a hotel?
            </p>
            <Checkbox checked={needsHotel} onClick={(e)=>{setNeedsHotel(e.target.checked)}} />
        </div>

        {needsHotel && <> 
            {hotels && hotels.map((hotel,index)=><div key={index} className="flex flex-wrap gap-8 mt-8">
                {allowedHotelClass && allowedHotelClass.length>0 && 
                <Select options={allowedHotelClass}
                        title='Hotel Class'
                        placeholder='Select hotel class'
                        currentOption={hotels[index].class}
                        violationMessage={hotelClassViolationMessage}
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
            </div>)}
            
            <div className="mt-8">
                <AddMore onClick={addHotel} /> 
            </div>
                
            </> 
            }

    </>)
}