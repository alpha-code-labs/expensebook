import React, { useEffect, useState } from 'react';
import { briefcase, cancel, cashadvance_icon, filter_icon, modify, money, money1, plus_violet_icon, search_icon } from '../assets/icon';
import { formatAmount, getStatusClass, splitTripName } from '../utils/handyFunctions';
import {TRCashadvance,NonTRCashAdvances} from '../utils/dummyData';
import Modal from '../components/common/Modal1';
import TripSearch from '../components/common/TripSearch';
import Button1 from '../components/common/Button1';
import { handleCashAdvance } from '../utils/actionHandler';
import TravelMS from '../microservice/TravelMS';
import { useData } from '../api/DataProvider';
import Error from '../components/common/Error';
import { useParams } from 'react-router-dom';
import Input from '../components/common/SearchInput';
import TripMS from '../microservice/TripMS';
import { CardLayout, EmptyBox, StatusFilter, TripName } from '../components/common/TinyComponent';

const CashAdvance = ({isLoading, fetchData, loadingErrMsg}) => {

  const [cashAdvanceUrl , setCashAdvanceUrl]=useState(null) 
  const [visible, setVisible]=useState(false) 
  const [travelRequestId , setTravelRequestId]=useState(null) 
  const [advancetype , setAdvanceType]=useState(null) 
  const [textVisible,setTextVisible]=useState({cashAdvance:false}) 
  const [modalOpen , setModalOpen]=useState(false) 

  const [error , setError]= useState({
    travelRequestId: {set:false, message:""}
  }) 

  const { employeeData } = useData();
  const [travelData, setTravelData]=useState([]);
  const [searchQuery , setSearchQuery] = useState('');
  const [cashAdvanceData, setCashAdvanceData]=useState([]);

  const {tenantId,empId,page}= useParams();

  useEffect(()=>{

    fetchData(tenantId,empId,page)

  },[])



  useEffect(() => {

    if (employeeData) {

      const data = employeeData?.dashboardViews?.employee?.overview || [];
      const travelData = data?.allTravelRequests?.allTravelRequests || [];
      const upcomingTrips = data?.upcomingTrips || [];
      const intransitTrips = data?.transitTrips || [];
  
      const dataForRaiseCashadvance = [...intransitTrips, ...upcomingTrips,...travelData,  ];
      const pushedData = dataForRaiseCashadvance?.map(item => ({ ...item }));

      setTravelData(pushedData);
      setCashAdvanceData(employeeData?.dashboardViews?.employee?.cashAdvance);
      console.log('Travel data for raise advance:', dataForRaiseCashadvance);

    } else {
      console.error('Employee data is missing.');
    }

  }, [employeeData]);

  const travelCashAdvances = cashAdvanceData?.travelCashAdvance?.filter((travel)=>!travel.cashAdvances.some((cash)=>["awaiting"].includes(cash.cashAdvanceStatus))) || []
  const nonTravelCashAdvances = cashAdvanceData?.nonTravelCashAdvance || []




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

const handleVisible = (travelRequestId, action, cashadvanceId) => {

  setVisible(!visible);
  let url ;
  if (action==="ca-create"){
    url=handleCashAdvance(travelRequestId, "", 'ca-create')
    console.log('url',url)
    
  }
  else if (action==="non-tr-ca-create"){
    url=handleCashAdvance("", 'non-tr-ca-create');
   
  }else if (action === "ca-modify"){
    url=handleCashAdvance(travelRequestId, cashadvanceId, 'ca-modify');
  }
  else {
    throw new Error('Invalid action');
  }
  
  setCashAdvanceUrl(url)
}



  useEffect(() => {
    const handleMessage = event => {
      console.log('data from cash advance',event)
      // Check if the message is coming from the iframe
      // if (event.origin === cashAdvanceUrl ) {
        // Check the message content or identifier
        console.log('iframe close msg',event.data)
        if (event.data === 'closeIframe') {
          setVisible(false)
          window.location.href = window.location.href;
        }
      // }
    };
    // Listen for messages from the iframe
    window.addEventListener('message', handleMessage);
  
    return () => {
      // Clean up event listener
      window.removeEventListener('message', handleMessage);
    };
  }, []);


  console.log(error.travelRequestId)

  const handleSelect=(option)=>{
    console.log(option)
    setTravelRequestId(option?.travelRequestId)
  }

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
    return cashadvances.filter((cashadvance) =>
      selectedStatuses.length === 0 ||
      selectedStatuses.includes(cashadvance?.cashAdvanceStatus)
    ).filter(cashadvance => 
      JSON.stringify(cashadvance).toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  
  const getStatusCount = (status, cashadvance) => {
    return cashadvance.filter((cashadvance) => cashadvance?.cashAdvanceStatus === status)?.length;
  };
  
  
  const disableButton = (status) => {
    return ['draft', 'cancelled'].includes(status);
  };

  
  
  return (
    <>
     {isLoading ? <Error message={loadingErrMsg}/> :
    <>
      <TripMS visible={visible} setVisible={setVisible} src={cashAdvanceUrl}/>
      <div className='h-screen  flex flex-col p-4'>
     
      
      
      <div className='min-h-[150px] shrink-0 border border-slate-300 bg-white rounded-md  w-full flex flex-wrap items-start gap-2 px-2 py-2'>
      

  <StatusFilter
  statuses={["draft","pending approval", "pending settlement", "paid","rejected",  "cancelled", "paid and cancelled"]}
  tripData={[...travelCashAdvances.flatMap(te => te?.cashAdvances), ...NonTRCashAdvances]}
selectedStatuses={selectedStatuses}
handleStatusClick={handleStatusClick}
filter_icon={filter_icon}
getStatusClass={getStatusClass}
getStatusCount={getStatusCount}
setSelectedStatuses={setSelectedStatuses}/>
  <div className=''>
   
   <Input placeholder="Search Cash Advance..." type="search" icon={search_icon} onChange={(value)=>setSearchQuery(value)}/>
 </div>
</div>

<div className=' flex flex-col md:flex-row flex-grow w-full overflow-auto scrollbar-hide  mt-2'>
<div className='w-full md:w-1/2  flex flex-col'>
         
<div className='relative shrink-0  flex justify-center items-center  rounded-l-md   font-inter text-md text-white h-[52px] bg-indigo-600  text-center'>

<div
onClick={()=>setModalOpen(!modalOpen)}
onMouseEnter={() => setTextVisible({cashAdvance:true})}
onMouseLeave={() => setTextVisible({cashAdvance:false})}
className={`absolute  left-0 ml-4 hover:px-2 w-6 h-6 hover:overflow-hidden hover:w-auto group text-indigo-600 bg-indigo-100 border border-white flex items-center justify-center  hover:gap-x-1 rounded-full cursor-pointer transition-all duration-300`}
>
<img src={plus_violet_icon} width={16} height={16} alt="Add Icon" />
<p
className={`${
textVisible?.cashAdvance ? 'opacity-100 ' : 'opacity-0 w-0'
} whitespace-nowrap text-xs transition-all duration-300 group-hover:opacity-100 group-hover:w-auto`}
>
Raise a Cash-Advance
</p>
</div>
  
             
              <div className='flex justify-center items-center '>
              <img src={money1} className='w-6 h-6 mr-2' />
              <p>Travel Cash-Advances</p>
              </div>

            </div>




            
            <div className='w-full h-full mt-4  overflow-y-auto px-2 bg-white rounded-l-md'>
          {travelCashAdvances?.length > 0 ? travelCashAdvances?.map((trip) => { 
            const filteredCashadvances = filterCashadvances(trip?.cashAdvances)
            if (filteredCashadvances.length === 0) return null;
            return(
              <>
              <CardLayout index={trip?.tripId}>
            <div key={trip?.tripId} className='py-2 w-full'>
          <TripName tripName={trip?.tripName}/>
              {filteredCashadvances?.map((advance,index) => ( 
                <div key={index} className={`px-2 py-2 ${index < filteredCashadvances.length-1 && 'border-b border-slate-400 '}`}>
                  <div className='flex justify-between'>
                    <div className='flex flex-col justify-center max-w-[120px]'>
                      <div className='font-medium text-sm font-cabin text-neutral-400'>Advance Amount</div>
                      <div className='font-medium text-sm font-cabin text-neutral-700 '>
  {advance.amountDetails.map((amount, index) => (
    <div key={index}>
      {`${amount.currency.shortName} ${formatAmount(amount.amount)}`}
      {index < advance.amountDetails.length - 1 && <span>, </span>}
    </div>
  ))}
</div> 
    </div>
      <div className='flex justify-center items-center gap-2'>
                    <div className={`text-center rounded-sm ${getStatusClass(advance?.cashAdvanceStatus ?? "-")}`}>
                       <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{advance?.cashAdvanceStatus ?? "-"}</p>
                    </div>
                    <div onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible(trip?.travelRequestId,  'ca-modify' ,advance?.cashAdvanceId,)}}} className={`w-7 h-7 bg-indigo-100 rounded-full border border-white flex items-center justify-center ${disableButton(trip?.travelRequestStatus)? ' cursor-not-allowed opacity-50' : ' cursor-pointer'}`}>
                    <img src={modify} className='w-4 h-4' alt="modify_icon" />
                    </div>
                  </div>
      </div>
      </div>
))}
</div>
</CardLayout>
</>

)
           }) : <EmptyBox icon={cashadvance_icon} text={'Travel Cash Advance'}/>}
        </div>
          </div>
          <div className='w-full md:w-1/2  flex flex-col'>
            <div className='flex shrink-0 justify-center items-center rounded-r-md font-inter text-md text-white h-[52px] bg-indigo-600  text-center'>
              <img src={money1} className='w-6 h-6 mr-2'/>
              <p>Non-Travel Cash-Advances</p>
            </div>
            <div className='w-full h-full mt-4  overflow-y-auto px-2 bg-white rounded-l-md'>
            {/* THIS WILL BE USE AFTER IMPLEMENT THE NON TRAVEL CASH */}
            {NonTRCashAdvances?.length > 0 ? 
            filterCashadvances(NonTRCashAdvances)?.map((cashAdvance,index) => (
              <>
              <CardLayout index={index}>
              <div  className='py-2 w-full'>
              <div className='flex gap-2 items-center'>
              <img src={money} className='w-5 h-5'/>
              <div className=''>
               <div className='header-title'>Cash-Advance No.</div>
               <p className='header-text'>{cashAdvance?.cashAdvanceNumber}</p>
              </div>
              </div>
              
                <div  className={`px-2 py-2`}>
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
        <div  className='cursor-pointer w-7 h-7 bg-indigo-100 rounded-full border border-white flex items-center justify-center'>
        <img src={modify} className='w-4 h-4' alt="Add Icon" />
      </div>
      </div>
      </div>
    </div>
              
            </div>
            </CardLayout>
            </>
          )) : <EmptyBox icon={cashadvance_icon} text={'Non-Travel Cash Advance'}/>}
        </div>
          </div>
        </div>
     

    <Modal 
        isOpen={modalOpen} 
        onClose={modalOpen}
        content={<div className=' w-full h-auto'>
          <div>
            
              <div className='flex gap-2 justify-between items-center bg-indigo-100 w-full p-4'>
               
                <p className='font-inter text-base font-semibold text-indigo-600'>Raise a Cash-Advance</p>
                <div onClick={()=>{setModalOpen(!modalOpen);setTravelRequestId(null);setAdvanceType(null)}} className='bg-red-100 cursor-pointer rounded-full border border-white'>
                <img src={cancel} className='w-5 h-5'/>
                </div>
              </div>
<div className='p-4'>
 <div className='flex md:flex-row flex-col justify-between gap-2 '>
  <div onClick={()=>setAdvanceType("travel_Cash-Advance")} className={`cursor-pointer transition  duration-200 hover:bg-indigo-100 hover:rounded-md flex-1 flex gap-2 items-center justify-center ${advancetype === "travel_Cash-Advance" ? ' border-b-2 border-indigo-600 text-indigo-600' : 'border-b-2 border-white '}  p-4`}>
    <img src={money} className='w-5 h-5'/>
    <p className='truncate '>Travel Cash-Advance</p> 
  </div>
           
  <div onClick={()=>setAdvanceType("non-Travel_Cash-Advance")} className={`min-w-fit cursor-pointer transition  duration-200 hover:bg-indigo-100 hover:rounded-md flex-1  flex items-center justify-center gap-2 p-4 ${advancetype === "non-Travel_Cash-Advance" ? 'border-b-2 border-indigo-600 text-indigo-600': "border-b-2 border-white"}  `}>
    <img src={money} className='w-5 h-5'/>
    <p className=' shrink'>Non-Travel Cash-Advance</p>
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
      />
     


        
    </div>
    </>}
    </>
  );
};

