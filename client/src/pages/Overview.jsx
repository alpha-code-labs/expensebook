/* eslint-disable react/jsx-key */
import React, { useState,useEffect } from 'react';
import { airplane_1, briefcase, modify, plus_icon, plus_violet_icon, receipt, down_arrow, chevron_down, down_left_arrow, calender_2_icon, airplane, material_flight_black_icon, material_cab_black_icon, material_hotel_black_icon, city_icon, empty_itinerary_icon, empty_travelExpense_icon, empty_nonTravelExpense_icon, expense_white_icon, expense_black_icon, plus_black_icon } from '../assets/icon';
import {  extractTripNameStartDate, formatAmount,  getStatusClass, handleDownloadFile, sortTripsByDate, splitTripName, tripsAsPerExpenseFlag } from '../utils/handyFunctions';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../api/DataProvider';
import Error from '../components/common/Error';
import { CabCard, FlightCard, HotelCard, RentalCabCard } from '../components/itinerary/ItineraryCard';
import Modal from '../components/common/Modal1';
import TripSearch from '../components/common/TripSearch';
import Button1 from '../components/common/Button1';
import TripMS from '../microservice/TripMS';
import { TabTitleModal, TitleModal, TooltipBtn, TripName } from '../components/common/TinyComponent';
import ExpenseMS from '../microservice/Expense';

const travelBaseUrl  = import.meta.env.VITE_TRAVEL_PAGE_URL;
const cashBaseUrl    = import.meta.env.VITE_CASHADVANCE_PAGE_URL;
const tripBaseUrl    = import.meta.env.VITE_TRIP_BASE_URL;
const expenseBaseUrl = import.meta.env.VITE_EXPENSE_PAGE_URL;

function CardLayout({icon,title,subTitle,cardTitle,children})
{

  return(
  <div className={`min-w-[400px] px-2  h-[340px]  bg-slate-100/50 shadow shadow-slate-300 rounded-2xl   d`} >
         <div className=" px-2  border-neutral-700 flex flex-row items-center justify-start gap-1.5 overflow-hidden py-2">
           <img
             className="w-5 h-5 shrink-0"
             alt="briefcase_icon"
             src={icon}
           />
           <div className=''>
            <p className='text-sm font-inter text-neutral-900'>{title}</p>
            <p className='text-xs'>{subTitle}</p>
           </div>
           {/* <p className="tracking-[0.02em] font-cabin text-[16px] text-neutral-900 font-semibold">{cardTitle}</p> */}
         </div>
         <div className=' shadow-sm shadow-indigo-600 rounded-md'/>
         <div className="h-[285px]  scrollbar-hide bg-white overflow-hidden overflow-y-auto space-y-2  border-[4px] border-gray-600   rounded-3xl px-2">
         
          {children}
      
         </div>
         
       </div>)
}


