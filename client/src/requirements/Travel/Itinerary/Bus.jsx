import { useEffect, useState } from "react"
import AddMore from "../common/AddMore" 
import CloseButton from "../common/CloseButton"
import { dummyBus } from "./data/dummy"
import { generateUniqueIdentifier } from "../../../utils/uuid"
import Input from "../common/Input"
import { TouchableOpacity, View, Text, ScrollView } from "react-native"
import DatePicker from "../common/DatePicker"
import Button from "../common/Button"

export default function({
    formData,
    setFormData,
    busesError,
}){

    const updateCity = (e, field, index)=>{
        console.log(e.target.value, 'update city')
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.buses[index][field] = e.target.value
        setFormData(formData_copy)
    }

    const handleTimeChange = (time, field, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.buses[index].time = time
        setFormData(formData_copy)
      }
    
    const handleDateChange = (date, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.buses[index].date = date
        setFormData(formData_copy)
    }

    const deleteBus = (e, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.buses = formData.itinerary.buses.filter((_,ind)=>ind != index)
        setFormData(formData_copy)
    }

    const addBus = (e, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.buses.push({...dummyBus, formId:generateUniqueIdentifier()})
        setFormData(formData_copy)
    }

return(<>
    <View className='bg-white'>

    <ScrollView>
    {formData.itinerary.buses.length>0 && formData.itinerary.buses.map((bus,ind)=>
        
        <View key={bus.formId} className="relative mt-4 mb-4 py-4 border-t border-b border-gray-200 rounded-t-xl bg-white">
            <View className="mt-8 flex flex-col gap-8 items-center">
                <View>
                    <Input 
                        title='From'  
                        placeholder='City' 
                        value={bus.from}
                        error={busesError?.fromError} 
                        onBlur={(e)=>updateCity(e, 'from', ind)} />
                </View>

                <View>
                    <Input 
                        title='To' 
                        placeholder='City' 
                        value={bus.to} 
                        error={busesError?.toError}
                        onBlur={(e)=>updateCity(e, 'to', ind)} />
                </View>

                <View>
                    <DatePicker 
                        dateError={busesError[ind]?.dateError}
                        value={bus.date} 
                        title="Select Date" 
                        onDateChange={(date)=>handleDateChange(date, ind)} 
                        min={15} />
                </View>

            </View>

            {<View style={{elevation:5}} className='z-[5] w-[24px] h-[24px] absolute right-3 top-3'>
                <CloseButton onClick={()=>deleteBus('', ind)}/>
            </View>}

        </View>
    )}

        <View className="mt-10 mb-[200px] px-6 ">
            <AddMore text='Add Bus' onClick={addBus} />
        </View> 
    </ScrollView>
        
    
    </View>
    </>)


}