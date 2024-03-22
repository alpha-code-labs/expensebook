/* eslint-disable react/jsx-key */
// older component is commented below


// import React from 'react';
// import { getStatusClass ,titleCase } from '../../utils/handyFunctions';
// import {  calender, double_arrow } from '../../assets/icon'
// const CancelledTrip = ({trId ,travelName ,from , to,departureDate, returnDate,status,employeeName}) => {
//   return (
// <div className='flex flex-row gap-2 h-full w-auto border border-black'>
//   {/* <div className='flex flex-row gap-2 h-full w-auto border shrink border-black flex-grow'>
//     <div>
//       Submitter

//     </div>
//     <div>
//     TRIP#
//     </div>
//     <div>
//           TRIP DETAILS
//     </div>
//     <div>
//       DESTINATION

//     </div>
//     <div>
//       ACTION

//     </div>
    


//   </div> */}

// <table className="table-auto">
//   <thead>
//     <tr className='border border-black flex '>
//       <th><div className='px-2 py-3 w-full flex-1'> SUBMITTER</div></th>
//       <th><div className='px-2 py-3 w-full flex-1'>TRIP#</div></th>
//       <th><div className='px-2 py-3 w-full flex-1'>TRIP DETAILS</div></th>
//       <th><div className='px-2 py-3 w-full flex-1'>DESTINATION</div></th>
//       <th><div className='px-2 py-3 w-full flex-1'>ACTION</div></th>
//     </tr>
//   </thead>
//   <tbody>
//     <tr>
//       <td>
//         <div>
//           <div>
//              <p>Ashneer Grover</p>
//           </div>
//           <div>
//             on: 23-Dec-2023

//           </div>
//         </div>
//       </td>
//       <td>
//         <div>TR0008</div>
//       </td>
//       <td>
//         <div>
//         <div>
//         Trip Purpose for going to lucknow for Investors Meeting
//         </div>
//         <div className='inline-flex gap-1'> 
//           <img src={calender} alt='icon'/>
//           <div>
//             25-Dec-2023 to 25-Dec-2024
//           </div>

//         </div>
//         </div></td>
//       <td>
//         <div className='inline-flex gap-1'>
//          <p>
//          Lucknow  
//          </p>
//          <img src={double_arrow} alt='icon'/>
//          <p>
//          Sandila

//          </p>
//         </div>
//       </td>
//       <td>
//         <div>
//           <p>View Details</p>
//         </div>
//       </td>
//     </tr>  
//   </tbody>
// </table>

// </div>
//   )
// }

// export default CancelledTrip


import React,{useState,useEffect} from 'react';
import { getStatusClass ,titleCase, urlRedirection } from '../../utils/handyFunctions';
import {  airplane_1, calender, double_arrow, down_left_arrow, validation_sym } from '../../assets/icon'

import { useData } from '../../api/DataProvider';

