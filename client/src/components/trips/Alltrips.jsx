import React from 'react';
import { calender_icon, double_arrow ,all_trips} from '../../assets/icon';
import { titleCase } from '../../utils/handyFunctions';

export const Alltrips = ({ travelName, from, to, departureDate, returnDate ,status }) => {
  
  function getStatusClass(){
    switch(status){
      case "approved":
        return 'bg-green-100 text-green-200';
      case "rejected":
      case "cancelled":  
        return 'bg-red-100 text-red-900';
      case "pending":
        return 'bg-yellow-100 text-yellow-200';
      default:
        return " ";  

    }
  }

  return (
    <>
    <div className='w-932 overflow-auto overflow-x-hidden'>
    <div className=" w-[932px] top-[73px] left-0 bg-white h-[52px] flex flex-row items-center justify-start pl-2  border-b-[1px] border-gray-800">
    
    {/* Trip Title */}

    <div className="flex h-[52px] items-center justify-start py-3 px-8  w-[211px]">
      <div className=" flex items-start text-[14px] font-medium tracking-[0.03em] leading-normal text-neutral-800">
        {travelName}
      </div>
    </div>
  
    {/* Date */}
    
    <div className="flex h-[52px] w-[222px]  items-center justify-start py-3 gap-1 ">
      <img src={calender_icon} alt="calendar" className="w-[16px]" />
      <div className=" tracking-[0.03em] leading-normal text-neutral-800 text-[14px]">
        {departureDate} to {returnDate}
      </div>
    </div>
  
    {/* Origin and Destination */}

    <div className="flex flex-col justify-start items-start w-[161px] px-3">
      <div className="flex  text-xs text-neutral-800 font-medium">
        <div>{from}</div>
        <img src={double_arrow} alt="double arrow" />
        <div>{to}</div>
      </div>
    </div>
    
  
    {/* Status */}
    <div className="flex h-[52px] px-6 items-center justify-start w-[132px]">
  
  <div className={`flex items-center px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] ${
     getStatusClass(status)
    }`}
  >
    {titleCase(status)}
  </div>

</div>


  
    {/* View Details Button */}
    <div className="h-[52px] flex flex-col items-center justify-start text-center">
      <div className="flex-1 flex items-center justify-center py-2 px-6">
        <b className="text-purple-500 text-[14px] tracking-[0.02em] w-[98px] font-bold">
          View Details
        </b>
      </div>
    </div>
  </div>
  </div>
  </>
  )
}


export const NoTripContent = ()=>(
  <div className=''>
          <div className="absolute flex flex-row self-stretch top-[72px] left-[396px] items-start justify-start gap-[16px] text-sm">
    <img src={all_trips} alt="NoTrip" />
    <div className="absolute top-[140px] w-[191px] flex flex-col justify-center items-start gap-4 text-gray-400">
      <div className="flex flex-col items-start justify-center">
        <div className="tracking-[0.02em]">No trips in transit right now</div>
      </div>
      {/* <ActionButton label="View previous" /> */}
      <div className="rounded-lg h-8 flex flex-row items-center justify-center py-4 px-0 box-border text-center text-sm text-gray-400">
        <b className="relative tracking-[0.02em]">View previous</b>
       </div>
    </div>
  </div>
</div>
)

