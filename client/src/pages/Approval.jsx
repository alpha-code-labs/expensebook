/* eslint-disable no-unreachable */
import React, { useEffect, useState } from 'react';
import { briefcase, cancel, cancel_round, check_tick, cross_icon, filter_icon, info_icon, modify, money, money1, plus_violet_icon, search_icon } from '../assets/icon';
import { formatAmount, getStatusClass, splitTripName } from '../utils/handyFunctions';
import {TRCashadvance,NonTRCashAdvances} from '../utils/dummyData';
import Modal from '../components/common/Modal1';
import TripSearch from '../components/common/TripSearch';
import Button1 from '../components/common/Button1';
import { handleApproval, handleCashAdvance } from '../utils/actionHandler';
import TravelMS from './TravelMS';
import { useData } from '../api/DataProvider';
import Error from '../components/common/Error';
import { useParams } from 'react-router-dom';
import Input from '../components/common/SearchInput';

const Approval = ({isLoading, fetchData, loadingErrMsg}) => {

   
   
   const [approvalUrl , setApprovalUrl]=useState(null)
  const [visible, setVisible]=useState(false) 
  const [travelRequestId , setTravelRequestId]=useState(null) 
  const [advancetype , setAdvanceType]=useState(null) 
  const [textVisible,setTextVisible]=useState({cashAdvance:false}) 
  const [modalOpen , setModalOpen]=useState(false) 
  const [searchQuery,setSearchQuery]= useState(false)
  const [seleactAll , setSelectAll]=useState([])


  const handleSelectAll = ()=>{

  if(TRCashadvance?.length !== seleactAll?.length || 0){
      const data = TRCashadvance?.map((travel)=>({
        travelRequestId:travel?.travelRequestId,
        cashAdvanceData: travel?.cashAdvances?.map((cashadvance)=>({cashAdvanceId:cashadvance?.cashAdvanceId}))
      }))
      setSelectAll([...data])
    }else{
      setSelectAll([]);
    }
  }

  
  const handleSelect = (obj) => {
    setSelectAll(prevSelected => {
      const isSelected = prevSelected.some(travel => travel.travelRequestId === obj?.travelRequestId);
      if (isSelected) {
        return prevSelected.filter(travel => travel.travelRequestId !== obj?.travelRequestId);
      } else {
        return [
          ...prevSelected,
          {
            travelRequestId: obj?.travelRequestId,
            cashAdvanceData: obj?.cashAdvances.map(cashadvance => ({
              cashAdvanceId: cashadvance.cashAdvanceId
            }))
          }
        ];
      }
    });
  };
  
  const isTravelRequestSelected = (travelRequestId) => {
    return seleactAll?.some(id => id.travelRequestId === travelRequestId);
  };

  console.log('all selected data', seleactAll)



  const [error , setError]= useState({
    travelRequestId: {set:false, message:""}
  }) 

  const { employeeData } = useData();
  const [travelData, setTravelData]=useState([])
  const [cashAdvanceData, setCashAdvanceData]=useState([])

  const {tenantId,empId,page}= useParams();

  useEffect(()=>{

    fetchData(tenantId,empId,page)

  },[])

  useEffect(() => {
    if (employeeData) {
      const data = employeeData?.dashboardViews?.employee || [];
      const travelData = data?.travelRequests || [];
      const upcomingTrips = data?.trips?.upcomingTrips || [];
      const intransitTrips = data?.trips?.transitTrips || [];
  
      const dataForRaiseCashadvance = [...travelData, ...upcomingTrips, ...intransitTrips];
      const pushedData = dataForRaiseCashadvance?.map(item => ({ ...item, tripName: "us - del - mum - gkr" }));

      setTravelData(pushedData);
  
      console.log('Travel data for raise advance:', dataForRaiseCashadvance);
    } else {
      console.error('Employee data is missing.');
    }
  }, [employeeData]);
  
 
  


  const handleRaise = () => {
    if (advancetype === "travel_Cash-Advance") {
      if (!travelRequestId) {
        setError(prev => ({ ...prev, travelRequestId: { set: true, message: "Select the trip" } }));
        
        return;
      } 
      setError(prev => ({ ...prev, travelRequestId: { set: false, message: "" } }));
      setTravelRequestId(null)
      setAdvanceType(null)
      setModalOpen(false)
      handleVisible(travelRequestId, 'ca-create')
    } else {
      setAdvanceType(null)
      setModalOpen(false)
      handleVisible(travelRequestId, 'ca-create')
    }
  };

 


//cashadvance iframe

    const handleVisible = (travelRequestId, action) => {

  setVisible(!visible);
  let url ;
  if (action==="travel-approval-view"){
    url=handleApproval(tenantId , empId ,travelRequestId, "", action)
    console.log('url',url)
    
  }
  else if (action==="travelExpense-approval-view"){
    url=handleCashAdvance("", action);
   
  }
  else {
    throw new Error('Invalid action');
  }
  
  setApprovalUrl(url)
      }



  useEffect(() => {
    const handleMessage = event => {
      console.log(event)
      // Check if the message is coming from the iframe
      if (event.origin === approvalUrl ) {
        // Check the message content or identifier
        if (event.data === 'closeIframe') {
          setVisible(false)
        }
      }
    };
    // Listen for messages from the iframe
    window.addEventListener('message', handleMessage);
  
    return () => {
      // Clean up event listener
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  
  console.log(error.travelRequestId)

  // const handleSelect=(option)=>{
  //   console.log(option)
  //   setTravelRequestId(option?.travelRequestId)
  // }
  
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
  }, [visible]);

  
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  
  const handleStatusClick = (status) => {

    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );

  };
  
  const filterCashadvances = (cashadvances) => {
    if(searchQuery){
      return cashadvances.filter(expense =>
        JSON.stringify(expense).toLowerCase().includes(searchQuery)
      );
    }else{
      return cashadvances
    }
    

  };
  
  const getStatusCount = (status, cashadvance) => {
    return cashadvance.filter((cashadvance) => cashadvance?.cashAdvanceStatus === status)?.length;
  };
  
  
  const disableButton = (status) => {
    return ['draft', 'cancelled'].includes(status);
  };
  
  function ActionButton({approve, reject})
  {
  
    return(<div className='font-cabin text-xs flex gap-x-2 items-center justify-center'>
       
          
        <div className='w-fit hover:shadow-md hover:shadow-red-200/60 transition duration-300 cursor-pointer min-w-[70px] inline-flex gap-2 items-center justify-center border border-red-200 rounded-sm text-center  text-red-200 px-2 py-1 bg-red-100'>
        <p className='text-center'>{reject}</p>
        <div className='border border-red-200 p-[2px] rounded-full'>
          <img src={cross_icon} className='w-3 h-3'/>
        </div>
        </div>
        <div className='w-fit hover:shadow-md hover:shadow-green-200/60 transition duration-300 cursor-pointer min-w-[70px] inline-flex gap-2 items-center justify-center  border border-green-200 rounded-sm text-center  text-green-200 px-2 py-1 bg-green-100'>
          <p className='text-center'>{approve}</p>
          <div className='border border-green-200 p-[2px] rounded-full '><img src={check_tick} className='w-3 h-3'/></div>
        </div>
      </div>)
    
  }
  
  
  return (
    <>
     {isLoading && <Error message={loadingErrMsg}/>}
     {!isLoading && 
    <div className='min-h-screen'>
       <TravelMS visible={visible} setVisible={setVisible} src={approvalUrl}/>
      <div className='flex-col w-full p-4 flex items-start gap-2'>
      
      <div className=' border border-slate-300 bg-white-100 rounded-md  w-full flex flex-col justify-center items-start px-2'>
 {/* <div className='flex flex-wrap  space-x-2 '>      
<div className='flex items-center justify-center p-2 bg-slate-100 rounded-full border border-slate-300 '><img src={filter_icon} className='w-5 h-5'/></div>
  {["draft","pending approval", "pending settlement", "paid",  "cancelled", "paid and cancelled"].map((status) => {
    const statusCount = getStatusCount(status, [...TRCashadvance.flatMap(te => te?.cashAdvances), ...NonTRCashAdvances]);
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
</div>  */}

<div>
   
   <Input placeholder="Search Expense..." type="search" icon={search_icon} onChange={(value)=>setSearchQuery(value)}/>
   
 </div>
</div>
        <div className='w-full flex md:flex-row flex-col'>
        <div className='flex-1 rounded-md justify-center items-center'>
         
<div className='relative  flex justify-center items-center  rounded-l-md   font-inter text-md text-white-100 h-[52px] bg-indigo-600  text-center'>

<div
onClick={()=>setModalOpen(!modalOpen)}
onMouseEnter={() => setTextVisible({cashAdvance:true})}
onMouseLeave={() => setTextVisible({cashAdvance:false})}
className={`absolute left-0 ml-4 hover:px-2 w-6 h-6 hover:overflow-hidden hover:w-auto group text-indigo-600 bg-indigo-100 border border-white-100 flex items-center justify-center  hover:gap-x-1 rounded-full cursor-pointer transition-all duration-300`}
>
<img src={plus_violet_icon} width={16} height={16} alt="Add Icon" />
<div
className={`${
textVisible?.cashAdvance ? 'opacity-100' : 'opacity-0 w-0'
} whitespace-nowrap text-xs transition-all duration-300 group-hover:opacity-100 group-hover:w-auto`}
>
Raise a Cash-Advance
</div>
</div>            
  <div className='flex justify-center items-center'>
    <img src={money1} className='w-6 h-6 mr-2'/>
     <p>Travel & Cash-Advances</p>
    </div>

            </div>
  <div className='flex px-2 h-[52px] py-4  items-center justify-start gap-2'>
    <input type='checkbox' checked={TRCashadvance.length === seleactAll.length ? true : false}  className='w-4 h-4 accent-indigo-600' onChange={handleSelectAll}/>
    Select All
    <div>
    {seleactAll.length > 1 && <ActionButton approve={"Approve All"} reject={"Reject All"}/>}
    </div>
  </div>

      <div className='w-full bg-white-100 xl:h-[570px] lg:h-[370px] md:[590px] overflow-y-auto px-2'>
          {filterCashadvances(TRCashadvance).map((trip) => { 
            return (
            <div key={trip.tripId} className='mb-4 rounded-md shadow-custom-light bg-white-100 p-4'>
             <div className='flex gap-2 flex-col'>
              <div className='flex flex-row justify-between'>
                <div className='flex gap-2 items-center'>
                <input onChange={() => handleSelect(trip)} type='checkbox' className='w-4 h-4 accent-indigo-600' checked={isTravelRequestSelected(trip?.travelRequestId)}/>
             <div>
                <p className='header-title'>Created By</p>
                <p className='header-text'>{trip?.createdBy?.name ?? <span className='text-center'>-</span>}</p>
             </div>
              </div>
                <ActionButton approve={"Approve"} reject={"Reject"}/>
              </div>
             <div className='flex flex-row justify-between'>
              
              <div className='flex gap-2 items-center'>
              <img src={briefcase} className='w-4 h-4'/>
              <div className='font-medium font-cabin text-md uppercase'>
               {splitTripName(trip?.tripName)}
              </div>
              </div>
             <div className='flex items-center justify-center'>
             <img src={info_icon} className='w-4 h-4'/>
              <div className='text-sm font-cabin px-2 py-1 cursor-pointer' onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible(trip?.travelRequestId,  'travel-approval-view' )}}}>
                <p className='text-indigo-600 font-semibold'>View Details</p>
              </div>
              </div>
              </div>
              </div>
              
              {trip?.cashAdvances?.map((advance,index) => (
                <div key={index} className={`px-2 py-2 ${index < trip?.cashAdvances.length-1 && 'border-b border-slate-400 '}`}>
                  <div className='flex justify-between'>
                    <div className='flex flex-col justify-center max-w-[120px]'>
                    <div className='font-medium text-sm font-cabin text-neutral-400'>Advance Amount</div>
<div className='font-medium text-sm font-cabin text-neutral-700'>
  {advance.amountDetails.map((amount, index) => (
    <div key={index}>
      {`${amount.currency.shortName} ${formatAmount(amount.amount)}`}
      {index < advance.amountDetails.length - 1 && <span>, </span>}
    </div>
  ))}
  </div>
  </div>
                    {/* <div className='flex justify-center items-center gap-2'>
                    <div className={`text-center rounded-sm ${getStatusClass(advance?.cashAdvanceStatus ?? "-")}`}>
                       <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{advance?.cashAdvanceStatus ?? "-"}</p>
                    </div>
                    <div onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible(trip?.travelRequestId,  'ca-modify' ,advance?.cashAdvanceId,)}}} className={`w-7 h-7 bg-indigo-100 rounded-full border border-white-100 flex items-center justify-center ${disableButton(trip?.travelRequestStatus)? ' cursor-not-allowed opacity-50' : ' cursor-pointer'}`}>
                    <img src={modify} className='w-4 h-4' alt="modify_icon" />
                    </div>
                  </div> */}
                  </div>
                </div>
))}
            </div>
            )
           })}
      </div>
          </div>
          <div className='flex-1 rounded-md'>
            <div className='flex justify-center items-center rounded-r-md font-inter text-md text-white-100 h-[52px] bg-indigo-600  text-center'>
              <img src={money1} className='w-6 h-6 mr-2'/>
              <p>Travel & Non-Travel Expenses</p>
            </div>
            <div className='flex px-2 h-[52px] py-4 items-center justify-start gap-2'>

            </div>
