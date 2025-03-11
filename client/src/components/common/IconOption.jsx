import React, { useState, useRef, useEffect } from 'react';

const IconOption = ({ buttonText, children ,disable=false}) => {
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
      window.addEventListener('blur', handleBlur);
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
      <div onClick={disable ? ()=>'notification disabled':handleToggle}>
        {buttonText}
      </div>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-8 mt-2 w-auto  h-fit bg-white border-none border-slate-300 rounded-md shadow-lg p-2"
          style={{ zIndex: 1000 }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default IconOption;
