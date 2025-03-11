import React,{useState} from 'react'
import { cancel, down_left_arrow, modify} from '../../assets/icon'
import { getStatusClass } from '../../utils/handyFunctions';



const TravelCard = ({tripId,travelExpense,handleTravelExpense})=>{

  console.log('travel expense ',travelExpense )

    const [dropdownStates, setDropdownStates] = useState({});
    
    const handleDropdownToggle = (index) => {
       setDropdownStates((prevStates) => ({
         ...prevStates,
         [index]: !prevStates[index],
       }));
     };


  return (
    
 <div className=''>
     {travelExpense && travelExpense.map((item ,index)=>(
<React.Fragment  key={index}>
             <div key={index} className="box w-full  h-auto   mb-2  font-cabin border border-b-gray bg-slate-50 rounded-md">

  
     
   <div className='flex flex-row items-center gap-2 text-gray-200 '>
   <div className='w-auto  mi min-w-[20px] flex justify-center items-center px-3 py-3 '>
   <img className='w-6 h-[20px] translate-y-[-2px]' src={down_left_arrow}/>
      
      
   </div>
  
   <div className="flex h-[52px] items-center justify-start w-auto lg:w-[221px] py-0 md:py-3 px-2 ">
      <div>
        <p className='font-cabin font-normal text-xs text-neutral-400'>Travel Expense No.</p>
        <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '>{item.expenseHeaderNumber}</p>
      </div>
    </div> 
    <div className="group flex h-[52px] relative   items-center justify-start [210px]  xl:w-[300px] py-0 md:py-3 px-2 gap-2">
       <div className={`flex items-center capitalize px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] ${
    getStatusClass(item?.expenseHeaderStatus)
    }`}
  >
    {item?.expenseHeaderStatus}
    
  </div>  
     </div> 
   <div className='flex flex-1 justify-end items-end gap-4 py-2 px-3'>
       <div  className='flex items-center  justify-center w-6 h-6 bg-[#FFC2C6] rounded-full cursor-pointer' onClick={()=>handleTravelExpense({"tripId":tripId,"expenseHeaderId":item.expenseHeaderId,action:"trip-ex-cancel"})}>
         <img src={cancel} alt='cancel' width={20} height={20} />
       </div>
       <div  className='flex cursor-pointer items-center justify-center w-6 h-6 bg-purple-50 rounded-full' onClick={()=>handleTravelExpense({tripId,"expenseHeaderId":item.expenseHeaderId,action:"trip-ex-modify"})}>
         <img src={modify} alt='modify' width={12} height={12} />
       </div>
    </div>
   </div>
   
    
  
       </div>
</React.Fragment>
             ))}
    </div>


   
  )
}

export default TravelCard