<div className='w-full bg-white-100 xl:h-[570px] lg:h-[370px] md:[590px] overflow-y-auto px-2'>

  {filterCashadvances(NonTRCashAdvances).map((cashAdvance,index) => (
              <div key={`${index}nonTr`} className='mb-4 rounded-md shadow-custom-light bg-white-100 p-4'>
              <div className='flex gap-2 items-center'>
              <img src={money} className='w-5 h-5'/>
              <div>
               <div className='header-title'>Cash-Advance No.</div>
               <p className='header-text'>{cashAdvance?.cashAdvanceNumber}</p>
              </div>
              </div>
                <div className={`px-2 py-2`}>
                  <div className='flex justify-between'>
                    <div className='flex flex-col justify-center max-w-[120px]'>
                      <div className='font-medium text-sm font-cabin text-neutral-400'>Advance Amount</div>
<div className='font-medium text-sm font-cabin text-neutral-700'>
{cashAdvance?.amountDetails.map((amount, index) => (
    <div key={index}>
      {`${amount?.currency?.shortName} ${formatAmount(amount.amount)}`}
      {index < cashAdvance?.amountDetails.length - 1 && <span>, </span>}
    </div>
  ))}
</div>

                  </div>
                    <div className='flex justify-center items-center gap-2 '>
                    <div className={`text-center rounded-sm ${getStatusClass(cashAdvance?.cashAdvanceStatus ?? "-")}`}>
                       <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{cashAdvance?.cashAdvanceStatus ?? "-"}</p>
                  </div>
                    <div  className='cursor-pointer w-7 h-7 bg-indigo-100 rounded-full border border-white-100 flex items-center justify-center'>
                    <img src={modify} className='w-4 h-4' alt="Add Icon" />
                  </div>
                  </div>
                  </div>
                </div>
   </div>))}
