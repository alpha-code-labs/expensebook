import React, { useState } from 'react'

const Input = ({onChange, placeholder,type,error}) => {
    const [inputValue , setInputValue]= useState("")
  return (
    // <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin">
          <input
            onChange={(e) => {
              setInputValue(e.target.value);
              onChange && onChange(e.target.value);
            }}
            type={type}
            className={`w-full bg-slate-50 h-full text-neutral-600 decoration:none px-4 py-3 rounded border-[1px] placeholder:text-zinc-400 font-inter placeholder:font-inter font-normal leading-5  border-slate-300 focus-visible:outline-0  focus:outline-none   focus:border-blue-100 ${error ? 'border-red-400' : ''}`}
            value={inputValue}
            placeholder={placeholder}
          />
        // </div>
  )
}

export default Input
