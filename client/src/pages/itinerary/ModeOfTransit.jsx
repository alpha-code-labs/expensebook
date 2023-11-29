import Select from '../../components/common/Select'
import Checkbox from '../../components/common/Checkbox'
import Transfers from './Transfers'
import { useEffect, useState } from 'react'

export default function ModeOfTransit({
    formData,
    setFormData,
    itemIndex,
    type,
    groups,
    modeOfTransitList,
    travelClassOptions,
    modeOfTransitError,
    travelClassError,
}){

    const modeOfTransit = formData.itinerary[itemIndex].modeOfTransit
    const travelClass = formData.itinerary[itemIndex].travelClass
    const needsVisa = formData.itinerary[itemIndex].needsVisa
    const boardingTransfer = formData.itinerary[itemIndex].boardingTransfer
    const hotelTransfer = formData.itinerary[itemIndex].hotelTransfer
    const needsBoardingTransfer = formData.itinerary[itemIndex].needsBoardingTransfer
    const needsHotelTransfer = formData.itinerary[itemIndex].needsHotelTransfer
    const travelClassViolationMessage = formData.travelViolations.travelClassViolationMessage
    
    useEffect(()=>{
        console.log(modeOfTransit, 'modeOfTransit')
    },[modeOfTransit])

    const setNeedsVisa = (val)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].needsVisa = val 
        setFormData(formData_copy)
    }

    const setNeedsHotelTransfer = (val)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].needsHotelTransfer = val 
        setFormData(formData_copy)
    }

    const setNeedsBoardingTransfer = (val)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].needsBoardingTransfer = val 
        setFormData(formData_copy)
    }



    const setModeOfTransit = (option)=>{
        console.log('this ran', modeOfTransit, travelClass)
        const formData_copy = JSON.parse(JSON.stringify(formData))
        if(option!=modeOfTransit){
            formData_copy.itinerary[itemIndex].travelClass = null    
        }
        
        formData_copy.itinerary[itemIndex].modeOfTransit = option 
        setFormData(formData_copy)

    } 

    const setTravelClassViolationMessage = (message)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.travelViolations.travelClassViolationMessage = message
        setFormData(formData_copy)
    }

    const handleTravelClassChange = async (option)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].travelClass = option 
        setFormData(formData_copy)

        //policy validation
        switch(modeOfTransit){
            case 'Flight':{
                policyValidation_API({type:type, policy:'airfare class', value:option, groups})
                .then(res=>{ console.log(res); setTravelClassViolationMessage(res.violationMessage)})
                .catch(err=>console.error('error in policy validation ', err))

                return
            }
            case 'Train':{
                policyValidation_API({type:type, policy:'railway class', value:option, groups})
                .then(res=>{setTravelClassViolationMessage(res.violationMessage)})
                .catch(err=>console.error('error in policy validation ', err))

                return
            }
            case 'Cab':{
                policyValidation_API({type:type, policy:'cab class', value:option, groups})
                .then(res=>{setTravelClassViolationMessage(res.violationMessage)})
                .catch(err=>console.error('error in policy validation ', err))

                return
            }
        }
        
    }

    const handleBoardingTransferPickupAddressChange = (e)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].boardingTransfer.pickupAddress = e.target.value 
        setFormData(formData_copy)
    }

    const handleBoardingTransferDropAddressChange = (e)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].boardingTransfer.dropAddress = e.target.value 
        setFormData(formData_copy)
    }

    const handleHotelTransferPickupAddressChange = (e)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].hotelTransfer.pickupAddress = e.target.value 
        setFormData(formData_copy)
    }

    const handleHotelTransferDropAddressChange = (e)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].hotelTransfer.dropAddress = e.target.value 
        setFormData(formData_copy)
    }

    const boardingTransferTimeChange = (e)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].boardingTransfer.prefferedTime = e.target.value 
        setFormData(formData_copy)
    }

    const hotelTransferTimeChange = (e)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].hotelTransfer.prefferedTime = e.target.value 
        setFormData(formData_copy)
    }


    function spitBoardingPlace(modeOfTransit){
        if(modeOfTransit === 'Flight')
            return 'an airport'
        else if(modeOfTransit === 'Train')
            return 'a railway station'
        else if(modeOfTransit === 'Bus')
            return 'a Bus station'
    }

    return(<>
        <div className="flex gap-8 flex-wrap">
            <Select 
                options={modeOfTransitList}
                error={modeOfTransitError}
                onSelect={(option)=>{setModeOfTransit(option)}}
                currentOption={modeOfTransit}
                title='Select mode of transit' 
                placeholder='Select travel mode' />
            <Select 
                options={modeOfTransit? travelClassOptions[modeOfTransit.toLowerCase()] : []}
                error={travelClassError}
                onSelect={(option)=>{handleTravelClassChange(option)}}
                currentOption={travelClass}
                violationMessage={travelClassViolationMessage}
                title='Select travel Class' 
                placeholder='Select travel class' />
        </div>

        { (modeOfTransit=='Flight' || modeOfTransit=='Bus' || modeOfTransit=='Train') &&  <>
                    <hr className='my-8' />
                    <div className="flex flex-col gap-2">

                     {/* needs Visa Checkbox */}   
                    {modeOfTransit =='Flight' && 
                    <div className="flex gap-2 items-center">
                        <p className="text-neutral-700 w-fit h-full text-sm font-normal font-cabin">
                            Will you need a visa?
                        </p>
                        <Checkbox checked={needsVisa} onClick={(e)=>{setNeedsVisa(e.target.checked)}} />
                    </div>}
                    
                    {/* needs Airport/railway station/bus station Transfer */}
                    <div>
                        <div className="flex gap-2 items-center">
                            <p className="text-neutral-700 w-fit h-full text-sm font-normal font-cabin">
                                {`Will you need ${spitBoardingPlace(modeOfTransit)} transfer?`}
                            </p>
                            <Checkbox checked={needsBoardingTransfer} onClick={(e)=>{setNeedsBoardingTransfer(e.target.checked)}} />
                        </div>

                        {needsBoardingTransfer && <div className='mt-4'>
                            <Transfers
                                pickupAddress={boardingTransfer.pickupAddress} 
                                dropAddress={boardingTransfer.dropAddress}
                                transferTime={boardingTransfer.prefferedTime} 
                                onTimeChange={boardingTransferTimeChange} 
                                onPickupAddressChange={handleBoardingTransferPickupAddressChange} 
                                onDropAddressChange={handleBoardingTransferDropAddressChange} />
                            </div>}
                    </div>

                    {/* needs Hotel Transfer Checkbox */}
                    <div className="flex gap-2 items-center">
                        <p className="text-neutral-700 w-fit h-full text-sm font-normal font-cabin">
                        {`Will you need ${spitBoardingPlace(modeOfTransit)} to hotel transfer?`}
                        </p>
                        <Checkbox checked={needsHotelTransfer} onClick={(e)=>{setNeedsHotelTransfer(e.target.checked)}} />
                    </div>

                    {needsHotelTransfer && <div className='mt-4'>
                            <Transfers
                                pickupAddress={hotelTransfer.pickupAddress} 
                                dropAddress={hotelTransfer.dropAddress}
                                transferTime={hotelTransfer.prefferedTime} 
                                onTimeChange={hotelTransferTimeChange} 
                                onPickupAddressChange={handleHotelTransferPickupAddressChange} 
                                onDropAddressChange={handleHotelTransferDropAddressChange} />
                            </div>}

                </div> </>}
    </>)
}