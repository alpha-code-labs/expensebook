// import React, { useEffect, useState ,useRef} from 'react';
// import { useData } from '../api/DataProvider';
// import { getStatusClass ,titleCase,getCashAdvanceButtonText, urlRedirection, filterTravelRequests} from '../utils/handyFunctions';
// import { cancel, modify,receipt, chevron_down, calender_icon, double_arrow , three_dot ,validation_sym, down_left_arrow, airplane, airplane_1} from '../assets/icon';
// import RejectedTravel from '../components/travel/RejectedTravel';
// // import CashAdvance from '../components/settlement/CashAdvance';
// import { handleCashAdvance } from '../utils/actionHandler';
// import { cashAdvanceRoutes, travelRoutes } from '../utils/route';
// import Error from '../components/common/Error';
// import { useParams } from 'react-router-dom';
// import TravelMS from './TravelMS';
// import IconOption from '../components/common/IconOption';

// const travelBaseUrl  = import.meta.env.VITE_TRAVEL_PAGE_URL;
// const cashBaseUrl = import.meta.env.VITE_CASHADVANCE_PAGE_URL;

// const Travel = ({fetchData,isLoading,setIsLoading}) => {  
//   const [visible, setVisible]=useState(false);
//   const [iframeURL, setIframeURL] = useState(false);

//   const handleVisible= ()=>{
//     setVisible(!visible);
//     setIframeURL(`${travelBaseUrl}/create/${tenantId}/${empId}`);
//   }
//   useEffect(() => {
//     const handleMessage = event => {
//       console.log(event)
//       // Check if the message is coming from the iframe
//       if (event.origin === travelBaseUrl || cashBaseUrl) {
//         // Check the message content or identifier
//         if (event.data === 'closeIframe') {
//           setVisible(false)
//         }else if(event.data.split(' ')[0] == 'raiseAdvance'){
//           //we have to open an Iframe to raise cash advance
//           setVisible(false)
          
//           const tenantId = event.data.split(' ')[1];
//           const travelRequestId = event.data.split(' ')[2];
//           console.log(event.data, ' event data ', travelRequestId, ' trId ', tenantId, ' tenant Id');
//           setIframeURL(`${cashBaseUrl}/create/advance/${travelRequestId}`);
//           setVisible(true);
//         }
//       }
//     };
//     // Listen for messages from the iframe
//     window.addEventListener('message', handleMessage);
  
//     return () => {
//       // Clean up event listener
//       window.removeEventListener('message', handleMessage);
//     };
//   }, []);

//   // const tenantId = localStorage.getItem('tenantId');
//   // const empId = localStorage.getItem('empId');

//   const {tenantId,empId,page}= useParams();
//   useEffect(()=>{

//     fetchData(tenantId,empId,page)

//   },[])
//   console.log('url-cash',iframeURL)
 

//   const { employeeData } = useData();
//   const [travelData,setTravelData]=useState(null);
//   const [loadingErrMsg, setLoadingErrMsg] = useState(null);
// ///this is for backend data when we will get
//   useEffect(()=>{
//     const data = employeeData && employeeData?.dashboardViews?.employee

//     setTravelData(data)

//   },[employeeData])

//   console.log('employee data form travel',travelData)
 



  
//   const [dropdownStates, setDropdownStates] = useState({});

//   const handleDropdownToggle = (index) => {
//     setDropdownStates((prevStates) => ({
//       ...prevStates,
//       [index]: !prevStates[index],
//     }));
//   };
//   const modalRef = useRef(null)

  
//     const handleOutsideClick = (e) => {
//       e.preventDefault()
//       if (!modalRef.current.contains(e.target)) {
//           // if (skipable) {
//             setDropdownStates(false);
//           //}
//       }
//   };
  

//   const [activeScreen, setActiveScreen] = useState('All Travel Requests');
//   const handleScreenChange = (screen) => {
//     setActiveScreen(screen);
//   };
   

//   const handleTravelCreation = (tenantId, empId) => {
//     const createUrl = travelRoutes.create.getUrl(tenantId, empId);
//     urlRedirection(createUrl);
//   };



//   ///modify travel request route handle
//   const handleModifyTravel=(tenantId,empId,travelRequestId,isCashAdvanceTaken)=>{
//     if(isCashAdvanceTaken){
//       const modifyUrl= cashAdvanceRoutes.modify_tr_with_ca.getUrl(tenantId,empId,travelRequestId)
//       urlRedirection(modifyUrl)
//     }else{
//       const modifyUrl= travelRoutes.modify.modify_tr_standalone.getUrl(tenantId,empId,travelRequestId)
//       urlRedirection(modifyUrl)
//     }
//   }

//   ///cancel travel request route handle
//   const handleCancelTravel=(tenantId,empId,travelRequestId,isCashAdvanceTaken)=>{
//     if(isCashAdvanceTaken){
//       const cancelUrl= cashAdvanceRoutes.cancel_tr_with_ca.getUrl(tenantId,empId,travelRequestId)
//       urlRedirection(cancelUrl)
//     }else{
//       const cancelUrl= travelRoutes.cancel.cancel_tr_standalone.getUrl(tenantId,empId,travelRequestId)
//       urlRedirection(cancelUrl)
//     }
//   }



// let filteredData


// if(travelData){
//   let filteredTravelRequests = filterTravelRequests(travelData?.travelRequests);
//   filteredData=filteredTravelRequests
//   console.log('filter travel requests',filteredTravelRequests);
// }

