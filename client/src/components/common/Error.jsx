import { spinner_icon } from "../../assets/icon"

export default function ({message=null}){
    return(
        <div className="w-full h-full flex items-center justify-center">
            {!message && <div className='w-6 h-6 mt-4'>
                    <img src={spinner_icon} alt='spinner' />
                </div>}    
            {message && <div className='p-10 border border-gray-300 roundex-xl'>
                <p className="text-xl text-neutral-700 font-cabin">{message}</p>
                </div>}
        </div>)
}