import React from 'react'
import { titleCase } from '../../utils/handyFunctions'

const ActionButton = (props) => {
  const text = props.text
  const onClick = props.onClick
  const disabled = props.disabled?? false

  const handleClick = (e)=>{
    if(!disabled){
        onClick(e)
    }
    else{
        console.log('disabled')
    }
}
  return (
 <div onClick={handleClick}  className={`${disabled ? 'cursor-not-allowed opacity-20' : 'cursor-pointer'}  flex  justify-center items-center py-2 px-2 ${text===titleCase('Approve') ?'bg-green-100 text-green-200' : 'bg-red-100 text-red-200'} rounded-full w-[86px] h-[34px]`}>
    <p className=' font-cabin text-sm  text-center'> {titleCase(text ?? "")}</p>
 </div>
  )
}

export default ActionButton
