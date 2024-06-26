import React, { useState } from 'react';
import { airplane_1, briefcase, calender, double_arrow,cab_purple,  house_simple, train, bus, cancel_round, cancel, modify, plus_icon, plus_violet_icon, receipt } from '../assets/icon';
import { formatDate } from '../utils/handyFunctions';
import Tooltip from '../components/Tooltip';

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
  const [visible , setVisible]=useState(false)
  const [expenseTabs , setExpenseTabs]=useState("travelExpense")

  const handleExpenseTabChange = (tab)=>{
    setExpenseTabs(tab)
    
  }

  return (
    <div className="w-full border border-black min-h-screen flex items-center justify-center px-2 md:px-10">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full overflow-x-auto">
        <div className="min-w-[400px] h-[340px] rounded-md">
          <div className="border-b-2 border-indigo-600 flex flex-row items-center justify-start gap-2 overflow-hidden py-2">
            <img
              className="w-6 h-6 shrink-0"
              alt="briefcase_icon"
              src={briefcase}
            />
            <b className="tracking-[0.02em] font-cabin text-[16px] text-indigo-600 font-semibold">In-transit Trips</b>
          </div>

          <div className="h-[285px] overflow-y-auto mt-2 border-4 border-indigo-600 rounded-md">
          
            {trips.map((trip, index) => (
              <Trips key={index} index={index} trip={trip} lastIndex={trips.length - 1} />
            ))}
           
          </div>
          
        </div>

        <div className=" min-w-[400px] h-[340px] rounded-md">

          <div className="border-b-2 border-indigo-600 flex flex-row items-center justify-start gap-2 overflow-hidden py-2">
            <img
              className="w-6 h-6 shrink-0"
              alt="briefcase_icon"
              src={receipt}
            />
            <b className="tracking-[0.02em] font-cabin text-[16px] font-semibold">Expenses</b>
          </div>

  <div className="h-[285px] overflow-y-auto mt-2 border-4 border-indigo-600 rounded-md">
            

          <div className="flex gap-2 px-2 flex-row items-center justify-between text-center font-cabin border-b-2  border-slate-300 py-1 text-neutral-700 text-xs">
        <div className='flex'>
        <div
           className={`px-2 py-1 rounded-xl cursor-pointer ${
            expenseTabs === "travelExpense"
              ? 'text-white-100 bg-indigo-600'
              : 'text-xs'
          }`}

          onClick={() => handleExpenseTabChange("travelExpense")}
        >
          <p>Travel Expense</p>
        </div>
        <div
          className={`px-2 py-1 rounded-xl cursor-pointer ${
            expenseTabs === 'nonTravelExpense'
              ? 'text-white-100 bg-indigo-600'
              : 'text-xs'
          }`}
          onClick={() => handleExpenseTabChange("nonTravelExpense")}
        >
          <p>Non-Travel Expense</p>
        </div>
        </div>     
        
        <div
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className={`relative hover:px-2 w-6 h-6 hover:w-auto group text-indigo-600 bg-indigo-100 flex items-center justify-center  hover:gap-1 rounded-full cursor-pointer transition-all duration-300`}
    >
      <img src={plus_violet_icon} width={16} height={16} alt="Add Icon" />
      <span
        className={`${
          visible ? 'opacity-100' : 'opacity-0 w-0'
        } whitespace-nowrap transition-all duration-300 group-hover:opacity-100 group-hover:w-auto`}
      >
        Add an Expense
      </span>
    </div>
          
      </div>

          </div>


        </div>



        <div className=" min-w-[400px] h-[340px] border border-indigo-600 rounded-md">
          <div className="border-b-2 border-indigo-600 flex flex-row items-center justify-start gap-2 overflow-hidden py-2">
            <img
              className="w-6 h-6 shrink-0"
              alt="briefcase_icon"
              src={receipt}
            />
            <b className="tracking-[0.02em] font-cabin text-[16px] font-semibold">Upcoming Trips</b>
          </div>
        </div>
        <div className=" min-w-[400px] h-[340px] border border-indigo-600 rounded-md">
          <div className="border-b-2 border-indigo-600 flex flex-row items-center justify-start gap-2 overflow-hidden py-2">
            <img
              className="w-6 h-6 shrink-0"
              alt="briefcase_icon"
              src={briefcase}
            />
            <b className="tracking-[0.02em] font-cabin text-[16px] font-semibold">Travel Requests</b>
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






const Trips = ({ index, trip,lastIndex }) => {

 
  const [activeTabs, setActiveTabs] = useState({0:'completed'},{1:'completed'});
  
  const handleTabChange = (index, tab) => {
    setActiveTabs((prevTabs) => ({
      ...prevTabs,
      [index]: tab,
    }));
  };

 console.log(activeTabs)
  
  function separateItineraryByDate(currentDate, itinerary) {
    const completedItinerary = { flights: [], hotels: [], buses: [],cabs:[] };
  const upcomingItinerary = { flights: [], hotels: [], buses: [] ,cabs:[]};
    
    function checkAndPush(item, dateField, category) {
      const itemDate = new Date(item[dateField]);
      if (category==="hotels") {
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
  
    // Process flights
    itinerary.flights.forEach(flight => {
      checkAndPush(flight, 'bkd_date','flights');
    });
  
    // Process hotels (use bkd_checkOut for comparison)
    itinerary.hotels.forEach(hotel => {
      checkAndPush(hotel, 'bkd_checkOut', 'hotels');
    });
  
    // Process other travel modes if needed (buses, trains, etc.)
    // Assuming other travel modes have similar date fields for comparison
    itinerary.buses.forEach(bus => {
      checkAndPush(bus, 'bkd_date','buses');
    });
    itinerary.trains.forEach(train => {
      checkAndPush(train, 'bkd_date' , 'trains');
    });
    itinerary.cabs.forEach(cab => {
      checkAndPush(cab, 'bkd_date' , 'cabs');
    });
  
    return { completedItinerary, upcomingItinerary };
  }
  
 

  const currentDate = new Date();
  const { completedItinerary, upcomingItinerary } = separateItineraryByDate(currentDate, trip?.itinerary);
  
  console.log('Completed Itinerary:', completedItinerary);
  console.log('Upcoming Itinerary:', upcomingItinerary);
const [visible ,setVisible]=useState(false)




 

  return (
    <div className={ `${index ===lastIndex ? ' ' :'mb-2'} h-[285px] bg-indigo-100 rounded-md py-2`}>
      <div className="flex gap-2 px-2 flex-row items-center justify-between text-center font-cabin border-b-2  border-slate-300 py-1 text-neutral-700 text-xs">
        <div className='flex'>
        <div
           className={`px-2 py-1 rounded-xl cursor-pointer ${
            activeTabs[index] === 'completed'
              ? 'text-white-100 bg-indigo-600'
              : 'text-xs'
          }`}

          onClick={() => handleTabChange(index, 'completed')}
        >
          <p>Completed</p>
        </div>
        <div
          className={`px-2 py-1 rounded-xl cursor-pointer ${
            activeTabs[index] === 'upcoming'
              ? 'text-white-100 bg-indigo-600'
              : 'text-xs'
          }`}
          onClick={() => handleTabChange(index, 'upcoming')}
        >
          <p>Upcoming</p>
        </div>
        </div>
        
    

        <div className='gap-4 flex '>
         
        <div  onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)} 
      className={`${visible?  'static w-auto px-2' : 'relative'} w-6 h-6  group text-indigo-600   bg-indigo-50  flex items-center justify-center gap-[2px] rounded-full cursor-pointer`}>
            <img className='' src={cancel} width={20} height={20} />
            <span className={`${visible ? '' : ' absolute'}  opacity-0 transition-opacity duration-300 group-hover:opacity-100`}>
              Cancel the Trip
            </span>
          </div>
        
          
          <div  onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)} className={`${visible?  'static w-auto px-2' : 'relative'} w-6 h-6 hover:w-[100px] group text-indigo-600 bg-indigo-50  flex items-center justify-center gap-[2px] rounded-full cursor-pointer`}>
            <img src={plus_violet_icon} width={16} height={16} />
            <span className={`${visible ? '' : ' absolute'}   opacity-0 transition-opacity duration-300 group-hover:opacity-100`}>
              Add a Leg
            </span>
          </div>
          </div>
        

      </div>

      {activeTabs[index] === 'completed' && (
        <div>
          {/* <div>
          <p>{trip.tripNumber}</p>
        </div> */}

         <div className='h-[240px] min-w-max w-full  overflow-y-auto rounded-b-md py-1 px-2'>
 <div className=" flex flex-col py-1">
      {Object.keys(completedItinerary).map(key => (
        <React.Fragment key={key}>
          {key !== 'formState' && completedItinerary[key].length > 0 && (
            <div className='w-full'>
              <div className='flex gap-2 font-cabin items-center text-neutral-600 py-1'>
              <img src={getIconForItinerary(key)} className='w-4 h-4' />
              <h2 className="text-md font-semibold  text-center">{key.charAt(0).toUpperCase() + key.slice(1)}</h2>
              {/* <h2 className="text-md font-semibold  text-center">{key.charAt(0).toUpperCase() + key.slice(1)}</h2> */}
              </div>
              <div className="" >
                {completedItinerary[key]?.map(item => (
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
      )}
      {activeTabs[index] === 'upcoming' && (
        <div>
         <div className='h-[240px] min-w-max w-full  overflow-y-auto rounded-b-md py-1 px-2'>
 <div className=" flex flex-col py-1">
      {Object.keys(upcomingItinerary).map(key => (
        <React.Fragment key={key}>
          {key !== 'formState' && upcomingItinerary[key].length > 0 && (
            <div className='w-full'>
              <div className='flex gap-2 font-cabin items-center text-neutral-600 py-1'>
              <img src={getIconForItinerary(key)} className='w-4 h-4' />
              <h2 className="text-md font-semibold  text-center">{key.charAt(0).toUpperCase() + key.slice(1)}</h2>
              {/* <h2 className="text-md font-semibold  text-center">{key.charAt(0).toUpperCase() + key.slice(1)}</h2> */}
              </div>
              <div className="" >
                {upcomingItinerary[key]?.map(item => (
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
      )}

      
    </div>
  );
};


const TravelExpenses = ()=>{


  return(
    <div>

    </div>
  )
}




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



