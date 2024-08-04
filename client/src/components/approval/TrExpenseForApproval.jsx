import React from 'react';
import { getStatusClass ,titleCase } from '../../utils/handyFunctions';
import {  calender_icon, double_arrow } from '../../assets/icon'
const TrExpenseForApproval = ({trId ,travelName ,from , to,departureDate, returnDate,status,employeeName}) => {
  return (
    <div>
{/* <div className='h-[360px] overflow-y-auto overflow-x-hidden mt-6'>
            {tripArray.map((travelDetails ,index)=>( */}
              <>
            <div className="box w-auto max-w-[896px] h-auto  mx-2 sm:mx-4 mb-2  font-cabin">
   
            <div className='w-auto max-w-[932px]  rounded-md'>
    <div className="w-auto max-w-[900px] bg-white h-auto max-h-[200px] lg:h-[52px] flex flex-col lg:flex-row items-start lg:items-center justify:start lg:justify-center border-b-[1px] m-2 border-b-gray">    
    <div className='flex  flex-row w-full  gap-2'>
    <div className='flex flex-col md:flex-row '>
    
    {/* date  */}
    <div className="flex   h-[52px] w-auto   items-center justify-start py-0 md:py-3 gap-1 px-0 lg:px-2 ">
      <div className='pl-2 md:pl-0'>
      <img src={calender_icon} alt="calendar" className="w-[16px]"/>
      </div>
      <div className=" tracking-[0.03em] leading-normal text-neutral-800 text-[12px]  w-[100px]">
      
        {departureDate}
      </div>
    </div>

    <div className="flex w-[200px] lg:w-[120px] md:w-auto md:min-w-[100px] h-auto md:h-[52px] items-center justify-start    py-0 md:py-3 px-2 order-1 gap-2">
    {/* <div className="flex w-auto lg:w-[120px] min-w-[100px]    lg:min-w-[100px]  h-auto md:h-[52px] items-center justify-start    py-0 md:py-3 px-2 order-1 gap-2"> */}
     
     <div className=" text-[16px] md:text-[12px] text-left font-medium tracking-[0.03em] leading-normal text-neutral-800 font-cabin  md:w-[150px] w-[200px] md:truncate  truncate ">
      {employeeName}
     </div>
    </div> 
{/* Trip Title */}
    <div className="flex h-[52px]  items-center justify-start md:w-[190px]  xl:w-[200px] lg:[100px] py-0 md:py-3 px-2 order-1 gap-2">
      <div className=" md:text-[14px] w-auto    xl:w-auto lg:w-[100px] md:w-[170px] md:min-w-[180px] text-[16px] text-left font-medium tracking-[0.03em] leading-normal text-neutral-800 font-cabin lg:truncate md:truncate  ">
       {travelName}
      </div>
    </div> 

{/* Date */}
    <div className="flex   h-[52px] w-auto xl:w-[150px]  xl:min-w-[210px]  items-center justify-start py-0 md:py-3 gap-1 px-0 lg:px-2 order-3 lg:order-2">
      <div className='pl-2 md:pl-0'>
      <img src={calender_icon} alt="calendar" className="w-[16px]"/>
      </div>
      <div className=" tracking-[0.03em] leading-normal text-neutral-800 text-[12px]">
      
        {departureDate} to {returnDate}
      </div>
    </div>

{/* Origin and Destination */}
    <div className="flex w-auto flex-col justify-center items-start lg:items-center min-w-[130px] h-auto md:h-[52px]  py-0 md:py-3 px-2 order-2 md:order-3">
      <div className="flex w-[130px] xl:w-auto xl:min-w-[130px] text-xs text-neutral-800 font-medium truncate">
        <div>{to}</div>
        <img src={double_arrow} alt="double arrow"/>
        <div>{from}</div>
      </div>
    </div>
    </div>
 <div className='flex flex-1  items-end md:items-center justify-around    flex-col-reverse md:flex-row gap-2'>
 {/* Status */}

 {/* <div className="flex  h-[52px] px-2 py-3 items-center justify-center  w-[100px]">
  
  <div className={`flex text-center px-2 justify-center  pt-[6px] w-[100px] pb-2 py-3 rounded-[12px] text-[14px]  truncate font-medium tracking-[0.03em] ${
     getStatusClass(status)
    }`}
  >
    {titleCase(status)}
    
  </div>

</div> */}

<div className="rounded-[32px] w-auto box-border h-[33px] flex flex-row items-center justify-center py-4 px-2 cursor-pointer ">
      <div className="font-bold text-[14px] min-w-[72px] truncate xl:w-auto  lg:truncate lg:w-[72px]  h-[17px] text-purple-500 text-center">View Details</div>
    </div>



  


 </div>
    
   
</div>
  </div>
  </div>

      </div>
              </>
          {/* //   ))}
           </div> */}
      
    </div>
  )
}

