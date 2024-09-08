import { getStatusClass } from "../../utils/handyFunctions"

const StatusBox = ({status})=>(
    <div className='flex justify-center items-center gap-2'>
    <div className={`text-center rounded-sm ${getStatusClass(status?? "-")}`}>
    <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{(status === "save" ? "Saved" : status) ?? "-"}</p>
  </div>
  </div>
  )
 
  
export {StatusBox}  