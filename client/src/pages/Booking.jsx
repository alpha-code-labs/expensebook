import React, { useEffect, useState } from 'react';
import { filter_icon, cancel, search_icon, info_icon, airplane_icon1, plus_icon, violation_icon, violation_red_icon, trip_white_icon } from '../assets/icon';
import { checkUpcomingTrip, filterByTimeRange,  sortTripsByDate, sortTripsForBooking, } from '../utils/handyFunctions';
import {dummyTravelReqForBooking, dummyPaidAndCancelledTrips} from '../utils/dummyData';
import { CabCard, FlightCard, HotelCard, RentalCabCard } from '../components/itinerary/BookingItineraryCard';
import Modal from '../components/common/Modal1';
import { useParams } from 'react-router-dom';
import { useData } from '../api/DataProvider';
import Button1 from '../components/common/Button1';
import Error from '../components/common/Error';
import Input from '../components/common/SearchInput';
import { CardLayout, StatusFilter, TripName, BoxTitleLayout } from '../components/common/TinyComponent';
import TravelMS from '../microservice/TravelMS';
import CurrencyInput from '../components/common/currency/CurrencyInput';
import { currenciesList } from '../utils/data/currencyList';
import Button from '../components/common/Button';
import { travelAdminRecoverTripApi } from '../utils/api';
import PopupMessage from '../components/common/PopupMessage';
import { motion } from 'framer-motion';



const Booking = ({searchQuery,isLoading, fetchData, loadingErrMsg}) => {

const travelBaseUrl  = import.meta.env.VITE_TRAVEL_PAGE_URL;
const cashBaseUrl = import.meta.env.VITE_CASHADVANCE_PAGE_URL;
const tripBaseUrl = import.meta.env.VITE_TRIP_BASE_URL;

  const [tripId , setTripId]=useState(null);
  const [expenseType , setExpenseType]=useState(null);
  const [textVisible,setTextVisible]=useState({tripId:false}); 
  const [modalOpen , setModalOpen]=useState(false);
  const [tripData, setTripData]=useState({tripsForBooking:[],tripsForRecover:[]});
  const [recoverAmtDetails , setRecoverAmtDetails]=useState({amount:null, currency:null})

  const [isUploading,setIsUploading]=useState(false);
  // const [showPopup, setShowPopup] = useState(false)
  // const [message, setMessage] = useState(null)
  const {tenantId,empId,page}= useParams();
  const { employeeData, setPopupMsgData, initialPopupData, setMicroserviceModal } = useData();
  const [error , setError]= useState({
    tripId: {set:false, message:""}
  }); 
  // const [searchQuery , setSearchQuery] = useState('');
  const [actionType, setActionType]= useState(null)
  
///----------------------start---------------
const [selectedDateRange, setSelectedDateRange] = useState("");

const handleTabClick = (range) => {
  setSelectedDateRange(selectedDateRange === range ? "" : range);
};






function dataFilterByDate(data) {
  let filteredData = data;

  if (selectedDateRange) {
      filteredData = filterByTimeRange(filteredData, selectedDateRange);
  }

  if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredData = filteredData.filter(trip => JSON.stringify(trip).toLowerCase().includes(query));
  }

  return filteredData;
}


const closeModal=()=>{
  setModalOpen(!modalOpen);

}
const openModal = (action,data) => {
  setRecoverAmtDetails(prev =>({...prev, itineraryIds:data?.itineraryArray , tripId:data?.tripId}))
  setActionType(action);
  setModalOpen(true);
};

