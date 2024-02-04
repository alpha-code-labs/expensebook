import { useEffect, useState } from "react"
import AddMore from "../common/AddMore" 
import CloseButton from "../common/CloseButton"
import { dummyTrain } from "./data/dummy"
import { generateUniqueIdentifier } from "../../../utils/uuid"
import Input from "../common/Input"
import { TouchableOpacity, View, Text, ScrollView } from "react-native"
import DatePicker from "../common/DatePicker"
import Button from "../common/Button"

export default function({
    formData,
    setFormData,
    trainsError,
}){



    const updateCity = (e, field, index)=>{
        console.log(e.target.value, 'update city')
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.trains[index][field] = e.target.value
        setFormData(formData_copy)
    }

    const handleTimeChange = (time, field, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.trains[index].time = time
        setFormData(formData_copy)
      }
    
    const handleDateChange = (date, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.trains[index].date = date
        setFormData(formData_copy)
    }

    

    const deleteTrain = (e, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.trains = formData.itinerary.trains.filter((_,ind)=>ind != index)
        setFormData(formData_copy)
    }

    const addTrain = (e, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.trains.push({...dummyTrain, formId:generateUniqueIdentifier()})
        setFormData(formData_copy)
    }

return(<>
    <View className='bg-white'>

    <ScrollView>
    {formData.itinerary.trains.length>0 && formData.itinerary.trains.map((train,ind)=>
        
        <View key={train.formId} className="relative m-4 py-4 border border-gray-200 rounded-t-xl bg-white">
            <View className="mt-8 flex flex-col gap-8 items-center">
                <View>
                    <Input 
                        title='From'  
                        placeholder='City' 
                        value={train.from}
                        error={trainsError[ind]?.fromError} 
                        onBlur={(e)=>updateCity(e, 'from', ind)} />
                </View>


                <View>
                    <Input 
                        title='To' 
                        placeholder='City' 
                        value={train.to} 
                        error={trainsError[ind]?.toError}
                        onBlur={(e)=>updateCity(e, 'to', ind)} />
                </View>

                <View>
                    <DatePicker 
                        dateError={trainsError[ind]?.dateError}
                        value={train.date} 
                        title="Select Date" 
                        onDateChange={(date)=>handleDateChange(date, ind)} 
                        min={15} />
                </View>

                {/* <DateTime 
                    error={flightsError?.departureDateError}
                    title='Departure Date'
                    validRange={{min:null, max:null}}
                    time = {flight.time}
                    date={flight.date}
                    onTimeChange={(e)=>handleTimeChange(e, 'departure', ind)}
                    onDateChange={(e)=>handleDateChange(e, 'departure', ind)} />

                {roundTrip &&  
                <DateTime
                    error={flightsError?.returnDateError}
                    title='Return Date'
                    validRange={{min:null, max:null}}
                    time = {flight.returnTime}
                    date={flight.returnDate}
                    onTimeChange={(e)=>handleTimeChange(e, 'return', ind)}
                    onDateChange={(e)=>handleDateChange(e, 'return', ind)} 
                    />} */}
            </View>

            {<View style={{elevation:5}} className='z-[5] w-[24px] h-[24px] absolute right-3 top-3'>
                <CloseButton onClick={()=>deleteTrain('', ind)}/>
            </View>}
        </View>
    )}

        <View className="mt-10 px-6 mb-[200px]">
            <AddMore text='Add Train' onClick={addTrain} />
        </View> 
    </ScrollView>
        
    </View>
    </>)


}