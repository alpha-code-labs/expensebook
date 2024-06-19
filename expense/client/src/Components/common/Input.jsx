// // Input.js
// import React, { useState, useRef, useEffect } from "react";
// import { titleCase } from "../../utils/handyFunctions";

// const Input = ({ title, placeholder, onChange, error, initialValue, type }) => {
//   const inputRef = useRef(null);
//   const [inputValue, setInputValue] = useState("");

//   useEffect(() => {
//     if (initialValue !== undefined) {
//       setInputValue(initialValue);
//     }
//   }, [initialValue]);

//   const showError = error?.set && !inputValue.trim();

//   return (
//     <div className="min-w-[200px] w-full h-[73px] flex-col justify-start items-start gap-2 inline-flex mb-3">
//       <div className="text-zinc-600 text-sm font-cabin">{title}</div>
//       <div className="relative w-full h-full bg-white items-center flex">
//         <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin">
//           <input
//             ref={inputRef}
//             onChange={(e) => {
//               setInputValue(e.target.value);
//               onChange && onChange(e.target.value);
//             }}
//             type={type}
//             className="w-full h-full decoration:none px-6 py-2 rounded-md border placeholder:text-zinc-400 border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 "
//             value={inputValue}
//             placeholder={placeholder}
//           />
//         </div>
//         {showError && (
//           <div className="absolute  top-[48px] w-full text-xs text-red-500 font-cabin">
//             {error.message}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Input;


import React, { useState, useRef } from "react";


const Input = ({ title, placeholder, onChange ,error,initialValue,type,inputRef}) => {

  const [inputValue, setInputValue] = useState("");
  const showError = error?.set && !inputValue.trim();

  return (
    <div className="min-w-[200px] w-full h-[73px] flex-col justify-start items-start gap-2 inline-flex mb-3">
      {/* title */}
      <div className="text-zinc-600 text-sm font-cabin">{title}</div>

      {/* input */}
      <div className="relative w-full h-full bg-white items-center flex">
        <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin">
          <input
            ref={inputRef}
            onChange={(e) => {
              setInputValue(e.target.value);
              onChange && onChange(e.target.value);
            }}
            type={type}
            className="w-full h-full placeholder:normal-case capitalize decoration:none px-6 py-2 rounded-md border placeholder:text-zinc-400 border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 "
            value={initialValue || inputValue}
            placeholder={placeholder}
          />
        </div>
        {error?.set && (
        <div className="absolute  top-[48px] w-full text-xs text-red-500 font-cabin">
          {error?.msg}
        </div>
      )} 
      </div>
      
    </div>
  );
};

export default Input;

