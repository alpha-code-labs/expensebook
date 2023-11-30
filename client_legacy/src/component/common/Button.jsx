import React from 'react'

const Button = (props) => {
    const text= props.text
    const textAndBgColor=props.textAndBgColor
    const onClick =props.onClick
  return (
    <div onClick={onClick} className={`${textAndBgColor} ${"w-full h-12 px-8 py-4  rounded-[32px] justify-center items-center gap-2 inline-flex cursor-pointer"}`}>
        <div className= "w-full h-5 text-center  text-[16px] font-medium font-cabin">
            {text}

        </div>
      
    </div>
  )
}

export default Button