</div>
          </div>
        </div>
      </div>

    {/* <Modal 
        isOpen={modalOpen} 
        onClose={modalOpen}
        content={<div className=' w-full h-auto'>
          <div>
            
              <div className='flex gap-2 justify-between items-center bg-indigo-100 w-full p-4'>
               
                <p className='font-inter text-base font-semibold text-indigo-600'>Raise a Cash-Advance</p>
                <div onClick={()=>{setModalOpen(!modalOpen);setTravelRequestId(null);setAdvanceType(null)}} className='bg-red-100 cursor-pointer rounded-full border border-white-100'>
                <img src={cancel} className='w-5 h-5'/>
                </div>
              </div>
<div className='p-4'>
 <div className='flex md:flex-row flex-col justify-between gap-2 '>
 <div onClick={()=>setAdvanceType("travel_Cash-Advance")} className={`cursor-pointer transition  duration-200 hover:bg-indigo-100 hover:rounded-md flex-1 flex gap-2 items-center justify-center ${advancetype === "travel_Cash-Advance" ? ' border-b-2 border-indigo-600 text-indigo-600' : 'border-b-2 border-white-100 '}  p-4`}>
    <img src={money} className='w-5 h-5'/>
    <p className='truncate '>Travel Cash-Advance</p> 
  </div>
           
  <div onClick={()=>setAdvanceType("non-Travel_Cash-Advance")} className={`cursor-pointer transition  duration-200 hover:bg-indigo-100 hover:rounded-md flex-1  flex items-center justify-center gap-2 p-4 ${advancetype === "non-Travel_Cash-Advance" ? 'border-b-2 border-indigo-600 text-indigo-600': "border-b-2 border-white-100"}  `}>
    <img src={money} className='w-5 h-5'/>
    <p className='truncate  shrink'>Travel & Non-Travel Expenses</p>
  </div>
  
  </div>  

<div className='flex gap-4 flex-col items-start justify-start w-full py-2'>
{ advancetype=== "travel_Cash-Advance" &&
 <div className='w-full'>
  <TripSearch placeholder={"Select the trip"} error={error?.travelRequestId} title="Apply to trip" data={travelData} onSelect={handleSelect} />
 </div> }
  


{advancetype &&  <Button1 text={"Raise"} onClick={handleRaise } />}

  
   


</div>   
</div>


 
   
            
          </div>

      </div>}
      /> */}
     


        
    </div>}
    </>
  );
};