const CancelledTrip = ({handleTrip ,tripId }) => {
//for get data from backend 
const {travelAdminData}=useData()

// const [tripData,setTripData]=useState(null)
// ///this is for backend data when we will get
// useEffect(()=>{
//   const tripsAndLineItemsData = travelAdminData?.travelRequests
//   setTripData(tripsAndLineItemsData)   
// },[travelAdminData])

//data with line item in this array
  const tripsData = [
    {
      tripId:"tr-sdffiuo",
      tripNumber:"TRAM00000001",
      tripStatus: 'paid and cancelled',      
    },
    {
      tripId:"tr-sdffiuo",
      tripNumber:"TRAM00000001",
      tripStatus: 'transit',
      itinerary:[{
        itineraryId:'87687',
        from:'newyork',
        to:'phoenix',
        status:'paid and cancelled'
      },{
        itineraryId:'tijfjhfjhf',
        from:'sydney',
        to:'seol',
        status:'paid and cancelled'
      }]
      
      
    }, {
      tripId:"tr-sdffiuo",
      tripNumber:"TRAM00000001",
      tripStatus: 'paid and cancelled',
      itinerary:[{
        itineraryId:'iti678sfd',
        from:'florida',
        to:'new delhi',
        status:'paid and cancelled'
      },{
        itineraryId:'itinesdhfjh',
        from:'new delhi',
        to:'new delhi',
        status:'paid and cancelled'
      }]
      
      
    },
  ];

  return (
   
 <>
   {tripsData.map((item, index)=>(
      <React.Fragment>
         <div>

<>
<div className='border-x border-b-gray max-w-[900px] mx-4 m-2'>
<div className="flex  flex-row   w-auto max-w-[900px] items-center  bg-white-100 h-auto max-h-[200px] lg:h-[52px] md:justify-between justify-between    border-b-[1px]    border-b-gray">    
{/* <div className='flex  flex-row w-auto  gap-2'> */}
<div className='flex  flex-col md:flex-row sm:gap-0 md:gap-4 lg:gap-4 xl:gap-6'>



{/* date  */}
{/* <div className="flex gap-1 max-w-[120px]  h-auto md:h-fit   w-auto   items-center justify-start py-0 pt-3  md:py-3 px-2 ">
<div className=''>
<img src={calender} alt="calendar" className="w-[16px]"/>
</div>
<div className=" tracking-[0.03em] leading-normal text-neutral-800 text-[12px]  w-[100px]">

{departureDate}
</div>
</div> */}

{/* <div className="flex w-[200px] lg:w-[120px] md:w-auto md:min-w-[100px] h-[52px] items-center justify-start    py-0 md:py-3 px-2 order-1 gap-2">    
<div className=" text-[16px] md:text-[12px] text-left font-medium tracking-[0.03em] leading-normal text-neutral-800 font-cabin  md:w-[150px] w-[200px] md:truncate   ">
{employeeName}
</div>
</div>  */}
{/* Trip Title */}
{/* md:w-[190px]  xl:w-[200px] lg:[100px] */}
<div className="flex h-[52px] w-auto min-w-[100px]  items-center justify-start  py-0 md:py-3 px-2 order-1 gap-2">
{/* xl:w-auto lg:w-[100px] md:w-[170px] md:min-w-[180px] */}
<div className=" md:text-[14px] w-auto     text-[16px] text-left font-medium tracking-[0.03em] leading-normal text-neutral-800 font-cabin  ">
{item?.tripNumber}
</div>
</div> 

{/* Trip department */}

 {/* <div className="flex flex-1 h-[52px] px-2 py-3 items-center justify-center  w-auto">
  
  <div className={`flex items-center px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] ${
     getStatusClass(item.tripStatus)
    }`}
  >
    {titleCase(item.tripStatus)}
    
  </div>

</div> */}


{/* Date */}
{/* <div className="flex   h-[52px] w-auto min-w-[140px] max-w-[240px]  items-center justify-start py-0 md:py-3 gap-1 px-0 lg:px-2 order-3 lg:order-2">
<div className='pl-2 md:pl-0'>
<img src={calender} alt="calendar" className="w-[16px]"/>
</div>
<div className=" tracking-[0.03em] leading-normal text-neutral-800 text-[12px]">

{departureDate} to {returnDate}
</div>
</div> */}

{/* Origin and Destination */}
{/* <div className="flex w-auto flex-col justify-center items-start md:items-center lg:items-center min-w-[130px] h-auto md:h-[52px]  py-0 md:py-3 px-2 order-2 md:order-3">
<div className="flex w-[130px] xl:w-auto xl:min-w-[130px] text-xs text-neutral-800 font-medium truncate">
<div>{to}</div>
<img src={double_arrow} alt="double arrow"/>
<div>{from}</div>
</div>
</div> */}
</div>

<div className='flex   items-end md:items-center justify-around    flex-col md:flex-row gap-2'>
{item?.tripStatus == 'paid and cancelled' &&
<div className="flex h-[52px]  items-center justify-start md:w-[190px]  xl:w-[200px] lg:[100px] py-0 md:py-3 px-2  gap-2">
<div className={`flex items-center px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] ${
     getStatusClass(item?.tripStatus)
    }`}
  >
    {titleCase(item?.tripStatus ?? "")}
    
  </div>
</div> }
{/* View Details */}
<div className="rounded-[32px] box-border w-[140px]  h-[52px] flex flex-row items-center justify-center  cursor-pointer " onClick={()=>handleTrip(tripId,"trip-recovery-view")}>
<div className="font-bold text-[14px]  min-w-[72px] truncate w-auto max-w-[140px]   lg:truncate   h-[17px] text-purple-500 text-center">
View Details
</div>
</div>
</div>


{/* </div> */}

</div>
<>
{/* <div className='flex flex-row items-center ml-0   lg:ml-32  sm:ml-28 gap-2 text-gray-200'>
<div className='w-auto  mi min-w-[20px] flex justify-center items-center px-3 py-3 '>
<img className='w-6 h-[20px] translate-y-[-2px]' src={down_left_arrow}/>


</div>

<div className='w-auto max-w-[100px] flex justify-center items-center px-3 py-2'>


<img src={airplane_1} alt='icon' width={20} height={20}/>
</div>

<div className=' flex justify-center items-center w-auto min-w-[130px] h-[44px] px-3 py-2 sr-only  sm:not-sr-only'>
<div className=' tracking-[0.03em] leading-normal text-[14px] text-center'>
12-Dec-2023
</div>
</div>
<div className='w-auto max-w-[100px] flex justify-center items-center px-3 py-2'>


<div className='  text-[14px] tracking-[0.02em]  font-bold inline-flex'>
<span>Lucknow </span>
<img src={double_arrow} alt='icon'/>
<span>Lucknow </span>
</div>
</div>
<div className="rounded-[32px] box-border w-[140px]  h-[52px] flex flex-row items-center justify-center  cursor-pointer " onClick={()=>(urlRedirection(RECOVERY_TRIP))}>
<div className="font-bold text-[14px]  min-w-[72px] truncate w-auto max-w-[140px]   lg:truncate   h-[17px] text-purple-500 text-center">
View Details
</div>
</div>

</div> */}
</>
</div>

<div>

</div>
{/* </div> */}

{/* </div> */}
</>

{/* //   ))}
</div> */}
<div className='h-auto'>
  {item?.itinerary && item?.itinerary.map((itnItem,index)=>(
    <>
    <div key={index} className='flex flex-row items-center ml-0   lg:ml-32  sm:ml-28 gap-2 text-gray-200'>
  <div className='w-auto  mi min-w-[20px] flex justify-center items-center px-3 py-3 '>
  <img className='w-6 h-[20px] translate-y-[-2px]' src={down_left_arrow}/>
      
      
  </div>
  
  <div className='w-auto min-w-[200px] flex justify-center items-center px-3 py-2'>
 
  
    <div className='  text-[14px] tracking-[0.02em]  font-bold'>
       {itnItem.itineraryId}
      </div>
  </div>
  {/* <div className=' flex justify-center items-center w-auto min-w-[130px] h-[44px] px-3 py-2 sr-only  sm:not-sr-only'>
    <div className=' tracking-[0.03em] leading-normal text-[14px] text-center'>
      {item.date}
    </div>
  </div>  */}
  <div className='flex w-auto sm:w-[170px] min-w-[120px] justify-center items-center px-0 sm:py-2 sm:px-3 font-cabin gap-2'>
    {/* <div className='w-5 h-5'>
    {item.violation.length>0 ?(
    <img src={validation_sym} alt='three dot' className='w-[20px] h-[20px] ' />
    ) :""}
    </div> */}
  {/* <div className=' '>
    
      {item?.amountdetails.map((item,index)=>(
      <>
      <div className='text-[14px]'>
      {item.currency}
      {item.amount},
      </div>
      </>
    ))}
  </div> */}
</div>

{item.tripStatus !== 'paid and cancelled' &&
<div className={`flex items-center px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] ${
     getStatusClass(itnItem?.status)
    }`}
  >
    {titleCase(itnItem?.status ?? "")}
    
  </div> }

  {item?.tripStatus && item?.tripStatus ==='pending approval' && itnItem.status=='pending approval' &&
   <div onClick={()=>handleTrip(tripId,"trip-recovery-view")} className="flex-1 flex items-center justify-end py-2 px-3 cursor-pointer">
   <b className="text-purple-500 text-[14px] tracking-[0.02em] w-[98px] font-bold">
     View Details
     
   </b>
 </div>}
  </div>
    </>
  ))}
  </div>


</div>
      </React.Fragment>
    ))
    
    
   }
 </>
  )
}

