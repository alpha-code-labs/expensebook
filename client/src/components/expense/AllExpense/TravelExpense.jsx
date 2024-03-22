import React,{useState,useEffect} from 'react'
import { useData } from '../../../api/DataProvider';
import { cancel, down_left_arrow, modify, three_dot, validation_sym } from '../../../assets/icon'
import { getStatusClass } from '../../../utils/handyFunctions';


const TravelExpense = ({travelExpense,handleTravelExpense}) => {
  //for backend data
//   const { employeeData } = useData();
//   const [expenseData , setExpenseData]=useState(null);
// ///this is for backend data when we will get
// //booked expense for transit and completed trips
//   useEffect(()=>{
//     const transitTrips = employeeData?.transitTrips
//     const completedTrips = employeeData?.completedTrips

//     setExpenseData([...transitTrips , ...completedTrips]) 

//   },[employeeData])

const expenseData = [
  // {
  //   tripId: "TRIP00023",
  //   tripNumber:"#TRIP00023",
  //   tripPurpose: "Meeting for Investors in Log Vegas, California",
  //   tripStatus:"transit",
  //   travelExpenses: [
  //     { expenseHeaderId: "#TREX00023",expenseHeaderNumber: "#TREX00023", category: "office expense" },
  //     { expenseHeaderId: "#TREX00022",expenseHeaderNumber: "#TREX00023", category: "expense for Delhi to Mumbai" }
  //   ]
  // },
  // {
  //   tripId: "TRIP00024",

  //   tripNumber:"#TRIP00023",
  //   tripStatus:"transit",
  //   tripPurpose: "Conference in New York",
  //   travelExpenses: [
  //     { expenseHeaderId: "#TREX00024",expenseHeaderNumber: "#TREX00023", category: "conference registration" },
  //     { expenseHeaderId: "#TREX00025",expenseHeaderNumber: "#TREX00023",  category: "flight expense" },
  //     { expenseHeaderId: "#TREX00026",expenseHeaderNumber: "#TREX00023",  category: "flight expense with party" }
  //   ]
  // },
  // {
  //   tripId: "TRIP00025",
  //   tripNumber:"#TRIP00023",
  //   tripStatus:"transit",
  //   tripPurpose: "Client Meeting in London",
  //   travelExpenses: [
  //     { expenseHeaderId: "#TREX00026",expenseHeaderNumber: "#TREX00023",  category: "client dinner" },
  //     { expenseHeaderId: "#TREX00027",expenseHeaderNumber: "#TREX00023",  category: "transportation" }
  //   ]
  // },
]

    const [dropdownStates, setDropdownStates] = useState({});
    const handleDropdownToggle = (index) => {
       setDropdownStates((prevStates) => ({
         ...prevStates,
         [index]: !prevStates[index],
       }));
     };


  return (
    
 <div className='h-full '>
     {expenseData?.map((item ,index)=>(
               <React.Fragment key={index}>
             <div  className="box w-auto  max-w-[896px]  h-auto  mx-2 sm:mx-4 mb-2  font-cabin border border-b-gray rounded-xl">
   
             <div className='w-auto  max-w-[932px]  rounded-md'>
     <div className="w-auto  max-w-[900px] bg-white-100 h-auto max-h-[200px] lg:h-[52px] flex flex-col lg:flex-row items-start lg:items-center justify:start lg:justify-center border-b-[1px] m-2 border-b-gray">    
     <div className='flex  flex-row w-full  gap-2'>
     <div className='flex flex-col md:flex-row '>
    
 {/* Trip Id */}
 <div className="flex h-[52px] items-center justify-start w-auto lg:w-fit py-0 md:py-3 px-2 order-1 min-w-fit">
   <div >
   <p className='font-cabin font-normal  text-xs text-neutral-400'>Trip No.</p>
    <p className='lg:text-[14px] text-[16px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '>{ item?.tripNumber}</p>
   </div>
 </div> 
 {/* Trip Title */}
 {/* xl:w-[200px] lg:[100px] */}
     {/* <div className="group flex h-[52px] relative   items-center justify-start    py-0 md:py-3 px-2 order-1 gap-2">
     lg:truncate md:truncate
       <div className="md:text-[14px]  w-auto  text-[16px] text-left font-medium tracking-[0.03em] leading-normal text-neutral-800 font-cabin ">
        {item.tripPurpose}
        <span className="hidden md:group-hover:block top-[-6px] left-[20%] absolute z-10 bg-gray-200 shadow-sm font-cabin  text-black text-center py-2 px-4 rounded h-8  w-auto  ">
        {item.tripPurpose}
       </span>
       </div>
      
     
     </div>  */}
    

 {/* Date */}
     {/* <div className="flex   h-[52px] w-auto xl:w-[150px]  xl:min-w-[210px]  items-center justify-start py-0 md:py-3 gap-1 px-0 lg:px-2 order-3 lg:order-2">
       <div className='pl-2 md:pl-0'>
       <img src={calender} alt="calendar" className="w-[16px]"/>
       </div>
       <div className=" tracking-[0.03em] leading-normal text-neutral-800 text-[12px]">
      
         {travelDetails.departureDate} to {travelDetails.returnDate}
       </div>
     </div>   */}
<div className="group flex h-[52px] relative   items-center justify-start [210px]  xl:w-[300px] py-0 md:py-3 px-2 order-1 gap-2">
       <div className={`flex items-center capitalize px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] ${
     getStatusClass(item?.tripStatus)
    }`}
>
    {item.tripStatus}
    
  </div>  
     </div>
     </div>
    
   
 </div>
   </div>
   </div>


   <div className='h-auto'>
   {item.travelExpenses.map((subItem,index)=>(
     <React.Fragment key={index}>
     <div key={index} className='flex flex-row items-center ml-0   lg:ml-32  sm:ml-28 gap-2 text-gray-200'>
   <div className='w-auto  mi min-w-[20px] flex justify-center items-center px-3 py-3 '>
   <img className='w-6 h-[20px] translate-y-[-2px]' src={down_left_arrow}/>
      
      
   </div>
   <div className="flex h-[52px] items-center justify-start w-auto lg:w-[221px] py-0 md:py-3 px-2 ">
      <div>
        <p className='font-cabin font-normal text-xs text-neutral-400'>Travel Expense No.</p>
        <p className='lg:text-[14px] text-[16px] text-left font-medium  tracking-[0.03em] text-neutral-800 font-cabin lg:truncate '>{subItem.expenseHeaderNumber}</p>
      </div>
    </div>  
   {/* <div className=' flex justify-center items-center w-auto min-w-[130px] h-[44px] px-3 py-2 sr-only  sm:not-sr-only'>
     <div className=' tracking-[0.03em] leading-normal text-[14px] text-center'>
     {item.date}
     </div>
   </div>  */}
   {/* <div className='flex w-auto sm:w-[170px] min-w-[120px] justify-center items-center px-0 sm:py-2 sm:px-3 font-cabin gap-2'>
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
 </div> */}

   {/* <div className='w-[100px] py-2 px-3 flex justify-center items-center sr-only  sm:not-sr-only'>
     <div className={`w-auto max-w-[200px] min-w-[135px] text-center font-medium text-sm text-gray-300 `}>
       {titleCase(caDetails.status)}
     </div>
   </div> */}
   <div className='flex flex-1 justify-center items-end gap-4 py-2 px-3'>
       <div  className='flex items-center  justify-center w-6 h-6 bg-[#FFC2C6] rounded-full cursor-pointer' onClick={()=>handleTravelExpense(item?.tripId,subItem?.expenseHeaderId,"trip-ex-cancel")}>
         <img src={cancel} alt='cancel' width={20} height={20} />
       </div>
       <div  className='flex cursor-pointer items-center justify-center w-6 h-6 bg-purple-50 rounded-full ' onClick={()=>handleTravelExpense(item?.tripId,subItem?.expenseHeaderId,"trip-ex-modify")}>
         <img src={modify} alt='modify' width={12} height={12} />
       </div>
     </div>
   </div>
     </React.Fragment>
   ))}
   </div> 
  



       {/* </div> */}
       </div>
               </React.Fragment>
             ))}
    </div>


   
  )
}

export default TravelExpense
