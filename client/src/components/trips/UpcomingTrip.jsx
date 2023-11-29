import React from 'react';
import { calender, double_arrow , intransit_trip , upcoming_trip} from '../../assets/icon';


export const UpcomingContent = ({ travelName, from, to, departureDate, returnDate }) => {
    
  
  return (
    <>
     {/* <div  className="absolute top-[75px] left-[24px] flex flex-col items-start justify-start gap-[24px] text-sm text-darkslategray"> */}
                  <div className="box-border w-[410px] flex flex-row items-start justify-between pt-0 px-0 pb-6 border-b-[1px] border-solid border-ebgrey-100">
                    <div className="flex flex-col items-start justify-start gap-[12px] text-gray-400">
                      <div className="relative tracking-[0.03em] font-medium">
                        {travelName}
                      </div>
                      <div className="flex flex-col items-start justify-start gap-[16px] text-xs text-gray-300">
                        <div className="flex flex-row items-end justify-start gap-[8px]">
                          <div className="relative">{from}</div>
                          <img
                            className="relative w-4 h-4 overflow-hidden shrink-0"
                            alt=""
                            src={double_arrow}
                          />
                          <div className="relative">{to}</div>
                        </div>
                        <div className="flex flex-row items-end justify-start gap-[4px]">
                          <img
                            className="relative w-4 h-4 overflow-hidden shrink-0"
                            alt=""
                            src={calender}
                          />
                          <div className="flex flex-row items-start justify-start gap-[8px]">
                            <div className="relative">{departureDate}</div>
                            <div className="relative">{`to `}</div>
                            <div className="relative">{returnDate}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="rounded-[32px] box-border h-[33px] flex flex-row items-center justify-center py-4 px-4 relative text-center text-purple-500 border-[1px] border-solid border-purple-500">
                      <div className="absolute my-0 mx-[!important] top-[8px] left-[16px] font-medium z-[0]">
                        View Trip
                      </div>
                    </div> */}
                    <div className='float-right'>
                                   <div  className="w-full h-[33px] px-4 border border-purple-500 text-purple-500  rounded-[32px] justify-center items-center  inline-flex cursor-pointer">
        <div className= "w-full h-5 text-center  text-[14px] font-medium font-cabin">
            View Trip

        </div>
      
    </div>

    
                  </div>
                  </div>
                 
                  
                {/* </div> */}
    </>
  )
}



export const NoUpcomingContent = () => (
  <div className='w-[200px]'>
    <img src={upcoming_trip} alt="NoTrip" />
    <div className="absolute top-[140px] w-[200px] mr-48 flex flex-col justify-center items-start gap-4 text-gray-400">
       <div className="flex flex-col items-start justify-center ">
         <div className="tracking-[0.02em] ">You have no upcoming trips, yet</div>
       </div>
       {/* <ActionButton label="View previous" /> */}
       <div className="rounded-lg h-8 flex flex-row items-center justify-center py-4 px-0 box-border text-center text-sm text-gray-400">
         <b className="relative tracking-[0.02em]">Create</b>
        </div>
     </div>
  </div>
  // <div className="absolute flex flex-row self-stretch top-[72px] left-[23px] items-start justify-start gap-[16px] text-sm">
  //   <img src={intransit_trip} alt="NoTrip" />
  //   <div className="absolute top-[140px] w-[191px] flex flex-col justify-center items-start gap-4 text-gray-400">
  //     <div className="flex flex-col items-start justify-center">
  //       <div className="tracking-[0.02em]">No trips in transit right now</div>
  //     </div>
  //     {/* <ActionButton label="View previous" /> */}
  //     <div className="rounded-lg h-8 flex flex-row items-center justify-center py-4 px-0 box-border text-center text-sm text-gray-400">
  //       <b className="relative tracking-[0.02em]">View previous</b>
  //      </div>
  //   </div>
  // </div>
);


