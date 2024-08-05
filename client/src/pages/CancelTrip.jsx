import React from 'react'

const CancelTrip = () => {
  return (
    <div>
      cancel trip
    </div>
  )
}

export default CancelTrip


// import React, { useState, useEffect } from 'react';
// import { getTripDataApi, tripCancellationApi, tripItineraryCancellationApi } from '../utils/tripApi';
// import { airplane_1, calender, train, bus, left_arrow_icon } from '../assets/icon';
// import { titleCase, getStatusClass, formatDate } from '../utils/handyFunctions';
// import TravelRequestData from '../utils/travelrequest';
// import Modal from '../components/Modal';
// import ItineneryDetails from '../itinerary/ItineraryDetails';
// import CabDetails from '../itinerary/CabDetails';
// import HotelDetails from '../itinerary/HotelDetails';
// import Error from '../components/Error';
// import Button from '../components/common/Button.jsx';
// import PopupMessage from '../components/PopupMessage';
// import { useParams } from 'react-router-dom';
// import { transformTripData } from '../utils/transformer';
// import dummyForRecovery from '../dummyData/dummyForRecovery.js';

// const CancelTrip = () => {
  
//   const {tenantId,empId,tripId}=useParams();


//   const [data,setData]=useState(null)
//   const [selectedItineraryIds, setSelectedItineraryIds] = useState([]);
//   const [isLoading,setIsLoading]=useState(false)
//   const [loadingErrorMsg, setLoadingErrorMsg]=useState(false)
//   const [showPopup ,setShowPopup]=useState(false);
//   const [message , setMessage]=useState(null);
  
//   const [action,setAction] = useState(null)

//   const [showModal , setShowModal]=useState(false)
//   const handleModalVisible=()=>{
//     setShowModal(!showModal)
//   }



//   const handleSelect = (itineraryId) => {
//     setSelectedItineraryIds((prevIds) => {
//       const isAlreadySelected = prevIds.includes(itineraryId);
  
//       if (isAlreadySelected) {
//         // If the itinerary is already selected, remove it from the array
//         return prevIds.filter((id) => id !== itineraryId);
//       } else {
//         // If the itinerary is not selected, add it to the array
//         return [...prevIds, itineraryId];
//       }
//     });
//   };




//   // console.log(tripStatus)
//   // console.log(itineraryArray , busesItinerary  )
  
  


 


//  //use for get data ok


//         useEffect(() => {
//         const fetchData = async () => {
//           try {
            
//             const response = await getTripDataApi(tenantId, empId, tripId);
//              const responseData=response?.data?.trip || {}
                
//               setData(responseData)
//             setIsLoading(false);
//             console.log('trip data for cancelletion fetched.');
//           } catch (error) {
//             console.log('Error during fetching trip data:', error.message);
//             setLoadingErrorMsg(error.message);
//             setTimeout(() => {setLoadingErrorMsg(null);setIsLoading(false)},5000);
//           }
//         };
    
//         fetchData(); 
    
//       }, [tenantId, empId , tripId]);
//       console.log('tripData',data)


//       const transformedTrip = data &&  transformTripData(data)
//       console.log('transformTrip data', transformedTrip)

//        const transformedTripData = ( data && transformTripData (transformedTrip))
//       // const transformedTripData = ( transformTripData (dummyForRecovery))
//       // const itineraryArray = transformedTripData?.itineraryArray || []
//       // const cabsItinerary=  transformedTripData?.travelRequestData?.itinerary?.cabs
//       // const hotelsItinerary= transformedTripData?.travelRequestData?.itinerary?.hotels
//       // const busesItinerary= transformedTripData?.travelRequestData?.itinerary?.buses
//       // const flightsItinerary= transformedTripData?.travelRequestData?.itinerary?.flights
//       // const trainsItinerary=  transformedTripData?.travelRequestData?.itinerary?.trains
//       // const tripPurpose =  transformedTripData?.travelRequestData?.tripPurpose

