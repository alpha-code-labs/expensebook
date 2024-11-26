import React, { useEffect, useState } from 'react';
import { briefcase, modify, receipt, filter_icon, trip_white_icon,plus_violet_icon, cancel, search_icon, info_icon, airplane_1, airplane_icon1, trip_icon } from '../assets/icon';
import {  getStatusClass, sortTripsByDate } from '../utils/handyFunctions';
import { handleNonTravelExpense, handleTravelExpense } from '../utils/actionHandler';
import Modal from '../components/common/Modal1';
import { useParams } from 'react-router-dom';
import { useData } from '../api/DataProvider';
import TripSearch from '../components/common/TripSearch';
import Button1 from '../components/common/Button1';
import Error from '../components/common/Error';
import Input from '../components/common/SearchInput';
import TripMS from '../microservice/TripMS';
import { CardLayout, EmptyBox,RaiseButton, BoxTitleLayout,StatusBox, StatusFilter, TripName, ModifyBtn } from '../components/common/TinyComponent';


const Travel = ({searchQuery,isLoading ,fetchData,loadingErrMsg}) => {
const travelBaseUrl  = import.meta.env.VITE_TRAVEL_PAGE_URL;
const cashBaseUrl = import.meta.env.VITE_CASHADVANCE_PAGE_URL;
const tripBaseUrl = import.meta.env.VITE_TRIP_BASE_URL;

  const [tripId , setTripId]=useState(null);
  const [expenseType , setExpenseType]=useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [textVisible,setTextVisible]=useState({tripId:false}); 
  const [modalOpen , setModalOpen]=useState(false);
  const [tripData, setTripData]=useState([]);
  const {tenantId,empId,page}= useParams();
  const { employeeData , setPopupMsgData} = useData();
  const [error , setError]= useState({
    tripId: {set:false, message:""}
  }); 

  


  

  
  useEffect(()=>{

    fetchData(tenantId,empId,page)

  },[])
  


  // useEffect(() => {
  //   if (employeeData) {
  //     const data = employeeData?.dashboardViews?.employee || [];
     
  //     const intransitTrips = data?.trips?.transitTrips || [];
  
  //     const dataForRaiseCashadvance = [ ...intransitTrips];
  //     const pushedData = dataForRaiseCashadvance?.map(item => ({ ...item, tripName: "us - del - mum - gkr" }));
      
  //     setTripData(pushedData);
      
  //     console.log('Trip data for expense:', dataForRaiseCashadvance);
  //   } else {
  //     console.error('Employee data is missing.');
  //   }
  // }, [employeeData]);

  useEffect(()=>{
    if (employeeData) {
    const data = employeeData?.dashboardViews?.employee?.overview || [];
    const intransitTrips = data?.transitTrips || [];
    const upcomingTrips = data?.upcomingTrips || [];
    const completedTrips = employeeData?.dashboardViews?.employee?.expense?.completedTrips || [];
    const travelRequests = data?.allTravelRequests?.allTravelRequests || [];
    
    const travelRequestsAndTrips = [...intransitTrips, ...travelRequests,...completedTrips,...upcomingTrips];


   
    const tripDataCopy = travelRequestsAndTrips?.map((trip)=>({...trip, travelRequestStatus:getTripStatus(trip?.travelRequestStatus,trip?.tripStartDate)}))
   
    setTripData(tripDataCopy)
  }
    else{
      console.error('Employee data is missing.');
    }
  },[employeeData])
  
 
  const [visible, setVisible]=useState(false);
  const [iframeURL, setIframeURL] = useState(null); 

const handleVisible = (data) => {
  const { urlName, tripId, travelRequestId } = data;
  setVisible(!visible);

  let url = '';

  if (urlName === 'travel-url') {
    url = `${travelBaseUrl}/create/${tenantId}/${empId}`;
  } else if (urlName === 'rejected') {
    url = `${travelBaseUrl}/rejected/${travelRequestId}`;
  } else if (["intransit","upcoming"].includes(urlName)) {
    url = `${tripBaseUrl}/${tenantId}/${empId}/modify/${tripId}/section1`;
  } else {
    url = `${travelBaseUrl}/modify/${travelRequestId}/`;
  }

  console.log('iframe url', url, urlName);
  setIframeURL(url);
};








  


  useEffect(() => {
    const handleMessage = event => {
      console.log(event)
      // Check if the message is coming from the iframe
      if (event.origin === travelBaseUrl || event.origin === cashBaseUrl) {
        // Check the message content or identifier
        if (event.data === 'closeIframe') {
          setVisible(false)
        }
         // Check the message content or identifier
         if (event.data === 'closeIframe') {
          setVisible(false)
          // window.location.href = window.location.href;
          fetchData()
        }else if(event.data.split(' ')[0] == 'raiseAdvance'){
          //we have to open an Iframe to raise cash advance
          setVisible(false)
          
          const tenantId = event.data.split(' ')[1];
          const travelRequestId = event.data.split(' ')[2];
          console.log(event.data, ' event data ', travelRequestId, ' trId ', tenantId, ' tenant Id');
          setIframeURL(`${cashBaseUrl}/create/advance/${travelRequestId}`);
          setVisible(true);
        }
        else if(event.data.popupMsgData)
          {
            const expensePopupData = event.data.popupMsgData;
            setPopupMsgData(expensePopupData)
          }
      }
    };
    // Listen for messages from the iframe
    window.addEventListener('message', handleMessage);
  
    return () => {
      // Clean up event listener
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  

sortTripsByDate(tripData)
   
console.log('trips and travel from travel screen', tripData)

  const handleStatusClick = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const filterExpenses = (expenses) => {
   

    return expenses?.filter((expense) =>
      selectedStatuses.length === 0 ||
      selectedStatuses.includes(expense?.travelRequestStatus)
    ).filter(expense =>
      JSON.stringify(expense).toLowerCase().includes(searchQuery)
    );
  };

  const getStatusCount = (status, trips) => {
    return trips.filter((trip) => trip?.travelRequestStatus === status).length;
  };

  const disableButton = (status) => {
    return [ 'cancelled'].includes(status);
  };

  const handleSelect=(option)=>{
    console.log(option)
    setTripId(option?.tripId)
  }

  const handleRaise = () => {
    if (expenseType=== "travel_Cash-Advance") {
      if (!tripId) {
        setError(prev => ({ ...prev, tripId: { set: true, message: "Select the trip" } }));
        
        return;
      } 
      setError(prev => ({ ...prev, travelRequestId: { set: false, message: "" } }));
      setTripId(null)
      setExpenseType(null)
      setModalOpen(false)
      handleTravelExpense({tripId, "action":'trip-ex-create'})
    } else {
      setExpenseType(null)
      setModalOpen(false)
      handleNonTravelExpense('','non-tr-ex-create')
    }
  };

  return (
    <>
    {isLoading ? <Error message={loadingErrMsg}/>:
    
    <>
     <TripMS visible={visible} setVisible={setVisible} src={iframeURL}/>
   <div className='h-screen  flex flex-col p-4'>
     
   
      <div className=' shrink-0 border border-slate-300 bg-white rounded-md  w-full flex flex-col items-start gap-2 px-2 py-2'>

<StatusFilter
 const statuses = {[
  "draft",
  "pending approval",
  "pending booking",
  "upcoming",
  "intransit",
  "rejected",
  "cancelled",
  "paid and cancelled"
]}
tripData={tripData}
selectedStatuses={selectedStatuses}
handleStatusClick={handleStatusClick}
filter_icon={filter_icon}
getStatusClass={getStatusClass}
getStatusCount={getStatusCount}
setSelectedStatuses={setSelectedStatuses}

/>


 
</div>

        <div className='w-full flex flex-col flex-grow  overflow-auto scrollbar-hide  mt-2'>
        
            {/* <div className='relative shrink-0 flex justify-center items-center rounded-md font-inter text-md text-white h-[52px] bg-indigo-600 text-center'>
          <div
          onClick={()=>handleVisible({urlName:"travel-url"})}
          onMouseEnter={() => setTextVisible({cashAdvance:true})}
          onMouseLeave={() => setTextVisible({cashAdvance:false})}
          className={`absolute  left-0 ml-4 hover:px-2 w-6 h-6 hover:overflow-hidden hover:w-auto group text-indigo-600 bg-indigo-100 border border-white flex items-center justify-center  hover:gap-x-1 rounded-full cursor-pointer transition-all duration-300`}
          >
          <img src={plus_violet_icon} width={16} height={16} alt="Add Icon" />
          <p
          className={`${
          textVisible?.expense ? 'opacity-100' : 'opacity-0 w-0'
          } whitespace-nowrap text-xs transition-all duration-300 group-hover:opacity-100 group-hover:w-auto`}
          >
          Raise a Travel Request
          </p>
          </div>
              
              <div className='flex justify-center items-center'>
                <img src={airplane_icon1} className='w-4 h-4 mr-2' />
                <p>Trips</p>
              </div>
            </div> */}
            <BoxTitleLayout title="Trips" icon={trip_white_icon}>
              <RaiseButton
               onClick={()=>handleVisible({urlName:"travel-url"})}
               onMouseEnter={() => setTextVisible({cashAdvance:true})}
               onMouseLeave={() => setTextVisible({cashAdvance:false})}
               text={"Travel Request"}
               textVisible={textVisible?.expense}
              
              />
            </BoxTitleLayout>


            <div className='w-full h-full mt-4  overflow-y-auto px-2 bg-white rounded-l-md'>
              {tripData?.length>0 ? filterExpenses(tripData)?.map((trip, index) => {
                
                const filteredTripExpenses = filterExpenses(tripData);
                if (filteredTripExpenses.length === 0) return null; // Skip rendering if no expenses match the selected statuses

                return (
<>
                  <CardLayout index={index}>
                 <div onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible({tripId:trip?.tripId ,travelRequestId:trip?.travelRequestId,urlName: trip?.travelRequestStatus})}}} className='flex flex-row justify-between w-full items-center py-2'>
               <div className='font-cabin text-xs text-neutral-700'>
          {trip?.travelRequestStatus === "draft" ?
           <div className='text-xs text-start'>
           <div className='text-neutral-400'>Travel Request No.</div>
            <p>{trip?.travelRequestNumber}</p>
         </div>
          : 
          <TripName tripName={trip?.tripName}/>
        }
      </div>
      <div className='flex justify-center items-center gap-2'>
       
      <StatusBox status={trip?.travelRequestStatus ?? "-"}/>
       <ModifyBtn onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible({tripId:trip?.tripId ,travelRequestId:trip?.travelRequestId,urlName: trip?.travelRequestStatus})}}}/> 
       
        {/* <div onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible({tripId:trip?.tripId ,travelRequestId:trip?.travelRequestId,urlName: trip?.travelRequestStatus})}}}  className='bg-neutral-200 cursor-pointer w-7 h-7 bg--100 rounded-full border border-white flex items-center justify-center'>
        <img src={modify} className='w-4 h-4' alt="Add Icon" />
        </div> */}
      </div>
      </div>
                  </CardLayout>
                  </>
                );
              }):<EmptyBox icon={trip_white_icon} text="No Travel Request or Trip"/>}
            </div>
         

        
        </div>
     
      <Modal 
        isOpen={modalOpen} 
        onClose={modalOpen} 
        content={<div className='w-full h-auto'> 
          <div>
              <div className='flex gap-2 justify-between items-center bg-indigo-100 w-full p-4'>
                <p className='font-inter text-base font-semibold text-indigo-600'>Raise an Expense</p>              
                <div onClick={()=>{setModalOpen(!modalOpen);setTripId(null);setExpenseType(null)}} className='bg-red-100 cursor-pointer rounded-full border border-white'>
                <img src={cancel} className='w-5 h-5'/>
                </div>
              </div>
<div className='p-4'>
<div className='flex md:flex-row flex-col justify-between gap-2'>
 <div onClick={()=>setExpenseType("travel_Cash-Advance")} className={`min-w-fit cursor-pointer transition  duration-200 hover:bg-indigo-100 hover:rounded-md flex-1 flex gap-2 items-center justify-center ${expenseType === "travel_Cash-Advance" ? ' border-b-2 border-indigo-600 text-indigo-600' : 'border-b-2 border-white '}  p-4`}>
    <img src={receipt} className='w-5 h-5'/>
    <p className='truncate '>Travel Expense</p> 
 </div> 
           
  <div onClick={()=>setExpenseType("non-Travel_Cash-Advance")} className={`min-w-fit cursor-pointer transition  duration-200 hover:bg-indigo-100 hover:rounded-md flex-1  flex items-center justify-center gap-2 p-4 ${expenseType === "non-Travel_Cash-Advance" ? 'border-b-2 border-indigo-600 text-indigo-600': "border-b-2 border-white"}  `}>
    <img src={receipt} className='w-5 h-5'/>
    <p className='truncate  shrink'>Non-Travel Expense</p>
  </div>
  </div>  

<div className='flex gap-4 flex-col items-start justify-start w-full py-2'>
{ expenseType=== "travel_Cash-Advance" &&
 <div className='w-full'>
  <TripSearch placeholder={"Select the trip"} error={error?.tripId} title="Apply to trip" data={tripData} onSelect={handleSelect} />
 </div> }
{expenseType && <Button1 text={"Raise"} onClick={handleRaise} />}
</div>   
</div>
          </div>

      </div>}
      />
    </div>
    </>}
    </>
  );
};

export default Travel;


const getTripStatus = (status,tripStartDate) => {
  
  
  if(status !== "booked"){
    return status
  }

  const currentStatus = status;
  const tripStart = new Date(tripStartDate);
  const currentDate = new Date();

  // Check if the current status is 'booked'
  if (currentStatus === 'booked') {
    if (tripStart > currentDate) {
      return 'upcoming';
    } else if (tripStart <= currentDate) {
      return 'intransit';
    }
  }

  return currentStatus;
};