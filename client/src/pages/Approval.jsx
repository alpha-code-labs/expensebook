/* eslint-disable no-unreachable */
import React, { useEffect, useState } from 'react';
import { briefcase, cancel, cancel_round, categoryIcons, check_tick, cross_icon, filter_icon, info_icon, modify, money, money1, plus_violet_icon, receipt, search_icon } from '../assets/icon';
import { formatAmount, getStatusClass, splitTripName } from '../utils/handyFunctions';
import {TRCashadvance,NonTRCashAdvances, travelExpense, TrExpenseForApproval, NonTrExpenseForApproval} from '../utils/dummyData';
import Modal from '../components/common/Modal1';
import TripSearch from '../components/common/TripSearch';
import Button1 from '../components/common/Button1';
import { handleApproval, handleCashAdvance } from '../utils/actionHandler';
import TravelMS from '../microservice/TravelMS';
import { useData } from '../api/DataProvider';
import Error from '../components/common/Error';
import { useParams } from 'react-router-dom';
import Input from '../components/common/SearchInput';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import { approveTravelRequestApi } from '../utils/api';
import PopupMessage from "../components/common/PopupMessage";
import TripMS from '../microservice/TripMS';
import { TripName } from '../components/common/TinyComponent';


const rejectionOptions=['Too Many Violations', 'Budget Constraints','Insufficient Documents','Upcoming Project Deadline']

