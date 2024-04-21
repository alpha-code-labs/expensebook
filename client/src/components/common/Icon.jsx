import app_icon from '../../assets/app_icon.svg'
import app_symbol from '../../assets/app_symbol.svg'
import LeftProgressBar from './LeftProgressBar'

export default function Icon(){
    
    return(<>
    <div className='fixed top-0 left-0 px-[20px] md:px-[50px] lg:px-[10px] py-2 z-[1000]  bg-slate-50 w-full shadow-md'>
        <div className="flex items-center h-[12] py-2 w-fit justify-center">
            <img className='w-[23px] h-[23px]' src={app_symbol} />
            <img className='w-[168px] h-[27px] -ml-[7px]' src={app_icon} />
        </div>
    </div>
    </>)
}
            