import { useState, useRef, useEffect } from "react";
import { formatDate3 } from "../../utils/handyFunctions";
import { titleCase } from "../../utils/handyFunctions";

export default function ShowCabDates(props){
    const placeholder = props.placeholder || "selected cab dates";
    const title = props.title || "Cab Dates";
    const inputRef = useRef(null)
    const dates = props.dates || null
    console.log(dates, 'dates')
    const setDates = props.setDates || null
    const [textInput, setTextInput] = useState(dates? dates.map(d=>formatDate3(d)).join(', ') : '')


    useEffect(()=>{
        setTextInput(dates.length>0? dates.map(d=>formatDate3(d)).join(', ') : '')
        console.log(dates, 'dates changed')
    },[dates])

    
    const inputChange = (e)=>{
        e.preventDefault()

        const inputValue = e.target.value 
        const keywords = inputValue.split(',').map((keyword) => keyword.trim());
        setTextInput(inputValue)


        if(keywords.length == dates.length && formatDate3(dates[dates.length-1]) !== keywords[keywords.length-1]){
            const newDates = [...dates]
            newDates.pop()  
            setDates(newDates)
            setTextInput(dates.map(d=>formatDate3(d)).join(', '))
        }

    }

    const inputBlur = (e)=>{

    }

    const inputKeyDown = (e)=>{
        if(e.key !== 'Backspace' || e.keyCode !== 8 ){
            e.preventDefault()
            return
        }
    }



    return(<>
        <div className="min-w-[300px] w-full max-w-[403px] h-[73px] flex-col justify-start items-start gap-2 inline-flex">
            {/* title */}
            <div className="text-zinc-600 text-sm font-cabin">{title}</div>

            {/* input */}
            <div
                 
                className="relative w-full h-full bg-white items-center flex">
                
                <div className="text-neutral-700 w-full  h-full text-sm font-normal font-cabin">
                    <input
                        ref={inputRef}
                        onChange={inputChange} 
                        onKeyDown={inputKeyDown}
                        onBlur={inputBlur}
                        className=" w-full h-full decoration:none px-6 py-2 border rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 " 
                        value={textInput} 
                        placeholder={placeholder}></input>
                </div>
                
            </div>

      </div>

    </>)
}