

import React from 'react'
import { cab_purple,double_arrow,validation_sym } from '../assets/icon';
const Itinerary = ({icon})=>{
    const cabs = [
      {
        date: "2023-12-01",
        class: "Sedan",
        preferredTime: "10:00 AM",
        pickupAddress: "Office Address",
        dropAddress: "Hotel X",
        violations: {
          class: "None",
          amount: "0",
        },
        modified: false,
        isCancelled: false,
        status: "draft",
        bookingDetails: {
          docURL: "http://example.com/document.pdf",
          docType: "PDF",
          billDetails: {},
        },
      },
      {
        date: "2023-12-02",
        class: "SUV",
        preferredTime: "2:30 PM",
        pickupAddress: "Home Address",
        dropAddress: "Shopping Mall",
        violations: {
          class: "Minor",
          amount: "50",
        },
        modified: true,
        isCancelled: false,
        status: "confirmed",
        bookingDetails: {
          docURL: "http://example.com/invoice.pdf",
          docType: "PDF",
          billDetails: {},
        },
      },
      {
        date: "2023-12-03",
        class: "Hatchback",
        preferredTime: "1:00 PM",
        pickupAddress: "Airport",
        dropAddress: "Friend's House",
        violations: {
          class: "Major",
          amount: "200",
        },
        modified: false,
        isCancelled: true,
        status: "cancelled",
        bookingDetails: {
          docURL: "http://example.com/cancellation.pdf",
          docType: "PDF",
          billDetails: {},
        },
      },
      // Add more objects as needed
    ];
  
   return( 
   <div className='h-auto w-auto rounded-md border-[1px] border-slate-300 bg-slate-50 hover:border-purple-500'>     
    
      {/* <div className='flex flex-row py-3 px-2 divide-x'> */}
      {cabs.map((cab,index)=><React.Fragment key={index}>
        <div className='flex items-center flex-grow divide-x '>
       <div className='flex items-start justify-start  flex-col shrink w-auto md:w-[200px] mr-4'>
         <div className='flex items-center justify-center'>
         <div className='pl-2'>
           <img src={cab_purple} alt="calendar" width={16} height={16} />
         </div>
         <span className="ml-2 tracking-[0.03em] font-cabin leading-normal text-gray-800 text-xs md:text-sm">
          Class : 
          {cab.class}
         </span>
         </div>
         <div className='ml-4 max-w-[200px] w-auto'>
          {/* <span className='text-xs font-cabin'> */}
          <div className='ml-4 max-w-[200px] w-auto'>
      <span className='text-xs font-cabin '>
        {cab.date}, 
        {/* {cab.prefferedTime} */}
        {/* {hotelDetails.locationPreference !== undefined && hotelDetails.locationPreference !== '' ? hotelDetails.locationPreference : '-'} */}
      </span>
    </div>
    
    
          {/* </span> */}
         </div>
         <div>
    
         </div>
         
    
       </div>
      
      
       <div className='flex grow  items-center justify-center '>
         <div className="flex text-xs text-gray-800 font-medium px-2 gap-4 justify-around">
           <div className='flex flex-col text-lg font-cabin w-3/7  items-center text-center shrink '>
             <span className='text-xs'>Pick-Up</span>
             <span className=' '>
              {cab.pickupAddress}
              
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
    
              {cab.dropAddress}
              </span> 
    
           </div>
         </div>
       </div>
       <div 
      // onClick={handleOpenModal}
       className='p-3 bg-purple-50 rounded-full m-4 hover:bg-red-100'>
              <img src={validation_sym} alt="double arrow" width={20} height={20} />
        </div>
  
      
      
      </div>
      </React.Fragment>)}
     
      
      
     
     
     
      
      {/* </div>   */}
     
    
    
       </div>)
  
  }

  export default Itinerary