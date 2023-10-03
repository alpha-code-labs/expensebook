
import React from "react";
import { logo_with_name , left_arrow , down_arrow , circle_flags_uk , circle_flags_india , cancel_dot} from "../../assets/icons";

const CurrencyInfo = ({ currencyCode,  exchangeRate, currencySymbol, value ,deleteIcon ,onValueChange}) => {

  const defaultCurrencyValue = "INR"
  return (
    <>
    <div className="flex flex-row items-center justify-start gap-[24px]">
    <div className="flex flex-row items-center justify-start gap-[16px]">
      <img
        className="relative w-6 h-6 overflow-hidden shrink-0"
        alt={`Flag for`}
        src={circle_flags_uk}
      />
      <div className="flex flex-row items-center justify-start">
        <div className="flex flex-row items-center justify-start gap-[8px]">
          <div className="relative">{currencyCode}</div>
          <div className="relative text-base font-inter text-dark-200">
            {exchangeRate}
          </div>
        </div>
      </div>
    </div>
     <div className="flex flex-row items-start justify-start">
     <div className="flex flex-col items-start justify-start">
       <div className="self-stretch rounded-md bg-white overflow-hidden flex flex-col items-start justify-start py-3 px-4 border-[1px] border-solid border-darkgray">
         <div className="flex flex-row items-center justify-start gap-[32px]">
           <img
             className="relative w-6 h-6 overflow-hidden shrink-0"
             alt="Currency Icon"
             src={circle_flags_india}
           />
           {/* <h1>{defaultCurrencyValue}</h1> */}
           <div className="flex flex-row items-center justify-start gap-[8px]">
             <div className="relative">{currencySymbol}</div>
             <input
               type="text"
               className="w-[20px] relative text-base font-inter text-dark-200 bg-transparent border-none outline-none focus:ring-0"
               value={value}
               onChange={(e) => onValueChange(e.target.value)}
              
             />
             
           </div>
         </div>
       </div>
     </div>
     <div
                className="flex items-center justify-center cursor-pointer "
              >
                <img  alt="" src={deleteIcon}
                 className="bg-red-500 rounded-full" />
              </div>
   </div>
   </div>
   </>
  );
};

export default CurrencyInfo;



// import React from "react";

// const CurrencyInfo = ({ currencyCode, flagIconSrc, exchangeRate ,}) => {
//   return (
//     <div className="flex flex-row items-center justify-start gap-[16px]">
//       <img
//         className="relative w-6 h-6 overflow-hidden shrink-0"
//         alt={`Flag for ${currencyCode}`}
//         src={flagIconSrc}
//       />
//       <div className="flex flex-row items-center justify-start">
//         <div className="flex flex-row items-center justify-start gap-[8px]">
//           <div className="relative">{currencyCode}</div>
//           <div className="relative text-base font-inter text-dark-200">
//             {exchangeRate}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CurrencyInfo;
