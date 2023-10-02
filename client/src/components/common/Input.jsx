import { useState, useRef, useEffect } from "react";
import { titleCase } from "../../utils/handyFunctions";

export default function Input(props){
    const placeholder = props.placeholder || "Placeholder Text";
    const title = props.title || "Title";
    const onChange = props.onChange
    const inputRef = useRef(null)
    const [textInput, setTextInput] = useState('')
    
    const inputChange = (e)=>{
        e.preventDefault()
        setTextInput(titleCase(e.target.value))
        onChange(e)
    }

    
    return(<>
        <div className="min-w-[200px] w-full md:w-fit max-w-[403px] h-[73px] flex-col justify-start items-start gap-2 inline-flex">
            {/* title */}
            <div className="text-zinc-600 text-sm font-cabin">{title}</div>

            {/* input */}
            <div className="relative w-full h-full bg-white items-center flex">
                <div className="text-neutral-700 w-full  h-full text-sm font-normal font-cabin">
                    <input
                        ref={inputRef}
                        onChange={inputChange} 
                        className=" w-full h-full decoration:none px-6 py-2 border rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 " 
                        value={textInput} 
                        placeholder={placeholder}></input>
                </div>
            </div>

      </div>

    </>)
}