const Overview = ({fetchData, isLoading, setIsLoading, loadingErrMsg}) => {

  const { employeeData, requiredData ,setPopupMsgData, initialPopupData,setMicroserviceModal} = useData(); 
  const [overviewData,setOverviewData]=useState(null); 
  const {tenantId,empId,page}= useParams(); 
  const [modalOpen , setModalOpen]=useState(false); 
  const [tripId , setTripId]=useState(null); 
  const [expenseType , setExpenseType]=useState(null); 
  const [error , setError]= useState({
    tripId: {set:false, message:""} 
  }); 

  useEffect(()=>{
    fetchData()
  },[])

useEffect(()=>{
  
  setOverviewData(employeeData?.dashboardViews?.employee?.overview)

},[employeeData])

const intransitTrips     = overviewData?.transitTrips || [];
const upcomingTrips      = overviewData?.upcomingTrips || [];
const completedTrips     = employeeData?.dashboardViews?.employee?.expense?.completedTrips || [];
const travelExpenses     = overviewData?.expense?.allTripExpenseReports || [];
const nonTravelExpenses  = overviewData?.expense?.allNonTravelReports || [];
const travelRequests     = overviewData?.allTravelRequests?.allTravelRequests?.map(travel => ({
  ...travel,
  tripStartDate: extractTripNameStartDate(travel?.tripName)
})) || [];

sortTripsByDate(travelRequests)
sortTripsByDate(intransitTrips)
sortTripsByDate(upcomingTrips)

const ongoingTripForExpense = tripsAsPerExpenseFlag(intransitTrips,requiredData);
console.log('raise expense trip', ongoingTripForExpense)

  const [visible, setVisible]=useState(false);
  const [expenseVisible, setExpenseVisible]=useState(false);
  const [iframeURL, setIframeURL] = useState(null); 

  const handleVisible = (data) => {
    let { urlName, tripId } = data;

    if(urlName==="addExpense-url" || urlName === "addNonTravelExpense-url"){
      setExpenseVisible(!expenseVisible)
    }else{
      setVisible(!visible);
    }
   
    let url = "";
  
    switch (urlName) {
      case "travel-url":
        url = `${travelBaseUrl}/create/${tenantId}/${empId}`;
        break;
      case "trip-url":
        url = `${tripBaseUrl}/${tenantId}/${empId}/modify/${tripId}/section1`;
        break;
      case "addExpense-url":
        url = `${expenseBaseUrl}/${tenantId}/${empId}/${tripId}/new/line-item`;
        break;
      case "addNonTravelExpense-url":
      url =`${expenseBaseUrl}/${tenantId}/${empId}/non-travel-expense/new`
      break;
      default:
        console.log('Unknown urlName:', urlName);
    }
  
    console.log('iframe url', url, urlName);
    setIframeURL(url);
  };
  


  useEffect(() => {
    const handleMessage = event => {
      console.log('event',event)
      // Check if the message is coming from the iframe
      if (event.origin === travelBaseUrl || event.origin === cashBaseUrl || event.origin === tripBaseUrl || event.origin === expenseBaseUrl) {
         if(event.data.popupMsgData)
          {
            const expensePopupData = event.data.popupMsgData;
            setPopupMsgData(expensePopupData)
            setTimeout(() => {
              setPopupMsgData(initialPopupData); 
            }, 5000);
          }
        // Check the message content or identifier
        if (event.data === 'closeIframe') {
          setVisible(false)
          setExpenseVisible(false)
         
        }
         // Check the message content or identifier
         if (event.data === 'closeIframe') {
          setVisible(false)
          setExpenseVisible(false)
          // window.location.href = window.location.href;
          fetchData();
         
          
        }
        if(event.data.ocrMsgData)
          {
            const ocrPopupData = event.data.ocrMsgData;
            setMicroserviceModal(ocrPopupData);
            // if(ocrPopupData?.autoSkip === undefined)
            // {
            //   setTimeout(() => {
            //     setMicroserviceModal(initialPopupData); 
            //   }, 5000);
            // }
  
            
          } 
        else if(event.data.split(' ')[0] == 'raiseAdvance'){
          //we have to open an Iframe to raise cash advance
          setVisible(false)
          
          const tenantId = event.data.split(' ')[1];
          const travelRequestId = event.data.split(' ')[2];
          console.log(event.data, ' event data ', travelRequestId, ' trId ', tenantId, ' tenant Id');
          setIframeURL(`${cashBaseUrl}/create/advance/${travelRequestId}`);
          setVisible(true);
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


const handleSelect=(option)=>{
  console.log(option)
  setTripId(option?.tripId)
}

const handleRaise = () => {
  if (expenseType=== "travel_Expense") {
    if (!tripId) {
      setError(prev => ({ ...prev, tripId: { set: true, message: "Select the trip" } }));
      
      return;
    } 
    setError(prev => ({ ...prev, travelRequestId: { set: false, message: "" } }));
    setTripId(null)
    setExpenseType(null)
    setModalOpen(false)
    handleVisible({urlName:"addExpense-url",tripId})
    // handleTravelExpense(tripId, '','trip-ex-create')
  } else {
    setExpenseType(null)
    setModalOpen(false)
    handleVisible({urlName:"addNonTravelExpense-url"})
  }
};
  
const [expenseTabs , setExpenseTabs]=useState("travelExpense");
  
  const handleExpenseTabChange = (tab)=>{
    setExpenseTabs(tab)
  }



 


  return (
    <>
    {isLoading ? <Error message={loadingErrMsg}/>
   :
    <>
    {expenseVisible ?  ( 
      <ExpenseMS visible={expenseVisible} setVisible={setExpenseVisible} src={iframeURL} /> ) :
    <div className="p-4 ">
      <TripMS visible={visible} setVisible={setVisible} src={iframeURL} /> 
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full overflow-x-auto pb-2 ">
      
   <CardLayout  icon={briefcase} title={"On-going Trips"} subTitle={'Activities for on-going trips'}>
   {intransitTrips.length === 0 ? (
     <EmptyTrips icon={empty_itinerary_icon} text="No in-transit trips." />
   ) : (
     intransitTrips.map((trip, index) => (
       <IntransitTrips 
       handleVisible={handleVisible}
         key={index} 
         index={index} 
         trip={trip} 
         lastIndex={intransitTrips.length - 1} 
       />
     ))
   )}
   </CardLayout>
   
   <CardLayout  icon={expense_black_icon} title={"Expenses"} subTitle={'Track travel and non-travel expenses'}>    
   <div className="flex gap-x-2 h-[45px] px-2 flex-row items-center justify-between text-center font-cabin border-b-2  border-slate-300  text-neutral-700 text-xs">
   <div className='flex font-inter'>
   <div
   className={`px-2 py-1  rounded-lg cursor-pointer ease-in-out ${expenseTabs === 'travelExpense' ? 'bg-gray-200/10   text-neutral-900 font-semibold  text-xs ' : 'text-xs'}`}
   onClick={() => handleExpenseTabChange("travelExpense")}
   >
   <p>Travel Expense</p>
   </div>
   <div
   className={`px-2 py-1 rounded-lg cursor-pointer ease-in-out ${expenseTabs === 'nonTravelExpense' ? 'bg-gray-200/10   text-neutral-900 font-semibold  text-xs ' : 'text-xs'}`}
   onClick={() => handleExpenseTabChange("nonTravelExpense")}
   >
   <p>Non-Travel Expense</p>
   </div>
   </div>     
   
   
   <TooltipBtn   onClick={()=>setModalOpen(!modalOpen)} onHover={'Add an Expense'} icon={plus_black_icon} />
   </div>
   
   <div className='h-[224px] overflow-y-auto px-2 mt-2'>
   {expenseTabs === "travelExpense" && (
     travelExpenses?.length ===0 ? <EmptyTrips icon={empty_travelExpense_icon} text="No travel expenses." /> :
     
      travelExpenses?.map((expense,index) => <TravelExpenses key={index} index={`${index}-TravelExpense`} expense={expense} lastIndex={travelExpenses?.length-1} />)
   )
   }
   
   {expenseTabs === "nonTravelExpense" && (
      nonTravelExpenses?.length ===0 ? <EmptyTrips icon={empty_nonTravelExpense_icon} text="No non-travel expenses." /> :
   nonTravelExpenses?.map((expense,index) => <NonTravelExpenses index={index} expense={expense} lastIndex={nonTravelExpenses?.length-1}/>)
   )
   }

   </div>
   </CardLayout>  
          
   <CardLayout  icon={briefcase} title={"Upcoming Trips"} subTitle={'All upcoming trips'}>
    
    {  upcomingTrips?.length === 0 ? (
     <EmptyTrips icon={empty_itinerary_icon} text="No upcoming trips" />
   ) : (
     <div className='mt-2'>
    {  upcomingTrips?.map((trip, index) => (
       <UpcomingTrips 
         handleVisible={handleVisible}
         key={index} 
         index={index} 
         trip={trip} 
         lastIndex={upcomingTrips?.length - 1} 
       />
      
     ))}
     </div>
   )}
    
   </CardLayout>
   
   
   
   <CardLayout  icon={briefcase} title={"Travel Requests"} subTitle={'Track the status of your travel requests'} >
   
     
     {/* <div className="h-[288px] mt-2 border-4 border-indigo-600 rounded-md px-2"> */}
     <div className="flex gap-x-2 h-[40px]   px-2 flex-row items-center justify-end text-center font-cabin border-b-2  border-slate-300  text-neutral-700 text-xs">
   
   <TooltipBtn onClick={()=>handleVisible({urlName:"travel-url"})} onHover={'Raise Travel Request'} icon={plus_black_icon} />
     
   </div>
   
   <div className="h-[224px] overflow-y-auto px-2 mt-2">
     {
       travelRequests.length === 0 ? <EmptyTrips icon={empty_itinerary_icon} text="No travel requests." /> :
     travelRequests?.map((travel, index)=>(
       <TravelRequests key={index} travel={travel} index={index} lastIndex={travelRequests?.length-1}/>
     ))}
   </div>
     {/* </div> */}
   </CardLayout>
   
    </div>
      <Modal
        isOpen={modalOpen} 
        onClose={modalOpen} 
        content={<div className='w-full h-auto'> 
          <div> 
              {/* <div className='flex gap-2 justify-between items-center bg-indigo-100 w-full p-4'>
                <p className='font-inter text-base font-semibold text-indigo-600'>Raise an Expense</p>
                <div onClick={()=>{setModalOpen(!modalOpen);setTripId(null);setExpenseType(null)}} className='bg-red-100 cursor-pointer rounded-full border border-white'>
                <img src={cancel} className='w-5 h-5'/>
                </div>
              </div> */}
              <TitleModal text={"Raise an Expense"} onClick={()=>{setModalOpen(!modalOpen);setTripId(null);setExpenseType(null)}} />
<div className='p-4'>
 <div className='flex md:flex-row flex-col justify-between gap-2'>
 
  <TabTitleModal text={"Travel Expense"} icon={expense_white_icon} onClick={()=>setExpenseType("travel_Expense")} selectedTab={expenseType === "travel_Expense"}/>
  <TabTitleModal text={"Non-Travel Expense"} icon={expense_white_icon} onClick={()=>setExpenseType("non-Travel_Cash-Advance")} selectedTab={expenseType === "non-Travel_Cash-Advance"}/>
           
 
  </div>  
  
<div className='flex gap-4 flex-col items-start justify-start w-full py-2'>

{ expenseType=== "travel_Expense" &&
 <div className='w-full'>
  <TripSearch requestType={"travel_Expense"} validation={requiredData?.formValidations ?? {}} placeholder={"Select the trip"} error={error?.tripId} title="Apply to trip" data={[...tripsAsPerExpenseFlag(intransitTrips,requiredData), ...completedTrips]} onSelect={handleSelect} />
 </div> }
  
{expenseType && <Button1 text={"Raise"} onClick={handleRaise} />}

</div>   
</div>    
          </div>

      </div>}
      />
    </div>}
    
    </>}
    </>
  );
};

export default Overview;




const IntransitTrips = ({ index, trip, lastIndex,handleVisible }) => {
  
  
  const [activeTabs, setActiveTabs] = useState("upcoming");
 



  console.log(activeTabs);


 
  function separateItineraryByDate(currentDate, itinerary,addALegItinerary) {

    let completedItinerary = [];
    let upcomingItinerary = [
    ];
    const addALegItineraryArray = [
      ...addALegItinerary.flights,
      ...addALegItinerary.buses,
      ...addALegItinerary.trains,
      ...addALegItinerary.hotels,
      ...addALegItinerary.cabs,
      ...addALegItinerary.carRentals,
      ...addALegItinerary.personalVehicles
    ]
  
    function checkAndPush(item, dateField, category, timeField) {
      const itemDate = new Date(item[dateField]);
      const currentTime = currentDate.getTime();
      const itemTime = item[timeField] ? item[timeField].split(":") : ["00", "00"];
  
      // Set itemDate time using the itemTime values
      itemDate.setHours(parseInt(itemTime[0], 10));
      itemDate.setMinutes(parseInt(itemTime[1], 10));
  
      const itemWithCategory = { ...item, category };
  
      if (category === "hotels") {
        if (itemDate < currentDate) {
          completedItinerary.push(itemWithCategory);
        } else {
          upcomingItinerary.push(itemWithCategory);
        }
      } else {
        if (itemDate >= currentDate) {
          upcomingItinerary.push(itemWithCategory);
        } else {
          completedItinerary.push(itemWithCategory);
        }
      }
    }
    
    itinerary.flights.forEach(flight => checkAndPush(flight, 'bkd_date', 'flights', 'bkd_time'));
    itinerary.hotels.forEach(hotel => checkAndPush(hotel, 'bkd_checkOut', 'hotels'));
    itinerary.buses.forEach(bus => checkAndPush(bus, 'bkd_date', 'buses', 'bkd_time'));
    itinerary.trains.forEach(train => checkAndPush(train, 'bkd_date', 'trains', 'bkd_time'));
    itinerary.cabs.forEach(cab => checkAndPush(cab, 'bkd_date', 'cabs', 'bkd_time'));
  
    completedItinerary = completedItinerary.sort((a, b) => a.sequence - b.sequence);
    upcomingItinerary = upcomingItinerary.sort((a, b) => a.sequence - b.sequence);
   
   upcomingItinerary = [...upcomingItinerary,...addALegItineraryArray]
    return { completedItinerary, upcomingItinerary };
  }
  
  




  const currentDate = new Date();
  const { completedItinerary, upcomingItinerary } = separateItineraryByDate(currentDate, trip?.itinerary,trip?.addALegItinerary ??[]);
  
  const [itineraryByTab , setItineraryByTab] = useState(upcomingItinerary)
  const handleTabChange = (tab) => {
    setActiveTabs(tab);
    if ( tab === "completed"){
      setItineraryByTab(completedItinerary)
    }else if (tab === "upcoming"){
      setItineraryByTab(upcomingItinerary)
    }
  };
 





  console.log('Completed Itinerary:', completedItinerary);
  console.log('Upcoming Itinerary:', upcomingItinerary);

  const [textVisible, setTextVisible] = useState({ modify: false });


  return (
    <div className={`h-[275px]  rounded-md    `}>
      <div className="flex gap-2 px-2 flex-row items-center justify-between text-center font-inter border-b-2 border-slate-300 shadow-sm  py-2 text-neutral-700 text-xs">
        <div className='flex'>
        <div
            className={`px-2 py-1 rounded-lg cursor-pointer ease-in-out ${activeTabs === 'upcoming' ? 'bg-gray-200/10  font-semibold text-neutral-700  text-xs ' : 'text-xs'}`}
            onClick={() => handleTabChange('upcoming')}
            
          >
            <p>Upcoming</p>
          </div>
          <div
            className={`px-2 py-1 rounded-lg cursor-pointer  ${activeTabs === 'completed' ? 'bg-gray-200/10  font-semibold text-neutral-700  text-xs ' : 'text-xs'}`}
            onClick={() => handleTabChange('completed')}
            
          >
            <p>Completed</p>
          </div>
         
        </div>
        
        {activeTabs === 'upcoming' && upcomingItinerary.length >0 &&
     
        <TooltipBtn onClick={()=>handleVisible({urlName:'trip-url',tripId:trip?.tripId})} onHover={'Modify Trip'} icon={modify} />
          
          }  
          
      
      </div>
      
      <div className=' px-2 py-2 '>
      <TripName tripName={trip?.tripName}/>
      </div>
      
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='h-[180px]  space-y-2  w-full bg-white overflow-y-auto rounded-b-md py-1 px-2'>
          {itineraryByTab && itineraryByTab.length == 0 && 
         <EmptyTrips icon={empty_itinerary_icon} text={"No upcoming itineraries."}/>
            }
           {itineraryByTab?.map((item,index)=>{
              if(item?.category === "flights"){
                return ( 
                <FlightCard 
                handleDownloadFile={()=>handleDownloadFile(item?.bookingDetails?.docURL)}
                  disabled={item?.bookingDetails?.docURL ? false : true}
                key={index}
                status={item.status}
                
                id={item.id} 
                from={['pending booking'].includes(item?.status) ? item.from :item.bkd_from} 
                to={['pending booking'].includes(item?.status) ? item.to :item.bkd_to} 
                date={['pending booking'].includes(item?.status) ? item.date :item.bkd_date}
                returnDate={['pending booking'].includes(item?.status) ? item.returnDate :item.bkd_returnDate}
                returnTime={['pending booking'].includes(item?.status) ? item.returnTime :item.bkd_returnTime}
                travelClass={['pending booking'].includes(item?.status) ? item.travelClass :item.bkd_travelClass} 
                mode={'Flight'}
                time={['pending booking'].includes(item?.status) ? item.time :item.bkd_time}
                />)
              }
              if(item?.category === "trains"){
                return ( 
                  <FlightCard 
                  handleDownloadFile={()=>handleDownloadFile(item?.bookingDetails?.docURL)}
                  disabled={item?.bookingDetails?.docURL ? false : true}
                  key={index}
                  status={item.status}
                  id={item.id} 
                  from={['pending booking'].includes(item?.status) ? item.from :item.bkd_from} 
                  to={['pending booking'].includes(item?.status) ? item.to :item.bkd_to} 
                  date={['pending booking'].includes(item?.status) ? item.date :item.bkd_date}
                  returnDate={['pending booking'].includes(item?.status) ? item.returnDate :item.bkd_returnDate}
                  returnTime={['pending booking'].includes(item?.status) ? item.returnTime :item.bkd_returnTime}
                  travelClass={['pending booking'].includes(item?.status) ? item.travelClass :item.bkd_travelClass} 
                  mode={'Train'}
                  time={['pending booking'].includes(item?.status) ? item.time :item.bkd_time}
                  />)
              }
              if(item?.category === "buses"){
                return (                 
                  <FlightCard 
                  handleDownloadFile={()=>handleDownloadFile(item?.bookingDetails?.docURL)}
                  disabled={item?.bookingDetails?.docURL ? false : true}
                  key={index}
                  status={item.status}
                  id={item.id} 
                  from={['pending booking'].includes(item?.status) ? item.from :item.bkd_from} 
                  to={['pending booking'].includes(item?.status) ? item.to :item.bkd_to} 
                  date={['pending booking'].includes(item?.status) ? item.date :item.bkd_date}
                  returnDate={['pending booking'].includes(item?.status) ? item.returnDate :item.bkd_returnDate}
                  returnTime={['pending booking'].includes(item?.status) ? item.returnTime :item.bkd_returnTime}
                  travelClass={['pending booking'].includes(item?.status) ? item.travelClass :item.bkd_travelClass} 
                  mode={'Bus'}
                  time={['pending booking'].includes(item?.status) ? item.time :item.bkd_time}
                  />)
              }
              if(item?.category === "cabs"){
                return (                 
                  <CabCard
                  handleDownloadFile={()=>handleDownloadFile(item?.bookingDetails?.docURL)}
                  disabled={item?.bookingDetails?.docURL ? false : true}
                  key={index}
                  status={item.status}
                  id={item.id} 
                  from={['pending booking'].includes(item?.status) ? item.pickupAddress :item.bkd_pickupAddress} 
                  to={['pending booking'].includes(item?.status) ? item.dropAddress : item.bkd_dropAddress} 
                  date={['pending booking'].includes(item?.status) ? item.date : item.bkd_date}
                  returnDate={['pending booking'].includes(item?.status) ? item.returnDate : item.bkd_returnDate}
                  isFullDayCab={['pending booking'].includes(item?.status) ? item.isFullDayCab : item.isFullDayCab}
                  travelClass={['pending booking'].includes(item?.status) ? item.class : item.bkd_class} 
                  mode={'Cab'}
                  time={['pending booking'].includes(item?.status) ? item.time : item.bkd_time}/>)
              }
    
              if(item.category == 'carRentals'){
                return (
                  <RentalCabCard
                  handleDownloadFile={()=>handleDownloadFile(item?.bookingDetails?.docURL)}
                  disabled={item?.bookingDetails?.docURL ? false : true}
                  key={index}
                  status={item.status}
                  id={item.id}
                  from={['pending booking'].includes(item?.status) ? item.pickupAddress : item.bkd_pickupAddress}
                  to={['pending booking'].includes(item?.status) ? item.dropAddress : item.bkd_dropAddress}
                  date={['pending booking'].includes(item?.status) ? item.date : item.bkd_date}
                  returnDate={['pending booking'].includes(item?.status) ? item.returnDate : item.bkd_returnDate}
                  travelClass={['pending booking'].includes(item?.status) ? item.travelClass : item.bkd_class}
                  mode={'Cab'}
                  time={['pending booking'].includes(item?.status) ? item.time : item.bkd_time}
              />
                )
            }
            if(item.category == 'hotels'){
              return (


                <HotelCard
                handleDownloadFile={()=>handleDownloadFile(item?.bookingDetails?.docURL)}
                disabled={item?.bookingDetails?.docURL ? false : true}
                key={index}
                status={item.status}
                id={item.id}
                checkIn={['pending booking'].includes(item?.status) ? item.checkIn : item.bkd_checkIn}
                checkOut={['pending booking'].includes(item?.status) ? item.checkOut : item.bkd_checkOut}
                location={['pending booking'].includes(item?.status) ? item.location : item.bkd_location}
                time={['pending booking'].includes(item?.status) ? item.preferredTime : item.bkd_preferredTime}
                needBreakfast={['pending booking'].includes(item?.status) ? item.needBreakfast : item.bkd_needBreakfast}
                needLunch={['pending booking'].includes(item?.status) ? item.needLunch : item.bkd_needLunch}
                needDinner={['pending booking'].includes(item?.status) ? item.needDinner : item.bkd_needDinner}
                needNonSmokingRoom={['pending booking'].includes(item?.status) ? item.needNonSmokingRoom : item.bkd_needNonSmokingRoom}
            />
            
              )
          }
            })
           } 
          </div>
        </motion.div>
    </div>
  );
};

const UpcomingTrips = ({ index, trip,lastIndex ,handleVisible}) => {

  function flattenObjectToArray(obj) {
    return Object.entries(obj).reduce((acc, [key, val]) => {
      if (Array.isArray(val)) {
        const transformedArray = val.map(item => ({
          ...item,
          id: item.formId,
          category: key
        }));
        return acc.concat(transformedArray);
      }
      return acc;
    }, []);
  }

   const itineary = flattenObjectToArray(trip?.itinerary)
  console.log('flattenArrya',flattenObjectToArray(trip?.itinerary))

const [textVisible ,setTextVisible]=useState(false)


  return (
    <div className={`${index === lastIndex ? '' : 'mb-2'} cursor-pointer flex justify-between items-center p-3  rounded shadow w-full border border-slate-300 bg-slate-50 hover:bg-slate-100`}>
      {/* <div className="flex gap-2 px-2 flex-row items-center justify-between text-center font-cabin  border-slate-300 py-2 text-neutral-700 text-xs"> */}
       
      <TripName tripName={trip?.tripName}/>

        <div className='gap-4 flex '>

       
          <TooltipBtn onClick={()=>handleVisible({urlName:'trip-url',tripId:trip?.tripId})} onHover={'Modify Trip'} icon={modify} />

          </div>
        

      {/* </div> */}

      
  
       
     

      
    </div>
  );
};

const TravelExpenses = ({ index, expense ,lastIndex}) => {
  
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpanded = ()=>{
    setIsExpanded(!isExpanded)
  }
  
  const [dropdowns, setDropdowns] = useState(expense?.travelExpenses?.map(() => false)?? []);


  // Function to toggle the dropdown for a specific index
  const toggleDropdown = (i) => {
    setDropdowns((prev) => prev.map((dropdown, index) => (index === i ? !dropdown : dropdown)));
  };

  return (
    <div className={`${index ===lastIndex ? ' ' :'mb-2'} p-3 rounded shadow w-full border border-slate-300 bg-slate-50 hover:border hover:border-slate-300 hover:bg-slate-100`}>
      <div onClick={handleExpanded} className={`${expense?.travelExpenses.length > 0 && isExpanded && 'border-b-[1px]'} flex items-center  justify-between cursor-pointer min-h-4`}>
        
        <div className='font-cabin text-xs text-neutral-700'>
          <div className='text-xs text-start'>
            <div className='text-neutral-400'>Trip No.</div>
             <p> {expense.tripNumber}</p>
          </div>
        </div>
        <img src={chevron_down} className='w-5 h-5' />
      </div>
{isExpanded && expense?.travelExpenses.map((item, index) => (
        <div key={index} className={`px-2   cursor-pointer rounded-sm border border-slate-300 ${expense?.travelExpenses.length - 1 !== index && 'mb-2'}`}>
          
          <div className={`flex ${dropdowns[index] &&  'border-b border-slate-300'} justify-between items-center min-h-4 py-1 `} onClick={() => toggleDropdown(index)}>
            <div className='flex gap-x-2 ml-2 items-center'>
            <img src={chevron_down} className='w-4 h-4'/>
              
              
          {/* <div className='font-cabin text-xs text-neutral-700'>
          <div className='text-xs text-start'>
            <div className='text-neutral-400'>Expense Header No.</div>
             <p> {item?.expenseHeaderNumber}</p>
          </div>
          </div> */}

          </div>
            <div className={`text-center rounded-sm ${getStatusClass(item?.expenseHeaderStatus ?? "-")}`}>
              <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{item?.expenseHeaderStatus ?? "-"}</p>
            </div>
          </div>

          {dropdowns[index] && (
            <div className='ml-8 text-xs flex flex-col justify-center'>
              <div className='flex font-cabin text-xs text-neutral-400 text-center'>
                <div className='w-1/6'>Sr. No.</div>
                <div className='w-1/3'>Category</div>
                <div className='w-1/3'>Amount Details</div>
              </div>
              {item?.expenseLines.map((line, index) => (
                <div key={index} className='flex mb-1 text-center text-neutral-700 font-cabin'>
                  <div className='w-1/6'>{index + 1}.</div>
                  <div className='w-1/3'>
                    {line?.["Category Name"]}
                  </div>
                  <div className='w-1/3'>
                    {line?.Currency?.shortName} <span>{line?.convertedAmountDetails ? formatAmount(line?.convertedAmountDetails?.convertedAmount) : formatAmount(line?.["Total Amount"] ?? 0)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
     
    </div>
  );
};

const NonTravelExpenses = ({ index, expense, lastIndex }) => {
  // Initialize the state with an array of booleans, initially all set to false
  const [dropdowns, setDropdowns] = useState(false);

  const toggleDropdown = () => {
    setDropdowns((prev) => !prev);
  };

  return (
    <div className={`${index === lastIndex ? '' : 'mb-2'} p-3   rounded shadow w-full border border-slate-300 bg-slate-50 hover:bg-slate-100`}>
      <div onClick={toggleDropdown} className={`${dropdowns && 'border-b-[1px] pb-1 border-slate-300'} flex items-center justify-between cursor-pointer min-h-4`}>
       

<div className='font-cabin text-xs text-neutral-700'>
          <div className='text-xs text-start'>
            <div className='text-neutral-400'>Expense Header No.</div>
             <p> {expense.expenseHeaderNumber}</p>
          </div>
        </div>
        {/* <img  src={chevron_down} className='w-5 h-5' alt="Toggle Dropdown" /> */}
        <div className={`text-center rounded-sm ${getStatusClass(expense?.expenseHeaderStatus ?? "-")}`}>
              <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{expense?.expenseHeaderStatus ?? "-"}</p>
            </div>
      </div>

      {dropdowns && (
        <div className='ml-8 text-xs flex flex-col justify-center'>
          <div className='flex font-cabin text-xs text-neutral-400 text-center'>
            <div className='w-1/6'>Sr. No.</div>
            <div className='w-1/3'>Category</div>
            <div className='w-1/3'>Total Amount</div>
          </div>
          {expense?.expenseLines?.map((line, lineIndex) => (
            <div key={lineIndex} className='flex mb-1 text-center text-neutral-700 font-cabin'>
              <div className='w-1/6'>{lineIndex + 1}.</div>
              <div className='w-1/3'>
                {line?.["Category Name"]}
              </div>
              <div className='w-1/3'>
                {line?.Currency?.shortName} <span>{line?.convertedAmountDetails ? formatAmount(line?.convertedAmountDetails?.convertedAmount) : formatAmount(line?.["Total Amount"])}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TravelRequests = ({travel,index,lastIndex})=>{

  return(
    <div className={`${index === lastIndex ? '' : 'mb-2'} p-3   rounded shadow w-full border border-slate-300  hover:bg-slate-100`}>
    <div className={`flex items-center justify-between  min-h-4`}>
      
      <div className='font-cabin text-xs text-neutral-700'>
          {travel?.travelRequestStatus === "draft" ?
           <div className='text-xs text-start'>
           <div className='text-neutral-400'>Travel Request No.</div>
            <p>{travel?.travelRequestNumber}</p>
         </div>
          : 
          
          <TripName tripName={travel?.tripName}/>
          
        }
      </div>
      {/* <img  src={chevron_down} className='w-5 h-5' alt="Toggle Dropdown" /> */}
      <div className={`text-center rounded-sm ${getStatusClass(travel?.travelRequestStatus ?? "-")}`}>
            <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{travel?.travelRequestStatus ?? "-"}</p>
      </div>
    </div>
    </div>
   
  )
};







const EmptyTrips = ({icon, text }) => (
  <div className="min-w-[100px]  h-full sm:min-w-[280px] md:min-w-[400px] flex justify-center items-center">
    <div className="flex flex-col gap-4">
      <img src={icon} className="w-[200px] animate-pulse" alt="Empty itinerary icon" />
      <p className="text-xl text-center font-cabin text-neutral-600">{text}</p>
    </div>
  </div>
);


