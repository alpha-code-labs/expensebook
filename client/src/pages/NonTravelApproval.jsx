/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/display-name */
import React,{ useState, useEffect} from "react";
import {BrowserRouter as Router, useParams} from 'react-router-dom'
import Icon from "../components/common/Icon";
import { formatAmount, titleCase } from "../utils/handyFunctions";
import Button from "../components/common/Button";
import Error from "../components/common/Error";
import PopupMessage from "../components/common/PopupMessage";
import { double_arrow, calender, cab_purple as cab_icon, airplane_1 as airplane_icon, briefcase, money, user_icon} from "../assets/icon";
import { dummyExpenseData } from "../dummyData/travelExpenseHeader";
import Select from "../components/common/Select";
import ActionButton from "../components/common/ActionButton";
import { approveTravelExpense, getnonTravelExpenseApi, getTravelExpenseDataApi, rejectTravelExpense } from "../utils/api";
import { ExpenseHeader, ExpenseLine, NonTravelExpenseHeader, TripName } from "../components/common/TinyComponent";


const rejectionOptions=['Too Many Violations', 'Budget Constraints','Insufficient Documents','Upcoming Project Deadline']

export default function () {
  //get travel request Id from params
  const dashboardBaseUrl = `${import.meta.env.VITE_DASHBOARD_URL}`
    const {tenantId,empId,expenseHeaderId} = useParams()
    
    const [showPopup, setShowPopup] = useState(false)
    const [message, setMessage] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const [isLoading, setIsLoading] = useState(true);
    const [loadingErrMsg, setLoadingErrMsg] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [expenseData , setExpenseData]=useState(null);
    const [expenseAmtDetails , setExpenseAmtDetails]=useState({})
    const [defaultCurrency,setDefaultCurrency]=useState(null)
    //const [lineItems,setLineItems]=useState(null)
    const [selectedRejReason, setSelectedRejReason]=useState(null)
    const [error , setError] = useState({set: false , message:""})
     

const paramsElement = {tenantId, empId,expenseHeaderId}


const [actionData , setActionData]= useState({})

    const handleModalVisible = (action) => {
        console.log('prams',paramsElement)
        setShowModal((prev) => (!prev));  
        setActionData({action,...paramsElement})
        
    }
    
   

   const handleConfirm=async()=>{
    
    const {action,tenantId,empId,tripId,expenseHeaderId} = actionData
    console.log('action data ', actionData)
    let api;
    if(action==='approve-expense'){
        api= approveTravelExpense(tenantId, empId,tripId,  expenseHeaderId)
    }else if (action ==='reject-expense'){
        api = rejectTravelExpense(tenantId,empId,tripId,expenseHeaderId,selectedRejReason)
    }

    let validConfirm = true
    
     if((action === 'reject-expense' && selectedRejReason === null)){
      setError({set:true,message:'Please select a reason'})
      validConfirm =false
     }else{
      setError({set:false,message:''})
     }
    
    if(validConfirm){
      try {
        setIsUploading(true);
        // const response = await postTravelPreference_API({ tenantId, empId, formData });
       const response = await api
       console.log('responsemessage',response)
       handleModalVisible()
       setShowPopup(true) 
       setMessage(response)
       setTimeout(() => {setIsUploading(false);setMessage(null);setShowPopup(false)},5000);
      
    window.parent.postMessage('closeIframe', dashboardBaseUrl);
      
      } catch (error) {
        console.log('error',error.message)
        setShowPopup(true)
        handleModalVisible()
        setMessage(`Please retry again : ${error.message}`); 
        setTimeout(() => {setIsUploading(false);setMessage(null);setShowPopup(false)},5000);
    
      }
    // handleModalVisible()
      setActionData({})
      setSelectedRejReason(null)
    }
   }
//this is get data api

    useEffect(() => {
        const fetchData = async () => {
          try {
            setIsLoading(true)
            const response = await getnonTravelExpenseApi(tenantId, empId, expenseHeaderId);
            const getReport=response?.data?.getReport?.reimbursementSchema
            setExpenseData({
                "defaultCurrency":getReport?.defaultCurrency,
                "expenseLines": getReport?.expenseLines,
                "expenseViolations": getReport?.expenseViolations,
                "expenseHeaderNumber": getReport?.expenseHeaderNumber,
                "approvers":getReport?.approvers || [],
                "createdBy": getReport?.createdBy || {}
            }); 
            setIsLoading(false);
            console.log(response.data)
            console.log('expense data for approval fetched.');
          } catch (error) {
            console.log('Error in fetching expense data for approval:', error.message);
            setLoadingErrMsg(error.message);
            // setTimeout(() => {setLoadingErrMsg(null);setIsLoading(false)},5000);
          }
        };
    
        fetchData(); 
    
      }, [tenantId,empId ,expenseHeaderId]);
      console.log('expense data ',expenseData)

    // useEffect(()=>{
    //     setExpenseData(dummyExpenseData) 
    //   },[expenseData])
    
    //   useEffect(()=>{
    //     setAlreadyBookedExpense(expenseData?.expenseReport?.alreadyBookedExpenseLines && expenseData?.expenseReport?.alreadyBookedExpenseLines)
    //     setExpenseAmtDetails(expenseData?.expenseAmountStatus)
    //     setLineItems(expenseData?.expenseReport?.expenseLines)
    //     setDefaultCurrency(expenseData?.expenseReport?.defaultCurrency)
    //     console.log(expenseData)
    //   },[expenseData])

    //   console.log('already booked expense',alreadyBookedExpense)
    //   console.log('expenseAmtDetails',expenseAmtDetails)
    //   console.log('expenselineItems',lineItems)

      const categories = ['flights', 'cabs', 'hotels', 'trains', 'buses'];

      
    
  
   
  

  ///for  already booked expenses start
 
//   let totalAllCategories = 0;

//   const calculateTotalAmount = (category)=>{
//     if(alreadyBookedExpense[category]){
//       const totalAmount = alreadyBookedExpense[category].reduce(
        
//         (accumlator , item)=> accumlator + parseFloat(item?.bookingDetails?.billDetails?.totalAmount),0 );
//         return totalAmount.toFixed(2)
//     }
//     return "00.00";
//   }

  // for already booked expense ended


  const [groupedExpenses, setGroupedExpenses] = useState({});
  const [grandTotal, setGrandTotal] = useState(0);

  // Group expenses by category and calculate the total amount for each category
  const groupExpenses = () => {
    const grouped = expenseData?.expenseLines && expenseData?.expenseLines.reduce((accumulator, expense) => {
      const { 'Category Name': categoryName , 'Total Amount': totalAmount, 'Total Fair': totalFair,convertedAmountDetails } = expense;

      // Use a generic property name ('total') to store the total amount
      const convertedAmount = (convertedAmountDetails && convertedAmountDetails?.convertedTotalAmount) || 0
      const total =parseFloat(convertedAmount) || parseFloat(totalAmount) || parseFloat(totalFair) || 0;

      if (!accumulator[categoryName]) {
        accumulator[categoryName] = {
          'Category Name':categoryName,
          'Total Amount': total,
        };
      } else {
        accumulator[categoryName]['Total Amount'] += total;
      }

      return accumulator;
    }, {});

    setGroupedExpenses(grouped);
    // Calculate the grand total
  const allTotals = Object.values(grouped).map(category => category['Total Amount']);
  const grandTotal = allTotals.reduce((sum, total) => sum + total, 0);
  setGrandTotal(grandTotal);
  };

  //Call groupExpenses when the component mounts
  useEffect(() => {
    expenseData?.expenseLines &&  groupExpenses();
   console.log('grouped expense',Object.values(groupedExpenses))
  }, [expenseData?.expenseLines]);

      
    // useEffect(()=>{
    //     if(showCancelModal){
    //         document.body.style.overflow = 'hidden'
    //     }
    //     else{
    //         document.body.style.overflow = 'auto'
    //     }
    // },[showCancelModal])



    
  
      
 
      

      

  return <>
      {isLoading && <Error message={loadingErrMsg}/>}
      {!isLoading && 
        <div className=" w-full h-full relative bg-white-100 px-4 py-4 select-none custom-scrollbar ">
        <div className=" w-full h-full  font-cabin tracking-tight ">
<NonTravelExpenseHeader 
name={expenseData?.createdBy?.name?? "not available"}
tripNumber={expenseData?.tripNumber?? "not available"}
defaultCurrency={expenseData?.defaultCurrency}
expenseAmountStatus={expenseAmtDetails}
/>

<div className="flex w-full justify-between  items-center bg-indigo-50 py-2 px-6 mt-2 border-[1px] rounded-sm border-indigo-600 cursor-pointer">
  <p className=" whitespace-nowrap text-indigo-600"> {`Header Report No. ${expenseData?.expenseHeaderNumber}`}</p>
</div>
           
        
            <hr/>
            <div className=' '>
<div>

  <ExpenseLine expenseLines={Object.values(groupedExpenses)} defaultCurrency={expenseData?.defaultCurrency ||{}}/>

</div>  
<div className="px-4 py-2  border-neutral-300 text-neutral-900 flex flex-row justify-between items-center bg-slate-100 mt-1">
  <div className="text-sm text-Inter font-medium mb-1">Total Expense Amount</div>
  <div className="text-sm font-medium pl-4">{`${expenseData?.defaultCurrency?.shortName} ${grandTotal.toFixed(2)}`}</div>
</div>

{expenseAmtDetails?.totalPersonalExpenseAmount > 0 && (
  <div className="px-4 py-2 border-b-[1px] border-neutral-300 flex flex-row justify-between items-center">
    <div className="text-sm text-Inter font-medium mb-1 text-neutral-600">Personal Expense Amount</div>
    <div className="text-sm font-medium pl-4">- {`${defaultCurrency?.shortName} ${expenseAmtDetails?.totalPersonalExpenseAmount?.toFixed(2)}`}</div>
  </div>
)}

{expenseAmtDetails?.totalPersonalExpenseAmount > 0 && (
  <div className="px-4 py-2 border-b-[1px] border-neutral-300 text-neutral-900 flex flex-row justify-between items-center">
    <div className="text-sm text-Inter font-medium mb-1">Final Expense Amount</div>
    <div className="text-sm font-medium pl-4">
      {`${expenseData?.defaultCurrency?.shortName} ${(grandTotal - expenseAmtDetails.totalPersonalExpenseAmount).toFixed(2)}`}
    </div>
  </div>
)}

<div className={`px-4 py-2 border-neutral-300 flex flex-row justify-between items-center ${grandTotal > 0 ? 'text-green-200' : 'text-red-500'}`}>
  <div className={`text-sm text-inter font-semibold mb-1`}>
    {Number(grandTotal) > 0
      ? 'No recovery needed. Amount to be Reimbursed.'
      : 'Recovery needed. Amount to be Recovered.'}
  </div>
  <div className="text-sm pl-4 font-semibold">
    {`${expenseData?.defaultCurrency?.shortName} ${formatAmount(grandTotal) ?? "-"}`}
  </div>
</div>
   
      </div>





     



            {/* {showConfimationForCancllingTR && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
                <div className='z-10 max-w-4/5 w-2/5 min-h-4/5 max-h-4/5 scroll-none bg-white-100  rounded-lg shadow-md'>
                    <div className="p-10">
                        <p className="text-xl font-cabin">Please select reasons for cancelling this travel Request</p>
                        <Select 
                            options={rejectionReasonOptions}
                            onSelect={onReasonSelection}
                            placeholder='Please select reason for rejection'
                        />
                        <div className="flex mt-10 justify-between">
                            <Button variant='fit' text='Cancel' onClick={handleReject} />
                            <Button variant='fit' text='Confirm' onClick={()=>setShowConfirmationForCancellingTr(false)} />
                        </div>
                    </div>
                </div>
                </div>
            } */}
            {showModal && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
                <div className='z-10 max-w-4/5 sm:w-2/5 w-auto min-h-4/5 max-h-4/5 scroll-none bg-white-100   rounded-lg shadow-md'>
                    <div className="p-10">
                        <p className="text-xl text-center font-cabin text-neutral-600 ">Click on confirm for <span className="capitalize text-indigo-600">{actionData?.action}!</span></p>
                        { (actionData?.action === 'reject-expense') &&
                        <div className="mt-8 flex justify-center">
                        <Select 
                            currentOption={selectedRejReason}
                            title='Please select the reason for reject'
                            placeholder='Select Reason'
                            options={rejectionOptions}
                            onSelect={(value)=>(setSelectedRejReason(value))}
                            error={error}
                        />
                        </div>}
                        <div className="flex flex-row mt-10 justify-between items-center  ">
                            <div className="w-fit ">
                            <Button  text='Cancel' onClick={()=>{handleModalVisible();setActionData({});setError(null)}} />
                            </div>
                            <div className="w-fit ">
                            <Button  disabled={isUploading} active={isUploading} loading={isUploading} text='Confirm' onClick={handleConfirm} />
                            </div>
                           
                        </div>
                    </div>
                </div>
                </div>
            }
        </div>
        
        {/* <div className="flex mt-10 flex-row-reverse">
            <Button text='Submit' onClick={handleSubmit}/>
        </div> */}
        </div>
      }
      <PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} message={message}/>
  </>;
}

