import { useState } from "react"

export default function InputPercentage(props){
    const title=props.title
    const textInput = props.textInput || 0
    const onBlur = props.onBlur
    const [percentage, setPercentage] = useState(textInput) 

    const onChange = (e)=>{
        if(!isNaN(e.target.value)){
            setPercentage(e.target.value)
        }
    }


    return(
        <div className="min-w-20 w-full max-w-[193px] h-[73px] flex-col justify-start items-start gap-2 inline-flex">
            {/* title */}
            <div className="text-zinc-600 text-sm font-cabin">{title}</div>

            {/* input */}
            <div className="relative w-full h-full bg-white items-center flex gap-2">
                
                <div className="relative text-neutral-700 w-full  h-full text-sm font-normal font-cabin">
                    <input
                        onChange={onChange}
                        onBlur={()=>onBlur(percentage)} 
                        className=" w-full h-full decoration:none pl-11 pr-6 py-2 border rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 " 
                        value={percentage} 
                        />
                    <p className="absolute left-6 top-3.5 text-black text-sm font-normal font-cabin">%</p>
                </div>
            </div>
    </div>   
    )   
}