import React ,{Fragment, useState}from 'react';
import { tripArray } from '../utils/dummyData';
import { receipt,three_dot, airplane_1,intransit_trip, briefcase,calender, double_arrow, cab, location} from '../assets/icon';


const Overview = () => {

  const [dropdownStates, setDropdownStates] = useState({});

    
    const [activeTab , setActiveTab]=useState('Trip')
    const handleTabChange =(tab)=>{
      setActiveTab(tab)
    }

const handleDropdownToggle = (index) => {
    setDropdownStates((prevStates) => ({
      ...prevStates,
      [index]: !prevStates[index],
    }));
  };
    
    const inTransitTrip = tripArray.filter((trip)=>(trip.tripStatus==='inTransit'))
    console.log(inTransitTrip)
    const upComingTrip = tripArray.filter((trip)=>(trip.tripStatus==='upcoming'))
  return (
  <div className='bg-[#F8F7F7] pt-12'>
  <div className=" lg:ml-[244px] pl-[64px]   pr-10 ">
  <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 w-auto max-w-[932px]'>

  <div className='w-[458px]'>
    <TransitTrip dropdownStates={dropdownStates} handleDropdownToggle={handleDropdownToggle}  activeTab={activeTab} handleTabChange={handleTabChange} inTransitTrip={inTransitTrip}/>
    {/* <TransitTrip activeTab={activeTab} handleTabChange={handleTabChange} inTransitTrip={inTransitTrip}/> */}
  </div>
  <div className=''>
    <Notification />
  </div>

  {/* Third Div taking full width in the next row */}
  <div className='lg:col-span-2'>
    <UpcomingTrips dropdownStates={dropdownStates}    upComingTrip={upComingTrip} handleDropdownToggle={handleDropdownToggle}/>
  </div>
</div>




        </div>

      
    </div>
  )
}

export default Overview;




