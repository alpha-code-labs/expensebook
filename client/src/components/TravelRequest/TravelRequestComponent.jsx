import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../common/dateUtils.jsx'; 
import { alertCircle, calendar } from '../../assets/icon.jsx';
import Loading from '../common/Loading.jsx';
import TravelAndCashSearchBar from './TravelAndCashSearchBar.jsx';

const TravelRequestComponent = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [travelRequests, setTravelRequests] = useState([]);
  const [filteredTravelRequests, setFilteredTravelRequests] = useState([]);
  const [isViolationMessageVisible, setViolationMessageVisible] = useState(false);
  const [tripPurpose, setTripPurpose] = useState('');
  const [destination, setDestination] = useState('');
  const [employeeName, setEmployeeName] = useState('');


  useEffect(() => {
    const fetchTravelRequests = async () => {
      try {
        const response = await axios.get("http://localhost:8080/approvals/tr-ca/emp004");
        setTravelRequests(response.data);
      } catch (error) {
        console.error("Error Fetching Travel Requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTravelRequests();
  }, []);


  const determineTripType = (departureCity) => {
    if (departureCity.length === 1) {
      return "oneWayTrip";
    } else if (departureCity.length === 2) {
      return "roundTrip";
    } else {
      return "multiCityTrip";
    }
  };

  const redirectToTRDetails = (travelRequestId) => {
    navigate(`/td/${travelRequestId}`);
  };

 const handleSearch = () => {
  const lowerCaseTripPurpose = tripPurpose.toLowerCase();
  const lowerCaseDestination = destination.toLowerCase();
  const lowerCaseEmployeeName = employeeName.toLowerCase();

  const filteredData = travelRequests.filter((item) => {
    return (
      item.tripPurpose.toLowerCase().includes(lowerCaseTripPurpose) &&
      item.destination.toLowerCase().includes(lowerCaseDestination) &&
      item.employeeName.toLowerCase().includes(lowerCaseEmployeeName)
    );
  });

  setFilteredTravelRequests(filteredData);
};


  return (
    <div>
      <TravelAndCashSearchBar onSearch={handleSearch} tripPurpose={tripPurpose} destination={destination} employeeName={employeeName} />
      <div className="absolute top-[100px] left-[8px] flex flex-col items-start justify-start gap-[4px] text-sm text-ebgrey-600">
      {/* Header of travel request approval */}
      <div className="header">
        <div className="bg-white flex flex-row items-start justify-center gap-[24px]">
          <div className="relative w-[140px] h-14 overflow-hidden shrink-0">
            <div className="absolute top-[calc(50%_-_8px)] left-[27px] font-medium">
              Employee Name
            </div>
          </div>
          <div className="relative w-[140px] h-14 overflow-hidden shrink-0">
            <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_26px)] font-medium">
              Trip Name
            </div>
          </div>
          <div className="relative w-[140px] h-14 overflow-hidden shrink-0">
            <div className="absolute top-[20px] left-[calc(50%_-_32px)] font-medium">
              Destinations
            </div>
          </div>
          <div className="relative w-60 h-14 overflow-hidden shrink-0">
            <div className="absolute top-[20px] left-[calc(50%_-_32px)] font-medium">
              Dates
            </div>
          </div>
          {/* <div className="relative w-60 h-14 overflow-hidden shrink-0">
            <div className="absolute top-[20px] left-[calc(50%_-_25px)] font-medium">
              View
            </div>
          </div> */}
        </div>
      </div>
  
  {/* Travel Requests and cash advance approvals related code */}
  {isLoading ? (
          <Loading />
        ) : (
          <div className="bg-white  hug flex flex-col items-center justify-start text-darkslategray-300 " style={{ maxHeight: "300px", overflowY: "auto" }}>
            {travelRequests.map((travelRequest, index) => { // Map over travelRequests
              const currentTripType = determineTripType(travelRequest);

            return (
        <div key={index} className="flex flex-col items-start justify-start gap-[px] text-darkslategray-300 border-gray-200 p-4 rounded-md shadow-md scroll">
             {/* Travel request approvals code */}
        <div className='flex px-6 items-center justify-center gap-3 '>
        <div className="relative w-[140px] h-14 overflow-hidden shrink-0">
          <div className="absolute top-[calc(50% - 9px)] left-[calc(50% - 42px)] font-medium">
            {travelRequest.createdBy || '\u00A0'}
          </div>
        </div>

        <div className="relative w-[140px] h-14 whitespace-nowrap  overflow-x-hidden-scroll shrink-0 turncate">
          <div className="absolute top-[calc(50% - 8px)] left-[8.2px] font-medium">
            {travelRequest.tripPurpose || '\u00A0'}
          </div>
        </div>

        <div className="relative w-[140px] h-14 whitespace-nowrap  overflow-hidden shrink-0 text-xs text-dimgray">
          <div className="absolute top-[calc(50% - 8px)] left-[25px] flex flex-row items-end justify-start gap-[2px]">
            {travelRequest.departureCity.length > 0 && (
              <div className="relative">
                {travelRequest.departureCity[0]?.from || '\u00A0'} - {travelRequest.departureCity[0]?.to || '\u00A0'}
              </div>
            )}
            {currentTripType === "multiCityTrip" && (
              travelRequest.departureCity.slice(1).map((city, cityIndex) => (
                <div key={city._id} className="relative">
                  <img src={clarityTwoWayArrowsLine} alt="" />
                  <span>{city.from || '\u00A0'} - {city.to || '\u00A0'}</span>
                </div>
              ))
            )}
            {currentTripType !== "multiCityTrip" && travelRequest.departureCity.length > 1 && (
              <>
                <div className="single-city-destination">
                  <img src={currentTripType === "oneWayTrip" ? clarityOneWayArrowsLine : clarityTwoWayArrowsLine} alt="" />
                  <span>{travelRequest.departureCity[currentTripType === "roundTrip" ? 1 : 0]?.from || '\u00A0'} - {travelRequest.departureCity[currentTripType === "roundTrip" ? 1 : 0]?.to || '\u00A0'}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="relative w-60 h-14 overflow-hidden shrink-0 text-xs text-dimgray">
          {travelRequest.departureCity.length > 0 && (
            <div className="absolute top-[calc(50%-8px)] left-[calc(50%-91px)] flex flex-row items-end justify-start gap-[4px]">
              <img
                className="relative w-4 h-4 overflow-hidden shrink-0"
                alt=""
                src={calendar}
              />
              <div className="flex flex-row items-center justify-start gap-[8px]">
                <div className="relative font-medium">{formatDate(travelRequest.departureCity[0]?.departure?.date) || '\u00A0'}</div>
                <span className="relative">{`to`}</span>
                <div className="relative font-medium">{formatDate(travelRequest.departureCity[0]?.return?.date) || '\u00A0'}</div>
              </div>
            </div>
          )}
        </div>

        <div className="relative w-140 h-14 overflow-hidden shrink-0 text-center text-eb-primary-blue-500">
          <button className="relative font-medium top-[calc(50% - 16px)] left-[calc(50% - 64px)] rounded-29xl box-border w-[129px] h-8 flex flex-row items-center justify-center py-4 px-4 border-[1px] border-solid border-eb-primary-blue-500" onClick={() => redirectToTRDetails(travelRequest.travelRequestId)}>
            View Details
          </button>
        </div>
        </div>
        
        {/* Cash advance Approvals code */}
        
        <div className='flex px-6 items-center justify-center gap-3  '>
        {travelRequest.createdByCashAdvance && (
          <div className="cash-advance">
            {travelRequest.createdByCashAdvance}
          </div>
        )}
        {travelRequest.createdByCashAdvance && (
          <div className="relative w-40 h-14 items-center overflow-hidden shrink-0">
              {travelRequest.tripPurposeCashAdvance || '\u00A0'}
          </div>
        )}

        {travelRequest.createdByCashAdvance && (
          <div className="relative w-60 h-14 overflow-hidden shrink-0 text-xs text-dimgray">
            <div className=" flex flex-row items-center justify-start gap-4">
              <img
                className="relative w-4 h-4 overflow-hidden shrink-0"
                alt=""
                src={calendar}
              />
              <div className="flex flex-row items-center justify-start gap-[8px]">
                <div className="relative font-medium">
                  {travelRequest.itineraryCitiesCashAdvance && travelRequest.itineraryCitiesCashAdvance.length > 0
                    ? formatDate(travelRequest.itineraryCitiesCashAdvance[0]?.departure?.date) || 'Dummy Departure Date'
                    : 'Dummy Departure Date'}
                </div>
                <span className="relative"> {`to `}</span>
                <div className="relative font-medium">
                  {travelRequest.itineraryCitiesCashAdvance && travelRequest.itineraryCitiesCashAdvance.length > 0
                    ? formatDate(travelRequest.itineraryCitiesCashAdvance[0]?.return?.date) || 'Dummy Return Date'
                    : 'Dummy Return Date'}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="relative w-[94px] h-14 overflow-hidden shrink-0 text-eb-primary-blue-500">
      <div className="absolute top-[20px] left-[calc(50%-43px)] flex flex-row items-center justify-start gap-2">
        {travelRequest.cashAdvanceViolations && travelRequest.cashAdvanceViolations.length > 0 ? (
          <>
            <img
              className="relative w-4 h-4 overflow-hidden shrink-0"
              alt=""
              src={alertCircle}
              // Toggle visibility on hover
              onMouseEnter={() => setViolationMessageVisible(true)}
              onMouseLeave={() => setViolationMessageVisible(false)}
            />
            {/* Use responsive classes to control message display */}
            <div className={`text-xs rounded bg-gray-500 text-white absolute left-6 -bottom-8 z-10 ${isViolationMessageVisible ? 'lg:flex-row' : 'sm:hidden md:hidden'}`}>
              {travelRequest.cashAdvanceViolations.map((violation, index) => (
                <div key={index} className="mr-2">{violation}</div>
              ))}
            </div>
          </>
        ) : null}
        <div className="relative font-semibold ">
          {travelRequest.amountDetailsCashAdvance && travelRequest.amountDetailsCashAdvance.length > 0
            ? travelRequest.amountDetailsCashAdvance[0].amount || 'No Cash Advance'
            : 'No Cash Advance'}
        </div>
        </div>
    </div>
        <div className="relative w-197 h-14 overflow-hidden shrink-0 text-center text-white">
          <div className="absolute top-[calc(50% - 17px)] left-[calc(50% - 90px)] flex flex-row items-start justify-start gap-8">
            <button className="cursor-pointer border-green py-4 px-8 bg-darkseagreen rounded-29xl w-86 h-34 flex flex-row items-center justify-center box-border">
              <div className="relative text-sm font-medium font-cabin text-white text-center flex items-center justify-center w-54 h-18 shrink-0">
                Approve
              </div>
            </button>
            <div className="rounded-29xl bg-lightcoral-200 w-86 h-34 flex flex-row items-center justify-center py-4 px-8 box-border">
              <div className="relative font-medium flex items-center justify-center w-54 h-18 shrink-0">
                Deny
              </div>
            </div>
            </div>
        </div>
        </div>
        </div>
            );
           })}
          </div>
        )};
      </div>
    </div> 
);}

export default TravelRequestComponent;