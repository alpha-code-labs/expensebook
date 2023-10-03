import React from 'react';

const CurrencyInput = ({ currencyIconSrc, currencySymbol, value }) => {

  
  return (
    <div className="flex flex-row items-start justify-start">
      <div className="flex flex-col items-start justify-start">
        <div className="self-stretch rounded-md bg-white overflow-hidden flex flex-col items-start justify-start py-3 px-4 border-[1px] border-solid border-darkgray">
          <div className="flex flex-row items-center justify-start gap-[32px]">
            <img
              className="relative w-6 h-6 overflow-hidden shrink-0"
              alt="Currency Icon"
              src={currencyIconSrc}
            />
            <div className="flex flex-row items-center justify-start gap-[8px]">
              <div className="relative">{currencySymbol}</div>
              <input
                type="text"
                className="w-[20px] relative text-base font-inter text-dark-200 bg-transparent border-none outline-none focus:ring-0"
                value={value}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyInput;





// import React from 'react';

// const CurrencyInput = ({ currencyIconSrc, currencySymbol, value }) => {
//   return (
//     <div className="flex flex-row items-start justify-start">
//       <div className="flex flex-col items-start justify-start">
//         <div className="self-stretch rounded-md bg-white overflow-hidden flex flex-col items-start justify-start py-3 px-4 border-[1px] border-solid border-darkgray">
//           <div className="flex flex-row items-center justify-start gap-[32px]">
//             <img
//               className="relative w-6 h-6 overflow-hidden shrink-0"
//               alt="Currency Icon"
//               src={currencyIconSrc}
//             />
//             <div className="flex flex-row items-center justify-start gap-[8px]">
//               <div className="relative">{currencySymbol}</div>
//               <input
//                 type="text"
//                 className="w-[20px] relative text-base font-inter text-dark-200 bg-transparent border-none outline-none focus:ring-0"
//                 value={value}
//                 readOnly
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CurrencyInput;
