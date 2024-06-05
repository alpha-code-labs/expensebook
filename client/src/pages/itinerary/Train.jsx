import { useEffect, useState } from "react"
import AddMore from "../../components/common/AddMore"
import Input from "../../components/common/Input"
import DateTime from "../../components/common/DateTime"
import { dummyTrain } from "../../data/dummy"
import CloseButton from "../../components/common/closeButton"
import { generateUniqueIdentifier } from "../../utils/uuid"

export default function({
    min,
    formData,
    setFormData,
    trainsError,
}){

    const updateCity = (e, field, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.trains[index][field] = e.target.value
        setFormData(formData_copy)
    }

    const handleTimeChange = (e, field, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        if(field == 'departure') formData_copy.itinerary.trains[index].time = e.target.value
        
        setFormData(formData_copy)
      }
    
    const handleDateChange = (e, field, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        if(field == 'departure') formData_copy.itinerary.trains[index].date = e.target.value
        
        setFormData(formData_copy)
    }

    const deleteTrain = (e, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.trains = formData.itinerary.trains.filter((_,ind)=>ind!=index)
        setFormData(formData_copy)
    }

    const handleAdd = ()=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.trains.push({...dummyTrain, approvers:formData.approvers, formId:generateUniqueIdentifier()})
        setFormData(formData_copy)
    }

return(<>

    {formData.itinerary.trains.length>0 && formData.itinerary.trains.map((train,ind)=>
        <div key={train.formId} className="relative mt-4 bt-4 py-4 border-t border-b border-gray-200 rounded-t-xl bg-white">
            <div className="mt-8 flex gap-8 items-center flex-wrap">
                <Input 
                    title='From'  
                    placeholder='City' 
                    value={train.from}
                    error={trainsError?.fromError} 
                    onBlur={(e)=>updateCity(e, 'from', ind)} />

                <Input 
                    title='To' 
                    placeholder='City' 
                    value={train.to} 
                    error={trainsError?.toError}
                    onBlur={(e)=>updateCity(e, 'to', ind)} />

                <DateTime 
                    min={min}
                    error={trainsError?.departureDateError}
                    title='Departure Date'
                    validRange={{min:null, max:null}}
                    time = {train.preferredTime}
                    date={train.date}
                    onTimeChange={(e)=>handleTimeChange(e, 'departure', ind)}
                    onDateChange={(e)=>handleDateChange(e, 'departure', ind)} />
            </div>

            {train.status == 'draft' && <div className='absolute right-2 top-2 md:right-4 md:top-4 '>
                <CloseButton onClick={(e)=>deleteTrain(e, ind)} />
            </div>}

        </div>
        )}
    
    <div className="mt-10">
        <AddMore text="Add Train" onClick={handleAdd} />
    </div> 

    </>)

}