export default Approval;




// import React, { useState,useEffect } from 'react';

// import { useData } from '../api/DataProvider';
// import { getStatusClass ,titleCase, urlRedirection} from '../utils/handyFunctions';
// import { receipt, chevron_down, calender_icon, double_arrow , three_dot ,validation_sym, down_left_arrow, airplane_1, receipt_icon1} from '../assets/icon';
// import ApprovalTravelExpense from '../components/approvals/ApprovalTravelExpense';
// import { handleApproval } from '../utils/actionHandler';
// import { useParams } from 'react-router-dom';
// import TravelMS from './TravelMS';
// import { approvalViewRoutes } from '../utils/route';
// // import CashAdvance from '../components/settlement/CashAdvance';



// const Approval = ({fetchData}) => { 

//   const { employeeData  } = useData();
//   const {tenantId , empId,page} = useParams();
//   const [approvalUrl , setApprovalUrl]=useState(null)
  

//    const [approvalData , setApprovalData]=useState([]); // data for the table in Approval page.
//    const [ trApprovalData,setTrApprovalData]= useState([]);
//    const [expApprovalData , setExpApprovalData]=useState([]);

//    const approvalBaseUrl  = import.meta.env.VITE_APPROVAL_PAGE_URL;
//    const [visible, setVisible]=useState(false)

//    const handleVisible= (travelRequestId ,tripId, expenseHeaderId ,action,)=>{

