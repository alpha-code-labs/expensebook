import app_icon from '../../assets/app_icon.svg'
import app_symbol from '../../assets/app_symbol.svg'

export default function Icon(){
    
    return(<>
    <div className='sticky top-0 px-[20px] md:px-[50px] lg:px-[104px] pb-6 pt-10 z-[1000]  bg-slate-50 w-full'>
        <div className="flex items-center h-[12] py-2 w-fit justify-center">
            <img className='w-[23px] h-[23px]' src={app_symbol} />
            <img className='w-[168px] h-[27px] -ml-[7px]' src={app_icon} />
        </div>
    </div>
    </>)
}
            