export default CashAdvance;



// import React, { useEffect, useState } from 'react';
// import { briefcase, cancel, cashadvance_icon, filter_icon, modify, money, money1, plus_violet_icon, search_icon } from '../assets/icon';
// import { formatAmount, getStatusClass, splitTripName } from '../utils/handyFunctions';
// import {TRCashadvance,NonTRCashAdvances} from '../utils/dummyData';
// import Modal from '../components/common/Modal1';
// import TripSearch from '../components/common/TripSearch';
// import Button1 from '../components/common/Button1';
// import { handleCashAdvance } from '../utils/actionHandler';
// import TravelMS from '../microservice/TravelMS';
// import { useData } from '../api/DataProvider';
// import Error from '../components/common/Error';
// import { useParams } from 'react-router-dom';
// import Input from '../components/common/SearchInput';
// import TripMS from '../microservice/TripMS';
// import { CardLayout, EmptyBox, StatusFilter, TripName } from '../components/common/TinyComponent';

// const CashAdvance = ({isLoading, fetchData, loadingErrMsg}) => {

//   const [cashAdvanceUrl , setCashAdvanceUrl]=useState(null) 
//   const [visible, setVisible]=useState(false) 
//   const [travelRequestId , setTravelRequestId]=useState(null) 
//   const [advancetype , setAdvanceType]=useState(null) 
//   const [textVisible,setTextVisible]=useState({cashAdvance:false}) 
//   const [modalOpen , setModalOpen]=useState(false) 

