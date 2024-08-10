import React, { useState,useEffect } from 'react'
import { StatusFilter } from '../common/TinyComponent'
import Input from '../common/SearchInput'
import { filter_icon, search_icon } from '../assets/icon'
import SettleCashAdvance from '../tabs/SettleCashAdvance'
import RecoverCashAdvance from '../tabs/RecoverCashAdvance'
import SettleTravelExpense from '../tabs/SettleTravelExpense'
import SettleNonTravelExpense from '../tabs/SettleNonTravelExpense'
import AccountEntry from '../tabs/AccountEntry'
import Error from '../common/Error'
import {TravelExpense, TRCashadvance} from '../utilis/dummyData'
import { useParams } from 'react-router-dom'
import { getFinanceData_API } from '../utilis/api'
import { filterByTimeRange } from '../utilis/handyFunctions'



const Finance = () => {

  const {tenantId,empId}=useParams()
  const [activeTab, setActiveTab] = useState("Settle Cash-Advances")
  const [financeData, setFinanceData] =useState(null)
  const [paidBy , setPaidBy]=useState(null)
  const [isLoading, setIsLoading]=useState(true)
  const [errorMsg, setErrorMsg]= useState(null)
  const dashboardBaseUrl = import.meta.env.VITE_DASHBOARD_PAGE_URL




  useEffect(() => {
    
    const fetchData = async () => {
      try {
        console.log("page 3 my Params:", tenantId, empId);
        const response = await getFinanceData_API(tenantId, empId);
       setFinanceData(response.finance);  
       setPaidBy(response.employeeData)
        setIsLoading(false);
        console.log('travel data for approval fetched.');
      } catch (error) {
        console.log('Error in fetching travel data for approval:', error.message);
        setErrorMsg(error.message);
        // setTimeout(() => {setErrorMsg(null);setIsLoading(false)},5000);
      }
    };

    fetchData(); 

  },[tenantId, empId ]);

 console.log('finance data', financeData)

 const settleCashAdvanceData= financeData?.cashAdvanceToSettle || []
 const recoverCashAdvanceData = financeData?.paidAndCancelledCash || []
 const settleTravelExpenseData = financeData?.travelExpense || []
 const settleNonTravelExpenseData = financeData?.nonTravelExpense || []


  const handleSwitchTab = (value)=>{
    setActiveTab(value)
  }
  
  const handleActionConfirm = (action, apiData) => {
    apiData.paidBy= paidBy
    const data = {
      message: 'message posted',
      action,
      payload: apiData,
    };
    window.parent.postMessage(data, dashboardBaseUrl);
  };

  function Tab () {
    switch (activeTab) {
      case "Settle Cash-Advances":
        return dataFilterByDate(settleCashAdvanceData).map((trip, index)=>(<SettleCashAdvance trip={trip} key={index} handleActionConfirm={handleActionConfirm}/>));
      case "Recover Cash-Advances":
        return dataFilterByDate(recoverCashAdvanceData).map((trip, index)=>(<RecoverCashAdvance trip={trip} key={index} handleActionConfirm={handleActionConfirm}/>));
      case "Settle Travel Expenses":
        return settleTravelExpenseData?.map((expense,index)=>(<SettleTravelExpense trip={expense} key={index} handleActionConfirm={handleActionConfirm}/>));
      case "Settle Non-Travel Expenses":
        return settleNonTravelExpenseData.map((expense,index)=>(<SettleNonTravelExpense trip={expense} key={index} handleActionConfirm={handleActionConfirm}/>));
      case "Account Entries":
        return <AccountEntry />;
      default:
        return null; // or some default component
    }
  }
  

    const [searchQuery, setSearchQuery]= useState(null)
    const [selectedRange , setSelectedRange]=useState("")
    const handleTabClick = (range) => {
      setSelectedRange(selectedRange === range ? "" : range);
    };

    const getStatusClass = (status) => {
      return 'bg-indigo-100 text-indigo-600 border border-indigo-600'; // Adjust this based on your styling requirements
    };
    
    const getStatusCount = (status,tripData) => {

      const tripsForBooking =tripData?.tripsForBooking  || []
      
        return filterByTimeRange(tripsForBooking, status).length;

    };
    function dataFilterByDate(data) {
      let filteredData = data;
    
      // if (selectedDateRange) {
      //     filteredData = filterByTimeRange(filteredData, selectedDateRange);
      // }
    
      if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredData = filteredData.filter(trip => JSON.stringify(trip).toLowerCase().includes(query));
      }
    
      return filteredData;
    }

    const tabs = ["Settle Cash-Advances","Recover Cash-Advances" , "Settle Travel Expenses" , "Settle Non-Travel Expenses", "Account Entries"]
  return (
    <>
    {isLoading ? 
    <Error message={errorMsg}/> :
    (<div className='bg-white min-h-screen border-slate-400 w-full h-[100%] flex-col  flex items-start gap-2  '>
      <div className='sticky top-0 w-full space-y-2 bg-white '>
      <div className=' bg-white rounded-md flex border justify-start items-center overflow-x-auto w-full'>
          {
              tabs?.map((tab,index)=>(
                <div
                onClick={() => handleSwitchTab(tab)}
                key={index}
                className={`text-sm min-w-44 font-cabin text-center truncate h-10 px-2 py-2 ${activeTab === tab ? 'border-b-2 border-indigo-600 hover:border-0' : ' '} hover:border-slate-300 hover:border-b-2 hover:text-neutral-500 text-neutral-700 cursor-pointer `}
              >
                <p>{tab}</p>
              </div>
              
              ))
          }
      </div>
      <div className='min-h-[120px] border border-slate-300  rounded-md  w-full flex flex-wrap items-start gap-2 px-2 py-2'>
    {/* <div className='flex  space-x-2 space-y-2  overflow-x-auto '>
      <div className='flex gap-2  items-center justify-center p-2 bg-slate-100/50 rounded-full border border-slate-300 '>
      <div className='px-4 '>
      <img src={filter_icon} className='min-w-5 w-5 h-5 min-h-5'/>
      </div>
{["draft","pending approval", "pending settlement", "paid","rejected",  "cancelled", "paid and cancelled"].map((status) => {
  const statusCount = getStatusCount(status, [...travelExpenses.flatMap(te => te?.travelExpenses ), ...nonTravelExpenses]);
  const isDisabled = statusCount === 0;
  
  return (
    <div key={status} className={`flex items-center  ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <div
        onClick={() => !isDisabled && handleStatusClick(status)}
        className={`ring-1 ring-white flex py-1 pr-3 text-center rounded-sm ${selectedStatuses.includes(status) ? getStatusClass(status ?? "-") : "bg-slate-100 text-neutral-700 border border-slate-300"}`}
      >
        <p className='px-1 py-1 text-sm text-center capitalize font-cabin whitespace-nowrap '>{status ?? "-"}</p>
      </div>
      <div className={`shadow-md shadow-black/30 font-semibold -translate-x-3 ring-1 rounded-full ring-white w-6 h-6 flex justify-center items-center text-center text-xs ${selectedStatuses.includes(status) ? getStatusClass(status ?? "-") : "bg-slate-100 text-neutral-700 border border-slate-300 "}`}>
        <p>{statusCount}</p>
      </div>
    </div>
  );
})}
 </div>
<div className='text-neutral-700 text-base flex justify-center items-center hover:text-red-200 hover:font-semibold text-center w-auto h-[36px] font-cabin cursor-pointer whitespace-nowrap' onClick={() => setSelectedStatuses([])}>Clear All</div>
</div> */}
{/* <StatusFilter
statuses={["48 Hours", "7 Days", "Within 30 Days", "Beyond 30 Days"]}
tripData={tripData}
selectedStatuses={selectedRange}
handleStatusClick={handleTabClick}
filter_icon={filter_icon}
getStatusClass={getStatusClass}
getStatusCount={getStatusCount}
setSelectedStatuses={setSelectedRange}
/> */}



<div className=''>
 
 <Input placeholder="Search Expense..." type="search" icon={search_icon} onChange={(value)=>setSearchQuery(value)}/>
</div>


    </div>
    </div>

    <div className=' w-full flex flex-col'>
      {Tab()}
    </div>
  
  </div>)}
    </>


   

    
   
  )
}

export default Finance






