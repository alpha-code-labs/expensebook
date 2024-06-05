import { useEffect, useState } from "react"
import AddMore from "../../components/common/AddMore"
import Input from "../../components/common/Input"
import DateTime from "../../components/common/DateTime"
import { dummyTrain } from "../../data/dummy"

export default function({
    formData,
    setFormData,
    personalVehiclesError,
}){

    

    const updateCity = (e, field, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.personalVehicles[index][field] = e.target.value
        setFormData(formData_copy)
    }

    const handleTimeChange = (e, field, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        if(field == 'departure') formData_copy.itinerary.personalVehicles[index].time = e.target.value
        
        setFormData(formData_copy)
      }
    
    const handleDateChange = (e, field, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        if(field == 'departure') formData_copy.itinerary.personalVehicles[index].date = e.target.value
        
        setFormData(formData_copy)
    }

    const handleAdd = ()=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.personalVehicles.push({...dummyTrain, approvers:formData.approvers,})
        setFormData(formData_copy)
    }

return(<>
    {formData.itinerary.personalVehicles.length>0 && formData.itinerary.personalVehicles.map((personalVehicle,ind)=>
        <div className="mt-8 flex gap-8 items-center flex-wrap">
            <Input 
                title='From'  
                placeholder='City' 
                value={personalVehicle.from}
                error={personalVehiclesError?.fromError} 
                onBlur={(e)=>updateCity(e, 'from', ind)} />

            <Input 
                title='To' 
                placeholder='City' 
                value={personalVehicle.to} 
                error={personalVehiclesError?.toError}
                onBlur={(e)=>updateCity(e, 'to', ind)} />

            <DateTime 
                error={personalVehiclesError?.departureDateError}
                title='Departure Date'
                validRange={{min:null, max:null}}
                time = {personalVehicle.preferredTime}
                date={personalVehicle.date}
                onTimeChange={(e)=>handleTimeChange(e, 'departure', ind)}
                onDateChange={(e)=>handleDateChange(e, 'departure', ind)} />
        </div>

        )}
    
    <div className="mt-10">
        <AddMore title="Add Train" onClick={handleAdd} />
    </div> 

    </>)
}


