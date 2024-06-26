import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../api/DataProvider';

import { getStatusClass ,titleCase, urlRedirection} from '../utils/handyFunctions';
import { Alltrips } from '../components/trips/Alltrips';
import { airplane_1, receipt} from '../assets/icon';
import RejectedExpense from '../components/expense/RejectedExpense';
import CompletedTrips from '../components/expense/CompletedTrips'
import AllExpense from '../components/expense/AllExpense';
import {handleNonTravelExpense, handleTravelExpense,handleTrip} from '../utils/actionHandler';
// import CashAdvance from '../components/settlement/CashAdvance';



const Expense = ({fetchData}) => { 

  const {tenantId,empId,page}= useParams();
  

  useEffect(()=>{
    fetchData(tenantId,empId,page)
  },[])

  const { employeeData } = useData();
  const [reimbursementExpenseData , setReimbursementExpenseData]=useState([]);
  const [completedTrip,setCompletedTrip]=useState(null);
///this is for backend data when we will get

  useEffect(()=>{
    const reimbursementExpenses = employeeData?.trip?.nonTravelExpenseReports
    console.log('reimbursement data',reimbursementExpenses)
    setCompletedTrip()
    
  },[employeeData])
  
  
 

 
 
  
  const [activeScreen, setActiveScreen] = useState('Travel & Reimbursement Expenses');
  const handleScreenChange = (screen) => {
    setActiveScreen(screen);
  };


  
    const tripArray = [
      {
        tripId: 'TR0001',
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
        tripId: 'TR0002',
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
   
    ];



 


    
  return (
    <>
      {/* <div className="bg-white-100 lg:flex"> */}
      
<div className="w-auto min-h-screen flex flex-col px-2 lg:px-10 xl:px-20  pt-[50px] bg-slate-100  ">
          

 
  <div className='flex flex-col w-full items-center'>
  <div className=" flex flex-col sm:flex-row  items-center justify-start gap-2 sm:gap-4 font-cabin mb-2">

<div
  className={`cursor-pointer   py-1 px-2 w-auto min-w-[100px] rounded-xl  truncate${
    activeScreen === 'Travel & Reimbursement Expenses' ? 'font-medium rounded-xl bg-purple-500 text-xs text-gray-900 w-auto min-w-[100px] truncate' : ' bg-white-100 rounded-xl'
  }`}
  onClick={() => handleScreenChange('Travel & Reimbursement Expenses')}
>
  Travel & reimbursement Expenses
</div>

<div
className={`cursor-pointer py-1 px-2 w-auto min-w-[100px] truncate ${
  activeScreen === 'Completed Trips' ? 'font-medium rounded-xl bg-purple-500 text-xs text-gray-900 w-auto min-w-[100px] truncate' : 'bg-white-100 rounded-xl'
}`}
onClick={() => handleScreenChange('Completed Trips')}
>
Completed Trips
</div>
<div
className={`cursor-pointer py-1 px-2 w-auto min-w-[100px] truncate${
  activeScreen === 'Rejected Expenses' ? 'font-medium rounded-xl bg-purple-500 text-xs text-gray-900 w-auto min-w-[100px] truncate' : ' bg-white-100 rounded-xl'
}`}
onClick={() => handleScreenChange('Rejected Expenses')}
>
Rejected Expenses
</div>


</div>
 
<div className="  w-full h-auto lg:h-[581px] rounded-lg  bg-white-100 border-[1px] border-slate-300 shrink-0 font-cabin mt-3 sm:mt-6 ">
           {activeScreen=== 'Travel & Reimbursement Expenses' && 
           <>
           <div className='flex flex-row justify-between items-end sm:px-8 px-4'>
  <div className=" h-6 flex flex-row gap-3 mt-7 items-center">
    <img className="w-6 h-6" src={receipt} alt="receipt" />
    <div className="text-base tracking-[0.02em] font-bold truncate">Travel & Reimbursement Expenses</div>
  </div>
  <div className='lg:ml-4 cursor-pointer px-4'>
    <div className='float-right inline-flex h-8 w-auto  items-center justify-center bg-indigo-600 text-white-100 flex-shrink rounded-lg'>
      <div className='text-center p-4 font-medium text-xs font-cabin' onClick={()=>handleNonTravelExpense("","non-tr-ex-create")}>Book an Expense</div>
    </div>
  </div>
</div>                       
<div className="box-border mx-4 mt-[46px] w-auto border-[1px] border-b-gray"/>
<div className='h-auto'>
  <AllExpense tripArray={tripArray} handleTravelExpense={handleTravelExpense} handleNonTravelExpense={handleNonTravelExpense}/>
</div>
</>}

{activeScreen === 'Completed Trips'  && 
  <>
    <div className="w-auto h-6 flex flex-row gap-3 ml-8 mt-7 items-center">
      <img className="w-6 h-5" src={airplane_1} alt="receipt" />
      <div className="text-base tracking-[0.02em] font-bold w-auto">Completed Trips</div>
    </div>
    {/* <div className={`mx-8 py-1 w-auto font-medium text-sm text-red-700 mt-10`}>
      *Please submit your expenses before 90 days
    </div> */}
    
    <div className="box-border mx-4 mt-[46px] w-auto  border-[1px]  border-b-gray "/>
    <div className='h-[420px] overflow-auto mt-6 w-auto'>
         
    <CompletedTrips tripArray={tripArray} handleTravelExpense={handleTravelExpense} handleTrip={handleTrip}/>
      </div>   
           </>
           }
           {activeScreen=== 'Rejected Expenses' && 
           <>
           <div className="w-auto h-6 flex flex-row gap-3 ml-8 mt-7 items-center">
      <img className="w-6 h-6" src={receipt} alt="receipt" />
      <div className="text-base tracking-[0.02em] font-bold w-auto">Rejected Expenses</div>
    </div>
    <div className="box-border mx-4  mt-[46px] w-auto    border-[1px]  border-b-gray "/>
    <div className='h-[420px]'>
           <RejectedExpense handleTravelExpense={handleTravelExpense} handleNonTravelExpense={handleNonTravelExpense}/>
    </div>
           </>
           }
        </div>
</div>
        </div>
      {/* </div> */}
    </>
  );
};

export default Expense;