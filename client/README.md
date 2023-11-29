# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh






// /this is previouse code before updating page2 there switch tab for settlement ca tr and non tr expense

// import {  useState ,useContext} from "react";
// import Sidebar  from '../components/common/Sidebar';
// import Dropdown from '../components/common/Dropdown';
// import { arrow_left,up_arrow,double_arrow,down_arrow, chevron_down, bell, the_food_bill, frame_341 } from "../assets/icon";
// import NonTravelExpense from "../components/settlement/NonTravelExpense";
// import CashAdvance from "../components/settlement/CashAdvance";
// import TravelExpense from "../components/settlement/TravelExpense";
// import { titleCase } from "../utils/handyFunctions";
// import { DashboardContext } from "../api/dashboardContext";



// const Page_2 = () => {
//   const [selectedStatus,setSelectedStatus]=useState(null);
//   const [activeScreen,setActiveScreen]=useState("Non Travel Expenses");
//   const [selectedMonth, setSelectedMonth] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchReady, setSearchReady] = useState(false);
//   const{nonTravelExpenseData} = useContext(DashboardContext);
//   console.log(nonTravelExpenseData);
//   const handleScreenChange=(screen)=>{
//     setActiveScreen(screen);
//   }

//   function getStatusClass(status) {
//     switch (status) {
//       case 'paid':
//         return 'bg-green-100 text-green-200 px-4';
//       case 'cancelled':
//       case 'rejected':
//         return 'bg-red-100 text-red-900';
//       case 'pending settlement':
//         return 'border-[1px] text-purple-500 border-purple-500';
//       default:
//         return '';
//     }
//   }


//   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


//   const expenseData = [
//     {
//       purpose: 'Business Travel',
//       createdFor: [
//         {
//           empId: 'emp013',
//           name: 'Liam Johnson'
//         }
//       ],
//       amount: 800,
//       date: '2023-11-20',
//       status: 'paid',
//       mode: 'neft'
//     },
//     {
//       purpose: 'Advertising Campaign',
//       createdFor: [
//         {
//           empId: 'emp014',
//           name: 'Aria Smith'
//         }
//       ],
//       amount: 1200,
//       date: '2023-11-25',
//       status: 'paid',
//       mode: 'cheque'
//     },
//     {
//       purpose: 'Training Seminar',
//       createdFor: [
//         {
//           empId: 'emp015',
//           name: 'Mason Wilson'
//         }
//       ],
//       amount: 500,
//       date: '2023-12-01',
//       status: 'paid',
//       mode: 'cash'
//     },
//     {
//       purpose: 'Office Renovation',
//       createdFor: [
//         {
//           empId: 'emp016',
//           name: 'Harper Lee'
//         }
//       ],
//       amount: 1500,
//       date: '2023-12-10',
//       status: 'pending settlement',
//       mode:""
//     },
//     {
//       purpose: 'Marketing Expenses',
//       createdFor: [
//         {
//           empId: 'emp017',
//           name: 'Evelyn Davis'
//         }
//       ],
//       amount: 750,
//       date: '2023-12-15',
//       status: 'paid',
//       mode: 'neft'
//     },
//     {
//       purpose: 'Office Supplies',
//       createdFor: [
//         {
//           empId: 'emp018',
//           name: 'Logan Miller'
//         }
//       ],
//       amount: 400,
//       date: '2023-12-20',
//       status: 'pending settlement',
//       mode:""
//     },
//     {
//       purpose: 'Legal Services',
//       createdFor: [
//         {
//           empId: 'emp019',
//           name: 'Sofia Brown'
//         }
//       ],
//       amount: 600,
//       date: '2023-12-25',
//       status: 'paid',
//       mode: 'cash'
//     },
//     {
//       purpose: 'Product Launch Event',
//       createdFor: [
//         {
//           empId: 'emp020',
//           name: 'Jackson Taylor'
//         }
//       ],
//       amount: 1800,
//       date: '2024-01-05',
//       status: 'paid',
//       mode: 'cheque'
//     },
//     {
//       purpose: 'IT Support Services',
//       createdFor: [
//         {
//           empId: 'emp021',
//           name: 'Penelope Turner'
//         }
//       ],
//       amount: 350,
//       date: '2024-01-10',
//       status: 'paid',
//       mode: 'neft'
//     },
//     {
//       purpose: 'Office Rent',
//       createdFor: [
//         {
//           empId: 'emp022',
//           name: 'Henry Clark'
//         }
//       ],
//       amount: 2000,
//       date: '2024-01-15',
//       status: 'pending settlement',
//       mode:""
//     }
//   ];
  

  
// const expenseStatus = [...new Set(expenseData.map((expense) => expense.status))];
// const filterExpenseDataByStatus = expenseData.filter((expense) =>
// (selectedStatus === null || expense.status === selectedStatus) &&
// (selectedMonth === null || new Date(expense.date).getMonth() === months.indexOf(selectedMonth)) &&
// (!searchReady || expense.createdFor[0].name.toLowerCase().includes(searchQuery.toLowerCase()))
// ); 



