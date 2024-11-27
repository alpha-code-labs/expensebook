
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */

import { useState, useEffect, useRef } from "react";
import {   cancel_black_icon, failure_icon, msg_icon, success_icon } from "../../assets/icon";
import { motion, AnimatePresence } from 'framer-motion';

export default function (props){

  //icon code = 101 - success | 102 - failure | 103 - warning | 104 - message
    
    const modalRef = useRef(null)
    const [showPopup, setshowPopup] = [props.showPopup, props.setShowPopup]
    const { message , skipable} = props
    const initialPopupData  = props.initialPopupData
    const iconCode  = props.iconCode

   // const skipable = props.skipable || true
    console.log(skipable, showPopup, 'skipable')
    
    useEffect(()=>{
        if(showPopup){
            document.body.style.overflow = 'hidden'
        }
        else{
            document.body.style.overflow = 'visible'
        }
    }, [showPopup])

    
  

    const handleOutsideClick = (e)=>{
        e.preventDefault()
        e.stopPropagation()
        if(skipable){
            setshowPopup(initialPopupData)
        }
    }

    function alertIcon(sign) {
        switch(sign) {
          case '101':
            return (
              <div className='p-1 ring-1 ring-white rounded-full shrink-0 bg-green-600'>
                <img src={success_icon} className='w-3 h-3 ' alt="Urgent Icon" />
              </div>
            );
          case '102':
            return (
              <div className='p-1 ring-1 ring-white rounded-full shrink-0 bg-red-600 rotate-180 w-fit h-fit'>
                <img src={failure_icon} className='w-3 h-3 ' alt="Urgent Icon" />
              </div>
            );
          case '103':
            return (
              <div className='p-1 ring-1 ring-white rounded-full shrink-0 bg-yellow-200 '>
              <img src={msg_icon} className='w-3 h-3 ' alt="Urgent Icon" />
            </div>
            );
          case '104':
            return (
              <div className='p-1 ring-1 ring-white rounded-full shrink-0 bg-neutral-900 '>
              <img src={msg_icon} className='w-3 h-3 ' alt="Urgent Icon" />
            </div>
            );
          default:
            return null; // Handle unexpected values
        }
      }

      const backdropVariants = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
      };
    
      const modalVariants = {
        hidden: { opacity: 0, y: '-100%' },
        visible: { opacity: 1, y: '0' },
      };

    return(
         <AnimatePresence>
            {showPopup && <motion.div
             onClick={handleOutsideClick} 
             initial="hidden"
             animate="visible"
             exit="hidden"
             variants={backdropVariants}
             transition={{ duration: 0.3 }}
             aria-hidden="true"
             className="  z-[9999] pointer-events-auto fixed overflow-hidden flex justify-center items-start  inset-0  w-full h-full left-0 top-0  scroll-none">
                <motion.div 
                ref={modalRef} 
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={modalVariants}
                transition={{ type: 'spring', stiffness: 100, damping: 20, duration: 0.5 }}
                className=' flex flex-row  justify-between items-center  z-10 truncate  max-w-[50%] h-[50px] scroll-none mt-6 bg-white rounded-md shadow-black/20   shadow-md border  border-slate-300'>
                    
                    <div className=" p-2 h-full gap-x-2  w-full flex items-center flex-row justify-start">
                       {alertIcon(iconCode)}
                        <div className="text-xs text-center text-neutral-800 font-inter  truncate">
                            {message}
                          
                        </div>
                        <div onClick={()=>setshowPopup(initialPopupData)} className=" p-2 shrink-0 cursor-pointer">
                    <img  src={cancel_black_icon}  className="w-4 h-4 shrink-0"/>
                    </div>
                    </div>
                    
                    
                </motion.div>
            </motion.div>}
            </AnimatePresence>)
}



// /* eslint-disable react-refresh/only-export-components */
// /* eslint-disable react/display-name */
// /* eslint-disable react/prop-types */

// import { useState, useEffect, useRef } from "react";

// export default function (props){
    
//     const modalRef = useRef(null)
//     const [showPopup, setshowPopup] = [props.showPopup, props.setshowPopup]
//     const { message , skipable} = props

//    // const skipable = props.skipable || true
//     console.log(skipable, showPopup, 'skipable')
    
//     useEffect(()=>{
//         if(showPopup){
//             document.body.style.overflow = 'hidden'
//         }
//         else{
//             document.body.style.overflow = 'visible'
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
//             {showPopup && <div onClick={handleOutsideClick} className="z-20 fixed overflow-hidden flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
//                 <div ref={modalRef} className='z-10 max-w-[600px] w-[40%] min-h-[100px] scroll-none bg-white rounded-lg shadow-md border-x-4 ring-1 ring-white border-indigo-600'>
//                     <div className="p-10 text-lg text-neutral-800 ca capitalize">
//                         {message}
//                     </div>
//                 </div>
//             </div>}
//         </>)
// }