//   const [error , setError]= useState({
//     travelRequestId: {set:false, message:""}
//   }) 

//   const { employeeData } = useData();
//   const [travelData, setTravelData]=useState([]);
//   const [searchQuery , setSearchQuery] = useState('');
//   const [cashAdvanceData, setCashAdvanceData]=useState([]);

//   const {tenantId,empId,page}= useParams();

//   useEffect(()=>{

//     fetchData(tenantId,empId,page)

//   },[])



//   useEffect(() => {

//     if (employeeData) {

//       const data = employeeData?.dashboardViews?.employee?.overview || [];
//       const travelData = data?.allTravelRequests?.allTravelRequests || [];
//       const upcomingTrips = data?.upcomingTrips || [];
//       const intransitTrips = data?.transitTrips || [];
  
//       const dataForRaiseCashadvance = [...intransitTrips, ...upcomingTrips,...travelData,  ];
//       const pushedData = dataForRaiseCashadvance?.map(item => ({ ...item }));

//       setTravelData(pushedData);
//       setCashAdvanceData(employeeData?.dashboardViews?.employee?.cashAdvance);
//       console.log('Travel data for raise advance:', dataForRaiseCashadvance);

//     } else {
//       console.error('Employee data is missing.');
//     }

//   }, [employeeData]);

