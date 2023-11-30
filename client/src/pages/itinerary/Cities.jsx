import Input from "../../components/common/Input"
import DateTime from "../../components/common/DateTime"
import AddMore from "../../components/common/AddMore"


export default function Cities({
    itemIndex,
    formData,
    setFormData,
    citiesError,
}){

    console.log(formData)

    const from = formData.itinerary[itemIndex].journey.from
    const to = formData.itinerary[itemIndex].journey.to
    const departureDate = formData.itinerary[itemIndex].journey.departure.date
    const departureTime = formData.itinerary[itemIndex].journey.departure.time
    const returnDate = formData.itinerary[itemIndex].journey.return.date
    const returnTime = formData.itinerary[itemIndex].journey.return.time

    const roundTrip = formData.tripType.roundTrip
   

    const updateCity = (e, field)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].journey[field] = e.target.value
        setFormData(formData_copy)
    }

    const handleTimeChange = (e, field)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].journey[field].time = e.target.value
        setFormData(formData_copy)
      }
    
    const handleDateChange = (e, field)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].journey[field].date = e.target.value
        setFormData(formData_copy)
    }


    return(<>
           
                <div className="mt-8 flex gap-8 items-center flex-wrap">
                    <Input 
                        title='From'  
                        placeholder='City' 
                        value={from}
                        error={citiesError?.fromError} 
                        onBlur={(e)=>updateCity(e, 'from')} />

                    <Input 
                        title='To' 
                        placeholder='City' 
                        value={to} 
                        error={citiesError?.toError}
                        onBlur={(e)=>updateCity(e, 'to')} />

                    <DateTime 
                        error={citiesError?.departureDateError}
                        title='Departure Date'
                        validRange={{min:null, max:null}}
                        time = {departureTime}
                        date={departureDate}
                        onTimeChange={(e)=>handleTimeChange(e, 'departure')}
                        onDateChange={(e)=>handleDateChange(e, 'departure')} />

                    {roundTrip &&  
                    <DateTime
                        error={citiesError?.returnDateError}
                        title='Return Date'
                        validRange={{min:null, max:null}}
                        time = {returnTime}
                        date={returnDate}
                        onTimeChange={(e)=>handleTimeChange(e, 'return')}
                        onDateChange={(e)=>handleDateChange(e, 'return')} 
                        />}

                </div>

    </>)
}