import React, { useRef, useState, useEffect } from 'react';

const Modal = ({ isOpen, onClose, content,  onCancel ,itineraryId }) => {
  
  const modalRef = useRef();
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  const handleConfirm = () => {
    console.log('Confirmed - ItineraryId:', itineraryId);

    // Perform API call or other backend operations with itineraryId
    // ...

    onClose();
  };
  // const handleConfirm = () => {
  //   onConfirm();
  
  //   // Automatically hide the "Request Sent" message after 5 seconds
    
  //     onClose();
  // };

  // Close the modal and clear the "Request Sent" message when isOpen changes


  return (
    <div className={`fixed inset-0 flex items-center justify-center ${isOpen ? 'visible' : 'hidden'}`} onClick={handleClickOutside} aria-hidden="true">
      <div className="absolute inset-0 bg-gray-500 opacity-75 z-10"></div>
      <div
        ref={modalRef}
        className={`relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-md z-20`}
      >
        <div className="bg-white-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ">
          <div className="flex justify-center items-center text-center font-inter">
           
            {  content}
           
          </div>
        </div>
       
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
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
          </div>
       
      </div>
    </div>
  );
};

export default Modal;

