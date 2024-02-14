import { useEffect, useState } from "react"
import AddMore from "../../components/common/AddMore"
import Input from "../../components/common/Input"
import DateTime from "../../components/common/DateTime"
import { generateUniqueIdentifier } from "../../utils/uuid"
import { dummyBus } from "../../data/dummy"
import CloseButton from "../../components/common/closeButton"

export default function({
    formData,
    setFormData,
    busesError,
}){

    
    const updateCity = (e, field, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.buses[index][field] = e.target.value
        setFormData(formData_copy)
    }

    const handleTimeChange = (e, field, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        if(field == 'departure') formData_copy.itinerary.buses[index].time = e.target.value
        
        setFormData(formData_copy)
      }
    
    const handleDateChange = (e, field, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        if(field == 'departure') formData_copy.itinerary.buses[index].date = e.target.value
        
        setFormData(formData_copy)
    }

    const handleAdd = ()=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.buses.push({...dummyBus, approvers:formData.approvers, formId: generateUniqueIdentifier()})
        
        setFormData(formData_copy)
    }

    const deleteBus = (e, index)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.buses = formData.itinerary.buses.filter((bus,ind) => ind!=index)
        setFormData(formData_copy)
    }

return(<>

    {formData.itinerary.buses.length>0 && formData.itinerary.buses.map((bus,ind)=>
        <div key={bus.formId} className="relative mt-4 bt-4 py-4 border-t border-b border-gray-200 rounded-t-xl bg-white">
            <div  className="mt-8 flex gap-8 items-center flex-wrap">
                <Input 
                    title='From'  
                    placeholder='City' 
                    value={bus.from}
                    error={busesError?.fromError} 
                    onBlur={(e)=>updateCity(e, 'from', ind)} />

                <Input 
                    title='To' 
                    placeholder='City' 
                    value={bus.to} 
                    error={busesError?.toError}
                    onBlur={(e)=>updateCity(e, 'to', ind)} />

                <DateTime 
                    error={busesError?.departureDateError}
                    title='Departure Date'
                    validRange={{min:null, max:null}}
                    time = {bus.time}
                    date={bus.date}
                    onTimeChange={(e)=>handleTimeChange(e, 'departure', ind)}
                    onDateChange={(e)=>handleDateChange(e, 'departure', ind)} />
            </div>

            {['draft', 'pending approval', 'pending booking'].includes(bus.status) && <div className='absolute right-2 top-2 md:right-4 md:top-4 '>
                <CloseButton onClick={(e)=>deleteBus(e, ind)} />
            </div>}

        </div>
    )}
    
    <div className="mt-10">
        <AddMore text="Add Bus" onClick={handleAdd} />
    </div> 

    </>)


}