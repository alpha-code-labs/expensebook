import React ,{useEffect, useState}from 'react';
import { getStatusClass , urlRedirection } from '../../utils/handyFunctions';
import {  calender, cancel, double_arrow, loading } from '../../assets/icon'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'
import { assignCashSettle_API } from '../../utils/api';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '../common/Modal';


const SettleCashAdvance = ({ travelDetails, employeeRole}) => {
const [isHovered, setIsHovered] = useState(false);
const [isUploading, setIsUploading]=useState({set:false, id:null})
const [isChecked, setIsChecked] = useState(false);
const [assignedEmployeeName, setAssignedEmployeeName] = useState(null);
const [isSettled, setIsSettled] = useState(false);
const [showModal, setShowModal] = useState(false);


const {tenantId}= useParams()
console.log('employeeRole from SettlingCashAdvance',employeeRole)
console.log("got i got 14", travelDetails)
const {actionedUpon, amountDetails, travelRequestId,cashAdvanceStatus, createdBy,paidBy, cashAdvanceId,} = {...travelDetails}
const {name} = createdBy

const employeeAssigned = {
    empId: employeeRole?.empId,
    name: employeeRole?.name,
};

console.log("employeeAssigned", employeeAssigned)
const employeeNotAssigned={
        empId:null,
        name: null
        }


useEffect(()=>{
    if(paidBy?.empId===employeeRole?.empId){
    setIsChecked(true);
    setAssignedEmployeeName(paidBy?.name)
    }
},[])

const handleCheckboxChange = () => {
  if (isChecked) {
    setIsChecked(false);
    setAssignedEmployeeName(null);
  } else {
    setIsChecked(true);
    setAssignedEmployeeName(employeeRole?.name);
  }
};

const handleCashAdvance = async (paidBy) => {   
    const data = {
    paidBy
    }
    try {
        setIsUploading(prevState => ({...prevState, set:true, id:travelRequestId}))
        const response = await assignCashSettle_API(tenantId,travelRequestId,cashAdvanceId,data) 
        setIsChecked(true);
        setAssignedEmployeeName(employeeRole?.name);
        console.log('admin response',response)
        setIsUploading(prevState => ({...prevState, set:false, id:null}))
        if (isChecked) {
          setIsChecked(false);
          setAssignedEmployeeName(null);
          }
        if(response){
          // setShowModal(true)
          toast.success(`Cash Advance Settled Successfully for ${createdBy.name}`)
          setTimeout(() => {
            window.location.reload()
          }, 3000);
        }
    
    } catch (error) { 
        console.error('Error fetching data:', error.message);
        setIsUploading(prevState => ({...prevState, set:false, id:null}))
    }
};

const handleCloseModal = () => {
  setShowModal(false);
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
    <img onClick={()=>handleCheckboxChange(employeeNotAssigned)} src={cancel} alt='cancel' className='w-5 h-5' />}
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
                      <div onClick={() => handleCheckboxChange(employeeNotAssigned)} className='flex text-red-500 w-full  px-2 py-2 bg-red-50 rounded-md'> 
             <p>Remove</p> <img src={loading} className='w-5 h-5 animate-spin'/> 
            </div>: 
            <div onClick={() => handleCheckboxChange(employeeNotAssigned)} className='text-red-500  px-4 py-2 bg-red-50 rounded-md'>
              <p>Remove</p>
              </div>
              //  <img onClick={() => handleCheckboxChange(employeeNotAssigned)} src={cancel} alt='cancel' className='w-5 h-5 cursor-pointer' />
           
            }
        </div>
      )}
    </div>
    </>
  ) : (
    paidBy?.empId===employeeRole?.employeeDetails?.empId || paidBy?.empId===null ? <div className="font-bold text-[14px]  min-w-[72px] truncate w-auto max-w-[140px]   lg:truncate   h-[17px] text-purple-500 text-center">
    
    <input type="checkbox" onClick={()=>handleCheckboxChange(employeeAssigned)} checked={isChecked} />
    </div> :  paidBy?.name  
  )}
</div>
    </div> 
    <div className="flex h-[52px] items-center justify-start w-[221px] py-3 px-2  ">
    <div>
        <p className='font-cabin font-normal text-xs text-neutral-400'>travelRequestId</p>
        <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '> {travelRequestId}</p>
    </div>
    </div> 

    <div className='flex h-[52px] items-center justify-start w-[221px] py-3 px-2 '>
  <div>
      <p className='font-cabin font-normal  text-xs text-neutral-400'> employee Name</p>
       <p className='lg:text-[14px] text-[16px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '>{createdBy.name}</p>
</div>
</div>
 {/* Status */}

<div className='flex h-[52px] items-center justify-start w-[221px] py-3 px-2 '>
    <div>
    <p className='font-cabin font-normal  text-xs text-neutral-400 '>cashAdvanceStatus</p>
    <p className='lg:text-[14px] text-[16px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '>{cashAdvanceStatus ? cashAdvanceStatus : "-"}</p>
    </div>
    <div>
      <p className='font-cabin font-normal  text-xs text-neutral-400 '>amountDetails</p>
       <p className='px-4 lg:text-[16px] text-[16px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '>{amountDetails.amount}</p>
       </div>
</div>

 {/* MARK AS SETTLEMENT */}
<div className=" flex h-[52px] items-center justify-start w-[221px] py-3 px-2 ">
  <div onClick={()=> handleCashAdvance(employeeAssigned)} className="font-bold text-[14px]   truncate    lg:truncate   h-[17px] text-purple-500 text-center">
        MARK AS SETTLED
        {showModal && (
        <Modal
          showPopup={showModal}
          setshowPopup={handleCloseModal}
          message="Cash Advance Settled Successfully"
          skipable={true}
        />
      )}
  </div>
</div>      
  </div>
  )
}

export default SettleCashAdvance






