import React from 'react'

const Button = (props) => {
    const text= props.text
    const textAndBgColor=props.textAndBgColor
    const onClick =props.onClick
  return (
    <div onClick={onClick} className={`${textAndBgColor} ${"text-neutral-900 hover:bg-gray-200/10  w-fit h-8 px-8 py-4 border border-slate-300   rounded-md justify-center items-center gap-2 inline-flex cursor-pointer"}`}>
        <div className= " w-full h-5 text-center   text-[16px] font-medium font-cabin">
            {text}

        </div>
      
    </div>
  )
}

export default Button