//      setVisible(!visible);
//      let url ;
//      if (action==="travel-approval"){
//        url=approvalViewRoutes.viewDetails.viewDetails_tr_standalone.getUrl(tenantId,empId,travelRequestId)
//      }
//      else if (action==="approval-view-tr-expense"){
//        url=approvalViewRoutes.viewDetails.viewDetails_tr_expense.getUrl(tenantId,empId,tripId,expenseHeaderId)
//      }
//      else {
//        throw new Error('Invalid action');
//      }
     
//      setApprovalUrl(url)
//    }
//    console.log('approval url',approvalUrl)
   
//    useEffect(() => {
//      const handleMessage = event => {
//        console.log(event)
//        // Check if the message is coming from the iframe
//        if (event.origin === approvalBaseUrl ) {
//          // Check the message content or identifier
//          if (event.data === 'closeIframe') {
//            setVisible(false)
//          }
//        }
//      };
//      // Listen for messages from the iframe
//      window.addEventListener('message', handleMessage);
   
//      return () => {
//        // Clean up event listener
//        window.removeEventListener('message', handleMessage);
//      };
//    }, []);
   
//    useEffect(()=>{
 
//      fetchData(tenantId,empId,page)
 
//    },[])
   
// useEffect(()=>{
//   const data = employeeData && employeeData?.dashboardViews?.employeeManager
//   // setApprovalData(data)
//   setTrApprovalData(data?.travelAndCash)
//   setExpApprovalData(data?.travelExpenseReports)
// },[employeeData])

// const filterTravelApprovalData  = trApprovalData && trApprovalData?.filter(item => ['approved','pending approval', 'upcoming', 'intransit'].includes(item?.travelRequestStatus) )
// console.log('Travel approval data',filterTravelApprovalData)
// console.log('Expense approval data',expApprovalData)

//   const [activeScreen, setActiveScreen] = useState('Travel & Cash Adv. Requests');
//   const handleScreenChange = (screen) => {
//     setActiveScreen(screen);
//   };

//   return (
//     <>
//       {/* <div className="bg-white-100 lg:flex"> */}
//       <div className="relative w-auto min-h-screen px-2 lg:px-10 xl:px-20 flex flex-col  items-center  bg-slate-100  ">
//          <TravelMS visible={visible} setVisible={setVisible} src={approvalUrl}/>
       
       
//           <div className=" flex flex-row items-center justify-start gap-2 sm:gap-4 font-cabin mb-2 mt-[50px]">

//                 <div className='relative'>
//                 {trApprovalData && filterTravelApprovalData?.length > 0 &&  <div className=' absolute right-[-1px] top-[-8px] w-fit p-[6px] bg-green-200 border border-white-100 rounded-full '/>}
//                 <div
//                     className={`cursor-pointer py-1 px-2  w-auto min-w-[100px] truncate${
//                       activeScreen === 'Travel & Cash Adv. Requests' ? 'font-medium rounded-xl bg-purple-500 text-xs text-gray-900 w-auto min-w-[100px] truncate' : ' rounded-xl bg-white-200'
//                     }`}
//                     onClick={() => handleScreenChange('Travel & Cash Adv. Requests')}
//                   >
//                     Travel & Cash-Advance
//                   </div>
//                 </div>
                 
                
//                 <div className='relative'>
//                 {expApprovalData && expApprovalData?.length > 0 &&  <div className=' absolute right-[-1px] top-[-8px] w-fit p-[6px] bg-green-200 border border-white-100 rounded-full '/>}
//                 <div
//                   className={`cursor-pointer py-1 px-2 w-auto min-w-[100px] truncate ${
//                     activeScreen === 'Travel Expenses' ? 'font-medium rounded-xl bg-purple-500 text-xs text-gray-900 w-auto min-w-[100px] truncate' : 'bg-white-100 rounded-xl'
//                   }`}
//                   onClick={() => handleScreenChange('Travel Expenses')}
//                 >
//                 Travel Expense Report
//                 </div>
//                 </div>
             
//           </div>

//           {activeScreen === 'Travel & Cash Adv. Requests' && 
//   <div className='px-4 xl:h-[600px] rounded-md h-[450px] border border-slate-400 w-full bg-white-100 mt-7'>

//   <div className="w-full font-cabin   h-6 flex flex-row gap-3 mt-6 items-center sm:px-4 px-4">
//     <img className="w-6 h-5" src={airplane_1} alt="travel" />
//     <div className="text-base tracking-[0.02em] font-bold">Travel Requests & Cash-Advances</div>
//   </div>

