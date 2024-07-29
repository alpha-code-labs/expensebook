import { briefcase } from "../../assets/icon";
import { splitTripName } from "../../utils/handyFunctions";

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


export {TripName,ExtractAndFormatDate}  