//   return (
// <div className="bg-white-100">   
//       {/* main div */}
//       <div className="absolute top-[118px] left-[284px] flex flex-col items-start justify-start gap-[24px] text-base text-gray-A500">
//         <div className="flex flex-col items-start justify-start gap-[8px]">
//           <div className="flex flex-col items-start justify-start py-0 pr-0 pl-4">
//             <div className="flex flex-row items-center justify-start gap-[16px]">
//               <div className="rounded-xl  flex flex-row items-start justify-start text-ebgrey-50">
//                 <div
//                 className={`  flex flex-row items-start justify-start py-1 px-2   ${activeScreen === "Non Travel Expenses" ? "font-medium rounded-xl bg-purple-500 text-xs text-gray-900" : ""}`}
//                 onClick={() => handleScreenChange("Non Travel Expenses")}
//                 >
//                 Non Travel Expenses
//               </div>
//               </div>
//               <div
//                 className={`cursor-pointer  py-1 px-2 ${activeScreen === "Cash Advance" ? "font-medium rounded-xl bg-purple-500 text-xs text-gray-900" : ""}`}
//                 onClick={() => handleScreenChange("Cash Advance")}
//               >
//                 Cash Advance
//               </div>
//               <div
//                 className={`cursor-pointer py-1 px-2 ${activeScreen === "Travel Expenses" ? "font-medium rounded-xl bg-purple-500 text-xs text-gray-900" : ""}`}
//                 onClick={() => handleScreenChange("Travel Expenses")}
//               >
//                 Travel Expenses
//               </div>
//             </div>
//           </div>
//           <div className="relative box-border w-[901px] h-px border-t-[1px] border-solid border-gainsboro-100" />
//         </div>
//         <div className="relative rounded-2xl bg-white-100  box-border w-[912px] h-[504px] overflow-hidden shrink-0 text-ebgrey-600 border-[1px] border-solid border-gainsboro-200">
//          {activeScreen === "Non Travel Expenses" && (
//             // <NonTravelExpense
//             //   filterExpenseDataByStatus={filterExpenseDataByStatus}
//             //   getStatusClass={getStatusClass}
//             //   expenseStatus={expenseStatus}
//             //   expenseStatusOnChange={(selected) => setSelectedStatus(selected)}
//             //   months={months}
//             // />
//             <> 
//     <div className="absolute top-[22px] left-[44px] text-black">
//             Non Travel Expenses
//     </div>
        
//      <div className="absolute top-[178px] left-[24px] flex flex-col items-start justify-start gap-[8px] ">
//             <div className="">
//               <div className="bg-white flex flex-row items-center justify-center text-gray-A500">
               
//                 <div className="relative flex items-center justify-center w-[150px] h-14  shrink-0 text-center">
//                   <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_50px)] tracking-[0.03em] font-medium">
//                     Purpose
//                   </div>
//                 </div>
//                 <div className="relative w-[140px] h-14 overflow-hidden shrink-0">
//                   <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_31px)] tracking-[0.03em] font-medium">
//                     Employee
//                   </div>
//                 </div>
//                 <div className="relative w-20 h-14  shrink-0">
//                   <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_21px)] tracking-[0.03em] font-medium">
//                     Invoice
//                   </div>
//                 </div>
//                 <div className="relative w-[95px] h-14 overflow-hidden shrink-0 ml-1 ">
//                   <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_27px)] tracking-[0.03em] font-medium">
//                     Amount
//                   </div>
//                 </div>
//                 <div className="relative w-[126px] h-14 overflow-hidden shrink-0">
//                   <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_17px)] tracking-[0.03em] font-medium">
//                     Date
//                   </div>
//                 </div>
//                 {/* <div className="relative w-[126px] h-14 overflow-hidden shrink-0">
//                   <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_15px)] tracking-[0.03em] font-medium">
                    
