import React, { useState, useRef } from "react";
//import { titleCase } from "../../utils/handyFunctions";

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
