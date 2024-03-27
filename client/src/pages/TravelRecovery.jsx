import React, { useState, useEffect } from 'react';
import {getTripDataApi, tripLineItemsRecoveryApi, tripRecoveryApi } from '../utils/tripApi';
import { airplane_1, calender, train, bus, arrow_left, cab_purple } from '../assets/icon';
import { titleCase, getStatusClass, formatDate } from '../utils/handyFunctions';
import TravelRequestData from '../utils/travelrequest';
import Modal from '../components/Modal';
import Error from '../components/Error';
import ItineneryDetails from '../recoveryItinerary/ItineraryDetails';
import CabDetails from '../recoveryItinerary/CabDetails';
import HotelDetails from '../recoveryItinerary/HotelDetails';
import Button from '../components/Button';
import dummyForRecovery from '../dummyData/dummyForRecovery';
import PopupMessage from '../components/PopupMessage';
import { useParams } from 'react-router-dom';
import { transformTripDataForRecover } from '../utils/transformerForRecovery';

const TravelRecovery = () => {

  const {tenantId,empId,tripId} = useParams()
  const [selectedItineraryIds, setSelectedItineraryIds] = useState([]);
  const [data,setData]=useState(null)
  const [isLoading,setIsLoading]=useState(true)
  const [loadingErrorMsg, setLoadingErrorMsg]=useState(false)
  const [showPopup ,setShowPopup]=useState(false);
  const [message,setMessage]=useState(null)  ///this is for modal message
  const [action,setAction] = useState(null)

  const [showModal , setShowModal]=useState(false)

  const handleModalVisible=()=>{
    setShowModal(!showModal)
  }

  const handleSelect = (itineraryId) => {
    setSelectedItineraryIds((prevIds) => {
      const isAlreadySelected = prevIds.includes(itineraryId);
  
      if (isAlreadySelected) {
        // If the itinerary is already selected, remove it from the array
        return prevIds.filter((id) => id !== itineraryId);
      } else {
        // If the itinerary is not selected, add it to the array
        return [...prevIds, itineraryId];
      }
    });
  };



  

useEffect(() => {
  const fetchData = async () => {
    try {
      
      const response = await getTripDataApi(tenantId, empId, tripId);
       const responseData=response?.data?.trip || {}
        setData(responseData)
        
      setIsLoading(false);
      console.log('travel data for approval fetched.',responseData);
    } catch (error) {
      console.log('Error in fetching travel data for approval:', error.message);
      setLoadingErrorMsg(error.message);
      setTimeout(() => {setLoadingErrorMsg(null);setIsLoading(false)},5000);
    }
  };

  fetchData(); 

}, [tenantId, empId , tripId]);
console.log('data',data)


  // useEffect(()=>{
  //   setData(transformedRecoveryData)
    
  // },[])

 const transformedRecoveryData = data &&  transformTripDataForRecover(data)


  const itineraryArray = data && transformedRecoveryData.itineraryArray  || []
  console.log('arrya', itineraryArray)
  const cabsItinerary= data && transformedRecoveryData.travelRequestData.itinerary.cabs
  const hotelsItinerary= data && transformedRecoveryData.travelRequestData.itinerary.hotels
  const busesItinerary= data && transformedRecoveryData.travelRequestData.itinerary.buses
  const flightsItinerary= data && transformedRecoveryData.travelRequestData.itinerary.flights
  const trainsItinerary= data && transformedRecoveryData.travelRequestData.itinerary.trains
  const tripPurpose= data && transformedRecoveryData?.travelRequestData?.tripPurpose
  const tripStartDate= data && transformedRecoveryData?.tripStartDate
  const tripCompletionDate = data && transformedRecoveryData?.tripCompletionDate
  const tripStatus=data && transformedRecoveryData?.tripStatus
  const tripNumber = data && transformedRecoveryData?.tripNumber



  //  const transformedRecoveryData = transformTripDataForRecover(dummyForRecovery)
  // const itineraryArray = transformedRecoveryData.itineraryArray 
  // const cabsItinerary= transformedRecoveryData.travelRequestData.itinerary.cabs
  // const hotelsItinerary= transformedRecoveryData.travelRequestData.itinerary.hotels
  // const busesItinerary= transformedRecoveryData.travelRequestData.itinerary.buses
  // const flightsItinerary= transformedRecoveryData.travelRequestData.itinerary.flights
  // const trainsItinerary= transformedRecoveryData.travelRequestData.itinerary.trains
  // const tripPurpose= transformedRecoveryData?.travelRequestData?.tripPurpose
  // const tripStartDate= transformedRecoveryData?.tripStartDate
  // const tripCompletionDate = transformedRecoveryData?.tripCompletionDate
  // const tripStatus=transformedRecoveryData?.tripStatus
  // const tripNumber = transformedRecoveryData?.tripNumber

  // const transformedTripData = ( data && transformTripDataForRecover (transformedTrip))
  


  const handleConfirm=async()=>{
   
    let api;
     if(action==='trip recovery'){
       api=tripRecoveryApi(tenantId , empId, tripId)
       console.log('travel api hit')
     }else if (action==="itinerary recovery"){
       api=  tripLineItemsRecoveryApi(tenantId ,empId,tripId,{itineraryIds :selectedItineraryIds})
     }

let validConfirm = true


if(validConfirm){
 try {
   setIsLoading(true);
  const response = await api
  console.log('responsemessage',response)
  // setShowPopup(true)
  setMessage(response?.message)
  setIsLoading(false)
  setTimeout(() => {setMessage(null),setSelectedItineraryIds([])},8000);
  window.location.reload()
 
 } catch (error) {
   setLoadingErrorMsg(`Please retry again : ${error.message}`); 
   setTimeout(() => {setIsLoading(false);setLoadingErrorMsg(null)},2000);
 }

 handleModalVisible()
 setAction(null)
 
}
    
   }


  // Action button text
  const actionBtnText = 'Recover';

  const itineraryScreen=(itinerary)=>{
    if (itinerary==="flights"){
      return <ItineneryDetails tripStatus={tripStatus} selectedItineraryIds={selectedItineraryIds} handleSelect={handleSelect} mode={flightsItinerary} icon={bus}   actionBtnText={actionBtnText} 
      
      />;
    }else if (itinerary==="buses"){
      return <ItineneryDetails tripStatus={tripStatus} selectedItineraryIds={selectedItineraryIds} handleSelect={handleSelect} mode={busesItinerary} icon={bus}   actionBtnText={actionBtnText} 
      
      />;
    }else if (itinerary==="trains"){
      return <ItineneryDetails tripStatus={tripStatus} selectedItineraryIds={selectedItineraryIds} handleSelect={handleSelect} mode={trainsItinerary} icon={bus}   actionBtnText={actionBtnText} 
      
      />;
    }
    else if (itinerary==="cabs"){
      return  <CabDetails tripStatus={tripStatus} selectedItineraryIds={selectedItineraryIds} handleSelect={handleSelect} cabsItinerary={cabsItinerary}  actionBtnText={actionBtnText} 
       
      />;
    }
    else if (itinerary==="hotels"){
      return  <HotelDetails tripStatus={tripStatus} selectedItineraryIds={selectedItineraryIds} handleSelect={handleSelect} hotelsItinerary={hotelsItinerary} travelRequest={TravelRequestData} actionBtnText={actionBtnText} 
      
      />;
    }
  }

  function spitImageSource(modeOfTransit){
    if(modeOfTransit === 'Flights')
        return airplane_1
    else if(modeOfTransit === 'Trains')
        return cab_purple
    else if(modeOfTransit === 'Buses')
        return cab_purple
    else if(modeOfTransit === 'Hotels')
        return cab_purple
    else if(modeOfTransit === 'Cabs')
        return cab_purple
}
    

  return (
    <>
    {isLoading && <Error message={loadingErrorMsg}/>}

{!isLoading && 
    <>
      {/* Header */}
      <div className='justify-between w-full h-[65px] border-b-[1px] border-gray-100 flex flex-row gap-2 fixed bg-cover bg-white-100 px-8 shadow-lg'>
        {/* Back Button */}
        <div className='flex flex-row items-center'>
          <div className="flex h-[65px] px-2 py-3 items-center justify-center w-auto">
            <div className={`flex items-center px-3 pt-[6px] pb-2 py-3 rounded-[12px] cursor-pointer hover:text-red-800 text-medium bg-slate-100 font-medium tracking-[0.03em] text-gray-800`}>
              <img src={arrow_left} alt="Back" />
            </div>
          </div>
          {/* Trip ID */}
          <div className='trip-id text-gray-800 font-cabin text-[20px] font-semibold py-3 px-2 items-center justify-center'>
            <div className='flex justify-center items-center'>{tripNumber}</div>
          </div>
        </div>

        {/* Cancel Trip Button */}
        {tripStatus==="paid and cancelled" && (
          <div className="flex h-[65px] px-2 py-3 items-center justify-center w-auto">
            <div onClick={()=>{handleModalVisible();setAction('trip recovery')}} className='flex items-center px-3 pt-[6px] pb-2 py-3 rounded-[12px] cursor-pointer hover:text-red-800 text-medium bg-slate-100 font-medium tracking-[0.03em] text-gray-800'>
              {titleCase('Recover')}
            </div>
          
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className='w-full min-h-screen p-[30px]'>
        <div className='border text-gray-600 h-auto min-h-screen mt-[65px]'>
          <div className='main info'>
            <div className='flex justify-between flex-row px-4 my-4'>
              <div>
              {/* Trip Details */}
              <div className="flex h-auto max-w-[300px] items-center justify-start w-auto px-2">
                <div className="text-[20px] font-medium tracking-[0.03em] leading-normal text-gray-800 font-cabin truncate ">
                  {titleCase(tripPurpose)}
                </div>
              </div>
              {/* Trip Duration */}
              <div className="flex h-auto w-auto max-w-fit items-center justify-start gap-2">
                <div className='pl-2'>
                  <img src={calender} alt="calendar" width={16} height={16} />
                </div>
                <div className="tracking-[0.03em] font-normal leading-normal text-slate-600 text-sm">
                  Duration: {formatDate(tripStartDate)} to {formatDate(tripCompletionDate)}
                </div>
              </div>
              </div>
     
{ selectedItineraryIds && selectedItineraryIds.length>0 &&
               <div className=''>
               <Button variant='fit' text="Recover Itinerary" onClick={()=>{handleModalVisible(),setAction('itinerary recovery')}}/>
             </div>
            }
            </div>

            {/* Itinerary Tabs */}

           {itineraryArray?.map((itinerary,index)=>
           <React.Fragment key={index}>
            
<div className='w-auto h-auto mx-[15px]'>

 <details open>
 <summary> 
   <div className={`h-auto inline-flex min-h-[56px]  items-center justify-center max-w-[140px] w-auto gap-2 border-b-none ${
                 'border-purple-500 border-b-2'
               }`}
               
             >
               <div className='pl-2 text-center'>
                 <img src={spitImageSource(titleCase(itinerary))} alt='calendar' width={16} height={16} />
               </div>
               <div className={`font-cabin inline-block tracking-[0.03em] font-bold leading-normal text-sm'text-purple-500' : ' text-gray-700'}`}>
               {titleCase(itinerary)}
               </div>
               </div>
             </summary>
           <div>{ itineraryScreen(itinerary ,handleSelect)}</div> 

</details>
   

              {/* </div> */}
</div>
</React.Fragment>)}
            


          </div>
        </div>
        <PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} message={message}/>
      </div>
      
      <Modal 
            isOpen={showModal}        
            handleModalVisible={handleModalVisible} 
            content={<p>Click on Confirm for  <span className="capitalize text-indigo-600">{action}</span> </p>}
            handleConfirm={handleConfirm}   
            />
    </>}
    </>
  );}


export default TravelRecovery;
