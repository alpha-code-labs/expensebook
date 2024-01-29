import React from 'react'
import { titleCase } from '../../utils/handyFunctions'

const ActionButton = ({text ,onClick ,variant}) => {

  return (
    <div onClick={onClick} className={`${variant==='red' ? 'bg-red-500' : 'bg-green-200'}flex justify-center items-center py-2 px-3 bg-purple-500 text-white-100 rounded-full w-full h-[34px]`}>
    <p className=' font-cabin text-sm  text-center'> {titleCase(text || "")}</p>
 </div>
  )
}

export default ActionButton