const handleConfirm = async (action) => {
  console.log('action from confirm ', action); 
  const {tripId, itineraryIds, amount, currency} = recoverAmtDetails


  let api;

  if (action === 'recoverTrip') {
    api = travelAdminRecoverTripApi({ tenantId, empId,tripId,itineraryIds,recoverAmount:{amount,currency}});
  }
  

  let validConfirm = true;


  if (validConfirm) {
    try {
      setIsUploading(true);
      const response = await api;
      console.log('responsemessage', response);
      setIsUploading(false);
      // setShowPopup(true);
      // setMessage(response);
      setPopupMsgData(prev => ({...prev, showPopup:true, message:response, iconCode:"101"}));
      setTimeout(() => {
        setPopupMsgData(initialPopupData)
        setIsUploading(false);
        window.location.reload()
      }, 3000);
    } catch (error) {
      // setShowPopup(true);
      // setMessage(error.message);
      setPopupMsgData(prev => ({...prev, showPopup:true, message:error.message, iconCode:"102"}))
      setTimeout(() => {
        setIsUploading(false);
        setPopupMsgData(initialPopupData);
      }, 3000);
    }

    
  }
};


  

  
  useEffect(()=>{

    fetchData(tenantId,empId,page)

  },[])
  




  useEffect(()=>{
    if (employeeData) {
    const data = employeeData?.dashboardViews?.businessAdmin || [];

    const travelRequests = data?.pendingBooking || [];
    const paidAndCancelledTrips = data?.paidAndCancelledTrips || []
    //const travelRequests = [ ...dummyTravelReqForBooking];
    //const paidAndCancelledTrips = [...dummyPaidAndCancelledTrips] || []

    sortTripsForBooking(travelRequests)
    sortTripsForBooking(paidAndCancelledTrips)
    
    setTripData((prev)=>({...prev, tripsForBooking:travelRequests || [], tripsForRecover:paidAndCancelledTrips || []}))}
    else{
      console.error('Employee data is missing.');
    }
  },[employeeData])

  
  
  const getStatusCount = (status,tripData) => {
    const tripsForRecover = tripData?.tripsForRecover || []
    const tripsForBooking =tripData?.tripsForBooking  || []
    
    if(status === "paid and cancelled"){
      const count = tripsForRecover?.filter((trip) => trip?.travelRequestStatus === status).length;
      return count;
    }else{
      return filterByTimeRange(tripsForBooking, status).length;
    }
    
  };
  const [visible, setVisible]=useState(false); 
  const [iframeURL, setIframeURL] = useState(null); 

  const handleVisible = (data) => {
    const { urlName, tripId, travelRequestId, isCashAdvanceTaken } = data;
    setVisible(!visible);
  
    let url = '';
  
    if (urlName === 'bookingTravel') {
      if(isCashAdvanceTaken){
        url = `${cashBaseUrl}/bookings/travel/${travelRequestId}`

      }else{
        url = `${travelBaseUrl}/bookings/${travelRequestId}`;
      }
      
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
          fetchData()
          // window.location.href = window.location.href;
        }
        if(event.data.ocrMsgData)
          {
            const ocrPopupData = event.data.ocrMsgData;
            setMicroserviceModal(ocrPopupData);
            console.log(ocrPopupData)
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
  
  console.log('trips and travel from travel screen', tripData)
  
  


  

  const disableButton = (status) => {
    return [ 'cancelled'].includes(status);
  };

  const handleSelect=(option)=>{
    console.log(option)
    setTripId(option?.tripId)
  }

 

  function itineraryArray(itinerary) {
  const sortedItnArray = Object.entries(itinerary).flatMap(([category, items]) =>
    items.map(item => ({ ...item, category }))
  ).sort((a,b)=> a.sequence - b.sequence)

  console.log('sorted itn', sortedItnArray)
  return sortedItnArray
  }

  const getTitle = () => {
    switch (actionType) {
      case 'recoverTrip':
        return 'Recover Trip';
      default:
        return '';
    }
  };

  const getContent = () => {
    switch (actionType) {
      case 'recoverTrip':
        return (
          <>
          <p className="text-md px-4 text-start font-cabin text-neutral-600">
  {actionType === "recoverTrip"
    && 'Once you recover this trip, the cancelled trip amount will be settled.'
    }
</p>

         
         
                                <div className="flex items-center gap-2 mt-10">
                                <Button1 loading={isUploading} active={isUploading} text='Confirm' onClick={()=>handleConfirm(actionType)} />
                                <Button   text='Cancel'  onClick={closeModal}/>
                                </div>
                    </>
        );
     
      default:
        return '';
    }
  };

  const [showItinerary, setShowItinerary] = useState(false);

  const toggleItineraryVisibility = (index) => {
    if (showItinerary===index){
      setShowItinerary("")
    }else{
      setShowItinerary(index)
    }
    // setShowItinerary(!showItinerary);
  };

  useEffect(() => {
    const handleMessage = event => {
      console.log(event.data)
      // Check if the message is coming from the iframe
      if (event.origin === travelBaseUrl || event.origin === cashBaseUrl) {
        console.log('event data from booking', event)
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
        }
        if(event.data.ocrMsgData)
          {
            const ocrPopupData = event.data.ocrMsgData;
            setMicroserviceModal(ocrPopupData);
            console.log(ocrPopupData)
            // if(ocrPopupData?.autoSkip === undefined)
            // {
            //   setTimeout(() => {
            //     setMicroserviceModal(initialPopupData); 
            //   }, 5000);
            // }
          } 
         // Check the message content or identifier
         if (event.data === 'closeIframe') {
          setVisible(false)
          // window.location.href = window.location.href;
          fetchData()
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


  
  return (
    <>
    {isLoading ? <Error message={loadingErrMsg}/>:
    <>
    <TravelMS visible={visible} setVisible={setVisible} src={iframeURL}/>
    <div className='h-screen  flex flex-col p-4'>


<div className=' shrink-0 flex-col border border-slate-300 bg-white rounded-md  w-full flex  items-start gap-2 px-2 py-2'>

<StatusFilter
statuses={["48 Hours", "7 Days", "Within 30 Days", "Beyond 30 Days", "paid and cancelled"]}
tripData={tripData}
selectedStatuses={selectedDateRange}
handleStatusClick={handleTabClick}
filter_icon={filter_icon}
// getStatusClass={getStatusClass}
getStatusCount={getStatusCount}
setSelectedStatuses={setSelectedDateRange}
/>







 
</div>


       

<div className='w-full flex flex-col flex-grow  overflow-auto scrollbar-hide  mt-2'>
          
         
<BoxTitleLayout title="Trips" icon={trip_white_icon}/>
            <div className='w-full h-full mt-2  overflow-y-auto px-2 bg-white rounded-l-md'>
              {selectedDateRange === "paid and cancelled" ? 
                <div>
                
               {tripData?.tripsForRecover.map((trip,index)=>(
                <>
                 <TripRecoverCard itineraryArray={trip?.itinerary ?? []} tripId={trip?.tripId} setRecoverAmtDetails={setRecoverAmtDetails} recoverAmtDetails={recoverAmtDetails} openModal={openModal} key={index} tripName={trip?.tripName} createdBy={trip?.createdBy}/>
                </>
               ))}
                
                </div> : dataFilterByDate((tripData?.tripsForBooking))?.map((trip, index) => {

                // if (trip?.travelRequestStatus === "paid and cancelled"){
                //   return "hello"
                // }
                return (
                <>
    <CardLayout index={index}>
      <div className='flex flex-col justify-between w-full py-2'>
      <div onClick={(()=>toggleItineraryVisibility(index))} className='flex  flex-col sm:gap-0 gap-2 sm:flex-row w-full justify-between items-start sm:items-center'>
        <div className='flex flex-col w-full gap-2 items-start'>
          <div>
            <p className='header-title'>Created By</p>
            <p className='header-text'>{trip?.createdBy?.name ?? <span className='text-center'>-</span>}</p>
          </div>
          <div className='font-cabin text-xs text-neutral-700'>
            <TripName tripName={trip?.tripName}/>
          </div>
        </div>
        <div className='flex w-full sm:justify-end justify-between gap-2 items-center '>
        {(trip?.isAddALeg || checkUpcomingTrip(trip?.tripStartDate)) && (
  <div className='text-red-600 border-red-600 font-medium font-inter text-xs text-center border px-1 py-1 rounded-sm gap-1 flex items-center justify-center'>
    <img className='w-4 h-4' src={violation_red_icon} alt="Urgent icon" />
    {trip?.isAddALeg ? "Urgent: On-going trip. Please prioritize booking." : checkUpcomingTrip(trip?.tripStartDate)}
  </div>
)}

          <div className='flex items-center justify-center space-x-2'>

            <div className='w-fit bg-slate-100 px-2 py-1 flex gap-1 rounded-md border border-slate-300'>Grade
              <p className=''>{trip?.grade}</p>
            </div>
          </div>

          <Button1 
            onClick={() => handleVisible({travelRequestId: trip?.travelRequestId, isCashAdvanceTaken:trip?.isCashAdvanceTaken, urlName: "bookingTravel"})} 
            text={
              <div className='flex justify-center items-center space-x-2 -translate-x-1 whitespace-nowrap'>
                <img src={plus_icon} className='w-5 h-5'/>
                <p className='text-white'>Book Trip</p>
              </div>
            }
          />
        </div>
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: showItinerary === index ? 'auto' : 1, opacity: showItinerary ? 1 : 1 }}
        transition={{ duration: 0.3 }}
        className='w-full overflow-hidden'
      >
        {showItinerary === index && (
          <div className='flex flex-col gap-1'>
            {itineraryArray(trip?.itinerary).map((item, index) => {
              if (item?.category === "flights") {
                return (
                  <FlightCard
                    status={item.status}
                    key={index+1}
                    id={item.id}
                    from={item.from}
                    to={item.to}
                    date={item.date}
                    returnDate={item.returnDate}
                    returnTime={item.returnTime}
                    travelClass={item.travelClass}
                    mode={'Flight'}
                    time={item.time}
                  />
                );
              }
              if (item?.category === "trains") {
                return (
                  <FlightCard
                    status={item.status}
                    key={index+1}
                    id={item.id}
                    from={item.from}
                    to={item.to}
                    date={item.date}
                    returnDate={item.returnDate}
                    returnTime={item.returnTime}
                    travelClass={item.travelClass}
                    mode={'Train'}
                    time={item.time}
                  />
                );
              }
              if (item?.category === "buses") {
                return (
                  <FlightCard
                    status={item.status}
                    key={index+1}
                    id={item.id}
                    from={item.from}
                    to={item.to}
                    date={item.date}
                    returnDate={item.returnDate}
                    returnTime={item.returnTime}
                    travelClass={item.travelClass}
                    mode={'Bus'}
                    time={item.time}
                  />
                );
              }
              if (item?.category === "cabs") {
                return (
                  <CabCard
                    status={item.status}
                    key={index+1}
                    id={item.id}
                    from={item.pickupAddress}
                    to={item.dropAddress}
                    date={item.date}
                    returnDate={item.returnDate}
                    isFullDayCab={item.isFullDayCab}
                    travelClass={item.class}
                    mode={'Cab'}
                    time={item.time}
                  />
                );
              }
              if (item.category === 'carRentals') {
                return (
                  <RentalCabCard
                    status={item.status}
                    key={index+1}
                    id={item.id}
                    from={item.pickupAddress}
                    to={item.dropAddress}
                    date={item.date}
                    returnDate={item.returnDate}
                    travelClass={item.class}
                    mode={'Cab'}
                    time={item.time}
                  />
                );
              }
              if (item.category === 'hotels') {
                return (
                  <HotelCard
                    status={item.status}
                    key={index+1}
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
                );
              }
            })}
          </div>
        )}
      </motion.div>
    </div>
    </CardLayout>
                

                </>  
                   
               
                 
                );
              })}
            </div>
         

         
        </div>


      


<Modal 
        isOpen={modalOpen} 
        onClose={()=>closeModal}
        content={
          <div className='w-full h-auto'>
          <div className='flex gap-2 justify-between items-center bg-indigo-100 w-auto p-4'>
            <div className='flex gap-2'>
              <img src={info_icon} className='w-5 h-5' alt="Info icon"/>
              <p className='font-inter text-base font-semibold text-indigo-600'>
                {getTitle()}
              </p>
            </div>
            <div onClick={() => setModalOpen(false)} className='bg-red-100 cursor-pointer rounded-full border border-white'>
              <img src={cancel} className='w-5 h-5' alt="Cancel icon"/>
            </div>
          </div>

          <div className="p-4">
            {getContent()}
            
          </div>
        </div>}
      />  
    </div>
    {/* <PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} message={message}/> */}
    </>}
    </>
  );
};

export default Booking;



const TripRecoverCard = ({itineraryArray, tripId,tripName, createdBy, openModal,setRecoverAmtDetails,recoverAmtDetails})=>{
  //const [filteredCurrencyOptions, setFilteredCurrencyOptions] = useState(currenciesList.map(item=>({currency:item, value:1})))
  
 
  const handleCurrencyChange = (value)=>{
    setRecoverAmtDetails(prev =>({...prev,currency:value}))
  }
  const handleAmountChange = (value)=>{
    setRecoverAmtDetails(prev=>({...prev,amount:value}))
  }

  return(
    <CardLayout>
      <div className='flex flex-col md:flex-row gap-2 w-full justify-between items-start md:items-center'>
       <div className='flex flex-col gap-x-2 items-start'>
             <div>
                <p className='header-title'>Cancelled By</p>
                <p className='header-text'>{createdBy?.name ?? <span className='text-center'>-</span>}</p>
             </div>
       <div className='font-cabin text-xs text-neutral-700'>
          
          <TripName tripName={tripName}/>
         
          
      </div>
      </div>
      <div className='flex flex-row justify-between items-center gap-4'>
      
      <CurrencyInput
      currencyOptions={currenciesList.map(cr=>({...cr, imageUrl:`https://hatscripts.github.io/circle-flags/flags/${cr.countryCode.toLowerCase()}.svg`}))} 
      currency={recoverAmtDetails.currency}
       onAmountChange={handleAmountChange} 
       onCurrencyChange={handleCurrencyChange} 
      />

      <Button1 text={'Recover'} onClick={()=>openModal("recoverTrip",{itineraryArray,tripId})}/>
      </div>
      </div>
    </CardLayout>
  )
}