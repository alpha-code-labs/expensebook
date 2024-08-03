import React, { useEffect, useState } from 'react';
import { briefcase, modify, receipt, receipt_icon1, categoryIcons, filter_icon, plus_violet_icon, cancel, search_icon, info_icon, airplane_1, airplane_icon1, plus_icon } from '../assets/icon';
import { extractTripNameStartDate, filterByTimeRange, formatAmount, getStatusClass, sortTripsByDate, splitTripName } from '../utils/handyFunctions';
import {dummyTravelReqForBooking ,dummyPaidAndCancelledTrips} from '../utils/dummyData';
import { handleNonTravelExpense, handleTravelExpense } from '../utils/actionHandler';
import { CabCard, FlightCard, HotelCard, RentalCabCard } from '../components/itinerary/BookingItineraryCard';
import Modal from '../components/common/Modal1';
import { useParams } from 'react-router-dom';
import { useData } from '../api/DataProvider';
import TripSearch from '../components/common/TripSearch';
import Button1 from '../components/common/Button1';
import Error from '../components/common/Error';
import SearchComponent from '../components/common/ExpenseSearch';
import Input from '../components/common/SearchInput';
import { TripName } from '../components/common/TinyComponent';
import TravelMS from '../microservice/TravelMS';
import CurrencyInput from '../components/common/currency/CurrencyInput'
import { currenciesList } from '../utils/data/currencyList';



