import React ,{Fragment, useEffect, useState}from 'react';
import Modal from '../Modal';
import {cab_purple, three_dot, airplane_1,intransit_trip, briefcase,calender_icon, double_arrow, cab, location, arrow_left, down_arrow, chevron_down, house_simple, train, bus, briefcaseMap} from '../../assets/icon';
import AddLeg from '../addLeg/LegForm';

import { formatDate, formatDate2, getCashAdvanceButtonText ,getStatusClass,urlRedirection} from '../../utils/handyFunctions';
import Dropdown from '../Dropdown';
import NotifyModal from '../NotifyModal';
import CashCard from './CashCard';
import IconOption from '../common/IconOption';





const UpcomingTrip = ({handleCashAdvance,handleTrip,upComingTrip,handleDropdownToggle,dropdownStates,content ,handleOpenOverlay}) => {
  console.log('upcoming trip11',upComingTrip)
 
 
  const [activeTabs, setActiveTabs] = useState();
  useEffect(()=>{
    
    const initialTabs = Array.from({ length: upComingTrip && upComingTrip?.length }, () => 'Trip');
    console.log('initial tab',initialTabs)
    setActiveTabs(['Trip','Trip','Trip'])

      },[])

  const handleTabChange = (index, tab) => {
    setActiveTabs((prevTabs) => {
      const newTabs = [...prevTabs];
      newTabs[index] = tab;
      return newTabs;
    });
  };

  const handleModal = ()=>{
    setIsModalOpen(!isModalOpen);
  }
  // setActiveTabs(upComingTrip.map(_=>'Trip'));
  
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  // Open modal
   const handleOpenModal = () => {
     setIsModalOpen(true);
   };
 
   // Close modal
   const handleCloseModal = () => {
     setIsModalOpen(false);
   };
 
   // Cancel action
   const handleCancel = () => {
     // Handle the cancellation logic
     console.log('Cancelled');
   };



 

  return (
<div className="w-auto    h-[360px]  rounded-lg  overflow-hidden">
   
   <div className=" flex flex-row items-center justify-start gap-2 overflow-hidden pl-4 py-1">
                <img
                  className=" w-6 h-6 shrink-0"
                  alt="breifcash_icon"
                  src={briefcase}
                />
                <b className=" tracking-[0.02em] font-cabin text-[16px] font-semibold">Upcoming Trips</b>
   </div>
   <div className="  gap-2  flex flex-row   overflow-x-auto  no-scrollbar scroll-smooth  overflow-hidden ">
{upComingTrip?.length>0 ? (
upComingTrip && upComingTrip?.map((item, index) => (
   <React.Fragment key={index}>
<div className={`gap-4 h-[320px]  px-4 py-1 bg-[length:500px_322px] rounded-lg `} style={{backgroundImage: `url(${briefcaseMap})`, width: '500px',}}>
{/* <img src={briefcaseMap} className='absolute h-[370px] w-full border border-red-500 z-20'></img> */}
<div className='  mt-14  h-[250px] flex flex-col rounded-[12px] bg-white   ' >
<div className=' flex flex-row justify-between w-full  pt-[3px] px-2'>
        <div className='flex gap-2 flex-row items-center justify-start text-center'>
            <div className={`py-[2px] px-2 rounded-xl cursor-pointer hover:bg-purple-300 hover:text-white  ${activeTabs?.[index]=== "Trip" ? ' font-medium bg-purple-100  text-indigo-600 text-xs rounded-xl':"bg-white font-medium  text-xs  "}`} onClick={() => handleTabChange(index, "Trip")}>
              <p>Trip</p>
            </div>
            <div className={`py-1 px-2 rounded-xl  cursor-pointer hover:bg-purple-300 hover:text-white  ${activeTabs?.[index]=== "Cash Advance" ? 'font-medium bg-purple-100  text-indigo-600 text-xs ': "bg-white font-medium  text-xs"}`} onClick={()=> handleTabChange(index,"Cash Advance" )}>
            <p>Cash Advance</p> 
            </div>  
           
        </div>

 {/* <div className='relative flex justify-end flex-none w-[40px]  cursor-pointer  items-center lg:items-center'>
              <img src={three_dot}  
              width={16} 
              height={16}
              onClick={() => handleDropdownToggle(item.tripStatus)}
              />
              {dropdownStates?.[item.tripStatus] && (
        <div className="absolute top-3 right-3 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 bg-white">
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
                onClick={()=>{handleTrip(item.tripId,"trip-cancelletion-view")}}
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
        <div className='w-full items-center  flex flex-col h-[173px] mt-1'>
        <div className=' w-auto flex flex-col h-[210px]'>
        <div className='flex flex-row justify-between items-center  font-cabin '>
        <div className='px-2 w-full font-medium text-lg text-neutral-700  rounded-t-md'>
          {item?.tripPurpose}
        </div>
             
</div>
<div className='h-[150px] w-[470px]  overflow-y-auto rounded-b-md py-1 px-2 '>
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
                    <div className="bg-white p-3 rounded shadow w-full border border-slate-300 bg-slate-50">
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

                    <div className='flex-1 w-full   inline-flex items-center  justify-between   '>
                <div className='w-2/5  font-cabin items-start  text-sm text-neutral-600'>
                  <div className=' text-neutral-600 text-xs'>Pickup Address</div>
                  <div className='text-neutral-800'>{item?.bkd_from}</div>
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

                <div className='flex-1 w-full   inline-flex items-center justify-between   '>
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
                       <div className='flex flex-col items-start'>
                        
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
    
  <div className='h-[175px] flex flex-col  justify-center  mt-1 px-3  overflow-y-auto overflow-x-auto'>
    {/* <div className=' w-[450px] flex flex-col justify-center items-center h-[280px] gap-y-2'>  */}
  <CashCard travelRequestId={item?.travelRequestId} tripId={item?.tripId} handleCashAdvance={handleCashAdvance} cashAdvances={item?.cashAdvances}/>
  {/* </div> */}
  </div>
  )}


<div className='flex flex-row gap-2 px-2 pb-1'>
  <div onClick={()=>{handleCashAdvance(item?.travelRequestId,"", 'ca-create')}} className="bg-white mt-2 rounded-[32px] w-fit box-border h-[33px] flex flex-row items-center justify-center py-4 px-2  cursor-pointer border-[1px] border-solid border-purple-500">
    <div className="font-semibold text-[12px] w-fit h-[17px] text-purple-500">{getCashAdvanceButtonText(item?.tripStartDate)}</div>
</div>

</div>
          </div>
          {/* </div> */}

          
      
</div>
        </React.Fragment>
      ))) : (
      <div className="rounded-md w-full h-[310px] flex flex-col gap-4 self-stretch border  border-slate-300  items-center justify-center  text-sm">
      <img src={intransit_trip} alt="NoTrip" className='A animate-pulse'/>
      <h2 className='text-lg font-cabin text-neutral-600'>You don't have any Upcoming Trips.</h2>
      
    </div>
      )}
