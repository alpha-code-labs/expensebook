import { cancel_icon, info_icon } from "../../assets/icon"
import { getStatusClass } from "../../utils/handyFunctions"

const StatusBox = ({status})=>(
    <div className='flex justify-center items-center gap-2'>
    <div className={`text-center rounded-sm ${getStatusClass(status?? "-")}`}>
    <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{(status === "save" ? "Saved" : status) ?? "-"}</p>
  </div>
  </div>
  )
 
  
export {StatusBox, TitleModal}  
function TitleModal ({onClick, text, iconFlag= false}){
  return (
    <div className='flex gap-2 justify-between items-center bg-gray-200/20 w-full p-4'>
       <div className='flex gap-2'>
            {iconFlag && <img src={info_icon} className='w-5 h-5' alt="Info icon"/>}
            <p className='font-inter text-base font-semibold text-neutral-900'>
              {text}
            </p>
          </div>
              {/* <p className='font-inter text-base font-semibold text-neutral-900'>{text}</p> */}
              <div onClick={onClick} className='bg-red-100 cursor-pointer rounded-full border border-white'>
              <img src={cancel_icon} className='w-5 h-5'/>
              </div>
    </div>
  )
}
