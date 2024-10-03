import React, { useState, useRef } from "react";
import { titleCase } from "../../utils/handyFunctions";

const Input = ({ title, placeholder, onChange ,error,initialValue, icon,type}) => {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const showError = error?.set && !inputValue.trim();

  return (
<>
      {/* input */}
    
        <div className="min-w-[300px] px-2 bg-white focus-within:border focus-within:border-neutral-700 h-[38px]  rounded-md  text-neutral-700  w-full  text-sm font-normal font-cabin justify-center items-center  flex flex-row  ">
        <img src={icon} className="shrink-0 w-4 h-4   cursor-pointer m-2 " />
          <input
            ref={inputRef}
            onChange={(e) => {
              setInputValue(e.target.value);
              onChange && onChange(e.target.value);
            }}
            className="w-full h-full border-none focus-visible:outline-0 rounded-md decoration:none  placeholder:text-neutral-400  "
            value={initialValue || inputValue}
            placeholder={placeholder}
          />

        </div>
        
        {/* {showError && (
        <div className="absolute  top-[48px] w-full text-xs text-red-500 font-cabin">
          {error.message}
        </div>
      )} */}
     
      </>
   
  );
};

export default Input;
// import React, { useState, useRef } from "react";
// import { titleCase } from "../../utils/handyFunctions";

// const Input = ({ title, placeholder, onChange ,error,initialValue, icon,type}) => {
//   const inputRef = useRef(null);
//   const [inputValue, setInputValue] = useState("");
//   const showError = error?.set && !inputValue.trim();

//   return (
//     <div className="min-w-[200px] w-full h-[53px] flex-col justify-start items-start gap-2 inline-flex mb-3">
//       {/* title */}
//       <div className="text-zinc-600 text-sm font-cabin">{title}</div>

//       {/* input */}
//       <div className="relative w-full h-full bg-white items-center flex ">
//         <div className="text-neutral-700 bg-indigo-100 rounded-md w-full h-full text-sm font-normal font-cabin justify-center items-center  flex flex-row border border-neutral-300 focus-within:border-indigo-600 fou ">
//         <img src={icon} className=" w-5 h-5 right-2  cursor-pointer m-2 mx-4" />
//           <input
//             ref={inputRef}
//             onChange={(e) => {
//               setInputValue(e.target.value);
//               onChange && onChange(e.target.value);
//             }}
//             className="w-full h-full decoration:none px-6 py-2 rounded-r-md border-l placeholder:text-neutral-400 border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 "
//             value={initialValue || inputValue}
//             placeholder={placeholder}
//           />

//         </div>
        
//         {showError && (
//         <div className="absolute  top-[48px] w-full text-xs text-red-500 font-cabin">
//           {error.message}
//         </div>
//       )}
//       </div>
      
//     </div>
//   );
// };

// export default Input;
