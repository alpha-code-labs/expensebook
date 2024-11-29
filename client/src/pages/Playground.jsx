import { useState } from "react";
import Input from "../components/common/Input"
import TimePicker from "../components/common/TimePicker"
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";

export default function Playgroung(){
    const [date, setDate] = useState('2023-08-26');
    const [scanCompleteModal, setScanCompleteModal] = useState(true);

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
                
<br></br>
        <div>
        <Modal showModal={scanCompleteModal} setShowModal={setScanCompleteModal} >
            <div className="px-6 py-4">
                <p className="font-cabin text-zinc-500 text-xl">Review Scanned Details</p>
                <div className="mt-6 mb-6 text-normal text-neutral-800 font-cabin">
                    <p>We’ve scanned the bill and extracted its details. Please review the following information carefully before submission:</p>
                    <p className="mt-4">Verify that all the extracted values are accurate.</p>
                    <p>Enter any missing values or correct errors if necessary.</p>
                    <p className="mt-4">This step ensures that the information submitted is accurate. Once you’re satisfied with the details, click Submit to proceed.</p>
    
                </div>
                <Button text='OK' onClick={()=>setScanCompleteModal(false)}/>
            </div>
            </Modal>
        </div>
    </div>)
}