import React ,{ useState,useEffect}from 'react';
import { useData } from '../api/DataProvider';
import { getEmployeeData_API } from '../utils/api';
import Modal from '../components/Modal';
import { intransit_trip, arrow_left, down_arrow, chevron_down, cancel_round, cancel} from '../assets/icon';
import NotifyModal from '../components/NotifyModal';
import UpcomingTrip from '../components/trips/UpcomingTrip';
import  IntransitTrip from '../components/trips/UpcomingTrip copy';
// import InTransitTrip from '../components/trips/InTransitTrip';
import { transitTrip1, upcomingTrip1,  } from '../dummyData/overviewDummy';
import { handleTrip ,handleTravelExpense, handleCashAdvance,} from '../utils/actionHandler';
import { useParams } from 'react-router-dom';
import Error from '../components/common/Error';



const Overview = ({fetchData ,isLoading,setIsLoading,loadingErrMsg, setLoadingErrMsg}) => {


  const { setEmployeeData , employeeData } = useData(); 
  const [upcomingTrip , setUpcomingTrip]=useState(null)
  const [tripsData,setTripsData]=useState(null);
  const {tenantId,empId,page}= useParams();

  useEffect(()=>{

    fetchData(tenantId,empId,page)
    
  },[])



useEffect(()=>{
  setTripsData(employeeData && employeeData?.dashboardViews?.employee?.trip)
  const data =employeeData?.dashboardViews?.employee?.trip
  if(data?.upcomingTrips?.length>0){
  setUpcomingTrip(data?.upcomingTrips)
}else{
  console.log('upcoming data is not available')
}
},[employeeData])






  const [transitTrip, setTransitTrip]=useState([])

  useEffect(()=>{
    const transitData= employeeData?.transitTrips
   setTransitTrip(transitData)
  },[tripsData])

    const [dropdownStates, setDropdownStates] = useState({});    
  
    
    const initialTripTab=upcomingTrip1?.map(item=> 'Trip') || []
    // const initialTripTab=tripsData?.transitTrips.map(item=> 'Trip')
    console.log('initial transit trip',initialTripTab)


    const [showConfirmationOverlay, setShowConfirmationOverlay] = useState(false);

    const handleOpenOverlay = () => {
       setShowConfirmationOverlay(true);
  
  
      setTimeout(()=>{
        setShowConfirmationOverlay(false);
        window.location.reload();
      },5000);
      
    };

  //handle for Cancel and Add a Leg Options
    const handleDropdownToggle = (index) => {
    setDropdownStates((prevStates) => ({
      ...prevStates,
      [index]: !prevStates[index],
    }));
  };
  return (
    <>
     {isLoading && <Error message={loadingErrMsg}/>}
 
    {!isLoading &&
     <div className='w-auto min-h-screen pt-12 px-0 lg:px-20 bg-white-100   flex flex-col gap-4'> 
     <div className=''> 
   <IntransitTrip 
      handleCashAdvance={handleCashAdvance} 
      handleTrip={handleTrip} 
      dropdownStates={dropdownStates} 
      // upComingTrip={upcomingTrip1} 
       initialTransitTabs={initialTripTab}
       transitTripData={tripsData &&tripsData?.transitTrips} 
      handleDropdownToggle={handleDropdownToggle} 
      handleOpenOverlay={handleOpenOverlay}/> 
     </div>
    
     {/* Third Div taking full width in the next row */}
   <div className=''>
       <UpcomingTrip 
       handleCashAdvance={handleCashAdvance} 
       handleTrip={handleTrip} dropdownStates={dropdownStates} 
       upComingTrip={upcomingTrip} 
       handleDropdownToggle={handleDropdownToggle} 
       handleOpenOverlay={handleOpenOverlay} 
       />
   </div>
     
   {showConfirmationOverlay && (
     <NotifyModal/>
   )}
   </div> }
 
</>
  )}

export default Overview;





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
