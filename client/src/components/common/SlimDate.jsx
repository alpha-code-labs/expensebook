// import { useState, useRef, useEffect } from "react";
// import { titleCase, formatDate, formatDateMonth } from "../../utils/handyFunctions";
// import chevron_down from "../../assets/chevron-down.svg";
// import { formatDate2 } from "../../utils/handyFunctions";


// function getCurrentDate(){
//     const date = new Date();
//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const day = date.getDate().toString().padStart(2, '0');
//     return `${year}-${month}-${day}`;
// }

// export default function SlimDate(props){
//     const format = props.format??'date-month-year';
//     const title = props.title || "Title";
//     const min = props?.min??0
//     let date = props.date 
//     date = (date != undefined && date != null && !isNaN(new Date(date))) ? new Date(date).toISOString().split('T')[0] : getCurrentDate();
//     const onChange = props.onChange
//     const [value, setValue] = useState(date);
//     const error = props.error || {set:false, message:''}

//     function getDateXDaysAway(days) {
//         const currentDate = new Date();
//         const futureDate = new Date(currentDate);
//         futureDate.setDate(currentDate.getDate() + days);
      
//         const year = futureDate.getFullYear();
//         const month = String(futureDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
//         const day = String(futureDate.getDate()).padStart(2, '0');
      
//         return `${year}-${month}-${day}`;
//       }


//     const handleChange= (e)=>{
//        setValue(e.target.value)
//        console.log(e.target.value)
//        onChange(e)
//     }

// return(<>
// {format != 'date-month' && <div className="min-w-[200px] w-full md:w-fit max-w-[403px] h-[73px] flex-col justify-start items-start gap-2 inline-flex">
//             {/* title */}
//             <div className="text-zinc-600 text-sm font-cabin select-none">{title}</div>

//             {/* input */}
//             <div className="w-full h-full bg-white items-center flex">
//                 <div className="text-neutral-700 w-full  h-full text-sm font-normal font-cabin">
//                     <div className=" w-full z-100 relative h-full decoration:none px-6 py-2 border rounded-md border border-neutral-300 inline-flex justify-center items-center cursor-pointer">
//                         <div className="flex relative w-full gap-4 justify-center items-center" >
//                             <input className='slim absolute w-full h-full opacity-0 focus-visible:outline-0 cursor-hover' onChange={handleChange} value={value} min={getDateXDaysAway(Number(min))} type='date'/>
//                             <div className="text-gray-600 bg-white whitespace-nowrap text-base font-medium font-cabin">{formatDate(value)}</div>
//                             <div className="h-6 w-6">
//                                 <img src={chevron_down} alt="open" />
//                             </div>
//                             {error.set && <div className="absolute left-0 top-[33px] w-full text-xs text-red-600 font-cabin">
//                                 {error.message}
//                             </div>}
//                         </div>        
//                     </div>
//                 </div>
//             </div>
//       </div>
// }

//     {format == 'date-month' && <div className="min-w-[136px] w-full md:w-fit max-w-[403px] h-[73px] flex-col justify-start items-start gap-2 inline-flex">
//             {/* title */}
//             <div className="text-zinc-600 text-sm font-cabin">{title}</div>

//             {/* input */}
//             <div className="w-full h-full bg-white items-center flex">
//                 <div className="text-neutral-700 w-full  h-full text-sm font-normal font-cabin">
//                     <div className={`w-full z-100 relative h-full decoration:none px-6 py-2 border rounded-md border ${error.set? 'border-red-600' : 'border-neutral-300' }  inline-flex justify-center items-center cursor-pointer`}>
//                         <div className="flex relative w-full gap-4 justify-center items-center" >
//                             <input className='slim absolute w-full h-full opacity-0 focus-visible:outline-0 cursor-hover' onChange={handleChange} value={value} min={getDateXDaysAway(Number(min))} type='date'/>
//                             <div className="text-gray-600 bg-white whitespace-nowrap text-base font-medium font-cabin">{formatDateMonth(value)}</div>
//                             <div className="h-6 w-6">
//                                 <img src={chevron_down} alt="open" />
//                             </div>
//                             {error.set && <div className="absolute left-0 top-[33px] w-full text-xs text-red-600 font-cabin">
//                                 {error.message}
//                             </div>}
//                         </div>        
//                     </div>
//                 </div>
//             </div>
//       </div> }
//     </>)
// }