// function spitBoardingPlace(modeOfTransit){
//     if(modeOfTransit === 'Flight')
//         return 'Airport'
//     else if(modeOfTransit === 'Train')
//         return 'Railway station'
//     else if(modeOfTransit === 'Bus')
//         return 'Bus station'
// }

function spitImageSource(modeOfTransit){
    if(modeOfTransit === 'Flight')
        return airplane_icon
    else if(modeOfTransit === 'Train')
        return cab_icon
    else if(modeOfTransit === 'Bus')
        return cab_icon
}




function FlightCard({amount,from, to, date, time, travelClass, onClick, mode='Flight', showActionButtons, itnId, handleLineItemAction}){
    return(
    <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
    <img src={spitImageSource(mode)} className='w-4 h-4' />
    <div className="w-full flex sm:block">
        <div className='mx-2 text-xs text-neutral-600 flex justify-between flex-col sm:flex-row'>
            <div className="flex-1">
                Total Amount  
            </div>
           

            
           
           
        </div>

        <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
           
            
           
            {/* <div className="flex-1">
                {time??'N/A'}
            </div> */}
            <div className="flex-1">
                {amount??'N/A'}
            </div>
        </div>
    </div>

    

    </div>)
}


// function CabCard_({from, to, date, time, travelClass, onClick, mode, isTransfer=false, showActionButtons, itnId}){
//     return(
//     <div className='Itinenery mb-4 bg-slate-50 mt-2' >
//         <div className='h-auto w-auto border border-slate-300 rounded-md'>     
//             <div className='flex flex-row py-3 px-2 divide-x'>
//                 <div className='flex items-center flex-grow divide-x '>
                
