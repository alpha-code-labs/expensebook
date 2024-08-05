/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/display-name */
import { useState, useEffect} from "react";
import {BrowserRouter as Router, useParams,useNavigate} from 'react-router-dom';
import Icon from "../components/common/Icon";
import { formatDate, formattedTime, isoString, titleCase, urlRedirection } from "../utils/handyFunctions";
import Button from "../components/common/Button";
import Error from "../components/common/Error";
import PopupMessage from "../components/common/PopupMessage";
import CashAdvanceDetails from "../itinerary/CashAdvanceDetails";
import { double_arrow, calender, cab_purple as cab_icon, airplane_1 as airplane_icon, bus, validation_sym, violation_ySym_icon, user_icon, arrow_left, clock_icon, location_icon, material_hotel_icon, material_flight_icon, material_train_icon, material_bus_icon, material_cab_icon, material_carRental_icon, material_personalVehicle_icon} from "../assets/icon";
import Select from "../components/common/Select";
import ActionButton from "../components/common/ActionButton";
import { approveCashAdvanceApi, approveLineItemApi, approveTravelRequestApi, getTravelDataforApprovalApi, rejectCashAdvanceApi, rejectLineItemApi, rejectTravelRequestApi } from "../utils/api";
import Modal from "../components/common/Modal";
import { StatusBox, TripName } from "../components/common/TinyComponent";