//                   </div>
//                 </div> */}
//               </div>
//             </div>
//             <div className="flex flex-col items-start justify-start text-sm h-[230px] overflow-auto pr-9">
//             {
//               filterExpenseDataByStatus.length === 0 ? (
//                 <div className="text-gray-A500">No Data Found</div>
//               ) : (
//                 filterExpenseDataByStatus.map((expenseDetails, index) => (
//                  <>
//                 <div className="flex flex-col items-center justify-center" key={index}>
//                 <div className="bg-white flex flex-row items-start justify-center border-b-[1px] border-solid border-gray-100">
//                   <div className="relative w-[140px] h-14  shrink-0 text-gray-A300 leading-normal  font-medium text[14px]">
//                     <div className="absolute top-[calc(50%_-_9px)] w-[150px] left-[calc(50%_-_42px)] tracking-[0.03em] font-medium truncate">
//                       {expenseDetails.purpose}
//                     </div>
//                   </div>
//                   <div className="relative w-[140px] h-[56px]  shrink-0 text-gray-A300">
//                     <div className="absolute w-[135px] top-[calc(50%_-_7px)] left-[calc(50%_-_15px)] leading-normal text-gray-A300 font-medium text[14px]">
//                       {expenseDetails.createdFor[0].name}
//                     </div>
//                   </div>
//                   <div className="relative w-14 h-14 overflow-hidden shrink-0 ml-6 ">
//                     <div className="absolute top-[calc(50%_-_16px)] left-[calc(50%_-_16px)] rounded-full bg-gray-A300   w-8 h-8 overflow-hidden">
//                       <img
//                         className="absolute top-[1px] left-[8px] w-[15px] h-[30px] object-cover"
//                         alt=""
//                         src={the_food_bill}
//                       />
//                     </div>
//                   </div>
//                   <div className="relative w-[95px] h-14 overflow-hidden shrink-0 text-xs">
//                     <div className="absolute top-[calc(50%_-_7px)] left-[calc(50%_-_13px)] tracking-[0.03em] leading-normal text-gray-A300 font-medium">
//                       {expenseDetails.amount}000
//                     </div>
//                   </div>
//                   <div className="relative w-[126px] h-14 overflow-hidden shrink-0 text-xs">
//                     <div className="absolute top-[calc(50%_-_7px)] left-[calc(50%_-_21px)]">
//                       {expenseDetails.date}
//                     </div>
//                   </div>
//                   <div className="relative w-[126px] h-14 overflow-hidden shrink-0 text-xs">
//                   <div className="h-[52px] flex flex-col items-center justify-start text-center">
//       <div className="flex-1 flex items-center justify-center py-2 px-6">
//         <b className="text-purple-500 text-[14px] tracking-[0.02em] w-[98px] font-bold">
//         {expenseDetails.mode.length > 0 ? titleCase(expenseDetails.mode) :"---" } 
//         </b>
//       </div>
//     </div>
//                   </div>
//                   <div className="w-[139px] h-[56px] py-[5px] px-3 flex justify-center items-center">
//                   <div className={` relative flex justify-center items-center w-[129px] h-8 rounded-[48px] ${getStatusClass(expenseDetails.status)}`}>
//                     <div className="text-[14px] font-medium text-center font-cabin  shrink-0">
//                     {titleCase(expenseDetails.status === 'paid' ? 'Settled' : 'Mask as Settled')}
//                     </div>
//                   </div>
//                   </div>
//                 </div>
//               </div>

//              </>
//               )))}
           
//             </div>
            
//           </div>
//           <div className="absolute top-[153.5px] left-[16.5px] box-border w-[883px] h-px border-t-[1px] border-solid border-ebgrey-100" />
//           <div className="absolute top-[65px] left-[44px] flex flex-row items-center justify-start gap-[24px] text-justify text-xs text-ebgrey-400">
           
//             <div className="rounded-md bg-white box-border w-[206px] flex flex-row items-center justify-start py-2 px-4 border-[1px] border-solid border-gray-600">
//   <input
//   type="text"
//   className="relative tracking-[0.01em] outline-none border-none"
//   placeholder="Search by Employee"
//   value={searchQuery}
//   onChange={(e) => {
//     setSearchQuery(e.target.value);
//     setSearchReady(e.target.value.length >= 3);
//   }}
// />

// </div>
// <div className="flex  flex-row items-center justify-start gap-[8px] text-left text-gray-A300">
//               <div className="relative font-medium">Select Month</div>
//               <div className="relative w-[133px] h-8 text-sm text-black">
//                 <div className="absolute top-[-5px] left-[0px] rounded-md bg-white box-border w-[93px] h-8">
                 
//               <Dropdown
//               name="expenseStatus"
//               id="expenseStatus"
//               options={expenseStatus}
//               icon={chevron_down}
//               onChange={(selected) => setSelectedStatus(selected)}
//               />
                    
                 
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-row items-center justify-start gap-[8px] text-left text-gray-A300">
//               <div className="relative font-medium">Select Month</div>
//               <div className="relative w-[133px] h-8 text-sm text-black">
//                 <div className="absolute top-[-5px] left-[0px] rounded-md bg-white box-border w-[93px] h-8">                
              