// //disable by status
// function disableButton(status){
//   return ['draft','cancelled'].includes(status);
// }

//   return (
//     <>
//  {isLoading && <Error message={loadingErrMsg}/>}
//  {!isLoading &&
 
// //  lg:ml-[292px]

//       <div   className="px-10 relative w-auto h-dvh   flex flex-col items-center  pt-[50px] bg-slate-100">
//     <TravelMS visible={visible} setVisible={setVisible} src={iframeURL}/>

//  <div onClick={handleOutsideClick}  className="flex flex-row items-center justify-center gap-2 sm:gap-4 font-cabin mb-2 ">
//           <div className='relative'>
//           {filteredData && filteredData.length > 0 &&  <div className='absolute right-[-1px] top-[-8px] w-fit p-[6px] bg-green-200 border border-white-100 rounded-full '/>}
//           <div
//             className={` cursor-pointer py-1 px-2 w-auto  min-w-[100px] rounded-xl truncate${
//             activeScreen === 'All Travel Requests' ? 'font-medium rounded-xl bg-purple-500 text-xs text-gray-900 w-auto min-w-[100px] truncate' : 'rounded-xl bg-white-100'
//                     }`}
//             onClick={() => handleScreenChange('All Travel Requests')}
//                   >
//                     All Travel Requests
//                   </div>
//          </div>
//          <div className='relative'>
//         { travelData?.rejectedTravelRequests.length > 0 && 
//          <div className=' absolute right-[-1px] top-[-8px] w-fit p-[6px] bg-green-200 border border-white-100 rounded-full '/> }
//          <div
//                     className={`cursor-pointer py-1 px-2 w-auto min-w-[100px] rounded-xl  truncate${
//                       activeScreen === 'Rejected Travel Requests' ? 'font-medium rounded-xl bg-purple-500 text-xs text-gray-900 w-auto min-w-[100px] truncate' : 'rounded-xl bg-white-100'
//                     }`}
//                     onClick={() => handleScreenChange('Rejected Travel Requests')}
//                   >
//                     Rejected Travel Requests
//           </div>
//           </div>               
//   </div>
 

//           <div className="w-full  bg-white-100 h-[80%] rounded-lg  border-[1px] border-indigo-500 shrink-0 font-cabin mt-3 sm:mt-6 ">
// {activeScreen=== 'All Travel Requests' && 
//   <>
//   <div className='flex flex-row justify-between items-end px-8'>
//     <div className="w-full lg:w-[200px] h-6 flex flex-row gap-3 mt-7 items-center">
//       <img className="w-6 h-5" src={airplane_1} alt="receipt" />
//       <div className="text-base tracking-[0.02em] font-bold truncate">All Travel Requests</div>
//     </div>
//     <div className='lg:ml-4 mt-4 lg:mt-0'>
//       <div className='inline-flex h-8 w-auto items-center justify-center bg-indigo-600 text-white-100 rounded-lg cursor-pointer'>
//         <div className='text-center p-4 font-medium text-xs truncate' onClick={handleVisible}>Create Travel Request</div>
//       </div>
//     </div>
//   </div>

//   <div className="box-border mx-4 mt-[46px] w-auto border-[1px] border-b-gray" />
//   <div className='overflow-y-auto  h-[80%] mt-6  flex flex-col items-center px-10'>
//     {/* <div className="w-dvh"> */}
//       {filteredData && filteredData?.map((travelDetails, index) => (
//         <React.Fragment key={index}>
//           <div className="w-[100%] h-auto mx-2 sm:mx-4 mb-2">
//             <div className="min-h-[56px] rounded-xl border-b-gray hover:border-indigo-600 border-[1px] shadow-md">
//               <div className=' rounded-md'>
//                 <div className={`w-full lg:w-auto   h-auto max-h-[180px] lg:h-[52px] flex flex-col lg:flex-row items-start ${travelDetails.isCashAdvanceTaken && 'border-b-[1px] border-b-gray'} m-2 lg:items-center`}>
//                   <div className='flex flex-auto flex-row w-full justify-between gap-2'>
//                     <div className='flex flex-1  gap-2'>
//                       <div className=" flex h-[52px] items-center justify-start w-auto py-3 px-2">
//                         <div>
//                           <p className='font-normal text-xs text-neutral-400'>Travel Request No.</p>
//                           <p className='lg:text-[14px] text-[16px] text-left font-medium tracking-[0.03em] text-neutral-800 truncate'>{travelDetails?.travelRequestNumber}</p>
//                         </div>
//                       </div>
//                       <div className=" flex h-[52px] items-center justify-start w-[221px] py-3 px-2">
//                         <div>
//                           <p className='font-normal text-xs text-neutral-400'>Trip Purpose</p>
//                           <p className='lg:text-[14px] text-[16px] text-left font-medium tracking-[0.03em] text-neutral-800 truncate'>{travelDetails?.tripPurpose}</p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className=" flex min-w-[200px] h-[52px] px-2 py-3 items-center justify-center w-auto">
//                       <div className={`flex items-center px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] ${getStatusClass(travelDetails.travelRequestStatus)}`}>
//                         {titleCase(travelDetails.travelRequestStatus)}
//                       </div>
//                     </div>
//                     <div className=" flex h-[52px] px-2 py-3 items-center justify-center w-fit ">
//                       <div onClick={() => { if (!disableButton) { handleCashAdvance(travelDetails.travelRequestId, "", 'ca-create') } }} className={`flex items-center px-3 pt-[6px] pb-2 py-3 text-purple-500 border-[1px] border-purple-500 rounded-[12px] text-[14px] font-medium tracking-[0.03em] truncate ${disableButton(travelDetails?.travelRequestStatus) ? 'cursor-not-allowed opacity-50' : ' cursor-pointer'}`}>
//                         {getCashAdvanceButtonText(travelDetails.departureDate)}
//                       </div>
//                     </div>
//                     <div className=''>
//                       <IconOption
//                         buttonText={
//                           <div className='inline-flex justify-center items-center gap-2 px-2 py-2'>
//                             <img src={three_dot} className='w-4 h-4 rotate-180' />
//                           </div>
//                         }
//                       >
//                         <ul className="z-10 text-sm text-neutral-700 dark:text-gray-200">
//                           {!['cancelled'].includes(travelDetails.travelRequestStatus) &&
//                             <li>
//                               <span onClick={() => (handleCancelTravel(tenantId, empId, travelDetails?.travelRequestId, travelDetails.isCashAdvanceTaken))} className="block px-4 py-2 hover:bg-indigo-50 rounded-md">
//                                 Cancel
//                               </span>
//                             </li>}
//                           <li>
//                             <span onClick={() => (handleModifyTravel(tenantId, empId, travelDetails.travelRequestId, travelDetails.isCashAdvanceTaken))} className="block px-4 py-2 hover:bg-indigo-50 rounded-md">
//                               Modify
//                             </span>
//                           </li>
//                         </ul>
//                       </IconOption>
//                     </div>
//                   </div>
//                 </div>
//               </div>
            
