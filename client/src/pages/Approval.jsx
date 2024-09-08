/* eslint-disable no-unreachable */
import React, { useEffect, useState } from 'react';
import { approval_icon, approvalempty_icon, briefcase, cancel, cancel_round, categoryIcons, check_tick, cross_icon, filter_icon, info_icon, modify, money, money1, plus_violet_icon, receipt, search_icon, violation_icon } from '../assets/icon';
import { formatAmount, getStatusClass, sortTripsByDate, splitTripName } from '../utils/handyFunctions';
import {TRCashadvance,NonTRCashAdvances, travelExpense, TrExpenseForApproval, NonTrExpenseForApproval} from '../utils/dummyData';
import Modal from '../components/common/Modal1';
import TripSearch from '../components/common/TripSearch';
import Button1 from '../components/common/Button1';
import { handleApproval, handleCashAdvance, handleTravelExpense } from '../utils/actionHandler';
import TravelMS from '../microservice/TravelMS';
import { useData } from '../api/DataProvider';
import Error from '../components/common/Error';
import { useParams } from 'react-router-dom';
import Input from '../components/common/SearchInput';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import { approveTravelRequestApi, nonTravelExpenseApprovalActionApi ,rejectTravelExpenseApi, approveTravelExpenseApi, rejectTravelRequestApi } from '../utils/api';
import PopupMessage from "../components/common/PopupMessage";
import TripMS from '../microservice/TripMS';
import { CardLayout, EmptyBox, ExpenseLine, TripName, Violation } from '../components/common/TinyComponent';


const rejectionOptions=['Too Many Violations', 'Budget Constraints','Insufficient Documents','Upcoming Project Deadline']

const Approval = ({isLoading, fetchData, loadingErrMsg}) => {


  const approvalBaseUrl    = import.meta.env.VITE_APPROVAL_PAGE_URL;
  const [approvalUrl , setApprovalUrl]=useState(null);
  const [visible, setVisible]=useState(false); 
  const [travelRequestId , setTravelRequestId]=useState(null); 
  const [advancetype , setAdvanceType]=useState(null); 
  const [textVisible,setTextVisible]=useState({cashAdvance:false});
  const [modalOpen , setModalOpen]=useState(false);
  const [searchQuery,setSearchQuery]= useState(false);
  const [selectAll , setSelectAll]=useState([]); // for travelrequests
  const [selectedLineItems , setSelectedLineItems]=useState([]);
  const [modalContentTitle , setModalContentTitle]=useState(null);
  const [actionType, setActionType] = useState(true); 
  const [selectedRejReason, setSelectedRejReason]=useState(null);
  const [expenseDetails, setExpenseDetails]=useState(null);
  const [isUploading,setIsUploading]=useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState(null);
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
      ).map(lineItem => lineItem?.expenseLineId ? lineItem?.expenseLineId : lineItem?.lineItemId)
      // const data = filteredData?.map(lineItem => lineItem?.expenseLineId);
      console.log("filtered data",  filteredData);
      setSelectedLineItems( filteredData);
    } else {
      setSelectedLineItems([]);
    }
  };

  console.log('expense details',expenseDetails)
  

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
  

  
  const isTravelRequestSelected = (travelRequestId) => {
    return selectAll?.some(id => id.travelRequestId === travelRequestId);
  };

  console.log('all selected data', selectAll)


  
 

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
  const itineraries = approvalData?.trips || []
  const travelAndItinerary =[ ...travelAndCashAdvances , ...itineraries]
  sortTripsByDate(travelAndItinerary)
  const travelExpenses = approvalData?.travelExpenseReports || []
  const nonTravelExpenses = approvalData?.nonTravelExpenseReports || []
  const dummyTrExpense = travelExpenses?.map((expense)=> ({...expense,expenseType:"Travel Expense"})) || []
  const dummyNonTravelExpense = nonTravelExpenses?.map((expense)=>({...expense,expenseType:"Non Travel Expense"})) || []
  const DummyExpenseData = [...dummyTrExpense, ...dummyNonTravelExpense]
  
  
  
  console.log('dummy expense for approval ', DummyExpenseData)
  
 const handleSelectAll = () => {
  if (travelAndItinerary?.length !== (selectAll?.length || 0)) {
    const data = travelAndItinerary?.map((travel) => {
      const item = { travelRequestId: travel?.travelRequestId };
      if (travel?.isCashAdvanceTaken) {
        item.cashAdvanceData = travel?.cashAdvance?.map((item) => ({ cashAdvanceId: item?.cashAdvanceId }));
      }
      return item;
    });
    setSelectAll(data);
  } else {
    setSelectAll([]);
  }
};

