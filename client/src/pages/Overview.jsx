import React ,{ useState,useEffect}from 'react';
import { useData } from '../api/DataProvider';
import { intransit_trip, arrow_left, down_arrow, chevron_down, cancel_round, cancel, upcoming_trip} from '../assets/icon';
import NotifyModal from '../components/NotifyModal';
import UpcomingTrip from '../components/trips/UpcomingTrip';
import  IntransitTrip from '../components/trips/IntransitTrip';
// import InTransitTrip from '../components/trips/InTransitTrip';

import { handleTrip ,handleTravelExpense, handleCashAdvance,} from '../utils/actionHandler';
import { useParams } from 'react-router-dom';
import Error from '../components/common/Error';



const Overview = ({fetchData ,isLoading,setIsLoading,loadingErrMsg, setLoadingErrMsg}) => {

  const { setEmployeeData , employeeData } = useData(); 
  const [tripsData,setTripsData]=useState(null);
  const {tenantId,empId,page}= useParams();

  useEffect(()=>{
    fetchData(tenantId,empId,page)
  },[])


useEffect(()=>{
  console.log('data11',employeeData?.dashboardViews?.employee?.trips)
  setTripsData(employeeData && employeeData?.dashboardViews?.employee?.trips)
},[employeeData])


  console.log('tripsData',tripsData?.transitTrips)
  
    const [dropdownStates, setDropdownStates] = useState({});      
    const initialTripTab=['Trip','Trip','Trip']
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
     <div className='w-auto min-h-screen pt-12 px-0 lg:px-20 bg-white-100 flex flex-col gap-4'> 
     <div className=' overflow-x-auto'> 
   <IntransitTrip 
      handleCashAdvance={handleCashAdvance} 
      handleTrip={handleTrip} 
      dropdownStates={dropdownStates} 
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
       upComingTrip={tripsData &&tripsData?.upcomingTrips} 
       handleDropdownToggle={handleDropdownToggle} 
       handleOpenOverlay={handleOpenOverlay} 
       />
   </div>
     
   {showConfirmationOverlay && (
     <NotifyModal/>
   )}
   </div>}
 
</>
  )}

export default Overview;