//               {travelDetails?.isCashAdvanceTaken && travelDetails?.cashAdvances?.map((caDetails, index) => (
//               <React.Fragment key={index}>
//                 <div className='flex flex-row items-center ml-0 lg:ml-32 sm:ml-28 gap-2 text-gray-200'>
//                   <div className='w-auto min-w-[20px] flex justify-center items-center px-3 py-3'>
//                     <img className='w-6 h-[20px] translate-y-[-2px]' src={down_left_arrow} />
//                   </div>
//                   <div className="flex h-[52px] items-center justify-start w-[221px] py-0 md:py-3 px-2">
//                     <div>
//                       <p className='font-normal text-xs text-neutral-400'>Cash-Advance No.</p>
//                       <p className='lg:text-[14px] text-[16px] text-left font-medium tracking-[0.03em] text-neutral-800 truncate'>{caDetails.cashAdvanceNumber}</p>
//                     </div>
//                   </div>
//                   <div className='w-[100px] py-2 px-3 flex justify-center items-center gap-4'>
//                     <div onClick={() => { if (!disableButton(travelDetails?.travelRequestStatus)) { handleCashAdvance(travelDetails.travelRequestId, caDetails.cashAdvanceId, 'ca-cancel') } }} className={`flex rounded-full items-center justify-center w-6 h-6 bg-[#FFC2C6] ${disableButton(travelDetails?.travelRequestStatus) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
//                       <img src={cancel} alt='cancel' width={20} height={20} />
//                     </div>
//                     <div onClick={() => { if (!disableButton(travelDetails?.travelRequestStatus)) { handleCashAdvance(travelDetails.travelRequestId, caDetails.cashAdvanceId, 'ca-modify') } }} className={`flex items-center justify-center w-6 h-6 bg-purple-50 rounded-full ${disableButton(travelDetails?.travelRequestStatus) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
//                       <img src={modify} alt='modify' width={12} height={12} />
//                     </div>
//                   </div>
//                 </div>
//               </React.Fragment>
//             ))}
//             </div>
           
//           </div>
//         </React.Fragment>
//       ))}
//     {/* </div> */}
//   </div>
// </>
// }
//            {activeScreen=== 'Rejected Travel Requests' && 
//            <>
//            <div className="w-auto h-6 flex flex-row gap-3 ml-8 mt-7 items-center">
//       <img className="w-6 h-5" src={airplane_1} alt="receipt" />
//       <div className="text-base tracking-[0.02em] font-bold w-auto">Rejected Travel Requests</div>
//     </div>
//     <div className="box-border mx-4 mt-[46px] w-auto max-w-[932px]  h-px border-t-[1px] border-b-gray "/>
//     <div className='h-[420px] overflow-auto mt-6 w-auto'>
//            {travelData?.rejectedTravelRequests?.map((travelDetails, index)=>
//            (<RejectedTravel key={index} {...travelDetails} />))}
//            </div>
//            </>
//            }



//            {/* {activeScreen === 'Rejected Travel Requests' && 
//            tripArray.map((travelDetails, index)=>
//          (<RejectedTravel key={index} {...travelDetails}/>))
        
//          } */}


//           </div>
//           </div> 
          
//         }
       
//       {/* </div> */}
//     </>
//   );
// };

// export default Travel;


// import React, { useEffect, useState ,useRef} from 'react';
// import { useData } from '../api/DataProvider';
// import { getStatusClass ,titleCase,getCashAdvanceButtonText, urlRedirection, filterTravelRequests} from '../utils/handyFunctions';
// import { cancel, modify,receipt, chevron_down, calender_icon, double_arrow , three_dot ,validation_sym, down_left_arrow, airplane, airplane_1, plus_icon} from '../assets/icon';

