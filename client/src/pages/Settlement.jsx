import React,{useEffect} from 'react'
import { useParams } from 'react-router-dom'
import FinanceMS from '../microservice/FinanceMS'
import Error from '../components/common/Error'

const Settlement = ({isLoading,loadingErrMsg,fetchData}) => {
  const {tenantId,empId}= useParams()
  const settlementBaseUrl = import.meta.env.VITE_SETTLEMENT_PAGE_URL

  useEffect(()=>{

    fetchData(tenantId,empId)

  },[])

  return (
<>
    {isLoading ? <Error message={loadingErrMsg}/>:
    <div className='h-full'>
      <FinanceMS  src={`${settlementBaseUrl}/${tenantId}/${empId}/settlement`}/>
    </div>}
</>    
  )
}

export default Settlement



// import React, { useState,useEffect } from 'react';

// import { useData } from '../api/DataProvider';
// import { getStatusClass ,titleCase, urlRedirection} from '../utils/handyFunctions';
// import { receipt, chevron_down, calender_icon, double_arrow , three_dot ,validation_sym, down_left_arrow, airplane_1, receipt_icon1, money} from '../assets/icon';
// import ApprovalTravelExpense from '../components/approvals/ApprovalTravelExpense';
// import { handleApproval } from '../utils/actionHandler';
// import { useParams } from 'react-router-dom';
// import TravelMS from '../microservice/TravelMS';
// import { approvalViewRoutes } from '../utils/route';
// import { travelExpense } from '../dummyData/travelExpense';
// // import CashAdvance from '../components/settlement/CashAdvance';



// const Settlement = ({fetchData}) => { 


//   const { employeeData  } = useData();
//   const {tenantId , empId,page} = useParams();
//   const [approvalUrl , setApprovalUrl]=useState(null)

//   const [paid , setPaid]=useState({
//     cashadvance:false,
//     expense:false,
//     reimbursement:false
//   })

//   const handleCashadvancePaid = () => {
//     setPaid(prevState => ({ ...prevState, cashadvance: !prevState.cashadvance }));
//   };

//   const handleExpensePaid = () => {
//     setPaid(prevState => ({ ...prevState, expense: !prevState.expense }));
//   };

//   const handleReimbursementPaid = () => {
//     setPaid(prevState => ({ ...prevState, reimbursement: !prevState.reimbursement }));
//   };

//   const settlements = 
//   [{
//     travelRequestNumber:"TRAL000001",
//     createdBy:{   
//         name:
//         "Benjamin Clark",
//         empId:
//         "1001"
//     },
//     isCashAdvanceTaken:true,
//     cashAdvances : [    
//       {
//         cashAdvanceNumber: "CA0001",
//         cashAdvanceRequestDate: "24-06-2024",
//         cashAdvanceStatus: "pending settlement",
//         amountDetails: [
//           {
//             amount: 5000,
//    currency:{         countryCode:
// "IN",
// fullName:
// "Indian Rupee",
// shortName:
// "INR",
// symbol:
// "₹"}
//           }
//         ]
//       }
//     ],
//     travelExpenses:[
//       {totalExpenseAmount:136,
//        remainingCashAdvance:4864
//       }
//     ]

//   }]
  


//    const [ settlementData,setSettlementData]= useState(settlements)
//    const [expApprovalData , setExpApprovalData]=useState([])

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
   
//   useEffect(()=>{

//     fetchData(tenantId,empId,page)

//   },[])
   
// useEffect(()=>{
//   const data = employeeData && employeeData?.dashboardViews?.employeeManager
//   // setApprovalData(data)
//   setSettlementData(data?.travelAndCash)
//   setExpApprovalData(data?.travelExpenseReports)
// },[employeeData])

// const filterTravelApprovalData  = settlementData && settlementData?.filter(item => ['approved','pending approval', 'upcoming', 'intransit'].includes(item?.travelRequestStatus) )
// console.log('Travel approval data',filterTravelApprovalData)
// console.log('Expense approval data',expApprovalData)

//   const [activeScreen, setActiveScreen] = useState('Cash-Advance Settlements');
//   const handleScreenChange = (screen) => {
//     setActiveScreen(screen);
//   };