//               <Dropdown
//   name="months"
//   options={months}
//   icon={chevron_down}
//   onChange={(selected) => setSelectedMonth(selected)}
// />                                    
//                 </div>
//               </div>
//             </div>
        
//           </div>

//           <div className="absolute top-[113px] left-[44px] flex flex-row items-start justify-start gap-[48px]">
//             <div className="flex flex-row items-center justify-start gap-[8px]">
//               <div className="flex flex-row items-center justify-start gap-[3px]">
//                 <img
//                   className="relative w-6 h-6 overflow-hidden shrink-0"
//                   alt=""
//                   src={up_arrow}
//                 />
//                 <div className="flex flex-row items-end justify-start">
//                   <div className="relative tracking-[0.03em] font-medium">
//                     dates Ascending
//                   </div>
//                 </div>
//               </div>
//               <img
//                 className="relative rounded-2xl w-4 h-4 overflow-hidden shrink-0"
//                 alt=""
//                 src={frame_341}
//               />
//             </div>
//             <div className="flex flex-row items-center justify-start gap-[8px] text-sm">
//               <div className="flex flex-row items-center justify-start gap-[8px]">
//                 <img
//                   className="relative w-6 h-6 overflow-hidden shrink-0"
//                   alt=""
//                   src={down_arrow}
//                 />
//                 <div className="relative">dates Ascending</div>
//               </div>
//               <div className="relative rounded-2xl box-border w-4 h-4 overflow-hidden shrink-0 border-[1px] border-solid border-ebgrey-400" />
//             </div>
//           </div>
// </>
//           )}

//           {activeScreen === "Cash Advance" && 
//          (
          
//            <CashAdvance/>
           
           
//            )
          
//           }
//           {activeScreen === "Travel Expenses" && (<TravelExpense/>) }
          
          
//         </div>
     
//       {/* main div */}
//       </div>
//       <div className="absolute top-[50px] left-[284px] flex flex-row items-center justify-start gap-[8px] text-base text-black">
//         <img
//           className="relative rounded-81xl w-8 h-8 overflow-hidden shrink-0 object-cover"
//           alt=""
//           src={frame_341}
//         />
//         <div className="relative tracking-[-0.04em]">Hello Jash</div>
//       </div>
//       <div className="absolute top-[38px] left-[1184px] w-14 h-14 overflow-hidden text-center text-white">
//         <div className="absolute top-[calc(50%_-_20px)] left-[calc(50%_-_23px)] rounded-81xl bg-white box-border w-10 h-10 border-[1px] border-solid border-eb-primary-blue-300">
//           <img
//             className="absolute top-[calc(50%_-_12px)] left-[calc(50%_-_12px)] w-6 h-6 overflow-hidden"
//             alt=""
//             src={bell}
//           /> 
//           <div className="absolute top-[-4px] left-[29px] rounded-2xl bg-pink box-border w-5 h-5 overflow-hidden border-[1px] border-solid border-lightcoral">
//             <div className="absolute top-[3px] left-[7px] font-medium">3</div>
//           </div>
//         </div>
//       </div>
  
//     </div>
//   );
// };


// export default Page_2;





import React,{useState} from "react";
import { up_arrow, down_arrow ,calender, frame_341} from "../../assets/icon";
import { titleCase } from "../../utils/handyFunctions";