//       const itineraryArray =data && transformedTripData?.itineraryArray || []
//       const cabsItinerary= data && transformedTripData?.travelRequestData?.itinerary?.cabs
//       const hotelsItinerary=data && transformedTripData?.travelRequestData?.itinerary?.hotels
//       const busesItinerary= data &&transformedTripData?.travelRequestData?.itinerary?.buses
//       const flightsItinerary=data && transformedTripData?.travelRequestData?.itinerary?.flights
//       const trainsItinerary= data && transformedTripData?.travelRequestData?.itinerary?.trains
//       const tripPurpose = data && transformedTripData?.travelRequestData?.tripPurpose
    
//       const tripStatus= transformedTripData?.tripStatus 
//       const tripNumber= transformedTripData?.tripNumber
      
//       const tripDates= {
//         startDate: transformedTripData?.tripStartDate,
//         completeDate: transformedTripData?.tripCompletionDate
//       }

      
 


  


//   // Action button text
//   const actionBtnText = 'Cancel';

  
//   const itineraryScreen=(itinerary)=>{
//     if (itinerary==="flights" ){
//       return <ItineneryDetails selectedItineraryIds={selectedItineraryIds} handleSelect={handleSelect} mode={flightsItinerary} icon={bus}  
   
//       />;
//     }else if (itinerary==="buses"){
//       return <ItineneryDetails selectedItineraryIds={selectedItineraryIds} handleSelect={handleSelect} mode={busesItinerary} icon={bus}  
  
//       />;
//     }else if (itinerary==="trains"){
//       return <ItineneryDetails selectedItineraryIds={selectedItineraryIds} handleSelect={handleSelect} mode={trainsItinerary} icon={bus}  
 
//       />;
//     }
//     else if (itinerary==="cabs"){
//       return  <CabDetails selectedItineraryIds={selectedItineraryIds} handleSelect={handleSelect} cabsItinerary={cabsItinerary} 

//       />;
//     }
//     else if (itinerary==="hotels"){
//       return  <HotelDetails selectedItineraryIds={selectedItineraryIds} handleSelect={handleSelect} hotelsItinerary={hotelsItinerary} travelRequest={TravelRequestData} actionBtnText={actionBtnText}
   
//       />;
//     }
//   }

//   const handleConfirm=async()=>{
//     handleModalVisible()
   
//      let api;
//       if(action==='cancel trip'){
//         api=tripCancellationApi(tenantId , empId, tripId)
//       }else if (action==="itinerary"){
//         api=  tripItineraryCancellationApi(tenantId ,empId,tripId,{itineraryIds :selectedItineraryIds})
//       }

// let validConfirm = true


// if(validConfirm){
//   try {
//     setIsLoading(true);
//     // const response = await postTravelPreference_API({ tenantId, empId, formData });
//    const response = await api
//    console.log('successful for action')
//   setMessage(response?.message)
//   setIsLoading(false)
//   setTimeout(() => setMessage(null),8000);
// //   window.location.reload()
  
//   } catch (error) {
//     setLoadingErrorMsg(`Please retry again : ${error.message}`); 
//     setTimeout(() => {setIsLoading(false);setLoadingErrorMsg(null)},2000);
//     console.log('failed for action')
//   }

//   handleModalVisible()
//   setAction(null)
  
// }
     
//     }


    

    

//   return (
    
//     <>
//       {isLoading && <div><Error message={loadingErrorMsg}/></div>} 
//       {/* Header */}
//       {!isLoading && 
//       <div>
//       <div className='justify-between w-full h-[65px] border-b-[1px] border-gray-100 flex flex-row gap-2 fixed bg-cover bg-white px-8 shadow-lg'>
//         {/* Back Button */}
//         <div className='flex flex-row items-center'>
//           <div className="flex h-[65px] px-2 py-3 items-center justify-center w-auto">
//             <div className={`flex items-center px-3 pt-[6px] pb-2 py-3 rounded-[12px] cursor-pointer hover:text-red-800 text-medium bg-slate-100 font-medium tracking-[0.03em] text-gray-800`}>
//               <img src={left_arrow_icon} alt="Back" />
//             </div>
//           </div>
//           {/* Trip ID */}
//           <div className='trip-id text-gray-800 font-cabin text-[20px] font-semibold py-3 px-2 items-center justify-center'>
//             <div className='flex justify-center items-center'>{tripNumber}</div>
//           </div>
//         </div>

