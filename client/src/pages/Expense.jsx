import React, { useState } from 'react';
import { briefcase, modify, receipt, receipt_icon1, categoryIcons, filter_icon } from '../assets/icon';
import { formatAmount, getStatusClass } from '../utils/handyFunctions';
import { travelExpense, nonTravelExpense } from '../utils/dummyData';

const Expense = () => {
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const handleStatusClick = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const filterExpenses = (expenses) => {
    return expenses.filter((expense) =>
      selectedStatuses.length === 0 ||
      selectedStatuses.includes(expense?.expenseHeaderStatus)
    );
  };

  const getStatusCount = (status, expenses) => {
    return expenses.filter((expense) => expense?.expenseHeaderStatus === status).length;
  };

  const disableButton = (status) => {
    return ['draft', 'cancelled'].includes(status);
  };

  return (
    <div className='min-h-screen'>
      <div className='flex-col w-full p-4 flex items-start gap-2'>
      <div className='min-h-[120px] border border-slate-300 bg-white-100 rounded-md  w-full flex flex-wrap items-start gap-2 px-2 py-2'>
        <div className='flex items-center justify-center p-2 bg-slate-100 rounded-full border border-slate-300 '><img src={filter_icon} className='w-5 h-5'/></div>
  {["draft","pending approval", "pending settlement", "paid",  "cancelled", "paid and cancelled"].map((status) => {
    const statusCount = getStatusCount(status, [...travelExpense.flatMap(te => te.travelExpenseData), ...nonTravelExpense]);
    const isDisabled = statusCount === 0;
    
    return (
      <div key={status} className={`flex items-center  ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
        <div
          onClick={() => !isDisabled && handleStatusClick(status)}
          className={`ring-1 ring-white-100 flex py-1 pr-3 text-center rounded-sm ${selectedStatuses.includes(status) ? getStatusClass(status ?? "-") : "bg-slate-100 text-neutral-700 border border-slate-300"}`}
        >
          <p className='px-1 py-1 text-sm text-center capitalize font-cabin'>{status ?? "-"}</p>
        </div>
        <div className={`shadow-md shadow-black/30 font-semibold -translate-x-3 ring-1 rounded-full ring-white-100 w-6 h-6 flex justify-center items-center text-center text-xs ${selectedStatuses.includes(status) ? getStatusClass(status ?? "-") : "bg-slate-100 text-neutral-700 border border-slate-300 "}`}>
          <p>{statusCount}</p>
        </div>
      </div>
    );
  })}
  <div className='text-neutral-700 text-base flex justify-center items-center hover:text-red-200 hover:font-semibold text-center w-auto h-[36px] font-cabin cursor-pointer' onClick={() => setSelectedStatuses([])}>Clear All</div>
</div>

       

        <div className='w-full flex md:flex-row flex-col'>
          <div className='flex-1 justify-center items-center'>
            <div className='relative flex justify-center items-center rounded-l-md font-inter text-md text-white-100 h-[52px] bg-indigo-600 text-center'>
              <div className='flex justify-center items-center'>
                <img src={receipt_icon1} className='w-6 h-6 mr-2' />
                <p>Travel Expenses</p>
              </div>
            </div>
            <div className='w-full mt-4 xl:h-[570px] lg:h-[370px] md:[590px] overflow-y-auto px-2'>
              {travelExpense.map((trip, index) => {
                const filteredTripExpenses = filterExpenses(trip?.travelExpenseData);
                if (filteredTripExpenses.length === 0) return null; // Skip rendering if no expenses match the selected statuses

                return (
                  <div key={`${index}-tr-expense`} className='mb-4 text-neutral-700 rounded-md shadow-custom-light bg-white-100 p-4'>
                    <div className='flex gap-2 items-center '>
                      <img src={briefcase} className='w-4 h-4' />
                      <div className='font-medium font-cabin text-md uppercase'>
                        {trip.tripName}
                      </div>
                    </div>
                    <div className='mt-2 space-y-2'>
                      {filteredTripExpenses.map((trExpense, index) => (
                        <div key={index} className='border border-slate-300 rounded-md px-2 py-1'>
                          <div className='flex flex-row justify-between items-center py-1 border-b border-slate-300 font-cabin font-xs'>
                            <div className={`text-center rounded-sm ${getStatusClass(trExpense?.expenseHeaderStatus ?? "-")}`}>
                              <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{trExpense?.expenseHeaderStatus ?? "-"}</p>
                            </div>
                            <div onClick={() => { "" }} className={`w-7 h-7 bg-indigo-100 rounded-full border border-white-100 flex items-center justify-center ${disableButton(trip?.travelRequestStatus) ? ' cursor-not-allowed opacity-50' : ' cursor-pointer'}`}>
                              <img src={modify} className='w-4 h-4' alt="modify_icon" />
                            </div>
                          </div>
                          <div className='overflow-x-hidden overflow-y-auto max-h-[236px] py-1 pt-2 h-auto px-2 space-y-2'>
                            {trExpense?.expenseLines.map((line, index) => (
                              <div key={`${index}-line`} className='flex  text-neutral-700 flex-row justify-between items-center font-cabin text-sm'>
                                <div className='bg-indigo-50 border-2 shadow-md shadow-slate-900/50 translate-x-4 border-white-100 p-2 rounded-full'>
                                  <img src={categoryIcons?.[line?.["Category Name"]]} className='w-4 h-4' />
                                </div>
                                <div className='flex border-slate-400 border flex-row justify-between text-neutral-700 flex-1 items-center gap-2 py-4 px-4 pl-6 rounded-md bg-slate-200'>
                                  <div>{line?.["Category Name"]}</div>
                                  <div>{line?.["Currency"]?.shortName} {formatAmount(line?.["Total Amount"])}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className='flex-1'>
            <div className='flex justify-center items-center rounded-r-md font-inter text-md text-white-100 h-[52px] bg-indigo-600 text-center'>
              <img src={receipt_icon1} className='w-6 h-6 mr-2' />
              <p>Non-Travel Expenses</p>
            </div>
            <div className='w-full mt-4 xl:h-[570px] lg:h-[370px] md:[590px] overflow-y-auto px-2'>
              {filterExpenses(nonTravelExpense)?.map((nonTravelExp, index) => (
                <div key={`${index}-nonTr-expense`} className='mb-4 text-neutral-700 rounded-md shadow-custom-light bg-white-100 p-4'>
                  <div className='flex flex-row justify-between'>
                    <div className='flex gap-2 items-center '>
                      <img src={receipt} className='w-5 h-5' />
                      <div className='font-medium font-cabin text-neutral-700'>
                        <div className='text-neutral-400 text-sm'>Expense Header No.</div>
                        <p className='text-base'>{nonTravelExp?.expenseHeaderNumber}</p>
                      </div>
                    </div>
                    <div className='flex flex-row gap-2 justify-between items-center font-cabin font-xs'>
                      <div className={`text-center rounded-sm ${getStatusClass(nonTravelExp?.expenseHeaderStatus ?? "-")}`}>
                        <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{nonTravelExp?.expenseHeaderStatus ?? "-"}</p>
                      </div>
                      <div onClick={() => { "" }} className={`w-7 h-7 bg-indigo-100 rounded-full border border-white-100 flex items-center justify-center ${disableButton(nonTravelExp?.travelRequestStatus) ? ' cursor-not-allowed opacity-50' : ' cursor-pointer'}`}>
                        <img src={modify} className='w-4 h-4' alt="modify_icon" />
                      </div>
                    </div>
                  </div>
                  <div className='border border-slate-300 rounded-md px-2 py-1 mt-2 overflow-x-hidden overflow-y-auto max-h-[242px]'>
                    {nonTravelExp?.expenseLines.map((line, index) => (
                      <div key={`${index}-line`} className='flex text-neutral-700 py-1 px-2 flex-row justify-between items-center font-cabin text-sm'>
                        <div className='bg-indigo-50 border-2 shadow-md shadow-slate-900/50 translate-x-4 border-white-100 p-2 rounded-full'>
                          <img src={categoryIcons?.[line?.["Category Name"]] ?? categoryIcons?.["Receipt"]} className='w-4 h-4' />
                        </div>
                        <div className='flex border-slate-400 border  flex-row justify-between text-neutral-700 flex-1 items-center gap-2 py-4 px-4 pl-6 rounded-md bg-slate-200'>
                          <div>{line?.["Category Name"]}</div>
                          <div>{line?.["Currency"]?.shortName} {formatAmount(line?.["Total Amount"])}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expense;




// import React, { useEffect, useState } from 'react';
// import { briefcase, cancel, categoryIcons, modify, money, money1, plus_violet_icon, receipt, receipt_icon1 } from '../assets/icon';
// import { formatAmount, getStatusClass } from '../utils/handyFunctions';
// import {TRCashadvance,NonTRCashAdvances, nonTravelExpense} from '../utils/dummyData'
// import Modal from '../components/Modal';
// import TripSearch from '../components/common/TripSearch';
// import Button1 from '../components/common/Button1';
// import { handleCashAdvance } from '../utils/actionHandler';
// import { travelExpense } from '../utils/dummyData';
// import TravelMS from './TravelMS';

// const Expense = () => {
 
//   const [visible, setVisible]=useState(false) //for iframe
//   const [advancetype , setAdvanceType]=useState(null)
//   const [textVisible,setTextVisible]=useState({cashAdvance:false}) //for icon text
//   const [modalOpen , setModalOpen]=useState(false)

//   const [error , setError]= useState({
//     travelRequestId: {set:false, message:""}
//   })

//   const [selectedStatuses, setSelectedStatuses] = useState([]);

//   const handleStatusClick = (status) => {
//     setSelectedStatuses((prev) =>
//       prev.includes(status)
//         ? prev.filter((s) => s !== status)
//         : [...prev, status]
//     );
//   };

//   const filterExpenses = (expenses) => {
//     return expenses.filter((expense) =>
//       selectedStatuses.length === 0 ||
//       selectedStatuses.includes(expense?.expenseHeaderstatus)
//     );
//   };

// const travelExpenses = travelExpense.flatMap(te => te.travelExpenseData);
// const nonTravelExpenses = nonTravelExpense;
// const allExpenses = [...travelExpenses, ...nonTravelExpenses];

// const getStatusCount = (status, expenses) => {
//   return expenses.filter((expense) => expense?.expenseHeaderStatus === status).length;
// };

 
 

//   function disableButton(status){
//     return ['draft','cancelled'].includes(status);
//   }
// ///cashadvance iframe





//   return (
//     <div className='min-h-screen'>
     
//       <div className='flex-col w-full p-4 flex items-start'>
      
//         <div className='min-h-[120px] border w-full flex flex-row items-center justify-between'>

//        {["pending approval", "pending settlement", "paid", "draft" , "cancelled" , "paid and cancelled"].map((status)=>(
//             <div onClick={() => handleStatusClick(status)} key={status} className={`flex flex-row cursor-pointer text-center rounded-sm  ${selectedStatuses.includes(status) ? getStatusClass(status ?? "-") : "bg-gray-200 text-black"}`}>
//             <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{status ?? "-"}</p>
//             <div className=''><p>({getStatusCount(status, allExpenses)})</p></div>
//             </div>
//        ))}
        
         


//         </div>

//         <div className='font-cabin cursor-pointer' onClick={()=>setSelectedStatuses([])}>Clear All</div>

//         <div className='w-full flex md:flex-row flex-col'>
//           <div className='flex-1 justify-center items-center'>
         
// <div className='relative  flex justify-center items-center  rounded-l-md   font-inter text-md text-white-100 h-[52px] bg-indigo-600  text-center'>


  
             
//               <div className='flex justify-center items-center'>
//               <img src={receipt_icon1} className='w-6 h-6 mr-2' />
//               <p>Travel Expenses</p>
//               </div>

//             </div>




            
//       <div className='w-full mt-4 xl:h-[570px] lg:h-[370px] md:[590px] overflow-y-auto px-2'>
//           {travelExpense.map((trip,index) => (
//             <div key={`${index}-tr-expense`} className='mb-4 text-neutral-700 rounded-md shadow-custom-light bg-white-100 p-4'>
//               <div className='flex gap-2 items-center '>
//               <img src={briefcase} className='w-4 h-4'/>
//               <div className='font-medium font-cabin text-md  uppercase'>
//                {trip.tripName}
//               </div>
//               </div>
              
//               <div className='mt-2 space-y-2'>
//                 {filterExpenses(trip?.travelExpenseData).map((trExpense, index)=>(
//                   <div key={index} className='border border-slate-300 rounded-md px-2 py-1' >
//                     <div className='flex flex-row justify-between items-center py-1 border-b border-slate-300 font-cabin font-xs'>

//                     <div className={`text-center rounded-sm ${getStatusClass(trExpense?.expenseHeaderStatus ?? "-")}`}>
//                        <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{trExpense?.expenseHeaderStatus ?? "-"}</p>
//                     </div>

//                     <div onClick={()=>{""}} className={`w-7 h-7 bg-indigo-100 rounded-full border border-white-100 flex items-center justify-center ${disableButton(trip?.travelRequestStatus)? ' cursor-not-allowed opacity-50' : ' cursor-pointer'}`}>
//                     <img src={modify} className='w-4 h-4' alt="modify_icon" />
//                   </div>

//                   </div>
//                   <div className='overflow-x-hidden  overflow-y-auto max-h-[236px] py-1 pt-2 h-auto  px-2 space-y-2 '>
                    
//                     {trExpense?.expenseLines.map((line, index)=>((
//                       <div key={`${index}-line`} className='flex text-neutral-700  flex-row justify-between items-center font-cabin  text-sm' >
//                          <div className='bg-indigo-50 border-2 shadow-md shadow-slate-900/50 translate-x-4 border-white-100 p-2 rounded-full'><img src={categoryIcons?.[line?.["Category Name"]]} className='w-4 h-4'/></div>
//                         <div className='flex flex-row justify-between text-neutral-700   flex-1 items-center gap-2 py-4 px-4 pl-6 rounded-md bg-slate-200'>
//                           <div>{line?.["Category Name"]}</div>
//                           <div>{line?.["Currency"]?.shortName} {formatAmount(line?.["Total Amount"])}</div>
//                         </div> 
                         
//                       </div>
//                     )))}
                    
//                   </div>


//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//           </div>





//           <div className='flex-1'>
//             <div className='flex justify-center items-center rounded-r-md font-inter text-md text-white-100 h-[52px] bg-indigo-600  text-center'>
//               <img src={receipt_icon1} className='w-6 h-6 mr-2' />
//               <p>Non-Travel Expenses</p>
//             </div>
//             <div className='w-full mt-4 xl:h-[570px] lg:h-[370px] md:[590px] overflow-y-auto px-2'>
//           {filterExpenses(nonTravelExpense)?.map((nonTravelExp,index) => (
//             <div key={`${index}-nonTr-expense`} className='mb-4 text-neutral-700 rounded-md shadow-custom-light bg-white-100 p-4'>
//              <div className='flex flex-row justify-between'>
//               <div className='flex gap-2 items-center '>
//               <img src={receipt} className='w-5 h-5'/>
//               <div className='font-medium font-cabin text-neutral-700'>
//               <div className='text-neutral-400 text-sm'>Expense Header No.</div>
//                <p className='text-base'>{nonTravelExp?.expenseHeaderNumber}</p>
//               </div>
//               </div>
//                <div className='flex flex-row gap-2 justify-between items-center font-cabin font-xs'>

//                     <div className={`text-center rounded-sm ${getStatusClass(nonTravelExp?.expenseHeaderStatus ?? "-")}`}>
//                        <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{nonTravelExp?.expenseHeaderStatus ?? "-"}</p>
//                     </div>

//                     <div onClick={()=>{""}} className={`w-7 h-7 bg-indigo-100 rounded-full border border-white-100 flex items-center justify-center ${disableButton(nonTravelExp?.travelRequestStatus)? ' cursor-not-allowed opacity-50' : ' cursor-pointer'}`}>
//                     <img src={modify} className='w-4 h-4' alt="modify_icon" />
//                   </div>

//                   </div>
//                   </div>
             
                
//                   <div  className='border border-slate-300 rounded-md px-2 py-1 mt-2 overflow-x-hidden  overflow-y-auto max-h-[236px]' >
                    
                    
//                     {nonTravelExp?.expenseLines.map((line, index)=>((
//                       <div key={`${index}-line`} className='flex text-neutral-700 py-1 px-2 flex-row justify-between items-center font-cabin  text-sm' >
//                          <div className='bg-indigo-50 border-2 shadow-md shadow-slate-900/50 translate-x-4 border-white-100 p-2 rounded-full'><img src={categoryIcons?.[line?.["Category Name"]] ?? categoryIcons?.["Receipt"]} className='w-4 h-4'/></div>
//                         <div className='flex flex-row justify-between text-neutral-700   flex-1 items-center gap-2 py-4 px-4 pl-6 rounded-md bg-slate-200'>
//                           <div>{line?.["Category Name"]}</div>
//                           <div>{line?.["Currency"]?.shortName} {formatAmount(line?.["Total Amount"])}</div>
//                         </div> 
                         
//                       </div>
//                     )))}
                    
                  


//                   </div>
                
             
//             </div>
//           ))}
//         </div>
//           </div>
//         </div>
//       </div>

     
     


        
//     </div>
//   );
// };

// export default Expense;




// import React, { useState,useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { useData } from '../api/DataProvider';
// import { airplane_1, receipt} from '../assets/icon';
// import RejectedExpense from '../components/expense/RejectedExpense';
// import CompletedTrips from '../components/expense/CompletedTrips'
// import AllExpense from '../components/expense/AllExpense';
// import {handleNonTravelExpense, handleTravelExpense,handleTrip} from '../utils/actionHandler';
// // import CashAdvance from '../components/settlement/CashAdvance';



// const Expense = ({fetchData}) => { 

//   const {tenantId,empId,page}= useParams();
  

//   useEffect(()=>{
//     fetchData(tenantId,empId,page)
//   },[])

//   const { employeeData } = useData();
//   const [reimbursementExpenseData , setReimbursementExpenseData]=useState([]);
//   const [completedTrip,setCompletedTrip]=useState(null);
// ///this is for backend data when we will get

//   useEffect(()=>{
//     const reimbursementExpenses = employeeData?.trip?.nonTravelExpenseReports
//     console.log('reimbursement data',reimbursementExpenses)
//     setCompletedTrip()
    
//   },[employeeData])
  
  
 

 
 
  
//   const [activeScreen, setActiveScreen] = useState('Travel & Reimbursement Expenses');
//   const handleScreenChange = (screen) => {
//     setActiveScreen(screen);
//   };


  
//     const tripArray = [
//       {
//         tripId: 'TR0001',
//         travelName: 'Training Workshop in Las Vegas Las Vegas',
//         from: 'Denver',
//         to: 'Las Vegas',
//         departureDate: '05-Feb-2024',
//         returnDate: '10-Feb-2024',
//         status: 'pending settlement',
//         cashAdvance: [
//           {
//             caId: '#CA0004',
//             details: [
//               {
//                 amount: '180.75',
//                 currencyType: 'USD',
//               },
//               {
//                 amount: '20000.75',
//                 currencyType: 'INR',
//               },
//               // {
//               //   amount: '20000.00',
//               //   currencyType: 'INR',
//               // },
//             ],
//             date: '05-Feb-2024',
//             violation: 'amt is within the limit',
//             status: 'rejected',
//           },
//           {
//             caId: '#CA0005',
//             details: [
            
//               {
//                 amount: '180.25',
//                 currencyType: 'GBP',
//               },
//               {
//                 amount: '1500.00',
//                 currencyType: 'JPY',
//               },
//             ],
//             date: '10-Feb-2024',
//             violation: '',
//             status: 'pending settlement',
//           },
//         ],
//       },
//       {
//         tripId: 'TR0002',
//         travelName: 'Conference in Paris',
//         from: 'New York',
//         to: 'Paris',
//         departureDate: '15-Mar-2024',
//         returnDate: '20-Mar-2024',
//         status: 'approved',
//         cashAdvance: [
//           {
//             caId: '#CA0006',
//             details: [
//               {
//                 amount: '300.00',
//                 currencyType: 'USD',
//               },
//               {
//                 amount: '350.75',
//                 currencyType: 'EUR',
//               },
//               {
//                 amount: '3000.00',
//                 currencyType: 'EUR',
//               },
//             ],
//             date: '10-Mar-2024',
//             violation: 'amt is within the limit',
//             status: 'rejected',
//           },
//         ],
//       },
   
//     ];



 


    
//   return (
//     <>
//       {/* <div className="bg-white-100 lg:flex"> */}
      
// <div className="w-auto min-h-screen flex flex-col px-2 lg:px-10 xl:px-20  pt-[50px] bg-slate-100  ">
          

 
//   <div className='flex flex-col w-full items-center'>
//   <div className=" flex flex-col sm:flex-row  items-center justify-start gap-2 sm:gap-4 font-cabin mb-2">

// <div
//   className={`cursor-pointer   py-1 px-2 w-auto min-w-[100px] rounded-xl  truncate${
//     activeScreen === 'Travel & Reimbursement Expenses' ? 'font-medium rounded-xl bg-purple-500 text-xs text-gray-900 w-auto min-w-[100px] truncate' : ' bg-white-100 rounded-xl'
//   }`}
//   onClick={() => handleScreenChange('Travel & Reimbursement Expenses')}
// >
//   Travel & reimbursement Expenses
// </div>

// <div
// className={`cursor-pointer py-1 px-2 w-auto min-w-[100px] truncate ${
//   activeScreen === 'Completed Trips' ? 'font-medium rounded-xl bg-purple-500 text-xs text-gray-900 w-auto min-w-[100px] truncate' : 'bg-white-100 rounded-xl'
// }`}
// onClick={() => handleScreenChange('Completed Trips')}
// >
// Completed Trips
// </div>
// <div
// className={`cursor-pointer py-1 px-2 w-auto min-w-[100px] truncate${
//   activeScreen === 'Rejected Expenses' ? 'font-medium rounded-xl bg-purple-500 text-xs text-gray-900 w-auto min-w-[100px] truncate' : ' bg-white-100 rounded-xl'
// }`}
// onClick={() => handleScreenChange('Rejected Expenses')}
// >
// Rejected Expenses
// </div>


// </div>
 
// <div className="  w-full h-auto lg:h-[581px] rounded-lg  bg-white-100 border-[1px] border-slate-300 shrink-0 font-cabin mt-3 sm:mt-6 ">
//            {activeScreen=== 'Travel & Reimbursement Expenses' && 
//            <>
//            <div className='flex flex-row justify-between items-end sm:px-8 px-4'>
//   <div className=" h-6 flex flex-row gap-3 mt-7 items-center">
//     <img className="w-6 h-6" src={receipt} alt="receipt" />
//     <div className="text-base tracking-[0.02em] font-bold truncate">Travel & Reimbursement Expenses</div>
//   </div>
//   <div className='lg:ml-4 cursor-pointer px-4'>
//     <div className='float-right inline-flex h-8 w-auto  items-center justify-center bg-indigo-600 text-white-100 flex-shrink rounded-lg'>
//       <div className='text-center p-4 font-medium text-xs font-cabin' onClick={()=>handleNonTravelExpense("","non-tr-ex-create")}>Book an Expense</div>
//     </div>
//   </div>
// </div>                       
// <div className="box-border mx-4 mt-[46px] w-auto border-[1px] border-b-gray"/>
// <div className='h-auto'>
//   <AllExpense tripArray={tripArray} handleTravelExpense={handleTravelExpense} handleNonTravelExpense={handleNonTravelExpense}/>
// </div>
// </>}

// {activeScreen === 'Completed Trips'  && 
//   <>
//     <div className="w-auto h-6 flex flex-row gap-3 ml-8 mt-7 items-center">
//       <img className="w-6 h-5" src={airplane_1} alt="receipt" />
//       <div className="text-base tracking-[0.02em] font-bold w-auto">Completed Trips</div>
//     </div>
//     {/* <div className={`mx-8 py-1 w-auto font-medium text-sm text-red-700 mt-10`}>
//       *Please submit your expenses before 90 days
//     </div> */}
    
//     <div className="box-border mx-4 mt-[46px] w-auto  border-[1px]  border-b-gray "/>
//     <div className='h-[420px] overflow-auto mt-6 w-auto'>
         
//     <CompletedTrips tripArray={tripArray} handleTravelExpense={handleTravelExpense} handleTrip={handleTrip}/>
//       </div>   
//            </>
//            }
//            {activeScreen=== 'Rejected Expenses' && 
//            <>
//            <div className="w-auto h-6 flex flex-row gap-3 ml-8 mt-7 items-center">
//       <img className="w-6 h-6" src={receipt} alt="receipt" />
//       <div className="text-base tracking-[0.02em] font-bold w-auto">Rejected Expenses</div>
//     </div>
//     <div className="box-border mx-4  mt-[46px] w-auto    border-[1px]  border-b-gray "/>
//     <div className='h-[420px]'>
//            <RejectedExpense handleTravelExpense={handleTravelExpense} handleNonTravelExpense={handleNonTravelExpense}/>
//     </div>
//            </>
//            }
//         </div>
// </div>
//         </div>
//       {/* </div> */}
//     </>
//   );
// };

// export default Expense;