const CashAdvance = () => {
  const [searchQuery ,  setSearchQuery]= useState("");
  const [searchReady ,  setSearchReady]= useState(false);

  const CAdetails = [
    {
      createdFor: [
        {
          empId: 'emp012',
          name: 'Rivaah Sonar'
        }
      ],
      trip: "Dehradun Nirvana Trip",
      amount: "$100.00",
      date: "20-Sep-2023 to 22-Sep-2023",
      mode: "cheque",
      status: "paid"
    },
    {
      createdFor: [
        {
          empId: 'emp013',
          name: 'John Doe'
        }
      ],
      trip: "Mountain Adventure",
      amount: "$150.00",
      date: "15-Oct-2023 to 18-Oct-2023",
      mode: "credit card",
      status: "paid"
    },
    {
      createdFor: [
        {
          empId: 'emp014',
          name: 'Alice Smith'
        }
      ],
      trip: "Beach Vacation",
      amount: "$200.00",
      date: "5-Nov-2023 to 10-Nov-2023",
      mode: "",
      status: "pending settlement"
    },
    {
      createdFor: [
        {
          empId: 'emp015',
          name: 'David Johnson'
        }
      ],
      trip: "Ski Trip",
      amount: "$120.00",
      date: "7-Dec-2023 to 10-Dec-2023",
      mode: "",
      status: "pending settlement"
    },
    {
      createdFor: [
        {
          empId: 'emp016',
          name: 'Emily White'
        }
      ],
      trip: "Cruise Vacation",
      amount: "$250.00",
      date: "20-Jan-2024 to 25-Jan-2024",
      mode: "",
      status: "pending settlement"
    },
    {
      createdFor: [
        {
          empId: 'emp017',
          name: 'Michael Brown'
        }
      ],
      trip: "Hiking Expedition",
      amount: "$80.00",
      date: "12-Feb-2024 to 14-Feb-2024",
      mode: "cash",
      status: "paid"
    },
    {
      createdFor: [
        {
          empId: 'emp018',
          name: 'Samantha Wilson'
        }
      ],
      trip: "City Getaway",
      amount: "$180.00",
      date: "10-Mar-2024 to 15-Mar-2024",
      mode: "cheque",
      status: "paid"
    },
    {
      createdFor: [
        {
          empId: 'emp019',
          name: 'William Taylor'
        }
      ],
      trip: "Desert Adventure",
      amount: "$170.00",
      date: "2-Apr-2024 to 6-Apr-2024",
      mode: "credit card",
      status: "paid"
    },
    {
      createdFor: [
        {
          empId: 'emp020',
          name: 'Olivia Lee'
        }
      ],
      trip: "Historical Tour",
      amount: "$110.00",
      date: "15-May-2024 to 20-May-2024",
      mode: "cash",
      status: "paid"
    },
    {
      createdFor: [
        {
          empId: 'emp021',
          name: 'James Harris'
        }
      ],
      trip: "Safari Expedition",
      amount: "$300.00",
      date: "7-Jun-2024 to 12-Jun-2024",
      mode: "cheque",
      status: "paid"
    }
  ];




  const searchByName = CAdetails.filter(
    (expense) =>
      !searchReady || expense.createdFor[0].name.toLowerCase().includes(searchQuery.toLowerCase())
  );



    return (
    <>
     <div className="">
       
          {/* <div className="flex flex-col items-start justify-start text-black"> */}
            
              <div className="absolute top-[22px] left-[44px] text-black">
                Cash Advance Reqeust
              </div>
              
<>
             <div className="absolute  h-[300px] top-[146px]  flex flex-col items-start justify-start gap-2 mx-3">
              {/* <div className="absolute flex flex-row justify-center items-start  h-14 w-auto text-gray-A500 gap-6 "> */}
               <div className="bg-white w-full max-w-[686px] flex flex-row items-center justify-start text-gray-A500">
              <div className="w-[140px] h-14 py-5 px-3 relative flex items-center justify-center shrink-0 text-center">
                <div className="font-cabin text-base font-medium  tracking-[0.03em]">
                Trip  
                </div>
               
              </div>
              <div className="w-[140px] h-14 py-5  relative  shrink-0 flex justify-center items-center">
                <div className="font-cabin text-base font-medium tracking-[0.03em]">
                Employee Name
                </div>
              </div>
              <div className="flex relative shrink-0 justify-center items-center w-[240px] h-14 py-5 px-3">
                <div className="font-cabin text-base font-medium absolute  tracking-[0.03em]  ">
                Dates 
                </div>
              </div>
              <div className="flex relative shrink-0 justify-center items-center w-[80px] h-14 py-5 px-2">
                <div className="font-cabin text-base font-medium absolute  tracking-[0.03em]  ">
                Amount
                </div>
              </div> 
              <div className="flex relative shrink-0 justify-center
               items-center w-[100px] h-14 py-5 px-2">
                <div className="font-cabin text-base font-medium absolute  tracking-[0.03em]  ">
               Mode
                </div>
              </div>
              
              
              </div>
              

              <div className="flex flex-col items-start justify-start text-sm pr-1 overflow-auto">

              {/* {CAdetails.map((details,index)=>( */}
              {searchByName.length===0 ? "data not found" :(searchByName.map((details,index)=>(
              <>
                <div className="flex flex-col items-center  justify-center" key={index}>
                {/* <div key={index} className=" absolute flex flex-row top-5 w-[907] h-14 mt-5 border-b border-black"> */}

                <div className="bg-white flex flex-row font-cabin items-start justify-center border-b-[1px] border-solid border-gray-100">
<div className="w-[140px] h-14 py-5 px-3  shrink-0 text-gray-A300">
  <div className="text-[14px] tracking-[0.03em] leading-normal truncate font-medium">
  {details.trip}
  </div>
</div>
  


  <div className="w-[140px] h-14 py-5 px-3">
  <div className="text-[14px] w-[130px] truncate tracking-[0.03em] leading-normal text-gray-A300 font-medium">
     {details.createdFor[0].name}
  </div>
    
  </div>
  <div className="flex flex-row gap-1 w-[240px] h-14 py-5 px-3">
  <img src={calender} alt="calendar" className="w-[16px]" />
<div className=" tracking-[0.03em] leading-normal text-gray-A300 text-[14px] font-medium">
20-Sep-2023 to 22-Sep-2023
</div>

</div>
  <div className="w-[95px] h-14 py-5 px-3 ">
    <div className="tracking-[0.03em] leading-normal text-gray-A300 font-medium">{details.amount}</div>
  </div>
  <div className="w-[100px] h-14 py-5 px-2 flex ">               
                <div className="tracking-[0.03em] w-[80px] leading-normal text-gray-A300 font-medium text[14px]">
                { details.mode.length > 0 ? (titleCase(details.mode )) : "----" } 
                </div>
              </div>
  <div className="w-[197px] h-14 py-5 px-3 flex justify-center items-center">
    <div className={`w-[129px] h-8 flex justify-center items-center py-4 rounded-[48px] ${details.status==="paid" ? "bg-green-100 text-green-200" : "border  text-purple-500 border-purple-500"} `}>
    <div className="w-[130px] shrink-0 text-[14px] px-4 font-medium text-center   text[14px]">{ (details.status === "paid" ? "Settled" : "Mark as Settled")}</div>
  </div>
   
  </div>
 
</div>
</div>
</>)))}
</div>


             
              

             </div>
    
              
</>
              <div className="absolute top-[121.5px] left-[16.5px] box-border w-[883px] h-px border-t-[1px] border-solid border-ebgrey-100" />
              <div className="absolute top-[67px] left-[44px] flex flex-row items-center justify-start gap-[49px] text-justify text-xs text-ebgrey-400">
              <div className="rounded-md bg-white box-border w-[206px] flex flex-row items-center justify-start py-2 px-4 border-[1px] border-solid border-gray-600">
  
 

        <input
  type="text"
  className="relative tracking-[0.01em] outline-none border-none"
  placeholder="Search by Employee"
  value={searchQuery}
  onChange={(e) => {
    setSearchQuery(e.target.value);
    setSearchReady(e.target.value.length >= 3);
  }}
/>



</div>
                <div className="flex flex-row items-start justify-start gap-[48px] text-left text-base text-gray-A500">
                  <div className="flex flex-row items-center justify-start gap-[8px]">
                    <div className="flex flex-row items-center justify-start gap-[3px]">
                      <img
                        className="relative w-6 h-6 overflow-hidden shrink-0"
                        alt=""
                        src={up_arrow}
                      />
                      <div className="flex flex-row items-end justify-start">
                        <div className="relative tracking-[0.03em] font-medium">
                          Dates Ascending
                        </div>
                      </div>
                    </div>
                    <img
                      className="relative rounded-2xl w-4 h-4 overflow-hidden shrink-0"
                      alt=""
                      src={frame_341}
                    />
                  </div>
                  <div className="flex flex-row items-center justify-start gap-[8px] text-sm">
                    <div className="flex flex-row items-center justify-start gap-[8px]">
                      <img
                        className="relative w-6 h-6 overflow-hidden shrink-0"
                        alt=""
                        src={down_arrow}
                      />
                      <div className="relative">Dates Ascending</div>
                      <div className="relative rounded-2xl box-border w-4 h-4 overflow-hidden shrink-0 border-[1px] border-solid border-ebgrey-400" />
                    </div>
             
                  </div>
                </div>
              </div>
            {/* </div> */}
         
    </div>
      </>
     
    );
  };
  
  export default CashAdvance;




  import React,{useState} from "react";
