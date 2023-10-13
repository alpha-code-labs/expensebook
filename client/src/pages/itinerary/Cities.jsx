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

    return(<>
           {cities.map((city,index)=>
                <div key={index} className="mt-8 flex gap-8 items-center flex-wrap">
                    <Input title='From'  placeholder='City' value={city.from} onBlur={(e)=>updateCity(e, index, 'from')} />
                    <Input title='To' placeholder='City' value={city.to} onBlur={(e)=>updateCity(e, index, 'to')} />
                    <DateTime 
                        title='Departure Date'
                        validRange={{min:null, max:null}}
                        time = {(cities && city['departure']!=undefined && city['departure']['time']!=undefined)? city['departure'].time : '11:00' }
                        date={(city && city['departure']!=undefined && city['departure']['time']!=undefined)? city['departure'].date : null }
                        onTimeChange={(e)=>handleTimeChange(e, index, 'departure')}
                        onDateChange={(e)=>handleDateChange(e, index, 'departure')} />
                    {!oneWayTrip && 
                    <DateTime
                        title='Return Date'
                        validRange={{min:null, max:null}}
                        time = {(city && city['return']!=undefined && city['return']['time']!=undefined)? city['return'].time : '11:00' }
                        date={(city && city['return']!=undefined && city['return']['time']!=undefined)? city['return'].date : null }
                        onTimeChange={(e)=>handleTimeChange(e, index, 'return')}
                        onDateChange={(e)=>handleDateChange(e, index, 'return')} 
                        />}

                </div>)}

                {multiCityTrip && <div className="mt-8">
                    <AddMore onClick={addCities} /> 
                </div>}
    </>)
}