import {chevron_down} from '../../assets/icon'
import { formatDate } from '../../utils/handyFunctions'
import { useState } from 'react';

export default function Date(props){

    const [value, setValue] = useState(props.date);
    const onSelect = props.onSelect || null
    const error = props.error || {set:false, message:''}


    
    if(!onSelect) return

    const handleChange= (e)=>{
       setValue(e.target.value)
       console.log(e.target.value)

       onSelect(e.target.value)
    }

    return (<div className="relative w-[270px] h-[84px] pl-[55.50px] pr-[54.50px] pt-4 pb-[21px] bg-white rounded-xl border border-neutral-200 justify-center items-center inline-flex">
    <div className="self-stretch flex-col justify-start items-start gap-2 inline-flex">
        <div className="text-zinc-500 text-xs font-normal font-cabin">Select dates for cab</div>
        <div className="justify-start items-center gap-2 inline-flex">
            <div className="flex relative w-full gap-4 items-center" >
                <input className='slim absolute left-0 top-0 w-full h-full opacity-0 focus-visible:outline-0 cursor-pointer' onChange={handleChange} type='date'/>
                <div className="text-gray-700 bg-white whitespace-nowrap text-lg font-medium font-cabin">{formatDate(value)}</div>
                <div className="h-6 w-6">
                    <img src={chevron_down} alt="open" />
                </div>
            </div>  
        </div>
    </div>

    <div className="absolute text-xs text-red-600 left-[35px] px-6 top-[83px]">
        {error.set  && (value===undefined || value===null) && error.message}
    </div>

</div>)
}