</div>
  
     

   </div>
  )
};



export default UpcomingTrip


// <div className=" w-auto flex flex-row   overflow-x-auto  no-scrollbar scroll-smooth  overflow-hidden ">
//  {
//  upComingTrip?.length>0 ?
 
//  (upComingTrip && upComingTrip?.map((item, index) => (
//     <React.Fragment key={index}>
//  <div className={`bg-[500px] bg-cover  border border-slate-300 shadow-slate-300 shadow-lg rounded-lg`} style={{backgroundImage: `url(${briefcaseMap})`, width: '500px' }}>
//  <div className='  mt-14  bg-white/30 flex flex-col' >
//  <div className=' flex flex-row justify-between w-full px-4'>
//          <div className='flex gap-2 flex-row items-center justify-start text-center '>
//              <div className={`py-1 px-2 rounded-xl cursor-pointer  ${activeTabs?.[index]=== "Trip" ? ' font-medium bg-purple-500  text-white text-xs rounded-xl':"bg-white/70 border-[1px]  "}`} onClick={() => handleTabChange(index, "Trip")}>
//                Trip
//              </div>
//              <div className={`py-1 px-2 rounded-xl cursor-pointer   ${activeTabs?.[index]=== "Cash Advance" ? 'font-medium bg-purple-500 text-white text-xs ': "bg-white/70   border-[1px]"}`} onClick={()=> handleTabChange(index,"Cash Advance" )}>
//                Cash Advance
//              </div>  
          
//          </div>
 
//   <div  className=' relative flex justify-end flex-none w-[40px]  cursor-pointer  items-center lg:items-center'>
//                <img src={three_dot}  
//                width={16} 
//                height={16}
//                onClick={() => handleDropdownToggle(item.tripStatus)}
//                />
//                {dropdownStates?.[item.tripStatus] && (
//          <div className="absolute top-3 right-3 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 bg-white">
//            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
//              <li>
//                <a
//                  href="#"
//                  className="block px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-600 dark:hover:text-white"
//                 onClick={()=>handleTrip(item.tripId,"trip-cancelletion-view")}
//                >
//                  Cancel
//                </a>
//              </li>
 
//              <li onClick={(handleOpenModal)}>
//                <a
//                  href="#"
//                  className="block px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-600 dark:hover:text-white"
//                >
//                  Add a Leg
//                </a>
               
         
//              </li>
            
//               <Modal 
//             isOpen={isModalOpen} 
//             content={<AddLeg handleOpenOverlay={handleOpenOverlay} onClose={handleCloseModal} />}
//             onCancel={handleCancel} 
//            />
//            </ul>
//          </div>
//        )}
//      </div>
//  </div>
         
           
        
       
//  {activeTabs?.[index] === 'Trip' && 
//          <>
//          <div className='w-full bg-white/50  items-center  flex flex-col h-auto min-h-[210px] gap-4'>
//          <div className=' w-auto   max-w-[650px] flex flex-col h-auto min-h-[210px] '>
//          <div className='flex flex-row justify-between items-center  font-cabin'>
//          <div className='bg-white/80 w-full font-semibold  text-lg text-neutral-700'>
//            <p>{item?.tripPurpose}</p>
//          </div>
              
//  </div>
//  <div>
  
   
//  <div className='h-[160px] w-[400px] overflow-y-auto bg-white/80'>
//   <div className=" flex flex-col">
//        {Object.keys(item?.itinerary).map(key => (
//          <React.Fragment key={key}>
//            {key !== 'formState' && item?.itinerary[key].length > 0 && (
//              <div className='w-full'>
//                <div className='flex gap-2 font-cabin items-center text-neutral-600 py-2'>
//                <img src={getIconForItinerary(key)} className='w-4 h-4' />
//                <h2 className="text-md font-semibold  text-center">{key.charAt(0).toUpperCase() + key.slice(1)}</h2>
//                </div>
//                <div className="">
//                  {item?.itinerary[key]?.map(item => (
//                    <React.Fragment key={item._id} >
//                      <div className="bg-white p-3 rounded shadow w-full border broder-slate-300">
//                {['flights','trains','buses'].includes(key)  && (
 
