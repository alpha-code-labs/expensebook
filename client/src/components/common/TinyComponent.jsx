import { briefcase, categoryIcons, money, user_icon } from "../../assets/icon";
import { formatAmount, getStatusClass, splitTripName } from "../../utils/handyFunctions";


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


const TripName = ({tripName})=>(
    <div className='flex gap-2 items-center '>
          <img src={briefcase} className='w-4 h-4'/>
          <div className='font-medium font-cabin  text-sm uppercase text-neutral-700 '>
           {splitTripName(tripName?? "")}
          </div>
          <div className='font-medium font-cabin  text-sm  text-neutral-700  -translate-y-[2px]'>
           {ExtractAndFormatDate(tripName?? "")}
          </div>
          </div>
  )

  const StatusBox = ({status})=>(
    <div className='flex justify-center items-center gap-2'>
    <div className={`text-center rounded-sm ${getStatusClass(status?? "-")}`}>
    <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{(status) ?? "-"}</p>
  </div>
  </div>
  )


  function ExpenseLine ({ expenseLines,defaultCurrency }) {
    return (
      <div className='overflow-x-hidden overflow-y-auto max-h-[236px] py-1 pt-2 h-auto px-2 space-y-2'>
        {expenseLines?.map((line, index) => (
          <div key={`${index}-line`} className='flex  text-neutral-700 flex-row justify-between items-center font-cabin text-sm'>
            <div className='bg-indigo-50 border-2 shadow-md shadow-slate-900/50 translate-x-4 border-white p-2 rounded-full'>
              <img src={categoryIcons?.[line?.["Category Name"]]} className='w-4 h-4' />
            </div>
            <div className='flex border-slate-400 border flex-row justify-between text-neutral-700 flex-1 items-center gap-2 py-4 px-4 pl-6 rounded-md bg-slate-100'>
              <div>{line?.["Category Name"]}</div>
              <div>{defaultCurrency?.shortName} {formatAmount(line?.["Total Amount"])}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function ExpenseHeader({
  
    tripNumber,
    name,
   
      defaultCurrency,
     
      expenseAmountStatus
     }){
    return(
      <>
      
  
  <div className="flex  flex-col gap-2 justify-between w-full ">
    <div className="flex flex-col sm:flex-row gap-2">
    {[
      { icon: user_icon, label: "Created By", value: name ?? "not available" },
      { icon: briefcase, label: "Trip Number", value: tripNumber ?? "not available" },
  
    ].map((item, index) => (
      <div key={index} className="flex flex-row  items-center gap-2 p-2 w-full  border border-slate-300 rounded-md">
        <div className="bg-slate-200 rounded-full p-2 shrink-0">
          <img src={item.icon} className="w-4 h-4" />
        </div>
        <div className="font-cabin">
          <p className="text-neutral-600 text-xs">{item.label}</p>
          <p className="text-neutral-900 text-sm ">{item.value}</p>
        </div>
      </div>
    ))}
    </div>
    <div className="flex  flex-row gap-2 p-2 w-full border border-slate-300 rounded-md items-center">
    <div className="bg-slate-200 rounded-full p-2 shrink-0">
          <img src={money} className="w-4 h-4" />
        </div>
      {[
        { label: "Issued Cash Advance", value: expenseAmountStatus?.totalCashAmount?.toFixed(2) ?? "not available" },
        { label: "Remaining Cash Advance", value: (expenseAmountStatus?.totalRemainingCash?.toFixed(2)) > 0 ? expenseAmountStatus?.totalRemainingCash?.toFixed(2) :"0.00" ?? "not available" },
        { label: "Default Currency", value: defaultCurrency?.shortName ?? "not available" },
      ].map((item, index) => (
        <div key={index} className="flex-1 px-2 font-cabin">
          <p className="text-neutral-600 text-xs line-clamp-1">{item.label}</p>
          <p className="text-neutral-900 text-sm">{item.value}</p>
        </div>
      ))}
    </div>
  </div>
  
  
 
  </>
    )
  }
  function NonTravelExpenseHeader({
  
    tripNumber,
    name,
   
      defaultCurrency,
     
      expenseAmountStatus
     }){
    return(
      <>
      
  
  <div className="flex   sm:flex-row flex-col gap-2 justify-between w-full  ">
    <div className="flex min-w-[250px]">
    {[
      { icon: user_icon, label: "Created By", value: name ?? "not available" },  
    ].map((item, index) => (
      <div key={index} className="flex flex-row  items-center gap-2 p-2 w-full  border border-slate-300 rounded-md">
        <div className="bg-slate-200 rounded-full p-2 shrink-0">
          <img src={item.icon} className="w-4 h-4" />
        </div>
        <div className="font-cabin">
          <p className="text-neutral-600 text-xs">{item.label}</p>
          <p className="text-neutral-900 text-sm ">{item.value}</p>
        </div>
      </div>
    ))}
    </div>
    {/* <div className="flex  flex-row gap-2 p-2 w-4/6 border border-slate-300 rounded-md items-center">
    <div className="bg-slate-200 rounded-full p-2 shrink-0">
          <img src={money} className="w-4 h-4" />
        </div>
      {[
        { label: "Issued Cash Advance", value: expenseAmountStatus?.totalCashAmount?.toFixed(2) ?? "not available" },
        { label: "Remaining Cash Advance", value: (expenseAmountStatus?.totalRemainingCash?.toFixed(2)) > 0 ? expenseAmountStatus?.totalRemainingCash?.toFixed(2) :"0.00" ?? "not available" },
        { label: "Default Currency", value: defaultCurrency?.shortName ?? "not available" },
      ].map((item, index) => (
        <div key={index} className="flex-1 px-2 font-cabin">
          <p className="text-neutral-600 text-xs line-clamp-1">{item.label}</p>
          <p className="text-neutral-900 text-sm">{item.value}</p>
        </div>
      ))}
    </div> */}
  </div>
  
  
 
  </>
    )
  }


  export {TripName, ExtractAndFormatDate,StatusBox,ExpenseLine,ExpenseHeader,NonTravelExpenseHeader}