const Booking = ({isLoading ,fetchData,loadingErrMsg}) => {

const travelBaseUrl  = import.meta.env.VITE_TRAVEL_PAGE_URL;
const cashBaseUrl = import.meta.env.VITE_CASHADVANCE_PAGE_URL;
const tripBaseUrl = import.meta.env.VITE_TRIP_BASE_URL;

  const [tripId , setTripId]=useState(null);
  const [expenseType , setExpenseType]=useState(null);
 
  const [textVisible,setTextVisible]=useState({tripId:false}); 
  const [modalOpen , setModalOpen]=useState(false);
  const [tripData, setTripData]=useState({tripsForBooking:[],tripsForRecover:[]});
  const {tenantId,empId,page}= useParams();
  const { employeeData } = useData();
  const [error , setError]= useState({
    tripId: {set:false, message:""}
  }); 
  const [searchQuery , setSearchQuery] = useState('');
  
///----------------------start---------------
const [selectedDateRange, setSelectedDateRange] = useState("");

const handleTabClick = (range) => {
  setSelectedDateRange(selectedDateRange === range ? "" : range);
};




const getStatusClass = (status) => {
  return 'bg-blue-500 text-white'; // Adjust this based on your styling requirements
};


function dataFilterByDate (data){
if (selectedDateRange){
  return filterByTimeRange(data, selectedDateRange)
}
return data

}
// const filteredData = selectedStatuses.length > 0
//   ? selectedStatuses.reduce((acc, status) => [...acc, ...filterByTimeRange(tripData, status)], [])
//   : tripData;
///----------------------end---------------

  

  
  useEffect(()=>{

    fetchData(tenantId,empId,page)

  },[])
  




  useEffect(()=>{
    if (employeeData) {
    const data = employeeData?.dashboardViews?.employee?.overview || [];

    //const travelRequests = data?.allTravelRequests?.allTravelRequests || [];
    const travelRequests = [ ...dummyTravelReqForBooking];
    const paidAndCancelledTrips = [...dummyPaidAndCancelledTrips]

    sortTripsByDate(travelRequests)
    sortTripsByDate(paidAndCancelledTrips)
    
    setTripData((prev)=>({...prev, tripsForBooking:travelRequests || [], tripsForRecover:paidAndCancelledTrips || []}))}
    else{
      console.error('Employee data is missing.');
    }
  },[employeeData])

  const travelRequestsForBooking  =[]
  const tripsForRecover = []
  
  const getStatusCount = (status) => {
    if(status === "paid and cancelled"){
      const count = tripData?.tripsForRecover?.filter((trip) => trip?.travelRequestStatus === status).length;
      return count;
    }else{
      return filterByTimeRange(tripData?.tripsForBooking, status).length;
    }
    
  };
  const [visible, setVisible]=useState(false); 
  const [iframeURL, setIframeURL] = useState(null); 

  const handleVisible = (data) => {
    const { urlName, tripId, travelRequestId } = data;
    setVisible(!visible);
  
    let url = '';
  
    if (urlName === 'bookingTravel') {
      url = `${travelBaseUrl}/bookings/${travelRequestId}`;
    } if (urlName === 'recoverTrip') {
      url = `${tripBaseUrl}/${tenantId}/${empId}/modify/${tripId}/section1`;
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
  
  console.log('trips and travel from travel screen', tripData)
  
  


  

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
      handleTravelExpense(tripId, '','trip-ex-create')
    } else {
      setExpenseType(null)
      setModalOpen(false)
      handleNonTravelExpense('','non-tr-ex-create')
    }
  };
 



  function itineraryArray(itinerary) {
  const sortedItnArray = Object.entries(itinerary).flatMap(([category, items]) =>
    items.map(item => ({ ...item, category }))
  ).sort((a,b)=> a.sequence - b.sequence)

  console.log('sorted itn', sortedItnArray)
  return sortedItnArray
  }
  return (
    <>
    {isLoading && <Error message={loadingErrMsg}/>}
    {!isLoading && 
    <div className='min-h-screen'>
      <TravelMS visible={visible} setVisible={setVisible} src={iframeURL}/>
      <div className='flex flex-col w-full p-4  items-start gap-2'>
      <div className='min-h-[120px] flex-col border border-slate-300 bg-white-100 rounded-md  w-full flex  items-start gap-2 px-2 py-2'>
 <div className='flex  overflow-x-auto  space-x-2 space-y-2'>      
<div className='flex items-center gap-2 justify-center p-2 bg-slate-100/50 rounded-full border border-slate-300  '> 
<div className='px-4 '>
  <img src={filter_icon} className='min-w-5 min-h-5'/>
</div>

{["48 Hours", "7 Days", "30 Days", "Beyond the month", "paid and cancelled"].map((status) => {
        const statusCount = getStatusCount(status);
        const isDisabled = statusCount === 0;

        return (
          <div key={status} className={`flex items-center ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            <div
              onClick={() => !isDisabled && handleTabClick(status)}
              className={`ring-1 ring-white-100 flex py-1 pr-3 text-center rounded-sm ${selectedDateRange.includes(status) ? "bg-indigo-100 text-indigo-600 border border-indigo-600" : "bg-slate-100 text-neutral-700 border border-slate-300"}`}
            >
              <p className='px-1 py-1 text-sm text-center capitalize font-cabin whitespace-nowrap'>{status ?? "-"}</p>
            </div>
            <div className={`shadow-md shadow-black/30 font-semibold -translate-x-3 ring-1 rounded-full ring-white-100 w-6 h-6 flex justify-center items-center text-center text-xs ${selectedDateRange.includes(status) ? "border border-indigo-600 bg-indigo-100 text-indigo-600"  : "bg-slate-100 text-neutral-700 border border-slate-300"}`}>
              <p>{statusCount}</p>
            </div>
          </div>
        );
      })}

{/* {["48 Hours","7 Days", "30 Days", "Beyond the month", "paid and cancelled"].map((status) => {
    const statusCount = getStatusCount(status, [...tripData]);
    const isDisabled = statusCount === 0;
    
    return (
      <div key={status} className={`flex  items-center  ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
        <div
          onClick={() => !isDisabled && handleStatusClick(status)}
          className={`ring-1 ring-white-100 flex py-1 pr-3 text-center rounded-sm ${selectedStatuses.includes(status) ? getStatusClass(status ?? "-") : "bg-slate-100 text-neutral-700 border border-slate-300"}`}
        >
          <p className='px-1 py-1 text-sm text-center capitalize font-cabin whitespace-nowrap '>{status ?? "-"}</p>
        </div>
        <div className={`shadow-md shadow-black/30 font-semibold -translate-x-3 ring-1 rounded-full ring-white-100 w-6 h-6 flex justify-center items-center text-center text-xs ${selectedStatuses.includes(status) ? getStatusClass(status ?? "-") : "bg-slate-100 text-neutral-700 border border-slate-300 "}`}>
          <p>{statusCount}</p>
        </div>
      </div>
    );
  })} */}
</div>
  
<div className='text-neutral-700 text-base flex justify-center items-center hover:text-red-200 hover:font-semibold text-center w-auto h-[36px] font-cabin cursor-pointer whitespace-nowrap ' onClick={() => setSelectedStatuses([])}>Clear All</div>
</div> 
<div className=''>
   
   <Input placeholder="Search Trip..." type="search" icon={search_icon} onChange={(value)=>setSearchQuery(value)}/>
 </div>


 
</div>


       

        <div className='w-full flex md:flex-row flex-col '>
          <div className='flex-1 justify-center items-center'>
            <div className='relative flex justify-center items-center rounded-md font-inter text-md text-white-100 h-[52px] bg-indigo-600 text-center'>
          {/* <div
          onClick={()=>handleVisible({urlName:"travel-url"})}
          onMouseEnter={() => setTextVisible({cashAdvance:true})}
          onMouseLeave={() => setTextVisible({cashAdvance:false})}
          className={`absolute  left-0 ml-4 hover:px-2 w-6 h-6 hover:overflow-hidden hover:w-auto group text-indigo-600 bg-indigo-100 border border-white-100 flex items-center justify-center  hover:gap-x-1 rounded-full cursor-pointer transition-all duration-300`}
          >
          <img src={plus_violet_icon} width={16} height={16} alt="Add Icon" />
          <p
          className={`${
          textVisible?.expense ? 'opacity-100' : 'opacity-0 w-0'
          } whitespace-nowrap text-xs transition-all duration-300 group-hover:opacity-100 group-hover:w-auto`}
          >
          Raise a Travel Request
          </p>
          </div> */}
              
              <div className='flex justify-center items-center'>
                <img src={airplane_icon1} className='w-4 h-4 mr-2' />
                <p>Trips</p>
              </div>
            </div>
            <div className='w-full mt-4 xl:h-[570px] lg:h-[370px] md:[590px] overflow-y-auto px-2 bg-white-100 rounded-l-md'>
              {selectedDateRange === "paid and cancelled" ? 
                <div>
                
               {tripData?.tripsForRecover.map((trip)=>(
                <>
                 <TripRecoverCard/>
                </>
               ))}
                
                </div> : dataFilterByDate((tripData?.tripsForBooking))?.map((trip, index) => {

                // if (trip?.travelRequestStatus === "paid and cancelled"){
                //   return "hello"
                // }
                return (
                <>
      <div key={`${index}-tr-expense`} className='flex border flex-col gap-y-2 w-full items-center hover:border hover:border-indigo-600 hover:bg-indigo-100 cursor-pointer  justify-between mb-4 text-neutral-700 rounded-md shadow-custom-light bg-white-100 p-4'>
      <div className='flex flex-row w-full justify-between'>
        <div className='flex flex-col gap-2 items-start'>
             <div>
                <p className='header-title'>Created By</p>
                <p className='header-text'>{trip?.createdBy?.name ?? <span className='text-center'>-</span>}</p>
             </div>
       <div className='font-cabin text-xs text-neutral-700'>
          
          <TripName tripName={trip?.tripName}/>
          {/* <div>{trip?.tripStartDate}</div> */}
          
      </div>
      </div>
     <Button1 
     onClick={()=>{handleVisible({travelRequestId:trip?.travelRequestId, urlName:"bookingTravel"})}} 
     text={<div
      className='flex justify-center items-center space-x-2 -translate-x-1'><img src={plus_icon} className='w-5 h-5'/><p className='text-white-100'>
      Book Trip
      </p>
      </div>}
      />
      </div>  
      <div className='w-full flex flex-col gap-1'>
                  {itineraryArray(trip?.itinerary).map((item,index)=>{
                    if(item?.category === "flights"){
                      return ( 
                      <FlightCard
                      status={item.status}
                      key={index}
                      id={item.id} 
                      from={item.from} 
                      to={item.to} 
                      date={item.date}
                      returnDate={item.returnDate}
                      returnTime={item.returnTime}
                      travelClass={item.travelClass} 
                      mode={'Flight'}
                      time={item.time}
                      />)
                    }
                    if(item?.category === "trains"){
                      return ( 
                        <FlightCard 
                        status={item.status}
                        key={index}
                        id={item.id} 
                        from={item.from} 
                        to={item.to} 
                        date={item.date}
                        returnDate={item.returnDate}
                        returnTime={item.returnTime}
                        travelClass={item.travelClass} 
                        mode={'Train'}
                        time={item.time}
                        />)
                    }
                    if(item?.category === "buses"){
                      return (                 
                        <FlightCard 
                        status={item.status}
                        key={index}
                        id={item.id} 
                        from={item.from} 
                        to={item.to} 
                        date={item.date}
                        returnDate={item.returnDate}
                        returnTime={item.returnTime}
                        travelClass={item.travelClass} 
                        mode={'Bus'}
                        time={item.time}
                        />)
                    }
                    if(item?.category === "cabs"){
                      return (                 
                        <CabCard
                        status={item.status}
                        key={index}
                        id={item.id} 
                        from={item.pickupAddress} 
                        to={item.dropAddress} 
                        date={item.date}
                        returnDate={item.returnDate}
                        isFullDayCab={item.isFullDayCab}
                        travelClass={item.class} 
                        mode={'Cab'}
                        time={item.time}/>)
                    }
                    if(item.category == 'carRentals'){
                      return (
                          <RentalCabCard
                              status={item.status}
                              key={index}
                              id={item.id} 
                              from={item.pickupAddress} 
                              to={item.dropAddress} 
                              date={item.date}
                              returnDate={item.returnDate}
                              travelClass={item.class} 
                              mode={'Cab'}
                              time={item.time}/>
                      )
                  }
                  if(item.category == 'hotels'){
                    return (
                        <HotelCard
                            status={item.status}
                            key={index}
                            mode={"Hotel"}
                            id={item.id} 
                            checkIn={item.checkIn} 
                            checkOut={item.checkOut} 
                            location={item.location}
                            time={item.preferredTime}
                            needBreakfast={item.needBreakfast}
                            needLunch={item.needLunch}
                            needDinner={item.needDinner}
                            needNonSmokingRoom={item.needNonSmokingRoom}
                            />
                    )
                }
      
      
                  })
                 }
                  </div>
                  
                  </div>
                

                </>  
                   
               
                 
                );
              })}
            </div>
          </div>

         
        </div>
      </div>

      <Modal 
        isOpen={modalOpen} 
        onClose={modalOpen} 
        content={<div className='w-full h-auto'> 
          <div>
              <div className='flex gap-2 justify-between items-center bg-indigo-100 w-full p-4'>
                <p className='font-inter text-base font-semibold text-indigo-600'>Raise an Expense</p>              
                <div onClick={()=>{setModalOpen(!modalOpen);setTripId(null);setExpenseType(null)}} className='bg-red-100 cursor-pointer rounded-full border border-white-100'>
                <img src={cancel} className='w-5 h-5'/>
                </div>
              </div>
<div className='p-4'>
<div className='flex md:flex-row flex-col justify-between gap-2'>
 <div onClick={()=>setExpenseType("travel_Cash-Advance")} className={`min-w-fit cursor-pointer transition  duration-200 hover:bg-indigo-100 hover:rounded-md flex-1 flex gap-2 items-center justify-center ${expenseType === "travel_Cash-Advance" ? ' border-b-2 border-indigo-600 text-indigo-600' : 'border-b-2 border-white-100 '}  p-4`}>
    <img src={receipt} className='w-5 h-5'/>
    <p className='truncate '>Travel Expense</p> 
 </div> 
           
  <div onClick={()=>setExpenseType("non-Travel_Cash-Advance")} className={`min-w-fit cursor-pointer transition  duration-200 hover:bg-indigo-100 hover:rounded-md flex-1  flex items-center justify-center gap-2 p-4 ${expenseType === "non-Travel_Cash-Advance" ? 'border-b-2 border-indigo-600 text-indigo-600': "border-b-2 border-white-100"}  `}>
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
    </div>}
    </>
  );
};

export default Booking;

const TripRecoverCard = ()=>{
  const [filteredCurrencyOptions, setFilteredCurrencyOptions] = useState(currenciesList.map(item=>({currency:item, value:1})))

  return(
    <div>
      <CurrencyInput
      currencyOptions={currenciesList.map(cr=>({...cr, imageUrl:`https://hatscripts.github.io/circle-flags/flags/${cr.countryCode.toLowerCase()}.svg`}))} 
      />

     
    </div>
  )
}