//                     <div className='flex flex-col items-start gap-2   '>
//                      <div className='flex  w-full  items-center  justify-between '>
//                        <div className='inline-flex gap-1'>
//                        <img src={calender_icon} alt='icon' className='w-4 h-4'/>
//                        <span className='text-sm font-cabin text-neutral-600'>{formatDate(item.bkd_date)}</span>
//                        </div>
//                        <div className={` text-center rounded-sm  ${getStatusClass(item.status)}`}>
//                        <p className='px-2 py-1 text-sm text-center capitalize font-cabin '>{item?.status}</p>
//                        </div>
                     
 
//                      </div>
 
//                      <div className='flex-1 w-full   inline-flex items-center  justify-between   '>
//                  <div className='w-2/5  font-cabin items-start  text-sm text-neutral-600'>
//                    <div className=' text-neutral-600 text-xs'>Pickup Address</div>
//                    <div className='text-neutral-800'>{item?.bkd_from}</div>
//                  </div>
//                  <img src={double_arrow} className=' w-5 h-5' alt='icon'/>
//                  <div className='w-2/5 items-start  font-cabin text-sm text-neutral-600'>
//                  <div className=' text-neutral-600 text-xs'>Dropoff Address</div>
//                  <div className='text-neutral-800'> {item?.bkd_to}</div></div>
//                  </div>
                     
                     
     
//                    </div>
//                  )}
                   
//                  {key === 'cabs' && (
           
//                  <div className='flex flex-col items-start gap-2'>
//                  <div className='flex  w-full  items-center  justify-between'>
//                    <div className='inline-flex gap-1'>
//                    <img src={calender_icon} alt='icon' className='w-4 h-4'/>
//                    <span className='text-sm font-cabin text-neutral-600'>{formatDate(item?.bkd_date)}</span>
//                    </div>
//                    <div className={` text-center rounded-sm  ${getStatusClass(item?.status)}`}>
//                    <p className='px-2 py-1 text-sm text-center capitalize font-cabin '>{item?.status}</p>
//                    </div>
                 
 
//                  </div>
 
//                  <div className='flex-1 w-full   inline-flex items-center justify-between   '>
//                  <div className='w-2/5  font-cabin  text-sm text-neutral-600'>
//                    <div className=' text-neutral-600 text-xs'>Pickup Address</div>
//                    <div className='text-neutral-800'>{item?.bkd_pickupAddress}</div>
//                    </div>
//                  <img src={double_arrow} className=' w-5 h-5' alt='icon'/>
//                  <div className='w-2/5  font-cabin text-sm text-neutral-600'>
//                  <div className=' text-neutral-600 text-xs'>Dropoff Address</div>
//                  <div className='text-neutral-800'> {item?.bkd_dropAddress}</div></div>
//                  </div>
                 
                 
 
//                </div>
//                  )}
//                     {key === 'hotels' && (
//                         <div className='flex flex-col items-start'>
                         
//                          <div className='flex items-center  justify-between w-full'>
 
//                        <div className='flex w-full'>
//                          <div className='justify-between flex '>
//                         <img src={calender_icon} alt='icon' className='w-4 h-4 mr-1'/>
//                         <p className='text-sm font-cabin text-neutral-600'>{formatDate(item?.bkd_checkIn)}</p>
//                         </div>
//                         <div className='text-center px-2 '> to </div>
//                         <div className='flex justify-between '>
//                         <img src={calender_icon} alt='icon' className='w-4 h-4 mr-1'/>
//                         <p className='text-sm font-cabin text-neutral-600'>{formatDate(item?.bkd_checkOut)}</p>
//                         </div>
//                         </div>
                       
 
                         
//                           <div className={`px-2 py-1 rounded-sm    ${getStatusClass(item?.status)}`}>
//                           <p className='text-sm text-center capitalize font-cabin '>{item?.status}</p>
//                           </div>
//                          </div>
//                         <div className='flex-1  flex-col items-center font-cabin  '>
//                          <div className='text-neutral-600  text-xs '> Location</div> 
//                           <span className='text-sm font-cabin text-neutral-800'>{item?.bkd_location}</span>
//                         </div>
//                       </div>
//                      )}    
                  
//                   </div>
//                    </React.Fragment>
//                  ))}
//                </div>
//              </div>
//            )}
//          </React.Fragment>
//        ))}
//  </div>
 
 
//  </div>
//  <div className='flex flex-row gap-2  '>
//    <div onClick={()=>{handleCashAdvance(item?.travelRequestId,"", 'ca-create')}} className="bg-white mt-2 rounded-[32px] w-fit box-border h-[33px] flex flex-row items-center justify-center py-4 px-2  cursor-pointer border-[1px] border-solid border-purple-500">
//        <div className="font-semibold text-[12px] w-fit h-[17px] text-purple-500">{getCashAdvanceButtonText(item?.tripStartDate)}</div>
//  </div>

//  </div>
//  </div>
//     </div>
//     </div>
         
//          </>
//            }
 