//   return (
//     <>
//       {/* <div className="bg-white lg:flex"> */}
//       <div className="relative w-auto min-h-screen px-2 lg:px-10 xl:px-20 flex flex-col  items-center  bg-slate-100  ">
//          <TravelMS visible={visible} setVisible={setVisible} src={approvalUrl}/>

//           <div className=" flex flex-row items-center justify-start gap-2 sm:gap-4 font-cabin mb-2 mt-[50px]">

//                 <div className='relative'>
//                 {settlementData && filterTravelApprovalData?.length > 0 &&  <div className=' absolute right-[-1px] top-[-8px] w-fit p-[6px] bg-green-200 border border-white rounded-full '/>}
//                 <div
//                     className={`cursor-pointer py-1 px-2 text-center  w-auto min-w-[100px] truncate${
//                       activeScreen === 'Cash-Advance Settlements' ? 'font-medium rounded-xl bg-purple-500 text-xs text-gray-900 w-auto min-w-[100px] truncate' : ' rounded-xl bg-white-200'
//                     }`}
//                     onClick={() => handleScreenChange('Cash-Advance Settlements')}
//                   >
//                     Cash-Advance
//                   </div>
//                 </div>
                
//                 <div className='relative'>
//                 {settlementData && filterTravelApprovalData?.length > 0 &&  <div className=' absolute right-[-1px] top-[-8px] w-fit p-[6px] bg-green-200 border border-white rounded-full '/>}
//                 <div
//                     className={`cursor-pointer py-1 px-2  w-auto min-w-[100px] truncate${
//                       activeScreen === 'Travel-Expense Settlements' ? 'font-medium rounded-xl bg-purple-500 text-xs text-gray-900 w-auto min-w-[100px] truncate' : ' rounded-xl bg-white-200'
//                     }`}
//                     onClick={() => handleScreenChange('Travel-Expense Settlements')}
//                   >
//                     Travel Expense
//                   </div>
//                 </div>
                 
                
//                 <div className='relative'>
//                 {expApprovalData && expApprovalData?.length > 0 &&  <div className=' absolute right-[-1px] top-[-8px] w-fit p-[6px] bg-green-200 border border-white rounded-full '/>}
//                 <div
//                   className={`cursor-pointer py-1 px-2 w-auto min-w-[100px] truncate ${
//                     activeScreen === 'Reimbursement Settlements' ? 'font-medium rounded-xl bg-purple-500 text-xs text-gray-900 w-auto min-w-[100px] truncate' : 'bg-white rounded-xl'
//                   }`}
//                   onClick={() => handleScreenChange('Reimbursement Settlements')}
//                 >
//                 Reimbursement
//                 </div>
//                 </div>
             
//           </div>

//           {activeScreen === 'Cash-Advance Settlements' && 
//   <div className='px-4 xl:h-[600px] rounded-md h-[450px] border border-slate-400 w-full bg-white mt-7'>

//   <div className="w-full font-cabin   h-6 flex flex-row gap-3 mt-6 items-center sm:px-4 px-4">
//     <img className="w-6 h-5" src={money} alt="travel" />
//     <div className="text-base tracking-[0.02em] font-bold">Cash-Advance Settlements</div>
//   </div>

//   <div className="box-border mt-[46px] w-full border-t-[1px] "/>
//   <div className=' overflow-auto w-full h-[315px] xl:h-[460px] my-6'>
//   {settlements?.map((item ,index)=>(
//     <div key={index} className='rounded-lg min-w-full w-[650px] grow border min-h-[52px] h-auto mb-2 border-slate-300 hover:border-1 cursor-pointer hover:border-indigo-600 hover:shadow-md px-2 py-2'>
// <div className="flex h-[52px]  items-center justify-between ">
//  <div className=' flex gap-2 justify-between items-center'>  
//    <div className='px-2 py-2 w-[150px]'>
//    <p className='font-cabin font-normal  text-xs text-neutral-400'>Travel Request No.</p>
//    <p className='text-[14px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '> {item?.travelRequestNumber}</p>
//   </div>

  
//       <div className='px-2 py-2'>
//         <p className='font-cabin font-normal text-xs text-neutral-400'>Created By</p>
//         <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate  capitalize'> {item?.createdBy?.name ??""}</p>
//       </div>
      