//   const travelCashAdvances = cashAdvanceData?.travelCashAdvance?.filter((travel)=>!travel.cashAdvances.some((cash)=>["awaiting pending settlement"].includes(cash.cashAdvanceStatus))) || []
//   const nonTravelCashAdvances = cashAdvanceData?.nonTravelCashAdvance || []




//   const handleRaise = () => {
//     if (advancetype === "travel_Cash-Advance") {
//       if (!travelRequestId) {
//         setError(prev => ({ ...prev, travelRequestId: { set: true, message: "Select the trip" } }));
        
//         return;
//       } 
//       setError(prev => ({ ...prev, travelRequestId: { set: false, message: "" } }));
//       setTravelRequestId(null)
//       setAdvanceType(null)
//       setModalOpen(false)
//       handleVisible(travelRequestId, 'ca-create')
//     } else {
//       setAdvanceType(null)
//       setModalOpen(false)
//       handleVisible(travelRequestId, 'ca-create')
//     }
//   };

 


// //cashadvance iframe

// const handleVisible = (travelRequestId, action, cashadvanceId) => {

//   setVisible(!visible);
//   let url ;
//   if (action==="ca-create"){
//     url=handleCashAdvance(travelRequestId, "", 'ca-create')
//     console.log('url',url)
    
//   }
//   else if (action==="non-tr-ca-create"){
//     url=handleCashAdvance("", 'non-tr-ca-create');
   