// // import CashAdvance from '../components/settlement/CashAdvance';
// import { handleCashAdvance } from '../utils/actionHandler';
// import { cashAdvanceRoutes, travelRoutes } from '../utils/route';
// import Error from '../components/common/Error';
// import { useParams } from 'react-router-dom';
// import TravelMS from '../microservice/TravelMS';
// import IconOption from '../components/common/IconOption';

// const travelBaseUrl  = import.meta.env.VITE_TRAVEL_PAGE_URL;
// const cashBaseUrl = import.meta.env.VITE_CASHADVANCE_PAGE_URL;

// const Travel = ({fetchData,isLoading,setIsLoading}) => {  

//   const [visible, setVisible]=useState(false)
//   const [iframeURL, setIframeURL] = useState(null); 

//   const handleVisible= ()=>{
//     setVisible(!visible);
//     setIframeURL(`${travelBaseUrl}/create/${tenantId}/${empId}`);
//   }

  
//   useEffect(() => {
//     const handleMessage = event => {
//       console.log(event)
//       // Check if the message is coming from the iframe
//       if (event.origin === travelBaseUrl || event.origin === cashBaseUrl) {
//         // Check the message content or identifier
//         if (event.data === 'closeIframe') {
//           setVisible(false)
//         }
//          // Check the message content or identifier
//          if (event.data === 'closeIframe') {
//           setVisible(false)
//           window.location.href = window.location.href;
//         }else if(event.data.split(' ')[0] == 'raiseAdvance'){
//           //we have to open an Iframe to raise cash advance
//           setVisible(false)
          
//           const tenantId = event.data.split(' ')[1];
//           const travelRequestId = event.data.split(' ')[2];
//           console.log(event.data, ' event data ', travelRequestId, ' trId ', tenantId, ' tenant Id');
//           setIframeURL(`${cashBaseUrl}/create/advance/${travelRequestId}`);
//           setVisible(true);
//         }
//       }
//     };
//     // Listen for messages from the iframe
//     window.addEventListener('message', handleMessage);
  
//     return () => {
//       // Clean up event listener
//       window.removeEventListener('message', handleMessage);
//     };
//   }, []);

 

//   const {tenantId,empId,page}= useParams();
//   useEffect(()=>{

//     fetchData(tenantId,empId,page)

//   },[]) 

//   const { employeeData } = useData();
//   const [travelData,setTravelData]=useState(null);
//   const [loadingErrMsg, setLoadingErrMsg] = useState(null);
// ///this is for backend data when we will get
//   useEffect(()=>{
//     const data = employeeData && employeeData?.dashboardViews?.employee

//     setTravelData(data)

//   },[employeeData])

//   console.log('employee data form travel',travelData)
 
//   const [dropdownStates, setDropdownStates] = useState({});

//   const handleDropdownToggle = (index) => {
//     setDropdownStates((prevStates) => ({
//       ...prevStates,
//       [index]: !prevStates[index],
//     }));
//   };

//   const modalRef = useRef(null)

  
//     const handleOutsideClick = (e) => {
//       e.preventDefault()
//       if (!modalRef.current.contains(e.target)) {
//           // if (skipable) {
//             setDropdownStates(false);
//           //}
//       }
//   };
  

//   const [activeScreen, setActiveScreen] = useState('All Travel Requests');

//   const handleScreenChange = (screen) => {
//     setActiveScreen(screen);
//   };
   
  
//   const handleTravelCreation = (tenantId, empId) => {
//     const createUrl = travelRoutes.create.getUrl(tenantId, empId);
//     urlRedirection(createUrl);
//   };
  
  
  
//   ///modify travel request route handle
//   const handleModifyTravel=(tenantId,empId,travelRequestId,isCashAdvanceTaken)=>{
//     if(isCashAdvanceTaken){
//       const modifyUrl= cashAdvanceRoutes.modify_tr_with_ca.getUrl(tenantId,empId,travelRequestId)
//       urlRedirection(modifyUrl)
//     }else{
//       const modifyUrl= travelRoutes.modify.modify_tr_standalone.getUrl(tenantId,empId,travelRequestId)
//       urlRedirection(modifyUrl)
//     }
//   }
  
//   ///cancel travel request route handle
//   const handleCancelTravel=(tenantId,empId,travelRequestId,isCashAdvanceTaken)=>{
//     if(isCashAdvanceTaken){
//       const cancelUrl= cashAdvanceRoutes.cancel_tr_with_ca.getUrl(tenantId,empId,travelRequestId)
//       urlRedirection(cancelUrl)
//     }else{
//       const cancelUrl= travelRoutes.cancel.cancel_tr_standalone.getUrl(tenantId,empId,travelRequestId)
//       urlRedirection(cancelUrl)
//     }
//   }
  
  
   
// let filteredData
   
  
//   if(travelData){
//     let filteredTravelRequests = filterTravelRequests(travelData?.travelRequests);
//     filteredData=filteredTravelRequests
//     console.log('filter travel requests',filteredTravelRequests);
//   }

//   //disable by status
//   function disableButton(status){
//     return ['draft','cancelled'].includes(status);
//   }

//   return (
//     <>
//  {isLoading && <Error message={loadingErrMsg}/>}
//  {!isLoading &&
 
// //  lg:ml-[292px]