//                 <div className='flex items-start justify-start  flex-col shrink w-auto md:w-[200px] mr-4'>
//                     <div className='flex items-center justify-center mb-2'>
//                         <div className='pl-2'>
//                             <img src={cab_icon} alt="calendar" width={16} height={16} />
//                         </div>
//                         <span className="ml-2 tracking-[0.03em] font-cabin leading-normal text-gray-800 text-xs md:text-sm">
//                             Class : {travelClass}
//                         </span>
//                     </div>
                
//                     <div className='ml-4 max-w-[200px] w-auto'>
//                         <span className='text-xs font-cabin'>
//                             <div className='ml-4 max-w-[200px] w-auto'>
//                                 <span className='text-xs font-cabin'>{date}, {time}</span>
//                             </div>
//                         </span>
//                     </div>
//                 </div>
                
//                 <div className='flex grow  items-center justify-center '>
//                 <div className="flex text-xs text-gray-800 font-medium px-2 gap-4 justify-around">
                    
//                     <div className='flex flex-col text-lg font-cabin w-3/7  items-center text-center shrink '>
//                     <span className='text-xs'>Pick-Up</span>
//                     <span className='text-x'> {from} </span> 
//                     </div>
                    
//                     <div className='flex justify-center items-center w-1/7 min-w-[20px] min-h-[20px]'>
//                     <div className='p-4 bg-slate-100 rounded-full'>
//                             <img src={double_arrow} alt="double arrow" width={20} height={20} />
//                     </div>
//                     </div>
                