//       </div>
     

// {/* <div className='flex flex-row '>
//     <div className="flex  h-[52px] px-2 py-3 items-center justify-center">
  
//   <div className={`flex capitalize items-center px-2 py-1 rounded-[12px] text-[12px] font-medium tracking-[0.03em] ${
//      getStatusClass(item?.travelRequestStatus)
//     }`}
//   >
//     {(item?.travelRequestStatus)}
//   </div>
// </div>



// <div className="flex  font-cabin  h-[52px] px-2 py-3 items-center justify-center w-[140px]">
  
//  <input onChange={()=>setPaid(true)} type='checkbox' />
  
//  </div>
//  </div> */}
//  </div> 

//  <div>
//   < div className={`${item?.isCashAdvanceTaken ? 'border-b border-slate-400 mx-2':''}`}/>

//  {item?.cashAdvances && item?.cashAdvances?.map((item,index)=>(
//   <div key={index} className='flex items-center justify-between t ml-20  gap-2'>
// <div className='flex'>
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



      
//  { !paid.cashadvance ? <div className='px-2 py-2 w-[150px] flex items-center justify-center flex-col gap-2 '>
//         <p className='font-cabin font-normal text-xs text-neutral-400'>Mark as Paid</p>
//         <input type='checkbox' onClick={handleCashadvancePaid}/>
//         </div> : 
        
//         <div  onClick={handleCashadvancePaid} className="flex w-[150px] h-[52px] px-2 py-3 items-center justify-center">
  
//   <div className={`flex capitalize items-center px-2 py-1 rounded-[12px] text-[12px] font-medium tracking-[0.03em] ${
//      getStatusClass('paid')
//     }`}
//   >
//     {'paid'}
//   </div>
// </div>}

//   </div>
//  ))}

//  </div>


//     </div>
//   ))}

//   </div>

//   </div>}


      
//   {activeScreen=== 'Travel-Expense Settlements' && 
//   <div className='px-4 xl:h-[600px] rounded-md h-[450px] border border-slate-400 w-full bg-white mt-7'>

//   <div className="w-full font-cabin   h-6 flex flex-row gap-3 mt-6 items-center sm:px-4 px-4">
//     <img className="w-6 h-5" src={receipt} alt="travel" />
//     <div className="text-base tracking-[0.02em] font-bold">Travel Expense Settlements</div>
//   </div>

//   <div className="box-border mt-[46px] w-full border-t-[1px] "/>
//   <div className=' overflow-auto w-full h-[315px] xl:h-[460px] my-6'>
//   {settlements?.map((item ,index)=>(
//     <div key={index} className='rounded-lg min-w-full w-[650px] grow border min-h-[52px] h-auto mb-2 border-slate-300 hover:border-1 cursor-pointer hover:border-indigo-600 hover:shadow-md px-2 py-2'>
// <div className="flex h-[52px]  items-center justify-between ">
//  <div className=' flex gap-2 justify-between items-center'>  
//    <div className='px-2 py-2 w-[150px]'>
//    <p className='font-cabin font-normal  text-xs text-neutral-400'>Travel Request No.</p>
//    <p className='text-[14px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '> {item?.travelRequestNumber}</p>
//   </div>

  
//       <div className='px-2 py-2'>
//         <p className='font-cabin font-normal text-xs text-neutral-400'>Created By</p>
//         <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate  capitalize'> {item?.createdBy?.name ??""}</p>
//       </div>
      
//       </div>
     

// {/* <div className='flex flex-row '>
//     <div className="flex  h-[52px] px-2 py-3 items-center justify-center">
  
//   <div className={`flex capitalize items-center px-2 py-1 rounded-[12px] text-[12px] font-medium tracking-[0.03em] ${
//      getStatusClass(item?.travelRequestStatus)
//     }`}
//   >
//     {(item?.travelRequestStatus)}
//   </div>
// </div>



// <div className="flex  font-cabin  h-[52px] px-2 py-3 items-center justify-center w-[140px]">
  
