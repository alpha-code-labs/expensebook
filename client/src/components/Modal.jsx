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

// import React, { useRef, useState, useEffect } from 'react';

// const Modal = ({ isOpen, onClose, content, handleConfirm }) => {
  
//   const modalRef = useRef();
//   const handleClickOutside = (event) => {
//     if (modalRef.current && !modalRef.current.contains(event.target)) {
//       onClose();
//     }
//   };




//   return (
//     <div className={`fixed inset-0 flex items-center  justify-center ${isOpen ? 'visible' : 'hidden'}`} onClick={handleClickOutside} aria-hidden="true">
//       <div className="absolute inset-0 bg-gray-500/30   opacity-75 z-20"></div>
//       <div
//         ref={modalRef}
//         className={`relative bg-white-100 rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-md z-20`}
//       >
//         <div className="bg-white-100-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//           <div className="flex justify-center items-center text-center font-inter">
//             {content}
//           </div>
//         </div>
       
//           <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
//             <button
//               type="button"
//               className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
//               onClick={handleConfirm}
//             >
//               Confirm
//             </button>

//             <button
//               type="button"
//               className="mt-3 inline-flex w-full justify-center rounded-md bg-white-100 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
//               onClick={() => {
//                 onClose();
//               }}
//             >
//               Cancel
//             </button>
//           </div>
       
//       </div>
//     </div>
//   );
// };

// export default Modal;