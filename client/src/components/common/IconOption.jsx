import React, { useState, useRef, useEffect } from 'react';

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

  useEffect(() => {
    
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block">
      <div onClick={handleToggle} className="px-4 py-2">
        {buttonText}
      </div>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute mt-2 w-full h-fit bg-white border border-slate-300 rounded-md shadow-lg p-2"
          style={{ zIndex: 1000 }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default IconOption;