//  {activeTabs?.[index]=== 'Cash Advance' && 
//    ( 
//    <div className='h-[210px] flex  justify-center  mt-4  overflow-y-auto overflow-x-auto'>
//      <div className=' w-[400px] flex flex-col justify-center items-center mt-14 gap-y-2'> 
//    <CashCard handleCashAdvance={handleCashAdvance} cashAdvances={item?.cashAdvances}/>
//    </div>
//    </div>
//    )}
         
//            </div>
//            {/* </div> */}
 
           
       
//  </div>
//          </React.Fragment>
//        ))):(
//         <div className="rounded-md w-full h-[310px] flex flex-col gap-4 self-stretch border  border-slate-300  items-center justify-center  text-sm">
//       <img src={intransit_trip} alt="NoTrip" className='A animate-pulse'/>
//       <h2 className='text-lg font-cabin text-neutral-600'>We are awaiting your Upcoming Trip</h2>
      
//     </div>
//        )
//        }
// </div>
// import React ,{Fragment, useEffect, useState}from 'react';
// import Modal from '../Modal';
// import {cab_purple, three_dot, airplane_1,intransit_trip, briefcase,calender_icon, double_arrow, cab, location, arrow_left, down_arrow, chevron_down, house_simple, train, bus} from '../../assets/icon';
// import AddLeg from '../addLeg/LegForm';

// import { formatDate, formatDate2, getCashAdvanceButtonText ,getStatusClass,urlRedirection} from '../../utils/handyFunctions';
// import Dropdown from '../Dropdown';
// import NotifyModal from '../NotifyModal';
// import CashCard from './CashCard';





// const UpcomingTrip = ({handleCashAdvance,handleTrip,upComingTrip,handleDropdownToggle,dropdownStates,content ,handleOpenOverlay}) => {
//   console.log('upcoming trip11',upComingTrip)
 
 
//   const [activeTabs, setActiveTabs] = useState();
//   useEffect(()=>{
    
//     const initialTabs = Array.from({ length: upComingTrip && upComingTrip?.length }, () => 'Trip');
//     console.log('initial tab',initialTabs)
//     setActiveTabs(['Trip','Trip','Trip'])

//       },[])

