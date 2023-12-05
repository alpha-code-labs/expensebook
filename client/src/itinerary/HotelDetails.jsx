import React,{ useState } from "react";
import { double_arrow ,location } from '../assets/icon'
import Modal from "../components/Modal";
const HotelDetails = ({ allHotel , travelRequest ,actionBtnText})=>{

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItineraryId , setSelectedItineraryId]=useState(null)
  
    const handleOpenModal = (itineraryId) => {
      setSelectedItineraryId(itineraryId)
      setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };
  
  
    const handleCancel = () => {
      // Handle the cancellation logic
      console.log('Cancelled');
    };



    return (
  
  
      <>
   {travelRequest.itinerary.map((journey, journeyIndex) => (
  <React.Fragment key={journeyIndex}>
  <p>From: {journey.journey.from} | To: {journey.journey.to}</p>
  {allHotel(journey).map((hotel, cabIndex) => (
                  <React.Fragment key={cabIndex}>
  
      
      {/* </div> */}
  
  <div className='Itinenery mb-4 bg-slate-50 mt-2' >
     <div className='h-auto w-auto border border-slate-300 rounded-md'>
       
     {/* <h2>Journey {journeyIndex + 1}</h2> */}      
  
    <div className='flex flex-row py-3 px-2 divide-x'>
    <div className='flex items-center flex-grow divide-x '>
     <div className='flex items-start justify-start  flex-col shrink w-auto md:w-[200px] mr-4'>
       <div className='flex items-center justify-center mb-2'>
       <div className='pl-2'>
         <img src={location} alt="calendar" width={16} height={16} />
       </div>
       <span className="ml-2 tracking-[0.03em] font-cabin leading-normal text-gray-800 text-xs md:text-sm">
        {/* Class : {hotel.city} */}
        Lucknow
       </span>
       </div>
       <div className='ml-4 max-w-[200px] w-auto'>
        <span className='text-xs font-cabin'>
        <div className='ml-4 max-w-[200px] w-auto'>
    <span className='text-xs font-cabin '>
      {/* {hotel.locationPrefrence} */}
      {hotel.locationPrefrence !== undefined && hotel.locationPrefrence !== '' ? hotel.locationPrefrence : '-'}
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
            {hotel.checkIn}
            
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
  
            {hotel.checkOut}
            </span> 
  
         </div>
       </div>
     </div>
    
    
    </div>
    
    
    <div className='flex justify-end items-center px-8'>
    <div className={`flex items-center px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] text-gray-600 cursor-pointer bg-slate-100  hover:bg-red-100  hover:text-red-900 `}
    onClick={()=>handleOpenModal(hotel.itineraryId)}
    >
      {actionBtnText}
      
    </div>
    <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          itineraryId={selectedItineraryId}  
          content="Are you sure ! you want to cancel the hotel Itinerary ?"
          // onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
    </div>
    
    </div>  
   
  
  
     </div>
     
    </div>
    </React.Fragment>
    
    ))}
    
  </React.Fragment>
   ))}
  
    
  
     </>
    )
  }


  export default HotelDetails