import { calender, double_arrow } from "../../assets/icon";
import { titleCase } from "../../utils/handyFunctions";

const TravelExpense = () => {  

  const TrExpense = [
        {
          createdFor: [
            {
              empId: 'emp012',
              name: 'Rivaah Sonar'
            }
          ],
          trip: "Dehradun Nirvana Trip",
          amount: "$1000.00",
          date: "20-Sep-2023 to 22-Sep-2023",
          mode: "",
          status: "pending settlement",
          from: "Delhi",
          to: "Vinci"
        },
        {
          createdFor: [
            {
              empId: 'emp013',
              name: 'John Doe'
            }
          ],
          trip: "Mountain Adventure",
          amount: "$1500.00",
          date: "15-Oct-2023 to 18-Oct-2023",
          mode: "credit card",
          status: "Paid",
          from: "Seattle",
          to: "Denver"
        },
        {
          createdFor: [
            {
              empId: 'emp014',
              name: 'Alice Smith'
            }
          ],
          trip: "Beach Vacation",
          amount: "$800.00",
          date: "5-Nov-2023 to 10-Nov-2023",
          mode: "",
          status: "pending settlement",
          from: "Miami",
          to: "Cancun"
        },
        {
          createdFor: [
            {
              empId: 'emp015',
              name: 'David Johnson'
            }
          ],
          trip: "Ski Trip",
          amount: "$1200.00",
          date: "7-Dec-2023 to 10-Dec-2023",
          mode: "cheque",
          status: "Paid",
          from: "Aspen",
          to: "Vail"
        },
        {
          createdFor: [
            {
              empId: 'emp016',
              name: 'Emily White'
            }
          ],
          trip: "Cruise Vacation",
          amount: "$2500.00",
          date: "20-Jan-2024 to 25-Jan-2024",
          mode: "",
          status: "pending settlement",
          from: "Miami",
          to: "Bahamas"
        },
        {
          createdFor: [
            {
              empId: 'emp017',
              name: 'Michael Brown'
            }
          ],
          trip: "Hiking Expedition",
          amount: "$800.00",
          date: "12-Feb-2024 to 14-Feb-2024",
          mode: "",
          status: "pending settlement",
          from: "Denver",
          to: "Boulder"
        },
        {
          createdFor: [
            {
              empId: 'emp018',
              name: 'Samantha Wilson'
            }
          ],
          trip: "City Getaway",
          amount: "$1800.00",
          date: "10-Mar-2024 to 15-Mar-2024",
          mode: "cheque",
          status: "Paid",
          from: "New York",
          to: "Boston"
        },
        {
          createdFor: [
            {
              empId: 'emp019',
              name: 'William Taylor'
            }
          ],
          trip: "Desert Adventure",
          amount: "$1700.00",
          date: "2-Apr-2024 to 6-Apr-2024",
          mode: "credit card",
          status: "Paid",
          from: "Phoenix",
          to: "Sedona"
        },
        {
          createdFor: [
            {
              empId: 'emp020',
              name: 'Olivia Lee'
            }
          ],
          trip: "Historical Tour",
          amount: "$1100.00",
          date: "15-May-2024 to 20-May-2024",
          mode: "",
          status: "pending settlement",
          from: "Rome",
          to: "Florence"
        },
        {
          createdFor: [
            {
              empId: 'emp021',
              name: 'James Harris'
            }
          ],
          trip: "Safari Expedition",
          amount: "$3000.00",
          date: "7-Jun-2024 to 12-Jun-2024",
          mode: "",
          status: "pending settlement",
          from: "Nairobi",
          to: "Serengeti"
        }
      ];


  const [searchQuery , setSearchQuery] =useState("");
  const [searchToFrom , setToFrom]=useState("");
  const [searchDestination , setSearchDestination]=useState("");
  const [searchReady, setSearchReady ]= useState(false);

 
const searchByName = TrExpense.filter((expense) => {
  return (
    (!searchReady || expense.createdFor[0].name.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (expense.from.toLowerCase().includes(searchToFrom.toLowerCase()) || expense.to.toLowerCase().includes(searchToFrom.toLowerCase())) &&
    (!searchDestination || expense.trip.toLowerCase().includes(searchDestination.toLowerCase()))
  );
});  
  return (
    <>
  <div className="absolute top-[24px] left-[36px]">Travel Requests</div>
  <div className="absolute top-[178px] left-[8px] flex flex-col items-start justify-start gap-[4px] text-ebgrey-600">
    <div className="bg-white flex flex-row items-start justify-center gap-3">
      <div className="relative w-[140px] h-14 overflow-hidden shrink-0">
        <div className="absolute top-[calc(50%-_8px)] left-[27px] tracking-[0.03em] font-medium">
          Employee Name
        </div>
      </div>
      
      <div className="relative w-[140px] h-14 overflow-hidden shrink-0">
        <div className="absolute top-[calc(50%-_8px)] left-[calc(50%-_26px)] tracking-[0.03em] font-medium">
          Trip Name
        </div>
      </div>
      <div className="relative w-[140px] h-14 overflow-hidden shrink-0">
        <div className="absolute top-[20px] left-[calc(50%-_32px)] tracking-[0.03em] font-medium">
          Destinations
        </div>
      </div>
      <div className="relative w-60 h-14 overflow-hidden shrink-0">
        <div className="absolute top-[20px] left-[calc(50%-_32px)] tracking-[0.03em] font-medium">
          Dates
        </div>
      </div>
    </div>
    <div className="h-[230px] pr-2 overflow-auto">
    <div className="flex flex-col  items-start justify-start text-sm">
      {searchByName.length===0 ? "data not found" :(searchByName.map((tr, index) =>(

        <>
          <div className="flex flex-col items-center justify-start " key={index}>
            <div className="bg-white w-[890px] flex flex-row font-cabin items-start justify-center border-b-[1px] border-solid border-gray-100 ">
              <div className="w-[120px] h-14 py-5 px-3 shrink-0 text-gray-A300 flex items-start">
                <div className="text-[14px] tracking-[0.03em] leading-normal truncate font-medium">
                  {tr.createdFor[0].name}
                </div>
              </div>
              <div className="w-[140px] h-14 py-5 ">
                <div className="text-[14px] w-[130px] truncate tracking-[0.03em] leading-normal text-gray-A300 font-medium px-2">
                  {tr.trip}
                </div>
              </div>
              <div className="flex flex-row gap-1 w-[240px] py-5 h-14 ">
                <img src={calender} alt="calendar" className="w-[16px]" />
                <div className="tracking-[0.03em]  leading-normal text-gray-A300 text-[14px] font-medium">
                  {tr.date}
                </div>
              </div>


<div className="w-[120px] h-14 py-5 px-3">
  <div className="tracking-[0.03em] leading-normal text-gray-A300 font-medium flex flex-1 flex-row justify-center items-center" style={{ whiteSpace: 'nowrap' }}>
    <div className="">{tr.from}</div>
    <img className="w-4 h-4 overflow-hidden shrink-0" alt="" src={double_arrow} />
    <div className="">{tr.to}</div>
  </div>
</div>

              <div className={`w-[100px] h-14 py-5 px-2 flex `}>
                <div className="tracking-[0.03em] w-[80px] leading-normal text-gray-A300 font-medium text[14px]">
                {tr.mode.length>0 ? (titleCase(tr.mode )) : "---"} 
                </div>
              </div>
              <div className="w-[197px] h-14 py-5 px-3 flex justify-center items-center">
                <div className={`w-[129px] h-8 flex justify-center items-center border rounded-[48px] cursor-pointer  py-4 ${tr.status==="pending settlement" ? "border  text-purple-500 border-purple-500 " : " bg-green-100 text-green-200 border-none" } `}>
                  <div className={`w-[130px] shrink-0 text-[14px] px-4 font-medium text-center  text[14px] `}  >
                    {tr.status === 'pending settlement' ? "View Details" : "Settled"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>     
      )))}
    </div>
    </div>
  </div>
  <div className="absolute top-[67px] left-[36px] flex flex-row items-start justify-start gap-[16px] text-xs text-darkslategray">
    <div className="flex flex-col items-start justify-center gap-[8px]">
      <div className="relative font-medium">Search by Employee</div>
      <div className="w-[175px] h-10 flex flex-row flex-wrap items-start justify-center text-justify text-sm text-ebgrey-400">
        <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-start justify-center py-3 px-6 relative border-[1px] border-solid border-ebgrey-200">

         <input 
          type="text" 
          placeholder="Employee Name" 
          className="absolute tracking-[0.01em] outline-none border-none"
          value={searchQuery}
          onChange={(e) => {setSearchQuery(e.target.value);
                            setSearchReady(e.target.value.length >= 3)}}
          />

        </div>
      </div>
    </div>
    <div className="flex flex-col items-start justify-center gap-[8px]">
      <div className="relative font-medium">Search by destination</div>
      <div className="w-[175px] h-10 flex flex-row flex-wrap items-start justify-center text-justify text-sm text-ebgrey-400">
        <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-start justify-center py-3 px-6 relative border-[1px] border-solid border-ebgrey-200">
          
          <input type="text"
           placeholder="Destination" 
           className="absolute tracking-[0.01em] outline-none border-none"
           value={searchToFrom}
           onChange={(e) => {setToFrom(e.target.value);
                            setSearchReady(e.target.value.length >= 3);}}
           />

        </div>
      </div>
    </div>
    <div className="flex flex-col items-start justify-center gap-[8px]">
      <div className="relative font-medium">Search by Trip Name</div>
      <div className="w-[175px] h-10 flex flex-row flex-wrap items-start justify-center text-justify text-sm text-ebgrey-400">
        <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-start justify-center py-3 px-6 relative border-[1px] border-solid border-ebgrey-200">

           <input type="text" 
           placeholder="Trip Name" 
           className="absolute tracking-[0.01em] outline-none border-none"
           value={searchDestination}
           onChange={(e) => {setSearchDestination(e.target.value);
                            setSearchReady(e.target.value.length >= 3);}}
           />


        </div>
      </div>
    </div>
  </div>
  <div className="absolute top-[153.5px] left-[16.5px] box-border w-[883px] h-px border-t-[1px] border-solid border-ebgrey-100" />
</>

  );
};

export default TravelExpense; in page 2











