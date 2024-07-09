import React, { useEffect, useState } from 'react';
import { briefcase, cancel, modify, money, money1, plus_violet_icon } from '../assets/icon';
import { formatAmount, getStatusClass } from '../utils/handyFunctions';
import {TRCashadvance,NonTRCashAdvances} from '../utils/dummyData'
import Modal from '../components/Modal';
import TripSearch from '../components/common/TripSearch';
import Button1 from '../components/common/Button1';
import { handleCashAdvance } from '../utils/actionHandler';
import TravelMS from './TravelMS';

const CashAdvance = () => {
  const [cashAdvanceUrl , setCashAdvanceUrl]=useState(null)
  const [visible, setVisible]=useState(false)// for iframe
  const [travelRequestId , setTravelRequestId]=useState(null)
  const [advancetype , setAdvanceType]=useState(null)
  const [textVisible,setTextVisible]=useState({cashAdvance:false}) //for icon text
  const [modalOpen , setModalOpen]=useState(false)
  const [error , setError]= useState({
    travelRequestId: {set:false, message:""}
  })
 
  const tripsAndTr= [

    {
      "travelRequestId": "667a8a108daacf93aefcc2cxs",
      "travelRequestNumber": "TRAL000032",
      "tripName":"us - del - mum - gkr"
    },
    {
      "travelRequestId": "667a8a108daacf93aefcc2ex",
      "travelRequestNumber": "TRAL000012",
       "tripName":"san-lkw"
    },
    {
      "tripId": "667a8a108daacf93aefcc2sa",
      "tripNumber": "TRIPAL000033",
      "tripName":"nag-aur-hyd"
    },
    {
      "travelRequestId": "667a8a108daacf93aefcc2egf",
      "travelRequestNumber": "TRAL000038",
      "tripName":"us - del - mum - gkr"
    },
    {
      "travelRequestId": "667a8a108daacf93aefcc2xs",
      "travelRequestNumber": "TRAL000012",
       "tripName":"san-lkw"
    },
    {
      "tripId": "667a8a108daacf93aefcc2nbv",
      "tripNumber": "TRIPAL000001",
      "tripName":"nag-aur-hyd"
    }
  ]

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

///cashadvance iframe

const handleVisible= (travelRequestId  ,action,)=>{

  setVisible(!visible);
  let url ;
  if (action==="ca-create"){
    url=handleCashAdvance(travelRequestId, "", 'ca-create')
    console.log('url',url)
    
  }
  else if (action==="non-tr-ca-create"){
    url=handleCashAdvance("", 'non-tr-ca-create');
   
  }
  else {
    throw new Error('Invalid action');
  }
  
  setCashAdvanceUrl(url)
}



  useEffect(() => {
    const handleMessage = event => {
      console.log(event)
      // Check if the message is coming from the iframe
      if (event.origin === cashAdvanceUrl ) {
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


  //disable by status
function disableButton(status){
  return ['draft','cancelled'].includes(status);
}

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

  return (
    <div className='min-h-screen'>
       <TravelMS visible={visible} setVisible={setVisible} src={cashAdvanceUrl}/>
      <div className='flex-col w-full p-4 flex items-start'>
      
        <div className='min-h-[120px] border w-full'>
          for filter and other
        </div>
        <div className='w-full flex md:flex-row flex-col'>
          <div className='flex-1 justify-center items-center'>
         
<div className='relative  flex justify-center items-center  rounded-l-md   font-inter text-md text-white-100 h-[52px] bg-indigo-600  text-center'>

<div
onClick={()=>setModalOpen(!modalOpen)}
onMouseEnter={() => setTextVisible({cashAdvance:true})}
onMouseLeave={() => setTextVisible({cashAdvance:false})}
className={`absolute  left-0 ml-4 hover:px-2 w-6 h-6 hover:overflow-hidden hover:w-auto group text-indigo-600 bg-indigo-100 border border-white-100 flex items-center justify-center  hover:gap-x-1 rounded-full cursor-pointer transition-all duration-300`}
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
  
             
              <div className='flex justify-center items-center'>
              <img src={money1} className='w-6 h-6 mr-2' />
              <p>Travel Cash-Advances</p>
              </div>

            </div>




            
      <div className='w-full mt-4 xl:h-[570px] lg:h-[370px] md:[590px] overflow-y-auto px-2'>
          {TRCashadvance.map((trip) => (
            <div key={trip.tripId} className='mb-4 rounded-md shadow-custom-light bg-white-100 p-4'>
              <div className='flex gap-2 items-center '>
              <img src={briefcase} className='w-4 h-4'/>
              <div className='font-medium font-cabin text-md  uppercase'>
               {trip.tripName.join(' - ')}
              </div>
              </div>
              {trip.cashAdvances.map((advance,index) => (
                <div key={index} className={`px-2 py-2 ${index < trip.cashAdvances.length-1 && 'border-b border-slate-400 '}`}>
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
                    <div className='flex justify-center items-center gap-2 '>
                    <div className={`text-center rounded-sm ${getStatusClass(advance?.cashAdvanceStatus ?? "-")}`}>
                       <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{advance?.cashAdvanceStatus ?? "-"}</p>
                    </div>
                    <div onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleCashAdvance(trip?.travelRequestId, advance?.cashAdvanceId, 'ca-modify')}}} className={`w-7 h-7 bg-indigo-100 rounded-full border border-white-100 flex items-center justify-center ${disableButton(trip?.travelRequestStatus)? ' cursor-not-allowed opacity-50' : ' cursor-pointer'}`}>
                    <img src={modify} className='w-4 h-4' alt="modify_icon" />
                  </div>
                  </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
          </div>
          <div className='flex-1'>
            <div className='flex justify-center items-center rounded-r-md font-inter text-md text-white-100 h-[52px] bg-indigo-600  text-center'>
              <img src={money1} className='w-6 h-6 mr-2' />
              <p>Non-Travel Cash-Advances</p>
            </div>
<div className='w-full mt-4 xl:h-[570px] lg:h-[370px] md:[590px] overflow-y-auto px-2'>
            {NonTRCashAdvances.map((cashAdvance,index) => (
              <div key={`${index}nonTr`} className='mb-4 rounded-md shadow-custom-light bg-white-100 p-4'>
              <div className='flex gap-2 items-center'>
              <img src={money} className='w-5 h-5'/>
              <div className='font-medium font-cabin text-md'>
                <div className='text-neutral-400 text-sm'>Cash-Advance No.</div>
               <p className='text-neutral-700 text-base'>{cashAdvance?.cashAdvanceNumber}</p>
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
                    <div  className='cursor-pointer w-7 h-7 bg-indigo-100 rounded-full border border-white-100 flex items-center justify-center'>
                    <img src={modify} className='w-4 h-4' alt="Add Icon" />
                  </div>
                  </div>
                  </div>
                </div>
              
            </div>
          ))}
        </div>
          </div>
        </div>
      </div>

    <Modal 
        isOpen={modalOpen} 
        onClose={modalOpen}
        content={<div className=' w-full h-auto'>
          <div>
            
              <div className='flex gap-2 justify-between items-center bg-indigo-100 w-full p-4'>
               
                <p className='font-inter text-base font-semibold text-indigo-600'>Raise Cash-Advance</p>
                <div onClick={()=>{setModalOpen(!modalOpen);setTravelRequestId(null);setAdvanceType(null)}} className='bg-red-100 cursor-pointer rounded-full border border-white-100'>
                <img src={cancel} className='w-5 h-5'/>
                </div>
              </div>
<div className='p-4'>
 <div className='flex md:flex-row flex-col justify-between gap-2 '>
 <div onClick={()=>setAdvanceType("travel_Cash-Advance")} className={`cursor-pointer transition  duration-200 hover:bg-indigo-100 hover:rounded-md flex-1 flex gap-2 items-center justify-center ${advancetype === "travel_Cash-Advance" ? ' border-b-2 border-indigo-600 text-indigo-600' : 'border-b-2 border-white-100 '}  p-4`}>
    <img src={money} className='w-5 h-5'/>
    <p className='truncate '>Travel Cash-Advance</p> 
  </div>
           
  <div onClick={()=>setAdvanceType("non-Travel_Cash-Advance")} className={`cursor-pointer transition  duration-200 hover:bg-indigo-100 hover:rounded-md flex-1  flex items-center justify-center gap-2 p-4 ${advancetype === "non-Travel_Cash-Advance" ? 'border-b-2 border-indigo-600 text-indigo-600': "border-b-2 border-white-100"}  `}>
    <img src={money} className='w-5 h-5'/>
    <p className='truncate  shrink'>Non-Travel Cash-Advance</p>
  </div>
  
  </div>  

<div className='flex gap-4 flex-col items-start justify-start w-full py-2'>
{ advancetype=== "travel_Cash-Advance" &&
 <div className='w-full'>
  <TripSearch placeholder={"Select the trip"} error={error?.travelRequestId} title="Apply to trip" data={tripsAndTr} onSelect={handleSelect} />
 </div> }
  


{advancetype &&  <Button1 text={"Raise"} onClick={handleRaise } />}

  
   


</div>   
</div>


 
   
            
          </div>

      </div>}
      />
     


        
    </div>
  );
};

export default CashAdvance;







// import React, { useState ,useEffect} from 'react';
// import { useData } from '../api/DataProvider';
// import { getStatusClass ,titleCase} from '../utils/handyFunctions';
// import { Alltrips } from '../components/trips/Alltrips';
// import { receipt, chevron_down, calender, double_arrow , three_dot ,validation_sym, down_left_arrow, money} from '../assets/icon';
// import Dropdown from '../components/common/Dropdown';
// import RejectedCA from '../components/cashAdvance/RejectedCA';
// import { useParams } from 'react-router-dom';
// import Error from '../components/common/Error';
// // import CashAdvance from '../components/settlement/CashAdvance';

// const CashAdvance = ({isLoading ,fetchData,loadingErrMsg}) => {  
//   const {tenantId,empId,page}= useParams();
//   useEffect(()=>{

//     fetchData(tenantId,empId,page)

//   },[])
//   const { employeeData } = useData();

//   const [cashAdvanceData,setCashAdvanceData]=useState(null)

//   useEffect(()=>{
//     const cashAdvances = employeeData && employeeData?.dashboardViews?.employee

    
//     setCashAdvanceData(cashAdvances)
//   },[employeeData])
//   console.log('cashdata from cashadvance',cashAdvanceData?.rejectedCashAdvances)

 

 
    


    
//   return (
//     <>
//      {isLoading && <Error message={loadingErrMsg}/>}
 
//  {!isLoading && 
      
//       <div className="w-auto min-h-screen  flex flex-col items-center px-2 lg:px-10 xl:px-20  pt-[50px] bg-slate-100   ">
//         {/* <div className='relative w-fit mb-2 border border-indigo-600 px-2 py-2'>
//        {cashAdvanceData?.rejectedCashAdvances?.length > 0 &&  <div className=' absolute right-0  top-[-8px] w-fit p-[6px] bg-green-200 border border-white-100 rounded-full '/>}
//         <div className={`cursor-pointer py-1 px-2 w-fit min-w-[100px]  font-medium rounded-xl bg-purple-500 text-xs text-gray-900 truncate`}
//                   // onClick={() => handleScreenChange('Rejected Cash Advances')}
//                 >
//                 Rejected Cash Advances
//         </div>
//         </div> */}
        
//           <div className="w-full  bg-white-100  h-auto lg:h-[581px] rounded-lg border-[1px] border-slate-300 shrink-0 font-cabin mt-3 sm:mt-[60px] ">          
//            <>
//            <div className="w-auto h-6 flex flex-row gap-3 sm:px-8 px-4 mt-7 items-center ">
//       <img className="w-6 h-6" src={money} alt="receipt" />
//       <div className="text-base tracking-[0.02em] font-bold w-auto">Rejected Cash-Advances</div>
//     </div>
//     <div className="box-border mx-4  mt-[46px] w-auto    border-[1px]  border-b-gray "/>
//     <div className='h-[420px] overflow-auto mt-6 w-auto flex flex-col items-center mx-8'>  
//            <RejectedCA rejectedCashAdvance={cashAdvanceData?.rejectedCashAdvances}/>
//            </div>
//           </>          
//         </div>
       
//         </div>}
//     </>
//   );
// };

// export default CashAdvance;

