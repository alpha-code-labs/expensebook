import React, { useRef, useEffect } from 'react';

const Modal = ({ isOpen, onClose, content }) => {
  const modalRef = useRef();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
  }, [isOpen]);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-start z-20 justify-center ${isOpen ? 'visible' : 'hidden'}`}
      onClick={handleClickOutside}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gray-500 opacity-75 z-10"></div>
      <div
        ref={modalRef}
        className="relative border bg-white h-auto rounded-b-lg text-left overflow-visible transform transition-all z-20 shadow-lg md:w-[60%] w-full xl:w-auto"
      >
        <div className="flex max-h-screen  justify-center items-start text-center font-inter w-full">
          {content}
        </div>
      </div>
    </div>
  );
};

export default Modal;
// /* eslint-disable react-refresh/only-export-components */
// /* eslint-disable react/display-name */

// import { useState, useEffect, useRef } from "react";
// import Button from "./Button";

// export default function (props){
//     const modalRef = useRef(null)
//     const [showModal, setShowModal] = [props.showModal, props.setShowModal]
//     const { content , skipable,handleConfirm} = props

//    // const skipable = props.skipable || true
//     console.log(skipable, showModal, 'skipable')
    
//     useEffect(()=>{
//         if(showModal){
//             document.body.style.overflow = 'hidden'
//         }
//         else{
//             document.body.style.overflow = 'auto'
//         }
//     }, [showModal])

//     const handleOutsideClick = (e)=>{
//         e.preventDefault()
//         e.stopPropagation()
//         if(skipable){
//             setShowModal(false)
//         }
//     }

//     return(
//         <>
//             {showModal && <div onClick={handleOutsideClick} className="fixed overflow-hidden flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
//                 <div ref={modalRef} className='z-10 max-w-[600px] w-[40%] min-h-[100px] scroll-none bg-white rounded-lg shadow-md'>

//                     <div className="rounded-lg">
//                     <div className='h-[48px] rounded-t-lg   bg-purple-100 px-5 flex justify-start items-center'>
//             <h1 className='text-start text-inter text-lg font-semibold text-purple-500'>Delete</h1>
//           </div>
//                     <div className="p-10 flex justify-center items-center flex-col">
//                         <div className="text-xl text-center font-cabin text-neutral-600 ">{content}</div>
//                         <div className="flex md:flex-row flex-col mt-10 justify-between items-center sm:gap-12 gap-4  w-full flex-grow">
//                             <div className=" md:w-fit w-full">
//                             <Button variant='full'  text='Cancel'  onClick={()=>setShowModal(false)}/>
//                             </div>
//                             <div className=" md:w-fit w-full">
//                             <Button variant='full' text='Confirm' onClick={()=>{handleConfirm() }} />
//                             </div>
                           
//                         </div>
//                     </div>
//                     </div>
//                     </div>
                    
              
//             </div>}
//         </>)
// }

