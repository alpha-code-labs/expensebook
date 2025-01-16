import React, { useEffect, useState } from 'react';
import { briefcase, modify, receipt, receipt_icon1,expense_white_icon, categoryIcons, filter_icon, plus_violet_icon, cancel, search_icon, info_icon, expene_icon } from '../assets/icon';
import { formatAmount, getStatusClass, splitTripName, tripsAsPerExpenseFlag } from '../utils/handyFunctions';
import { handleNonTravelExpense, handleTravelExpense } from '../utils/actionHandler';
import Modal from '../components/common/Modal1';
import { useParams } from 'react-router-dom';
import { useData } from '../api/DataProvider';
import TripSearch from '../components/common/TripSearch';
import Button1 from '../components/common/Button1';
import Error from '../components/common/Error';
import Input from '../components/common/SearchInput';
import { CardLayout, EmptyBox, ExpenseLine, StatusBox, StatusFilter, TripName,RaiseButton,BoxTitleLayout, ModifyBtn, TitleModal, TabTitleModal } from '../components/common/TinyComponent';
import ExpenseMS from '../microservice/Expense';
import { act } from 'react';


const Expense = ({searchQuery, isLoading, fetchData, loadingErrMsg}) => {
  const expenseBaseUrl = import.meta.env.VITE_EXPENSE_PAGE_URL;

  const [tripId , setTripId]=useState(null);
  const [expenseType , setExpenseType]=useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const [modalOpen , setModalOpen]=useState(false);
  const [tripData, setTripData]=useState([]);
  const {tenantId,empId,page}= useParams();
  const { employeeData, requiredData, setPopupMsgData,setMicroserviceModal, initialPopupData } = useData();
  const [error , setError]= useState({
    tripId: {set:false, message:""}
  }); 

  const [expenseData , setExpenseData] = useState({});
  const [expenseVisible, setExpenseVisible]=useState(false);
  const [iframeURL, setIframeURL] = useState(null); 

  
  useEffect(()=>{

    fetchData(tenantId,empId,page)

  },[])
  


  useEffect(()=>{
    const data = employeeData?.dashboardViews?.employee?.overview || [];
    const intransitTrips = data?.transitTrips || [];
    const completedTrips = employeeData?.dashboardViews?.employee?.expense?.completedTrips || []

    const dataForRaiseCashadvance = [...tripsAsPerExpenseFlag(intransitTrips,requiredData), ...completedTrips];
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
  };

  const handleVisible = (data) => {
    let { urlName} = data;
    setExpenseVisible(!expenseVisible)
    console.log('iframe url',  urlName);
    setIframeURL(urlName);
    
  };

  const handleRaise = () => {
    if (expenseType=== "travel_Expense") {
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
          //window.location.href = window.location.href;
          fetchData()
          
        }

       else if(event.data.popupMsgData)
        {
          const expensePopupData = event.data.popupMsgData;
          setPopupMsgData(expensePopupData)
          if(expensePopupData?.autoSkip === undefined)
          {
            setTimeout(() => {
              setPopupMsgData(initialPopupData); 
            }, 5000);
          } 
        } 
       else if(event.data.ocrMsgData)
        {
          const ocrPopupData = event.data.ocrMsgData;
          setMicroserviceModal(ocrPopupData);
          // if(ocrPopupData?.autoSkip === undefined)
          // {
          //   setTimeout(() => {
          //     setMicroserviceModal(initialPopupData); 
          //   }, 5000);
          // }
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
                if (filteredTripExpenses.length === 0) return null; 
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
                            {/* {!['paid','paidAndDistributed'].includes(trExpense?.expenseHeaderStatus) && */}
                            <ModifyBtn text={['paid','paidAndDistributed'].includes(trExpense?.expenseHeaderStatus)? "View Details": "Modify"} onClick={()=>handleVisible({urlName:handleTravelExpense({tenantId,empId,tripId:trip?.tripId,expenseHeaderId: trExpense?.expenseHeaderId, action: 'trip-ex-modify' })})}/>
                            {/* // } */}
                            
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
                     
                      
                      <ModifyBtn text={['paid','paidAndDistributed'].includes(nonTravelExp?.expenseHeaderStatus) ? "View Details" : "Modify"}  onClick={() => handleVisible({urlName:handleNonTravelExpense({tenantId,empId ,expenseHeaderId:nonTravelExp?.expenseHeaderId,action:"non-tr-ex-modify"})})}/>
                      
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
      
<TitleModal text={'Raise an Expense'} onClick={()=>{setModalOpen(!modalOpen);setTripId(null);setExpenseType(null)}}/>
<div className='p-4'>
<div className='flex md:flex-row flex-col justify-between gap-2'>
 
  <TabTitleModal text={"Travel Expense"} onClick={()=>setExpenseType("travel_Expense")} icon={expense_white_icon} selectedTab={expenseType === "travel_Expense"}/>
  <TabTitleModal text={"Non-Travel Expense"} onClick={()=>setExpenseType("non-Travel_Cash-Advance")} icon={expense_white_icon} selectedTab={expenseType === "non-Travel_Cash-Advance"}/>
  </div>  
  

<div className='flex gap-4 flex-col items-start justify-start w-full py-2'>
{ expenseType=== "travel_Expense" &&
 <div className='w-full'>
  <TripSearch requestType={expenseType} validation={requiredData?.formValidations ?? {}} placeholder={"Select the trip"} error={error?.tripId} title="Apply to trip" data={tripData} onSelect={handleSelect} />
 </div> }
  


{expenseType && <Button1 text={"Raise"} onClick={handleRaise} />}

  
   


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