//                     <div className='flex flex-col text-lg font-cabin w-3/7 items-center text-center'>
//                     <span className='text-xs'>Drop-Off</span>
//                     <span className=''>{to}</span> 
//                     </div>

//                 </div>
//                 </div>
                
                
//                 </div>
                
                
//                 <div className='flex justify-end items-center px-8'>
                
//                 <div className={`flex items-center px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] text-gray-600 cursor-pointer bg-slate-100  hover:bg-red-100  hover:text-red-900 `} onClick={onClick}>
//                     Cancel      
//                 </div>
//             </div>

//             </div>  
//         </div>
//     </div>
//     )
// }

function HotelCard({checkIn, checkOut, hotelClass, onClick, preference='close to airport,', showActionButtons, itnId, handleLineItemAction}){
    return(
    <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
    <p className='font-semibold text-base text-neutral-600'>Hotel</p>
    <div className="w-full flex sm:block">
        <div className='mx-2 text-xs text-neutral-600 flex justify-between flex-col sm:flex-row'>
            <div className="flex-1">
                Check-In  
            </div>
            <div className="flex-1" >
                Checkout
            </div>
            <div className="flex-1">
                Class/Type
            </div>
            <div className='flex-1'>
                Site Preference
            </div>
        </div>

        <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
            <div className="flex-1">
                {checkIn}     
            </div>
            <div className="flex-1">
                {checkOut}     
            </div>
            <div className="flex-1">
                {hotelClass??'N/A'}
            </div>
            <div className='flex-1'>
                {preference??'N/A'}
            </div>
        </div>

    </div>

    {showActionButtons && 
    <div className={`flex items-center gap-2 px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] text-gray-600 cursor-pointer bg-slate-100  hover:bg-red-100  hover:text-red-900 `} onClick={onClick}>
        <div onClick={()=>handleLineItemAction(itnId, 'approved')}>
            <ActionButton text={'approve'}/>
        </div>
        <div onClick={()=>handleLineItemAction(itnId, 'rejected')}>
            <ActionButton text={'reject'}/>   
        </div>   
    </div>}

    </div>)
}

