import React, { useEffect, useState } from 'react';
import { briefcase, cancel, cash_black_icon, cash_white_icon, cashadvance_icon, filter_icon, modify, money, money1, plus_violet_icon, search_icon } from '../assets/icon';
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
import { CardLayout, EmptyBox, StatusBox, StatusFilter, TripName,BoxTitleLayout,RaiseButton, ModifyBtn, TitleModal, TabTitleModal } from '../components/common/TinyComponent';

const CashAdvance = ({searchQuery,isLoading, fetchData, loadingErrMsg}) => {

  const [cashAdvanceUrl , setCashAdvanceUrl]=useState(null) 
  const [visible, setVisible]=useState(false) 
  const [travelRequestId , setTravelRequestId]=useState(null) 
  const [advancetype , setAdvanceType]=useState(null) 
  const [textVisible,setTextVisible]=useState({cashAdvance:false}) 
  const [modalOpen , setModalOpen]=useState(false) 

  const [error , setError]= useState({
    travelRequestId: {set:false, message:""}
  }) 

  const { employeeData, setPopupMsgData ,initialPopupData} = useData();
  const [travelData, setTravelData]=useState([]);
  const [cashAdvanceData, setCashAdvanceData]=useState([]);

  const {tenantId,empId,page}= useParams();

  useEffect(()=>{

    fetchData(tenantId,empId,page)

  },[])



  useEffect(() => {
    setTimeout(() => {
    if (employeeData?.length!==0) {
      

      const data = employeeData?.dashboardViews?.employee?.overview || [];
      const travelData = data?.allTravelRequests?.allTravelRequests || [];
      const upcomingTrips = data?.upcomingTrips || [];
      const intransitTrips = data?.transitTrips || [];
  
      const dataForRaiseCashadvance = [...intransitTrips, ...upcomingTrips,...travelData,  ];
      const pushedData = dataForRaiseCashadvance?.map(item => ({ ...item }));

      setTravelData(pushedData);
      setCashAdvanceData(employeeData?.dashboardViews?.employee?.cashAdvance);
      console.log('Travel data for raise advance:', employeeData);

    } else {
      console.error('Employee data is missing.1');
    }},2000)

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
          //window.location.href = window.location.href;
          fetchData()
        }
        else if(event.data.popupMsgData)
          {
            const expensePopupData = event.data.popupMsgData;
            setPopupMsgData(expensePopupData)
             setTimeout(() => {
              setPopupMsgData(initialPopupData); 
            }, 5000);
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
     
      
      
      <div className=' shrink-0 border border-slate-100 rounded-md  w-full flex flex-wrap items-start gap-2 px-2 py-2'>
      

  <StatusFilter 
  statuses={["draft","pending approval", "pending settlement", "paid","rejected",  "cancelled", "paid and cancelled"]}
  tripData={[...travelCashAdvances.flatMap(te => te?.cashAdvances), ...NonTRCashAdvances]}
  selectedStatuses={selectedStatuses}
  handleStatusClick={handleStatusClick}
  filter_icon={filter_icon}
  getStatusClass={getStatusClass}
  getStatusCount={getStatusCount}
  setSelectedStatuses={setSelectedStatuses}/>
  {/* <div className=''>
   <Input placeholder="Search Cash Advance..." type="search" icon={search_icon} onChange={(value)=>setSearchQuery(value)}/>
 </div> */}
</div>

<div className=' flex flex-col md:flex-row flex-grow w-full overflow-y-auto overflow-hidden scrollbar-hide gap-1  mt-2'>
<div className='w-full md:w-1/2  flex flex-col'>
         
<div className='px-2 shrink-0  flex justify-start items-center  rounded-md   font-inter text-base text-neutral-900 bg-gray-200/10 h-[52px]   text-center'>
    <div className='flex justify-center text-base items-center '>
      <img src={cash_white_icon} className='w-6 h-6 mr-2' />
      <p>Travel Cash-Advances</p>
    </div>
</div>   
            <div className='w-full h-full mt-4  overflow-y-auto px-2 bg-white rounded-l-md'>
          {travelCashAdvances?.length > 0 ? travelCashAdvances?.map((trip,mainIndex) => { 
            const filteredCashadvances = filterCashadvances(trip?.cashAdvances)
            if (filteredCashadvances.length === 0) return null;
            return(
              <>
              <CardLayout key={mainIndex+"ca11"}>
            <div  key={mainIndex} className='py-2 w-full'>
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
                    <StatusBox status={advance?.cashAdvanceStatus ?? "-"}/>
                    {!['paid'].includes(advance?.cashAdvanceStatus) &&
                    
                    <ModifyBtn onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible(trip?.travelRequestId,  'ca-modify' ,advance?.cashAdvanceId,)}}}/>
                    }  
                  </div>
      </div>
      </div>
))}
</div>
</CardLayout>
</>

)}) : <EmptyBox icon={cash_white_icon } text={'Travel Cash Advance'}/>}
        </div>
          </div>
          <div className='w-full md:w-1/2  flex flex-col'>

