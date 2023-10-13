import React from 'react'

const Input = (props) => {

    const onChange = props.onChange
    const value = props.value
    const name = props.name
    const id= props.id
    const htmlFor = props.htmlFor
    const type = props.type
    const label = props.label

  return (
   <>
        {/* <label htmlFor={htmlFor} className="text-[#333] font-cabin font-semibold leading-normal text-[14px]  tracking-tight">{label}</label> */}
        <label  htmlFor={htmlFor} className="font-medium  text-gray-400 font-cabin  leading-normal text-[14px]">
        {label}
      </label>
  <div className="w-full h-[48px] mt-2   flex flex-row items-center justify-start border border-gray-600 rounded-md hover:border-purple-500 focus:border-purple-500">
    <input
      id={id}
      type={type}
      name={name}
      onChange={onChange}
      value={value}
      placeholder="Amount"
      className="flex-1  w-5 px-6  border-none outline-none placeholder:text-gray-200 placeholder:text-[14px] placeholder:font-normal "
    />
    
 
      
    </div>
    </>
  )
}

export default Input