import { useState, useRef, useEffect } from "react";
import { titleCase, formatDate, formatDateMonth } from "../../utils/handyFunctions";
import chevron_down from "../../assets/chevron-down.svg";
import { formatDate2 } from "../../utils/handyFunctions";

function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function SlimDate(props) {
  const format = props.format ?? 'date-month-year';
  const title = props.title || "Title";
  const min = props?.min ?? 0;
  let date = props.date;
  date = (date != undefined && date != null && !isNaN(new Date(date))) ? new Date(date).toISOString().split('T')[0] : getCurrentDate();
  const onChange = props.onChange;
  const [value, setValue] = useState(date);
  const error = props.error || { set: false, message: '' };
  const inputRef = useRef(null);

  function getDateXDaysAway(days) {
    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + days);

    const year = futureDate.getFullYear();
    const month = String(futureDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(futureDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  const handleChange = (e) => {
    setValue(e.target.value);
    console.log(e.target.value);
    onChange(e);
  };

  const handleContainerClick = () => {
    inputRef.current.click();
  };

  return (
    <>
      {format != 'date-month' && (
        <div
          className="min-w-[200px] w-full md:w-fit max-w-[403px] h-[73px] flex-col justify-start items-start gap-2 inline-flex"
          onClick={handleContainerClick}
        >
          {/* title */}
          <div className="text-zinc-600 text-sm font-cabin select-none">{title}</div>

          {/* input */}
          <div className="w-full h-full bg-white items-center flex">
            <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin">
              <div className=" w-full z-100 relative h-full decoration:none px-6 py-2 border rounded-md border border-neutral-300 inline-flex justify-center items-center cursor-pointer">
                <div className="flex relative w-full gap-4 justify-center items-center">
                  <input
                    ref={inputRef}
                    className="slim absolute w-full h-full opacity-0 focus-visible:outline-0 cursor-hover"
                    onChange={handleChange}
                    value={value}
                    min={getDateXDaysAway(Number(min))}
                    type="date"
                  />
                  <div className="text-gray-600 bg-white whitespace-nowrap text-base font-medium font-cabin">
                    {formatDate(value)}
                  </div>
                  <div className="h-6 w-6">
                    <img src={chevron_down} alt="open" />
                  </div>
                  {error.set && (
                    <div className="absolute left-0 top-[33px] w-full text-xs text-red-600 font-cabin">
                      {error.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {format == 'date-month' && (
        <div
          className="min-w-[136px] w-full md:w-fit max-w-[403px] h-[73px] flex-col justify-start items-start gap-2 inline-flex"
          onClick={handleContainerClick}
        >
          {/* title */}
          <div className="text-zinc-600 text-sm font-cabin">{title}</div>

          {/* input */}
          <div className="w-full h-full bg-white items-center flex">
            <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin">
              <div
                className={`w-full z-100 relative h-full decoration:none px-6 py-2 border rounded-md border ${
                  error.set ? 'border-red-600' : 'border-neutral-300'
                } inline-flex justify-center items-center cursor-pointer`}
              >
                <div className="flex relative w-full gap-4 justify-center items-center">
                  <input
                    ref={inputRef}
                    className="slim absolute w-full h-full opacity-0 focus-visible:outline-0 cursor-hover"
                    onChange={handleChange}
                    value={value}
                    min={getDateXDaysAway(Number(min))}
                    type="date"
                  />
                  <div className="text-gray-600 bg-white whitespace-nowrap text-base font-medium font-cabin">
                    {formatDateMonth(value)}
                  </div>
                  <div className="h-6 w-6">
                    <img src={chevron_down} alt="open" />
                  </div>
                  {error.set && (
                    <div className="absolute left-0 top-[33px] w-full text-xs text-red-600 font-cabin">
                      {error.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