{/* <div className='relative px-2 shrink-0  flex justify-start items-center  rounded-md   font-inter text-md text-white h-[52px] bg-gray-200/10  text-center'>
<div className='flex shrink-0 justify-center items-center rounded-r-md font-inter text-md text-base text-neutral-900 h-[52px] text-center'>
              <img src={cash_white_icon} className='w-6 h-6 mr-2'/>
              <p>Non-Travel Cash-Advances</p>
</div>
            <div
onClick={()=>setModalOpen(!modalOpen)}
onMouseEnter={() => setTextVisible({cashAdvance:true})}
onMouseLeave={() => setTextVisible({cashAdvance:false})}
className={`absolute  right-4 ml-4 hover:px-2 w-6 h-6 hover:overflow-hidden hover:w-auto group text-neutral-900 bg-slate-100 border border-white font-inter flex items-center justify-center  hover:gap-x-1 rounded-full cursor-pointer transition-all duration-300`}
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

            </div> */}

            <BoxTitleLayout title={"Non-Travel Cash-Advances"} icon={cash_white_icon}>
            <RaiseButton  
          onClick={()=>setModalOpen(!modalOpen)}
         
          text={'Cash-Advance'}
          textVisible={'textVisible?.expense'}
          />

            </BoxTitleLayout>
           

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
       <ModifyBtn onClick={()=>console.log('non travel ca')}/>
      </div>
      </div>
    </div>
              
            </div>
            </CardLayout>
            </>
          )) : <EmptyBox icon={cash_white_icon} text={'Non-Travel Cash Advance'}/>}
        </div>
          </div>
        </div>

    <Modal 
        isOpen={modalOpen} 
        onClose={modalOpen}
        content={<div className=' w-full h-auto'>
          <div>
              
              <TitleModal onClick={()=>{setModalOpen(!modalOpen);setTravelRequestId(null);setAdvanceType(null)}} text={'Raise a Cash-Advance'}/>
<div className='p-4'>
 <div className='flex md:flex-row flex-col justify-between gap-2 '>

           
  <TabTitleModal text={"Travel Cash-Advance"} onClick={()=>setAdvanceType("travel_Cash-Advance")} icon={cash_white_icon} selectedTab={advancetype === "travel_Cash-Advance"}/>
  <TabTitleModal text={"Non-Travel Cash-Advance"} onClick={()=>setAdvanceType("non-Travel_Cash-Advance")} icon={cash_white_icon} selectedTab={advancetype === "non-Travel_Cash-Advance"}/>
  
  </div>  

<div className='flex gap-4 flex-col items-start justify-start w-full py-2'>
{ advancetype=== "travel_Cash-Advance" &&
 <div className='w-full'>
  <TripSearch requestType={advancetype} placeholder={"Select the trip"} error={error?.travelRequestId} title="Apply to trip" data={travelData} onSelect={handleSelect} />
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