const handleSelect = (obj) => {
  setSelectAll((prevSelected) => {
    const isSelected = prevSelected.some(travel => travel.travelRequestId === obj?.travelRequestId);
    
    if (isSelected) {
      return prevSelected.filter(travel => travel.travelRequestId !== obj?.travelRequestId);
    } else {
      const item = {travelRequestId:obj?.travelRequestId}
      if(obj?.isCashAdvanceTaken){
        item.cashAdvanceData = obj?.cashAdvance?.filter((item) => (item?.cashAdvanceStatus === "pending approval")).map(item => ({ cashAdvanceId: item?.cashAdvanceId }))

      }
      return [...prevSelected, item];
    }
  });
};

// const handleSelect = (obj) => {
//   setSelectAll((prevSelected) => {

//     const isSelected = prevSelected.some(travel => travel.travelRequestId === obj?.travelRequestId);
    
//     if (isSelected) {
//       return prevSelected.filter(travel => travel.travelRequestId !== obj?.travelRequestId);
//     } else {
//      const newSelection = {
//   travelRequestId: obj?.travelRequestId,
//   ...(obj?.cashAdvance && {
//     cashAdvanceData: obj?.cashAdvance
//       .filter(item => item?.status === 'pending approval')
//       .map(item => ({
//         cashAdvanceId: item?.cashAdvanceId
//       }))
//   })
// };
//       return [...prevSelected, newSelection];
//     }
//   });
// };   

    // const handleSelect = (obj) => {
    //   setSelectAll(prevSelected => {
    //     const isSelected = prevSelected.some(travel => travel.travelRequestId === obj?.travelRequestId);
    //     if (isSelected) {
    //       return prevSelected.filter(travel => travel.travelRequestId !== obj?.travelRequestId);
    //     } else {
    //       return [
    //         ...prevSelected,
    //         {
    //           travelRequestId: obj?.travelRequestId,
              
    //           cashAdvanceData: obj?.cashAdvance.map(item => ({
    //           cashAdvanceId: item.cashAdvanceId
    //           }))
    //         }
    //       ];
    //     }
    //   });
    // };
  




 


//cashadvance iframe