//   const handleTabChange = (index, tab) => {
//     setActiveTabs((prevTabs) => {
//       const newTabs = [...prevTabs];
//       newTabs[index] = tab;
//       return newTabs;
//     });
//   };
//   // setActiveTabs(upComingTrip.map(_=>'Trip'));
  
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const getIconForItinerary = (itineraryType) => {
//     switch (itineraryType) {
//       case 'flights':
//         return airplane_1;
//       case 'buses':
//         return bus ;
//       case 'trains':
//         return train;
//       case 'hotels':
//         return house_simple;
//       case 'cabs':
//         return cab_purple;
//       default:
//         return null;
//     }
//   };
//   // Open modal
//    const handleOpenModal = () => {
//      setIsModalOpen(true);
//    };
 
//    // Close modal
//    const handleCloseModal = () => {
//      setIsModalOpen(false);
//    };
 
//    // Cancel action
//    const handleCancel = () => {
//      // Handle the cancellation logic
//      console.log('Cancelled');
//    };



 

//   return (
//   <div className="w-auto   p-2 min-w-[458px]  h-[360px] rounded-lg bg-white-300 shadow-slate-300 overflow-hidden">
    
//     <div className="flex px-2 py-1 flex-row items-center justify-start gap-[8px] overflow-hidden">
//                <img
//                  className=" w-6 h-6   shrink-0"
//                  alt=""
//                  src={briefcase}
//                />
//                <b className=" tracking-[0.02em] font-cabin text-[16px] font-bold">Upcoming Trips</b>
//     </div>
//     <div className="w-auto   h-[340px]  flex flex-row overflow-x-auto scroll-smooth gap-4 ">
//       {upComingTrip?.map((item, index) => (
//         <React.Fragment key={index}>
//            <div className=" w-auto max-w-[650px] border border-slate-300  h-[310px] rounded-lg bg-white-300 ">
//         <div className='flex flex-row justify-between'>
//         <div className='flex   flex-row items-center justify-start text-center p-4'>
//             <div className={`py-1 px-2 rounded-xl   ${activeTabs[index]==="Trip" ? ' font-medium bg-purple-500  text-white text-xs rounded-xl':""}`} onClick={() => handleTabChange(index, "Trip")}>
//               Trip
//             </div>
//             <div className={`py-1 px-2 rounded-xl    ${activeTabs[index]==="Cash Advance" ? 'font-medium bg-purple-500 text-white text-xs ': ""}`} onClick={()=> handleTabChange(index,"Cash Advance" )}>
//               Cash Advance
//             </div>  
//         </div>
//          <div className="flex flex-none w-[40px] py-3 px-3 cursor-pointer justify-center items-start lg:items-center relative">
// <img
//   src={three_dot}
//   alt="three dot"
//   width={16}
//   height={16}
//   onClick={() => handleDropdownToggle(index)}
// />
// {dropdownStates[index] && (
//         <div className="absolute top-10 right-3 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 bg-white">
//           <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
//             <li>
//               <p
//                 onClick={()=>handleTrip(item.tripId,"trip-cancelletion-view")}
                
//                 className="block px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-600 dark:hover:text-white"
//               >
//                 Cancel
//               </p>
//             </li>

//             <li onClick={handleOpenModal}>
//               <p
                
//                 className="block px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-600 dark:hover:text-white"
//               >
//                 Modify
//               </p>
//             </li>
//             <Modal 
//             isOpen={isModalOpen} 
//             // onClose={handleCloseModal} 
         
//             // itineraryId={TravelRequestData.travelRequestId}
//             content={<AddLeg handleOpenOverlay={handleOpenOverlay} onClose={handleCloseModal} />}
          
//             onCancel={handleCancel} 
//             // handleOpenOverlay={handleOpenOverlay}
//             />
//           </ul>
//         </div>
//       )}
// </div>
// </div>
        
//    {/* ///intransit Trip data */}
       
      
//         {activeTabs[index] === 'Trip' && 
//         <>
//         <div className='px-4  w-auto min-w-[458px] flex flex-col h-auto min-h-[210px] gap-4'>
//         <div className='px-5 w-auto max-w-[650px] flex flex-col h-auto min-h-[210px] gap-4'>
// <div className='flex flex-row justify-between items-center  font-cabin  text-lg'>
//         <div><p>{item.tripPurpose}</p></div>
//              {/* <div  className='flex justify-end flex-none w-[40px]  cursor-pointer items-start lg:items-center relative'>
//               <img src={three_dot}  
//               width={16} 
//               height={16}
//               onClick={() => handleDropdownToggle(intransitDetails.tripStatus)}
//               />
//               {dropdownStates[intransitDetails.tripStatus] && (
//         <div className="absolute top-6 right-3 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 bg-white">
//           <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
//             <li>
//               <a
//                 href="#"
//                 className="block px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-600 dark:hover:text-white"
//                 onClick={()=>(urlRedirection(CANCEL_TRIP))}
//               >
//                 Cancel
//               </a>
//             </li>

//             <li onClick={(handleOpenModal)}>
//               <a
//                 href="#"
//                 className="block px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-600 dark:hover:text-white"
//               >
//                 Add a Leg
//               </a>
              
        
//             </li>
//             <Modal 
//             isOpen={isModalOpen} 
//             onClose={handleCloseModal}       
//             // itineraryId={TravelRequestData.travelRequestId}
//             content={<AddLeg handleOpenOverlay={handleOpenOverlay} onClose={handleCloseModal} />}
//             onCancel={handleCancel} 
//             // handleOpenOverlay={handleOpenOverlay}
//             />
//           </ul>
//         </div>
//       )}
//         </div> */}
// </div>
// <div>
 
  
 
//   <div className='h-[150px] w-[600px] overflow-y-auto'>
//    <div className="p-2 flex flex-col gap-y-4">
//       {Object.keys(item.itinerary).map(key => (
//         <div key={key}>
//           {key !== 'formState' && item.itinerary[key].length > 0 && (
//             <div className='w-full'>
//               <div className='flex gap-2 font-cabin items-center text-neutral-600 mb-2 '>
//               <img src={getIconForItinerary(key)} className='w-4 h-4' />
//               <h2 className="text-md font-semibold  text-center">{key.charAt(0).toUpperCase() + key.slice(1)}</h2>
//               </div>
//               <div className="">
//                 {item.itinerary[key].map(item => (
//                   <div key={item._id} className="bg-white p-4 rounded shadow w-full   ">
//               {['flights','trains','buses'].includes(key)  && (
//                    <div className='flex flex-row items-center '>
//                     <div className='flex-1 inline-flex items-center  gap-1'>
//                       <img src={calender_icon} alt='icon' className='w-4 h-4'/>
//                       <span className='text-sm font-cabin'>{formatDate2(item?.bkd_date)}</span>
//                     </div>
//                     <div className='flex-1 inline-flex items-center gap-2'>
//                     <p className='font-cabin text-sm'>{item.bkd_from}</p>
//                     <img src={double_arrow} className='w-5 h-5' alt='icon'/>
//                     <p className='font-cabin text-sm'>{item.bkd_to}</p>
//                     </div>

//                     <div className='flex-1 inline-flex  items-center  justify-center '>
//                       <div className={`px-2 py-1 rounded-sm text-center ${getStatusClass(item.status)}`}>
//                       <span className='text-sm  capitalize font-cabin '>{item.status}</span>
//                     </div>
//                     </div>
    
//                   </div>
//                 )}
                
//                 {key === 'cabs' && (
          
//                    <div className='flex flex-row items-center '>
//                    <div className='flex-1 inline-flex items-center  gap-1 '>
//                      <img src={calender_icon} alt='icon' className='w-4 h-4'/>
//                      <span className='text-sm font-cabin'>{formatDate(item.bkd_date)}</span>
//                    </div>
//                    <div className='flex-1 inline-flex items-center gap-2'>
//                    <p className='font-cabin text-sm'>{item.bkd_pickupAddress}</p>
//                    <img src={double_arrow} className='w-5 h-5' alt='icon'/>
//                    <p className='font-cabin text-sm'>{item.bkd_dropAddress}</p>
//                    </div>
                   
//                    <div className='flex-1 inline-flex  items-center  justify-center '>
//                      <div className={`px-2 py-1 rounded-sm   ${getStatusClass(item.status)}`}>
//                      <span className='text-sm text-center capitalize font-cabin '>{item.status}</span>
//                      </div>
//                    </div>
   
//                  </div>
//                 )}
//                    {key === 'hotels' && (
//                        <div className='flex flex-row items-center  gap-x-2 '>
//                        <div className='flex-1 mr-4 inline-flex items-center  '>
                        
//                          <span className='text-sm font-cabin'>{item?.bkd_location}</span>
//                        </div>
//                        <div className='flex-1 inline-flex items-center justify-center gap-1'>
//                        <img src={calender_icon} alt='icon' className='w-4 h-4'/>
//                        <p className='font-cabin text-sm'>{formatDate(item?.bkd_checkIn)}</p>
//                        </div>
//                        <div className='flex-1 inline-flex items-center justify-center gap-1'>
//                        <img src={calender_icon} alt='icon' className='w-4 h-4'/>
//                        <p className='font-cabin text-sm'>{formatDate(item?.bkd_checkOut)}</p>
//                        </div>
                       
//                        <div className='flex-1 inline-flex  items-center  justify-center '>
//                          <div className={`px-2 py-1 rounded-sm    ${getStatusClass(item?.status)}`}>
//                          <span className='text-sm text-center capitalize font-cabin '>{item?.status}</span>
//                          </div>
//                        </div>
       
//                      </div>
//                     )}    
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       ))}
// </div>
// </div>

