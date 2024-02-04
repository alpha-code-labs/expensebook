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
    carRentalsError,
}){

    const updateCity = (e, field, index)=>{
        console.log(e.target.value, 'update city')
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.carRentals[index][field] = e.target.value
        setFormData(formData_copy)
    }

    const handleTimeChange = (time, field, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.carRentals[index].time = time
        setFormData(formData_copy)
      }
    
    const handleDateChange = (date, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.carRentals[index].date = date
        setFormData(formData_copy)
    }

    const deleteCab = (e, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.carRentals = formData.itinerary.carRentals.filter((_,ind)=>ind != index)
        setFormData(formData_copy)
    }

    const addCab = (e, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.carRentals.push({...dummyCabs, formId:generateUniqueIdentifier()})
        setFormData(formData_copy)
    }

return(<>
    <View className='bg-white'>

    <ScrollView>
    {formData.itinerary.carRentals.length>0 && formData.itinerary?.carRentals.map((carRental,ind)=>
        
        <View key={carRental.formId} className="relative m-4 py-4 border border-gray-200 rounded-t-xl bg-white">
            <View className="mt-8 flex flex-col gap-8 items-center">
                <View>
                    <Input 
                        title='Pickup Adress'  
                        placeholder='address' 
                        value={carRental.from}
                        error={carRentalsError?.fromError} 
                        onBlur={(e)=>updateCity(e, 'pickupAddress', ind)} />
                </View>

                <View>
                    <Input 
                        title='Drop Address' 
                        placeholder='address' 
                        value={carRental.to} 
                        error={carRentalsError?.toError}
                        onBlur={(e)=>updateCity(e, 'dropAddress', ind)} />
                </View>

                <View>
                    <DatePicker 
                        dateError={carRentalsError[ind]?.dateError}
                        value={carRental.date} 
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

        
        <View className="mt-10 px-6 mb-[200px]">
            <AddMore text='Add Bus' onClick={addCab} />
        </View> 

    </ScrollView>

    </View>
    </>)


}