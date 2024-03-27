import React,{ useState } from "react";
import { tripCancellationApi } from "../utils/tripApi";
import {double_arrow, cab_purple, check_tick, check_circle, round_circle } from '../assets/icon'
import Modal from "../components/Modal";
import { formatDate } from "../utils/handyFunctions";


const CabDetails = ({selectedItineraryIds , handleSelect, cabsItinerary , travelRequest , actionBtnText , routeData ,handleOpenOverlay})=>{
  
   
  
  
    return (
  
  
      <>
 
 
  {/* <div className='Prefrence flex items-center w-full h-[40px] justify-end' /> */}
  {cabsItinerary.map((cab, cabIndex) => (
                  <React.Fragment key={cabIndex}>
  
      
      {/* </div> */}
  
  <div className='Itinenery mb-4 bg-slate-50  mt-2' >
     <div className='h-auto w-auto rounded-md border-[1px] border-slate-300 bg-slate-50 hover:border-purple-500'>     
  
    <div className='flex flex-row py-3 px-2 divide-x'>
    <div className='flex items-center flex-grow divide-x '>
     <div className='flex items-start justify-start  flex-col shrink w-auto md:w-[200px] mr-4'>
       {/* <div className='flex items-center justify-center mb-2'>
       <div className='pl-2'>
         <img src={cab_purple} alt="calendar" width={16} height={16} />
       </div>
       <span className="ml-2 tracking-[0.03em] font-cabin leading-normal text-gray-800 text-xs md:text-sm">
        Class : {cab.class}
       </span>
       </div> */}
       <div className='ml-4 max-w-[200px] w-auto'>
        <span className='text-xs font-cabin'>
        <div className='inline-flex gap-1 ml-4 max-w-[200px] w-auto'>
        <div className='pl-2'>
         <img src={cab_purple} alt="calendar" width={16} height={16} />
       </div>
    <span className='text-xs font-cabin '>
      {formatDate(cab.bkd_date)}, {cab.bkd_preferredTime}
      {/* {hotelDetails.locationPreference !== undefined && hotelDetails.locationPreference !== '' ? hotelDetails.locationPreference : '-'} */}
    </span>
  </div>
  
  
        </span>
       </div>
       <div>
  
       </div>
       
  
     </div>
    
    
     <div className='flex grow  items-center justify-center '>
       <div className="flex text-xs text-gray-800 font-medium px-2 gap-4 justify-around">
         <div className='flex flex-col text-lg font-cabin w-3/7  items-center text-center shrink '>
           <span className='text-xs'>Pick-Up</span>
           <span className=' '>
            {cab.bkd_pickupAddress}
            
           </span> 
         </div>
         <div className='flex justify-center items-center w-1/7 min-w-[20px] min-h-[20px]'>
           <div className='p-4 bg-slate-100 rounded-full'>
           <img src={double_arrow} alt="double arrow" width={20} height={20} />
           </div>
         </div>
    
         <div className='flex flex-col text-lg font-cabin w-3/7 items-center text-center'>
           <span className='text-xs'>Drop-Off</span>
           <span className=''>
  
            {cab.bkd_dropAddress}
          </span> 
  
         </div>
       </div>
     </div>
    
    
    </div>
    <div className="flex items-center justify-center m-4 pl-5">
    {new Date(cab.bkd_date) >= new Date() && (
      <div onClick={()=>handleSelect(cab.itineraryId)}>{selectedItineraryIds.includes(cab.itineraryId) ? <img src={check_circle} width={20} height={20} className="cursor-pointer"/>:<img src={round_circle} width={20} height={20} className="cursor-pointer"/>}</div>
    
    )}
    </div>
   
    
    </div>  
   
  
  
     </div>
     
    </div>
    </React.Fragment>
    
    ))}
    
 
  
  
    
  
     </>
    )
  }


  export default CabDetails