export default TrExpenseForApproval

// <div className='h-[360px] overflow-y-auto overflow-x-hidden mt-6'>
//             {tripArray.map((travelDetails ,index)=>(
//               <>
//             <div className="box w-auto max-w-[896px] h-auto  mx-2 sm:mx-4 mb-2  font-cabin">
   
//             <div className='w-auto max-w-[932px]  rounded-md'>
//     <div className="w-auto max-w-[900px] bg-white h-auto max-h-[200px] lg:h-[52px] flex flex-col lg:flex-row items-start lg:items-center justify:start lg:justify-center border-b-[1px] m-2 border-b-gray">    
//     <div className='flex  flex-row w-full  gap-2'>
//     <div className='flex flex-col md:flex-row '>
    
// {/* Trip Id */}
//     <div className="flex w-auto lg:w-[80px] h-auto md:h-[52px] items-center justify-start min-w-[60px]   py-0 md:py-3 px-2 order-1 gap-2">
     
//      <div className=" text-[16px] md:text-[12px] text-left font-medium tracking-[0.03em] leading-normal text-neutral-800 font-cabin lg:truncate">
//       #{travelDetails.trId}
//      </div>
//     </div> 
// {/* Trip Title */}
//     <div className="flex h-[52px]  items-center justify-start [210px]  xl:w-[200px] lg:[100px] py-0 md:py-3 px-2 order-1 gap-2">
//       <div className=" md:text-[14px] w-auto    xl:w-auto lg:w-[100px] md:w-[200px] text-[16px] text-left font-medium tracking-[0.03em] leading-normal text-neutral-800 font-cabin lg:truncate md:truncate  ">
//        {travelDetails.travelName}
//       </div>
//     </div> 

// {/* Date */}
//     <div className="flex   h-[52px] w-auto xl:w-[150px]  xl:min-w-[210px]  items-center justify-start py-0 md:py-3 gap-1 px-0 lg:px-2 order-3 lg:order-2">
//       <div className='pl-2 md:pl-0'>
//       <img src={calender_icon} alt="calendar" className="w-[16px]"/>
//       </div>
//       <div className=" tracking-[0.03em] leading-normal text-neutral-800 text-[12px]">
      
//         {travelDetails.departureDate} to {travelDetails.returnDate}
//       </div>
//     </div>

// {/* Origin and Destination */}
//     <div className="flex w-auto flex-col justify-center items-start lg:items-center min-w-[130px] h-auto md:h-[52px]  py-0 md:py-3 px-2 order-2 lg:order-3">
//       <div className="flex w-[130px] xl:w-auto xl:min-w-[130px] text-xs text-neutral-800 font-medium truncate">
//         <div>{travelDetails.to}</div>
//         <img src={double_arrow} alt="double arrow"/>
//         <div>{travelDetails.from}</div>
//       </div>
//     </div>
//     </div>
//  <div className='flex flex-1  items-end md:items-center justify-around    flex-col-reverse md:flex-row gap-2'>
//  {/* Status */}

//  <div className="flex  h-[52px] px-2 py-3 items-center justify-center  w-[100px]">
  
//   <div className={`flex text-center px-2 justify-center  pt-[6px] w-[100px] pb-2 py-3 rounded-[12px] text-[14px]  truncate font-medium tracking-[0.03em] ${
//      getStatusClass(travelDetails.status)
//     }`}
//   >
//     {titleCase(travelDetails.status)}
    
//   </div>

// </div>

// <div className="rounded-[32px] w-auto box-border h-[33px] flex flex-row items-center justify-center py-4 px-2 cursor-pointer border-[1px] border-solid border-purple-500">
//       <div className="font-semibold text-[12px] min-w-[72px] truncate xl:w-auto  lg:truncate lg:w-[72px]  h-[17px] text-purple-500 text-center">Request Advance</div>
//     </div>
//  </div>
    
   
// </div>
//   </div>
//   </div>


 
//       </div>
//               </>
//             ))}
//            </div>