//  <input onChange={()=>setPaid(true)} type='checkbox' />
  
//  </div>
//  </div> */}
//  </div> 

//  <div>
//   < div className={`${item?.isCashAdvanceTaken ? 'border-b border-slate-400 mx-2':''}`}/>

//  {item?.cashAdvances && item?.cashAdvances?.map((item,index)=>(
//   <div key={index} className='flex items-center justify-between t ml-20  gap-2'>
// <div className='flex'>
// <div className='px-2 py-2'>
//   <img className='w-5 h-4 ' src={down_left_arrow}/>
// </div>
//       <div className='px-2 py-2 w-[150px]'>
//         <p className='font-cabin font-normal text-xs text-neutral-400'>Expense Header No.</p>
//         <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate'>ERAL000001</p>
//       </div>
//      <div className='px-2 py-2'>
//      <p className='font-cabin font-normal text-xs   text-neutral-400'>Expense Details</p>
    
//       {item?.amountDetails?.map((currencyItem,index)=>(
//       <React.Fragment key={index+'c'}>
//         <div className=' flex flex-row font-cabin gap-4 text-[14px] text-neutral-800 font-medium capitalize'>
//       <div className=' flex flex-row gap-2 '>{currencyItem.type}
//         <p>{currencyItem.currency.shortName}</p>
//         <p> 136.00</p>
//       </div>
      
//         <p className=' translate-y-[-1px] min-w-full text-red-200'>4864.00 <span className=' lowercase'>{'owed to the company'}</span></p>
     
//       </div>
//       </React.Fragment>
//     ))}
//   </div>
//   </div>



      
//  { !paid.expense ? <div className='px-2 py-2 w-[150px] flex items-center justify-center flex-col gap-2 '>
//         <p className='font-cabin font-normal text-xs text-neutral-400'>Mark as Recovered</p>
//         <input type='checkbox' onClick={handleExpensePaid}/>
//         </div> : 
        
//         <div  onClick={handleExpensePaid} className="flex w-[150px] h-[52px] px-2 py-3 items-center justify-center">
  
//   <div className={`flex capitalize items-center px-2 py-1 rounded-[12px] text-[12px] font-medium tracking-[0.03em] ${
//      getStatusClass('recovered')
//     }`}
//   >
//     {'recovered'}
//   </div>
// </div>}

//   </div>
//  ))}

//  </div>


//     </div>
//   ))}

//   </div>

//   </div>}
//   {activeScreen=== 'Reimbursement Settlements' && 
//   <div className='px-4 xl:h-[600px] rounded-md h-[450px] border border-slate-400 w-full bg-white mt-7'>

//   <div className="w-full font-cabin   h-6 flex flex-row gap-3 mt-6 items-center sm:px-4 px-4">
//     <img className="w-6 h-5" src={receipt} alt="travel" />
//     <div className="text-base tracking-[0.02em] font-bold">Reimbursement Expense Settlements</div>
//   </div>

//   <div className="box-border mt-[46px] w-full border-t-[1px] "/>
//   <div className=' overflow-auto w-full h-[315px] xl:h-[460px] my-6'>
//   {settlements?.map((item ,index)=>(
//     <div key={index} className='rounded-lg min-w-full w-[650px] grow border min-h-[52px] h-auto mb-2 border-slate-300 hover:border-1 cursor-pointer hover:border-indigo-600 hover:shadow-md px-2 py-2'>
// <div className="flex h-[52px]  items-center justify-between ">
//  <div className=' flex gap-2 justify-between items-center'>  
//    <div className='px-2 py-2 w-[150px]'>
//    <p className='font-cabin font-normal  text-xs text-neutral-400'>Expense Header No.</p>
//    <p className='text-[14px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '>REAL000001</p>
//   </div>

  
//       <div className='px-2 py-2'>
//         <p className='font-cabin font-normal text-xs text-neutral-400'>Created By</p>
//         <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate  capitalize'> {item?.createdBy?.name ??""}</p>
//       </div>
//       <div className='px-2 py-2'>
//      <p className='font-cabin font-normal text-xs   text-neutral-400'>Expense Details</p>
    
     
//         <div className=' flex flex-row font-cabin gap-4 text-[14px] text-neutral-800 font-medium capitalize'>
//       <div className=' flex flex-row gap-2 text-green-200'>
//         <p>INR</p>
//         <p> 5258.00<span className=' lowercase'>{' owed to employee.'}</span></p>
//       </div>


      
       
     
//       </div>
      
