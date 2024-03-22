import { app_icon,app_symbol } from "../../assets/icon"

export default function Icon(){
    
    return(<>
        <div className="flex items-center">
            <img className='w-[23px] h-[23px]' src={app_symbol} />
            <img className='w-[168px] h-[27px] -ml-[7px]' src={app_icon} />
        </div>
    </>)
}