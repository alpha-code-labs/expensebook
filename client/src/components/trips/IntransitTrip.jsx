import React ,{Fragment, useState,useRef}from 'react';
import { tripArray } from '../../utils/dummyData';
import Modal from '../Modal';
import {  bus, cab_purple, train ,three_dot, airplane_1,intransit_trip, briefcase,calender_icon, double_arrow, house_simple,  briefcaseMap} from '../../assets/icon';
import AddLeg from '../addLeg/LegForm';
import { formatDate, getCashAdvanceButtonText ,getStatusClass,urlRedirection} from '../../utils/handyFunctions';

import CashCard from './CashCard';
import TravelCard from './ExpenseCard';
import { handleTravelExpense } from '../../utils/actionHandler';
import IconOption from '../common/IconOption';

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


const TransitTrip = ({initialTransitTabs,handleCashAdvance,handleTrip,transitTripData,handleOpenOverlay}) => {
  console.log('intransit trip11',initialTransitTabs)
  console.log('transit trip data', transitTripData)
const cardModalRef= useRef(null  )
  
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



 const handleClickOutside = (e) =>{
  // if(!cardModalRef.current.contains(e.target)){
  //   setDropdownStates({})
  // }
  // setDropdownStates(null)
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
  <div className="w-[500px]   h-[360px]  rounded-lg   overflow-hidden">
   
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
  
<div onClick={handleClickOutside} className=" w-auto flex flex-row  gap-2  overflow-x-auto  no-scrollbar scroll-smooth  overflow-hidden ">
{transitTripData?.length>0 ? (
transitTripData && transitTripData?.map((item, index) => (
   <React.Fragment key={index}>
<div className={`h-[320px] px-4 py-1 bg-[length:500px_322px]  rounded-lg `} style={{backgroundImage: `url(${briefcaseMap})`, width: '500px',}}>
{/* <img src={briefcaseMap} className='absolute h-[370px] w-full border border-red-500 z-20'></img> */}
<div className='  mt-14  h-[250px]      flex flex-col rounded-lg bg-white' >
<div className=' flex flex-row justify-between w-full  pt-[3px] px-2'>
        <div className='flex gap-2 flex-row items-center justify-start text-center'>
            <div className={`py-[2px] px-2 rounded-xl cursor-pointer hover:bg-purple-300 hover:text-white  ${activeTabs?.[index]=== "Trip" ? ' font-medium bg-purple-100  text-indigo-600 text-xs rounded-xl':"bg-white font-medium  text-xs  "}`} onClick={() => handleTabChange(index, "Trip")}>
              <p>Trip</p>
            </div>
            <div className={`py-1 px-2 rounded-xl  cursor-pointer hover:bg-purple-300 hover:text-white  ${activeTabs?.[index]=== "Cash Advance" ? 'font-medium bg-purple-100  text-indigo-600 text-xs ': "bg-white font-medium  text-xs"}`} onClick={()=> handleTabChange(index,"Cash Advance" )}>
            <p>Cash Advance</p> 
            </div>  
            <div className={`py-1 px-2 rounded-xl cursor-pointer hover:bg-purple-300 hover:text-white    ${activeTabs?.[index]=== "Expense" ? 'font-medium bg-purple-100  text-indigo-600 text-xs ': "bg-white  font-medium   text-xs" }`} onClick={()=> handleTabChange(index,"Expense" )}>
             <p>Expense</p>
            </div>  
        </div>

 {/* <div   className=' relative flex justify-end flex-none w-[40px]  cursor-pointer  items-center lg:items-center'>
              <img src={three_dot}  
                width={16} 
                height={16}
                onClick={() => handleDropdownToggle(item.tripStatus)}
              />
              {dropdownStates?.[item.tripStatus] && (
        <div ref={cardModalRef} className="absolute top-3 right-3 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 bg-white">
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
    </div> */}
    
<IconOption
        buttonText={
          <img src={three_dot}  
                className='w-4 h-4 translate-y-1'
                onClick={() => handleDropdownToggle(item.tripStatus)}
          />
        }
      >
        <ul className="text-sm text-neutral-700 dark:text-gray-200 w-auto ">
            <li className='min-w-[100px]'>
              <a
                href="#/cancel/trip"
                className="block px-4 py-2 hover:bg-indigo-50 rounded-md  "
                onClick={()=>{handleTrip(item.tripId,"trip-cancelletion-view");setDropdownStates({})}}
              >
                Cancel
              </a>
            </li>
            <li onClick={()=>handleModal()} className="hover:bg-indigo-50 rounded-md px-4 py-2 w-full">
              <a
                href="#/itinerary/new"
                
              >
                <p className=''>Add Leg</p>
              </a>
              
        
            </li>
            <Modal 
              isOpen={isModalOpen} 
              onClose={()=>handleModal()}       
              content={<AddLeg handleOpenOverlay={handleOpenOverlay} onClose={()=>handleModal()} />}
              onCancel={handleCancel} 
            />
          </ul>
         
      </IconOption>

</div>
        
          {/* ///intransit Trip data */}
       
{activeTabs?.[index] === 'Trip' && 
        <>
        <div className='w-full items-center  flex flex-col h-[173px] mt-1  '>
        <div className=' w-auto flex flex-col h-[210px] '>
        <div className='flex flex-row justify-between items-center  font-cabin '>
        <div className='px-2 w-full font-medium text-lg text-neutral-700  rounded-t-md'>
          {item?.tripPurpose}
        </div>     
</div>
<div className='h-[150px] w-[470px] overflow-y-auto rounded-b-md py-1 px-2'>
 <div className=" flex flex-col py-1">
      {Object.keys(item?.itinerary).map(key => (
        <React.Fragment key={key}>
          {key !== 'formState' && item?.itinerary[key].length > 0 && (
            <div className='w-full'>
              <div className='flex gap-2 font-cabin items-center text-neutral-600 py-1'>
              <img src={getIconForItinerary(key)} className='w-4 h-4' />
              <h2 className="text-md font-semibold  text-center">{key.charAt(0).toUpperCase() + key.slice(1)}</h2>
              </div>
              <div className="">
                {item?.itinerary[key]?.map(item => (
                  <React.Fragment key={item._id} >
                    <div className="bg-white  p-3 rounded shadow w-full border border-slate-300 bg-slate-50">
              {['flights','trains','buses'].includes(key)  && (

                   <div className='flex flex-col items-start gap-2   '>
                    <div className='flex  w-full  items-center  justify-between '>
                      <div className='inline-flex gap-1'>
                      <img src={calender_icon} alt='icon' className='w-4 h-4'/>
                      <span className='text-sm font-cabin text-neutral-600'>{formatDate(item.bkd_date)}</span>
                      </div>
                      <div className={` text-center rounded-sm  ${getStatusClass(item.status)}`}>
                      <p className='px-2 py-1 text-sm text-center capitalize font-cabin '>{item?.status}</p>
                      </div>
                    

                    </div>

                    <div className='flex-1 w-full capitalize    inline-flex items-center  justify-between   '>
                <div className='w-2/5   font-cabin items-start  text-sm text-neutral-600'>
                  <div className=' text-neutral-600 text-xs'>Pickup Address</div>
                  <div className='text-neutral-800 '>{item?.bkd_from}</div>
                </div>
                <img src={double_arrow} className=' w-5 h-5' alt='icon'/>
                <div className='w-2/5 items-start  font-cabin text-sm text-neutral-600'>
                <div className=' text-neutral-600 text-xs'>Dropoff Address</div>
                <div className='text-neutral-800'> {item?.bkd_to}</div></div>
                </div>
                    
                    
    
                  </div>
                )}
                    {/* Add more details as needed */}
                {key === 'cabs' && (
          
                <div className='flex flex-col items-start gap-2'>
                <div className='flex  w-full  items-center  justify-between'>
                  <div className='inline-flex gap-1'>
                  <img src={calender_icon} alt='icon' className='w-4 h-4'/>
                  <span className='text-sm font-cabin text-neutral-600'>{formatDate(item?.bkd_date)}</span>
                  </div>
                  <div className={` text-center rounded-sm  ${getStatusClass(item?.status)}`}>
                  <p className='px-2 py-1 text-sm text-center capitalize font-cabin '>{item?.status}</p>
                  </div>
                </div>

                <div className='flex-1 w-full   inline-flex items-center justify-between'>
                <div className='w-2/5  font-cabin  text-sm text-neutral-600'>
                  <div className=' text-neutral-600 text-xs'>Pickup Address</div>
                  <div className='text-neutral-800'>{item?.bkd_pickupAddress}</div>
                  </div>
                <img src={double_arrow} className=' w-5 h-5' alt='icon'/>
                <div className='w-2/5  font-cabin text-sm text-neutral-600'>
                <div className=' text-neutral-600 text-xs'>Dropoff Address</div>
                <div className='text-neutral-800'> {item?.bkd_dropAddress}</div></div>
                </div>
                
                

              </div>
                )}
                   {key === 'hotels' && (
                       <div className='flex flex-col items-start capitalize'>
                        
                        <div className='flex items-center  justify-between w-full'>

                      <div className='flex w-full'>
                        <div className='justify-between flex '>
                       <img src={calender_icon} alt='icon' className='w-4 h-4 mr-1'/>
                       <p className='text-sm font-cabin text-neutral-600'>{formatDate(item?.bkd_checkIn)}</p>
                       </div>
                       <div className='text-center px-2 '> to </div>
                       <div className='flex justify-between '>
                       <img src={calender_icon} alt='icon' className='w-4 h-4 mr-1'/>
                       <p className='text-sm font-cabin text-neutral-600'>{formatDate(item?.bkd_checkOut)}</p>
                       </div>
                       </div>
                      

                        
                         <div className={`px-2 py-1 rounded-sm    ${getStatusClass(item?.status)}`}>
                         <p className='text-sm text-center capitalize font-cabin '>{item?.status}</p>
                         </div>
                     
                        </div>

                       <div className='flex-1  flex-col items-center font-cabin  '>
                        <div className='text-neutral-600  text-xs '> Location</div>
                        
                         <span className='text-sm font-cabin text-neutral-800'>{item?.bkd_location}</span>
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

</div>
  
  








      

   </div>
        
        </>
          }

{activeTabs?.[index]=== 'Cash Advance' && 
  ( 
   
  <div className='h-[175px] w-[450px] flex flex-col  justify-center  mt-1 px-3  overflow-y-auto overflow-x-auto'>
    {/* <div className=' w-[450px] flex flex-col justify-center items-center h-[280px] gap-y-2'>  */}
  <CashCard travelRequestId={item?.travelRequestId} handleCashAdvance={handleCashAdvance} cashAdvances={item?.cashAdvances}/>
  {/* </div> */}
  </div>

  )}
{activeTabs?.[index] ==="Expense" && 
<>
<div className=' h-[190px]  px-3 w-[450px] overflow-y-auto rounded-lg my-2'>
<TravelCard    
// travelExpense={travelExpense}  
tripId={item?.tripId}
travelExpense={item?.travelExpenses}  
handleTravelExpense={handleTravelExpense} 
/> 
</div>
{/* <div className='px-5 w-auto max-w-[458px] flex flex-col h-auto min-h-[210px] gap-4'>Expense</div> */}
</>
} 

<div className='flex flex-row gap-2 px-2 pb-1'>
  <div onClick={()=>{handleCashAdvance(item?.travelRequestId,"", 'ca-create')}} className="bg-white mt-2 rounded-[32px] w-fit box-border h-[33px] flex flex-row items-center justify-center py-4 px-2  cursor-pointer border-[1px] border-solid border-purple-500">
    <div className="font-semibold text-[12px] w-fit h-[17px] text-purple-500">{getCashAdvanceButtonText(item?.tripStartDate)}</div>
</div>
<div onClick={()=>{handleTravelExpense({"tripId":item?.tripId, "action": "trip-ex-create"})}} className="bg-white mt-2 rounded-[32px] w-fit  h-[33px] flex flex-row items-center justify-center py-4 px-2  cursor-pointer border-[1px]  border-purple-500">
    <div className="font-semibold text-[12px] w-fit h-[17px] text-purple-500">Book Expense</div>
</div>
</div>
          </div>
          {/* </div> */}

          
      
</div>
        </React.Fragment>
      ))) : (
    <div className="rounded-md w-[487px] h-[310px] flex flex-col gap-4 self-stretch border  border-slate-300  items-center justify-center  text-sm">
      <img src={intransit_trip} alt="NoTrip" className='A animate-pulse'/>
      <h2 className='text-lg font-cabin text-neutral-600'>We are awaiting your first Trip.</h2>
    </div>
      )}
</div>
  </div>
  )
};



export default TransitTrip

