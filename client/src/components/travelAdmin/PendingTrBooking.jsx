import React ,{useEffect, useState}from 'react';
import { getStatusClass , urlRedirection } from '../../utils/handyFunctions';
import {  calender_icon, cancel, double_arrow, loading } from '../../assets/icon'
import { useNavigate, useParams } from 'react-router-dom';

import axios from 'axios'
import { assignBusinessAdmin_API } from '../../utils/api';



const PendingTrBooking = ({department,trId,tripPurpose ,travelName,travelRequestId,travelRequestNumber,travelRequestStatus  ,employeeRole,isCashAdvanceTaken,assignedTo ,handleTravel}) => {

  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading]=useState(
  {set:false, id:null}
)
  const {tenantId}= useParams()
  console.log('admin111',employeeRole)
  const assignTo = {
    empId: employeeRole?.empId,
    name: employeeRole?.name,
  };
 
 const assignTo1={
          empId:null,
          name: null
         }

  const [isChecked, setIsChecked] = useState(false);
  const [assignedEmployeeName, setAssignedEmployeeName] = useState(null);

  useEffect(()=>{
    if(assignedTo?.empId===employeeRole?.empId){
      setIsChecked(true);
      setAssignedEmployeeName(assignedTo?.name)
    }
  },[])

  const handleCheckboxChange = async (assignedTo) => {   
    const data = {
      isCashAdvanceTaken,
      assignedTo
    }
   
    // if (isChecked) {
    //   setIsChecked(false);
    //   setAssignedEmployeeName(null);
    // }

    
    console.log('assignTo',assignTo)
    
   
      
      try {
        setIsUploading(prevState => ({...prevState, set:true, id:travelRequestId}))
       
        const response = await assignBusinessAdmin_API(tenantId,travelRequestId,data) 
        setIsChecked(true);
        setAssignedEmployeeName(employeeRole?.name);
        console.log('admin response',response)
        setIsUploading(prevState => ({...prevState, set:false, id:null}))
        if (isChecked) {
          setIsChecked(false);
          setAssignedEmployeeName(null);
        }
    
      } catch (error) { 
        console.error('Error fetching data:', error.message);
        setIsUploading(prevState => ({...prevState, set:false, id:null}))
      }
      
    
  };


  
  return (
    <div className="flex flex-row items-center justify-between   min-h-[56px] rounded-xl border-[1px] border-b-gray hover:border-indigo-600 shadow-md">
    <div className="flex h-[52px] items-center justify-start w-[221px] py-3 px-2">
   
     <div className=" rounded-[32px]   flex flex-row items-center justify-center  cursor-pointer">
  {isChecked ? (
    <>
    {/* <div className='flex items-center border justify-center flex-row text-neutral-700 px-2 py-1  rounded-sm'>
      <p className='text-sm font-cabin border'>
    {assignedEmployeeName}
    </p>
    {(isUploading?.set && isUploading?.id == travelRequestId) ? 
    <img src={loading} className='w-5 h-5 animate-spin'/> : 
    <img onClick={()=>handleCheckboxChange(assignTo1)} src={cancel} alt='cancel' className='w-5 h-5' />}
   
    </div> */}
     <div 
      className='flex items-center  justify-center flex-row text-neutral-700 px-2 py-1 rounded-sm relative'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p className='text-sm font-semibold text-indigo-600 font-cabin hover:opacity-50'>
        {assignedEmployeeName}
      </p>
      {isHovered && (
        <div className='absolute  inset-0  flex justify-center items-center'>
          {(isUploading?.set && isUploading?.id === travelRequestId) ?
                      <div onClick={() => handleCheckboxChange(assignTo1)} className='flex text-red-500 w-full  px-2 py-2 bg-red-50 rounded-md'> 
             <p>Remove</p> <img src={loading} className='w-5 h-5 animate-spin'/> 
            </div>: 
            <div onClick={() => handleCheckboxChange(assignTo1)} className='text-red-500  px-4 py-2 bg-red-50 rounded-md'>
              <p>Remove</p>
              </div>
              //  <img onClick={() => handleCheckboxChange(assignTo1)} src={cancel} alt='cancel' className='w-5 h-5 cursor-pointer' />
           
            }
        </div>
      )}
    </div>
    </>
  ) : (
    assignedTo?.empId===employeeRole?.employeeDetails?.empId || assignedTo?.empId===null ? <div className="font-bold text-[14px]  min-w-[72px] truncate w-auto max-w-[140px]   lg:truncate   h-[17px] text-purple-500 text-center">
    
    <input type="checkbox" onClick={()=>handleCheckboxChange(assignTo)} checked={isChecked} />
    </div> :  assignedTo?.name  
  )}
</div>

    </div> 

<div className='flex h-[52px] items-center justify-start w-[221px] py-3 px-2 '>
  <div>
      <p className='font-cabin font-normal  text-xs text-neutral-400'>Travel Request No.</p>
       <p className='lg:text-[14px] text-[16px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '>{travelRequestNumber}</p>
       </div>
</div>
  
      <div className="flex h-[52px] items-center justify-start w-[221px] py-3 px-2  ">
      <div>
        <p className='font-cabin font-normal text-xs text-neutral-400'>Trip Purpose</p>
        <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '> {tripPurpose}</p>
      </div>
    </div> 
{/* Trip Title  */}
<div className='flex h-[52px] items-center justify-start w-[221px] py-3 px-2 '>
  <div>
      <p className='font-cabin font-normal  text-xs text-neutral-400'>Allocation</p>
       <p className='lg:text-[14px] text-[16px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '>{department ? department : "-"}</p>
</div>
</div>
 {/* Status */}

 
 {/* View Details */}
<div className=" flex h-[52px] items-center justify-start w-[221px] py-3 px-2 ">
  <div onClick={()=>handleTravel(travelRequestId,isCashAdvanceTaken,"booking-view-tr")} className="font-bold text-[14px]   truncate    lg:truncate   h-[17px] text-purple-500 text-center">
        View Details
  </div>
</div>      
  </div>
  )
}

export default PendingTrBooking

