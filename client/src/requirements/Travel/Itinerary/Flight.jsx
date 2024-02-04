import { useEffect, useState } from "react"
import AddMore from "../common/AddMore" 
import CloseButton from "../common/CloseButton"
import dummyFlight from './data/dummy'
import { generateUniqueIdentifier } from "../../../utils/uuid"
import Input from "../common/Input"
import { TouchableOpacity, View, Text, ScrollView } from "react-native"
import DatePicker from "../common/DatePicker"
import Button from "../common/Button"

export default function({
    formData,
    setFormData,
    flightsError,
}){

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
        //console.log(e, 'update city')
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.flights[index][field] = e.target.value
        setFormData(formData_copy)
    }

    const handleTimeChange = (e, field, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        if(field == 'departure') formData_copy.itinerary.flights[index].preferredTime = e.target.value
        else formData_copy.itinerary.flights[index].returnPreferredTime = e.target.value
        
        setFormData(formData_copy)
      }
    
    const handleDateChange = (date, field, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        if(field == 'departure') formData_copy.itinerary.flights[index].date = date
        else formData_copy.itinerary.flights[index].returnDate = date
        setFormData(formData_copy)
    }

    useEffect(()=>{
        if(formData.itinerary.flights.length == 1 && formData.itinerary.flights[0].returnDate != null){
            selectTripType('round')
        }
    })

    useEffect(()=>{
        
        if(oneWayTrip){
            const formData_copy = JSON.parse(JSON.stringify(formData))
            formData_copy.itinerary.flights = formData.itinerary.flights.filter((_, i)=>i==0)
            if(formData_copy.itinerary.flights.length>0){
                formData_copy.itinerary.flights[0].returnDate = null
            }
            
            setFormData(formData_copy)
        }

    },[oneWayTrip])

    const deleteFlight = (e, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.flights = formData.itinerary.flights.filter((_, ind)=>ind != index)
        setFormData(formData_copy)
    }

    const addFlight = (e, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.flights.push({...dummyFlight, formId:generateUniqueIdentifier()})
        setFormData(formData_copy)
    }

return(<>
    <View className='bg-white'>
    {formData.itinerary.flights.length>0 && <View className="w-fit justify-start items-center gap-x-4 flex flex-row mt-5 px-4">
        <TouchableOpacity onPress={()=>{selectTripType('oneWay')}}>
            <Text  className={`h-6 ${ oneWayTrip? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500 px-2 py-1 rounded-xl bg-white' } text-xs font-medium font-cabin cursor-pointer`}>One Way </Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={()=>selectTripType('round')}>
            <Text  className={` h-6 ${ roundTrip? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500 px-2 py-1 rounded-xl bg-white' } text-xs font-medium font-cabin cursor-pointer `}>Round Trip</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>{selectTripType('multiCity')}}>
            <Text className={`h-6 ${ multiCityTrip? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500 px-2 py-1 rounded-xl bg-white' } text-xs font-medium font-cabin cursor-pointer `}>Multi City</Text>
        </TouchableOpacity>
        
    </View>} 

    <ScrollView>
    {formData.itinerary.flights.length>0 && formData.itinerary.flights.map((flight, ind)=>
        
        <View key={flight.formId} className="relative m-4 py-4 border border-gray-200 rounded-t-xl bg-white">
            <View className="mt-8 flex flex-col gap-8 items-center">
               
                <View>
                    <Input 
                        title='From'  
                        placeholder='City' 
                        value={flight.from}
                        error={flightsError[ind]?.fromError} 
                        onBlur={(e)=>updateCity(e, 'from', ind)} />
                </View>

                <View>
                    <Input 
                        title='To' 
                        placeholder='City' 
                        value={flight.to} 
                        error={flightsError[ind]?.toError}
                        onBlur={(e)=>updateCity(e, 'to', ind)} />
                </View>

                <View>
                    <DatePicker  
                        dateError={flightsError[ind]?.dateError}
                        onDateChange={(date)=>handleDateChange(date, 'departure', ind)} 
                        value={flight.date} 
                        title="Departure Date" 
                        min={15} />
                </View>

                {roundTrip && <View>
                    <DatePicker 
                        onDateChange={(date)=>handleDateChange(date, 'return', ind)} 
                        value={flight.returnDate} 
                        title="Return Date" 
                        min={15} />
                </View>}

            </View>

            {<View style={{elevation:5}} className='z-[5] w-[24px] h-[24px] absolute right-3 top-3'>
                <CloseButton onClick={()=>deleteFlight('', ind)}/>
            </View>}

        </View>
    )}

        {(multiCityTrip || formData.itinerary.flights.length == 0) &&  <View className="mt-10 mb-[200px] px-6">
            <AddMore text='Add Flight' onClick={addFlight} />
        </View> }

    </ScrollView>
    </View>
    </>)


}