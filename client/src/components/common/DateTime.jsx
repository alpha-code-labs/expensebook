import chevron_down from "../../assets/chevron-down.svg";
import { formatDate } from "../../utils/handyFunctions";
import { useState } from "react";

export default function DateTime(props){
    
    const date = props.date || Date.now()
    const title = props.title || 'Title'
    const time = props.time || '11:00'
    const onTimeChange = props.onTimeChange
    const onDateChange = props.onDateChange
    const [dateValue, setDateValue] = useState(date? date : Date.now());
    const [timeValue, setTimeValue] = useState(time)

    const handleDateChange= (e)=>{
       setDateValue(e.target.value)
       console.log(e.target.value)
       onDateChange(e)
    }

    const handleTimeChange= (e)=>{
        setTimeValue(e.target.value)
        console.log(e.target.value)
        onTimeChange(e)
    }

    return(<>
<div className="w-[269px] h-[138px] px-[31px] py-2.5 bg-white rounded-xl border border-neutral-200 flex-col justify-start items-center gap-2 inline-flex">
    <div className="flex-col justify-start items-start gap-3 flex">
        <div className="flex-col justify-start items-start gap-2 flex">
            <div className="text-zinc-500 text-xs font-normal font-cabin">{title}</div>
            <div className="justify-start items-center gap-2 inline-flex cursor-pointer">
            <div className="flex relative w-full gap-4 items-center" >
                <input className='slim absolute left-0 top-0 w-full h-full opacity-0 focus-visible:outline-0 cursor-pointer' onChange={handleDateChange} type='date'/>
                <div className="text-gray-700 bg-white whitespace-nowrap text-lg font-medium font-cabin">{formatDate(dateValue)}</div>
                <div className="h-6 w-6">
                    <img src={chevron_down} alt="open" />
                </div>
            </div>
            </div>
        </div>
        <div className="h-[47px] flex-col justify-start items-start gap-2 flex">
            <div className="text-zinc-500 text-xs font-normal font-cabin">Preferred Time </div>
            <div className="justify-start items-center gap-2 inline-flex cursor-pointer">
            <div className="flex relative w-full gap-4 items-center" >
                <input className='slim absolute left-0 top-0 w-full h-full opacity-0 focus-visible:outline-0 cursor-pointer' onChange={handleTimeChange} type='time'/>
                <div className="text-gray-700 bg-white whitespace-nowrap text-lg font-medium font-cabin">{timeValue}</div>
                <div className="h-6 w-6">
                    <img src={chevron_down} alt="open" />
                </div>
            </div>
            </div>
        </div>
    </div>
</div>
    </>)
}