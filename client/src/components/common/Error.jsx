import { spinner_icon } from "./Icons"

export default function ({message=null}){
    return(
        <div className="w-full h-full flex items-center justify-center mt-10">
            {!message && <div className='flex items-center jusitfy-center'>
                    <img src={spinner_icon} alt='spinner' className='w-6 h-6' />
                </div>}    
            {message && <div className='p-10 border border-gray-300 roundex-xl'>
                <p className="text-xl text-neutral-700 font-cabin">{message}</p>
                </div>}
        </div>)
}