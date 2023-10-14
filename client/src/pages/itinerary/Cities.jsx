import Input from "../../components/common/Input"
import DateTime from "../../components/common/DateTime"
import AddMore from "../../components/common/AddMore"


export default function Cities(props){

    const cities = props.cities || []
    const handleTimeChange = props.handleTimeChange
    const handleDateChange = props.handleDateChange
    const updateCity = props.updateCity
    const oneWayTrip = props.oneWayTrip
    const roundTrip = props.roundTrip
    const multiCityTrip = props.multiCityTrip
    const addCities = props.addCities
    const citiesError = props.citiesError || []

    console.log(citiesError[0]?.fromError, 'citiesError')


    return(<>
           {cities.map((city,index)=>
                <div key={index} className="mt-8 flex gap-8 items-center flex-wrap">
                    <Input 
                        title='From'  
                        placeholder='City' 
                        value={city.from}
                        error={citiesError[index]?.fromError} 
                        onBlur={(e)=>updateCity(e, index, 'from')} />

                    <Input 
                        title='To' 
                        placeholder='City' 
                        value={city.to} 
                        error={citiesError[index]?.toError}
                        onBlur={(e)=>updateCity(e, index, 'to')} />

                    <DateTime 
                        error={citiesError[index]?.departureDateError}
                        title='Departure Date'
                        validRange={{min:null, max:null}}
                        time = {city?.departure?.time? city?.departure?.time : '11:00' }
                        date={city?.departure?.date}
                        onTimeChange={(e)=>handleTimeChange(e, index, 'departure')}
                        onDateChange={(e)=>handleDateChange(e, index, 'departure')} />

                    {!oneWayTrip && 
                    <DateTime
                        error={citiesError[index]?.returnDateError}
                        title='Return Date'
                        validRange={{min:null, max:null}}
                        time = {city?.return?.time? city?.departure?.time : '11:00' }
                        date={city?.return?.date}
                        onTimeChange={(e)=>handleTimeChange(e, index, 'return')}
                        onDateChange={(e)=>handleDateChange(e, index, 'return')} 
                        />}

                </div>)}

                {multiCityTrip && <div className="mt-8">
                    <AddMore onClick={addCities} /> 
                </div>}
    </>)
}