import React, { useState,useEffect } from 'react'
import { StatusFilter } from '../common/TinyComponent'
import Input from '../common/SearchInput'
import Input1 from '../common/Input'
import { chevron_down_icon, csv_icon, export_icon, filter_icon, pdf_icon, search_icon } from '../assets/icon'
import SettleCashAdvance from '../tabs/SettleCashAdvance'
import RecoverCashAdvance from '../tabs/RecoverCashAdvance'
import SettleTravelExpense from '../tabs/SettleTravelExpense'
import SettleNonTravelExpense from '../tabs/SettleNonTravelExpense'
import AccountEntry from '../tabs/AccountEntry'
import Error from '../common/Error'
import {TravelExpense, TRCashadvance} from '../utilis/dummyData'
import { useParams } from 'react-router-dom'
import { getAccountEntriesData_API, getFinanceData_API } from '../utilis/api'
import { calculateDateRanges, filterByTimeRange, handleCSVDownload } from '../utilis/handyFunctions'
import Select from '../common/Select'
import Button1 from '../common/Button1'
import IconOption from '../common/IconOption'
import { flattenData } from '../utilis/dataToTable'



const Finance = () => {
  
  const {tenantId,empId}=useParams()
  const [activeTab, setActiveTab] = useState("Settle Cash-Advances")
  const [financeData, setFinanceData] =useState(null)
  const [AcEntryData, setAcEntryData]= useState({'travelExpense': [], 'nonTravelExpense':  [], 'cash': []})
  const [paidBy , setPaidBy]=useState(null)
  const [isLoading, setIsLoading]=useState(true)
  const [isUploading, setIsUploading] =useState(false)
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

 const settleCashAdvanceCount = financeData?.cashAdvanceToSettle?.length || 0;
const recoverCashAdvanceCount = financeData?.paidAndCancelledCash?.length || 0;
const settleTravelExpenseCount = financeData?.travelExpense?.length || 0;
const settleNonTravelExpenseCount = financeData?.nonTravelExpense?.length || 0;




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

  const handleGenerateEntry = async (data) => {

    console.log('action from confirm ', data);
   

   let api = getAccountEntriesData_API({tenantId,empId,data})
  
    
  
    let validConfirm = true;
   console.log('api hitted',api)
    if (validConfirm) {
      try {
        setIsUploading(true);
        const response = await api;
        console.log('account entry response',response)
        setAcEntryData({'travelExpense':response?.travelExpense || [], 'nonTravelExpense': response?.nonTravelExpense || [], 'cash': response?.cash || []})
        setIsUploading(false);
        // setShowPopup(true);
        // setMessage(response);
        // setTimeout(() => {
        //   setShowPopup(false);
        //   setIsUploading(false);
        //   setMessage(null);
        //   setModalOpen(false)
        //   setApiData(null)
        //   iframeRef.current.src = iframeRef.current.src;
        //   //window.location.reload();
        // }, 3000);

      } catch (error) {
        console.log('error from entry',error.message)
        setIsUploading(false)
        window.parent.postMessage({popupMsg:error.message}, dashboardBaseUrl);
        // setShowPopup(true);
        //setMessage(error.message);
        // setTimeout(() => {
        //   setIsUploading(false);
        //   setMessage(null);
        //   setShowPopup(false);
        // }, 3000);
      }
    }
  };
  console.log('account entry',AcEntryData)

  function Tab () {
    switch (activeTab) {
      case "Settle Cash-Advances":
        return dataFilterByDate(settleCashAdvanceData).map((trip, index)=>(<SettleCashAdvance trip={trip} key={index} handleActionConfirm={handleActionConfirm}  />));
      case "Recover Cash-Advances":
        return dataFilterByDate(recoverCashAdvanceData).map((trip, index)=>(<RecoverCashAdvance trip={trip} key={index} handleActionConfirm={handleActionConfirm}/>));
      case "Settle Travel Expenses":
        return settleTravelExpenseData?.map((expense,index)=>(<SettleTravelExpense trip={expense} key={index} handleActionConfirm={handleActionConfirm}/>));
      case "Settle Non-Travel Expenses":
        return settleNonTravelExpenseData.map((expense,index)=>(<SettleNonTravelExpense trip={expense} key={index} handleActionConfirm={handleActionConfirm}/>));
      case "Account Entries":
        return <AccountEntry data={AcEntryData}/>;
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

    

    const tabs = [
      { name: "Settle Cash-Advances", count: settleCashAdvanceData.length },
      { name: "Recover Cash-Advances", count: recoverCashAdvanceData.length },
      { name: "Settle Travel Expenses", count: settleTravelExpenseData.length },
      { name: "Settle Non-Travel Expenses", count: settleNonTravelExpenseData.length },
      { name: "Account Entries", count: 0 } // assuming no count for this
    ];
  return (
    <>
    {isLoading ? 
    <Error message={errorMsg}/> :
    (<div className='bg-white min-h-screen border-slate-400 w-full h-[100%] flex-col  flex items-start gap-2  '>
      <div className='static md:sticky border p-2 rounded-md top-0 w-full space-y-2 bg-white '>
      <div className=' bg-white  flex  justify-start items-center overflow-x-auto w-full'>
      {
  tabs?.map((tab, index) => (
    <div
      onClick={() => handleSwitchTab(tab.name)}
      key={index}
      className={`text-sm shrink-0 flex justify-center items-center font-cabin text-center truncate h-10 px-2 py-2 ${activeTab === tab.name ? 'border-b-2 border-indigo-600 hover:border-0' : ' '} hover:border-slate-300 hover:border-b-2 hover:text-neutral-500 text-neutral-700 cursor-pointer `}
    >
      <p className="flex items-center justify-center gap-1">
        {tab.name}
        {tab.count > 0 && (
          <div className={`shadow-sm shadow-black/30 font-semibold ring-1 rounded-full ring-white min-w-6 min-h-6 flex justify-center items-center text-center text-xs bg-slate-100 text-neutral-700 border border-slate-300 ml-2`}>
            <p>{tab.count}</p>
          </div>
        )}
      </p>
    </div>
  ))
}
      </div>
      <div className=' border border-slate-300  rounded-md  w-full flex flex-wrap items-start gap-2 px-2 py-2'>
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


{activeTab === 'Account Entries' ? 
  <AccountEntryComponent isLoading={isUploading} handleConfirm={handleGenerateEntry} data={AcEntryData} /> :
  <div className=''>
 
 <Input placeholder="Search Expense..." type="search" icon={search_icon} onChange={(value)=>setSearchQuery(value)}/>
</div>}




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





// import React, { useState, useEffect } from 'react';
// import Select from '../common/Select';
// import Input from '../common/Input';
// import { calculateDateRanges } from '../utilis/handyFunctions';
// import { SettleNowBtn } from '../common/TinyComponent';
// import Button1 from '../common/Button1';

const AccountEntryComponent = ({isLoading, handleConfirm,data}) => {
  const tableData = flattenData(data)
  
  const [filterForm, setFilterForm] = useState({
    startDate: '',
    endDate: '',
    reportType:''
  });

  useEffect(() => {
    const today = new Date();
    const formattedToday = formatDateToYYYYMMDD(today);
    setFilterForm({
      startDate: formattedToday,
      endDate: formattedToday,
      reportType:'all'
    });
  }, []);

  const handlePresetChange = (label) => {
    const selectedRange = presetOptions.find(preset => preset.label === label).range;
    setFilterForm(prevForm =>({...prevForm,
      startDate: formatDateToYYYYMMDD(selectedRange[0]),
      endDate: formatDateToYYYYMMDD(selectedRange[1])
    }));
  };
  const reportTypes = [{title:'All',name:'all'},{ title:'Cash-Advances' ,name:"cash"}, {title:'Travel Expenses',name:'travel'},{title: 'Non-Travel Expenses', name:'nonTravel'}]
  
  const handleFilterForm = (key, value) => {
    console.log('value', value);
    
    if (key === 'reportType') {
      // Find the selected report type object based on the title
      const selectedReportType = reportTypes.find(item => item.title === value);
      
      // Store the 'name' property of the selected report type
      setFilterForm(prevForm => ({
        ...prevForm,
        [key]: selectedReportType ? selectedReportType.name : '' // Use an empty string if not found
      }));
    } else {
      setFilterForm(prevForm => ({
        ...prevForm,
        [key]: value
      }));
    }
  };

  const formatDateToYYYYMMDD = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const presets = () => {
    const today = new Date();
    const ranges = calculateDateRanges(today,1);

    return [
      { label: 'Today', range: [today, today] },
      { label: 'Yesterday', range: [ranges.subtractedDate, ranges.subtractedDate] },
      { label: 'Last 7 Days', range: [calculateDateRanges(today, 6).subtractedDate, today] },
      { label: 'This Week', range: [ranges.startWeek, ranges.endWeek] },
      { label: 'This Month', range: [ranges.startMonth, ranges.endMonth] }
    ];
  };

  console.log('filter data', filterForm)

  const presetOptions = presets();

  const handleDownloadfile=(file)=>{
    const fileName = `Account_Entry(${filterForm.startDate}-${filterForm.endDate})`
    if(tableData.length===0){
      console.log('table data not available')
    }else{
      if(file === 'PDF'){
        //handleCSVDownload(json.employees)
      }else if (file === 'CSV'){
        console.log('CSV data',tableData)
        handleCSVDownload(tableData,fileName)
      }
    }
  }
  

  return (
    <>
    <div className='flex flex-col md:flex-row gap-2 md:gap-8 items-start border-b border-slate-300 p-4 w-full '>
    <div className='flex-1 w-full'>
      <Select
        variant='min-w-[200px] w-full'
        options={reportTypes.map((item)=>(item.title))}
        onSelect={(value) => handleFilterForm('reportType', value)}
        title="Report Type"
      />
    </div>
  
    <div className='flex flex-col md:flex-row gap-4 md:gap-8 items-center w-full'>
      <Select
        variant='lg:max-w-[150px]'
        options={presetOptions.map(preset => preset.label)}
        onSelect={(value) => handlePresetChange(value)}
        title="Custom"
      />
      
      <div className='flex sm:flex-row flex-col gap-2 md:gap-4  w-full'>
        <Input1
          title="From"
          type="date"
          value={filterForm.startDate}
          onChange={(value) => handleFilterForm('startDate', value.target.value)}
        />
        <Input1
          title="Till"
          type="date"
          value={filterForm.endDate}
          onChange={(value) => handleFilterForm('endDate', value.target.value)}
        />
      </div>
      
    </div>
   
    
   
  
  </div>
   <div>
   <Button1
     onClick={() => handleConfirm(filterForm)}
     loading={isLoading}
     active={isLoading}
     text='Generate'
   />
   </div>
   <IconOption 
        buttonText={
          <div className='inline-flex justify-center items-center gap-2'>
          <img src={export_icon} className='w-4 h-4 -rotate-90'/>
          <div className='cursor-pointer'>
            <p className='text-base text-indigo-600 font-semibold'>Export As</p>
          </div>
         
          </div>
        }
      >
        {
          [{name:'PDF',icon:pdf_icon}, {name:'CSV',icon:csv_icon }].map((ele)=>(
            <div onClick={()=>handleDownloadfile(ele.name)} key={ele.name}  className='flex items-center gap-2 px-2 py-2 hover:bg-indigo-50 rounded-md cursor-pointer'>
              <img src={ele.icon} className='w-4 h-4'/>
              <p className='font-cabin text-base '>{ele.name}</p>
            </div>
          ))
        }
      </IconOption>
   </>
  
  );
};








