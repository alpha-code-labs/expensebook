import Select from "../../components/common/Select"
import Date from "../../components/common/Date"
import ShowCabDates from "../../components/common/showCabDates"
import Checkbox from "../../components/common/Checkbox"
import Transfers from "./Transfers"
import AddMore from "../../components/common/AddMore"
import { policyValidation_API } from "../../utils/api"
import { useState, useEffect } from "react"
import CloseButton from "../../components/common/closeButton"
import { dummyCabs } from "../../data/dummy"


export default function ({
    formData,
    setFormData,
    allowedCabClass=[],
    carRentalsError,
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
        formData_copy.itinerary.carRentals[index].date = date
        console.log('date changed to :', date, index)
        setFormData(formData_copy)
    }

    const handleTimeChange = (e, index) => {
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.carRentals[index].prefferedTime = e.target.value
        setFormData(formData_copy)
    }

    const handlePickupAddressChange = (e, index) => {
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.carRentals[index].pickupAddress = e.target.value
        setFormData(formData_copy)
    }

    const handleDropAddressChange = (e, index) => {
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.carRentals[index].dropAddress = e.target.value
        setFormData(formData_copy)
    }

    const addCabs = () => {
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.carRentals.push(dummyCabs)
        setFormData(formData_copy)
    }

    const deleteCarRental = (e, index) => {
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary.carRentals = formData.itinerary.carRentals.filter((_, i) => i !== index);
        setFormData(formData_copy)
    }

    return(<>
    
        <div className=''>
            {formData.itinerary.carRentals && formData.itinerary?.carRentals.length>0 && formData.itinerary.carRentals.map((carRental,index)=>{
                if(carRental.type=='regular')
                return( <div key={carRental.formId} className="relative mt-4 bt-4 py-4 border-t border-b border-gray-200 rounded-t-xl bg-white">
                    <div  className="flex flex-wrap gap-8 items-center">
                        <Date value={carRental.date} onSelect={(date)=>{handleCabDateChange(date, index)}} error={carRentalsError[index]?.dateError} />
                    </div>

                    <div className='mt-8'>
                        <Transfers
                            pickupAddress={carRental.pickupAddress} 
                            dropAddress={carRental.dropAddress}
                            transferTime={carRental.prefferedTime} 
                            onTimeChange={(e)=>handleTimeChange(e,index)} 
                            onPickupAddressChange={(e)=>handlePickupAddressChange(e,index)} 
                            onDropAddressChange={(e)=>handleDropAddressChange(e,index)} />
                    </div>

                    {['draft', 'pending approval', 'pending booking'].includes(carRental.status) && <div className='absolute right-2 top-2 md:right-4 md:top-4 '>
                        <CloseButton onClick={(e)=>deleteCarRental(e, index)} />
                    </div>}
                </div>)
            })
            }
        </div>

        <div className="mt-8">
            <AddMore text='Add Rental Car' onClick={addCabs} /> 
        </div>
    </>)
}