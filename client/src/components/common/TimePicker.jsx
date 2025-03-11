import {chevron_down} from "../../assets/icon";
import { formatDate } from "../../utils/handyFunctions";
import React,{useState,useEffect} from "react";



function getCurrentDate(){
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}



export default function TimePicker(props){
    
    const title = props.title || 'Title'
    const time = props.time || '11:00'
    const onTimeChange = props.onTimeChange
    const [timeValue, setTimeValue] = useState(time)
    const [hours, setHours] = useState(time.split(':')[0]>=12? time.split(':')[0]-12 : time.split(':')[0])
    const [minutes, setMinutes] = useState(time.split(':')[1])
    const [suffix, setSuffix] = useState(time.split(':')[0]>=12? 'PM' : 'AM')
    const error = props.error || {set:false, message:''}



    const handleTimeChange= (e)=>{
        setTimeValue(e.target.value)

        console.log(e.target.value)
        onTimeChange(e)
    }

    useEffect(()=>{
        setHours(timeValue.split(':')[0]>=12? time.split(':')[0]-12 : time.split(':')[0])
        setMinutes(timeValue.split(':')[1])
        setSuffix(timeValue.split(':')[0]>=12? 'PM' : 'AM')
    },[timeValue])



return(<>
<div className="relative w-fit h-fit px-[31px] py-2.5 bg-white rounded-xl border border-neutral-200 flex-col justify-start items-center gap-2 inline-flex">
    <div className="h-[47px] flex-col justify-start items-start gap-.5 flex">
        <div className="text-zinc-500 text-xs font-normal font-cabin">{title}</div>
        <div className="justify-start items-center gap-2 inline-flex cursor-pointer">
        <div className="flex relative w-full gap-4 items-center" >
            <input className='slim absolute left-0 top-0 w-full h-full opacity-0 focus-visible:outline-0 cursor-pointer' value={timeValue} onChange={handleTimeChange} type='time'/>
            <div className="text-gray-700 bg-white whitespace-nowrap text-lg font-medium font-cabin">{`${hours}:${minutes} ${suffix}`}</div>
            <div className="h-6 w-6">
                <img src={chevron_down} alt="open" />
            </div>
        </div>
        </div>
    </div>
    <div className="absolute text-xs left-0  w-full top-[70px] text-red-600">
        {error.set && error.message}
    </div>
</div>
    </>)
}