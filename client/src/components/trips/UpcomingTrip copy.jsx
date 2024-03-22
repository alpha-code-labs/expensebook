import React ,{Fragment, useState}from 'react';
import { tripArray } from '../../utils/dummyData';
import Modal from '../Modal';
import {  bus, cab_purple, train ,three_dot, airplane_1,intransit_trip, briefcase,calender, double_arrow, cab, location, arrow_left, down_arrow, chevron_down, house_simple,  the_food_bill, briefcaseMap} from '../../assets/icon';
import AddLeg from '../addLeg/LegForm';
import { formatDate, getCashAdvanceButtonText ,getStatusClass,urlRedirection} from '../../utils/handyFunctions';

import CashCard from './CashCard';
import TravelCard from './ExpenseCard';
import { handleTravelExpense } from '../../utils/actionHandler';

const getIconForItinerary = (itineraryType) => {
  switch (itineraryType) {
    case 'flights':
      return airplane_1;
    case 'buses':
      return bus ;
    case 'trains':
      return train;
    case 'hotels':
      return house_simple;
    case 'cabs':
      return cab_purple;
    default:
      return null;
  }
};


const UpcomingTrip = ({initialTransitTabs,handleCashAdvance,handleTrip,upComingTrip,content ,handleOpenOverlay}) => {
  

  console.log('intransit trip11',initialTransitTabs)

  
  const [isModalOpen, setIsModalOpen] = useState(false);

const [dropdownStates, setDropdownStates] = useState({});  

const handleDropdownToggle = (index) => {
  setDropdownStates((prevStates) => ({
    ...prevStates,
    [index]: !prevStates[index],
  }));
};
  
  // Open modal
  const handleModal = ()=>{
    setIsModalOpen(!isModalOpen);
  }


   // Cancel action

   const handleCancel = () => {
    // Handle the cancellation logic
    console.log('Cancelled');
  };



 
  
  const [activeTabs, setActiveTabs] = useState([...initialTransitTabs]);
  
  const handleTabChange = (index, tab) => {
    setActiveTabs((prevTabs) => {
      const newTabs = [...prevTabs];
      newTabs[index] = tab;
      console.log('new tabs',newTabs)
      return newTabs;
    });
  };
  console.log('intial tabs1',activeTabs)
  

  return (
  <div className="w-auto  p-2   h-[360px]  rounded-lg bg-white-300 shadow-slate-300 shadow-lg overflow-hidden">
   
  <div className=" flex flex-row items-center justify-start gap-2 overflow-hidden pl-4 py-1">
               <img
                 className=" w-6 h-6 shrink-0"
                 alt="breifcash_icon"
                 src={briefcase}
               />
               <b className=" tracking-[0.02em] font-cabin text-[16px] font-semibold">Transit Trips</b>
  </div>
 
    {/* <div className=" flex flex-row self-stretch border mt-20 border-slate-100  items-center justify-center  text-sm">
      <img src={intransit_trip} alt="NoTrip" className='A  animate-pulse' />
      <div className=" top-[140px] w-[191px] flex flex-col justify-center items-start gap-4 text-gray-400">
        <div className="flex flex-col items-start justify-center">
        
        </div>
     
        
      </div>
    </div> */}
  
  <div className=" w-auto flex flex-row   overflow-x-auto  no-scrollbar scroll-smooth gap-2 overflow-hidden ">
      {upComingTrip && upComingTrip?.map((item, index) => (
        <React.Fragment key={index}>
<div style={{
          backgroundImage: `url(${briefcaseMap})`
        }} className=" bg-[length:650px_360px]   bg-center  max-w-[650px] border border-slate-300  h-[310px] shadow-slate-300 shadow-lg   rounded-lg ">

{/* <img src={briefcaseBox} className='absolute top-[-20px] h-[370px] w-[650px] z-20'/> */}

<div className=' flex flex-row justify-between  pr-4'>
        <div className='flex  flex-row items-center justify-start text-center p-4'>
            <div className={`py-1 px-2 rounded-xl   ${activeTabs?.[index]=== "Trip" ? ' font-medium bg-purple-500  text-white-100 text-xs rounded-xl':""}`} onClick={() => handleTabChange(index, "Trip")}>
              Trip
            </div>
            <div className={`py-1 px-2 rounded-xl    ${activeTabs?.[index]=== "Cash Advance" ? 'font-medium bg-purple-500 text-white-100 text-xs ': ""}`} onClick={()=> handleTabChange(index,"Cash Advance" )}>
              Cash Advance
            </div>  
            <div className={`py-1 px-2 rounded-xl    ${activeTabs?.[index]=== "Expense" ? 'font-medium bg-purple-500 text-white-100 text-xs ': ""}`} onClick={()=> handleTabChange(index,"Expense" )}>
             Expense
            </div>  
        </div>

 <div  className=' relative flex justify-end flex-none w-[40px]  cursor-pointer  items-center lg:items-center '>
              <img src={three_dot}  
              width={16} 
              height={16}
              onClick={() => handleDropdownToggle(item.tripStatus)}
              />
              {dropdownStates?.[item.tripStatus] && (
        <div className="absolute top-3 right-3 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 bg-white-100">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={()=>{handleTrip(item.tripId,"trip-cancelletion-view");setDropdownStates({})}}
              >
                Cancel
              </a>
            </li>

            <li onClick={()=>handleModal()}>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Add a Leg
              </a>
              
        
            </li>
            <Modal 
              isOpen={isModalOpen} 
              onClose={()=>handleModal()}       
              content={<AddLeg handleOpenOverlay={handleOpenOverlay} onClose={()=>handleModal()} />}
              onCancel={handleCancel} 
            />
          </ul>
        </div>
      )}
    </div>
</div>
        
          {/* ///intransit Trip data */}
       
      
        {activeTabs?.[index] === 'Trip' && 
        <>
        <div className=' px-4 w-auto min-w-[458px]   flex flex-col h-auto min-h-[210px] gap-4'>
        <div className='px-5 w-auto   max-w-[650px] flex flex-col h-auto min-h-[210px] gap-4'>
        <div className='flex flex-row justify-between items-center'>
        <div>
          <p>{item.tripPurpose}</p>
        </div>
             
</div>
<div>
 
  
<div className='h-[160px] w-[600px] overflow-y-auto '>
 <div className=" flex flex-col p-2">
      {Object.keys(item?.itinerary).map(key => (
        <React.Fragment key={key}>
          {key !== 'formState' && item?.itinerary[key].length > 0 && (
            <div className='w-full'>
              <div className='flex gap-2 font-cabin items-center text-neutral-600 py-2'>
              <img src={getIconForItinerary(key)} className='w-4 h-4' />
              <h2 className="text-md font-semibold  text-center">{key.charAt(0).toUpperCase() + key.slice(1)}</h2>
              </div>
              <div className="">
                {item?.itinerary[key]?.map(item => (
                  <React.Fragment key={item._id} >
                    <div className="bg-white p-4 rounded shadow w-full">
              {['flights','trains','buses'].includes(key)  && (
                   <div className='flex flex-row items-center '>
                    <div className='flex-1 inline-flex items-center  gap-1 '>
                      <img src={calender} alt='icon' className='w-4 h-4'/>
                      <span className='text-sm font-cabin'>{formatDate(item.bkd_date)}</span>
                    </div>
                    <div className='flex-1 inline-flex items-center gap-2'>
                    <p className='font-cabin text-sm'>{item.bkd_from}</p>
                    <img src={double_arrow} className='w-5 h-5' alt='icon'/>
                    <p className='font-cabin text-sm'>{item.bkd_to}</p>
                    </div>
                    
                    <div className='flex-1 inline-flex  items-center  justify-center '>
                      <div className={`px-2 py-1 rounded-sm    ${getStatusClass(item.status)}`}>
                      <span className='text-sm text-center capitalize font-cabin '>{item.status}</span>
                      </div>
                    </div>
    
                  </div>
                )}
                    {/* Add more details as needed */}
                {key === 'cabs' && (
          
                   <div className='flex flex-row items-center '>
                   <div className='flex-1 inline-flex items-center  gap-1 '>
                     <img src={calender} alt='icon' className='w-4 h-4'/>
                     <span className='text-sm font-cabin'>{formatDate(item.bkd_date)}</span>
                   </div>
                   <div className='flex-1 inline-flex items-center gap-2'>
                   <p className='font-cabin text-sm'>{item.bkd_pickupAddress}</p>
                   <img src={double_arrow} className='w-5 h-5' alt='icon'/>
                   <p className='font-cabin text-sm'>{item.bkd_dropAddress}</p>
                   </div>
                   
                   <div className='flex-1 inline-flex  items-center  justify-center '>
                     <div className={`px-2 py-1 rounded-sm    ${getStatusClass(item.status)}`}>
                     <span className='text-sm text-center capitalize font-cabin '>{item.status}</span>
                     </div>
                   </div>
   
                 </div>
                )}
                   {key === 'hotels' && (
                       <div className='flex flex-row items-center  gap-x-2 '>
                       <div className='flex-1 mr-4 inline-flex items-center  '>
                        
                         <span className='text-sm font-cabin'>{item?.bkd_location}</span>
                       </div>
                       <div className='flex-1 inline-flex items-center justify-center gap-1'>
                       <img src={calender} alt='icon' className='w-4 h-4'/>
                       <p className='font-cabin text-sm'>{formatDate(item?.bkd_checkIn)}</p>
                       </div>
                       <div className='flex-1 inline-flex items-center justify-center gap-1'>
                       <img src={calender} alt='icon' className='w-4 h-4'/>
                       <p className='font-cabin text-sm'>{formatDate(item?.bkd_checkOut)}</p>
                       </div>
                       
                       <div className='flex-1 inline-flex  items-center  justify-center '>
                         <div className={`px-2 py-1 rounded-sm    ${getStatusClass(item?.status)}`}>
                         <span className='text-sm text-center capitalize font-cabin '>{item?.status}</span>
                         </div>
                       </div>
       
                     </div>
                    )}    
                 
                 </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
</div>


  </div>
  <div className='flex flex-row gap-2 '>
  <div onClick={()=>{handleCashAdvance(item?.travelRequestId,"", 'ca-create')}} className=" mt-2 rounded-[32px] w-fit box-border h-[33px] flex flex-row items-center justify-center py-4 px-2  cursor-pointer border-[1px] border-solid border-purple-500">
      <div className="font-semibold text-[12px] w-fit h-[17px] text-purple-500">{getCashAdvanceButtonText(item?.tripStartDate)}</div>
</div>
  <div onClick={()=>{handleTravelExpense(item?.tripId,"", "trip-ex-create")}} className=" mt-2 rounded-[32px] w-fit  h-[33px] flex flex-row items-center justify-center py-4 px-2  cursor-pointer border-[1px]  border-purple-500">
      <div className="font-semibold text-[12px] w-fit h-[17px] text-purple-500">Book Expense</div>
</div>
  </div>
 

</div>


   


   </div>
  








      

   </div>
        
        </>
          }

          {activeTabs?.[index]=== 'Cash Advance' && 
           ( 
            <div className='h-[210px] w-[650px] overflow-y-auto overflow-x-auto '>
             <div className='mx-4 w-auto  gap-4 flex flex-col '> 
            <CashCard handleCashAdvance={handleCashAdvance} cashAdvances={item?.cashAdvances}/>
            </div>
            </div>
            )}
          {activeTabs?.[index] ==="Expense" && 
         <>
        <div className=' h-[240px] w-[650px] overflow-y-auto rounded-lg p-2'>
         <TravelCard    
         travelExpense={item.travelExpenses}  
         handleTravelExpense={handleTravelExpense} 
         /> 
         </div>
          {/* <div className='px-5 w-auto max-w-[458px] flex flex-col h-auto min-h-[210px] gap-4'>Expense</div> */}
         </>
          } 

          
      
</div>
        </React.Fragment>
      ))}
    </div>
  </div>)
};



export default UpcomingTrip

