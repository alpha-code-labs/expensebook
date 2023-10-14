import Select from '../../components/common/Select'
import Checkbox from '../../components/common/Checkbox'

export default function ModeOfTransit(props){

    const modeOfTransitList = props.modeOfTransitList
    const modeOfTransit = props.modeOfTransit
    const setModeOfTransit = props.setModeOfTransit
    const travelClassOptions = props.travelClassOptions
    const travelClass = props.travelClass
    const handleTravelClassChange = props.handleTravelClassChange
    const travelClassViolationMessage = props.travelClassViolationMessage
    const needsVisa = props.needsVisa
    const needsAirportTransfer = props.needsAirportTransfer
    const setNeedsVisa = props.setNeedsVisa
    const setNeedsAirportTransfer = props.setNeedsAirportTransfer
    const modeOfTransitError = props.modeOfTransitError
    const travelClassError = props.travelClassError


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

        { modeOfTransit=='Flight' &&  <>
                    <hr className='my-8' />
                    <div className=" flex gap-8">
                    <div className="flex gap-2 items-center">
                        <p className="text-neutral-700 w-full h-full text-sm font-normal font-cabin">
                            Will you need a visa?
                        </p>
                        <Checkbox checked={needsVisa} onClick={(e)=>{setNeedsVisa(e.target.checked)}} />
                    </div>

                    <div className="flex gap-2 items-center">
                        <p className="text-neutral-700 w-full h-full text-sm font-normal font-cabin">
                            Will you need an airport transfer?
                        </p>
                        <Checkbox checked={needsAirportTransfer} onClick={(e)=>{setNeedsAirportTransfer(e.target.checked)}} />
                    </div>

                </div> </>}
    </>)
}