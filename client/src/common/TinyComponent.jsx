import { briefcase, categoryIcons, violation_icon } from "../assets/icon";
import { formatAmount, getStatusClass, splitTripName } from "../utilis/handyFunctions";



const TripName = ({tripName})=>(
    <div className='flex gap-2 items-center '>
          <img src={briefcase} className='w-4 h-4'/>
          <div className='font-medium font-cabin  text-sm uppercase text-neutral-700 '>
           {splitTripName(tripName?? "")}
          </div>
          <div className='font-medium font-cabin  text-sm  text-neutral-700  mb-[2px]'>
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
    <div className={`text-center rounded-sm ${getStatusClass(status?? "-")}`}>
    <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{(status) ?? "-"}</p>
  </div>
  </div>
  )


  function CardLayout ({index,children}){ 

    return (
      <div key={index} className='flex  border border-slate-300 flex-row  w-full items-center hover:border hover:border-indigo-600 hover:bg-indigo-100 cursor-pointer  justify-between my-2 text-neutral-700 rounded-md hover:shadow-custom-light bg-white px-4 py-2 '>
     {children}
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
      <div className='flex items-center justify-start flex-row border border-slate-300 px-4 py-1 rounded-md w-full overflow-auto'>
        <div className='px-4'>
          <img src={filter_icon} className='min-w-5 w-5 h-5 min-h-5' alt="Filter icon"/>
        </div>
        <div className='flex md:flex-wrap gap-2'>
          {statuses.map((status) => {
            const statusCount = getStatusCount(status, tripData);
            const isDisabled = statusCount === 0;
  
            return (
              <div key={status} className={`flex items-center ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                <div
                  onClick={() => !isDisabled && handleStatusClick(status)}
                  className={`ring-1 ring-white flex py-1 pr-3 text-center rounded-sm ${selectedStatuses.includes(status) ? getStatusClass(status) : "bg-slate-100 text-neutral-700 border border-slate-300"}`}
                >
                  <p className='px-1 py-1 text-sm text-center capitalize font-cabin whitespace-nowrap'>{status}</p>
                </div>
                <div className={`shadow-md shadow-black/30 font-semibold -translate-x-3 ring-1 rounded-full ring-white w-6 h-6 flex justify-center items-center text-center text-xs ${selectedStatuses.includes(status) ? getStatusClass(status) : "bg-slate-100 text-neutral-700 border border-slate-300"}`}>
                  <p>{statusCount}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className='flex items-center justify-center text-neutral-700 text-base text-center hover:text-red-600 hover:font-semibold w-auto h-[36px] font-cabin cursor-pointer whitespace-nowrap' onClick={() => setSelectedStatuses("")}>
          Clear All
        </div>
      </div>
    );
  }
  
  function ExpenseLine ({ expenseLines, }) {
    return (
      <div className='overflow-x-hidden overflow-y-auto max-h-[236px] py-1 pt-2 h-auto px-2 space-y-2'>
        {expenseLines?.map((line, index) => (
          <div key={`${index}-line`} className='flex  text-neutral-700 flex-row justify-between items-center font-cabin text-sm'>
            <div className='bg-indigo-50 border-2 shadow-md shadow-slate-900/50 translate-x-4 border-white p-2 rounded-full'>
              <img src={categoryIcons?.[line?.["Category Name"]]} className='w-4 h-4' />
            </div>
            <div className='flex border-slate-400 border flex-row justify-between text-neutral-700 flex-1 items-center gap-2 py-4 px-4 pl-6 rounded-md bg-slate-100'>
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

  function SettleNowBtn ({onHover,disabled, text,onClick}){
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
      <div onClick={handleClick} className={`${disabled ? 'group hover:bg-indigo-400  bg-indigo-400 text-gray-400 cursor-not-allowed': 'bg-indigo-600 hover:bg-indigo-500  text-white cursor-pointer' } relative px-2 py-1 font-cabin text-xs bg-indigo-600 rounded-md text-white`}>
        <p className=' whitespace-nowrap'>{text}</p>
        {disabled &&
        <div className="absolute truncate -top-8 right-8  rounded-md px-2 py-1 bg-gray-800 text-gray-200 text-xs z-[10] font-cabin hidden scale-0 group-hover:block group-hover:origin-bottom-left group-hover:scale-100">
            {onHover}
        </div>}
    </div>
      
        </>
    )
    
  }


export {SettleNowBtn, Violation, ExpenseLine,StatusFilter,CardLayout ,TripName,ExtractAndFormatDate,StatusBox}  