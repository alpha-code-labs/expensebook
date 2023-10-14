
import arrows_icon from '../../assets/clarity_two-way-arrows-line.svg'
import calendar_icon from '../../assets/calendar.svg'
import { formatDate2 } from "../../utils/handyFunctions"


export default function Cities(props){

    const cities = props.cities || []

    return(<>
        {cities.map((item, index)=>
                    <div key={index} className="mt-4 flex items-center gap-4 flex-wrap">
                    <div className="flex items-center">
                        <p className='text-neutral-800 text-sm font-cabin'>{item.from}</p>
                        <img src={arrows_icon} className='w-5 mx-1' />
                        <p className='text-neutral-800 text-sm font-cabin'>{item.to}</p>
                    </div>

                    <div className="flex items-center gap-1">
                        <img src={calendar_icon} className='w-4 h-4' />
                        <p className='text-neutral-700 text-sm font-cabin'>{formatDate2(item.departure.date)}</p>
                        {item?.return?.date && <> <p className='text-neutral-500 text-sm font-cabin'>to</p>
                        <p className='text-neutral-700 text-sm font-cabin'>{formatDate2(item.return.date)}</p></>}                    
                    </div>
                </div>
                )}
    </>)
}