/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/display-name */

import { useState, useEffect, useRef, Children } from "react";
import Button from "./Button";
import Input from "./Input";
import { cancel_icon } from "../../../assets";

export default function (props){
    const modalRef = useRef(null)
    const [showModal, setShowModal] = [props.showModal, props.setShowModal]
    const { skipable,handleConfirm ,children} = props
    
   // const skipable = props.skipable || true
    console.log(skipable, showModal, 'skipable')
    
    useEffect(()=>{
        if(showModal){
            document.body.style.overflow = 'hidden'
        }
        else{
            document.body.style.overflow = 'auto'
        }
    }, [showModal])
    
    
   
    const handleOutsideClick = (e) => {
        // e.preventDefault()
        if (!modalRef.current.contains(e.target)) {
            if (skipable) {
                setShowModal(false);
            }
        }
    };
    
    return(
        <>
            {showModal && <div  className="fixed overflow-hidden flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
                <div ref={modalRef} className='z-10  sm:w-[50%] lg:w-[80%] xl:w-[50%] h-[400px] scroll-none bg-white rounded-lg shadow-md'>
        <div className="rounded-lg bg-white relative" >
                    
          <div>
          <div onClick={()=>setShowModal(false)} className=' absolute p-2 right-0   hover:bg-red-300 rounded-full'>
                      <img src={cancel_icon} className='w-8 h-8'/>
        </div>
           
          {children}
         
         
          </div>
                   
                    </div>
                    </div>
            </div>}
        </>)
}