//       <div   className="w-auto min-h-screen  flex flex-col items-center px-2 lg:px-10 xl:px-20  pt-[50px] bg-slate-100">
//   <TravelMS visible={visible} setVisible={setVisible} src={iframeURL}/>

//  <div onClick={handleOutsideClick}  className="flex flex-row items-center justify-center gap-2 sm:gap-4 font-cabin mb-2 ">
//           <div className='relative'>
//           {filteredData && filteredData.length > 0 &&  <div className='absolute right-[-1px] top-[-8px] w-fit p-[6px] bg-green-200 border border-white-100 rounded-full '/>}
//           <div
//             className={` cursor-pointer py-1 px-2 w-auto  min-w-[100px] rounded-xl truncate${
//             activeScreen === 'All Travel Requests' ? 'font-medium rounded-xl bg-purple-500 text-xs text-gray-900 w-auto min-w-[100px] truncate' : 'rounded-xl bg-white-100'
//                     }`}
//             onClick={() => handleScreenChange('All Travel Requests')}
//                   >
//                     All Travel Requests
//                   </div>
//          </div>
//          <div className='relative'>
//         { travelData?.rejectedTravelRequests?.length > 0 && 
//          <div className=' absolute right-[-1px] top-[-8px] w-fit p-[6px] bg-green-200 border border-white-100 rounded-full '/> }
//          <div
//                     className={`cursor-pointer py-1 px-2 w-auto min-w-[100px] rounded-xl  truncate${
//                       activeScreen === 'Rejected Travel Requests' ? 'font-medium rounded-xl bg-purple-500 text-xs text-gray-900 w-auto min-w-[100px] truncate' : 'rounded-xl bg-white-100'
//                     }`}
//                     onClick={() => handleScreenChange('Rejected Travel Requests')}
//                   >
//                     Rejected Travel Requests
//           </div>
//           </div>               
//   </div>
//  <div className="w-full  bg-white-100    h-auto lg:h-[581px]  rounded-lg border-[1px] border-slate-300 shrink-0 font-cabin mt-3 sm:mt-6 ">

// {activeScreen=== 'All Travel Requests' && 
// <>
//   <div className='flex flex-row justify-between items-end sm:px-8 px-4'>
//   <div className="w-full lg:w-[200px] h-6 flex flex-row gap-3 mt-7 items-center ">
//     <img className="w-6 h-5" src={airplane_1} alt="receipt" />
//     <div className="text-base tracking-[0.02em] font-bold truncate">All Travel Requests</div>
//   </div>

//   <div className='lg:ml-4 mt-4 lg:mt-0'>
//     <div className='inline-flex h-8 w-auto  items-center justify-center bg-indigo-600 text-white-100 flex-shrink rounded-lg cursor-pointer'>
//     <div className='text-center p-4 font-medium text-xs font-cabin truncate' onClick={handleVisible}>Create Travel Request</div>
//     {/* onClick={()=>(handleTravelCreation(tenantId,empId,))} */}
    
//   </div>
//   </div>
// </div>

//          <div className="box-border mx-4 mt-[46px] w-auto border-[1px] border-b-gray"/>
//          <div className='h-[400px] overflow-auto mt-6 w-auto flex flex-col items-center'>
//             {filteredData && filteredData?.map((travelDetails ,index)=>(
//               <React.Fragment key={index}>
//             <div className="box w-auto h-auto mb-2 font-cabin">
//             <div className={`w-auto min-w-[400px] lg:w-[896px] h-auto lg:min-h-[56px] rounded-xl border-b-gray hover:border-indigo-600  border-[1px]`}>
//             <div className='w-auto max-w-[932px] rounded-md'>
//     <div className={`w-auto max-w-[900px] h-auto max-h-[180px] lg:h-[52px] flex flex-col lg:flex-row items-start ${travelDetails.isCashAdvanceTaken && 'border-b-[1px]   border-b-gray '} m-2 lg:items-center justify:start lg:justify-center `}>    
//     <div className='flex flex-auto flex-row w-full justify-between gap-2'>
//     <div className='flex flex-1 flex-col lg:flex-row gap-0 md:gap-2'>
//     <div className="flex h-[52px] items-center justify-start w-auto lg:w-fit py-0 md:py-3 px-2 order-1">
   
//     <div>
//       <p className='font-cabin font-normal  text-xs text-neutral-400'>Travel Request No.</p>
//        <p className='lg:text-[14px] text-[16px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '>{travelDetails?.travelRequestNumber}</p>
//       </div>
//     </div> 
//     {/* Trip Title */}

//     <div className="flex h-[52px] items-center justify-start w-auto lg:w-[221px] py-0 md:py-3 px-2 order-1">
//       <div>
//         <p className='font-cabin font-normal text-xs text-neutral-400'>Trip Purpose</p>
//         <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '> {travelDetails?.tripPurpose}</p>
//       </div>
//     </div> 
    

//     {/* Date */}
//     {/* <div className="flex  h-[52px] w-auto min-w-[221px]  items-center justify-start py-3 gap-1  lg:px-0 order-3 lg:order-2">
//       <div className=' pl-2 md:pl-0'>
//       <img src={calender_icon} alt="calendar" className="w-[16px]"/>
//       </div>
//       <div className=" tracking-[0.03em] leading-normal text-neutral-800 text-[12px]">
      
