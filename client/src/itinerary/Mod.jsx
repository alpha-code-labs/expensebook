import React from 'react'
import { double_arrow,airplane,validation_sym ,cab_purple} from '../assets/icon';

const Mod = ({approvalDetails}) => {

  return (
    <>
    <div className='border-[1px] border-slate-300 bg-slate-50 rounded-xl px-2 py-2'>
                 {/* departure */}
                {approvalDetails.embdedTravelRequest.itinerary.map((tripData, index)=>(
                <React.Fragment key={index}>
                <div className='flex items-center flex-grow border-b border-dashed border-gray-800 '>
                   
                   <div className='flex items-start justify-start flex-col shrink w-auto md:w-[200px] mr-4'>
                     <div className='flex items-center justify-center mb-2'>
                       
                       
                       <span className="ml-4 tracking-[0.03em] font-cabin leading-normal text-gray-800 text-sm">
                         Class: {tripData.travelClass}
                         
                       </span>
                     </div>
                     <div className=' max-w-[200px] w-auto'>
                       <span className='text-xs font-cabin'>
                         <div className='ml-4 max-w-[200px] w-auto'>
                           <span className='text-xs font-cabin'>
                             {tripData.departure.date}, {tripData.departure.time}
                           </span>
                         </div>
                       </span>
                     </div>
                   </div>
                   <div className='flex grow  items-center justify-center '>
                     <div className="flex text-xs text-gray-800 font-medium px-2 gap-4 justify-around">
                       <div className='flex text-lg font-cabin w-3/7 items-center text-center'>
                         <span className=''>
                           {tripData.departure.from}
                           </span>
                       </div>
                       <div className='flex justify-center items-center  min-w-[20px] min-h-[20px]'>
                         <div className='p-2 bg-slate-100 rounded-full'>
                           <img src={double_arrow} alt="double arrow" width={16} height={16} />
                         </div>
                       </div>
                       <span className='flex text-lg font-cabin w-3/7 items-center text-center'>
                         {tripData.departure.to}
                
                       </span>
                     </div>
                   </div>
                   <div>
                   <div 
     // onClick={handleOpenModal}
      className='p-3 bg-purple-50 rounded-full m-4 hover:bg-red-100'>
             <img src={validation_sym} alt="double arrow" width={20} height={20} />
       </div>
                   </div>
                </div>
                 </React.Fragment>
                 ))}
                 {/* //return */}


   {approvalDetails.embdedTravelRequest.itinerary.map((returnData, returnIndex) =>
  returnData.return && (
    returnData.return.from !== "" &&
    returnData.return.to !== "" &&
    returnData.return.date !== "" &&
    returnData.return.time !== "" && (
      <React.Fragment key={returnIndex}>
                 
                  <div className='flex items-center flex-grow border-b border-dashed border-gray-800 min-h-[78px]'>
                   
                  <div className='flex items-start justify-start flex-col shrink w-auto md:w-[200px] mr-4'>
                    <div className='flex items-center justify-center mb-2'>
                      
                      
                      <span className="ml-4 tracking-[0.03em] font-cabin leading-normal text-gray-800 text-sm">
                        Class: 
                        {returnData.travelClass}
                      </span>
                    </div>
                    <div className=' max-w-[200px] w-auto'>
                      <span className='text-xs font-cabin'>
                        <div className='ml-4 max-w-[200px] w-auto'>
                          <span className='text-xs font-cabin'>
                            {returnData.return.date}, {returnData.return.time} 
                          </span>
                        </div>
                      </span>
                    </div>
                  </div>
                  <div className='flex grow  items-center justify-center '>
                    <div className="flex text-xs text-gray-800 font-medium px-2 gap-4 justify-around">
                      <div className='flex text-lg font-cabin w-3/7 items-center text-center'>
                        <span className=''>
                          {returnData.return.to}
                        </span>
                      </div>
                      <div className='flex justify-center items-center  min-w-[20px] min-h-[20px]'>
                        <div className='p-2 bg-slate-100 rounded-full'>
                          <img src={double_arrow} alt="double arrow" width={16} height={16} />
                        </div>
                      </div>
                      <span className='flex text-lg font-cabin w-3/7 items-center text-center'>
                      {returnData.return.from}
                      </span>
                    </div>
                  </div>
  <div>
{(returnData.modeOfTransitViolations.class.length > 0 || returnData.modeOfTransitViolations.amount.length > 0) && (
  <div className='p-3 bg-purple-50 rounded-full m-4 hover:bg-red-100'>
    <img src={validation_sym} alt="double arrow" width={20} height={20} />
    <p>{returnData.modeOfTransitViolations.class}</p>
    <p>{returnData.modeOfTransitViolations.amount}</p>
  </div>
)}
 </div>

                 
                </div>
                


                </React.Fragment>
    )
  )
)}

                 

                 {/* <div className='flex flex-wrap justify-between'>
                    
                    <div className='flex-1 px-2 py-2'>
                    <SubItinerary titleText={'Onboarding Transfer'} pickupTime={'09:00 am'} pickupAddress={'Saket Metro Station near goregoan , New Delhi'} dropAddress={'Panchkula Station , Dadari Majzid toota Quila Lucknow'}/>
 
                    </div>
                    <div className='flex-1 px-2 py-2'>
                    <SubItinerary titleText={'Hotel Transfer'} pickupTime={'09:00 am'} pickupAddress={'Saket Metro Station near goregoan , New Delhi'} dropAddress={'Panchkula Station , Dadari Majzid toota Quila Lucknow'}/>
 
                    </div>
 
                 </div> */}


    </div>
    </>
  )
}

export default Mod
