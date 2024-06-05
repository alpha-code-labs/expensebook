import Select from "../../components/common/Select"
import Date from "../../components/common/Date"
import ShowCabDates from "../../components/common/showCabDates"
import Checkbox from "../../components/common/Checkbox"
import Transfers from "./Transfers"
import AddMore from "../../components/common/AddMore"
import { policyValidation_API } from "../../utils/api"
import { useState, useEffect } from "react"
import CloseButton from "../../components/common/closeButton"

const dummyCabs = {
    date:null, 
    class:null, 
    preferredTime:null, 
    pickupAddress:null, 
    dropAddress:null, 
    violations:{
      class: null,
      amount: null,
    }, 
    bkd_date:null,
    bkd_class:null,
    bkd_preferredTime:null,
    bkd_pickupAddress:null,
    bkd_dropAddress:null,

    modified:false, 
    isCancelled:false, 
    cancellationDate:null, 
    cancellationReason:null,
    status:'draft',
    bookingDetails:{
      docURL: null,
      docType: null,
      billDetails: {}, 
    },
    type:'regular'
  }

export default function Cabs({
    itemIndex,
    formData,
    setFormData,
    allowedCabClass,
    groups,
    type,
    cabsError,
}){

    const handleCabClassChange = async (option, index) => {
        
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].cabs[index].class = option
        

        const res = await policyValidation_API({tenantId:formData.tenantId, type, policy:'cab class', value:option, groups})
        if(!res.err){
            formData_copy.itinerary[itemIndex].cabs[index].vioilation.class = res.data.response.violationMessage
            console.log(res.violationMessage)
        }

        setFormData(formData_copy)
    }

    const handleCabDateChange = (date, index) => {
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].cabs[index].date = date
        console.log('date changed to :', date, index)
        setFormData(formData_copy)
    }

    const handleTimeChange = (e, index) => {
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].cabs[index].prefferedTime = e.target.value
        setFormData(formData_copy)
    }

    const handlePickupAddressChange = (e, index) => {
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].cabs[index].pickupAddress = e.target.value
        setFormData(formData_copy)
    }

    const handleDropAddressChange = (e, index) => {
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].cabs[index].dropAddress = e.target.value
        setFormData(formData_copy)
    }

    const handleNeedsCabChange = (e) => {
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].needsCab = e.target.checked
        if(e.target.checked){
            formData_copy.itinerary[itemIndex].cabs.push(dummyCabs)
        }
        else{
            const newCabs = formData_copy.itinerary[itemIndex].cabs.filter(cab=>cab.type != 'regular')
            formData_copy.itinerary[itemIndex].cabs = newCabs
        }
        console.log(formData_copy)
        setFormData(formData_copy)
    }

    const addCabs = () => {
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].cabs.push(dummyCabs)
        setFormData(formData_copy)
    }

    const deleteCab = (e, index) => {
        console.log(index)
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].cabs = formData.itinerary[itemIndex].cabs.filter((_, i) => i !== index);
        const regularCabsCount = formData_copy.itinerary[itemIndex].cabs.filter(cab=>cab.type=='regular').length
        if(regularCabsCount<1){
            formData_copy.itinerary[itemIndex].needsCab = false
        }
        setFormData(formData_copy)
    }

    return(<>
    <div className="flex gap-2 items-center">
                    <p className="text-neutral-700 text-sm font-normal font-cabin">
                        Will you be needing cabs?
                    </p>
                    <Checkbox checked={formData.itinerary[itemIndex].needsCab} onClick={(e)=>handleNeedsCabChange(e)} />
            </div>

            {formData.itinerary[itemIndex].needsCab && <>

                <div className=''>
                    {formData.itinerary[itemIndex].cabs.length>0 && formData.itinerary[itemIndex].cabs.map((cab,index)=>{
                        
                        console.log(index, cab, 'index cab')

                        if(cab.type=='regular')
                        return( <div key={index} className="relative mt-4 bt-4 py-4 border-t border-b border-gray-200 rounded-t-xl bg-white">
                            <div  className="flex flex-wrap gap-8 items-center">
                                <Date value={cab.date} onSelect={(date)=>{handleCabDateChange(date, index)}} error={cabsError[index]?.dateError} />
                                {allowedCabClass && allowedCabClass.length>0 && 
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

                            {cab.status == 'draft' && <div className='absolute right-2 top-2 md:right-4 md:top-4 '>
                                <CloseButton onClick={(e)=>deleteCab(e, index)} />
                            </div>}
                        </div>)
                    })
                    }
                </div>

                <div className="mt-8">
                    <AddMore text='Add Cab' onClick={addCabs} /> 
                </div>

            </>
            }
    </>)
}