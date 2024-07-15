/* eslint-disable react/jsx-key */
import React, { useState,useEffect } from 'react';
import { airplane_1, briefcase, calender_icon, double_arrow,cab_purple,  house_simple, train, bus, cancel_round, cancel, modify, plus_icon, plus_violet_icon, receipt, down_arrow, chevron_down, down_left_arrow, calender_2_icon, airplane, material_flight_black_icon, material_cab_black_icon, material_hotel_black_icon, city_icon, empty_itinerary_icon } from '../assets/icon';
import { formatAmount, formatDate, getStatusClass, splitTripName } from '../utils/handyFunctions';
import { travelExpense,reimbursementExpense, travelRequests, trips } from '../utils/dummyData';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import TravelMS from './TravelMS';
import { useData } from '../api/DataProvider';
import Error from '../components/common/Error';
import { CabCard, FlightCard, HotelCard, RentalCabCard } from '../components/itinerary/ItineraryCard';

const travelBaseUrl  = import.meta.env.VITE_TRAVEL_PAGE_URL;
const cashBaseUrl = import.meta.env.VITE_CASHADVANCE_PAGE_URL;

function CardLayout({cardSequence,icon,cardTitle,children}){
  return(
  <div className={`min-w-[400px] px-2  h-[340px] ${cardSequence ? 'opacity-100' : 'opacity-0'}`} >
         <div className="border-b-2  border-indigo-600 flex flex-row items-center justify-start gap-2 overflow-hidden py-2">
           <img
             className="w-5 h-5 shrink-0"
             alt="briefcase_icon"
             src={icon}
           />
           <b className="tracking-[0.02em] font-cabin text-[16px] text-indigo-600 font-semibold">{cardTitle}</b>
         </div>
         <div className=' shadow-sm shadow-indigo-600 rounded-md'/>
         {/* <div className="h-[285px] flex justify-center items-center  bg-white-100 overflow-hidden overflow-y-auto mt-2  border-[4px] border-gray-600  shadow-lg  shadow-black/60  rounded-3xl px-2"> */}
         <div className="h-[285px] bg-white-100 overflow-hidden overflow-y-auto mt-2  border-[4px] border-gray-600    shadow-custom-light  rounded-3xl px-2">
         
          {children}
      
         </div>
         
       </div>)
}



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




  
  const [visible, setVisible]=useState(false);
  const [iframeURL, setIframeURL] = useState(null); 

  const handleVisible= ()=>{
    setVisible(!visible);
    setIframeURL(`${travelBaseUrl}/create/${tenantId}/${empId}`);
  }

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
          window.location.href = window.location.href;
        }else if(event.data.split(' ')[0] == 'raiseAdvance'){
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
  
  const [textVisible , setTextVisible]=useState({expense:false,createTravel:false});
  const [expenseTabs , setExpenseTabs]=useState("travelExpense");
  
  const handleExpenseTabChange = (tab)=>{
    setExpenseTabs(tab)
  }

  const [visibleDivs, setVisibleDivs] = useState([false, false, false, false]);

  useEffect(() => {
    const delays = [0, 1000, 2000, 3000]; // delays in milliseconds
    delays.forEach((delay, index) => {
      setTimeout(() => {
        setVisibleDivs((prev) => {
          const newVisibleDivs = [...prev];
          newVisibleDivs[index] = true;
          return newVisibleDivs;
        });
      }, delay);
    });
  }, []);


  return (
    <>
    {isLoading && <Error message={loadingErrMsg}/>}
    {!isLoading &&
    <div className=" border border-black bg-[#eef2ff] min-h-screen flex items-center justify-center px-2 md:px-10">
        <TravelMS visible={visible} setVisible={setVisible} src={iframeURL}/>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full overflow-hidden pb-2">
    
     

<CardLayout cardSequence={visibleDivs[0]} icon={briefcase} cardTitle={"Activities for On-going Trips"}>
{trips.map((trip, index) => (
      <IntransitTrips key={index} index={index} trip={trip} lastIndex={trips.length - 1} />
    ))}
</CardLayout>

     
       
<div className={`min-w-[400px] px-2 h-[340px] ${visibleDivs[1] ? 'opacity-100' : 'opacity-0'}`} >

<div className="border-b-2 border-indigo-600 flex flex-row items-center justify-start gap-2 overflow-hidden py-2">
  <img
    className="w-5 h-5 shrink-0"
    alt="briefcase_icon"
    src={receipt}
  />
  <b className="text-indigo-600 tracking-[0.02em] font-cabin text-[16px] font-semibold">Expenses</b>
</div>

<div className="h-[285px] mt-2 border-4 border-indigo-600 rounded-md">
<div className="flex gap-x-2 h-[40px]   px-2 flex-row items-center justify-between text-center font-cabin border-b-2  border-slate-300  text-neutral-700 text-xs">
<div className='flex'>
<div
 className={`px-2 py-1 rounded-xl cursor-pointer delay-150  transition-colors ${
  expenseTabs === "travelExpense"
    ? 'text-white-100 bg-indigo-600'
    : 'text-xs'
}`}
onClick={() => handleExpenseTabChange("travelExpense")}
>
<p>Travel Expense</p>
</div>
<div
className={`px-2 py-1 rounded-xl cursor-pointer  delay-150  transition-colors ${
  expenseTabs === 'nonTravelExpense'
    ? 'text-white-100 bg-indigo-600 border border-white-100'
    : 'text-xs'
}`}
onClick={() => handleExpenseTabChange("nonTravelExpense")}
>
<p>Non-Travel Expense</p>
</div>
</div>     

<div
onMouseEnter={() => setTextVisible({expense:true})}
onMouseLeave={() => setTextVisible({expense:false})}
className={`relative  hover:px-2 w-6 h-6 hover:overflow-hidden hover:w-auto group text-indigo-600 bg-indigo-100 border border-white-100 flex items-center justify-center  hover:gap-x-1 rounded-full cursor-pointer transition-all duration-300`}
>
<img src={plus_violet_icon} width={16} height={16} alt="Add Icon" />
<p
className={`${
textVisible?.expense ? 'opacity-100 ' : 'opacity-0 w-0'
} whitespace-nowrap text-xs transition-all duration-300 group-hover:opacity-100 group-hover:w-auto`}
>
Add an Expense
</p>
</div>
</div>

<div className='h-[238px] overflow-y-auto px-2'>
{expenseTabs === "travelExpense" &&
travelExpense.map((expense,index) => <TravelExpenses index={`${index}-TravelExpense`} expense={expense} lastIndex={travelExpense.length-1} />)}



{expenseTabs === "nonTravelExpense" &&
reimbursementExpense?.map((expense,index) => <NonTravelExpenses index={index} expense={expense} lastIndex={reimbursementExpense.length-1}/>)}
</div>

</div>


</div> 
       






<CardLayout cardSequence={visibleDivs[2]} icon={briefcase} cardTitle={"Upcoming Trips"}>
  {trips.map((trip, index) => (
    
      <UpcomingTrips key={index} index={index} trip={trip} lastIndex={trips.length - 1} />
      
    ))}
</CardLayout>



<div className={`min-w-[400px] px-2 h-[340px] ${visibleDivs[3] ? 'opacity-100' : 'opacity-0'}`} >
  <div className="border-b-2 border-indigo-600 flex flex-row items-center justify-start gap-2 overflow-hidden py-2">
    <img
      className="w-5 h-5 shrink-0"
      alt="briefcase_icon"
      src={airplane_1}
    />
    <b className="tracking-[0.02em] text-indigo-600 font-cabin text-[16px] font-semibold">Travel Requests</b>
  </div>
  
  <div className="h-[288px]    mt-2 border-4 border-indigo-600 rounded-md px-2">
  <div className="flex gap-x-2 h-[40px]   px-2 flex-row items-center justify-end text-center font-cabin border-b-2  border-slate-300  text-neutral-700 text-xs">

<div
onMouseEnter={() => setTextVisible({createTravel:true})}
onMouseLeave={() => setTextVisible({createTravel:false})}
onClick={handleVisible}
className={`relative  hover:px-2 w-6 h-6 hover:overflow-hidden hover:w-auto group text-indigo-600 bg-indigo-100 border border-white-100 flex items-center justify-center  hover:gap-x-1 rounded-full cursor-pointer transition-all duration-300`}
>
<img src={plus_violet_icon} width={16} height={16} alt="Add Icon" />
<p
className={`${
  textVisible?.createTravel ? 'opacity-100 ' : 'opacity-0 w-0'
} whitespace-nowrap text-xs transition-all duration-300 group-hover:opacity-100 group-hover:w-auto`}
>
Raise Travel Request
</p>
</div>
  
</div>

<div className="h-[238px] overflow-y-auto   px-2">
  {travelRequests?.map((travel, index)=>(
    <TravelRequests travel={travel} index={index} lastIndex={travelRequests?.length-1}/>
  ))}
  </div>
  </div>
</div>

      </div>
    </div>}
    </>
  );
};

