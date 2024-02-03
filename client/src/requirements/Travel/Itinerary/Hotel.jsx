import { useEffect, useState } from "react"
import AddMore from "../common/AddMore" 
import CloseButton from "../common/CloseButton"
import { dummyHotel } from "./data/dummy"
import { generateUniqueIdentifier } from "../../../utils/uuid"
import Input from "../common/Input"
import { TouchableOpacity, View, Text, ScrollView } from "react-native"
import DatePicker from "../common/DatePicker"
import Button from "../common/Button"

export default function({
    formData,
    setFormData,
    hotelsError,
}){

    const updateCity = (e, index)=>{
        console.log(e.target.value, 'update city')
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.hotels[index].location = e.target.value
        setFormData(formData_copy)
    }

    const handleTimeChange = (time, field, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.buses[index].time = time
        setFormData(formData_copy)
      }
    
    const handleDateChange = (date, field, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.hotels[index][field] = date
        setFormData(formData_copy)
    }

    const deleteHotel = (e, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.hotels = formData.itinerary.hotels.filter((_,ind)=>ind != index)
        setFormData(formData_copy)
    }

    const addHotel = (e, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.hotels.push({...dummyHotel, formId:generateUniqueIdentifier()})
        setFormData(formData_copy)
    }

return(<>
    <View className='bg-white'>

    <ScrollView>
    {formData.itinerary.hotels.length>0 && formData.itinerary.hotels.map((hotel,ind)=>
        
        <View key={hotel.formId} className="relative mx-4 mt-4 mb-4 py-4 border border-gray-200 rounded-t-xl bg-white">
            <View className="mt-8 flex flex-col gap-8 items-center">
                <View>
                    <Input 
                        title='Location'  
                        placeholder='City' 
                        value={hotel.location}
                        error={hotelsError?.locationError} 
                        onBlur={(e)=>updateCity(e, ind)} />
                </View>

                <View>
                    <DatePicker 
                        dateError={hotelsError[ind]?.dateError}
                        value={hotel.checkIn} 
                        title="Check In" 
                        onDateChange={(date)=>handleDateChange(date, 'checkIn', ind)} 
                        min={15} />
                </View>

                <View>
                    <DatePicker 
                        dateError={hotelsError[ind]?.dateError}
                        value={hotel.checkOut} 
                        title="Check Out" 
                        onDateChange={(date)=>handleDateChange(date, 'checkOut', ind)} 
                        min={15} />
                </View>

            </View>

            {<View style={{elevation:5}} className='z-[5] w-[24px] h-[24px] absolute right-3 top-3'>
                <CloseButton onClick={()=>deleteHotel('', ind)}/>
            </View>}

        </View>
    )}

    <View className="mt-10 mb-[200px] px-6 ">
        <AddMore text='Add Hotel' onClick={addHotel} />
    </View> 

    </ScrollView>
    
    
    </View>
    </>)


}