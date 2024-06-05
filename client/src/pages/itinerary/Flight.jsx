import { useEffect, useState } from "react"
import AddMore from "../../components/common/AddMore"
import Input from "../../components/common/Input"
import DateTime from "../../components/common/DateTime"
import { set } from "mongoose"
import CloseButton from "../../components/common/closeButton"
import { dummyFlight } from "../../data/dummy"
import { generateUniqueIdentifier } from "../../utils/uuid"


export default function({
    formData,
    min=15,
    setFormData,
    flightsError,
}){

    console.log(flightsError)

    const [oneWayTrip, setOneWayTrip] = useState(true)
    const [roundTrip, setRoundTrip] = useState(false)
    const [multiCityTrip, setMultiCityTrip] = useState(false)
    
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

    const updateCity = (e, field, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.flights[index][field] = e.target.value
        setFormData(formData_copy)
    }

    const handleTimeChange = (e, field, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        if(field == 'departure') formData_copy.itinerary.flights[index].time = e.target.value
        else formData_copy.itinerary.flights[index].returnTime = e.target.value
        
        setFormData(formData_copy)
      }
    
    const handleDateChange = (e, field, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        if(field == 'departure') formData_copy.itinerary.flights[index].date = e.target.value
        else formData_copy.itinerary.flights[index].returnDate = e.target.value
        setFormData(formData_copy)
    }

    useEffect(()=>{
        if(formData.itinerary.flights.length == 1 && formData.itinerary.flights[0].returnDate != null){
            selectTripType('round')
        }
    })

    const deleteFlight = (e, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.flights = formData.itinerary.flights.filter((_,ind)=>ind != index)
        setFormData(formData_copy)
    }

    const addFlight = (e, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.flights.push({...dummyFlight, approvers:formData.approvers, formId:generateUniqueIdentifier()})
        setFormData(formData_copy)
    }

return(<>
    
    {formData.itinerary.flights.length>0 && <div className="w-fit h-6 justify-start items-center gap-4 inline-flex mt-5">
        <div onClick={()=>{selectTripType('oneWay')}} className={`${ oneWayTrip? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500' } text-xs font-medium font-cabin cursor-pointer`}>One Way </div>
        <div onClick={()=>selectTripType('round')} className={`${ roundTrip? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500' } text-xs font-medium font-cabin cursor-pointer `}>Round Trip</div>
        <div onClick={()=>{selectTripType('multiCity')}} className={`${ multiCityTrip? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500' } text-xs font-medium font-cabin cursor-pointer `}>Multi City</div>
    </div>} 

    {formData.itinerary.flights.length>0 && formData.itinerary.flights.map((flight,ind)=>
        
            <div key={flight.formId} className="relative mt-4 bt-4 py-4 border-t border-b border-gray-200 rounded-t-xl bg-white">
                <div className="mt-8 flex gap-8 items-center flex-wrap">
                    <Input 
                        title='From'  
                        placeholder='City' 
                        value={flight.from}
                        error={flightsError[ind]?.fromError} 
                        onBlur={(e)=>updateCity(e, 'from', ind)} />

                    <Input 
                        title='To' 
                        placeholder='City' 
                        value={flight.to} 
                        error={flightsError[ind]?.toError}
                        onBlur={(e)=>updateCity(e, 'to', ind)} />

                    <DateTime 
                        error={flightsError[ind]?.departureDateError}
                        title='Departure Date'
                        validRange={{min:null, max:null}}
                        min={min}
                        time = {flight.time}
                        date={flight.date}
                        onTimeChange={(e)=>handleTimeChange(e, 'departure', ind)}
                        onDateChange={(e)=>handleDateChange(e, 'departure', ind)} />

                    {roundTrip &&  
                    <DateTime
                        error={flightsError[ind]?.returnDateError}
                        title='Return Date'
                        validRange={{min:null, max:null}}
                        min={min}
                        time = {flight.returnTime}
                        date={flight.returnDate}
                        onTimeChange={(e)=>handleTimeChange(e, 'return', ind)}
                        onDateChange={(e)=>handleDateChange(e, 'return', ind)} 
                        />}
                </div>

                {['draft', 'pending approval', 'pending booking'].includes(flight.status) && <div className='absolute right-2 top-2 md:right-4 md:top-4 '>
                <CloseButton onClick={(e)=>deleteFlight(e, ind)} />
            </div>}

            </div>
        )}
    
    {(multiCityTrip || formData.itinerary.flights.length == 0) &&  <div className="mt-10">
        <AddMore text='Add Flight' onClick={addFlight} />
    </div> }

    </>)


}