import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { formatDate } from './common/dateUtils.jsx';
import { airplay,airplay1,airplay2,airplay3, 
    frame260,map, frame490, frame505,clarityTwoWayArrowsLine,
      bell, calender1, calendar, briefcase } from "../assets/icon.jsx";


//MacBookAir-273
const ViewTrip = () => {
  const navigate = useNavigate();
  const [upcomingTrips,setUpcomingTrips] = useState([]);
  const [transitTrips,setTransitTrips] = useState([]);
  const [allTrips, setAllTrips] = useState([]);

  
  useEffect(() => {
    
    axios.get('http://localhost:8080/dash/upcoming/emp000077')
      .then((response) => {
        setUpcomingTrips(response.data.trips);
      })
      .catch((error) => {
        console.error('Error fetching upcoming trip data:', error);
      });
  }, []);
  

  useEffect(() => {
    
    axios.get('http://localhost:8080/dash/transit/emp000030')
      .then((response) => {
        setTransitTrips(response.data.trips);
      })
      .catch((error) => {
        console.error('Error fetching transit trip data:', error);
      });
  }, []);

  useEffect(() => {
    
    axios.get('http://localhost:8080/dash/all/emp000078')
      .then((response) => {
        setAllTrips(response.data.trips);
      })
      .catch((error) => {
        console.error('Error fetching All trip data:', error);
      });
  }, []);
  
  const onFrameContainer16Click = () => {
    // Use the navigate function to navigate to the desired link
    navigate("/EditTravelRequest");
  };


  const onFrameContainer26Click = () => {
    navigate('/expenseBooking')
    // Please sync "MacBook Air - 275" to the project
  };

  const onFrameContainer27Click = () => {
    navigate('/inTransit')
    // Please sync "MacBook Air - 274" to the project
  };

  const redirectToNewTR =() => {
    navigate('/newTravelRequest')
  }

  const redirectToProfile =() => {
    navigate('/userProfile')
  }

  return (
    <div className="relative bg-white w-full h-[832px] overflow-hidden text-left text-xs text-white font-cabin">
      <div className="absolute top-[0px] left-[0px] bg-gray-100 box-border w-[244px] h-[832px] overflow-hidden text-ebgrey-400 border-[1px] border-solid border-gray-200">
        <div className="absolute top-[101px] left-[0px] flex flex-col items-start justify-start gap-[16px]">
          <div className="relative w-[244px] h-8 overflow-hidden shrink-0">
            <div className="absolute top-[calc(50%_-_8px)] left-[32px] flex flex-row items-center justify-start gap-[8px]">
              <img
                className="relative w-4 h-4 overflow-hidden shrink-0"
                alt=""
                src={airplay}
              />
              <div className="relative">Overview</div>
            </div>
          </div>
          <div className="relative bg-eb-primary-blue-50 w-[244px] h-8 overflow-hidden shrink-0 text-eb-primary-blue-500">
            <div className="absolute top-[calc(50%_-_8px)] left-[32px] flex flex-row items-center justify-start gap-[8px]">
              <img
                className="relative w-4 h-4 overflow-hidden shrink-0"
                alt=""
                src={airplay1}
              />
              <div className="relative font-medium">Travel</div>
            </div>
          </div>
          <div className="relative w-[244px] h-8 overflow-hidden shrink-0">
            <div className="absolute top-[calc(50%_-_8px)] left-[32px] flex flex-row items-center justify-start gap-[8px]">
              <img
                className="relative w-4 h-4 overflow-hidden shrink-0"
                alt=""
                src={airplay2}
              />
              <div className="relative">Cash Advances</div>
            </div>
          </div>
          <div className="relative w-[244px] h-8 overflow-hidden shrink-0">
            <div className="absolute top-[calc(50%_-_8px)] left-[32px] flex flex-row items-center justify-start gap-[8px]">
              <img
                className="relative w-4 h-4 overflow-hidden shrink-0"
                alt=""
                src={airplay3}
              />
              <div className="relative">Expenses</div>
            </div>
          </div>
        </div>
        <img
          className="absolute top-[37px] left-[20px] w-[149px] h-10 overflow-hidden"
          alt=""
          src={frame505}
        />
      </div>
      <div className="absolute top-[126px] left-[332px] flex flex-col items-end justify-start gap-[24px] text-center text-base">
        <div className="rounded-13xl bg-eb-primary-blue-500 h-12 flex flex-row items-center justify-center py-4 px-8 box-border">
          <div className="relative font-medium" onClick={redirectToNewTR}> New Travel Request </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-[24px] text-left text-darkslategray">
          <div className="flex flex-row items-start justify-start gap-[24px]">
            <div className="relative rounded-2xl bg-white box-border w-[402px] h-[273px] overflow-hidden shrink-0 border-[1px] border-solid border-gainsboro">
              <div className="absolute top-[-41px] left-[7px]">In Transit</div>
              {upcomingTrips && upcomingTrips.map((trip, index) => (
            <div key={index} className="absolute top-[61px] left-[1px] bg-white w-[400px] h-[114px] overflow-hidden text-sm">
        <div className="absolute top-[17px] left-[25px] w-[349px] flex flex-row items-start justify-between">
         <div className="flex flex-col items-start justify-start gap-[12px]">
        <div className="relative font-medium">{trip.TripName}</div>
        <div className="flex flex-col items-start justify-start gap-[16px] text-xs text-dimgray">
          <div className="flex flex-row items-end justify-start gap-[8px]">
            <div className="relative">{trip.departureCity}</div>
            <img
              className="relative w-4 h-4 overflow-hidden shrink-0"
              alt=""
              src={clarityTwoWayArrowsLine}
            />
            <div className="relative">{trip.arrivalCity}</div>
          </div>
          <div className="flex flex-row items-end justify-start gap-[4px]">
            <img
              className="relative w-4 h-4 overflow-hidden shrink-0"
              alt=""
              src={calendar}
            />
            <div className="flex flex-row items-start justify-start gap-[8px]">
              <div className="relative font-medium"> {formatDate(trip.TripStartDate)}</div>
              <div className="relative">{`to `}</div>
              <div className="relative font-medium">{formatDate(trip.TripEndDate)}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-13xl box-border w-[87px] h-[33px] flex flex-row items-center justify-center py-4 px-8 relative text-center text-eb-primary-blue-500 border-[1px] border-solid border-eb-primary-blue-500">
        <div
          className="absolute my-0 mx-[!important] top-[8px] left-[16px] font-medium z-[0]"
          onClick={onFrameContainer16Click}
        >
          View Trip
        </div>
      </div>
    </div>
  </div>
))}
              <div className="absolute top-[24px] left-[24px] flex flex-row items-center justify-start gap-[16px] text-ebgrey-500">
                <img
                  className="relative w-6 h-6 overflow-hidden shrink-0"
                  alt=""
                  src={briefcase}
                />
                <div className="relative font-medium">Upcoming Trips</div>
              </div>
            </div>
            <div className="relative rounded-2xl bg-white box-border w-[402px] h-[273px] overflow-hidden shrink-0 text-black border-[1px] border-solid border-gainsboro">
              <div className="absolute top-[-41px] left-[7px]">In Transit</div>
              <div className="absolute top-[24px] left-[64px] font-medium text-ebgrey-500">
                In Transit
              </div>
              <img
                className="absolute top-[21px] left-[24px] w-6 h-6 overflow-hidden"
                alt=""
                src={map}
              />
              <div className ="absolute top-[59px] left-[1px] bg-white w-[400px] h-[114px] overflow-hidden text-center text-sm text-eb-primary-blue-500">
              {transitTrips && transitTrips.map((trip, index) => (
  <div key={index} className="relative">
    <div className="absolute top-[19px] left-[7px] w-[375px] flex flex-row items-start justify-start gap-[8px]">
    <div className="flex flex-col items-start justify-start gap-[12px] text-left text-darkslategray">
      <div className="relative font-medium">{trip.TripName}</div>
      <div className="flex flex-col items-start justify-start gap-[16px] text-xs text-dimgray">
        <div className="flex flex-row items-end justify-start gap-[8px]">
          <div className="relative">{trip.departureCity}</div>
          <img
            className="relative w-4 h-4 overflow-hidden shrink-0"
            alt=""
            src={clarityTwoWayArrowsLine}
          />
          <div className="relative">{trip.arrivalCity}</div>
        </div>
        <div className="flex flex-row items-end justify-start gap-[4px]">
          <img
            className="relative w-4 h-4 overflow-hidden shrink-0"
            alt=""
            src={calender1}
          />
          <div className="flex flex-row items-start justify-start gap-[8px]">
            <div className="relative font-medium"> {formatDate(trip.TripStartDate)}</div>
            <div className="relative">{`to `}</div>
            <div className="relative font-medium">{formatDate(trip.TripEndDate)}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="absolute right-[10px] top-[19px] flex flex-row gap-4">
      <div
        className="rounded-13xl box-border w-[101px] flex flex-row items-center justify-center py-4 px-8 relative cursor-pointer border-[1px] border-solid border-eb-primary-blue-500"
        onClick={onFrameContainer26Click}
      >
        <div className="absolute my-0 mx-[!important] top-[8px] left-[9px] font-medium z-[0]">
          Book Expense
        </div>
      </div>
      <div
        className="rounded-13xl box-border w-[87px] h-[33px] flex flex-row items-center justify-center py-4 px-8 relative cursor-pointer border-[1px] border-solid border-eb-primary-blue-500"
        onClick={onFrameContainer27Click}
      >
        <div className="absolute my-0 mx-[!important] top-[8px] left-[17px] font-medium z-[0]">
          Trip Plan
        </div>
      </div>
    </div>
  </div>
))}     
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-4 overflow-y-auto h-[500px]">
  {allTrips && allTrips.length === 0 ? (
    <div className="relative rounded-2xl bg-white box-border w-[828px] h-[257px] overflow-hidden shrink-0 text-black border-[1px] border-solid border-gainsboro">
      <div className="absolute top-[67px] left-[0px] bg-white box-border w-[827px] h-16 overflow-hidden text-sm text-darkslategray border-b-[1px] border-solid border-gainsboro">
        <div className="absolute top-[calc(50%-_12px)] left-[24px] w-[353px] h-6 text-center">
          Your Trips will be shown here
        </div>
      </div>
    </div>
  ) : (
    allTrips
      ?.sort((a, b) => new Date(a.TripStartDate) - new Date(b.TripStartDate))
      .map((trip, index) => (
        <div key={index} className="relative rounded-2xl bg-white box-border w-[828px] h-[257px] overflow-hidden shrink-0 text-black border-[1px] border-solid border-gainsboro">
          <div className="absolute top-[24px] left-[24px]">{`All Trips `}</div>
          <div className="absolute top-[296px] left-[calc(50%-_412px)] text-ebgrey-600">
            {trip.tripStatus}
          </div>
          <div className="absolute top-[67px] left-[0px] bg-white box-border w-[827px] h-16 overflow-hidden text-sm text-darkslategray border-b-[1px] border-solid border-gainsboro">
            <div className="absolute top-[calc(50%-_12px)] left-[24px] w-[353px] h-6">
              <div className="absolute top-[3.5px] left-[0px] font-medium">
                {trip.TripName}
              </div>
              <div className="absolute top-[4px] left-[156px] flex flex-row items-end justify-start gap-[4px] text-xs text-dimgray">
                <img
                  className="relative w-4 h-4 overflow-hidden shrink-0"
                  alt=""
                  src={calendar}
                />
                <div className="flex flex-row items-start justify-start gap-[8px]">
                  <div className="relative font-medium"> {formatDate(trip.TripStartDate)}</div>
                  <div className="relative">{`to `}</div>
                  <div className="relative font-medium">{formatDate(trip.TripEndDate)}</div>
                </div>
              </div>
            </div>
            <div className="absolute top-[calc(50%-_16px)] left-[594px] rounded-xl bg-honeydew w-20 h-8 flex flex-row items-center justify-center p-2 box-border text-center text-xs text-forestgreen">
              <div className="relative font-medium">{trip.tripStatus}</div>
            </div>
            <div className="absolute top-[calc(50%-_8px)] left-[415px] flex flex-row items-end justify-start gap-[2px] text-xs text-dimgray">
              <div className="relative">{trip.departureCity}</div>
              <img
                className="relative w-4 h-4 overflow-hidden shrink-0"
                alt=""
                src={clarityTwoWayArrowsLine}
              />
              <div className="relative">{trip.arrivalCity}</div>
            </div>
            <div className="absolute top-[calc(50%-_16px)] left-[714px] rounded-13xl box-border w-[87px] h-[33px] flex flex-row items-center justify-center py-4 px-8 text-center text-eb-primary-blue-500 border-[1px] border-solid border-eb-primary-blue-500">
              <div className="absolute my-0 mx-[!important] top-[8px] left-[16px] font-medium z-[0]" onClick={onFrameContainer16Click}>
                View Trip
              </div>
            </div>
          </div>
          <div className="absolute top-[131px] left-[1px] bg-white box-border w-[827px] h-16 overflow-hidden text-xs text-dimgray border-b-[1px] border-solid border-gainsboro">
              <div className="absolute top-[24px] left-[415px] flex flex-row items-center justify-start gap-[2px]">
                <div className="relative">{trip.departureCity}</div>
                <img
                  className="relative w-4 h-4 overflow-hidden shrink-0"
                  alt=""
                  src={clarityTwoWayArrowsLine}
                />
                <div className="relative">{trip.arrivalCity}</div>
              </div>
              <div className="absolute top-[calc(50%_-_16px)] left-[593px] rounded-xl bg-cornsilk w-20 h-8 flex flex-row items-center justify-center p-2 box-border text-center text-goldenrod">
                <div className="relative font-medium">{trip.tripStatus}</div>
              </div>
              <div className="absolute top-[23.5px] left-[24px] text-sm font-medium text-darkslategray">
              {trip.TripName}
              </div>
              <div className="absolute top-[24px] left-[180px] flex flex-row items-end justify-start gap-[4px]">
                <img
                  className="relative w-4 h-4 overflow-hidden shrink-0"
                  alt=""
                  src={calendar}
                />
                <div className="flex flex-row items-start justify-start gap-[8px]">
                  <div className="relative font-medium">{formatDate(trip.TripStartDate)}</div>
                  <div className="relative">{`to `}</div>
                  <div className="relative font-medium">{formatDate(trip.TripEndDate)}</div>
                </div>
              </div>
              <div className="absolute top-[calc(50%_-_16px)] left-[713px] rounded-13xl box-border w-[87px] h-[33px] flex flex-row items-center justify-center py-4 px-8 text-center text-sm text-eb-primary-blue-500 border-[1px] border-solid border-eb-primary-blue-500">
                <div className="absolute my-0 mx-[!important] top-[8px] left-[16px] font-medium z-[0]" onClick={onFrameContainer16Click}>
                  View Trip
                </div>
              </div>
            </div>
          </div>
      ))
  )}
</div>
      
        </div>
      </div>
      <div className="absolute top-[50px] left-[284px] flex flex-row items-center justify-start gap-[8px] text-base text-black" onClick={redirectToProfile}>
        <img
          className="relative rounded-81xl w-8 h-8 overflow-hidden shrink-0 object-cover"
          alt=""
          src={frame490}
        />
        <div className="relative tracking-[-0.04em]">Hello Sumesh</div>
      </div>
      <div className="absolute top-[38px] left-[1184px] w-14 h-14 overflow-hidden text-center">
        <div className="absolute top-[calc(50%_-_20px)] left-[calc(50%_-_23px)] rounded-81xl bg-white box-border w-10 h-10 border-[1px] border-solid border-eb-primary-blue-300">
          <img
            className="absolute top-[calc(50%_-_12px)] left-[calc(50%_-_12px)] w-6 h-6 overflow-hidden"
            alt=""
            src={bell}
          />
          <div className="absolute top-[-4px] left-[29px] rounded-2xl bg-lightcoral-200 box-border w-5 h-5 overflow-hidden border-[1px] border-solid border-lightcoral-100">
            <div className="absolute top-[3px] left-[7px] font-medium">6</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTrip;