//   <div className="box-border mt-[46px] w-full border-t-[1px] "/>
//   <div className=' overflow-auto w-full h-[315px] xl:h-[460px] my-6'>
//   {trApprovalData && filterTravelApprovalData?.map((item ,index)=>(
//     <div key={index} className='rounded-lg min-w-full w-[650px] grow border min-h-[52px] h-auto mb-2 border-slate-300 hover:border-1 cursor-pointer hover:border-indigo-600 hover:shadow-md px-2 py-2'>
// <div className="flex h-[52px]  items-center justify-between ">
//  <div className=' flex gap-2 justify-between items-center'>  
//    <div className='px-2 py-2 w-[150px]'>
//    <p className='font-cabin font-normal  text-xs text-neutral-400'>Travel Request No.</p>
//    <p className='text-[14px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '> {item?.travelRequestNumber}</p>
//   </div>

  
//       <div className='px-2 py-2'>
//         <p className='font-cabin font-normal text-xs text-neutral-400'>Trip Purpose</p>
//         <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate  capitalize'> {item?.tripPurpose ??""}</p>
//       </div>
      
//       </div>
     

// <div className='flex flex-row '>
//     <div className="flex  h-[52px] px-2 py-3 items-center justify-center">
  
//   <div className={`flex capitalize items-center px-2 py-1 rounded-[12px] text-[12px] font-medium tracking-[0.03em] ${
//      getStatusClass(item?.travelRequestStatus)
//     }`}
//   >
//     {(item?.travelRequestStatus)}
//   </div>
// </div>



// <div className="flex  font-cabin  h-[52px] px-2 py-3 items-center justify-center w-[140px]">
  
 
//   {item?.travelRequestStatus=='pending approval' &&
//    <div onClick={()=>handleVisible(item.travelRequestId,"","","travel-approval")} className="flex-1 flex items-center justify-end py-2 px-3 cursor-pointer">
//    <b className="text-purple-500 text-[14px] tracking-[0.02em] w-[98px] font-bold">
//      View Details
//    </b>
//  </div>}
//  </div>
//  </div>
//  </div> 

//  <div>
//   < div className={`${item?.isCashAdvanceTaken ? 'border-b border-slate-400 mx-2':''}`}/>

//  {item?.cashAdvance && item?.cashAdvance?.map((item,index)=>(
//   <div key={index} className='flex items-center justify-start ml-20  gap-2'>

// <div className='px-2 py-2'>
//   <img className='w-5 h-4 ' src={down_left_arrow}/>
// </div>
//       <div className='px-2 py-2 w-[150px]'>
//         <p className='font-cabin font-normal text-xs text-neutral-400'>Cash-Advance No.</p>
//         <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate'>{item?.cashAdvanceNumber}</p>
//       </div>
//      <div className='px-2 py-2'>
//      <p className='font-cabin font-normal text-xs   text-neutral-400'>Amount Details</p>
    
//       {item?.amountDetails?.map((currencyItem,index)=>(
//       <React.Fragment key={index+'c'}>
//         <div className=' flex flex-row font-cabin gap-4 text-[14px] text-neutral-800 font-medium capitalize'>
//       <div className=' flex flex-row gap-2 '>{currencyItem.type}
//         <p>{currencyItem.currency.shortName}</p>
//         <p> {currencyItem?.amount},</p>
//       </div>
      
//         <p className=' translate-y-[-1px] min-w-full '> {currencyItem?.mode ??' -'}</p>
     
//       </div>
//       </React.Fragment>
//     ))}
//   </div>

//   </div>
//  ))}

//  </div>


//     </div>
//   ))}

//   </div>

//   </div>}


      
//   {activeScreen=== 'Travel Expenses' && 
//   <div className='px-4 xl:h-[600px] rounded-md h-[450px] border border-slate-400 w-full bg-white-100 mt-7'>

//   <div className="w-full font-cabin   h-6 flex flex-row gap-3 mt-6 items-center sm:px-4 px-4">
//     <img className="w-6 h-5" src={receipt} alt="travel" />
//     <div className="text-base tracking-[0.02em] font-bold">Travel Expense Reports</div>
//   </div>

//   <div className="box-border mt-[46px] w-full border-t-[1px] "/>
//   <div className=' overflow-auto w-full h-[315px] xl:h-[460px] my-6'>
//   {expApprovalData && expApprovalData?.map((item ,index)=>(
//     <div key={index} className='rounded-lg min-w-full w-[650px] grow border min-h-[52px] h-auto mb-2 border-slate-300 hover:border-1 cursor-pointer hover:border-indigo-600 hover:shadow-md px-2 py-2'>
// <div className="flex h-[52px]  items-center justify-between ">
//  <div className=' flex gap-2 justify-between items-center'>  
//    <div className='px-2 py-2 w-[150px]'>
//    <p className='font-cabin font-normal  text-xs text-neutral-400'>Trip No.</p>
//    <p className='text-[14px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '> {item?.tripNumber}</p>
//   </div>

  
//       {/* <div className='px-2 py-2'>
//         <p className='font-cabin font-normal text-xs text-neutral-400'>Trip Purpose</p>
//         <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate  capitalize'> {item?.tripPurpose ??""}</p>
//       </div> */}
      
//       </div>
     


//     <div className="flex  h-[52px] px-2 py-3 items-center justify-center">
  