const handleVisible = ({travelRequestId,tripId,expenseHeaderId, action}) => {

  setVisible(!visible);
  let url ;
  if (action==="travel-approval-view"){
    url=handleApproval({tenantId , empId ,travelRequestId,action})
    console.log('url',url)
    
  }
  else if (action==="travelExpense-approval-view"){
    // url=handleCashAdvance("", action);
    url = handleApproval({tenantId,empId,tripId,expenseHeaderId,action})
   
  }
  else if (action==="nontravelExpense-approval-view"){
    // url=handleCashAdvance("", action);
    url = handleApproval({tenantId,empId,expenseHeaderId,action})
   
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
      if (event.origin === approvalBaseUrl ) {
        // Check the message content or identifier
        if (event.data === 'closeIframe') {
          setVisible(false)
          window.location.reload()
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
    <div className='font-cabin text-xs flex gap-x-2 items-center justify-center '>

        <div onClick={onApproveClick} className='w-fit hover:shadow-md hover:shadow-green-200/60 transition duration-300 cursor-pointer min-w-[70px] inline-flex gap-2 items-center justify-center  border border-green-200 rounded-sm text-center  text-white px-2 py-1 bg-green-600'>
          <p className='text-center'>{approve}</p>
          <div className='border border-white p-[2px] rounded-full '>
            <img src={check_tick} className='w-3 h-3'/>
          </div>
        </div>

        <div onClick={onRejectClick} className='w-fit hover:shadow-md hover:shadow-red-200/60 transition duration-300 cursor-pointer min-w-[70px] inline-flex gap-2 items-center justify-center border border-red-200 rounded-sm text-center  text-white px-2 py-1 bg-red-600'>
        <p className='text-center'>{reject}</p>
        <div className='border border-white p-[2px] rounded-full'>
          <img src={cross_icon} className='w-3 h-3'/>
        </div>
        </div>

      </div>)
  }
  const handleConfirm = async (action) => {
    console.log('action from confirm ', action);
    console.log('selectedRejReason', selectedRejReason); // Log the rejection reason
    console.log('selectedLineItems', selectedLineItems); // Log the selected line items
  
    let approve = [];
    let reject = [];
    
    if (action === 'rejectExpense') {
      reject = selectedLineItems;
    }
    if (action === 'approveExpense') {
      approve = selectedLineItems;
    }
    
    const rejectionReason = selectedRejReason;
    const expenseHeaderId = expenseDetails?.expenseHeaderId;
    const expenseType = expenseDetails?.expenseType
    const tripId = expenseDetails?.tripId ?? ""
    

    let api;
  
    if (action === 'rejectTrip') {
      api = rejectTravelRequestApi({ tenantId, empId, travelRequests: selectAll, rejectionReason });
    }
    if (action === 'approveTrip') {
      
      api = approveTravelRequestApi({ tenantId, empId, travelRequests: selectAll });
    }
    if (action === 'approveExpense') {
      if (expenseType=== "Travel Expense"){
        api = approveTravelExpenseApi({ tenantId, empId,tripId, expenseHeaderId }, { approve, reject , rejectionReason:"" });
      }else{
        api = nonTravelExpenseApprovalActionApi({ tenantId, empId, expenseHeaderId }, { approve, reject });
      }
    }
    if ((action === 'rejectExpense')) {
      console.log('rejectExpense hitted');
      if(expenseType === "Travel Expense"){
        api = approveTravelExpenseApi({ tenantId, empId,tripId, expenseHeaderId }, { approve, reject, rejectionReason });
      }else{
        api = nonTravelExpenseApprovalActionApi({ tenantId, empId, expenseHeaderId }, { approve, reject, rejectionReason});
      }
    }
  
    let validConfirm = true;
    if (['rejectTrip', 'rejectExpense'].includes(action) && selectedRejReason === null) {
      setError((prev) => ({ ...prev, rejectionReason: { set: true, message: "Select the rejection reason." } }));
      validConfirm = false;
    } else {
      setError((prev) => ({ ...prev, rejectionReason: { set: false, message: "" } }));
    }
  
    if (validConfirm) {
      try {
        setIsUploading(true);
        const response = await api;
        console.log('responsemessage', response);
        setIsUploading(false);
        setShowPopup(true);
        setMessage(response);
        setTimeout(() => {
          setShowPopup(false);
          setIsUploading(false);
          setMessage(null);
          window.location.reload()
        }, 3000);
      } catch (error) {
        setShowPopup(true);
        setMessage(error.message);
        setTimeout(() => {
          setIsUploading(false);
          setMessage(null);
          setShowPopup(false);
        }, 3000);
      }
  
      setSelectedRejReason(null);
    }
  };
  
//   const handleConfirm = async( action)=>{
    
//     console.log('action from confirm ',action)
//     let approve = []
//     let reject =[]
//     if(action === 'rejectExpense'){
//       reject = selectedLineItems
//       }
//     if(action === 'approveExpense'){
//       approve = selectedLineItems
//     }
    
   
//     const rejectionReason = selectedRejReason
//     const expenseHeaderId = expenseDetails?.expenseHeaderId
//      let api;
//      if (action === 'rejectTrip' ){
//       api = rejectTravelRequestApi({tenantId,empId,travelRequests:selectAll,rejectionReason})
//     }
//       if(action==='approveTrip'){
//         api=approveTravelRequestApi({tenantId , empId, travelRequests:selectAll} )
        
//       }if (action === 'approveExpense' ){
//         api = nonTravelExpenseApprovalActionApi({tenantId,empId,expenseHeaderId},{approve,reject})

//       }if (action === 'rejectExpense' && rejectionReason?.rejectionReason ){
//         console.log('rejectExpense hitted')
//         api = nonTravelExpenseApprovalActionApi({tenantId,empId,expenseHeaderId},{approve,reject,rejectionReason})
//       }

// let validConfirm = true
//  if((['rejectTrip','rejectExpense'].includes(action)) && selectedRejReason === null){
//   setError((prev)=>({...prev, rejectionReason:{set:true, message:"Select the rejection reason."}}))
//   validConfirm =false
//  }else{
//   setError((prev)=>({...prev, rejectionReason:{set:false, message:""}}))
//  }

// if(validConfirm){
//   try {
//      setIsUploading(true);
//     // const response = await postTravelPreference_API({ tenantId, empId, formData });
//    const response = await api
//    console.log('responsemessage',response)
//    setIsUploading(false)
//    setShowPopup(true)
//    setMessage(response)
//    setTimeout(() => {setShowPopup(false);setIsUploading(false);setMessage(null) },3000);
//     //,window.location.reload()
    
//   } catch (error) {
//     // setLoadingErrorMsg(`Please retry again : ${error.message}`); 
//     setShowPopup(true)
//     setMessage(error.message)
//     setTimeout(() => {setIsUploading(false);setMessage(null);setShowPopup(false)},3000);
//   }

//   // handleModalVisible()
//   // setActionData({})
//   setSelectedRejReason(null)
// }
// }
  
  
  const getTitle = () => {
    switch (actionType) {
      case 'approveTrip':
        return 'Approve Trip?';
      case 'rejectTrip':
        return 'Reject Trip';
      case 'expenseDetails':
        return 'Expense Details';
      case 'approveExpense':
        return 'Approve Expense';
      case 'rejectExpense':
        return 'Reject Expense';
      default:
        return '';
    }
  };

  const getContent = () => {
    switch (actionType) {
      case 'approveExpense':
      case 'rejectExpense':
      case 'approveTrip':
      case 'rejectTrip':
        return (
          <>
          <p className="text-md px-4 text-start font-cabin text-neutral-600">
  {actionType === "approveTrip"
    ? 'Once you approve, bookings for this trip can be initiated, and the corresponding cash advance will be processed for settlement.'
    : actionType === "approveExpense"
    ? 'Once you approve, expenses will be processed for settlement.'
    : 'Please select the reason for rejection before proceeding.'}
</p>

          {["rejectTrip","rejectExpense"].includes(actionType) &&  
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
          <div  className='mb-4 xl:w-[500px] w-full grow text-neutral-700 rounded-md shadow-custom-light bg-white p-4'>           
            <div className='flex gap-2 flex-col'> 
              
            <div className='flex flex-row justify-between'>
              
            <div className='flex gap-2 items-center'>
                {/* <input onChange={() => handleSelect(trip)} type='checkbox' className='w-4 h-4 accent-indigo-600' checked={isTravelRequestSelected(trip?.travelRequestId)}/> */}
             <div className=''>
                <p className='header-title text-start'>Created By</p>
                <p className='header-text'>{expenseDetails?.createdBy?.name ?? <span className='text-center'>-</span>}</p>
             </div>
              </div>
              {/* <Button1 text="Take Action" variant="fit" onClick={() => {openModal("expenseDetails");}}/> */}
              {/* <ActionButton approve={"Approve"} reject={"Reject"}/> */}



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
              <TripName tripName={expenseDetails?.tripName}/>
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
    {selectedLineItems.length > 0 && <ActionButton onRejectClick={() => openModal('rejectExpense')} onApproveClick={() => openModal('approveExpense')} approve={"Approve"} reject={"Reject"}/>}
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
                <div className='text-sm font-cabin px-2 py-1 cursor-pointer' onClick={()=>{if(!disableButton(expenseDetails?.travelRequestStatus)){handleVisible({"tripId":expenseDetails?.tripId,expenseHeaderId:expenseDetails?.expenseHeaderId,  "action":'travelExpense-approval-view'} )}}}>
                  <p className='text-indigo-600 font-semibold'>View Details</p>
                </div>
                </div>
                
                            {/* <div className={`text-center rounded-sm ${getStatusClass(trip?.expenseHeaderStatus ?? "-")}`}>
                              <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{trip?.expenseHeaderStatus ?? "-"}</p>
                            </div> */}
                            {/* <div onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleTravelExpense(trip?.tripId, filteredTripExpenses?.expenseHeaderId,  'trip-ex-modify' ,)}}} className={`w-7 h-7 bg-indigo-100 rounded-full border border-white flex items-center justify-center ${disableButton(trip?.travelRequestStatus) ? ' cursor-not-allowed opacity-50' : ' cursor-pointer'}`}>
                              <img src={modify} className='w-4 h-4' alt="modify_icon" />
                            </div> */}
                          </div>
                          <div className='overflow-x-hidden overscroll-y-scroll py-1 pt-2 max-h-[525px] h-auto px-2 space-y-2'>
                            {sortByStatus(expenseDetails?.expenseLines)?.map((line, index) => (
                              <div key={`${index}-line`} className='flex  text-neutral-700 flex-row justify-between items-center font-cabin text-sm'>
                                <div className='bg-indigo-50 border-2 shadow-md shadow-slate-900/50 translate-x-4 border-white p-2 rounded-full'>
                                  <img src={categoryIcons?.[line?.["Category Name"]]} className='w-4 h-4' />
                                </div>
                                <div className='flex border-slate-400 border flex-row justify-between text-neutral-700 flex-1 items-center  py-4 px-4 pl-6 rounded-md bg-slate-200'>
                                 {["pending approval"].includes(line?.lineItemStatus) && 

                                 <div className='w-fit'>
                                  <input 
                                  onChange={()=>handleLineItem(line?.expenseLineId ? line?.expenseLineId : line?.lineItemId )} 
                                  type='checkbox' 
                                  checked={selectedLineItems.includes(line?.expenseLineId ? line?.expenseLineId : line?.lineItemId)} 
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
     {isLoading ? <Error message={loadingErrMsg}/>:
     <>
       <TripMS visible={visible} setVisible={setVisible} src={approvalUrl}/>
     <div className='h-screen  flex flex-col p-4'>
     

      
      <div className=' border border-slate-300 bg-white rounded-md  w-full flex flex-col justify-center items-start px-2'>
 {/* <div className='flex flex-wrap  space-x-2 '>      
<div className='flex items-center justify-center p-2 bg-slate-100 rounded-full border border-slate-300 '><img src={filter_icon} className='w-5 h-5'/></div>
  {["draft","pending approval", "pending settlement", "paid",  "cancelled", "paid and cancelled"].map((status) => {
    const statusCount = getStatusCount(status, [...TRCashadvance.flatMap(te => te?.cashAdvances), ...NonTRCashAdvances]);
    const isDisabled = statusCount === 0;
    
    return (
      <div key={status} className={`flex items-center  ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
        <div
          onClick={() => !isDisabled && handleStatusClick(status)}
          className={`ring-1 ring-white flex py-1 pr-3 text-center rounded-sm ${selectedStatuses.includes(status) ? getStatusClass(status ?? "-") : "bg-slate-100 text-neutral-700 border border-slate-300"}`}
        >
          <p className='px-1 py-1 text-sm text-center capitalize font-cabin'>{status ?? "-"}</p>
        </div>
        <div className={`shadow-md shadow-black/30 font-semibold -translate-x-3 ring-1 rounded-full ring-white w-6 h-6 flex justify-center items-center text-center text-xs ${selectedStatuses.includes(status) ? getStatusClass(status ?? "-") : "bg-slate-100 text-neutral-700 border border-slate-300 "}`}>
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

<div className=' flex flex-col md:flex-row flex-grow w-full overflow-auto scrollbar-hide  mt-2'>
        
<div className='w-full md:w-1/2  flex flex-col'>
<div className='relative shrink-0  flex justify-center items-center  rounded-l-md   font-inter text-md text-white h-[52px] bg-indigo-600  text-center'>

{/* <div
onClick={()=>setModalOpen(!modalOpen)}
onMouseEnter={() => setTextVisible({cashAdvance:true})}
onMouseLeave={() => setTextVisible({cashAdvance:false})}
className={`absolute left-0 ml-4 hover:px-2 w-6 h-6 hover:overflow-hidden hover:w-auto group text-indigo-600 bg-indigo-100 border border-white flex items-center justify-center  hover:gap-x-1 rounded-full cursor-pointer transition-all duration-300`}
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


{ travelAndItinerary?.length>0 ?
<>
  <div className={` flex px-2 h-[52px] py-4  items-center justify-start gap-2`}>
   {travelAndItinerary?.length > 0 &&
   <>
    <input type='checkbox' checked={travelAndItinerary?.length === selectAll.length ? true : false}  className='w-4 h-4 accent-indigo-600' onChange={handleSelectAll}/>
    Select All
    <div>
    {selectAll.length > 0 && <ActionButton onRejectClick={() => openModal('rejectTrip')} onApproveClick={() => openModal('approveTrip')} approve={"Approve"} reject={"Reject"}/>}
    </div>
   </>}
   
  </div>

  <div className='w-full h-full mt-4  overflow-y-auto px-2 bg-white rounded-l-md'>
          { filterCashadvances(travelAndItinerary).map((trip) => { 
            return (
              <>
              <CardLayout index={trip?.tripId}>
            <div  className='w-full py-2'>
            <div className='flex gap-2 flex-col '> 
            <div className='flex flex-row justify-between'>
                <div className='flex gap-2 items-center'>
                <input onChange={() => handleSelect(trip)} type='checkbox' className='w-4 h-4 accent-indigo-600' checked={isTravelRequestSelected(trip?.travelRequestId)}/>
             <div>
                <p className='header-title'>Created By</p>
                <p className='header-text'>{trip?.createdBy?.name ?? <span className='text-center'>-</span>}</p>
             </div>
              </div>

            {/* / */}
            <div className='flex items-center justify-center'>
            <Violation violationCount={trip?.violationsCounter?.total}/>
             
              <div className='text-sm font-cabin px-2 py-1 cursor-pointer' onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible({travelRequestId:trip?.travelRequestId,  action:'travel-approval-view' })}}}>
                <p className='text-indigo-600 font-semibold'>View Details</p>
              </div>
              </div>
            {/* / */}
              </div>
             <div className='flex flex-row justify-between'>
              
             <TripName tripName={trip?.tripName} />
             
             </div>
              </div>
              
              {trip?.isCashAdvanceTaken && trip?.cashAdvance && trip?.cashAdvance?.map((advance,index) => (
                <div key={index} className={`px-2 py-2 ${index < trip?.cashAdvance.length-1 && 'border-b border-slate-400 '}`}>
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
                    <div className='flex justify-center items-center gap-2'>
                    {/* <div className={`text-center rounded-sm ${getStatusClass(advance?.cashAdvanceStatus ?? "-")}`}>
                       <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{advance?.cashAdvanceStatus ?? "-"}</p>
                    </div> */}
    
            <Violation violationCount={advance?.cashViolationsCounter}/>
                    {/* <div onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible(trip?.travelRequestId,  'ca-modify' ,advance?.cashAdvanceId,)}}} className={`w-7 h-7 bg-indigo-100 rounded-full border border-white flex items-center justify-center ${disableButton(trip?.travelRequestStatus)? ' cursor-not-allowed opacity-50' : ' cursor-pointer'}`}>
                    <img src={modify} className='w-4 h-4' alt="modify_icon" />
                    </div> */}
                  </div>
                  </div>
                </div>
))}
            </div>
            </CardLayout>
            </>
            )
           })}
      </div> </>:
      <div className='mt-4 h-full'>
      <EmptyBox  icon={approvalempty_icon} text="No Travel & Cash-Advance for Approval"/>
      </div>}

          </div>
           <div className='w-full md:w-1/2  flex flex-col'>
            <div className='flex shrink-0 justify-center items-center rounded-r-md font-inter text-md text-white h-[52px] bg-indigo-600  text-center'>
              <img src={money1} className='w-6 h-6 mr-2'/>
              <p>Travel & Non-Travel Expenses</p>
            </div>
            {/* <div className='flex px-2 h-[52px] py-4 items-center justify-start gap-2'/> */}


            <div className='w-full h-full mt-4  overflow-y-auto px-2 bg-white rounded-l-md'>
              {DummyExpenseData?.length>0 ? filterExpenses(DummyExpenseData)?.map((trip, index) => {
            return (
              <>
              <CardLayout index={index}>
            <div className='w-full py-2'>           
            <div className='flex gap-2 flex-col'> 
            <div className='flex flex-row justify-between'>
            <div className='flex gap-2 items-center'>
                {/* <input onChange={() => handleSelect(trip)} type='checkbox' className='w-4 h-4 accent-indigo-600' checked={isTravelRequestSelected(trip?.travelRequestId)}/> */}
             <div>
                <p className='header-title'>Created By</p>
                <p className='header-text'>{trip?.createdBy?.name ?? <span className='text-center'>-</span>}</p>
              </div>
              </div>
              <Button1 text="Take Action" variant="fit" onClick={() => {openModal("expenseDetails");setExpenseDetails({...trip,expenseType:trip?.expenseType})}}/>
            
              </div>  
              {trip?.expenseType === "Travel Expense" &&
             <div className='flex flex-row justify-between'>
              
              <TripName tripName={trip?.tripName}/>
            
             </div>}
              </div>

                   
                    
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
                <div className='text-sm font-cabin px-2 py-1 cursor-pointer' onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible(trip?.expenseType ==="Non Travel Expense" ? { expenseHeaderId:trip?.expenseHeaderId,  action:'nontravelExpense-approval-view' }:{tripId:trip?.tripId, expenseHeaderId:trip?.expenseHeaderId,  action:'travelExpense-approval-view' })}}}>
                  <p className='text-indigo-600 font-semibold'>View Details</p>
                </div>
                </div>
                            {/* <div className={`text-center rounded-sm ${getStatusClass(trip?.expenseHeaderStatus ?? "-")}`}>
                              <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{trip?.expenseHeaderStatus ?? "-"}</p>
                            </div> */}
                            {/* <div onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleTravelExpense(trip?.tripId, filteredTripExpenses?.expenseHeaderId,  'trip-ex-modify' ,)}}} className={`w-7 h-7 bg-indigo-100 rounded-full border border-white flex items-center justify-center ${disableButton(trip?.travelRequestStatus) ? ' cursor-not-allowed opacity-50' : ' cursor-pointer'}`}>
                              <img src={modify} className='w-4 h-4' alt="modify_icon" />
                            </div> */}
                          </div>
                          <ExpenseLine expenseLines={trip?.expenseLines}/>
                         
                        </div>
                      {/* // ))} */}
                    </div>
                  </div>
                  </CardLayout>
                  </>
                );
              }):<EmptyBox icon={approvalempty_icon} text='No Expense for Approval.'/>}
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
            <div onClick={() => setModalOpen(false)} className='bg-red-100 cursor-pointer rounded-full border border-white'>
              <img src={cancel} className='w-5 h-5' alt="Cancel icon"/>
            </div>
          </div>

          <div className="p-4">
            {getContent()}
            
          </div>
        </div>}
      />  
    </div>
   <PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} message={message}/>
   </>
    }
    
    </>
  );
};

export default Approval;




