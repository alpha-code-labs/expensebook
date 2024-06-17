import React, { useState,useEffect } from 'react';
import { useData } from '../api/DataProvider';
import { receipt} from '../assets/icon';
import PendingTrBooking from '../components/travelAdmin/PendingTrBooking';
import CancelledTrRequest from '../components/trips/CancelledTrip';
import { handleTravel, handleTrip } from '../utils/actionHandler';
import { useParams } from 'react-router-dom';
import { filterTravelRequests } from '../utils/handyFunctions';




const BookingAdmin = ({fetchData}) => {  

  const { employeeData,employeeRoles  } = useData();
  const {tenantId , empId ,page}=useParams()

  useEffect(()=>{

    fetchData(tenantId,empId,page)

  },[])


  
  

  const [travelBookingData ,setTravelBookingData]=useState(null)
  const [cancelledTrips , setCancelledTrips]=useState(null)
  useEffect(()=>{
    const data = employeeData && employeeData?.dashboardViews?.businessAdmin
   
    setTravelBookingData(data?.pendingBooking)
    // setCancelledTrips(data?.travelExpenseReports)
  },[employeeData])
  console.log('Business Admin pending bookings',travelBookingData )
  console.log('Business Admin employee details',employeeRoles?.employeeInfo?.employeeDetails
  )
 
  
  // const [DropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownStates, setDropdownStates] = useState({});

 
  
  const [activeScreen, setActiveScreen] = useState('Pending Bookings');
  const handleScreenChange = (screen) => {
    setActiveScreen(screen);
  };
  


  let filteredData
if(travelBookingData){
  let filteredTravelRequests = filterTravelRequests(travelBookingData);
  filteredData=filteredTravelRequests
  console.log('filter booking pending requests',filteredTravelRequests);
}
  
  
  
  


    
  return (
    <>
      {/* <div className="bg-white-100 lg:flex"> */}
      <div className="w-auto min-h-screen  flex flex-col lg:w-auto items-center px-2 lg:px-20    pt-[50px] bg-slate-100 ">
         
          <div className="  flex flex-row items-center justify-start gap-2 sm:gap-4 font-cabin mb-2">
<div className='relative'>
          {filteredData && filteredData.length > 0 &&  <div className=' absolute right-[-1px] top-[-8px] w-fit p-[6px] bg-green-200 border border-white-100 rounded-full '/>}
                  <div
                    className={`cursor-pointer rounded-xl  py-1 px-2 w-auto min-w-[100px] truncate${
                      activeScreen === 'Pending Bookings' ? 'font-medium rounded-xl bg-purple-500 text-xs text-white-100 w-auto min-w-[100px] truncate' : 'rounded-xl bg-white-100 text-neutral-800'
                    }`}
                    onClick={() => handleScreenChange('Pending Bookings')}
                  >
                    Pending Bookings
                  </div>
                  </div>
                {/* </div> */}
                <div
                  className={` rounded-xl cursor-pointer py-1 px-2 w-auto min-w-[100px] truncate ${
                    activeScreen === 'Cancelled Trips' ? 'font-medium rounded-xl bg-indigo-600 text-xs text-white-100 w-auto min-w-[100px] truncate' : 'bg-white-100 text-neutral-800'
                  }`}
                  onClick={() => handleScreenChange('Cancelled Trips')}
                >
                Cancelled Trips
                </div>
                

              {/* </div> */}
            {/* </div> */}
          </div>

          <div className="w-full  bg-white-100  h-auto lg:h-[581px] rounded-lg border-[1px] border-slate-300 shrink-0 font-cabin mt-3 sm:mt-6 shadow-[0px_12px_3px_rgba(0,_0,_0,_0),_0px_8px_3px_rgba(0,_0,_0,_0.01),_0px_4px_3px_rgba(0,_0,_0,_0.03),_0px_2px_2px_rgba(0,_0,_0,_0.05),_0px_0px_1px_rgba(0,_0,_0,_0.06)]">
           {activeScreen=== 'Pending Bookings' && 
           <>
  {/* <div className='flex flex-row justify-between items-end px-8'> */}
  <div className=" px-8 w-full h-6 flex flex-row gap-3 mt-7 items-center">
    <img className="w-6 h-6" src={receipt} alt="receipt" />
    <div className="text-base tracking-[0.02em] font-bold">Pending Bookings</div>
  </div>




                     
<div className="box-border mx-4  mt-[46px]  w-auto    border-[1px]  border-b-gray "/>
           {/* //data div */}
         <div className='h-[380px]  items-center  justify-center overflow-y-auto overflow-x-hidden  mt-6 w-auto max-w-[930px] px-4'>
           
            {filteredData && filteredData?.map((travelDetails ,index)=>(
              <div key={index} className=' pb-2'>
              <PendingTrBooking {...travelDetails}   employeeRole={employeeRoles?.employeeInfo?.employeeDetails} handleTravel={handleTravel}/>
              </div>
             ))}
           </div>
           </>}
           {activeScreen=== 'Cancelled Trips' && 
           <>
   <div className="w-auto h-6 flex flex-row gap-3 ml-8 mt-7 items-center">
      <img className="w-6 h-6" src={receipt} alt="receipt" />
      <div className="text-base tracking-[0.02em] font-bold w-auto">Cancelled Trips</div>
    </div>
    <div className="box-border mx-4  mt-[46px] w-auto    border-[1px]  border-b-gray "/>
    <div className=' h-auto w-full flex flex-col items-center max-h-[420px] overflow-auto  '>
           {/* {tripArray.map((travelDetails, index)=> */}
           <CancelledTrRequest  handleTrip={handleTrip}/>
           </div>
           </>
           }
          </div>
        </div>
      {/* </div> */}
    </>
  );
};

export default BookingAdmin;