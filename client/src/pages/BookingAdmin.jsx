import React, { useState } from 'react';

import { getStatusClass ,titleCase} from '../utils/handyFunctions';
import { Alltrips } from '../components/trips/Alltrips';
import { receipt, chevron_down, calender, double_arrow , three_dot ,validation_sym, down_left_arrow} from '../assets/icon';
import Dropdown from '../components/common/Dropdown';
import PendingTrBooking from '../components/travelAdmin/PendingTrBooking'
import TrExpenseForApproval from '../components/approval/TrExpenseForApproval';
import CancelledTrRequest from '../components/trips/CancelledTrip';
// import CashAdvance from '../components/settlement/CashAdvance';



const BookingAdmin = () => {  
  // const [DropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownStates, setDropdownStates] = useState({});

  // const handleDropdownToggle = () => {
  //   setDropdownOpen(!DropdownOpen);
  // };
  

  

  const handleDropdownToggle = (index) => {
    setDropdownStates((prevStates) => ({
      ...prevStates,
      [index]: !prevStates[index],
    }));
  };
  
  const [activeScreen, setActiveScreen] = useState('Pending Bookings');
  const handleScreenChange = (screen) => {
    setActiveScreen(screen);
  };
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];




    const tripArray = [
        {
          trId: 'TR0001',
          employeeName:'Narendra AshwindHarish Kumar Verma',
          travelName: 'Training Workshop in Las Vegas Las Vegas',
          from: 'Denver',
          to: 'Las Vegas',
          departureDate: '05-Feb-2024',
          returnDate: '10-Feb-2024',
          status: 'pending settlement',
          cashAdvance: [
            {
              caId: '#CA0004',
              details: [
                {
                  amount: '180.75',
                  currencyType: 'USD',
                },
                {
                  amount: '20000.75',
                  currencyType: 'INR',
                },
                // {
                //   amount: '20000.00',
                //   currencyType: 'INR',
                // },
              ],
              date: '05-Feb-2024',
              violation: 'amt is within the limit',
              status: 'rejected',
            },
            {
              caId: '#CA0005',
              details: [
              
                {
                  amount: '180.25',
                  currencyType: 'GBP',
                },
                {
                  amount: '1500.00',
                  currencyType: 'JPY',
                },
              ],
              date: '10-Feb-2024',
              violation: '',
              status: 'pending settlement',
            },
          ],
        },
        {
          trId: 'TR0003',
          employeeName:'Narendra Ashwind',
          travelName: 'Conference in Paris',
          from: 'New York',
          to: 'Paris',
          departureDate: '15-Mar-2024',
          returnDate: '20-Mar-2024',
          status: 'approved',
          cashAdvance: [
            {
              caId: '#CA0006',
              details: [
                {
                  amount: '300.00',
                  currencyType: 'USD',
                },
                {
                  amount: '350.75',
                  currencyType: 'EUR',
                },
                {
                  amount: '3000.00',
                  currencyType: 'EUR',
                },
              ],
              date: '10-Mar-2024',
              violation: 'amt is within the limit',
              status: 'rejected',
            },
          ],
        },
        {
          trId: 'TR0003',
          employeeName:'Narendra Ashwind',
          travelName: 'Vacation in Tokyo',
          from: 'Los Angeles',
          to: 'Tokyo',
          departureDate: '01-Apr-2024',
          returnDate: '10-Apr-2024',
          status: 'cancelled',
          cashAdvance: [
            {
              caId: '#CA0007',
              details: [
                {
                  amount: '400.00',
                  currencyType: 'USD',
                },
                {
                  amount: '450.50',
                  currencyType: 'JPY',
                },
                {
                  amount: '4000.00',
                  currencyType: 'JPY',
                },
              ],
              date: '05-Apr-2024',
              violation: 'amt is within the limit',
              status: 'approved',
            },
          ],
        },
        {
          trId: 'TR0004',
          employeeName:'Narendra Ashwind',
          travelName: 'Vacation in Tokyo',
          from: 'Los Angeles',
          to: 'Tokyo',
          departureDate: '01-Apr-2024',
          returnDate: '10-Apr-2024',
          status: 'pending approval',
          cashAdvance: [
            {
              caId: '#CA0007',
              details: [
                {
                  amount: '400.00',
                  currencyType: 'USD',
                },
                {
                  amount: '450.50',
                  currencyType: 'JPY',
                },
                {
                  amount: '4000.00',
                  currencyType: 'JPY',
                },
              ],
              date: '05-Apr-2024',
              violation: 'amt is within the limit',
              status: 'approved',
            },
          ],
        },
        {
          trId: 'TR0005',
          employeeName:'Narendra Ashwind',
          travelName: 'Business Trip to London',
          from: 'San Francisco',
          to: 'London',
          departureDate: '15-May-2024',
          returnDate: '20-May-2024',
          status: 'approved',
          cashAdvance: [
            // {
            //   caId: '#CA0008',
            //   details: [
            //     {
            //       amount: '250.00',
            //       currencyType: 'USD',
            //     },
            //     {
            //       amount: '280.75',
            //       currencyType: 'GBP',
            //     },
            //     {
            //       amount: '2500.00',
            //       currencyType: 'GBP',
            //     },
            //   ],
            //   date: '10-May-2024',
            //   violation: 'amt is within the limit',
            //   status: 'approved',
            // },
          ],
        },
        {
          trId: 'TR0006',
          employeeName:'Narendra Ashwind',
          travelName: 'Exploring Sydney',
          from: 'Chicago',
          to: 'Sydney',
          departureDate: '05-Jun-2024',
          returnDate: '10-Jun-2024',
          status: 'rejected',
          cashAdvance: [
            {
              caId: '#CA0009',
              details: [
                {
                  amount: '350.00',
                  currencyType: 'USD',
                },
                {
                  amount: '400.80',
                  currencyType: 'AUD',
                },
                {
                  amount: '3500.00',
                  currencyType: 'AUD',
                },
              ],
              date: '01-Jun-2024',
              violation: 'amt is within the limit',
              status: 'cancelled',
            },
            {
              caId: '#CA0010',
              details: [
                {
                  amount: '350.00',
                  currencyType: 'USD',
                },
                
              ],
              date: '01-Jun-2024',
              violation: 'amt is within the limit',
              status: 'approved',
            },
          ],
        },
        {
          trId: 'TR0007',
          employeeName:'Narendra Ashwind',
          travelName: 'Exploring Sydney',
          from: 'Chicago',
          to: 'Sydney',
          departureDate: '05-Jun-2024',
          returnDate: '10-Jun-2024',
          status: 'rejected',
          cashAdvance: [
            {
              caId: '#CA0009',
              details: [
                {
                  amount: '350.00',
                  currencyType: 'USD',
                },
                {
                  amount: '400.80',
                  currencyType: 'AUD',
                },
                {
                  amount: '3500.00',
                  currencyType: 'AUD',
                },
              ],
              date: '01-Jun-2024',
              violation: 'amt is within the limit',
              status: 'cancelled',
            },
            {
              caId: '#CA0010',
              details: [
                {
                  amount: '350.00',
                  currencyType: 'USD',
                },
                
              ],
              date: '01-Jun-2024',
              violation: 'amt is within the limit',
              status: 'pending approval',
            },
          ],
        },
        {
          trId: 'TR0008',
          employeeName:'Narendra Ashwind',
          travelName: 'Exploring Sydney',
          from: 'Chicago',
          to: 'Sydney',
          departureDate: '05-Jun-2024',
          returnDate: '10-Jun-2024',
          status: 'rejected',
          cashAdvance: [
            {
              caId: '#CA0009',
              details: [
                {
                  amount: '350.00',
                  currencyType: 'USD',
                },
                {
                  amount: '400.80',
                  currencyType: 'AUD',
                },
                {
                  amount: '3500.00',
                  currencyType: 'AUD',
                },
              ],
              date: '01-Jun-2024',
              violation: 'amt is within the limit',
              status: 'rejected',
            },
            {
              caId: '#CA0010',
              details: [
                {
                  amount: '350.00',
                  currencyType: 'USD',
                },
                
              ],
              date: '01-Jun-2024',
              violation: 'amt is within the limit',
              status: 'rejected',
            },
          ],
        },
      ];
  return (
    <>
      {/* <div className="bg-white-100 lg:flex"> */}
      <div className="w-auto  flex flex-col lg:w-auto lg:ml-[292px] lg:mr-12 mt-[50px] bg-white-100  mr-21">
         
          <div className=" pl-4 flex flex-row items-center justify-start gap-2 sm:gap-4 font-cabin mb-2">

                  <div
                    className={`cursor-pointer py-1 px-2 w-auto min-w-[100px] truncate${
                      activeScreen === 'Pending Bookings' ? 'font-medium rounded-xl bg-purple-500 text-xs text-gray-900 w-auto min-w-[100px] truncate' : ''
                    }`}
                    onClick={() => handleScreenChange('Pending Bookings')}
                  >
                    Pending Bookings
                  </div>
                {/* </div> */}
                <div
                  className={`cursor-pointer py-1 px-2 w-auto min-w-[100px] truncate ${
                    activeScreen === 'Cancelled Trips' ? 'font-medium rounded-xl bg-purple-500 text-xs text-gray-900 w-auto min-w-[100px] truncate' : ''
                  }`}
                  onClick={() => handleScreenChange('Cancelled Trips')}
                >
                Cancelled Trips
                </div>
                

              {/* </div> */}
            {/* </div> */}
          </div>
          <div className="w-auto  max-w-[932px] h-auto lg:h-[581px] rounded-lg border-[1px] border-gray-200 shrink-0 font-cabin mt-3 sm:mt-6 shadow-[0px_12px_3px_rgba(0,_0,_0,_0),_0px_8px_3px_rgba(0,_0,_0,_0.01),_0px_4px_3px_rgba(0,_0,_0,_0.03),_0px_2px_2px_rgba(0,_0,_0,_0.05),_0px_0px_1px_rgba(0,_0,_0,_0.06)]">
           {activeScreen=== 'Pending Bookings' && 
           <>
  {/* <div className='flex flex-row justify-between items-end px-8'> */}
  <div className=" px-8 w-full h-6 flex flex-row gap-3 mt-7 items-center">
    <img className="w-6 h-6" src={receipt} alt="receipt" />
    <div className="text-base tracking-[0.02em] font-bold">Pending Bookings</div>
  </div>



<div className='flex flex-col lg:flex-row  w-[220px] lg:w-[500px]  gap-4 mt-[25px] mx-11'>
   
    
    {/* <div className="w-auto flex-1 h-8 flex   items-center justify-center text-justify text-sm text-ebgrey-400"> */}
      <div className="w-auto w-max-[210px] self-stretch  rounded-md bg-white flex flex-row items-center h-[31px]   justify-center py-3 px-3  border-[1px] border-solid border-ebgrey-200">
         <input 
          type="text" 
          placeholder="Search by Employee Name" 
          className=" tracking-[0.01em] outline-none text-[12px] w-[206px] border-none placeholder:text-[12px] "          
          />
      </div>

    {/* </div> */}
   

    <div  className='flex flex-1 flex-row gap-2 items-center w-auto max-w-[210px]'>
    <div className="relative font-medium">Select Status</div>
             <div className="relative w-[93px] h-8 text-sm text-black">
               <div className="absolute top-[-5px] left-[0px] rounded-md bg-white box-border w-[93px] h-8">
                 <Dropdown name="months" options={months} icon={chevron_down} />
               </div>
             </div>
           
        
    </div>
</div>
                     
            <div className="box-border mx-4 mt-[46px] w-auto max-w-[932px]  h-px border-t-[1px]  border-b-gray "/>
           {/* //data div */}
         <div className='h-[380px] overflow-y-auto overflow-x-hidden mt-6 w-auto max-w-[930px]'>
            {tripArray.map((travelDetails ,index)=>(
              <PendingTrBooking key={index} {...travelDetails}/>
            ))}
           </div>
           </>}
           {activeScreen=== 'Cancelled Trips' && 
           <>
           <div className="w-auto h-6 flex flex-row gap-3 ml-8 mt-7 items-center">
      <img className="w-6 h-6" src={receipt} alt="receipt" />
      <div className="text-base tracking-[0.02em] font-bold w-auto">Cancelled Trips</div>
    </div>
    <div className="box-border mx-4 mt-[46px] w-auto max-w-[932px]  h-px border-t-[1px]  border-b-gray "/>
    <div className=' h-auto max-h-[420px] overflow-auto  mt-6 w-auto'>
           {tripArray.map((travelDetails, index)=>
           (<CancelledTrRequest key={index} {...travelDetails}/>))}
           </div>
           </>
           
           }


          </div>
        </div>
      {/* </div> */}
    </>
  );
};

export default BookingAdmin;