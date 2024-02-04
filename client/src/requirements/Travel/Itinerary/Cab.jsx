import { useEffect, useState } from "react"
import AddMore from "../common/AddMore" 
import CloseButton from "../common/CloseButton"
import { dummyCabs } from "./data/dummy"
import { generateUniqueIdentifier } from "../../../utils/uuid"
import Input from "../common/Input"
import { TouchableOpacity, View, Text, ScrollView } from "react-native"
import DatePicker from "../common/DatePicker"
import Button from "../common/Button"

export default function({
    formData,
    setFormData,
    cabsError,
}){

    const updateCity = (e, field, index)=>{
        console.log(e.target.value, 'update city')
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.cabs[index][field] = e.target.value
        setFormData(formData_copy)
    }

    const handleTimeChange = (time, field, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.cabs[index].time = time
        setFormData(formData_copy)
      }
    
    const handleDateChange = (date, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.cabs[index].date = date
        setFormData(formData_copy)
    }

    const deleteCab = (e, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.cabs = formData.itinerary.cabs.filter((_,ind)=>ind != index)
        setFormData(formData_copy)
    }

    const addCab = ()=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.cabs.push({...dummyCabs, formId:generateUniqueIdentifier()})
        setFormData(formData_copy)
    }

return(<>
    <View className='bg-white'>

    <ScrollView>
    {formData.itinerary.cabs.length>0 && formData.itinerary.cabs.map((cab,ind)=>
        
        <View key={cab.formId} className="relative m-4 py-4 border border-gray-200 rounded-t-xl bg-white">
            <View className="mt-8 flex flex-col gap-8 items-center">
                <View>
                    <Input 
                        title='Pickup Adress'  
                        placeholder='address' 
                        value={cab.from}
                        error={cabsError?.fromError} 
                        onBlur={(e)=>updateCity(e, 'pickupAddress', ind)} />
                </View>

                <View>
                    <Input 
                        title='Drop Address' 
                        placeholder='address' 
                        value={cab.to} 
                        error={cabsError?.toError}
                        onBlur={(e)=>updateCity(e, 'dropAddress', ind)} />
                </View>

                <View>
                    <DatePicker 
                        dateError={cabsError[ind]?.dateError}
                        value={cab.date} 
                        title="Select Date" 
                        onDateChange={(date)=>handleDateChange(date, ind)} 
                        min={15} />
                </View>

            </View>

            {<View style={{elevation:5}} className='z-[5] w-[24px] h-[24px] absolute right-3 top-3'>
                <CloseButton onClick={()=>deleteCab('', ind)}/>
            </View>}

        </View>
    )}

        <View className="mt-10 mb-[200px] px-6">
            <AddMore text='Add Cab' onClick={addCab} />
        </View>

    </ScrollView>
    
    </View>
    </>)


}