//         {travelDetails.departureDate} to {travelDetails.returnDate}
//       </div>
//     </div> */}
// {/* Origin and Destination */}
//     {/* <div className="flex w-auto flex-col justify-center items-start lg:items-center min-w-[161px] h-auto lg:h-[52px] py-3 px-3 order-2 lg:order-3">
//       <div className="flex  text-xs text-neutral-800 font-medium">
//         <div>{travelDetails.to}</div>
//         <img src={double_arrow} alt="double arrow" />
//         <div>{travelDetails.from}</div>
//       </div>
//     </div> */}
//     </div>

//     {/* <div className='flex flex-col-reverse justify-between lg:flex-row'> */}
    
  

//  <div className='flex flex-col-reverse justify-between lg:items-center items-end flex-1 lg:flex-row gap-2 '>

//  <div className="flex min-w-[200px]  h-[52px] px-2 py-3 items-center justify-center  w-auto">
  
//   <div className={`flex items-center px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] ${
//      getStatusClass(travelDetails.travelRequestStatus)
//     }`}
//   >
//     {titleCase(travelDetails.travelRequestStatus)}
//   </div>

// </div>



//  {/* <div className="flex h-[52px] px-2 py-3 items-center justify-center  w-auto min-[100px]">
//   <div onClick={() => {if(!disableButton){handleCashAdvance( travelDetails.travelRequestId,"", 'ca-create')}}} className={`flex items-center px-3 pt-[6px] pb-2 py-3 text-purple-500 border-[1px] border-purple-500 rounded-[12px] text-[14px] font-medium tracking-[0.03em] cursor-pointer truncate ${disableButton(travelDetails?.travelRequestStatus)? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
//     {getCashAdvanceButtonText(travelDetails.departureDate)}
//   </div>
// </div> */}

// <div className="flex h-[52px] px-2 py-2 w-fit">
// <div onClick={() => { if (!disableButton(travelDetails.travelRequestStatus)) {handleCashAdvance(travelDetails.travelRequestId, "", 'ca-create') } }} className={`flex justify-center gap-1 items-center px-2 py-2  text-white-100 border-[1px] bg-purple-500 rounded-md text-[14px] font-medium tracking-[0.03em] truncate ${disableButton(travelDetails?.travelRequestStatus) ? 'cursor-not-allowed opacity-50' : ' cursor-pointer'}`}>
//       <img src={plus_icon} className='w-4 h-4'/>
//       <p>{getCashAdvanceButtonText(travelDetails.departureDate)}</p>
// </div>
// </div>
   
//      <IconOption
//         buttonText={
//           <div className='inline-flex justify-center items-center gap-2  px-2 py-2'>
//           <img src={three_dot} className='w-4 h-4 rotate-180'/>
//           </div>
//         }
//       >
//           <ul className="z-10  text-sm text-neutral-700 dark:text-gray-200">
           
//            {!['cancelled'].includes(travelDetails.travelRequestStatus) &&
//            <li>
//            <span
//              onClick={()=>(handleCancelTravel(tenantId,empId,travelDetails?.travelRequestId,travelDetails.isCashAdvanceTaken))}
//              className="block px-4 py-2 hover:bg-indigo-50 rounded-md "
//            >
//              Cancel
//            </span>
//          </li> }
            
//             <li>
//               <span
//               onClick={()=>(handleModifyTravel(tenantId,empId,travelDetails.travelRequestId,travelDetails.isCashAdvanceTaken))}
//                 className="block px-4 py-2 hover:bg-indigo-50 rounded-md "  
//               >
//                 Modify
//               </span>
//             </li>
//           </ul>

//       </IconOption>
//  </div>

    
   
// </div>
//   </div>
//   </div>
//   <div className='h-auto'>
//   {travelDetails?.isCashAdvanceTaken && travelDetails?.cashAdvances?.map((caDetails,index)=>(
//     <React.Fragment key={index}> 
//     <div className='flex flex-row items-center ml-0   lg:ml-32  sm:ml-28 gap-2 text-gray-200'>
//   <div className='w-auto  mi min-w-[20px] flex justify-center items-center px-3 py-3'>
//     <img className='w-6 h-[20px] translate-y-[-2px]' src={down_left_arrow}/>
      
      
//   </div>
 
//   <div className="flex h-[52px] items-center justify-start w-auto lg:w-[221px] py-0 md:py-3 px-2 ">
//       <div>
//         <p className='font-cabin font-normal text-xs text-neutral-400'>Cash-Advance No.</p>
//         <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '> {caDetails.cashAdvanceNumber}</p>
//       </div>
//   </div>  
//   {/* <div className=' flex justify-center items-center w-auto min-w-[130px] h-[44px] px-3 py-2 sr-only  sm:not-sr-only'>
//     <div className=' tracking-[0.03em] leading-normal text-[14px] text-center'>
//       {caDetails.date}
//     </div>
//   </div>  */}
 

//   {/* <div className='w-[100px] py-2 px-3 flex justify-center items-center sr-only  sm:not-sr-only'>
//     <div className={`w-auto max-w-[200px] min-w-[135px] text-center font-medium text-sm text-gray-300 `}>
//       {titleCase(caDetails.status)}
//     </div>
//   </div> */}
//   <div className='w-[100px] py-2 px-3 flex justify-center items-center gap-4'>
   
