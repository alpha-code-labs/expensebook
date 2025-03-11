import { useState, useEffect } from "react";



export default function({title, address, onChange }){

    const [_address, setAddress] = useState(address)

    const handleChange = (e)=>{
        setAddress(e.target.value)

        if(onChange!==null && onChange!==undefined){
            onChange(e)
        }
    }
    

    return(
        <div className='relative'>
            <textarea onChange={handleChange} className='decoration:none px-6 py-2 border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 min-w-[200px] w-full md:w-fit max-w-[403px]  rounded-xl h-[100px] font-cabin text-sm text-neutral-700'>
                {_address}
            </textarea>
            <div className='absolute text-xs left-3 -top-1.5 bg-white text-neutral-500 font-cabin px-2'>
                {title}
            </div>
        </div>
    )
}