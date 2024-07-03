import {useEffect, useState}from 'react';
import { loading } from '../../assets/icon'
import { useParams } from 'react-router-dom';
import { assignNonTravelExpenseSettlement_API} from '../../utils/api';
import {toast } from 'react-toastify';


const SettlingNonTravelExpense = ({ nonTravelExpenseDetails, employeeRole}) => {
const [isHovered, setIsHovered] = useState(false);
const [isUploading, setIsUploading]=useState({set:false, id:null})
const [isChecked, setIsChecked] = useState(false);
const [assignedEmployeeName, setAssignedEmployeeName] = useState(null);

const {tenantId}= useParams()
console.log('employeeRole from nonTravelExpenseDetails',employeeRole)
console.log("i got nonTravelExpenseDetails", nonTravelExpenseDetails)
const {actionedUpon,  expenseHeaderStatus, createdBy,settlementBy, expenseHeaderId} = {...nonTravelExpenseDetails}
const {name} = createdBy
// const {totalRemainingCash} = expenseAmountStatus

const employeeAssigned = {
    empId: employeeRole?.empId,
    name: employeeRole?.name,
};

console.log("employeeAssigned recovery", employeeAssigned)
const employeeNotAssigned={
        empId:null,
        name: null
        }


useEffect(()=>{
    if(settlementBy?.empId===employeeRole?.empId){
    setIsChecked(true);
    setAssignedEmployeeName(settlementBy?.name)
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

const handleCashAdvance = async (settlementBy) => {   
    const data = {
    settlementBy
    }
    try {
        setIsUploading(prevState => ({...prevState, set:true, id:expenseHeaderId}))
        const response = await assignNonTravelExpenseSettlement_API(tenantId,expenseHeaderId,data) 
        setIsChecked(true);
        setAssignedEmployeeName(employeeRole?.name);
        console.log('admin response',response)
        setIsUploading(prevState => ({...prevState, set:false, id:null}))
        if (isChecked) {
          setIsChecked(false);
          setAssignedEmployeeName(null);
          }
        if(response){
          toast.success(`Travel Expense Settled from ${createdBy.name}`)
          setTimeout(() => {
            window.location.reload()
          }, 3000);
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
    {(isUploading?.set && isUploading?.id == expenseHeaderId) ? 
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
          {(isUploading?.set && isUploading?.id === expenseHeaderId) ?
                      <div onClick={() => handleCheckboxChange(employeeNotAssigned)} className='flex text-red-500 w-full  px-2 py-2 bg-red-50 rounded-md'> 
             <p>Remove</p> <img src={loading} className='w-5 h-5 animate-spin'/> 
            </div>: 
            <div onClick={() => handleCheckboxChange(employeeNotAssigned)} className='text-red-500  px-4 py-2 bg-red-50 rounded-md'>
              <p>Remove</p>
              </div>           
            }
        </div>
      )}
    </div>
    </>
  ) : (
    settlementBy?.empId===employeeRole?.employeeDetails?.empId || settlementBy?.empId===null ? <div className="font-bold text-[14px]  min-w-[72px] truncate w-auto max-w-[140px]   lg:truncate   h-[17px] text-purple-500 text-center">
    <input type="checkbox" onClick={()=>handleCheckboxChange(employeeAssigned)} checked={isChecked} />
    </div> :  settlementBy?.name  
  )}
</div>
    </div> 
    <div className="flex h-[52px] items-center justify-start w-[221px] py-3 px-2  ">
    <div>
        <p className='font-cabin font-normal text-xs text-neutral-400'>Expense</p>
        <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '> {expenseHeaderId}</p>
    </div>
    </div> 

    <div className='flex h-[52px] items-center justify-start w-[221px] py-3 px-2 '>
  <div>
      <p className='font-cabin font-normal  text-xs text-neutral-400'> Employee Name</p>
       <p className='lg:text-[14px] text-[16px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '>{createdBy.name}</p>
</div>
</div>
 {/* Status */}

<div className='flex h-[52px] items-center justify-start w-[221px] py-3 px-2 '>
    <div>
    <p className='font-cabin font-normal  text-xs text-neutral-400 '>Status</p>
    <p className='lg:text-[14px] text-[16px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '>{expenseHeaderStatus ? expenseHeaderStatus : "-"}</p>
    </div>
    {/* <div>
      <p className='font-cabin font-normal  text-xs text-neutral-400 '>expenseAmountStatus</p>
       <p className='px-4 lg:text-[16px] text-[16px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '>{totalRemainingCash}</p>
       </div> */}
</div>

 {/* MARK AS SETTLEMENT */}
<div className=" flex h-[52px] items-center justify-start w-[221px] py-3 px-2 ">
  <div onClick={()=> handleCashAdvance(employeeAssigned)} className="font-bold text-[14px]   truncate    lg:truncate   h-[17px] text-purple-500 text-center">
        Mark as Settled
  </div>
</div>      
  </div>
  )
}

export default SettlingNonTravelExpense






