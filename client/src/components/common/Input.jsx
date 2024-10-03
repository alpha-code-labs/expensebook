import { useState, useRef, useEffect } from "react";
import { titleCase } from "../../utils/handyFunctions";
import { location_icon } from "../../assets/icon";

export default function Input(props){
    const width = props.maxWidth??false;
    console.log(props.maxWidth, 'width from props')
    const placeholder = props.placeholder || "Placeholder Text";
    const value = props.value
    const title = props.title || "Title";
    const onBlur = props.onBlur
    const onChange = props.onChange
    const showLocationSymbol = props.showLocationSymbol??false;
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
        setTextInput(pre=>titleCase(e.target.value));
        if(e.target.value == '' || e.target.value == undefined) setInputEntered(false)
        if(onBlur??false){
            onBlur(e)
        }
    }
    
    return(<>
        <div
            style={{minWidth: `${showLocationSymbol? `${width??'184px'}` : `${width??'200px'}` }`, width: `${width??'100%'}`}} 
            className={`max-w-[403px] h-[73px] flex-col justify-start items-start gap-2 inline-flex`}>
            {/* title */}
            <div className="text-zinc-600 text-sm font-cabin select-none">{title}</div>

            {/* input */}
            <div className="relative w-full h-full bg-white items-center flex">
                <div className="relative text-neutral-700 w-full  h-full text-sm font-normal font-cabin">
                {showLocationSymbol && <img src={location_icon} className="absolute w-4 h-4 top-[15px] left-6"/>}
                    <input
                        ref={inputRef}
                        onChange={handleChange} 
                        onBlur={handleBlur}
                        className={`w-full h-full decoration:none ${showLocationSymbol? 'pr-6 pl-12' : 'px-6'} py-2 border rounded-md border ${error.set && !inputEntered? 'border-red-600' : 'border-neutral-300' }  focus-visible:outline-0 focus-visible:border-indigo-600 `}
                        value={textInput} 
                        placeholder={placeholder}>
                            
                        </input>
                </div>

                <div className="absolute text-xs text-red-600 left-0 px-6 top-[44px]">
                    {error.set && !inputEntered && error.message}
                </div>
            </div>

      </div>

    </>)
}