//   }else if (action === "ca-modify"){
//     url=handleCashAdvance(travelRequestId, cashadvanceId, 'ca-modify');
//   }
//   else {
//     throw new Error('Invalid action');
//   }
  
//   setCashAdvanceUrl(url)
// }



//   useEffect(() => {
//     const handleMessage = event => {
//       console.log('data from cash advance',event)
//       // Check if the message is coming from the iframe
//       // if (event.origin === cashAdvanceUrl ) {
//         // Check the message content or identifier
//         console.log('iframe close msg',event.data)
//         if (event.data === 'closeIframe') {
//           setVisible(false)
//           window.location.href = window.location.href;
//         }
//       // }
//     };
//     // Listen for messages from the iframe
//     window.addEventListener('message', handleMessage);
  
//     return () => {
//       // Clean up event listener
//       window.removeEventListener('message', handleMessage);
//     };
//   }, []);


//   console.log(error.travelRequestId)

//   const handleSelect=(option)=>{
//     console.log(option)
//     setTravelRequestId(option?.travelRequestId)
//   }

//   useEffect(() => {
//     if (visible) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'visible';
//     }
//   }, [visible]);


//   const [selectedStatuses, setSelectedStatuses] = useState([]);

//   const handleStatusClick = (status) => {

//     setSelectedStatuses((prev) =>
//       prev.includes(status)
//         ? prev.filter((s) => s !== status)
//         : [...prev, status]
//     );

//   };
  
//   const filterCashadvances = (cashadvances) => {
//     return cashadvances.filter((cashadvance) =>
//       selectedStatuses.length === 0 ||
//       selectedStatuses.includes(cashadvance?.cashAdvanceStatus)
//     ).filter(cashadvance => 
//       JSON.stringify(cashadvance).toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   };
  
  
//   const getStatusCount = (status, cashadvance) => {
//     return cashadvance.filter((cashadvance) => cashadvance?.cashAdvanceStatus === status)?.length;
//   };
  
  
//   const disableButton = (status) => {
//     return ['draft', 'cancelled'].includes(status);
//   };

  
  
//   return (
//     <>
//      {isLoading && <Error message={loadingErrMsg}/>}
//      {!isLoading && 
//     <div className='min-h-screen '>
//        <TripMS visible={visible} setVisible={setVisible} src={cashAdvanceUrl}/>
//       <div className='flex-col w-full p-4 flex items-start gap-2'>
      
//       <div className='min-h-[120px] border border-slate-300 bg-white rounded-md  w-full flex flex-wrap items-start gap-2 px-2 py-2'>
      

//   <StatusFilter
//   statuses={["draft","pending approval", "pending settlement", "paid","rejected",  "cancelled", "paid and cancelled"]}
//   tripData={[...travelCashAdvances.flatMap(te => te?.cashAdvances), ...NonTRCashAdvances]}
// selectedStatuses={selectedStatuses}
// handleStatusClick={handleStatusClick}
// filter_icon={filter_icon}
// getStatusClass={getStatusClass}
// getStatusCount={getStatusCount}
// setSelectedStatuses={setSelectedStatuses}/>
//   <div className=''>
   
//    <Input placeholder="Search Cash Advance..." type="search" icon={search_icon} onChange={(value)=>setSearchQuery(value)}/>
//  </div>
// </div>
//         <div className='w-full flex md:flex-row flex-col '>
//           <div className='flex-1 rounded-md justify-center items-center'>
         
// <div className='relative  flex justify-center items-center  rounded-l-md   font-inter text-md text-white h-[52px] bg-indigo-600  text-center'>

