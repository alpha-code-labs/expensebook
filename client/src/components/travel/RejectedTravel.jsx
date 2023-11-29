
import React, { useState } from 'react';

import { getStatusClass ,titleCase} from '../../utils/handyFunctions';

import { receipt, chevron_down, calender, double_arrow , three_dot ,validation_sym, down_left_arrow} from '../../assets/icon';
import Dropdown from '../common/Dropdown';



const RejectedTravel = ({travelName,status,departureDate,returnDate,to,from ,cashAdvance}) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return (
    <>
    {/* <div className="w-[200px] h-6 flex flex-row gap-3 ml-8 mt-7 items-center">
      <img className="w-6 h-6" src={receipt} alt="receipt" />
      <div className="text-base tracking-[0.02em] font-bold w-auto">Rejected Travel Request</div>
    </div> */}
    {/* <div className="w-auto max-w-[100px] sm:max-w-[250px] flex flex-col sm:flex-row items-center sm:items-center justify-start gap-[8px] text-left text-gray-A300 mt-[25px] mx-11">
      <div className="relative font-medium">Select Status</div>
      <div className="relative w-[93px] h-8 text-sm text-black">
        <div className="absolute top-[-5px] left-[0px] rounded-md bg-white box-border w-[93px] h-8">
          <Dropdown name="months" options={months} icon={chevron_down} />
        </div>
      </div>
    </div> */}

    

   {/* //data div */}
 
    
      <>
    <div className="box w-auto max-w-[896px] h-auto  mx-2 sm:mx-4 mb-2  font-cabin">
    {/* <div className="w-auto min-w-[400px] lg:max-w-[896px]  h-auto  lg:min-h-[56px] rounded-xl border-[1px] border-b-gray"> */}
    <div className="w-auto min-w-[400px] lg:w-[896px]  h-auto  lg:min-h-[56px] rounded-xl border-[1px] border-b-gray">
      <div className='w-auto max-w-[932px]  rounded-md'>
<div className="w-auto max-w-[900px] bg-white-100 h-auto max-h-[180px] lg:h-[52px] flex flex-col lg:flex-row items-start lg:items-center justify:start lg:justify-center border-b-[1px] m-2 border-b-gray">    
<div className='flex flex-auto flex-row w-full justify-between gap-2'>
<div className='flex flex-1 flex-col lg:flex-row gap-2'>
{/* Trip Title */}

<div className="flex h-[52px] items-center justify-start w-auto lg:w-[221px] py-3 px-2 order-1">
<div className=" lg:text-[16px] text-[14px] text-left font-medium tracking-[0.03em] leading-normal text-gray-A300 font-cabin lg:truncate ">
{/* <div className="  lg:text-[16px] text-[14px] px-2 py-3  font-medium tracking-[0.03em] leading-normal text-gray-A300 font-cabin "> */}
{/* {travelName} */}
{travelName}
</div>
</div> 

{/* Date */}
<div className="flex  h-[52px] w-auto min-w-[221px]  items-center justify-start py-3 gap-1  lg:px-0 order-3 lg:order-2">
<div className=' lg:ml-0 lg:px-0'>
<img src={calender} alt="calendar" className="w-[16px]"/>
</div>
<div className=" tracking-[0.03em] leading-normal text-gray-A300 text-[14px]">
{/* {departureDate} to {returnDate} */}
{departureDate} to {returnDate}
</div>
</div>
{/* Origin and Destination */}
<div className="flex w-auto flex-col justify-center items-start lg:items-center min-w-[161px] h-[52px] py-3 px-3 order-2 lg:order-3">
<div className="flex  text-xs text-gray-A300 font-medium">
<div>{to}</div>
<img src={double_arrow} alt="double arrow" />
<div>{from}</div>
</div>
</div>
</div>

{/* <div className='flex flex-col-reverse justify-between lg:flex-row'> */}



{/* <div className='flex flex-col-reverse justify-between lg:items-center items-end flex-1 lg:flex-row gap-2 '> */}
{/* Status */}
{/* <div className="flex  h-[52px] px-6 py-3 items-center justify-center min-w-[132px] w-auto">

<div className={`flex items-center px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] ${
getStatusClass(status)
}`}
>
Clear Request

</div>

</div> */}

 
       <div className="flex-1 flex items-center justify-end py-2 px-3">
         <b className="text-purple-500 text-[14px] tracking-[0.02em] w-[98px] font-bold">
           {/* Take Action */}
           Clear Request
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
</div>
</div>
<div className='h-auto'>
{cashAdvance.map((caDetails,index)=>(
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

{caDetails.details.map((currencyDetails,index)=>(
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
{/* <div className='w-[100px] py-2 px-3 flex justify-center items-center'>
<div className={`w-auto max-w-[200px] font-medium text-sm text-red-700`}>
Cancel
</div>
</div> */}
</div>
</>
))}
</div>
</div>
</div>
      </>
    
  
   </>
    
  )
}

export default RejectedTravel
