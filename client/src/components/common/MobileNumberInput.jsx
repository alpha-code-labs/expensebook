import { useState, useRef, useEffect } from "react";
import { titleCase } from "../../utils/handyFunctions";
import visibility_on_icon from '../../assets/visibility_on.svg'
import visibility_off_icon from '../../assets/visibility_off.svg'


export default function Input(props){
    const placeholder = props.placeholder || "Enter you mobile number";
    const value = props.value
    const title = props.title || "Mobile Number";
    const onBlur = props.onBlur
    const type = props.type??'text'
    const onChange = props.onChange
    const inputRef = useRef(null)
    const [textInput, setTextInput] = useState(value? titleCase(value) : '')
    const error = props.error || {set:false, message:''}
    const [inputEntered, setInputEntered] = useState(false)
    
    const handleChange = (e)=>{
        e.preventDefault()
        setTextInput(e.target.value)
        if(e.target.value == '')
            setInputEntered(false)
        else setInputEntered(true)
        if(onChange??false){
            onChange(e)
        }
    }

    const handleBlur= (e)=>{
        
        if(onBlur??false){
            onBlur(e)
        }
    }

    
    return(<>
        <div className="min-w-[200px] w-full md:w-fit max-w-[403px] h-[73px] flex-col justify-start items-start gap-2 inline-flex grow">
            {/* title */}
            <div className="text-zinc-600 text-sm font-cabin">{title}</div>

            {/* input */}
            <div className="relative w-full h-full bg-white items-center flex">
                <selec>
                    
                </selec>
                <div className="relative text-neutral-700 w-full  h-full text-sm font-normal font-cabin flex items-center justify-between">
                    <input
                        ref={inputRef}
                        onChange={handleChange} 
                        onBlur={handleBlur}
                        type={visibility? 'text' : type}
                        className=" w-full h-full decoration:none px-6 py-2 border rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 " 
                        value={textInput} 
                        placeholder={placeholder}/>
                    {type == 'password' && <img src={visibility? visibility_on_icon : visibility_off_icon} className="absolute w-6 right-2 bg-white cursor-pointer" onClick={()=>setVisibility(pre=>!pre)} />}
                </div>

                <div className="absolute text-xs text-red-600 left-0 px-6 top-[44px]">
                    {error.set && error.message}
                </div>

            </div>

      </div>

    </>)
}