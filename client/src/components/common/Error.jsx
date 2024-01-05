//import  spinner_icon  from "../../assets/spinning-loading.gif"
import  spinner_icon  from "../../assets/spinner.gif"

export default function ({message=null}){
    return(
        <div className="w-full h-full flex items-center justify-center mt-10">
            {!message && <div className='w-[200px] '>
                    <img src={spinner_icon} className="w-10" alt='spinner' />
                </div>}    
            {message && <div className='p-10 border border-gray-300 roundex-xl'>
                <p className="text-xl text-neutral-700 font-cabin">{message}</p>
                </div>}
        </div>)
}