//   <div className={`flex capitalize items-center px-2 py-1 rounded-[12px] text-[12px] font-medium tracking-[0.03em] ${
//      getStatusClass(item?.tripStatus)
//     }`}
//   >
//     {(item?.tripStatus)}
//   </div>
// </div>

// {/* 
// <div className="flex  font-cabin  h-[52px] px-2 py-3 items-center justify-center w-[140px]">
  
 
//   {item?.travelRequestStatus=='pending approval' &&
//    <div onClick={()=>handleVisible(item.travelRequestId,"","","travel-approval")} className="flex-1 flex items-center justify-end py-2 px-3 cursor-pointer">
//    <b className="text-purple-500 text-[14px] tracking-[0.02em] w-[98px] font-bold">
//      View Details
//    </b>
//  </div>}
//  </div> */}

//  </div> 

//  <div>
//   < div className={'border-b border-slate-400 mx-2'}/>

 
//   <div key={index} className='flex items-center justify-between ml-20  gap-2'>
    
// <div className='flex flex-row justify-between items-center'>
// <div className='px-2 py-2'>
//   <img className='w-5 h-4 ' src={down_left_arrow}/>
// </div>
//       <div className='px-2 py-2 w-[150px]'>
//         <p className='font-cabin font-normal text-xs text-neutral-400'>Travel Expense No.</p>
//         <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate'>{item?.expenseHeaderNumber}</p>
//       </div>
//       </div>
      

//      {/* <div className='px-2 py-2'>
//      <p className='font-cabin font-normal text-xs   text-neutral-400'>Amount Details</p>
    
//       {item?.amountDetails?.map((currencyItem,index)=>(
//       <React.Fragment key={index+'c'}>
//         <div className=' flex flex-row font-cabin gap-4 text-[14px] text-neutral-800 font-medium capitalize'>
//       <div className=' flex flex-row gap-2 '>{currencyItem.type}
//         <p>{currencyItem.currency.shortName}</p>
//         <p> {currencyItem?.amount},</p>
//       </div>
      
//         <p className=' translate-y-[-1px] min-w-full '> {currencyItem?.mode ??' -'}</p>
     
//       </div>
//       </React.Fragment>
//     ))}
//   </div> */}
  
// <div className="flex  font-cabin  h-[52px] px-2 py-3 items-center justify-center w-[140px]">
  
 

//    <div onClick={()=>handleVisible("",item?.tripId,item?.expenseHeaderId,"approval-view-tr-expense")} className="flex-1 flex items-center justify-end py-2 px-3 cursor-pointer">
//    <b className="text-purple-500 text-[14px] tracking-[0.02em] w-[98px] font-bold">
//      View Details
//    </b>
//  </div>
//  </div>

//   </div>


//  </div>


//     </div>
//   ))}

//   </div>

//   </div>}


// {/* {activeScreen === 'Travel & Cash Adv. Requests' && 
//            <>
//   <div className="w-full   h-6 flex flex-row gap-3 mt-7 items-center sm:px-8 px-4">
//     <img className="w-6 h-5" src={airplane_1} alt="travel" />
//     <div className="text-base tracking-[0.02em] font-bold">Travel Requests & Cash Advances</div>
//   </div>            
//          <div className="box-border  mt-[46px] w-full  h-px border-t-[1px]   border-slate-300 "/>
        
//          <div className='min-h-[400px] h-full overflow-auto mt-6 w-auto flex flex-col items-center   '>
        
//             {trApprovalData && filterTravelApprovalData?.map((item ,index)=>(
//               <React.Fragment key={index}>
//             <div key={index} className="box w-full max-w-[896px]  h-auto  mx-2 sm:mx-4 mb-2  font-cabin">
//             <div className="w-full   h-auto  lg:min-h-[56px] rounded-xl border-[1px] border-b-gray hover:border-indigo-600 ">
//             <div className='w-full max-w-[932px]  rounded-md'>
//     <div className={`w-auto max-w-[900px] bg-white-100 h-auto max-h-[180px] lg:h-[52px] flex flex-col lg:flex-row items-start lg:items-center justify:start lg:justify-center ${item?.isCashAdvanceTaken ?'border-b-[1px]  border-b-gray' :""} m-2`}>    
//     <div className='flex flex-auto flex-row w-full justify-between gap-2'>
//     <div className='flex flex-1 flex-col lg:flex-row gap-0 md:gap-2'>


  
//    <div className="flex h-[52px] items-center justify-start w-auto lg:w-fit py-0 md:py-3 px-2 order-1">
   
//    <div >
//    <p className='font-cabin font-normal  text-xs text-neutral-400'>Travel Request No.</p>
//     <p className='lg:text-[14px] text-[16px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '> {item?.travelRequestNumber}</p>
//    </div>
//  </div> 
    
//      <div className="flex h-[52px] items-center justify-start w-auto lg:w-[221px] py-0 md:py-3 px-2 order-1">
//       <div>
//         <p className='font-cabin font-normal text-xs text-neutral-400'>Trip Purpose</p>
//         <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate  capitalize'> {item?.tripPurpose ??""}</p>
//       </div>
//     </div> 

   
//     </div>

  
    
  