export default Overview;







const IntransitTrips = ({ index, trip, lastIndex }) => {
  
  const [activeTabs, setActiveTabs] = useState("upcoming");
 



  console.log(activeTabs);


  function separateItineraryByDate(currentDate, itinerary) {
    let completedItinerary = [];
    let upcomingItinerary = [];
  
    function checkAndPush(item, dateField, category) {
      const itemDate = new Date(item[dateField]);
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
  
    itinerary.flights.forEach(flight => checkAndPush(flight, 'bkd_date', 'flights'));
    itinerary.hotels.forEach(hotel => checkAndPush(hotel, 'bkd_checkOut', 'hotels'));
    itinerary.buses.forEach(bus => checkAndPush(bus, 'bkd_date', 'buses'));
    itinerary.trains.forEach(train => checkAndPush(train, 'bkd_date', 'trains'));
    itinerary.cabs.forEach(cab => checkAndPush(cab, 'bkd_date', 'cabs'));
  

    completedItinerary = completedItinerary.sort((a,b)=>(a.sequence - b.sequence));
    upcomingItinerary = upcomingItinerary.sort((a,b)=>(a.sequence - b.sequence));
    return { completedItinerary, upcomingItinerary };
  }
  const currentDate = new Date();
  const { completedItinerary, upcomingItinerary } = separateItineraryByDate(currentDate, trip?.itinerary);
  
  const [itineraryByTab , setItineraryByTab] = useState(upcomingItinerary)
  const handleTabChange = (tab) => {
    setActiveTabs(tab);
    if ( tab === "completed"){
      setItineraryByTab(completedItinerary)
    }else if (tab === "upcoming"){
      setItineraryByTab(upcomingItinerary)
    }
  };
 

  // function separateItineraryByDate(currentDate, itinerary) {
  //   const completedItinerary = { flights: [], hotels: [], buses: [], cabs: [] };
  //   const upcomingItinerary = { flights: [], hotels: [], buses: [], cabs: [] };
    

  //   function checkAndPush(item, dateField, category) {
  //     const itemDate = new Date(item[dateField]);
  //     if (category === "hotels") {
  //       if (itemDate < currentDate) {
  //         completedItinerary[category].push(item);
  //       } else {
  //         upcomingItinerary[category].push(item);
  //       }
  //     } else {
  //       if (itemDate >= currentDate) {
  //         upcomingItinerary[category].push(item);
  //       } else {
  //         completedItinerary[category].push(item);
  //       }
  //     }
  //   }

  //   itinerary.flights.forEach(flight => checkAndPush(flight, 'bkd_date', 'flights'));
  //   itinerary.hotels.forEach(hotel => checkAndPush(hotel, 'bkd_checkOut', 'hotels'));
  //   itinerary.buses.forEach(bus => checkAndPush(bus, 'bkd_date', 'buses'));
  //   itinerary.trains.forEach(train => checkAndPush(train, 'bkd_date', 'trains'));
  //   itinerary.cabs.forEach(cab => checkAndPush(cab, 'bkd_date', 'cabs'));

  //   return { completedItinerary, upcomingItinerary };
  // }



  console.log('Completed Itinerary:', completedItinerary);
  console.log('Upcoming Itinerary:', upcomingItinerary);

  const [textVisible, setTextVisible] = useState({ modify: false });

  return (
    <div className={`h-[280px] rounded-md border border-white-100 `}>
      <div className="flex gap-2 px-2 flex-row items-center justify-between text-center font-cabin border-b-2 border-slate-300 shadow-sm  py-2 text-neutral-700 text-xs">
        <div className='flex'>
        <div
            className={`px-2 py-1 rounded-xl cursor-pointer ease-in-out ${activeTabs === 'upcoming' ? 'bg-indigo-100 font-semibold text-indigo-600 border border-white-100 text-xs shadow-md shadow-indigo-600' : 'text-xs'}`}
            onClick={() => handleTabChange('upcoming')}
            
          >
            <p>Upcoming</p>
          </div>
          <div
            className={`px-2 py-1 rounded-xl cursor-pointer transition duration-150 ease-in-out ${activeTabs === 'completed' ? 'bg-indigo-100 font-semibold text-indigo-600 border border-white-100 text-xs shadow-md shadow-indigo-600' : 'text-xs'}`}
            onClick={() => handleTabChange('completed')}
            
          >
            <p>Completed</p>
          </div>
         
        </div>
        
        {activeTabs === 'upcoming' &&
        <div
            onMouseEnter={() => setTextVisible({ modify: true })}
            onMouseLeave={() => setTextVisible({ modify: false })}
            className={`relative shadow-md shadow-indigo-600 hover:px-2 w-6 h-6 hover:overflow-hidden hover:w-auto group text-indigo-600 bg-indigo-100 border border-white-100 flex items-center justify-center hover:gap-x-1 rounded-full cursor-pointer transition-all duration-300`}

          >
            <img src={modify} width={16} height={16} alt="Add Icon" />
            <p className={`${textVisible?.modify ? 'opacity-100 ' : 'opacity-0 w-0'} whitespace-nowrap text-xs transition-all duration-300 group-hover:opacity-100 group-hover:w-auto`}>
              Modify
            </p>
          </div>}  
          
      
      </div>
      <div className='flex gap-2 items-center px-2 py-2 text-base  font-cabin'>
              <img src={briefcase} className='w-4 h-4'/>
              <div className='  text-sm uppercase text-neutral-700 '>
               {trip?.tripName.split('(')[0]}


      </div>
      </div>
      
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='h-[200px] space-y-2 min-w-max w-full bg-white-100 overflow-y-auto rounded-b-md py-1 px-2'>
          {itineraryByTab && itineraryByTab.length == 0 && <div className="min-w-[100px] h-full  sm:min-w-[280px]  md:min-w-[400px]  flex justify-center items-center">
                    <div className="flex flex-col gap-4">
                        <img src={empty_itinerary_icon} className="w-[200px]"/>
                        <p className="text-xl font-cabin text-neutral-600">No upcoming itineraries.</p>
                    </div>
                </div>}
           {
            itineraryByTab?.map((item,index)=>{
              if(item?.category === "flights"){
                return ( 
                <FlightCard 
                id={item.id} 
                from={item.bkd_from} 
                to={item.bkd_to} 
                date={item.bkd_date}
                returnDate={item.bkd_returnDate}
                returnTime={item.bkd_returnTime}
                travelClass={item.bkd_travelClass} 
                mode={'Flight'}
                time={item.bkd_time}
                />)
              }
              if(item?.category === "trains"){
                return ( 
                  <FlightCard 
                  id={item.id} 
                  from={item.bkd_from} 
                  to={item.bkd_to} 
                  date={item.bkd_date}
                  returnDate={item.bkd_returnDate}
                  returnTime={item.bkd_returnTime}
                  travelClass={item.bkd_travelClass} 
                  mode={'Flight'}
                  time={item.bkd_time}
                  />)
              }
              if(item?.category === "buses"){
                return (                 
                  <FlightCard 
                  id={item.id} 
                  from={item.bkd_from} 
                  to={item.bkd_to} 
                  date={item.bkd_date}
                  returnDate={item.bkd_returnDate}
                  returnTime={item.bkd_returnTime}
                  travelClass={item.bkd_travelClass} 
                  mode={'Flight'}
                  time={item.bkd_time}
                  />)
              }
              if(item?.category === "cabs"){
                return (                 
                  <CabCard
                  id={item.id} 
                  from={item.bkd_pickupAddress} 
                  to={item.bkd_dropAddress} 
                  date={item.bkd_date}
                  returnDate={item.bkd_returnDate}
                  isFullDayCab={item.isFullDayCab}
                  travelClass={item.bkd_class} 
                  mode={'Cab'}
                  time={item.bkd_time}/>)
              }
              if(item.category == 'carRentals'){
                return (
                    <RentalCabCard
                        id={item.id} 
                        from={item.bkd_pickupAddress} 
                        to={item.bkd_dropAddress} 
                        date={item.bkd_date}
                        returnDate={item.bkd_returnDate}
                        travelClass={item.bkd_class} 
                        mode={'Cab'}
                        time={item.bkd_time}/>
                )
            }
            if(item.category == 'hotels'){
              return (
                  <HotelCard
                      id={item.id} 
                      checkIn={item.bkd_checkIn} 
                      checkOut={item.bkd_checkOut} 
                      location={item.bkd_location}
                      time={item.bkd_preferredTime}
                      needBreakfast={item.bkd_needBreakfast}
                      needLunch={item.bkd_needLunch}
                      needDinner={item.bkd_needDinner}
                      needNonSmokingRoom={item.bkd_needNonSmokingRoom}
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











const UpcomingTrips = ({ index, trip,lastIndex }) => {

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
    <div className={ ` h-[270px] rounded-md `}>
      <div className="flex gap-2 px-2 flex-row items-center justify-between text-center font-cabin border-b-2  border-slate-300 py-2 text-neutral-700 text-xs">
       
      <div className='font-cabin text-xs text-neutral-700'>
         
           <div className='flex gap-2 items-center '>
              <img src={briefcase} className='w-4 h-4'/>
              <div className='font-medium font-cabin  text-sm uppercase text-neutral-700 '>
               {splitTripName(trip?.tripName)}
              </div>
              </div>
        </div>

        <div className='gap-4 flex '>
         
      
        
          
          
             
        <div
            onMouseEnter={() => setTextVisible({ modify: true })}
            onMouseLeave={() => setTextVisible({ modify: false })}
            className={`relative shadow-md shadow-indigo-600 hover:px-2 w-6 h-6 hover:overflow-hidden hover:w-auto group text-indigo-600 bg-indigo-100 border border-white-100 flex items-center justify-center hover:gap-x-1 rounded-full cursor-pointer transition-all duration-300`}

          >
            <img src={modify} width={16} height={16} alt="Add Icon" />
            <p className={`${textVisible?.modify ? 'opacity-100 ' : 'opacity-0 w-0'} whitespace-nowrap text-xs transition-all duration-300 group-hover:opacity-100 group-hover:w-auto`}>
              Modify
            </p>
          </div>


          </div>
        

      </div>

      
  
        <div>
         <div className='h-[234px] min-w-max w-full  overflow-y-auto rounded-b-md py-1 px-2'>
         <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='max-h-[220px]  h-full space-y-2 min-w-max w-full bg-white-100 overflow-y-auto rounded-b-md py-1 px-2'>
          {itineary && itineary.length == 0 && <div className="min-w-[100px] h-full  sm:min-w-[280px]  md:min-w-[400px]  flex justify-center items-center">
                    <div className="flex flex-col gap-4">
                        <img src={empty_itinerary_icon} className="w-[200px]"/>
                        <p className="text-xl font-cabin text-neutral-600">No upcoming itineraries.</p>
                    </div>
                </div>}
           {
            itineary?.map((item)=>{
              if(item?.category === "flights"){
                return ( 
                <FlightCard 
                id={item.id} 
                from={item.bkd_from} 
                to={item.bkd_to} 
                date={item.bkd_date}
                returnDate={item.bkd_returnDate}
                returnTime={item.bkd_returnTime}
                travelClass={item.bkd_travelClass} 
                mode={'Flight'}
                time={item.bkd_time}
                />)
              }
              if(item?.category === "trains"){
                return ( 
                  <FlightCard 
                  id={item.id} 
                  from={item.bkd_from} 
                  to={item.bkd_to} 
                  date={item.bkd_date}
                  returnDate={item.bkd_returnDate}
                  returnTime={item.bkd_returnTime}
                  travelClass={item.bkd_travelClass} 
                  mode={'Flight'}
                  time={item.bkd_time}
                  />)
              }
              if(item?.category === "buses"){
                return (                 
                  <FlightCard 
                  id={item.id} 
                  from={item.bkd_from} 
                  to={item.bkd_to} 
                  date={item.bkd_date}
                  returnDate={item.bkd_returnDate}
                  returnTime={item.bkd_returnTime}
                  travelClass={item.bkd_travelClass} 
                  mode={'Flight'}
                  time={item.bkd_time}
                  />)
              }
              if(item?.category === "cabs"){
                return (                 
                  <CabCard
                  id={item.id} 
                  from={item.bkd_pickupAddress} 
                  to={item.bkd_dropAddress} 
                  date={item.bkd_date}
                  returnDate={item.bkd_returnDate}
                  isFullDayCab={item.isFullDayCab}
                  travelClass={item.bkd_class} 
                  mode={'Cab'}
                  time={item.bkd_time}/>)
              }
              if(item.category == 'carRentals'){
                return (
                    <RentalCabCard
                        id={item.id} 
                        from={item.bkd_pickupAddress} 
                        to={item.bkd_dropAddress} 
                        date={item.bkd_date}
                        returnDate={item.bkd_returnDate}
                        travelClass={item.bkd_class} 
                        mode={'Cab'}
                        time={item.bkd_time}/>
                )
            }
            if(item.category == 'hotels'){
              return (
                  <HotelCard
                      id={item.id} 
                      checkIn={item.bkd_checkIn} 
                      checkOut={item.bkd_checkOut} 
                      location={item.bkd_location}
                      time={item.bkd_preferredTime}
                      needBreakfast={item.bkd_needBreakfast}
                      needLunch={item.bkd_needLunch}
                      needDinner={item.bkd_needDinner}
                      needNonSmokingRoom={item.bkd_needNonSmokingRoom}
                      />
              )
          }


            })
           }
            
          
           
            
          </div>
        </motion.div>


</div>
        </div>
     

      
    </div>
  );
};


 



const TravelExpenses = ({ index, expense ,lastIndex}) => {
  
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpanded = ()=>{
    setIsExpanded(!isExpanded)
  }
  
  const [dropdowns, setDropdowns] = useState(expense?.travelExpenseData.map(() => false));

  // Function to toggle the dropdown for a specific index
  const toggleDropdown = (i) => {
    setDropdowns((prev) => prev.map((dropdown, index) => (index === i ? !dropdown : dropdown)));
  };

  return (
    <div className={`${index ===lastIndex ? ' ' :'mb-2'} p-3 rounded shadow w-full border border-slate-300 bg-slate-50 hover:border hover:border-indigo-600 hover:bg-indigo-100`}>
      <div onClick={handleExpanded} className={`${expense?.travelExpenseData.length > 0 && isExpanded && 'border-b-[1px]'} flex items-center  justify-between cursor-pointer min-h-4`}>
        
        <div className='font-cabin text-xs text-neutral-700'>
          <div className='text-xs text-start'>
            <div className='text-neutral-400'>Trip No.</div>
             <p> {expense.tripNumber}</p>
          </div>
        </div>
        <img src={chevron_down} className='w-5 h-5' />
      </div>
{isExpanded &&  expense?.travelExpenseData.map((item, index) => (
        <div key={index} className={`px-2 hover:bg-indigo-100 hover:border-[1px] hover:border-indigo-600 cursor-pointer rounded-sm border border-slate-300 ${expense?.travelExpenseData.length - 1 !== index && 'mb-2'}`}>
          
          <div className={`flex ${dropdowns[index] &&  'border-b border-slate-300'} justify-between items-center min-h-4 py-1 `} onClick={() => toggleDropdown(index)}>
            <div className='flex gap-x-2 ml-2 items-center'>
            <img src={down_left_arrow} className='w-4 h-3'/>
              
              
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
    <div className={`${index === lastIndex ? '' : 'mb-2'} p-3 hover:border hover:border-indigo-600 rounded shadow w-full border border-slate-300 bg-slate-50 hover:bg-indigo-100`}>
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
          {expense?.expenseLines.map((line, lineIndex) => (
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
    <div className={`${index === lastIndex ? '' : 'mb-2'} p-3 hover:border hover:border-indigo-600 rounded shadow w-full border border-slate-300 bg-slate-50 hover:bg-indigo-100 `}>
    <div className={` flex items-center justify-between cursor-pointer min-h-4`}>
      {/* <div className='font-cabin text-xs text-neutral-700'>
        {travel?.travelRequestNumber}
      </div> */}
      <div className='font-cabin text-xs text-neutral-700'>
          <div className='text-xs text-start'>
            <div className='text-neutral-400'>Travel Request No.</div>
             <p>{travel?.travelRequestNumber}</p>
          </div>
        </div>
      {/* <img  src={chevron_down} className='w-5 h-5' alt="Toggle Dropdown" /> */}
      <div className={`text-center rounded-sm ${getStatusClass(travel?.travelRequestStatus ?? "-")}`}>
            <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{travel?.travelRequestStatus ?? "-"}</p>
          </div>
    </div>
    </div>
   
  )
};




// import React ,{ useState,useEffect} from 'react';
// import { useData } from '../api/DataProvider';
// import { intransit_trip, arrow_left, down_arrow, chevron_down, cancel_round, cancel, upcoming_trip} from '../assets/icon';
// import NotifyModal from '../components/NotifyModal';
// import UpcomingTrip from '../components/trips/UpcomingTrip';
// import  IntransitTrip from '../components/trips/IntransitTrip';
// import { handleTrip ,handleTravelExpense, handleCashAdvance,} from '../utils/actionHandler';
// import { useParams } from 'react-router-dom';
// import Error from '../components/common/Error';



// const Overview = ({fetchData ,isLoading,setIsLoading,loadingErrMsg, setLoadingErrMsg}) => {

//   const { setEmployeeData , employeeData } = useData(); 
//   const [tripsData,setTripsData]=useState(null);
//   const {tenantId,empId,page}= useParams();

//   useEffect(()=>{
//     fetchData(tenantId,empId,page)
//   },[])


// useEffect(()=>{
//   console.log('data11',employeeData?.dashboardViews?.employee?.trips)
//   setTripsData(employeeData && employeeData?.dashboardViews?.employee?.trips)
// },[employeeData])


//   console.log('tripsData',tripsData?.transitTrips)
  
//     const [dropdownStates, setDropdownStates] = useState({});      
//     const initialTripTab=['Trip','Trip','Trip']
//     // const initialTripTab=tripsData?.transitTrips.map(item=> 'Trip')
//     console.log('initial transit trip',initialTripTab)


//     const [showConfirmationOverlay, setShowConfirmationOverlay] = useState(false);

//     const handleOpenOverlay = () => {
//        setShowConfirmationOverlay(true);
  
  
//       setTimeout(()=>{
//         setShowConfirmationOverlay(false);
//         window.location.reload();
//       },5000);
      
//     };

//   //handle for Cancel and Add a Leg Options
//     const handleDropdownToggle = (index) => {
//     setDropdownStates((prevStates) => ({
//       ...prevStates,
//       [index]: !prevStates[index],
//     }));
//   };
//   return (
//     <>
//      {isLoading && <Error message={loadingErrMsg}/>}
 
//     {!isLoading &&
//      <div className='w-auto min-h-screen pt-12 px-0 lg:px-20 bg-white-100 flex flex-col gap-4'> 
//      <div className=' overflow-x-auto'> 
//    <IntransitTrip 
//       handleCashAdvance={handleCashAdvance} 
//       handleTrip={handleTrip} 
//       dropdownStates={dropdownStates} 
//       initialTransitTabs={initialTripTab}
//       transitTripData={tripsData &&tripsData?.transitTrips} 
//       handleDropdownToggle={handleDropdownToggle} 
//       handleOpenOverlay={handleOpenOverlay}/> 
//      </div>
    
//      {/* Third Div taking full width in the next row */}
//    <div className=''>
//        <UpcomingTrip 
//        handleCashAdvance={handleCashAdvance} 
//        handleTrip={handleTrip} dropdownStates={dropdownStates} 
//        upComingTrip={tripsData &&tripsData?.upcomingTrips} 
//        handleDropdownToggle={handleDropdownToggle} 
//        handleOpenOverlay={handleOpenOverlay} 
//        />
//    </div>
     
//    {showConfirmationOverlay && (
//      <NotifyModal/>
//    )}
//    </div>}
 
// </>
//   )}

// export default Overview;



