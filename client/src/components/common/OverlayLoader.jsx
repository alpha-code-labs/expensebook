
export default function OverlayLoader(){

}

import { useState, useEffect, useRef } from "react";

export default function ({showOverlayLoader, setShowOverlayLoader, error, message, isLoading}){

    const modalRef = useRef(null)
    const [showOverlayLoader, setShowOverlayLoader] = [props.showOverlayLoader, props.setShowOverlayLoader]
    const { children, skipable} = props
    const error = props.error??false
    const message = props.message

   // const skipable = props.skipable || true
    console.log(skipable, showOverlayLoader, 'skipable')

    useEffect(()=>{
        if(showOverlayLoader){
            document.body.style.overflow = 'hidden'
        }
        else{
            document.body.style.overflow = 'auto'
        }
    },[showOverlayLoader])

    const handleOutsideClick = (e)=>{
        e.preventDefault()
        e.stopPropagation()
        if(skipable){
            setShowOverlayLoader(false)
        }
    }

    return(
        <>
            {showOverlayLoader && <div onClick={handleOutsideClick} className="fixed overflow-hidden flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
                <div ref={modalRef} className='z-10 max-w-[600px] w-[90%] sm:w-[80%] md:w-[60%] min-h-[200px] scroll-none bg-white rounded-lg shadow-md'>
                    {children}
                </div>
            </div>}
        </>)
}