import { briefcase, cancel, categoryIcons, expene_icon, info_icon, modify, plus_icon, plus_violet_icon, violation_icon } from "../../assets/icon";
import { formatAmount, getStatusClass, splitTripName } from "../../utils/handyFunctions";



const TripName = ({tripName})=>(
    <div className='flex gap-2 items-center  '>
          <img src={briefcase} className='w-4 h-4'/>
          <div className='font-medium font-cabin  text-sm uppercase text-neutral-700 text-nowrap'>
           {splitTripName(tripName?? "")}
          </div>
          <div className='font-medium font-cabin text-nowrap  text-sm  text-neutral-700  -translate-y-[2px]'>
           {ExtractAndFormatDate(tripName?? "")}
          </div>
          </div>
  )
  
  const ExtractAndFormatDate = (inputString) => {
    // Convert the input string to lowercase
    const lowerCaseInput = inputString.toLowerCase();
  
    // Define the date pattern
    const datePattern = /(\d{1,2})(st|nd|rd|th) (\w{3})/;
    const match = lowerCaseInput.match(datePattern);
  
    if (match) {
      const [, day, suffix, month] = match;
      return (
        <>
          {day}
          <span className="align-super text-xs">{suffix}</span><span className='capat capitalize'>{` ${month}`}</span> 
        </>
      );
    }
  
    return null;
  };

  const StatusBox = ({status})=>(
    <div className='flex justify-center items-center gap-2'>
    <div className={`text-center rounded-md ${getStatusClass(status?? "-")}`}>
    <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{(status) ?? "-"}</p>
  </div>
  </div>
  )


  function CardLayout ({index,children}){ 

    return (
      <div key={index} className='flex  border border-slate-300 flex-row  w-full items-center hover:border hover:border-slate-300 hover:bg-slate-100 cursor-pointer  justify-between my-2 text-neutral-700 rounded-md hover:shadow-slate-300 hover:shadow-sm bg-white px-4 py-2 '>
     {children}
    </div>
    )
    
  }

  function BoxTitleLayout({title,icon,children}){
    return(
      <div className='relative px-2 shrink-0  flex justify-start items-center  rounded-md   font-inter text-md  h-[52px] bg-gray-200/10  text-center'>


  
      <div className='flex shrink-0 justify-center items-center rounded-r-md font-inter text-md text-base text-neutral-900 h-[52px] text-center'>
                    <img src={icon} className='w-6 h-6 mr-2'/>
                    <p className=" truncate w-fit line-clamp-1">{title}</p>
      </div>
      {children}
                  {/* <div
      onClick={()=>setModalOpen(!modalOpen)}
      onMouseEnter={() => setTextVisible({cashAdvance:true})}
      onMouseLeave={() => setTextVisible({cashAdvance:false})}
      className={`absolute  right-4 ml-4 hover:px-2 w-6 h-6 hover:overflow-hidden hover:w-auto group text-neutral-900 bg-slate-100 border border-white font-inter flex items-center justify-center  hover:gap-x-1 rounded-full cursor-pointer transition-all duration-300`}
      >
      <img src={plus_violet_icon} width={16} height={16} alt="Add Icon" />
      <p
      className={`${
      textVisible?.cashAdvance ? 'opacity-100 ' : 'opacity-0 w-0'
      } whitespace-nowrap text-xs transition-all duration-300 group-hover:opacity-100 group-hover:w-auto`}
      >
      Raise a Cash-Advance
      </p>
      </div> */}
      
                  </div>
    )
  }

  function StatusFilter({
    tripData = [],
    selectedStatuses = [],
    handleStatusClick,
    filter_icon,
    getStatusClass,
    getStatusCount,
    setSelectedStatuses,
    statuses=[]
  }) {
    return (
      <div className='flex items-center scrollbar-hide  border-slate-100 justify-start flex-row   w-full overflow-auto'>
       
        <div className='flex  '>
          {statuses.map((status) => {
            const statusCount = getStatusCount(status, tripData);
            const isDisabled = statusCount === 0;
  
            return (
              <div key={status} onClick={() => !isDisabled && handleStatusClick(status)} className={`gap-1 first:rounded-l-md last:rounded-r-md flex border border-slate-300 border-collapse justify-center font-inter px-2 py-2 items-center hover:bg-gray-200/10 ${selectedStatuses.includes(status) ? " text-white bg-neutral-900 hover:bg-neutral-900   " : " text-neutral-900  "}  ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
               
                  <p className=' text-sm text-center capitalize  whitespace-nowrap'>{status}</p>
                 
                  <p className="text-center text-sm">{statusCount}</p>
               
               
                
              </div>
            );
          })}
        </div>
        <div className='min-h-max w-full items-center justify- text-neutral-700 text-sm text-end hover:text-red-600  font-cabin cursor-pointer whitespace-nowrap' >
          <p onClick={() => setSelectedStatuses("")} className="  text-end">Clear All</p>
        </div>
      </div>
    );
  }

  function TooltipBtn( {onClick,onHover,icon,disabled = false}){
    return(<div onClick={onClick}  className={` group ${disabled ? ' text-gray-400 cursor-not-allowed ': '  text-white cursor-pointer' } relative px-2 py-1 font-cabin text-xs rounded-md text-white` }>
           <img src={icon} className='w-4 h-4' alt="Add Icon" />
           <div className="absolute truncate -top-0  right-8   rounded-md px-2 py-1 bg-neutral-900 text-gray-100 text-xs z-[10] font-cabin hidden scale-0 group-hover:block group-hover:origin-bottom-left group-hover:scale-100">
            {onHover}
            </div>
        </div>)
  }

  // function StatusFilter({
  //   tripData = [],
  //   selectedStatuses = [],
  //   handleStatusClick,
  //   filter_icon,
  //   getStatusClass,
  //   getStatusCount,
  //   setSelectedStatuses,
  //   statuses=[]
  // }) {

  //   return (
  //     <div className='flex items-center scrollbar-hide justify-start flex-row border border-slate-300 px-4 py-1 rounded-md w-full overflow-auto'>
  //       <div className='px-4'>
  //         <img src={filter_icon} className='min-w-5 w-5 h-5 min-h-5' alt="Filter icon"/>
  //       </div>
  //       <div className='inline-flex gap-2'>
  //         {statuses.map((status) => {
  //           const statusCount = getStatusCount(status, tripData);
  //           const isDisabled = statusCount === 0;
  
  //           return (
  //             <div key={status} className={`flex items-center ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
  //               <div
  //                 onClick={() => !isDisabled && handleStatusClick(status)}
  //                 className={`ring-1 ring-white flex py-1 pr-3 text-center rounded-sm ${selectedStatuses.includes(status) ? getStatusClass(status) : "bg-slate-100 text-neutral-700 border border-slate-300"}`}
  //               >
  //                 <p className='px-1 py-1 text-sm text-center capitalize font-cabin whitespace-nowrap'>{status}</p>
  //               </div>
  //               <div className={`shadow-md shadow-black/30 font-semibold -translate-x-3 ring-1 rounded-full ring-white w-6 h-6 flex justify-center items-center text-center text-xs ${selectedStatuses.includes(status) ? getStatusClass(status) : "bg-slate-100 text-neutral-700 border border-slate-300"}`}>
  //                 <p>{statusCount}</p>
  //               </div>
  //             </div>
  //           );
  //         })}
  //       </div>
  //       <div className='flex items-center justify-center text-neutral-700 text-base text-center hover:text-red-600 hover:font-semibold w-auto h-[36px] font-cabin cursor-pointer whitespace-nowrap' onClick={() => setSelectedStatuses("")}>
  //         Clear All
  //       </div>
  //     </div>
  //   );
  // }
  
  function ExpenseLine ({ expenseLines, }) {
    return (
      <div className='overflow-x-hidden overflow-y-auto max-h-[236px] py-1 pt-2 h-auto px-2 space-y-2'>
        {expenseLines?.map((line, index) => (
          <div key={`${index}-line`} className='flex  text-neutral-700 flex-row justify-between items-center font-cabin text-sm'>
            <div className='bg-indigo-50 border-2 shadow-md shadow-slate-900/50 translate-x-4 border-white p-2 rounded-full'>
              <img src={categoryIcons?.[line?.["Category Name"]] ?? categoryIcons?.["Receipt"]} className='w-4 h-4' />
            </div>
            <div className='flex border-slate-300 border flex-row justify-between text-neutral-700 flex-1 items-center gap-2 py-4 px-4 pl-6 rounded-md bg-gray-50'>
              <div>{line?.["Category Name"]}</div>
              <div>{line?.["Currency"]?.shortName} {formatAmount(line?.["Total Amount"])}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function Violation ({violationCount}){
    return (<div className={`${violationCount === 0 ? 'hidden':'block'} px-1 py-[2px] rounded-sm bg-yellow-100 border-yellow-200 border text-yellow-200 flex flex-row gap-1 justify-center items-center  font-cabin `}>
                <img src={violation_icon} className='w-4 h-4'/>
                <p className=" text-xs  ">
  {violationCount} 
  {violationCount === 1 ? ' violation' : ' violations'}
</p>

            </div>)
  }


  function EmptyBox ({icon, text }){
    return(
    <div className=" border border-slate-300 rounded-md min-h-[400px] h-full w-full flex justify-center items-center">
      <div className="flex flex-col gap-4 items-center">
        <img src={icon} className="w-[80px] animate-pulse" alt="Empty itinerary icon" />
        <p className="text-xl text-center font-cabin text-neutral-600 inline-flex">{text}</p>
      </div>
    </div>
  )}


  function RaiseButton ({onMouseEnter,onMouseLeave,onClick,textVisible,text}){
    return(<div
    onClick={onClick}
    // onMouseEnter={onMouseEnter}
    // onMouseLeave={onMouseLeave}
    className={`absolute  right-2 ml-4 bg-neutral-900 text-white   hover:bg-neutral-700    group   border border-slate-200 flex flex-row items-center justify-center   rounded-md px-2 py-2 cursor-pointer `}
    >
       {/* <p
    className={`${
    textVisible ? 'opacity-100' : 'opacity-100 w-0'
    } whitespace-nowrap text-xs transition-all duration-300 group-hover:opacity-100 group-hover:w-auto`}
    >
    {text}
    </p> */}
      <img src={plus_icon} width={16} height={16} alt="Add Icon" />
    <p className="text-xs  font-inter  text-white "> {text}</p>
  
   
    </div>)
  }


  function ModifyBtn ({onClick,text="Modify",variant="sm"}){
    return(
      <div onClick={onClick} className="p-1 ">
        <p className={`${variant === "md" ? "text-sm" : "text-xs"} font-semibold  font-inter text-neutral-900`}>{text}</p>
      </div>
    )
  }

  function SmallAction ({onHover,disabled, text,onClick}){
    const handleClick = (e)=>{
      if(!disabled ){
          onClick(e)
      }
      else{
          // console.log('disabled')
      }
  }

    return(
      <>
      <div onClick={handleClick} className={`${disabled ? 'group bg-neutral-900 text-white   hover:bg-neutral-700   cursor-not-allowed': 'bg-neutral-900 text-white   hover:bg-neutral-700    cursor-pointer' } relative px-2 py-1 h-fit font-cabin text-xs  rounded-md text-white`}>
        <p className=' whitespace-nowrap'>{text}</p>
        {disabled &&
        <div className="absolute truncate -top-8 right-8  rounded-md px-2 py-1 bg-gray-800 text-gray-200 text-xs z-[10] font-cabin hidden scale-0 group-hover:block group-hover:origin-bottom-left group-hover:scale-100">
            {onHover}
        </div>}
    </div>
      
        </>
    )
    
  }


  function TitleModal ({onClick, text, iconFlag= false}){
    return (
      <div className='flex gap-2 justify-between items-center bg-gray-200/20 w-full p-4'>
         <div className='flex gap-2 items-center justify-start'>
              {iconFlag && <img src={info_icon} className='w-5 h-5' alt="Info icon"/>}
              <p className='font-inter text-base font-semibold text-neutral-900'>
                {text}
              </p>
            </div>
                {/* <p className='font-inter text-base font-semibold text-neutral-900'>{text}</p> */}
                <div onClick={onClick} className='bg-red-100 cursor-pointer rounded-full border border-white'>
                <img src={cancel} className='w-5 h-5'/>
                </div>
      </div>
    )
  }

  function TabTitleModal ({text,onClick,icon,selectedTab}){

    return(
  <div onClick={onClick} className={`min-w-fit cursor-pointer transition  duration-200 hover:bg-gray-100  hover:rounded-md flex-1  flex items-center justify-center gap-2 p-4 ${selectedTab ? 'border-b-2 border-neutral-900  hover:rounded-b-none': "border-b-2 border-white"}  `}>
    <img src={icon} className='w-5 h-5'/>
    <p className=' shrink'>{text}</p>
  </div>
    )
  }


export {TabTitleModal,TitleModal, SmallAction, TooltipBtn, ModifyBtn, BoxTitleLayout, RaiseButton, EmptyBox, Violation, ExpenseLine, StatusFilter, CardLayout ,TripName, ExtractAndFormatDate, StatusBox}  