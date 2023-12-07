import React, { useState, useEffect } from 'react';
import { tripRecovery } from '../utils/tripApi';
import { airplane_1, calender, train, bus, arrow_left } from '../assets/icon';
import { titleCase, getStatusClass } from '../utils/handyFunctions';
import TravelRequestData from '../utils/travelrequest';
import Modal from '../components/Modal';
import NotifyModal from '../components/NotifyModal';
import ItineneryDetails from '../recoveryItinerary/ItineraryDetails';
import CabDetails from '../recoveryItinerary/CabDetails';
import HotelDetails from '../recoveryItinerary/HotelDetails';
import {tripFetchApi} from '../utils/tripApi';



const TravelRecovery = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmationOverlay, setShowConfirmationOverlay] = useState(false);
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(false);


  const routeData={
    tenantId: TravelRequestData.tenantId,
    tripId: TravelRequestData.travelRequestId,
    empId: TravelRequestData.createdFor.empId
   }

   console.log(routeData)


  //fetching data from apis 
  
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await tripFetchApi(routeData.tripId, routeData.tenantId, routeData.empId);
      setTripData(data);
    } catch (error) {
      console.error('Error fetching trip data:', error.message);
    } finally {
      setLoading(false);
    }
  };


  
  useEffect(() => {
    fetchData();
  }, []); 

  //-----------------------------



 ///for handle confirmation message

  const handleOpenOverlay = () => {
    setShowConfirmationOverlay(true);


    setTimeout(()=>{
      setShowConfirmationOverlay(false);
    },5000);
  };

 


  // Open modal
  const handleOpenModal = (travelRequestId) => {
    travelRequestId
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  // Cancel action
  const handleCancel = () => {
    // Handle the cancellation logic
    console.log('Cancelled');
  };

  const preferences = TravelRequestData.preferences || [];
  const extractItineraryData = (itinerary) => {
    return itinerary.map((item) => (
      {
      from: item.journey.from,
      to: item.journey.to,
      departure: {
        itineraryId: item.journey.departure.itineraryId,
        date: item.journey.departure.date,
        time: item.journey.departure.time,
        status: item.journey.departure.status,
      },
      return: {
        itineraryId: item.journey.return.itineraryId,
        date: item.journey.return.date,
        time: item.journey.return.time,
        status: item.journey.return.status,
      },
      modeOfTransit: item.modeOfTransit,
      travelClass: item.travelClass,
      boardingTransfer: {
        itineraryId: item.boardingTransfer.itineraryId,
        prefferedTime: item.boardingTransfer.prefferedTime,
        pickupAddress: item.boardingTransfer.pickupAddress,
        dropAddress: item.boardingTransfer.dropAddress,
        status: item.boardingTransfer.status,
      },
      hotelTransfer: {
        itineraryId: item.hotelTransfer.itineraryId,
        prefferedTime: item.hotelTransfer.prefferedTime,
        pickupAddress: item.hotelTransfer.pickupAddress,
        dropAddress: item.hotelTransfer.dropAddress,
        status: item.hotelTransfer.status,
      },
      preferences:preferences
      
    }));
  };

  const getFilteredItinerary = (modeOfTransit) => {
    return TravelRequestData.itinerary.filter((item) => item.modeOfTransit === modeOfTransit);
  };

  const busItinerary = getFilteredItinerary('Bus');
  const extractedBusItinerary = extractItineraryData(busItinerary);

  const trainItinerary = getFilteredItinerary('Train');
  const extractedTrainItinerary = extractItineraryData(trainItinerary);

  const flightItinerary = getFilteredItinerary('Airplane');
  const extractedFlightItinerary = extractItineraryData(flightItinerary);

  // Function to extract hotels from the itinerary
  const extractHotels = (journey) => journey.hotels || [];

  // Function to extract cabs from the itinerary
  const extractCabs = (journey) => journey.cabs || [];

  // Create arrays for hotels and cabs by mapping over the itinerary
  // const allHotels = TravelRequestData.itinerary.flatMap(extractHotels);
  // const allCabs = TravelRequestData.itinerary.flatMap(extractCabs);

  // Itinerary tabs
  const itinerary = ['flight', 'hotel', 'cab Rental', 'bus', 'train'];

  const [activeTab, setActiveTab] = useState(itinerary[0]?.toLowerCase() || '');

  // Toggle active tab
  const handleTabToggle = (tab) => {
    setActiveTab(tab.toLowerCase());
  };


  // Action button text
  const actionBtnText = 'Recover';

  // Render the corresponding screen based on the selected tab
  const renderScreen = () => {
    switch (activeTab) {
      case 'flight':
        return <ItineneryDetails airplane={extractedFlightItinerary} icon={airplane_1} preferences={preferences}  actionBtnText={actionBtnText} routeData={routeData} handleOpenOverlay={handleOpenOverlay}/>;
      case 'hotel':
        return <HotelDetails allHotel={extractHotels} travelRequest={TravelRequestData} actionBtnText={actionBtnText} routeData={routeData} handleOpenOverlay={handleOpenOverlay}/>;
      case 'cab rental':
        return <CabDetails allCabs={extractCabs} travelRequest={TravelRequestData} actionBtnText={actionBtnText} routeData={routeData} handleOpenOverlay={handleOpenOverlay}/>;
      case 'bus':
        return <ItineneryDetails airplane={extractedBusItinerary} icon={bus} preferences={preferences}  actionBtnText={actionBtnText} routeData={routeData} handleOpenOverlay={handleOpenOverlay}/>;
      case 'train':
        return <ItineneryDetails airplane={extractedTrainItinerary} icon={train} preferences={preferences}  actionBtnText={actionBtnText} routeData={routeData} handleOpenOverlay={handleOpenOverlay}/>;
      default:
        return <ItineneryDetails />;
    }
  };




  return (
    <>
      {/* Header */}
      {loading ? fetchData : "Loading....."}
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
            <div className='flex justify-center items-center'>{TravelRequestData.travelRequestId}</div>
          </div>
        </div>

        {/* Cancel Trip Button */}
        {TravelRequestData.tripStatus==='paid and cancelled' && (
          <div className="flex h-[65px] px-2 py-3 items-center justify-center w-auto">
            <div onClick={(handleOpenModal)} className='flex items-center px-3 pt-[6px] pb-2 py-3 rounded-[12px] cursor-pointer hover:text-red-800 text-medium bg-slate-100 font-medium tracking-[0.03em] text-gray-800'>
              {titleCase('recover')}
            </div>
            {/* Modal for Cancel Confirmation */}
            <Modal 
            handleOperation={tripRecovery} 
            isOpen={isModalOpen} 
            onClose={handleCloseModal} 
            // itineraryId={TravelRequestData.travelRequestId}
            content="Are you sure! you want to cancel the Trip?" 
            routeData={routeData}
            onCancel={handleCancel} 
            handleOpenOverlay={handleOpenOverlay}/>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className='w-full min-h-screen p-[30px]'>
        <div className='border text-gray-600 h-auto min-h-screen mt-[65px]'>
          <div className='main info'>
            <div className='flex-col px-4 my-4'>
              {/* Trip Details */}
              <div className="flex h-auto max-w-[300px] items-center justify-start w-auto px-2">
                <div className="text-[20px] font-medium tracking-[0.03em] leading-normal text-gray-800 font-cabin truncate ">
                  Trip for American Investor for Upcoming Entrepreneurship Journey
                </div>
              </div>
              {/* Trip Duration */}
              <div className="flex h-auto w-auto max-w-fit items-center justify-start gap-2">
                <div className='pl-2'>
                  <img src={calender} alt="calendar" width={16} height={16} />
                </div>
                <div className="tracking-[0.03em] font-normal leading-normal text-slate-600 text-sm">
                  Duration: 24-Apr-2023 to 29-May-2025
                </div>
              </div>
            </div>

            {/* Itinerary Tabs */}
            <div className='w-auto h-auto mx-[15px]'>
              <div className='flex gap-4 h-auto w-auto items-center '>
                {itinerary.map((item, index) => (
                  <React.Fragment key={index}>
                    <button
                      className={`h-auto min-h-[56px] flex items-center justify-center max-w-[140px] w-auto gap-2 border-b-none ${
                        activeTab === item.toLowerCase() ? 'border-purple-500 border-b-2' : ''
                      }`}
                      onClick={() => handleTabToggle(item)}
                    >
                      <div className='pl-2 text-center'>
                        <img src={airplane_1} alt='calendar' width={16} height={16} />
                      </div>
                      <div className={`inline-block tracking-[0.03em] font-bold leading-normal text-sm ${activeTab === item.toLowerCase() ? 'text-purple-500' : ' text-gray-700'}`}>
                        {titleCase(item)}
                      </div>
                    </button>
                  </React.Fragment>
                ))}
              </div>
              <div className='w-auto h-auto'>{renderScreen()}</div>
            </div>
          </div>
        </div>
      </div>
      {showConfirmationOverlay && (
        <NotifyModal/>
      )}
    </>
  );
};

export default TravelRecovery;