//   </div>

      
//       </div>
//       <div>
//       { !paid.reimbursement ? <div className='px-2 py-2 w-[150px] flex items-center justify-center flex-col gap-2 '>
//         <p className='font-cabin font-normal text-xs text-neutral-400'>Mark as Paid</p>
//         <input type='checkbox' onClick={handleReimbursementPaid}/>
//         </div> : 
        
//         <div  onClick={handleReimbursementPaid} className="flex w-[150px] h-[52px] px-2 py-3 items-center justify-center">
  
//   <div className={`flex capitalize items-center px-2 py-1 rounded-[12px] text-[12px] font-medium tracking-[0.03em] ${
//      getStatusClass('paid')
//     }`}
//   >
//     {'paid'}
//   </div>
// </div>}
// </div>
     

// {/* <div className='flex flex-row '>
//     <div className="flex  h-[52px] px-2 py-3 items-center justify-center">
  
//   <div className={`flex capitalize items-center px-2 py-1 rounded-[12px] text-[12px] font-medium tracking-[0.03em] ${
//      getStatusClass(item?.travelRequestStatus)
//     }`}
//   >
//     {(item?.travelRequestStatus)}
//   </div>
// </div>



// <div className="flex  font-cabin  h-[52px] px-2 py-3 items-center justify-center w-[140px]">
  
//  <input onChange={()=>setPaid(true)} type='checkbox' />
  
//  </div>
//  </div> */}
//  </div> 

//  {/* <div>
//   < div className={`${item?.isCashAdvanceTaken ? 'border-b border-slate-400 mx-2':''}`}/>

//  {item?.cashAdvances && item?.cashAdvances?.map((item,index)=>(
//   <div key={index} className='flex items-center justify-between t ml-20  gap-2'>
// <div className='flex'>
// <div className='px-2 py-2'>
//   <img className='w-5 h-4 ' src={down_left_arrow}/>
// </div>
//       <div className='px-2 py-2 w-[150px]'>
//         <p className='font-cabin font-normal text-xs text-neutral-400'>Expense Header No.</p>
//         <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate'>ERAL000001</p>
//       </div>
//      <div className='px-2 py-2'>
//      <p className='font-cabin font-normal text-xs   text-neutral-400'>Expense Details</p>
    
//       {item?.amountDetails?.map((currencyItem,index)=>(
//       <React.Fragment key={index+'c'}>
//         <div className=' flex flex-row font-cabin gap-4 text-[14px] text-neutral-800 font-medium capitalize'>
//       <div className=' flex flex-row gap-2 '>{currencyItem.type}
//         <p>{currencyItem.currency.shortName}</p>
//         <p> 136.00</p>
//       </div>
      
//         <p className=' translate-y-[-1px] min-w-full text-red-200'>4864.00 <span className=' lowercase'>{'owed to the company'}</span></p>
     
//       </div>
//       </React.Fragment>
//     ))}
//   </div>
//   </div>



      
//  { !paid ? <div className='px-2 py-2 w-[150px] flex items-center justify-center flex-col gap-2 '>
//         <p className='font-cabin font-normal text-xs text-neutral-400'>Status</p>
//         <input type='checkbox' onClick={handlePaid}/>
//         </div> : 
        
//         <div  onClick={handlePaid} className="flex w-[150px] h-[52px] px-2 py-3 items-center justify-center">
  
//   <div className={`flex capitalize items-center px-2 py-1 rounded-[12px] text-[12px] font-medium tracking-[0.03em] ${
//      getStatusClass('paid')
//     }`}
//   >
//     {'paid'}
//   </div>
// </div>}

//   </div>
//  ))}

//  </div> */}


//     </div>
//   ))}

//   </div>

//   </div>}
         
//         </div>
    
//     </>
//   );
// };

// export default Settlement;