//         {/* Cancel Trip Button */}
//         {["upcoming", "completed"].includes(tripStatus) && selectedItineraryIds.length<=0 && (
//           <div className="flex h-[65px] px-2 py-3 items-center justify-center w-auto">
//             <div onClick={()=>{handleModalVisible();setAction('cancel trip')}} className='flex items-center px-3 pt-[6px] pb-2 py-3 rounded-[12px] cursor-pointer hover:text-red-800 text-medium bg-slate-100 font-medium tracking-[0.03em] text-gray-800'>
//               {titleCase('cancel trip')}
//             </div>
//             {/* Modal for Cancel Confirmation */}
           
//           </div>
//         )}
//       </div>
//       <div className='w-full min-h-screen p-[30px]'>
//       <div className='border text-gray-600 h-auto min-h-screen mt-[65px]'>
//         <div className='main info '>
//           <div className='flex justify-between flex-row px-4 my-4'>
//             {/* Trip Details */}
//             <div>
//             <div className="flex h-auto max-w-[300px] items-center justify-start w-auto px-2">
//               <div className="text-[20px] font-medium tracking-[0.03em] leading-normal text-gray-800 font-cabin truncate ">
//               { titleCase(tripPurpose) }
//               </div>
//             </div>
//             {/* Trip Duration */}
//             <div className="flex h-auto w-auto max-w-fit items-center justify-start gap-2">
//               <div className='pl-2'>
//                 <img src={calender} alt="calendar" width={16} height={16} />
//               </div>
//               <div className="tracking-[0.03em] font-normal leading-normal text-slate-600 text-sm">
//                 {`Duration: ${formatDate(tripDates.startDate)} to ${formatDate(tripDates.completeDate)}`}
//               </div>
//             </div>
//             </div>

//             { selectedItineraryIds && selectedItineraryIds.length>0 &&
//                <div className=''>
//                <Button variant='fit' text="Cancel Itinerary" onClick={()=>{handleModalVisible(),setAction('itinerary')}}/>
//              </div>
//             }
           
//           </div>
          

//           {/* Itinerary Tabs */}

//          {itineraryArray.map((itinerary,index)=>
//          <React.Fragment key={index}>
          
//           <div className='w-auto h-auto mx-[15px]'>
//             {/* <div className='flex gap-4 h-auto w-auto items-center border border-black'> */}
//             <details open>
//        <summary> 
//         <div className={`h-auto inline-flex min-h-[56px]  items-center justify-center max-w-[140px] w-auto gap-2 border-b-none ${
//                       'border-purple-500 border-b-2'
//                     }`}
                    
//                   >
//                     <div className='pl-2 text-center'>
//                       <img src={airplane_1} alt='calendar' width={16} height={16} />
//                     </div>
//                     <div className={`inline-block tracking-[0.03em] font-bold leading-normal text-sm'text-purple-500' : ' text-gray-700'}`}>
//                      {titleCase(itinerary)}
//                     </div>
//                     </div>
//                   </summary>
//                 <div>{ itineraryScreen(itinerary)}</div> 

// </details>

//             {/* </div> */}
//           </div>
// </React.Fragment>)}
          


//         </div>
//         <PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} message={message}/>
//       </div>
      
//     </div>
//     </div>
//      }   
//       <Modal  
//             isOpen={showModal}        
//             handleModalVisible={handleModalVisible} 
//             content={<div>Are you sure for <p className='c capitalize text-indigo-600'>{action}</p> cancellation!.</div>}
//             handleConfirm={handleConfirm}   
//             />
//     </>
//   );}


// export default CancelTrip;