//     <div  onClick={()=>{if(!disableButton(travelDetails?.travelRequestStatus)){handleCashAdvance(travelDetails.travelRequestId,caDetails.cashAdvanceId, 'ca-cancel');console.log(caDetails.cashAdvanceId)}}} className={`flex rounded-full items-center justify-center w-6 h-6 bg-[#FFC2C6] ${disableButton(travelDetails?.travelRequestStatus)? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`} >

//     <img src={cancel} alt='cancel' width={20} height={20} />
//     </div>
//   <div onClick={()=>{if(!disableButton(travelDetails?.travelRequestStatus)){handleCashAdvance(travelDetails.travelRequestId,caDetails.cashAdvanceId, 'ca-modify')}}} className={`flex items-center cursor-pointer justify-center w-6 h-6 bg-purple-50 rounded-full ${disableButton(travelDetails?.travelRequestStatus)? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
//     <img src={modify} alt='modify' width={12} height={12} />
//     </div>
//   </div>
//   </div>
//     </React.Fragment>
//   ))}
//   </div>
//       </div>
//       </div>
//               </React.Fragment>
//             ))}
//            </div>
//            </>}
//            {activeScreen=== 'Rejected Travel Requests' && 
//            <>
//            <div className="w-auto h-6 flex flex-row gap-3 ml-8 mt-7 items-center">
//       <img className="w-6 h-5" src={airplane_1} alt="receipt" />
//       <div className="text-base tracking-[0.02em] font-bold w-auto">Rejected Travel Requests</div>
//     </div>
//     <div className="box-border mx-4 mt-[46px] w-auto max-w-[932px]  h-px border-t-[1px] border-b-gray "/>
//     <div className='h-[420px] overflow-auto mt-6 w-auto'>
//            {travelData?.rejectedTravelRequests?.map((travelDetails, index)=>
//            (<RejectedTravel key={index} {...travelDetails} />))}
//            </div>
//            </>
//            }



//            {/* {activeScreen === 'Rejected Travel Requests' && 
//            tripArray.map((travelDetails, index)=>
//          (<RejectedTravel key={index} {...travelDetails}/>))
        
//          } */}


//           </div>
//           </div> 
          
//         }
       
//       {/* </div> */}
//     </>
//   );
// };

// export default Travel;



import React, { useEffect, useState } from 'react';
import { briefcase, modify, receipt, receipt_icon1, categoryIcons, filter_icon, plus_violet_icon, cancel, search_icon, info_icon, airplane_1, airplane_icon1 } from '../assets/icon';
import { extractTripNameStartDate, formatAmount, getStatusClass, sortTripsByDate, splitTripName } from '../utils/handyFunctions';
import { travelExpense, nonTravelExpense } from '../utils/dummyData';
import { handleNonTravelExpense, handleTravelExpense } from '../utils/actionHandler';
import Modal from '../components/common/Modal1';
import { useParams } from 'react-router-dom';
import { useData } from '../api/DataProvider';
import TripSearch from '../components/common/TripSearch';
import Button1 from '../components/common/Button1';
import Error from '../components/common/Error';
import SearchComponent from '../components/common/ExpenseSearch';
import Input from '../components/common/SearchInput';
import TripMS from '../microservice/TripMS';
import { TripName } from '../components/common/TinyComponent';


const Travel = ({isLoading ,fetchData,loadingErrMsg}) => {
const travelBaseUrl  = import.meta.env.VITE_TRAVEL_PAGE_URL;
const cashBaseUrl = import.meta.env.VITE_CASHADVANCE_PAGE_URL;
const tripBaseUrl = import.meta.env.VITE_TRIP_BASE_URL;

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
    if (employeeData) {
    const data = employeeData?.dashboardViews?.employee?.overview || [];
    const intransitTrips = data?.transitTrips || [];
    const upcomingTrips = data?.upcomingTrips || [];
    const completedTrips = employeeData?.dashboardViews?.employee?.expense?.completedTrips || [];
    const travelRequests = data?.allTravelRequests?.allTravelRequests || [];
    
    const travelRequestsAndTrips = [...intransitTrips, ...travelRequests,...completedTrips,...upcomingTrips];


   
    const tripDataCopy = travelRequestsAndTrips?.map((trip)=>({...trip, travelRequestStatus:getTripStatus(trip?.travelRequestStatus,trip?.tripStartDate)}))
   
    setTripData(tripDataCopy)
  }
    else{
      console.error('Employee data is missing.');
    }
  },[employeeData])
  
 
  const [visible, setVisible]=useState(false);
  const [iframeURL, setIframeURL] = useState(null); 