const Approval = ({isLoading, fetchData, loadingErrMsg}) => {

  const [approvalUrl , setApprovalUrl]=useState(null);
  const [visible, setVisible]=useState(false); 
  const [travelRequestId , setTravelRequestId]=useState(null); 
  const [advancetype , setAdvanceType]=useState(null); 
  const [textVisible,setTextVisible]=useState({cashAdvance:false});
  const [modalOpen , setModalOpen]=useState(false);
  const [searchQuery,setSearchQuery]= useState(false);
  const [seleactAll , setSelectAll]=useState([]);
  const [selectedLineItems , setSelectedLineItems]=useState([]);
  const [modalContentTitle , setModalContentTitle]=useState(null);
  const [actionType, setActionType] = useState(true); 
  const [selectedRejReason, setSelectedRejReason]=useState(null);
  const [expenseDetails, setExpenseDetails]=useState(null);
  const [isUploading,setIsUploading]=useState(false);
  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState(null)
  const [error , setError]= useState({
    travelRequestId: {set:false, message:""},
    rejectionReason:{set:false,message:""}
  }) 


  // short by status
  const sortByStatus = (array) => {
    const statusOrder = ["pending approval", "approved", "rejected"];
    
    return array.sort((a, b) => {
      return statusOrder.indexOf(a.lineItemStatus) - statusOrder.indexOf(b.lineItemStatus);
    });
  };

  const closeModal=()=>{
    setModalOpen(!modalOpen);
    setSelectAll([]);
    setSelectedLineItems([]);
  }


  const openModal = (action) => {
    setActionType(action);
    setModalOpen(true);
  };

  const expenseLines = expenseDetails?.expenseLines?.filter(lineItem => lineItem?.lineItemStatus === "pending approval") || []
  const handleAllLineItems = () => {
    if (expenseLines?.length !== selectedLineItems?.length) {
      const filteredData = expenseDetails?.expenseLines.filter(
        lineItem => lineItem?.lineItemStatus === "pending approval"
      );
  
      const data = filteredData.map(lineItem => lineItem?.lineItemId);
  
      console.log("filtered data", data);
      setSelectedLineItems(data);
    } else {
      setSelectedLineItems([]);
    }
  };
  

  const handleLineItem = (lineItemId)=>{
    const isSelected = selectedLineItems.includes(lineItemId)
    if (isSelected) {
      const data = selectedLineItems.filter(item => item !== lineItemId);
      setSelectedLineItems(data);
      } else {
        setSelectedLineItems([...selectedLineItems, lineItemId]);
        }  
  }

console.log('selected lineItems',selectedLineItems)
  
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


  
 

  const { employeeData } = useData();
 
  const [approvalData, setApprovalData]=useState([]);

  useEffect(()=>{
    const data = employeeData && employeeData?.dashboardViews?.employeeManager
    setApprovalData(data)
    
  },[employeeData])

  const {tenantId,empId,page}= useParams();

  useEffect(()=>{

    fetchData(tenantId,empId,page)

  },[])
  
  const travelAndCashAdvances = approvalData?.travelAndCash || []
  const travelAndNonTravelExpenses = approvalData?.travelExpenseReports || []
  const dummyTrExpense = TrExpenseForApproval?.map((expense)=> ({...expense,expenseType:"Travel Expense"})) || []
  const dummyNonTravelExpense = NonTrExpenseForApproval?.map((expense)=>({...expense,expenseType:"Non Travel Expense"})) || []
  const DummyExpenseData = [...dummyTrExpense, ...dummyNonTravelExpense]
  
  
  
  console.log('dummy expense for approval ', DummyExpenseData)
  
 
  




 


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
    if (visible || modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
  }, [visible || modalOpen]);

  
 
  


  
  
  const filterCashadvances = (cashadvances) => {
    if(searchQuery){
      return cashadvances.filter(expense =>
        JSON.stringify(expense).toLowerCase().includes(searchQuery)
      );
    }else{
      return cashadvances
    }
  };
  
  // const filterExpenses = (expenseObject) => {
  //   if (!searchQuery) {
  //     return expenseObject;
  //   }
  
  //   const lowerCaseQuery = searchQuery.toLowerCase();
  
  //   // Recursive function to search within the object
  //   const searchObject = (obj) => {
  //     for (const key in obj) {
  //       if (typeof obj[key] === 'object' && obj[key] !== null) {
  //         if (searchObject(obj[key])) {
  //           return true;
  //         }
  //       } else if (typeof obj[key] === 'string' || typeof obj[key] === 'number') {
  //         if (obj[key].toString().toLowerCase().includes(lowerCaseQuery)) {
  //           return true;
  //         }
  //       }
  //     }
  //     return false;
  //   };
  
  //   return searchObject(expenseObject) ? expenseObject : null;
  // };
  
  const filterExpenses = (expenses) => {
    if (searchQuery) {
      return expenses.filter(expense =>
        JSON.stringify(expense).toLowerCase().includes(searchQuery)
      );
    } else {
      return expenses;
    }
   
    
  };
  
  const getStatusCount = (status, cashadvance) => {
    return cashadvance.filter((cashadvance) => cashadvance?.cashAdvanceStatus === status)?.length;
  };
  
  
  const disableButton = (status) => {
    return ['draft', 'cancelled'].includes(status);
  };
  
  
  
  function ActionButton({approve, reject, onApproveClick, onRejectClick})
  {
    return(
    <div className='font-cabin text-xs flex gap-x-2 items-center justify-center'>

        <div onClick={onApproveClick} className='w-fit hover:shadow-md hover:shadow-green-200/60 transition duration-300 cursor-pointer min-w-[70px] inline-flex gap-2 items-center justify-center  border border-green-200 rounded-sm text-center  text-white-100 px-2 py-1 bg-green-600'>
          <p className='text-center'>{approve}</p>
          <div className='border border-white-100 p-[2px] rounded-full '>
            <img src={check_tick} className='w-3 h-3'/>
          </div>
        </div>

        <div onClick={onRejectClick} className='w-fit hover:shadow-md hover:shadow-red-200/60 transition duration-300 cursor-pointer min-w-[70px] inline-flex gap-2 items-center justify-center border border-red-200 rounded-sm text-center  text-white-100 px-2 py-1 bg-red-600'>
        <p className='text-center'>{reject}</p>
        <div className='border border-white-100 p-[2px] rounded-full'>
          <img src={cross_icon} className='w-3 h-3'/>
        </div>
        </div>

      </div>)
  }

  const handleConfirm = async( action)=>{
   
    const rejectionReason = {rejectionReason :selectedRejReason}
     let api;
      if(action==='approveTrip'){
        api=approveTravelRequestApi(tenantId , empId, travelRequestId )
        console.log('travel api hit')
      }else if (action === "cashadvance-approve"){
        api= approveTravelRequestApi(tenantId ,empId,travelRequestId )
      }else if (action === 'rejectTrip' && rejectionReason?.rejectionReason){
        api = approveTravelRequestApi(tenantId,empId,travelRequestId,rejectionReason)
      }else if (action === 'itinerary-reject' && rejectionReason?.rejectionReason ){
        api = approveTravelRequestApi(tenantId,empId,travelRequestId,rejectionReason)
      }

let validConfirm = true
 if((action === 'rejectTrip' || action === 'rejectExpense') && selectedRejReason === null){
  setError((prev)=>({...prev, rejectionReason:{set:true, message:"Select the rejection reason."}}))
  validConfirm =false
 }else{
  setError((prev)=>({...prev, rejectionReason:{set:false, message:""}}))
 }
if(validConfirm){
  try {
     setIsUploading(true);
    // const response = await postTravelPreference_API({ tenantId, empId, formData });
   const response = await api
   console.log('responsemessage',response)
   setIsUploading(false)
   setShowPopup(true)
   setMessage(response)
    setTimeout(() => {setShowPopup(false);setIsUploading(false);setMessage(null),window.location.reload()},3000);
  } catch (error) {
    // setLoadingErrorMsg(`Please retry again : ${error.message}`); 
    setShowPopup(true)
    setMessage(error.message)
    setTimeout(() => {setIsUploading(false);setMessage(null);setShowPopup(false)},3000);
  }

  // handleModalVisible()
  // setActionData({})
  setSelectedRejReason(null)
}
}
  
  
  const getTitle = () => {
    switch (actionType) {
      case 'approveTrip':
        return 'Approve Trip?';
      case 'rejectTrip':
        return 'Reject Trip';
      case 'expenseDetails':
        return 'Expense Details';
      default:
        return '';
    }
  };

  const getContent = () => {
    switch (actionType) {
      case 'approveTrip':
      case 'rejectTrip':
        return (
          <>
          <p className="text-md px-4  text-start font-cabin text-neutral-600 ">
          {actionType === "approveTrip"
                          ? 'Once you approve, bookings for this trip can be initiated, and the corresponding cash advance will be processed for settlement.'
                          : 'Please select the reason for rejection before proceeding.'
                        }</p>
          {actionType === "rejectTrip" &&  
             <div className="">
                <Select 
                currentOption={selectedRejReason}
                
                placeholder='Select Reason'
                options={rejectionOptions}
                onSelect={(value) => setSelectedRejReason(value)}
                error={error?.rejectionReason}
              />
                </div>}
         
                                <div className="flex items-center gap-2 mt-10">
                                <Button1 loading={isUploading} active={isUploading} text='Confirm' onClick={()=>handleConfirm(actionType)} />
                                <Button   text='Cancel'  onClick={closeModal}/>
                                </div>
                    </>
        );
      // case 'rejectTrip':
        // return (
        //   <>
        //     <p className="text-md px-4 text-start font-cabin text-neutral-600">
        //       Please select the reason for rejection before proceeding.
        //     </p>
        //     <div className="mt-10">
        //       <Select 
        //         currentOption={selectedRejReason}
        //         title='Please select the reason for reject'
        //         placeholder='Select Reason'
        //         options={rejectionOptions}
        //         onSelect={(value) => setSelectedRejReason(value)}
        //         error={error}
        //       />
        //     </div>
        //     <div className="flex items-center gap-2 mt-10">
        //       <Button1  text='Confirm'  />
        //       <Button   text='Cancel'  />
        //     </div>
        //   </>
        // );

      case 'expenseDetails':
        return (
          <div  className='mb-4 xl:w-[500px] w-full grow text-neutral-700 rounded-md shadow-custom-light bg-white-100 p-4'>           
            <div className='flex gap-2 flex-col'> 
              
            <div className='flex flex-row justify-between'>
              
            <div className='flex gap-2 items-center'>
                {/* <input onChange={() => handleSelect(trip)} type='checkbox' className='w-4 h-4 accent-indigo-600' checked={isTravelRequestSelected(trip?.travelRequestId)}/> */}
             <div>
                <p className='header-title'>Created By</p>
                <p className='header-text'>{expenseDetails?.createdBy?.name ?? <span className='text-center'>-</span>}</p>
             </div>
              </div>
              {/* <Button1 text="Take Action" variant="fit" onClick={() => {openModal("expenseDetails");}}/> */}
              {/* <ActionButton approve={"Approve"} reject={"Reject"}/> */}

            {/* <div className='flex items-center justify-center'>
             <img src={info_icon} className='w-4 h-4'/>
              <div className='text-sm font-cabin px-2 py-1 cursor-pointer' onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible(trip?.travelRequestId,  'travel-approval-view' )}}}>
                <p className='text-indigo-600 font-semibold'>View Details</p>
              </div>
              </div> */}

              </div>  
            {expenseDetails?.expenseType === "Travel Expense" &&
             <div className='flex flex-row justify-between'>
             {/* <div className='flex gap-2 items-center'>
                     <img src={briefcase} className='w-4 h-4'/>
                     <div className='font-medium font-cabin  text-sm uppercase text-neutral-700 '>
                      {splitTripName(expenseDetails?.tripName)}
                     </div>
                     <div className='font-medium font-cabin  text-sm  text-neutral-700 '>
                      {extractAndFormatDate(trip?.tripName)}
                     </div>
              </div> */}
              <TripName tripName={trip?.tripName}/>
             {/* <div className='flex items-center justify-center'>
             <img src={info_icon} className='w-4 h-4'/>
              <div className='text-sm font-cabin px-2 py-1 cursor-pointer' onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible(trip?.travelRequestId,  'travel-approval-view' )}}}>
                <p className='text-indigo-600 font-semibold'>View Details</p>
              </div>
              </div> */}
             </div>}
             <div className='flex px-2 h-[36px] py-4  items-center justify-between gap-2'>
    <div className='flex justify-center items-center gap-2'>
    <input type='checkbox' checked={expenseLines?.length === selectedLineItems?.length ? true : false}  className='w-4 h-4 accent-indigo-600' onChange={handleAllLineItems}/>
    Select All
    </div>
    <div>
    {selectedLineItems.length > 0 && <ActionButton onRejectClick={() => openModal('rejectTrip')} onApproveClick={() => openModal('approveTrip')} approve={"Approve"} reject={"Reject"}/>}
    </div>
  </div>
              </div>

                    {/* {trip?.expenseType === "Travel Expense" &&
                     <div className='flex gap-2 items-center'>
                     <img src={briefcase} className='w-4 h-4'/>
                     <div className='font-medium font-cabin  text-sm uppercase text-neutral-700 '>
                      {splitTripName(trip?.tripName)}
                     </div>
                     <div className='font-medium font-cabin  text-sm  text-neutral-700 '>
                      {extractAndFormatDate(trip?.tripName)}
                     </div>
                     </div>
                    } */}
                    
                    <div className='mt-2 space-y-2'>
                      {/* {filteredTripExpenses?.map((trExpense, index) => ( */}
                        <div  className='border border-slate-300 rounded-md px-2 py-1'>
                          <div className='flex flex-row justify-between items-center py-1 border-b border-slate-300 font-cabin font-xs'>
                          <div className='flex gap-2 items-center'>
                      <img src={receipt} className='w-5 h-5'/>
                      <div className='text-start'>
                        <div className='header-title'>Expense Header No.</div>
                        <p className='header-text'>{expenseDetails?.expenseHeaderNumber}</p>
                      </div>
                        </div>
                <div className='flex items-center justify-center'>
                <img src={info_icon} className='w-4 h-4'/>
                <div className='text-sm font-cabin px-2 py-1 cursor-pointer' onClick={()=>{if(!disableButton(expenseDetails?.travelRequestStatus)){handleVisible(expenseDetails?.travelRequestId,  'travel-approval-view' )}}}>
                  <p className='text-indigo-600 font-semibold'>View Details</p>
                </div>
                </div>
                
                            {/* <div className={`text-center rounded-sm ${getStatusClass(trip?.expenseHeaderStatus ?? "-")}`}>
                              <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{trip?.expenseHeaderStatus ?? "-"}</p>
                            </div> */}
                            {/* <div onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleTravelExpense(trip?.tripId, filteredTripExpenses?.expenseHeaderId,  'trip-ex-modify' ,)}}} className={`w-7 h-7 bg-indigo-100 rounded-full border border-white-100 flex items-center justify-center ${disableButton(trip?.travelRequestStatus) ? ' cursor-not-allowed opacity-50' : ' cursor-pointer'}`}>
                              <img src={modify} className='w-4 h-4' alt="modify_icon" />
                            </div> */}
                          </div>
                          <div className='overflow-x-hidden overscroll-y-scroll py-1 pt-2 max-h-[525px] h-auto px-2 space-y-2'>
                            {sortByStatus(expenseDetails?.expenseLines)?.map((line, index) => (
                              <div key={`${index}-line`} className='flex  text-neutral-700 flex-row justify-between items-center font-cabin text-sm'>
                                <div className='bg-indigo-50 border-2 shadow-md shadow-slate-900/50 translate-x-4 border-white-100 p-2 rounded-full'>
                                  <img src={categoryIcons?.[line?.["Category Name"]]} className='w-4 h-4' />
                                </div>
                                <div className='flex border-slate-400 border flex-row justify-between text-neutral-700 flex-1 items-center  py-4 px-4 pl-6 rounded-md bg-slate-200'>
                                 {["pending approval"].includes(line?.lineItemStatus) && 

                                 <div className='w-fit'>
                                  <input 
                                  onChange={()=>handleLineItem(line?.lineItemId)} 
                                  type='checkbox' 
                                  checked={selectedLineItems.includes(line?.lineItemId)} 
                                  className='cursor-pointer w-4 h-4 accent-indigo-600'/>
                                  </div>} 
                                  <div className='text-start'>{line?.["Category Name"]}</div>
                                  <div className=''>{line?.["Currency"]?.shortName} {formatAmount(line?.["Total Amount"])}</div>
                                  <div className={` text-center rounded-sm ${getStatusClass(line?.lineItemStatus ?? "-")}`}>
                                      <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{line?.lineItemStatus ?? "-"}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      
                    </div>
                  </div>
        );
      default:
        return '';
    }
  };
  
  

  return (
    <>
     {isLoading && <Error message={loadingErrMsg}/>}
     {!isLoading && 
    <div className='min-h-screen'>
       <TripMS visible={visible} setVisible={setVisible} src={approvalUrl}/>
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
   
   <Input placeholder="Search" type="search" icon={search_icon} onChange={(value)=>setSearchQuery(value)}/>
   
 </div>
</div>
        <div className='w-full flex md:flex-row flex-col'>
        <div className='flex-1 rounded-md justify-center items-center'>
         
<div className='relative  flex justify-center items-center  rounded-l-md   font-inter text-md text-white-100 h-[52px] bg-indigo-600  text-center'>

{/* <div
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
</div>*/}

<div className='flex justify-center items-center'>
    <img src={money1} className='w-6 h-6 mr-2'/>
     <p>Travel & Cash-Advances</p>
    </div>
</div>

  <div className='flex px-2 h-[52px] py-4  items-center justify-start gap-2'>
    <input type='checkbox' checked={TRCashadvance.length === seleactAll.length ? true : false}  className='w-4 h-4 accent-indigo-600' onChange={handleSelectAll}/>
    Select All
    <div>
    {seleactAll.length > 0 && <ActionButton onRejectClick={() => openModal('rejectTrip')} onApproveClick={() => openModal('approveTrip')} approve={"Approve"} reject={"Reject"}/>}
    </div>
  </div>

      <div className='w-full bg-white-100 xl:h-[570px] lg:h-[370px] md:[590px] overflow-y-auto px-2'>
          {filterCashadvances(travelAndCashAdvances).map((trip) => { 
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

            <div className='flex items-center justify-center'>
             <img src={info_icon} className='w-4 h-4'/>
              <div className='text-sm font-cabin px-2 py-1 cursor-pointer' onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible(trip?.travelRequestId,  'travel-approval-view' )}}}>
                <p className='text-indigo-600 font-semibold'>View Details</p>
              </div>
              </div>
              </div>
             <div className='flex flex-row justify-between'>
              
             <TripName tripName={trip?.tripName} />
             {/* <div className='flex items-center justify-center'>
             <img src={info_icon} className='w-4 h-4'/>
              <div className='text-sm font-cabin px-2 py-1 cursor-pointer' onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible(trip?.travelRequestId,  'travel-approval-view' )}}}>
                <p className='text-indigo-600 font-semibold'>View Details</p>
              </div>
              </div> */}
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
            <div className='flex px-2 h-[52px] py-4 items-center justify-start gap-2'/>

{/* <div className='w-full bg-white-100 xl:h-[570px] lg:h-[370px] md:[590px] overflow-y-auto px-2'>
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
</div> */}
 <div className='w-full xl:h-[570px] lg:h-[370px] md:[590px] overflow-y-auto px-2 bg-white-100 rounded-l-md'>
              {filterExpenses(DummyExpenseData)?.map((trip, index) => {
                // const filteredTripExpenses = filterExpenses(trip?.travelExpenseData);
                // if (filteredTripExpenses?.length === 0) return null; 

            return (
            <div key={`${index}-tr-expense`} className='mb-4 text-neutral-700 rounded-md shadow-custom-light bg-white-100 p-4'>           
            <div className='flex gap-2 flex-col'> 
            <div className='flex flex-row justify-between'>
            <div className='flex gap-2 items-center'>
                {/* <input onChange={() => handleSelect(trip)} type='checkbox' className='w-4 h-4 accent-indigo-600' checked={isTravelRequestSelected(trip?.travelRequestId)}/> */}
             <div>
                <p className='header-title'>Created By</p>
                <p className='header-text'>{trip?.createdBy?.name ?? <span className='text-center'>-</span>}</p>
              </div>
              </div>
              <Button1 text="Take Action" variant="fit" onClick={() => {openModal("expenseDetails");setExpenseDetails(trip)}}/>
              {/* <ActionButton approve={"Approve"} reject={"Reject"}/> */}

            {/* <div className='flex items-center justify-center'>
             <img src={info_icon} className='w-4 h-4'/>
              <div className='text-sm font-cabin px-2 py-1 cursor-pointer' onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible(trip?.travelRequestId,  'travel-approval-view' )}}}>
                <p className='text-indigo-600 font-semibold'>View Details</p>
              </div>
              </div> */}
              </div>  
              {trip?.expenseType === "Travel Expense" &&
             <div className='flex flex-row justify-between'>
              
              <TripName tripName={trip?.tripName}/>
             {/* <div className='flex items-center justify-center'>
             <img src={info_icon} className='w-4 h-4'/>
              <div className='text-sm font-cabin px-2 py-1 cursor-pointer' onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible(trip?.travelRequestId,  'travel-approval-view' )}}}>
                <p className='text-indigo-600 font-semibold'>View Details</p>
              </div>
              </div> */}
             </div>}
              </div>

                    {/* {trip?.expenseType === "Travel Expense" &&
                     <div className='flex gap-2 items-center '>
                     <img src={briefcase} className='w-4 h-4'/>
                     <div className='font-medium font-cabin  text-sm uppercase text-neutral-700 '>
                      {splitTripName(trip?.tripName)}
                     </div>
                     <div className='font-medium font-cabin  text-sm  text-neutral-700 '>
                      {extractAndFormatDate(trip?.tripName)}
                     </div>
                     </div>
                    } */}
                    
                    <div className='mt-2 space-y-2'>
                      {/* {filteredTripExpenses?.map((trExpense, index) => ( */}
                        <div key={index} className='border border-slate-300 rounded-md px-2 py-1'>
                          <div className='flex flex-row justify-between items-center py-1 border-b border-slate-300 font-cabin font-xs'>
                          <div className='flex gap-2 items-center '>
                      <img src={receipt} className='w-5 h-5'/>
                      <div>
                        <div className='header-title'>Expense Header No.</div>
                        <p className='header-text'>{trip?.expenseHeaderNumber}</p>
                      </div>
                    </div>
                    <div className='flex items-center justify-center'>
              <img src={info_icon} className='w-4 h-4'/>
                <div className='text-sm font-cabin px-2 py-1 cursor-pointer' onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible(trip?.travelRequestId,  'travel-approval-view' )}}}>
                  <p className='text-indigo-600 font-semibold'>View Details</p>
                </div>
                </div>
                            {/* <div className={`text-center rounded-sm ${getStatusClass(trip?.expenseHeaderStatus ?? "-")}`}>
                              <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{trip?.expenseHeaderStatus ?? "-"}</p>
                            </div> */}
                            {/* <div onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleTravelExpense(trip?.tripId, filteredTripExpenses?.expenseHeaderId,  'trip-ex-modify' ,)}}} className={`w-7 h-7 bg-indigo-100 rounded-full border border-white-100 flex items-center justify-center ${disableButton(trip?.travelRequestStatus) ? ' cursor-not-allowed opacity-50' : ' cursor-pointer'}`}>
                              <img src={modify} className='w-4 h-4' alt="modify_icon" />
                            </div> */}
                          </div>
                          <div className='overflow-x-hidden overflow-y-auto max-h-[236px] py-1 pt-2 h-auto px-2 space-y-2'>
                            {trip?.expenseLines?.map((line, index) => (
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
                      {/* // ))} */}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

  
    <Modal 
        isOpen={modalOpen} 
        onClose={()=>closeModal}
        content={
          <div className='w-full h-auto'>
          <div className='flex gap-2 justify-between items-center bg-indigo-100 w-auto p-4'>
            <div className='flex gap-2'>
              <img src={info_icon} className='w-5 h-5' alt="Info icon"/>
              <p className='font-inter text-base font-semibold text-indigo-600'>
                {getTitle()}
              </p>
            </div>
            <div onClick={() => setModalOpen(false)} className='bg-red-100 cursor-pointer rounded-full border border-white-100'>
              <img src={cancel} className='w-5 h-5' alt="Cancel icon"/>
            </div>
          </div>

          <div className="p-4">
            {getContent()}
            
          </div>
        </div>}
      />  
    </div>}
    <PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} message={message}/>
    </>
  );
};

export default Approval;



const extractAndFormatDate = (inputString) => {
  
  if (!inputString){
    return "-"
  }
  const datePattern = /(\d{1,2})(st|nd|rd|th) (\w{3})/;
  const match = inputString.match(datePattern);

  if (match) {
    const [, day, suffix, month] = match;
    return (
      <>
        {day}
        <span className="align-super text-xs">{suffix}</span> {month}
      </>
    );
  }

  return null;
};







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