// </div>
// <div className=''>
// <div onClick={()=>{handleCashAdvance(item?.travelRequestId,"", 'ca-create')}} className="rounded-[32px] w-fit box-border h-[33px] flex flex-row items-center justify-center py-4 px-2  cursor-pointer border-[1px] border-solid border-purple-500">
//       <div className="font-medium text-[12px] w-fit h-[17px] text-purple-500">{getCashAdvanceButtonText(item?.tripStartDate)}</div>
// </div>

// </div>

   

//    </div>





      

//    </div>
        
//         </>
//           }

//           {activeTabs[index]=== 'Cash Advance' && 
//            ( 
//             <div className='h-[240px] w-[650px] overflow-y-auto '>
//              <div className='mx-4 w-full gap-4 flex flex-col '> 
//             <CashCard handleCashAdvance={handleCashAdvance} cashAdvances={item?.cashAdvances}/>
//             </div>
//             </div>
//             )}

          
      
// </div>
//         </React.Fragment>
//       ))}
//     </div>
//     {/* {showConfirmationOverlay && (
//   <NotifyModal/>
// )} */}
//   </div>)
// };



// export default UpcomingTrip
// import React ,{Fragment, useState}from 'react';
// import Modal from '../Modal';
// import { three_dot, airplane_1,intransit_trip, briefcase,calender_icon, double_arrow, cab, location, arrow_left, down_arrow, chevron_down} from '../../assets/icon';
// import AddLeg from '../addLeg/LegForm';
// import { CANCEL_TRIP, CREATE_CASH_ADVANCE } from '../../utils/url';
// import { getCashAdvanceButtonText ,urlRedirection} from '../../utils/handyFunctions';
// import Dropdown from '../Dropdown';
// import NotifyModal from '../NotifyModal';
// import CashCard from './CashCard';




// const UpcomingTrip = ({upComingTrip,handleDropdownToggle,dropdownStates,content ,handleOpenOverlay}) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
  
//   // Open modal
//    const handleOpenModal = () => {
//      setIsModalOpen(true);
//    };
 
//    // Close modal
//    const handleCloseModal = () => {
//      setIsModalOpen(false);
//    };
 
//    // Cancel action
//    const handleCancel = () => {
//      // Handle the cancellation logic
//      console.log('Cancelled');
//    };



//   const initialTabs = Array.from({ length: upComingTrip.length }, () => 'Trip');
//   const [activeTabs, setActiveTabs] = useState(initialTabs);

//   const handleTabChange = (index, tab) => {
//     setActiveTabs((prevTabs) => {
//       const newTabs = [...prevTabs];
//       newTabs[index] = tab;
//       return newTabs;
//     });
//   };

//   return (
//   <div className="w-auto p-2 min-w-[458px]  h-[330px] rounded-lg bg-white-300 shadow-[0px_12px_3px_rgba(0,_0,_0,_0),_0px_8px_3px_rgba(0,_0,_0,_0.01),_0px_4px_3px_rgba(0,_0,_0,_0.03),_0px_2px_2px_rgba(0,_0,_0,_0.05),_0px_0px_1px_rgba(0,_0,_0,_0.06)] overflow-hidden">
    
//     <div className="flex flex-row items-center justify-start gap-[8px] overflow-hidden">
//                <img
//                  className=" w-6 h-6   shrink-0"
//                  alt=""
//                  src={briefcase}
//                />
//                <b className=" tracking-[0.02em] font-cabin text-[16px] font-bold">Upcoming Trips</b>
//     </div>
//     <div className="w-auto max-w-[932px] h-[300px]  flex flex-row overflow-x-auto scroll-smooth gap-4 ">
//       {upComingTrip.map((item, index) => (
//         <React.Fragment key={index}>
//            <div className=" w-auto  max-w-[458px] h-[287px] rounded-lg bg-white-300 shadow-[0px_12px_3px_rgba(0,_0,_0,_0),_0px_8px_3px_rgba(0,_0,_0,_0.01),_0px_4px_3px_rgba(0,_0,_0,_0.03),_0px_2px_2px_rgba(0,_0,_0,_0.05),_0px_0px_1px_rgba(0,_0,_0,_0.06)]">
//         <div className='flex flex-row justify-between'>
//         <div className='flex  flex-row items-center justify-start text-center p-4'>
//             <div className={`py-1 px-2 rounded-xl   ${activeTabs[index]==="Trip" ? ' font-medium bg-purple-500  text-white text-xs rounded-xl':""}`} onClick={() => handleTabChange(index, "Trip")}>
//               Trip
//             </div>
//             <div className={`py-1 px-2 rounded-xl    ${activeTabs[index]==="Cash Advance" ? 'font-medium bg-purple-500 text-white text-xs ': ""}`} onClick={()=> handleTabChange(index,"Cash Advance" )}>
//               Cash Advance
//             </div>  
//             <div className={`py-1 px-2 rounded-xl    ${activeTabs[index]==="Expense" ? 'font-medium bg-purple-500 text-white text-xs ': ""}`} onClick={()=> handleTabChange(index,"Expense" )}>
//               Expense
//             </div>  
//         </div>
//          <div className="flex flex-none w-[40px] py-3 px-3 cursor-pointer justify-center items-start lg:items-center relative">
// <img
//   src={three_dot}
//   alt="three dot"
//   width={16}
//   height={16}
//   onClick={() => handleDropdownToggle(index)}
// />
// {dropdownStates[index] && (
//         <div className="absolute top-10 right-3 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 bg-white">
//           <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
//             <li>
//               <p
//                 onClick={()=>(urlRedirection(CANCEL_TRIP))}
                
