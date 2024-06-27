import spinner_icon  from '../../assets/spinner.gif';
import fetchError_icon from '../../assets/fetchError.jpg'

export default function ({message=null}){
    return(
        <div className="w-full h-full flex flex-col items-center justify-center mt-20">
            {!message && <div className='flex items-center jusitfy-center'>
                    <img src={spinner_icon} alt='spinner' className='w-6 h-6' />
                </div>}    
            {message && <div className='flex flex-col items-center justify-center'>
                <img src={fetchError_icon} className='w-[300px] h-[300px] animate-pulse' />
                <div className="text-xl text-neutral-700 font-cabin mt-4">{message}</div>
                </div>}
        </div>)
}