import { useEffect } from "react"
import check_icon from '../../assets/check.svg'



export default function Progress({states}){
    return(<>
        <div className="w-[3px] z-[100] fixed left-[20px] top-[110px] flex flex-col gap-8 bg-gray-300 items-center jusitfy-center">
            <Dot active={false} done={true} title={'Section-1'}/>
            <Dot active={true} done={false} title={'Section-2'}/>
            <Dot active={false} done={false} title={'Section-3'}/>
        </div>
    </>)
}



const Dot = ({active, done, title})=>{
    useEffect(()=>{

    },[])
    return(<>
        <div className={`w-6 h-6 rounded-full ${active ? 'bg-green-400' : done? 'bg-green-400' : 'bg-white'} p-1`}>
            <div className={`absolute w-4 h-4 rounded-full ${done ? 'bg-green-400' : 'bg-white'} text-center`}>
                {done && <img src={check_icon} className='w-4 h-4' />}
                <p className={`relative ${done? '-top-[15px]' : '-top-[0px]' } -right-6 text-xs font-cabin text-neutral-400 whitespace-nowrap`}>{title}</p>
            </div>
        </div>
    </>)
}