//  <div className='flex flex-col-reverse justify-between lg:items-center items-end flex-1 lg:flex-row gap-2 '>
 
//  <div className="flex flex-1 h-[52px] px-2 py-3 items-center justify-center  w-auto">
  
//   <div className={`flex capitalize items-center px-3  pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] ${
//      getStatusClass(item?.travelRequestStatus)
//     }`}
//   >
//     {(item?.travelRequestStatus)}
//   </div>
// </div>
//  <div className="flex flex-1  h-[52px] px-2 py-3 items-center justify-center  w-[146px]">
  
 
//   {item?.travelRequestStatus=='pending approval' &&
//    <div onClick={()=>handleVisible(item.travelRequestId,"","","travel-approval")} className="flex-1 flex items-center justify-end py-2 px-3 cursor-pointer">
//    <b className="text-purple-500 text-[14px] tracking-[0.02em] w-[98px] font-bold">
//      View Details
//    </b>
//  </div>
//  }
 

// </div>

   
//  </div>
    
   
// </div>
//   </div>
//   </div>
//   <div className='h-auto'>
//   {item?.cashAdvance && item?.cashAdvance?.map((item,index)=>(
//     <>
//     <div key={index} className='flex flex-row items-center ml-0   lg:ml-32  sm:ml-28 gap-2 text-gray-200'>
//   <div className='w-auto  mi min-w-[20px] flex justify-center items-center px-3 py-3 '>
//   <img className='w-6 h-[20px] translate-y-[-2px]' src={down_left_arrow}/>
      
      
//   </div>
//     <div className="flex h-[52px] items-center justify-start w-auto lg:w-[221px] py-0 md:py-3 px-2 ">
//       <div>
//         <p className='font-cabin font-normal text-xs text-neutral-400'>Cash-Advance No.</p>
//         <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate'>{item?.cashAdvanceNumber}</p>
//       </div>
//   </div> 
 
//   <div className='flex w-auto sm:w-[170px] min-w-[120px] justify-center items-center px-0 sm:py-2 sm:px-3 font-cabin gap-2'>
  
// <div className='flex w-auto sm:w-[170px]  min-w-[120px] justify-start items-center px-0 sm:py-2 sm:px-3 font-cabin gap-2'>
//   <div className=' '>
//   <p className='font-cabin font-normal text-xs  text-neutral-400'>Amount Details</p>
    
//       {item?.amountDetails?.map((currencyItem,index)=>(
//       <React.Fragment key={index}>
//         <div className=' flex flex-row gap-4 text-[14px] text-neutral-800 font-medium capitalize'>
//       <div className=' flex flex-row gap-2 '>{currencyItem.type}
//         <p>{currencyItem.currency.shortName}</p>
//         <p> {currencyItem?.amount},</p>
//       </div>
//         <p className=' translate-y-[-1px] min-w-full '> {currencyItem?.mode ??' -'}</p>
//       </div>
//       </React.Fragment>
//     ))}
//   </div>
// </div>
// </div>


 
//   {item.travelRequestStatus !=='pending approval' && item.cashAdvanceStatus=='pending approval' &&
//    <div onClick={()=>handleVisible(item.travelRequestId,"", "approval-view-tr-expense")} className="flex-1 flex items-center justify-end py-2 px-3 cursor-pointer">
//    <b className="text-purple-500 text-[14px] tracking-[0.02em] w-[98px] font-bold">
//      View Details
//    </b>
//  </div>

 
 
//  }
//   </div>
//     </>
//   ))}
//   </div>
//       </div>
//       </div>
//               </React.Fragment>
//             ))}
//            </div>
//            </>} */}


//            {/* {activeScreen=== 'Travel Expenses' && 
//            <>
//     <div className="w-auto h-6 flex flex-row gap-3 ml-8 mt-7 items-center">
//       <img className="w-6 h-6" src={receipt} alt="receipt" />
//       <div className="text-base tracking-[0.02em] font-bold w-auto">Travel Expense Reports</div>
//     </div>
//     <div className='flex flex-col lg:flex-row  w-[220px] lg:w-[500px]  gap-4 mt-[25px] mx-11'>
   
    
  
// </div>
//     <div className="box-border mx-4 mt-[46px]    border-b  border-slate-300"/>
   
//            </>
           
//            } */}




// {/* {activeScreen === 'Travel Expenses' && 
//          <div className='border h-[80%] w-full scroll-mx-5 flex justify-center items-center overflow-auto   my-6'>

//           <ApprovalTravelExpense expenseApprovalData={expApprovalData && expApprovalData} handleVisible={handleVisible}/>

//          </div>
//          } */}


         
//         </div>
//       {/* </div> */}
//     </>
//   );
// };

// export default Approval;

