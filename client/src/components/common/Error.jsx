
import {spinner_icon} from "../../assets/icon"

/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */



export default function ({message=null}){
    return(
        <div className="w-full h-full flex items-start justify-center mt-4">
            {message==null &&  <div className='w-6 h-6 '>
                    <img src={spinner_icon} alt='spinner' />
                </div>}    
            {message !=null && <div className='p-10 border  border-gray-300 roundex-xl'>
                <p className="text-xl text-neutral-700 font-cabin">{message}</p>
                </div>}
        </div>)
}