export default CancelledTrip

// import React from 'react';
// import { getStatusClass ,titleCase } from '../../utils/handyFunctions';
// import {  calender, double_arrow } from '../../assets/icon';
// const CancelledTrRequest = ({trId ,travelName ,from , to,departureDate, returnDate,status,employeeName}) => {
//   return (
//     <div>
// {/* <div className='h-[360px] overflow-y-auto overflow-x-hidden mt-6'>
//             {tripArray.map((travelDetails ,index)=>( */}
//               <>
//             <div className="box w-auto max-w-[896px] h-auto  mx-2 sm:mx-4 mb-2  font-cabin">
   
//             <div className='w-auto max-w-[932px]  rounded-md'>
//     <div className="w-auto max-w-[900px] bg-white-100 h-auto max-h-[200px] lg:h-[52px] flex flex-col lg:flex-row items-start lg:items-center justify:start lg:justify-center border-b-[1px] m-2 border-b-gray">    
//     <div className='flex  flex-row w-full  gap-2'>
//     <div className='flex flex-col md:flex-row '>
    
//     {/* date  */}
//     <div className="flex   h-[52px] w-auto   items-center justify-start py-0 md:py-3 gap-1 px-0 lg:px-2 ">
//       <div className='pl-2 md:pl-0'>
//       <img src={calender} alt="calendar" className="w-[16px]"/>
//       </div>
//       <div className=" tracking-[0.03em] leading-normal text-neutral-800 text-[12px]  w-[100px]">
      
