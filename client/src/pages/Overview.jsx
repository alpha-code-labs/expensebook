/* eslint-disable react/jsx-key */
import React, { useState,useEffect } from 'react';
import { airplane_1, briefcase, calender, double_arrow,cab_purple,  house_simple, train, bus, cancel_round, cancel, modify, plus_icon, plus_violet_icon, receipt, down_arrow, chevron_down, down_left_arrow, calender_2_icon, airplane, material_flight_icon, material_cab_icon, material_hotel_icon, city_icon } from '../assets/icon';
import { formatAmount, formatDate, getStatusClass } from '../utils/handyFunctions';
import Tooltip from '../components/Tooltip';
import { Tilt } from 'react-tilt'
import { travelExpense,reimbursementExpense, travelRequests } from '../utils/dummyData';
import { motion } from 'framer-motion';


const Overview = () => {
  const trips = [
    
      {
        tripId: '667a3a5be9a18ce3478d1a0d',
        tripNumber: 'TRIPAL000003',
        travelRequestId: '66796b3bb2e14ac28c9eebb8',
        travelRequestNumber: 'TRAL000002',
        tripPurpose: 'Business',
        tripStartDate: '2024-06-26T00:00:00.000Z',
        tripCompletionDate: '2024-06-27T00:00:00.000Z',
        travelRequestStatus: 'booked',
        isCashAdvanceTaken: true,
        totalCashAmount: 0,
        cashAdvances: [
          {
            cashAdvanceId: '667a39e4a1b88232721397fb',
            cashAdvanceNumber: 'CA0001',
            amountDetails: [
              {
                amount: 4000,
                currency: {
                  countryCode: 'IN',
                  fullName: 'Indian Rupee',
                  shortName: 'INR',
                  symbol: '₹',
                },
                mode: null,
                _id: '667a39e4a1b8823272139809',
              },
            ],
            cashAdvanceStatus: 'pending settlement',
          },
        ],
        travelExpenses: [],
        itinerary: {
          flights: [
            {
              category: 'flights',
              itineraryId: '667a39d68daacf93aefc1c37',
              status: 'booked',
              bkd_from: 'Lucknow',
              bkd_to: 'Delhi',
              bkd_date: '2024-06-24T00:00:00.000Z',
              bkd_time: null,
              bkd_travelClass: null,
              bkd_violations: {
                class: null,
                amount: '',
              },
            },
            {
              category: 'flights',
              itineraryId: '667a39d68daacf93aefc1c38',
              status: 'booked',
              bkd_from: 'Delhi',
              bkd_to: 'Lucknow',
              bkd_date: '2024-06-27T00:00:00.000Z',
              bkd_time: null,
              bkd_travelClass: null,
              bkd_violations: {
                class: null,
                amount: '',
              },
            },
          ],
          buses: [],
          trains: [],
          hotels: [
            {
              category: 'hotels',
              itineraryId: '667a39d68daacf93aefc1c39',
              status: 'booked',
              bkd_location: 'Lucknow',
              bkd_class: null,
              bkd_checkIn: '2024-06-26T00:00:00.000Z',
              bkd_checkOut: '2024-06-27T00:00:00.000Z',
              bkd_violations: {
                class: null,
                amount: null,
              },
              cancellationDate: null,
              cancellationReason: null,
            },
          ],
          cabs: [],
          carRentals: [],
          personalVehicles: [],
        },
      },
      {
        tripId: '667a3af2e9a18ce3478d1d27',
        tripNumber: 'TRIPAL000005',
        travelRequestId: '667a3a718daacf93aefc1dc1',
        travelRequestNumber: 'TRAL000003',
        tripPurpose: 'Business',
        tripStartDate: '2024-06-26T00:00:00.000Z',
        tripCompletionDate: '2024-06-27T00:00:00.000Z',
        travelRequestStatus: 'booked',
        isCashAdvanceTaken: true,
        totalCashAmount: 0,
        cashAdvances: [
          {
            cashAdvanceId: '667a3a8ca1b8823272139bde',
            cashAdvanceNumber: 'CA0001',
            amountDetails: [
              {
                amount: 5000,
                currency: {
                  countryCode: 'IN',
                  fullName: 'Indian Rupee',
                  shortName: 'INR',
                  symbol: '₹',
                },
                mode: null,
                _id: '667a3a8ca1b8823272139bec',
              },
            ],
            cashAdvanceStatus: 'pending settlement',
          },
        ],
        travelExpenses: [],
        itinerary: {
          flights: [
            {
              category: 'flights',
              itineraryId: '667a3a8b8daacf93aefc1e07',
              status: 'booked',
              bkd_from: 'Mumbai',
              bkd_to: 'Goa',
              bkd_date: '2024-06-26T00:00:00.000Z',
              bkd_time: null,
              bkd_travelClass: null,
              bkd_violations: {
                class: null,
                amount: '',
              },
            },
            {
              category: 'flights',
              itineraryId: '667a3a8b8daacf93aefc1e08',
              status: 'booked',
              bkd_from: 'Goa',
              bkd_to: 'Delhi',
              bkd_date: '2024-06-27T00:00:00.000Z',
              bkd_time: null,
              bkd_travelClass: null,
              bkd_violations: {
                class: null,
                amount: '',
              },
            },
          ],
          buses: [],
          trains: [],
          hotels: [
            {
              category: 'hotels',
              itineraryId: '667a3a8b8daacf93aefc1e09',
              status: 'booked',
              bkd_location: 'Goa',
              bkd_class: null,
              bkd_checkIn: '2024-06-26T00:00:00.000Z',
              bkd_checkOut: '2024-06-24T00:00:00.000Z',
              bkd_violations: {
                class: null,
                amount: '',
              },
              cancellationDate: null,
              cancellationReason: null,
            },
          ],
          cabs: [],
          carRentals: [],
          personalVehicles: [],
        },
      },
    ]

  const [visible , setVisible]=useState({expense:false,createTravel:false})
  const [expenseTabs , setExpenseTabs]=useState("travelExpense")

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
    <div className=" border border-black bg-[#eef2ff] min-h-screen flex items-center justify-center px-2 md:px-10">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full overflow-hidden   ">
    
      <div className={`min-w-[400px] px-2  h-[340px] ${visibleDivs[0] ? 'opacity-100' : 'opacity-0'}`} >
         <div className="border-b-2  border-indigo-600 flex flex-row items-center justify-start gap-2 overflow-hidden py-2">
           <img
             className="w-5 h-5 shrink-0"
             alt="briefcase_icon"
             src={briefcase}
           />
           <b className="tracking-[0.02em] font-cabin text-[16px] text-black font-semibold">Activities for On-going Trips</b>
         </div>
         <div className='ring-2 ring-black shadow-sm shadow-indigo-600 rounded-md'/>

         <div className="h-[285px] flex justify-center items-center  bg-white-100 overflow-hidden overflow-y-auto mt-2  border-[4px] border-gray-600  shadow-lg  shadow-black/60  rounded-3xl px-2">
         {/* <div className="h-[285px] bg-white-100 overflow-hidden overflow-y-auto mt-2  border-[4px] border-gray-600  shadow-lg  shadow-custom-light  rounded-3xl px-2"> */}
         
           {/* {trips.map((trip, index) => (
             <Trips key={index} index={index} trip={trip} lastIndex={trips.length - 1} />
           ))} */}
           <div className='h-[260px] w-full   rounded-2xl px-2 py-2 '>
            <div className='border-2 border-black rounded-xl py-2'>
            <div className='flex items-center  py-1 px-2'>
            <div className='px-2 py-1 text-center bg-black rounded-2xl text-white-100'>
                <p className='font-inter text-xs'>Upcoming</p>
              </div>
              <div className='px-2 py-1'>
                <p className='font-inter text-xs font-semibold'>Completed</p>
              </div>
             

            </div>
            <div className='w-full flex flex-row border-t-2 border-black p-2 items-center justify-between'>
            <div className='w-2/3 font-mono font-medium mt-2 flex flex-col gap-2'>
            <div className='flex gap-2 font-inter '>
                <img src={calender_2_icon} className='w-4 h-4'/>
                <div className='font-semibold text-sm'>24<sup>th</sup> June</div>
              </div>
              <div>
              <div className='font-semibold text-neutral-400 text-xs font-inter '>DEPARTURE</div>
              <div className='font-inter text-sm'>Mumbai - Lucknow - Delhi</div>
              </div>
            </div>
            <div className='w-1/3 flex justify-end'>
              <div className='bg-black text-white-100 text-sm px-2 py-1 rounded-md'>
               <p >Modify</p>
              </div>
            </div>
            </div>
            <div className=' space-y-2 px-2'>
              <div className='flex flex-row  border-y-2 rounded-lg border-black shadow-sm shadow-black w-full '>
                <div className='flex w-2/5'>
              <div className='w-8 h-8 p-2 flex items-center'>
                <img src={material_flight_icon} className='w-4 h-4'/>
              </div>
              <div className='flex gap-2 font-inter items-center justify-center p-2 '>
                <img src={calender_2_icon} className='w-4 h-4'/>
                <div className='font-semibold text-sm'>24<sup>th</sup> June</div>
              </div>
              </div>

              <div className='w-3/5 flex text-black space-x-2 font-inter text-sm font-medium  items-center justify-center'>
                <div className=''>Delhi</div>
                <img src={double_arrow} className='w-5 h-5'/>
                <div>Lucknow</div>
              </div>
              <div>
               
             

              </div>
              </div>
              <div className='flex flex-row  border-y-2 rounded-lg border-black shadow-sm shadow-black w-full '>
                <div className='flex w-2/5'>
              <div className='w-8 h-8 p-2 flex items-center'>
                <img src={material_cab_icon} className='w-4 h-4'/>
              </div>
              <div className='flex gap-2 font-inter items-center justify-center p-2 '>
                <img src={calender_2_icon} className='w-4 h-4'/>
                <div className='font-semibold text-sm'>24<sup>th</sup> June</div>
              </div>
              </div>

              <div className='w-3/5 flex text-black space-x-2 font-inter text-sm font-medium  items-center justify-center'>
                <div className=''>Amax Office</div>
                <img src={double_arrow} className='w-5 h-5'/>
                <div>Delhi Airport</div>
              </div>
              <div>
               
             

              </div>
              </div>
              <div className='flex flex-row   border-y-2 rounded-lg border-black shadow-sm shadow-black w-full '>
                <div className='flex w-2/5'>
              <div className='w-8 h-8 p-2 flex items-center'>
                <img src={material_hotel_icon} className='w-4 h-4'/>
              </div>
              <div className='flex gap-2 font-inter items-center justify-center p-2 '>
                <img src={city_icon} className='w-4 h-4'/>
                <div className='font-semibold text-sm'>Lucknow</div>
              </div>
              </div>

              <div className='w-3/5 flex space-x-2 font-inter text-sm font-medium  items-center justify-center'>
              <div className=''>24<sup>th</sup> June</div>
                <img src={double_arrow} className='w-5 h-5'/>
                <div className=''>26<sup>th</sup> June</div>
              </div>
              <div>
               
             

              </div>
              </div>
              

            </div>
            </div>
           </div>

           
          
         </div>
         
       </div>
       
       


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
onMouseEnter={() => setVisible({expense:true})}
onMouseLeave={() => setVisible({expense:false})}
className={`relative  hover:px-2 w-6 h-6 hover:overflow-hidden hover:w-auto group text-indigo-600 bg-indigo-100 border border-white-100 flex items-center justify-center  hover:gap-x-1 rounded-full cursor-pointer transition-all duration-300`}
>
<img src={plus_violet_icon} width={16} height={16} alt="Add Icon" />
<p
className={`${
visible?.expense ? 'opacity-100 ' : 'opacity-0 w-0'
} whitespace-nowrap text-xs transition-all duration-300 group-hover:opacity-100 group-hover:w-auto`}
>
Add an Expense
</p>
</div>

</div>

<div className='  h-[238px] overflow-y-auto px-2 '>
{expenseTabs === "travelExpense" &&
travelExpense.map((expense,index) => <TravelExpenses index={index} expense={expense} lastIndex={travelExpense.length-1} />)}



{expenseTabs === "nonTravelExpense" &&
reimbursementExpense?.map((expense,index) => <NonTravelExpenses index={index} expense={expense} lastIndex={reimbursementExpense.length-1}/>)}
</div>

</div>


</div> 
       






<div className={`min-w-[400px] px-2  h-[340px] transition-opacity delay-100 ${visibleDivs[2] ? 'opacity-100' : 'opacity-0'}`} >
          <div className="border-b-2 border-indigo-600 flex flex-row items-center justify-start gap-2 overflow-hidden py-2">
            <img
              className="w-5 h-5 shrink-0"
              alt="briefcase_icon"
              src={briefcase}
            />
            <b className="tracking-[0.02em] font-cabin text-[16px] font-semibold text-indigo-600">Upcoming Trips</b>
          </div>

        <div className="h-[288px] overflow-hidden overflow-y-auto   mt-2 border-4 border-indigo-600 rounded-md px-2">
          {trips.map((trip, index) => (
           
              <UpcomingTrips key={index} index={index} trip={trip} lastIndex={trips.length - 1} />
              
            ))}
          </div>
        </div>



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
      onMouseEnter={() => setVisible({createTravel:true})}
      onMouseLeave={() => setVisible({createTravel:false})}
      className={`relative  hover:px-2 w-6 h-6 hover:overflow-hidden hover:w-auto group text-indigo-600 bg-indigo-100 border border-white-100 flex items-center justify-center  hover:gap-x-1 rounded-full cursor-pointer transition-all duration-300`}
    >
      <img src={plus_violet_icon} width={16} height={16} alt="Add Icon" />
      <p
        className={`${
          visible?.createTravel ? 'opacity-100 ' : 'opacity-0 w-0'
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
    </div>
  );
};

export default Overview;



const getIconForItinerary = (itineraryType) => {
  switch (itineraryType) {
    case 'flights':
      return airplane_1;
    case 'buses':
      return bus ;
    case 'trains':
      return train;
    case 'hotels':
      return house_simple;
    case 'cabs':
      return cab_purple;
    default:
      return null;
  }
};









const Trips = ({ index, trip, lastIndex }) => {
  const [activeTabs, setActiveTabs] = useState("completed");

  const handleTabChange = (tab) => {
    setActiveTabs(tab);
  };

  console.log(activeTabs);

  function separateItineraryByDate(currentDate, itinerary) {
    const completedItinerary = { flights: [], hotels: [], buses: [], cabs: [] };
    const upcomingItinerary = { flights: [], hotels: [], buses: [], cabs: [] };

    function checkAndPush(item, dateField, category) {
      const itemDate = new Date(item[dateField]);
      if (category === "hotels") {
        if (itemDate < currentDate) {
          completedItinerary[category].push(item);
        } else {
          upcomingItinerary[category].push(item);
        }
      } else {
        if (itemDate >= currentDate) {
          upcomingItinerary[category].push(item);
        } else {
          completedItinerary[category].push(item);
        }
      }
    }

    itinerary.flights.forEach(flight => checkAndPush(flight, 'bkd_date', 'flights'));
    itinerary.hotels.forEach(hotel => checkAndPush(hotel, 'bkd_checkOut', 'hotels'));
    itinerary.buses.forEach(bus => checkAndPush(bus, 'bkd_date', 'buses'));
    itinerary.trains.forEach(train => checkAndPush(train, 'bkd_date', 'trains'));
    itinerary.cabs.forEach(cab => checkAndPush(cab, 'bkd_date', 'cabs'));

    return { completedItinerary, upcomingItinerary };
  }

  const currentDate = new Date();
  const { completedItinerary, upcomingItinerary } = separateItineraryByDate(currentDate, trip?.itinerary);

  console.log('Completed Itinerary:', completedItinerary);
  console.log('Upcoming Itinerary:', upcomingItinerary);

  const [visible, setVisible] = useState({ addALeg: false });

  return (
    <div className={`${index === lastIndex ? ' ' : 'mb-2'} h-[270px] rounded-md border border-white-100 `}>
      <div className="flex gap-2 px-2 flex-row items-center justify-between text-center font-cabin border-b shadow-sm  py-2 text-neutral-700 text-xs">
        <div className='flex'>
          <motion.div
            className={`px-2 py-1 rounded-xl cursor-pointer transition duration-150 ease-in-out ${activeTabs === 'completed' ? 'bg-indigo-100 font-semibold text-indigo-600 border border-white-100 text-xs shadow-md shadow-indigo-600' : 'text-xs'}`}
            onClick={() => handleTabChange('completed')}
            whileHover={{ scale: 1.1 }}
          >
            <p>Completed</p>
          </motion.div>
          <motion.div
            className={`px-2 py-1 rounded-xl cursor-pointer ease-in-out ${activeTabs === 'upcoming' ? 'bg-indigo-100 font-semibold text-indigo-600 border border-white-100 text-xs shadow-md shadow-indigo-600' : 'text-xs'}`}
            onClick={() => handleTabChange('upcoming')}
            whileHover={{ scale: 1.1 }}
          >
            <p>Upcoming</p>
          </motion.div>
        </div>
        <div className='gap-4 flex '>
          <motion.div
            onMouseEnter={() => setVisible({ cancel: true })}
            onMouseLeave={() => setVisible({ cancel: false })}
            className={`relative shadow-md shadow-red-200 hover:px-2 w-6 h-6 hover:overflow-hidden hover:w-auto group text-indigo-600 bg-red-100 border border-white-100 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300`}
            whileHover={{ scale: 1.2 }}
          >
            <img src={cancel} width={20} height={20} alt="Add Icon" />
            <p className={`${visible?.cancel ? 'opacity-100 ' : 'opacity-0 w-0'} whitespace-nowrap text-red-200 text-xs transition-all duration-300 group-hover:opacity-100 group-hover:w-auto`}>
              Cancel
            </p>
          </motion.div>
          <motion.div
            onMouseEnter={() => setVisible({ addALeg: true })}
            onMouseLeave={() => setVisible({ addALeg: false })}
            className={`relative shadow-md shadow-indigo-600 hover:px-2 w-6 h-6 hover:overflow-hidden hover:w-auto group text-indigo-600 bg-indigo-100 border border-white-100 flex items-center justify-center hover:gap-x-1 rounded-full cursor-pointer transition-all duration-300`}
            whileHover={{ scale: 1.2 }}
          >
            <img src={plus_violet_icon} width={16} height={16} alt="Add Icon" />
            <p className={`${visible?.addALeg ? 'opacity-100 ' : 'opacity-0 w-0'} whitespace-nowrap text-xs transition-all duration-300 group-hover:opacity-100 group-hover:w-auto`}>
              Add a Leg
            </p>
          </motion.div>
        </div>
      </div>

      {activeTabs === 'completed' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='h-[220px] min-w-max w-full bg-white-100 overflow-y-auto rounded-b-md py-1 px-2'>
            <div className="flex flex-col py-1">
              {Object.keys(completedItinerary).map(key => (
                <React.Fragment key={key}>
                  {key !== 'formState' && completedItinerary[key].length > 0 && (
                    <div className='w-full'>
                      <div className='flex gap-2 font-cabin items-center text-neutral-600 py-1'>
                        <img src={getIconForItinerary(key)} className='w-4 h-4' />
                        <h2 className="text-md font-semibold text-indigo-600 text-center">{key.charAt(0).toUpperCase() + key.slice(1)}</h2>
                      </div>
                      <div className="space-y-2">
                        {completedItinerary[key]?.map(item => (
                          <React.Fragment key={item._id}>
                            <motion.div
                              className="bg-white-100 p-3 rounded w-full shadow-md shadow-indigo-600 border border-slate-300"
                              whileHover={{ scale: 1.05 }}
                            >
                              {['flights', 'trains', 'buses'].includes(key) && (
                                <div className='flex flex-col items-start gap-2'>
                                  <div className='flex w-full items-center justify-between'>
                                    <div className='inline-flex gap-1'>
                                      <img src={calender} alt='icon' className='w-4 h-4' />
                                      <span className='text-sm font-cabin text-neutral-600'>{formatDate(item.bkd_date)}</span>
                                    </div>
                                  </div>
                                  <div className='flex-1 w-full capitalize inline-flex items-center justify-between'>
                                    <div className='w-2/5 font-cabin items-start text-sm text-neutral-600'>
                                      <div className='text-neutral-600 text-xs'>Pickup Address</div>
                                      <div className='text-neutral-800 '>{item?.bkd_from}</div>
                                    </div>
                                    <img src={double_arrow} className='w-5 h-5' alt='icon' />
                                    <div className='w-2/5 items-start font-cabin text-sm text-neutral-600'>
                                      <div className='text-neutral-600 text-xs'>Dropoff Address</div>
                                      <div className='text-neutral-800'>{item?.bkd_to}</div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {key === 'cabs' && (
                                <div className='flex flex-col items-start gap-2'>
                                  <div className='flex w-full items-center justify-between'>
                                    <div className='inline-flex gap-1'>
                                      <img src={calender} alt='icon' className='w-4 h-4' />
                                      <span className='text-sm font-cabin text-neutral-600'>{formatDate(item?.bkd_date)}</span>
                                    </div>
                                  </div>
                                  <div className='flex-1 w-full inline-flex items-center justify-between'>
                                    <div className='w-2/5 font-cabin text-sm text-neutral-600'>
                                      <div className='text-neutral-600 text-xs'>Pickup Address</div>
                                      <div className='text-neutral-800'>{item?.bkd_pickup}</div>
                                    </div>
                                    <img src={double_arrow} className='w-5 h-5' alt='icon' />
                                    <div className='w-2/5 font-cabin text-sm text-neutral-600'>
                                      <div className='text-neutral-600 text-xs'>Dropoff Address</div>
                                      <div className='text-neutral-800'>{item?.bkd_dropoff}</div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {key === 'hotels' && (
                                <div className='flex flex-col gap-2'>
                                  <div className='flex w-full gap-2'>
                                    <div className='inline-flex w-1/2 gap-1'>
                                      <img src={calender} alt='icon' className='w-4 h-4' />
                                      <span className='text-sm font-cabin text-neutral-600'>{formatDate(item?.bkd_checkIn)}</span>
                                    </div>
                                    <div className='inline-flex w-1/2 gap-1'>
                                      <img src={calender} alt='icon' className='w-4 h-4' />
                                      <span className='text-sm font-cabin text-neutral-600'>{formatDate(item?.bkd_checkOut)}</span>
                                    </div>
                                  </div>
                                  <div className='flex-1 w-full capitalize flex flex-col items-start'>
                                    <div className='text-neutral-600 text-xs'>Hotel Name</div>
                                    <div className='text-neutral-800'>{item?.bkd_hotelName}</div>
                                    <div className='text-neutral-600 text-xs'>Address</div>
                                    <div className='text-neutral-800'>{item?.bkd_hotelAddress}</div>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.div>
      )}
      {activeTabs === 'upcoming' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='h-[220px] min-w-max w-full bg-white-100 overflow-y-auto rounded-b-md py-1 px-2'>
            <div className="flex flex-col py-1">
              {Object.keys(upcomingItinerary).map(key => (
                <React.Fragment key={key}>
                  {key !== 'formState' && upcomingItinerary[key].length > 0 && (
                    <div className='w-full'>
                      <div className='flex gap-2 font-cabin items-center text-neutral-600 py-1'>
                        <img src={getIconForItinerary(key)} className='w-4 h-4' />
                        <h2 className="text-md font-semibold text-indigo-600 text-center">{key.charAt(0).toUpperCase() + key.slice(1)}</h2>
                      </div>
                      <div className="space-y-2">
                        {upcomingItinerary[key]?.map(item => (
                          <React.Fragment key={item._id}>
                            <motion.div
                              className="bg-white-100 p-3 rounded w-full shadow-md shadow-indigo-600 border border-slate-300"
                              whileHover={{ scale: 1.05 }}
                            >
                              {['flights', 'trains', 'buses'].includes(key) && (
                                <div className='flex flex-col items-start gap-2'>
                                  <div className='flex w-full items-center justify-between'>
                                    <div className='inline-flex gap-1'>
                                      <img src={calender} alt='icon' className='w-4 h-4' />
                                      <span className='text-sm font-cabin text-neutral-600'>{formatDate(item.bkd_date)}</span>
                                    </div>
                                  </div>
                                  <div className='flex-1 w-full capitalize inline-flex items-center justify-between'>
                                    <div className='w-2/5 font-cabin items-start text-sm text-neutral-600'>
                                      <div className='text-neutral-600 text-xs'>Pickup Address</div>
                                      <div className='text-neutral-800 '>{item?.bkd_from}</div>
                                    </div>
                                    <img src={double_arrow} className='w-5 h-5' alt='icon' />
                                    <div className='w-2/5 items-start font-cabin text-sm text-neutral-600'>
                                      <div className='text-neutral-600 text-xs'>Dropoff Address</div>
                                      <div className='text-neutral-800'>{item?.bkd_to}</div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {key === 'cabs' && (
                                <div className='flex flex-col items-start gap-2'>
                                  <div className='flex w-full items-center justify-between'>
                                    <div className='inline-flex gap-1'>
                                      <img src={calender} alt='icon' className='w-4 h-4' />
                                      <span className='text-sm font-cabin text-neutral-600'>{formatDate(item?.bkd_date)}</span>
                                    </div>
                                  </div>
                                  <div className='flex-1 w-full inline-flex items-center justify-between'>
                                    <div className='w-2/5 font-cabin text-sm text-neutral-600'>
                                      <div className='text-neutral-600 text-xs'>Pickup Address</div>
                                      <div className='text-neutral-800'>{item?.bkd_pickup}</div>
                                    </div>
                                    <img src={double_arrow} className='w-5 h-5' alt='icon' />
                                    <div className='w-2/5 font-cabin text-sm text-neutral-600'>
                                      <div className='text-neutral-600 text-xs'>Dropoff Address</div>
                                      <div className='text-neutral-800'>{item?.bkd_dropoff}</div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {key === 'hotels' && (
                                <div className='flex flex-col gap-2'>
                                  <div className='flex w-full gap-2'>
                                    <div className='inline-flex w-1/2 gap-1'>
                                      <img src={calender} alt='icon' className='w-4 h-4' />
                                      <span className='text-sm font-cabin text-neutral-600'>{formatDate(item?.bkd_checkIn)}</span>
                                    </div>
                                    <div className='inline-flex w-1/2 gap-1'>
                                      <img src={calender} alt='icon' className='w-4 h-4' />
                                      <span className='text-sm font-cabin text-neutral-600'>{formatDate(item?.bkd_checkOut)}</span>
                                    </div>
                                  </div>
                                  <div className='flex-1 w-full capitalize flex flex-col items-start'>
                                    <div className='text-neutral-600 text-xs'>Hotel Name</div>
                                    <div className='text-neutral-800'>{item?.bkd_hotelName}</div>
                                    <div className='text-neutral-600 text-xs'>Address</div>
                                    <div className='text-neutral-800'>{item?.bkd_hotelAddress}</div>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};











const UpcomingTrips = ({ index, trip,lastIndex }) => {

const [visible ,setVisible]=useState(false)

  return (
    <div className={ `${index ===lastIndex ? ' ' :'mb-2'}  shadow h-[285px] rounded-md `}>
      <div className="flex gap-2 px-2 flex-row items-center justify-between text-center font-cabin border-b-2  border-slate-300 py-2 text-neutral-700 text-xs">
       
      <div className='font-cabin text-xs text-neutral-700'>
          <div className='text-xs text-start'>
            <div className='text-neutral-400'>Trip No.</div>
             <p>{trip.tripNumber}</p>
          </div>
        </div>

        <div className='gap-4 flex '>
         
        <div
      onMouseEnter={() => setVisible({cancel:true})}
      onMouseLeave={() => setVisible({cancel:false})}
      className={`relative  hover:px-2 w-6 h-6 hover:overflow-hidden hover:w-auto group text-indigo-600 bg-red-100 border border-white-100 flex items-center justify-center   rounded-full cursor-pointer transition-all duration-300`}
    >
      <img src={cancel} width={20} height={20} alt="Add Icon" />
      <p
        className={`${
          visible?.cancel ? 'opacity-100 ' : 'opacity-0 w-0'
        } whitespace-nowrap text-red-200 text-xs transition-all duration-300 group-hover:opacity-100 group-hover:w-auto`}
      >
       Cancel
      </p>
    </div>
        
          
          
             
        <div
      onMouseEnter={() => setVisible({addALeg:true})}
      onMouseLeave={() => setVisible({addALeg:false})}
      className={`relative  hover:px-2 w-6 h-6 hover:overflow-hidden hover:w-auto group text-indigo-600 bg-indigo-100 border border-white-100 flex items-center justify-center  hover:gap-x-1 rounded-full cursor-pointer transition-all duration-300`}
    >
      <img src={plus_violet_icon} width={16} height={16} alt="Add Icon" />
      <p
        className={`${
          visible?.addALeg ? 'opacity-100 ' : 'opacity-0 w-0'
        } whitespace-nowrap text-xs transition-all duration-300 group-hover:opacity-100 group-hover:w-auto`}
      >
        Add a Leg
      </p>
    </div>


          </div>
        

      </div>

      
  
        <div>
         <div className='h-[234px] min-w-max w-full  overflow-y-auto rounded-b-md py-1 px-2'>
 <div className=" flex flex-col py-1">
      {Object.keys(trip?.itinerary).map(key => (
        <React.Fragment key={key}>
          {key !== 'formState' && trip?.itinerary[key].length > 0 && (
            <div className='w-full'>
              <div className='flex gap-2 font-cabin items-center text-neutral-600 py-1'>
              <img src={getIconForItinerary(key)} className='w-4 h-4' />
              <h2 className="text-md font-semibold  text-center">{key.charAt(0).toUpperCase() + key.slice(1)}</h2>
              {/* <h2 className="text-md font-semibold  text-center">{key.charAt(0).toUpperCase() + key.slice(1)}</h2> */}
              </div>
              <div className="" >
                {trip?.itinerary[key]?.map(item => (
                  <React.Fragment key={item._id} >
                    <div className="bg-white  p-3 rounded shadow w-full border border-slate-300 bg-slate-50">
              {['flights','trains','buses'].includes(key)  && (

                   <div className='flex flex-col items-start gap-2   '>
                    <div className='flex  w-full  items-center  justify-between '>
                      <div className='inline-flex gap-1'>
                      <img src={calender} alt='icon' className='w-4 h-4'/>
                      <span className='text-sm font-cabin text-neutral-600'>{formatDate(item.bkd_date)}</span>
                      </div>
                      {/* <div className={` text-center rounded-sm  ${getStatusClass(item.status)}`}>
                      <p className='px-2 py-1 text-sm text-center capitalize font-cabin '>{item?.status}</p>
                      </div> */}
                    

                    </div>

                    <div className='flex-1 w-full capitalize    inline-flex items-center  justify-between   '>
                <div className='w-2/5   font-cabin items-start  text-sm text-neutral-600'>
                  <div className=' text-neutral-600 text-xs'>Pickup Address</div>
                  <div className='text-neutral-800 '>{item?.bkd_from}</div>
                </div>
                <img src={double_arrow} className=' w-5 h-5' alt='icon'/>
                <div className='w-2/5 items-start  font-cabin text-sm text-neutral-600'>
                <div className=' text-neutral-600 text-xs'>Dropoff Address</div>
                <div className='text-neutral-800'> {item?.bkd_to}</div></div>
                </div>
                    
                    
    
                  </div>
                )}
                    {/* Add more details as needed */}
                {key === 'cabs' && (
          
                <div className='flex flex-col items-start gap-2'>
                <div className='flex  w-full  items-center  justify-between'>
                  <div className='inline-flex gap-1'>
                  <img src={calender} alt='icon' className='w-4 h-4'/>
                  <span className='text-sm font-cabin text-neutral-600'>{formatDate(item?.bkd_date)}</span>
                  </div>
                  {/* <div className={` text-center rounded-sm  ${getStatusClass(item?.status)}`}>
                  <p className='px-2 py-1 text-sm text-center capitalize font-cabin '>{item?.status}</p>
                  </div> */}
                </div>

                <div className='flex-1 w-full   inline-flex items-center justify-between'>
                <div className='w-2/5  font-cabin  text-sm text-neutral-600'>
                  <div className=' text-neutral-600 text-xs'>Pickup Address</div>
                  <div className='text-neutral-800'>{item?.bkd_pickupAddress}</div>
                  </div>
                <img src={double_arrow} className=' w-5 h-5' alt='icon'/>
                <div className='w-2/5  font-cabin text-sm text-neutral-600'>
                <div className=' text-neutral-600 text-xs'>Dropoff Address</div>
                <div className='text-neutral-800'> {item?.bkd_dropAddress}</div></div>
                </div>
                
                

              </div>
                )}
                   {key === 'hotels' && (
                       <div className='flex flex-col items-start capitalize'>
                        
                        <div className='flex items-center  justify-between w-full'>

                      <div className='flex w-full'>
                        <div className='justify-between flex '>
                       <img src={calender} alt='icon' className='w-4 h-4 mr-1'/>
                       <p className='text-sm font-cabin text-neutral-600'>{formatDate(item?.bkd_checkIn)}</p>
                       </div>
                       <div className='text-center px-2 '> to </div>
                       <div className='flex justify-between '>
                       <img src={calender} alt='icon' className='w-4 h-4 mr-1'/>
                       <p className='text-sm font-cabin text-neutral-600'>{formatDate(item?.bkd_checkOut)}</p>
                       </div>
                       </div>
                      

                        
                         {/* <div className={`px-2 py-1 rounded-sm    ${getStatusClass(item?.status)}`}>
                         <p className='text-sm text-center capitalize font-cabin '>{item?.status}</p>
                         </div> */}
                     
                        </div>

                       <div className='flex-1  flex-col items-center font-cabin  '>
                        <div className='text-neutral-600  text-xs '> Location</div>
                        
                         <span className='text-sm font-cabin text-neutral-800'>{item?.bkd_location}</span>
                       </div>
                       
                       
                  
       
                     </div>
                    )}    
                 
                 </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
</div>


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
              <img src={down_left_arrow} className='w-4 h-3' />
              
              
          <div className='font-cabin text-xs text-neutral-700'>
          <div className='text-xs text-start'>
            <div className='text-neutral-400'>Expense Header No.</div>
             <p> {item?.expenseHeaderNumber}</p>
          </div>
          </div>
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




// import React ,{ useState,useEffect}from 'react';
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



