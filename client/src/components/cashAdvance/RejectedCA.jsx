import React, { useState } from 'react';
import { getStatusClass ,titleCase, urlRedirection} from '../../utils/handyFunctions';
import { receipt, chevron_down, calender, double_arrow , three_dot ,validation_sym, down_left_arrow} from '../../assets/icon';
import Dropdown from '../common/Dropdown';

import { cashAdvanceRoutes } from '../../utils/route';



const RejectedTravel = ({rejectedCashAdvance}) => {
  console.log('rejected',rejectedCashAdvance)

  const handleClearRejectedCashAdvance=(tenantId,empId,travelRequestId,cashAdvanceId)=>{
    const clearRejectedUrl=cashAdvanceRoutes.clearRejected.getUrl(tenantId,empId,travelRequestId,cashAdvanceId);
    urlRedirection(clearRejectedUrl)
  }
  const empId ="emp-6756ghg"
  const tenantId = "tenantId-647543hghjg"

  

  return (   
      <>
    <div className="box w-full max-w-[896px] h-auto  mx-2 sm:mx-4 mb-2  font-cabin">
    <div className="">
     
<div className='h-auto flex flex-col gap-2'>
{rejectedCashAdvance?.map((item,index)=>(
<React.Fragment key={index}>
<div className='flex flex-row items-center h-[52px]  gap-2 text-gray-200 py-8  rounded-xl hover:border-indigo-600   border-[1px]  border-b-gray'>






<>
<div className="flex h-[52px] items-center justify-start w-auto lg:w-[221px] py-0 md:py-4 px-4">
      <div>
        <p className='font-cabin font-normal text-xs text-neutral-400'>Cash-Advance No.</p>
        <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '> {item?.cashAdvanceNumber}</p>
      </div>
</div> 
 <div className='flex w-auto sm:w-[170px] min-w-[120px] justify-center items-center px-0 sm:py-2 sm:px-3 font-cabin gap-2'>
  <div className=' '>
  <p className='font-cabin font-normal text-xs text-neutral-400'>Amount Details</p>
    
      {item.amountDetails.map((currencyItem,index)=>(
      <React.Fragment key={index}>
        <div className=' flex flex-row gap-4 text-[14px] text-neutral-800 font-medium capitalize'>
      <div className=' flex flex-row gap-2 '>{currencyItem.type}
        <p>{currencyItem.currency.shortName}</p>
        <p> {currencyItem.amount},</p>
      </div>
      
        <p className=' translate-y-[-1px] '> {currencyItem.mode}</p>
     
      </div>
      </React.Fragment>
    ))}
  </div>
</div>

{item.rejectionReason &&
<div className=' flex flex-1 min-w-[200px]  justify-start items-center w-full flex-grow h-[44px] px-3 py-2  '>
<div className='inline-flex w-full items-center justify-start gap-2 lg:text-[16px] text-[14px] text-left font-medium tracking-[0.03em] leading-normal text-red-200 font-cabin capitalize'>
  <img src={validation_sym} className='w-5 h-5'/>
<p className='w-auto grow'>{item.rejectionReason}</p>
</div>
</div> }
{/* </div> */}
<div onClick={()=>handleClearRejectedCashAdvance(tenantId,empId,item.travelRequestId,item.cashAdvanceId)} className="flex-1 flex items-center justify-end py-2 px-3 cursor-pointer">
         <b className="text-purple-500 text-[14px] tracking-[0.02em] w-[98px] font-bold">
           Clear Rejected  
         </b>
       </div>

</>



{/* <div className="rounded-[32px] w-auto box-border h-[33px] flex flex-row items-center justify-center py-4 px-2 cursor-pointer">
      <div className="font-semibold text-[12px] min-w-[72px] w-auto  h-[17px] text-purple-500 text-center">Clear Rejected</div>
    </div> */}
    
</div>
</React.Fragment>
))}
</div>
</div>
</div>
      </>
    
  
    
  )
}

export default RejectedTravel