
import React, { useState ,useEffect} from 'react';
import { useData } from '../../api/DataProvider';
import { validation_sym } from '../../assets/icon';
import { urlRedirection } from '../../utils/handyFunctions';



const RejectedTravel = ({travelRequestNumber,isCashAdvanceTaken, rejectionReason,tripPurpose,cashAdvances}) => {
  const cashAdvanceFlag = false
  const travelId = 'tr797'
  const tenantId = 'tenant_alphacode_123';
  const empId = 'empId_alpha_2322';

  const handleClearRejectedTravelRequest = (tenantId, empId, travelRequestId) => {
    const clearRejectedUrl = cashAdvanceRoutes.clearRejected.getUrl(tenantId, empId, travelRequestId);
    urlRedirection(clearRejectedUrl);
  };

  return (
    <>
   {/* //data div */}   
<>
    <div className="box w-auto max-w-[896px]  h-auto  mx-2 sm:mx-4 mb-2  font-cabin">
    {/* <div className="w-auto min-w-[400px] lg:max-w-[896px]  h-auto  lg:min-h-[56px] rounded-xl border-[1px] border-b-gray"> */}
    <div className={`w-auto min-w-[400px] lg:w-[896px] py-2 px-2  h-auto  lg:min-h-[56px] rounded-xl  border-b-gray border-[1px]`}>
      <div className='w-auto max-w-[932px]  rounded-md'>
{/* <div className="w-auto max-w-[900px] bg-white-100 h-auto max-h-[180px] lg:h-[52px] flex flex-col lg:flex-row items-start lg:items-center justify:start lg:justify-center border-b-[1px] m-2 border-b-gray">*/}
<div className='flex flex-auto flex-row w-full justify-between gap-2'>
<div className='flex flex-1 flex-col lg:flex-row gap-2'>
{/* Trip Title */}
<div className="flex h-[52px] items-center justify-start w-auto lg:w-fit py-0 md:py-3 px-2 order-1 min-w-fit">
   
   <div >
   <p className='font-cabin font-normal  text-xs text-neutral-400'>Travel Request No.</p>
    <p className='lg:text-[14px] text-[16px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '>{ travelRequestNumber}</p>
   </div>
 </div> 
<div className="flex h-[52px] items-center justify-start w-auto lg:w-[221px] py-0 md:py-3 px-2 order-1">
      <div>
        <p className='font-cabin font-normal text-xs text-neutral-400'>Trip Purpose</p>
        <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '> {tripPurpose}</p>
      </div>
    </div>  
<div className="flex h-[52px] items-center justify-start w-auto lg:w-[300px] py-3 px-2 order-1">
{rejectionReason &&
<div className=" inline-flex items-center justify-center gap-2 lg:text-[14px] text-[12px] text-left font-medium tracking-[0.03em] leading-normal text-red-200 font-cabin capitalize">
<img src={validation_sym} className='w-4 h-4' />
<p>{rejectionReason}</p>
</div>}
</div> 



</div>

{/* <div className='flex flex-col-reverse justify-between lg:flex-row'> */}

       <div className="flex-1 flex items-center justify-end py-2 px-3">
         <b className="text-purple-500 text-[14px] tracking-[0.02em] w-[98px] font-bold">
           <a href={cashAdvanceFlag ? `#clear-rejected-ca/${tenantId}/${empId}/${travelId}` : `#clear-rejected-tr/${tenantId}/${empId}/${travelId}`}>Clear Rejected</a>
         </b>
       </div>
{/* //Dropdown for delete & modify */}
{/* <div className="flex flex-none w-[40px] py-3 px-3 cursor-pointer items-start lg:items-center relative">
<img
src={three_dot}
alt="three dot"
width={16}
height={16}
onClick={() => handleDropdownToggle(index)}
/>
{dropdownStates[index] && (
<div className="absolute top-8 right-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 bg-white-100">
  <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
    <li>
      <a
        href="#"
        className="block px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-600 dark:hover:text-white"
      >
        Cancel
      </a>
    </li>

    <li>
      <a
        href="#"
        className="block px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-600 dark:hover:text-white"
      >
        Modify
      </a>
    </li>
  </ul>
</div>
)}
</div> */}




{/* </div> */}


</div>
{/* </div> */}
</div>
{/* <div className='h-auto'>
{cashAdvances.map((caDetails,index)=>(
<>
<div className='flex flex-row items-center ml-0   lg:ml-48 md:ml-36 sm:ml-28 gap-2 text-gray-200'>
<div className='w-auto  mi min-w-[20px] flex justify-center items-center px-3 py-3 '>
<img className='w-6 h-[20px] translate-y-[-2px]' src={down_left_arrow}/>


</div>

<div className='w-auto max-w-[100px] flex justify-center items-center px-3 py-2'>


<div className='  text-[14px] tracking-[0.02em]  font-bold'>
{caDetails.caId}
</div>
</div>
<div className=' flex justify-center items-center w-auto min-w-[130px] h-[44px] px-3 py-2 sr-only  sm:not-sr-only'>
<div className=' tracking-[0.03em] leading-normal text-[14px] text-center'>
{caDetails.date}
</div>
</div> 
<div className='flex w-auto sm:w-[170px] min-w-[120px] justify-center items-center px-0 sm:py-2 sm:px-3 font-cabin gap-2'>
<div className='w-5 h-5'>
{caDetails.violation.length>0 ?(
<img src={validation_sym} alt='three dot' className='w-[20px] h-[20px] ' />
) :""}
</div>
<div className=' '>

{caDetails.amountDetails.map((currencyDetails,index)=>(
<>
<div className='text-[14px]'>
{currencyDetails.currencyType}
{currencyDetails.amount},
</div>
</>
))}
</div>
</div>

<div className='w-[100px] py-2 px-3 flex justify-center items-center sr-only  sm:not-sr-only'>
<div className={`w-auto max-w-[200px] min-w-[135px] text-center font-medium text-sm text-gray-300 `}>
{titleCase(caDetails.status)}
</div>
</div>
</div>
</>
))}
</div> */}
</div>
</div>
      </>
    
  
   </>
    
  )
}

export default RejectedTravel