// <div
// onClick={()=>setModalOpen(!modalOpen)}
// onMouseEnter={() => setTextVisible({cashAdvance:true})}
// onMouseLeave={() => setTextVisible({cashAdvance:false})}
// className={`absolute  left-0 ml-4 hover:px-2 w-6 h-6 hover:overflow-hidden hover:w-auto group text-indigo-600 bg-indigo-100 border border-white flex items-center justify-center  hover:gap-x-1 rounded-full cursor-pointer transition-all duration-300`}
// >
// <img src={plus_violet_icon} width={16} height={16} alt="Add Icon" />
// <p
// className={`${
// textVisible?.cashAdvance ? 'opacity-100 ' : 'opacity-0 w-0'
// } whitespace-nowrap text-xs transition-all duration-300 group-hover:opacity-100 group-hover:w-auto`}
// >
// Raise a Cash-Advance
// </p>
// </div>
  
             
//               <div className='flex justify-center items-center '>
//               <img src={money1} className='w-6 h-6 mr-2' />
//               <p>Travel Cash-Advances</p>
//               </div>

//             </div>




            
//       <div className='w-full  mt-4 xl:h-[570px] lg:h-[370px] md:[590px] overflow-y-auto px-2 bg-white rounded-l-md'>
//           {travelCashAdvances?.length > 0 ? travelCashAdvances?.map((trip) => { 
//             const filteredCashadvances = filterCashadvances(trip?.cashAdvances)
//             if (filteredCashadvances.length === 0) return null;
//             return(
//               <>
//               <CardLayout index={trip?.tripId}>
//             <div key={trip?.tripId} className='py-2 w-full'>
//           <TripName tripName={trip?.tripName}/>
//               {filteredCashadvances?.map((advance,index) => ( 
//                 <div key={index} className={`px-2 py-2 ${index < filteredCashadvances.length-1 && 'border-b border-slate-400 '}`}>
//                   <div className='flex justify-between'>
//                     <div className='flex flex-col justify-center max-w-[120px]'>
//                       <div className='font-medium text-sm font-cabin text-neutral-400'>Advance Amount</div>
//                       <div className='font-medium text-sm font-cabin text-neutral-700 '>
//   {advance.amountDetails.map((amount, index) => (
//     <div key={index}>
//       {`${amount.currency.shortName} ${formatAmount(amount.amount)}`}
//       {index < advance.amountDetails.length - 1 && <span>, </span>}
//     </div>
//   ))}
// </div> 
//     </div>
//       <div className='flex justify-center items-center gap-2'>
//                     <div className={`text-center rounded-sm ${getStatusClass(advance?.cashAdvanceStatus ?? "-")}`}>
//                        <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{advance?.cashAdvanceStatus ?? "-"}</p>
//                     </div>
//                     <div onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible(trip?.travelRequestId,  'ca-modify' ,advance?.cashAdvanceId,)}}} className={`w-7 h-7 bg-indigo-100 rounded-full border border-white flex items-center justify-center ${disableButton(trip?.travelRequestStatus)? ' cursor-not-allowed opacity-50' : ' cursor-pointer'}`}>
//                     <img src={modify} className='w-4 h-4' alt="modify_icon" />
//                     </div>
//                   </div>
//       </div>
//       </div>
// ))}
// </div>
// </CardLayout>
// </>

// )
//            }) : <EmptyBox icon={cashadvance_icon} text={'Travel Cash Advance'}/>}
//         </div>
//           </div>
//           <div className='flex-1 rounded-md'>
//             <div className='flex justify-center items-center rounded-r-md font-inter text-md text-white h-[52px] bg-indigo-600  text-center'>
//               <img src={money1} className='w-6 h-6 mr-2'/>
//               <p>Non-Travel Cash-Advances</p>
//             </div>
// <div className='w-full mt-4 xl:h-[570px] lg:h-[370px] md:[590px]  overflow-y-auto px-2 bg-white rounded-r-md'>
//             {/* THIS WILL BE USE AFTER IMPLEMENT THE NON TRAVEL CASH */}
//             {NonTRCashAdvances?.length >0 ? 
//             filterCashadvances(NonTRCashAdvances)?.map((cashAdvance,index) => (
//               <>
//               <CardLayout index={index}>
//               <div  className='py-2 w-full'>
//               <div className='flex gap-2 items-center'>
//               <img src={money} className='w-5 h-5'/>
//               <div className=''>
//                <div className='header-title'>Cash-Advance No.</div>
//                <p className='header-text'>{cashAdvance?.cashAdvanceNumber}</p>
//               </div>
//               </div>
              