//         {departureDate}
//       </div>
//     </div>

//     <div className="flex w-[200px] lg:w-[120px] md:w-auto md:min-w-[100px] h-auto md:h-[52px] items-center justify-start    py-0 md:py-3 px-2 order-1 gap-2">
//     {/* <div className="flex w-auto lg:w-[120px] min-w-[100px]    lg:min-w-[100px]  h-auto md:h-[52px] items-center justify-start    py-0 md:py-3 px-2 order-1 gap-2"> */}
     
//      <div className=" text-[16px] md:text-[12px] text-left font-medium tracking-[0.03em] leading-normal text-neutral-800 font-cabin  md:w-[150px] w-[200px] md:truncate  truncate ">
//       {employeeName}
//      </div>
//     </div> 
// {/* Trip Title */}
//     <div className="flex h-[52px]  items-center justify-start md:w-[190px]  xl:w-[200px] lg:[100px] py-0 md:py-3 px-2 order-1 gap-2">
//       <div className=" md:text-[14px] w-auto    xl:w-auto lg:w-[100px] md:w-[170px] md:min-w-[180px] text-[16px] text-left font-medium tracking-[0.03em] leading-normal text-neutral-800 font-cabin lg:truncate md:truncate  ">
//        {travelName}
//       </div>
//     </div> 

// {/* Date */}
//     <div className="flex   h-[52px] w-auto xl:w-[150px]  xl:min-w-[210px]  items-center justify-start py-0 md:py-3 gap-1 px-0 lg:px-2 order-3 lg:order-2">
//       <div className='pl-2 md:pl-0'>
//       <img src={calender} alt="calendar" className="w-[16px]"/>
//       </div>
//       <div className=" tracking-[0.03em] leading-normal text-neutral-800 text-[12px]">
      
//         {departureDate} to {returnDate}
//       </div>
//     </div>

// {/* Origin and Destination */}
//     <div className="flex w-auto flex-col justify-center items-start lg:items-center min-w-[130px] h-auto md:h-[52px]  py-0 md:py-3 px-2 order-2 md:order-3">
//       <div className="flex w-[130px] xl:w-auto xl:min-w-[130px] text-xs text-neutral-800 font-medium truncate">
//         <div>{to}</div>
//         <img src={double_arrow} alt="double arrow"/>
//         <div>{from}</div>
//       </div>
//     </div>
//     </div>
//  <div className='flex flex-1  items-end md:items-center justify-around    flex-col-reverse md:flex-row gap-2'>
//  {/* Status */}

//  {/* <div className="flex  h-[52px] px-2 py-3 items-center justify-center  w-[100px]">
  
//   <div className={`flex text-center px-2 justify-center  pt-[6px] w-[100px] pb-2 py-3 rounded-[12px] text-[14px]  truncate font-medium tracking-[0.03em] ${
//      getStatusClass(status)
//     }`}
//   >
//     {titleCase(status)}
    
//   </div>

// </div> */}

// <div className="rounded-[32px] w-auto box-border h-[33px] flex flex-row items-center justify-center py-4 px-2 cursor-pointer ">
//       <div className="font-bold text-[14px] min-w-[72px] truncate xl:w-auto  lg:truncate lg:w-[72px]  h-[17px] text-purple-500 text-center">View Details</div>
//     </div>



  


//  </div>
    
   
// </div>
//   </div>
//   </div>

//       </div>
//               </>
//           {/* //   ))}
//            </div> */}
      
//     </div>
//   )
// }

// export default CancelledTrRequest
