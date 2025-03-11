import React from 'react'
import { calender_icon, cancel,modify, validation_sym } from '../../assets/icon'
import { titleCase,getStatusClass, urlRedirection, formatAmount } from '../../utils/handyFunctions'


const CashCard = ({travelRequestId,trip,handleCashAdvance,cashAdvances}) => {
 

  return (
    <div className=' h-[200px] mt-1'> 
    {cashAdvances?.map((item,index)=>(<React.Fragment key={index}>
<div className='border-[1px] flex flex-row border-slate-300 bg-slate-50 rounded-md mb-2 p-3 h-auto w-full font-cabin'>
  <div className='flex-1 flex flex-col gap-4'>
      <div className=''>
        <p className='font-cabin font-normal text-xs text-neutral-400'>Cash-Advance No.</p>
        <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '> {item?.cashAdvanceNumber}</p>
      </div>

  <div className=' '>
  <div className='flex flex-row gap-4 text-[14px] text-neutral-800 font-medium capitalize'>
    <div className='flex flex-col'>
      <p className='font-cabin font-normal text-xs text-neutral-400'>Amount Details</p>
      {item?.amountDetails.map((currencyItem, index) => (
        <div key={index} className='flex flex-row gap-1'>
          <p>{currencyItem?.currency?.shortName}</p>
          <p>{formatAmount(currencyItem?.amount)}</p>
        </div>
      ))}
    </div>
    <div className='flex flex-col'>
      <p className='font-cabin font-normal text-xs text-neutral-400'>Mode</p>
      {item?.amountDetails.map((currencyItem, index) => (
        <p key={index} className='translate-y-[-1px]'>{currencyItem?.mode ?? "-"}</p>
      ))}
    </div>
  </div>
</div>

  </div>

   {/* Column 2 */}
  
   <div className='flex-1 flex flex-col gap-4 justify-end items-end'>
     <div className={`text-center w-fit px-2 py-1 rounded-sm text-[14px] font-medium tracking-[0.03em] text-gray-300 ${getStatusClass(item.cashAdvanceStatus)}`}>
       <p>{titleCase(item.cashAdvanceStatus)}</p>
     </div>

     <div className='flex flex-1 justify-center items-end gap-4 pt-3 px-3'>
       <div onClick={()=>{handleCashAdvance(travelRequestId,item?.cashAdvanceId, 'ca-cancel')}}  className='flex items-center  justify-center w-6 h-6 bg-[#FFC2C6] rounded-full cursor-pointer' >
         <img src={cancel} alt='cancel' width={20} height={20} />
       </div>
       <div onClick={()=>{handleCashAdvance(travelRequestId,item?.cashAdvanceId, 'ca-modify')}} className='flex cursor-pointer items-center justify-center w-6 h-6 bg-purple-200 rounded-full '>
         <img src={modify} alt='modify' width={12} height={12} />
       </div>
     </div>
   </div>
 </div>
 
      
       
         
       
    
    </React.Fragment>))}
   
    </div>
  )
}

export default CashCard



