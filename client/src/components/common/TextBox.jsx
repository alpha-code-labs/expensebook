import React, { useState, useRef } from "react";
import { titleCase } from "../../utils/handyFunctions";

const TextBox = ({ title, placeholder, onChange, error, initialValue }) => {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState( " ");
  const showError = error && !inputValue.trim();

  return (
    <div className="min-w-[200px]  w-full h-full flex-col justify-start items-start gap-2 inline-flex mb-3">
      {/* title */}
      <div className="text-zinc-600 text-sm font-cabin">{title}</div>

      {/* input */}
      <div className="relative w-full h-full bg-white items-center flex">
        <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin">
          <textarea
            ref={inputRef}
            onChange={(e) => {
              setInputValue(e.target.value);
              onChange && onChange(e.target.value);
            }}
            className="w-full h-full decoration:none px-6 py-2 rounded-md border placeholder:text-gray-600 border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 "
            value={initialValue || inputValue}
            placeholder={placeholder}
          />
        </div>
        {showError && (
          <div className="absolute top-[48px] w-full text-xs text-red-500 font-cabin">
            {error.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextBox;
