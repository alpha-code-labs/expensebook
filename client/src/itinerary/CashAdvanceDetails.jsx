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
      <div className='inline-flex py-4 px-2'>
      <h2 className='text-lg font-cabin font-semibold text-gray-800 tracking-[0.03em] leading-normal'>Cash Advance Details</h2>
      </div>
      </summary>
      
      
  <div className='flex flex-col gap-4'>
 {filterCashAdvance?.map((item, index)=>(<React.Fragment key={index} >
  
  <div className='relative h-auto w-auto rounded-md border-[1px] border-slate-300 bg-slate-50 hover:border-purple-500'>   
  <div className='absolute '>
  <StatusBox status={item.cashAdvanceStatus} />
  </div>
 
<div className='flex'>
  
<div className='relative flex-1 flex flex-col justify-center items-center border-r py-2'>
{['approved', 'paid'].includes(item.cashAdvanceStatus) &&<div className='absolute  rounded-sm right-0 top-0 px-2 py-1 bg-green-100'><p className='capitalize text-sm text-green-200'>{item.cashAdvanceStatus}</p></div>}
<img src={money} className='w-8 h-8'/>
<div className='inline-flex justify-center items-center gap-2'>
  <img src={calender} className='w-4 h-4'/>
  <p className=' lg:text-[14px] text-[16px]  font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '>{formatDate(item?.cashAdvanceRequestDate)}</p>
</div>
<div className='flex'>
        <p className='font-cabin font-normal text-md text-neutral-600'>{`Cash-Advance No. : ${item?.cashAdvanceNumber}`}</p>
</div>


</div>

{/* <div className='flex-1'>

  <table className="text-xs border w-full">
  <thead>
    <tr className='font-cabin font-normal text-sm text-neutral-600'>
      <th>Advance Amount</th>
      <th>Preferred Mode</th>
    </tr>
  </thead>
 
  <tbody className='text-center '>
  {item.amountDetails.map((caItem,index)=>(
  <React.Fragment key={index}>
     <tr className=' capitalize'>
       <td className='pr-2'>{caItem?.currency?.shortName ?? ""} {formatAmount(caItem?.amount)}</td>
       <td >{caItem?.mode}</td>
     </tr>
    </React.Fragment>
    ))}
   
  </tbody>
  
</table>

</div> */}
<div className='flex-1 rounded-md w-full   '>
  <div className="text-xs  w-full min-h-[100px] rounded-md">
   
    <div className='w-full flex justify-between bg-slate-100 text-sm rounded-md'>
      
        <p className="py-2 px-4">Advance Amount</p>
        <p className="py-2 px-4">Preferred Mode</p>
    
    </div>
    
    <div className=' flex flex-col text-center  justify-between'>
      {item.amountDetails.map((caItem, index) => (
        <React.Fragment key={index}>
          <div className='flex  justify-between items-center capitalize hover:bg-gray-50'>
            <p className='py-2 flex-1  px-4'>{caItem?.currency?.shortName ?? ""} {formatAmount(caItem?.amount)}</p>
            <p className='py-2 flex-1 px-4 text-center '>{caItem?.mode ?? "-"}</p>
          </div>
        </React.Fragment>
      ))}
    </div>
  </div>
</div>


{/* cash advance details */}
{/* <div className='flex flex-1 h-[78px] items-center justify-center border'>

  <div >
    <img src={money}/>

  </div>
  <div>
  <div className="flex flex-col  items-center justify-start w-auto lg:w-[221px]  px-2 ">
      <div>
        <p className='font-cabin font-normal text-xs text-neutral-400'>Cash-Advance No.</p>
        <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate'>{item?.cashAdvanceNumber}</p>
      </div>
      <div>
      <img src={calender} className='w-4 h-4'/>
        <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate'>{formatDate(item?.cashAdvanceRequestDate)}</p>
      </div>
  </div> 

  </div>
  <div>

  </div>
    
      
     </div> */}
 
 {/* //status */}
{/* <div className='flex flex-none sr-only  sm:not-sr-only h-[78px] items-center justify-center shrink w-auto py-2 px-3'>
        
        
        <div className=' py-2 px-3 flex  rounded-full justify-center items-center min-w-[135px] '>
    <div className={`${getStatusClass(item.cashAdvanceStatus)} px-2 py-1 rounded-[12px] capitalize  cap w-auto max-w-[200px] text-center font-medium text-sm  `}>
    
    {item.cashAdvanceStatus}
    </div>
  </div>
      </div> */}
    {/* //action button */}
    {/* {item.cashAdvanceStatus === 'pending approval' &&
     <div className='flex flex-1  h-auto md:h-[78px] justify-center items-center flex-col md:flex-row gap-2 py-2 px-3 '>
     <ActionButton disabled={travelRequestStatus === 'pending approval' ? true : false} text={titleCase('approve')} onClick={()=>handleAction(item?.cashAdvanceId ,'cashadvance-approve')}/>
      <ActionButton disabled={travelRequestStatus === 'pending approval' ? true : false} text={titleCase('reject')} onClick={()=>handleAction(item?.cashAdvanceId ,'cashadvance-reject')}/>
     </div>} */}

    
   

    
    
    </div>


    {item?.cashAdvanceViolations?.length > 0 && 
        <div className="w-full items-center justify-start border-t border-t-slate-300 h-auto bg-yellow-100  rounded-b-md flex gap-2 text-yellow-500 px-4 py-2 ">
        <img src={violation_ySym_icon} className='w-4 h-4' alt='validation'/>
        
        <p className="font-inter text-sm ">{item?.cashAdvanceViolations}</p>
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