//                 <div  className={`px-2 py-2`}>
//                   <div className='flex justify-between'>
//                     <div className='flex flex-col justify-center max-w-[120px]'>
//                       <div className='font-medium text-sm font-cabin text-neutral-400'>Advance Amount</div>
// <div className='font-medium text-sm font-cabin text-neutral-700'>
// {cashAdvance?.amountDetails.map((amount, index) => (
//     <div key={index}>
//       {`${amount?.currency?.shortName} ${formatAmount(amount.amount)}`}
//       {index < cashAdvance?.amountDetails.length - 1 && <span>, </span>}
//     </div>
//   ))}
// </div>
//       </div>
//         <div className='flex justify-center items-center gap-2 '>
//         <div className={`text-center rounded-sm ${getStatusClass(cashAdvance?.cashAdvanceStatus ?? "-")}`}>
//             <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{cashAdvance?.cashAdvanceStatus ?? "-"}</p>
//       </div>
//         <div  className='cursor-pointer w-7 h-7 bg-indigo-100 rounded-full border border-white flex items-center justify-center'>
//         <img src={modify} className='w-4 h-4' alt="Add Icon" />
//       </div>
//       </div>
//       </div>
//     </div>
              
//             </div>
//             </CardLayout>
//             </>
//           )) : <EmptyBox icon={cashadvance_icon} text={'Non-Travel Cash Advance'}/>}
//         </div>
//           </div>
//         </div>
//       </div>

//     <Modal 
//         isOpen={modalOpen} 
//         onClose={modalOpen}
//         content={<div className=' w-full h-auto'>
//           <div>
            
//               <div className='flex gap-2 justify-between items-center bg-indigo-100 w-full p-4'>
               
//                 <p className='font-inter text-base font-semibold text-indigo-600'>Raise a Cash-Advance</p>
//                 <div onClick={()=>{setModalOpen(!modalOpen);setTravelRequestId(null);setAdvanceType(null)}} className='bg-red-100 cursor-pointer rounded-full border border-white'>
//                 <img src={cancel} className='w-5 h-5'/>
//                 </div>
//               </div>
// <div className='p-4'>
//  <div className='flex md:flex-row flex-col justify-between gap-2 '>
//   <div onClick={()=>setAdvanceType("travel_Cash-Advance")} className={`cursor-pointer transition  duration-200 hover:bg-indigo-100 hover:rounded-md flex-1 flex gap-2 items-center justify-center ${advancetype === "travel_Cash-Advance" ? ' border-b-2 border-indigo-600 text-indigo-600' : 'border-b-2 border-white '}  p-4`}>
//     <img src={money} className='w-5 h-5'/>
//     <p className='truncate '>Travel Cash-Advance</p> 
//   </div>
           
//   <div onClick={()=>setAdvanceType("non-Travel_Cash-Advance")} className={`min-w-fit cursor-pointer transition  duration-200 hover:bg-indigo-100 hover:rounded-md flex-1  flex items-center justify-center gap-2 p-4 ${advancetype === "non-Travel_Cash-Advance" ? 'border-b-2 border-indigo-600 text-indigo-600': "border-b-2 border-white"}  `}>
//     <img src={money} className='w-5 h-5'/>
//     <p className=' shrink'>Non-Travel Cash-Advance</p>
//   </div>
  
//   </div>  

// <div className='flex gap-4 flex-col items-start justify-start w-full py-2'>
// { advancetype=== "travel_Cash-Advance" &&
//  <div className='w-full'>
//   <TripSearch placeholder={"Select the trip"} error={error?.travelRequestId} title="Apply to trip" data={travelData} onSelect={handleSelect} />
//  </div> }
  


// {advancetype &&  <Button1 text={"Raise"} onClick={handleRaise } />}

  
   


// </div>   
// </div>


 
   
            
//           </div>

//       </div>}
//       />
     


        
//     </div>}
//     </>
//   );
// };

// export default CashAdvance;




