import { useState } from "react";
import Input from "../components/common/Input"
import TimePicker from "../components/common/TimePicker"

export default function Playgroung(){
    const [date, setDate] = useState('2023-08-26');

    return(<div className="p-4">
        <Input
            title="Input field" 
            value={null} 
            highlightIfNull= {true}
            onChange={(e)=>console.log("value changed...")} />

        <TimePicker highlightIfNull = {true} time = {null}/>

        <input 
            type='date' 
            className= {`w-full h-full decoration:none px-6 py-2 border rounded-md border ${date!=null ? 'border-neutral-300' : 'border-red-300'} focus-visible:outline-0 focus-visible:border-indigo-600 `}
            name={"Date"} 
            value={date}
            onChange={(e)=>setDate(e.target.value)}
            />
                
    </div>)
}