function CabCard({from, to, date, time, travelClass, onClick, mode, isTransfer=false, showActionButtons, itnId, handleLineItemAction}){
    return(
    <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
    <div className='font-semibold text-base text-neutral-600'>
    <img src={cab_icon} className='w-6 h-6' />
        <p className="text-xs text-neutral-500">{isTransfer? 'Transfer Cab': 'Cab'}</p>
    </div>
    <div className="w-full flex sm:block">
        <div className='mx-2 text-xs text-neutral-600 flex justify-between flex-col sm:flex-row'>
            <div className="flex-1">
                Pickup     
            </div>
            <div className="flex-1" >
                Drop    
            </div>
            <div className="flex-1">
                    Date
            </div>
            <div className="flex-1">
                Preffered Time
            </div>
            {!isTransfer && <div className="flex-1">
                Class/Type
            </div>}
        </div>

        <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
            <div className="flex-1">
                {from??'not provided'}     
            </div>
            <div className="flex-1">
                {to??'not provided'}     
            </div>
            <div className="flex-1">
                {date??'not provided'}
            </div>
            <div className="flex-1">
                {time??'N/A'}
            </div>
           {!isTransfer && <div className="flex-1">
                {travelClass??'N/A'}
            </div>}
        </div>
    </div>
    {showActionButtons && 
    <div className={`flex items-center gap-2 px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] text-gray-600 cursor-pointer bg-slate-100  hover:bg-red-100  hover:text-red-900 `} onClick={onClick}>
        <div onClick={()=>handleLineItemAction(itnId, 'approved')}>
            <ActionButton text={'approve'}/>
        </div>
        <div onClick={()=>handleLineItemAction(itnId, 'rejected')}>
            <ActionButton text={'reject'}/>   
        </div>   
    </div>}
    </div>)
}

