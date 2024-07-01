import React, { useRef, useState, useEffect } from 'react';

const Modal = ({ isOpen, onClose, content,  onCancel  ,handleOpenOverlay  }) => {
  
  const modalRef = useRef();

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };





  return (
    <div className={`fixed inset-0 flex items-start  justify-center ${isOpen ? 'visible' : 'hidden'}`} onClick={handleClickOutside} aria-hidden="true">
      <div className="absolute inset-0 bg-gray-500 opacity-75 z-10"></div>
      <div
        ref={modalRef}
        className={`relative bg-white-100  rounded-lg text-left overflow-hidden  transform transition-all  z-20 shadow-[0px_12px_3px_rgba(0,_0,_0,_0),_0px_8px_3px_rgba(0,_0,_0,_0.01),_0px_4px_3px_rgba(0,_0,_0,_0.03),_0px_2px_2px_rgba(0,_0,_0,_0.05),_0px_0px_1px_rgba(0,_0,_0,_0.06)]` }
      >
       
          <div className="flex justify-center items-center text-center font-inter">
            {content   }
          </div>


          {/* <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              onClick={handleConfirm}
            >
              Confirm
            </button>

            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              onClick={() => {
                onCancel();
                onClose();
              }}
            >
              Cancel
            </button>
          </div> */}
       
      </div>
    </div>
  );
};

export default Modal;
  