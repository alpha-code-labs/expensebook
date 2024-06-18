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
      <div onClick={handleToggle}>
        {buttonText}
      </div>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-auto  h-fit bg-white-100 border border-neutral-400 rounded-md shadow-lg p-2"
          style={{ zIndex: 1000 }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default IconOption;
