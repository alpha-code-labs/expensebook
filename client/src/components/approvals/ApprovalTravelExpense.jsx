import React,{useEffect, useState} from 'react'
import { cancel, down_left_arrow, modify, three_dot, validation_sym } from '../../assets/icon'
import { getStatusClass, titleCase, urlRedirection } from '../../utils/handyFunctions'

import { useData } from '../../api/DataProvider';

const ApprovalTravelExpense = ({expenseApprovalData,handleApproval ,handleVisible}) => {
  
  
  
 console.log('expense approval data' , expenseApprovalData)


   
  return (
    
 <div className='h-full '>
     {expenseApprovalData?.map((item ,index)=>(
               <>
             <div className="box w-full   font-cabin border border-b-gray rounded-xl hover:border-indigo-600">
   
             <div className='w-full  rounded-md'>
     <div className="w-[900px] bg-white h-auto max-h-[200px] lg:h-[52px] flex flex-col lg:flex-row items-start lg:items-center justify:start lg:justify-center border-b-[1px] m-2 border-b-gray">    
     <div className='flex  flex-row w-full  gap-2'>
     <div className='flex flex-col md:flex-row '>

        <div className="flex h-[52px] items-center justify-start w-auto lg:w-fit py-0 md:py-3 px-2 order-1">
   
   <div >
   <p className='font-cabin font-normal  text-xs text-neutral-400'>Trip No.</p>
    <p className='lg:text-[14px] text-[16px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '>{item?.tripNumber}</p>
   </div>
 </div> 
 {/* Trip Title */}
     {/* <div className="group flex h-[52px] relative   items-center justify-start [210px]  xl:w-[300px] py-0 md:py-3 px-2 order-1 gap-2">
       <div className="md:text-[14px]  w-auto xl:w-auto lg:w-[100px] md:w-[200px] text-[16px] text-left font-medium tracking-[0.03em] leading-normal text-neutral-800 font-cabin ">
        {item.tripPurpose}
        <span className="hidden md:group-hover:block top-[-6px] left-[20%] absolute z-10 bg-gray-200 shadow-sm font-cabin  text-black text-center py-2 px-4 rounded h-8  w-auto  ">
        {item.tripPurpose}
       </span>
       </div>
      
     
     </div>  */}
     
     
    


      <div className="group flex h-[52px] relative   items-center justify-start [210px]  xl:w-[300px] py-0 md:py-3 px-2 order-1 gap-2">
       <div className={`flex items-center capitalize px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] ${
     getStatusClass(item?.tripStatus)
    }`}
  >
    {item?.tripStatus}
    
  </div>  
     </div>
     </div>
 
    
   
 </div>
   </div>
   </div>


   <div className='h-auto'>
  
     <>
     <div key={index} className='flex flex-row items-center ml-0   lg:ml-32  sm:ml-28 gap-2 text-gray-200'>
   <div className='w-auto  mi min-w-[20px] flex justify-center items-center px-3 py-3 '>
   <img className='w-6 h-[20px] translate-y-[-2px]' src={down_left_arrow}/>  
   </div>
   
    <div className="flex h-[52px] items-center justify-start w-auto lg:w-[221px] py-0 md:py-3 px-2 ">
      <div>
        <p className='font-cabin font-normal text-xs text-neutral-400'>Travel Expense No.</p>
        <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '>{item?.expenseHeaderNumber}</p>
      </div>
  </div> 
   

<div onClick={()=>handleVisible("",item?.tripId,item?.expenseHeaderId,"approval-view-tr-expense")} className="flex-1 flex items-center justify-end py-2 px-3 cursor-pointer">
         <b className="text-purple-500 text-[14px] tracking-[0.02em] w-[98px] font-bold">
           View Details
           
         </b>
       </div>
   </div>
     </>
  
   </div> 
  



       {/* </div> */}
       </div>
               </>
             ))}
    </div>


   
  )
}

export default ApprovalTravelExpense