//                 className="block px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-600 dark:hover:text-white"
//               >
//                 Cancel
//               </p>
//             </li>

//             <li onClick={handleOpenModal}>
//               <p
                
//                 className="block px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-600 dark:hover:text-white"
//               >
//                 Modify
//               </p>
//             </li>
//             <Modal 
//             isOpen={isModalOpen} 
//             // onClose={handleCloseModal} 
         
//             // itineraryId={TravelRequestData.travelRequestId}
//             content={<AddLeg handleOpenOverlay={handleOpenOverlay} onClose={handleCloseModal} />}
          
//             onCancel={handleCancel} 
//             // handleOpenOverlay={handleOpenOverlay}
//             />
//           </ul>
//         </div>
//       )}
// </div>
// </div>
        
//           {/* ///intransit Trip data */}
       
      
//         {activeTabs[index] === 'Trip' && 
//         <>
//         <div className='px-4 w-auto min-w-[458px] flex flex-col h-auto min-h-[210px] gap-4'>

// <div className='flex flex-row justify-between'>
//      <div className="  flex flex-row items-start justify-start gap-[16px] text-sm text-darkslategray">
//       <div className="flex flex-row items-start justify-start gap-4">
//         <div className="flex flex-col items-start justify-start gap-[12px]">
//           <div className=" tracking-[0.03em] w-[197px] text-[14px] font-cabin font-medium truncate">Meeting with Technology InfoTech</div>
//           <div className="flex flex-col items-start justify-start gap-[16px] text-xs text-dimgray">
//             <div className="flex flex-row items-end justify-start gap-[8px] font-cabin text-[12px] font-normal">
//               <div className="">New York</div>
//               <img className=" w-4 h-4 overflow-hidden shrink-0" alt="" src={double_arrow} />
//               <div className="">Kyton,Japan</div>
//             </div>
//             <div className="flex flex-row items-end justify-start gap-[4px]">
//               <img className=" w-4 h-4 overflow-hidden shrink-0" alt="" src={calender_icon} />
//               <div className="flex flex-row items-start justify-start gap-[8px] font-cabin font-medium text-[12px]">
//                 <div className="">17-Sep-2023</div>
//                 <div className="">to</div>
//                 <div className="">20-Sep-2023</div>
//               </div>
//             </div>
//           </div>
//         </div>
    
//       </div>
//       </div>
//       <div className="  flex flex-row items-start justify-start gap-[16px] text-center text-purple-500">
        
//         {/* <div className="rounded-[32px] w-auto box-border h-[33px] flex flex-row items-center justify-center py-4 px-2 cursor-pointer border-[1px] border-solid border-purple-500">
//       <div className="font-medium text-[12px] w-[85px] h-[17px]">Book Expense</div>
//     </div> */}
//     <div onClick={()=>urlRedirection(CREATE_CASH_ADVANCE)} className="rounded-[32px] w-full box-border h-[33px] flex flex-row items-center justify-center py-4 px-2  cursor-pointer border-[1px] border-solid border-purple-500">
//       <div className="font-medium text-[12px] w-fit h-[17px]">{getCashAdvanceButtonText("06-dec-2023")}</div>
//     </div>
         
         
//        </div>
//        </div>



//        <div className="  rounded-xl bg-purple-300 w-auto max-w-[405px] h-[93px]  text-xs text-gray-900 px-4 py-2 flex flex-col gap-2">
//        <div className=" ">2:00 PM</div>
//        <div className=" text-base">Cab Booking</div>
      
//        <div className=' flex flex-row w-auto'>
//        <div className="flex flex-1  flex-row items-center justify-start gap-[4px]">
//       <img className="  h-4 overflow-hidden shrink-0" alt="" src={location} />
//       <div className="">LnT Office Building, Gurugram</div>
//     </div>
       
//        <div className="  flex flex-1 flex-row items-center justify-start gap-[4px]">
//       <img className=" w-4 h-4 overflow-hidden shrink-0" alt="" src={cab} />
//       <div className="">Cab Number: DL-02-0123</div>
//     </div>
//     </div>

       
//      </div>

//    </div>
        
//         </>
//           }

//           {activeTabs[index]=== 'Cash Advance' && 
//            ( 
//             <div className='h-[210px] min-w-[458px] overflow-y-auto '>
//              <div className='mx-4 w-auto max-w-[458px] gap-4 flex flex-col '> 
//             <CashCard cashAdvances={item.cashAdvances}/>
//             </div>
//             </div>
//             )}

