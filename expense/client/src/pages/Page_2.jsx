import React, { useContext, useEffect, useState } from 'react';
import { useApi } from '../utils/contextApi'; 
import { airplane_1, calender, train, bus, arrow_left } from '../assets/icon';
import { titleCase, getStatusClass } from '../utils/handyFunctions';
import Modal from '../components/common/Modal';
import NotifyModal from '../components/common/NotifyModal';
import Page_1 from './Page_1';


const Page_2 = ({travelApprovalData}) => {
  const approvalData = useApi();
  const [loading, setLoading] = useState(true);
  const [loadingErrMsg, setLoadingErrMsg] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmationOverlay, setShowConfirmationOverlay] = useState(false);




  // useEffect(() => {
  //   // Simulating an async API call
  //   setTimeout(() => { 
  //     setLoading(false);
  //   }, 1000);
  // }, []);


  // useEffect(() => {
  //   console.log(travelApprovalData);
  
  //   if (travelApprovalData ) {
  //     // travelRequestData is an array, proceed with rendering
  //   } else {
  //     console.error("Invalid structure for travelApprovalData");
  //   }
  // }, [travelApprovalData]);
  
  // useEffect(() => {
  //   if (!loading && !travelApprovalData) {
  //     // There was an error, set an error message
  //     setLoadingErrMsg('Error fetching approval data. Please try again.');
  //   } else {
  //     // No error, clear the error message
  //     setLoadingErrMsg(null);
  //   }
  // }, [loading, travelApprovalData]);
  

  console.log(travelApprovalData.travelRequestData)







  return (
    <>
    {/* {loading && (
      <div className='min-w-screen min-h-screen flex justify-center items-center'>
        <span className="flex">
          <span className="animate-ping relative right-[-20px] h-5 w-5 rounded-full bg-sky-400 opacity-75"></span>
          <span className="absolute rounded-full h-5 w-5 bg-sky-500"></span>
        </span>
      </div>
    )} 
    {loadingErrMsg && !loading && <div>{loadingErrMsg}this is Error message</div>} */}

    {/* {!loading && !loadingErrMsg && (travelApprovalData) && */}
  
  {approvalData.map((approvalDetails, index)=>(
      <React.Fragment key={index}>
      
      
      <div className='justify-between w-full h-[65px] border-b-[1px] border-gray-100 flex flex-row gap-2 fixed bg-cover bg-white-100-100 px-8 shadow-lg'>
        {/* Back Button */}
        <div className='flex flex-row items-center'>
          <div className="flex h-[65px] px-2 py-3 items-center justify-center w-auto">
            <div className={`flex items-center px-3 pt-[6px] pb-2 py-3 rounded-[12px] cursor-pointer hover:text-red-800 text-medium bg-slate-100 font-medium tracking-[0.03em] text-gray-800`}>
              <img src={arrow_left} alt="Back" />
            </div>
          </div>
          {/* Trip ID */}
          <div className='trip-id text-gray-800 font-cabin text-[20px] font-semibold py-3 px-2 items-center justify-center'>
            <div className='flex justify-center items-center'>{approvalDetails.travelRequestId}</div>
          </div>
        </div>

        {/* Cancel Trip Button */}
        {approvalDetails.travelRequestStatus==='draft' && (
          <div className="flex h-[65px] px-2 py-3 items-center justify-center w-auto">
            <div onClick={("for modal")} className='flex items-center px-3 pt-[6px] pb-2 py-3 rounded-[12px] cursor-pointer hover:text-red-800 text-medium bg-slate-100 font-medium tracking-[0.03em] text-gray-800'>
              {titleCase('recover')}
            </div>
            {/* Modal for Cancel Confirmation */}
            <Modal 
            handleOperation={tripRecovery} 
            isOpen={isModalOpen} 
            onClose={"for close"} 
            // itineraryId={TravelRequestData.travelRequestId}
            content="Are you sure! you want to cancel the Trip?" 
            onCancel={'handle cancel'} 
            handleOpenOverlay={'handleOpenOverlay'}/>
          </div>
        )}
      </div>

      {/* Main Content */}
<div className='w-full min-h-screen p-[30px]'>
<div className='border text-gray-600 h-auto min-h-screen mt-[65px]'>
         
<div className='main info flex flex-col md:flex-row justify-between border-b-[1px] border-gray-100'>
  <div className='flex-col px-4 py-4'>
    {/* Trip Details */}
    <div className="flex h-auto max-w-[100%] items-center justify-start w-auto px-2">
      <div className="text-[20px] font-medium tracking-[0.03em] leading-normal text-gray-800 font-cabin truncate  lg:w-full">
      {/* {approvalDetails.embdedTravelRequest.tripPurpose} */}
      </div>
    </div>
    {/* Trip Duration */}
    <div className="flex h-auto w-auto max-w-fit items-center justify-start gap-2">
      <div className='pl-2'>
        <img src={calender} alt="calendar" width={16} height={16} />
      </div>
      <div className="tracking-[0.03em] font-normal leading-normal text-slate-600 text-sm">
        Duration: 24-Apr-2023 to 29-May-2025 --Hard Coded
      </div>
    </div>
  </div>
  {/* <div className=''> */}
    <div className='font-cabin px-6 py-4  '>
      <p className=''>
        <span>Request By:</span>
         {/* {approvalDetails.embdedTravelRequest.createdBy.name}  */}
      </p>
       {/*
      <p>
        <span>Created For:</span> {approvalDetails.embdedTravelRequest.teamMembers.length>0 ? "Team" : "Self"} 
      </p>
      <p>
        <span>Team Members:</span>{' '}
    {approvalDetails.embdedTravelRequest.teamMembers.length > 0 ? (
      approvalDetails.embdedTravelRequest.teamMembers.map((teamMember, index) => (
        <span key={index}>{index > 0 ? ', ' : ''}{teamMember.name}</span>
      ))
    ) : (
      'N/A'
    )}
       
      </p>
       */}
    </div>
  {/* </div>  */}
</div>
<div className='h-auto w-auto border border-black flex flex-row mt-4'>

 <Page_1/>
</div>


        </div>
      </div>

      <div>
      </div>
      {showConfirmationOverlay && (
        <NotifyModal/>
      )}

     
      </React.Fragment>
      ))}
    
      
       {/* } */}

      </>
   
  );
};

export default Page_2;


