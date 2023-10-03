import { useState, useRef, useEffect } from "react";
import { titleCase, formatDate } from "../../utils/handyFunctions";
import chevron_down from "../../assets/chevron-down.svg";


export default function SlimDate(props){
    const title = props.title || "Title";
    const inputDate = props.date || Date.now()
    const inputRef = useRef(null)
    const [textInput, setTextInput] = useState('')
    

    const handleClick= ()=>{
        
    }



    
    return(<>
        <div className="min-w-[200px] w-full md:w-fit max-w-[403px] h-[73px] flex-col justify-start items-start gap-2 inline-flex">
            {/* title */}
            <div className="text-zinc-600 text-sm font-cabin">{title}</div>

            {/* input */}
            <div className="relative w-full h-full bg-white items-center flex">
                <div className="text-neutral-700 w-full  h-full text-sm font-normal font-cabin">
                    <div
                        ref={inputRef} 
                        onClick={handleClick}
                        className=" w-full h-full decoration:none px-6 py-2 border rounded-md border border-neutral-300 inline-flex justify-center items-center cursor-pointer" 
                        >
                            <div className="flex gap-2 justify-between items-center">
                                <div className="text-gray-600 text-base font-medium font-cabin">{formatDate(inputDate)}</div>
                                <div className="w-6 h-6 relative " >
                                    <img src={chevron_down} />
                                </div>
                            </div>
                        </div>
                </div>
            </div>

      </div>

    </>)


}