const handleVisible = (data) => {
  const { urlName, tripId, travelRequestId } = data;
  setVisible(!visible);

  let url = '';

  if (urlName === 'travel-url') {
    url = `${travelBaseUrl}/create/${tenantId}/${empId}`;
  } else if (urlName === 'rejected') {
    url = `${travelBaseUrl}/rejected/${travelRequestId}`;
  } else if (["intransit","upcoming"].includes(urlName)) {
    url = `${tripBaseUrl}/${tenantId}/${empId}/modify/${tripId}/section1`;
  } else {
    url = `${travelBaseUrl}/modify/${travelRequestId}/`;
  }

  console.log('iframe url', url, urlName);
  setIframeURL(url);
};








  


  useEffect(() => {
    const handleMessage = event => {
      console.log(event)
      // Check if the message is coming from the iframe
      if (event.origin === travelBaseUrl || event.origin === cashBaseUrl) {
        // Check the message content or identifier
        if (event.data === 'closeIframe') {
          setVisible(false)
        }
         // Check the message content or identifier
         if (event.data === 'closeIframe') {
          setVisible(false)
          window.location.href = window.location.href;
        }else if(event.data.split(' ')[0] == 'raiseAdvance'){
          //we have to open an Iframe to raise cash advance
          setVisible(false)
          
          const tenantId = event.data.split(' ')[1];
          const travelRequestId = event.data.split(' ')[2];
          console.log(event.data, ' event data ', travelRequestId, ' trId ', tenantId, ' tenant Id');
          setIframeURL(`${cashBaseUrl}/create/advance/${travelRequestId}`);
          setVisible(true);
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
  

sortTripsByDate(tripData)
   
console.log('trips and travel from travel screen', tripData)

  const handleStatusClick = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const filterExpenses = (expenses) => {
   

    return expenses?.filter((expense) =>
      selectedStatuses.length === 0 ||
      selectedStatuses.includes(expense?.travelRequestStatus)
    ).filter(expense =>
      JSON.stringify(expense).toLowerCase().includes(searchQuery)
    );
  };

  const getStatusCount = (status, trips) => {
    return trips.filter((trip) => trip?.travelRequestStatus === status).length;
  };

  const disableButton = (status) => {
    return [ 'cancelled'].includes(status);
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
      <TripMS visible={visible} setVisible={setVisible} src={iframeURL}/>
      <div className='flex-col w-full p-4 flex items-start gap-2'>
      <div className='min-h-[120px] border border-slate-300 bg-white-100 rounded-md  w-full flex flex-wrap items-start gap-2 px-2 py-2'>
 <div className='flex overflow-x-auto  space-x-2 space-y-2'>      
<div className='flex items-center gap-2 justify-center p-2 bg-slate-100/50 rounded-full border border-slate-300  '> 
<div className='px-4 '>
          <img src={filter_icon} className='min-w-5 w-5 h-5 min-h-5'/>
</div>

{["draft","pending approval", "pending booking", "upcoming","intransit", "rejected","cancelled", "paid and cancelled"].map((status) => {
    const statusCount = getStatusCount(status, [...tripData]);
    const isDisabled = statusCount === 0;
    
    return (
      <div key={status} className={`flex  items-center  ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
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
  
<div className='text-neutral-700 text-base flex justify-center items-center hover:text-red-200 hover:font-semibold text-center w-auto h-[36px] font-cabin cursor-pointer whitespace-nowrap ' onClick={() => setSelectedStatuses([])}>Clear All</div>
</div> 
<div className=''>
   
   <Input placeholder="Search Trip..." type="search" icon={search_icon} onChange={(value)=>setSearchQuery(value)}/>
 </div>

 
</div>


       

        <div className='w-full flex md:flex-row flex-col '>
          <div className='flex-1 justify-center items-center'>
            <div className='relative flex justify-center items-center rounded-md font-inter text-md text-white-100 h-[52px] bg-indigo-600 text-center'>
          <div
          onClick={()=>handleVisible({urlName:"travel-url"})}
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
          Raise a Travel Request
          </p>
          </div>
              
              <div className='flex justify-center items-center'>
                <img src={airplane_icon1} className='w-4 h-4 mr-2' />
                <p>Trips</p>
              </div>
            </div>
            <div className='w-full mt-4 xl:h-[570px] lg:h-[370px] md:[590px] overflow-y-auto px-2 bg-white-100 rounded-l-md'>
              {filterExpenses(tripData)?.map((trip, index) => {
                
                const filteredTripExpenses = filterExpenses(tripData);
                if (filteredTripExpenses.length === 0) return null; // Skip rendering if no expenses match the selected statuses

                return (
                  <div key={`${index}-tr-expense`} className='flex flex-row items-center hover:border hover:border-indigo-600 hover:bg-indigo-100 cursor-pointer  justify-between mb-4 text-neutral-700 rounded-md shadow-custom-light bg-white-100 p-4'>
               <div className='font-cabin text-xs text-neutral-700'>
          {trip?.travelRequestStatus === "draft" ?
           <div className='text-xs text-start'>
           <div className='text-neutral-400'>Travel Request No.</div>
            <p>{trip?.travelRequestNumber}</p>
         </div>
          : 
          <TripName tripName={trip?.tripName}/>
        }
      </div>
      <div className='flex justify-center items-center gap-2'>
        <div className={`text-center rounded-sm ${getStatusClass(trip?.travelRequestStatus ?? "-")}`}>
            <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{(trip?.travelRequestStatus) ?? "-"}</p>
      </div>
        <div onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible({tripId:trip?.tripId ,travelRequestId:trip?.travelRequestId,urlName: trip?.travelRequestStatus})}}}  className='cursor-pointer w-7 h-7 bg-indigo-100 rounded-full border border-white-100 flex items-center justify-center'>
        <img src={modify} className='w-4 h-4' alt="Add Icon" />
        </div>
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

export default Travel;


const getTripStatus = (status,tripStartDate) => {
  
  
  if(status !== "booked"){
    return status
  }

  const currentStatus = status;
  const tripStart = new Date(tripStartDate);
  const currentDate = new Date();

  // Check if the current status is 'booked'
  if (currentStatus === 'booked') {
    if (tripStart > currentDate) {
      return 'upcoming';
    } else if (tripStart <= currentDate) {
      return 'intransit';
    }
  }

  return currentStatus;
};