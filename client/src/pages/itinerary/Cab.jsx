import Select from "../../components/common/Select"
import Date from "../../components/common/Date"
import ShowCabDates from "../../components/common/showCabDates"
import Checkbox from "../../components/common/Checkbox"
import Transfers from "./Transfers"
import AddMore from "../../components/common/AddMore"
import { policyValidation_API } from "../../utils/api"
import { useState, useEffect } from "react"
import CloseButton from "../../components/common/closeButton"
import { generateUniqueIdentifier } from "../../utils/uuid"
import { dummyCabs } from "../../data/dummy"



export default function Cabs({
    formData,
    min,
    setFormData,
    allowedCabClass=[],
    cabsError,
}){

    
    const handleCabClassChange = async (option, index) => {
        
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.cabs[index].class = option
        

        // const res = await policyValidation_API({tenantId:formData.tenantId, type, policy:'cab class', value:option, groups})
        // if(!res.err){
        //     formData_copy.itinerary.cabs[index].vioilation.class = res.data.response.violationMessage
        //     console.log(res.violationMessage)
        // }

        setFormData(formData_copy)
    }

    const handleCabDateChange = (date, index) => {
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.cabs[index].date = date
        console.log('date changed to :', date, index)
        setFormData(formData_copy)
    }

    const handleTimeChange = (e, index) => {
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.cabs[index].time = e.target.value
        setFormData(formData_copy)
    }

    const handlePickupAddressChange = (e, index) => {
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.cabs[index].pickupAddress = e.target.value
        setFormData(formData_copy)
    }

    const handleDropAddressChange = (e, index) => {
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.cabs[index].dropAddress = e.target.value
        setFormData(formData_copy)
    }

    const handleNeedsCabChange = (e) => {
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.needsCab = e.target.checked
        if(e.target.checked){
            formData_copy.itinerary.cabs.push(dummyCabs)
        }
        else{
            const newCabs = formData_copy.itinerary.cabs.filter(cab=>cab.type != 'regular')
            formData_copy.itinerary.cabs = newCabs
        }
        console.log(formData_copy)
        setFormData(formData_copy)
    }

    const addCabs = () => {
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.cabs.push({...dummyCabs, approvers:formData.approvers, formId:generateUniqueIdentifier()})
        setFormData(formData_copy)
    }

    const deleteCab = (e, index) => {
        console.log(index)
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.cabs = formData.itinerary.cabs.filter((_, i) => i !== index);
        const regularCabsCount = formData_copy.itinerary.cabs.filter(cab=>cab.type=='regular').length
        if(regularCabsCount<1){
            formData_copy.itinerary.needsCab = false
        }
        setFormData(formData_copy)
    }

    return(<>
    
        <div className=''>
            {formData.itinerary.cabs.length>0 && formData.itinerary.cabs.map((cab,index)=>{
                
                console.log(index, cab, 'index cab')

                if(cab.type=='regular')
                return( <div key={cab.formId} className="relative mt-4 bt-4 py-4 border-t border-b border-gray-200 rounded-t-xl bg-white">
                    <div  className="flex flex-wrap gap-8 items-center">
                        <Date min={min} value={cab.date} onSelect={(date)=>{handleCabDateChange(date, index)}} error={cabsError[index]?.dateError} />
                        {false && allowedCabClass && allowedCabClass.length>0 && 
                        <Select options={allowedCabClass}
                                title='Cab Class'
                                validRange={{min:null, max:null}}
                                placeholder='Select cab class'
                                currentOption={cab.class} 
                                violationMessage={cab.violations.class}
                                onSelect={(option)=>handleCabClassChange(option, index)} />}
                        
                    </div>

                    <div className='mt-8'>
                    <Transfers
                        pickupAddress={cab.pickupAddress} 
                        dropAddress={cab.dropAddress}
                        transferTime={cab.prefferedTime} 
                        onTimeChange={(e)=>handleTimeChange(e,index)} 
                        onPickupAddressChange={(e)=>handlePickupAddressChange(e,index)} 
                        onDropAddressChange={(e)=>handleDropAddressChange(e,index)} />
                    </div>

                    {['draft', 'pending approval', 'pending booking'].includes(cab.status) && <div className='absolute right-2 top-2 md:right-4 md:top-4 '>
                        <CloseButton onClick={(e)=>deleteCab(e, index)} />
                    </div>}

                </div>)
            })
            }
        </div>

        <div className="mt-10 justify-center flex w-full">
            <AddMore text='Add Cab' onClick={addCabs} /> 
        </div>
    </>)
}