import React from 'react';
import  {actionTitle} from '../components/common/titleText'
import {validation_sym,cab_purple,double_arrow, violation_ySym_icon, calender, money} from '../assets/icon';
import { formatAmount, formatDate, getStatusClass,titleCase } from '../utils/handyFunctions';
import ActionButton from '../components/common/ActionButton';
import { StatusBox } from '../components/common/TinyComponent';


const CashAdvanceDetails = ({handleAction,cashAdvancesData,travelRequestStatus}) => {
  console.log('from ca',cashAdvancesData)
  
const filterCashAdvance = cashAdvancesData?.filter(item => item?.cashAdvanceStatus =="approved" || item?.cashAdvanceStatus== "pending approval")



  return (
   <>
   <div>
    {/* {cashAdvancesData.map((item,index)=>(<>
    <h3 key={`header${index}`}>{item.travelRequestId}</h3>
    </>))} */}
    <details open>
      <summary>
      <div className='inline-flex py-1 px-2'>
      <h2 className='text-base font-inter  text-neutral-900 '>Cash-Advance Details</h2>
      </div>
      </summary>
      
      
  <div className='flex flex-col gap-4'>
 {filterCashAdvance?.map((item, index)=>(<React.Fragment key={index} >
  
  <div className=' h-auto w-auto rounded-md border-[1px] border-slate-300 bg-white hover:bg-slate-100 '>   

  {/* <StatusBox status={item.cashAdvanceStatus} /> */}
  
 
  <div className='flex p-2 items-center flex-col sm:flex-row justify-between gap-4'>
   
    <div className='p-4 h-full sm:border-r border-slate-300 flex justify-center items-center'>
    <img src={money} className='w-4 h-4 shrink-0' />
  </div>
  <div className='flex justify-start gap-4 w-full'>
  <div className='flex flex-col  text-xs'>
    <p className='header-title'>Date</p>
    <div className='flex items-center gap-1'>
      <img src={calender} className='w-3 h-3' />
      <p className='header-text font-medium tracking-wide text-neutral-800 lg:truncate'>
        {formatDate(item?.cashAdvanceRequestDate)}
      </p>
    </div>
  </div>
  <div className='flex flex-col text-xs'>
    <p className='header-title'>Cash-Advance No.</p>
    <p className='header-text'>{item?.cashAdvanceNumber}</p>
  </div>
  </div>
  
  <div className="flex flex-col gap-1 text-xs whitespace-nowrap">
    <p className="header-title">Advance Amount</p>
    <div className='flex flex-col gap-1'>
      {item.amountDetails.map((caItem, index) => (
        <p key={index} className='header-text'>
          {caItem?.currency?.shortName ?? ""} {formatAmount(caItem?.amount)}
        </p>
      ))}
    </div>
  </div>
</div>

    {item?.cashAdvanceViolations?.length > 0 && 
        <div className="w-full items-center justify-start border-t border-t-slate-300 h-auto bg-yellow-100  rounded-b-md flex gap-2 text-yellow-500 px-2 py-1 ">
        <img src={violation_ySym_icon} className='w-4 h-4' alt='validation'/>
        
        <p className="font-inter text-xs ">{item?.cashAdvanceViolations}</p>
        </div>} 


  
    </div>
   
  
  </React.Fragment>))}

  <div>

  </div>
  </div>
   
 

      
    </details>
  
    

   </div>
   </>
  )
}

export default CashAdvanceDetails

