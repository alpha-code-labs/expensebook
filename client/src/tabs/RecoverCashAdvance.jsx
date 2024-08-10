import React from 'react'
import { CardLayout, SettleNowBtn, TripName, Violation } from '../common/TinyComponent'
import { formatAmount } from '../utilis/handyFunctions'

const RecoverCashAdvance = ({trip,handleActionConfirm}) => {
  return (
    <CardLayout index={trip?.tripId}>
    <div  className='w-full py-2 '>
    <div className='flex gap-2 flex-col '> 
    <div className='flex flex-row justify-between'>
        <div className='flex gap-2 items-center'>
        {/* <input onChange={() => handleSelect(trip)} type='checkbox' className='w-4 h-4 accent-indigo-600' checked={isTravelRequestSelected(trip?.travelRequestId)}/> */}
     <div>
        <p className='header-title'>Created By</p>
        <p className='header-text'>{trip?.createdBy?.name ?? <span className='text-center'>-</span>}</p>
     </div>
      </div>

    {/* / */}
    <div className='flex items-center justify-center'>

      {/* <div className={`${trip?.violationsCounter?.total === 0 ? 'hidden':'block'}  flex flex-row gap-2 justify-center items-center text-yellow-200 font-cabin  text-sm`}>
        <img src={violation_icon} className='w-4 h-4'/>
        <p>
{trip?.violationsCounter?.total} 
{trip?.violationsCounter?.total === 1 ? ' violation' : ' violations'}
</p>

    </div> */}
    {/* <Violation violationCount={trip?.violationsCounter?.total}/> */}
     
      {/* <div className='text-sm font-cabin px-2 py-1 cursor-pointer' onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible(trip?.travelRequestId,  'travel-approval-view' )}}}>
        <p className='text-indigo-600 font-semibold'>View Details</p>
      </div> */}
      </div>
    {/* / */}
      </div>
     <div className='flex flex-row justify-between'>
      
     <TripName tripName={trip?.tripName} />
     {/* <div className='flex items-center justify-center'>
     <img src={info_icon} className='w-4 h-4'/>
      <div className='text-sm font-cabin px-2 py-1 cursor-pointer' onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible(trip?.travelRequestId,  'travel-approval-view' )}}}>
        <p className='text-indigo-600 font-semibold'>View Details</p>
      </div>
      </div> */}
     </div>
      </div>
      
      { trip?.cashAdvance && trip?.cashAdvance?.map((advance,index) => (
        <div key={index} className={`px-2 py-2 ${index < trip?.cashAdvance.length-1 && 'border-b border-slate-400 '}`}>
          <div className='flex justify-between'>
            <div className='flex flex-col justify-center max-w-[120px]'>
            <div className='font-medium text-sm font-cabin text-neutral-400'>Advance Amount</div>
<div className='font-medium text-sm font-cabin text-neutral-700'>
{advance.amountDetails.map((amount, index) => (
<div key={index}>
{`${amount.currency.shortName} ${formatAmount(amount.amount)}`}
{index < advance.amountDetails.length - 1 && <span>, </span>}
</div>
))}
</div>

</div>
            <div className='flex justify-center items-center gap-2'>
            {/* <div className={`text-center rounded-sm ${getStatusClass(advance?.cashAdvanceStatus ?? "-")}`}>
               <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{advance?.cashAdvanceStatus ?? "-"}</p>
            </div> */}

    {/* <Violation violationCount={advance?.cashViolationsCounter}/> */}
    {/* <input  type='checkbox' className='w-4 h-4 accent-indigo-600' checked={true}/>  */}
    <SettleNowBtn
    onClick={()=>handleActionConfirm('recoverCashAdvance',{ travelRequestId : trip?.travelRequestId, cashAdvanceId:advance?.cashAdvanceId})}
    text={"Recover Now"}/>
            {/* <div onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible(trip?.travelRequestId,  'ca-modify' ,advance?.cashAdvanceId,)}}} className={`w-7 h-7 bg-indigo-100 rounded-full border border-white flex items-center justify-center ${disableButton(trip?.travelRequestStatus)? ' cursor-not-allowed opacity-50' : ' cursor-pointer'}`}>
            <img src={modify} className='w-4 h-4' alt="modify_icon" />
            </div> */}
          </div>
          </div>
        </div>
))}
    </div>
    </CardLayout>
  )
}

export default RecoverCashAdvance
