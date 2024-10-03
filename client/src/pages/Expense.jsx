import React, { useEffect, useState } from 'react';
import { briefcase, modify, receipt, receipt_icon1,expense_white_icon, categoryIcons, filter_icon, plus_violet_icon, cancel, search_icon, info_icon, expene_icon } from '../assets/icon';
import { formatAmount, getStatusClass, splitTripName } from '../utils/handyFunctions';
import { handleNonTravelExpense, handleTravelExpense } from '../utils/actionHandler';
import Modal from '../components/common/Modal1';
import { useParams } from 'react-router-dom';
import { useData } from '../api/DataProvider';
import TripSearch from '../components/common/TripSearch';
import Button1 from '../components/common/Button1';
import Error from '../components/common/Error';
import Input from '../components/common/SearchInput';
import { CardLayout, EmptyBox, ExpenseLine, StatusBox, StatusFilter, TripName,RaiseButton,BoxTitleLayout, ModifyBtn } from '../components/common/TinyComponent';
import ExpenseMS from '../microservice/Expense';
import { act } from 'react';


const Expense = ({searchQuery,isLoading ,fetchData,loadingErrMsg}) => {
  const expenseBaseUrl = import.meta.env.VITE_EXPENSE_PAGE_URL;

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

  const [expenseData , setExpenseData] = useState({});
  const [expenseVisible, setExpenseVisible]=useState(false);
  const [iframeURL, setIframeURL] = useState(null); 

  
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



  const handleVisible = (data) => {
    let { urlName} = data;
    setExpenseVisible(!expenseVisible)
    console.log('iframe url',  urlName);
    setIframeURL(urlName);
    
  };

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
      handleVisible({urlName:handleTravelExpense({tenantId,empId,tripId, "action":'trip-ex-create'})})
      //handleTravelExpense(tripId, '','trip-ex-create')
    } else {
      setExpenseType(null)
      setModalOpen(false)
      handleVisible({urlName:handleNonTravelExpense({tenantId,empId,"action":'non-tr-ex-create'})})
     // handleNonTravelExpense('','non-tr-ex-create')
    }
  };

  useEffect(() => {
    const handleMessage = event => {
      console.log('event',event)
      // Check if the message is coming from the iframe
      if (event.origin === expenseBaseUrl) {
        // Check the message content or identifier

         // Check the message content or identifier
         if (event.data === 'closeIframe') {
          setExpenseVisible(false)
          window.location.href = window.location.href;
         
          
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

  return (
    <>
    {isLoading && <Error message={loadingErrMsg}/>}
    {!isLoading && 
    <>
    {expenseVisible ?   ( <ExpenseMS visible={expenseVisible} setVisible={setExpenseVisible} src={iframeURL} /> ) :
    <div className='h-screen  flex flex-col p-4'>
    
      <div className=' border border-slate-300 bg-white rounded-md  w-full flex flex-wrap items-start gap-2 px-2 py-2'>

  <StatusFilter
   statuses = {
    [ "draft",
      "pending approval", 
      "pending settlement",
      "paid","rejected", 
      "cancelled", 
      "paid and cancelled"
    ]}
    tripData={[...travelExpenses.flatMap(te => te?.travelExpenses ), ...nonTravelExpenses]}
    selectedStatuses={selectedStatuses}
    handleStatusClick={handleStatusClick}
    filter_icon={filter_icon}
getStatusClass={getStatusClass}
getStatusCount={getStatusCount}
setSelectedStatuses={setSelectedStatuses}
  />
 
 



 
     </div>   


<div className=' flex flex-col md:flex-row flex-grow w-full overflow-auto scrollbar-hide gap-2  mt-2'>
         
       
<div className='w-full md:w-1/2  flex flex-col'>

<BoxTitleLayout title="Travel Expense" icon={expense_white_icon}/>
<div className='w-full h-full mt-4  overflow-y-auto px-2 bg-white rounded-l-md'>
              {travelExpenses?.length > 0 ? travelExpenses?.map((trip, index) => {
                const filteredTripExpenses = filterExpenses(trip?.travelExpenses);
                if (filteredTripExpenses.length === 0) return null; // Skip rendering if no expenses match the selected statuses

                return (
                  <>
                  <CardLayout index={index}>
                  <div className='py-2 w-full'>
                   <TripName tripName={trip?.tripName}/>
                    <div className='mt-2 space-y-2'>
                      {filteredTripExpenses.map((trExpense, index) => (
                        <div key={index} className='border border-slate-300 rounded-md px-2 py-1'>
                          <div className='flex flex-row justify-between items-center py-1 border-b border-slate-300 font-cabin font-xs'>
                            
                            <StatusBox status={trExpense?.expenseHeaderStatus ?? "-"}/>
                            {!['paidAndDistributed'].includes(trExpense?.expenseHeaderStatus) &&
                            <ModifyBtn onClick={()=>handleVisible({urlName:handleTravelExpense({tenantId,empId,tripId:trip?.tripId,expenseHeaderId: trExpense?.expenseHeaderId, action: 'trip-ex-modify' })})}/>
                            }
                            
                          </div>
                          <ExpenseLine expenseLines={trExpense?.expenseLines}/>
                        </div>
                      ))}
                    </div>
                  </div>
                  </CardLayout>
                  </>
                );
              }):<EmptyBox icon={expene_icon} text='Travel Expense'/>}
            </div>

</div>
           
            
          

         
<div className='w-full md:w-1/2  flex flex-col'>

            <BoxTitleLayout title={'Non-Travel Expense'} icon={expense_white_icon}>
            <RaiseButton  
          onClick={()=>setModalOpen(!modalOpen)}
          
          text={'Expense'}
          textVisible={'textVisible?.expense'}/>

            </BoxTitleLayout>
         
            
          <div className='w-full mt-4 h-full overflow-y-auto px-2 bg-white rounded-r-md'>
              {nonTravelExpenses?.length > 0 ? filterExpenses(nonTravelExpenses)?.map((nonTravelExp, index) => (
                <>
                <CardLayout index={index}>
                <div className='w-full py-2'>
                  <div className='flex flex-row justify-between'>
                    <div className='flex gap-2 items-center'>
                      <img src={receipt} className='w-5 h-5' />
                      <div >
                        <div className='header-title'>Expense Header No.</div>
                        <p className='header-text'>{nonTravelExp?.expenseHeaderNumber}</p>
                      </div>
                    </div>
                    <div className='flex flex-row gap-2 justify-between items-center font-cabin font-xs'>
                      <StatusBox status={nonTravelExp?.expenseHeaderStatus ?? "-"}/>
                      {!['paidAndDistributed'].includes(nonTravelExp?.expenseHeaderStatus) &&
                      
                      <ModifyBtn onClick={() => handleVisible({urlName:handleNonTravelExpense({tenantId,empId ,expenseHeaderId:nonTravelExp?.expenseHeaderId,action:"non-tr-ex-modify"})})}/>
                      }
                    </div>
                  </div>
                  <ExpenseLine expenseLines={nonTravelExp?.expenseLines}/>
                </div>
                </CardLayout>
                </>
              )):<EmptyBox icon={expene_icon} text='Non-Travel Expense'/>}
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
                <div onClick={()=>{setModalOpen(!modalOpen);setTripId(null);setExpenseType(null)}} className='bg-red-100 cursor-pointer rounded-full border border-white'>
                <img src={cancel} className='w-5 h-5'/>
                </div>
              </div>
<div className='p-4'>
<div className='flex md:flex-row flex-col justify-between gap-2'>
 <div onClick={()=>setExpenseType("travel_Cash-Advance")} className={`min-w-fit cursor-pointer transition  duration-200 hover:bg-indigo-100 hover:rounded-md flex-1 flex gap-2 items-center justify-center ${expenseType === "travel_Cash-Advance" ? ' border-b-2 border-indigo-600 text-indigo-600' : 'border-b-2 border-white '}  p-4`}>
    <img src={receipt} className='w-5 h-5'/>
    <p className='truncate '>Travel Expense</p> 
 </div> 
           
  <div onClick={()=>setExpenseType("non-Travel_Cash-Advance")} className={`min-w-fit cursor-pointer transition  duration-200 hover:bg-indigo-100 hover:rounded-md flex-1  flex items-center justify-center gap-2 p-4 ${expenseType === "non-Travel_Cash-Advance" ? 'border-b-2 border-indigo-600 text-indigo-600': "border-b-2 border-white"}  `}>
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
    </>}
    </>
  );
};

export default Expense;


// import React, { useEffect, useState } from 'react';
// import { briefcase, modify, receipt, receipt_icon1, categoryIcons, filter_icon, plus_violet_icon, cancel, search_icon, info_icon, expene_icon } from '../assets/icon';
// import { formatAmount, getStatusClass, splitTripName } from '../utils/handyFunctions';
// import { handleNonTravelExpense, handleTravelExpense } from '../utils/actionHandler';
// import Modal from '../components/common/Modal1';
// import { useParams } from 'react-router-dom';
// import { useData } from '../api/DataProvider';
// import TripSearch from '../components/common/TripSearch';
// import Button1 from '../components/common/Button1';
// import Error from '../components/common/Error';
// import Input from '../components/common/SearchInput';
// import { CardLayout, EmptyBox, ExpenseLine, StatusBox, StatusFilter, TripName,RaiseButton } from '../components/common/TinyComponent';
// import ExpenseMS from '../microservice/Expense';
// import { act } from 'react';


// const Expense = ({searchQuery,isLoading ,fetchData,loadingErrMsg}) => {
//   const expenseBaseUrl = import.meta.env.VITE_EXPENSE_PAGE_URL;

//   const [tripId , setTripId]=useState(null);
//   const [expenseType , setExpenseType]=useState(null);
//   const [selectedStatuses, setSelectedStatuses] = useState([]);
//   const [textVisible,setTextVisible]=useState({tripId:false}); 
//   const [modalOpen , setModalOpen]=useState(false);
//   const [tripData, setTripData]=useState([]);
//   const {tenantId,empId,page}= useParams();
//   const { employeeData } = useData();
//   const [error , setError]= useState({
//     tripId: {set:false, message:""}
//   }); 

//   const [expenseData , setExpenseData] = useState({});
//   const [expenseVisible, setExpenseVisible]=useState(false);
//   const [iframeURL, setIframeURL] = useState(null); 

  
//   useEffect(()=>{

//     fetchData(tenantId,empId,page)

//   },[])
  


//   // useEffect(() => {
//   //   if (employeeData) {
//   //     const data = employeeData?.dashboardViews?.employee || [];
     
//   //     const intransitTrips = data?.trips?.transitTrips || [];
  
//   //     const dataForRaiseCashadvance = [ ...intransitTrips];
//   //     const pushedData = dataForRaiseCashadvance?.map(item => ({ ...item, tripName: "us - del - mum - gkr" }));
      
//   //     setTripData(pushedData);
      
//   //     console.log('Trip data for expense:', dataForRaiseCashadvance);
//   //   } else {
//   //     console.error('Employee data is missing.');
//   //   }
//   // }, [employeeData]);

//   useEffect(()=>{
//     const data = employeeData?.dashboardViews?.employee?.overview || [];
//     const intransitTrips = data?.transitTrips || [];
//     const completedTrips = employeeData?.dashboardViews?.employee?.expense?.completedTrips || []

//     const dataForRaiseCashadvance = [...intransitTrips, ...completedTrips];
//     const pushedData = dataForRaiseCashadvance?.map(item => ({ ...item}));
//     setTripData(pushedData)
//     setExpenseData(employeeData && employeeData?.dashboardViews?.employee?.expense)
  
//   },[employeeData])
  
 
  

//       const travelExpenses     = expenseData?.allTripExpenseReports || [];
//       const nonTravelExpenses  = expenseData?.allNonTravelReports || [];
//       console.log('expenses from expense tab', travelExpenses , nonTravelExpenses)
  

//   const handleStatusClick = (status) => {
//     setSelectedStatuses((prev) =>
//       prev.includes(status)
//         ? prev.filter((s) => s !== status)
//         : [...prev, status]
//     );
//   };

//   const filterExpenses = (expenses) => {
    
//     return expenses.filter((expense) =>
//       selectedStatuses.length === 0 ||
//       selectedStatuses.includes(expense?.expenseHeaderStatus)
//     ).filter(expense =>
//       JSON.stringify(expense).toLowerCase().includes(searchQuery)
//     );
//   };

//   const getStatusCount = (status, expenses) => {
//     return expenses.filter((expense) => expense?.expenseHeaderStatus === status).length;
//   };

//   const disableButton = (status) => {
//     return ['draft', 'cancelled'].includes(status);
//   };

//   const handleSelect=(option)=>{
//     console.log(option)
//     setTripId(option?.tripId)
//   }



//   const handleVisible = (data) => {
//     let { urlName} = data;
//     setExpenseVisible(!expenseVisible)
//     console.log('iframe url',  urlName);
//     setIframeURL(urlName);
    
//   };

//   const handleRaise = () => {
//     if (expenseType=== "travel_Cash-Advance") {
//       if (!tripId) {
//         setError(prev => ({ ...prev, tripId: { set: true, message: "Select the trip" } }));
        
//         return;
//       } 
//       setError(prev => ({ ...prev, travelRequestId: { set: false, message: "" } }));
//       setTripId(null)
//       setExpenseType(null)
//       setModalOpen(false)
//       handleVisible({urlName:handleTravelExpense({tenantId,empId,tripId, "action":'trip-ex-create'})})
//       //handleTravelExpense(tripId, '','trip-ex-create')
//     } else {
//       setExpenseType(null)
//       setModalOpen(false)
//       handleVisible({urlName:handleNonTravelExpense({tenantId,empId,"action":'non-tr-ex-create'})})
//      // handleNonTravelExpense('','non-tr-ex-create')
//     }
//   };

//   useEffect(() => {
//     const handleMessage = event => {
//       console.log('event',event)
//       // Check if the message is coming from the iframe
//       if (event.origin === expenseBaseUrl) {
//         // Check the message content or identifier

//          // Check the message content or identifier
//          if (event.data === 'closeIframe') {
//           setExpenseVisible(false)
//           window.location.href = window.location.href;
         
          
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

//   return (
//     <>
//     {isLoading && <Error message={loadingErrMsg}/>}
//     {!isLoading && 
//     <>
//     {expenseVisible ?   ( <ExpenseMS visible={expenseVisible} setVisible={setExpenseVisible} src={iframeURL} /> ) :
//     <div className='h-screen  flex flex-col p-4'>
    
//       <div className=' border border-slate-300 bg-white rounded-md  w-full flex flex-wrap items-start gap-2 px-2 py-2'>

//   <StatusFilter
//    statuses = {
//     [ "draft",
//       "pending approval", 
//       "pending settlement",
//       "paid","rejected", 
//       "cancelled", 
//       "paid and cancelled"
//     ]}
//     tripData={[...travelExpenses.flatMap(te => te?.travelExpenses ), ...nonTravelExpenses]}
//     selectedStatuses={selectedStatuses}
//     handleStatusClick={handleStatusClick}
//     filter_icon={filter_icon}
// getStatusClass={getStatusClass}
// getStatusCount={getStatusCount}
// setSelectedStatuses={setSelectedStatuses}
//   />
 
 



 
//      </div>   


// <div className=' flex flex-col md:flex-row flex-grow w-full overflow-auto scrollbar-hide gap-2  mt-2'>
         
       
// <div className='w-full md:w-1/2  flex flex-col'>
// <div className='relative flex justify-center items-center  rounded-l-md font-inter text-md text-white shrink-0 h-[52px] bg-indigo-600 text-center'>
//           {/* <div
//           onClick={()=>setModalOpen(!modalOpen)}
//           onMouseEnter={() => setTextVisible({cashAdvance:true})}
//           onMouseLeave={() => setTextVisible({cashAdvance:false})}
//           className={`absolute  left-0 ml-4 hover:px-2 w-6 h-6 hover:overflow-hidden hover:w-auto group text-indigo-600 bg-indigo-100 border border-white flex items-center justify-center  hover:gap-x-1 rounded-full cursor-pointer transition-all duration-300`}
//           >
//           <img src={plus_violet_icon} width={16} height={16} alt="Add Icon" />
//           <p
//           className={`${
//           textVisible?.expense ? 'opacity-100' : 'opacity-0 w-0'
//           } whitespace-nowrap text-xs transition-all duration-300 group-hover:opacity-100 group-hover:w-auto`}
//           >
//           Raise an Expense
//           </p>
//           </div> */}
//           <RaiseButton  
//           onClick={()=>setModalOpen(!modalOpen)}
//           onMouseEnter={() => setTextVisible({cashAdvance:true})}
//           onMouseLeave={() => setTextVisible({cashAdvance:false})}
//           text={'Raise an Expense'}
//           textVisible={'textVisible?.expense'}/>
//               <div className='inline-flex items-center'>
//                 <img src={receipt_icon1} className='w-6 h-6 mr-2' />
//                 <p>Travel Expenses</p>
//               </div>
//             </div>
// <div className='w-full h-full mt-4  overflow-y-auto px-2 bg-white rounded-l-md'>
//               {travelExpenses?.length > 0 ? travelExpenses?.map((trip, index) => {
//                 const filteredTripExpenses = filterExpenses(trip?.travelExpenses);
//                 if (filteredTripExpenses.length === 0) return null; // Skip rendering if no expenses match the selected statuses

//                 return (
//                   <>
//                   <CardLayout index={index}>
//                   <div className='py-2 w-full'>
//                    <TripName tripName={trip?.tripName}/>
//                     <div className='mt-2 space-y-2'>
//                       {filteredTripExpenses.map((trExpense, index) => (
//                         <div key={index} className='border border-slate-300 rounded-md px-2 py-1'>
//                           <div className='flex flex-row justify-between items-center py-1 border-b border-slate-300 font-cabin font-xs'>
                            
//                             <StatusBox status={trExpense?.expenseHeaderStatus ?? "-"}/>
//                             {!['paidAndDistributed'].includes(trExpense?.expenseHeaderStatus) &&
//                             <div onClick={()=>handleVisible({urlName:handleTravelExpense({tenantId,empId,tripId:trip?.tripId,expenseHeaderId: trExpense?.expenseHeaderId, action: 'trip-ex-modify' })})} className={`w-7 h-7 bg-indigo-100 rounded-full border border-white flex items-center justify-center cursor-pointer`}>
//                             <img src={modify} className='w-4 h-4' alt="modify_icon" />
//                           </div>}
                            
//                           </div>
//                           <ExpenseLine expenseLines={trExpense?.expenseLines}/>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                   </CardLayout>
//                   </>
//                 );
//               }):<EmptyBox icon={expene_icon} text='Travel Expense'/>}
//             </div>

// </div>
           
            
          

         
// <div className='w-full md:w-1/2  flex flex-col'>
//           <div className='flex justify-center items-center rounded-r-md font-inter text-md shrink-0 text-white h-[52px] bg-indigo-600 text-center'>
//               <img src={receipt_icon1} className='w-6 h-6 mr-2' />
//               <p>Non-Travel Expenses</p>
//             </div>
            
//           <div className='w-full mt-4 h-full overflow-y-auto px-2 bg-white rounded-r-md'>
//               {nonTravelExpenses?.length > 0 ? filterExpenses(nonTravelExpenses)?.map((nonTravelExp, index) => (
//                 <>
//                 <CardLayout index={index}>
//                 <div className='w-full py-2'>
//                   <div className='flex flex-row justify-between'>
//                     <div className='flex gap-2 items-center'>
//                       <img src={receipt} className='w-5 h-5' />
//                       <div >
//                         <div className='header-title'>Expense Header No.</div>
//                         <p className='header-text'>{nonTravelExp?.expenseHeaderNumber}</p>
//                       </div>
//                     </div>
//                     <div className='flex flex-row gap-2 justify-between items-center font-cabin font-xs'>
//                       <StatusBox status={nonTravelExp?.expenseHeaderStatus ?? "-"}/>
//                       {!['paidAndDistributed'].includes(nonTravelExp?.expenseHeaderStatus) &&<div onClick={() => handleVisible({urlName:handleNonTravelExpense({tenantId,empId ,expenseHeaderId:nonTravelExp?.expenseHeaderId,action:"non-tr-ex-modify"})})} className={`w-7 h-7 bg-indigo-100 rounded-full border border-white flex items-center justify-center ${disableButton(nonTravelExp?.travelRequestStatus) ? ' cursor-not-allowed opacity-50' : ' cursor-pointer'}`}>
//                         <img src={modify} className='w-4 h-4' alt="modify_icon" />
//                       </div>}
//                     </div>
//                   </div>
//                   <ExpenseLine expenseLines={nonTravelExp?.expenseLines}/>
//                 </div>
//                 </CardLayout>
//                 </>
//               )):<EmptyBox icon={expene_icon} text='Non-Travel Expense'/>}
//             </div>
//             </div> 

           
          
// </div>
      

//       <Modal 
//         isOpen={modalOpen} 
//         onClose={modalOpen} 
//         content={<div className='w-full h-auto'> 
//           <div>
//               <div className='flex gap-2 justify-between items-center bg-indigo-100 w-full p-4'>
//                 <p className='font-inter text-base font-semibold text-indigo-600'>Raise an Expense</p>              
//                 <div onClick={()=>{setModalOpen(!modalOpen);setTripId(null);setExpenseType(null)}} className='bg-red-100 cursor-pointer rounded-full border border-white'>
//                 <img src={cancel} className='w-5 h-5'/>
//                 </div>
//               </div>
// <div className='p-4'>
// <div className='flex md:flex-row flex-col justify-between gap-2'>
//  <div onClick={()=>setExpenseType("travel_Cash-Advance")} className={`min-w-fit cursor-pointer transition  duration-200 hover:bg-indigo-100 hover:rounded-md flex-1 flex gap-2 items-center justify-center ${expenseType === "travel_Cash-Advance" ? ' border-b-2 border-indigo-600 text-indigo-600' : 'border-b-2 border-white '}  p-4`}>
//     <img src={receipt} className='w-5 h-5'/>
//     <p className='truncate '>Travel Expense</p> 
//  </div> 
           
//   <div onClick={()=>setExpenseType("non-Travel_Cash-Advance")} className={`min-w-fit cursor-pointer transition  duration-200 hover:bg-indigo-100 hover:rounded-md flex-1  flex items-center justify-center gap-2 p-4 ${expenseType === "non-Travel_Cash-Advance" ? 'border-b-2 border-indigo-600 text-indigo-600': "border-b-2 border-white"}  `}>
//     <img src={receipt} className='w-5 h-5'/>
//     <p className='truncate  shrink'>Non-Travel Expense</p>
//   </div>
  
//   </div>  
  

// <div className='flex gap-4 flex-col items-start justify-start w-full py-2'>
// { expenseType=== "travel_Cash-Advance" &&
//  <div className='w-full'>
//   <TripSearch placeholder={"Select the trip"} error={error?.tripId} title="Apply to trip" data={tripData} onSelect={handleSelect} />
//  </div> }
  


// {expenseType && <Button1 text={"Raise"} onClick={handleRaise} />}

  
   


// </div>   
// </div>


 
   
            
//           </div>

//       </div>}
//       />
//     </div>}
//     </>}
//     </>
//   );
// };

// export default Expense;