//            {/* // <>
//           //  <div className='px-5 w-auto max-w-[458px] flex flex-col h-auto min-h-[210px] gap-4'>
//           // <div className='px-5 w-auto min-w-[458px] flex flex-col h-auto min-h-[210px] gap-4'>
//           //   Cash Advance 
//           //   <ul>
//           //     <li>Total Cash advances amt</li>
//           //     <li>Raised Cash advance with cancel and modify btn</li>
//           //     <li>add priority cash advance btn</li>
//           //     </ul>
//           //   </div>
//           // </> */}
//           {activeTabs[index]=== 'Expense' && 
//           <>
//             {/* <div className='px-5 w-auto max-w-[458px] flex flex-col h-auto min-h-[210px] gap-4'> */}
//             <div className='px-5 w-auto min-w-[458px] flex flex-col h-auto min-h-[210px] gap-4'>
//               Cash Advance 
//             <ul>
//               <li>Total Cash advances amt</li>
//               <li>Raised Cash advance with cancel and modify btn</li>
//               <li>add priority cash advance btn</li>
//             </ul>
//             </div>
//           </>}
      
// </div>
//         </React.Fragment>
//       ))}
//     </div>
//     {/* {showConfirmationOverlay && (
//   <NotifyModal/>
// )} */}
//   </div>)
// };



// export default UpcomingTrip













///this is old code but working you can check it

// import React from 'react';
// import { calender_icon, double_arrow , intransit_trip , upcoming_trip} from '../../assets/icon';


// export const UpcomingContent = ({ travelName, from, to, departureDate, returnDate }) => {
    
  
//   return (
//     <>
//      {/* <div  className="absolute top-[75px] left-[24px] flex flex-col items-start justify-start gap-[24px] text-sm text-darkslategray"> */}
//                   <div className="box-border w-[410px] flex flex-row items-start justify-between pt-0 px-0 pb-6 border-b-[1px] border-solid border-ebgrey-100">
//                     <div className="flex flex-col items-start justify-start gap-[12px] text-gray-400">
//                       <div className="relative tracking-[0.03em] font-medium">
//                         {travelName}
//                       </div>
//                       <div className="flex flex-col items-start justify-start gap-[16px] text-xs text-gray-300">
//                         <div className="flex flex-row items-end justify-start gap-[8px]">
//                           <div className="relative">{from}</div>
//                           <img
//                             className="relative w-4 h-4 overflow-hidden shrink-0"
//                             alt=""
//                             src={double_arrow}
//                           />
//                           <div className="relative">{to}</div>
//                         </div>
//                         <div className="flex flex-row items-end justify-start gap-[4px]">
//                           <img
//                             className="relative w-4 h-4 overflow-hidden shrink-0"
//                             alt=""
//                             src={calender_icon}
//                           />
//                           <div className="flex flex-row items-start justify-start gap-[8px]">
//                             <div className="relative">{departureDate}</div>
//                             <div className="relative">{`to `}</div>
//                             <div className="relative">{returnDate}</div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     {/* <div className="rounded-[32px] box-border h-[33px] flex flex-row items-center justify-center py-4 px-4 relative text-center text-purple-500 border-[1px] border-solid border-purple-500">
//                       <div className="absolute my-0 mx-[!important] top-[8px] left-[16px] font-medium z-[0]">
//                         View Trip
//                       </div>
//                     </div> */}
//                     <div className='float-right'>
//                                    <div  className="w-full h-[33px] px-4 border border-purple-500 text-purple-500  rounded-[32px] justify-center items-center  inline-flex cursor-pointer">
//         <div className= "w-full h-5 text-center  text-[14px] font-medium font-cabin">
//             View Trip

//         </div>
      
//     </div>

    
//                   </div>
//                   </div>
                 
                  
//                 {/* </div> */}
//     </>
//   )
// }



// export const NoUpcomingContent = () => (
//   <div className='w-[200px]'>
//     <img src={upcoming_trip} alt="NoTrip" />
//     <div className="absolute top-[140px] w-[200px] mr-48 flex flex-col justify-center items-start gap-4 text-gray-400">
//        <div className="flex flex-col items-start justify-center ">
//          <div className="tracking-[0.02em] ">You have no upcoming trips, yet</div>
//        </div>
//        {/* <ActionButton label="View previous" /> */}
//        <div className="rounded-lg h-8 flex flex-row items-center justify-center py-4 px-0 box-border text-center text-sm text-gray-400">
//          <b className="relative tracking-[0.02em]">Create</b>
//         </div>
//      </div>
//   </div>
//   // <div className="absolute flex flex-row self-stretch top-[72px] left-[23px] items-start justify-start gap-[16px] text-sm">
//   //   <img src={intransit_trip} alt="NoTrip" />
//   //   <div className="absolute top-[140px] w-[191px] flex flex-col justify-center items-start gap-4 text-gray-400">
//   //     <div className="flex flex-col items-start justify-center">
//   //       <div className="tracking-[0.02em]">No trips in transit right now</div>
//   //     </div>
//   //     {/* <ActionButton label="View previous" /> */}
//   //     <div className="rounded-lg h-8 flex flex-row items-center justify-center py-4 px-0 box-border text-center text-sm text-gray-400">
//   //       <b className="relative tracking-[0.02em]">View previous</b>
//   //      </div>
//   //   </div>
//   // </div>
// );


