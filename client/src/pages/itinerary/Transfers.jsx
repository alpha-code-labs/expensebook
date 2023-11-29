import InputAddress from "../../components/common/InputAddress"
import TimePicker from "../../components/common/TimePicker"

export default function Transfers({pickupAddress, dropAddress, transferTime, onTimeChange, onPickupAddressChange, onDropAddressChange}){

    return(<>
        {/* airport/railway station/bust station transfers */} 
        <div className='flex flex-wrap items-center gap-2'>
            
            <InputAddress title='Pickup Address' address={pickupAddress} onChange={onPickupAddressChange} />
            <InputAddress title='Drop Address' address={dropAddress} onChange={onDropAddressChange} />
            <TimePicker title="Preffered Time" time={transferTime} onTimeChange={(e)=>onTimeChange(e)} />
        </div>       
    </>)
}