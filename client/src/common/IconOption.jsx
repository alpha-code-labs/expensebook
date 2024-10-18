import React, { useState, useRef, useEffect } from 'react';
import { chevron_down_icon } from '../assets/icon';

const IconOption = ({ buttonText, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = (event) => {
    event.stopPropagation(); // Prevent the event from bubbling up
    setIsOpen(prevState => !prevState);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleBlur = () => {
    setIsOpen(false); 
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      window.removeEventListener('blur', handleBlur);
    } else {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('blur', handleBlur);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block">
      <div onClick={handleToggle} className="px-4 py-2 cursor-pointer inline-flex gap-2">
        {buttonText}
        <img src={chevron_down_icon} className={`w-4 h-4 mt-[6px] transition ${isOpen && 'rotate-180'}`}/>
      </div>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute mt-2 w-full h-fit bg-white rounded-md shadow-lg p-2"
          style={{ zIndex: 1000 }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default IconOption;
