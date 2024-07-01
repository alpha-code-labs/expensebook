/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";

export default function (props){

    const modalRef = useRef(null)
    const [showPopup, setshowPopup] = [props.showPopup, props.setshowPopup]
    const { message , skipable} = props

   // const skipable = props.skipable || true
    console.log(skipable, showPopup, 'skipable')
    
    useEffect(()=>{
        if(showPopup){
            document.body.style.overflow = 'hidden'
        }
        else{
            document.body.style.overflow = 'auto'
        }
    }, [showPopup])

    const handleOutsideClick = (e)=>{
        e.preventDefault()
        e.stopPropagation()
        if(skipable){
            setshowPopup(false)
        }
    }

    return(
        <>
            {showPopup && <div onClick={handleOutsideClick} className="z-20 fixed overflow-hidden flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
                <div ref={modalRef} className='z-10 max-w-[600px] w-[40%] min-h-[100px] scroll-none bg-white-100 rounded-lg shadow-md'>
                    <div className="p-10 text-lg text-neutral-800 ca capitalize">
                        {message}
                    </div>
                </div>
            </div>}
        </>)
}

// import { useState, useEffect, useRef } from "react";

// export default function (props){

//     const modalRef = useRef(null)
//     const [showPopup, setshowPopup] = [props.showPopup, props.setshowPopup]
//     const { message, skipable} = props

//    // const skipable = props.skipable || true
//     console.log(skipable, showPopup, 'skipable')
    
//     useEffect(()=>{
//         if(showPopup){
//             document.body.style.overflow = 'hidden'
//         }
//         else{
//             document.body.style.overflow = 'auto'
//         }
//     }, [showPopup])

//     const handleOutsideClick = (e)=>{
//         e.preventDefault()
//         e.stopPropagation()
//         if(skipable){
//             setshowPopup(false)
//         }
//     }

//     return(
//         <>
//             {showPopup && <div onClick={handleOutsideClick} className="fixed overflow-hidden flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
//                 <div ref={modalRef} className='z-10 max-w-[600px] w-[40%] min-h-[100px] scroll-none bg-white-100 rounded-lg shadow-md'>
//                     <div className="p-10 text-lg text-neutral-800 ">
//                         {message}
//                     </div>
//                 </div>
//             </div>}
//         </>)
// }