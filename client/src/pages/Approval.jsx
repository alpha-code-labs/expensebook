import React, { useState } from 'react';
import { getStatusClass ,titleCase} from '../utils/handyFunctions';
import { Alltrips } from '../components/trips/Alltrips';
import { receipt, chevron_down, calender, double_arrow , three_dot ,validation_sym, down_left_arrow} from '../assets/icon';
import Dropdown from '../components/common/Dropdown';
import RejectedTravel from '../components/travel/RejectedTravel';
import TravelExpense from '../components/settlement/TravelExpense';
import TrExpenseForApproval from '../components/approval/TrExpenseForApproval';
// import CashAdvance from '../components/settlement/CashAdvance';



const Approval = () => {  
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
  
  const [activeScreen, setActiveScreen] = useState('Travel & Cash Adv. Requests');
  const handleScreenChange = (screen) => {
    setActiveScreen(screen);
  };
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

    // const tripArray = [
    //   {
    //     travelName: 'Training Workshop in Las Vegas',
    //     from: 'Denver',
    //     to: 'Las Vegas',
    //     departureDate: '05-Feb-2024',
    //     returnDate: '10-Feb-2024',
    //     status: 'pending',
    //     cashAdvance: [
    //       {
    //         caId: '#CA0004',
    //         details: [
    //           {
    //             amount: '180.75',
    //             currencyType: 'USD',
    //           },
    //           {
    //             amount: '20000.75',
    //             currencyType: 'INR',
    //           },
    //           // {
    //           //   amount: '20000.00',
    //           //   currencyType: 'INR',
    //           // },
    //         ],
    //         date: '05-Feb-2024',
    //         violation: 'amt is within the limit',
    //         status: 'approved',
    //       },
    //       {
    //         caId: '#CA0005',
    //         details: [
            
    //           {
    //             amount: '180.25',
    //             currencyType: 'GBP',
    //           },
    //           {
    //             amount: '1500.00',
    //             currencyType: 'JPY',
    //           },
    //         ],
    //         date: '10-Feb-2024',
    //         violation: '',
    //         status: 'pending',
    //       },
    //     ],
    //   },
    //   {
    //     travelName: 'Conference in Paris',
    //     from: 'New York',
    //     to: 'Paris',
    //     departureDate: '15-Mar-2024',
    //     returnDate: '20-Mar-2024',
    //     status: 'approved',
    //     cashAdvance: [
    //       {
    //         caId: '#CA0006',
    //         details: [
    //           {
    //             amount: '300.00',
    //             currencyType: 'USD',
    //           },
    //           {
    //             amount: '350.75',
    //             currencyType: 'EUR',
    //           },
    //           {
    //             amount: '3000.00',
    //             currencyType: 'EUR',
    //           },
    //         ],
    //         date: '10-Mar-2024',
    //         violation: 'amt is within the limit',
    //         status: 'approved',
    //       },
    //     ],
    //   },
    //   {
    //     travelName: 'Vacation in Tokyo with Havillion Packerd feast Party in Lavasa',
    //     from: 'Los Angeles',
    //     to: 'Tokyo',
    //     departureDate: '01-Apr-2024',
    //     returnDate: '10-Apr-2024',
    //     status: 'pending',
    //     cashAdvance: [
    //       {
    //         caId: '#CA0007',
    //         details: [
    //           {
    //             amount: '400.00',
    //             currencyType: 'USD',
    //           },
    //           {
    //             amount: '450.50',
    //             currencyType: 'JPY',
    //           },
    //           {
    //             amount: '4000.00',
    //             currencyType: 'JPY',
    //           },
    //         ],
    //         date: '05-Apr-2024',
    //         violation: 'amt is within the limit',
    //         status: 'approved',
    //       },
    //     ],
    //   },
    //   {
    //     travelName: 'Vacation in Tokyo',
    //     from: 'Los Angeles',
    //     to: 'Tokyo',
    //     departureDate: '01-Apr-2024',
    //     returnDate: '10-Apr-2024',
    //     status: 'rejected',
    //     cashAdvance: [
    //       {
    //         caId: '#CA0007',
    //         details: [
    //           {
    //             amount: '400.00',
    //             currencyType: 'USD',
    //           },
    //           {
    //             amount: '450.50',
    //             currencyType: 'JPY',
    //           },
    //           {
    //             amount: '4000.00',
    //             currencyType: 'JPY',
    //           },
    //         ],
    //         date: '05-Apr-2024',
    //         violation: 'amt is within the limit',
    //         status: 'approved',
    //       },
    //     ],
    //   },
    //   {
    //     travelName: 'Business Trip to London',
    //     from: 'San Francisco',
    //     to: 'London',
    //     departureDate: '15-May-2024',
    //     returnDate: '20-May-2024',
    //     status: 'approved',
    //     cashAdvance: [
    //       // {
    //       //   caId: '#CA0008',
    //       //   details: [
    //       //     {
    //       //       amount: '250.00',
    //       //       currencyType: 'USD',
    //       //     },
    //       //     {
    //       //       amount: '280.75',
    //       //       currencyType: 'GBP',
    //       //     },
    //       //     {
    //       //       amount: '2500.00',
    //       //       currencyType: 'GBP',
    //       //     },
    //       //   ],
    //       //   date: '10-May-2024',
    //       //   violation: 'amt is within the limit',
    //       //   status: 'approved',
    //       // },
    //     ],
    //   },
    //   {
    //     travelName: 'Exploring Sydney',
    //     from: 'Chicago',
    //     to: 'Sydney',
    //     departureDate: '05-Jun-2024',
    //     returnDate: '10-Jun-2024',
    //     status: 'pending',
    //     cashAdvance: [
    //       {
    //         caId: '#CA0009',
    //         details: [
    //           {
    //             amount: '350.00',
    //             currencyType: 'USD',
    //           },
    //           {
    //             amount: '400.80',
    //             currencyType: 'AUD',
    //           },
    //           {
    //             amount: '3500.00',
    //             currencyType: 'AUD',
    //           },
    //         ],
    //         date: '01-Jun-2024',
    //         violation: 'amt is within the limit',
    //         status: 'pending',
    //       },
    //       {
    //         caId: '#CA0010',
    //         details: [
    //           {
    //             amount: '350.00',
    //             currencyType: 'USD',
    //           },
              
    //         ],
    //         date: '01-Jun-2024',
    //         violation: 'amt is within the limit',
    //         status: 'approved',
    //       },
    //     ],
    //   },
    // ];



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
            {/* <div className="h-auto min-h-[35px] max-h-[70px] sm:w-[900px]  gap-4 flex flex-start"> */}
              {/* <div className="flex flex-row items-center justify-start gap-2 sm:gap-4 font-cabin mb-2"> */}
                {/* <div className="rounded-xl flex flex-row items-start justify-start text-ebgrey-50"> */}
                  <div
                    className={`cursor-pointer py-1 px-2 w-auto min-w-[100px] truncate${
                      activeScreen === 'Travel & Cash Adv. Requests' ? 'font-medium rounded-xl bg-purple-500 text-xs text-gray-900 w-auto min-w-[100px] truncate' : ''
                    }`}
                    onClick={() => handleScreenChange('Travel & Cash Adv. Requests')}
                  >
                    Travel & Cash Adv. Requests
                  </div>
                {/* </div> */}
                <div
                  className={`cursor-pointer py-1 px-2 w-auto min-w-[100px] truncate ${
                    activeScreen === 'Travel & Non Travel Expenses' ? 'font-medium rounded-xl bg-purple-500 text-xs text-gray-900 w-auto min-w-[100px] truncate' : ''
                  }`}
                  onClick={() => handleScreenChange('Travel & Non Travel Expenses')}
                >
                Travel & Non Travel Expenses
                </div>
                

              {/* </div> */}
            {/* </div> */}
          </div>
          <div className="w-auto  max-w-[932px] h-auto lg:h-[581px] rounded-lg border-[1px] border-gray-200 shrink-0 font-cabin mt-3 sm:mt-6 shadow-[0px_12px_3px_rgba(0,_0,_0,_0),_0px_8px_3px_rgba(0,_0,_0,_0.01),_0px_4px_3px_rgba(0,_0,_0,_0.03),_0px_2px_2px_rgba(0,_0,_0,_0.05),_0px_0px_1px_rgba(0,_0,_0,_0.06)]">
           {activeScreen=== 'Travel & Cash Adv. Requests' && 
           <>
  {/* <div className='flex flex-row justify-between items-end px-8'> */}
  <div className="w-full  h-6 flex flex-row gap-3 mt-7 items-center px-8">
    <img className="w-6 h-6" src={receipt} alt="receipt" />
    <div className="text-base tracking-[0.02em] font-bold">Travel & Cash Adv. Requests</div>
  </div>

  {/* <div className='lg:ml-4 mt-4 lg:mt-0'>
    <div className='inline-flex h-8 w-auto  items-center justify-center bg-black text-white-100 flex-shrink rounded-lg'>
    <div className='text-center p-4 font-medium text-xs font-cabin' onClick={()=>(console.log("Add Travel Request"))}>Add Travel Request</div>
  </div>
  </div> */}
{/* </div>            */}

{/* <div className='flex flex-row'>

<div className="w-auto max-w-[100px] sm:max-w-[250px] flex flex-col sm:flex-row items-center sm:items-center justify-start gap-[8px] text-left text-gray-A300 mt-[25px] mx-11">
             <div className="relative font-medium">Select Status</div>
             <div className="relative w-[93px] h-8 text-sm text-black">
               <div className="absolute top-[-5px] left-[0px] rounded-md bg-white box-border w-[93px] h-8">
                 <Dropdown name="months" options={months} icon={chevron_down} />
               </div>
             </div>
           </div>  

           <div className='flex items-end'>
           <div className="w-[175px] h-10 flex flex-row  items-center justify-center text-justify text-sm text-ebgrey-400">
      <div className="self-stretch  rounded-md bg-white flex flex-row items-start justify-center py-3 px-6 relative border-[1px] border-solid border-ebgrey-200">
         <input 
          type="text" 
          placeholder="Employee Name" 
          className="absolute tracking-[0.01em] outline-none border-none"          
          />
      </div>
    </div>
           </div>

    
</div> */}

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
         <div className='h-[400px] overflow-auto mt-6 w-auto'>
            {tripArray.map((travelDetails ,index)=>(
              <>
            <div className="box w-auto max-w-[896px] h-auto  mx-2 sm:mx-4 mb-2  font-cabin">
            <div className="w-auto min-w-[400px] lg:w-[896px]  h-auto  lg:min-h-[56px] rounded-xl border-[1px] border-b-gray">
            <div className='w-auto max-w-[932px]  rounded-md'>
    <div className="w-auto max-w-[900px] bg-white-100 h-auto max-h-[180px] lg:h-[52px] flex flex-col lg:flex-row items-start lg:items-center justify:start lg:justify-center border-b-[1px] m-2 border-b-gray">    
    <div className='flex flex-auto flex-row w-full justify-between gap-2'>
    <div className='flex flex-1 flex-col lg:flex-row gap-0 md:gap-2'>
    {/* Trip Title */}

    <div className="flex h-[52px] items-center justify-start xl:w-[220px]  lg:w-[120px]   py-0 md:py-3 px-2 order-1">
      {/* <div className=" lg:text-[14px] xl:w-[220px]  lg:w-[120px] lg:truncate    text-[16px] text-left font-medium tracking-[0.03em] leading-normal text-gray-A300 font-cabin "> */}
      <div className="lg:text-[14px] text-[16px] text-left font-medium tracking-[0.03em] leading-normal text-gray-A300 font-cabin lg:truncate xl:w-[220px] lg:w-[120px]">
      {/* <div className="  lg:text-[16px] text-[14px] px-2 py-3  font-medium tracking-[0.03em] leading-normal text-gray-A300 font-cabin "> */}
        {/* {travelName} */}
       {travelDetails.travelName}
      </div>
    </div> 

    {/* Date */}
    <div className="flex   h-[52px] w-auto  items-center justify-start py-3 gap-1  lg:px-0 order-3 lg:order-2">
      <div className=' pl-2 md:pl-0'>
      <img src={calender} alt="calendar" className="w-[16px]"/>
      </div>
      <div className=" tracking-[0.03em] leading-normal text-gray-A300 text-[12px] lg:w-[221px] w-auto ">
        {/* {departureDate} to {returnDate} */}
        {travelDetails.departureDate} to {travelDetails.returnDate}
      </div>
    </div>
{/* Origin and Destination */}
    <div className="flex w-auto flex-col justify-center items-start lg:items-center min-w-[161px] h-auto lg:h-[52px] py-3 px-3 order-2 lg:order-3">
      <div className="flex  text-xs text-gray-A300 font-medium">
        <div>{travelDetails.to}</div>
        <img src={double_arrow} alt="double arrow" />
        <div>{travelDetails.from}</div>
      </div>
    </div>
    </div>

    {/* <div className='flex flex-col-reverse justify-between lg:flex-row'> */}
    
  

 <div className='flex flex-col-reverse justify-between lg:items-center items-end flex-1 lg:flex-row gap-2 '>
 {/* Status */}
 <div className="flex flex-1 h-[52px] px-2 py-3 items-center justify-center  w-auto">
  
  <div className={`flex items-center px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] ${
     getStatusClass(travelDetails.status)
    }`}
  >
    {titleCase(travelDetails.status)}
    
  </div>

</div>
 <div className="flex flex-1  h-[52px] px-2 py-3 items-center justify-center  w-[146px]">
  
  <div className={`flex items-center px-3 pt-[6px] pb-2 py-3 text-purple-500 font-cabin leading-normal text-[14px] font-bold tracking-[0.03em] `}
  >
    View Details
    
  </div>

</div>

    {/* //Dropdown for delete & modify */}
    {/* <div className="flex flex-none w-[40px] py-3 px-0 lg:px-3 cursor-pointer justify-center items-start lg:items-center relative">
      <img
        src={three_dot}
        alt="three dot"
        width={16}
        height={16}
        onClick={() => handleDropdownToggle(index)}
      />
      {dropdownStates[index] && (
        <div className="absolute top-8 right-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 bg-white-100">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            <li>
              <a
                href="#CA"
                className="block px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Cancel
              </a>
            </li>

            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Modify
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>    */}
 </div>
    
   
</div>
  </div>
  </div>
  <div className='h-auto'>
  {travelDetails.cashAdvance.map((caDetails,index)=>(
    <>
    <div className='flex flex-row items-center ml-0   lg:ml-32  sm:ml-28 gap-2 text-gray-200'>
  <div className='w-auto  mi min-w-[20px] flex justify-center items-center px-3 py-3 '>
  <img className='w-6 h-[20px] translate-y-[-2px]' src={down_left_arrow}/>
      
      
  </div>
  
  <div className='w-auto max-w-[100px] flex justify-center items-center px-3 py-2'>
 
  
    <div className='  text-[14px] tracking-[0.02em]  font-bold'>
       {caDetails.caId}
      </div>
  </div>
  <div className=' flex justify-center items-center w-auto min-w-[130px] h-[44px] px-3 py-2 sr-only  sm:not-sr-only'>
    <div className=' tracking-[0.03em] leading-normal text-[14px] text-center'>
      {caDetails.date}
    </div>
  </div> 
  <div className='flex w-auto sm:w-[170px] min-w-[120px] justify-center items-center px-0 sm:py-2 sm:px-3 font-cabin gap-2'>
    <div className='w-5 h-5'>
    {caDetails.violation.length>0 ?(
    <img src={validation_sym} alt='three dot' className='w-[20px] h-[20px] ' />
    ) :""}
    </div>
  <div className=' '>
    
      {caDetails.details.map((currencyDetails,index)=>(
      <>
      <div className='text-[14px]'>
      {currencyDetails.currencyType}
      {currencyDetails.amount},
      </div>
      </>
    ))}
  </div>
</div>

  <div className='w-[100px] py-2 px-3 flex justify-center items-center sr-only  sm:not-sr-only'>
    <div className={`w-auto max-w-[200px] min-w-[135px] text-center font-medium text-sm text-gray-300 `}>
      {titleCase(caDetails.status)}
    </div>
  </div>
  {/* <div className='w-[100px] py-2 px-3 flex justify-center items-center'>
    <div className={`w-auto max-w-[200px] font-medium text-sm text-red-700`}>
      Cancel
    </div>
  </div> */}
  </div>
    </>
  ))}
  </div>
      </div>
      </div>
              </>
            ))}
           </div>
           </>}
           {activeScreen=== 'Travel & Non Travel Expenses' && 
           <>
    <div className="w-auto h-6 flex flex-row gap-3 ml-8 mt-7 items-center">
      <img className="w-6 h-6" src={receipt} alt="receipt" />
      <div className="text-base tracking-[0.02em] font-bold w-auto">Travel & Non Travel Expenses</div>
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
   
           </>
           
           }


{activeScreen === 'Travel & Non Travel Expenses' && 
         <div className='w-auto scroll-mx-5 overflow-auto max-w-[932px] h-auto max-h-[380px] my-6'>

          {tripArray.map((travelDetails,index)=>(
            <>
            <div className='flex flex-row max-w-[952px] w-auto  justify-between items-center border-b-[1px]   border-b-gray min-h-[52px] h-auto  mx-6'>

<div className='flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center justify-center '>

<div className="flex  gap-1   py-3 px-2 ">
<div className=''>
<img src={calender} alt="calendar" className="w-[16px]"/>
</div>
<div className=" tracking-[0.03em] leading-normal text-gray-A300 text-[12px] w-[100px] ">

{travelDetails.departureDate}
</div>
</div>

<div className="  py-3 px-2">
<div className=" text-[16px] md:text-[14px] text-left font-medium tracking-[0.03em] leading-normal text-gray-A300 font-cabin truncate  w-[140px]  ">
{travelDetails.employeeName}
</div>
</div> 


<div className=" py-3 px-2">
<div className=" text-[14px] font-medium tracking-[0.03em] leading-normal text-gray-A300 font-cabin  w-[220px]   ">
{travelDetails.travelName}
</div>
</div> 
<div className="flex gap-1 py-3 px-2 ">
<div className='w-5 h-5'>
<img src={validation_sym} alt="validation" className="w-[16px]"/>
</div>
<div className=" tracking-[0.03em] leading-normal text-gray-A300 text-[12px]  w-[100px]">

$5000.00
</div>
</div>



</div>

<div className="flex h-[52px] px-2 py-3   ">

<div className={` flex justify-center text-center items-center  px-3 pt-[6px] pb-2 py-3 text-purple-500 font-cabin leading-normal text-[14px] font-bold tracking-[0.03em] w-[140px] `}
>
View Details

</div>





</div>

</div>
            </>
          ))}

         </div>}


          </div>
        </div>
      {/* </div> */}
    </>
  );
};

export default Approval;