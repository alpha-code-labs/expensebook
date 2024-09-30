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
  