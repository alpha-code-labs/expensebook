import React, { useEffect, useState } from 'react';
import { briefcase, modify, receipt, receipt_icon1, categoryIcons, filter_icon, plus_violet_icon, cancel, search_icon, info_icon } from '../assets/icon';
import { formatAmount, getStatusClass, splitTripName } from '../utils/handyFunctions';
import { travelExpense, nonTravelExpense } from '../utils/dummyData';
import { handleNonTravelExpense, handleTravelExpense } from '../utils/actionHandler';
import Modal from '../components/common/Modal1';
import { useParams } from 'react-router-dom';
import { useData } from '../api/DataProvider';
import TripSearch from '../components/common/TripSearch';
import Button1 from '../components/common/Button1';
import Error from '../components/common/Error';

import Input from '../components/common/SearchInput';
import { TripName } from '../components/common/TinyComponent';


const Expense = ({isLoading ,fetchData,loadingErrMsg}) => {

  const [tripId , setTripId]=useState(null);
  const [expenseType , setExpenseType]=useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [textVisible,setTextVisible]=useState({tripId:false}); 
  const [modalOpen , setModalOpen]=useState(false);
  const [tripData, setTripData]=useState([]);
  const {tenantId,empId,page}= useParams();
  const { employeeData } = useData();
  const [error , setError]= useState({
    tripId: {set:false, message:""}
  }); 
  const [searchQuery , setSearchQuery] = useState('');
  const [expenseData , setExpenseData] = useState({})


  

  
  useEffect(()=>{

    fetchData(tenantId,empId,page)

  },[])
  


  // useEffect(() => {
  //   if (employeeData) {
  //     const data = employeeData?.dashboardViews?.employee || [];
     
  //     const intransitTrips = data?.trips?.transitTrips || [];
  
  //     const dataForRaiseCashadvance = [ ...intransitTrips];
  //     const pushedData = dataForRaiseCashadvance?.map(item => ({ ...item, tripName: "us - del - mum - gkr" }));
      
  //     setTripData(pushedData);
      
  //     console.log('Trip data for expense:', dataForRaiseCashadvance);
  //   } else {
  //     console.error('Employee data is missing.');
  //   }
  // }, [employeeData]);

  useEffect(()=>{
    const data = employeeData?.dashboardViews?.employee?.overview || [];
    const intransitTrips = data?.transitTrips || [];
    const completedTrips = employeeData?.dashboardViews?.employee?.expense?.completedTrips || []

    const dataForRaiseCashadvance = [...intransitTrips, ...completedTrips];
    const pushedData = dataForRaiseCashadvance?.map(item => ({ ...item}));
    setTripData(pushedData)
    setExpenseData(employeeData && employeeData?.dashboardViews?.employee?.expense)
  
  },[employeeData])
  
 
  

      const travelExpenses     = expenseData?.allTripExpenseReports || [];
      const nonTravelExpenses  = expenseData?.allNonTravelReports || [];
      console.log('expenses from expense tab', travelExpenses , nonTravelExpenses)
  
  


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
    ).filter(expense =>
      JSON.stringify(expense).toLowerCase().includes(searchQuery)
    );
  };

  const getStatusCount = (status, expenses) => {
    return expenses.filter((expense) => expense?.expenseHeaderStatus === status).length;
  };

  const disableButton = (status) => {
    return ['draft', 'cancelled'].includes(status);
  };

  const handleSelect=(option)=>{
    console.log(option)
    setTripId(option?.tripId)
  }

  const handleRaise = () => {
    if (expenseType=== "travel_Cash-Advance") {
      if (!tripId) {
        setError(prev => ({ ...prev, tripId: { set: true, message: "Select the trip" } }));
        
        return;
      } 
      setError(prev => ({ ...prev, travelRequestId: { set: false, message: "" } }));
      setTripId(null)
      setExpenseType(null)
      setModalOpen(false)
      handleTravelExpense(tripId, '','trip-ex-create')
    } else {
      setExpenseType(null)
      setModalOpen(false)
      handleNonTravelExpense('','non-tr-ex-create')
    }
  };

  return (
    <>
    {isLoading && <Error message={loadingErrMsg}/>}
    {!isLoading && 
    <div className='min-h-screen'>
      <div className='flex-col w-full p-4 flex items-start gap-2'>
      <div className='min-h-[120px] border border-slate-300 bg-white-100 rounded-md  w-full flex flex-wrap items-start gap-2 px-2 py-2'>
      <div className='flex  space-x-2 space-y-2  overflow-x-auto '>
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
          className={`ring-1 ring-white-100 flex py-1 pr-3 text-center rounded-sm ${selectedStatuses.includes(status) ? getStatusClass(status ?? "-") : "bg-slate-100 text-neutral-700 border border-slate-300"}`}
        >
          <p className='px-1 py-1 text-sm text-center capitalize font-cabin whitespace-nowrap '>{status ?? "-"}</p>
        </div>
        <div className={`shadow-md shadow-black/30 font-semibold -translate-x-3 ring-1 rounded-full ring-white-100 w-6 h-6 flex justify-center items-center text-center text-xs ${selectedStatuses.includes(status) ? getStatusClass(status ?? "-") : "bg-slate-100 text-neutral-700 border border-slate-300 "}`}>
          <p>{statusCount}</p>
        </div>
      </div>
    );
  })}
   </div>
  <div className='text-neutral-700 text-base flex justify-center items-center hover:text-red-200 hover:font-semibold text-center w-auto h-[36px] font-cabin cursor-pointer whitespace-nowrap' onClick={() => setSelectedStatuses([])}>Clear All</div>
  </div>
 
 