export default function () {
    const navigate = useNavigate()
    const DASHBOARD_PAGE_URL = import.meta.env.VITE_DASHBOARD_PAGE_URL

    
   
    const {travelRequestId ,empId,tenantId} = useParams()
    const {isUploading , setIsUploading}= useState(false)
    
    const [showPopup, setShowPopup] = useState(false)
    const [message, setMessage] = useState(null)
    const [showModal, setShowModal] = useState(false)
   
    const [travelRequestStatus, setTravelRequestStatus] = useState('pending approval')

    const [isLoading, setIsLoading] = useState(true)
    const [loadingErrorMsg, setLoadingErrorMsg] = useState(null)
    const [data , setData]= useState(null)
    const [travelData , setTravelData]=useState(null)
    const [isCashAdvanceTaken, setIsCashAdvanceTaken] = useState(false)
    const [cashAdvanceData, setCashAdvanceData] = useState(null)

    const handleModalVisible = () => {
        setShowModal((prev) => (!prev));
    }

    const handleLineItemAction = (itnId, action)=>{
        if(action=='approved'){
            //handle approval
            console.log(itnId,action)
            approveLineItemApi("tenant123","emp123","trip123","iti123")
            window.location.href= DASHBOARD_PAGE_URL
        }
        if(action == 'rejected'){
            //handle rejection
            console.log(itnId,action)
            rejectLineItemApi("tenant123","emp123","trip123","iti123",{
                reason:"test"
            })
            window.location.href= DASHBOARD_PAGE_URL
        }
    }

//this is for server code to get data start
      
      useEffect(() => {
        const fetchData = async () => {
          try {
            console.log("page 3 my Params:", tenantId, empId, travelRequestId);
            const response = await getTravelDataforApprovalApi(tenantId, empId, travelRequestId);
            setData(response.data);  
            setIsLoading(false);
            console.log('travel data for approval fetched.');
          } catch (error) {
            console.log('Error in fetching travel data for approval:', error.message);
            setLoadingErrorMsg(error.message);
            setTimeout(() => {setLoadingErrorMsg(null);setIsLoading(false)},5000);
          }
        };
    
        fetchData(); 
    
      },[tenantId, empId , travelRequestId]);
      console.log('all data' , data)

     useEffect(() => {
        
        setIsCashAdvanceTaken(data?.travelRequestData?.isCashAdvanceTaken)
        if(data?.travelRequestData?.isCashAdvanceTaken){
            setCashAdvanceData(data && data?.cashAdvancesData)
        }
        setTravelData( data && data?.travelRequestData)

         setTravelRequestStatus(data && data?.travelRequestData?.travelRequestStatus)
        
      },[data])

//this is for server code to get data end



    // useEffect(() => {
        
    //     setIsLoading(false)
    //     setIsCashAdvanceTaken(travelTestingData.travelRequestData.isCashAdvanceTaken)
    //     if(travelTestingData.travelRequestData?.isCashAdvanceTaken){
    //         setCashAdvanceData(travelTestingData?.cashAdvancesData)
    //     }
    //     const travelRequestDetails = travelTestingData?.travelRequestData
    //     setTravelData({...travelRequestDetails})
    //     setTravelRequestStatus(travelRequestDetails.travelRequestStatus)
       
        
    //   },[])

   

      console.log('travel request data' , travelData)
      console.log('cashadvance data' ,  cashAdvanceData)
      console.log('travel request data' , isCashAdvanceTaken)
      console.log('travel request data' , travelRequestStatus)

      
      
    // useEffect(()=>{
    //     if(showCancelModal){
    //         document.body.style.overflow = 'hidden'
    //     }
    //     else{
    //         document.body.style.overflow = 'auto'
    //     }
    // },[showCancelModal])


    

    const [actionData , setActionData]=useState({})
    const rejectionOptions=['Too Many Violations', 'Budget Constraints','Insufficient Documents','Upcoming Project Deadline']
    const [selectedRejReason, setSelectedRejReason]=useState(null)
    const [error , setError] = useState({set: false , message:""})

    
    const handleAction=(itineraryId ,action)=>{

        handleModalVisible()
        const { travelRequestId,isCashAdvanceTaken,travelRequestStatus} = travelData;
        const apiData = {travelRequestId,itineraryId,isCashAdvanceTaken,action ,travelRequestStatus}
        setActionData(apiData)
      }
  
      console.log('actionData',actionData)

      const handleConfirm=async()=>{
        const { travelRequestId , itineraryId , isCashAdvanceTaken,action,travelRequestStatus}= actionData
        const rejectionReason = {rejectionReason :selectedRejReason}

         let api;
          if(action==='travel-approve'){
            api=approveTravelRequestApi(tenantId , empId, travelRequestId , isCashAdvanceTaken)
            console.log('travel api hit')
          }else if (action==="cashadvance-approve"){
            api= approveCashAdvanceApi(tenantId ,empId,travelRequestId ,itineraryId)
          }else if (action === "itinerary-approve"){
            api = approveLineItemApi(tenantId,empId,travelRequestId,itineraryId)
          }else if (action === 'travel-reject' && rejectionReason?.rejectionReason){
            api = rejectTravelRequestApi(tenantId,empId,travelRequestId,isCashAdvanceTaken,rejectionReason)
          }else if (action === 'itinerary-reject' && rejectionReason?.rejectionReason ){
            api = rejectLineItemApi(tenantId,empId,travelRequestId,itineraryId,rejectionReason)
          }else if( action === 'cashadvance-reject' && rejectionReason?.rejectionReason){
            api = rejectCashAdvanceApi(tenantId ,empId,travelRequestId,itineraryId,rejectionReason)
          }

    let validConfirm = true
     if((action === 'travel-reject' || action === 'cashadvance-reject' ||action === 'itinerary-reject') && selectedRejReason === null){
      setError({set:true,message:'Please select a reason'})
      validConfirm =false
     }else{
      setError({set:false,message:''})
     }
    if(validConfirm){
      try {
        // setIsLoading(true);
        // const response = await postTravelPreference_API({ tenantId, empId, formData });
       const response = await api
       console.log('responsemessage',response)
    //    setIsLoading(false)
       setShowPopup(true)
       setMessage(response)
        setTimeout(() => {setShowPopup(false);setIsLoading(false);setMessage(null),window.location.reload()},3000);
      } catch (error) {
        // setLoadingErrorMsg(`Please retry again : ${error.message}`); 
        setShowPopup(true)
        setMessage(error.message)
        setTimeout(() => {setIsLoading(false);setMessage(null);setShowPopup(false)},3000);
      }

      handleModalVisible()
      setActionData({})
      setSelectedRejReason(null)
    }
}




//---------------------for violations count----------------------------------
let totalViolations
if(travelData){
const {  itinerary: { flights, cabs, hotels, buses, trains  } } = travelData;
// const { travelRequestData: { itinerary: { flights, cabs, hotels, buses, trains } } } = travelTestingData;

const countTravelViolations = (items) => items.filter(item => item.violations && item.violations.class && item.violations.class.length > 0).length;

const violationsCounts = {
    flights: countTravelViolations(flights),
    cabs: countTravelViolations(cabs),
    hotels: countTravelViolations(hotels),
    buses: countTravelViolations(buses),
    trains: countTravelViolations(trains)
};
const totalTravelViolations = Object.values(violationsCounts).reduce((total, count) => total + count, 0);

console.log('Total violations:', totalTravelViolations);
//cash advance violations
const countViolations = (items) => items.filter(item => (item.violations && item.violations.class && item.violations.class.length > 0) || (item.cashAdvanceViolations && item.cashAdvanceViolations.length > 0)).length;

// Calculate violations count
const totalCashViolations = cashAdvanceData && countViolations( cashAdvanceData);
console.log('Total violations:', totalCashViolations);
totalViolations = totalTravelViolations +  totalCashViolations || 0;
}
  
///------------violations end
  return <>
      {isLoading && <Error message={loadingErrorMsg}/>}
      {!isLoading && 
        <div className="w-full h-full relative bg-white-100 lg:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none custom-scrollbar">
       
        <div className='w-full flex gap-2 justify-start lg:justify-start px-8 md:px-0 '>
        {/* <div className="flex items-center cursor-pointer " onClick={()=>(urlRedirection(`${DASHBOARD_PAGE_URL}/${tenantId}/${empId}/approval`))}>
        <img src={arrow_left} className="w-6 h-6"/>
      
      
      
       </div> */}
            <Icon/>
        </div>

       
        <div className="w-full h-full mt-10 p-10 font-cabin tracking-tight">
            <div className="flex justify-between">
            <div className='flex flex-col justify-between py-2'>
                <p className="text-2xl text-neutral-600 mb-5">{`${travelData?.tripPurpose}`}</p>

                    <TripName tripName={travelData?.tripName}/>

                {/* {travelRequestStatus === 'pending approval' && 
                <div className="flex gap-4">
                    <div >
                        <ActionButton text={titleCase('approve' )} onClick={()=>handleAction('','travel-approve')}/>
                    </div>
                    <div >
                        <ActionButton text={'Reject'}     onClick={()=>handleAction('','travel-reject')}/>
                    </div>
                    
                </div>} */}

                
             
            </div>

            <StatusBox status={travelData?.travelRequestStatus} />
            </div>
           
           
            <div className="border-y-[1px] border-slate-300 py-4">
<div className=" md:w-1/5 w-full  flex  border-[1px] border-slate-300 rounded-md flex-row items-center gap-2 p-2 ">
    <div className="bg-slate-200 rounded-full p-4 shrink-0 w-auto">
      <img src={user_icon} className="w-[22px] h-[22px] "/>
    </div>
   <div className='font-cabin '>
      <p className=" text-neutral-600 text-xs ">
        Created By
        </p>
    
    <p className="text-purple-500 capitalize">
        {travelData?.createdBy?.name}
    </p>
</div>
</div>
                {totalViolations>0 &&
                <div className="flex gap-2 font-inter text-md  tracking-tight">
                    <p className=" text-yellow-600 font-semibold fo">Warning Violations:</p>
                    <div className="bg-yellow-600  rounded-full px-2 text-center text-white-100"> <p className="text-center">{totalViolations ?? "-"}</p></div>
                   
                </div>}
                {/* <div className="flex gap-2 font-cabin text-xs tracking-tight">
                    <p className="w-[100px] text-neutral-600">Raised For:</p>
                    <p className="text-neutral-700">{travelData.createdFor?.name??'Self'}</p>
                </div>
                <div className="flex gap-2 font-cabin text-xs tracking-tight">
                    <p className="w-[100px] text-neutral-600">Team-members:</p>
                    <p className="text-neutral-700">{travelData.teamMembers.length>0 ? travelData.teamMembers.map(member=>`${member.name}, `) : 'N/A'}</p>
                </div> */}
            </div>
        
           

            <div className="mt-5 flex flex-col gap-4">

                {['flights', 'trains', 'buses', 'cabs', 'hotels'].map((itnItem, itnItemIndex)=>{
                        if(travelData?.itinerary[itnItem].length > 0){
                            return (
                                <div key={itnItemIndex}>
                                    <p className="text-xl text-neutral-700">
                                        {`${titleCase(itnItem)}`}
                                    </p>
                                    <div className='flex flex-col gap-1'>
                                        {travelData.itinerary[itnItem].map((item, itemIndex) => {
                                            if (['flights', 'trains', 'buses'].includes(itnItem)) {
                                                return (
                                                    <div key={itemIndex}>
                                                        <FlightCard 
                                                            violations={item?.violations}
                                                            handleAction={handleAction}
                                                            from={item.from} 
                                                            to={item.to} 
                                                            itnId={item.itineraryId}
                                                            handleLineItemAction={handleLineItemAction}
                                                            showActionButtons={travelRequestStatus!='pending approval' && item.status == 'pending approval'}
                                                            date={item.date} time={item.time} travelClass={item.travelClass} mode={titleCase(itnItem.slice(0, -1))} />
                                                    </div>
                                                );
                                            } else if (itnItem === 'cabs') {
                                                return (
                                                    <div key={itemIndex}>
                                                        <CabCard 
                                                       
                                                        violations={item?.violations}
                                                      
                                                        handleAction={handleAction}
                                                        itnId={item.itineraryId}
                                                        handleLineItemAction={handleLineItemAction}
                                                        showActionButtons={travelRequestStatus!='pending approval' && item.status == 'pending approval'} 
                                                        from={item.pickupAddress} to={item.dropAddress} date={item.date} time={item.time} travelClass={item.travelClass} isTransfer={item.type !== 'regular'} />
                                                    </div>
                                                );
                                            } else if (itnItem === 'hotels') {
                                                return (
                                                    <div key={itemIndex}>
                                                        <HotelCard    
                                                        violations={item?.violations}
                                                        handleAction={handleAction}
                                                        itnId={item.itineraryId}
                                                        handleLineItemAction={handleLineItemAction}
                                                        showActionButtons={travelRequestStatus!='pending approval' && item.status == 'pending approval'} 
                                                        checkIn={item.checkIn} checkOut={item.checkOut} date={item.data} time={item.time} travelClass={item.travelClass} mode='Train' />
                                                    </div>
                                                );
                                            }
                                        })}
                                    </div>
                                </div>
                            );
                        }
                        return null; // Return null if no items in the itinerary
                    })}
            </div>

            {isCashAdvanceTaken && 
            
            <div className="mt-5">
             
                <CashAdvanceDetails  travelRequestStatus={travelRequestStatus} handleAction={handleAction} cashAdvancesData={cashAdvanceData}/>

            </div>
            }
            
{/*             
            {showCancelModal && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
                <div className='z-10 max-w-4/5 w-2/5 min-h-4/5 max-h-4/5 scroll-none bg-white-100 rounded-lg shadow-md'>
                    <div className="p-10">
                        <p className="text-xl font-cabin">Are you sure you want to cancel?</p>
                        <div className="flex mt-10 justify-between">
                            <Button variant='fit' text='Yes, cancel it' onClick={()=>handleCancelItem(itemType, formId, itemIndex, isReturn)} />
                            <Button variant='fit' text='No' onClick={()=>setShowCancelModal(false)} />
                        </div>
                    </div>
                </div>
            </div>}  */}

            {/* {showModal && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
                <div className='z-10 max-w-4/5 sm:w-2/5 w-auto min-h-4/5 max-h-4/5 scroll-none bg-white-100  rounded-lg shadow-md'>
                    <div className="p-10">
                        <p className="text-xl text-center font-cabin text-neutral-600 ">Click on confirm for <span className="capitalize text-indigo-600">{actionData?.action}!</span></p>
                        { (actionData?.action === 'travel-reject' || actionData?.action === 'cashadvance-reject' ||actionData?.action === 'itinerary-reject') &&
                        <div className="mt-8">
                        <Select 
                            currentOption={selectedRejReason}
                            title='Please select the reason for reject'
                            placeholder='Select Reason'
                            options={rejectionOptions}
                            onSelect={(value)=>(setSelectedRejReason(value))}
                            error={error}
                        />
                        </div>}
                        <div className="flex md:flex-row flex-col mt-10 justify-between gap-4 ">
                            <div className="w-full">
                            <Button  text='Cancel' onClick={()=>{handleModalVisible();setActionData({});setError(null)}} />
                            </div>
                            <div className="w-full">
                            <Button  text='Confirm' onClick={handleConfirm} />
                            </div>
                           
                        </div>
                    </div>
                </div>
                </div>
            } */}

            <Modal showModal={showModal} setShowModal={setShowModal}>
            <div className="p-10 bg-white-100 rounded-md">
                        <p className="text-xl text-start font-cabin text-neutral-600 ">Click on confirm for <span className="capitalize text-indigo-600">{actionData?.action}!</span></p>
                        { (actionData?.action === 'travel-reject' || actionData?.action === 'cashadvance-reject' ||actionData?.action === 'itinerary-reject') &&
                        <div className="mt-10">
                        <Select 
                            currentOption={selectedRejReason}
                            title='Please select the reason for reject'
                            placeholder='Select Reason'
                            options={rejectionOptions}
                            onSelect={(value)=>(setSelectedRejReason(value))}
                            error={error}
                        />
                        </div>}
                        <div className="flex gap-10 justify-between mt-10">
                           
                            <Button  text='Cancel' onClick={()=>{handleModalVisible();setActionData({});setError(null)}} />
                           
                            <Button  text='Confirm' onClick={handleConfirm} />
                            
                        </div>
            </div>

            </Modal>
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
        return material_flight_icon
    else if(modeOfTransit === 'Train')
        return material_train_icon
    else if(modeOfTransit === 'Bus')
        return material_bus_icon
    else if(modeOfTransit === 'Cab')
        return material_cab_icon
    else if(modeOfTransit === 'Cab Rentals')
        return material_carRental_icon
    else if(modeOfTransit === 'Personal Vehicle')
        return material_personalVehicle_icon
}

// function FlightCard({violations,handleAction,from, to, date, time, travelClass, onClick, mode='Flight', showActionButtons, itnId, handleLineItemAction}){
                         
   


//     return(
//         <div className='border border-slate-300 rounded'>
//     <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
//     <img src={spitImageSource(mode)} className='w-4 h-4' />
//     <div className="w-full flex sm:block">
   
//         <div className='mx-2 text-xs text-neutral-600 flex justify-between flex-col sm:flex-row'>
//             <div className="flex-1">
//                 From     
//             </div>
//             <div className="flex-1" >
//                 To     
//             </div>

//             <div className="flex-1">
//                     Date
//             </div>
//             <div className="flex-1">
//                 Preffered Time
//             </div>
//             <div className="flex-1">
//                 Class/Type
//             </div>
            
//         </div>

//         <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
//             <div className="flex-1">
//                 {titleCase(from)}     
//             </div>
//             <div className="flex-1">
//                 {titleCase(to)}     
//             </div>
//             <div className="flex-1">
//                 {formatDate(date)}
//             </div>
//             <div className="flex-1">
//                 {time??'N/A'}
//             </div>
//             <div className="flex-1">
//                 {travelClass??'N/A'}
//             </div>
           
//         </div>
        
//     </div>
//  {showActionButtons &&
//     <div className={`flex items-center gap-2 px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] text-gray-600 cursor-pointer bg-slate-100 `} >
//         <div onClick={()=>handleAction(itnId,'itinerary-approve')}>
//             <ActionButton text={'Approve'}/>
//         </div>
//         <div onClick={()=>handleAction(itnId, 'itinerary-reject')}>
//             <ActionButton text={'Reject'}/>   
//         </div>   
//     </div>}
    
//     </div>
//     {violations?.class?.length > 0 && 
//    <div className="w-full h-auto bg-slate-100 rounded flex gap-2 text-yellow-500/80 px-4 py-2">
//     <img src={violation_ySym_icon} alt='validation'/>
    
//     <p className="font-inter text-normal ">{violations?.class}</p>
//     </div>}
    
    
//     </div>
//     )
// }


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


function FlightCard({from, to, date, returnDate, time, returnTime, travelClass, onClick, mode='Flight'}){
    return(
        <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
        <div className="flex flex-col justify-center">
          <img src={spitImageSource(mode)} className='w-4 h-4 md:w-6 md:h-6' />
        </div>
        <div className="w-full flex sm:block">
              <div className="mx-2 text-sm w-full flex gap-1 flex-col lg:flex-row lg:justify-between lg:items-center">
                  <div className='flex items-center gap-1 lg:justify-center flex-1'>
                      <div className="text-lg semibold">
                          {titleCase(from)}     
                      </div>
                      <img src={double_arrow} className="w-5"/>
                      <div className="text-lg semibold">
                          {titleCase(to)}     
                      </div>
                  </div>
                  <div className="flex-1 justify-center">
                      <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Departure Date</p>
                      <div className="flex items-center gap-1">
                          <img src={calender} className='w-4'/>
                          <p>{isoString(date)}</p>
                      </div>
                  </div>
                  {returnDate!=null && returnDate != undefined && 
                  <div className="flex-1 justify-center">
                      <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Return Date</p>
                      <div className="flex items-center gap-1">
                          <img src={calender} className='w-4'/>
                          <p>{isoString(returnDate)}</p>
                      </div>
                  </div>
                  }
  
                  <div className="flex-1 justify-center">
                      <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Prefferred Time</p>
                      <div className='flex items-center gap-1'>
                          <img src={clock_icon} className='w-4'/>
                          <p>{formattedTime(time)??'--:--'}</p>    
                      </div>
                  </div>
                
  
                  {returnTime!=null && 
                  <div className="flex-1 justify-center">
                      <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Retrun Time</p>
                      <div className='flex items-center gap-1'>
                          <img src={clock_icon} className='w-4'/>
                          <p>{formattedTime(returnTime)??'--:--'}</p>    
                      </div>
                  </div>
                  }
  
              </div>
          </div>
        
    </div>)
  }

// function HotelCard({violations,handleAction ,checkIn, checkOut, hotelClass, onClick, preference='close to airport,', showActionButtons, itnId, handleLineItemAction}){
//     return(
//         <div className='border border-slate-300 rounded'>
//     <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md  w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
//     <p className='font-semibold text-base text-neutral-600'>Hotel</p>
//     <div className="w-full flex sm:block">
//         <div className='mx-2 text-xs text-neutral-600 flex justify-between flex-col sm:flex-row'>
//             <div className="flex-1">
//                 Check-In  
//             </div>
//             <div className="flex-1" >
//                 Checkout
//             </div>
//             <div className="flex-1">
//                 Class/Type
//             </div>
//             <div className='flex-1'>
//                 Site Preference
//             </div>
//         </div>
     

//         <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
//             <div className="flex-1">
//                 {checkIn}     
//             </div>
//             <div className="flex-1">
//                 {checkOut}     
//             </div>
//             <div className="flex-1">
//                 {hotelClass??'N/A'}
//             </div>
//             <div className='flex-1'>
//                 {preference??'N/A'}
//             </div>
//         </div>

//     </div>
   

//     {showActionButtons && 
//     // onClick={onClick}
//     <div className={`flex items-center gap-2 px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] text-gray-600 cursor-pointer bg-slate-100 `} >
//         <div onClick={()=>handleAction(itnId,'itinerary-approve')}>
//             <ActionButton text={'approve'}/>
//         </div>
//         <div onClick={()=>handleAction(itnId, 'itinerary-reject')}>
//             <ActionButton text={'reject'}/>   
//         </div>   
//     </div>}
    

//     </div>
//     {violations?.class !== null && 
//         <div className="w-full h-auto bg-slate-100 rounded flex gap-2 text-yellow-500/80 px-4 py-2">
//         <img src={violation_ySym_icon} alt='validation'/>
        
//         <p className="font-inter text-normal ">{violations?.class}</p>
//         </div>}
//     </div>)
// }

// function CabCard({violations,handleAction,from, to, date, time, travelClass,  isTransfer=false, showActionButtons, itnId}){


    
    
//     return(
//        <div className='border border-slate-300 rounded'>
//     <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md  w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
//     <div className='font-semibold text-base text-neutral-600'>
//     <img src={cab_icon} className='w-4 h-4' />
//         <p className="text-xs text-neutral-500">{isTransfer? 'Transfer Cab': 'Cab'}</p>
//     </div>
//     <div className="w-full flex sm:block">
//         <div className='mx-2 text-xs text-neutral-600 flex justify-between flex-col sm:flex-row'>
//             <div className="flex-1">
//                 Pickup     
//             </div>
//             <div className="flex-1" >
//                 Drop    
//             </div>
//             <div className="flex-1">
//                     Date
//             </div>
//             <div className="flex-1">
//                 Preffered Time
//             </div>
//             {!isTransfer && <div className="flex-1">
//                 Class/Type
//             </div>}
//         </div>

//         <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
//             <div className="flex-1">
//                 {from??'not provided'}     
//             </div>
//             <div className="flex-1">
//                 {to??'not provided'}     
//             </div>
//             <div className="flex-1">
//                 {formatDate(date??'not provided')}
//             </div>
//             <div className="flex-1">
//                 {time??'N/A'}
//             </div>
//            {!isTransfer && <div className="flex-1">
//                 {travelClass??'N/A'}
//             </div>}
//         </div>
//     </div>
   
//     {showActionButtons && 
//     <div className={`flex items-center gap-2 px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] text-gray-600 cursor-pointer bg-slate-100`} >
//         <div onClick={()=>handleAction(itnId,'itinerary-approve')}>
//             <ActionButton text={'approve'}/>
//         </div>
//         <div onClick={()=>handleAction(itnId, 'itinerary-reject')}>
//             <ActionButton text={'reject'}/>   
//         </div>   
//     </div>}

//     </div>
    
//       {violations?.class?.length >0 && <div className="w-full h-auto bg-slate-100 rounded flex gap-2 text-yellow-500/80 px-4 py-2">
//         <img src={violation_ySym_icon} alt='validation'/>
        
//         <p className="font-inter text-normal ">{violations?.class}</p>
//         </div>}
//     </div>)
// }

function HotelCard({checkIn, checkOut, location, onClick}){
    return(
        <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
        <img src={material_hotel_icon} className="w-4 h-4 md:w-6 md:h-6"/>
        <div className="w-full flex sm:block">
            <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
            <div className="flex-1 justify-center">
                      <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">CheckIn Date</p>
                      <div className="flex items-center gap-1">
                          <img src={calender} className='w-4'/>
                          <p>{isoString(checkIn)}</p>
                      </div>
                  </div>
                  <div className="flex-1 justify-center">
                      <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">CheckOut Date</p>
                      <div className="flex items-center gap-1">
                          <img src={calender} className='w-4'/>
                          <p>{isoString(checkOut)}</p>
                      </div>
                  </div>
                  <div className='flex-1 justify-center'>
                      <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Location</p>
                      <div className="flex items-center gap-1">
                          <img src={location_icon} className='w-4'/>
                          <p>{location??'not provided'}</p>
                      </div>
                  </div>
            </div>
        </div>
    </div>)
  }

function CabCard({from, to, date, time, travelClass, onClick, mode, isTransfer=false}){
    return(
        <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
        <div className='font-semibold text-base text-neutral-600'>
        <img src={spitImageSource(mode)} className='w-4 h-4 md:w-6 md:h-6' />
        </div>
        <div className="w-full flex sm:block">
            
            <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
                <div className="flex-1 justify-center">
                   <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Pickup Location</p>
                    <div className="flex items-center gap-1">
                      <img src={location_icon} className="w-4 h-4"/>
                      <p className="whitespace-wrap">{from??'not provided'}</p>
                    </div>     
                </div>
                <div className="flex-1 justify-center">
                    <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Drop Location</p>
                    <div className="flex items-center gap-1">
                      <img src={location_icon} className="w-4 h-4"/>
                      <p className="whitespace-wrap">{to??'not provided'}</p>
                    </div>     
                </div>
                <div className="flex-1 justify-center">
                    <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">{mode} Date</p>
                    <div className="flex items-center gap-1">
                      <img src={calender} className="w-4 h-4"/>
                      <p className="whitespace-wrap">{isoString(date)??'not provided'}</p>
                    </div>
                </div>
                <div className="flex-1 justify-center">
                    <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Prefferred Time</p>
                    <div className="flex items-center gap-1">
                      <img src={clock_icon} className="w-4 h-4"/>
                      <p className="whitespace-wrap">{formattedTime(time)??'not provided'}</p>
                    </div>
                </div>
               {!isTransfer && <div className="flex-1 justify-center">
                    {travelClass??'N/A'}
                </div>}
            </div>
        </div>
    </div>)
  }