import React ,{useState,useEffect}from 'react';
import { useData } from '../../../api/DataProvider';
import { nonTravelExpenses } from '../../../dummyData/nonTravelExpense';
import { cancel,  modify } from '../../../assets/icon'
import { getStatusClass, titleCase} from '../../../utils/handyFunctions'


const NonTravelExpense = ({handleNonTravelExpense}) => {

  const { employeeData } = useData();
  const [reimbursementData , setReimbursementData]=useState(null);
///this is for backend data when we will get
  useEffect(()=>{
    const reimbursementExpenses = employeeData && employeeData?.dashboardViews?.employee?.reimbursements
    console.log(reimbursementExpenses,'reimbursement')
    setReimbursementData(reimbursementExpenses)   
  },[employeeData])




  return (
    <div className='h-full w-full flex items-center flex-col'>
    {reimbursementData?.map((item ,index)=>(
<React.Fragment key={index}>
            <div  className="box w-auto sm:w-full  max-w-[896px]  h-auto  mx-2 sm:mx-4 mb-2  font-cabin border border-b-gray rounded-xl hover:border-indigo-600  cursor-pointer">
  
            <div className='w-auto  max-w-[932px]  rounded-md'>
    <div className="w-auto  max-w-[900px] bg-white-100 h-auto max-h-[200px] lg:h-[52px] flex flex-col lg:flex-row items-start lg:items-center justify:start lg:justify-center  m-2 ">    
    <div className='flex  flex-row w-full  gap-2'>
    <div className='flex flex-col md:flex-row '>
   
{/* Trip Id */}

   <div className="flex h-[52px] items-center justify-start w-auto lg:w-fit py-0 md:py-3 px-2 order-1 min-w-fit">
   <div >
   <p className='font-cabin font-normal  text-xs text-neutral-400'>Expense Header No.</p>
    <p className='lg:text-[14px] text-[16px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '>{item?.expenseHeaderNumber}</p>
   </div>
 </div> 
{/* 
   <div className="flex h-[52px] items-center justify-start w-auto lg:w-fit py-0 md:py-3 px-2 order-1 min-w-fit">
   <div >
   <p className='font-cabin font-normal  text-xs text-neutral-400'>Expense Category</p>
   <div className="md:text-[14px]  w-auto xl:w-auto lg:w-[100px] md:w-[200px] text-[16px] text-left font-medium tracking-[0.03em] leading-normal text-neutral-800 font-cabin lg:truncate md:truncate  ">
     {titleCase(item?.category ?? "")}
      <span className="hidden md:group-hover:block top-[-6px] left-[20%] absolute z-10 bg-gray-200 shadow-sm font-cabin  text-black text-center py-2 px-4 rounded h-8  w-auto  ">
      {titleCase(item?.category ?? "")}
     </span>
     </div>
   </div>
 </div>  */}
   


    
   


    </div>
 <div className='flex flex-1  items-end md:items-center justify-around    flex-col-reverse md:flex-row gap-2'>
  {/* Trip Title */}
 
 {/* Status */}

 <div className="flex  h-[52px] px-2 py-3 items-center justify-center  ">
 
  <div className={`flex text-center px-2 justify-center  pt-[6px]  pb-2 py-3 rounded-[12px] text-[14px]  truncate font-medium tracking-[0.03em] ${
     getStatusClass(item?.expenseHeaderStatus)
    }`}
  >
    {titleCase(item?.expenseHeaderStatus)}
   
  </div>

</div>




 </div>
 <div className='flex flex-1 justify-center items-end gap-4 py-2 px-3'>
       <div  className='flex items-center  justify-center w-6 h-6 bg-[#FFC2C6] rounded-full cursor-pointer' onClick={()=>handleNonTravelExpense(item.expenseHeaderId,"non-tr-ex-cancel")}>
         <img src={cancel} alt='cancel' width={20} height={20} />
       </div>
       <div  className='flex cursor-pointer items-center justify-center w-6 h-6 bg-purple-50 rounded-full ' onClick={()=>handleNonTravelExpense(item.expenseHeaderId,"non-tr-ex-modify")}>
         <img src={modify} alt='modify' width={12} height={12} />
       </div>
     </div>
</div>
  </div>
  </div>


  <div className='h-auto'>
  {/* {travelDetails.cashAdvance.map((caDetails,index)=>(
    <>
    <div className='flex flex-row items-center ml-0   lg:ml-32  sm:ml-28 gap-2 text-gray-200'>
  <div className='w-auto  mi min-w-[20px] flex justify-center items-center px-3 py-3 '>
  <img className='w-6 h-[20px] translate-y-[-2px]' src={down_left_arrow}/>
     
     
  </div>
 
  <div className='w-auto max-w-[100px] flex justify-center items-center px-3 py-2'>

 
    <div className='  text-[14px] tracking-[0.02em]  font-bold'>
       {caDetails.caId}
    </div>
  </div>
  <div className=' flex justify-center items-center w-auto min-w-[130px] h-[44px] px-3 py-2 sr-only  sm:not-sr-only'>
    <div className=' tracking-[0.03em] leading-normal text-[14px] text-center'>
      {caDetails.date}
    </div>
  </div> 
  <div className='flex w-auto sm:w-[170px] min-w-[120px] justify-center items-center px-0 sm:py-2 sm:px-3 font-cabin gap-2'>
    <div className='w-5 h-5'>
    {caDetails.violation.length>0 ?(
    <img src={validation_sym} alt='three dot' className='w-[20px] h-[20px] ' />
    ) :""}
    </div>
  <div className=' '>
   
      {caDetails.details.map((currencyDetails,index)=>(
      <>
      <div className='text-[14px]'>
      {currencyDetails.currencyType}
      {currencyDetails.amount},
      </div>
      </>
    ))}
  </div>
</div>

  <div className='w-[100px] py-2 px-3 flex justify-center items-center sr-only  sm:not-sr-only'>
    <div className={`w-auto max-w-[200px] min-w-[135px] text-center font-medium text-sm text-gray-300 `}>
      {titleCase(caDetails.status)}
    </div>
  </div>
  <div className='w-[100px] py-2 px-3 flex justify-center items-center'>
    <div className={`w-auto max-w-[200px] font-medium text-sm text-red-700`}>
      Cancel
    </div>
  </div>
  </div>
    </>
  ))} */}
  </div> 
 



      {/* </div> */}
      </div>
              </ React.Fragment>
            ))}
   </div>
  )
}

export default NonTravelExpense