const TransitTrip = ({activeTab ,handleTabChange ,inTransitTrip ,handleDropdownToggle,dropdownStates})=>(
    <div className=" w-auto  max-w-[458px] h-[300px] rounded-lg bg-white-300 shadow-[0px_12px_3px_rgba(0,_0,_0,_0),_0px_8px_3px_rgba(0,_0,_0,_0.01),_0px_4px_3px_rgba(0,_0,_0,_0.03),_0px_2px_2px_rgba(0,_0,_0,_0.05),_0px_0px_1px_rgba(0,_0,_0,_0.06)]">
        <div className='flex flex-row items-center justify-start text-center p-4'>
            <div className={`py-1 px-2 rounded-xl   ${activeTab==="Trip" ? ' font-medium bg-purple-500  text-white-100 text-xs rounded-xl':""}`} onClick={()=>handleTabChange("Trip")}>
              Trip
            </div>
            <div className={`py-1 px-2 rounded-xl    ${activeTab==="Cash Advance" ? 'font-medium bg-purple-500 text-white-100 text-xs ': ""}`} onClick={()=> handleTabChange("Cash Advance" )}>
              Cash Advance
            </div>  
            <div className={`py-1 px-2 rounded-xl    ${activeTab==="Expense" ? 'font-medium bg-purple-500 text-white-100 text-xs ': ""}`} onClick={()=> handleTabChange("Expense" )}>
              Expense
            </div>  
        </div>
        
          {/* ///intransit Trip data */}
       
      
        {activeTab ==="Trip" && 
        <>
        {inTransitTrip.map((intransitDetails,index)=>(
          <React.Fragment key={index}>
              <div className='px-5 w-auto max-w-[458px] flex flex-col h-auto min-h-[210px] gap-4'>
<div className='flex flex-row justify-between items-center'>
        <div className="flex flex-row items-center justify-start gap-[8px]">
               <img
                 className=" w-6 h-6 overflow-hidden shrink-0"
                 alt=""
                 src={airplane_1}
               />
               <b className=" tracking-[0.02em] font-cabin text-[16px] font-bold">In Transit</b>
             </div>
             <div  className='flex flex-none w-[40px]  cursor-pointer justify-center items-start lg:items-center relative'>
              <img src={three_dot}  
              width={16} 
              height={16}
              onClick={() => handleDropdownToggle(intransitDetails.tripStatus)}
              />
              {dropdownStates[intransitDetails.tripStatus] && (
        <div className="absolute top-6 right-3 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 bg-white-100">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Cancel
              </a>
            </li>

            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Modify
              </a>
            </li>
          </ul>
        </div>
      )}
             </div>





</div>

     <div className="  flex flex-row items-start justify-start gap-[16px] text-sm text-darkslategray">
      <div className="flex flex-row items-start justify-start gap-4">
        <div className="flex flex-col items-start justify-start gap-[12px]">
          <div className=" tracking-[0.03em] w-[197px] text-[14px] font-cabin font-medium truncate">Meeting with Technology InfoTech</div>
          <div className="flex flex-col items-start justify-start gap-[16px] text-xs text-dimgray">
            <div className="flex flex-row items-end justify-start gap-[8px] font-cabin text-[12px] font-normal">
              <div className="">{intransitDetails.from}</div>
              <img className=" w-4 h-4 overflow-hidden shrink-0" alt="" src={double_arrow} />
              <div className="">{intransitDetails.to}</div>
            </div>
            <div className="flex flex-row items-end justify-start gap-[4px]">
              <img className=" w-4 h-4 overflow-hidden shrink-0" alt="" src={calender} />
              <div className="flex flex-row items-start justify-start gap-[8px] font-cabin font-medium text-[12px]">
                <div className="">17-Sep-2023</div>
                <div className="">to</div>
                <div className="">20-Sep-2023</div>
              </div>
            </div>
          </div>
        </div>
        <div className=" float-right flex flex-row items-start justify-start gap-[16px] text-center text-purple-500">
        
        <div className="rounded-[32px] w-auto box-border h-[33px] flex flex-row items-center justify-center py-4 px-2 cursor-pointer border-[1px] border-solid border-purple-500">
      <div className="font-medium text-[12px] w-[85px] h-[17px]">Book Expense</div>
    </div>
    <div className="rounded-[32px] w-full box-border h-[33px] flex flex-row items-center justify-center py-4 px-2  cursor-pointer border-[1px] border-solid border-purple-500">
      <div className="font-medium text-[12px] w-[55px] h-[17px]">View Trip</div>
    </div>
         
         
       </div>
      </div>
      </div>

       <div className="  rounded-xl bg-purple-300 w-auto max-w-[405px] h-[93px]  text-xs text-gray-900 px-4 py-2 flex flex-col gap-2">
       <div className=" ">2:00 PM</div>
       <div className=" text-base">Cab Booking</div>
      
       <div className=' flex flex-row w-auto'>
       <div className="flex flex-1  flex-row items-center justify-start gap-[4px]">
      <img className="  h-4 overflow-hidden shrink-0" alt="" src={location} />
      <div className="">LnT Office Building, Gurugram</div>
    </div>
       
       <div className="  flex flex-1 flex-row items-center justify-start gap-[4px]">
      <img className=" w-4 h-4 overflow-hidden shrink-0" alt="" src={cab} />
      <div className="">Cab Number: DL-02-0123</div>
    </div>
    </div>

       
     </div>

   </div>
          </React.Fragment>
        ))}
      
        
        </>
          }

        {activeTab ==="Cash Advance" && 
        <>
          <div className='px-5 w-auto max-w-[458px] flex flex-col h-auto min-h-[210px] gap-4'>
            Cash Advance 
            <ul>
              <li>Total Cash advances amt</li>
              <li>Raised Cash advance with cancel and modify btn</li>
              <li>add priority cash advance btn</li>
              </ul>
            </div>
         </>
          } 
        {activeTab ==="Expense" && 
         <>
          <div className='px-5 w-auto max-w-[458px] flex flex-col h-auto min-h-[210px] gap-4'>Expense</div>
         </>
          } 
      
</div>   
)



