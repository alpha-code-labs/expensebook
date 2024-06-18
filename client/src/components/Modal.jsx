/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useRef, useState, useEffect } from 'react';



const Modal = ({ isOpen, onClose, content, handleConfirm }) => {
    const modalRef = useRef();
    
    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          onClose();
        }
      };
  return (
    <>
    <div onClick={handleClickOutside} aria-hidden="true" className={`${isOpen ? 'visible' : 'hidden'} min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover`}  >
   	<div className="absolute backdrop-blur-sm inset-0 z-0"></div>
    <div className="w-full  max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-white ">
   
      <div className="">
    
        <div className="text-center p-5 flex-auto justify-center">
               
                        <h2 className="text-xl font-bold py-4 ">Are you sure?</h2>
                        <p className="text-sm text-gray-500 px-8">Do you really want to delete your account?
                This process cannot be undone</p>    
        </div>
      
        <div className="p-3  mt-2 text-center space-x-4 md:block">
            <button onClick={() => {onClose();}} className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100">
                Cancel
            </button>
            <button className="mb-2 md:mb-0 bg-red-500 border border-red-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-600">Delete</button>
        </div>
      </div>
    </div>
  </div>
  </>
  )
}

export default Modal

