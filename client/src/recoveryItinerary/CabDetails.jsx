import React,{ useState } from "react";
import { tripRecoveryApi } from "../utils/tripApi";
import {double_arrow, cab_purple, check_tick, round_circle } from '../assets/icon'
import Modal from "../components/Modal";
import { formatDate } from "../utils/handyFunctions";


const CabDetails = ({tripStatus ,selectedItineraryIds , handleSelect, cabsItinerary })=>{

  
  
  
  
  
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
    {cab.status === "paid and cancelled" && tripStatus !== 'paid and cancelled' && (
      <div onClick={()=>handleSelect(cab.itineraryId)}>{selectedItineraryIds.includes(cab.itineraryId) ?<img src={check_tick} width={20} height={20}/>:<img src={round_circle} width={20} height={20}/>}</div>
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

// import React,{ useState } from "react";
// import {airplane_1, cab, calender, cancel, double_arrow, receipt ,location, cab_purple, airplane, train, bus } from '../assets/icon'
// import Modal from "../components/Modal";
// import {tripRecovery} from '../utils/tripApi';



// const CabDetails = ({onToggleCheck,isChecked, allCabs , travelRequest , actionBtnText , routeData,handleOpenOverlay})=>{
  
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedItineraryId,setSelectedItineraryId]= useState(null)
  
//     const handleOpenModal = (itineraryId) => {
//       setSelectedItineraryId(itineraryId)
//       setIsModalOpen(true);
//     };
  
//     const handleCloseModal = () => {
//       setIsModalOpen(false);
//     };


  
//     const handleCancel = () => {
//       // Handle the cancellation logic
//       console.log('Cancelled');
//     };
  
  
//     return (
  
  
//       <>
//    {travelRequest.itinerary.map((journey, journeyIndex) => (
//   <React.Fragment key={journeyIndex}>
//   <p>From: {journey.journey.from} | To: {journey.journey.to}</p>
//   {/* <div className='Prefrence flex items-center w-full h-[40px] justify-end' /> */}
//   {allCabs(journey).map((cab, cabIndex) => (
//                   <React.Fragment key={cabIndex}>
  
      
//       {/* </div> */}
  
//   <div className='Itinenery mb-4 bg-slate-50 mt-2' >
//      <div className='h-auto w-auto border border-slate-300 rounded-md'>     
  
//     <div className='flex flex-row py-3 px-2 divide-x'>
//     <div className='flex items-center flex-grow divide-x '>
//      <div className='flex items-start justify-start  flex-col shrink w-auto md:w-[200px] mr-4'>
//        <div className='flex items-center justify-center mb-2'>
//        <div className='pl-2'>
//          <img src={cab_purple} alt="calendar" width={16} height={16} />
//        </div>
//        <span className="ml-2 tracking-[0.03em] font-cabin leading-normal text-gray-800 text-xs md:text-sm">
//         Class : {cab.class}
//        </span>
//        </div>
//        <div className='ml-4 max-w-[200px] w-auto'>
//         <span className='text-xs font-cabin'>
//         <div className='ml-4 max-w-[200px] w-auto'>
//     <span className='text-xs font-cabin '>
//       {cab.date}, {cab.prefferedTime}
//       {/* {hotelDetails.locationPreference !== undefined && hotelDetails.locationPreference !== '' ? hotelDetails.locationPreference : '-'} */}
//     </span>
//   </div>
  
  
//         </span>
//        </div>
//        <div>
  
//        </div>
       
  
//      </div>
    
    
//      <div className='flex grow  items-center justify-center '>
//        <div className="flex text-xs text-gray-800 font-medium px-2 gap-4 justify-around">
//          <div className='flex flex-col text-lg font-cabin w-3/7  items-center text-center shrink '>
//            <span className='text-xs'>Pick-Up</span>
//            <span className=' '>
//             {cab.pickupAddress}
            
//            </span> 
//          </div>
//          <div className='flex justify-center items-center w-1/7 min-w-[20px] min-h-[20px]'>
//            <div className='p-4 bg-slate-100 rounded-full'>
//            <img src={double_arrow} alt="double arrow" width={20} height={20} />
//            </div>
//          </div>
    
//          <div className='flex flex-col text-lg font-cabin w-3/7 items-center text-center'>
//            <span className='text-xs'>Drop-Off</span>
//            <span className=''>
  
//             {cab.dropAddress}
//             </span> 
  
//          </div>
//        </div>
//      </div>
    
    
//     </div>
    
    
//     {/* {
//       cab.status ==='paid and cancelled' && (
//         <div className='flex justify-end items-center px-8'>
//     <div className={`flex items-center px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] text-gray-600 cursor-pointer bg-slate-100  hover:bg-red-100  hover:text-red-900 `}
//     onClick={()=>handleOpenModal(cab.itineraryId)}
//     >
//       {actionBtnText}
      
//     </div>
//     <Modal
//           handleOperation={tripRecovery}
//           handleOpenOverlay={handleOpenOverlay}
//           isOpen={isModalOpen}
//           onClose={handleCloseModal}
//           itineraryId={selectedItineraryId}
//           routeData={routeData}
//           content="Are you sure ! you want to cancel the cab cancel ?"
//           onCancel={handleCancel}
//         />
//     </div>
//       )
//     } */}

//     {/* ///checkbox */}
//     <label className="inline-flex items-center cursor-pointer">
//       <div
//         className={`relative rounded-full border-2 ${
//           isChecked ? 'border-green-500 bg-green-100' : 'border-gray-300'
//         } w-10 h-10 transition-all duration-300 transform hover:scale-110`}
//         onClick={onToggleCheck}
//       >
//         <svg
//           className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-green-500 ${
//             isChecked ? 'opacity-100' : 'opacity-0'
//           }`}
//           fill="none"
//           stroke="currentColor"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth="2"
//           viewBox="0 0 24 24"
//         >
//           <path d="M5 13l4 4L19 7"></path>
//         </svg>
//       </div>
//       <span className="ml-3 text-lg text-gray-700">
//         {isChecked ? 'Checked' : 'Check me'}
//       </span>
//     </label>
    
//     </div>  
   
  
  
//      </div>
     
//     </div>
//     </React.Fragment>
    
//     ))}
    
//   </React.Fragment>
//    ))}
  
    
  
//      </>
//     )
//   }


//   export default CabDetails