<div className=''>
   
   <Input placeholder="Search Expense..." type="search" icon={search_icon} onChange={(value)=>setSearchQuery(value)}/>
 </div>

 
</div>


       

        <div className='w-full flex md:flex-row flex-col '>
          <div className='flex-1 justify-center items-center'>
            <div className='relative flex justify-center items-center rounded-l-md font-inter text-md text-white-100 h-[52px] bg-indigo-600 text-center'>
          <div
          onClick={()=>setModalOpen(!modalOpen)}
          onMouseEnter={() => setTextVisible({cashAdvance:true})}
          onMouseLeave={() => setTextVisible({cashAdvance:false})}
          className={`absolute  left-0 ml-4 hover:px-2 w-6 h-6 hover:overflow-hidden hover:w-auto group text-indigo-600 bg-indigo-100 border border-white-100 flex items-center justify-center  hover:gap-x-1 rounded-full cursor-pointer transition-all duration-300`}
          >
          <img src={plus_violet_icon} width={16} height={16} alt="Add Icon" />
          <p
          className={`${
          textVisible?.expense ? 'opacity-100' : 'opacity-0 w-0'
          } whitespace-nowrap text-xs transition-all duration-300 group-hover:opacity-100 group-hover:w-auto`}
          >
          Raise an Expense
          </p>
          </div>
              
              <div className='flex justify-center items-center'>
                <img src={receipt_icon1} className='w-6 h-6 mr-2' />
                <p>Travel Expenses</p>
              </div>
            </div>
            <div className='w-full mt-4 xl:h-[570px] lg:h-[370px] md:[590px] overflow-y-auto px-2 bg-white-100 rounded-l-md'>
              {travelExpenses?.map((trip, index) => {
                const filteredTripExpenses = filterExpenses(trip?.travelExpenses);
                if (filteredTripExpenses.length === 0) return null; // Skip rendering if no expenses match the selected statuses

                return (
                  <div key={`${index}-tr-expense`} className='mb-4 text-neutral-700 rounded-md shadow-custom-light bg-white-100 p-4'>
                   <TripName tripName={trip?.tripName}/>
                    <div className='mt-2 space-y-2'>
                      {filteredTripExpenses.map((trExpense, index) => (
                        <div key={index} className='border border-slate-300 rounded-md px-2 py-1'>
                          <div className='flex flex-row justify-between items-center py-1 border-b border-slate-300 font-cabin font-xs'>
                            <div className={`text-center rounded-sm ${getStatusClass(trExpense?.expenseHeaderStatus ?? "-")}`}>
                              <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{trExpense?.expenseHeaderStatus ?? "-"}</p>
                            </div>
                            <div onClick={()=>{handleTravelExpense(trip?.tripId, trExpense?.expenseHeaderId,  'trip-ex-modify' ,)}} className={`w-7 h-7 bg-indigo-100 rounded-full border border-white-100 flex items-center justify-center`}>
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

            <div className='w-full mt-4 xl:h-[570px] lg:h-[370px] md:[590px] overflow-y-auto px-2 bg-white-100 rounded-r-md'>
              {filterExpenses(nonTravelExpenses)?.map((nonTravelExp, index) => (
                <div key={`${index}-nonTr-expense`} className='mb-4 text-neutral-700 rounded-md shadow-custom-light bg-white-100 p-4'>
                  <div className='flex flex-row justify-between'>
                    <div className='flex gap-2 items-center'>
                      <img src={receipt} className='w-5 h-5' />
                      <div >
                        <div className='header-title'>Expense Header No.</div>
                        <p className='header-text'>{nonTravelExp?.expenseHeaderNumber}</p>
                      </div>
                    </div>
                    <div className='flex flex-row gap-2 justify-between items-center font-cabin font-xs'>
                      <div className={`text-center rounded-sm ${getStatusClass(nonTravelExp?.expenseHeaderStatus ?? "-")}`}>
                        <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{nonTravelExp?.expenseHeaderStatus ?? "-"}</p>
                      </div>
                      <div onClick={() => { handleNonTravelExpense(nonTravelExp?.expenseHeaderId,"non-tr-ex-modify") }} className={`w-7 h-7 bg-indigo-100 rounded-full border border-white-100 flex items-center justify-center ${disableButton(nonTravelExp?.travelRequestStatus) ? ' cursor-not-allowed opacity-50' : ' cursor-pointer'}`}>
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

      <Modal 
        isOpen={modalOpen} 
        onClose={modalOpen} 
        content={<div className='w-full h-auto'> 
          <div>
              <div className='flex gap-2 justify-between items-center bg-indigo-100 w-full p-4'>
                <p className='font-inter text-base font-semibold text-indigo-600'>Raise an Expense</p>              
                <div onClick={()=>{setModalOpen(!modalOpen);setTripId(null);setExpenseType(null)}} className='bg-red-100 cursor-pointer rounded-full border border-white-100'>
                <img src={cancel} className='w-5 h-5'/>
                </div>
              </div>
<div className='p-4'>
<div className='flex md:flex-row flex-col justify-between gap-2'>
 <div onClick={()=>setExpenseType("travel_Cash-Advance")} className={`min-w-fit cursor-pointer transition  duration-200 hover:bg-indigo-100 hover:rounded-md flex-1 flex gap-2 items-center justify-center ${expenseType === "travel_Cash-Advance" ? ' border-b-2 border-indigo-600 text-indigo-600' : 'border-b-2 border-white-100 '}  p-4`}>
    <img src={receipt} className='w-5 h-5'/>
    <p className='truncate '>Travel Expense</p> 
 </div> 
           
  <div onClick={()=>setExpenseType("non-Travel_Cash-Advance")} className={`min-w-fit cursor-pointer transition  duration-200 hover:bg-indigo-100 hover:rounded-md flex-1  flex items-center justify-center gap-2 p-4 ${expenseType === "non-Travel_Cash-Advance" ? 'border-b-2 border-indigo-600 text-indigo-600': "border-b-2 border-white-100"}  `}>
    <img src={receipt} className='w-5 h-5'/>
    <p className='truncate  shrink'>Non-Travel Expense</p>
  </div>
  
  </div>  
  

<div className='flex gap-4 flex-col items-start justify-start w-full py-2'>
{ expenseType=== "travel_Cash-Advance" &&
 <div className='w-full'>
  <TripSearch placeholder={"Select the trip"} error={error?.tripId} title="Apply to trip" data={tripData} onSelect={handleSelect} />
 </div> }
  


{expenseType && <Button1 text={"Raise"} onClick={handleRaise} />}

  
   


</div>   
</div>


 
   
            
          </div>

      </div>}
      />
    </div>}
    </>
  );
};

export default Expense;


