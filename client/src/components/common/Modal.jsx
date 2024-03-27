import { useState, useEffect, useRef } from "react";

export default function Modal(props){

    const modalRef = useRef(null)
    const [showModal, setShowModal] = [props.showModal, props.setShowModal]
    const { children, skipable} = props

   // const skipable = props.skipable || true
    console.log(skipable, showModal, 'skipable')

    useEffect(()=>{
        if(showModal){
            document.body.style.overflow = 'hidden'
        }
        else{
            document.body.style.overflow = 'auto'
        }
    },[showModal])

    const handleOutsideClick = (e)=>{
        e.preventDefault()
        e.stopPropagation()
        if(skipable){
            setShowModal(false)
        }
    }
    // onClick={handleOutsideClick}
    return(
        <>
            {showModal && <div  className="fixed overflow-hidden flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
                <div ref={modalRef} className='z-10 max-w-[600px] w-[90%] sm:w-[80%] md:w-[60%] min-h-[200px] scroll-none bg-white rounded-lg shadow-md'>
                    {children}
                </div>
            </div>}
        </>)
}