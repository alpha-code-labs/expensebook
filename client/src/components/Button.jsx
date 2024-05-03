import React from 'react'

const Button = ({label,onClick, varient}) => {
  return (
    <button onClick={onClick} className={`h-11 px-5 py-3 ${varient === 'w-fit' ? 'w-fit' : 'w-full'} rounded bg-gradient-to-r from-blue-100/80 flex justify-center items-center  w-full to-sky-blue`}>

        <p className='font-inter leading-5 font-semibold text-white text-[16px]'>{label}</p>

    </button>
  )
}

export default Button
