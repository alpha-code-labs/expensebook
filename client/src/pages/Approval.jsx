import React, { useState,useEffect } from 'react';

import { useData } from '../api/DataProvider';
import { getStatusClass ,titleCase, urlRedirection} from '../utils/handyFunctions';
import { receipt, chevron_down, calender, double_arrow , three_dot ,validation_sym, down_left_arrow, airplane_1, receipt_icon1} from '../assets/icon';
import ApprovalTravelExpense from '../components/approvals/ApprovalTravelExpense';
import { handleApproval } from '../utils/actionHandler';
import { useParams } from 'react-router-dom';
import TravelMS from './TravelMS';
import { approvalViewRoutes } from '../utils/route';
// import CashAdvance from '../components/settlement/CashAdvance';



const Approval = ({fetchData}) => { 

  const { employeeData  } = useData();
  const {tenantId , empId,page} = useParams();
  const [approvalUrl , setApprovalUrl]=useState(null)
  

   const [approvalData , setApprovalData]=useState([]); // data for the table in Approval page.
   const [ trApprovalData,setTrApprovalData]= useState([])
   const [expApprovalData , setExpApprovalData]=useState([])

   const approvalBaseUrl  = import.meta.env.VITE_APPROVAL_PAGE_URL;
   const [visible, setVisible]=useState(false)

   const handleVisible= (travelRequestId ,tripId, expenseHeaderId ,action,)=>{

     setVisible(!visible);
     let url ;
     if (action==="travel-approval"){
       url=approvalViewRoutes.viewDetails.viewDetails_tr_standalone.getUrl(tenantId,empId,travelRequestId)
     }
     else if (action==="approval-view-tr-expense"){
       url=approvalViewRoutes.viewDetails.viewDetails_tr_expense.getUrl(tenantId,empId,tripId,expenseHeaderId)
     }
     else {
       throw new Error('Invalid action');
     }
     
     setApprovalUrl(url)
   }
   console.log('approval url',approvalUrl)
   
   useEffect(() => {
     const handleMessage = event => {
       console.log(event)
       // Check if the message is coming from the iframe
       if (event.origin === approvalBaseUrl ) {
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
   
   useEffect(()=>{
 
     fetchData(tenantId,empId,page)
 
   },[])
   
useEffect(()=>{
  const data = employeeData && employeeData?.dashboardViews?.employeeManager
  // setApprovalData(data)
  setTrApprovalData(data?.travelAndCash)
  setExpApprovalData(data?.travelExpenseReports)
},[employeeData])

const filterTravelApprovalData  = trApprovalData && trApprovalData?.filter(item => ['approved','pending approval', 'upcoming', 'intransit'].includes(item?.travelRequestStatus) )
console.log('Travel approval data',filterTravelApprovalData)
console.log('Expense approval data',expApprovalData)

  const [activeScreen, setActiveScreen] = useState('Travel & Cash Adv. Requests');
  const handleScreenChange = (screen) => {
    setActiveScreen(screen);
  };

  return (
    <>
      {/* <div className="bg-white-100 lg:flex"> */}
      <div className="relative w-auto min-h-screen px-2 lg:px-10 xl:px-20 flex flex-col  items-center  bg-slate-100  ">
         <TravelMS visible={visible} setVisible={setVisible} src={approvalUrl}/>
       
       
          <div className=" flex flex-row items-center justify-start gap-2 sm:gap-4 font-cabin mb-2 mt-[50px]">

                <div className='relative'>
                {trApprovalData && filterTravelApprovalData?.length > 0 &&  <div className=' absolute right-[-1px] top-[-8px] w-fit p-[6px] bg-green-200 border border-white-100 rounded-full '/>}
                <div
                    className={`cursor-pointer py-1 px-2  w-auto min-w-[100px] truncate${
                      activeScreen === 'Travel & Cash Adv. Requests' ? 'font-medium rounded-xl bg-purple-500 text-xs text-gray-900 w-auto min-w-[100px] truncate' : ' rounded-xl bg-white-200'
                    }`}
                    onClick={() => handleScreenChange('Travel & Cash Adv. Requests')}
                  >
                    Travel & Cash-Advance
                  </div>
                </div>
                 
                
                <div className='relative'>
                {expApprovalData && expApprovalData?.length > 0 &&  <div className=' absolute right-[-1px] top-[-8px] w-fit p-[6px] bg-green-200 border border-white-100 rounded-full '/>}
                <div
                  className={`cursor-pointer py-1 px-2 w-auto min-w-[100px] truncate ${
                    activeScreen === 'Travel Expenses' ? 'font-medium rounded-xl bg-purple-500 text-xs text-gray-900 w-auto min-w-[100px] truncate' : 'bg-white-100 rounded-xl'
                  }`}
                  onClick={() => handleScreenChange('Travel Expenses')}
                >
                Travel Expense Report
                </div>
                </div>
             
          </div>

          {activeScreen === 'Travel & Cash Adv. Requests' && 
  <div className='px-4 xl:h-[600px] rounded-md h-[450px] border border-slate-400 w-full bg-white-100 mt-7'>

  <div className="w-full font-cabin   h-6 flex flex-row gap-3 mt-6 items-center sm:px-4 px-4">
    <img className="w-6 h-5" src={airplane_1} alt="travel" />
    <div className="text-base tracking-[0.02em] font-bold">Travel Requests & Cash-Advances</div>
  </div>

  <div className="box-border mt-[46px] w-full border-t-[1px] "/>
  <div className=' overflow-auto w-full h-[315px] xl:h-[460px] my-6'>
  {trApprovalData && filterTravelApprovalData?.map((item ,index)=>(
    <div key={index} className='rounded-lg min-w-full w-[650px] grow border min-h-[52px] h-auto mb-2 border-slate-300 hover:border-1 cursor-pointer hover:border-indigo-600 hover:shadow-md px-2 py-2'>
<div className="flex h-[52px]  items-center justify-between ">
 <div className=' flex gap-2 justify-between items-center'>  
   <div className='px-2 py-2 w-[150px]'>
   <p className='font-cabin font-normal  text-xs text-neutral-400'>Travel Request No.</p>
   <p className='text-[14px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '> {item?.travelRequestNumber}</p>
  </div>

  
      <div className='px-2 py-2'>
        <p className='font-cabin font-normal text-xs text-neutral-400'>Trip Purpose</p>
        <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate  capitalize'> {item?.tripPurpose ??""}</p>
      </div>
      
      </div>
     

<div className='flex flex-row '>
    <div className="flex  h-[52px] px-2 py-3 items-center justify-center">
  
  <div className={`flex capitalize items-center px-2 py-1 rounded-[12px] text-[12px] font-medium tracking-[0.03em] ${
     getStatusClass(item?.travelRequestStatus)
    }`}
  >
    {(item?.travelRequestStatus)}
  </div>
</div>



<div className="flex  font-cabin  h-[52px] px-2 py-3 items-center justify-center w-[140px]">
  
 
  {item?.travelRequestStatus=='pending approval' &&
   <div onClick={()=>handleVisible(item.travelRequestId,"","","travel-approval")} className="flex-1 flex items-center justify-end py-2 px-3 cursor-pointer">
   <b className="text-purple-500 text-[14px] tracking-[0.02em] w-[98px] font-bold">
     View Details
   </b>
 </div>}
 </div>
 </div>
 </div> 

 <div>
  < div className={`${item?.isCashAdvanceTaken ? 'border-b border-slate-400 mx-2':''}`}/>

 {item?.cashAdvance && item?.cashAdvance?.map((item,index)=>(
  <div key={index} className='flex items-center justify-start ml-20  gap-2'>

<div className='px-2 py-2'>
  <img className='w-5 h-4 ' src={down_left_arrow}/>
</div>
      <div className='px-2 py-2 w-[150px]'>
        <p className='font-cabin font-normal text-xs text-neutral-400'>Cash-Advance No.</p>
        <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate'>{item?.cashAdvanceNumber}</p>
      </div>
     <div className='px-2 py-2'>
     <p className='font-cabin font-normal text-xs   text-neutral-400'>Amount Details</p>
    
      {item?.amountDetails?.map((currencyItem,index)=>(
      <React.Fragment key={index+'c'}>
        <div className=' flex flex-row font-cabin gap-4 text-[14px] text-neutral-800 font-medium capitalize'>
      <div className=' flex flex-row gap-2 '>{currencyItem.type}
        <p>{currencyItem.currency.shortName}</p>
        <p> {currencyItem?.amount},</p>
      </div>
      
        <p className=' translate-y-[-1px] min-w-full '> {currencyItem?.mode ??' -'}</p>
     
      </div>
      </React.Fragment>
    ))}
  </div>

  </div>
 ))}

 </div>


    </div>
  ))}

  </div>

  </div>}


      
  {activeScreen=== 'Travel Expenses' && 
  <div className='px-4 xl:h-[600px] rounded-md h-[450px] border border-slate-400 w-full bg-white-100 mt-7'>

  <div className="w-full font-cabin   h-6 flex flex-row gap-3 mt-6 items-center sm:px-4 px-4">
    <img className="w-6 h-5" src={receipt} alt="travel" />
    <div className="text-base tracking-[0.02em] font-bold">Travel Expense Reports</div>
  </div>

  <div className="box-border mt-[46px] w-full border-t-[1px] "/>
  <div className=' overflow-auto w-full h-[315px] xl:h-[460px] my-6'>
  {expApprovalData && expApprovalData?.map((item ,index)=>(
    <div key={index} className='rounded-lg min-w-full w-[650px] grow border min-h-[52px] h-auto mb-2 border-slate-300 hover:border-1 cursor-pointer hover:border-indigo-600 hover:shadow-md px-2 py-2'>
<div className="flex h-[52px]  items-center justify-between ">
 <div className=' flex gap-2 justify-between items-center'>  
   <div className='px-2 py-2 w-[150px]'>
   <p className='font-cabin font-normal  text-xs text-neutral-400'>Trip No.</p>
   <p className='text-[14px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '> {item?.tripNumber}</p>
  </div>

  
      {/* <div className='px-2 py-2'>
        <p className='font-cabin font-normal text-xs text-neutral-400'>Trip Purpose</p>
        <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate  capitalize'> {item?.tripPurpose ??""}</p>
      </div> */}
      
      </div>
     


    <div className="flex  h-[52px] px-2 py-3 items-center justify-center">
  
  <div className={`flex capitalize items-center px-2 py-1 rounded-[12px] text-[12px] font-medium tracking-[0.03em] ${
     getStatusClass(item?.tripStatus)
    }`}
  >
    {(item?.tripStatus)}
  </div>
</div>

{/* 
<div className="flex  font-cabin  h-[52px] px-2 py-3 items-center justify-center w-[140px]">
  
 
  {item?.travelRequestStatus=='pending approval' &&
   <div onClick={()=>handleVisible(item.travelRequestId,"","","travel-approval")} className="flex-1 flex items-center justify-end py-2 px-3 cursor-pointer">
   <b className="text-purple-500 text-[14px] tracking-[0.02em] w-[98px] font-bold">
     View Details
   </b>
 </div>}
 </div> */}

 </div> 

 <div>
  < div className={'border-b border-slate-400 mx-2'}/>

 
  <div key={index} className='flex items-center justify-between ml-20  gap-2'>
    
<div className='flex flex-row justify-between items-center'>
<div className='px-2 py-2'>
  <img className='w-5 h-4 ' src={down_left_arrow}/>
</div>
      <div className='px-2 py-2 w-[150px]'>
        <p className='font-cabin font-normal text-xs text-neutral-400'>Travel Expense No.</p>
        <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate'>{item?.expenseHeaderNumber}</p>
      </div>
      </div>
      

     {/* <div className='px-2 py-2'>
     <p className='font-cabin font-normal text-xs   text-neutral-400'>Amount Details</p>
    
      {item?.amountDetails?.map((currencyItem,index)=>(
      <React.Fragment key={index+'c'}>
        <div className=' flex flex-row font-cabin gap-4 text-[14px] text-neutral-800 font-medium capitalize'>
      <div className=' flex flex-row gap-2 '>{currencyItem.type}
        <p>{currencyItem.currency.shortName}</p>
        <p> {currencyItem?.amount},</p>
      </div>
      
        <p className=' translate-y-[-1px] min-w-full '> {currencyItem?.mode ??' -'}</p>
     
      </div>
      </React.Fragment>
    ))}
  </div> */}
  
<div className="flex  font-cabin  h-[52px] px-2 py-3 items-center justify-center w-[140px]">
  
 

   <div onClick={()=>handleVisible("",item?.tripId,item?.expenseHeaderId,"approval-view-tr-expense")} className="flex-1 flex items-center justify-end py-2 px-3 cursor-pointer">
   <b className="text-purple-500 text-[14px] tracking-[0.02em] w-[98px] font-bold">
     View Details
   </b>
 </div>
 </div>

  </div>


 </div>


    </div>
  ))}

  </div>

  </div>}


{/* {activeScreen === 'Travel & Cash Adv. Requests' && 
           <>
  <div className="w-full   h-6 flex flex-row gap-3 mt-7 items-center sm:px-8 px-4">
    <img className="w-6 h-5" src={airplane_1} alt="travel" />
    <div className="text-base tracking-[0.02em] font-bold">Travel Requests & Cash Advances</div>
  </div>            
         <div className="box-border  mt-[46px] w-full  h-px border-t-[1px]   border-slate-300 "/>
        
         <div className='min-h-[400px] h-full overflow-auto mt-6 w-auto flex flex-col items-center   '>
        
            {trApprovalData && filterTravelApprovalData?.map((item ,index)=>(
              <React.Fragment key={index}>
            <div key={index} className="box w-full max-w-[896px]  h-auto  mx-2 sm:mx-4 mb-2  font-cabin">
            <div className="w-full   h-auto  lg:min-h-[56px] rounded-xl border-[1px] border-b-gray hover:border-indigo-600 ">
            <div className='w-full max-w-[932px]  rounded-md'>
    <div className={`w-auto max-w-[900px] bg-white-100 h-auto max-h-[180px] lg:h-[52px] flex flex-col lg:flex-row items-start lg:items-center justify:start lg:justify-center ${item?.isCashAdvanceTaken ?'border-b-[1px]  border-b-gray' :""} m-2`}>    
    <div className='flex flex-auto flex-row w-full justify-between gap-2'>
    <div className='flex flex-1 flex-col lg:flex-row gap-0 md:gap-2'>


  
   <div className="flex h-[52px] items-center justify-start w-auto lg:w-fit py-0 md:py-3 px-2 order-1">
   
   <div >
   <p className='font-cabin font-normal  text-xs text-neutral-400'>Travel Request No.</p>
    <p className='lg:text-[14px] text-[16px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '> {item?.travelRequestNumber}</p>
   </div>
 </div> 
    
     <div className="flex h-[52px] items-center justify-start w-auto lg:w-[221px] py-0 md:py-3 px-2 order-1">
      <div>
        <p className='font-cabin font-normal text-xs text-neutral-400'>Trip Purpose</p>
        <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate  capitalize'> {item?.tripPurpose ??""}</p>
      </div>
    </div> 

   
    </div>

  
    
  

 <div className='flex flex-col-reverse justify-between lg:items-center items-end flex-1 lg:flex-row gap-2 '>
 
 <div className="flex flex-1 h-[52px] px-2 py-3 items-center justify-center  w-auto">
  
  <div className={`flex capitalize items-center px-3  pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] ${
     getStatusClass(item?.travelRequestStatus)
    }`}
  >
    {(item?.travelRequestStatus)}
  </div>
</div>
 <div className="flex flex-1  h-[52px] px-2 py-3 items-center justify-center  w-[146px]">
  
 
  {item?.travelRequestStatus=='pending approval' &&
   <div onClick={()=>handleVisible(item.travelRequestId,"","","travel-approval")} className="flex-1 flex items-center justify-end py-2 px-3 cursor-pointer">
   <b className="text-purple-500 text-[14px] tracking-[0.02em] w-[98px] font-bold">
     View Details
   </b>
 </div>
 }
 

</div>

   
 </div>
    
   
</div>
  </div>
  </div>
  <div className='h-auto'>
  {item?.cashAdvance && item?.cashAdvance?.map((item,index)=>(
    <>
    <div key={index} className='flex flex-row items-center ml-0   lg:ml-32  sm:ml-28 gap-2 text-gray-200'>
  <div className='w-auto  mi min-w-[20px] flex justify-center items-center px-3 py-3 '>
  <img className='w-6 h-[20px] translate-y-[-2px]' src={down_left_arrow}/>
      
      
  </div>
    <div className="flex h-[52px] items-center justify-start w-auto lg:w-[221px] py-0 md:py-3 px-2 ">
      <div>
        <p className='font-cabin font-normal text-xs text-neutral-400'>Cash-Advance No.</p>
        <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate'>{item?.cashAdvanceNumber}</p>
      </div>
  </div> 
 
  <div className='flex w-auto sm:w-[170px] min-w-[120px] justify-center items-center px-0 sm:py-2 sm:px-3 font-cabin gap-2'>
  
<div className='flex w-auto sm:w-[170px]  min-w-[120px] justify-start items-center px-0 sm:py-2 sm:px-3 font-cabin gap-2'>
  <div className=' '>
  <p className='font-cabin font-normal text-xs  text-neutral-400'>Amount Details</p>
    
      {item?.amountDetails?.map((currencyItem,index)=>(
      <React.Fragment key={index}>
        <div className=' flex flex-row gap-4 text-[14px] text-neutral-800 font-medium capitalize'>
      <div className=' flex flex-row gap-2 '>{currencyItem.type}
        <p>{currencyItem.currency.shortName}</p>
        <p> {currencyItem?.amount},</p>
      </div>
        <p className=' translate-y-[-1px] min-w-full '> {currencyItem?.mode ??' -'}</p>
      </div>
      </React.Fragment>
    ))}
  </div>
</div>
</div>


 
  {item.travelRequestStatus !=='pending approval' && item.cashAdvanceStatus=='pending approval' &&
   <div onClick={()=>handleVisible(item.travelRequestId,"", "approval-view-tr-expense")} className="flex-1 flex items-center justify-end py-2 px-3 cursor-pointer">
   <b className="text-purple-500 text-[14px] tracking-[0.02em] w-[98px] font-bold">
     View Details
   </b>
 </div>

 
 
 }
  </div>
    </>
  ))}
  </div>
      </div>
      </div>
              </React.Fragment>
            ))}
           </div>
           </>} */}


           {/* {activeScreen=== 'Travel Expenses' && 
           <>
    <div className="w-auto h-6 flex flex-row gap-3 ml-8 mt-7 items-center">
      <img className="w-6 h-6" src={receipt} alt="receipt" />
      <div className="text-base tracking-[0.02em] font-bold w-auto">Travel Expense Reports</div>
    </div>
    <div className='flex flex-col lg:flex-row  w-[220px] lg:w-[500px]  gap-4 mt-[25px] mx-11'>
   
    
  
</div>
    <div className="box-border mx-4 mt-[46px]    border-b  border-slate-300"/>
   
           </>
           
           } */}




{/* {activeScreen === 'Travel Expenses' && 
         <div className='border h-[80%] w-full scroll-mx-5 flex justify-center items-center overflow-auto   my-6'>

          <ApprovalTravelExpense expenseApprovalData={expApprovalData && expApprovalData} handleVisible={handleVisible}/>

         </div>
         } */}


         
        </div>
      {/* </div> */}
    </>
  );
};

export default Approval;



// import React, { useState,useEffect } from 'react';

// import { useData } from '../api/DataProvider';
// import { getStatusClass ,titleCase, urlRedirection} from '../utils/handyFunctions';
// import { receipt, chevron_down, calender, double_arrow , three_dot ,validation_sym, down_left_arrow, airplane_1} from '../assets/icon';
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
//    const [ trApprovalData,setTrApprovalData]= useState([])
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
//                     Travel & CashAdvance
//                   </div>
//                 </div>
                 
//                 {/* </div> */}
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
//               {/* </div> */}
//             {/* </div> */}
//           </div>

       
//           <div className="w-full   bg-white-100  rounded-lg  border-[1px] border-indigo-500 shrink-0 font-cabin mt-3 sm:mt-6 ">
// {activeScreen === 'Travel & Cash Adv. Requests' && 
//            <>

//   <div className="w-full   h-6 flex flex-row gap-3 mt-7 items-center sm:px-8 px-4">
//     <img className="w-6 h-5" src={airplane_1} alt="travel" />
//     <div className="text-base tracking-[0.02em] font-bold">Travel Requests & Cash Advances</div>
//   </div>




                     
//          <div className="box-border  mt-[46px] w-full  h-px border-t-[1px]   border-slate-300 "/>
//            {/* //data div */}
//          <div className='min-h-[400px] h-full overflow-auto mt-6 w-auto flex flex-col items-center   '>
        
//             {trApprovalData && filterTravelApprovalData?.map((item ,index)=>(
//               <React.Fragment key={index}>
//             <div key={index} className="box w-full max-w-[896px]  h-auto  mx-2 sm:mx-4 mb-2  font-cabin">
//             <div className="w-full   h-auto  lg:min-h-[56px] rounded-xl border-[1px] border-b-gray hover:border-indigo-600 ">
//             <div className='w-full max-w-[932px]  rounded-md'>
//     <div className={`w-auto max-w-[900px] bg-white-100 h-auto max-h-[180px] lg:h-[52px] flex flex-col lg:flex-row items-start lg:items-center justify:start lg:justify-center ${item?.isCashAdvanceTaken ?'border-b-[1px]  border-b-gray' :""} m-2`}>    
//     <div className='flex flex-auto flex-row w-full justify-between gap-2'>
//     <div className='flex flex-1 flex-col lg:flex-row gap-0 md:gap-2'>


//     {/* <div className="flex h-[52px] items-center justify-start w-auto lg:w-fit py-0 md:py-3 px-2 order-1">
//       <div className=" lg:text-[14px] text-[16px] text-left font-semibold tracking-[0.03em] leading-normal text-gray-300 font-cabin lg:truncate ">
   
       
//        {item.travelRequestNumber}
//       </div>
//     </div>  */}
//    <div className="flex h-[52px] items-center justify-start w-auto lg:w-fit py-0 md:py-3 px-2 order-1">
   
//    <div >
//    <p className='font-cabin font-normal  text-xs text-neutral-400'>Travel Request No.</p>
//     <p className='lg:text-[14px] text-[16px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '> {item?.travelRequestNumber}</p>
//    </div>
//  </div> 
//     {/* Trip Title */}

//     {/* <div className="flex h-[52px] items-center justify-start xl:w-[320px]  lg:w-auto   py-0 md:py-3 px-2 order-1">
//       <div className="lg:text-[14px] text-[16px] text-left font-medium tracking-[0.03em] leading-normal text-neutral-800 font-cabin w-auto">
      
//        {titleCase(item?.tripPurpose ??"")}
//       </div>
//     </div>  */}
//      <div className="flex h-[52px] items-center justify-start w-auto lg:w-[221px] py-0 md:py-3 px-2 order-1">
//       <div>
//         <p className='font-cabin font-normal text-xs text-neutral-400'>Trip Purpose</p>
//         <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate  capitalize'> {item?.tripPurpose ??""}</p>
//       </div>
//     </div> 

//     {/* Date */}
//     {/* <div className="flex   h-[52px] w-auto  items-center justify-start py-3 gap-1  lg:px-0 order-3 lg:order-2">
//       <div className=' pl-2 md:pl-0'>
//       <img src={calender} alt="calendar" className="w-[16px]"/>
//       </div>
//       <div className=" tracking-[0.03em] leading-normal text-neutral-800 text-[12px] lg:w-[221px] w-auto ">
//         {item.departureDate} to {item.returnDate}
//       </div>
//     </div> */}
// {/* Origin and Destination */}
//     {/* <div className="flex w-auto flex-col justify-center items-start lg:items-center min-w-[161px] h-auto lg:h-[52px] py-3 px-3 order-2 lg:order-3">
//       <div className="flex  text-xs text-neutral-800 font-medium">
//         <div>{item.to}</div>
//         <img src={double_arrow} alt="double arrow" />
//         <div>{item.from}</div>
//       </div>
//     </div> */}
//     </div>

//     {/* <div className='flex flex-col-reverse justify-between lg:flex-row'> */}
    
  

//  <div className='flex flex-col-reverse justify-between lg:items-center items-end flex-1 lg:flex-row gap-2 '>
//  {/* Status */}
//  <div className="flex flex-1 h-[52px] px-2 py-3 items-center justify-center  w-auto">
  
//   <div className={`flex capitalize items-center px-3  pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] ${
//      getStatusClass(item?.travelRequestStatus)
//     }`}
//   >
//     {(item?.travelRequestStatus)}
//   </div>
// </div>
//  <div className="flex flex-1  h-[52px] px-2 py-3 items-center justify-center  w-[146px]">
  
//   {/* <div className={`flex items-center px-3 pt-[6px] pb-2 py-3 text-purple-500 font-cabin leading-normal text-[14px] font-bold tracking-[0.03em] `}
//   >
//     View Details
    
//   </div> */}
//   {item?.travelRequestStatus=='pending approval' &&
//    <div onClick={()=>handleVisible(item.travelRequestId,"","","travel-approval")} className="flex-1 flex items-center justify-end py-2 px-3 cursor-pointer">
//    <b className="text-purple-500 text-[14px] tracking-[0.02em] w-[98px] font-bold">
//      View Details
//    </b>
//  </div>
// //    <div onClick={()=>handleApproval(tenantId,empId,item.travelRequestId,"","travel-approval")} className="flex-1 flex items-center justify-end py-2 px-3 cursor-pointer">
// //    <b className="text-purple-500 text-[14px] tracking-[0.02em] w-[98px] font-bold">
// //      View Details
     
// //    </b>
// //  </div>
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
//   {/* <div className=' flex justify-center items-center w-auto min-w-[130px] h-[44px] px-3 py-2 sr-only  sm:not-sr-only'>
//     <div className=' tracking-[0.03em] leading-normal text-[14px] text-center'>
//       {item.date}
//     </div>
//   </div>  */}
//   <div className='flex w-auto sm:w-[170px] min-w-[120px] justify-center items-center px-0 sm:py-2 sm:px-3 font-cabin gap-2'>
//     {/* <div className='w-5 h-5'>
//     {item.violation.length>0 ?(
//     <img src={validation_sym} alt='three dot' className='w-[20px] h-[20px] ' />
//     ) :""}
//     </div> */}
// <div className='flex w-auto sm:w-[170px]  min-w-[120px] justify-start items-center px-0 sm:py-2 sm:px-3 font-cabin gap-2'>
//   <div className=' '>
//   <p className='font-cabin font-normal text-xs   text-neutral-400'>Amount Details</p>
    
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


//   {/* <div className='w-[100px] py-2 px-3 flex justify-center items-center sr-only  sm:not-sr-only'>
//     <div className={`w-auto max-w-[200px] min-w-[135px] text-center font-medium text-sm text-gray-300 `}>
//       {titleCase(item?.status ??"")}
     
//     </div>
//   </div> */}
//   {item.travelRequestStatus !=='pending approval' && item.cashAdvanceStatus=='pending approval' &&
//    <div onClick={()=>handleVisible(item.travelRequestId,"", "approval-view-tr-expense")} className="flex-1 flex items-center justify-end py-2 px-3 cursor-pointer">
//    <b className="text-purple-500 text-[14px] tracking-[0.02em] w-[98px] font-bold">
//      View Details
//    </b>
//  </div>

// //    <div onClick={()=>handleApproval(item.travelRequestId,"", (item.isCashAdvanceTaken ? "approval-view-tr-ca" :"approval-view-tr"))} className="flex-1 flex items-center justify-end py-2 px-3 cursor-pointer">
// //    <b className="text-purple-500 text-[14px] tracking-[0.02em] w-[98px] font-bold">
// //      View Details
     
// //    </b>
// //  </div>
 
 
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
//            </>}
//            {activeScreen=== 'Travel Expenses' && 
//            <>
//     <div className="w-auto h-6 flex flex-row gap-3 ml-8 mt-7 items-center">
//       <img className="w-6 h-6" src={receipt} alt="receipt" />
//       <div className="text-base tracking-[0.02em] font-bold w-auto">Travel Expense Reports</div>
//     </div>
//     <div className='flex flex-col lg:flex-row  w-[220px] lg:w-[500px]  gap-4 mt-[25px] mx-11'>
   
    
  
// </div>
//     <div className="box-border mx-4 mt-[46px]    border-b  border-slate-300"/>
   
//            </>
           
//            }




// {activeScreen === 'Travel Expenses' && 
//          <div className='border h-[80%] w-full scroll-mx-5 flex justify-center items-center overflow-auto   my-6'>

//           <ApprovalTravelExpense expenseApprovalData={expApprovalData && expApprovalData} handleVisible={handleVisible}/>

//          </div>
//          }


//           </div>
//         </div>
//       {/* </div> */}
//     </>
//   );
// };

// export default Approval;