const NoInTransitContent = () => (
    <div className=" flex flex-row self-stretch top-[72px] left-[23px] items-start justify-start gap-[16px] text-sm">
      <img src={intransit_trip} alt="NoTrip" />
      <div className=" top-[140px] w-[191px] flex flex-col justify-center items-start gap-4 text-gray-400">
        <div className="flex flex-col items-start justify-center">
          <div className="tracking-[0.02em]">No trips in transit right now</div>
        </div>
     
        <div className="rounded-lg h-8 flex flex-row items-center justify-center py-4 px-0 box-border text-center text-sm text-gray-400">
          <b className=" tracking-[0.02em]">View previous</b>
         </div>
      </div>
    </div>
  );




const Notification = ()=>(
    <div className="w-auto  max-w-[458px] h-[300px]  rounded-lg bg-white-300 shadow-[0px_12px_3px_rgba(0,_0,_0,_0),_0px_8px_3px_rgba(0,_0,_0,_0.01),_0px_4px_3px_rgba(0,_0,_0,_0.03),_0px_2px_2px_rgba(0,_0,_0,_0.05),_0px_0px_1px_rgba(0,_0,_0,_0.06)]">
        Notification
    </div>
)






const UpcomingTrips = ({upComingTrip,handleDropdownToggle,dropdownStates}) => {
  const initialTabs = Array.from({ length: upComingTrip.length }, () => 'Trip');
  const [activeTabs, setActiveTabs] = useState(initialTabs);

  const handleTabChange = (index, tab) => {
    setActiveTabs((prevTabs) => {
      const newTabs = [...prevTabs];
      newTabs[index] = tab;
      return newTabs;
    });
  };

  return (
  <div className="w-auto p-2 min-w-[458px]  h-[330px] rounded-lg bg-white-300 shadow-[0px_12px_3px_rgba(0,_0,_0,_0),_0px_8px_3px_rgba(0,_0,_0,_0.01),_0px_4px_3px_rgba(0,_0,_0,_0.03),_0px_2px_2px_rgba(0,_0,_0,_0.05),_0px_0px_1px_rgba(0,_0,_0,_0.06)] overflow-hidden">
    
    <div className="flex flex-row items-center justify-start gap-[8px] overflow-hidden">
               <img
                 className=" w-6 h-6   shrink-0"
                 alt=""
                 src={briefcase}
               />
               <b className=" tracking-[0.02em] font-cabin text-[16px] font-bold">Upcoming Trips</b>
    </div>
    <div className="w-auto max-w-[932px] h-[300px]  flex flex-row overflow-x-auto scroll-smooth gap-4 ">
      {upComingTrip.map((tripDetails, index) => (
        <React.Fragment key={index}>
           <div className=" w-auto  max-w-[458px] h-[287px] rounded-lg bg-white-300 shadow-[0px_12px_3px_rgba(0,_0,_0,_0),_0px_8px_3px_rgba(0,_0,_0,_0.01),_0px_4px_3px_rgba(0,_0,_0,_0.03),_0px_2px_2px_rgba(0,_0,_0,_0.05),_0px_0px_1px_rgba(0,_0,_0,_0.06)]">
        <div className='flex flex-row justify-between'>
        <div className='flex  flex-row items-center justify-start text-center p-4'>
            <div className={`py-1 px-2 rounded-xl   ${activeTabs[index]==="Trip" ? ' font-medium bg-purple-500  text-white-100 text-xs rounded-xl':""}`} onClick={() => handleTabChange(index, "Trip")}>
              Trip
            </div>
            <div className={`py-1 px-2 rounded-xl    ${activeTabs[index]==="Cash Advance" ? 'font-medium bg-purple-500 text-white-100 text-xs ': ""}`} onClick={()=> handleTabChange(index,"Cash Advance" )}>
              Cash Advance
            </div>  
            <div className={`py-1 px-2 rounded-xl    ${activeTabs[index]==="Expense" ? 'font-medium bg-purple-500 text-white-100 text-xs ': ""}`} onClick={()=> handleTabChange(index,"Expense" )}>
              Expense
            </div>  
        </div>
         <div className="flex flex-none w-[40px] py-3 px-3 cursor-pointer justify-center items-start lg:items-center relative">
<img
  src={three_dot}
  alt="three dot"
  width={16}
  height={16}
  onClick={() => handleDropdownToggle(index)}
/>
{dropdownStates[index] && (
        <div className="absolute top-10 right-3 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 bg-white-100">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Cancel
              </a>
            </li>

            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Modify
              </a>
            </li>
          </ul>
        </div>
      )}
</div>
</div>
        
          {/* ///intransit Trip data */}
       
      
        {activeTabs[index] === 'Trip' && 
        <>
        <div className='px-5 w-auto min-w-[458px] flex flex-col h-auto min-h-[210px] gap-4'>


     <div className="  flex flex-row items-start justify-start gap-[16px] text-sm text-darkslategray">
      <div className="flex flex-row items-start justify-start gap-4">
        <div className="flex flex-col items-start justify-start gap-[12px]">
          <div className=" tracking-[0.03em] w-[197px] text-[14px] font-cabin font-medium truncate">Meeting with Technology InfoTech</div>
          <div className="flex flex-col items-start justify-start gap-[16px] text-xs text-dimgray">
            <div className="flex flex-row items-end justify-start gap-[8px] font-cabin text-[12px] font-normal">
              <div className="">New York</div>
              <img className=" w-4 h-4 overflow-hidden shrink-0" alt="" src={double_arrow} />
              <div className="">Kyton,Japan</div>
            </div>
            <div className="flex flex-row items-end justify-start gap-[4px]">
              <img className=" w-4 h-4 overflow-hidden shrink-0" alt="" src={calender} />
              <div className="flex flex-row items-start justify-start gap-[8px] font-cabin font-medium text-[12px]">
                <div className="">17-Sep-2023</div>
                <div className="">to</div>
                <div className="">20-Sep-2023</div>
              </div>
            </div>
          </div>
        </div>
    
      </div>
      </div>

       <div className="  rounded-xl bg-purple-300 w-auto max-w-[405px] h-[93px]  text-xs text-gray-900 px-4 py-2 flex flex-col gap-2">
       <div className=" ">2:00 PM</div>
       <div className=" text-base">Cab Booking</div>
      
       <div className=' flex flex-row w-auto'>
       <div className="flex flex-1  flex-row items-center justify-start gap-[4px]">
      <img className="  h-4 overflow-hidden shrink-0" alt="" src={location} />
      <div className="">LnT Office Building, Gurugram</div>
    </div>
       
       <div className="  flex flex-1 flex-row items-center justify-start gap-[4px]">
      <img className=" w-4 h-4 overflow-hidden shrink-0" alt="" src={cab} />
      <div className="">Cab Number: DL-02-0123</div>
    </div>
    </div>

       
     </div>

   </div>
        
        </>
          }

          {activeTabs[index]=== 'Cash Advance' && 
          <>
          {/* <div className='px-5 w-auto max-w-[458px] flex flex-col h-auto min-h-[210px] gap-4'> */}
          <div className='px-5 w-auto min-w-[458px] flex flex-col h-auto min-h-[210px] gap-4'>
            Cash Advance 
            <ul>
              <li>Total Cash advances amt</li>
              <li>Raised Cash advance with cancel and modify btn</li>
              <li>add priority cash advance btn</li>
              </ul>
            </div>
          </>}
          {activeTabs[index]=== 'Expense' && 
          <>
            {/* <div className='px-5 w-auto max-w-[458px] flex flex-col h-auto min-h-[210px] gap-4'> */}
            <div className='px-5 w-auto min-w-[458px] flex flex-col h-auto min-h-[210px] gap-4'>
              Cash Advance 
            <ul>
              <li>Total Cash advances amt</li>
              <li>Raised Cash advance with cancel and modify btn</li>
              <li>add priority cash advance btn</li>
            </ul>
            </div>
          </>}
      
</div>
        </React.Fragment>
      ))}
    </div>
  </div>)
};



 


