import Select from '../../components/common/Select'
import Checkbox from '../../components/common/Checkbox'
import Transfers from './Transfers'
import { useEffect, useState } from 'react'

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
    cancellationDate:null, 
    cancellationReason:null,
    status:'draft',
    bookingDetails:{
      docURL: null,
      docType: null,
      billDetails: {}, 
    },
    type:'regular',
  }
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
    const travelClassViolationMessage = formData.travelViolations.travelClassViolationMessage
    const [transferNeeds, setTransferNeeds] = useState(null)

    const transferNeedsData = {
        needsDeparturePickup : formData.itinerary[itemIndex].cabs.filter(c=>c.type=='departure pickup')[0],
        needsDepartureDrop  : formData.itinerary[itemIndex].cabs.filter(c=>c.type=='departure drop')[0],
        needsReturnPickup : formData.itinerary[itemIndex].cabs.filter(c=>c.type=='return pickup')[0],
        needsReturnDrop  : formData.itinerary[itemIndex].cabs.filter(c=>c.type=='return drop')[0],
    }

    const transfers = formData.itinerary[itemIndex].transfers
 

    useEffect(()=>{
        console.log(modeOfTransit, 'modeOfTransit')
    },[modeOfTransit])

    useEffect(()=>{
        if(!formData.tripType.roundTrip){
            setTransferNeeds([{checkbox: 'needsDeparturePickup', status:'departure pickup'}, {checkbox:'needsDepartureDrop', status:'departure drop'}])
            const formData_copy = JSON.parse(JSON.stringify(formData))
            formData_copy.itinerary[itemIndex].transfers.needsReturnDrop = false
            formData_copy.itinerary[itemIndex].transfers.needsReturnPickup = false
            //delete values from cabs array if present
            const newCabs = formData.itinerary[itemIndex].cabs.filter((cab)=> (cab.type != 'return pickup' || cab.type != 'return drop'))
            formData_copy.itinerary[itemIndex].cabs = newCabs
            setFormData(formData_copy)
        }
        else{
            setTransferNeeds([{checkbox:'needsDeparturePickup', status:'departure pickup'},
            {checkbox:"needsDepartureDrop", status:'departure drop'},
            {checkbox:"needsReturnPickup", status:'return pickup'}, 
            {checkbox:"needsReturnDrop", status:'return drop'}])
         }

    },[formData.tripType.roundTrip, formData.itinerary[itemIndex].modeOfTransit])

    const setNeedsVisa = (val)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].needsVisa = val 
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

    const handleTransfersChange = (e, field, type)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        const ind = formData.itinerary[itemIndex].cabs.map((cab, index)=>({index, type:cab.type})).filter((cab)=>cab.type == type)[0].index
        formData_copy.itinerary[itemIndex].cabs[ind][field] = e.target.value 
        setFormData(formData_copy)
    }

    const setNeeds = (val, field, type)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.itinerary[itemIndex].transfers[field] = val 

        if(val){
            formData_copy.itinerary[itemIndex].cabs.push({...dummyCabs, type})
        }
        else{
            const ind = formData.itinerary[itemIndex].cabs.map((cab, index)=>({index, type:cab.type})).filter((cab)=>cab.type == type)[0].index
            formData_copy.itinerary[itemIndex].cabs.splice(ind,1)
        }
        
        console.log(formData_copy)
        setFormData(formData_copy)        
    }


    function spitBoardingPlace(modeOfTransit){
        if(modeOfTransit === 'Flight')
            return 'airport'
        else if(modeOfTransit === 'Train')
            return 'Railway Station'
        else if(modeOfTransit === 'Bus')
            return 'Bus Station'
    }

    function spitPhrasalVerb(transferType, modeOfTransit){
        console.log(transferType, modeOfTransit, 'phrasal')
        if(transferType == 'needsDeparturePickup')
            return `Need a ride to the ${spitBoardingPlace(modeOfTransit)} for your departure?`
        if(transferType == 'needsDepartureDrop')
            return `Need a drop from the ${spitBoardingPlace(modeOfTransit)} upon arrival?`
        if(transferType == 'needsReturnPickup')
            return `Need a ride to the ${spitBoardingPlace(modeOfTransit)} for your return?`
        if(transferType == 'needsReturnDrop')
            return `Need a drop from the ${spitBoardingPlace(modeOfTransit)} for your return?`
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
                    {transferNeeds && transferNeeds.length>0 && transferNeeds.map((transferNeed, _index)=>{
                        
                        return(
                        <div key={_index}>
                            <div className="flex items-center justify-between w-[300px]">
                                <p className="text-neutral-700 w-fit h-full text-sm font-normal font-cabin">
                                    {spitPhrasalVerb(transferNeed.checkbox, modeOfTransit)}
                                </p>
                                <Checkbox checked={transfers[transferNeed.checkbox]} onClick={(e)=>{setNeeds(e.target.checked, transferNeed.checkbox, transferNeed.status)}} />
                            </div>

                            {transfers[transferNeed.checkbox] && <div className='mt-4'>
                                <Transfers
                                    pickupAddress={transferNeedsData[transferNeed.checkbox].pickupAddress} 
                                    dropAddress={transferNeedsData[transferNeed.checkbox].dropAddress}
                                    transferTime={transferNeedsData[transferNeed.checkbox].prefferedTime} 
                                    onTimeChange={(e)=>handleTransfersChange(e,'prefferedTime', transferNeed.status)} 
                                    onPickupAddressChange={(e)=>handleTransfersChange(e,'pickupAddress',transferNeed.status)} 
                                    onDropAddressChange={(e)=>handleTransfersChange(e,'dropAddress',transferNeed.status)} />
                                </div>}
                        </div>)
                    })}
                    
                </div> </>}
    </>)
}